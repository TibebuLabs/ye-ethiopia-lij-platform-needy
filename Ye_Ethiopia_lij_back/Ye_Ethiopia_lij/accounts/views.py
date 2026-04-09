from rest_framework import viewsets, status, decorators, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.contrib.auth import authenticate
import logging

from .models import User
from .serializers import (
    UserSerializer, UserRegistrationSerializer, PasswordChangeSerializer,
    PasswordResetSerializer, PasswordResetConfirmSerializer, LoginSerializer,
    SchoolProfileSerializer
)
from config.exceptions import (
    AuthenticationException, PermissionException, ValidationException,
    ResourceNotFoundException
)
from config.audit import AuditLogger
from config.permissions import IsAdmin, IsActiveUser
from drf_spectacular.utils import extend_schema

logger = logging.getLogger(__name__)


class AdminExistsView(APIView):
    """Public endpoint — returns whether a system admin account already exists."""
    permission_classes = [AllowAny]

    def get(self, request):
        exists = User.objects.filter(role='ADMIN').exists()
        return Response({'admin_exists': exists})


class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={201: UserSerializer},
        summary="Register a new user",
        description="Creates a user account with strong password requirements"
    )
    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                AuditLogger.log_action(user, 'REGISTER', 'User', str(user.id))
                return Response({
                    "message": f"Welcome {user.name}! Please verify your email.",
                    "data": UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            
            AuditLogger.log_auth_attempt(request.data.get('email'), False, 'Validation failed')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({
                'error': {'code': 'REGISTRATION_ERROR', 'message': 'Registration failed'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        request=LoginSerializer,
        responses={200: {'type': 'object', 'properties': {
            'access': {'type': 'string'},
            'refresh': {'type': 'string'},
            'user': {'type': 'object'},
        }}},
        summary="User login",
        description="Authenticate user and return JWT tokens"
    )
    def post(self, request):
        try:
            email = request.data.get('email', '').strip()
            password = request.data.get('password', '')

            if not email or not password:
                raise ValidationException('Email and password are required')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                AuditLogger.log_auth_attempt(email, False, 'User not found')
                raise AuthenticationException('Invalid credentials')

            # Check account lock
            if user.is_account_locked():
                AuditLogger.log_auth_attempt(email, False, 'Account locked')
                raise AuthenticationException('Account is temporarily locked. Try again later.')

            # Check active status
            if user.status != 'ACTIVE':
                AuditLogger.log_auth_attempt(email, False, 'Account inactive')
                raise AuthenticationException('Account is not active. Contact admin.')

            # Verify password
            if not user.check_password(password):
                user.record_failed_login()
                AuditLogger.log_auth_attempt(email, False, 'Invalid password')
                raise AuthenticationException('Invalid credentials')

            # Success — reset failed attempts and update last login
            user.reset_failed_login()
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

            AuditLogger.log_auth_attempt(email, True)

            # Generate JWT tokens directly
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user, context={'request': request}).data,
            }, status=status.HTTP_200_OK)

        except (AuthenticationException, ValidationException) as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'error': {'code': 'LOGIN_ERROR', 'message': 'Login failed'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated, IsActiveUser]

    def post(self, request):
        try:
            serializer = PasswordChangeSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if not request.user.check_password(serializer.validated_data['old_password']):
                AuditLogger.log_action(request.user, 'CHANGE_PASSWORD', 'User', str(request.user.id), 'Failed: wrong password')
                raise AuthenticationException('Current password is incorrect')

            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()

            AuditLogger.log_action(request.user, 'CHANGE_PASSWORD', 'User', str(request.user.id))

            return Response({"message": "Password updated successfully"})
        except AuthenticationException as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)
        except Exception as e:
            logger.error(f"Password change error: {str(e)}")
            return Response({
                'error': {'code': 'PASSWORD_ERROR', 'message': 'Failed to change password'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['role', 'status']
    search_fields = ['email', 'name']
    ordering_fields = ['created_at', 'name']

    @decorators.action(detail=True, methods=['post'], url_path='change-status')
    def change_status(self, request, pk=None):
        try:
            user = self.get_object()
            new_status = request.data.get('status')

            if new_status not in dict(User.STATUS_CHOICES):
                raise ValidationException('Invalid status')

            old_status = user.status
            user.status = new_status
            user.save()

            AuditLogger.log_action(
                request.user, 'CHANGE_STATUS', 'User', str(user.id),
                f'Status changed from {old_status} to {new_status}'
            )

            return Response({
                "message": f"User status changed to {new_status}",
                "data": UserSerializer(user).data
            })
        except ValidationException as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)
        except Exception as e:
            logger.error(f"Status change error: {str(e)}")
            return Response({
                'error': {'code': 'STATUS_ERROR', 'message': 'Failed to change status'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @decorators.action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsActiveUser])
    def change_password(self, request):
        try:
            serializer = PasswordChangeSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if not request.user.check_password(serializer.data['old_password']):
                AuditLogger.log_action(request.user, 'CHANGE_PASSWORD', 'User', str(request.user.id), 'Failed: wrong password')
                raise AuthenticationException('Current password is incorrect')

            request.user.set_password(serializer.data['new_password'])
            request.user.save()

            AuditLogger.log_action(request.user, 'CHANGE_PASSWORD', 'User', str(request.user.id))

            return Response({"message": "Password updated successfully"})
        except AuthenticationException as e:
            return Response({
                'error': {'code': e.code, 'message': e.message}
            }, status=e.status_code)
        except Exception as e:
            logger.error(f"Password change error: {str(e)}")
            return Response({
                'error': {'code': 'PASSWORD_ERROR', 'message': 'Failed to change password'}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ForgotPasswordView(APIView):
    """Send a password-reset link to the user's email."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response(
                {'error': {'code': 'EMAIL_REQUIRED', 'message': 'Email is required'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Return success anyway to avoid user enumeration
            return Response({'message': 'If that email exists, a reset link has been sent.'})

        try:
            import secrets
            import os
            from django.core.cache import cache
            from django.core.mail import send_mail, EmailMultiAlternatives
            from django.conf import settings as django_settings

            token = secrets.token_urlsafe(32)
            cache_key = f'pwd_reset_{token}'
            cache.set(cache_key, str(user.id), timeout=3600)

            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{frontend_url}/reset-password?token={token}"

            # Always log the URL so it works even if email fails
            logger.info(f"[PASSWORD RESET] URL for {email}: {reset_url}")

            subject = 'Reset your Ye Ethiopia Lij password'
            text_body = (
                f'Hello {user.name},\n\n'
                f'You requested a password reset for your Ye Ethiopia Lij account.\n\n'
                f'Click the link below to set a new password:\n\n'
                f'{reset_url}\n\n'
                f'This link expires in 1 hour.\n'
                f'If you did not request this, you can safely ignore this email.\n\n'
                f'— Ye Ethiopia Lij Team'
            )
            html_body = f"""<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f9fafb;padding:32px;margin:0">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:28px 32px;text-align:center">
      <h1 style="color:white;margin:0;font-size:22px">Ye Ethiopia Lij</h1>
      <p style="color:#dcfce7;margin:6px 0 0;font-size:13px">Child Welfare Platform</p>
    </div>
    <div style="padding:32px">
      <h2 style="color:#111827;margin:0 0 12px;font-size:18px">Reset Your Password</h2>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px">
        Hello <strong>{user.name}</strong>,<br><br>
        We received a request to reset your password. Click the button below to choose a new one.
      </p>
      <div style="text-align:center;margin:28px 0">
        <a href="{reset_url}" style="background:#16a34a;color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;display:inline-block">
          Reset Password
        </a>
      </div>
      <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0">
        Or copy this link into your browser:<br>
        <a href="{reset_url}" style="color:#16a34a;word-break:break-all">{reset_url}</a>
      </p>
      <hr style="border:none;border-top:1px solid #f3f4f6;margin:24px 0">
      <p style="color:#9ca3af;font-size:11px;margin:0">
        This link expires in <strong>1 hour</strong>. If you did not request a password reset, ignore this email.
      </p>
    </div>
  </div>
</body>
</html>"""

            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_body,
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            msg.attach_alternative(html_body, 'text/html')
            msg.send(fail_silently=False)
            logger.info(f"Password reset email sent to {email}")

        except Exception as e:
            logger.error(f"Forgot password error for {email}: {e}", exc_info=True)

        return Response({'message': 'If that email exists, a reset link has been sent.'})


class ResetPasswordView(APIView):
    """Validate token and set a new password."""
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token', '').strip()
        new_password = request.data.get('new_password', '')
        confirm = request.data.get('new_password_confirm', '')

        if not token:
            return Response(
                {'error': {'code': 'TOKEN_REQUIRED', 'message': 'Reset token is required'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not new_password or not confirm:
            return Response(
                {'error': {'code': 'PASSWORD_REQUIRED', 'message': 'New password and confirmation are required'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        if new_password != confirm:
            return Response(
                {'error': {'code': 'PASSWORD_MISMATCH', 'message': 'Passwords do not match'}},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.core.cache import cache
        from config.validators import validate_password_strength
        from django.core.exceptions import ValidationError as DjangoValidationError

        try:
            validate_password_strength(new_password)
        except DjangoValidationError as e:
            return Response(
                {'error': {'code': 'WEAK_PASSWORD', 'message': e.message}},
                status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = f'pwd_reset_{token}'
        user_id = cache.get(cache_key)
        if not user_id:
            return Response(
                {'error': {'code': 'INVALID_TOKEN', 'message': 'Reset link is invalid or has expired'}},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': {'code': 'USER_NOT_FOUND', 'message': 'User not found'}},
                status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(new_password)
        user.save()
        cache.delete(cache_key)
        AuditLogger.log_action(user, 'RESET_PASSWORD', 'User', str(user.id))
        return Response({'message': 'Password reset successfully. You can now log in.'})


class PMPendingUsersAPIView(generics.ListAPIView):
    """
    PROJECT_MANAGER: Read-only list of pending user registrations for review.
    Returns all PENDING users excluding ADMIN and PROJECT_MANAGER roles.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsActiveUser]

    def get_queryset(self):
        if self.request.user.role not in ('ADMIN', 'PROJECT_MANAGER'):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only Admin or Project Manager can view pending registrations.')
        qs = User.objects.exclude(role__in=['ADMIN', 'PROJECT_MANAGER'])
        status_filter = self.request.query_params.get('status', 'PENDING')
        if status_filter:
            qs = qs.filter(status=status_filter)
        role_filter = self.request.query_params.get('role')
        if role_filter:
            qs = qs.filter(role=role_filter)
        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(Q(name__icontains=search) | Q(email__icontains=search))
        return qs.order_by('-created_at')


class PMForwardUserAPIView(APIView):
    """
    PROJECT_MANAGER: Review a user registration, add notes, and forward to Admin.
    This creates a notification to all admins with the PM's review notes.
    """
    permission_classes = [IsAuthenticated, IsActiveUser]

    def post(self, request, pk):
        from config.permissions import IsProjectManager
        if request.user.role != 'PROJECT_MANAGER':
            return Response(
                {'error': {'code': 'FORBIDDEN', 'message': 'Only Project Managers can forward registrations'}},
                status=status.HTTP_403_FORBIDDEN
            )
        try:
            user_to_review = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response(
                {'error': {'code': 'NOT_FOUND', 'message': 'User not found'}},
                status=status.HTTP_404_NOT_FOUND
            )

        notes = request.data.get('notes', '').strip()
        if not notes:
            return Response(
                {'error': {'code': 'NOTES_REQUIRED', 'message': 'Review notes are required before forwarding'}},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from childprofile.models_extended import ChildNotification
            admins = User.objects.filter(role='ADMIN', status='ACTIVE')
            for admin in admins:
                ChildNotification.objects.create(
                    child=None,
                    notification_type='USER_REGISTERED',
                    title=f'PM Review: {user_to_review.name} ({user_to_review.role.replace("_", " ")})',
                    message=(
                        f'Project Manager {request.user.name} reviewed the registration of '
                        f'{user_to_review.name} ({user_to_review.email}, {user_to_review.role.replace("_", " ")}) '
                        f'and forwarded for your final decision.\n\nPM Notes: {notes}'
                    ),
                    recipient=admin,
                    related_object_type='User',
                    related_object_id=str(user_to_review.id),
                )
            AuditLogger.log_action(
                request.user, 'PM_FORWARD_USER', 'User', str(user_to_review.id),
                f'PM forwarded to admin: {notes[:80]}'
            )
            return Response({
                'message': f'Registration of {user_to_review.name} forwarded to Admin with your notes.'
            })
        except Exception as e:
            logger.error(f"PM forward user error: {e}", exc_info=True)
            return Response(
                {'error': {'code': 'FORWARD_ERROR', 'message': 'Failed to forward to admin'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SchoolProfileView(APIView):
    """Get, create, or update the school profile for the logged-in SCHOOL user"""
    permission_classes = [IsAuthenticated, IsActiveUser]

    def _get_profile(self, user):
        try:
            return user.school_profile, True
        except Exception:
            return None, False

    def get(self, request):
        profile, exists = self._get_profile(request.user)
        if not exists:
            return Response(
                {'error': {'code': 'NOT_FOUND', 'message': 'School profile not found'}},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(SchoolProfileSerializer(profile).data)

    def post(self, request):
        """Create a school profile (for schools that registered without one)"""
        from .models import SchoolProfile
        _, exists = self._get_profile(request.user)
        if exists:
            return Response(
                {'error': {'code': 'ALREADY_EXISTS', 'message': 'School profile already exists. Use PATCH to update.'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        if request.user.role != 'SCHOOL':
            return Response(
                {'error': {'code': 'FORBIDDEN', 'message': 'Only school accounts can create a school profile'}},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = SchoolProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(
            {'message': 'School profile created', 'data': serializer.data},
            status=status.HTTP_201_CREATED
        )

    def patch(self, request):
        """Update existing school profile, or create if missing (upsert)"""
        from .models import SchoolProfile
        profile, exists = self._get_profile(request.user)
        if not exists:
            # Auto-create on first PATCH too
            serializer = SchoolProfileSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(
                {'message': 'School profile created', 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        try:
            serializer = SchoolProfileSerializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'School profile updated', 'data': serializer.data})
        except Exception as e:
            logger.error(f"School profile update error: {str(e)}")
            return Response(
                {'error': {'code': 'UPDATE_ERROR', 'message': 'Failed to update school profile'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
