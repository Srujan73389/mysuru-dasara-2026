import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { announcementsAPI } from '@/services/api';
import { audioManager } from '@/audio/audioManager';

interface EmergencyContact {
  title: string;
  titleKn: string;
  num: string;
  type: string;
  icon: string;
  desc: string;
  color: string;
}

interface MedicalCamp {
  id: string;
  location: string;
  locationKn: string;
  landmark: string;
  beds: number;
  doctorInCharge: string;
  ambulanceStandby: boolean;
  phone: string;
  timing: string;
}

interface ParkingHub {
  id: string;
  name: string;
  nameKn: string;
  landmark: string;
  capacity: string;
  shuttleFrequency: string;
  dropPoint: string;
  fee: string;
  status: 'Open' | 'Filling Fast' | 'Available';
}

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Mysuru Dasara 2026 Dates Officially Announced',
    title_kn: 'ಮೈಸೂರು ದಸರಾ ೨೦೨೬ರ ಅಧಿಕೃತ ದಿನಾಂಕಗಳು ಪ್ರಕಟ',
    category: 'General',
    is_urgent: true,
    published_at: '2026-11-02',
    content: 'The high-power Dasara committee has confirmed that the 2026 festivities will take place from October 11 to October 20. Vijayadashami Jamboo Savari will commence on October 20 at 2:15 PM.',
    content_kn: 'ದಸರಾ ಉನ್ನತ ಮಟ್ಟದ ಸಮಿತಿಯು ೨೦೨೬ರ ಉತ್ಸವ ದಿನಾಂಕಗಳನ್ನು ಅಕ್ಟೋಬರ್ ೧೧ ರಿಂದ ೨೦ ರವರೆಗೆ ನಿಗದಿಪಡಿಸಿದೆ. ಅಕ್ಟೋಬರ್ ೨೦ ರಂದು ಭವ್ಯ ವಿಜಯದಶಮಿ ಜಂಬೂಸವಾರಿ ಮೆರವಣಿಗೆ ಜರುಗಲಿದೆ.',
  },
  {
    id: 2,
    title: 'KSRTC Special Dasara Tour Buses & Free Electric Shuttles',
    title_kn: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ದಸರಾ ವಿಶೇಷ ಬಸ್ಸುಗಳು ಮತ್ತು ಉಚಿತ ವಿದ್ಯುತ್ ಶಟಲ್‌ಗಳು',
    category: 'Transport',
    is_urgent: false,
    published_at: '2026-11-02',
    content: 'Zero-emission electric feeder shuttles will connect Chamundi Hill base, Railway Station, Suburban Bus Stand, and all 7 satellite parking lots directly to Mysore Palace Gates free of charge every 8 minutes.',
    content_kn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟದ ತಪ್ಪಲು, ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಮತ್ತು ಉಪನಗರ ಬಸ್ ನಿಲ್ದಾಣದಿಂದ ಅರಮನೆ ದ್ವಾರಗಳಿಗೆ ಪ್ರತಿ ೮ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಉಚಿತ ವಿದ್ಯುತ್ ಶಟಲ್ ಬಸ್ ಸೇವೆ ಲಭ್ಯವಿದೆ.',
  },
  {
    id: 3,
    title: 'Drone Flight Prohibition & Airspace Security Advisory',
    title_kn: 'ಅನುಮತಿಯಿಲ್ಲದ ಡ್ರೋನ್ ಹಾರಾಟ ನಿಷೇಧ ಹಾಗೂ ವಾಯುಪ್ರದೇಶ ಭದ್ರತೆ',
    category: 'Security',
    is_urgent: true,
    published_at: '2026-11-01',
    content: 'All unauthorized private drone flights within a 5 km radius of Mysore Palace, Bannimantap, and procession corridors are strictly prohibited under Section 144 of CrPC. Only official 1,600-drone swarm operators have DGCA clearance.',
    content_kn: 'ಅರಮನೆ, ಬನ್ನಿಮಂಟಪ ಹಾಗೂ ಜಂಬೂಸವಾರಿ ಮಾರ್ಗದಲ್ಲಿ ಯಾವುದೇ ಖಾಸಗಿ ಡ್ರೋನ್ ಹಾರಾಟವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ. ನಿಯಮ ಉಲ್ಲಂಘಿಸುವವರ ವಿರುದ್ಧ ಕಠಿಣ ಕ್ರಮ ಕೈಗೊಳ್ಳಲಾಗುವುದು.',
  },
  {
    id: 4,
    title: 'Palace Illumination Timings & Heritage Lighting Corridor',
    title_kn: 'ಅರಮನೆ ದೀಪಾಲಂಕಾರದ ಸಮಯ ಮತ್ತು ಹೆರಿಟೇಜ್ ಲೈಟಿಂಗ್',
    category: 'Tourism',
    is_urgent: false,
    published_at: '2026-10-30',
    content: 'Mysore Palace illuminated with 100,000 bulbs daily from 7:00 PM to 9:30 PM. On Vijayadashami night, illumination will be extended until 11:00 PM along with 124 km of illuminated city boulevards.',
    content_kn: 'ದಸರಾ ದಿನಗಳಲ್ಲಿ ಪ್ರತಿ ಸಂಜೆ ೭:೦೦ ರಿಂದ ೯:೩೦ ರವರೆಗೆ ಮತ್ತು ವಿಜಯದಶಮಿ ದಿನ ರಾತ್ರಿ ೧೧:೦೦ ರವರೆಗೆ ೧ ಲಕ್ಷ ಬಲ್ಬುಗಳ ಅರಮನೆ ದೀಪಾಲಂಕಾರ ಜಗಮಗಿಸಲಿದೆ.',
  },
  {
    id: 5,
    title: 'Free Wheelchairs & Golf Buggy Service for Seniors & Divyangjan',
    title_kn: 'ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಮತ್ತು ದಿವ್ಯಾಂಗರಿಗೆ ಉಚಿತ ಗಾಲ್ಫ್ ಕಾರ್ಟ್ ಮತ್ತು ವೀಲ್‌ಚೇರ್ ಸೇವೆ',
    category: 'Accessibility',
    is_urgent: false,
    published_at: '2026-10-28',
    content: 'Dedicated accessibility counters operating at Varaha Gate (Gate 2) and Balarama Gate (Gate 4) providing complimentary wheelchairs, motorized golf carts, and volunteers to assist elders and differently-abled visitors.',
    content_kn: 'ಅರಮನೆ ವರಾಹ ದ್ವಾರ ಮತ್ತು ಬಲರಾಮ ದ್ವಾರದಲ್ಲಿ ಹಿರಿಯರಿಗೆ ಮತ್ತು ವಿಕಲಚೇತನರಿಗೆ ಉಚಿತ ವೀಲ್‌ಚೇರ್ ಹಾಗೂ ಬ್ಯಾಟರಿ ಚಾಲಿತ ಗಾಲ್ಫ್ ಕಾರ್ಟ್ ಸೇವೆ ಆರಂಭಿಸಲಾಗಿದೆ.',
  },
];

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: 'Police Control Room / Emergency Helpline',
    titleKn: 'ಪೊಲೀಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ',
    num: '112',
    type: 'Police Emergency',
    icon: '🚔',
    desc: 'Unified national emergency response service. Live GPS vehicle dispatch within 5 minutes across Mysuru city.',
    color: 'from-blue-600/30 to-blue-950/40 border-blue-500/40',
  },
  {
    title: 'Ambulance & Medical Emergency',
    titleKn: 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ / ಆಂಬ್ಯುಲೆನ್ಸ್',
    num: '108',
    type: 'Medical Ambulance',
    icon: '🚑',
    desc: '24/7 advanced life support ambulances with ICU doctors stationed along the Dasara procession route.',
    color: 'from-rose-600/30 to-rose-950/40 border-rose-500/40',
  },
  {
    title: 'Fire & Disaster Rescue Response',
    titleKn: 'ಅಗ್ನಿಶಾಮಕ ಮತ್ತು ರಕ್ಷಣಾ ದಳ',
    num: '101',
    type: 'Fire & Rescue',
    icon: '🚒',
    desc: 'Karnataka State Fire & Emergency Services with rapid water mist units and hydraulic ladder equipment.',
    color: 'from-amber-600/30 to-amber-950/40 border-amber-500/40',
  },
  {
    title: 'Women Safety & Pink Hoysala Patrol',
    titleKn: 'ಮಹಿಳಾ ಸುರಕ್ಷತಾ ಸಹಾಯವಾಣಿ',
    num: '1091',
    type: 'Women Helpline',
    icon: '🛡️',
    desc: 'Dedicated women police officers and Pink Hoysala patrol units active at all exhibition and concert grounds.',
    color: 'from-purple-600/30 to-purple-950/40 border-purple-500/40',
  },
  {
    title: 'Dasara Central Tourist Information Helpdesk',
    titleKn: 'ದಸರಾ ಕೇಂದ್ರೀಯ ಪ್ರವಾಸಿ ಮಾಹಿತಿ ಕೇಂದ್ರ',
    num: '0821-2444777',
    type: 'Tourist Help',
    icon: 'ℹ️',
    desc: 'Multi-lingual official helpdesk providing gold pass info, schedule updates, and lost luggage support.',
    color: 'from-emerald-600/30 to-emerald-950/40 border-emerald-500/40',
  },
  {
    title: 'KSRTC Central Enquiry & Special Shuttles',
    titleKn: 'ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ವಿಚಾರಣೆ',
    num: '0821-2443602',
    type: 'Transport Feeder',
    icon: '🚌',
    desc: 'Information on 2,500 extra interstate Dasara buses and city circular electric shuttle routes.',
    color: 'from-cyan-600/30 to-cyan-950/40 border-cyan-500/40',
  },
  {
    title: 'Railway Enquiry (Mysuru Junction - MYS)',
    titleKn: 'ರೈಲ್ವೆ ವಿಚಾರಣೆ ಕೇಂದ್ರ',
    num: '139',
    type: 'Railways',
    icon: '🚆',
    desc: 'Special Vande Bharat and extra MEMU express trains between Bengaluru and Mysuru during festival week.',
    color: 'from-indigo-600/30 to-indigo-950/40 border-indigo-500/40',
  },
  {
    title: 'Child Helpline & Lost Children Support',
    titleKn: 'ಮಕ್ಕಳ ಸಹಾಯವಾಣಿ / ನಾಪತ್ತೆ ಮಕ್ಕಳು',
    num: '1098',
    type: 'Child Protection',
    icon: '👶',
    desc: 'Special identification wristband distribution and child reunion centers at Palace Varaha Gate and Exhibition.',
    color: 'from-orange-600/30 to-orange-950/40 border-orange-500/40',
  },
];

