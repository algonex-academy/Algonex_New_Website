from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import EventRegistration

class EventRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=EventRegistration.objects.all(),
            message="Email already registered!"
        )]
    )
    phone = serializers.CharField(
        validators=[UniqueValidator(
            queryset=EventRegistration.objects.all(),
            message="Phone number already registered!"
        )]
    )
    paymentId = serializers.CharField(
        validators=[UniqueValidator(
            queryset=EventRegistration.objects.all(),
            message="Payment ID already used! Please enter a valid Payment ID."
        )]
    )

    class Meta:
        model = EventRegistration
        fields = "__all__"
