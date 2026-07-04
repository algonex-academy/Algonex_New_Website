from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.db.models import Q, Count, Avg
from django.contrib.auth import get_user_model
User = get_user_model()


class CarouselView(APIView):
    """
    GET /api/v1/carousel/
    Returns ordered list of active carousel slides with resolved item data.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        from .models import SiteConfig
        from courses.models import Course
        from events.models import Event
        from programs.models import Program

        config = SiteConfig.load()
        slides = config.carousel_slides or []

        try:
            slides = sorted(slides, key=lambda x: x.get("order", 0))
        except Exception:
            pass

        result = []
        for slide in slides:
            if not slide.get("is_active", True):
                continue

            slide_type = slide.get("slide_type")
            item_slug = slide.get("item_slug")
            order = slide.get("order", 0)

            entry = {"slide_type": slide_type, "order": order, "item": None}

            if slide_type == "hero":
                entry["item"] = None
            elif slide_type == "course" and item_slug:
                course = Course.objects.filter(slug=item_slug, is_published=True).values(
                    "name", "slug", "description", "image", "duration", "price", "discount", "is_trending"
                ).first()
                entry["item"] = course
            elif slide_type == "event" and item_slug:
                event = Event.objects.filter(slug=item_slug, is_published=True).values(
                    "title", "slug", "summary", "image", "event_type", "location", "start_date", "capacity"
                ).first()
                entry["item"] = event
            elif slide_type == "program" and item_slug:
                program = Program.objects.filter(slug=item_slug, is_published=True).values(
                    "title", "slug", "description", "image", "program_type", "duration", "stipend", "location", "is_remote", "application_deadline"
                ).first()
                entry["item"] = program

            if slide_type == "hero" or entry["item"]:
                result.append(entry)

        return Response({"status": "success", "data": result})


class PlatformSettingsView(APIView):
    """
    GET /api/v1/settings/
    Returns public platform settings (maintenance mode, feature toggles).
    """

    permission_classes = [AllowAny]

    def get(self, request):
        from .models import SiteConfig
        config = SiteConfig.load()
        return Response({
            "status": "success",
            "data": {
                "maintenance_mode": config.maintenance_mode,
                "maintenance_message": config.maintenance_message,
                "course_enrollment_enabled": config.course_enrollment_enabled,
                "event_registration_enabled": config.event_registration_enabled,
                "program_registration_enabled": config.program_registration_enabled,
            },
        })


class ActiveBannerView(APIView):
    """
    GET /api/v1/banner/
    Returns the currently active site banner (if any).
    """

    permission_classes = [AllowAny]

    def get(self, request):
        from .models import SiteConfig
        config = SiteConfig.load()
        if not config.banner_is_active:
            return Response({"status": "success", "data": None})
        return Response({
            "status": "success",
            "data": {
                "text": config.banner_text,
                "link": config.banner_link,
                "bg_color": config.banner_bg_color,
                "text_color": config.banner_text_color,
            },
        })


class SearchView(APIView):
    """
    GET /api/v1/search/?q=python
    Searches across courses, events, jobs, and case studies.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        if not query or len(query) < 2:
            return Response({
                "status": "success",
                "data": {"courses": [], "events": [], "jobs": [], "case_studies": []},
            })

        from courses.models import Course
        from events.models import Event
        from careers.models import Job
        from portfolio.models import CaseStudy

        courses = Course.objects.filter(
            is_published=True,
        ).filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        ).values("name", "slug", "level", "image")[:5]

        events = Event.objects.filter(
            is_published=True,
        ).filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        ).values("title", "slug", "event_type", "start_date")[:5]

        jobs = Job.objects.filter(
            is_active=True,
        ).filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        ).values("title", "slug", "department", "job_type")[:5]

        case_studies = CaseStudy.objects.filter(
            is_published=True,
        ).filter(
            Q(title__icontains=query) | Q(summary__icontains=query)
        ).values("title", "slug", "industry")[:5]

        return Response({
            "status": "success",
            "data": {
                "courses": list(courses),
                "events": list(events),
                "jobs": list(jobs),
                "case_studies": list(case_studies),
            },
        })


