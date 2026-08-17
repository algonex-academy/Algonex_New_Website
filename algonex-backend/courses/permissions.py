from rest_framework.permissions import BasePermission


class IsInstructorOwner(BasePermission):
    """
    Allow access only if the user is the course instructor or an admin.
    For object-level permissions on courses and course-related objects (e.g. FAQs).
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("instructor", "admin")
        )

    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return True
        # Navigate to the course regardless of object type
        course = _get_course(obj)
        return course is not None and course.instructor == request.user


def _get_course(obj):
    """Extract the course from an object (a Course itself, or anything with a course FK)."""
    from .models import Course

    if isinstance(obj, Course):
        return obj
    return getattr(obj, "course", None)
