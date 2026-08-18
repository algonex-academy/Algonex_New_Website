"""
Buddy Tools — LangChain @tool functions that query live platform data.

Each tool returns a dict that will be:
  1. Sent back to the LLM as its "tool result" so it can compose a natural reply.
  2. Forward to the frontend as the `cards` payload for rich UI rendering.
"""

import json
from typing import Optional
from langchain_core.tools import tool


# ---------------------------------------------------------------------------
# Courses
# ---------------------------------------------------------------------------

@tool
def get_courses(level: Optional[str] = None, is_trending: Optional[bool] = None) -> str:
    """
    Fetch published courses from the platform.

    Args:
        level: Filter by difficulty — one of 'beginner', 'intermediate', 'advanced'. Leave blank for all.
        is_trending: Pass true to fetch only trending courses.

    Returns a JSON string with a list of courses including name, slug, level, price, duration, and skills.
    """
    from courses.models import Course
    from django.db.models import Avg, Count, Q

    qs = Course.objects.filter(is_published=True).annotate(
        average_rating=Avg("feedbacks__rating", filter=Q(feedbacks__student__isnull=False)),
        student_count=Count("enrollments", filter=Q(enrollments__status="active"), distinct=True),
        review_count=Count("feedbacks", filter=Q(feedbacks__student__isnull=False), distinct=True),
    ).prefetch_related("skills")

    if level:
        qs = qs.filter(level=level.lower())
    if is_trending:
        qs = qs.filter(is_trending=True)

    courses = []
    for c in qs[:10]:
        courses.append({
            "type": "course",
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description[:200] + "..." if len(c.description) > 200 else c.description,
            "level": c.level,
            "duration": c.duration,
            "price": str(c.price),
            "discount": c.discount,
            "is_trending": c.is_trending,
            "skills": [s.name for s in c.skills.all()],
            "average_rating": round(c.average_rating, 1) if c.average_rating else None,
            "student_count": c.student_count or 0,
            "image_url": c.image.url if c.image else None,
        })
    return json.dumps({"courses": courses, "count": len(courses)})


@tool
def get_course_faqs(course_slug: str) -> str:
    """
    Fetch FAQs for a specific course by its slug.

    Args:
        course_slug: The URL slug of the course (e.g. 'python-for-beginners').

    Returns a JSON string with the course name and list of FAQ question/answer pairs.
    """
    from courses.models import Course

    try:
        course = Course.objects.prefetch_related("faqs").get(slug=course_slug, is_published=True)
    except Course.DoesNotExist:
        return json.dumps({"error": f"No published course found with slug '{course_slug}'."})

    faqs = [{"question": f.question, "answer": f.answer} for f in course.faqs.all()]
    return json.dumps({"course": course.name, "faqs": faqs})


# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------

@tool
def get_events(event_type: Optional[str] = None, status: Optional[str] = None) -> str:
    """
    Fetch published platform events (workshops, webinars, hackathons, meetups).

    Args:
        event_type: Filter by type — 'workshop', 'webinar', 'hackathon', or 'meetup'. Leave blank for all.
        status: Filter by timing — 'upcoming', 'ongoing', or 'past'. Leave blank for all.

    Returns a JSON string with a list of events including title, type, date, location, and spots left.
    """
    from events.models import Event
    from django.utils import timezone

    qs = Event.objects.filter(is_published=True)

    if event_type:
        qs = qs.filter(event_type=event_type.lower())

    now = timezone.now()
    if status == "upcoming":
        qs = qs.filter(start_date__gt=now)
    elif status == "ongoing":
        qs = qs.filter(start_date__lte=now, end_date__gte=now)
    elif status == "past":
        qs = qs.filter(end_date__lt=now)

    events = []
    for e in qs[:10]:
        events.append({
            "type": "event",
            "id": e.id,
            "title": e.title,
            "slug": e.slug,
            "summary": e.summary,
            "event_type": e.event_type,
            "location": e.location,
            "start_date": e.start_date.isoformat(),
            "end_date": e.end_date.isoformat(),
            "spots_left": e.spots_left,
            "is_full": e.is_full,
            "status": e.status,
            "image_url": e.image.url if e.image else None,
        })
    return json.dumps({"events": events, "count": len(events)})


# ---------------------------------------------------------------------------
# Careers & Internships
# ---------------------------------------------------------------------------

@tool
def get_jobs(job_type: Optional[str] = None, department: Optional[str] = None) -> str:
    """
    Fetch active job listings including internships from the platform.

    Args:
        job_type: Filter by type — 'full_time', 'part_time', 'internship', or 'contract'. 
                  Use 'internship' to find internship opportunities.
        department: Filter by department — 'engineering', 'design', 'marketing', or 'operations'.

    Returns a JSON string with a list of jobs including title, type, location, salary, and deadline.
    """
    from careers.models import Job

    qs = Job.objects.filter(is_active=True).prefetch_related("tags")

    if job_type:
        qs = qs.filter(job_type=job_type.lower())
    if department:
        qs = qs.filter(department=department.lower())

    jobs = []
    for j in qs[:10]:
        jobs.append({
            "type": "job",
            "id": j.id,
            "title": j.title,
            "slug": j.slug,
            "department": j.department,
            "job_type": j.job_type,
            "location": j.location,
            "is_remote": j.is_remote,
            "salary_min": str(j.salary_min) if j.salary_min else None,
            "salary_max": str(j.salary_max) if j.salary_max else None,
            "deadline": j.deadline.isoformat() if j.deadline else None,
            "company_name": j.company_name or "Algonex",
            "tags": [t.name for t in j.tags.all()] or (
                [t.strip() for t in j.tags_text.split(",") if t.strip()] if j.tags_text else []
            ),
            "apply_mode": j.apply_mode,
            "external_link": j.external_link or None,
        })
    return json.dumps({"jobs": jobs, "count": len(jobs)})


# ---------------------------------------------------------------------------
# Programs (Internships / Fellowships)
# ---------------------------------------------------------------------------

@tool
def get_programs(program_type: Optional[str] = None) -> str:
    """
    Fetch published fellowship and internship programs from the platform.

    Args:
        program_type: Filter by type — 'fellowship' or 'internship'. Leave blank for all.

    Returns a JSON string with program details including duration, stipend, eligibility, and deadline.
    """
    from programs.models import Program

    qs = Program.objects.filter(is_published=True)

    if program_type:
        qs = qs.filter(program_type=program_type.lower())

    programs = []
    for p in qs[:10]:
        programs.append({
            "type": "program",
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "program_type": p.program_type,
            "duration": p.duration,
            "stipend": p.stipend,
            "location": p.location,
            "is_remote": p.is_remote,
            "application_deadline": p.application_deadline.isoformat() if p.application_deadline else None,
            "start_date": p.start_date.isoformat() if p.start_date else None,
            "spots_left": p.spots_left,
            "is_accepting": p.is_accepting,
            "is_featured": p.is_featured,
            "description": p.description[:200] + "..." if len(p.description) > 200 else p.description,
            "image_url": p.image.url if p.image else None,
        })
    return json.dumps({"programs": programs, "count": len(programs)})


# ---------------------------------------------------------------------------
# Tool registry
# ---------------------------------------------------------------------------

BUDDY_TOOLS = [get_courses, get_course_faqs, get_events, get_jobs, get_programs]
