import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rapidresq_backend.settings')
django.setup()

from alerts.models import Alert
from reports.models import Report
from volunteers.models import Volunteer
from camps.models import Camp

Alert.objects.get_or_create(
    title='Flood Warning: Heavy Rainfall',
    description='Rainfall > 80mm detected. Potential flooding in low-lying areas. Avoid driving.',
    risk_level='critical',
    location='9.9620, 76.2910',
    source='weather_api'
)

Report.objects.get_or_create(
    name='John Doe',
    phone='9876543210',
    address='MG Road, Kochi',
    location='9.9723, 76.2848',
    incident_type='People trapped',
    description='Water level rising rapidly inside the house.',
    status='pending'
)

Volunteer.objects.get_or_create(
    name='Kerala Rescue Force Alpha',
    phone='1122334455',
    location='9.9515, 76.2750',
    availability_status=True
)

Camp.objects.get_or_create(
    camp_name='Kochi Relief Camp',
    location='9.9231, 76.2570',
    capacity=500,
    food_kits_available=300,
    medical_teams=2,
    boats_available=5
)

print("Database seeded with mock dummy data.")
