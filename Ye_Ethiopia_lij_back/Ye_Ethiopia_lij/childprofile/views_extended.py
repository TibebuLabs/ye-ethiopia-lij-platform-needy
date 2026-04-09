"""
Extended Views for Complete Use Case Coverage
"""
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Q, Sum, Count, Avg
import logging

from .models_extended import (
    ChildEnrollment, SponsorshipPayment, ChildProgressReport,
    DuplicationAlert, ChildNotification, FinancialDocument,
    ProgramMetrics, SystemLog
)
from .serializers_extended import (
    ChildEnrollmentSerializer, SponsorshipPaymentSerializer,
    ChildProgressReportSerializer, DuplicationAlertSerializer,
    ChildNotificationSerializer, FinancialDocumentSerializer,
    ProgramMetricsSerializer, SystemLogSerializer
)
from config.permissions import IsSchool, IsAdmin, IsActiveUser, IsAdminOrProjectManager
from config.exceptions import ValidationException, PermissionException
from config.audit import AuditLogger

logger = logging.getLogger(__name__)


def _send_notification(child, notification_type, title, message, recipient):
    """
    Create a ChildNotification and log any failure — never silently swallow errors.
    Returns the created notification or None on failure.
    """
    try:
        notif = ChildNotification.objects.create(
            child=child,
            notification_type=notification_type,
            title=title,
            message=message,
            recipient=recipient,
        )
        return notif
    except Exception as exc:
        logger.error(
            f"Failed to create notification [{notification_type}] for recipient={getattr(recipient, 'id', recipient)}: {exc}",
            exc_info=True,
        )
        return None


class ChildEnrollmentViewSet(viewsets.ModelViewSet):
    """UC-17: Enroll child in school"""
    queryset = ChildEnrollment.objects.all()
    serializer_class = ChildEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['child', 'school', 'status']
    search_fields = ['child__full_name', 'school__name']
    ordering_fields = ['enrollment_date', 'created_at']

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchool()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        qs = ChildEnrollment.objects.all().select_related('child', 'school')
        if getattr(user, 'role', None) == 'SCHOOL':
            qs = qs.filter(school=user)
        return qs

    def perform_create(self, serializer):
        from .models import ChildProfile
        child_id = self.request.data.get('child')
        # Validate child is PUBLISHED/approved
        try:
            child = ChildProfile.objects.get(id=child_id)
        except ChildProfile.DoesNotExist:
            raise ValidationException('Child not found')
        if child.status not in ('PUBLISHED', 'SPONSORED'):
            raise ValidationException('Child must be approved before enrollment')
        # Prevent duplicate active enrollment
        already = ChildEnrollment.objects.filter(child=child, status='ENROLLED').exists()
        if already:
            raise ValidationException('This child is already enrolled in a school')
        try:
            enrollment = serializer.save(school=self.request.user)
            AuditLogger.log_action(
                self.request.user, 'ENROLL_CHILD', 'ChildEnrollment', str(enrollment.id),
                f'Enrolled {enrollment.child.full_name}'
            )
        except Exception as e:
            logger.error(f"Enrollment creation error: {str(e)}")
            raise ValidationException('Failed to create enrollment')

    @action(detail=False, methods=['get'])
    def active_enrollments(self, request):
        """Get active enrollments for current school"""
        try:
            enrollments = self.get_queryset().filter(status='ENROLLED')
            serializer = self.get_serializer(enrollments, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching active enrollments: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch enrollments'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def approved_children(self, request):
        """Search approved (PUBLISHED/SPONSORED) children available for enrollment"""
        from .models import ChildProfile
        search = request.query_params.get('search', '')
        qs = ChildProfile.objects.filter(
            status__in=['PUBLISHED', 'SPONSORED']
        ).exclude(
            enrollments__status='ENROLLED'
        )
        if search:
            qs = qs.filter(full_name__icontains=search)
        from .serializers import ChildProfileListSerializer
        serializer = ChildProfileListSerializer(qs[:30], many=True, context={'request': request})
        return Response(serializer.data)


class SponsorshipPaymentViewSet(viewsets.ModelViewSet):
    """Track sponsorship payments"""
    queryset = SponsorshipPayment.objects.all()
    serializer_class = SponsorshipPaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['sponsorship', 'status', 'payment_method']
    search_fields = ['transaction_id']
    ordering_fields = ['payment_date', 'created_at']

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        try:
            payment = serializer.save()
            AuditLogger.log_action(
                self.request.user, 'CREATE_PAYMENT', 'SponsorshipPayment', str(payment.id),
                f'Payment {payment.amount}'
            )
        except Exception as e:
            logger.error(f"Payment creation error: {str(e)}")
            raise ValidationException('Failed to create payment')

    @action(detail=False, methods=['get'])
    def payment_summary(self, request):
        """Get payment summary for sponsorship"""
        try:
            sponsorship_id = request.query_params.get('sponsorship_id')
            if not sponsorship_id:
                raise ValidationException('sponsorship_id parameter required')

            payments = self.queryset.filter(sponsorship_id=sponsorship_id)
            total_paid = payments.filter(status='COMPLETED').aggregate(Sum('amount'))['amount__sum'] or 0
            pending = payments.filter(status='PENDING').aggregate(Sum('amount'))['amount__sum'] or 0

            return Response({
                'total_paid': total_paid,
                'pending': pending,
                'payment_count': payments.count(),
                'completed_count': payments.filter(status='COMPLETED').count()
            })
        except ValidationException as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)
        except Exception as e:
            logger.error(f"Error fetching payment summary: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch payment summary'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChildProgressReportViewSet(viewsets.ModelViewSet):
    """UC-15: View child academic status - Progress tracking"""
    queryset = ChildProgressReport.objects.all()
    serializer_class = ChildProgressReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['child', 'overall_progress']
    search_fields = ['child__full_name']
    ordering_fields = ['report_date', 'created_at']

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchool()]
        return super().get_permissions()

    def perform_create(self, serializer):
        try:
            report = serializer.save(reported_by=self.request.user)
            AuditLogger.log_action(
                self.request.user, 'CREATE_PROGRESS_REPORT', 'ChildProgressReport', str(report.id)
            )
        except Exception as e:
            logger.error(f"Progress report creation error: {str(e)}")
            raise ValidationException('Failed to create progress report')

    @action(detail=False, methods=['get'])
    def child_progress(self, request):
        """Get progress history for a child"""
        try:
            child_id = request.query_params.get('child_id')
            if not child_id:
                raise ValidationException('child_id parameter required')

            reports = self.queryset.filter(child_id=child_id).order_by('-report_date')
            serializer = self.get_serializer(reports, many=True)
            return Response(serializer.data)
        except ValidationException as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)


