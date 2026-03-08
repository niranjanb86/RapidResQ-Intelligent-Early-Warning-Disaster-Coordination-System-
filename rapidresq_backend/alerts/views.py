from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Alert
from .serializers import AlertSerializer

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-timestamp')
    serializer_class = AlertSerializer

    @action(detail=False, methods=['get'], url_path='active-alerts')
    def active_alerts(self, request):
        alerts = self.queryset.filter(risk_level__in=['high', 'critical'])
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)
