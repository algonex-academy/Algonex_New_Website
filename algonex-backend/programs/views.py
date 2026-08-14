import uuid
import secrets
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from programs.models import Program, CampusCrewRegistration

from .serializers import (
    ProgramListSerializer,
    ProgramDetailSerializer,
    ProgramCreateUpdateSerializer,
    CampusCrewStudentSerializer,
    CampusCrewCollegeSerializer,
    CampusCrewAdminSerializer,
)
from .filters import ProgramFilter
from .selectors import get_published_programs, get_program_detail
from .services import create_program, update_program
from common.permissions import IsAdmin


def generate_opaque_ref_id(prefix):
    # Generates non-sequential opaque reference ID: ACC-S-XXXXXX or ACC-C-XXXXXX
    token = secrets.token_hex(4).upper()
    return f"{prefix}-{token}"


class CampusCrewRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reg_type = request.data.get("registration_type")
        if reg_type not in ["student", "college"]:
            return Response(
                {
                    "status": "error",
                    "error": {
                        "code": "INVALID_TYPE",
                        "message": "registration_type must be either 'student' or 'college'.",
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if reg_type == "student":
            serializer = CampusCrewStudentSerializer(data=request.data)
            prefix = "ACC-S"
        else:
            serializer = CampusCrewCollegeSerializer(data=request.data)
            prefix = "ACC-C"

        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Please correct the highlighted errors.",
                        "details": serializer.errors,
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated_data = serializer.validated_data
        validated_data.pop("website_hp", None)

        # Generate unique reference ID
        ref_id = generate_opaque_ref_id(prefix)
        while CampusCrewRegistration.objects.filter(reference_id=ref_id).exists():
            ref_id = generate_opaque_ref_id(prefix)

        registration = CampusCrewRegistration.objects.create(
            reference_id=ref_id,
            registration_type=reg_type,
            **validated_data,
        )

        # Notify admin/user safely (non-blocking persistence)
        self._send_notifications(registration)

        return Response(
            {
                "status": "success",
                "data": {
                    "reference_id": registration.reference_id,
                    "registration_type": registration.registration_type,
                    "full_name": registration.full_name,
                    "created_at": registration.created_at,
                    "message": (
                        "We received your Campus Crew registration."
                        if reg_type == "student"
                        else "Thank you. The Algonex team will review your request and get in touch."
                    ),
                },
            },
            status=status.HTTP_201_CREATED,
        )

    def _send_notifications(self, registration):
        try:
            # 1. Registrant Confirmation
            user_subject = f"[Algonex Campus Crew] Registration Confirmation - {registration.reference_id}"
            user_msg = (
                f"Hello {registration.full_name},\n\n"
                f"Thank you for reaching out to Algonex Campus Crew!\n"
                f"Reference ID: {registration.reference_id}\n"
                f"Registration Type: {registration.get_registration_type_display()}\n\n"
                f"Our team will review your details and connect with you shortly.\n\n"
                f"Best regards,\nAlgonex Campus Crew Team"
            )
            recipient = registration.email if registration.registration_type == "student" else registration.official_email
            if recipient:
                send_mail(
                    subject=user_subject,
                    message=user_msg,
                    from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@algonex.in"),
                    recipient_list=[recipient],
                    fail_silently=True,
                )

            registration.notification_sent = True
            registration.save(update_fields=["notification_sent"])
        except Exception as e:
            registration.notification_error = str(e)
            registration.save(update_fields=["notification_error"])


class CampusCrewAdminViewSet(ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = CampusCrewAdminSerializer
    queryset = CampusCrewRegistration.objects.all()
    search_fields = ["reference_id", "full_name", "college_name", "institution_name", "email", "official_email", "phone"]
    filterset_fields = ["registration_type", "status", "student_primary_interest", "college_primary_interest"]


class ProgramViewSet(ModelViewSet):
    """
    Public: list/retrieve published programs.
    Admin: create/update/delete.
    """

    lookup_field = "slug"
    filterset_class = ProgramFilter
    search_fields = ["title", "description"]

    def get_queryset(self):
        if self.action in ("list", "retrieve"):
            return get_published_programs()
        return Program.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return ProgramListSerializer
        if self.action == "retrieve":
            return ProgramDetailSerializer
        return ProgramCreateUpdateSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAuthenticatedOrReadOnly()]
        return [IsAdmin()]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"status": "success", "data": serializer.data})

    def retrieve(self, request, *args, **kwargs):
        program = get_program_detail(slug=kwargs["slug"])
        if not program:
            return Response(
                {"status": "error", "error": {"code": "NOT_FOUND", "message": "Program not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(program)
        return Response({"status": "success", "data": serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        program = create_program(**serializer.validated_data)
        return Response(
            {"status": "success", "data": ProgramDetailSerializer(program).data},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        program = self.get_object()
        serializer = self.get_serializer(data=request.data, partial=kwargs.get("partial", False))
        serializer.is_valid(raise_exception=True)
        program = update_program(program=program, **serializer.validated_data)
        return Response({"status": "success", "data": ProgramDetailSerializer(program).data})

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        program = self.get_object()
        program.delete()
        return Response(
            {"status": "success", "data": {"message": "Program deleted."}},
            status=status.HTTP_200_OK,
        )