class DuplicationAlertViewSet(viewsets.ModelViewSet):
    """UC-11: Resolve duplication alert"""
    queryset = DuplicationAlert.objects.all()
    serializer_class = DuplicationAlertSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdminOrProjectManager]
    filterset_fields = ['status']
    ordering_fields = ['similarity_score', 'created_at']

    @action(detail=True, methods=['post'])
    def resolve_duplicate(self, request, pk=None):
        """Resolve a duplication alert — sends notifications to affected org staff"""
        try:
            alert = self.get_object()
            action_type = request.data.get('action')  # 'merge' or 'false_positive'
            notes = request.data.get('notes', '')

            if action_type not in ('merge', 'false_positive'):
                raise ValidationException('Invalid action. Use "merge" or "false_positive"')

            alert.resolved_by = request.user
            alert.resolved_at = timezone.now()
            alert.resolution_notes = notes

            if action_type == 'merge':
                alert.status = 'MERGED'
                alert.save()

                AuditLogger.log_action(
                    request.user, 'MERGE_DUPLICATE', 'DuplicationAlert', str(alert.id),
                    f'Merged {alert.primary_child.full_name} with {alert.duplicate_child.full_name}'
                )
                # Notify the org staff who registered the duplicate child
                _send_notification(
                    child=alert.duplicate_child,
                    notification_type='PROFILE_REJECTED',
                    title='Duplicate Profile Removed',
                    message=(
                        f'The profile for {alert.duplicate_child.full_name} was identified as a '
                        f'duplicate of an existing record ({alert.primary_child.full_name}) and has been removed.'
                        + (f' Reason: {notes}' if notes else '')
                    ),
                    recipient=alert.duplicate_child.organization,
                )

            else:  # false_positive
                alert.status = 'FALSE_POSITIVE'
                alert.save()

                AuditLogger.log_action(
                    request.user, 'FALSE_POSITIVE_DUPLICATE', 'DuplicationAlert', str(alert.id)
                )
                # Notify the org staff that the alert was cleared — profile is confirmed unique
                _send_notification(
                    child=alert.duplicate_child,
                    notification_type='PROFILE_APPROVED',
                    title='Duplication Alert Cleared',
                    message=(
                        f'The duplication alert for {alert.duplicate_child.full_name} has been '
                        f'reviewed and cleared. The profile is confirmed as unique.'
                        + (f' Note: {notes}' if notes else '')
                    ),
                    recipient=alert.duplicate_child.organization,
                )

            return Response({
                'message': f'Duplication alert resolved as {action_type}',
                'data': DuplicationAlertSerializer(alert).data
            })

        except ValidationException as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)
        except Exception as e:
            logger.error(f"Error resolving duplication: {str(e)}", exc_info=True)
            return Response({
                'error': {'code': 'RESOLUTION_ERROR', 'message': 'Failed to resolve duplication'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def pending_alerts(self, request):
        """Get pending duplication alerts"""
        try:
            alerts = self.queryset.filter(status='PENDING').order_by('-similarity_score')
            serializer = self.get_serializer(alerts, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching pending alerts: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch alerts'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChildNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """Notifications for child profile updates"""
    queryset = ChildNotification.objects.all()
    serializer_class = ChildNotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['is_read', 'notification_type']
    ordering_fields = ['created_at']
    lookup_value_regex = '[^/]+'  # allow UUID primary keys

    def get_queryset(self):
        """Only show notifications for current user, latest first"""
        return self.queryset.filter(
            recipient=self.request.user
        ).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        try:
            notification = self.get_object()
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save()

            return Response({
                'message': 'Notification marked as read',
                'data': ChildNotificationSerializer(notification).data
            })
        except Exception as e:
            logger.error(f"Error marking notification as read: {str(e)}")
            return Response({
                'error': {'code': 'UPDATE_ERROR', 'message': 'Failed to update notification'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        try:
            self.get_queryset().filter(is_read=False).update(
                is_read=True, read_at=timezone.now()
            )
            return Response({'message': 'All notifications marked as read'})
        except Exception as e:
            logger.error(f"Error marking all notifications as read: {str(e)}")
            return Response({
                'error': {'code': 'UPDATE_ERROR', 'message': 'Failed to update notifications'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        try:
            count = self.get_queryset().filter(is_read=False).count()
            return Response({'unread_count': count})
        except Exception as e:
            logger.error(f"Error fetching unread count: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch unread count'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FinancialDocumentViewSet(viewsets.ModelViewSet):
    """UC-19: Review financial document"""
    queryset = FinancialDocument.objects.all()
    serializer_class = FinancialDocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    filterset_fields = ['sponsorship', 'document_type', 'status']
    ordering_fields = ['document_date', 'created_at']

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsAdminOrProjectManager()]
        return super().get_permissions()

    def perform_create(self, serializer):
        try:
            document = serializer.save()
            AuditLogger.log_action(
                self.request.user, 'CREATE_FINANCIAL_DOCUMENT', 'FinancialDocument', str(document.id)
            )
        except Exception as e:
            logger.error(f"Financial document creation error: {str(e)}")
            raise ValidationException('Failed to create financial document')

    @action(detail=True, methods=['post'])
    def approve_document(self, request, pk=None):
        """ADMIN ONLY: Approve a financial document — notifies the sponsor"""
        if request.user.role != 'ADMIN':
            return Response(
                {'error': {'code': 'FORBIDDEN', 'message': 'Only Admin can approve documents'}},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            document = self.get_object()
            document.status = 'APPROVED'
            document.reviewed_by = request.user
            document.reviewed_at = timezone.now()
            document.review_notes = request.data.get('notes', '')
            document.save()

            AuditLogger.log_action(
                request.user, 'APPROVE_DOCUMENT', 'FinancialDocument', str(document.id)
            )
            sponsor = document.sponsorship.sponsor
            child = document.sponsorship.child
            _send_notification(
                child=child,
                notification_type='STATUS_UPDATED',
                title='Financial Document Approved',
                message=(
                    f'Your financial document ({document.get_document_type_display()}) '
                    f'for {child.full_name} has been reviewed and approved.'
                    + (f' Note: {document.review_notes}' if document.review_notes else '')
                ),
                recipient=sponsor,
            )
            return Response({
                'message': 'Document approved',
                'data': FinancialDocumentSerializer(document).data
            })
        except Exception as e:
            logger.error(f"Error approving document: {str(e)}")
            return Response({
                'error': {'code': 'APPROVAL_ERROR', 'message': 'Failed to approve document'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def reject_document(self, request, pk=None):
        """ADMIN ONLY: Reject a financial document — notifies the sponsor with reason"""
        if request.user.role != 'ADMIN':
            return Response(
                {'error': {'code': 'FORBIDDEN', 'message': 'Only Admin can reject documents'}},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            document = self.get_object()
            notes = request.data.get('notes', '').strip()
            if not notes:
                return Response(
                    {'error': {'code': 'REASON_REQUIRED', 'message': 'A rejection reason is required'}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            document.status = 'REJECTED'
            document.reviewed_by = request.user
            document.reviewed_at = timezone.now()
            document.review_notes = notes
            document.save()

            AuditLogger.log_action(
                request.user, 'REJECT_DOCUMENT', 'FinancialDocument', str(document.id)
            )
            sponsor = document.sponsorship.sponsor
            child = document.sponsorship.child
            _send_notification(
                child=child,
                notification_type='STATUS_UPDATED',
                title='Financial Document Rejected',
                message=(
                    f'Your financial document ({document.get_document_type_display()}) '
                    f'for {child.full_name} was rejected. Reason: {notes}. '
                    f'Please upload a corrected document.'
                ),
                recipient=sponsor,
            )
            return Response({
                'message': 'Document rejected',
                'data': FinancialDocumentSerializer(document).data
            })
        except Exception as e:
            logger.error(f"Error rejecting document: {str(e)}")
            return Response({
                'error': {'code': 'REJECTION_ERROR', 'message': 'Failed to reject document'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='pm-review')
    def pm_review_document(self, request, pk=None):
        """PROJECT_MANAGER: Review a financial document, add decision note, notify Admin."""
        if request.user.role != 'PROJECT_MANAGER':
            return Response(
                {'error': {'code': 'FORBIDDEN', 'message': 'Only Project Manager can submit PM reviews'}},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            document = self.get_object()
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

            # Store PM review in review_notes with a prefix so Admin can see it
            pm_note_text = f'[PM Review — {decision}] {notes}'
            document.review_notes = pm_note_text
            document.save(update_fields=['review_notes'])

            AuditLogger.log_action(
                request.user, 'PM_REVIEW_DOCUMENT', 'FinancialDocument', str(document.id),
                f'PM decision: {decision} — {notes[:80]}'
            )

            # Notify all admins
            from django.contrib.auth import get_user_model
            User = get_user_model()
            child = document.sponsorship.child
            sponsor = document.sponsorship.sponsor
            doc_label = document.get_document_type_display()

            for admin in User.objects.filter(role='ADMIN', status='ACTIVE'):
                _send_notification(
                    child=child,
                    notification_type='STATUS_UPDATED',
                    title=f'PM Review: Financial Document — {decision}',
                    message=(
                        f'PM {request.user.name} reviewed the {doc_label} for {child.full_name} '
                        f'(Sponsor: {sponsor.name}) and marked it as {decision}.\n\n'
                        f'PM Notes: {notes}\n\n'
                        f'Please make the final approval or rejection decision.'
                    ),
                    recipient=admin,
                )

            return Response({
                'message': f'Review submitted. Admin has been notified with your {decision} decision.',
                'data': FinancialDocumentSerializer(document).data,
            })
        except Exception as e:
            logger.error(f"PM review document error: {str(e)}", exc_info=True)
            return Response({
                'error': {'code': 'PM_REVIEW_ERROR', 'message': 'Failed to submit PM review'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProgramMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    """UC-07: Monitor implementation program"""
    queryset = ProgramMetrics.objects.all()
    serializer_class = ProgramMetricsSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    ordering_fields = ['metric_date']

    @action(detail=False, methods=['get'])
    def latest_metrics(self, request):
        """Get latest program metrics"""
        try:
            latest = self.queryset.latest('metric_date')
            serializer = self.get_serializer(latest)
            return Response(serializer.data)
        except ProgramMetrics.DoesNotExist:
            return Response({
                'error': {'code': 'NOT_FOUND', 'message': 'No metrics available'}
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching latest metrics: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch metrics'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def metrics_range(self, request):
        """Get metrics for a date range"""
        try:
            start_date = request.query_params.get('start_date')
            end_date = request.query_params.get('end_date')

            if not start_date or not end_date:
                raise ValidationException('start_date and end_date parameters required')

            metrics = self.queryset.filter(
                metric_date__gte=start_date,
                metric_date__lte=end_date
            ).order_by('metric_date')

            serializer = self.get_serializer(metrics, many=True)
            return Response(serializer.data)
        except ValidationException as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)


class SystemLogViewSet(viewsets.ReadOnlyModelViewSet):
    """System activity logging for monitoring"""
    queryset = SystemLog.objects.all()
    serializer_class = SystemLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser, IsAdmin]
    filterset_fields = ['log_type', 'status', 'user']
    search_fields = ['action', 'resource_type']
    ordering_fields = ['created_at']

    @action(detail=False, methods=['get'])
    def recent_activity(self, request):
        """Get recent system activity"""
        try:
            limit = int(request.query_params.get('limit', 50))
            logs = self.queryset.order_by('-created_at')[:limit]
            serializer = self.get_serializer(logs, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching recent activity: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch activity'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def error_logs(self, request):
        """Get error logs"""
        try:
            logs = self.queryset.filter(log_type='ERROR').order_by('-created_at')
            serializer = self.get_serializer(logs, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching error logs: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch error logs'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardStatsView(APIView):
    """
    Returns role-specific dashboard stats computed live from the DB.
    Each role gets only the numbers relevant to them.
    """
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]

    def get(self, request):
        from .models import ChildProfile, Sponsorship, InterventionLog
        from organization.models import Organization
        from acadamicreport.models import AcademicReport
        from django.db.models import Avg

        user = request.user
        role = getattr(user, 'role', None)

        try:
            if role == 'ADMIN' or role == 'GOVERNMENT':
                total     = ChildProfile.objects.count()
                sponsored = ChildProfile.objects.filter(status='SPONSORED').count()
                unsponsored = ChildProfile.objects.filter(status='PUBLISHED').count()
                orgs      = Organization.objects.filter(status='ACTIVE').count()
                interventions = InterventionLog.objects.count()
                avg_score = AcademicReport.objects.aggregate(a=Avg('average_score'))['a']
                return Response({
                    'total_children':   total,
                    'sponsored':        sponsored,
                    'unsponsored':      unsponsored,
                    'organizations':    orgs,
                    'interventions':    interventions,
                    'avg_score':        round(float(avg_score), 1) if avg_score else None,
                })

            elif role == 'ORG_STAFF':
                my_children   = ChildProfile.objects.filter(organization=user)
                total         = my_children.count()
                pending       = my_children.filter(status='PENDING').count()
                sponsored     = my_children.filter(status='SPONSORED').count()
                interventions = InterventionLog.objects.filter(recorded_by=user).count()
                avg_score     = AcademicReport.objects.filter(
                    child__organization=user
                ).aggregate(a=Avg('average_score'))['a']
                return Response({
                    'total_children':   total,
                    'pending_approval': pending,
                    'sponsored':        sponsored,
                    'interventions':    interventions,
                    'avg_score':        round(float(avg_score), 1) if avg_score else None,
                })

            elif role == 'SPONSOR':
                my_sponsorships = Sponsorship.objects.filter(sponsor=user)
                active   = my_sponsorships.filter(is_active=True).count()
                total    = my_sponsorships.count()
                children = my_sponsorships.values('child').distinct().count()
                return Response({
                    'total_sponsorships':  total,
                    'active_sponsorships': active,
                    'children_supported':  children,
                })

            elif role == 'SCHOOL':
                from .models_extended import ChildEnrollment
                enrolled  = ChildEnrollment.objects.filter(school=user, status='ENROLLED').count()
                reports   = AcademicReport.objects.filter(reported_by=user).count()
                avg_score = AcademicReport.objects.filter(
                    reported_by=user
                ).aggregate(a=Avg('average_score'))['a']
                interventions = InterventionLog.objects.filter(recorded_by=user).count()
                return Response({
                    'enrolled_children': enrolled,
                    'reports_submitted': reports,
                    'interventions':     interventions,
                    'avg_score':         round(float(avg_score), 1) if avg_score else None,
                })

            elif role == 'PROJECT_MANAGER':
                pending_children  = ChildProfile.objects.filter(status='PENDING').count()
                published         = ChildProfile.objects.filter(status='PUBLISHED').count()
                pending_dupes     = DuplicationAlert.objects.filter(status='PENDING').count()
                pending_fin_docs  = FinancialDocument.objects.filter(status='PENDING').count()
                total_children    = ChildProfile.objects.count()
                return Response({
                    'pending_children':       pending_children,
                    'published_children':     published,
                    'total_children':         total_children,
                    'pending_duplicates':     pending_dupes,
                    'pending_financial_docs': pending_fin_docs,
                })

            return Response({})

        except Exception as e:
            logger.error(f"Dashboard stats error: {str(e)}")
            return Response(
                {'error': {'code': 'STATS_ERROR', 'message': 'Failed to load stats'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
