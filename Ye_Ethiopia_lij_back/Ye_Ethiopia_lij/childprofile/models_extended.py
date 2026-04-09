"""
Extended Child Profile Models for Complete Use Case Coverage
"""
import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from config.validators import validate_image_file, validate_document_file


class ChildEnrollment(models.Model):
    """UC-17: Enroll child in school"""
    ENROLLMENT_STATUS = [
        ('PENDING', 'Pending Enrollment'),
        ('ENROLLED', 'Currently Enrolled'),
        ('GRADUATED', 'Graduated'),
        ('DROPPED', 'Dropped Out'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    child = models.ForeignKey(
        'childprofile.ChildProfile',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    school = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrolled_children',
        limit_choices_to={'role': 'SCHOOL'}
    )
    enrollment_date = models.DateField()
    grade_level = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=ENROLLMENT_STATUS, default='ENROLLED')
    
    # Enrollment details
    enrollment_number = models.CharField(max_length=100, unique=True)
    class_section = models.CharField(max_length=50, blank=True)
    enrollment_document = models.FileField(upload_to='enrollments/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.child.full_name} - {self.school.name} ({self.status})"

    class Meta:
        unique_together = ['child', 'school', 'enrollment_date']
        indexes = [
            models.Index(fields=['child', 'status']),
            models.Index(fields=['school']),
        ]


class SponsorshipPayment(models.Model):
    """Track sponsorship payments"""
    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sponsorship = models.ForeignKey(
        'childprofile.Sponsorship',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='PENDING')
    
    # Payment details
    payment_method = models.CharField(max_length=50)  # e.g., BANK_TRANSFER, CARD, CASH
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    receipt = models.FileField(upload_to='payment_receipts/', null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount}"

    class Meta:
        indexes = [
            models.Index(fields=['sponsorship', 'payment_date']),
            models.Index(fields=['status']),
        ]


class ChildProgressReport(models.Model):
    """UC-15: View child academic status - Progress tracking"""
    PROGRESS_LEVEL = [
        ('EXCELLENT', 'Excellent'),
        ('GOOD', 'Good'),
        ('SATISFACTORY', 'Satisfactory'),
        ('NEEDS_IMPROVEMENT', 'Needs Improvement'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    child = models.ForeignKey(
        'childprofile.ChildProfile',
        on_delete=models.CASCADE,
        related_name='progress_reports'
    )
    
    # Academic progress
    academic_progress = models.CharField(max_length=20, choices=PROGRESS_LEVEL)
    attendance_progress = models.CharField(max_length=20, choices=PROGRESS_LEVEL)
    behavior_progress = models.CharField(max_length=20, choices=PROGRESS_LEVEL)
    
    # Overall assessment
    overall_progress = models.CharField(max_length=20, choices=PROGRESS_LEVEL)
    summary = models.TextField()
    recommendations = models.TextField()
    
    # Reporting
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='progress_reports_created'
    )
    report_date = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Progress Report - {self.child.full_name} ({self.report_date})"

    class Meta:
        indexes = [
            models.Index(fields=['child', 'report_date']),
        ]


class DuplicationAlert(models.Model):
    """UC-11: Resolve duplication alert"""
    ALERT_STATUS = [
        ('PENDING', 'Pending Review'),
        ('CONFIRMED', 'Confirmed Duplicate'),
        ('FALSE_POSITIVE', 'False Positive'),
        ('MERGED', 'Merged'),
        ('RESOLVED', 'Resolved'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    primary_child = models.ForeignKey(
        'childprofile.ChildProfile',
        on_delete=models.CASCADE,
        related_name='duplication_alerts_primary'
    )
    duplicate_child = models.ForeignKey(
        'childprofile.ChildProfile',
        on_delete=models.CASCADE,
        related_name='duplication_alerts_duplicate'
    )
    
    # Alert details
    similarity_score = models.FloatField()  # 0-100
    matching_fields = models.JSONField()  # Fields that match
    status = models.CharField(max_length=20, choices=ALERT_STATUS, default='PENDING')
    
    # Resolution
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_duplications'
    )
    resolution_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Duplication Alert: {self.primary_child.full_name} vs {self.duplicate_child.full_name}"

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]


class ChildNotification(models.Model):
    """
    Unified notification model.
    child is nullable — system/account/org notifications set child=None.
    """
    NOTIFICATION_TYPE = [
        # Child-related
        ('PROFILE_APPROVED', 'Profile Approved'),
        ('PROFILE_REJECTED', 'Profile Rejected'),
        ('SPONSORED', 'Child Sponsored'),
        ('INTERVENTION_ADDED', 'Intervention Added'),
        ('REPORT_SUBMITTED', 'Report Submitted'),
        ('STATUS_UPDATED', 'Status Updated'),
        # Account / system
        ('USER_REGISTERED', 'User Registered'),
        ('ACCOUNT_APPROVED', 'Account Approved'),
        ('ACCOUNT_REJECTED', 'Account Rejected'),
        ('ACCOUNT_SUSPENDED', 'Account Suspended'),
        # Organization
        ('ORG_CREATED', 'Organization Created'),
        ('ORG_APPROVED', 'Organization Approved'),
        ('ORG_REJECTED', 'Organization Rejected'),
        # School
        ('SCHOOL_PROFILE_CREATED', 'School Profile Created'),
        ('SCHOOL_PROFILE_UPDATED', 'School Profile Updated'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # nullable so non-child events (user/org/school) can omit it
    child = models.ForeignKey(
        'childprofile.ChildProfile',
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True,
        blank=True,
    )

    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE)
    title = models.CharField(max_length=255)
    message = models.TextField()

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_notifications'
    )

    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    related_object_type = models.CharField(max_length=50, blank=True)
    related_object_id = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        child_name = self.child.full_name if self.child_id else '—'
        return f"{self.notification_type} - {child_name}"

    class Meta:
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['created_at']),
        ]


class FinancialDocument(models.Model):
    """UC-19: Review financial document"""
    DOCUMENT_TYPE = [
        ('SPONSORSHIP_AGREEMENT', 'Sponsorship Agreement'),
        ('PAYMENT_RECEIPT', 'Payment Receipt'),
        ('BANK_STATEMENT', 'Bank Statement'),
        ('INVOICE', 'Invoice'),
        ('REPORT', 'Financial Report'),
    ]

    DOCUMENT_STATUS = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sponsorship = models.ForeignKey(
        'childprofile.Sponsorship',
        on_delete=models.CASCADE,
        related_name='financial_documents'
    )
    
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE)
    document_file = models.FileField(upload_to='financial_documents/')
    document_date = models.DateField()
    
    # Review
    status = models.CharField(max_length=20, choices=DOCUMENT_STATUS, default='PENDING')
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_financial_documents'
    )
    review_notes = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.document_type} - {self.sponsorship.child.full_name}"

    class Meta:
        indexes = [
            models.Index(fields=['sponsorship', 'status']),
            models.Index(fields=['document_date']),
        ]