const MEDICAL_CAMPS: MedicalCamp[] = [
  {
    id: 'm1',
    location: 'Mysore Palace South Gate (Varaha Enclosure)',
    locationKn: 'ಮೈಸೂರು ಅರಮನೆ ದಕ್ಷಿಣ ದ್ವಾರ (ವರಾಹ ಆವರಣ)',
    landmark: 'Opposite Curzon Park',
    beds: 12,
    doctorInCharge: 'Dr. Ramesh Kumar (K.R. Hospital ICU Team)',
    ambulanceStandby: true,
    phone: '0821-2444108',
    timing: '24 Hours Open',
  },
  {
    id: 'm2',
    location: 'K.R. Circle Heritage Junction',
    locationKn: 'ಕೆ.ಆರ್. ವೃತ್ತ ಜಂಕ್ಷನ್',
    landmark: 'Near D. Devaraj Urs Road Entrance',
    beds: 8,
    doctorInCharge: 'Dr. Ananya Rao (General Medicine)',
    ambulanceStandby: true,
    phone: '0821-2444109',
    timing: '8:00 AM – 11:00 PM',
  },
  {
    id: 'm3',
    location: 'Sayyaji Rao Road / Ayurveda College',
    locationKn: 'ಸಯ್ಯಾಜಿ ರಾವ್ ರಸ್ತೆ / ಆಯುರ್ವೇದ ಕಾಲೇಜು',
    landmark: 'Midway on Jamboo Savari Procession Route',
    beds: 10,
    doctorInCharge: 'Dr. Suresh Patil (Trauma Care)',
    ambulanceStandby: true,
    phone: '0821-2444110',
    timing: '24 Hours Open',
  },
  {
    id: 'm4',
    location: 'Bannimantap Torchlight Parade Ground',
    locationKn: 'ಬನ್ನಿಮಂಟಪ ಪಂಜಿನ ಕವಾಯಿತು ಮೈದಾನ',
    landmark: 'VIP Gate & General Enclosure',
    beds: 16,
    doctorInCharge: 'Dr. Manjunath (District Health Officer)',
    ambulanceStandby: true,
    phone: '0821-2444111',
    timing: '2:00 PM – Midnight',
  },
  {
    id: 'm5',
    location: 'Doddakere Dasara Exhibition Grounds',
    locationKn: 'ದೊಡ್ಡಕೆರೆ ದಸರಾ ವಸ್ತುಪ್ರದರ್ಶನ ಆವರಣ',
    landmark: 'Gate 2 Medical Booth',
    beds: 6,
    doctorInCharge: 'Dr. Sneha Hegde',
    ambulanceStandby: true,
    phone: '0821-2444112',
    timing: '10:00 AM – 10:30 PM',
  },
  {
    id: 'm6',
    location: 'Chamundi Hill Top Temple Complex',
    locationKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇಗುಲ ಆವರಣ',
    landmark: 'Bus Stand Medical Camp',
    beds: 8,
    doctorInCharge: 'Dr. Girish (Cardiac First Responder)',
    ambulanceStandby: true,
    phone: '0821-2444113',
    timing: '5:00 AM – 10:00 PM',
  },
];

