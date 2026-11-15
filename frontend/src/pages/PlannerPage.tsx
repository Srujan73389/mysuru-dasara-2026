import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';
import jsPDF from 'jspdf';

// -------------------------------------------------------------
// Data Types
// -------------------------------------------------------------
export interface ItineraryItem {
  id: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  title: string;
  titleKn: string;
  venue: string;
  venueAddress: string;
  category: 'heritage' | 'ceremony' | 'procession' | 'food' | 'spectacle' | 'music' | 'shopping' | 'kids';
  notes: string;
  proTip: string;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Peak';
  estDuration: string;
  cost: number; // in INR
  isDone?: boolean;
}

export interface ItineraryDay {
  day: number;
  date: string;
  dayTitle: string;
  dayTitleKn: string;
  transitDistanceKm: number;
  evShuttleRecommended: string;
  items: ItineraryItem[];
}

// -------------------------------------------------------------
// Curated Preset Personas
// -------------------------------------------------------------
interface PresetPersona {
  id: string;
  title: string;
  titleKn: string;
  badge: string;
  icon: string;
  description: string;
  duration: number;
  style: 'budget' | 'comfort' | 'vip';
  party: 'solo' | 'couple' | 'family' | 'seniors';
  interests: string[];
}

const PRESET_PERSONAS: PresetPersona[] = [
  {
    id: 'royal',
    title: 'The Royal Connoisseur',
    titleKn: 'ರಾಜ ವೈಭವ ಪ್ರವಾಸ',
    badge: 'Most Popular',
    icon: '👑',
    description: 'Palace Durbar, Golden Throne, Vintage Car Parade, and the 100,000 bulb evening illumination.',
    duration: 3,
    style: 'vip',
    party: 'couple',
    interests: ['heritage', 'ceremony', 'spectacle'],
  },
  {
    id: 'jamboo',
    title: 'Jamboo Savari Climax',
    titleKn: 'ಜಂಬೂ ಸವಾರಿ ದರ್ಶನ',
    badge: 'Festival Peak',
    icon: '🐘',
    description: 'Captain elephant Arjuna carrying the 750kg Golden Howdah and the Bannimantap 1,000-drone show.',
    duration: 2,
    style: 'comfort',
    party: 'family',
    interests: ['procession', 'spectacle', 'heritage'],
  },
  {
    id: 'foodie',
    title: 'Foodie & Heritage Shopper',
    titleKn: 'ಆಹಾರ ಹಾಗೂ ಶಾಪಿಂಗ್',
    badge: 'Culinary Trail',
    icon: '🍛',
    description: '100+ stalls at Aahara Mela, original melt-in-mouth Mysore Pak, and authentic KSIC Royal Silk shopping.',
    duration: 2,
    style: 'budget',
    party: 'solo',
    interests: ['food', 'shopping', 'heritage'],
  },
  {
    id: 'family',
    title: 'Family & Kids Adventure',
    titleKn: 'ಕುಟುಂಬ ಹಾಗೂ ಮಕ್ಕಳು',
    badge: 'Fun & Relaxed',
    icon: '👨‍👩‍👧‍👦',
    description: 'Kuppanna Glasshouse Flower Show, Mysuru Zoo safari, and Dasara Exhibition carnival rides.',
    duration: 3,
    style: 'comfort',
    party: 'family',
    interests: ['kids', 'flowers', 'food', 'heritage'],
  },
  {
    id: 'music',
    title: 'Classical Sangeetha Sabha',
    titleKn: 'ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ಯಾತ್ರೆ',
    badge: 'Arts & Culture',
    icon: '🎶',
    description: 'Mesmerizing Carnatic violin, veena recitals in Durbar Courtyard, and traditional Janapada folk dancers.',
    duration: 3,
    style: 'comfort',
    party: 'seniors',
    interests: ['music', 'ceremony', 'heritage'],
  },
  {
    id: 'express',
    title: '24-Hour Express Whirlwind',
    titleKn: 'ಏಕದಿನ ಸೂಪರ್ ಪ್ರವಾಸ',
    badge: 'Fast Track',
    icon: '⚡',
    description: 'For visitors with only 1 day: Chamundi dawn blessings, Palace tour, Aahara Mela, and night illumination.',
    duration: 1,
    style: 'comfort',
    party: 'solo',
    interests: ['heritage', 'food', 'spectacle'],
  },
];

