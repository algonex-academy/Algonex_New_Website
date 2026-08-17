from django.test import TestCase
from django.contrib.auth import get_user_model
from accounts.serializers import UserDetailSerializer, CustomRegisterSerializer

User = get_user_model()


class TestUserDetailSerializer(TestCase):
    def test_serializes_user_fields(self):
        user = User.objects.create_user(
            email="test@test.com",
            password="testpass123",
            first_name="John",
            last_name="Doe",
            role="student",
            phone="1234567890",
            bio="Test bio",
        )
        serializer = UserDetailSerializer(user)
        data = serializer.data
        self.assertEqual(data["email"], "test@test.com")
        self.assertEqual(data["first_name"], "John")
        self.assertEqual(data["role"], "student")
        self.assertNotIn("password", data)

    def test_update_user_profile(self):
        user = User.objects.create_user(
            email="update@test.com",
            password="testpass123",
        )
        serializer = UserDetailSerializer(
            user, data={"bio": "Updated bio"}, partial=True
        )
        self.assertTrue(serializer.is_valid())
        updated = serializer.save()
        self.assertEqual(updated.bio, "Updated bio")

    def test_email_is_editable_and_role_is_read_only(self):
        user = User.objects.create_user(
            email="original@test.com",
            password="testpass123",
            role="student",
        )
        serializer = UserDetailSerializer(
            user, data={"email": "newemail@test.com", "role": "admin"}, partial=True
        )
        self.assertTrue(serializer.is_valid())
        updated = serializer.save()
        self.assertEqual(updated.email, "newemail@test.com")
        self.assertEqual(updated.role, "student")


class TestCustomRegisterSerializer(TestCase):
    def test_valid_registration_data(self):
        data = {
            "email": "new@test.com",
            "password1": "securepass123!",
            "password2": "securepass123!",
            "first_name": "New",
            "last_name": "User",
        }
        serializer = CustomRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_password_mismatch(self):
        data = {
            "email": "mismatch@test.com",
            "password1": "securepass123!",
            "password2": "differentpass!",
            "first_name": "Test",
            "last_name": "User",
        }
        serializer = CustomRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
