from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from programs.models import CampusCrewRegistration


class CampusCrewRegistrationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("campus-crew-register")

    def test_student_registration_success(self):
        data = {
            "registration_type": "student",
            "full_name": "Rohan Kumar",
            "email": "rohan@example.com",
            "phone": "+919876543210",
            "college_name": "IIT Madras",
            "department": "CSE",
            "year_of_study": "3rd Year",
            "student_primary_interest": "AI",
            "privacy_acknowledged": True,
            "city": "Chennai",
            "whatsapp_opt_in": False,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(response.data["data"]["reference_id"].startswith("ACC-S-"))

        reg = CampusCrewRegistration.objects.get(reference_id=response.data["data"]["reference_id"])
        self.assertEqual(reg.full_name, "Rohan Kumar")
        self.assertEqual(reg.college_name, "IIT Madras")

    def test_college_inquiry_success(self):
        data = {
            "registration_type": "college",
            "institution_name": "BMS College of Engineering",
            "full_name": "Dr. Ananya Sharma",
            "designation": "Head of Training & Placement",
            "official_email": "ananya@bmsce.ac.in",
            "phone": "+919876543211",
            "city": "Bengaluru",
            "college_primary_interest": "Campus Crew chapter",
            "authority_confirmed": True,
            "privacy_acknowledged": True,
            "message": "We would like to establish a Campus Crew chapter.",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(response.data["data"]["reference_id"].startswith("ACC-C-"))

        reg = CampusCrewRegistration.objects.get(reference_id=response.data["data"]["reference_id"])
        self.assertEqual(reg.institution_name, "BMS College of Engineering")

    def test_honeypot_rejection(self):
        data = {
            "registration_type": "student",
            "full_name": "Bot User",
            "email": "bot@example.com",
            "phone": "+919876543210",
            "privacy_acknowledged": True,
            "website_hp": "http://spambot.com",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("website_hp", response.data["error"]["details"])

    def test_missing_required_privacy_acknowledgement(self):
        data = {
            "registration_type": "student",
            "full_name": "Rohan Kumar",
            "email": "rohan@example.com",
            "phone": "+919876543210",
            "privacy_acknowledged": False,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("privacy_acknowledged", response.data["error"]["details"])
