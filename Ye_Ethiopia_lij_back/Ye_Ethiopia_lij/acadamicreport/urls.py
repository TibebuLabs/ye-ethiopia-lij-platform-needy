from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcademicReportViewSet

# The router automatically generates the paths for GET, POST, PUT, and DELETE
router = DefaultRouter()
router.register(r'results', AcademicReportViewSet, basename='academic-report')

urlpatterns = [
   
    path('', include(router.urls)),
]