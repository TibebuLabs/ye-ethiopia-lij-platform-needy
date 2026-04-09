from rest_framework import serializers
from .models import ChildProfile, Sponsorship, InterventionLog


# ── Lightweight list serializer (no heavy nesting) ──────────────────────────
class ChildProfileListSerializer(serializers.ModelSerializer):
    """Used for public browse list – minimal fields, fast."""
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = ChildProfile
        fields = [
            'id', 'full_name', 'age', 'gender', 'location',
            'vulnerability_status', 'photo', 'status', 'rejection_reason',
            'pm_notes', 'organization_name', 'created_at',
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.photo:
            rep['photo'] = request.build_absolute_uri(instance.photo.url)
        return rep


# ── Full detail serializer ───────────────────────────────────────────────────
class ChildProfileSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = ChildProfile
        fields = [
            'id', 'full_name', 'age', 'gender', 'location',
            'biography', 'vulnerability_status', 'guardian_info',
            'photo', 'supporting_docs', 'status', 'rejection_reason',
            'pm_notes',
            'organization', 'organization_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'organization', 'rejection_reason', 'pm_notes', 'created_at', 'updated_at']

    def validate_age(self, value):
        if value < 0 or value > 18:
            raise serializers.ValidationError('Child age must be between 0 and 18')
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            if instance.photo:
                rep['photo'] = request.build_absolute_uri(instance.photo.url)
            if instance.supporting_docs:
                rep['supporting_docs'] = request.build_absolute_uri(instance.supporting_docs.url)
        return rep


# ── Intervention Log ─────────────────────────────────────────────────────────
class InterventionLogSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    recorded_by_name = serializers.CharField(source='recorded_by.name', read_only=True)
    child_name = serializers.CharField(source='child.full_name', read_only=True)

    class Meta:
        model = InterventionLog
        fields = [
            'id', 'child', 'child_name', 'type', 'description',
            'date_provided', 'receipt_image',
            'recorded_by', 'recorded_by_name', 'created_at',
        ]
        read_only_fields = ['id', 'recorded_by', 'created_at']

    def validate_date_provided(self, value):
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError('Date cannot be in the future')
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.receipt_image:
            rep['receipt_image'] = request.build_absolute_uri(instance.receipt_image.url)
        return rep


# ── Sponsorship ──────────────────────────────────────────────────────────────
class SponsorshipSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    sponsor_name = serializers.CharField(source='sponsor.name', read_only=True)
    child_name = serializers.CharField(source='child.full_name', read_only=True)
    child_photo = serializers.ImageField(source='child.photo', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.name', read_only=True)

    class Meta:
        model = Sponsorship
        fields = [
            'id', 'sponsor', 'sponsor_name',
            'child', 'child_name', 'child_photo',
            'start_date', 'end_date', 'commitment_amount', 'is_active',
            'payment_provider', 'payment_proof',
            'verification_status', 'verification_notes',
            'verified_by', 'verified_by_name', 'verified_at',
            'created_at',
        ]
        read_only_fields = ['id', 'start_date', 'sponsor', 'child', 'is_active',
                            'verification_status', 'verified_by', 'verified_at', 'created_at']

    def validate_commitment_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Commitment amount must be greater than 0')
        return value

    def validate_payment_proof(self, value):
        if value:
            allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
            if hasattr(value, 'content_type') and value.content_type not in allowed:
                raise serializers.ValidationError('Only image files (JPG, PNG, GIF, WEBP) or PDF are allowed.')
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            if instance.child.photo:
                rep['child_photo'] = request.build_absolute_uri(instance.child.photo.url)
            if instance.payment_proof:
                rep['payment_proof'] = request.build_absolute_uri(instance.payment_proof.url)
        # Normalize NULL verification_status (old records) to PENDING
        if not rep.get('verification_status'):
            rep['verification_status'] = 'PENDING'
        return rep
