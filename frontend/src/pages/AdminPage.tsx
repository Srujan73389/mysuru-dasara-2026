import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { eventsAPI, venuesAPI, announcementsAPI } from '@/services/api';
import { COMPLETE_DASARA_EVENTS } from '@/pages/EventsPage';
import { audioManager } from '@/audio/audioManager';

// Seed Initial Venues with Real-Time Simulated Crowd Capacity
const INITIAL_VENUES = [
  {
    id: 1,
    name: 'Mysore Palace Forecourt',
    name_kn: 'ಮೈಸೂರು ಅರಮನೆ ಮುಂಭಾಗ',
    address: 'Sayyaji Rao Road, Agrahara, Mysuru',
    capacity: 50000,
    currentCrowd: 42000,
    status: 'high',
    gates: 'Gates 1 to 6 (North & South)',
  },
  {
    id: 2,
    name: 'Bannimantap Torchlight Grounds',
    name_kn: 'ಬನ್ನಿಮಂಟಪ ಪಂಜಿನ ಕವಾಯತು ಮೈದಾನ',
    address: 'Bannimantap Road, Mysuru',
    capacity: 35000,
    currentCrowd: 18500,
    status: 'moderate',
    gates: 'East & West VIP Enclosures',
  },
  {
    id: 3,
    name: 'Maharaja College Grounds (Yuva Dasara)',
    name_kn: 'ಮಹಾರಾಜ ಕಾಲೇಜು ಮೈದಾನ (ಯುವ ದಸರಾ)',
    address: 'JLB Road, Chamarajapuram, Mysuru',
    capacity: 40000,
    currentCrowd: 31000,
    status: 'high',
    gates: 'Main Campus Gates A & B',
  },
  {
    id: 4,
    name: 'Kuppanna Park (Nishad Bagh)',
    name_kn: 'ಕುಪ್ಪಣ್ಣ ಪಾರ್ಕ್ (ಫಲಪುಷ್ಪ ಪ್ರದರ್ಶನ)',
    address: 'Near Nazarbad Police Station, Mysuru',
    capacity: 25000,
    currentCrowd: 12000,
    status: 'normal',
    gates: 'Glass House Entry 1 & 2',
  },
  {
    id: 5,
    name: 'Dasara Exhibition Grounds (Doddakere)',
    name_kn: 'ದಸರಾ ವಸ್ತುಪ್ರದರ್ಶನ ಆವರಣ',
    address: 'Opposite Palace South Gate, Mysuru',
    capacity: 60000,
    currentCrowd: 28000,
    status: 'normal',
    gates: 'Main Entry Plaza & Exit Turnstiles',
  },
  {
    id: 6,
    name: 'Sri Chamundeshwari Temple Sanctum',
    name_kn: 'ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ಬೆಟ್ಟದ ಆವರಣ',
    address: 'Chamundi Hill Road, Mysuru',
    capacity: 20000,
    currentCrowd: 19100,
    status: 'critical',
    gates: 'Mahadwara Queue Complexes',
  },
  {
    id: 7,
    name: 'Scouts and Guides Grounds (Aahara Mela)',
    name_kn: 'ಭಾರತ್ ಸ್ಕೌಟ್ಸ್ ಅಂಡ್ ಗೈಡ್ಸ್ ಮೈದಾನ',
    address: 'Behind DC Office, Mysuru',
    capacity: 30000,
    currentCrowd: 16500,
    status: 'moderate',
    gates: 'Food Court Food Court Entrance',
  },
];

