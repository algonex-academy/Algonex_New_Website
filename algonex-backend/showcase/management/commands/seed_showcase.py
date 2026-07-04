from django.core.management.base import BaseCommand
from courses.models import Course, Tag
from showcase.models import StudentProject


class Command(BaseCommand):
    help = "Seed student projects showcase data"

    def handle(self, *args, **options):
        courses = list(Course.objects.filter(is_published=True)[:4])
        if not courses:
            self.stderr.write("No published courses found. Run seed_courses first.")
            return

        skills = {s.name: s for s in Tag.objects.all()}

        # --- Remove DevConnect Social if it exists ---
        deleted_count, _ = StudentProject.objects.filter(title="DevConnect Social").delete()
        if deleted_count:
            self.stdout.write(f"Deleted {deleted_count} 'DevConnect Social' record(s).")

        # --- Student Projects (no DevConnect Social) ---
        project_data = [
            {
                "title": "ShopEasy E-Commerce",
                "description": "A full-stack e-commerce platform with cart, checkout, payment integration, and admin dashboard.",
                "student_name": "Rahul S.",
                "course": 0,
                "batch_year": 2025,
                "demo_url": "https://shopeasy-demo.example.com",
                "github_url": "https://github.com/example/shopeasy",
                "tags": ["Python", "Django", "React", "PostgreSQL"],
                "is_featured": True,
                "thumbnail_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800",
            },
            {
                "title": "TaskFlow Project Manager",
                "description": "Real-time project management tool with Kanban boards, team chat, and progress tracking.",
                "student_name": "Ananya K.",
                "course": 1,
                "batch_year": 2025,
                "demo_url": "https://taskflow-demo.example.com",
                "github_url": "https://github.com/example/taskflow",
                "tags": ["React", "Node.js", "MongoDB", "Socket.io"],
                "is_featured": True,
                "thumbnail_url": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800",
            },
            {
                "title": "Sales Analytics Dashboard",
                "description": "Interactive dashboard for sales data visualization with predictive analytics and export features.",
                "student_name": "Sneha R.",
                "course": 2,
                "batch_year": 2025,
                "demo_url": "https://sales-dash.example.com",
                "tags": ["Python", "Pandas", "Plotly", "SQL"],
                "is_featured": True,
                "thumbnail_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800",
            },
            {
                "title": "HealthTrack API",
                "description": "RESTful API for health tracking with JWT auth, data validation, and comprehensive API docs.",
                "student_name": "Karthik N.",
                "course": 3,
                "batch_year": 2025,
                "github_url": "https://github.com/example/healthtrack",
                "tags": ["Java", "Spring Boot", "PostgreSQL"],
                "is_featured": False,
                "thumbnail_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800",
            },
        ]

        created_projects = 0
        for data in project_data:
            course_idx = data.pop("course")
            tags = data.pop("tags", [])
            thumbnail_url = data.pop("thumbnail_url", "")
            if course_idx < len(courses):
                project, created = StudentProject.objects.update_or_create(
                    title=data["title"],
                    defaults={
                        **data,
                        "course": courses[course_idx],
                        "thumbnail": thumbnail_url,
                        "is_published": True,
                    },
                )
                if created:
                    created_projects += 1
                else:
                    self.stdout.write(f"Updated project: {data['title']}")
                for tag_name in tags:
                    if tag_name in skills:
                        project.tech_tags.add(skills[tag_name])
        self.stdout.write(f"Created/Updated {created_projects} student projects.")
        self.stdout.write(self.style.SUCCESS("Showcase seed data complete."))
