"""
Extended URLs for Complete Use Case Coverage
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_extended import (
    ChildEnrollmentViewSet, SponsorshipPaymentViewSet,
    ChildProgressReportViewSet, DuplicationAlertViewSet,
    ChildNotificationViewSet, FinancialDocumentViewSet,
    ProgramMetricsViewSet, SystemLogViewSet
)

router = DefaultRouter()
router.register(r'enrollments', ChildEnrollmentViewSet, basename='enrollment')
router.register(r'payments', SponsorshipPaymentViewSet, basename='payment')
router.register(r'progress-reports', ChildProgressReportViewSet, basename='progress-report')
router.register(r'duplication-alerts', DuplicationAlertViewSet, basename='duplication-alert')
router.register(r'notifications', ChildNotificationViewSet, basename='notification')
router.register(r'financial-documents', FinancialDocumentViewSet, basename='financial-document')
router.register(r'program-metrics', ProgramMetricsViewSet, basename='program-metrics')
router.register(r'system-logs', SystemLogViewSet, basename='system-log')

urlpatterns = [
    path('', include(router.urls)),
]
