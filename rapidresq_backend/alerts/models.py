from django.db import models

class Alert(models.Model):
    RISK_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    SOURCE_CHOICES = [
        ('weather_api', 'Weather API'),
        ('government_warning', 'Government Warning'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    risk_level = models.CharField(max_length=20, choices=RISK_CHOICES)
    location = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)

    def __str__(self):
        return f"{self.title} - {self.risk_level}"
