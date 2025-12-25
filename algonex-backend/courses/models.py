from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    image = models.URLField()
    level = models.CharField(max_length=50)
    duration = models.CharField(max_length=50)
    modules = models.CharField(max_length=20)
    gradient = models.CharField(max_length=300, null=True, blank=True)
    category = models.CharField(max_length=100)
    rating = models.CharField(max_length=10)
    students = models.CharField(max_length=20)
    trending = models.BooleanField(default=False)

    def __str__(self):
        return self.title
