from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db import transaction
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
import logging

from .models import ChildProfile, Sponsorship, InterventionLog
from .serializers import (
    ChildProfileSerializer, ChildProfileListSerializer,
    SponsorshipSerializer, InterventionLogSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from config.permissions import IsOrgStaff, IsSponsor, IsAdmin, IsActiveUser, IsAdminOrProjectManager, IsProjectManager
from config.exceptions import (
    PermissionException, ValidationException, ConflictException,
    ResourceNotFoundException
)
from config.audit import AuditLogger

logger = logging.getLogger(__name__)


def _notify_direct(child, notification_type, title, message, recipient):
    """Create a ChildNotification directly without triggering signals."""
    try:
        from .models_extended import ChildNotification
        ChildNotification.objects.create(
            child=child,
            notification_type=notification_type,
            title=title,
            message=message,
            recipient=recipient,
        )
    except Exception as e:
        logger.error(f"_notify_direct failed: {e}", exc_info=True)


class ChildListAPIView(generics.ListAPIView):
    """Browse published child profiles (public)"""
    queryset = ChildProfile.objects.filter(status='PUBLISHED').select_related('organization')
    serializer_class = ChildProfileListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['gender', 'location']
    search_fields = ['full_name', 'location', 'vulnerability_status']
    ordering_fields = ['created_at', 'full_name', 'age']


class ChildListAllAPIView(generics.ListAPIView):
    """Authenticated users (ADMIN, ORG_STAFF, SCHOOL, GOVERNMENT): list all children"""
    serializer_class = ChildProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['gender', 'location', 'status']
    search_fields = ['full_name', 'location', 'vulnerability_status']
    ordering_fields = ['created_at', 'full_name', 'age']

    def get_queryset(self):
        user = self.request.user
        qs = ChildProfile.objects.all().select_related('organization')
        # ORG_STAFF only sees their own children
        if user.role == 'ORG_STAFF':
            qs = qs.filter(organization=user)
        return qs


class ChildRegisterAPIView(generics.CreateAPIView):
    """ORG_STAFF: Submit a new child profile for review"""
    queryset = ChildProfile.objects.all()
    serializer_class = ChildProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsOrgStaff]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        child = serializer.save(organization=self.request.user, status='PENDING')
        AuditLogger.log_action(
            self.request.user, 'REGISTER_CHILD', 'ChildProfile', str(child.id),
            f'Child {child.full_name} registered'
        )


class ChildDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a child profile"""
    queryset = ChildProfile.objects.all()
    serializer_class = ChildProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsAdmin()]
        return super().get_permissions()

    def perform_update(self, serializer):
        child = serializer.save()
        AuditLogger.log_action(
            self.request.user, 'UPDATE_CHILD', 'ChildProfile', str(child.id)
        )


class SponsorChildAPIView(APIView):
    """SPONSOR: Submit a sponsorship request with payment proof"""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsSponsor]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, child_id):
        try:
            child = get_object_or_404(ChildProfile, id=child_id, status='PUBLISHED')

            # Safe check for existing sponsorship (OneToOneField raises exception if missing)
            try:
                existing = child.sponsorship
                if existing is not None:
                    if existing.verification_status == 'REJECTED':
                        # Delete the rejected sponsorship so a new sponsor can apply
                        existing.delete()
                    else:
                        raise ConflictException('This child already has a pending or active sponsorship')
            except Sponsorship.DoesNotExist:
                pass

            # Require proof of payment
            if not request.FILES.get('payment_proof'):
                return Response(
                    {'error': {'code': 'MISSING_PROOF', 'message': 'Proof of payment is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not request.data.get('commitment_amount'):
                return Response(
                    {'error': {'code': 'MISSING_AMOUNT', 'message': 'Commitment amount is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not request.data.get('payment_provider'):
                return Response(
                    {'error': {'code': 'MISSING_PROVIDER', 'message': 'Payment provider is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                sponsorship = Sponsorship.objects.create(
                    sponsor=request.user,
                    child=child,
                    commitment_amount=request.data.get('commitment_amount'),
                    payment_provider=request.data.get('payment_provider'),
                    payment_proof=request.FILES.get('payment_proof'),
                    is_active=False,
                    verification_status='PENDING',
                )
                AuditLogger.log_action(
                    request.user, 'SPONSOR_REQUEST', 'Sponsorship', str(sponsorship.id),
                    f'Sponsorship request for {child.full_name} — pending verification'
                )

            return Response({
                "message": "Your sponsorship request has been submitted successfully. An administrator will review your payment and activate the sponsorship.",
                "data": SponsorshipSerializer(sponsorship, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)

        except ConflictException as e:
            return Response({'error': {'code': e.code, 'message': e.message}}, status=e.status_code)
        except (ValidationException, PermissionException) as e:
            return Response({'error': {'code': e.code, 'message': e.message}}, status=e.status_code)
        except Exception as e:
            logger.error(f"Sponsorship error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'SPONSORSHIP_ERROR', 'message': f'Failed to submit sponsorship request: {str(e)}'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MySponsorshipsAPIView(generics.ListAPIView):
    """SPONSOR: Track own sponsorship history"""
    serializer_class = SponsorshipSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsSponsor]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Sponsorship.objects.none()
        return Sponsorship.objects.filter(
            sponsor=self.request.user
        ).select_related('child', 'sponsor')


class PendingSponsorshipsAPIView(generics.ListAPIView):
    """ADMIN / PROJECT_MANAGER: List all sponsorships with optional status filter"""
    serializer_class = SponsorshipSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdminOrProjectManager]

    def get_queryset(self):
        from django.db.models import Q
        status_filter = self.request.query_params.get('status')
        qs = Sponsorship.objects.all().select_related('child', 'sponsor')
        if status_filter:
            if status_filter == 'PENDING':
                qs = qs.filter(Q(verification_status='PENDING') | Q(verification_status__isnull=True))
            else:
                qs = qs.filter(verification_status=status_filter)
        return qs.order_by('-created_at')


class VerifySponsorshipAPIView(APIView):
    """ADMIN: Verify or reject a sponsorship payment"""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdmin]

    def post(self, request, sponsorship_id):
        try:
            sponsorship = get_object_or_404(Sponsorship, id=sponsorship_id)
            action_type = request.data.get('action')  # 'verify' or 'reject'
            notes = request.data.get('notes', '')

            if action_type not in ('verify', 'reject'):
                return Response(
                    {'error': {'code': 'INVALID_ACTION', 'message': 'action must be "verify" or "reject"'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            from django.utils import timezone
            with transaction.atomic():
                sponsorship.verified_by = request.user
                sponsorship.verified_at = timezone.now()
                sponsorship.verification_notes = notes

                if action_type == 'verify':
                    sponsorship.verification_status = 'VERIFIED'
                    sponsorship.is_active = True
                    child = sponsorship.child
                    child.status = 'SPONSORED'
                    child.save()
                    AuditLogger.log_action(
                        request.user, 'VERIFY_SPONSORSHIP', 'Sponsorship', str(sponsorship.id),
                        f'Verified sponsorship for {child.full_name}'
                    )
                    # Notify the sponsor
                    try:
                        from childprofile.models_extended import ChildNotification
                        ChildNotification.objects.create(
                            child=child,
                            notification_type='SPONSORED',
                            title='Sponsorship Approved',
                            message=f'Your sponsorship for {child.full_name} has been verified and is now active.',
                            recipient=sponsorship.sponsor,
                        )
                    except Exception:
                        pass
                    msg = f'Sponsorship verified. {child.full_name} is now marked as sponsored.'
                else:
                    sponsorship.verification_status = 'REJECTED'
                    sponsorship.is_active = False
                    # Reset child back to PUBLISHED so other sponsors can apply
                    child = sponsorship.child
                    child.status = 'PUBLISHED'
                    child.save()
                    AuditLogger.log_action(
                        request.user, 'REJECT_SPONSORSHIP', 'Sponsorship', str(sponsorship.id),
                        f'Rejected sponsorship — {notes}'
                    )
                    # Notify the sponsor they can resubmit
                    try:
                        from childprofile.models_extended import ChildNotification
                        ChildNotification.objects.create(
                            child=sponsorship.child,
                            notification_type='SPONSORED',
                            title='Sponsorship Request Rejected',
                            message=f'Your sponsorship request for {sponsorship.child.full_name} was rejected. Reason: {notes or "No reason provided"}. You can edit and resubmit your request.',
                            recipient=sponsorship.sponsor,
                        )
                    except Exception:
                        pass
                    msg = 'Sponsorship rejected. Child is now available for other sponsors. Sponsor has been notified and can resubmit.'

                sponsorship.save()

            return Response({
                'message': msg,
                'data': SponsorshipSerializer(sponsorship, context={'request': request}).data,
            })

        except Exception as e:
            logger.error(f"Verify sponsorship error: {str(e)}")
            return Response(
                {'error': {'code': 'VERIFY_ERROR', 'message': 'Failed to process verification'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResubmitSponsorshipAPIView(APIView):
    """SPONSOR: Edit and resubmit a rejected sponsorship request"""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsSponsor]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, sponsorship_id):
        try:
            sponsorship = get_object_or_404(
                Sponsorship,
                id=sponsorship_id,
                sponsor=request.user,
                verification_status='REJECTED',
            )

            if not request.FILES.get('payment_proof'):
                return Response(
                    {'error': {'code': 'MISSING_PROOF', 'message': 'Proof of payment is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not request.data.get('commitment_amount'):
                return Response(
                    {'error': {'code': 'MISSING_AMOUNT', 'message': 'Commitment amount is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not request.data.get('payment_provider'):
                return Response(
                    {'error': {'code': 'MISSING_PROVIDER', 'message': 'Payment provider is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update the existing sponsorship record and reset to PENDING
            sponsorship.commitment_amount = request.data.get('commitment_amount')
            sponsorship.payment_provider = request.data.get('payment_provider')
            sponsorship.payment_proof = request.FILES.get('payment_proof')
            sponsorship.verification_status = 'PENDING'
            sponsorship.is_active = False
            sponsorship.verified_by = None
            sponsorship.verified_at = None
            sponsorship.verification_notes = ''
            sponsorship.save()

            AuditLogger.log_action(
                request.user, 'RESUBMIT_SPONSORSHIP', 'Sponsorship', str(sponsorship.id),
                f'Resubmitted sponsorship for {sponsorship.child.full_name}'
            )

            return Response({
                'message': 'Sponsorship request resubmitted successfully. An administrator will review your updated payment.',
                'data': SponsorshipSerializer(sponsorship, context={'request': request}).data,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Resubmit sponsorship error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'RESUBMIT_ERROR', 'message': f'Failed to resubmit: {str(e)}'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllSponsorshipsAPIView(generics.ListAPIView):
    """ADMIN / GOVERNMENT: List all sponsorships across the system"""
    serializer_class = SponsorshipSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdmin]

    def get_permissions(self):
        # Allow ADMIN or GOVERNMENT
        from rest_framework.permissions import IsAuthenticated
        from config.permissions import IsActiveUser
        user = self.request.user
        if getattr(user, 'role', None) in ('ADMIN', 'GOVERNMENT'):
            return [IsAuthenticated(), IsActiveUser()]
        return [IsAuthenticated(), IsActiveUser(), IsAdmin()]

    def get_queryset(self):
        return Sponsorship.objects.all().select_related('child', 'sponsor')


@extend_schema(
    parameters=[
        OpenApiParameter(
            name='id', type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            description='MongoDB ObjectId',
        )
    ]
)
class InterventionLogViewSet(viewsets.ModelViewSet):
    """ORG_STAFF / SCHOOL: Manage & update intervention logs — scoped to own org's children"""
    queryset = InterventionLog.objects.all().select_related('child', 'recorded_by')
    serializer_class = InterventionLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ['child', 'type']
    search_fields = ['description', 'child__full_name']
    ordering_fields = ['date_provided', 'created_at']
    lookup_value_regex = '[^/]+'

    def get_queryset(self):
        user = self.request.user
        qs = InterventionLog.objects.all().select_related('child', 'recorded_by')
        role = getattr(user, 'role', None)
        # ORG_STAFF: only interventions for children they registered
        if role == 'ORG_STAFF':
            qs = qs.filter(child__organization=user)
        # SCHOOL: only interventions they recorded
        elif role == 'SCHOOL':
            qs = qs.filter(recorded_by=user)
        # ADMIN, PROJECT_MANAGER, GOVERNMENT: see all
        return qs

    def perform_create(self, serializer):
        intervention = serializer.save(recorded_by=self.request.user)
        AuditLogger.log_action(
            self.request.user, 'CREATE_INTERVENTION', 'InterventionLog', str(intervention.id)
        )

    def perform_update(self, serializer):
        intervention = serializer.save()
        AuditLogger.log_action(
            self.request.user, 'UPDATE_INTERVENTION', 'InterventionLog', str(intervention.id)
        )


