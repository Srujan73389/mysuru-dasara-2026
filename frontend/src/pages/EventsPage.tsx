import React, { useEffect, useState, useMemo, useRef } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { eventsAPI } from '@/services/api';
import { useAppStore } from '@/stores/useAppStore';
import { audioManager } from '@/audio/audioManager';
import EventBookingModal from '@/components/events/EventBookingModal';

// -------------------------------------------------------------
// Helper: Compute Day Number (1-10 for Oct 11 - Oct 20)
// -------------------------------------------------------------
const getEventDayNumber = (evt: any): number => {
  if (evt.day_number && evt.day_number >= 1 && evt.day_number <= 10) {
    return evt.day_number;
  }
  try {
    const d = new Date(evt.start_datetime);
    const day = d.getDate();
    if (day >= 11 && day <= 20) {
      return day - 10;
    }
  } catch {}
  return 1;
};

// -------------------------------------------------------------
// Live Countdown Hook to Vijayadashami
// -------------------------------------------------------------
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

// -------------------------------------------------------------
// 37 Verified Authentic Mysuru Dasara Events (Days 1 - 10)
// -------------------------------------------------------------
export const COMPLETE_DASARA_EVENTS = [
  // --- DAY 1 • OCT 11 (INAUGURATION & ILLUMINATION) ---
  {
    id: 101,
    title: 'Grand Dasara Inauguration at Chamundi Hills',
    title_kn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟದಲ್ಲಿ ದಸರಾ ಮಹೋತ್ಸವ ಉದ್ಘಾಟನೆ',
    description: 'Auspicious Vedic inauguration of Mysuru Dasara 2026 with floral tributes to Sri Chamundeshwari atop Chamundi Hills by cultural icons and dignitaries.',
    description_kn: 'ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಿಗೆ ಪುಷ್ಪಾರ್ಚನೆ ಮಾಡುವ ಮೂಲಕ ದಸರಾ ಉತ್ಸವಕ್ಕೆ ವಿಧ್ಯುಕ್ತ ಚಾಲನೆ.',
    category: 'cultural',
    venue_name: 'Chamundi Hills & Sri Chamundeshwari Temple',
    address: 'Chamundi Hill Road, Mysuru',
    start_datetime: '2026-10-11T09:30:00+05:30',
    end_datetime: '2026-10-11T12:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'inauguration,chamundi,sacred,vedic,tradition',
    day_number: 1,
  },
  {
    id: 102,
    title: 'Chamundeshwari Ratha Utsava & Temple Mahabhisheka',
    title_kn: 'ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ರಥೋತ್ಸವ ಹಾಗೂ ಮಹಾಭಿಷೇಕ',
    description: 'Sacred chariot procession of Sri Chamundeshwari around the hilltop sanctum accompanied by temple nadaswaram ensembles and traditional chhatras.',
    description_kn: 'ಬೆಟ್ಟದ ದೇವಾಲಯದ ಸುತ್ತಲೂ ದೇವಿಯ ವೈಭವದ ರಥೋತ್ಸವ ಮತ್ತು ನಾದಸ್ವರ ಸೇವೆ.',
    category: 'cultural',
    venue_name: 'Chamundi Hills Temple Sanctum',
    address: 'Chamundi Hill Road, Mysuru',
    start_datetime: '2026-10-11T11:30:00+05:30',
    end_datetime: '2026-10-11T14:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'ratha,temple,chamundi,puja',
    day_number: 1,
  },
  {
    id: 103,
    title: 'All India Dasara Exhibition Grand Opening',
    title_kn: 'ಅಖಿಲ ಭಾರತ ದಸರಾ ವಸ್ತುಪ್ರದರ್ಶನ ಉದ್ಘಾಟನೆ',
    description: 'Grand opening of the mega carnival spanning 300+ government pavilions, artisanal craft stalls, amusement rides, and traditional handloom bazaars.',
    description_kn: 'ವಸ್ತುಪ್ರದರ್ಶನ ಆವರಣದಲ್ಲಿ ನೂರಾರು ಮಳಿಗೆಗಳು, ಕರಕುಶಲ ವಸ್ತುಗಳು ಹಾಗೂ ಅಮ್ಯೂಸ್ಮೆಂಟ್ ರೈಡ್ಸ್.',
    category: 'exhibition',
    venue_name: 'Dasara Exhibition Grounds (Doddakere Maidan)',
    address: 'Opposite Palace South Gate, Mysuru',
    start_datetime: '2026-10-11T16:00:00+05:30',
    end_datetime: '2026-10-11T22:00:00+05:30',
    is_free: false,
    ticket_price: '30.00',
    is_featured: true,
    tags: 'exhibition,shopping,handloom,crafts,carnival',
    day_number: 1,
  },
  {
    id: 104,
    title: '100,000 Bulb Illumination Switch-on & Royal Fanfare',
    title_kn: 'ಅರಮನೆ ಮತ್ತು ನಗರದ ದೀಪಾಲಂಕಾರ ಉದ್ಘಾಟನೆ',
    description: 'The golden switch-on of over 100,000 incandescent bulbs illuminating Mysore Palace alongside 120+ kilometers of city boulevards, circles, and heritage arches.',
    description_kn: '೧,೦೦,೦೦೦ ವಿದ್ಯುತ್ ದೀಪಗಳಿಂದ ಕಂಗೊಳಿಸುವ ಮೈಸೂರು ಅರಮನೆ ಹಾಗೂ ಇಡೀ ನಗರದ ದೀಪಾಲಂಕಾರ.',
    category: 'cultural',
    venue_name: 'Mysore Palace Forecourt',
    address: 'Sayyaji Rao Road, Agrahara, Mysuru',
    start_datetime: '2026-10-11T19:00:00+05:30',
    end_datetime: '2026-10-11T21:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'illumination,lights,palace,ambavilas,royal',
    day_number: 1,
  },

  // --- DAY 2 • OCT 12 (FLOWER SHOW & MUSIC SABHA) ---
  {
    id: 105,
    title: 'Glass House Dasara Flower Show Gala Opening',
    title_kn: 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕ್ ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ ಉದ್ಘಾಟನೆ',
    description: 'A botanical wonderland displaying 800,000 blossoms sculpting golden royal palanquins, Chamundeshwari idols, and rare exotic orchids.',
    description_kn: '೮ ಲಕ್ಷ ಪುಷ್ಪಗಳಿಂದ ನಿರ್ಮಿತವಾದ ರಮಣೀಯ ಕಲಾಕೃತಿಗಳು ಮತ್ತು ಅಪರೂಪದ ಹೂವುಗಳ ಪ್ರದರ್ಶನ.',
    category: 'flower',
    venue_name: 'Kuppanna Park (Nishad Bagh)',
    address: 'Near Nazarbad Police Station, Mysuru',
    start_datetime: '2026-10-12T10:00:00+05:30',
    end_datetime: '2026-10-12T20:30:00+05:30',
    is_free: false,
    ticket_price: '40.00',
    is_featured: true,
    tags: 'flower,orchids,botanical,glasshouse,kuppanna',
    day_number: 2,
  },
  {
    id: 106,
    title: 'Classical Carnatic Sangeetha Sabha: Pancharatna Kritis',
    title_kn: 'ಅರಮನೆ ಮುಂಭಾಗ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ ಕಛೇರಿ',
    description: 'Prestigious classical Carnatic and Hindustani concerts in the illuminated palace courtyard featuring national Sangeet Natak Akademi maestros.',
    description_kn: 'ಅರಮನೆಯ ದಿವ್ಯ ಸನ್ನಿಧಿಯಲ್ಲಿ ಖ್ಯಾತ ಸಂಗೀತ ದಿಗ್ಗಜರಿಂದ ನಾದೋಪಾಸನೆ.',
    category: 'music',
    venue_name: 'Mysore Palace Durbar Courtyard',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-12T18:30:00+05:30',
    end_datetime: '2026-10-12T21:45:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'music,carnatic,hindustani,classical,sabha',
    day_number: 2,
  },
  {
    id: 107,
    title: 'Light & Sound Historical Spectacular at Palace Courtyard',
    title_kn: 'ಮೈಸೂರು ಅರಮನೆ ಧ್ವನಿ ಮತ್ತು ಬೆಳಕು ಕಾರ್ಯಕ್ರಮ',
    description: 'Dramatic theatrical projection narrating the 600-year history of the Wadiyar dynasty and Chamundi victory with synchronized symphonic score.',
    description_kn: 'ಒಡೆಯರ್ ರಾಜವಂಶದ ಇತಿಹಾಸವನ್ನು ಸಾರುವ ಧ್ವನಿ ಮತ್ತು ಬೆಳಕಿನ ಭವ್ಯ ಪ್ರದರ್ಶನ.',
    category: 'cultural',
    venue_name: 'Mysore Palace Courtyard',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-12T20:15:00+05:30',
    end_datetime: '2026-10-12T21:30:00+05:30',
    is_free: false,
    ticket_price: '60.00',
    is_featured: false,
    tags: 'soundandlight,history,theatre,palace',
    day_number: 2,
  },
  {
    id: 1075,
    title: 'Mysore Palace Heritage Art & Ravi Varma Gallery Opening',
    title_kn: 'ಅರಮನೆಯಲ್ಲಿ ರಾಜಾ ರವಿವರ್ಮ ಪೇಂಟಿಂಗ್ ಗ್ಯಾಲರಿ ಉದ್ಘಾಟನೆ',
    description: 'Exclusive opening of master oil paintings by Raja Ravi Varma and antique Mysore gold leaf artefacts in the palace wing.',
    description_kn: 'ರಾಜಾ ರವಿವರ್ಮ ಅವರ ಅಮೂಲ್ಯ ತೈಲಚಿತ್ರಗಳು ಮತ್ತು ಮೈಸೂರು ಪಾರಂಪರಿಕ ಕಲಾಕೃತಿಗಳ ಪ್ರದರ್ಶನ.',
    category: 'cultural',
    venue_name: 'Mysore Palace (Amba Vilas)',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-12T15:30:00+05:30',
    end_datetime: '2026-10-12T18:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'art,ravivarma,painting,gallery',
    day_number: 2,
  },

  // --- DAY 3 • OCT 13 (AAHARA MELA & HERITAGE WALKS) ---
  {
    id: 108,
    title: 'Royal Heritage Walk & Tangavadi Heritage Ride',
    title_kn: 'ಮೈಸೂರು ಪಾರಂಪರಿಕ ನಡಿಗೆ ಹಾಗೂ ಟಾಂಗಾ ಸವಾರಿ',
    description: 'Guided morning walking and heritage tonga exploration through colonial clock towers, Devaraja Market, Lansdowne building, and palace gates.',
    description_kn: 'ದೇವರಾಜ ಮಾರುಕಟ್ಟೆ, ಗಡಿಯಾರ ಗೋಪುರ ಹಾಗೂ ಪಾರಂಪರಿಕ ಕಟ್ಟಡಗಳ ಸುತ್ತ ನಡಿಗೆ.',
    category: 'cultural',
    venue_name: 'Mysore Palace Balarama Gate to Town Hall',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-13T07:00:00+05:30',
    end_datetime: '2026-10-13T09:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'heritagewalk,tonga,devarajamarket,architecture',
    day_number: 3,
  },
  {
    id: 109,
    title: 'Aahara Mela: Royal & Heritage Food Carnival',
    title_kn: 'ಆಹಾರ ಮೇಳ - ರಾಜಮನೆತನ ಹಾಗೂ ಜಾನಪದ ತಿನಿಸುಗಳು',
    description: 'Feast on authentic Mysore Pak, buttery Davangere Benne Dosa, spicy Malnad bamboo biryani, Dharwad peda, and traditional tribal specialties.',
    description_kn: 'ಮೈಸೂರು ಪಾಕ್, ಬೆಣ್ಣೆ ದೋಸೆ, ಮಲೆನಾಡು ಹಾಗೂ ಕರ್ನಾಟಕದ ಸಕಲ ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರೋತ್ಸವ.',
    category: 'food',
    venue_name: 'Scouts & Guides Grounds & Lalitha Mahal Plaza',
    address: 'Behind DC Office, Mysuru',
    start_datetime: '2026-10-13T11:00:00+05:30',
    end_datetime: '2026-10-13T22:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'food,mysorepak,dosa,culinary,mela',
    day_number: 3,
  },
  {
    id: 110,
    title: 'Makkala Dasara: Children Cultural Carnival & Puppet Show',
    title_kn: 'ಮಕ್ಕಳ ದಸರಾ ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವ ಮತ್ತು ಸೂತ್ರದ ಬೊಂಬೆಯಾಟ',
    description: 'Vibrant creative performances by talented school troupes, traditional Togalu Gombeyaata shadow puppetry, and storytelling competitions.',
    description_kn: 'ರಾಜ್ಯದ ಪುಟಾಣಿ ಮಕ್ಕಳ ಸಾಂಸ್ಕೃತಿಕ ನೃತ್ಯ, ತೊಗಲುಗೊಂಬೆಯಾಟ ಮತ್ತು ಚಿತ್ರಕಲೆ.',
    category: 'cultural',
    venue_name: 'Kalamandira Cultural Complex',
    address: 'Hunsur Road, Mysuru',
    start_datetime: '2026-10-13T15:30:00+05:30',
    end_datetime: '2026-10-13T19:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'children,puppet,makkaladasara,storytelling',
    day_number: 3,
  },
  {
    id: 111,
    title: 'Hindustani Classical Vocal & Sitar Jugalbandi',
    title_kn: 'ಹಿಂದೂಸ್ತಾನಿ ಸಿತಾರ್ ಜುಗಲ್‌ಬಂದಿ ಸಂಗೀತ ಸಂಜೆ',
    description: 'Soul-stirring evening of Raag Yaman and Darbari Kanada rendered by maestro sitarists and tabla accompanists at Kalamandira.',
    description_kn: 'ಕಲಾಮಂದಿರದಲ್ಲಿ ಖ್ಯಾತ ಸಿತಾರ್ ಹಾಗೂ ತಬಲಾ ವಾದಕರ ಸ್ವರ ಮಾಧುರ್ಯ.',
    category: 'music',
    venue_name: 'Kalamandira Cultural Complex',
    address: 'Hunsur Road, Mysuru',
    start_datetime: '2026-10-13T18:45:00+05:30',
    end_datetime: '2026-10-13T21:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'music,hindustani,sitar,jugalbandi,kalamandira',
    day_number: 3,
  },

  // --- DAY 4 • OCT 14 (TRADITIONAL KUSTI & CINEMA) ---
  {
    id: 112,
    title: 'Traditional Mysore Nada Kusti Tournament - Round 1',
    title_kn: 'ಸಾಂಪ್ರದಾಯಿಕ ನಾಡ ಕುಸ್ತಿ ಪಂದ್ಯಾವಳಿ - ಪ್ರಥಮ ಸುತ್ತು',
    description: 'Centuries-old clay-ring wrestling championships where royal garadi ustaads compete for the prestigious Mysore Kesari and Kantheerava maces.',
    description_kn: 'ಅಖಾಡದಲ್ಲಿ ಮೈಸೂರು ಕೇಸರಿ ಗದೆಗಾಗಿ ಜಟ್ಟಿಗರ ಜಿದ್ದಾಜಿದ್ದಿನ ಕಾಳಗ.',
    category: 'sports',
    venue_name: 'D. Devaraj Urs Traditional Wrestling Arena',
    address: 'Near Exhibition Grounds, Mysuru',
    start_datetime: '2026-10-14T15:00:00+05:30',
    end_datetime: '2026-10-14T19:30:00+05:30',
    is_free: false,
    ticket_price: '50.00',
    is_featured: true,
    tags: 'kusti,wrestling,tradition,kesari,sports',
    day_number: 4,
  },
  {
    id: 113,
    title: 'Dasara Film Festival Opening & Cinema Retrospective',
    title_kn: 'ದಸರಾ ಚಲನಚಿತ್ರೋತ್ಸವ ಉದ್ಘಾಟನೆ',
    description: 'Screening of national award-winning Kannada cinema, world classics, and retrospectives of Dr. Rajkumar and BV Karanth films.',
    description_kn: 'ರಾಜ್ಯ ಪ್ರಶಸ್ತಿ ಪುರಸ್ಕೃತ ಕನ್ನಡ ಚಿತ್ರಗಳು ಹಾಗೂ ಜಾಗತಿಕ ಸಿನೆಮಾಗಳ ಪ್ರದರ್ಶನ.',
    category: 'cultural',
    venue_name: 'Kalamandira Cultural Complex',
    address: 'Hunsur Road, Mysuru',
    start_datetime: '2026-10-14T10:30:00+05:30',
    end_datetime: '2026-10-14T18:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'cinema,filmfestival,kannada,theatre',
    day_number: 4,
  },
  {
    id: 114,
    title: 'Yakshagana Prasanga: Sri Devi Mahatme at Town Hall',
    title_kn: 'ಟೌನ್ ಹಾಲ್‌ನಲ್ಲಿ ಯಕ್ಷಗಾನ: ಶ್ರೀ ದೇವಿ ಮಹಾತ್ಮೆ',
    description: 'Traditional coastal Tenkutittu and Badagutittu Yakshagana with thunderous Chande beats, glittering crowns, and mythical battles.',
    description_kn: 'ಚಂಡೆ ಮದ್ದಳೆಗಳ ನಾದಕ್ಕೆ ರಂಗು ರಂಗಿನ ವೇಷಭೂಷಣಗಳ ಯಕ್ಷಗಾನ ಪ್ರದರ್ಶನ.',
    category: 'folk',
    venue_name: 'Mysuru Town Hall Auditorium',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-14T19:00:00+05:30',
    end_datetime: '2026-10-14T22:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'yakshagana,folk,theatre,dance,chande',
    day_number: 4,
  },
  {
    id: 1145,
    title: 'Mahila Dasara: Traditional Rangoli & Heritage Handcrafts Fair',
    title_kn: 'ಮಹಿಳಾ ದಸರಾ: ಸಾಂಪ್ರದಾಯಿಕ ರಂಗೋಲಿ ಹಾಗೂ ಕರಕುಶಲ ಮೇಳ',
    description: 'Grand state-level geometrical rangoli contests and women entrepreneurs handcrafts bazaar.',
    description_kn: 'ಮಹಿಳಾ ಕಲಾವಿದರಿಂದ ಬೃಹತ್ ರಂಗೋಲಿ ಸ್ಪರ್ಧೆ ಹಾಗೂ ಕರಕುಶಲ ವಸ್ತು ಪ್ರದರ್ಶನ.',
    category: 'cultural',
    venue_name: 'Kalamandira Cultural Complex',
    address: 'Hunsur Road, Mysuru',
    start_datetime: '2026-10-14T11:00:00+05:30',
    end_datetime: '2026-10-14T14:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'mahiladasara,rangoli,women,crafts',
    day_number: 4,
  },

  // --- DAY 5 • OCT 15 (YUVA DASARA MEGA CONCERT) ---
  {
    id: 115,
    title: 'State-Level Kite Flying Festival (Gali Pata Utsava)',
    title_kn: 'ರಾಜ್ಯಮಟ್ಟದ ಗಾಳಿಪಟ ಉತ್ಸವ (ಲಲಿತ ಮಹಲ್ ಹೆಲಿಪ್ಯಾಡ್)',
    description: 'Hundreds of giant hand-crafted fighter kites, mythological eagle kites, and LED night kites taking flight across the palace skies.',
    description_kn: 'ಲಲಿತ ಮಹಲ್ ಮೈದಾನದಲ್ಲಿ ಆಕಾಶಕ್ಕೆ ಹಾರುವ ವರ್ಣರಂಜಿತ ಗಾಳಿಪಟಗಳು.',
    category: 'sports',
    venue_name: 'Lalitha Mahal Helipad Grounds',
    address: 'Lalitha Mahal Nagar, Mysuru',
    start_datetime: '2026-10-15T11:00:00+05:30',
    end_datetime: '2026-10-15T16:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'kites,galipata,sports,recreation',
    day_number: 5,
  },
  {
    id: 116,
    title: 'Yuva Dasara Mega Youth Concert - Night of the Stars',
    title_kn: 'ಯುವ ದಸರಾ ಸಂಗೀತ ಸಂಜೆ - ತಾರಾ ರಸಮಂಜರಿ',
    description: 'High-energy musical extravaganza under the open stars featuring international playback singers, indie-folk ensembles, and modern percussion stars.',
    description_kn: 'ಯುವ ಸಮೂಹವನ್ನು ರಂಜಿಸುವ ಸುಪ್ರಸಿದ್ಧ ಗಾಯಕರು ಮತ್ತು ಬ್ಯಾಂಡ್‌ಗಳ ಸಂಗೀತ ರಸಮಂಜರಿ.',
    category: 'cultural',
    venue_name: 'Maharaja College Centenary Grounds',
    address: 'Krishnaraja Boulevard, Mysuru',
    start_datetime: '2026-10-15T18:00:00+05:30',
    end_datetime: '2026-10-15T23:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'yuvadasara,youth,concert,music,dance,energy',
    day_number: 5,
  },
  {
    id: 117,
    title: 'Dasara Adventure Sports: Parasailing & Hot Air Balloon',
    title_kn: 'ಸಾಹಸ ದಸರಾ - ಹಾಟ್ ಏರ್ ಬಲೂನ್ ಮತ್ತು ಪ್ಯಾರಾಸೇಲಿಂಗ್',
    description: 'Thrilling aerial tethered hot air balloon ascents and dirt-bike tracks offering panoramic views of Chamundi Hill and city lights.',
    description_kn: 'ಸಾಹಸ ಪ್ರಿಯರಿಗಾಗಿ ಹಾಟ್ ಏರ್ ಬಲೂನ್ ಸವಾರಿ ಮತ್ತು ಜಿಪ್ ಲೈನ್ ಕ್ರೀಡೆಗಳು.',
    category: 'sports',
    venue_name: 'Mandakalli Airfield Plaza',
    address: 'Ooty Road, Mysuru',
    start_datetime: '2026-10-15T14:30:00+05:30',
    end_datetime: '2026-10-15T18:30:00+05:30',
    is_free: false,
    ticket_price: '350.00',
    is_featured: false,
    tags: 'adventure,balloon,parasailing,sports',
    day_number: 5,
  },
  {
    id: 1175,
    title: 'Nada Kusti Championship: Mysore Kesari Semifinal Bouts',
    title_kn: 'ನಾಡ ಕುಸ್ತಿ ಚಾಂಪಿಯನ್‌ಶಿಪ್: ಮೈಸೂರು ಕೇಸರಿ ಸೆಮಿಫೈನಲ್ಸ್',
    description: 'Electric semifinal clay wrestling clashes between heavyweights from Kolhapur, Davangere and Mysuru.',
    description_kn: 'ಅಖಾಡದಲ್ಲಿ ಮೈಸೂರು ಕೇಸರಿ ಗದೆ ಪ್ರವೇಶಕ್ಕಾಗಿ ಜಿದ್ದಾಜಿದ್ದಿನ ಸೆಮಿಫೈನಲ್ಸ್ ಕುಸ್ತಿ.',
    category: 'sports',
    venue_name: 'D. Devaraj Urs Traditional Wrestling Arena',
    address: 'Near Exhibition Grounds, Mysuru',
    start_datetime: '2026-10-15T15:30:00+05:30',
    end_datetime: '2026-10-15T19:00:00+05:30',
    is_free: false,
    ticket_price: '50.00',
    is_featured: true,
    tags: 'kusti,semifinals,wrestling,sports',
    day_number: 5,
  },

  // --- DAY 6 • OCT 16 (POETRY, ORCHIDS & ROCK NIGHT) ---
  {
    id: 118,
    title: 'Raitha Dasara: Farmers Fair & Indigenous Cattle Pageant',
    title_kn: 'ರೈತ ದಸರಾ ಹಾಗೂ ದೇಸಿ ತಳಿ ಹಳ್ಳಿಕಾರ್ ರಾಸುಗಳ ಪ್ರದರ್ಶನ',
    description: 'Showcase of pristine Hallikar, Amrit Mahal bull breeds, organic farm produce exhibitions, and traditional rural sports.',
    description_kn: 'ರೈತ ಸಮುದಾಯಕ್ಕಾಗಿ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ, ಸಿರಿಧಾನ್ಯ ಮೇಳ ಹಾಗೂ ರಾಸುಗಳ ಸ್ಪರ್ಧೆ.',
    category: 'cultural',
    venue_name: 'JK Grounds (Near City Railway Station)',
    address: 'Dhanvantri Road, Mysuru',
    start_datetime: '2026-10-16T09:30:00+05:30',
    end_datetime: '2026-10-16T14:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'raithadasara,agriculture,cattle,hallikar,farmers',
    day_number: 6,
  },
  {
    id: 119,
    title: 'Kavigoshti: National Multi-Lingual Poets Assembly',
    title_kn: 'ರಾಷ್ಟ್ರೀಯ ಬಹುಭಾಷಾ ಕವಿಗೋಷ್ಠಿ',
    description: 'Celebrated poets and Sahitya Akademi laureates recite Kannada, Sanskrit, Urdu, Hindi, and English poetry on heritage and peace.',
    description_kn: 'ಜಗನ್ಮೋಹನ ಅರಮನೆಯಲ್ಲಿ ಖ್ಯಾತ ಕವಿಗಳಿಂದ ಕವನ ವಾಚನ ಮತ್ತು ಸಾಹಿತ್ಯ ಸಮ್ಮಿಲನ.',
    category: 'cultural',
    venue_name: 'Jaganmohan Palace Art Gallery Auditorium',
    address: 'Desharaj Urs Road, Mysuru',
    start_datetime: '2026-10-16T14:00:00+05:30',
    end_datetime: '2026-10-16T17:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'poetry,kavigoshti,literature,kannada',
    day_number: 6,
  },
  {
    id: 120,
    title: 'Exotic Orchids & Bonsai Evening at Kuppanna Glass House',
    title_kn: 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕ್ ಬೋನ್ಸಾಯ್ ಮತ್ತು ಆರ್ಕಿಡ್ ಪ್ರದರ್ಶನ',
    description: 'Evening floral illumination around rare 100-year-old miniature bonsai trees and cascading floral waterfalls under architectural lights.',
    description_kn: 'ಬೆಳಕಿನ ಚಿತ್ತಾರದಲ್ಲಿ ನಳನಳಿಸುವ ನೂರಾರು ವರ್ಷ ಹಳೆಯ ಬೋನ್ಸಾಯ್ ಮರಗಳು.',
    category: 'flower',
    venue_name: 'Kuppanna Park (Nishad Bagh)',
    address: 'Near Nazarbad Police Station, Mysuru',
    start_datetime: '2026-10-16T16:30:00+05:30',
    end_datetime: '2026-10-16T21:00:00+05:30',
    is_free: false,
    ticket_price: '40.00',
    is_featured: false,
    tags: 'bonsai,orchids,flowers,glasshouse',
    day_number: 6,
  },
  {
    id: 121,
    title: 'Yuva Dasara Rock & Fusion Night',
    title_kn: 'ಯುವ ದಸರಾ ರಾಕ್ ಮತ್ತು ಫ್ಯೂಷನ್ ಮ್ಯೂಸಿಕ್',
    description: 'Electrifying fusion of Indian classical ragas with contemporary progressive rock and bass ensembles.',
    description_kn: 'ಭಾರತೀಯ ರಾಗಗಳೊಂದಿಗೆ ಪಾಶ್ಚಾತ್ಯ ಸಂಗೀತದ ಅದ್ಭುತ ಸಮ್ಮಿಶ್ರಣ.',
    category: 'music',
    venue_name: 'Maharaja College Centenary Grounds',
    address: 'Krishnaraja Boulevard, Mysuru',
    start_datetime: '2026-10-16T19:00:00+05:30',
    end_datetime: '2026-10-16T23:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'rock,fusion,yuvadasara,music',
    day_number: 6,
  },

  // --- DAY 7 • OCT 17 (JANAPADA FOLK KUNITHA FESTIVAL) ---
  {
    id: 122,
    title: 'Janapada Jatha: Grand Folk Procession with 50+ Kunitha Troupes',
    title_kn: 'ಜನಪದ ಜಾಥಾ - ೫೦ಕ್ಕೂ ಹೆಚ್ಚು ಕಲಾತಂಡಗಳ ಭವ್ಯ ಮೆರವಣಿಗೆ',
    description: 'Over 1,500 folk artistes performing energetic Dollu Kunitha, Pooja Kunitha, Goravara Kunitha, Kamsale, and Somana Kunitha along city rajapatha.',
    description_kn: 'ಡೊಳ್ಳು, ಕಂಸಾಳೆ, ವೀರಗಾಸೆ ಕಲಾತಂಡಗಳಿಂದ ನಗರದ ಪ್ರಮುಖ ರಸ್ತೆಗಳಲ್ಲಿ ಜನಪದ ನರ್ತನ.',
    category: 'folk',
    venue_name: 'Kalamandira to Sayyaji Rao Boulevard',
    address: 'Hunsur Road, Mysuru',
    start_datetime: '2026-10-17T10:00:00+05:30',
    end_datetime: '2026-10-17T13:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'folk,dollu,kamsale,veeragase,jatha,procession',
    day_number: 7,
  },
  {
    id: 123,
    title: 'State Folk Dance Festival & Tribal Instrument Ensemble',
    title_kn: 'ರಾಜ್ಯ ಮಟ್ಟದ ಜನಪದ ನೃತ್ಯೋತ್ಸವ ಹಾಗೂ ಬುಡಕಟ್ಟು ವಾದ್ಯಮೇಳ',
    description: 'Captivating indigenous tribal melodies from Soliga, Jenukuruba, and Siddi communities presenting forgotten lore and rhythms.',
    description_kn: 'ಸೊಲಿಗ ಮತ್ತು ಸಿದ್ಧಿ ಬುಡಕಟ್ಟು ಸಮುದಾಯದ ಅಪರೂಪದ ವಾದ್ಯ ಹಾಗೂ ನೃತ್ಯ ಪ್ರದರ್ಶನ.',
    category: 'folk',
    venue_name: 'Kalamandira Cultural Complex',
    address: 'Hunsur Road, Mysuru',
    start_datetime: '2026-10-17T15:30:00+05:30',
    end_datetime: '2026-10-17T18:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'tribal,soliga,folk,instruments,dance',
    day_number: 7,
  },
  {
    id: 124,
    title: 'Chitra Santhe: Open-Air Visual Art Fair & Live Painting',
    title_kn: 'ಚಿತ್ರಸಂತೆ - ಮುಕ್ತ ಕಲಾ ಮೇಳ ಹಾಗೂ ಲೈವ್ ಪೇಂಟಿಂಗ್',
    description: 'Kilometer-long open-air gallery showcasing traditional Mysore gold-leaf paintings, Ganjifa art cards, watercolours, and modern sculptures.',
    description_kn: 'ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಚಿನ್ನದ ಲೇಪನದ ಚಿತ್ರಕಲೆ ಹಾಗೂ ಕಲಾವಿದರ ನೇರ ಕಲಾ ರಚನೆ.',
    category: 'exhibition',
    venue_name: 'Mysore Palace North Perimeter Walkway',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-17T11:00:00+05:30',
    end_datetime: '2026-10-17T19:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'art,chitrasanthe,mysorepainting,ganjifa,visualart',
    day_number: 7,
  },
  {
    id: 125,
    title: 'Palace Courtyard Carnatic Veena & Flute Symphony',
    title_kn: 'ಅರಮನೆ ಪ್ರಾಂಗಣದಲ್ಲಿ ವೀಣಾ ಹಾಗೂ ಕೊಳಲು ನಾದಲಹರಿ',
    description: 'Sublime royal acoustic recital beneath the glowing rose marble domes of Amba Vilas Palace played on Mysore Saraswati Veena.',
    description_kn: 'ಮೈಸೂರು ಸರಸ್ವತಿ ವೀಣೆ ಹಾಗೂ ಕೊಳಲಿನ ದಿವ್ಯ ನಾದಲಹರಿ.',
    category: 'music',
    venue_name: 'Mysore Palace Durbar Courtyard',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-17T18:45:00+05:30',
    end_datetime: '2026-10-17T21:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'veena,flute,symphony,palace,music,carnatic',
    day_number: 7,
  },

  // --- DAY 8 • OCT 18 (AYUDHA POOJA & ROYAL REGALIA) ---
  {
    id: 126,
    title: 'Ayudha Pooja Royal Sanctum Worship & Armory Blessings',
    title_kn: 'ಅರಮನೆಯಲ್ಲಿ ಆಯುಧ ಪೂಜೆ ಹಾಗೂ ರಾಜ ಶಸ್ತ್ರಾಸ್ತ್ರ ಪೂಜೆ',
    description: 'Auspicious worship of the historic royal armory, royal carriages, silver howdah, and sacred palace tuskers inside the Amba Vilas Kalyana Mantapa.',
    description_kn: 'ರಾಜಮನೆತನದ ಆಯುಧಗಳು, ಪಟ್ಟದ ಆನೆ, ಕುದುರೆ ಹಾಗೂ ರಾಜವಾಹನಗಳಿಗೆ ಪೂಜೆ.',
    category: 'cultural',
    venue_name: 'Mysore Palace Kalyana Mantapa',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-18T10:00:00+05:30',
    end_datetime: '2026-10-18T13:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'ayudhapooja,sacred,weapons,palace,wadiyar',
    day_number: 8,
  },
  {
    id: 127,
    title: 'Worship of Royal Elephants & Pattada Kudure (Palace Horses)',
    title_kn: 'ಪಟ್ಟದ ಆನೆ ಮತ್ತು ಕುದುರೆಗಳಿಗೆ ಪುಷ್ಪಾರ್ಚನೆ',
    description: 'Ceremonial floral garland blessing of Arjuna and royal caparisoned elephants accompanied by palace brass band hymns.',
    description_kn: 'ಅಂಬಾರಿ ಆನೆ ಅರ್ಜುನ ಹಾಗೂ ಆನೆಗಳ ಸಾಲಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಫಲತಾಂಬೂಲ ಪೂಜೆ.',
    category: 'cultural',
    venue_name: 'Mysore Palace Balarama Gate Courtyard',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-18T11:45:00+05:30',
    end_datetime: '2026-10-18T13:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'arjuna,elephants,horses,puja,palace',
    day_number: 8,
  },
  {
    id: 128,
    title: 'Khas Durbar Private Audience of the Wadiyar Scion',
    title_kn: 'ಅಂಬಾ ವಿಲಾಸದಲ್ಲಿ ರಾಜಮನೆತನದ ಖಾಸಗಿ ದರ್ಬಾರ್',
    description: 'Re-enactment of the Vijayanagara-era private royal court on the 800-year-old Golden Throne (ಚಿನ್ನದ ಸಿಂಹಾಸನ) draped in royal silks.',
    description_kn: 'ಚಿನ್ನದ ಸಿಂಹಾಸನದಲ್ಲಿ ರಾಜಪರಂಪರೆಯ ಸಾಂಪ್ರದಾಯಿಕ ಖಾಸಗಿ ದರ್ಬಾರ್.',
    category: 'cultural',
    venue_name: 'Mysore Palace (Amba Vilas)',
    address: 'Sayyaji Rao Road, Agrahara, Mysuru',
    start_datetime: '2026-10-18T17:30:00+05:30',
    end_datetime: '2026-10-18T19:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'khasdurbar,goldenthrone,simhasana,wadiyar',
    day_number: 8,
  },
  {
    id: 129,
    title: 'Classical Dance Extravaganza: Bharatanatyam & Mohiniyattam',
    title_kn: 'ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ ವೈಭವ - ಭರತನಾಟ್ಯ ಹಾಗೂ ಮೋಹಿನಿಯಾಟ್ಟಂ',
    description: 'Sublime invocations to Devi Chamundeshwari choreographed by internationally acclaimed classical dance exponents.',
    description_kn: 'ಕಲಾಮಂದಿರದಲ್ಲಿ ದೇವಿ ಸ್ತುತಿಯ ಆಕರ್ಷಕ ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ ಪ್ರದರ್ಶನ.',
    category: 'cultural',
    venue_name: 'Kalamandira Cultural Complex',
    address: 'Hunsur Road, Mysuru',
    start_datetime: '2026-10-18T19:00:00+05:30',
    end_datetime: '2026-10-18T21:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'bharatanatyam,dance,mohiniyattam,classical',
    day_number: 8,
  },

  // --- DAY 9 • OCT 19 (MAHA NAVAMI & KUSTI FINALS) ---
  {
    id: 130,
    title: 'Maha Navami Chandi Homa & Poornahuti at Chamundi Hill',
    title_kn: 'ಮಹಾ ನವಮಿ ಚಂಡಿಕಾ ಹೋಮ ಹಾಗೂ ಪೂರ್ಣಾಹುತಿ',
    description: 'Grand 108-herbal sacrificial oblation (Chandi Yagna) conducted with sacred shlokas for universal prosperity and welfare of the nation.',
    description_kn: 'ಲೋಕಕಲ್ಯಾಣಾರ್ಥವಾಗಿ ಚಾಮುಂಡಿ ಬೆಟ್ಟದಲ್ಲಿ ನಡೆಯುವ ಮಹಾ ಚಂಡಿಕಾ ಹೋಮ.',
    category: 'cultural',
    venue_name: 'Chamundi Hills Temple Sanctum',
    address: 'Chamundi Hill Road, Mysuru',
    start_datetime: '2026-10-19T09:00:00+05:30',
    end_datetime: '2026-10-19T13:00:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'mahanavami,chandihoma,yagna,chamundi',
    day_number: 9,
  },
  {
    id: 131,
    title: 'Dasara Kesari Wrestling Grand Finals & Awarding of Silver Mace',
    title_kn: 'ದಸರಾ ಕೇಸರಿ ಕುಸ್ತಿ ಮಹಾ ಫೈನಲ್ಸ್ ಹಾಗೂ ಬೆಳ್ಳಿ ಗದೆ ಪ್ರದಾನ',
    description: 'The nail-biting heavyweight championship bout determining the 2026 Mysore Kesari champion, witnessed by thousands of wrestling enthusiasts.',
    description_kn: 'ಮೈಸೂರು ಕೇಸರಿ ಬೆಳ್ಳಿ ಗದೆ ಮತ್ತು ನಗದು ಬಹುಮಾನಕ್ಕಾಗಿ ಅಂತಿಮ ಕುಸ್ತಿ ಕಾಳಗ.',
    category: 'sports',
    venue_name: 'D. Devaraj Urs Traditional Wrestling Arena',
    address: 'Near Exhibition Grounds, Mysuru',
    start_datetime: '2026-10-19T15:30:00+05:30',
    end_datetime: '2026-10-19T19:30:00+05:30',
    is_free: false,
    ticket_price: '100.00',
    is_featured: true,
    tags: 'wrestling,finals,kesari,mace,sports',
    day_number: 9,
  },
  {
    id: 132,
    title: 'Torchlight Parade Full Dress Rehearsal & Motorcycle Stunts',
    title_kn: 'ಪಂಜಿನ ಕವಾಯತು ಅಂತಿಮ ತಾಲೀಮು ಹಾಗೂ ಸಾಹಸ ಕಸರತ್ತುಗಳು',
    description: 'Full dress rehearsal of military trick riding, jumping through rings of fire, and ceremonial torch formations at Bannimantap.',
    description_kn: 'ಬನ್ನಿಮಂಟಪದಲ್ಲಿ ಪಂಜಿನ ಕವಾಯತಿನ ಅಂತಿಮ ತಾಲೀಮು ಮತ್ತು ಬೈಕ್ ಸಾಹಸ.',
    category: 'torchlight',
    venue_name: 'Bannimantap Parade Grounds',
    address: 'Bannimantap, Mysuru',
    start_datetime: '2026-10-19T18:30:00+05:30',
    end_datetime: '2026-10-19T21:00:00+05:30',
    is_free: false,
    ticket_price: '150.00',
    is_featured: false,
    tags: 'rehearsal,torchlight,motorcycle,bannimantap',
    day_number: 9,
  },
  {
    id: 133,
    title: 'Grand Sitar & Sarod Jugalbandi at Mysore Palace',
    title_kn: 'ಅರಮನೆಯಲ್ಲಿ ಸಿತಾರ್ ಹಾಗೂ ಸರೋದ್ ಜುಗಲ್‌ಬಂದಿ',
    description: 'Eminent Padma Vibhushan maestros perform celebratory dusk ragas under the illuminated 24-carat gold dome of the palace.',
    description_kn: 'ಅರಮನೆಯ ಅಂಗಳದಲ್ಲಿ ದೀಪಗಳ ಸಾಲಿನಲ್ಲಿ ವಿಶ್ವವಿಖ್ಯಾತ ಸರೋದ್ ವಾದನ.',
    category: 'music',
    venue_name: 'Mysore Palace Durbar Courtyard',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-19T19:30:00+05:30',
    end_datetime: '2026-10-19T22:15:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'music,sitar,sarod,classical,palace',
    day_number: 9,
  },

  // --- DAY 10 • OCT 20 (VIJAYADASHAMI GRAND FINALE) ---
  {
    id: 134,
    title: "Nandi Dhwaja Pooja at Balarama Gate by Hon'ble Chief Minister",
    title_kn: 'ಬಲರಾಮ ದ್ವಾರದಲ್ಲಿ ನಂದಿ ಧ್ವಜ ಪೂಜೆ',
    description: 'Ceremonial flagging off of Vijayadashami celebrations with sacred puja to the 28-foot decorated Nandi Dhwaja flagpole.',
    description_kn: 'ಮುಖ್ಯಮಂತ್ರಿಗಳಿಂದ ನಂದಿಧ್ವಜಕ್ಕೆ ವಿಧ್ಯುಕ್ತ ಪೂಜೆ ನೆರವೇರಿಸುವ ಮುಹೂರ್ತ.',
    category: 'jamboo_savari',
    venue_name: 'Mysore Palace Balarama Gate',
    address: 'Balarama Gate, Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-20T13:15:00+05:30',
    end_datetime: '2026-10-20T13:45:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'nandidhwaja,balaramagate,inauguration,puja',
    day_number: 10,
  },
  {
    id: 135,
    title: 'Vijayadashami Jamboo Savari Grand Royal Procession',
    title_kn: 'ವಿಜಯದಶಮಿ ಜಂಬೂ ಸವಾರಿ ವೈಭವದ ಮೆರವಣಿಗೆ',
    description: 'The pinnacle of Mysuru Dasara: Captain elephant Arjuna carries the 750 kg Pure Golden Howdah (ಚಿನ್ನದ ಅಂಬಾರಿ) with Sri Chamundeshwari, escorted by 50+ tableaux, mounted police regiments, and folk troupes over 5 kilometers to Bannimantap.',
    description_kn: '೭೫೦ ಕೆಜಿ ತೂಕದ ಚಿನ್ನದ ಅಂಬಾರಿಯಲ್ಲಿ ಜಗನ್ಮಾತೆ ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ವಿರಾಜಮಾನಳಾಗಿ ಸಾಗುವ ಜಗತ್ಪ್ರಸಿದ್ಧ ಜಂಬೂ ಸವಾರಿ.',
    category: 'jamboo_savari',
    venue_name: 'Mysore Palace to Bannimantap (Procession Route)',
    address: 'Balarama Gate to Bannimantap Ground, Mysuru',
    start_datetime: '2026-10-20T13:30:00+05:30',
    end_datetime: '2026-10-20T17:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: true,
    tags: 'jamboosavari,ambari,arjuna,goldenhowdah,climax,procession',
    day_number: 10,
  },
  {
    id: 136,
    title: 'Tableaux Parade of 31 Karnataka Districts along Sayyaji Rao Road',
    title_kn: '೩೧ ಜಿಲ್ಲೆಗಳ ಸ್ತಬ್ಧಚಿತ್ರಗಳ ಆಕರ್ಷಕ ಮೆರವಣಿಗೆ',
    description: 'Magnificent animated cultural floats representing Karnataka’s historic empires (Hampi, Badami), wildlife sanctuaries, and scientific milestones.',
    description_kn: 'ಹಂಪಿ, ಬಾದಾಮಿ ಶಿಲ್ಪಕಲೆ ಹಾಗೂ ರಾಜ್ಯದ ಶ್ರೀಮಂತ ಪರಂಪರೆಯ ಸ್ತಬ್ಧಚಿತ್ರಗಳು.',
    category: 'folk',
    venue_name: 'Sayyaji Rao Road Procession Corridor',
    address: 'Sayyaji Rao Road, Mysuru',
    start_datetime: '2026-10-20T14:30:00+05:30',
    end_datetime: '2026-10-20T17:30:00+05:30',
    is_free: true,
    ticket_price: null,
    is_featured: false,
    tags: 'tableaux,floats,districts,karnataka,parade',
    day_number: 10,
  },
  {
    id: 137,
    title: 'Torchlight Parade & 1,000 Drone Sky Symphony at Bannimantap',
    title_kn: 'ಪಂಜಿನ ಕವಾಯತು ಮತ್ತು ಡ್ರೋನ್ ಶೋ ಮಹಾ ಸಮಾರೋಪ',
    description: 'Breathtaking military motorcycle acrobatics, ceremonial torchlight drills, laser displays, and 1,000 synchronized LED drones forming royal Chamundeshwari motifs.',
    description_kn: 'ಬನ್ನಿಮಂಟಪದಲ್ಲಿ ಮೈಜುಮ್ಮೆನಿಸುವ ಸಾಹಸ ಕಲಾಪ್ರದರ್ಶನ, ಲೇಸರ್ ಶೋ ಹಾಗೂ ಬೃಹತ್ ಡ್ರೋನ್ ಶೋ.',
    category: 'torchlight',
    venue_name: 'Bannimantap Parade Grounds',
    address: 'Bannimantap, Mysuru',
    start_datetime: '2026-10-20T19:00:00+05:30',
    end_datetime: '2026-10-20T21:45:00+05:30',
    is_free: false,
    ticket_price: '250.00',
    is_featured: true,
    tags: 'torchlight,drones,parade,bannimantap,lasers,finale',
    day_number: 10,
  },
];

