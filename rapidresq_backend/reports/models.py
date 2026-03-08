from django.db import models

class Report(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('resolved', 'Resolved'),
    ]

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    location = models.CharField(max_length=255) # Assuming "lat,lng" string
    incident_type = models.CharField(max_length=100)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_volunteer = models.ForeignKey('accounts.UserProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_reports')

    def __str__(self):
        return f"{self.incident_type} at {self.location}"
