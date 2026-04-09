from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class APIException(Exception):
    """Base API exception"""
    def __init__(self, message, code=None, status_code=status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.code = code or 'API_ERROR'
        self.status_code = status_code
        super().__init__(self.message)


class ValidationException(APIException):
    """Raised when input validation fails"""
    def __init__(self, message, code='VALIDATION_ERROR'):
        super().__init__(message, code, status.HTTP_400_BAD_REQUEST)


class AuthenticationException(APIException):
    """Raised when authentication fails"""
    def __init__(self, message, code='AUTH_ERROR'):
        super().__init__(message, code, status.HTTP_401_UNAUTHORIZED)


class PermissionException(APIException):
    """Raised when user lacks permission"""
    def __init__(self, message, code='PERMISSION_DENIED'):
        super().__init__(message, code, status.HTTP_403_FORBIDDEN)


class ResourceNotFoundException(APIException):
    """Raised when resource not found"""
    def __init__(self, message, code='NOT_FOUND'):
        super().__init__(message, code, status.HTTP_404_NOT_FOUND)


class ConflictException(APIException):
    """Raised on resource conflict"""
    def __init__(self, message, code='CONFLICT'):
        super().__init__(message, code, status.HTTP_409_CONFLICT)


def custom_exception_handler(exc, context):
    """Custom exception handler for DRF"""
    # Let DRF handle its own exceptions first (ValidationError, AuthenticationFailed, etc.)
    response = exception_handler(exc, context)

    # Handle our custom APIException subclasses
    if isinstance(exc, APIException):
        return Response({
            'error': {
                'code': exc.code,
                'message': exc.message,
            }
        }, status=exc.status_code)

    # If DRF already handled it, return as-is
    if response is not None:
        return response

    # Truly unhandled exception — log and return 500
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return Response({
        'error': {
            'code': 'INTERNAL_ERROR',
            'message': str(exc) if settings.DEBUG else 'An unexpected error occurred',
        }
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
