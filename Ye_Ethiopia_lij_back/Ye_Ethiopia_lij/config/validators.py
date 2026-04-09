import os
from django.core.exceptions import ValidationError
from django.conf import settings


def validate_file_extension(file, allowed_extensions):
    """Validate file extension"""
    ext = os.path.splitext(file.name)[1][1:].lower()
    if ext not in allowed_extensions:
        raise ValidationError(
            f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}'
        )


def validate_file_size(file, max_size_mb=5):
    """Validate file size"""
    if file.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f'File size must not exceed {max_size_mb}MB')


def validate_image_file(file):
    """Validate image file"""
    validate_file_extension(file, settings.ALLOWED_IMAGE_EXTENSIONS)
    validate_file_size(file, 5)


def validate_document_file(file):
    """Validate document file"""
    validate_file_extension(file, settings.ALLOWED_DOCUMENT_EXTENSIONS)
    validate_file_size(file, 10)


def validate_password_strength(password):
    """Validate password meets minimum requirements"""
    if len(password) < 8:
        raise ValidationError('Password must be at least 8 characters long')
    
    if not any(char.isupper() for char in password):
        raise ValidationError('Password must contain at least one uppercase letter')
    
    if not any(char.isdigit() for char in password):
        raise ValidationError('Password must contain at least one digit')
    
    if not any(char in '!@#$%^&*()_+-=[]{}|;:,.<>?' for char in password):
        raise ValidationError('Password must contain at least one special character')
