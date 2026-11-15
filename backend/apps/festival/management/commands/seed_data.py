from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, date, time
from decimal import Decimal

from apps.venues.models import FestivalVenue
from apps.events.models import FestivalEvent, EventCategory, EventStatus
from apps.tourism.models import HeritageLandmark
from apps.heritage.models import CulturalExhibit
from apps.achievements.models import Achievement, QuizQuestion
from apps.festival.models import FestivalInfo
from apps.announcements.models import Announcement


class Command(BaseCommand):
    help = 'Seeds initial verified data for Mysuru Dasara 2026'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding Mysuru Dasara 2026 data...'))

        # 1. Festival Info
        info, _ = FestivalInfo.objects.update_or_create(
            year=2026,
            defaults={
                'theme': 'Heritage, Innovation & Global Karnataka',
                'theme_kn': 'ಪರಂಪರೆ, ನಾವೀನ್ಯತೆ ಮತ್ತು ಜಾಗತಿಕ ಕರ್ನಾಟಕ',
                'start_date': date(2026, 10, 11),
                'end_date': date(2026, 10, 20),
                'chief_guest': 'Eminent Literary Figure & State Dignitaries',
                'description': 'Mysuru Dasara is the state festival (Nada Habba) of Karnataka, celebrated with unparalleled royal grandeur, cultural heritage, and spiritual devotion.',
                'description_kn': 'ಮೈಸೂರು ದಸರಾ ಕರ್ನಾಟಕದ ನಾಡಹಬ್ಬವಾಗಿದ್ದು, ರಾಜವೈಭವ, ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ ಮತ್ತು ಭಕ್ತಿಭಾವದಿಂದ ಆಚರಿಸಲ್ಪಡುತ್ತದೆ.',
                'is_active': True,
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Festival info: {info}'))

        # 2. Venues
        venues_data = [
            {
                'name': 'Mysore Palace (Amba Vilas)',
                'name_kn': 'ಮೈಸೂರು ಅರಮನೆ (ಅಂಬಾ ವಿಲಾಸ)',
                'description': 'The official residence of the Wadiyar dynasty and the focal point of the Dasara celebrations, renowned for Indo-Saracenic architecture and 100,000 golden illuminations.',
                'description_kn': 'ಒಡೆಯರ್ ರಾಜಮನೆತನದ ಅಧಿಕೃತ ನಿವಾಸ ಹಾಗೂ ದಸರಾ ಆಚರಣೆಯ ಕೇಂದ್ರಬಿಂದು. ಲಕ್ಷ ದೀಪಗಳ ದೀಪಾಲಂಕಾರಕ್ಕೆ ವಿಶ್ವಪ್ರಸಿದ್ಧ.',
                'latitude': Decimal('12.305140'),
                'longitude': Decimal('76.655110'),
                'address': 'Sayyaji Rao Road, Agrahara, Chamrajpura, Mysuru, Karnataka 570001',
                'venue_type': 'palace',
                'facilities': ['Restrooms', 'Wheelchair Access', 'Information Kiosk', 'First Aid', 'Drinking Water', 'Cloakroom'],
                'capacity': 50000,
            },
            {
                'name': 'Chamundi Hills & Sri Chamundeshwari Temple',
                'name_kn': 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಮತ್ತು ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಸ್ಥಾನ',
                'description': 'Sacred hill overlooking Mysuru where the festival inaugurates with special pooja to Goddess Chamundeshwari.',
                'description_kn': 'ಮೈಸೂರಿನ ಪವಿತ್ರ ಬೆಟ್ಟ. ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಿಗೆ ಅಗ್ರಪೂಜೆ ಸಲ್ಲಿಸುವ ಮೂಲಕ ದಸರಾ ಉತ್ಸವಕ್ಕೆ ಚಾಲನೆ ದೊರೆಯುತ್ತದೆ.',
                'latitude': Decimal('12.272440'),
                'longitude': Decimal('76.668220'),
                'address': 'Chamundi Hill Road, Mysuru, Karnataka 570010',
                'venue_type': 'temple',
                'facilities': ['KSRTC Special Buses', 'Prasada Counters', 'Medical Camp', 'Drinking Water', 'Restrooms'],
                'capacity': 30000,
            },
            {
                'name': 'Bannimantap Parade Grounds',
                'name_kn': 'ಬನ್ನಿಮಂಟಪ ಪೆರೇಡ್ ಮೈದಾನ',
                'description': 'Grand parade grounds where the Jamboo Savari concludes and the magnificent Torchlight Parade and Laser/Drone show take place.',
                'description_kn': 'ಜಂಬೂ ಸವಾರಿ ಮೆರವಣಿಗೆ ಸಂಪನ್ನಗೊಳ್ಳುವ ತಾಣ. ಭವ್ಯ ಪಂಜಿನ ಕವಾಯಿತು ಮತ್ತು ಡ್ರೋನ್ ಶೋ ಇಲ್ಲಿ ಜರುಗುತ್ತದೆ.',
                'latitude': Decimal('12.325500'),
                'longitude': Decimal('76.649200'),
                'address': 'Bannimantap, Mysuru, Karnataka 570015',
                'venue_type': 'ground',
                'facilities': ['Seating Galleries', 'VIP Enclosures', 'Ambulance & Medical Team', 'Parking Zone', 'Food Courts'],
                'capacity': 45000,
            },
            {
                'name': 'Dasara Exhibition Grounds (Doddakere Maidan)',
                'name_kn': 'ದಸರಾ ವಸ್ತುಪ್ರದರ್ಶನ ಮೈದಾನ (ದೊಡ್ಡಕೆರೆ ಮೈದಾನ)',
                'description': 'Vibrant multi-acre exhibition ground hosting state pavilion stalls, handicraft emporiums, amusement rides, and culinary pavilions.',
                'description_kn': 'ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳ ಮಳಿಗೆಗಳು, ಕರಕುಶಲ ವಸ್ತುಗಳು, ಮನರಂಜನಾ ಕ್ರೀಡೆಗಳು ಮತ್ತು ಆಹಾರ ಮೇಳಗಳ ಬೃಹತ್ ಪ್ರದರ್ಶನ ತಾಣ.',
                'latitude': Decimal('12.302500'),
                'longitude': Decimal('76.661000'),
                'address': 'Opposite Mysore Palace South Gate, Mysuru, Karnataka 570010',
                'venue_type': 'ground',
                'facilities': ['Multiple Entry Gates', 'Parking Facilities', 'ATM Counters', 'Security Kiosks', 'Lost & Found Center'],
                'capacity': 60000,
            },
            {
                'name': 'Kuppanna Park (Nishad Bagh) - Flower Show',
                'name_kn': 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕ್ (ನಿಶಾದ್ ಬಾಗ್) - ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ',
                'description': 'Lush garden hosting the iconic Dasara Flower Show featuring grand floral replicas of royal palaces and national monuments.',
                'description_kn': 'ಭವ್ಯ ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ ನಡೆಯುವ ತಾಣ. ಹೂವುಗಳಿಂದ ನಿರ್ಮಿಸಿದ ಅರಮನೆ ಹಾಗೂ ಸ್ಮಾರಕಗಳ ಅದ್ಭುತ ಕಲಾಕೃತಿಗಳು.',
                'latitude': Decimal('12.309200'),
                'longitude': Decimal('76.658800'),
                'address': 'Nazarbad, Mysuru, Karnataka 570010',
                'venue_type': 'park',
                'facilities': ['Glass House', 'Restrooms', 'Wheelchair Ramps', 'Floral Souvenir Kiosks'],
                'capacity': 25000,
            },
            {
                'name': 'Brindavan Gardens (KRS Dam)',
                'name_kn': 'ಬೃಂದಾವನ ಉದ್ಯಾನವನ (ಕೆ.ಆರ್.ಎಸ್)',
                'description': 'Terraced gardens laid out below Krishnarajasagara dam featuring illuminated musical fountains and vibrant promenade.',
                'description_kn': 'ಕೃಷ್ಣರಾಜಸಾಗರ ಅಣೆಕಟ್ಟಿನ ಕೆಳಭಾಗದಲ್ಲಿರುವ ವಿಶ್ವವಿಖ್ಯಾತ ಮೆಟ್ಟಿಲು ಉದ್ಯಾನವನ ಮತ್ತು ಸಂಗೀತ ಕಾರಂಜಿ.',
                'latitude': Decimal('12.423800'),
                'longitude': Decimal('76.573800'),
                'address': 'KRS Dam Road, Mandya/Mysuru border, Karnataka 571607',
                'venue_type': 'garden',
                'facilities': ['Boating', 'Musical Fountain Gallery', 'Restaurants', 'Parking Grounds'],
                'capacity': 35000,
            },
            {
                'name': 'Kalamandira Cultural Complex',
                'name_kn': 'ಕಲಾಮಂದಿರ ಸಾಂಸ್ಕೃತಿಕ ಸಂಕೀರ್ಣ',
                'description': 'Premier auditorium and theatre campus hosting classical Karnataka drama, Carnatic vocal concerts, and dance festivals.',
                'description_kn': 'ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ, ನೃತ್ಯ ಮತ್ತು ನಾಟಕೋತ್ಸವಗಳು ನಡೆಯುವ ಮೈಸೂರಿನ ಪ್ರಮುಖ ಸಾಂಸ್ಕೃತಿಕ ಕೇಂದ್ರ.',
                'latitude': Decimal('12.311500'),
                'longitude': Decimal('76.632100'),
                'address': 'Vinoba Road, CFTRI Campus, Mysuru 570005',
                'venue_type': 'museum',
                'facilities': ['Acoustic Auditorium', 'Art Gallery', 'Green Rooms', 'Wheelchair Accessible'],
                'capacity': 1500,
            }
        ]

        venues_dict = {}
        for vd in venues_data:
            v, _ = FestivalVenue.objects.update_or_create(
                name=vd['name'],
                defaults=vd
            )
            venues_dict[vd['name']] = v
        self.stdout.write(self.style.SUCCESS(f'Created {len(venues_dict)} venues.'))

        # 3. Heritage Landmarks
        landmarks_data = [
            {
                'name': 'Mysore Palace',
                'name_kn': 'ಮೈಸೂರು ಅರಮನೆ',
                'description': 'The crown jewel of Mysuru designed by British architect Henry Irwin, showcasing royal durbar halls, stained glass ceilings, and ornate silver doors.',
                'description_kn': 'ಹೆನ್ರಿ ಇರ್ವಿನ್ ವಿನ್ಯಾಸಗೊಳಿಸಿದ ಇಂಡೋ-ಸಾರ್ಸನಿಕ್ ಶೈಲಿಯ ಭವ್ಯ ಅರಮನೆ. ದರ್ಬಾರ್ ಸಭಾಂಗಣ ಮತ್ತು ವರ್ಣರಂಜಿತ ಗಾಜಿನ ಛಾವಣಿಗಳಿಂದ ಕೂಡಿದೆ.',
                'category': 'palace',
                'latitude': Decimal('12.305140'),
                'longitude': Decimal('76.655110'),
                'historical_period': '1897 - 1912 (Rebuilt by Nalvadi Krishnaraja Wadiyar)',
                'significance': 'Seat of the Wadiyar dynasty and primary venue for royal rituals and festival illuminations.',
                'is_featured': True,
                'order': 1,
            },
            {
                'name': 'Chamundi Hill Nandi Bull',
                'name_kn': 'ಚಾಮುಂಡಿ ಬೆಟ್ಟದ ನಂದಿ ವಿಗ್ರಹ',
                'description': 'Monolithic statue of Nandi carved out of a single boulder in 1659 AD under Dodda Devaraja Wadiyar, towering over 15 feet high.',
                'description_kn': '೧೬೫೯ರಲ್ಲಿ ದೊಡ್ಡ ದೇವರಾಜ ಒಡೆಯರ್ ಕಾಲದಲ್ಲಿ ಏಕಶಿಲೆಯಲ್ಲಿ ಕೆತ್ತಲಾದ ೧೫ ಅಡಿ ಎತ್ತರದ ಭವ್ಯ ನಂದಿ ವಿಗ್ರಹ.',
                'category': 'temple',
                'latitude': Decimal('12.285200'),
                'longitude': Decimal('76.671000'),
                'historical_period': '1659 AD (Wadiyar Era)',
                'significance': 'One of the largest monolithic Nandi statues in India along the historic 1000-step pilgrimage path.',
                'is_featured': True,
                'order': 2,
            },
            {
                'name': 'Jaganmohan Palace & Art Gallery',
                'name_kn': 'ಜಗನ್ಮೋಹನ ಅರಮನೆ ಮತ್ತು ಕಲಾಶಾಲೆ',
                'description': 'Royal palace completed in 1861, housing priceless masterpieces by Raja Ravi Varma and traditional Mysore-style gold leaf paintings.',
                'description_kn': 'ರಾಜಾ ರವಿವರ್ಮ ಅವರ ಅಮೂಲ್ಯ ತೈಲಚಿತ್ರಗಳು ಮತ್ತು ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಚಿನ್ನದ ತಗಡಿನ ಚಿತ್ರಕಲೆಗಳ ಭಂಡಾರ.',
                'category': 'museum',
                'latitude': Decimal('12.306900'),
                'longitude': Decimal('76.653700'),
                'historical_period': '1861 AD (Mummadi Krishnaraja Wadiyar)',
                'significance': 'Historic royal alternate palace and home to South India\'s most celebrated classical art collections.',
                'is_featured': True,
                'order': 3,
            },
            {
                'name': 'Devaraja Market',
                'name_kn': 'ದೇವರಾಜ ಮಾರುಕಟ್ಟೆ',
                'description': 'Century-old heritage bazaar brimming with vibrant mounds of Dasara kumkum, Mysore mallige (jasmine), sandalwood perfumes, and betel leaves.',
                'description_kn': 'ಶತಮಾನದ ಇತಿಹಾಸವಿರುವ ಸಾಂಪ್ರದಾಯಿಕ ಮಾರುಕಟ್ಟೆ. ಮೈಸೂರು ಮಲ್ಲಿಗೆ, ಗಂಧದ ಎಣ್ಣೆ ಮತ್ತು ಬಣ್ಣಬಣ್ಣದ ಕುಂಕುಮಕ್ಕೆ ಹೆಸರುವಾಸಿ.',
                'category': 'market',
                'latitude': Decimal('12.305400'),
                'longitude': Decimal('76.652600'),
                'historical_period': 'Circa 1886 (Chamaraja Wadiyar IX)',
                'significance': 'Living heritage market reflecting authentic Mysuru everyday commerce and festival offerings.',
                'is_featured': True,
                'order': 4,
            },
            {
                'name': 'St. Philomena\'s Cathedral',
                'name_kn': 'ಸೇಂಟ್ ಫಿಲೋಮಿನಾ ಕ್ಯಾಥೆಡ್ರಲ್',
                'description': 'Neo-Gothic cathedral inspired by the Cologne Cathedral in Germany, featuring soaring twin spires reaching 175 feet and French stained glass.',
                'description_kn': 'ಜರ್ಮನಿಯ ಕಲೋನ್ ಕ್ಯಾಥೆಡ್ರಲ್ ಮಾದರಿಯಲ್ಲಿ ನಿರ್ಮಿಸಲಾದ ೧೭೫ ಅಡಿ ಎತ್ತರದ ಅವಳಿ ಗೋಪುರಗಳ ನವ-ಗೋಥಿಕ್ ಶೈಲಿಯ ಭವ್ಯ ಚರ್ಚ್.',
                'category': 'temple',
                'latitude': Decimal('12.318300'),
                'longitude': Decimal('76.646100'),
                'historical_period': '1936 (Designed by French architect Daly)',
                'significance': 'One of Asia\'s tallest cathedrals, celebrated for harmonious coexistence in royal Mysuru.',
                'is_featured': False,
                'order': 5,
            },
            {
                'name': 'Mysore Sand Sculpture Museum',
                'name_kn': 'ಮೈಸೂರು ಮರಳು ಶಿಲ್ಪ ಸಂಗ್ರಹಾಲಯ',
                'description': 'Unique eco-museum presenting intricate sand sculptures portraying Dasara processions, wildlife, and classical Indian mythology.',
                'description_kn': 'ದಸರಾ ಮೆರವಣಿಗೆ ಮತ್ತು ಭಾರತೀಯ ಪುರಾಣಗಳನ್ನು ಬಿಂಬಿಸುವ ಅದ್ಭುತ ಮರಳು ಕಲಾಕೃತಿಗಳ ವಿಶಿಷ್ಟ ಸಂಗ್ರಹಾಲಯ.',
                'category': 'museum',
                'latitude': Decimal('12.289100'),
                'longitude': Decimal('76.674000'),
                'historical_period': 'Contemporary Heritage',
                'significance': 'India\'s first dedicated sand sculpture museum honoring traditional themes.',
                'is_featured': False,
                'order': 6,
            }
        ]

        for ld in landmarks_data:
            HeritageLandmark.objects.update_or_create(
                name=ld['name'],
                defaults=ld
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(landmarks_data)} landmarks.'))

        # 4. Festival Events (October 2026)
        events_data = [
            {
                'title': 'Grand Dasara Inauguration at Chamundi Hills',
                'title_kn': 'ಚಾಮುಂಡಿ ಬೆಟ್ಟದಲ್ಲಿ ನಾಡಹಬ್ಬ ದಸರಾ ಉದ್ಘಾಟನೆ',
                'description': 'Auspicious inauguration of Mysuru Dasara 2026 with floral tributes to Sri Chamundeshwari by state leaders and cultural icons.',
                'description_kn': 'ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಿಗೆ ಪುಷ್ಪಾರ್ಚನೆ ಸಲ್ಲಿಸುವ ಮೂಲಕ ಮೈಸೂರು ದಸರಾ ೨೦೨೬ ಮಹೋತ್ಸವಕ್ಕೆ ವಿಧ್ಯುಕ್ತ ಚಾಲನೆ.',
                'category': EventCategory.CULTURAL,
                'venue': venues_dict['Chamundi Hills & Sri Chamundeshwari Temple'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 11, 9, 30)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 11, 12, 0)),
                'is_free': True,
                'status': EventStatus.UPCOMING,
                'is_featured': True,
                'tags': 'inauguration,tradition,chamundeshwari,religious',
            },
            {
                'title': 'Illumination Ceremony & Royal Durbar Lighting',
                'title_kn': 'ಅರಮನೆ ವಿದ್ಯುತ್ ದೀಪಾಲಂಕಾರ ಮಹೋತ್ಸವ',
                'description': 'The golden switch-on of over 100,000 bulbs illuminating Mysore Palace accompanied by the state police band and royal fanfares.',
                'description_kn': 'ಲಕ್ಷಕ್ಕೂ ಅಧಿಕ ವಿದ್ಯುತ್ ದೀಪಗಳಿಂದ ಕಂಗೊಳಿಸುವ ಮೈಸೂರು ಅರಮನೆಯ ಭವ್ಯ ದೀಪಾಲಂಕಾರ ಹಾಗೂ ಪೋಲೀಸ್ ಬ್ಯಾಂಡ್ ವಾದನ.',
                'category': EventCategory.CULTURAL,
                'venue': venues_dict['Mysore Palace (Amba Vilas)'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 11, 19, 0)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 11, 21, 30)),
                'is_free': True,
                'status': EventStatus.UPCOMING,
                'is_featured': True,
                'tags': 'palace,lighting,illumination,spectacular',
            },
            {
                'title': 'Classical Carnatic & Hindustani Music Sabha',
                'title_kn': 'ಅರಮನೆ ವೇದಿಕೆಯಲ್ಲಿ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ಸಂಜೆ',
                'description': 'Performances by celebrated national maestros in the Durbar courtyard of Mysore Palace beneath the illuminated domes.',
                'description_kn': 'ಅರಮನೆಯ ಆವರಣದಲ್ಲಿ ರಾಷ್ಟ್ರಮಟ್ಟದ ಖ್ಯಾತ ಸಂಗೀತ ವಿದ್ವಾಂಸರಿಂದ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ಕಚೇರಿಗಳು.',
                'category': EventCategory.MUSIC,
                'venue': venues_dict['Mysore Palace (Amba Vilas)'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 13, 18, 0)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 13, 22, 0)),
                'is_free': True,
                'status': EventStatus.UPCOMING,
                'is_featured': False,
                'tags': 'carnatic,hindustani,palace,music,classical',
            },
            {
                'title': 'Dasara Flower Show Gala Opening',
                'title_kn': 'ದಸರಾ ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ ಉದ್ಘಾಟನೆ',
                'description': 'Spectacular display of indigenous and exotic blooms featuring life-size floral sculptures of heritage emblems and royal chariots.',
                'description_kn': 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕಿನಲ್ಲಿ ಲಕ್ಷಾಂತರ ಹೂವುಗಳಿಂದ ಸಿದ್ಧಗೊಂಡ ಕಣ್ಮನ ಸೆಳೆಯುವ ಕಲಾಕೃತಿಗಳ ಪ್ರದರ್ಶನ.',
                'category': EventCategory.FLOWER,
                'venue': venues_dict['Kuppanna Park (Nishad Bagh) - Flower Show'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 12, 10, 0)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 20, 21, 0)),
                'is_free': False,
                'ticket_price': Decimal('50.00'),
                'status': EventStatus.UPCOMING,
                'is_featured': True,
                'tags': 'flowers,garden,kuppanna,sculpture,family',
            },
            {
                'title': 'State Dasara Exhibition Opening',
                'title_kn': 'ಅಖಿಲ ಭಾರತ ದಸರಾ ವಸ್ತುಪ್ರದರ್ಶನ ಪ್ರಾರಂಭ',
                'description': 'Opening of the mega shopping and cultural carnival spanning hundreds of state department stalls and artisan bazaars.',
                'description_kn': 'ದೊಡ್ಡಕೆರೆ ಮೈದಾನದಲ್ಲಿ ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳು ಹಾಗೂ ಕುಶಲಕರ್ಮಿಗಳ ಬೃಹತ್ ಪ್ರದರ್ಶನ ಮತ್ತು ವ್ಯಾಪಾರ ಮೇಳ.',
                'category': EventCategory.EXHIBITION,
                'venue': venues_dict['Dasara Exhibition Grounds (Doddakere Maidan)'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 11, 16, 0)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 20, 22, 0)),
                'is_free': False,
                'ticket_price': Decimal('30.00'),
                'status': EventStatus.UPCOMING,
                'is_featured': False,
                'tags': 'shopping,handicrafts,stalls,exhibition',
            },
            {
                'title': 'Yuva Dasara Youth Festival & Concerts',
                'title_kn': 'ಯುವ ದಸರಾ ಸಂಭ್ರಮ ಮತ್ತು ಗಾಯನ ಸಂಜೆ',
                'description': 'High-energy youth cultural festival featuring contemporary music performances, university bands, and prominent Indian artists.',
                'description_kn': 'ಯುವ ಸಮೂಹಕ್ಕಾಗಿ ಆಯೋಜಿಸಲಾಗುವ ಗಾಯನ, ನೃತ್ಯ ಮತ್ತು ಸಮಕಾಲೀನ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳ ಸರಣಿ.',
                'category': EventCategory.MUSIC,
                'venue': venues_dict['Bannimantap Parade Grounds'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 15, 17, 30)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 18, 22, 30)),
                'is_free': True,
                'status': EventStatus.UPCOMING,
                'is_featured': True,
                'tags': 'youth,concert,singing,dance,energy',
            },
            {
                'title': 'Aahara Mela (Dasara Food Festival)',
                'title_kn': 'ದಸರಾ ಆಹಾರ ಮೇಳ',
                'description': 'Grand celebration of traditional Karnataka culinary heritage: Mysore Pak, Maddur Vada, Jolada Rotti, Akki Rotti, and tribal cuisine.',
                'description_kn': 'ಮೈಸೂರು ಪಾಕ್, ಮದ್ದೂರು ವಡೆ, ಜೋಳದ ರೊಟ್ಟಿ ಸೇರಿದಂತೆ ಕರ್ನಾಟಕದ ನಾನಾ ಭಾಗಗಳ ಸಾಂಪ್ರದಾಯಿಕ ತಿನಿಸುಗಳ ರಸದೌತಣ.',
                'category': EventCategory.FOOD,
                'venue': venues_dict['Dasara Exhibition Grounds (Doddakere Maidan)'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 12, 11, 0)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 19, 22, 0)),
                'is_free': True,
                'status': EventStatus.UPCOMING,
                'is_featured': True,
                'tags': 'food,mysorepak,cuisines,karnataka,authentic',
            },
            {
                'title': 'Traditional Dasara Kusti (Wrestling) Tournament',
                'title_kn': 'ಸಾಂಪ್ರದಾಯಿಕ ದಸರಾ ಕುಸ್ತಿ ಪಂದ್ಯಾವಳಿ',
                'description': 'Historic sand-pit wrestling (Nada Kusti) competitions at the D. Devaraja Urs Stadium carrying on royal martial traditions.',
                'description_kn': 'ರಾಜಮನೆತನದ ಆಶ್ರಯದಲ್ಲಿ ಬೆಳೆದುಬಂದ ಮಣ್ಣಿನ ಅಖಾಡದ ಸಾಂಪ್ರದಾಯಿಕ ನಾಡಕುಸ್ತಿ ಪಂದ್ಯಾವಳಿಗಳು.',
                'category': EventCategory.SPORTS,
                'venue': venues_dict['Dasara Exhibition Grounds (Doddakere Maidan)'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 14, 15, 0)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 17, 20, 0)),
                'is_free': True,
                'status': EventStatus.UPCOMING,
                'is_featured': False,
                'tags': 'wrestling,kusti,sports,tradition,strength',
            },
            {
                'title': 'Vijayadashami Jamboo Savari Grand Procession',
                'title_kn': 'ವಿಜಯದಶಮಿ ವಿಶ್ವವಿಖ್ಯಾತ ಜಂಬೂ ಸವಾರಿ ಮೆರವಣಿಗೆ',
                'description': 'The pinnacle of Mysuru Dasara: Captain elephant carrying the 750 kg Golden Howdah (Chinnada Ambari) with Goddess Chamundeshwari, escorted by 50+ cultural folk troupes and tableaux.',
                'description_kn': 'ದಸರೆಯ ಪರಮೋಚ್ಚ ವೈಭವ: ೭೫೦ ಕೆ.ಜಿ ಚಿನ್ನದ ಅಂಬಾರಿಯಲ್ಲಿ ವಿರಾಜಮಾನಳಾದ ಚಾಮುಂಡೇಶ್ವರಿಯ ಮೆರವಣಿಗೆ ಮತ್ತು ಜಾನಪದ ಕಲಾತಂಡಗಳ ವೈಭವ.',
                'category': EventCategory.JAMBOO_SAVARI,
                'venue': venues_dict['Mysore Palace (Amba Vilas)'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 20, 13, 30)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 20, 17, 30)),
                'is_free': True,
                'status': EventStatus.UPCOMING,
                'is_featured': True,
                'tags': 'jamboosavari,ambari,elephant,procession,highlight',
            },
            {
                'title': 'Torchlight Parade & Sky Drone Symphony',
                'title_kn': 'ಪಂಜಿನ ಕವಾಯಿತು ಮತ್ತು ಭವ್ಯ ಆಕಾಶ ಡ್ರೋನ್ ಪ್ರದರ್ಶನ',
                'description': 'Breathtaking military motorcycle acrobatics, ceremonial torchlight drills, laser displays, and 1,000 synchronized LED drones forming royal motifs.',
                'description_kn': 'ಸಾಹಸಮಯ ಮೋಟಾರ್ ಬೈಕ್ ಕಸರತ್ತು, ಪಂಜಿನ ಕವಾಯಿತು, ಲೇಸರ್ ಬೆಳಕು ಮತ್ತು ೧೦೦೦ ಡ್ರೋನ್‌ಗಳ ಆಕಾಶ ಕಲಾ ವೈಭವ.',
                'category': EventCategory.TORCHLIGHT,
                'venue': venues_dict['Bannimantap Parade Grounds'],
                'start_datetime': timezone.make_aware(datetime(2026, 10, 20, 19, 0)),
                'end_datetime': timezone.make_aware(datetime(2026, 10, 20, 21, 30)),
                'is_free': False,
                'ticket_price': Decimal('250.00'),
                'status': EventStatus.UPCOMING,
                'is_featured': True,
                'tags': 'torchlight,drones,parade,bannimantap,finale',
            }
        ]

        for ed in events_data:
            FestivalEvent.objects.update_or_create(
                title=ed['title'],
                defaults=ed
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(events_data)} festival events.'))

        # 5. Cultural Exhibits
        exhibits_data = [
            {
                'name': 'Dollu Kunitha (Drum Dance)',
                'name_kn': 'ಡೊಳ್ಳು ಕುಣಿತ',
                'description': 'Energetic ritual folk dance of Karnataka accompanied by resonant beating of the dollu drum, dedicated to deity Beereshwara.',
                'description_kn': 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಗಂಡುಕಲೆಯಾದ ಡೊಳ್ಳು ಕುಣಿತ. ಬೀರೇಶ್ವರನ ಆರಾಧನೆಯೊಂದಿಗೆ ವೀರಾವೇಶದ ನೃತ್ಯ.',
                'category': 'dance',
                'model_url': '/models/dollu_kunitha.glb',
                'is_featured': True,
                'order': 1,
            },
            {
                'name': 'Yakshagana Folk Theatre',
                'name_kn': 'ಯಕ್ಷಗಾನ',
                'description': 'Traditional coastal Karnataka theatre blending dramatic mythological dialogue, vibrant face makeup, elaborate headgear (Muguta), and rhythmic dance.',
                'description_kn': 'ಕರಾವಳಿ ಮತ್ತು ಮಲೆನಾಡಿನ ಗಂಡುಕಲೆ. ವರ್ಣರಂಜಿತ ವೇಷಭೂಷಣ, ಮುಂಡಾಸು, ನೃತ್ಯ ಮತ್ತು ಆಶುಭಾಷಣದ ಅದ್ಭುತ ನಾಟಕೀಯ ಕಲೆ.',
                'category': 'dance',
                'model_url': '/models/yakshagana.glb',
                'is_featured': True,
                'order': 2,
            },
            {
                'name': 'Veeragase Martial Dance',
                'name_kn': 'ವೀರಗಾಸೆ',
                'description': 'Valor-filled folk dance performed by Jangama dancers bearing ceremonial swords and daggers portraying the lore of Veerabhadra.',
                'description_kn': 'ಶಿವನ ಅವತಾರವಾದ ವೀರಭದ್ರನ ಕಥಾನಕವನ್ನು ವೀರಾವೇಶದಿಂದ ಪ್ರದರ್ಶಿಸುವ ಜಾನಪದ ವೀರನೃತ್ಯ.',
                'category': 'dance',
                'model_url': '/models/veeragase.glb',
                'is_featured': True,
                'order': 3,
            },
            {
                'name': 'Pooja Kunitha',
                'name_kn': 'ಪೂಜಾ ಕುಣಿತ',
                'description': 'Graceful worship dance where performers balance tall, ornate bamboo structures crowned with deity masks upon their heads.',
                'description_kn': 'ತಲೆಯ ಮೇಲೆ ದೇವತೆಯ ಮುಖವಾಡವಿರುವ ಬಿದಿರಿನ ಚೌಕಟ್ಟನ್ನು ಹೊತ್ತು ತೂಗಾಡದಂತೆ ಮಾಡುವ ನಯನಮನೋಹರ ನೃತ್ಯ.',
                'category': 'dance',
                'model_url': '',
                'is_featured': False,
                'order': 4,
            },
            {
                'name': 'Mysore Traditional Gold Leaf Painting',
                'name_kn': 'ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಚಿತ್ರಕಲೆ',
                'description': 'Classical South Indian school of painting characterized by muted colors, delicate gesso relief work, and pure 24-carat gold foil overlay.',
                'description_kn': 'ಒಡೆಯರ್ ಆಸ್ಥಾನದಲ್ಲಿ ವಿಕಸನಗೊಂಡ ಶುದ್ಧ ಚಿನ್ನದ ತಗಡು ಹಾಗೂ ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳ ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆ.',
                'category': 'craft',
                'model_url': '',
                'is_featured': True,
                'order': 5,
            },
            {
                'name': 'Mysore Silk Weaving Tradition',
                'name_kn': 'ಮೈಸೂರು ರೇಷ್ಮೆ ನೇಯ್ಗೆ ಪರಂಪರೆ',
                'description': 'Centuries-old royal silk weaving featuring 100% pure mulberry silk and electroplated real gold/silver zari border craftsmanship.',
                'description_kn': 'ಶುದ್ಧ ಹಿಪ್ಪುನೇರಳೆ ರೇಷ್ಮೆ ಹಾಗೂ ಅಪರಂಜಿ ಜರಿಯಿಂದ ಕೂಡಿದ ಜಗತ್ಪ್ರಸಿದ್ಧ ಮೈಸೂರು ರೇಷ್ಮೆ ಸೀರೆಗಳ ನೇಯ್ಗೆ ಕಲೆ.',
                'category': 'craft',
                'model_url': '',
                'is_featured': True,
                'order': 6,
            }
        ]

        for exd in exhibits_data:
            CulturalExhibit.objects.update_or_create(
                name=exd['name'],
                defaults=exd
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(exhibits_data)} cultural exhibits.'))

        # 6. Achievements & Badges
        achievements_data = [
            {
                'name': 'Palace Explorer',
                'name_kn': 'ಅರಮನೆ ಅನ್ವೇಷಕ',
                'description': 'Explored the interactive 3D Mysore Palace and illuminated the royal facade.',
                'icon': '🏰',
                'points': 50,
                'category': 'explorer',
            },
            {
                'name': 'Jamboo Savari Veteran',
                'name_kn': 'ಜಂಬೂ ಸವಾರಿ ದರ್ಶಕ',
                'description': 'Witnessed the complete Golden Howdah digital procession from spectator vantage points.',
                'icon': '🐘',
                'points': 75,
                'category': 'enthusiast',
            },
            {
                'name': 'Dasara Historian',
                'name_kn': 'ದಸರಾ ಇತಿಹಾಸಕಾರ',
                'description': 'Answered all heritage quiz questions correctly about the Wadiyar dynasty.',
                'icon': '📜',
                'points': 100,
                'category': 'historian',
            },
            {
                'name': 'Cultural Connoisseur',
                'name_kn': 'ಸಾಂಸ್ಕೃತಿಕ ರಸಿಕ',
                'description': 'Explored all 6 traditional Karnataka folk art exhibits in the Cultural Museum.',
                'icon': '🎭',
                'points': 60,
                'category': 'enthusiast',
            },
            {
                'name': 'Festival Master Planner',
                'name_kn': 'ದಸರಾ ಯೋಜನಾ ನಿಪುಣ',
                'description': 'Created and saved a personalized multi-day Mysuru Dasara 2026 itinerary.',
                'icon': '🗺️',
                'points': 40,
                'category': 'participant',
            }
        ]

        for ach in achievements_data:
            Achievement.objects.update_or_create(
                name=ach['name'],
                defaults=ach
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(achievements_data)} achievements.'))

        # 7. Quiz Questions
        questions_data = [
            {
                'question': 'How much does the sacred Golden Howdah (Chinnada Ambari) carried during Jamboo Savari weigh?',
                'question_kn': 'ಜಂಬೂ ಸವಾರಿಯಲ್ಲಿ ಆನೆಯು ಹೊರುವ ಚಿನ್ನದ ಅಂಬಾರಿಯ ತೂಕ ಎಷ್ಟು?',
                'options': ['500 kg', '750 kg', '1000 kg', '1250 kg'],
                'correct_answer_index': 1,
                'explanation': 'The Golden Howdah weighs approximately 750 kilograms and is crafted from pure gold with intricate filigree work.',
                'difficulty': 'medium',
                'category': 'Jamboo Savari',
            },
            {
                'question': 'Which Mysore ruler is credited with institutionalizing the grand public Dasara celebrations in Srirangapatna in 1610 AD?',
                'question_kn': '೧೬೧೦ರಲ್ಲಿ ಶ್ರೀರಂಗಪಟ್ಟಣದಲ್ಲಿ ದಸರಾ ಮಹೋತ್ಸವವನ್ನು ಪ್ರಾರಂಭಿಸಿದ ಮೈಸೂರು ದೊರೆ ಯಾರು?',
                'options': ['Raja Wadiyar I', 'Ranadhira Kanteerava Narasaraja', 'Chikka Devaraja Wadiyar', 'Mummadi Krishnaraja Wadiyar'],
                'correct_answer_index': 0,
                'explanation': 'Raja Wadiyar I initiated the state Dasara festivities upon ascending the throne of Srirangapatna in 1610 AD.',
                'difficulty': 'hard',
                'category': 'History',
            },
            {
                'question': 'Approximately how many electric incandescent bulbs are used to illuminate the Mysore Palace facade during Dasara nights?',
                'question_kn': 'ದಸರಾ ರಾತ್ರಿಗಳಲ್ಲಿ ಮೈಸೂರು ಅರಮನೆಯನ್ನು ಬೆಳಗಿಸಲು ಸರಿಸುಮಾರು ಎಷ್ಟು ವಿದ್ಯುತ್ ಬಲ್ಬ್‌ಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ?',
                'options': ['25,000 bulbs', '50,000 bulbs', 'Nearly 100,000 bulbs', '250,000 bulbs'],
                'correct_answer_index': 2,
                'explanation': 'The grand palace facade is adorned with nearly 100,000 golden incandescent bulbs that are switched on simultaneously.',
                'difficulty': 'easy',
                'category': 'Mysore Palace',
            },
            {
                'question': 'Which celebrated elephant famously carried the Golden Howdah for a record 14 consecutive years until 2011?',
                'question_kn': '೨೦೧೧ರವರೆಗೆ ಸತತ ೧೪ ವರ್ಷಗಳ ಕಾಲ ಚಿನ್ನದ ಅಂಬಾರಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಹೊತ್ತ ಖ್ಯಾತ ಆನೆ ಯಾವುದು?',
                'options': ['Abhimanyu', 'Balarama', 'Drona', 'Arjuna'],
                'correct_answer_index': 1,
                'explanation': 'Elephant Balarama, renowned for his serene temperament, carried the Chinnada Ambari 14 times consecutively between 1999 and 2011.',
                'difficulty': 'medium',
                'category': 'Traditions',
            }
        ]

        for q in questions_data:
            QuizQuestion.objects.update_or_create(
                question=q['question'],
                defaults=q
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(questions_data)} quiz questions.'))

        # 8. Announcements
        announcements_data = [
            {
                'title': 'Mysuru Dasara 2026 Dates Officially Announced',
                'title_kn': 'ಮೈಸೂರು ದಸರಾ ೨೦೨೬ರ ಅಧಿಕೃತ ದಿನಾಂಕಗಳು ಪ್ರಕಟ',
                'content': 'The high-power Dasara committee has confirmed that the 2026 festivities will take place from October 11 to October 20. Vijayadashami Jamboo Savari will be on October 20.',
                'content_kn': 'ದಸರಾ ಉನ್ನತ ಮಟ್ಟದ ಸಮಿತಿಯು ಅಕ್ಟೋಬರ್ ೧೧ ರಿಂದ ೨೦ ರವರೆಗೆ ನಾಡಹಬ್ಬವನ್ನು ಆಚರಿಸಲು ನಿರ್ಧರಿಸಿದೆ. ಅಕ್ಟೋಬರ್ ೨೦ ರಂದು ವಿಜಯದಶಮಿ ಜಂಬೂ ಸವಾರಿ ಜರುಗಲಿದೆ.',
                'category': 'general',
                'is_urgent': True,
                'is_active': True,
            },
            {
                'title': 'KSRTC Special Dasara Tour Buses & Electric Shuttles',
                'title_kn': 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ದಸರಾ ವಿಶೇಷ ಪ್ರವಾಸ ಮತ್ತು ಇವಿ ಬಸ್‌ಗಳು',
                'content': 'Electric feeder shuttles will connect Chamundi Hill, Railway Station, Suburban Bus Stand, and all satellite parking lots to Mysore Palace free of charge.',
                'content_kn': 'ಅರಮನೆ, ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಮತ್ತು ನಿಲ್ದಾಣಗಳ ನಡುವೆ ಉಚಿತ ವಿದ್ಯುತ್ ಚಾಲಿತ ಫೀಡರ್ ಬಸ್‌ಗಳ ಸಂಚಾರ ವ್ಯವಸ್ಥೆ ಮಾಡಲಾಗಿದೆ.',
                'category': 'transport',
                'is_urgent': False,
                'is_active': True,
            }
        ]

        for ann in announcements_data:
            Announcement.objects.update_or_create(
                title=ann['title'],
                defaults=ann
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(announcements_data)} announcements.'))

        self.stdout.write(self.style.SUCCESS('All initial seed data successfully loaded!'))
