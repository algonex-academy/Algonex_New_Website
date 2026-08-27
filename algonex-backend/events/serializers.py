from rest_framework import serializers
from common.serializers import MediaSerializer
from .models import Event, Registration


class EventListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for event listings."""
    spots_left = serializers.IntegerField(read_only=True)
    confirmed_count = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)
    images = serializers.SerializerMethodField()
    media = MediaSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id", "title", "slug", "summary", "description", "image", "images", "event_type",
            "location", "start_date", "end_date", "time_range", "capacity",
            "spots_left", "confirmed_count", "status", "speaker", "highlights",
            "form_phone_mode", "form_college_mode", "form_branch_mode", "form_year_mode", "form_roll_no_mode", "form_student_id_mode", "form_github_mode",
            "registration_form_schema", "media",
        ]

    def get_confirmed_count(self, obj):
        return obj.capacity - obj.spots_left

    def get_images(self, obj):
        urls = []
        if obj.image:
            name = obj.image.name if hasattr(obj.image, "name") else str(obj.image)
            if name.startswith(("http://", "https://")):
                urls.append(name)
            else:
                request = self.context.get("request")
                urls.append(request.build_absolute_uri(obj.image.url) if request else obj.image.url)
        for m in obj.media.all():
            if m.image:
                name = m.image.name if hasattr(m.image, "name") else str(m.image)
                if name.startswith(("http://", "https://")):
                    urls.append(name)
                else:
                    request = self.context.get("request")
                    urls.append(request.build_absolute_uri(m.image.url) if request else m.image.url)
        return urls


class EventDetailSerializer(serializers.ModelSerializer):
    """Full event detail — includes meeting_link only for confirmed registrants."""
    spots_left = serializers.IntegerField(read_only=True)
    confirmed_count = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    user_registration_status = serializers.SerializerMethodField()
    meeting_link = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    def get_confirmed_count(self, obj):
        return obj.capacity - obj.spots_left

    def get_images(self, obj):
        urls = []
        if obj.image:
            name = obj.image.name if hasattr(obj.image, "name") else str(obj.image)
            if name.startswith(("http://", "https://")):
                urls.append(name)
            else:
                request = self.context.get("request")
                urls.append(request.build_absolute_uri(obj.image.url) if request else obj.image.url)
        for m in obj.media.all():
            if m.image:
                name = m.image.name if hasattr(m.image, "name") else str(m.image)
                if name.startswith(("http://", "https://")):
                    urls.append(name)
                else:
                    request = self.context.get("request")
                    urls.append(request.build_absolute_uri(m.image.url) if request else m.image.url)
        return urls

    media = MediaSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id", "title", "slug", "description", "summary", "image", "images", "event_type",
            "location", "meeting_link", "start_date", "end_date", "time_range",
            "capacity", "spots_left", "confirmed_count", "is_full", "status",
            "speaker", "highlights",
            "form_phone_mode", "form_college_mode", "form_branch_mode", "form_year_mode", "form_roll_no_mode", "form_student_id_mode", "form_github_mode",
            "registration_form_schema", "is_published", "user_registration_status", "media", "created_at",
        ]


    def get_user_registration_status(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            reg = obj.registrations.filter(user=request.user).exclude(status="cancelled").first()
            return reg.status if reg else None
        return None

    def get_meeting_link(self, obj):
        """Only show meeting_link to confirmed registrants."""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            is_confirmed = obj.registrations.filter(
                user=request.user, status="confirmed"
            ).exists()
            if is_confirmed:
                return obj.meeting_link
        return None


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for admin creating/updating events."""

    class Meta:
        model = Event
        fields = [
            "title", "summary", "description", "image", "event_type", "location",
            "meeting_link", "start_date", "end_date", "capacity", "is_published",
            "form_phone_mode", "form_college_mode", "form_branch_mode", "form_year_mode", "form_roll_no_mode", "form_student_id_mode", "form_github_mode",
            "registration_form_schema",
        ]


class RegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)
    event_slug = serializers.CharField(source="event.slug", read_only=True)

    class Meta:
        model = Registration
        fields = [
            "id", "event_title", "event_slug", "full_name", "email", "phone",
            "college_name", "branch", "year_of_study", "roll_no", "student_id", "github_url",
            "custom_answers", "status", "registered_at"
        ]