const CATEGORY_MAP: Record<string, { label: string; icon: string; color: string; badgeBg: string }> = {
  all: { label: 'All Categories', icon: '✨', color: 'text-amber-300', badgeBg: 'bg-amber-400/20' },
  cultural: { label: 'Cultural & Heritage', icon: '🎭', color: 'text-emerald-300', badgeBg: 'bg-emerald-500/20' },
  jamboo_savari: { label: 'Jamboo Savari', icon: '🐘', color: 'text-amber-400', badgeBg: 'bg-amber-400/30' },
  torchlight: { label: 'Torchlight & Drones', icon: '🔥', color: 'text-rose-400', badgeBg: 'bg-rose-500/20' },
  music: { label: 'Classical Sangeetha', icon: '🎶', color: 'text-cyan-300', badgeBg: 'bg-cyan-500/20' },
  folk: { label: 'Folk & Kunitha', icon: '🪘', color: 'text-orange-400', badgeBg: 'bg-orange-500/20' },
  food: { label: 'Aahara Mela (Food)', icon: '🍛', color: 'text-yellow-300', badgeBg: 'bg-yellow-500/20' },
  flower: { label: 'Flower Shows', icon: '🌸', color: 'text-pink-300', badgeBg: 'bg-pink-500/20' },
  exhibition: { label: 'Dasara Exhibition', icon: '🛍️', color: 'text-purple-300', badgeBg: 'bg-purple-500/20' },
  sports: { label: 'Traditional Kusti', icon: '🤼', color: 'text-red-400', badgeBg: 'bg-red-500/20' },
};