const PARKING_HUBS: ParkingHub[] = [
  {
    id: 'p1',
    name: 'Lalitha Mahal Helipad Grounds',
    nameKn: 'ಲಲಿತ ಮಹಲ್ ಹೆಲಿಪ್ಯಾಡ್ ಮೈದಾನ',
    landmark: 'Lalitha Mahal Palace Road, East Mysuru',
    capacity: '3,500 Cars • 2,000 Two-Wheelers',
    shuttleFrequency: 'Every 6-8 Mins (Electric KSRTC)',
    dropPoint: 'Mysore Palace Varaha Gate',
    fee: 'Free Satellite Parking',
    status: 'Available',
  },
  {
    id: 'p2',
    name: 'Bannimantap East Parade Grounds',
    nameKn: 'ಬನ್ನಿಮಂಟಪ ಪೂರ್ವ ಮೈದಾನ',
    landmark: 'Bengaluru-Mysuru Road Entrance',
    capacity: '2,800 Cars • 1,500 Two-Wheelers',
    shuttleFrequency: 'Every 8 Mins',
    dropPoint: 'K.R. Circle & Palace North Gate',
    fee: 'Free Satellite Parking',
    status: 'Available',
  },
  {
    id: 'p3',
    name: 'Chamundi Vihar Stadium Grounds',
    nameKn: 'ಚಾಮುಂಡಿ ವಿಹಾರ್ ಕ್ರೀಡಾಂಗಣ',
    landmark: 'Nazarbad Main Road',
    capacity: '1,800 Cars • 1,000 Two-Wheelers',
    shuttleFrequency: 'Every 10 Mins',
    dropPoint: 'Hardringe Circle / Exhibition Gate',
    fee: 'Free Satellite Parking',
    status: 'Filling Fast',
  },
  {
    id: 'p4',
    name: 'Maharaja College Centenary Grounds',
    nameKn: 'ಮಹಾರಾಜ ಕಾಲೇಜು ಶತಮಾನೋತ್ಸವ ಮೈದಾನ',
    landmark: 'JLB Road, University Campus',
    capacity: '2,200 Vehicles',
    shuttleFrequency: 'Every 8 Mins',
    dropPoint: 'Ramaswamy Circle & Palace West Gate',
    fee: 'Free Satellite Parking',
    status: 'Available',
  },
  {
    id: 'p5',
    name: 'South Western Railway Workshop Grounds',
    nameKn: 'ರೈಲ್ವೆ ವರ್ಕ್‌ಶಾಪ್ ಮೈದಾನ',
    landmark: 'Near Mysuru Railway Station Back Gate',
    capacity: '2,000 Vehicles',
    shuttleFrequency: 'Every 7 Mins',
    dropPoint: 'Sayyaji Rao Road Corridor',
    fee: 'Free Satellite Parking',
    status: 'Available',
  },
];

