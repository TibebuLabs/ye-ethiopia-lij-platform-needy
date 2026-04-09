from rest_framework import serializers
from django.utils import timezone
from .models import Organization, OrganizationReport, ChildSubmissionTracking, SponsorshipReceived


# ── Organization ─────────────────────────────────────────────────────────────
class OrganizationSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.name', read_only=True)
    children_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            'id', 'owner', 'owner_name', 'owner_email',
            'name', 'org_type', 'status',
            'address', 'city', 'phone', 'email', 'website',
            'registration_number', 'license_document', 'logo',
            'description', 'established_year',
            'approved_by', 'approved_by_name', 'approved_at', 'rejection_reason',
            'children_count', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'owner', 'status', 'approved_by', 'approved_at',
            'rejection_reason', 'created_at', 'updated_at',
        ]

    def get_children_count(self, obj) -> int:
        return obj.owner.registered_children.count()

    def validate_established_year(self, value):
        current_year = timezone.now().year
        if value and (value < 1900 or value > current_year):
            raise serializers.ValidationError(f'Year must be between 1900 and {current_year}')
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            if instance.logo:
                rep['logo'] = request.build_absolute_uri(instance.logo.url)
            if instance.license_document:
                rep['license_document'] = request.build_absolute_uri(instance.license_document.url)
        return rep


class OrganizationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views — includes all fields needed for admin modal."""
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    verification_document = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'org_type', 'status',
            'address', 'city', 'phone', 'email', 'website',
            'registration_number', 'license_document', 'logo',
            'description', 'established_year',
            'owner_name', 'owner_email', 'verification_document',
            'created_at',
        ]

    def get_verification_document(self, obj):
        """Return the owner's verification document URL if present."""
        request = self.context.get('request')
        doc = getattr(obj.owner, 'verification_document', None)
        if doc and request:
            return request.build_absolute_uri(doc.url)
        return None

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            if instance.logo:
                rep['logo'] = request.build_absolute_uri(instance.logo.url)
            if instance.license_document:
                rep['license_document'] = request.build_absolute_uri(instance.license_document.url)
        return rep


# ── Organization Report ───────────────────────────────────────────────────────
class OrganizationReportSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.name', read_only=True)

    class Meta:
        model = OrganizationReport
        fields = [
            'id', 'organization', 'organization_name',
            'submitted_by', 'submitted_by_name',
            'title', 'period', 'report_date', 'status',
            'children_count', 'sponsored_count', 'interventions_count',
            'summary', 'challenges', 'recommendations',
            'report_file',
            'reviewed_by', 'reviewed_by_name', 'review_notes', 'reviewed_at',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'submitted_by', 'status', 'reviewed_by',
            'reviewed_at', 'created_at', 'updated_at',
        ]

    def validate_report_date(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError('Report date cannot be in the future')
        return value

    def validate_children_count(self, value):
        if value < 0:
            raise serializers.ValidationError('Count cannot be negative')
        return value


# ── Submission Tracking ───────────────────────────────────────────────────────
class ChildSubmissionTrackingSerializer(serializers.ModelSerializer):
    child_name = serializers.CharField(source='child.full_name', read_only=True)
    child_status = serializers.CharField(source='child.status', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    performed_by_name = serializers.CharField(source='performed_by.name', read_only=True)

    class Meta:
        model = ChildSubmissionTracking
        fields = [
            'id', 'child', 'child_name', 'child_status',
            'organization', 'organization_name',
            'action', 'performed_by', 'performed_by_name',
            'notes', 'created_at',
        ]
        read_only_fields = ['id', 'performed_by', 'created_at']

# ── Sponsorship Received ──────────────────────────────────────────────────────
class SponsorshipReceivedSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    child_name = serializers.CharField(source='sponsorship.child.full_name', read_only=True)
    sponsor_name = serializers.CharField(source='sponsorship.sponsor.name', read_only=True)
    commitment_amount = serializers.DecimalField(
        source='sponsorship.commitment_amount',
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = SponsorshipReceived
        fields = [
            'id', 'organization', 'organization_name',
            'sponsorship', 'child_name', 'sponsor_name', 'commitment_amount',
            'is_acknowledged', 'acknowledged_at', 'notes',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
