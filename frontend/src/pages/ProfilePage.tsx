import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { eventsAPI } from '@/services/api';
import { Link } from 'react-router-dom';
import { audioManager } from '@/audio/audioManager';
import { jsPDF } from 'jspdf';
import { COMPLETE_DASARA_EVENTS } from '@/pages/EventsPage';

// Royal Mysore Avatar Options
const ROYAL_AVATARS = [
  { id: 'maharaja', name: 'Royal Maharaja', icon: '👑', role: 'Wadiyar Royal Patron', color: 'from-amber-400 to-amber-600' },
  { id: 'arjuna', name: 'Elephant Arjuna', icon: '🐘', role: 'Legendary Lead Tusker', color: 'from-yellow-500 to-amber-700' },
  { id: 'chamundi', name: 'Chamundi Devotee', icon: '🪔', role: 'Hilltop Pilgrim', color: 'from-orange-500 to-red-600' },
  { id: 'palace-guard', name: 'Durbar Guard', icon: '🛡️', role: 'Royal Amba Vilas Guard', color: 'from-purple-600 to-indigo-800' },
  { id: 'artist', name: 'Carnatic Maestro', icon: '🎵', role: 'Cultural Sabhas Artist', color: 'from-cyan-500 to-blue-700' },
  { id: 'kushti', name: 'Garadi Wrestler', icon: '🤼', role: 'Traditional Kushti Champion', color: 'from-rose-500 to-red-700' },
  { id: 'gandaberunda', name: 'Royal Scholar', icon: '🦅', role: 'Heritage Historian', color: 'from-emerald-500 to-teal-700' },
  { id: 'visitor', name: 'Heritage Explorer', icon: '✨', role: 'Global Dasara Traveler', color: 'from-amber-300 to-yellow-500' },
];

// Highlight Events for Quick-Add when bookmarks are empty or for recommendation
const POPULAR_RECOMMENDED_EVENTS = [
  {
    id: '104',
    title: '100,000 Bulb Illumination Switch-on',
    titleKn: 'ಅರಮನೆ ಮತ್ತು ನಗರದ ದೀಪಾಲಂಕಾರ',
    category: 'cultural',
    venue: 'Mysore Palace Forecourt',
    time: 'Daily • 7:00 PM',
    badge: 'Must See',
    day: 'Day 1 (Oct 11)',
  },
  {
    id: '133',
    title: 'World-Famous Vijayadashami Jumboo Savari',
    titleKn: 'ವಿಶ್ವವಿಖ್ಯಾತ ಮೈಸೂರು ಜಂಬೂಸವಾರಿ',
    category: 'procession',
    venue: 'Mysore Palace to Bannimantap',
    time: 'Oct 20 • 2:00 PM',
    badge: 'Grand Finale',
    day: 'Day 10 (Oct 20)',
  },
  {
    id: '134',
    title: 'Torchlight Parade & Royal Aerobatics',
    titleKn: 'ಪಂಜಿನ ಕವಾಯತು ಹಾಗೂ ಸಾಹಸ ಪ್ರದರ್ಶನ',
    category: 'torchlight',
    venue: 'Bannimantap Parade Grounds',
    time: 'Oct 20 • 7:00 PM',
    badge: 'Spectacular',
    day: 'Day 10 (Oct 20)',
  },
  {
    id: '105',
    title: 'Glass House Dasara Flower Show',
    titleKn: 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕ್ ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ',
    category: 'flower',
    venue: 'Kuppanna Park (Nishad Bagh)',
    time: 'Daily • 9:00 AM - 9:30 PM',
    badge: '800k Flowers',
    day: 'Day 2 (Oct 12)',
  },
  {
    id: '113',
    title: 'Dasara Aahara Mela (Royal Food Festival)',
    titleKn: 'ದಸರಾ ಆಹಾರ ಮೇಳ',
    category: 'food',
    venue: 'Scouts and Guides Grounds',
    time: 'Daily • 11:00 AM - 10:00 PM',
    badge: '100+ Cuisines',
    day: 'Day 4 (Oct 14)',
  },
  {
    id: '121',
    title: 'Yuva Dasara Mega Musical Concerts',
    titleKn: 'ಯುವ ದಸರಾ ಸಂಗೀತ ಸಂಜೆ',
    category: 'yuva',
    venue: 'Maharaja College Grounds',
    time: 'Evening • 6:30 PM',
    badge: 'Star Performers',
    day: 'Day 6 (Oct 16)',
  },
];

