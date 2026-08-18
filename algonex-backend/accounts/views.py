from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework.permissions import AllowAny

User = get_user_model()


def _get_callback_url():
    """Get OAuth callback URL from settings, with localhost fallback for dev."""
    return getattr(settings, "OAUTH_CALLBACK_URL", "http://localhost:5173")


class GoogleLoginView(SocialLoginView):
    """
    Accepts Google OAuth2 authorization code from the React frontend,
    exchanges it for user info, creates/links a User, and returns JWT tokens.

    POST /api/v1/auth/google/
    Body: {"code": "<authorization_code>"}
    """
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return _get_callback_url()


class GitHubLoginView(SocialLoginView):
    """
    Accepts GitHub OAuth2 authorization code from the React frontend.

    POST /api/v1/auth/github/
    Body: {"code": "<authorization_code>"}
    """
    adapter_class = GitHubOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return _get_callback_url()


class CheckEmailView(APIView):
    """POST /api/v1/auth/check-email/ — check if email exists and has password."""
    throttle_scope = "auth_check"
    permission_classes = [AllowAny]

    def post(self, request):
        from .serializers import CheckEmailSerializer
        serializer = CheckEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
            return Response({
                "status": "success",
                "data": {
                    "exists": True,
                    "has_password": user.has_usable_password(),
                },
            })
        except User.DoesNotExist:
            return Response({
                "status": "success",
                "data": {"exists": False, "has_password": False},
            })


class SendSetupEmailView(APIView):
    """POST /api/v1/auth/send-setup-email/ — send password setup link."""
    throttle_scope = "auth_check"
    permission_classes = [AllowAny]

    def post(self, request):
        from .serializers import CheckEmailSerializer
        serializer = CheckEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"status": "error", "error": {"code": "USER_NOT_FOUND", "message": "No account found with this email."}},
                status=http_status.HTTP_404_NOT_FOUND,
            )

        if user.has_usable_password():
            return Response(
                {"status": "error", "error": {"code": "PASSWORD_ALREADY_SET", "message": "This account already has a password. Please login."}},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        # Generate token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        setup_link = f"{frontend_url}/set-password?token={token}&uid={uid}"

        send_mail(
            subject="Set up your Algonex password",
            message=f"Hi {user.first_name},\n\nClick the link below to set up your password:\n\n{setup_link}\n\nThis link will expire in 3 days.\n\nAlgonex Team",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({"status": "success", "data": {"message": "Password setup email sent."}})


class SetPasswordView(APIView):
    """POST /api/v1/auth/set-password/ — set password using token."""
    permission_classes = [AllowAny]

    def post(self, request):
        from .serializers import SetPasswordSerializer
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        password = serializer.validated_data["password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"status": "error", "error": {"code": "INVALID_TOKEN", "message": "Invalid or expired link."}},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"status": "error", "error": {"code": "INVALID_TOKEN", "message": "Invalid or expired link."}},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password)
        user.save()

        return Response({"status": "success", "data": {"message": "Password set successfully."}})

import random
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from .models import PasswordResetOTP

# Max failed OTP verification attempts before the OTP is invalidated.
OTP_MAX_ATTEMPTS = 5
# Attempt counter lifetime — matches the 10-minute OTP expiry.
OTP_ATTEMPT_TIMEOUT = 10 * 60


def _otp_attempts_key(email):
    return f"password_reset_otp_attempts:{email.lower()}"

class RequestPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth_check"

    def post(self, request):
        from .serializers import RequestPasswordResetOTPSerializer
        serializer = RequestPasswordResetOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"status": "success", "data": {"message": "If an account exists, an OTP has been sent."}})

        # Invalidate existing OTPs and reset the failed-attempt counter
        PasswordResetOTP.objects.filter(user=user, is_used=False).update(is_used=True)
        cache.delete(_otp_attempts_key(email))

        # Generate new OTP
        otp_code = str(random.randint(100000, 999999))
        PasswordResetOTP.objects.create(
            user=user,
            otp_code=otp_code,
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        send_mail(
            subject="Your Algonex Password Reset OTP",
            message=f"Hi {user.first_name},\n\nYour OTP to reset your password is: {otp_code}\n\nIt expires in 10 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return Response({"status": "success", "data": {"message": "If an account exists, an OTP has been sent."}})


class VerifyPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth_check"

    def post(self, request):
        from .serializers import VerifyPasswordResetOTPSerializer
        serializer = VerifyPasswordResetOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]
        new_password = serializer.validated_data["new_password"]

        attempts_key = _otp_attempts_key(email)
        invalid_response = Response(
            {"status": "error", "error": {"code": "INVALID_OTP", "message": "Invalid or expired OTP."}},
            status=http_status.HTTP_400_BAD_REQUEST,
        )

        # Locked out after too many failed attempts — respond neutrally.
        if cache.get(attempts_key, 0) >= OTP_MAX_ATTEMPTS:
            return invalid_response

        try:
            user = User.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.filter(
                user=user, otp_code=otp, is_used=False, expires_at__gt=timezone.now()
            ).latest('created_at')
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            # Count the failed attempt; invalidate outstanding OTPs on lockout.
            cache.add(attempts_key, 0, OTP_ATTEMPT_TIMEOUT)
            try:
                attempts = cache.incr(attempts_key)
            except ValueError:
                cache.set(attempts_key, 1, OTP_ATTEMPT_TIMEOUT)
                attempts = 1
            if attempts >= OTP_MAX_ATTEMPTS:
                PasswordResetOTP.objects.filter(
                    user__email=email, is_used=False
                ).update(is_used=True)
            return invalid_response

        # Mark used, clear the attempt counter, and reset password
        otp_record.is_used = True
        otp_record.save()
        cache.delete(attempts_key)

        user.set_password(new_password)
        user.save()

        return Response({"status": "success", "data": {"message": "Password reset successfully."}})