const COMPREHENSIVE_FAQS = [
  {
    q: 'What time is Mysore Palace illuminated during Dasara?',
    qKn: 'ದಸರಾ ಸಮಯದಲ್ಲಿ ಮೈಸೂರು ಅರಮನೆ ದೀಪಾಲಂಕಾರ ಯಾವಾಗ ಇರುತ್ತದೆ?',
    a: 'During all 10 festival days, the Palace lights (100,000 bulbs) are turned on daily between 7:00 PM and 9:30 PM. On Vijayadashami night, illumination extends up to 11:00 PM.',
    aKn: '೧೦ ದಿನಗಳ ಕಾಲ ಪ್ರತಿದಿನ ಸಂಜೆ ೭:೦೦ ರಿಂದ ೯:೩೦ ರವರೆಗೆ ಮತ್ತು ವಿಜಯದಶಮಿ ದಿನ ರಾತ್ರಿ ೧೧:೦೦ ರವರೆಗೆ ಅರಮನೆ ದೀಪಾಲಂಕಾರ ಬೆಳಗುತ್ತದೆ.',
    cat: 'Palace',
  },
  {
    q: 'Is there an admission fee to view the Vijayadashami Jamboo Savari?',
    qKn: 'ಜಂಬೂಸವಾರಿ ಮೆರವಣಿಗೆ ನೋಡಲು ಪ್ರವೇಶ ಶುಲ್ಕವಿದೆಯೇ?',
    a: 'Viewing along Sayyaji Rao Road and public spectator barricades (4.5 km route) is completely free of charge. Seated grandstand enclosures inside the Palace courtyard require advance Gold Cards or Tourism Department passes.',
    aKn: 'ಸಯ್ಯಾಜಿ ರಾವ್ ರಸ್ತೆ ಮತ್ತು ರಾಜಮಾರ್ಗದಲ್ಲಿ ಸಾರ್ವಜನಿಕರಿಗೆ ಮೆರವಣಿಗೆ ವೀಕ್ಷಣೆ ಉಚಿತ. ಅರಮನೆ ಆವರಣದ ಆಸನಗಳಿಗೆ ಮುಂಗಡ ಗೋಲ್ಡ್ ಕಾರ್ಡ್ ಅಗತ್ಯ.',
    cat: 'Jamboo Savari',
  },
  {
    q: 'Where can senior citizens and persons with disabilities get wheelchair assistance?',
    qKn: 'ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಮತ್ತು ದಿವ್ಯಾಂಗರಿಗೆ ವೀಲ್‌ಚೇರ್ ಸೌಲಭ್ಯ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?',
    a: 'Complimentary wheelchairs and battery-operated golf carts are stationed at Varaha Gate (Gate 2) and Balarama Gate (Gate 4) with dedicated volunteer escort staff and accessible barrier-free ramps.',
    aKn: 'ಅರಮನೆಯ ವರಾಹ ದ್ವಾರ (ದ್ವಾರ ೨) ಮತ್ತು ಬಲರಾಮ ದ್ವಾರದಲ್ಲಿ ಉಚಿತ ವೀಲ್‌ಚೇರ್ ಮತ್ತು ಬ್ಯಾಟರಿ ಗಾಲ್ಫ್ ಕಾರ್ಟ್ ಸೇವೆ ಲಭ್ಯವಿದೆ.',
    cat: 'Accessibility',
  },
  {
    q: 'How do satellite parking lots and free feeder shuttles work?',
    qKn: 'ಉಚಿತ ಸ್ಯಾಟಲೈಟ್ ಪಾರ್ಕಿಂಗ್ ಮತ್ತು ಶಟಲ್ ಬಸ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?',
    a: 'Park your private car at Lalitha Mahal, Bannimantap, or Chamundi Vihar grounds. Free KSRTC electric shuttle buses run back-and-forth every 7-10 minutes directly to Palace gates, saving you from inner-city traffic jams.',
    aKn: 'ಲಲಿತ ಮಹಲ್, ಬನ್ನಿಮಂಟಪ ಅಥವಾ ಚಾಮುಂಡಿ ವಿಹಾರ್‌ನಲ್ಲಿ ಉಚಿತವಾಗಿ ವಾಹನ ನಿಲ್ಲಿಸಿ. ಅಲ್ಲಿಂದ ಪ್ರತಿ ೮ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಅರಮನೆಗೆ ಉಚಿತ ಇ-ಬಸ್ ಶಟಲ್ ಸೇವೆ ಇರುತ್ತದೆ.',
    cat: 'Transport',
  },
  {
    q: 'What should I do if a family member or child gets lost in the crowd?',
    qKn: 'ಜನದಟ್ಟಣೆಯಲ್ಲಿ ಕುಟುಂಬದವರು ಅಥವಾ ಮಕ್ಕಳು ಕಾಣೆಯಾದರೆ ಏನು ಮಾಡಬೇಕು?',
    a: 'Immediately visit the Central Lost & Found Booth at Varaha Gate or dial 112 / 1098. Free child identification QR wristbands with parents’ phone numbers are distributed at all main entrance gates.',
    aKn: 'ಕೂಡಲೇ ವರಾಹ ದ್ವಾರದ ಬಳಿಯ ನಾಪತ್ತೆ ಪರಿಹಾರ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ೧೧೨ / ೧೦೯೮ ಗೆ ಕರೆ ಮಾಡಿ. ಪ್ರವೇಶ ದ್ವಾರಗಳಲ್ಲೇ ಮಕ್ಕಳಿಗೆ ಕಾಂಟ್ಯಾಕ್ಟ್ ರಿಸ್ಟ್‌ಬ್ಯಾಂಡ್ ನೀಡಲಾಗುತ್ತದೆ.',
    cat: 'Safety',
  },
  {
    q: 'Are drinking water and hygienic public restrooms available at the venues?',
    qKn: 'ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಶೌಚಾಲಯ ಸೌಲಭ್ಯಗಳು ಎಲ್ಲಿವೆ?',
    a: 'Yes, 48 RO purified drinking water kiosks and 32 mobile She-Toilet complexes are positioned at 200m intervals along the entire procession route, Exhibition grounds, and Kuppanna Park.',
    aKn: 'ಮೆರವಣಿಗೆ ಮಾರ್ಗದುದ್ದಕ್ಕೂ ಪ್ರತಿ ೨೦೦ ಮೀಟರ್‌ಗೆ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರಿನ ಕಿಯೋಸ್ಕ್ ಹಾಗೂ ಮಹಿಳೆಯರಿಗಾಗಿ ಪಿಂಕ್ ಶೌಚಾಲಯಗಳು ಲಭ್ಯವಿವೆ.',
    cat: 'Civic',
  },
];