// Seed Initial Official Announcements / Safety Notices
const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Chamundi Hill Shuttle Priority Advisory',
    title_kn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟಕ್ಕೆ ಉಚಿತ ಬಸ್ ಸಂಚಾರ ವ್ಯವಸ್ಥೆ',
    category: 'transport',
    priority: 'info',
    content:
      'KSRTC special shuttle buses operating every 3 minutes from Lalitha Mahal Helipad. Private vehicles restricted beyond foothill checkposts.',
    timestamp: '10 Mins Ago',
    active: true,
  },
  {
    id: 2,
    title: 'High Pedestrian Surge at Palace South Gate (Varaha)',
    title_kn: 'ಅರಮನೆ ದಕ್ಷಿಣ ದ್ವಾರದಲ್ಲಿ ಜನದಟ್ಟಣೆ ಎಚ್ಚರಿಕೆ',
    category: 'crowd',
    priority: 'warning',
    content:
      'Visitors advised to divert towards North Gate (Balarama Gate) and East Gate for faster entry into the palace forecourt illumination.',
    timestamp: '25 Mins Ago',
    active: true,
  },
  {
    id: 3,
    title: 'Jamboo Savari Rehearsal Traffic Diversion',
    title_kn: 'ಜಂಬೂಸವಾರಿ ತಾಲೀಮು ಪ್ರಯುಕ್ತ ಸಂಚಾರ ಮಾರ್ಗ ಬದಲಾವಣೆ',
    category: 'traffic',
    priority: 'alert',
    content:
      'Sayyaji Rao Road corridor partially closed between 1:30 PM - 5:00 PM for elephant procession practice and drone safety inspection.',
    timestamp: '1 Hour Ago',
    active: true,
  },
];

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>(INITIAL_VENUES);
  const [announcements, setAnnouncements] = useState<any[]>(INITIAL_ANNOUNCEMENTS);
  const [activeTab, setActiveTab] = useState<'events' | 'venues' | 'announcements' | 'analytics' | 'protocols'>('events');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [admissionFilter, setAdmissionFilter] = useState('all');

  // New Event Form State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleKn, setNewTitleKn] = useState('');
  const [newCategory, setNewCategory] = useState('cultural');
  const [newVenue, setNewVenue] = useState('Mysore Palace Forecourt');
  const [isFree, setIsFree] = useState(true);
  const [ticketPrice, setTicketPrice] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-15T18:30');

  // New Notice Modal State
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeTitleKn, setNewNoticeTitleKn] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'info' | 'warning' | 'alert'>('info');

  // Live Palace Illumination Switch (Simulation)
  const [isPalaceIlluminated, setIsPalaceIlluminated] = useState(true);
  const [isHighAlertActive, setIsHighAlertActive] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch from APIs with rich fallbacks
  useEffect(() => {
    eventsAPI
      .getEvents()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        if (data.length > 0) {
          setEvents(data);
        } else {
          setEvents(COMPLETE_DASARA_EVENTS);
        }
      })
      .catch(() => {
        setEvents(COMPLETE_DASARA_EVENTS);
      });

    venuesAPI
      .getVenues()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        if (data.length > 0) {
          setVenues(data);
        }
      })
      .catch(() => {});

    announcementsAPI
      .getAnnouncements()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        if (data.length > 0) {
          setAnnouncements(data);
        }
      })
      .catch(() => {});
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSearch =
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.title_kn?.includes(searchQuery) ||
        e.venue_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
      const matchAdmission =
        admissionFilter === 'all' ||
        (admissionFilter === 'free' && e.is_free) ||
        (admissionFilter === 'paid' && !e.is_free);

      return matchSearch && matchCat && matchAdmission;
    });
  }, [events, searchQuery, categoryFilter, admissionFilter]);

  // Create Event Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      title: newTitle,
      title_kn: newTitleKn,
      category: newCategory,
      venue_name: newVenue,
      is_free: isFree,
      ticket_price: isFree ? null : ticketPrice || '100.00',
      start_datetime: new Date(eventDate).toISOString(),
      status: 'upcoming',
      is_featured: true,
    };

    setEvents([created, ...events]);
    setShowEventModal(false);
    setNewTitle('');
    setNewTitleKn('');
    setTicketPrice('');
    audioManager.playRoyalFanfare();
    showToast(`✓ Event "${created.title}" published to live festival schedule!`);
  };

  // Create Safety Notice Handler
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const notice = {
      id: Date.now(),
      title: newNoticeTitle,
      title_kn: newNoticeTitleKn,
      content: newNoticeContent,
      category: 'public-safety',
      priority: newNoticePriority,
      timestamp: 'Just Now',
      active: true,
    };

    setAnnouncements([notice, ...announcements]);
    setShowNoticeModal(false);
    setNewNoticeTitle('');
    setNewNoticeTitleKn('');
    setNewNoticeContent('');
    audioManager.playBells();
    showToast('🚨 Public safety broadcast transmitted to all tourist devices!');
  };

  // Delete Event Handler
  const handleDeleteEvent = (id: any, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the festival schedule?`)) {
      setEvents(events.filter((e) => e.id !== id));
      audioManager.playClickSound();
      showToast(`Removed "${title}" from schedule.`);
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = (id: any) => {
    setEvents(
      events.map((e) => {
        if (e.id === id) {
          return { ...e, is_featured: !e.is_featured };
        }
        return e;
      })
    );
    audioManager.playClickSound();
    showToast('✓ Event priority ranking updated.');
  };

  // Toggle Palace Illumination
  const handleToggleIllumination = () => {
    const next = !isPalaceIlluminated;
    setIsPalaceIlluminated(next);
    audioManager.playRoyalFanfare();
    showToast(
      next
        ? '💡 Amba Vilas 100,000 Incandescent Bulbs ACTIVATED!'
        : '🌙 Palace Illumination switched to STANDBY mode.'
    );
  };

  // Toggle High Alert Protocol
  const handleToggleHighAlert = () => {
    const next = !isHighAlertActive;
    setIsHighAlertActive(next);
    audioManager.playBells();
    showToast(
      next
        ? '🚨 High-Alert Crowd Management Protocol ACTIVATED: 250 Additional Police & KSRTC Shuttles Dispatched.'
        : '✓ High-Alert Protocol stood down to standard operations.'
    );
  };

  // Export Events to CSV
  const handleExportCSV = () => {
    audioManager.playClickSound();
    const headers = ['ID', 'Title', 'Title (Kannada)', 'Category', 'Venue', 'Admission', 'Price', 'Date'];
    const rows = events.map((e) => [
      e.id,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${(e.title_kn || '').replace(/"/g, '""')}"`,
      e.category || 'cultural',
      `"${(e.venue_name || 'Mysuru').replace(/"/g, '""')}"`,
      e.is_free ? 'Free' : 'Ticketed',
      e.ticket_price || '0',
      e.start_datetime || '2026-10-15',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mysuru_Dasara_2026_Schedule_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Festival schedule exported as CSV!');
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Admin Control & Festival Management"
        titleKn="ದಸರಾ ಆಡಳಿತ ನಿಯಂತ್ರಣ ಫಲಕ"
        subtitle="Live Command Center: Monitor real-time venue crowd density, publish verified programmes, broadcast emergency safety advisories, and toggle royal festival protocols."
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce border border-amber-300">
          <span className="text-base">⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Real-Time System Status Bar */}
      <div className="glass-dark p-3.5 rounded-2xl border border-amber-400/30 shadow-royal mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Central Command Active
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-300">
            Festival Day: <strong className="text-amber-300">Day 5 (Aahara Mela & Carnatic Sabhas)</strong>
          </span>
          <span className="hidden sm:inline text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-300">
            Est. Footfall Today: <strong className="text-amber-300">142,500+ Visitors</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Palace Illumination Simulation Switch */}
          <button
            onClick={handleToggleIllumination}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              isPalaceIlluminated
                ? 'bg-amber-400 text-black border-amber-300 shadow-gold-glow'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
            title="Toggle Palace 100,000 bulbs simulation"
          >
            <span>💡</span>
            <span>Palace Lights: {isPalaceIlluminated ? 'ON' : 'OFF'}</span>
          </button>

          {/* High Alert Protocol Toggle */}
          <button
            onClick={handleToggleHighAlert}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              isHighAlertActive
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg animate-pulse'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            <span>🚨</span>
            <span>{isHighAlertActive ? 'High Alert Active' : 'Normal Protocol'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Published Events',
            val: events.length,
            icon: '🗓️',
            sub: '37 Official • 3 Added',
            color: 'text-amber-300',
          },
          {
            label: 'Active Venues',
            val: venues.length,
            icon: '🎪',
            sub: '2 High Capacity',
            color: 'text-cyan-300',
          },
          {
            label: 'Safety Broadcasts',
            val: announcements.length,
            icon: '📢',
            sub: 'Transmitted to App',
            color: 'text-rose-400',
          },
          {
            label: 'AI Inquiries Handled',
            val: '1,420+',
            icon: '🤖',
            sub: '99.4% Accuracy',
            color: 'text-emerald-400',
          },
        ].map((s, idx) => (
          <div
            key={idx}
            className="glass-dark p-4 rounded-2xl border border-amber-400/20 shadow-royal hover:border-amber-400/50 transition-all text-center group"
          >
            <span className="text-3xl mb-1 block group-hover:scale-110 transition-transform">
              {s.icon}
            </span>
            <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
            <p className="text-[11px] font-bold text-white uppercase tracking-wider mt-0.5">{s.label}</p>
            <p className="text-[10px] text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="glass-dark p-1 rounded-2xl border border-amber-400/30 shadow-royal flex flex-wrap gap-1 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('events');
              audioManager.playClickSound();
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'bg-amber-400 text-black shadow-gold-glow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🗓️</span>
            <span>Events ({events.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('venues');
              audioManager.playClickSound();
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'venues'
                ? 'bg-amber-400 text-black shadow-gold-glow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🎪</span>
            <span>Venues & Crowd ({venues.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('announcements');
              audioManager.playClickSound();
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-amber-400 text-black shadow-gold-glow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>📢</span>
            <span>Public Notices ({announcements.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              audioManager.playClickSound();
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-amber-400 text-black shadow-gold-glow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>📊</span>
            <span>Crowd Analytics</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('protocols');
              audioManager.playClickSound();
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'protocols'
                ? 'bg-amber-400 text-black shadow-gold-glow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🛡️</span>
            <span>Protocols</span>
          </button>
        </div>

        {/* Action Buttons for Current Tab */}
        <div className="flex items-center gap-2">
          {activeTab === 'events' && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
                title="Download complete schedule as CSV spreadsheet"
              >
                <span>📥</span>
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  setShowEventModal(true);
                  audioManager.playClickSound();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs hover:from-amber-300 hover:to-amber-400 shadow-gold-glow cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <span>+</span> Add New Event
              </button>
            </>
          )}

          {activeTab === 'announcements' && (
            <button
              onClick={() => {
                setShowNoticeModal(true);
                audioManager.playClickSound();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs hover:from-amber-300 hover:to-amber-400 shadow-gold-glow cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>📢</span> Issue Safety Notice
            </button>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: FESTIVAL EVENTS MANAGEMENT & TABLE */}
      {/* =================================================================== */}
      {activeTab === 'events' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search & Filter Bar */}
          <div className="glass-dark p-3.5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search event title, Kannada name, venue..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs font-medium focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="cultural">Cultural</option>
                <option value="procession">Procession (Jamboo)</option>
                <option value="exhibition">Exhibition</option>
                <option value="flower">Flower Show</option>
                <option value="torchlight">Torchlight</option>
                <option value="music">Music Sabha</option>
                <option value="sports">Sports & Kushti</option>
                <option value="food">Food Mela</option>
              </select>

              <select
                value={admissionFilter}
                onChange={(e) => setAdmissionFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Admissions</option>
                <option value="free">Free Public</option>
                <option value="paid">Ticketed / VIP</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="glass-dark rounded-3xl border border-amber-400/30 overflow-hidden shadow-royal">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-950/80 uppercase text-[10px] text-amber-300 font-black tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">Event Programme</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Venue & Address</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Admission</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No events match the current search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                        {/* Title */}
                        <td className="p-4 max-w-xs">
                          <p className="font-bold text-white text-xs leading-snug">{evt.title}</p>
                          {evt.title_kn && (
                            <p className="text-[11px] text-amber-400/90 font-kannada mt-0.5">{evt.title_kn}</p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                            {evt.category || 'cultural'}
                          </span>
                        </td>

                        {/* Venue */}
                        <td className="p-4 max-w-[200px]">
                          <p className="font-semibold text-slate-200">{evt.venue_name || 'Mysore Palace'}</p>
                          <p className="text-[10px] text-slate-400 truncate">{evt.address || 'Mysuru, Karnataka'}</p>
                        </td>

                        {/* Date & Time */}
                        <td className="p-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                          {evt.start_datetime
                            ? new Date(evt.start_datetime).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Festival Schedule'}
                        </td>

                        {/* Admission */}
                        <td className="p-4">
                          {evt.is_free ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                              Free
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                              ₹{evt.ticket_price || 'Ticketed'}
                            </span>
                          )}
                        </td>

                        {/* Featured Toggle */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleFeatured(evt.id)}
                            className="text-base cursor-pointer hover:scale-125 transition-transform"
                            title="Toggle Featured Status"
                          >
                            {evt.is_featured ? '⭐' : '☆'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteEvent(evt.id, evt.title)}
                            className="px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 text-[11px] font-bold hover:bg-red-600/40 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Count */}
            <div className="p-3.5 bg-slate-950/80 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
              <span>
                Showing <strong className="text-white">{filteredEvents.length}</strong> of{' '}
                <strong className="text-white">{events.length}</strong> total events
              </span>
              <span className="text-[11px] text-amber-400">Official Dasara 2026 Database Synced</span>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: VENUES & LIVE CROWD DENSITY MONITOR */}
      {/* =================================================================== */}
      {activeTab === 'venues' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-black text-white">Live Venue Occupancy & Crowd Monitor</h4>
              <p className="text-xs text-slate-400">
                Real-time IoT sensors and gate turnstile count across Mysore's 7 official festival zones.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Telemetry Live (Updated 15s ago)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((v) => {
              const occupancyPct = Math.round((v.currentCrowd / v.capacity) * 100);
              let statusColor = 'text-emerald-400';
              let badgeColor = 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300';
              let barColor = 'from-emerald-400 to-teal-500';

              if (occupancyPct >= 80) {
                statusColor = 'text-rose-400';
                badgeColor = 'bg-rose-500/20 border-rose-400/40 text-rose-300 animate-pulse';
                barColor = 'from-amber-400 to-rose-500';
              } else if (occupancyPct >= 60) {
                statusColor = 'text-amber-400';
                badgeColor = 'bg-amber-500/20 border-amber-400/40 text-amber-300';
                barColor = 'from-amber-400 to-amber-500';
              }

              return (
                <div
                  key={v.id}
                  className="glass-dark p-5 rounded-3xl border border-white/10 hover:border-amber-400/50 shadow-royal space-y-3 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}>
                        {occupancyPct >= 80 ? 'Heavy Density' : occupancyPct >= 60 ? 'Moderate Crowd' : 'Normal Flow'}
                      </span>
                      <span className={`font-mono text-sm font-black ${statusColor}`}>{occupancyPct}% Full</span>
                    </div>

                    <h4 className="font-black text-white text-sm">{v.name}</h4>
                    <p className="text-xs text-amber-400 font-kannada mb-1">{v.name_kn}</p>
                    <p className="text-[11px] text-slate-400">📍 {v.address}</p>
                    <p className="text-[11px] text-slate-400 mt-1">🚪 {v.gates}</p>
                  </div>

                  {/* Progress Meter */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Current Occupancy:</span>
                      <span className="font-mono text-white font-bold">
                        {v.currentCrowd.toLocaleString()} / {v.capacity.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: PUBLIC SAFETY & EMERGENCY BROADCAST NOTICES */}
      {/* =================================================================== */}
      {activeTab === 'announcements' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-black text-white">Public Safety & Tourist Bulletins</h4>
              <p className="text-xs text-slate-400">
                Official notices broadcast instantly to visitors' mobile devices and digital festival display boards.
              </p>
            </div>
            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black shadow-gold-glow hover:from-amber-300 transition-all uppercase tracking-wider"
            >
              + Issue Broadcast
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => {
              let alertBorder = 'border-amber-400/30 bg-amber-500/10 text-amber-300';
              let priorityIcon = '📢';

              if (a.priority === 'alert' || a.priority === 'critical') {
                alertBorder = 'border-rose-400/50 bg-rose-500/10 text-rose-300';
                priorityIcon = '🚨';
              } else if (a.priority === 'info') {
                alertBorder = 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300';
                priorityIcon = 'ℹ️';
              }

              return (
                <div
                  key={a.id}
                  className={`p-4 sm:p-5 rounded-2xl border ${alertBorder} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all shadow-royal`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{priorityIcon}</span>
                      <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-black/40">
                        {a.category} • {a.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">🕒 {a.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-black text-white">{a.title}</h4>
                    {a.title_kn && (
                      <p className="text-xs text-amber-300/80 font-kannada">{a.title_kn}</p>
                    )}
                    <p className="text-xs text-slate-200 mt-1 max-w-2xl">{a.content}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAnnouncements(announcements.filter((x) => x.id !== a.id));
                        audioManager.playClickSound();
                        showToast('Notice revoked from live bulletin.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-600/30 transition-all cursor-pointer"
                    >
                      Dismiss Notice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: CROWD ANALYTICS & AI QUERY TELEMETRY */}
      {/* =================================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top AI Inquiries */}
            <div className="glass-dark p-6 rounded-3xl border border-amber-400/30 shadow-royal space-y-4">
              <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <span>🤖 Top Tourist Queries (1,420+ Total)</span>
              </h4>

              <div className="space-y-3">
                {[
                  { topic: 'Jamboo Savari Gold Card Tickets & Entry Gates', pct: 38, count: 540 },
                  { topic: 'Palace 100,000 Bulb Illumination Exact Timing', pct: 29, count: 412 },
                  { topic: 'Tourist Parking Locations near Bannimantap', pct: 21, count: 298 },
                  { topic: 'Captain Arjuna & Golden Howdah Tusker History', pct: 12, count: 170 },
                ].map((q, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">{q.topic}</span>
                      <span className="text-amber-300 font-mono font-bold">
                        {q.count} ({q.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                        style={{ width: `${q.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tourist Demographic Breakdown */}
            <div className="glass-dark p-6 rounded-3xl border border-amber-400/30 shadow-royal space-y-4">
              <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <span>🌐 Visitor Origin Demographic</span>
              </h4>

              <div className="space-y-3">
                {[
                  { region: 'Karnataka (Local & Statewide)', pct: 62, icon: '🏛️' },
                  { region: 'Rest of India (Domestic Tourists)', pct: 28, icon: '🇮🇳' },
                  { region: 'International Cultural Visitors', pct: 10, icon: '✈️' },
                ].map((d, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium flex items-center gap-1.5">
                        <span>{d.icon}</span>
                        <span>{d.region}</span>
                      </span>
                      <span className="text-cyan-300 font-mono font-bold">{d.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 5: PROTOCOLS & SECURITY COMMAND */}
      {/* =================================================================== */}
      {activeTab === 'protocols' && (
        <div className="glass-dark p-6 rounded-3xl border border-amber-400/30 shadow-royal space-y-6 animate-fadeIn">
          <h4 className="text-base font-black text-white">Emergency Operations & Protocol Switches</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>💡</span>
                <span>Palace Illumination Grid</span>
              </h5>
              <p className="text-[11px] text-slate-400">Controls the primary 100,000 bulb feeder circuits.</p>
              <button
                onClick={handleToggleIllumination}
                className="w-full py-2 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 cursor-pointer shadow-gold-glow"
              >
                {isPalaceIlluminated ? 'Switch OFF Grid' : 'Switch ON 100,000 Bulbs'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🚨</span>
                <span>Crowd Surge Protocol</span>
              </h5>
              <p className="text-[11px] text-slate-400">Signals traffic police and medical ambulances to high density gates.</p>
              <button
                onClick={handleToggleHighAlert}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                {isHighAlertActive ? 'Deactivate High Alert' : 'Trigger High Alert Surge'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>📄</span>
                <span>Official Schedule Audit</span>
              </h5>
              <p className="text-[11px] text-slate-400">Exports all schedule database tables for print.</p>
              <button
                onClick={handleExportCSV}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 cursor-pointer"
              >
                Export CSV Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: ADD NEW FESTIVAL EVENT */}
      {/* =================================================================== */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  FESTIVAL REGISTRY
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Publish New Festival Event</h3>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Event Title (English)
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Royal Carnatic Sitar Ensemble"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 font-kannada mb-1">
                  ಕಾರ್ಯಕ್ರಮದ ಶೀರ್ಷಿಕೆ (ಕನ್ನಡ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ರಾಜ ದರ್ಬಾರ್ ಸಿತಾರ್ ಗಾನಸಭೆ"
                  value={newTitleKn}
                  onChange={(e) => setNewTitleKn(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-amber-300 text-xs font-kannada focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="procession">Procession (Jamboo)</option>
                    <option value="music">Classical Music</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="flower">Flower Show</option>
                    <option value="sports">Sports / Kushti</option>
                    <option value="torchlight">Torchlight Parade</option>
                    <option value="food">Aahara Mela</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Venue</label>
                  <select
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Admission</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isFreeCheck"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                    <label htmlFor="isFreeCheck" className="text-xs text-white cursor-pointer font-bold">
                      Free Entry
                    </label>
                  </div>
                </div>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ticket Price (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black uppercase shadow-gold-glow cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: ISSUE PUBLIC SAFETY BROADCAST NOTICE */}
      {/* =================================================================== */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>EMERGENCY DISPATCH</span>
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Issue Public Safety Notice</h3>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Advisory Title (English)
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Heavy Traffic Diversion near Sayyaji Rao Road"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 font-kannada mb-1">
                  ಸೂಚನಾ ಶೀರ್ಷಿಕೆ (ಕನ್ನಡ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ಸಯ್ಯಾಜಿ ರಾವ್ ರಸ್ತೆಯಲ್ಲಿ ಸಂಚಾರ ಮಾರ್ಗ ಬದಲಾವಣೆ"
                  value={newNoticeTitleKn}
                  onChange={(e) => setNewNoticeTitleKn(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-amber-300 text-xs font-kannada focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Alert Level</label>
                <select
                  value={newNoticePriority}
                  onChange={(e) => setNewNoticePriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="info">🟢 Information Bulletin (Normal)</option>
                  <option value="warning">🟡 Crowd / Traffic Advisory (Caution)</option>
                  <option value="alert">🔴 Emergency Surge Alert (High Priority)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Detailed Advisory Message
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe guidance for tourists, alternative parking gates, or medical points..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-black text-xs font-black uppercase shadow-lg cursor-pointer"
                >
                  Broadcast to App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