// -------------------------------------------------------------
// Master Itinerary Days Database (Rich, Authentic, Multi-Day)
// -------------------------------------------------------------
const MASTER_ITINERARY_DAYS: ItineraryDay[] = [
  {
    day: 1,
    date: 'Oct 11, 2026',
    dayTitle: 'Inaugural Sanctum & Royal Grandeur',
    dayTitleKn: 'ದಸರಾ ಉದ್ಘಾಟನೆ ಮತ್ತು ಅರಮನೆ ವೈಭವ',
    transitDistanceKm: 18.5,
    evShuttleRecommended: 'EV Route 1 (Chamundi Hill ↔ Palace ↔ Exhibition)',
    items: [
      {
        id: 'd1-1',
        time: '08:30 AM',
        period: 'morning',
        title: 'Chamundi Hills Inaugural Pooja & Floral Shower',
        titleKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟದಲ್ಲಿ ದಸರಾ ಉದ್ಘಾಟನಾ ಪೂಜೆ',
        venue: 'Sri Chamundeshwari Temple',
        venueAddress: 'Chamundi Hill Steps Corridor, Mysuru',
        category: 'ceremony',
        notes: 'Witness state dignitaries and head priests offering pushparchane to the presiding deity Sri Chamundeshwari atop the hill.',
        proTip: 'Board the Chamundi EV Shuttle by 07:45 AM from Lalitha Mahal to beat the hilltop ghat queue.',
        crowdLevel: 'High',
        estDuration: '2.5 hrs',
        cost: 0,
      },
      {
        id: 'd1-2',
        time: '12:00 PM',
        period: 'afternoon',
        title: 'Historic Devaraja Market & Guru Sweets Mysore Pak',
        titleKn: 'ದೇವರಾಜ ಮಾರುಕಟ್ಟೆ ಹಾಗೂ ಮೂಲ ಮೈಸೂರು ಪಾಕ್',
        venue: 'Devaraja Market & Guru Sweet Mart',
        venueAddress: 'Sayyaji Rao Road, Near K.R. Circle, Mysuru',
        category: 'food',
        notes: 'Walk through 130-year-old fruit and flower arcades, then taste original warm ghee Mysore Pak crafted by descendants of royal chef Kakasura Madappa.',
        proTip: 'Ask for the freshly prepared hot batch around 12:30 PM; melt-in-the-mouth texture guaranteed.',
        crowdLevel: 'Moderate',
        estDuration: '1.5 hrs',
        cost: 150,
      },
      {
        id: 'd1-3',
        time: '03:30 PM',
        period: 'afternoon',
        title: 'Amba Vilas Palace & Golden Throne Durbar Tour',
        titleKn: 'ಅಂಬಾವಿಲಾಸ ಅರಮನೆ ಮತ್ತು ಚಿನ್ನದ ಸಿಂಹಾಸನ ದರ್ಶನ',
        venue: 'Mysore Palace Internal Museums',
        venueAddress: 'Sayyaji Rao Road, Agrahara, Mysuru',
        category: 'heritage',
        notes: 'Marvel at the stained glass ceiling of Kalyana Mantapa, carved rosewood doors, and the sacred fig-wood Golden Throne assembled solely during Dasara.',
        proTip: 'Pre-book online tickets to bypass ticket counter lines; wear easily removable footwear for entry checks.',
        crowdLevel: 'Peak',
        estDuration: '2.5 hrs',
        cost: 120,
      },
      {
        id: 'd1-4',
        time: '06:45 PM',
        period: 'evening',
        title: 'Palace 100,000 Bulb Illumination Spectacular',
        titleKn: 'ಅರಮನೆ ದೀಪಾಲಂಕಾರ ಮಹೋತ್ಸವ',
        venue: 'Mysore Palace Durbar Courtyard',
        venueAddress: 'Balarama Gate, Sayyaji Rao Road, Mysuru',
        category: 'spectacle',
        notes: 'Be present as exactly 100,000 golden tungsten incandescent bulbs switch on simultaneously with ceremonial brass police band symphony.',
        proTip: 'Claim a spot near the central lawn facing the clock tower 20 minutes prior to the 07:00 PM switch-on.',
        crowdLevel: 'Peak',
        estDuration: '1.5 hrs',
        cost: 0,
      },
    ],
  },
  {
    day: 2,
    date: 'Oct 12, 2026',
    dayTitle: 'Flowers, Royal Melodies & Aahara Delights',
    dayTitleKn: 'ಪುಷ್ಪ ಪ್ರದರ್ಶನ, ಸಂಗೀತ ಹಾಗೂ ಆಹಾರ ಮೇಳ',
    transitDistanceKm: 12.2,
    evShuttleRecommended: 'EV Route 2 (Palace ↔ Kuppanna Park ↔ Exhibition Grounds)',
    items: [
      {
        id: 'd2-1',
        time: '09:30 AM',
        period: 'morning',
        title: 'Dasara Flower Show & Glasshouse Exhibition',
        titleKn: 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕ್ ಗಾಜಿನ ಮನೆ ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ',
        venue: 'Nishad Bagh (Kuppanna Park)',
        venueAddress: 'Near Nazarbad Police Station, Mysuru',
        category: 'heritage',
        notes: 'Walk through 500,000 exotic orchids, marigolds, and roses sculpted into life-size replicas of historic Karnataka monuments.',
        proTip: 'Morning sunlight through the glasshouse dome produces stunning photography opportunities with minimum glare.',
        crowdLevel: 'Moderate',
        estDuration: '2 hrs',
        cost: 40,
      },
      {
        id: 'd2-2',
        time: '01:00 PM',
        period: 'afternoon',
        title: 'Aahara Mela Grand Traditional Food Festival',
        titleKn: 'ದಸರಾ ಬೃಹತ್ ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರ ಮೇಳ',
        venue: 'Scouts & Guides Grounds & Exhibition Food Court',
        venueAddress: 'Behind DC Office, Mysuru',
        category: 'food',
        notes: 'Feast across 100+ stalls serving authentic North Karnataka Jolada Rotti, Maddur Vada, bamboo biryani, and regional desert delicacies.',
        proTip: 'Look for the traditional tribal honey-root stalls near pavilion B for rare organic hill treats.',
        crowdLevel: 'High',
        estDuration: '2 hrs',
        cost: 250,
      },
      {
        id: 'd2-3',
        time: '04:30 PM',
        period: 'afternoon',
        title: 'Government Silk Weaving Factory & Sandalwood Oil Mills',
        titleKn: 'ಕೆ.ಎಸ್.ಐ.ಸಿ ಮೈಸೂರು ಸಿಲ್ಕ್ ನೇಯ್ಗೆ ಕಾರ್ಖಾನೆ',
        venue: 'KSIC Mysore Silk Showroom & Factory',
        venueAddress: 'Mananthavady Road, Ashokapuram, Mysuru',
        category: 'shopping',
        notes: 'Inspect traditional jacquard looms producing pure zari Mysore Silk Sarees authenticated by GI tags and pure sandalwood perfumes.',
        proTip: 'Genuine KSIC sarees carry unique woven barcodes in the pallu; avoid unauthorized roadside vendors.',
        crowdLevel: 'Low',
        estDuration: '1.5 hrs',
        cost: 0,
      },
      {
        id: 'd2-4',
        time: '06:30 PM',
        period: 'evening',
        title: 'Classical Carnatic Sangeetha Concert in Palace Courtyard',
        titleKn: 'ಅರಮನೆ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ಕಛೇರಿ',
        venue: 'Palace Durbar Open Courtyard',
        venueAddress: 'Sayyaji Rao Road, Mysuru',
        category: 'music',
        notes: 'Mesmerizing Pancharatna kritis and violin duets by national Sangeet Natak Akademi maestros under the illuminated golden palace arches.',
        proTip: 'Open public seating is first-come-first-serve; arrive by 06:10 PM for prime acoustic rows.',
        crowdLevel: 'High',
        estDuration: '2.5 hrs',
        cost: 0,
      },
    ],
  },
  {
    day: 3,
    date: 'Oct 13, 2026',
    dayTitle: 'Traditional Wrestling, Safari & Evening Illuminations',
    dayTitleKn: 'ನಾಡ ಕುಸ್ತಿ, ಮೃಗಾಲಯ ಹಾಗೂ ದೀಪಾಲಂಕಾರ ರೌಂಡ್',
    transitDistanceKm: 14.8,
    evShuttleRecommended: 'EV Route 3 (Kusti Akhada ↔ Zoo ↔ Exhibition)',
    items: [
      {
        id: 'd3-1',
        time: '09:00 AM',
        period: 'morning',
        title: 'Sri Chamarajendra Zoological Gardens Morning Safari',
        titleKn: 'ಮೈಸೂರು ಮೃಗಾಲಯ ವನ್ಯಜೀವಿ ವೀಕ್ಷಣೆ',
        venue: 'Mysuru Zoo (Sri Chamarajendra)',
        venueAddress: 'Indiranagar, Ittige Gudu, Mysuru',
        category: 'kids',
        notes: 'One of India’s oldest, cleanest zoos featuring white tigers, giraffes, and an expansive botanical lake surrounded by heritage trees.',
        proTip: 'Rent an electric golf buggy at the entrance if visiting with kids or elderly family members.',
        crowdLevel: 'Moderate',
        estDuration: '2.5 hrs',
        cost: 100,
      },
      {
        id: 'd3-2',
        time: '02:30 PM',
        period: 'afternoon',
        title: 'Dasara Traditional Kusti (Nada Kusti) Championship',
        titleKn: 'ದಸರಾ ನಾಡ ಕುಸ್ತಿ ಪಂದ್ಯಾವಳಿ',
        venue: 'D. Devaraja Urs Traditional Wrestling Arena',
        venueAddress: 'Near Dasara Exhibition Grounds, Mysuru',
        category: 'heritage',
        notes: 'High-adrenaline historic mud wrestling contests with wrestlers rubbing red earth and competing for the coveted Mysuru Kesari silver mace.',
        proTip: 'Cheer along with local fans; the atmosphere is electric and entry is completely free.',
        crowdLevel: 'High',
        estDuration: '2 hrs',
        cost: 0,
      },
      {
        id: 'd3-3',
        time: '05:30 PM',
        period: 'evening',
        title: 'Dasara Exhibition & Giant Wheel Heritage Carnival',
        titleKn: 'ದಸರಾ ವಸ್ತುಪ್ರದರ್ಶನ ಮತ್ತು ಮನರಂಜನಾ ಮೇಳ',
        venue: 'Doddakere Maidan Exhibition Grounds',
        venueAddress: 'Opposite Palace East Gate, Mysuru',
        category: 'shopping',
        notes: 'Government ministry pavilions, Channapatna wooden toy artisans, local handloom stalls, and glowing giant wheel amusement rides.',
        proTip: 'Great spot for authentic Karnataka handicrafts directly from rural cooperative society artisans.',
        crowdLevel: 'High',
        estDuration: '2 hrs',
        cost: 30,
      },
      {
        id: 'd3-4',
        time: '08:00 PM',
        period: 'night',
        title: 'Open-Top Heritage Bus City Illumination Tour',
        titleKn: 'ತೆರೆದ ಬಸ್‌ನಲ್ಲಿ ನಗರ ದೀಪಾಲಂಕಾರ ವೀಕ್ಷಣೆ',
        venue: 'KSRTC City Bus Stand Departure',
        venueAddress: 'K.R. Circle & Sayyaji Rao Corridor, Mysuru',
        category: 'spectacle',
        notes: 'Ride an open double-decker bus through 120+ kilometers of illuminated roads, flower arcs, and royal heritage circles.',
        proTip: 'Wear a light jacket or shawl; October evening rooftop breezes in Mysuru get pleasantly cool.',
        crowdLevel: 'Peak',
        estDuration: '1.5 hrs',
        cost: 150,
      },
    ],
  },
  {
    day: 4,
    date: 'Oct 18, 2026',
    dayTitle: 'Ayudha Pooja & Royal Armory Sanctum',
    dayTitleKn: 'ಆಯುಧ ಪೂಜೆ ಹಾಗೂ ರಾಜ ರಥಗಳ ಪೂಜಾವಿಧಿ',
    transitDistanceKm: 10.5,
    evShuttleRecommended: 'EV Route 1 (Palace Corridor Express)',
    items: [
      {
        id: 'd4-1',
        time: '09:30 AM',
        period: 'morning',
        title: 'Worship of Royal Elephants & Pattada Kudure (Palace Horses)',
        titleKn: 'ಪಟ್ಟದ ಆನೆ ಮತ್ತು ಕುದುರೆಗಳಿಗೆ ಪುಷ್ಪಾರ್ಚನೆ',
        venue: 'Mysore Palace Balarama Gate Courtyard',
        venueAddress: 'Sayyaji Rao Road, Mysuru',
        category: 'ceremony',
        notes: 'Ceremonial floral garland blessing of Arjuna and royal caparisoned tuskers accompanied by palace brass band hymns.',
        proTip: 'Stand along the inner perimeter fence for an unobstructed photo of the decorated royal tuskers.',
        crowdLevel: 'High',
        estDuration: '2 hrs',
        cost: 0,
      },
      {
        id: 'd4-2',
        time: '02:00 PM',
        period: 'afternoon',
        title: 'Lalitha Mahal Palace Heritage High Tea',
        titleKn: 'ಲಲಿತ ಮಹಲ್ ಅರಮನೆ ಪಾರಂಪರಿಕ ಚಹಾ ಕೂಟ',
        venue: 'Lalitha Mahal Palace Hotel & Banquets',
        venueAddress: 'Lalitha Mahal Nagar, Mysuru',
        category: 'food',
        notes: 'Dine in the pristine Italian marble ballroom built by Maharaja Krishnaraja Wadiyar IV to host the Viceroy of India.',
        proTip: 'The terrace balcony commands a panoramic vista of the Chamundi Hill slopes bathed in afternoon sunlight.',
        crowdLevel: 'Low',
        estDuration: '2 hrs',
        cost: 650,
      },
      {
        id: 'd4-3',
        time: '06:00 PM',
        period: 'evening',
        title: 'Yuva Dasara Mega Music Concert',
        titleKn: 'ಯುವ ದಸರಾ ಸಂಗೀತ ಸಂಭ್ರಮ',
        venue: 'Maharaja College Grounds',
        venueAddress: 'Near Ramaswamy Circle, Mysuru',
        category: 'music',
        notes: 'Youth festival headlined by national film playback singers, Kannada rap battles, and dynamic laser stage setups.',
        proTip: 'Entry gates open at 05:00 PM; public lawn fills up rapidly by 06:30 PM.',
        crowdLevel: 'Peak',
        estDuration: '3 hrs',
        cost: 0,
      },
    ],
  },
  {
    day: 5,
    date: 'Oct 20, 2026 (Vijayadashami)',
    dayTitle: 'The Grand Jamboo Savari Climax & Torchlight Finale',
    dayTitleKn: 'ವಿಜಯದಶಮಿ ಜಂಬೂ ಸವಾರಿ ಹಾಗೂ ಪಂಜಿನ ಕವಾಯತು',
    transitDistanceKm: 16.0,
    evShuttleRecommended: 'Bannimantap Special Express Corridor',
    items: [
      {
        id: 'd5-1',
        time: '12:30 PM',
        period: 'afternoon',
        title: 'Nandi Dhwaja Puja & Royal Flag Inauguration',
        titleKn: 'ನಂದಿ ಧ್ವಜ ಪೂಜೆ ಹಾಗೂ ಉತ್ಸವ ಆರಂಭ',
        venue: 'Balarama Gate, Mysore Palace',
        venueAddress: 'Balarama Gate, Sayyaji Rao Road, Mysuru',
        category: 'ceremony',
        notes: 'Historic worship of the 45-foot sacred brass Nandi flag by the Chief Minister and royal scion in auspicious Makara lagna.',
        proTip: 'VVIP security is active; show your verified pass to security personnel at barricade 2.',
        crowdLevel: 'Peak',
        estDuration: '1 hr',
        cost: 0,
      },
      {
        id: 'd5-2',
        time: '01:30 PM',
        period: 'afternoon',
        title: 'Vijayadashami Jamboo Savari Golden Howdah Procession',
        titleKn: 'ಜಂಬೂ ಸವಾರಿ ಚಿನ್ನದ ಅಂಬಾರಿ ಮೆರವಣಿಗೆ',
        venue: 'Sayyaji Rao Road Procession Route',
        venueAddress: 'From Palace to Bannimantap Corridor, Mysuru',
        category: 'procession',
        notes: 'The climax of Dasara: Captain elephant Arjuna carries the 750 kg Pure Gold Howdah enshrining Sri Chamundeshwari, escorted by 50+ tableaux.',
        proTip: 'Gold passholders enter via Gate 4; wear a hat and carry drinking water as seating is outdoor.',
        crowdLevel: 'Peak',
        estDuration: '4 hrs',
        cost: 0,
      },
      {
        id: 'd5-3',
        time: '07:00 PM',
        period: 'night',
        title: 'Bannimantap Torchlight Parade & 1,000-Drone Sky Symphony',
        titleKn: 'ಬನ್ನಿಮಂಟಪ ಪಂಜಿನ ಕವಾಯತು ಮತ್ತು ಡ್ರೋನ್ ಶೋ',
        venue: 'Bannimantap Parade Grounds',
        venueAddress: 'Bannimantap Grounds, Mysuru',
        category: 'spectacle',
        notes: 'Laser drills, military motorcycle acrobatics, ceremonial torchlight formations, and 1,000 LED drones forming royal Chamundeshwari motifs.',
        proTip: 'Ticketed gates close strictly at 06:30 PM. No admittance once the motorcycle display begins.',
        crowdLevel: 'Peak',
        estDuration: '2.5 hrs',
        cost: 250,
      },
    ],
  },
];