export default function VisitorServicesPage() {
  const [activeTab, setActiveTab] = useState<'notices' | 'emergency' | 'medical' | 'parking' | 'accessibility' | 'faq'>('notices');
  const [announcements, setAnnouncements] = useState<any[]>(DEFAULT_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [copiedNum, setCopiedNum] = useState<string | null>(null);

  useEffect(() => {
    announcementsAPI
      .getAnnouncements()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        if (data.length > 0) {
          // Merge API data with rich fallback
          const combined = [...data];
          DEFAULT_ANNOUNCEMENTS.forEach((def) => {
            if (!combined.some((c) => c.title.toLowerCase().includes(def.title.toLowerCase().split(' ')[0]))) {
              combined.push(def);
            }
          });
          setAnnouncements(combined);
        }
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    audioManager.playBellSound();
    setCopiedNum(text);
    setTimeout(() => setCopiedNum(null), 2500);
  };

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return announcements;
    return announcements.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.title_kn && a.title_kn.toLowerCase().includes(q)) ||
        a.content.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [announcements, searchQuery]);

  // Filtered Medical Camps
  const filteredMedical = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return MEDICAL_CAMPS;
    return MEDICAL_CAMPS.filter(
      (m) =>
        m.location.toLowerCase().includes(q) ||
        m.landmark.toLowerCase().includes(q) ||
        m.doctorInCharge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COMPREHENSIVE_FAQS;
    return COMPREHENSIVE_FAQS.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        f.cat.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen pt-20 pb-36 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Visitor Services & Emergency Dashboard"
        titleKn="ಪ್ರವಾಸಿ ಸೇವೆಗಳು ಮತ್ತು ತುರ್ತು ನಿರ್ವಹಣಾ ಫಲಕ"
        subtitle="Official festival notices, 24/7 emergency helplines, on-ground medical camps, free satellite parking lots, electric shuttles, and accessible assistance for Mysuru Dasara 2026."
      />

      {/* Copy Notification Toast */}
      {copiedNum && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>Copied {copiedNum} to clipboard!</span>
        </div>
      )}

      {/* 🚨 LIVE URGENT BROADCAST BANNER */}
      <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-amber-950/70 to-slate-950/90 border border-rose-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <p className="text-xs font-bold text-rose-200 uppercase tracking-wider font-mono">
            LIVE BROADCAST:
          </p>
          <p className="text-xs text-slate-200">
            24/7 Police Patrol & 8 Advanced Trauma Care Units Active across Palace Corridor • Free Shuttles Running
          </p>
        </div>

        <button
          onClick={() => setActiveTab('emergency')}
          className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500 hover:text-white border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-end sm:self-center"
        >
          View All SOS Contacts →
        </button>
      </div>

      {/* 📞 QUICK SOS HOTLINE BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
        {[
          { label: 'Police', num: '112', icon: '🚨', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
          { label: 'Ambulance', num: '108', icon: '🚑', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
          { label: 'Fire Force', num: '101', icon: '🚒', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
          { label: 'Women Helpline', num: '1091', icon: '🛡️', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
          { label: 'Tourist Help', num: '0821-2444777', icon: 'ℹ️', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
          { label: 'KSRTC Shuttles', num: '0821-2443602', icon: '🚌', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
        ].map((sos, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl border ${sos.color} flex flex-col justify-between backdrop-blur-md shadow-sm`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold">{sos.label}</span>
              <span className="text-base">{sos.icon}</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10">
              <a
                href={`tel:${sos.num}`}
                className="text-xs font-black font-mono hover:underline truncate"
                title="Click to call"
              >
                {sos.num}
              </a>
              <button
                onClick={() => copyToClipboard(sos.num)}
                className="text-[10px] text-white/50 hover:text-white cursor-pointer ml-1"
                title="Copy number"
              >
                📋
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Tab Pills */}
        <div className="glass p-1.5 rounded-2xl border border-amber-400/30 flex flex-wrap gap-1.5 bg-slate-950/80 shadow-lg">
          {[
            { id: 'notices', label: '📢 Committee Notices', count: filteredAnnouncements.length },
            { id: 'emergency', label: '🚨 SOS Helplines', count: EMERGENCY_CONTACTS.length },
            { id: 'medical', label: '🏥 Medical Camps', count: MEDICAL_CAMPS.length },
            { id: 'parking', label: '🅿️ Satellite Parking', count: PARKING_HUBS.length },
            { id: 'accessibility', label: '♿ Divyangjan Services', count: 'Free' },
            { id: 'faq', label: '❓ Visitor FAQ', count: COMPREHENSIVE_FAQS.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  audioManager.playBellSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-gold-glow scale-102 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/25 text-black' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices, hospitals, parking..."
            className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-900/80 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-400 backdrop-blur-md transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. COMMITTEE NOTICES TAB */}
      {/* ========================================================= */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-3xl border transition-all duration-200 ${
                ann.is_urgent
                  ? 'bg-gradient-to-br from-amber-950/40 to-slate-950/80 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/40'
                  : 'glass bg-slate-950/60 border-white/10 hover:border-amber-400/30'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {ann.category}
                  </span>
                  {ann.is_urgent && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>High Priority Notice</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(ann.published_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">{ann.title}</h4>
              {ann.title_kn && (
                <p className="text-xs text-amber-400/90 font-kannada font-medium mt-0.5 mb-2">
                  {ann.title_kn}
                </p>
              )}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{ann.content}</p>
              {ann.content_kn && (
                <p className="text-xs text-slate-400 font-kannada leading-relaxed pt-2 border-t border-white/10">
                  {ann.content_kn}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EMERGENCY SOS HELPLINES TAB */}
      {/* ========================================================= */}
      {activeTab === 'emergency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((c, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border bg-gradient-to-br ${c.color} shadow-lg flex flex-col justify-between transition-all hover:scale-[1.02]`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 text-white font-mono border border-white/10">
                    {c.type}
                  </span>
                  <span className="text-2xl">{c.icon}</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug">{c.title}</h4>
                <p className="text-xs text-amber-300 font-kannada font-medium mt-0.5 mb-2">
                  {c.titleKn}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {c.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <a
                  href={`tel:${c.num.split('/')[0].trim()}`}
                  className="text-base font-black font-mono text-amber-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>📞</span>
                  <span>{c.num}</span>
                </a>
                <button
                  onClick={() => copyToClipboard(c.num)}
                  className="px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-xs font-semibold text-slate-200 border border-white/10 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MEDICAL CAMPS & FIRST AID TAB */}
      {/* ========================================================= */}
      {activeTab === 'medical' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/20 text-xs text-slate-200 flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <p>
              Over <strong>18 on-ground first-aid camps</strong> with dedicated emergency ICU doctors, cardiac monitors, and zero-delay ambulance corridors are stationed across the Jamboo Savari route.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedical.map((m) => (
              <div
                key={m.id}
                className="glass p-5 rounded-3xl border border-white/10 bg-slate-950/60 hover:border-rose-400/40 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      {m.beds} Hospital Beds
                    </span>
                    {m.ambulanceStandby && (
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Ambulance Ready
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{m.location}</h4>
                  <p className="text-xs text-amber-400/90 font-kannada font-medium mt-0.5 mb-2">
                    {m.locationKn}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">📍 Landmark:</span>
                      <span className="font-semibold text-white truncate">{m.landmark}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">👨‍⚕️ In Charge:</span>
                      <span className="font-semibold text-amber-200 truncate">{m.doctorInCharge}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">⏰ Timing:</span>
                      <span className="font-semibold text-emerald-300">{m.timing}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                  <a
                    href={`tel:${m.phone}`}
                    className="font-mono font-bold text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <span>📞</span>
                    <span>{m.phone}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(m.phone)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SATELLITE PARKING & SHUTTLES TAB */}
      {/* ========================================================= */}
      {activeTab === 'parking' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-xs text-slate-200 flex items-center gap-3">
            <span className="text-2xl">🅿️</span>
            <p>
              To eliminate traffic gridlocks around Mysore Palace, <strong>7 high-capacity satellite parking grounds</strong> with free 100% electric KSRTC feeder shuttles operating every 6-8 minutes directly to festival gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARKING_HUBS.map((p) => (
              <div
                key={p.id}
                className="glass p-5 rounded-3xl border border-white/10 bg-slate-950/60 hover:border-amber-400/40 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                      {p.fee}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        p.status === 'Available'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      ● {p.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">{p.name}</h4>
                  <p className="text-xs text-amber-400/90 font-kannada font-medium mt-0.5 mb-2">
                    {p.nameKn}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">🚗 Capacity:</span>
                      <span className="font-semibold text-white">{p.capacity}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">🚌 Shuttle:</span>
                      <span className="font-semibold text-amber-200">{p.shuttleFrequency}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">🎯 Drop Gate:</span>
                      <span className="font-semibold text-emerald-300">{p.dropPoint}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[180px]">📍 {p.landmark}</span>
                  <span className="text-emerald-400 font-bold font-mono">Free Bus</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. DIVYANGJAN & ACCESSIBILITY TAB */}
      {/* ========================================================= */}
      {activeTab === 'accessibility' && (
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-amber-400/30 bg-slate-950/70 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2 font-mono">
              <span>♿ Divyangjan, Senior Citizens & Inclusive Access</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The Mysuru Dasara Executive Committee has committed to making the festival fully accessible for persons with reduced mobility, senior citizens, and visually/auditory-impaired visitors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-2xl">🦼</span>
                <h4 className="text-sm font-bold text-white">Free Wheelchair Counters</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Over 120 sanitized wheelchairs with trained volunteer assistants available at Varaha Gate (Gate 2), Balarama Gate (Gate 4), and Doddakere Exhibition Gate 1.
                </p>
                <span className="text-[10px] text-amber-300 font-mono block">Refundable Security: Nil (Free)</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-2xl">🚐</span>
                <h4 className="text-sm font-bold text-white">Motorized Battery Golf Carts</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  24 complimentary electric golf carts ferry senior citizens and differently-abled visitors inside the vast 72-acre Palace estate and Chamundi Hill summit.
                </p>
                <span className="text-[10px] text-emerald-300 font-mono block">Priority Seating Access</span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-2xl">🦯</span>
                <h4 className="text-sm font-bold text-white">Tactile Paths & Braille Maps</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tactile guide paving from parking areas to viewing stands, audio guide narrations, and Braille festival maps available at central information kiosks.
                </p>
                <span className="text-[10px] text-cyan-300 font-mono block">Audio Tour Enabled in App</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">
                Need on-ground volunteer assistance for wheelchair mobility?
              </span>
              <a
                href="tel:0821-2444777"
                className="px-4 py-2 rounded-xl bg-amber-400 text-black font-extrabold cursor-pointer shadow-gold-glow flex items-center gap-1.5"
              >
                <span>📞 Call Accessibility Helpdesk</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. VISITOR FAQ ACCORDION TAB */}
      {/* ========================================================= */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={idx}
                className="glass rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono font-bold">
                      {faq.cat}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                      {faq.qKn && (
                        <p className="text-xs text-amber-400/80 font-kannada mt-0.5">{faq.qKn}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-base text-amber-400 transform transition-transform duration-200">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/10 space-y-2 bg-white/[0.02]">
                    <p>{faq.a}</p>
                    {faq.aKn && (
                      <p className="text-amber-300/80 font-kannada pt-1 border-t border-white/5">
                        {faq.aKn}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
