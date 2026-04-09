from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    AllSponsorshipsAPIView, PendingSponsorshipsAPIView,
    VerifySponsorshipAPIView, ResubmitSponsorshipAPIView,
    PMPublishChildAPIView, ReturnForCorrectionAPIView,
    RejectChildAPIView, ResubmitChildAPIView, PMFlagChildAPIView,
    PMReviewSponsorshipAPIView,
)
from .views_extended import (
    ChildEnrollmentViewSet, SponsorshipPaymentViewSet,
    ChildProgressReportViewSet, DuplicationAlertViewSet,
    ChildNotificationViewSet, FinancialDocumentViewSet,
    ProgramMetricsViewSet, SystemLogViewSet,
    DashboardStatsView,
)

router = DefaultRouter()
router.register(r'interventions', views.InterventionLogViewSet, basename='intervention')
router.register(r'enrollments', ChildEnrollmentViewSet, basename='enrollment')
router.register(r'payments', SponsorshipPaymentViewSet, basename='payment')
router.register(r'progress-reports', ChildProgressReportViewSet, basename='progress-report')
router.register(r'duplication-alerts', DuplicationAlertViewSet, basename='duplication-alert')
router.register(r'notifications', ChildNotificationViewSet, basename='notification')
router.register(r'financial-documents', FinancialDocumentViewSet, basename='financial-document')
router.register(r'program-metrics', ProgramMetricsViewSet, basename='program-metrics')
router.register(r'system-logs', SystemLogViewSet, basename='system-log')

urlpatterns = [
    path('list/', views.ChildListAPIView.as_view(), name='child-list'),
    path('all/', views.ChildListAllAPIView.as_view(), name='child-list-all'),
    path('register/', views.ChildRegisterAPIView.as_view(), name='child-register'),
    path('<uuid:pk>/', views.ChildDetailAPIView.as_view(), name='child-detail'),
    path('sponsor/<uuid:child_id>/', views.SponsorChildAPIView.as_view(), name='sponsor-child'),
    path('my-sponsorships/', views.MySponsorshipsAPIView.as_view(), name='my-sponsorships'),
    path('all-sponsorships/', AllSponsorshipsAPIView.as_view(), name='all-sponsorships'),
    path('pending-sponsorships/', PendingSponsorshipsAPIView.as_view(), name='pending-sponsorships'),
    path('verify-sponsorship/<str:sponsorship_id>/', VerifySponsorshipAPIView.as_view(), name='verify-sponsorship'),
    path('resubmit-sponsorship/<str:sponsorship_id>/', ResubmitSponsorshipAPIView.as_view(), name='resubmit-sponsorship'),
    path('pm-review-sponsorship/<str:sponsorship_id>/', PMReviewSponsorshipAPIView.as_view(), name='pm-review-sponsorship'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('<uuid:pk>/publish/', PMPublishChildAPIView.as_view(), name='admin-publish-child'),
    path('<uuid:pk>/flag/', PMFlagChildAPIView.as_view(), name='pm-flag-child'),
    path('<uuid:pk>/return-for-correction/', ReturnForCorrectionAPIView.as_view(), name='return-for-correction'),
    path('<uuid:pk>/reject/', RejectChildAPIView.as_view(), name='reject-child'),
    path('<uuid:pk>/resubmit/', ResubmitChildAPIView.as_view(), name='resubmit-child'),
    path('', include(router.urls)),
]
