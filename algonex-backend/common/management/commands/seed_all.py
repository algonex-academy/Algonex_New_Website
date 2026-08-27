"""
Management command to run all seed commands in the correct order.
Usage: python manage.py seed_all
"""
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Seeds all initial database data (courses, programs, events, showcase, careers, FAQs, gallery)"

    def handle(self, *args, **options):
        commands = [
            ("seed_courses", "Courses"),
            ("seed_programs", "Programs & Fellowships"),
            ("seed_events", "Events & Workshops"),
            ("seed_showcase", "Student Showcase Projects"),
            ("seed_careers", "Job Listings & Careers"),
            ("seed_faqs", "Site FAQs"),
            ("seed_gallery", "Gallery Images"),
        ]

        self.stdout.write(self.style.NOTICE("Starting database seed for Algonex..."))

        for cmd, label in commands:
            self.stdout.write(self.style.MIGRATE_HEADING(f"\n--- Seeding {label} ({cmd}) ---"))
            try:
                call_command(cmd)
            except Exception as e:
                self.stderr.write(self.style.WARNING(f"Warning while running {cmd}: {e}"))

        self.stdout.write(self.style.SUCCESS("\nAll seed data has been successfully processed!"))
