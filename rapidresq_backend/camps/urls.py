from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampViewSet

router = DefaultRouter()
router.register(r'camps', CampViewSet, basename='camps')

urlpatterns = [
    path('', include(router.urls)),
]
