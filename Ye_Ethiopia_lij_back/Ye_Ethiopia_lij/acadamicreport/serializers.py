from rest_framework import serializers
from .models import AcademicReport
from childprofile.models import ChildProfile


class AcademicReportSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True, help_text="The unique ID of the report")
    child_name = serializers.ReadOnlyField(source='child.full_name')
    reported_by_name = serializers.ReadOnlyField(source='reported_by.name')
    reported_by = serializers.PrimaryKeyRelatedField(read_only=True)
    
    child = serializers.PrimaryKeyRelatedField(queryset=ChildProfile.objects.all())

    class Meta:
        model = AcademicReport
        fields = [
            'id', 'child', 'child_name', 'reported_by', 'reported_by_name',
            'school_name', 'academic_year', 'term', 'grade_level', 
            'average_score', 'rank', 'attendance_rate', 'report_card_image',
            'teacher_comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reported_by', 'created_at', 'updated_at']

    def validate_average_score(self, value):
        try:
            score = float(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Average score must be a number")
            
        if score < 0 or score > 100:
            raise serializers.ValidationError("Score must be between 0 and 100")
        
        return value

    def validate_attendance_rate(self, value):
        try:
            rate = float(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Attendance rate must be a number")
        
        if rate < 0 or rate > 100:
            raise serializers.ValidationError("Attendance rate must be between 0 and 100")
        
        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.report_card_image:
            rep['report_card_image'] = request.build_absolute_uri(instance.report_card_image.url)
        return rep