// Verified Heritage Stamps Preview
const HERITAGE_STAMPS_PREVIEW = [
  { id: 's1', name: 'Amba Vilas Palace', nameKn: 'ಮೈಸೂರು ಅರಮನೆ', icon: '🏰', points: 50, earned: true },
  { id: 's2', name: 'Chamundeshwari Sanctum', nameKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ', icon: '⛰️', points: 50, earned: true },
  { id: 's3', name: 'St. Philomena Cathedral', nameKn: 'ಸೈಂಟ್ ಫಿಲೋಮಿನಾ ಚರ್ಚ್', icon: '⛪', points: 40, earned: true },
  { id: 's4', name: 'Jaganmohan Art Gallery', nameKn: 'ಜಗನ್ಮೋಹನ ಅರಮನೆ', icon: '🎨', points: 45, earned: true },
  { id: 's5', name: 'Devaraja Royal Market', nameKn: 'ದೇವರಾಜ ಮಾರುಕಟ್ಟೆ', icon: '🌺', points: 30, earned: true },
  { id: 's6', name: 'Brindavan Fountains', nameKn: 'ಬೃಂದಾವನ ಗಾರ್ಡನ್ಸ್', icon: '⛲', points: 40, earned: false },
  { id: 's7', name: 'Railway Heritage Museum', nameKn: 'ರೈಲ್ವೆ ವಸ್ತುಸಂಗ್ರಹಾಲಯ', icon: '🚂', points: 35, earned: false },
  { id: 's8', name: 'Nandi Bull Monolith', nameKn: 'ದೊಡ್ಡ ನಂದಿ ವಿಗ್ರಹ', icon: '🐂', points: 35, earned: false },
];

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { savedEvents, toggleSavedEvent, language, setLanguage } = useAppStore();

  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'itinerary' | 'passport' | 'settings'>('bookmarks');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Custom User Profile State (Persisted in localStorage)
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('dasara_profile_name') || user?.name || 'Srujan G M';
  });
  const [profileEmail, setProfileEmail] = useState(() => {
    return localStorage.getItem('dasara_profile_email') || user?.email || 'srujan@mysoredasara2026.gov.in';
  });
  const [profileCity, setProfileCity] = useState(() => {
    return localStorage.getItem('dasara_profile_city') || 'Mysuru, Karnataka';
  });
  const [profileAvatar, setProfileAvatar] = useState(() => {
    return localStorage.getItem('dasara_profile_avatar') || 'maharaja';
  });

  // Modals & Feedback
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load events from backend or fallback to COMPLETE_DASARA_EVENTS
  useEffect(() => {
    eventsAPI
      .getEvents()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        if (data.length > 0) {
          setAllEvents(data);
        } else {
          setAllEvents(COMPLETE_DASARA_EVENTS);
        }
      })
      .catch(() => {
        setAllEvents(COMPLETE_DASARA_EVENTS);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Find saved event objects
  const savedEventDetails = useMemo(() => {
    const list = allEvents.filter((e) => savedEvents.includes(String(e.id)));
    if (selectedCategory === 'all') return list;
    return list.filter((e) => e.category === selectedCategory);
  }, [allEvents, savedEvents, selectedCategory]);

  // Current active avatar metadata
  const currentAvatar = useMemo(() => {
    return ROYAL_AVATARS.find((a) => a.id === profileAvatar) || ROYAL_AVATARS[0];
  }, [profileAvatar]);

  // Save Profile Edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dasara_profile_name', profileName);
    localStorage.setItem('dasara_profile_email', profileEmail);
    localStorage.setItem('dasara_profile_city', profileCity);
    setIsEditingProfile(false);
    audioManager.playClickSound();
    showToast('✓ Profile updated successfully!');
  };

  // Select Avatar
  const handleSelectAvatar = (avatarId: string) => {
    setProfileAvatar(avatarId);
    localStorage.setItem('dasara_profile_avatar', avatarId);
    setIsAvatarModalOpen(false);
    audioManager.playRoyalFanfare();
    showToast(`✓ Switched avatar to ${ROYAL_AVATARS.find((a) => a.id === avatarId)?.name}!`);
  };

  // Quick Bookmark Action
  const handleQuickAddEvent = (id: string, title: string) => {
    toggleSavedEvent(id);
    audioManager.playBells();
    showToast(`✓ Added "${title}" to your saved experiences!`);
  };

  // Clear All Bookmarks
  const handleClearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all saved events from your itinerary?')) {
      savedEvents.forEach((id) => toggleSavedEvent(id));
      audioManager.playClickSound();
      showToast('✓ All bookmarked events cleared.');
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (evt: any) => {
    const title = encodeURIComponent(evt.title || 'Mysuru Dasara Event');
    const details = encodeURIComponent(evt.description || 'Mysuru Dasara 2026 Festival Event');
    const location = encodeURIComponent(evt.venue_name || 'Mysuru, Karnataka');

    // Default 2-hour duration if end date is missing
    const start = evt.start_datetime ? new Date(evt.start_datetime) : new Date('2026-10-11T19:00:00+05:30');
    const end = evt.end_datetime ? new Date(evt.end_datetime) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const formatGDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${formatGDate(start)}/${formatGDate(end)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Export iCal (.ics) for Bookmarked Itinerary
  const exportICalendar = () => {
    if (savedEventDetails.length === 0) {
      showToast('⚠️ No events in your itinerary to export.');
      return;
    }

    audioManager.playClickSound();
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mysuru Dasara 2026//Official Festival Itinerary//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    savedEventDetails.forEach((evt) => {
      const start = evt.start_datetime ? new Date(evt.start_datetime) : new Date();
      const end = evt.end_datetime ? new Date(evt.end_datetime) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const formatIcsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:dasara-2026-${evt.id}@karnatakatourism.gov.in`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${formatIcsDate(start)}`,
        `DTEND:${formatIcsDate(end)}`,
        `SUMMARY:${evt.title}`,
        `DESCRIPTION:${evt.description || 'Mysuru Dasara 2026 Event'}`,
        `LOCATION:${evt.venue_name || 'Mysuru'}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Mysuru_Dasara_2026_Itinerary_${profileName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('✓ iCal (.ics) schedule downloaded! Compatible with Google & Apple Calendar.');
  };

  // Export Itinerary to PDF via jsPDF
  const exportItineraryPDF = () => {
    if (savedEventDetails.length === 0) {
      showToast('⚠️ Bookmark at least one event to export your itinerary.');
      return;
    }

    audioManager.playRoyalFanfare();
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;

    // Midnight Royal Blue Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 45, 'F');

    // Double Gold Header Border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.2);
    doc.line(10, 44, pageW - 10, 44);

    doc.setTextColor(255, 215, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('MYSURU DASARA 2026 • OFFICIAL ITINERARY PASS', pageW / 2, 18, { align: 'center' });

    doc.setTextColor(220, 225, 240);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Government of Karnataka • Department of Tourism', pageW / 2, 24, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`CONFIRMED VISITOR ITINERARY FOR: ${profileName.toUpperCase()}`, pageW / 2, 34, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(212, 175, 55);
    doc.text(`Passport ID: #MYS-2026-VIP   •   ${savedEventDetails.length} Scheduled Events`, pageW / 2, 40, {
      align: 'center',
    });

    // Events List
    let currentY = 56;
    savedEventDetails.forEach((evt, idx) => {
      if (currentY > pageH - 30) {
        doc.addPage();
        currentY = 20;
      }

      // Event Card Background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(12, currentY, pageW - 24, 22, 2, 2, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(12, currentY, pageW - 24, 22, 2, 2);

      // Left Accent Strip
      doc.setFillColor(212, 175, 55);
      doc.rect(12, currentY, 3, 22, 'F');

      // Event Number & Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${evt.title}`, 18, currentY + 6);

      // Kannada Title if available
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const timeStr = evt.start_datetime ? new Date(evt.start_datetime).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) : 'Festival Schedule';

      doc.text(`🕒 Time: ${timeStr}   |   📍 Venue: ${evt.venue_name || 'Mysuru'}`, 18, currentY + 12);
      doc.text(`Category: ${String(evt.category).toUpperCase()}   |   Status: ${evt.is_free ? 'Free Entry' : 'Ticketed Event'}`, 18, currentY + 17);

      currentY += 26;
    });

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Authentic Mysore Dasara 2026 Official Visitor Credential • Carry this pass or present digitally at venue gates.',
      pageW / 2,
      pageH - 10,
      { align: 'center' }
    );

    doc.save(`Mysuru_Dasara_Itinerary_${profileName.replace(/\s+/g, '_')}.pdf`);
    showToast('✓ Official PDF Itinerary downloaded successfully!');
  };

  // WhatsApp Share Itinerary
  const shareItineraryWhatsApp = () => {
    if (savedEventDetails.length === 0) {
      showToast('⚠️ No events in your itinerary to share.');
      return;
    }

    audioManager.playClickSound();
    const eventLines = savedEventDetails
      .slice(0, 5)
      .map((e, i) => `${i + 1}. *${e.title}* (${e.venue_name || 'Mysuru'})`)
      .join('\n');

    const message = `🐘 *My Mysuru Dasara 2026 Itinerary*:\n\n${eventLines}\n\n✨ Join me at the grand 416th royal festival in Mysuru! #MysuruDasara2026`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-20 pb-28 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Visitor Profile & Saved Experiences"
        titleKn="ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಉಳಿಸಿದ ಕಾರ್ಯಕ್ರಮಗಳು"
        subtitle="Manage your personalized festival itinerary, royal passport points, custom Mysore avatar, and export schedules for Mysuru Dasara 2026."
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce border border-amber-300">
          <span className="text-base">🎖️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================================================================= */}
        {/* LEFT COLUMN: VISITOR ROYAL IDENTITY CARD (4 COLS) */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-dark p-6 rounded-3xl border-2 border-amber-400/40 shadow-royal relative overflow-hidden">
            {/* Background Royal Watermark */}
            <div className="absolute -top-10 -right-10 text-9xl text-amber-400/5 select-none pointer-events-none">
              {currentAvatar.icon}
            </div>

            {/* Avatar & Badges */}
            <div className="relative text-center">
              <div className="relative inline-block mx-auto mb-3">
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-tr ${currentAvatar.color} flex items-center justify-center text-4xl shadow-gold-glow border-2 border-amber-300 transition-transform duration-300 hover:scale-105`}
                >
                  <span>{currentAvatar.icon}</span>
                </div>
                {/* Change Avatar Button */}
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 border border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-black transition-all shadow-lg text-xs cursor-pointer"
                  title="Change Royal Avatar"
                >
                  ✏️
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mb-1">
                <h3 className="text-xl font-black text-white tracking-wide">{profileName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-[10px] font-black text-amber-300 uppercase">
                  VIP
                </span>
              </div>

              <p className="text-xs text-amber-400 font-bold mb-1">{currentAvatar.role}</p>
              <p className="text-[11px] text-slate-400">{profileEmail}</p>
              <p className="text-[11px] text-slate-400">📍 {profileCity}</p>
            </div>

            {/* Passport Tier Progress */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">Passport Tier:</span>
                <span className="text-amber-400 font-black flex items-center gap-1">
                  <span>👑</span>
                  <span>Gold Explorer</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Progress to Platinum Legend:</span>
                  <span className="text-amber-300 font-mono font-bold">225 / 500 Pts</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-gold-glow transition-all duration-500"
                    style={{ width: '45%' }}
                  />
                </div>
              </div>

              {/* Quick Stat Counter Cards */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10 text-center">
                  <p className="text-lg font-mono font-black text-amber-300">{savedEvents.length}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Saved Events</p>
                </div>
                <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10 text-center">
                  <p className="text-lg font-mono font-black text-emerald-400">5 / 20</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Heritage Stamps</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setIsEditingProfile(true)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>✏️</span>
                <span>Edit Profile Info</span>
              </button>

              <Link
                to="/heritage-passport"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black uppercase tracking-wider hover:from-amber-300 hover:to-amber-400 transition-all shadow-gold-glow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📜</span>
                <span>View Digital Passport</span>
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    showToast('✓ Logged out successfully.');
                  }}
                  className="w-full py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-600/30 transition-all cursor-pointer"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block text-center w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 transition-all"
                >
                  Sign In to Sync Devices
                </Link>
              )}
            </div>
          </div>

          {/* Quick Festival Highlights Mini Widget */}
          <div className="glass-dark p-5 rounded-3xl border border-amber-400/20 shadow-royal space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌟 Official Festival Hotline</span>
            </h4>
            <div className="text-xs text-slate-300 space-y-1.5">
              <p>📞 Tourist Helpline: <strong className="text-white">1800-425-2425</strong></p>
              <p>🚨 Police Emergency: <strong className="text-white">112</strong></p>
              <p>🚑 Medical Response: <strong className="text-white">108</strong></p>
              <p>🏛️ Palace Enquiry: <strong className="text-white">0821-2421051</strong></p>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: TABS & SAVED EXPERIENCES DASHBOARD (8 COLS) */}
        {/* ================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation Bar */}
          <div className="glass-dark p-2 rounded-2xl border border-amber-400/30 shadow-royal flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setActiveTab('bookmarks');
                  audioManager.playClickSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'bookmarks'
                    ? 'bg-amber-400 text-black shadow-gold-glow'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>❤️</span>
                <span>Saved Events ({savedEvents.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('itinerary');
                  audioManager.playClickSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'itinerary'
                    ? 'bg-amber-400 text-black shadow-gold-glow'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🗓️</span>
                <span>Day-by-Day Itinerary</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('passport');
                  audioManager.playClickSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'passport'
                    ? 'bg-amber-400 text-black shadow-gold-glow'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🎖️</span>
                <span>Stamps Showcase</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  audioManager.playClickSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-amber-400 text-black shadow-gold-glow'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>⚙️</span>
                <span>Preferences</span>
              </button>
            </div>

            {/* Itinerary Quick Export Dropdown / Buttons */}
            {savedEvents.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={exportItineraryPDF}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Download printable PDF itinerary"
                >
                  <span>📄</span>
                  <span>PDF</span>
                </button>
                <button
                  onClick={exportICalendar}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Export to Apple or Google Calendar"
                >
                  <span>📅</span>
                  <span>iCal</span>
                </button>
                <button
                  onClick={shareItineraryWhatsApp}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>📲</span>
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* TAB 1: SAVED EVENTS & BOOKMARKS */}
          {/* =============================================================== */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Filter Pills & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {['all', 'cultural', 'procession', 'exhibition', 'flower', 'torchlight'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        audioManager.playClickSound();
                      }}
                      className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-400 text-black shadow-gold-glow'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/events"
                    className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Browse All 37 Events →</span>
                  </Link>

                  {savedEvents.length > 0 && (
                    <button
                      onClick={handleClearAllBookmarks}
                      className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Saved Events List */}
              {savedEventDetails.length === 0 ? (
                <div className="glass-dark p-8 sm:p-12 rounded-3xl border border-white/10 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                    🤍
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">No bookmarked events yet</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      You haven't bookmarked any festival shows yet. Pick from the curated Mysore highlights below to build your personal festival itinerary with one tap!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {savedEventDetails.map((evt) => (
                    <div
                      key={evt.id}
                      className="glass-dark p-4 sm:p-5 rounded-2xl border border-amber-400/25 hover:border-amber-400/60 shadow-royal transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            {evt.category}
                          </span>
                          {evt.is_free ? (
                            <span className="text-[10px] font-bold text-emerald-400">✓ Free Entry</span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-300">🎟️ ₹{evt.ticket_price || 'Ticketed'}</span>
                          )}
                        </div>

                        <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                          {evt.title}
                        </h4>

                        {evt.title_kn && (
                          <p className="text-xs text-amber-400/80 font-kannada">{evt.title_kn}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                          <span>📍 {evt.venue_name || 'Mysuru Venue'}</span>
                          {evt.start_datetime && (
                            <span>
                              🕒 {new Date(evt.start_datetime).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <a
                          href={getGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1 cursor-pointer"
                          title="Add to Google Calendar"
                        >
                          <span>📅</span>
                          <span>Calendar</span>
                        </a>

                        <button
                          onClick={() => {
                            toggleSavedEvent(String(evt.id));
                            audioManager.playClickSound();
                            showToast(`Removed "${evt.title}" from saved events.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>✕</span>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Curated Recommendations for One-Tap Quick Add */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⭐ Popular Dasara Festival Highlights</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Tap any highlight to instantly add it to your personalized itinerary:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {POPULAR_RECOMMENDED_EVENTS.map((rec) => {
                    const isAlreadySaved = savedEvents.includes(rec.id);
                    return (
                      <div
                        key={rec.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-2.5"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-[10px] font-black text-amber-300 uppercase">
                              {rec.badge}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{rec.day}</span>
                          </div>
                          <h5 className="text-xs font-bold text-white mt-1.5">{rec.title}</h5>
                          <p className="text-[10px] text-amber-400/80 font-kannada">{rec.titleKn}</p>
                          <p className="text-[11px] text-slate-400 mt-1">📍 {rec.venue}</p>
                        </div>

                        <button
                          onClick={() => handleQuickAddEvent(rec.id, rec.title)}
                          className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isAlreadySaved
                              ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300'
                              : 'bg-amber-400 hover:bg-amber-300 text-black shadow-gold-glow'
                          }`}
                        >
                          <span>{isAlreadySaved ? '✓ Added to Itinerary' : '+ Save to Itinerary'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 2: DAY-BY-DAY CHRONOLOGICAL ITINERARY */}
          {/* =============================================================== */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white">Your Chronological Schedule</h4>
                  <p className="text-xs text-slate-400">
                    Events organized by festival dates across the 10 Days of Dasara.
                  </p>
                </div>
                <button
                  onClick={exportItineraryPDF}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black shadow-gold-glow hover:from-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>📥</span>
                  <span>Print / PDF Pass</span>
                </button>
              </div>

              {savedEventDetails.length === 0 ? (
                <div className="glass-dark p-8 rounded-3xl border border-white/10 text-center">
                  <p className="text-sm font-bold text-white">No schedule available yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Bookmark events to generate your chronological itinerary.</p>
                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold"
                  >
                    Browse Highlights
                  </button>
                </div>
              ) : (
                <div className="relative border-l-2 border-amber-400/40 ml-4 space-y-6 pl-6">
                  {savedEventDetails.map((evt, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 shadow-gold-glow group-hover:scale-125 transition-transform" />

                      <div className="glass-dark p-4 rounded-2xl border border-amber-400/20 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono text-amber-300 font-bold">
                            {evt.start_datetime
                              ? new Date(evt.start_datetime).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Festival Event'}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {evt.category}
                          </span>
                        </div>

                        <h5 className="text-sm font-black text-white">{evt.title}</h5>
                        <p className="text-xs text-slate-300">📍 {evt.venue_name || 'Mysuru Venue'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 3: HERITAGE STAMPS & PASSPORT SHOWCASE */}
          {/* =============================================================== */}
          {activeTab === 'passport' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white">Collected Landmark Stamps</h4>
                  <p className="text-xs text-slate-400">
                    Visit Mysore's heritage monuments and verify your check-ins for official certificate merit points.
                  </p>
                </div>
                <Link
                  to="/heritage-passport"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-black shadow-gold-glow hover:bg-amber-300 transition-all flex items-center gap-1.5"
                >
                  <span>📜 Full Passport & Quiz →</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HERITAGE_STAMPS_PREVIEW.map((st) => (
                  <div
                    key={st.id}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      st.earned
                        ? 'bg-amber-400/10 border-amber-400/50 shadow-royal'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <span className="text-3xl block mb-1">{st.icon}</span>
                    <h5 className="text-xs font-bold text-white truncate">{st.name}</h5>
                    <p className="text-[10px] text-amber-300/80 font-kannada truncate">{st.nameKn}</p>
                    <div className="mt-2 text-[10px] font-mono font-bold">
                      {st.earned ? (
                        <span className="text-emerald-400">✓ Verified (+{st.points} Pts)</span>
                      ) : (
                        <span className="text-slate-400">🔒 Not Checked-in</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 4: PREFERENCES & FESTIVAL SETTINGS */}
          {/* =============================================================== */}
          {activeTab === 'settings' && (
            <div className="glass-dark p-6 rounded-3xl border border-amber-400/30 shadow-royal space-y-6 animate-fadeIn">
              <h4 className="text-base font-black text-white">Festival Preferences & Accessibility</h4>

              {/* Language Selector */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs font-bold text-white">Festival Interface Language</p>
                  <p className="text-[11px] text-slate-400">Switch between English and Kannada (ಕನ್ನಡ)</p>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      audioManager.playClickSound();
                      showToast('Language set to English');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      language === 'en' ? 'bg-amber-400 text-black' : 'text-slate-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('kn');
                      audioManager.playClickSound();
                      showToast('ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಹೊಂದಿಸಲಾಗಿದೆ');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      language === 'kn' ? 'bg-amber-400 text-black font-kannada' : 'text-slate-300 font-kannada'
                    }`}
                  >
                    ಕನ್ನಡ
                  </button>
                </div>
              </div>

              {/* Audio Soundscapes Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <p className="text-xs font-bold text-white">Royal Audio Soundscapes</p>
                  <p className="text-[11px] text-slate-400">Amba Vilas Chimes & Nadaswaram background resonance</p>
                </div>
                <button
                  onClick={() => {
                    audioManager.toggleMute();
                    showToast(audioManager.getIsMuted() ? '🔇 Audio muted' : '🔊 Audio unmuted');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  {audioManager.getIsMuted() ? '🔇 Muted' : '🔊 Unmuted'}
                </button>
              </div>

              {/* Clear Stored Data */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-rose-300">Reset Local Festival Storage</p>
                  <p className="text-[11px] text-slate-400">Clears offline cached preferences and reset bookmarks</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Reset local preferences and bookmarks?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600/30 border border-rose-500/50 text-rose-200 text-xs font-bold hover:bg-rose-600/40"
                >
                  Reset Cache
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL: EDIT VISITOR PROFILE */}
      {/* =================================================================== */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white">Edit Visitor Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email / Phone</label>
                <input
                  type="text"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City / Region</label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black uppercase shadow-gold-glow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: CHOOSE ROYAL AVATAR */}
      {/* =================================================================== */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                ROYAL IDENTITY
              </span>
              <h3 className="text-lg font-black text-white mt-1">Choose Your Dasara Avatar</h3>
              <p className="text-xs text-slate-300 mt-1">
                Select an authentic historical Mysore persona for your visitor credentials:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {ROYAL_AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(av.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    profileAvatar === av.id
                      ? 'bg-amber-400/20 border-amber-400 shadow-gold-glow scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-3xl block mb-1">{av.icon}</span>
                  <p className="text-xs font-bold text-white truncate">{av.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{av.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
