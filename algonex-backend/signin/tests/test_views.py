from datetime import date, timedelta
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from programs.models import Program
from signin.services import _issue_step2_token
from signin.models import StudentRegistration, Payment


User = get_user_model()


class TestRegisterStep1View(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_creates_new_user(self):
        response = self.client.post("/api/v1/register/step1/", {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "9876543210",
        })
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data["data"]["is_new"])

    def test_existing_user_with_password(self):
        User.objects.create_user(email="john@example.com", password="pass123", first_name="John", last_name="Doe")
        response = self.client.post("/api/v1/register/step1/", {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "9876543210",
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertFalse(data["is_new"])
        self.assertTrue(data["has_password"])
        self.assertIn("message", data)

    def test_invalid_email_rejected(self):
        response = self.client.post("/api/v1/register/step1/", {
            "first_name": "John",
            "last_name": "Doe",
            "email": "not-an-email",
            "phone": "9876543210",
        })
        self.assertEqual(response.status_code, 400)


class TestRegisterStep2View(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="john@example.com", password=None,
            first_name="John", last_name="Doe",
        )

    def test_creates_profile(self):
        response = self.client.post("/api/v1/register/step2/", {
            "email": "john@example.com",
            "reg_token": _issue_step2_token("john@example.com"),
            "city": "Hyderabad",
            "state": "Telangana",
            "country": "India",
            "college": "JNTU",
            "branch": "CSE",
            "degree_level": "bachelors",
            "graduation_year": 2025,
            "employment_status": "student",
            "interest_category": "fellowship",
            "terms_agreed": True,
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["data"]["registered"])

    def test_nonexistent_email_returns_404(self):
        response = self.client.post("/api/v1/register/step2/", {
            "email": "nobody@example.com",
            "reg_token": _issue_step2_token("nobody@example.com"),
            "city": "City", "state": "State",
            "college": "College", "branch": "Branch",
            "degree_level": "bachelors", "graduation_year": 2025,
            "employment_status": "student", "interest_category": "course",
            "terms_agreed": True,
        })
        self.assertEqual(response.status_code, 404)

    def test_missing_reg_token_returns_400(self):
        # IDOR guard: step2 without a valid step1 token must be rejected,
        # so an attacker cannot overwrite an arbitrary user's profile by email.
        response = self.client.post("/api/v1/register/step2/", {
            "email": "john@example.com",
            "city": "Hyderabad", "state": "Telangana",
            "college": "JNTU", "branch": "CSE",
            "degree_level": "bachelors", "graduation_year": 2025,
            "employment_status": "student", "interest_category": "fellowship",
            "terms_agreed": True,
        })
        self.assertEqual(response.status_code, 400)

    def test_terms_not_agreed_returns_400(self):
        response = self.client.post("/api/v1/register/step2/", {
            "email": "john@example.com",
            "city": "City", "state": "State",
            "college": "College", "branch": "Branch",
            "degree_level": "bachelors", "graduation_year": 2025,
            "employment_status": "student", "interest_category": "course",
            "terms_agreed": False,
        })
        self.assertEqual(response.status_code, 400)

    def test_with_program_slug(self):
        program = Program.objects.create(
            name="AI Fellowship", description="Test",
            course_type="fellowship", duration="3 months", price=0,
            location="Online", eligibility_criteria="Open",
            application_deadline=date.today() + timedelta(days=30),
            start_date=date.today() + timedelta(days=60),
            end_date=date.today() + timedelta(days=150),
            capacity=20, is_published=True,
        )
        response = self.client.post("/api/v1/register/step2/", {
            "email": "john@example.com",
            "reg_token": _issue_step2_token("john@example.com"),
            "city": "Hyderabad", "state": "Telangana",
            "college": "JNTU", "branch": "CSE",
            "degree_level": "bachelors", "graduation_year": 2025,
            "employment_status": "student", "interest_category": "fellowship",
            "program_slug": program.slug,
            "terms_agreed": True,
        })
        self.assertEqual(response.status_code, 200)


class TestStudentRegisterView(TestCase):
    def setUp(self):
        self.client = APIClient()
        import unittest.mock as mock
        self.patchers = [
            mock.patch("signin.views.create_id_card", return_value="dummy_card.png"),
            mock.patch("signin.views.create_invoice", return_value="dummy_invoice.png"),
            mock.patch("signin.views.send_confirmation_email", return_value=True),
        ]
        for patcher in self.patchers:
            patcher.start()

    def tearDown(self):
        for patcher in self.patchers:
            patcher.stop()

    def test_student_register_creates_user_and_payment(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        photo = SimpleUploadedFile("student.jpg", b"dummycontent", content_type="image/jpeg")

        response = self.client.post("/api/v1/register/", {
            "fullName": "Alice Smith",
            "email": "alice@example.com",
            "phone": "9998887776",
            "dob": "2000-01-01",
            "gender": "Female",
            "city": "Bangalore",
            "state": "Karnataka",
            "collegeName": "PESIT",
            "branch": "ISE",
            "currentYear": "4th Year",
            "courseSelected": "Java Full Stack",
            "batchType": "Regular",
            "joiningDate": "2026-07-01",
            "totalFee": 12000,
            "paidFee": 4000,
            "balanceFee": 8000,
            "upiTransactionId": "UPI998877",
            "photo": photo,
            "password": "securepassword123"
        }, format="multipart")

        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIsNotNone(data["student_id"])

        self.assertTrue(User.objects.filter(email="alice@example.com").exists())
        user = User.objects.get(email="alice@example.com")
        self.assertEqual(user.first_name, "Alice")
        self.assertEqual(user.last_name, "Smith")

        self.assertTrue(StudentRegistration.objects.filter(user=user).exists())
        reg = StudentRegistration.objects.get(user=user)
        self.assertEqual(reg.college_name, "PESIT")
        self.assertEqual(reg.course_selected, "Java Full Stack")

        self.assertEqual(reg.payments.count(), 1)
        payment = reg.payments.first()
        self.assertEqual(payment.amount, 4000)
        self.assertEqual(payment.status, "pending")
        self.assertEqual(payment.upi_transaction_id, "UPI998877")


class TestPaymentViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="student@example.com", password="password123",
            first_name="Bob", last_name="Builder",
        )
        self.client.force_authenticate(user=self.user)
        self.registration = StudentRegistration.objects.create(
            user=self.user,
            student_id="ALG12345",
            course_selected="Python Full Stack",
            total_fee=15000,
            paid_fee=5000,
            balance_fee=10000,
        )
        Payment.objects.create(
            student_registration=self.registration,
            amount=5000,
            upi_transaction_id="TXN111",
            status="approved"
        )

    def test_payment_summary(self):
        response = self.client.get("/api/v1/payments/summary/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["student_id"], "ALG12345")
        self.assertEqual(float(data["total_fee"]), 15000.0)
        self.assertEqual(float(data["paid_fee"]), 5000.0)
        self.assertEqual(float(data["balance_fee"]), 10000.0)
        self.assertEqual(len(data["payments"]), 1)
        self.assertEqual(data["payments"][0]["upi_transaction_id"], "TXN111")

    def test_submit_payment(self):
        response = self.client.post("/api/v1/payments/pay/", {
            "amount": 3000,
            "upiTransactionId": "TXN222",
            "remarks": "Second installment"
        })
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["payment"]["upi_transaction_id"], "TXN222")
        self.assertEqual(data["payment"]["status"], "pending")

        self.assertEqual(self.registration.payments.count(), 2)
        payment2 = Payment.objects.get(upi_transaction_id="TXN222")
        self.assertEqual(payment2.amount, 3000)
        self.assertEqual(payment2.status, "pending")

        self.registration.refresh_from_db()
        self.assertEqual(self.registration.paid_fee, 5000)

        payment2.status = "approved"
        payment2.save()
        self.registration.refresh_from_db()
        self.assertEqual(self.registration.paid_fee, 8000)
        self.assertEqual(self.registration.balance_fee, 7000)
