from django.db import models

class Volunteer(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    availability_status = models.BooleanField(default=True)

    def __str__(self):
        return self.name
