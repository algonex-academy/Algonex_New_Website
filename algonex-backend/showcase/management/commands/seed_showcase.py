from django.core.management.base import BaseCommand
from courses.models import Course, Tag
from showcase.models import AlumniProfile, StudentProject


class Command(BaseCommand):
    help = "Seed alumni profiles and student projects"

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

        # --- Alumni Profiles ---
        alumni_data = [
            {"name": "Priya M.", "course": 0, "batch_year": 2025, "current_company": "TCS", "current_role": "Backend Developer", "package_range": "6-8 LPA", "short_quote": "Algonex gave me the skills to land my dream job.", "is_featured": True},
            {"name": "Rahul S.", "course": 0, "batch_year": 2025, "current_company": "Infosys", "current_role": "Full Stack Developer", "package_range": "5-7 LPA", "short_quote": "The hands-on projects made all the difference.", "is_featured": True},
            {"name": "Ananya K.", "course": 1, "batch_year": 2025, "current_company": "Wipro", "current_role": "Frontend Developer", "package_range": "5-6 LPA", "short_quote": "I went from zero coding to employed in 4 months.", "is_featured": True},
            {"name": "Vikram D.", "course": 1, "batch_year": 2024, "current_company": "Accenture", "current_role": "React Developer", "package_range": "7-9 LPA", "short_quote": "Best investment in my career.", "is_featured": False},
            {"name": "Sneha R.", "course": 2, "batch_year": 2025, "current_company": "Deloitte", "current_role": "Data Analyst", "package_range": "8-10 LPA", "short_quote": "The analytics curriculum is world-class.", "is_featured": True},
            {"name": "Arjun P.", "course": 2, "batch_year": 2024, "current_company": "Amazon", "current_role": "Business Analyst", "package_range": "12-15 LPA", "short_quote": "Algonex helped me transition from ops to analytics.", "is_featured": True},
            {"name": "Divya L.", "course": 0, "batch_year": 2024, "current_company": "Zoho", "current_role": "Python Developer", "package_range": "6-8 LPA", "short_quote": "The mentorship was incredible.", "is_featured": False},
            {"name": "Karthik N.", "course": 3, "batch_year": 2025, "current_company": "Cognizant", "current_role": "Java Developer", "package_range": "5-7 LPA", "short_quote": "Solid foundation in enterprise development.", "is_featured": False},
            {"name": "Meera T.", "course": 0, "batch_year": 2025, "current_company": "Freshworks", "current_role": "Backend Engineer", "package_range": "8-10 LPA", "short_quote": "From career switcher to engineer in 3 months.", "is_featured": True},
            {"name": "Sanjay V.", "course": 1, "batch_year": 2024, "current_company": "Flipkart", "current_role": "Frontend Engineer", "package_range": "10-12 LPA", "short_quote": "The MERN curriculum is spot-on for the industry.", "is_featured": True},
        ]

        created_alumni = 0
        for data in alumni_data:
            course_idx = data.pop("course")
            if course_idx < len(courses):
                _, created = AlumniProfile.objects.get_or_create(
                    name=data["name"], course=courses[course_idx],
                    defaults={**data, "is_published": True},
                )
                if created:
                    created_alumni += 1
        self.stdout.write(f"Created {created_alumni} alumni profiles.")

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
        self.stdout.write(f"Created {created_projects} new student projects.")
        self.stdout.write(self.style.SUCCESS("Showcase seed data complete."))
