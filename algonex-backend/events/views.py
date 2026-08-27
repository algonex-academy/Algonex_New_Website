from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin

from django.shortcuts import get_object_or_404

from .models import Event, Registration
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    RegistrationSerializer,
)
from .filters import EventFilter
from .services import register_for_event, cancel_registration
from .selectors import get_published_events, get_event_detail, get_user_registrations
from common.permissions import IsAdmin


class EventViewSet(ModelViewSet):
    """
    Public: list/retrieve published events & register (no login required).
    Admin: create/update/delete events.
    Authenticated: cancel registration.
    """

    lookup_field = "slug"
    filterset_class = EventFilter

    def get_queryset(self):
        if self.action in ("list", "retrieve"):
            return get_published_events(filters=self.request.query_params.dict())
        return Event.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return EventListSerializer
        if self.action == "retrieve":
            return EventDetailSerializer
        return EventCreateUpdateSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve", "register"):
            return [AllowAny()]
        if self.action in ("cancel",):
            return [IsAuthenticated()]
        return [IsAdmin()]

    def retrieve(self, request, *args, **kwargs):
        event = get_event_detail(slug=kwargs["slug"])
        if not event:
            return Response(
                {"status": "error", "error": {"code": "NOT_FOUND", "message": "Event not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(event, context={"request": request})
        return Response({"status": "success", "data": serializer.data})

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"status": "success", "data": serializer.data})

    @action(detail=True, methods=["post"], permission_classes=[AllowAny])
    def register(self, request, slug=None):
        """POST /api/v1/events/:slug/register/ — supports customizable Google Forms-like responses"""
        event = get_object_or_404(Event, slug=slug, is_published=True)
        data = request.data or {}

        full_name = data.get("full_name") or data.get("name") or ""
        email = data.get("email") or ""
        phone = data.get("phone") or ""
        college_name = data.get("college_name") or data.get("college") or ""
        branch = data.get("branch") or ""
        year_of_study = data.get("year_of_study") or data.get("year") or ""
        roll_no = data.get("roll_no") or data.get("usn") or ""
        student_id = data.get("student_id") or data.get("algonex_id") or ""
        github_url = data.get("github_url") or data.get("github") or ""

        custom_answers = data.get("custom_answers") or data.get("answers") or {}
        if not isinstance(custom_answers, dict):
            custom_answers = {}

        standard_keys = {
            "full_name", "name", "email", "phone", "college_name", "college",
            "branch", "year_of_study", "year", "roll_no", "usn", "student_id", "algonex_id",
            "github_url", "github", "custom_answers", "answers"
        }
        for k, v in data.items():
            if k not in standard_keys and k not in custom_answers:
                custom_answers[k] = v

        registration = register_for_event(
            user=request.user if (request.user and request.user.is_authenticated) else None,
            full_name=full_name,
            email=email,
            phone=phone,
            college_name=college_name,
            branch=branch,
            year_of_study=year_of_study,
            roll_no=roll_no,
            student_id=student_id,
            github_url=github_url,
            custom_answers=custom_answers,
            event=event,
        )
        serializer = RegistrationSerializer(registration)
        return Response(
            {"status": "success", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, slug=None):
        """POST /api/v1/events/:slug/cancel/"""
        event = get_object_or_404(Event, slug=slug)
        registration = get_object_or_404(
            Registration, event=event, user=request.user, status__in=["confirmed", "waitlisted"]
        )
        promoted = cancel_registration(registration=registration)
        return Response(
            {"status": "success", "data": {"message": "Registration cancelled."}},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"], permission_classes=[IsAdmin])
    def attendees(self, request, slug=None):
        """GET /api/v1/events/:slug/attendees/ (admin only)"""
        event = get_object_or_404(Event, slug=slug)
        registrations = event.registrations.exclude(status="cancelled").select_related("user")
        serializer = RegistrationSerializer(registrations, many=True)
        return Response({"status": "success", "data": serializer.data})


class UserRegistrationViewSet(ListModelMixin, GenericViewSet):
    """List current user's event registrations."""

    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_user_registrations(user=self.request.user)