class AdminStatsView(APIView):
    """
    GET /api/v1/admin/stats/
    Platform-wide statistics for admin dashboard.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response(
                {"status": "error", "error": {"code": "FORBIDDEN", "message": "Admin access required."}},
                status=403,
            )

        from courses.models import Course, Enrollment
        from events.models import Event, Registration
        from careers.models import Job, Application

        users_by_role = {
            "students": User.objects.filter(role="student").count(),
            "instructors": User.objects.filter(role="instructor").count(),
            "admins": User.objects.filter(role="admin").count(),
            "total": User.objects.count(),
        }

        courses_stats = {
            "total": Course.objects.count(),
            "published": Course.objects.filter(is_published=True).count(),
            "total_enrollments": Enrollment.objects.filter(status="active").count(),
        }

        events_stats = {
            "total": Event.objects.count(),
            "published": Event.objects.filter(is_published=True).count(),
            "total_registrations": Registration.objects.filter(status="confirmed").count(),
        }

        careers_stats = {
            "active_jobs": Job.objects.filter(is_active=True).count(),
            "total_applications": Application.objects.count(),
            "pipeline": {
                s: Application.objects.filter(status=s).count()
                for s in ["applied", "reviewed", "interview", "hired", "rejected"]
            },
        }

        return Response({
            "status": "success",
            "data": {
                "users": users_by_role,
                "courses": courses_stats,
                "events": events_stats,
                "careers": careers_stats,
            },
        })


class GeneralFAQListView(APIView):
    """
    GET /api/v1/faqs/
    List active general FAQs.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        from courses.models import FAQ
        from courses.serializers import FAQSerializer
        faqs = FAQ.objects.filter(is_active=True, course__isnull=True)
        serializer = FAQSerializer(faqs, many=True)
        return Response({"status": "success", "data": serializer.data})


