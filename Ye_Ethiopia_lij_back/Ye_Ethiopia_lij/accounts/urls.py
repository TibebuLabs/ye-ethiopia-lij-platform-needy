from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, LoginView, UserManagementViewSet, ChangePasswordView, SchoolProfileView, ForgotPasswordView, ResetPasswordView, AdminExistsView, PMForwardUserAPIView, PMPendingUsersAPIView

router = DefaultRouter()
router.register(r'manage', UserManagementViewSet, basename='user-manage')

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('admin-exists/', AdminExistsView.as_view(), name='admin-exists'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('school-profile/', SchoolProfileView.as_view(), name='school-profile'),
    path('pending-registrations/', PMPendingUsersAPIView.as_view(), name='pm-pending-users'),
    path('manage/<str:pk>/pm-forward/', PMForwardUserAPIView.as_view(), name='pm-forward-user'),
    path('', include(router.urls)),
]