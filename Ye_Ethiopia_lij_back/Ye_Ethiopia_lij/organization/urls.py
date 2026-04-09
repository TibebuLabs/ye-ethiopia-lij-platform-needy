from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet,
    OrganizationReportViewSet,
    ChildSubmissionTrackingViewSet,
    SponsorshipReceivedViewSet,
)

router = DefaultRouter()
router.register(r'profile', OrganizationViewSet, basename='organization')
router.register(r'reports', OrganizationReportViewSet, basename='org-report')
router.register(r'submission-tracking', ChildSubmissionTrackingViewSet, basename='submission-tracking')
router.register(r'sponsorships-received', SponsorshipReceivedViewSet, basename='sponsorship-received')

urlpatterns = [
    path('', include(router.urls)),
]
