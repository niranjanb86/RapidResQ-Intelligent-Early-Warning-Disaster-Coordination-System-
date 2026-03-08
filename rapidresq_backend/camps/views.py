from rest_framework import viewsets
from .models import Camp
from .serializers import CampSerializer

class CampViewSet(viewsets.ModelViewSet):
    queryset = Camp.objects.all()
    serializer_class = CampSerializer
