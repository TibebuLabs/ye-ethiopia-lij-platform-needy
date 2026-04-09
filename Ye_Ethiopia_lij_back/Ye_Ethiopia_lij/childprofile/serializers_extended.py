from rest_framework import serializers
from .models_extended import (
    ChildEnrollment, SponsorshipPayment, ChildProgressReport,
    DuplicationAlert, ChildNotification, FinancialDocument,
    ProgramMetrics, SystemLog
)


class ChildEnrollmentSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    child_name = serializers.CharField(source='child.full_name', read_only=True)

    class Meta:
        model = ChildEnrollment
        fields = [
            'id', 'child', 'child_name', 'school', 'school_name',
            'enrollment_date', 'grade_level', 'status',
            'enrollment_number', 'class_section', 'enrollment_document',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'school', 'created_at', 'updated_at']
        # school is set in perform_create, so skip the unique_together validator
        # that would fail because school isn't in the request data
        validators = []

    def validate_enrollment_date(self, value):
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError('Enrollment date cannot be in the future')
        return value


class SponsorshipPaymentSerializer(serializers.ModelSerializer):
    sponsor_name = serializers.CharField(source='sponsorship.sponsor.name', read_only=True)
    child_name = serializers.CharField(source='sponsorship.child.full_name', read_only=True)

    class Meta:
        model = SponsorshipPayment
        fields = [
            'id', 'sponsorship', 'sponsor_name', 'child_name',
            'amount', 'payment_date', 'status',
            'payment_method', 'transaction_id', 'receipt', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than 0')
        return value


class ChildProgressReportSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.full_name', read_only=True)
    reported_by_name = serializers.CharField(source='reported_by.name', read_only=True)

    class Meta:
        model = ChildProgressReport
        fields = [
            'id', 'child', 'child_name',
            'academic_progress', 'attendance_progress', 'behavior_progress',
            'overall_progress', 'summary', 'recommendations',
            'reported_by', 'reported_by_name', 'report_date',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'reported_by', 'created_at', 'updated_at']


class DuplicationAlertSerializer(serializers.ModelSerializer):
    primary_child_name = serializers.CharField(source='primary_child.full_name', read_only=True)
    duplicate_child_name = serializers.CharField(source='duplicate_child.full_name', read_only=True)
    resolved_by_name = serializers.CharField(source='resolved_by.name', read_only=True)

    class Meta:
        model = DuplicationAlert
        fields = [
            'id', 'primary_child', 'primary_child_name',
            'duplicate_child', 'duplicate_child_name',
            'similarity_score', 'matching_fields', 'status',
            'resolved_by', 'resolved_by_name', 'resolution_notes',
            'created_at', 'resolved_at',
        ]
        read_only_fields = ['id', 'status', 'resolved_by', 'resolved_at', 'created_at']

    def validate_similarity_score(self, value):
        if not 0 <= value <= 100:
            raise serializers.ValidationError('Similarity score must be between 0 and 100')
        return value


class ChildNotificationSerializer(serializers.ModelSerializer):
    # child may be null for system/org/account notifications
    child_name = serializers.SerializerMethodField()
    recipient_name = serializers.CharField(source='recipient.name', read_only=True)

    def get_child_name(self, obj):
        return obj.child.full_name if obj.child_id else None

    class Meta:
        model = ChildNotification
        fields = [
            'id', 'child', 'child_name',
            'notification_type', 'title', 'message',
            'recipient', 'recipient_name',
            'is_read', 'read_at',
            'related_object_type', 'related_object_id',
            'created_at',
        ]
        read_only_fields = ['id', 'recipient', 'is_read', 'read_at', 'created_at']


class FinancialDocumentSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='sponsorship.child.full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.name', read_only=True)

    class Meta:
        model = FinancialDocument
        fields = [
            'id', 'sponsorship', 'child_name',
            'document_type', 'document_file', 'document_date',
            'status', 'reviewed_by', 'reviewed_by_name',
            'review_notes', 'reviewed_at',
            'amount', 'description',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'reviewed_by', 'reviewed_at', 'created_at', 'updated_at']


class ProgramMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramMetrics
        fields = [
            'id', 'metric_date',
            'total_children_registered', 'total_children_sponsored', 'total_children_unsponsored',
            'total_sponsorships', 'active_sponsorships', 'total_commitment_amount',
            'total_interventions', 'health_interventions', 'education_interventions',
            'nutrition_interventions', 'clothing_interventions',
            'average_attendance_rate', 'average_score',
            'total_organizations', 'active_organizations',
            'total_users', 'total_sponsors', 'total_schools',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SystemLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = SystemLog
        fields = [
            'id', 'log_type', 'user', 'user_name',
            'action', 'resource_type', 'resource_id', 'details',
            'status', 'error_message',
            'ip_address', 'user_agent',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']