export default function PlannerPage() {
  // Planner State
  const [duration, setDuration] = useState<number>(3);
  const [budgetStyle, setBudgetStyle] = useState<'budget' | 'comfort' | 'vip'>('comfort');
  const [partyType, setPartyType] = useState<'solo' | 'couple' | 'family' | 'seniors'>('family');
  const [travelPace, setTravelPace] = useState<'relaxed' | 'balanced' | 'express'>('balanced');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'heritage',
    'procession',
    'food',
    'spectacle',
  ]);
  const [activePreset, setActivePreset] = useState<string>('royal');
  const [completedItems, setCompletedItems] = useState<{ [id: string]: boolean }>({});
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customStop, setCustomStop] = useState<{
    time: string;
    title: string;
    venue: string;
    notes: string;
  }>({ time: '04:00 PM', title: '', venue: '', notes: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interest Categories
  const interestOptions = [
    { id: 'heritage', label: 'Royal Heritage & Palaces', icon: '🏰', color: 'border-amber-400 text-amber-300' },
    { id: 'procession', label: 'Jamboo Savari & Elephants', icon: '🐘', color: 'border-yellow-400 text-yellow-300' },
    { id: 'music', label: 'Classical Sangeetha & Sabhas', icon: '🎶', color: 'border-cyan-400 text-cyan-300' },
    { id: 'food', label: 'Aahara Mela & Mysuru Sweets', icon: '🍛', color: 'border-orange-400 text-orange-300' },
    { id: 'shopping', label: 'Mysore Silk & Sandalwood', icon: '🛍️', color: 'border-pink-400 text-pink-300' },
    { id: 'flowers', label: 'Kuppanna Glasshouse Flower Show', icon: '🌸', color: 'border-emerald-400 text-emerald-300' },
    { id: 'spectacle', label: 'Illumination & Drone Light Shows', icon: '✨', color: 'border-indigo-400 text-indigo-300' },
    { id: 'kids', label: 'Zoo Safari & Carnival Rides', icon: '🎡', color: 'border-purple-400 text-purple-300' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle item completed checklist
  const toggleItemDone = (itemId: string) => {
    setCompletedItems((prev) => {
      const nextState = !prev[itemId];
      if (nextState) {
        audioManager.playBellSound();
        showToast('🎯 Marked stop as visited!');
      }
      return { ...prev, [itemId]: nextState };
    });
  };

  // Select Preset Persona
  const handleSelectPreset = (preset: PresetPersona) => {
    audioManager.playRoyalFanfare();
    setActivePreset(preset.id);
    setDuration(preset.duration);
    setBudgetStyle(preset.style);
    setPartyType(preset.party);
    setSelectedInterests(preset.interests);
    setActiveDayIndex(0);
    showToast(`👑 Loaded "${preset.title}" itinerary!`);
  };

  // Regenerate / Customize Plan
  const handleGeneratePlan = () => {
    audioManager.playRoyalFanfare();
    setActiveDayIndex(0);
    showToast(`✨ Generated ${duration}-Day custom Dasara itinerary!`);
  };

  // Current Working Itinerary Days slice
  const currentPlanDays: ItineraryDay[] = useMemo(() => {
    const rawDays = MASTER_ITINERARY_DAYS.slice(0, duration);
    return rawDays.map((d) => ({
      ...d,
      items: d.items.filter((item) => {
        // filter or pace items
        if (travelPace === 'relaxed') {
          return item.period !== 'night';
        }
        return true;
      }),
    }));
  }, [duration, travelPace]);

  const activeDay = currentPlanDays[activeDayIndex] || currentPlanDays[0];

  // Budget calculations
  const budgetSummary = useMemo(() => {
    let ticketsTotal = 0;
    currentPlanDays.forEach((day) => {
      day.items.forEach((item) => {
        ticketsTotal += item.cost;
      });
    });

    const dayTransitMultiplier = budgetStyle === 'budget' ? 80 : budgetStyle === 'comfort' ? 350 : 900;
    const dayFoodMultiplier = budgetStyle === 'budget' ? 350 : budgetStyle === 'comfort' ? 800 : 2000;
    const dayMiscMultiplier = budgetStyle === 'budget' ? 100 : budgetStyle === 'comfort' ? 400 : 1200;

    const transitTotal = dayTransitMultiplier * duration;
    const foodTotal = dayFoodMultiplier * duration;
    const miscTotal = dayMiscMultiplier * duration;

    const grandTotal = ticketsTotal + transitTotal + foodTotal + miscTotal;

    return {
      tickets: ticketsTotal,
      transit: transitTotal,
      food: foodTotal,
      misc: miscTotal,
      total: grandTotal,
    };
  }, [currentPlanDays, budgetStyle, duration]);

  // WhatsApp Share Generator
  const handleShareWhatsApp = () => {
    const lines = [
      `🌟 *MY MYSURU DASARA 2026 TRIP ITINERARY* 👑`,
      `Duration: ${duration} Days | Style: ${budgetStyle.toUpperCase()} | Party: ${partyType.toUpperCase()}`,
      `Estimated Budget: ₹${budgetSummary.total.toLocaleString('en-IN')}`,
      '',
    ];

    currentPlanDays.forEach((d) => {
      lines.push(`📅 *Day ${d.day} (${d.date}): ${d.dayTitle}*`);
      d.items.forEach((it) => {
        lines.push(`  ⏰ ${it.time} - ${it.title} (📍 ${it.venue})`);
      });
      lines.push(`  🚌 Transit: ${d.evShuttleRecommended}`);
      lines.push('');
    });

    lines.push('✨ Generated on Official Mysuru Dasara 2026 Portal');
    lines.push('🌐 https://mysoredasara2026.karnataka.gov.in');

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');
    showToast('💬 WhatsApp sharing opened!');
  };

  // Official PDF Itinerary Generator
  const handleDownloadPDF = () => {
    audioManager.playBellSound();
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;

    // Outer Royal Border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.2);
    doc.rect(7, 7, pageWidth - 14, 283);

    // Header Ribbon
    doc.setFillColor(123, 17, 19);
    doc.rect(8, 8, pageWidth - 16, 26, 'F');

    doc.setTextColor(255, 223, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('GOVERNMENT OF KARNATAKA | MYSURU DASARA 2026', pageWidth / 2, 16, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('OFFICIAL SMART FESTIVAL ITINERARY & TRAVEL GUIDE', pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setTextColor(255, 223, 0);
    doc.text(
      `Plan: ${duration} Days | Style: ${budgetStyle.toUpperCase()} | Party: ${partyType.toUpperCase()} | Est. Budget: INR Rs. ${budgetSummary.total.toLocaleString('en-IN')}`,
      pageWidth / 2,
      28,
      { align: 'center' }
    );

    let curY = 40;

    currentPlanDays.forEach((d) => {
      if (curY > 250) {
        doc.addPage();
        curY = 20;
      }

      // Day Header Box
      doc.setFillColor(245, 240, 230);
      doc.rect(12, curY, pageWidth - 24, 8, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.rect(12, curY, pageWidth - 24, 8);

      doc.setTextColor(139, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`DAY ${d.day} • ${d.date} — ${d.dayTitle.toUpperCase()}`, 15, curY + 5.5);

      curY += 12;

      d.items.forEach((it) => {
        if (curY > 265) {
          doc.addPage();
          curY = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(30, 30, 30);
        doc.text(`[${it.time}] ${it.title}`, 15, curY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(80, 80, 80);
        doc.text(`Venue: ${it.venue} | Est: ${it.estDuration} | Cost: ${it.cost === 0 ? 'FREE' : `Rs. ${it.cost}`}`, 15, curY + 4);

        const tip = doc.splitTextToSize(`Tip: ${it.proTip}`, pageWidth - 32);
        doc.setTextColor(140, 90, 20);
        doc.text(tip, 15, curY + 8);

        curY += 12 + (tip.length - 1) * 3;
      });

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(60, 60, 60);
      doc.text(`Recommended Transit: ${d.evShuttleRecommended} (~${d.transitDistanceKm} km)`, 15, curY);
      curY += 6;
    });

    // Safety Helplines
    if (curY > 255) {
      doc.addPage();
      curY = 20;
    }
    doc.setFillColor(183, 28, 28);
    doc.rect(12, curY, pageWidth - 24, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('OFFICIAL MYSURU DASARA 24/7 HELPLINES', 16, curY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Police: 112 | Tourism Helpline: 1800-425-4567 | Fire & Rescue: 101 | Women Safety: 1091', 16, curY + 10);
    doc.text('Satellite Parking: Lalitha Mahal & Exhibition Grounds. Free KSRTC EV feeder shuttles operate 24x7.', 16, curY + 14);

    doc.save(`Mysuru_Dasara_2026_Personal_Itinerary_${duration}Days.pdf`);
    showToast('📥 Downloaded Official Festival Itinerary PDF!');
  };

  // Add Custom Stop to Active Day
  const handleAddCustomStop = () => {
    if (!customStop.title.trim()) {
      showToast('⚠️ Please enter a stop title');
      return;
    }

    const newItem: ItineraryItem = {
      id: `custom-${Date.now()}`,
      time: customStop.time,
      period: 'afternoon',
      title: customStop.title,
      titleKn: 'ಕಸ್ಟಮ್ ನಿಲ್ದಾಣ',
      venue: customStop.venue || 'Mysuru City Center',
      venueAddress: 'Mysuru, Karnataka',
      category: 'heritage',
      notes: customStop.notes || 'Personal travel note added to your custom schedule.',
      proTip: 'Custom stop added to personal itinerary.',
      crowdLevel: 'Moderate',
      estDuration: '1.5 hrs',
      cost: 0,
    };

    activeDay.items.push(newItem);
    setShowAddCustomModal(false);
    setCustomStop({ time: '04:00 PM', title: '', venue: '', notes: '' });
    audioManager.playBellSound();
    showToast('✅ Added custom stop to Day ' + activeDay.day);
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-3 md:px-6 max-w-7xl mx-auto flex flex-col space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-gold-glow flex items-center gap-2 text-xs border border-amber-300 animate-slide-up">
          <span>👑</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Title */}
      <PageHeader
        title="Royal Festival Itinerary & Trip Architect"
        titleKn="ಸ್ಮಾರ್ಟ್ ದಸರಾ ಪ್ರವಾಸ ಮತ್ತು ಯೋಜನಾ ಸಹಾಯಕ"
        subtitle="Curate an unforgettable, conflict-free festival journey across Mysuru's heritage landmarks, royal sabhas, and the legendary Vijayadashami climax."
      />

      {/* ======================================================== */}
      {/* 1. QUICK-START CURATED PERSONAS (1-CLICK WOW PRESETS)    */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div>
            <h3 className="text-sm md:text-base font-extrabold text-amber-300 flex items-center gap-2">
              <span>✨</span>
              <span>Instant Curated Royal Experiences</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                1-Click Ready
              </span>
            </h3>
            <p className="text-xs text-cream/60">
              Pick a tailored festival style or customize your parameters below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRESET_PERSONAS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`relative p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between group overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/30 to-amber-950/60 border-amber-400 shadow-gold-glow scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {preset.icon}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-amber-400 text-black'
                          : 'bg-white/10 text-cream/70'
                      }`}
                    >
                      {preset.duration}D
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-cream group-hover:text-amber-300 transition-colors line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[10px] text-cream/60 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
                <div className="pt-2 text-[9px] text-amber-400/90 font-semibold flex items-center gap-1">
                  <span>{isSelected ? '✓ Active Plan' : 'Select Plan →'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN LAYOUT: ARCHITECT CONTROLS + INTERACTIVE SCHEDULE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Trip Parameters (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="glass p-5 md:p-6 rounded-3xl border border-amber-400/30 shadow-royal space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <span>⚙️</span>
                <span>Trip Architect Controls</span>
              </h3>
              <span className="text-[10px] text-cream/50 uppercase font-mono">Customizable</span>
            </div>

            {/* Trip Duration */}
            <div>
              <label className="block text-xs font-bold text-cream mb-2 flex justify-between">
                <span>Trip Duration</span>
                <span className="text-amber-400">{duration} Days Festival Tour</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDuration(d);
                      if (activeDayIndex >= d) setActiveDayIndex(0);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                      duration === d
                        ? 'bg-amber-400 text-black shadow-gold-glow'
                        : 'bg-white/5 border border-white/10 text-cream/70 hover:bg-white/10'
                    }`}
                  >
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style / Budget Tier */}
            <div>
              <label className="block text-xs font-bold text-cream mb-2 flex justify-between">
                <span>Travel Style & Budget</span>
                <span className="text-amber-300 capitalize">{budgetStyle} Tier</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'budget', label: '🎒 Budget', sub: '~₹650/day' },
                  { id: 'comfort', label: '🏛️ Comfort', sub: '~₹1.8k/day' },
                  { id: 'vip', label: '👑 Royal VIP', sub: '~₹4.5k/day' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setBudgetStyle(s.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      budgetStyle === s.id
                        ? 'bg-amber-400/25 border-amber-400 text-amber-200 shadow-sm'
                        : 'bg-white/5 border-white/10 text-cream/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{s.label}</div>
                    <div className="text-[9px] text-cream/50">{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Party Composition */}
            <div>
              <label className="block text-xs font-bold text-cream mb-2">Traveling Party</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'solo', label: '🚶 Solo Traveler', icon: 'Solo' },
                  { id: 'couple', label: '💑 Couple', icon: 'Romantic' },
                  { id: 'family', label: '👨‍👩‍👧‍👦 Family with Kids', icon: 'Kids-Safe' },
                  { id: 'seniors', label: '👴 Senior Citizens', icon: 'Accessible' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPartyType(p.id as any)}
                    className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                      partyType === p.id
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                        : 'bg-white/5 border-white/10 text-cream/70 hover:bg-white/10'
                    }`}
                  >
                    <div>{p.label}</div>
                    <div className="text-[9px] text-amber-400/60 font-normal">{p.icon}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Pace */}
            <div>
              <label className="block text-xs font-bold text-cream mb-2 flex justify-between">
                <span>Daily Pace</span>
                <span className="text-amber-400 capitalize">{travelPace} (3-4 stops/day)</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'relaxed', label: '🌿 Relaxed' },
                  { id: 'balanced', label: '⚖️ Balanced' },
                  { id: 'express', label: '⚡ Fast Track' },
                ].map((pace) => (
                  <button
                    key={pace.id}
                    onClick={() => setTravelPace(pace.id as any)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      travelPace === pace.id
                        ? 'bg-amber-400/30 border-amber-400 text-amber-300'
                        : 'bg-white/5 border-white/10 text-cream/60 hover:bg-white/10'
                    }`}
                  >
                    {pace.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-cream mb-2">
                Priority Interests ({selectedInterests.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {interestOptions.map((opt) => {
                  const isChecked = selectedInterests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`p-2 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                          : 'bg-white/5 border-white/10 text-cream/50 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 line-clamp-1">
                        <span>{opt.icon}</span>
                        <span className="text-[11px] font-medium">{opt.label.split(' ')[0]}</span>
                      </span>
                      <span className="text-[10px] font-bold">{isChecked ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGeneratePlan}
              className="w-full py-3.5 rounded-2xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 shadow-gold-glow hover:brightness-110 active:scale-[0.98] transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-300"
            >
              <span>✨ Re-Optimize Festival Schedule</span>
            </button>
          </div>

          {/* Real-Time Live Trip Cost & Budget Breakdown */}
          <div className="glass p-5 rounded-3xl border border-amber-400/20 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>💰</span>
                <span>Estimated Trip Budget</span>
              </h4>
              <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Per Person
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-cream/70">
                <span>🎟️ Monument & Event Passes</span>
                <span className="font-semibold text-cream">₹{budgetSummary.tickets.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>🚖 Local Transit & EV Shuttles</span>
                <span className="font-semibold text-cream">₹{budgetSummary.transit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>🍛 Mysuru Sweets & Dining</span>
                <span className="font-semibold text-cream">₹{budgetSummary.food.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-cream/70">
                <span>🛍️ Silk & Souvenirs Reserve</span>
                <span className="font-semibold text-cream">₹{budgetSummary.misc.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-black">
                <span className="text-amber-300">Total Estimated Budget</span>
                <span className="text-amber-400 text-base">₹{budgetSummary.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[10px] text-cream/50 italic">
              *Estimates tailored to {budgetStyle} style and {duration}-day schedule.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Schedule & Day Itinerary (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Day Navigation Tabs & Export Suite */}
          <div className="glass p-4 rounded-3xl border border-amber-400/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Day Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {currentPlanDays.map((d, idx) => (
                <button
                  key={d.day}
                  onClick={() => {
                    setActiveDayIndex(idx);
                    audioManager.playBellSound();
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                    activeDayIndex === idx
                      ? 'bg-amber-400 text-black shadow-gold-glow scale-105'
                      : 'bg-white/5 border border-white/10 text-cream/80 hover:bg-white/15'
                  }`}
                >
                  <span>Day {d.day}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({d.date.split(',')[0]})</span>
                </button>
              ))}
            </div>

            {/* Quick Actions (PDF, WhatsApp, Add Stop) */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 md:flex-none px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black hover:brightness-110 shadow-sm flex items-center justify-center gap-1.5"
                title="Download Official PDF Itinerary"
              >
                <span>📥 PDF Guide</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex-1 md:flex-none px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1"
                title="Share to WhatsApp"
              >
                <span>💬 WhatsApp</span>
              </button>

              <button
                onClick={() => setShowAddCustomModal(true)}
                className="flex-1 md:flex-none px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1"
                title="Add Custom Stop"
              >
                <span>➕ Add Stop</span>
              </button>
            </div>
          </div>

          {/* Active Day Banner */}
          <div className="glass p-5 rounded-3xl border border-white/10 relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-purple-950/20 to-black/40">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-400">
                  DAY {activeDay.day} ITINERARY • {activeDay.date}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-cream">
                  {activeDay.dayTitle}
                </h3>
                {activeDay.dayTitleKn && (
                  <p className="text-xs text-amber-300/80 font-kannada">{activeDay.dayTitleKn}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-cream/90 flex items-center gap-1">
                  <span>🚶</span>
                  <span>~{activeDay.transitDistanceKm} km total route</span>
                </span>
              </div>
            </div>

            {/* Recommended Transit Strip */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-amber-200/90 font-medium">
              <span>🚌</span>
              <span><strong>Optimal Transit:</strong> {activeDay.evShuttleRecommended}</span>
            </div>
          </div>

          {/* Scheduled Items Timeline Cards */}
          <div className="space-y-4">
            {activeDay.items.map((item) => {
              const isChecked = !!completedItems[item.id];
              const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${item.venue} Mysuru Karnataka`
              )}`;

              return (
                <div
                  key={item.id}
                  className={`glass p-5 rounded-3xl border transition-all duration-300 relative group ${
                    isChecked
                      ? 'border-emerald-500/40 bg-emerald-950/20 opacity-75'
                      : 'border-white/10 hover:border-amber-400/40 hover:shadow-royal'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleItemDone(item.id)}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-black transition-all ${
                          isChecked
                            ? 'bg-emerald-400 border-emerald-400 text-black'
                            : 'bg-white/5 border-white/20 text-transparent hover:border-amber-400'
                        }`}
                        title={isChecked ? 'Marked visited' : 'Click to mark visited'}
                      >
                        ✓
                      </button>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 rounded-xl">
                          ⏰ {item.time}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-cream/60 bg-white/5 px-2 py-0.5 rounded-lg">
                          ⏳ {item.estDuration}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                            item.crowdLevel === 'Peak'
                              ? 'bg-rose-500/20 border-rose-400/40 text-rose-300'
                              : item.crowdLevel === 'High'
                              ? 'bg-orange-500/20 border-orange-400/40 text-orange-300'
                              : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                          }`}
                        >
                          👥 {item.crowdLevel} Crowd
                        </span>
                      </div>
                    </div>

                    {/* Venue & Cost Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-amber-300">
                        {item.cost === 0 ? 'Free Entry' : `₹${item.cost} Ticket`}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="pt-3 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                      <h4
                        className={`text-base font-extrabold ${
                          isChecked ? 'line-through text-cream/60' : 'text-cream'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-xs text-amber-400/80 font-medium">
                        📍 {item.venue}
                      </span>
                    </div>

                    {item.titleKn && (
                      <p className="text-xs text-amber-300/70 font-kannada">{item.titleKn}</p>
                    )}

                    <p className="text-xs text-cream/70 leading-relaxed">{item.notes}</p>

                    {/* Pro Tip Callout */}
                    <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-2 text-xs">
                      <span className="text-amber-400 shrink-0">💡</span>
                      <p className="text-amber-200/90 font-medium">
                        <strong className="text-amber-300">Insider Pro Tip:</strong> {item.proTip}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex flex-wrap gap-2 items-center justify-between">
                      <div className="text-[11px] text-cream/50 truncate max-w-sm">
                        🗺️ {item.venueAddress}
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold border border-white/15 transition-all flex items-center gap-1"
                        >
                          <span>🗺️ Directions</span>
                        </a>

                        <button
                          onClick={() => toggleItemDone(item.id)}
                          className={`py-1 px-3 rounded-xl text-xs font-bold transition-all border ${
                            isChecked
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-cream/80 hover:bg-white/10'
                          }`}
                        >
                          {isChecked ? '✓ Visited' : 'Mark Visited'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Trip Assistant Smart Advisory */}
          <div className="glass p-5 rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-950/20 via-black to-amber-950/20 space-y-2">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🤖</span>
              <span>AI Trip Architect Security & Route Advisory</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-cream/80 pt-1">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-amber-400 font-bold block mb-1">🚗 Traffic & Satellite Parking</span>
                Commercial vehicles are restricted within the palace 2 km ring during evening illumination. Park at Lalitha Mahal Helipad and take the zero-emission KSRTC shuttle.
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-amber-400 font-bold block mb-1">🎫 Gold Pass Protocols</span>
                Jamboo Savari procession seats close gates 30 minutes prior to flag-off (12:30 PM). Carry a valid photo ID matching your digital pass barcode.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ADD CUSTOM STOP MODAL                                 */}
      {/* ======================================================== */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-dark p-6 md:p-8 rounded-3xl border-2 border-amber-400/50 max-w-md w-full shadow-royal space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-black text-amber-400">Custom Activity</span>
                <h3 className="text-lg font-bold text-cream">Add Stop to Day {activeDay.day}</h3>
              </div>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-cream mb-1">Activity Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Visit St. Philomena's Cathedral / Coffee Break"
                  value={customStop.title}
                  onChange={(e) => setCustomStop({ ...customStop, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-cream text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cream mb-1">Scheduled Time</label>
                <input
                  type="text"
                  placeholder="e.g. 03:30 PM"
                  value={customStop.time}
                  onChange={(e) => setCustomStop({ ...customStop, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-cream text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cream mb-1">Venue / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Ashoka Road, Mysuru"
                  value={customStop.venue}
                  onChange={(e) => setCustomStop({ ...customStop, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-cream text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cream mb-1">Personal Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Remember to buy sandalwood incense sticks"
                  value={customStop.notes}
                  onChange={(e) => setCustomStop({ ...customStop, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-cream text-xs focus:border-amber-400 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddCustomStop}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs hover:brightness-110 shadow-gold-glow"
              >
                Add to My Schedule ✨
              </button>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
