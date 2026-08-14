from rest_framework import serializers
from .models import Program, CampusCrewRegistration



class ProgramListSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="name")
    program_type = serializers.CharField(source="course_type")
    is_accepting = serializers.BooleanField(read_only=True)
    registration_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Program
        fields = [
            "id", "title", "slug", "program_type", "image",
            "duration", "stipend", "location", "is_remote",
            "application_deadline", "start_date",
            "is_featured", "registration_count", "is_accepting",
        ]


class ProgramDetailSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="name")
    program_type = serializers.CharField(source="course_type")
    is_accepting = serializers.BooleanField(read_only=True)
    registration_count = serializers.IntegerField(read_only=True)
    spots_left = serializers.IntegerField(read_only=True)

    class Meta:
        model = Program
        fields = [
            "id", "title", "slug", "program_type", "image", "banner",
            "description", "duration", "stipend", "location", "is_remote",
            "eligibility_criteria", "min_degree_level", "eligible_branches",
            "application_deadline", "start_date", "end_date",
            "capacity", "is_featured",
            "registration_count", "spots_left", "is_accepting",
            "created_at",
        ]


class ProgramCreateUpdateSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="name")
    program_type = serializers.CharField(source="course_type")

    class Meta:
        model = Program
        fields = [
            "title", "description", "image", "banner", "program_type",
            "duration", "stipend", "location", "is_remote",
            "eligibility_criteria", "min_degree_level", "eligible_branches",
            "application_deadline", "start_date", "end_date",
            "capacity", "is_published", "is_featured",
        ]


class CampusCrewStudentSerializer(serializers.ModelSerializer):
    website_hp = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = CampusCrewRegistration
        fields = [
            "full_name",
            "email",
            "phone",
            "college_name",
            "department",
            "year_of_study",
            "student_primary_interest",
            "privacy_acknowledged",
            "city",
            "whatsapp_opt_in",
            "website_hp",
        ]

    def validate_website_hp(self, value):
        if value:
            raise serializers.ValidationError("Bot submission detected.")
        return value

    def validate_full_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Full name is required.")
        return cleaned

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Mobile number is required.")
        return cleaned

    def validate_privacy_acknowledged(self, value):
        if not value:
            raise serializers.ValidationError("You must acknowledge the Privacy Policy to proceed.")
        return value


class CampusCrewCollegeSerializer(serializers.ModelSerializer):
    website_hp = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = CampusCrewRegistration
        fields = [
            "institution_name",
            "full_name",
            "designation",
            "official_email",
            "phone",
            "city",
            "college_primary_interest",
            "authority_confirmed",
            "privacy_acknowledged",
            "message",
            "whatsapp_opt_in",
            "website_hp",
        ]

    def validate_website_hp(self, value):
        if value:
            raise serializers.ValidationError("Bot submission detected.")
        return value

    def validate_institution_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Institution name is required.")
        return cleaned

    def validate_full_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Full name is required.")
        return cleaned

    def validate_official_email(self, value):
        return value.strip().lower()

    def validate_authority_confirmed(self, value):
        if not value:
            raise serializers.ValidationError("You must confirm authority to inquire on behalf of the institution.")
        return value

    def validate_privacy_acknowledged(self, value):
        if not value:
            raise serializers.ValidationError("You must acknowledge the Privacy Policy to proceed.")
        return value


class CampusCrewAdminSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source="owner.email", read_only=True, allow_null=True)

    class Meta:
        model = CampusCrewRegistration
        fields = "__all__"

