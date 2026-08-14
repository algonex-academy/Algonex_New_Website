from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin

from django.db import models
from django.shortcuts import get_object_or_404

from .models import Course, Enrollment, FAQ, Certificate
from .serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    CourseCreateUpdateSerializer,
    EnrollmentSerializer,
    CourseReviewSerializer,
    CourseReviewSubmitSerializer,
    CourseFAQSerializer,
    CourseFAQCreateSerializer,
)
from .permissions import IsInstructorOwner
from .filters import CourseFilter
from .services import create_course, update_course, enroll_student, drop_enrollment, submit_review
from .selectors import get_published_courses, get_course_detail, get_student_enrollments, get_published_outcomes
from .serializers import StudentOutcomeSerializer, CertificateSerializer
from common.pagination import StandardPagination
from common.permissions import IsAdmin


class CourseViewSet(ModelViewSet):
    """
    Public: list/retrieve published courses.
    Instructor: create/update own courses.
    Admin: delete any course.
    """

    lookup_field = "slug"
    filterset_class = CourseFilter

    def get_queryset(self):
        if self.action in ("list", "retrieve"):
            return get_published_courses(filters=self.request.query_params.dict())
        if self.request.user.is_authenticated and self.request.user.role == "admin":
            return Course.objects.all()
        if self.request.user.is_authenticated and self.request.user.role == "instructor":
            return Course.objects.filter(instructor=self.request.user)
        return Course.objects.none()

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseCreateUpdateSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve", "reviews"):
            return [IsAuthenticatedOrReadOnly()]
        if self.action == "enroll":
            return [IsAuthenticated()]
        if self.action == "create":
            return [IsInstructorOwner()]
        if self.action == "destroy":
            return [IsAdmin()]
        return [IsInstructorOwner()]

    def perform_create(self, serializer):
        skills = serializer.validated_data.pop("skills", [])
        course = create_course(instructor=self.request.user, **serializer.validated_data)
        if skills:
            course.skills.set(skills)
        return course

    def perform_update(self, serializer):
        skills = serializer.validated_data.pop("skills", None)
        course = update_course(course=self.get_object(), **serializer.validated_data)
        if skills is not None:
            course.skills.set(skills)
        return course

    def retrieve(self, request, *args, **kwargs):
        course = get_course_detail(slug=kwargs["slug"])
        if not course:
            return Response(
                {"status": "error", "error": {"code": "NOT_FOUND", "message": "Course not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(course, context={"request": request})
        return Response({"status": "success", "data": serializer.data})

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"status": "success", "data": serializer.data})

    @action(detail=True, methods=["post"])
    def enroll(self, request, slug=None):
        """POST /api/v1/courses/:slug/enroll/"""
        course = get_object_or_404(Course, slug=slug)
        enrollment = enroll_student(student=request.user, course=course)
        serializer = EnrollmentSerializer(enrollment)
        return Response(
            {"status": "success", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get", "post"])
    def reviews(self, request, slug=None):
        """GET/POST /api/v1/courses/:slug/reviews/"""
        course = get_object_or_404(Course, slug=slug, is_published=True)

        if request.method == "GET":
            reviews = course.feedbacks.filter(student__isnull=False).select_related("student").all()
            serializer = CourseReviewSerializer(reviews, many=True)
            return Response({"status": "success", "data": serializer.data})

        serializer = CourseReviewSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = submit_review(
            student=request.user,
            course=course,
            rating=serializer.validated_data["rating"],
            text=serializer.validated_data.get("text", ""),
        )
        return Response(
            {"status": "success", "data": CourseReviewSerializer(review).data},
            status=status.HTTP_201_CREATED,
        )


class CourseFAQViewSet(ModelViewSet):
    """CRUD for FAQs within a course. Instructor-only for write, public for read."""

    def get_queryset(self):
        return FAQ.objects.filter(course__slug=self.kwargs["course_slug"])

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return CourseFAQSerializer
        return CourseFAQCreateSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAuthenticatedOrReadOnly()]
        return [IsInstructorOwner()]

    def perform_create(self, serializer):
        course = get_object_or_404(Course, slug=self.kwargs["course_slug"])
        self.check_object_permissions(self.request, course)
        serializer.save(course=course)


class EnrollmentViewSet(ListModelMixin, GenericViewSet):
    """List current user's enrollments. Drop an enrollment."""

    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_student_enrollments(student=self.request.user)

    @action(detail=True, methods=["post"])
    def drop(self, request, pk=None):
        """POST /api/v1/enrollments/:id/drop/"""
        enrollment = get_object_or_404(
            Enrollment, pk=pk, student=request.user, status="active"
        )
        drop_enrollment(enrollment=enrollment)
        return Response(
            {"status": "success", "data": {"message": "Enrollment dropped."}},
            status=status.HTTP_200_OK,
        )


class OutcomePagination(StandardPagination):
    page_size = 20


class StudentOutcomeViewSet(ListModelMixin, GenericViewSet):
    """Public read-only endpoint for published student outcomes."""
    serializer_class = StudentOutcomeSerializer
    permission_classes = [AllowAny]
    pagination_class = OutcomePagination

    def get_queryset(self):
        course_slug = self.request.query_params.get("course")
        return get_published_outcomes(course_slug=course_slug)


class CertificateViewSet(ModelViewSet):
    """
    Public: retrieve single certificate by ID.
    Authenticated User: list their own certificates.
    Admin: full access.
    """
    serializer_class = CertificateSerializer
    lookup_field = "certificate_id"

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs[lookup_url_kwarg]
        
        # Try finding by certificate_id first, then fallback to intern_id (case-insensitive)
        obj = queryset.filter(
            models.Q(certificate_id__iexact=val) | models.Q(intern_id__iexact=val)
        ).first()
        
        if not obj:
            from rest_framework.exceptions import NotFound
            raise NotFound(f"No certificate found with ID or Intern ID '{val}'.")
            
        self.check_object_permissions(self.request, obj)
        return obj

    def get_queryset(self):
        if self.action == "retrieve":
            return Certificate.objects.all()
        user = self.request.user
        if not user or not user.is_authenticated:
            return Certificate.objects.none()
        if user.is_staff or user.is_superuser:
            return Certificate.objects.all()
        return Certificate.objects.filter(student=user)

    def get_permissions(self):
        if self.action in ("retrieve",):
            return [AllowAny()]
        if self.action in ("list",):
            return [IsAuthenticated()]
        return [IsAdmin()]

