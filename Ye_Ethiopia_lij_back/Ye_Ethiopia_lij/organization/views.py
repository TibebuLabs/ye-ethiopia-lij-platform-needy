from rest_framework import viewsets, status, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter
import logging

from .models import Organization, OrganizationReport, ChildSubmissionTracking, SponsorshipReceived
from .serializers import (
    OrganizationSerializer, OrganizationListSerializer,
    OrganizationReportSerializer,
    ChildSubmissionTrackingSerializer,
    SponsorshipReceivedSerializer,
)
from config.permissions import IsOrgStaff, IsAdmin, IsActiveUser
from config.exceptions import ValidationException, PermissionException
from config.audit import AuditLogger

logger = logging.getLogger(__name__)


# ── Organization CRUD ─────────────────────────────────────────────────────────
class OrganizationViewSet(viewsets.ModelViewSet):
    """
    UC-03 / UC-04: Register organization and track status.
    ORG_STAFF can register and view their own org.
    ADMIN can list, approve, reject all orgs.
    """
    queryset = Organization.objects.all().select_related('owner', 'approved_by')
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ['org_type', 'status', 'city']
    search_fields = ['name', 'city', 'registration_number']
    ordering_fields = ['created_at', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return OrganizationListSerializer
        return OrganizationSerializer

    def get_queryset(self):
        user = self.request.user
        # Admin sees all; ORG_STAFF sees only their own
        if user.role == 'ADMIN':
            return self.queryset
        return self.queryset.filter(owner=user)

    def perform_create(self, serializer):
        org = serializer.save(owner=self.request.user)
        AuditLogger.log_action(
            self.request.user, 'CREATE_ORGANIZATION', 'Organization', str(org.id),
            f'Organization {org.name} registered'
        )

    # ── UC-09: Authorize Registration ─────────────────────────────────────────
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAdmin])
    def approve(self, request, pk=None):
        """ADMIN: Approve an organization registration."""
        try:
            org = self.get_object()
            org.status = 'ACTIVE'
            org.approved_by = request.user
            org.approved_at = timezone.now()
            org.rejection_reason = ''
            org.save()

            AuditLogger.log_action(
                request.user, 'APPROVE_ORGANIZATION', 'Organization', str(org.id)
            )
            return Response({
                'message': f'{org.name} has been approved.',
                'data': OrganizationSerializer(org).data,
            })
        except Exception as e:
            logger.error(f"Org approval error: {str(e)}")
            return Response(
                {'error': {'code': 'APPROVAL_ERROR', 'message': 'Failed to approve organization'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAdmin])
    def reject(self, request, pk=None):
        """ADMIN: Reject an organization registration."""
        try:
            org = self.get_object()
            reason = request.data.get('reason', '')
            if not reason:
                raise ValidationException('Rejection reason is required')

            org.status = 'REJECTED'
            org.approved_by = request.user
            org.approved_at = timezone.now()
            org.rejection_reason = reason
            org.save()

            AuditLogger.log_action(
                request.user, 'REJECT_ORGANIZATION', 'Organization', str(org.id), reason
            )
            return Response({
                'message': f'{org.name} has been rejected.',
                'data': OrganizationSerializer(org).data,
            })
        except ValidationException as e:
            return Response({'error': {'code': e.code, 'message': e.message}}, status=e.status_code)
        except Exception as e:
            logger.error(f"Org rejection error: {str(e)}")
            return Response(
                {'error': {'code': 'REJECTION_ERROR', 'message': 'Failed to reject organization'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], url_path='change-status',
            permission_classes=[permissions.IsAuthenticated, IsAdmin])
    def change_status(self, request, pk=None):
        """ADMIN: Change organization status to any value."""
        try:
            org = self.get_object()
            new_status = request.data.get('status')
            valid = [s[0] for s in Organization.STATUS_CHOICES]
            if new_status not in valid:
                raise ValidationException(f'Invalid status. Choose from: {", ".join(valid)}')
            old_status = org.status
            org.status = new_status
            if new_status == 'ACTIVE':
                org.approved_by = request.user
                org.approved_at = timezone.now()
                org.rejection_reason = ''
            elif new_status == 'REJECTED':
                org.rejection_reason = request.data.get('reason', '')
            org.save()
            AuditLogger.log_action(
                request.user, 'CHANGE_ORG_STATUS', 'Organization', str(org.id),
                f'{old_status} → {new_status}'
            )
            return Response({
                'message': f'Status changed to {new_status}',
                'data': OrganizationSerializer(org).data,
            })
        except ValidationException as e:
            return Response({'error': {'code': e.code, 'message': e.message}}, status=e.status_code)
        except Exception as e:
            logger.error(f"Org status change error: {str(e)}")
            return Response(
                {'error': {'code': 'STATUS_ERROR', 'message': 'Failed to change status'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'],
            permission_classes=[permissions.IsAuthenticated, IsActiveUser, IsOrgStaff])
    def my_organization(self, request):
        """ORG_STAFF: Get own organization profile."""
        try:
            org = Organization.objects.get(owner=request.user)
            return Response(OrganizationSerializer(org).data)
        except Organization.DoesNotExist:
            return Response(
                {'error': {'code': 'NOT_FOUND', 'message': 'No organization registered yet'}},
                status=status.HTTP_404_NOT_FOUND
            )


# ── Organization Reports ──────────────────────────────────────────────────────
class OrganizationReportViewSet(viewsets.ModelViewSet):
    """
    UC-07 / UC-22: Submit and receive program implementation reports.
    ORG_STAFF submits reports; ADMIN and GOVERNMENT view/review them.
    """
    queryset = OrganizationReport.objects.all().select_related('organization', 'submitted_by')
    serializer_class = OrganizationReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ['organization', 'period', 'status']
    search_fields = ['title', 'organization__name']
    ordering_fields = ['report_date', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if user.role in ('ADMIN', 'GOVERNMENT'):
            return self.queryset
        # ORG_STAFF sees only their org's reports
        return self.queryset.filter(organization__owner=user)

    def perform_create(self, serializer):
        report = serializer.save(submitted_by=self.request.user, status='SUBMITTED')
        AuditLogger.log_action(
            self.request.user, 'SUBMIT_ORG_REPORT', 'OrganizationReport', str(report.id)
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsAdmin])
    def review(self, request, pk=None):
        """ADMIN: Review and approve an organization report."""
        try:
            report = self.get_object()
            report.status = 'REVIEWED'
            report.reviewed_by = request.user
            report.reviewed_at = timezone.now()
            report.review_notes = request.data.get('notes', '')
            report.save()

            AuditLogger.log_action(
                request.user, 'REVIEW_ORG_REPORT', 'OrganizationReport', str(report.id)
            )

            return Response({
                'message': 'Report reviewed.',
                'data': OrganizationReportSerializer(report).data,
            })
        except Exception as e:
            logger.error(f"Report review error: {str(e)}")
            return Response(
                {'error': {'code': 'REVIEW_ERROR', 'message': 'Failed to review report'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def my_reports(self, request):
        """ORG_STAFF: Get own organization's reports."""
        reports = self.get_queryset()
        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)


# ── Submission Tracking ───────────────────────────────────────────────────────
class ChildSubmissionTrackingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    UC-04: Track Submission Status.
    ORG_STAFF tracks their own children's submission history.
    ADMIN sees all.
    """
    queryset = ChildSubmissionTracking.objects.all().select_related(
        'child', 'organization', 'performed_by'
    )
    serializer_class = ChildSubmissionTrackingSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['child', 'action', 'organization']
    ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return self.queryset
        return self.queryset.filter(organization__owner=user)

    @action(detail=False, methods=['get'])
    def by_child(self, request):
        """Get full tracking history for a specific child."""
        child_id = request.query_params.get('child_id')
        if not child_id:
            return Response(
                {'error': {'code': 'VALIDATION_ERROR', 'message': 'child_id is required'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        qs = self.get_queryset().filter(child_id=child_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


# ── Sponsorship Received ──────────────────────────────────────────────────────
class SponsorshipReceivedViewSet(viewsets.ReadOnlyModelViewSet):
    """
    UC-06: Receive Sponsorship.
    ORG_STAFF sees sponsorships received for their children.
    """
    queryset = SponsorshipReceived.objects.all().select_related(
        'organization', 'sponsorship__child', 'sponsorship__sponsor'
    )
    serializer_class = SponsorshipReceivedSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['organization', 'is_acknowledged']
    ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return self.queryset
        return self.queryset.filter(organization__owner=user)

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """ORG_STAFF: Acknowledge receipt of a sponsorship."""
        try:
            record = self.get_object()
            record.is_acknowledged = True
            record.acknowledged_at = timezone.now()
            record.notes = request.data.get('notes', '')
            record.save()

            AuditLogger.log_action(
                request.user, 'ACKNOWLEDGE_SPONSORSHIP', 'SponsorshipReceived', str(record.id)
            )
            return Response({
                'message': 'Sponsorship acknowledged.',
                'data': SponsorshipReceivedSerializer(record).data,
            })
        except Exception as e:
            logger.error(f"Acknowledge error: {str(e)}")
            return Response(
                {'error': {'code': 'ACK_ERROR', 'message': 'Failed to acknowledge'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
