from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, SchoolProfile
from config.validators import validate_password_strength


class SchoolProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolProfile
        fields = [
            'school_name', 'school_type', 'registration_number',
            'address', 'city', 'region', 'phone',
            'principal_name', 'established_year', 'description',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class InlineOrganizationSerializer(serializers.Serializer):
    """Minimal org data embedded in UserSerializer to avoid circular imports."""
    id = serializers.CharField()
    name = serializers.CharField()
    org_type = serializers.CharField()
    status = serializers.CharField()
    address = serializers.CharField()
    city = serializers.CharField()
    phone = serializers.CharField()
    email = serializers.CharField()
    website = serializers.CharField()
    registration_number = serializers.CharField()
    description = serializers.CharField()
    established_year = serializers.IntegerField(allow_null=True)
    license_document = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField()

    def get_license_document(self, obj):
        request = self.context.get('request')
        if obj.license_document and request:
            return request.build_absolute_uri(obj.license_document.url)
        return None

    def get_logo(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


class UserSerializer(serializers.ModelSerializer):
    school_profile = SchoolProfileSerializer(read_only=True)
    organization = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'role', 'status', 'is_active',
            'created_at', 'email_verified',
            'school_profile', 'verification_document', 'organization',
        ]
        read_only_fields = ['id', 'created_at', 'email_verified']

    def get_organization(self, instance):
        if instance.role != 'ORG_STAFF':
            return None
        try:
            from organization.models import Organization
            org = Organization.objects.get(owner=instance)
            return InlineOrganizationSerializer(org, context=self.context).data
        except Exception:
            return None

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.verification_document:
            rep['verification_document'] = request.build_absolute_uri(instance.verification_document.url)
        return rep


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    verification_document = serializers.FileField(required=False, allow_null=True)

    # School-specific fields (only used when role=SCHOOL)
    school_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    school_type = serializers.CharField(required=False, allow_blank=True, write_only=True)
    registration_number = serializers.CharField(required=False, allow_blank=True, write_only=True)
    address = serializers.CharField(required=False, allow_blank=True, write_only=True)
    city = serializers.CharField(required=False, allow_blank=True, write_only=True)
    region = serializers.CharField(required=False, allow_blank=True, write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)
    principal_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    established_year = serializers.CharField(required=False, allow_blank=True, write_only=True)
    description = serializers.CharField(required=False, allow_blank=True, write_only=True)

    # Organization-specific fields (only used when role=ORG_STAFF)
    org_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_type = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_registration_number = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_address = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_city = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_phone = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_email = serializers.EmailField(required=False, allow_blank=True, write_only=True)
    org_website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_established_year = serializers.CharField(required=False, allow_blank=True, write_only=True)
    org_description = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'name', 'role', 'password', 'password_confirm',
            'verification_document',
            # school
            'school_name', 'school_type', 'registration_number',
            'address', 'city', 'region', 'phone',
            'principal_name', 'established_year', 'description',
            # org
            'org_name', 'org_type', 'org_registration_number',
            'org_address', 'org_city', 'org_phone', 'org_email',
            'org_website', 'org_established_year', 'org_description',
        ]

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match'})

        try:
            validate_password_strength(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': e.message})

        role = data.get('role', '')

        # Only one ADMIN allowed system-wide
        if role == 'ADMIN':
            if User.objects.filter(role='ADMIN').exists():
                raise serializers.ValidationError(
                    {'role': 'A System Administrator account already exists. Only one is allowed.'}
                )

        # Verification document required for non-admin roles
        if role != 'ADMIN' and not data.get('verification_document'):
            raise serializers.ValidationError(
                {'verification_document': 'Verification document is required'}
            )

        if role == 'SCHOOL' and not data.get('school_name', '').strip():
            raise serializers.ValidationError({'school_name': 'School name is required for school accounts'})

        if role == 'ORG_STAFF' and not data.get('org_name', '').strip():
            raise serializers.ValidationError({'org_name': 'Organization name is required for organization accounts'})

        return data

    def create(self, validated_data):
        # Pull out school fields
        school_fields = {
            'school_name':         validated_data.pop('school_name', ''),
            'school_type':         validated_data.pop('school_type', 'PRIMARY'),
            'registration_number': validated_data.pop('registration_number', ''),
            'address':             validated_data.pop('address', ''),
            'city':                validated_data.pop('city', ''),
            'region':              validated_data.pop('region', ''),
            'phone':               validated_data.pop('phone', ''),
            'principal_name':      validated_data.pop('principal_name', ''),
            'established_year':    validated_data.pop('established_year', ''),
            'description':         validated_data.pop('description', ''),
        }
        # Pull out org fields
        org_fields = {
            'name':                validated_data.pop('org_name', ''),
            'org_type':            validated_data.pop('org_type', 'OTHER'),
            'registration_number': validated_data.pop('org_registration_number', ''),
            'address':             validated_data.pop('org_address', ''),
            'city':                validated_data.pop('org_city', ''),
            'phone':               validated_data.pop('org_phone', ''),
            'email':               validated_data.pop('org_email', ''),
            'website':             validated_data.pop('org_website', ''),
            'established_year':    validated_data.pop('org_established_year', None) or None,
            'description':         validated_data.pop('org_description', ''),
        }
        validated_data.pop('password_confirm')
        # verification_document stays in validated_data → saved to User model
        user = User.objects.create_user(**validated_data)

        # System admin is auto-activated — no approval needed
        if user.role == 'ADMIN':
            user.status = 'ACTIVE'
            user.save(update_fields=['status'])

        # Create school profile if role is SCHOOL
        if user.role == 'SCHOOL' and school_fields.get('school_name'):
            SchoolProfile.objects.create(user=user, **school_fields)

        # Create organization if role is ORG_STAFF
        if user.role == 'ORG_STAFF' and org_fields.get('name'):
            from organization.models import Organization
            # established_year must be int or None
            est = org_fields.get('established_year')
            try:
                org_fields['established_year'] = int(est) if est else None
            except (ValueError, TypeError):
                org_fields['established_year'] = None
            # registration_number must be unique — use email as fallback if blank
            if not org_fields.get('registration_number'):
                org_fields['registration_number'] = f'ORG-{user.id}'
            Organization.objects.create(owner=user, **org_fields)

        return user


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=8, write_only=True)
    new_password_confirm = serializers.CharField(required=True, min_length=8, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match'})
        
        try:
            validate_password_strength(data['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': e.message})
        
        return data


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match'})
        
        try:
            validate_password_strength(data['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': e.message})
        
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