const FESTIVAL_DAYS = [
  { day: 0, date: 'All 10 Days', label: 'Complete Festival' },
  { day: 1, date: 'Oct 11', label: 'Day 1 • Inauguration' },
  { day: 2, date: 'Oct 12', label: 'Day 2 • Music Sabha' },
  { day: 3, date: 'Oct 13', label: 'Day 3 • Aahara Mela' },
  { day: 4, date: 'Oct 14', label: 'Day 4 • Nada Kusti' },
  { day: 5, date: 'Oct 15', label: 'Day 5 • Yuva Dasara' },
  { day: 6, date: 'Oct 16', label: 'Day 6 • Flower Show' },
  { day: 7, date: 'Oct 17', label: 'Day 7 • Janapada Folk' },
  { day: 8, date: 'Oct 18', label: 'Day 8 • Ayudha Pooja' },
  { day: 9, date: 'Oct 19', label: 'Day 9 • Maha Navami' },
  { day: 10, date: 'Oct 20', label: 'Day 10 • Jamboo Savari' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>(COMPLETE_DASARA_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [filterAdmission, setFilterAdmission] = useState<'all' | 'free' | 'ticketed'>('all');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'featured' | 'price'>('date_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);
  const [bookingEvent, setBookingEvent] = useState<any | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const daysScrollRef = useRef<HTMLDivElement>(null);
  const dayButtonsRef = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  const { savedEvents, toggleSavedEvent } = useAppStore();

  // Target Vijayadashami Date for Countdown: Oct 20, 2026, 13:30:00 IST
  const vijayadashamiDate = useMemo(() => new Date('2026-10-20T13:30:00+05:30'), []);
  const countdown = useCountdown(vijayadashamiDate);

  // Load from Django backend and merge smoothly
  useEffect(() => {
    eventsAPI
      .getEvents({ page_size: 100 })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        if (data.length > 0) {
          // Normalize day_number on incoming data
          const normalized = data.map((d: any) => ({
            ...d,
            day_number: getEventDayNumber(d),
          }));
          setEvents(normalized);
        }
      })
      .catch(() => {
        setEvents(COMPLETE_DASARA_EVENTS);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // When selectedDay changes, smoothly scroll the active day button into view
  useEffect(() => {
    const btn = dayButtonsRef.current[selectedDay];
    if (btn && daysScrollRef.current) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedDay]);

  // Compute event counts per day for the top tabs
  const eventCountsByDay = useMemo(() => {
    const counts: Record<number, number> = { 0: events.length };
    for (let i = 1; i <= 10; i++) counts[i] = 0;
    events.forEach((e) => {
      const d = getEventDayNumber(e);
      if (counts[d] !== undefined) {
        counts[d]++;
      }
    });
    return counts;
  }, [events]);

  // Unique venues list for the venue quick filter
  const venueOptions = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.venue_name) set.add(e.venue_name);
    });
    return Array.from(set);
  }, [events]);

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          evt.title.toLowerCase().includes(q) ||
          (evt.title_kn && evt.title_kn.includes(q)) ||
          (evt.description && evt.description.toLowerCase().includes(q)) ||
          (evt.venue_name && evt.venue_name.toLowerCase().includes(q)) ||
          (evt.tags && evt.tags.toLowerCase().includes(q));

        const matchesCat = selectedCategory === 'all' || evt.category === selectedCategory;

        const evtDay = getEventDayNumber(evt);
        const matchesDay = selectedDay === 0 || evtDay === selectedDay;

        const matchesAdmission =
          filterAdmission === 'all'
            ? true
            : filterAdmission === 'free'
            ? evt.is_free
            : !evt.is_free;

        const matchesFeatured = !filterFeaturedOnly || evt.is_featured;

        const isSaved = savedEvents.includes(String(evt.id));
        const matchesSaved = !filterSavedOnly || isSaved;

        const matchesVenue = selectedVenue === 'all' || evt.venue_name === selectedVenue;

        return (
          matchesSearch &&
          matchesCat &&
          matchesDay &&
          matchesAdmission &&
          matchesFeatured &&
          matchesSaved &&
          matchesVenue
        );
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        }
        if (sortBy === 'price') {
          const pA = a.is_free ? 0 : parseFloat(a.ticket_price || '0');
          const pB = b.is_free ? 0 : parseFloat(b.ticket_price || '0');
          return pA - pB;
        }
        if (sortBy === 'date_desc') {
          return new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime();
        }
        return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime();
      });
  }, [
    events,
    searchQuery,
    selectedCategory,
    selectedDay,
    filterAdmission,
    filterFeaturedOnly,
    filterSavedOnly,
    selectedVenue,
    sortBy,
    savedEvents,
  ]);

  // Headliner event for Spotlight
  const headlinerEvent = useMemo(() => {
    return (
      events.find((e) => e.category === 'jamboo_savari' && e.is_featured) ||
      events.find((e) => e.is_featured) ||
      events[0]
    );
  }, [events]);

  // Card click handler: Real-time updates the top date tab AND opens details!
  const handleCardClick = (evt: any) => {
    const evtDay = getEventDayNumber(evt);
    // Real-time synchronization of the top date navigator
    setSelectedDay(evtDay);
    setSelectedEventModal(evt);
    audioManager.playBellSound();
  };

  // Google Calendar URL Generator
  const getGoogleCalendarUrl = (event: any) => {
    const fmt = (d: string) =>
      new Date(d).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const start = fmt(event.start_datetime);
    const end = fmt(event.end_datetime || event.start_datetime);
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description || ''}\n\nMysuru Dasara 2026 Festival`);
    const loc = encodeURIComponent(event.venue_name || 'Mysuru, Karnataka');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${loc}`;
  };

  // iCalendar (.ics) download for Apple Calendar / Outlook
  const handleAddToCalendar = (event: any) => {
    audioManager.playBellSound();
    const fmt = (d: string) =>
      new Date(d).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const start = fmt(event.start_datetime);
    const end = fmt(event.end_datetime || event.start_datetime);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mysuru Dasara 2026 Official//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:dasara-2026-${event.id}@mysoredasara.gov.in`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || 'Mysuru Dasara 2026 Royal Celebration'}`,
      `LOCATION:${event.venue_name || 'Mysuru, Karnataka'}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📅 iCalendar (.ics) invite downloaded!');
  };

  // Download entire personal saved itinerary as consolidated .ics
  const handleExportFullSchedule = () => {
    const savedList = events.filter((e) => savedEvents.includes(String(e.id)));
    if (savedList.length === 0) {
      showToast('⚠️ No events saved yet! Tap the heart on any event to bookmark.');
      return;
    }

    const fmt = (d: string) =>
      new Date(d).toISOString().replace(/-|:|\.\d\d\d/g, '');

    const eventBlocks = savedList
      .map((e) => {
        const start = fmt(e.start_datetime);
        const end = fmt(e.end_datetime || e.start_datetime);
        return [
          'BEGIN:VEVENT',
          `UID:my-dasara-${e.id}@mysoredasara.gov.in`,
          `SUMMARY:${e.title}`,
          `DESCRIPTION:${e.description || 'Mysuru Dasara 2026 Personal Itinerary'}`,
          `LOCATION:${e.venue_name || 'Mysuru, Karnataka'}`,
          `DTSTART:${start}`,
          `DTEND:${end}`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
        ].join('\r\n');
      })
      .join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//My Mysuru Dasara 2026 Itinerary//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      eventBlocks,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'My_Mysuru_Dasara_2026_Itinerary.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✨ Complete saved itinerary (.ics) downloaded!');
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-7xl mx-auto flex flex-col relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-black px-4 py-3 rounded-2xl font-bold shadow-royal flex items-center gap-2 animate-bounce">
          <span>🔔</span>
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <PageHeader
        title="Dasara Event Explorer & Daily Sabha"
        titleKn="ದಸರಾ ಮಹೋತ್ಸವ ಕಾರ್ಯಕ್ರಮಗಳ ಸಮಗ್ರ ವೇಳಾಪಟ್ಟಿ"
        subtitle="Explore the complete 10-day Vijayadashami celebration: Classical music sabhas, folk kunitha parades, wrestling championships, food mela, and the world-famous Jamboo Savari."
      />

      {/* ======================================================== */}
      {/* 1. HERO SPOTLIGHT CAROUSEL & LIVE VIJAYADASHAMI COUNTDOWN */}
      {/* ======================================================== */}
      {headlinerEvent && (
        <div className="mb-8 rounded-3xl overflow-hidden glass border-2 border-amber-400/40 p-6 md:p-8 shadow-royal relative bg-gradient-to-br from-amber-950/40 via-black/85 to-purple-950/40">
          <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10 text-9xl font-serif">
            🐘
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-wider shadow-gold-glow flex items-center gap-1">
                  <span>⭐</span>
                  <span>Festival Crown Event</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold backdrop-blur-sm border border-amber-400/30">
                  🗓️ October 20, 2026 • Vijayadashami Day 10
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                  🎟️ Free Public Viewing
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-cream tracking-tight leading-tight">
                {headlinerEvent.title}
              </h2>
              {headlinerEvent.title_kn && (
                <p className="text-base md:text-lg text-amber-300 font-kannada font-semibold">
                  {headlinerEvent.title_kn}
                </p>
              )}

              <p className="text-xs md:text-sm text-cream/80 leading-relaxed max-w-2xl">
                {headlinerEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-cream/70 pt-2">
                <span className="flex items-center gap-1.5 font-medium text-amber-200">
                  <span>📍</span>
                  <span>{headlinerEvent.venue_name}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span>⏰</span>
                  <span>
                    {new Date(headlinerEvent.start_datetime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(headlinerEvent.end_datetime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
              </div>
            </div>

            {/* Countdown Clock & Actions */}
            <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0 items-center lg:items-end">
              {/* Live Ticking Countdown Box */}
              <div className="p-3 rounded-2xl bg-black/60 border border-amber-400/40 shadow-royal flex items-center gap-3">
                <div className="text-center px-1.5">
                  <div className="text-xl md:text-2xl font-black text-amber-300">{countdown.days}</div>
                  <div className="text-[9px] uppercase tracking-wider text-cream/60">Days</div>
                </div>
                <span className="text-amber-400 font-bold text-lg">:</span>
                <div className="text-center px-1.5">
                  <div className="text-xl md:text-2xl font-black text-amber-300">{countdown.hours}</div>
                  <div className="text-[9px] uppercase tracking-wider text-cream/60">Hours</div>
                </div>
                <span className="text-amber-400 font-bold text-lg">:</span>
                <div className="text-center px-1.5">
                  <div className="text-xl md:text-2xl font-black text-amber-300">{countdown.minutes}</div>
                  <div className="text-[9px] uppercase tracking-wider text-cream/60">Mins</div>
                </div>
                <span className="text-amber-400 font-bold text-lg">:</span>
                <div className="text-center px-1.5">
                  <div className="text-xl md:text-2xl font-black text-amber-400">{countdown.seconds}</div>
                  <div className="text-[9px] uppercase tracking-wider text-cream/60">Secs</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 w-full">
                <button
                  onClick={() => {
                    handleCardClick(headlinerEvent);
                    setBookingEvent(headlinerEvent);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-gold-glow flex items-center justify-center gap-1.5 min-w-[160px]"
                >
                  <span>
                    {headlinerEvent.is_free
                      ? '🎟️ Get Free Pass (Slide)'
                      : `💳 Book Ticket • ₹${headlinerEvent.ticket_price}`}
                  </span>
                </button>
                <button
                  onClick={() => handleCardClick(headlinerEvent)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1"
                >
                  <span>🔍 Details</span>
                </button>
                <a
                  href={getGoogleCalendarUrl(headlinerEvent)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold border border-white/20 transition-all text-center flex items-center justify-center gap-1"
                >
                  <span>📅 Cal</span>
                </a>
                <button
                  onClick={() => {
                    toggleSavedEvent(String(headlinerEvent.id));
                    showToast(
                      savedEvents.includes(String(headlinerEvent.id))
                        ? 'Removed from saved schedule'
                        : '❤️ Saved to your schedule!'
                    );
                  }}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    savedEvents.includes(String(headlinerEvent.id))
                      ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                      : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                  }`}
                >
                  {savedEvents.includes(String(headlinerEvent.id)) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TEN-DAY FESTIVAL TIMELINE NAVIGATOR (REAL-TIME SYNC) */}
      {/* ======================================================== */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>🗓️</span>
              <span>Navaratri 10-Day Festival Schedule</span>
            </span>
            {selectedDay > 0 ? (
              <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md font-bold border border-amber-400/30">
                Filtered: Day {selectedDay} (Oct {selectedDay + 10})
              </span>
            ) : (
              <span className="text-[11px] bg-white/10 text-cream/70 px-2 py-0.5 rounded-md">
                Showing All 10 Days
              </span>
            )}
          </div>

          {selectedDay > 0 && (
            <button
              onClick={() => {
                setSelectedDay(0);
                audioManager.playBellSound();
              }}
              className="text-xs text-amber-300 hover:text-white underline font-semibold transition-colors"
            >
              Reset to All 10 Days
            </button>
          )}
        </div>

        {/* Scrollable Day Buttons with Live Event Count Badges */}
        <div
          ref={daysScrollRef}
          className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-400/30 scroll-smooth"
        >
          {FESTIVAL_DAYS.map((fd) => {
            const isSelected = selectedDay === fd.day;
            const count = eventCountsByDay[fd.day] || 0;

            return (
              <button
                key={fd.day}
                ref={(el) => {
                  dayButtonsRef.current[fd.day] = el;
                }}
                onClick={() => {
                  audioManager.playBellSound();
                  setSelectedDay(fd.day);
                }}
                className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-300 shadow-gold-glow scale-105 z-10'
                    : 'bg-black/50 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] opacity-80 uppercase tracking-tight">{fd.date}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-amber-400/20 text-amber-300'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <div className="whitespace-nowrap font-extrabold">{fd.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SEARCH & ADVANCED MULTI-FILTER CONSOLE                */}
      {/* ======================================================== */}
      <div className="glass p-5 rounded-3xl border border-amber-400/20 mb-6 space-y-4">
        {/* Row 1: Search, Venue, Admission, Sort & View Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              placeholder="Search title, artiste, or Kannada keywords (ಜಂಬೂ ಸವಾರಿ, ಅರ್ಜುನ, ಕುಸ್ತಿ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-black/50 border border-white/20 text-cream placeholder-white/40 text-xs md:text-sm focus:outline-none focus:border-amber-400"
            />
            <span className="absolute left-3 top-2.5 text-white/40 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-white/50 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Venue Quick Filter */}
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400 truncate"
          >
            <option value="all">📍 All Festival Venues</option>
            {venueOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Admission Filter */}
          <select
            value={filterAdmission}
            onChange={(e) => setFilterAdmission(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">🎟️ All Admissions</option>
            <option value="free">🟢 Free Entry Only</option>
            <option value="ticketed">💎 Ticketed / VIP</option>
          </select>

          {/* View Mode & Sort Toggle */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-cream text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="date_asc">⏱️ Date: Earliest</option>
              <option value="date_desc">⏱️ Date: Latest</option>
              <option value="featured">⭐ Featured</option>
              <option value="price">💰 Price</option>
            </select>

            <div className="flex rounded-xl bg-black/50 border border-white/20 p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-amber-400 text-black shadow-sm' : 'text-white/60 hover:text-white'
                }`}
                title="Grid View"
              >
                ▦
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'timeline' ? 'bg-amber-400 text-black shadow-sm' : 'text-white/60 hover:text-white'
                }`}
                title="Timeline View"
              >
                ⏱️
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(CATEGORY_MAP).map(([catKey, catMeta]) => {
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => {
                    audioManager.playBellSound();
                    setSelectedCategory(catKey);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-black font-extrabold shadow-gold-glow'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{catMeta.icon}</span>
                  <span>{catMeta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Toggle Chips: Featured & Saved */}
          <div className="flex gap-2 pt-2 sm:pt-0">
            <button
              onClick={() => setFilterFeaturedOnly(!filterFeaturedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                filterFeaturedOnly
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-gold-glow'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>⭐</span>
              <span>Featured ({events.filter((e) => e.is_featured).length})</span>
            </button>

            <button
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                filterSavedOnly
                  ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-royal'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>❤️</span>
              <span>Saved ({savedEvents.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. RESULTS STATS & PERSONAL ITINERARY CONTROLS           */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 px-1">
        <div className="text-xs text-cream/70 flex items-center gap-2 flex-wrap">
          <span>Displaying</span>
          <span className="font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
            {filteredEvents.length} Events
          </span>
          {selectedDay > 0 ? (
            <span className="text-amber-400 font-bold">
              for Day {selectedDay} (October {selectedDay + 10}, 2026)
            </span>
          ) : (
            <span className="text-cream/50">across all 10 festival days</span>
          )}
          {selectedCategory !== 'all' && (
            <span className="text-amber-200/80">• Category: {CATEGORY_MAP[selectedCategory]?.label}</span>
          )}
        </div>

        {/* Schedule Export & Drawer Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {savedEvents.length > 0 && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold hover:bg-rose-500/30 transition-all flex items-center justify-center gap-1.5 shadow-royal"
            >
              <span>📋</span>
              <span>My Itinerary ({savedEvents.length})</span>
            </button>
          )}

          <button
            onClick={handleExportFullSchedule}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-400/30 transition-all flex items-center justify-center gap-1.5 shadow-royal"
            title="Download personal schedule as standard .ics iCalendar file"
          >
            <span>📥</span>
            <span>Export Calendar (.ics)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. MAIN EVENT DISPLAY (GRID VIEW vs TIMELINE VIEW)       */}
      {/* ======================================================== */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-white/10 space-y-3">
          <p className="text-5xl">🔍</p>
          <p className="text-lg font-bold text-cream">No events match your current filter selection</p>
          <p className="text-xs text-cream/60 max-w-md mx-auto">
            Try resetting the search keywords, switching to "All Categories", or checking "All 10 Days".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDay(0);
              setSelectedVenue('all');
              setFilterAdmission('all');
              setFilterFeaturedOnly(false);
              setFilterSavedOnly(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-all shadow-gold-glow"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isSaved = savedEvents.includes(String(evt.id));
            const catInfo = CATEGORY_MAP[evt.category] || CATEGORY_MAP.cultural;
            const startDate = new Date(evt.start_datetime);
            const evtDay = getEventDayNumber(evt);
            const isDaySelected = selectedDay === evtDay;

            return (
              <div
                key={evt.id}
                onClick={() => handleCardClick(evt)}
                className={`glass rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-royal cursor-pointer relative overflow-hidden group ${
                  evt.is_featured
                    ? 'border-amber-400/50 shadow-gold-glow/20 bg-gradient-to-b from-amber-950/20 via-black/40 to-black/60'
                    : 'border-white/10 hover:border-amber-400/40 bg-black/30'
                }`}
              >
                {/* Decorative Top Accent Bar */}
                <div
                  className={`h-1.5 w-full ${
                    evt.is_featured
                      ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300'
                      : 'bg-white/15'
                  }`}
                />

                <div className="p-5">
                  {/* Top Badges & Real-Time Day Chip */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${catInfo.badgeBg} ${catInfo.color}`}
                      >
                        <span>{catInfo.icon}</span>
                        <span>{catInfo.label}</span>
                      </span>

                      {/* Clickable Day Chip (Real-Time Synchronizes Top Date Tab) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(evtDay);
                          audioManager.playBellSound();
                          showToast(`Filtered to Day ${evtDay} (October ${evtDay + 10})`);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all border ${
                          isDaySelected
                            ? 'bg-amber-400 text-black border-amber-300 shadow-sm'
                            : 'bg-white/10 text-amber-200 border-white/15 hover:bg-amber-400/20'
                        }`}
                        title="Click to filter this festival day above"
                      >
                        Day {evtDay} • Oct {evtDay + 10}
                      </button>

                      {evt.is_featured && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-sm">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Bookmark Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioManager.playBellSound();
                        toggleSavedEvent(String(evt.id));
                        showToast(isSaved ? 'Removed from saved schedule' : '❤️ Saved to your schedule!');
                      }}
                      className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-base transition-transform active:scale-90"
                      title={isSaved ? 'Remove from saved' : 'Save to my schedule'}
                    >
                      {isSaved ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Title & Kannada Subtitle */}
                  <h3 className="text-base md:text-lg font-bold text-cream mb-1 leading-snug group-hover:text-amber-300 transition-colors">
                    {evt.title}
                  </h3>
                  {evt.title_kn && (
                    <p className="text-xs text-amber-400/80 font-kannada mb-2.5 line-clamp-1">{evt.title_kn}</p>
                  )}

                  {/* Description */}
                  <p className="text-xs text-cream/70 line-clamp-3 leading-relaxed mb-4">
                    {evt.description}
                  </p>
                </div>

                {/* Footer Information & Action Buttons */}
                <div className="px-5 pb-5 pt-3 border-t border-white/10 space-y-3 bg-black/30">
                  {/* Venue & Admission */}
                  <div className="flex justify-between items-center text-xs">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        (evt.venue_name || 'Mysuru') + ' Mysuru Karnataka'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-amber-200/90 hover:text-amber-300 flex items-center gap-1 max-w-[70%] truncate"
                      title="Open in Google Maps"
                    >
                      <span>📍</span>
                      <span className="truncate">{evt.venue_name || 'Mysuru Venue'}</span>
                    </a>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        evt.is_free
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {evt.is_free ? 'Free Entry' : `₹${evt.ticket_price}`}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex justify-between items-center text-[11px] text-cream/60">
                    <span className="flex items-center gap-1 font-semibold text-amber-100">
                      <span>🗓️</span>
                      <span>
                        {startDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>⏰</span>
                      <span>
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                  </div>

                  {/* Primary Get Pass / Book Ticket Button */}
                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(evt);
                        setBookingEvent(evt);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-black font-extrabold text-xs hover:brightness-110 active:scale-[0.98] transition-all shadow-gold-glow flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {evt.is_free ? '🎟️ Get Free Pass (Slide)' : `💳 Book Ticket • ₹${evt.ticket_price}`}
                      </span>
                    </button>
                  </div>

                  {/* Secondary Action Buttons: Add to Cal, Share, Inspect */}
                  <div className="pt-1 flex gap-2">
                    <a
                      href={getGoogleCalendarUrl(evt)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400/25 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
                      title="Add directly to Google Calendar"
                    >
                      <span>📅 Cal</span>
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCalendar(evt);
                      }}
                      className="py-1.5 px-2 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-cream text-xs font-medium transition-all"
                      title="Download iCal (.ics) file"
                    >
                      <span>📥 iCal</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(evt);
                      }}
                      className="py-1.5 px-2.5 rounded-xl bg-white/10 border border-white/20 text-cream text-xs font-bold hover:bg-white/20 transition-all shadow-sm"
                      title="Inspect Event"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CHRONOLOGICAL TIMELINE VIEW */
        <div className="glass rounded-3xl border border-white/10 p-6 md:p-8 space-y-6">
          <div className="relative pl-6 md:pl-8 border-l-2 border-amber-400/40 space-y-8">
            {filteredEvents.map((evt) => {
              const startDate = new Date(evt.start_datetime);
              const isSaved = savedEvents.includes(String(evt.id));
              const evtDay = getEventDayNumber(evt);

              return (
                <div key={evt.id} className="relative group">
                  {/* Timeline Pin Marker */}
                  <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-amber-400 border-4 border-black group-hover:scale-125 transition-transform shadow-gold-glow flex items-center justify-center" />

                  <div
                    onClick={() => handleCardClick(evt)}
                    className="glass p-5 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all flex flex-col md:flex-row justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(evtDay);
                            showToast(`Filtered to Day ${evtDay} (October ${evtDay + 10})`);
                          }}
                          className="text-[11px] font-bold text-black bg-amber-400 px-2 py-0.5 rounded-full hover:bg-amber-300 transition-colors"
                        >
                          Day {evtDay} • Oct {evtDay + 10}
                        </button>
                        <span className="text-xs text-cream/70 font-semibold">
                          ⏰ {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white/80">
                          {evt.category}
                        </span>
                        {evt.is_featured && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-black">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-cream hover:text-amber-300 transition-colors">
                        {evt.title}
                      </h4>
                      {evt.title_kn && (
                        <p className="text-xs text-amber-400/80 font-kannada">{evt.title_kn}</p>
                      )}
                      <p className="text-xs text-cream/70 line-clamp-2">{evt.description}</p>
                      <p className="text-xs text-amber-200/90 pt-1 font-medium">
                        📍 {evt.venue_name} •{' '}
                        <span className="font-bold text-amber-300">
                          {evt.is_free ? 'Free Public Entry' : `₹${evt.ticket_price}`}
                        </span>
                      </p>
                    </div>

                    <div className="flex md:flex-col justify-end gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(evt);
                          setBookingEvent(evt);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black hover:brightness-110 active:scale-95 transition-all shadow-gold-glow flex items-center justify-center gap-1"
                      >
                        {evt.is_free ? '🎟️ Free Pass' : `💳 Book ₹${evt.ticket_price}`}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(evt);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold text-center"
                      >
                        Details
                      </button>
                      <a
                        href={getGoogleCalendarUrl(evt)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cream/80 text-xs font-semibold text-center"
                      >
                        📅 Cal
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedEvent(String(evt.id));
                        }}
                        className={`p-2 rounded-xl border text-xs transition-all ${
                          isSaved
                            ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {isSaved ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. EVENT DETAILS DIALOG MODAL                            */}
      {/* ======================================================== */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-dark p-6 md:p-8 rounded-3xl border-2 border-amber-400/50 max-w-2xl w-full shadow-royal max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {selectedEventModal.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
                  Day {getEventDayNumber(selectedEventModal)} • Oct {getEventDayNumber(selectedEventModal) + 10}
                </span>
                {selectedEventModal.is_featured && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    ⭐ Festival Highlight
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-cream mb-1 leading-snug">
              {selectedEventModal.title}
            </h3>
            {selectedEventModal.title_kn && (
              <p className="text-sm md:text-base text-amber-300 font-kannada font-semibold mb-4">
                {selectedEventModal.title_kn}
              </p>
            )}

            <p className="text-xs md:text-sm text-cream/80 leading-relaxed mb-6">
              {selectedEventModal.description}
            </p>

            {/* Structured Event Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-cream/80 mb-6">
              <div>
                <span className="text-white/50 block text-[10px] uppercase font-bold mb-0.5">
                  📍 Venue Location
                </span>
                <span className="font-bold text-amber-200">
                  {selectedEventModal.venue_name || 'Mysuru Venue'}
                </span>
                {selectedEventModal.address && (
                  <p className="text-[11px] text-cream/60 mt-0.5">{selectedEventModal.address}</p>
                )}
              </div>

              <div>
                <span className="text-white/50 block text-[10px] uppercase font-bold mb-0.5">
                  🎟️ Admission & Entry
                </span>
                <span className="font-bold text-amber-300 text-sm">
                  {selectedEventModal.is_free
                    ? 'Free Public Entry'
                    : `₹${selectedEventModal.ticket_price} per person`}
                </span>
              </div>

              <div>
                <span className="text-white/50 block text-[10px] uppercase font-bold mb-0.5">
                  🗓️ Scheduled Date
                </span>
                <span className="font-semibold text-cream">
                  {new Date(selectedEventModal.start_datetime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div>
                <span className="text-white/50 block text-[10px] uppercase font-bold mb-0.5">
                  ⏰ Timing
                </span>
                <span className="font-semibold text-cream">
                  {new Date(selectedEventModal.start_datetime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(selectedEventModal.end_datetime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Primary Get Pass / Book Ticket Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setBookingEvent(selectedEventModal);
                  setSelectedEventModal(null);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-black font-black text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-gold-glow flex items-center justify-center gap-2 border border-amber-300"
              >
                <span>
                  {selectedEventModal.is_free
                    ? '🎫 Get Official Govt Free Pass (Slide to Confirm)'
                    : `💳 Book Verified Ticket • ₹${selectedEventModal.ticket_price}`}
                </span>
              </button>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <a
                href={getGoogleCalendarUrl(selectedEventModal)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 transition-all shadow-gold-glow text-center flex items-center justify-center gap-1.5"
              >
                <span>📅 Add to Google Calendar</span>
              </a>

              <button
                onClick={() => handleAddToCalendar(selectedEventModal)}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold border border-white/20 transition-all flex items-center gap-1"
              >
                <span>📥 Download .ics</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  (selectedEventModal.venue_name || 'Mysuru') + ' Mysuru Karnataka'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold border border-white/20 transition-all flex items-center gap-1"
              >
                <span>🗺️ Get Directions</span>
              </a>

              <button
                onClick={() => {
                  toggleSavedEvent(String(selectedEventModal.id));
                  showToast(
                    savedEvents.includes(String(selectedEventModal.id))
                      ? 'Removed from saved schedule'
                      : '❤️ Saved to your schedule!'
                  );
                }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  savedEvents.includes(String(selectedEventModal.id))
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                    : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                }`}
              >
                {savedEvents.includes(String(selectedEventModal.id)) ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MY SAVED ITINERARY DRAWER MODAL                       */}
      {/* ======================================================== */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-dark p-6 md:p-8 rounded-3xl border-2 border-rose-400/40 max-w-2xl w-full shadow-royal max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-rose-400">
                  Personal Festival Schedule
                </span>
                <h3 className="text-xl font-bold text-cream">
                  My Saved Dasara Events ({savedEvents.length})
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {events
                .filter((e) => savedEvents.includes(String(e.id)))
                .map((e) => (
                  <div
                    key={e.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center gap-3"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-cream">{e.title}</h5>
                      <p className="text-xs text-amber-300/80">
                        📍 {e.venue_name} • 🗓️{' '}
                        {new Date(e.start_datetime).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(e.start_datetime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSavedEvent(String(e.id))}
                      className="text-xs text-rose-300 hover:text-rose-400 px-2 py-1 rounded bg-rose-500/10 border border-rose-400/20 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExportFullSchedule}
                className="flex-1 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 shadow-gold-glow flex items-center justify-center gap-2"
              >
                <span>📥 Download Consolidated .ics</span>
              </button>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. EVENT BOOKING & GOVT PASS MODAL                       */}
      {/* ======================================================== */}
      {bookingEvent && (
        <EventBookingModal
          event={bookingEvent}
          onClose={() => setBookingEvent(null)}
        />
      )}
    </div>
  );
}
