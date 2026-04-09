from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
import logging

from .models import AcademicReport
from .serializers import AcademicReportSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from config.permissions import IsSchool, IsAdmin, IsActiveUser
from config.exceptions import ValidationException
from config.audit import AuditLogger

logger = logging.getLogger(__name__)


class AcademicReportViewSet(viewsets.ModelViewSet):
    """Manage academic reports"""
    queryset = AcademicReport.objects.all()
    serializer_class = AcademicReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsActiveUser]
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ['child', 'academic_year', 'term']
    search_fields = ['school_name', 'child__full_name']
    ordering_fields = ['created_at', 'academic_year']
    # Tell DRF to treat the pk as a plain string (not integer)
    lookup_value_regex = '[^/]+'

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsActiveUser(), IsSchool()]
        return super().get_permissions()

    def perform_create(self, serializer):
        report = serializer.save(reported_by=self.request.user)
        AuditLogger.log_action(
            self.request.user, 'CREATE_REPORT', 'AcademicReport', str(report.id),
            f'Report for {report.child.full_name}'
        )

    def perform_update(self, serializer):
        report = serializer.save()
        AuditLogger.log_action(
            self.request.user, 'UPDATE_REPORT', 'AcademicReport', str(report.id)
        )

    def perform_destroy(self, instance):
        report_id = str(instance.id)
        instance.delete()
        AuditLogger.log_action(
            self.request.user, 'DELETE_REPORT', 'AcademicReport', report_id
        )

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsActiveUser])
    def my_reports(self, request):
        """Get reports submitted by current user"""
        try:
            reports = self.queryset.filter(reported_by=request.user)
            serializer = self.get_serializer(reports, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching reports: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch reports'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'],
            permission_classes=[permissions.IsAuthenticated, IsActiveUser, IsSchool])
    def enrolled_children_reports(self, request):
        """
        UC-16: Returns all academic reports for children enrolled under
        the requesting school, grouped by child for easy display.
        """
        try:
            from childprofile.models_extended import ChildEnrollment
            enrolled_child_ids = ChildEnrollment.objects.filter(
                school=request.user, status='ENROLLED'
            ).values_list('child_id', flat=True)

            reports = self.queryset.filter(
                child_id__in=enrolled_child_ids
            ).select_related('child').order_by('child__full_name', '-academic_year', 'term')

            serializer = self.get_serializer(reports, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching enrolled children reports: {str(e)}")
            return Response({
                'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch reports'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'],
            permission_classes=[permissions.IsAuthenticated, IsActiveUser, IsSchool])
    def update_academic_status(self, request, pk=None):
        """
        UC-16: Update academic status (grade, score, attendance, term, comments)
        for a report belonging to a child enrolled under this school.
        """
        try:
            report = self.get_object()

            # Verify the child is enrolled under this school
            from childprofile.models_extended import ChildEnrollment
            is_enrolled = ChildEnrollment.objects.filter(
                school=request.user,
                child=report.child,
                status='ENROLLED'
            ).exists()
            if not is_enrolled:
                raise ValidationException('This child is not enrolled under your school')

            allowed_fields = {
                'grade_level', 'average_score', 'attendance_rate',
                'term', 'teacher_comments', 'rank', 'academic_year',
            }
            data = {k: v for k, v in request.data.items() if k in allowed_fields}

            serializer = self.get_serializer(report, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            updated = serializer.save()

            AuditLogger.log_action(
                request.user, 'UPDATE_ACADEMIC_STATUS', 'AcademicReport', str(updated.id),
                f'Updated academic status for {updated.child.full_name}'
            )

            return Response({
                'message': 'Academic status updated successfully',
                'data': self.get_serializer(updated).data
            })

        except ValidationException as e:
            return Response(
                {'error': {'code': e.code, 'message': e.message}},
                status=e.status_code
            )
        except Exception as e:
            logger.error(f"Error updating academic status: {str(e)}")
            return Response({
                'error': {'code': 'UPDATE_ERROR', 'message': 'Failed to update academic status'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'],
            permission_classes=[permissions.IsAuthenticated, IsActiveUser])
    def government_summary(self, request):
        """
        GOVERNMENT: Aggregated academic report summary across all schools.
        Returns per-school stats + recent reports.
        """
        from django.db.models import Avg, Count
        try:
            qs = self.queryset.select_related('child', 'reported_by')
            academic_year = request.query_params.get('academic_year')
            term = request.query_params.get('term')
            if academic_year:
                qs = qs.filter(academic_year=academic_year)
            if term:
                qs = qs.filter(term=term)

            # Per-school summary
            school_stats = (
                qs.values('school_name')
                .annotate(
                    report_count=Count('id'),
                    avg_score=Avg('average_score'),
                    avg_attendance=Avg('attendance_rate'),
                )
                .order_by('-report_count')
            )

            overall = qs.aggregate(
                total_reports=Count('id'),
                avg_score=Avg('average_score'),
                avg_attendance=Avg('attendance_rate'),
            )

            recent = self.get_serializer(
                qs.order_by('-created_at')[:20], many=True
            ).data

            return Response({
                'overall': {
                    'total_reports':  overall['total_reports'] or 0,
                    'avg_score':      round(float(overall['avg_score'] or 0), 1),
                    'avg_attendance': round(float(overall['avg_attendance'] or 0), 1),
                },
                'by_school': list(school_stats),
                'recent_reports': recent,
            })
        except Exception as e:
            logger.error(f"Government summary error: {str(e)}")
            return Response(
                {'error': {'code': 'FETCH_ERROR', 'message': 'Failed to fetch summary'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'],
            permission_classes=[permissions.IsAuthenticated, IsActiveUser, IsSchool])
    def generate_report(self, request):
        """
        UC-18: Generate academic performance report.
        Query params:
          - child_id   (optional) filter to one child
          - academic_year (optional)
          - term       (optional)
        Returns aggregated stats + full record list.
        """
        from django.db.models import Avg, Max, Min, Count
        from childprofile.models_extended import ChildEnrollment

        try:
            # Scope to this school's enrolled children
            enrolled_ids = ChildEnrollment.objects.filter(
                school=request.user, status='ENROLLED'
            ).values_list('child_id', flat=True)

            qs = self.queryset.filter(child_id__in=enrolled_ids).select_related('child')

            # Optional filters
            child_id      = request.query_params.get('child_id')
            academic_year = request.query_params.get('academic_year')
            term          = request.query_params.get('term')

            if child_id:
                qs = qs.filter(child_id=child_id)
            if academic_year:
                qs = qs.filter(academic_year=academic_year)
            if term:
                qs = qs.filter(term=term)

            if not qs.exists():
                return Response({
                    'message': 'No academic data found for the selected criteria',
                    'records': [],
                    'summary': None,
                    'children': [],
                })

            # Aggregate summary
            agg = qs.aggregate(
                avg_score=Avg('average_score'),
                max_score=Max('average_score'),
                min_score=Min('average_score'),
                avg_attendance=Avg('attendance_rate'),
                total_records=Count('id'),
            )

            # Per-child summary
            child_summaries = []
            child_ids_in_qs = qs.values_list('child_id', flat=True).distinct()
            for cid in child_ids_in_qs:
                child_qs = qs.filter(child_id=cid)
                first = child_qs.order_by('-academic_year').first()
                child_agg = child_qs.aggregate(
                    avg_score=Avg('average_score'),
                    avg_attendance=Avg('attendance_rate'),
                    report_count=Count('id'),
                )
                child_summaries.append({
                    'child_id':       str(cid),
                    'child_name':     first.child.full_name,
                    'avg_score':      round(float(child_agg['avg_score'] or 0), 1),
                    'avg_attendance': round(float(child_agg['avg_attendance'] or 0), 1),
                    'report_count':   child_agg['report_count'],
                    'latest_grade':   first.grade_level,
                })

            AuditLogger.log_action(
                request.user, 'GENERATE_REPORT', 'AcademicReport', 'bulk',
                f'Generated report for {len(child_summaries)} children'
            )

            return Response({
                'summary': {
                    'avg_score':      round(float(agg['avg_score'] or 0), 1),
                    'max_score':      round(float(agg['max_score'] or 0), 1),
                    'min_score':      round(float(agg['min_score'] or 0), 1),
                    'avg_attendance': round(float(agg['avg_attendance'] or 0), 1),
                    'total_records':  agg['total_records'],
                    'total_children': len(child_summaries),
                    'filters': {
                        'child_id':      child_id,
                        'academic_year': academic_year,
                        'term':          term,
                    }
                },
                'children': child_summaries,
                'records':  self.get_serializer(
                    qs.order_by('child__full_name', '-academic_year'), many=True
                ).data,
            })

        except Exception as e:
            logger.error(f"Error generating report: {str(e)}")
            return Response({
                'error': {'code': 'REPORT_ERROR', 'message': 'Failed to generate report'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)