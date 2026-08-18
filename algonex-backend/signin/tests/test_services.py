from django.test import TestCase
from django.contrib.auth import get_user_model
from signin.models import StudentRegistration
from signin.services import register_step1, register_step2, _issue_step2_token
from signin.exceptions import UserNotFound, TermsNotAgreed
from programs.models import Program
from datetime import date, timedelta

User = get_user_model()


class TestRegisterStep1(TestCase):
    def test_creates_new_user(self):
        result = register_step1(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            phone="9876543210",
        )
        self.assertTrue(result["is_new"])
        user = User.objects.get(email="john@example.com")
        self.assertEqual(user.first_name, "John")
        self.assertFalse(user.has_usable_password())

    def test_existing_user_no_password(self):
        User.objects.create_user(email="john@example.com", password=None, first_name="John", last_name="Doe")
        result = register_step1(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            phone="9876543210",
        )
        self.assertFalse(result["is_new"])
        self.assertFalse(result["has_password"])

    def test_existing_user_with_password(self):
        User.objects.create_user(email="john@example.com", password="pass123", first_name="John", last_name="Doe")
        result = register_step1(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            phone="9876543210",
        )
        self.assertFalse(result["is_new"])
        self.assertTrue(result["has_password"])

    def test_username_collision_handled(self):
        User.objects.create_user(email="john@gmail.com", password="pass123", first_name="John", last_name="G")
        result = register_step1(
            first_name="John",
            last_name="Yahoo",
            email="john@yahoo.com",
            phone="9876543210",
        )
        self.assertTrue(result["is_new"])
        user = User.objects.get(email="john@yahoo.com")
        self.assertNotEqual(user.username, "john")


class TestRegisterStep2(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="john@example.com", password=None,
            first_name="John", last_name="Doe",
        )

    def test_creates_profile(self):
        result = register_step2(
            email="john@example.com",
            reg_token=_issue_step2_token("john@example.com"),
            city="Hyderabad", state="Telangana", country="India",
            college="JNTU", branch="CSE",
            degree_level="bachelors", graduation_year=2025,
            employment_status="student",
            interest_category="fellowship",
            terms_agreed=True,
        )
        self.assertTrue(result["registered"])
        profile = StudentRegistration.objects.get(user=self.user)
        self.assertEqual(profile.city, "Hyderabad")
        self.assertEqual(profile.course_selected, "fellowship")

    def test_updates_existing_profile(self):
        StudentRegistration.objects.create(
            user=self.user, city="Old City", state="Old State",
            college_name="Old College", branch="Old Branch",
            degree_level="bachelors", graduation_year=2024,
            employment_status="student", course_selected="course",
            terms_agreed=True,
        )
        register_step2(
            email="john@example.com",
            reg_token=_issue_step2_token("john@example.com"),
            city="New City", state="Telangana", country="India",
            college="JNTU", branch="CSE",
            degree_level="masters", graduation_year=2026,
            employment_status="student",
            interest_category="fellowship",
            terms_agreed=True,
        )
        profile = StudentRegistration.objects.get(user=self.user)
        self.assertEqual(profile.city, "New City")
        self.assertEqual(profile.degree_level, "masters")

    def test_links_to_program(self):
        program = Program.objects.create(
            name="AI Fellowship", description="Test",
            course_type="fellowship", duration="3 months", price=0,
            location="Online", eligibility_criteria="Open",
            application_deadline=date.today() + timedelta(days=30),
            start_date=date.today() + timedelta(days=60),
            end_date=date.today() + timedelta(days=150),
            capacity=20, is_published=True,
        )
        register_step2(
            email="john@example.com",
            reg_token=_issue_step2_token("john@example.com"),
            city="Hyderabad", state="Telangana",
            college="JNTU", branch="CSE",
            degree_level="bachelors", graduation_year=2025,
            employment_status="student",
            interest_category="fellowship",
            program_slug=program.slug,
            terms_agreed=True,
        )
        profile = StudentRegistration.objects.get(user=self.user)
        self.assertEqual(profile.course, program)

    def test_nonexistent_email_raises(self):
        with self.assertRaises(UserNotFound):
            register_step2(
                email="nobody@example.com",
                reg_token=_issue_step2_token("nobody@example.com"),
                city="City", state="State",
                college="College", branch="Branch",
                degree_level="bachelors", graduation_year=2025,
                employment_status="student", interest_category="course",
                terms_agreed=True,
            )

    def test_terms_not_agreed_raises(self):
        with self.assertRaises(TermsNotAgreed):
            register_step2(
                email="john@example.com",
                city="City", state="State",
                college="College", branch="Branch",
                degree_level="bachelors", graduation_year=2025,
                employment_status="student", interest_category="course",
                terms_agreed=False,
            )
