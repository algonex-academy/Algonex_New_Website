from rest_framework import serializers
from contactform.models import ContactForm

class SigninProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="full_name")
    location = serializers.CharField(required=False, allow_blank=True, default="")
    specific_interests = serializers.CharField(source="message", required=False, allow_blank=True, default="")
    agreed_to_terms = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = ContactForm
        fields = [
            "name", "email", "phone", "college", "branch", "location",
            "course_interested", "employment_status", "years_of_experience",
            "passed_out_year", "specific_interests", "agreed_to_terms"
        ]

    def create(self, validated_data):
        validated_data.pop("agreed_to_terms", None)
        validated_data["form_type"] = "lead"
        return super().create(validated_data)


class Step1Serializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)


class Step2Serializer(serializers.Serializer):
    email = serializers.EmailField()
    reg_token = serializers.CharField(required=False, allow_blank=True, default="")

    # Address
    street_address = serializers.CharField(required=False, allow_blank=True, default="")
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, default="India")
    pincode = serializers.CharField(max_length=10, required=False, allow_blank=True, default="")

    # Education
    college = serializers.CharField(max_length=255)
    branch = serializers.CharField(max_length=100)
    degree_level = serializers.ChoiceField(choices=["diploma", "bachelors", "masters", "phd", "other"])
    graduation_year = serializers.IntegerField(min_value=1990, max_value=2040)
    current_year = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")

    # Employment
    employment_status = serializers.ChoiceField(choices=["student", "employed", "freelancer", "unemployed"])
    years_of_experience = serializers.IntegerField(min_value=0, default=0)

    # Training interest
    interest_category = serializers.ChoiceField(choices=["fellowship", "internship", "workshop", "course", "other"])
    program_slug = serializers.CharField(required=False, allow_blank=True, default="")
    specific_interests = serializers.CharField(required=False, allow_blank=True, default="")

    # Terms
    terms_agreed = serializers.BooleanField()
