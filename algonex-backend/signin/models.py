from django.db import models

class SigninProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    college = models.CharField(max_length=150)
    branch = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=100, blank=True)
    course_interested = models.CharField(max_length=150, blank=True)
    employment_status = models.CharField(max_length=50, blank=True)
    years_of_experience = models.CharField(max_length=10, blank=True)
    passed_out_year = models.CharField(max_length=10, blank=True)
    specific_interests = models.TextField(blank=True)
    agreed_to_terms = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"