class GalleryImageListView(APIView):
    """
    GET /api/v1/gallery/
    List active gallery images.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        from .models import Gallery
        queryset = Gallery.objects.all().order_by("-uploaded_at")
        
        data = []
        for item in queryset:
            if item.image:
                image_url = request.build_absolute_uri(item.image.url) if request else item.image.url
                data.append({
                    "id": item.id,
                    "title": item.title or "",
                    "image": image_url,
                    "uploaded_at": item.uploaded_at
                })
        
        return Response({"status": "success", "data": data})


from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
import json
import logging

logger = logging.getLogger(__name__)


def build_html(body):
    trimmed = body.strip()
    is_full_template = (
        trimmed.startswith("<div style=") or 
        "border:" in trimmed or 
        "background-color:" in trimmed
    )
    
    if is_full_template:
        return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
    }}
    .container {{
      max-width: 600px;
      margin: 0 auto;
    }}
  </style>
</head>
<body>
  <div class="container">
    {body}
  </div>
</body>
</html>"""

    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
    }}
    .wrapper {{
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }}
    .header {{
      background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
      padding: 32px 24px;
      text-align: center;
    }}
    .header h1 {{
      color: #ffffff;
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }}
    .content {{
      padding: 40px 32px;
      color: #1f2937;
      line-height: 1.8;
      font-size: 15px;
    }}
    .footer {{
      background-color: #f9fafb;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #f3f4f6;
    }}
    .footer p {{
      color: #9ca3af;
      font-size: 12px;
      margin: 0 0 4px 0;
      font-weight: 500;
    }}
    .footer span {{
      color: #d1d5db;
      font-size: 11px;
    }}
    .content a {{
      color: #2563EB;
      text-decoration: underline;
    }}
    .content img {{
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 12px 0;
    }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Algonex</h1>
    </div>
    <div class="content">
      {body}
    </div>
    <div class="footer">
      <p>Sent from Algonex Admin Panel</p>
      <span>If you did not expect this communication, please ignore this email.</span>
    </div>
  </div>
</body>
</html>"""


@csrf_exempt
@staff_member_required
def send_enrollment_email_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
        
    try:
        import base64
        import json
        from courses.models import EmailLog
        from django.conf import settings

        data = json.loads(request.body)
        recipients = data.get("to", [])
        subject = data.get("subject", "")
        body = data.get("body", "")
        mode = data.get("mode", "individual")
        attachments = data.get("attachments", [])
        
        if not recipients or not subject or not body:
            return JsonResponse({"error": "Missing required fields"}, status=400)
            
        html_content = build_html(body)
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "Algonex <solutions@algonex.co.in>")
        
        sent_count = 0
        failed_count = 0
        
        if mode == "bcc":
            try:
                msg = EmailMessage(
                    subject=subject,
                    body=html_content,
                    from_email=from_email,
                    to=[from_email],
                    bcc=recipients
                )
                msg.content_subtype = "html"
                
                # Attach files
                for att in attachments:
                    filename = att.get("filename")
                    content_b64 = att.get("content")
                    content_type = att.get("contentType")
                    if filename and content_b64:
                        file_content = base64.b64decode(content_b64)
                        msg.attach(filename, file_content, content_type)
                        
                msg.send()
                sent_count = len(recipients)
            except Exception as e:
                logger.exception("BCC email sending failed")
                return JsonResponse({"error": f"Failed to send BCC email: {str(e)}"}, status=500)
        else:
            for recipient in recipients:
                try:
                    msg = EmailMessage(
                        subject=subject,
                        body=html_content,
                        from_email=from_email,
                        to=[recipient]
                    )
                    msg.content_subtype = "html"
                    
                    # Attach files
                    for att in attachments:
                        filename = att.get("filename")
                        content_b64 = att.get("content")
                        content_type = att.get("contentType")
                        if filename and content_b64:
                            file_content = base64.b64decode(content_b64)
                            msg.attach(filename, file_content, content_type)
                            
                    msg.send()
                    sent_count += 1
                except Exception as e:
                    logger.error(f"Failed to send email to {recipient}: {str(e)}")
                    failed_count += 1
                    
        # Log email communication to database
        attachment_filenames = [att.get("filename") for att in attachments if att.get("filename")]
        EmailLog.objects.create(
            subject=subject,
            body=body,
            recipient_count=len(recipients),
            sent_count=sent_count,
            failed_count=failed_count,
            status="Delivered" if failed_count == 0 else ("Partial" if sent_count > 0 else "Failed"),
            attachments=attachment_filenames
        )
        
        return JsonResponse({
            "success": sent_count > 0,
            "sent": sent_count,
            "failed": failed_count
        })
        
    except Exception as e:
        logger.exception("API Error in send_enrollment_email_view")
        return JsonResponse({"error": str(e)}, status=500)


@staff_member_required
def admin_communication_view(request):
    from django.shortcuts import render
    from django.contrib import admin
    from courses.models import Course, Enrollment, EmailLog
    import json
    
    courses = Course.objects.all()
    
    # Query enrollments and format into JSON
    enrollments_data = []
    for e in Enrollment.objects.select_related("student", "course"):
        student_name = f"{e.student.first_name} {e.student.last_name}".strip() or e.student.username or e.student.email.split("@")[0]
        enrollments_data.append({
            "id": e.id,
            "email": e.student.email,
            "status": e.status,
            "course_slug": e.course.slug,
            "course_name": e.course.name,
            "student_name": student_name
        })
        
    email_logs = EmailLog.objects.all()
    
    # Stats computation
    total_sent = 0
    delivered_count = 0
    failed_count = 0
    for log in email_logs:
        total_sent += log.recipient_count
        delivered_count += log.sent_count
        failed_count += log.failed_count
        
    context = admin.site.each_context(request)
    context.update({
        "courses": courses,
        "enrollments_json": json.dumps(enrollments_data),
        "email_logs": email_logs,
        "stats_total_sent": total_sent,
        "stats_delivered": delivered_count,
        "stats_failed": failed_count,
        "title": "Email Communication Console"
    })
    return render(request, "admin/courses/communication.html", context)
