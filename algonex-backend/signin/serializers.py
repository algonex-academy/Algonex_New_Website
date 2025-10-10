from rest_framework import serializers
from .models import SigninProfile

class SigninProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SigninProfile
        fields = '__all__'
