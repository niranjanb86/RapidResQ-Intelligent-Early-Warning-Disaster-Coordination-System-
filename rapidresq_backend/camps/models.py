from django.db import models

class Camp(models.Model):
    camp_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    capacity = models.IntegerField()
    food_kits_available = models.IntegerField(default=0)
    medical_teams = models.IntegerField(default=0)
    boats_available = models.IntegerField(default=0)

    def __str__(self):
        return self.camp_name
