import uuid
from django.db import models
from django.conf import settings


class Organization(models.Model):
    """
    Represents an Orphanage, NGO, or Religion-Based Institution
    that registers and manages child profiles.
    """
    ORG_TYPE_CHOICES = [
        ('ORPHANAGE', 'Orphanage'),
        ('NGO', 'Non-Governmental Organization'),
        ('RELIGIOUS', 'Religion Based Institution'),
        ('OTHER', 'Other'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('ACTIVE', 'Active'),
        ('SUSPENDED', 'Suspended'),
        ('REJECTED', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Linked user account (the staff member who manages this org)
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organization',
        limit_choices_to={'role': 'ORG_STAFF'},
    )

    name = models.CharField(max_length=255)
    org_type = models.CharField(max_length=20, choices=ORG_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    # Contact & location
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    website = models.URLField(blank=True)

    # Documents
    registration_number = models.CharField(max_length=100, unique=True)
    license_document = models.FileField(upload_to='org_documents/licenses/', null=True, blank=True)
    logo = models.ImageField(upload_to='org_documents/logos/', null=True, blank=True)

    # Description
    description = models.TextField(blank=True)
    established_year = models.PositiveIntegerField(null=True, blank=True)

    # Approval
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='approved_organizations',
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.org_type})"

    class Meta:
        indexes = [
            models.Index(fields=['status', 'org_type']),
            models.Index(fields=['owner']),
        ]


class OrganizationReport(models.Model):
    """
    Monthly / quarterly report submitted by an organization
    to track program implementation (UC-07 Receive Report).
    """
    REPORT_PERIOD = [
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('ANNUAL', 'Annual'),
    ]

    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('REVIEWED', 'Reviewed'),
        ('APPROVED', 'Approved'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name='reports'
    )
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='submitted_org_reports'
    )

    title = models.CharField(max_length=255)
    period = models.CharField(max_length=20, choices=REPORT_PERIOD)
    report_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    # Content
    children_count = models.PositiveIntegerField(default=0)
    sponsored_count = models.PositiveIntegerField(default=0)
    interventions_count = models.PositiveIntegerField(default=0)
    summary = models.TextField()
    challenges = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)

    # Attachment
    report_file = models.FileField(upload_to='org_reports/', null=True, blank=True)

    # Review
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='reviewed_org_reports'
    )
    review_notes = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.organization.name} – {self.title} ({self.period})"

    class Meta:
        indexes = [
            models.Index(fields=['organization', 'report_date']),
            models.Index(fields=['status']),
        ]


class ChildSubmissionTracking(models.Model):
    """
    UC-04: Track Submission Status
    Tracks every status change of a child profile submission.
    """
    ACTION_CHOICES = [
        ('SUBMITTED', 'Submitted'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('RESUBMITTED', 'Resubmitted'),
        ('PUBLISHED', 'Published'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    child = models.ForeignKey(
        'childprofile.ChildProfile',
        on_delete=models.CASCADE,
        related_name='submission_tracking'
    )
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name='submission_tracking'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='tracking_actions'
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.child.full_name} – {self.action}"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['child', 'action']),
        ]


class SponsorshipReceived(models.Model):
    """
    UC-06: Receive Sponsorship notification record for the organization.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name='received_sponsorships'
    )
    sponsorship = models.OneToOneField(
        'childprofile.Sponsorship',
        on_delete=models.CASCADE,
        related_name='org_notification'
    )
    is_acknowledged = models.BooleanField(default=False)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organization.name} received sponsorship for {self.sponsorship.child.full_name}"
