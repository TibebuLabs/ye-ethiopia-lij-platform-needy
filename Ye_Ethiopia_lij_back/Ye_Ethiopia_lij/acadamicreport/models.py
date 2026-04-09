from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from childprofile.models import ChildProfile
from config.validators import validate_image_file


class AcademicReport(models.Model):
    TERM_CHOICES = [
        ('TERM_1', 'First Term'),
        ('TERM_2', 'Second Term'),
        ('ANNUAL', 'Annual Result'),
    ]

    child = models.ForeignKey(
        ChildProfile, 
        on_delete=models.CASCADE, 
        related_name='academic_reports'
    )
    
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='submitted_reports'
    )

    school_name = models.CharField(max_length=255)
    academic_year = models.CharField(max_length=20, help_text="e.g., 2016 E.C")
    term = models.CharField(max_length=20, choices=TERM_CHOICES)
    
    # Academic Data
    grade_level = models.CharField(max_length=50, help_text="e.g., Grade 5")
    average_score = models.DecimalField(max_digits=5, decimal_places=2)
    rank = models.PositiveIntegerField(null=True, blank=True)
    attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage")
    
    # Documentation
    report_card_image = models.ImageField(upload_to='academic_reports/', null=True, blank=True)
    teacher_comments = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.child.full_name} - {self.academic_year} ({self.term})"

    def clean(self):
        if self.average_score < 0 or self.average_score > 100:
            raise ValidationError({'average_score': 'Score must be between 0 and 100'})
        
        if self.attendance_rate < 0 or self.attendance_rate > 100:
            raise ValidationError({'attendance_rate': 'Attendance must be between 0 and 100'})
        
        if self.report_card_image:
            validate_image_file(self.report_card_image)

    class Meta:
        indexes = [
            models.Index(fields=['child', 'academic_year']),
            models.Index(fields=['reported_by']),
        ]
        unique_together = ['child', 'academic_year', 'term']