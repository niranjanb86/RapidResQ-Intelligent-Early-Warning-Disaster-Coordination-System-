from rest_framework import serializers
from .models import Camp

class CampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camp
        fields = '__all__'
