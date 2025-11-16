from django.db import models

class EventRegistration(models.Model):
    eventId = models.IntegerField()
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)      # UNIQUE
    phone = models.CharField(max_length=20, unique=True)  # UNIQUE
    college = models.CharField(max_length=255)
    mode = models.CharField(max_length=50)
    amount = models.CharField(max_length=20)
    paymentId = models.CharField(max_length=200, unique=True)  # UNIQUE

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

