from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
import uuid
import logging

logger = logging.getLogger(__name__)


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not password:
            raise ValueError('Password is required')
        
        email = self.normalize_email(email)
        
        # Validate password strength
        if len(password) < 8:
            raise ValidationError('Password must be at least 8 characters')
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        logger.info(f"User created: {email}")
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('status', 'ACTIVE')
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('ADMIN', 'System Administrator'),
        ('PROJECT_MANAGER', 'Project Manager'),
        ('ORG_STAFF', 'Organization Staff'),
        ('SPONSOR', 'Sponsor'),
        ('SCHOOL', 'School'),
        ('GOVERNMENT', 'Government Body'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('ACTIVE', 'Active'),
        ('SUSPENDED', 'Suspended'),
        ('REJECTED', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(max_length=20, default='PENDING', choices=STATUS_CHOICES)

    # Verification document uploaded at registration (ID, license, letter, etc.)
    verification_document = models.FileField(
        upload_to='accounts/verification/', null=True, blank=True
    )
    
    # Security fields
    last_login = models.DateTimeField(null=True, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role']

    def __str__(self):
        return f"{self.name} ({self.role})"

    def save(self, *args, **kwargs):
        if self.status != 'ACTIVE':
            self.is_active = False
        else:
            self.is_active = True
        super().save(*args, **kwargs)
    
    def is_account_locked(self):
        """Check if account is locked"""
        from django.utils import timezone
        if self.locked_until and self.locked_until > timezone.now():
            return True
        return False
    
    def record_failed_login(self):
        """Record failed login attempt"""
        from django.utils import timezone
        from datetime import timedelta

        if self.failed_login_attempts is None:
            self.failed_login_attempts = 0
        self.failed_login_attempts += 1

        # Lock account after 5 failed attempts for 30 minutes
        if self.failed_login_attempts >= 5:
            self.locked_until = timezone.now() + timedelta(minutes=30)
            logger.warning(f"Account locked: {self.email}")

        self.save(update_fields=['failed_login_attempts', 'locked_until'])

    def reset_failed_login(self):
        """Reset failed login counter on successful login"""
        self.failed_login_attempts = 0
        self.locked_until = None
        self.save(update_fields=['failed_login_attempts', 'locked_until'])


class SchoolProfile(models.Model):
    """Extra details for users with role=SCHOOL"""
    SCHOOL_TYPE_CHOICES = [
        ('PRIMARY', 'Primary School'),
        ('SECONDARY', 'Secondary School'),
        ('PREPARATORY', 'Preparatory School'),
        ('COMBINED', 'Combined (1–12)'),
        ('VOCATIONAL', 'Vocational / TVET'),
        ('OTHER', 'Other'),
    ]

    user = models.OneToOneField(
        'User', on_delete=models.CASCADE, related_name='school_profile'
    )
    school_name = models.CharField(max_length=255)
    school_type = models.CharField(max_length=20, choices=SCHOOL_TYPE_CHOICES, default='PRIMARY')
    registration_number = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    principal_name = models.CharField(max_length=255, blank=True)
    established_year = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.school_name} ({self.user.email})"