class ProgramMetrics(models.Model):
    """UC-07: Monitor implementation program"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Metrics date
    metric_date = models.DateField(unique=True)
    
    # Child metrics
    total_children_registered = models.IntegerField(default=0)
    total_children_sponsored = models.IntegerField(default=0)
    total_children_unsponsored = models.IntegerField(default=0)
    
    # Sponsorship metrics
    total_sponsorships = models.IntegerField(default=0)
    active_sponsorships = models.IntegerField(default=0)
    total_commitment_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Intervention metrics
    total_interventions = models.IntegerField(default=0)
    health_interventions = models.IntegerField(default=0)
    education_interventions = models.IntegerField(default=0)
    nutrition_interventions = models.IntegerField(default=0)
    clothing_interventions = models.IntegerField(default=0)
    
    # Academic metrics
    average_attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Organization metrics
    total_organizations = models.IntegerField(default=0)
    active_organizations = models.IntegerField(default=0)
    
    # User metrics
    total_users = models.IntegerField(default=0)
    total_sponsors = models.IntegerField(default=0)
    total_schools = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Program Metrics - {self.metric_date}"

    class Meta:
        ordering = ['-metric_date']
        indexes = [
            models.Index(fields=['metric_date']),
        ]


class SystemLog(models.Model):
    """System activity logging for monitoring"""
    LOG_TYPE = [
        ('USER_ACTION', 'User Action'),
        ('SYSTEM_EVENT', 'System Event'),
        ('ERROR', 'Error'),
        ('SECURITY', 'Security Event'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    log_type = models.CharField(max_length=50, choices=LOG_TYPE)
    
    # User info
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='system_logs'
    )
    
    # Log details
    action = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=100, blank=True)
    resource_id = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=dict)
    
    # Status
    status = models.CharField(max_length=50)  # SUCCESS, FAILED, etc.
    error_message = models.TextField(blank=True)
    
    # IP and user agent
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.log_type} - {self.action}"

    class Meta:
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['log_type']),
            models.Index(fields=['created_at']),
        ]
