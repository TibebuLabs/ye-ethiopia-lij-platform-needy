import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from config.validators import validate_image_file, validate_document_file


class ChildProfile(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending (Waiting for Admin)'),
        ('PUBLISHED', 'Published (Visible to Sponsors)'),
        ('SPONSORED', 'Sponsored (Fully supported)'),
        ('REJECTED', 'Rejected'),
    ]

    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255, help_text="Full legal name used for verification")
    age = models.PositiveIntegerField(help_text="Current age of the child")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    location = models.CharField(max_length=255, help_text="Specific area or address")
    biography = models.TextField(help_text="Personal background and life story")
    vulnerability_status = models.CharField(max_length=255, help_text="e.g., street child, orphan")
    guardian_info = models.TextField(help_text="Name and contact details of the legal guardian")
    
    # File Storage with validation
    photo = models.ImageField(upload_to='children/photos/', null=True, blank=True)
    supporting_docs = models.FileField(upload_to='children/documents/', null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    rejection_reason = models.TextField(blank=True, default='')
    pm_notes = models.TextField(blank=True, default='', help_text='Project Manager review notes for admin')

    organization = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='registered_children',
        help_text="The NGO or Orphanage staff who registered this child"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.full_name} ({self.status})"

    def clean(self):
        if self.age < 0 or self.age > 18:
            raise ValidationError({'age': 'Child age must be between 0 and 18'})
        
        if self.photo:
            validate_image_file(self.photo)
        
        if self.supporting_docs:
            validate_document_file(self.supporting_docs)

    class Meta:
        verbose_name = "Child Profile"
        verbose_name_plural = "Child Profiles"


class Sponsorship(models.Model):
    PAYMENT_PROVIDERS = [
        ('TELEBIRR', 'Telebirr'),
        ('CBE', 'Commercial Bank of Ethiopia'),
        ('BANK', 'Other Bank Transfer'),
    ]

    VERIFICATION_STATUS = [
        ('PENDING', 'Pending Manual Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]

    sponsor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sponsorships'
    )
    child = models.OneToOneField(ChildProfile, on_delete=models.CASCADE, related_name='sponsorship')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    commitment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=False)  # only True after admin verifies

    # Payment proof
    payment_provider = models.CharField(max_length=20, choices=PAYMENT_PROVIDERS, null=True, blank=True)
    payment_proof = models.ImageField(upload_to='sponsorships/proofs/', null=True, blank=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='PENDING')
    verification_notes = models.TextField(blank=True, default='')
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='verified_sponsorships'
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.sponsor.email} sponsoring {self.child.full_name} [{self.verification_status}]"

    class Meta:
        indexes = [
            models.Index(fields=['sponsor', 'is_active']),
        ]


class InterventionLog(models.Model):
    INTERVENTION_TYPES = [
        ('HEALTH', 'Healthcare'),
        ('EDUCATION', 'Education'),
        ('NUTRITION', 'Nutrition'),
        ('CLOTHING', 'Clothing/Shelter'),
    ]
    
    child = models.ForeignKey(ChildProfile, on_delete=models.CASCADE, related_name='interventions')
    type = models.CharField(max_length=50, choices=INTERVENTION_TYPES)
    description = models.TextField()
    date_provided = models.DateField()
    receipt_image = models.ImageField(upload_to='interventions/receipts/', null=True, blank=True)
    recorded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.type} for {self.child.full_name}"

    def clean(self):
        if self.receipt_image:
            validate_image_file(self.receipt_image)

    class Meta:
        indexes = [
            models.Index(fields=['date_provided']),
        ]