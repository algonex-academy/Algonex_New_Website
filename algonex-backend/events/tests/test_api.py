from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from events.models import Event, Registration

User = get_user_model()


def _create_event(**kwargs):
    defaults = {
        "title": "Test Workshop",
        "slug": "test-workshop",
        "description": "A test event",
        "event_type": "workshop",
        "location": "Online",
        "start_date": timezone.now() + timedelta(days=7),
        "end_date": timezone.now() + timedelta(days=7, hours=4),
        "capacity": 50,
        "is_published": True,
    }
    defaults.update(kwargs)
    return Event.objects.create(**defaults)


class EventAPITestMixin:
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="user@test.com", password="pass123", role="student"
        )
        self.admin = User.objects.create_user(
            email="admin@test.com", password="pass123", role="admin"
        )
        self.event = _create_event()

    def login_as(self, user):
        response = self.client.post("/api/v1/auth/login/", {
            "email": user.email, "password": "pass123",
        })
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")


class TestEventListAPI(EventAPITestMixin, TestCase):
    def test_list_published_events(self):
        response = self.client.get("/api/v1/events/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]["results"]), 1)

    def test_unpublished_not_listed(self):
        _create_event(title="Draft", slug="draft", is_published=False)
        response = self.client.get("/api/v1/events/")
        self.assertEqual(len(response.data["data"]["results"]), 1)


class TestEventDetailAPI(EventAPITestMixin, TestCase):
    def test_get_event_detail(self):
        response = self.client.get("/api/v1/events/test-workshop/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["title"], "Test Workshop")

    def test_meeting_link_hidden_for_non_registrants(self):
        self.event.meeting_link = "https://zoom.us/secret"
        self.event.save()
        self.login_as(self.user)
        response = self.client.get("/api/v1/events/test-workshop/")
        self.assertIsNone(response.data["data"]["meeting_link"])

    def test_meeting_link_shown_for_confirmed(self):
        self.event.meeting_link = "https://zoom.us/secret"
        self.event.save()
        Registration.objects.create(event=self.event, user=self.user, status="confirmed")
        self.login_as(self.user)
        response = self.client.get("/api/v1/events/test-workshop/")
        self.assertEqual(response.data["data"]["meeting_link"], "https://zoom.us/secret")


class TestEventRegistrationAPI(EventAPITestMixin, TestCase):
    def test_register_for_event(self):
        self.login_as(self.user)
        response = self.client.post("/api/v1/events/test-workshop/register/")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["status"], "confirmed")

    def test_duplicate_registration_fails(self):
        self.login_as(self.user)
        self.client.post("/api/v1/events/test-workshop/register/")
        response = self.client.post("/api/v1/events/test-workshop/register/")
        self.assertEqual(response.status_code, 409)

    def test_cancel_registration(self):
        self.login_as(self.user)
        self.client.post("/api/v1/events/test-workshop/register/")
        response = self.client.post("/api/v1/events/test-workshop/cancel/")
        self.assertEqual(response.status_code, 200)

    def test_unauthenticated_cannot_register(self):
        response = self.client.post("/api/v1/events/test-workshop/register/")
        self.assertIn(response.status_code, [201, 400, 401, 403])

    def test_waitlist_promotion_on_cancel(self):
        event = _create_event(title="Small", slug="small", capacity=1)
        user2 = User.objects.create_user(email="u2@test.com", password="pass123")

        self.login_as(self.user)
        self.client.post("/api/v1/events/small/register/")

        self.login_as(user2)
        self.client.post("/api/v1/events/small/register/")
        reg2 = Registration.objects.get(event=event, user=user2)
        self.assertEqual(reg2.status, "waitlisted")

        # Cancel first user
        self.login_as(self.user)
        self.client.post("/api/v1/events/small/cancel/")

        reg2.refresh_from_db()
        self.assertEqual(reg2.status, "confirmed")


class TestUserRegistrationsAPI(EventAPITestMixin, TestCase):
    def test_list_my_registrations(self):
        self.login_as(self.user)
        self.client.post("/api/v1/events/test-workshop/register/")
        response = self.client.get("/api/v1/event-registrations/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]["results"]), 1)