class RejectChildAPIView(APIView):
    """ADMIN ONLY: Reject a child profile with a mandatory reason. Notifies org staff."""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdmin]

    def post(self, request, pk):
        try:
            child = get_object_or_404(ChildProfile, id=pk)
            if child.status not in ('PENDING',):
                return Response(
                    {'error': {'code': 'INVALID_STATUS', 'message': 'Only PENDING profiles can be rejected'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            reason = request.data.get('reason', '').strip()
            if not reason:
                return Response(
                    {'error': {'code': 'REASON_REQUIRED', 'message': 'A rejection reason is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            child._previous_status = child.status
            child.status = 'REJECTED'
            child.rejection_reason = reason
            child.save()
            AuditLogger.log_action(
                request.user, 'REJECT_CHILD', 'ChildProfile', str(child.id),
                f'Admin rejected: {reason}'
            )
            return Response({'message': f'{child.full_name} has been rejected. Org staff has been notified.'})
        except Exception as e:
            logger.error(f"Reject child error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'REJECT_ERROR', 'message': 'Failed to reject child profile'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResubmitChildAPIView(APIView):
    """ORG_STAFF: Edit and resubmit a rejected child profile"""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsOrgStaff]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            child = get_object_or_404(ChildProfile, id=pk, organization=request.user)
            if child.status != 'REJECTED':
                return Response(
                    {'error': {'code': 'INVALID_STATUS', 'message': 'Only REJECTED profiles can be resubmitted'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            updatable = ['full_name', 'age', 'gender', 'location', 'biography', 'vulnerability_status', 'guardian_info']
            for field in updatable:
                if field in request.data:
                    setattr(child, field, request.data[field])
            if 'photo' in request.FILES:
                child.photo = request.FILES['photo']
            if 'supporting_docs' in request.FILES:
                child.supporting_docs = request.FILES['supporting_docs']
            child._previous_status = child.status
            child.status = 'PENDING'
            child.rejection_reason = ''
            child.pm_notes = ''
            child.save()
            AuditLogger.log_action(
                request.user, 'RESUBMIT_CHILD', 'ChildProfile', str(child.id),
                f'Resubmitted child profile: {child.full_name}'
            )
            from django.contrib.auth import get_user_model
            User = get_user_model()
            notif_message = (
                f'{request.user.name} resubmitted the profile for {child.full_name} after correction. Please review.'
            )
            for reviewer in User.objects.filter(role__in=['ADMIN', 'PROJECT_MANAGER'], status='ACTIVE'):
                _notify_direct(child, 'STATUS_UPDATED', 'Child Profile Resubmitted', notif_message, reviewer)
            return Response({
                'message': f'{child.full_name} has been resubmitted for review.',
                'data': ChildProfileSerializer(child, context={'request': request}).data,
            })
        except Exception as e:
            logger.error(f"Resubmit child error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'RESUBMIT_ERROR', 'message': 'Failed to resubmit child profile'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PMPublishChildAPIView(APIView):
    """ADMIN ONLY: Publish (approve) a pending child profile. Reads PM notes before deciding."""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdmin]

    def post(self, request, pk):
        try:
            child = get_object_or_404(ChildProfile, id=pk)
            if child.status != 'PENDING':
                return Response(
                    {'error': {'code': 'INVALID_STATUS', 'message': 'Only PENDING profiles can be published'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            child._previous_status = child.status
            child.status = 'PUBLISHED'
            child.save()
            AuditLogger.log_action(
                request.user, 'PUBLISH_CHILD', 'ChildProfile', str(child.id),
                f'Admin published child profile: {child.full_name}'
            )
            return Response({
                'message': f'{child.full_name} has been published.',
                'data': ChildProfileSerializer(child, context={'request': request}).data,
            })
        except Exception as e:
            logger.error(f"Admin publish error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'PUBLISH_ERROR', 'message': 'Failed to publish child profile'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PMFlagChildAPIView(APIView):
    """PROJECT_MANAGER: Add review notes on a child profile. Notifies admin. Does NOT approve/reject."""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsProjectManager]

    def post(self, request, pk):
        try:
            child = get_object_or_404(ChildProfile, id=pk)
            notes = request.data.get('notes', '').strip()
            if not notes:
                return Response(
                    {'error': {'code': 'NOTES_REQUIRED', 'message': 'Review notes are required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            child.pm_notes = notes
            child.save(update_fields=['pm_notes'])
            AuditLogger.log_action(
                request.user, 'PM_FLAG_CHILD', 'ChildProfile', str(child.id),
                f'PM notes: {notes[:80]}'
            )
            from django.contrib.auth import get_user_model
            User = get_user_model()
            for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
                _notify_direct(
                    child, 'STATUS_UPDATED',
                    'PM Flagged Child Profile for Review',
                    f'PM {request.user.name} flagged "{child.full_name}": {notes}',
                    admin,
                )
            return Response({
                'message': 'Notes saved. Admin has been notified to review.',
                'data': ChildProfileSerializer(child, context={'request': request}).data,
            })
        except Exception as e:
            logger.error(f"PM flag error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'FLAG_ERROR', 'message': 'Failed to save PM notes'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PMReviewSponsorshipAPIView(APIView):
    """
    PROJECT_MANAGER: Review a sponsorship payment proof, add decision note (VALID/INVALID),
    and notify Admin for final verification decision.
    """
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsProjectManager]

    def post(self, request, sponsorship_id):
        try:
            sponsorship = get_object_or_404(Sponsorship, id=sponsorship_id)
            decision = request.data.get('decision', '').strip()  # 'VALID' or 'INVALID'
            notes = request.data.get('notes', '').strip()

            if decision not in ('VALID', 'INVALID'):
                return Response(
                    {'error': {'code': 'INVALID_DECISION', 'message': 'decision must be "VALID" or "INVALID"'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not notes:
                return Response(
                    {'error': {'code': 'NOTES_REQUIRED', 'message': 'Review notes are required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Store PM review note in verification_notes with prefix
            pm_note_text = f'[PM Review — {decision}] {notes}'
            sponsorship.verification_notes = pm_note_text
            sponsorship.save(update_fields=['verification_notes'])

            AuditLogger.log_action(
                request.user, 'PM_REVIEW_SPONSORSHIP', 'Sponsorship', str(sponsorship.id),
                f'PM decision: {decision} — {notes[:80]}'
            )

            # Notify all admins
            from django.contrib.auth import get_user_model
            User = get_user_model()
            child = sponsorship.child
            sponsor = sponsorship.sponsor

            for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
                _notify_direct(
                    child,
                    'SPONSORED',
                    f'PM Review: Sponsorship — {decision}',
                    (
                        f'PM {request.user.name} reviewed the sponsorship payment proof from '
                        f'{sponsor.name} for {child.full_name} '
                        f'(ETB {sponsorship.commitment_amount}/month via {sponsorship.payment_provider}) '
                        f'and marked it as {decision}.\n\n'
                        f'PM Notes: {notes}\n\n'
                        f'Please make the final verification decision.'
                    ),
                    admin,
                )

            return Response({
                'message': f'Review submitted. Admin has been notified with your {decision} decision.',
                'data': SponsorshipSerializer(sponsorship, context={'request': request}).data,
            })

        except Exception as e:
            logger.error(f"PM review sponsorship error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'PM_REVIEW_ERROR', 'message': 'Failed to submit PM review'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ReturnForCorrectionAPIView(APIView):
    """ADMIN ONLY: Return a child profile to org staff for correction"""
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdmin]

    def post(self, request, pk):
        try:
            child = get_object_or_404(ChildProfile, id=pk)
            reason = request.data.get('reason', '').strip()
            if not reason:
                return Response(
                    {'error': {'code': 'REASON_REQUIRED', 'message': 'A reason for correction is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            child._previous_status = child.status
            child.status = 'PENDING'
            child.save()
            AuditLogger.log_action(
                request.user, 'RETURN_FOR_CORRECTION', 'ChildProfile', str(child.id),
                f'Returned for correction: {reason}'
            )
            _notify_direct(
                child, 'PROFILE_REJECTED', 'Profile Returned for Correction',
                f'The profile for {child.full_name} requires correction. Reason: {reason}',
                child.organization,
            )
            return Response({'message': 'Profile returned for correction. Org staff has been notified.'})
        except Exception as e:
            logger.error(f"Return for correction error: {str(e)}", exc_info=True)
            return Response(
                {'error': {'code': 'RETURN_ERROR', 'message': 'Failed to return profile'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
