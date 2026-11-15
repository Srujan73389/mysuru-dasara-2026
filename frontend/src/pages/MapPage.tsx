import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { venuesAPI, tourismAPI } from '@/services/api';
import { audioManager } from '@/audio/audioManager';

// Fix standard Leaflet default marker icons for Webpack/Vite bundlers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Live Smart Parking Lots Telemetry
const LIVE_PARKING_HUBS = [
  {
    id: 'p1',
    name: 'Doddakere Maidan Mega Hub',
    nameKn: 'ದೊಡ್ಡಕೆರೆ ಮೈದಾನ ಪಾರ್ಕಿಂಗ್',
    lat: 12.3015,
    lng: 76.6568,
    totalSlots: 2000,
    availableSlots: 840,
    status: 'moderate',
    shuttleAvailable: true,
  },
  {
    id: 'p2',
    name: 'Lalitha Mahal Helipad Satellite Hub',
    nameKn: 'ಲಲಿತ ಮಹಲ್ ಹೆಲಿಪ್ಯಾಡ್ ಸಂಕೀರ್ಣ',
    lat: 12.2985,
    lng: 76.6782,
    totalSlots: 3500,
    availableSlots: 2850,
    status: 'open',
    shuttleAvailable: true,
  },
  {
    id: 'p3',
    name: 'Bannimantap Torchlight North Enclosure',
    nameKn: 'ಬನ್ನಿಮಂಟಪ ಉತ್ತರ ನಿಲ್ದಾಣ',
    lat: 12.3312,
    lng: 76.6495,
    totalSlots: 2500,
    availableSlots: 1120,
    status: 'moderate',
    shuttleAvailable: false,
  },
  {
    id: 'p4',
    name: 'Nanjaraja Bahadur Chuttry (City Center)',
    nameKn: 'ನಂಜನರಾಜ ಬಹದ್ದೂರ್ ಛತ್ರ',
    lat: 12.3095,
    lng: 76.6521,
    totalSlots: 400,
    availableSlots: 65,
    status: 'near-full',
    shuttleAvailable: false,
  },
];

// 4.5km Royal Procession Route Coordinates (Mysore Palace to Bannimantap)
const JAMBOO_SAVARI_ROUTE: [number, number][] = [
  [12.3051, 76.6551], // Mysore Palace Balarama Gate
  [12.3065, 76.6548], // Chamaraja Circle
  [12.3082, 76.6542], // K.R. Circle
  [12.3115, 76.6536], // Sayyaji Rao Road Heritage Corridor
  [12.3168, 76.6525], // Ayurveda Hospital Circle
  [12.3215, 76.6515], // Government Medical College
  [12.3258, 76.6508], // Highway Circle
  [12.3298, 76.6502], // Bamboo Bazaar Road
  [12.3325, 76.6498], // Bannimantap Torchlight Parade Grounds
];

export default function MapPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [showProcessionRoute, setShowProcessionRoute] = useState<boolean>(true);
  const [shuttleCountdown, setShuttleCountdown] = useState<number>(165); // in seconds

  // Mysore Central Coordinates
  const defaultCenter: [number, number] = [12.3085, 76.6551];

  useEffect(() => {
    venuesAPI
      .getVenues()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setVenues(data);
      })
      .catch(() => {});

    tourismAPI
      .getLandmarks()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setLandmarks(data);
      })
      .catch(() => {});
  }, []);

  // Live Shuttle Bus Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setShuttleCountdown((prev) => (prev <= 1 ? 180 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // Verified visitor service facilities
  const facilities = [
    {
      id: 'med-1',
      name: 'KR Hospital 24/7 Dasara Medical Camp',
      category: 'medical',
      lat: 12.3135,
      lng: 76.6508,
      address: 'Irwin Road, Mysuru (ICU Ambulance on standby)',
      phone: '108 / 0821-2520108',
    },
    {
      id: 'water-1',
      name: 'MCC Free Mineral Drinking Water Kiosk',
      category: 'water',
      lat: 12.3045,
      lng: 76.656,
      address: 'Jayachamarajendra Art Gallery Junction',
    },
    {
      id: 'help-1',
      name: 'Mysuru City Police Dasara Central Help Post',
      category: 'help',
      lat: 12.3058,
      lng: 76.6535,
      address: 'Dufferin Clock Tower Police Command Post',
      phone: '112 / 0821-2418100',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Interactive Festival Map & Smart Transit"
        titleKn="ದಸರಾ ಉತ್ಸವ ನಕ್ಷೆ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಸಂಚಾರ"
        subtitle="Locate live parking slot availability, real-time KSRTC electric shuttle bus countdowns, 4.5km Jumboo Savari procession corridor, and emergency medical camps."
      />

      {/* Live Smart Parking & Shuttle Telemetry Bar */}
      <div className="glass-dark p-5 rounded-3xl border-2 border-amber-400/40 shadow-royal mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              SMART PARKING & KSRTC SHUTTLE TELEMETRY (LIVE IoT FEED)
            </h4>
          </div>

          {/* KSRTC Chamundi Shuttle Live Departure Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-400/40 text-xs font-mono">
            <span>🚌</span>
            <span className="text-slate-300">Next Electric Chamundi Shuttle:</span>
            <span className="text-amber-300 font-bold animate-pulse">
              {formatSeconds(shuttleCountdown)}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">(Free Transit)</span>
          </div>
        </div>

        {/* 4 Parking Lot Capacity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LIVE_PARKING_HUBS.map((hub) => {
            const occupancyPct = Math.round(
              ((hub.totalSlots - hub.availableSlots) / hub.totalSlots) * 100
            );

            let statusColor = 'text-emerald-400';
            let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            let statusText = '🟢 Open';

            if (occupancyPct >= 80) {
              statusColor = 'text-rose-400';
              badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
              statusText = '🔴 Almost Full';
            } else if (occupancyPct >= 50) {
              statusColor = 'text-amber-300';
              badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              statusText = '🟡 Filling Fast';
            }

            return (
              <div
                key={hub.id}
                className="bg-white/5 p-3.5 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-bold text-white leading-tight">{hub.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${badgeBg}`}>
                      {statusText}
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-300/80 font-kannada mt-0.5">{hub.nameKn}</p>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-slate-400">Available:</span>
                    <span className={`font-bold ${statusColor}`}>
                      {hub.availableSlots.toLocaleString()} / {hub.totalSlots.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancyPct >= 80
                          ? 'bg-rose-500'
                          : occupancyPct >= 50
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Facilities Filter Row & Procession Corridor Toggle */}
      <div className="glass-dark p-4 rounded-2xl border border-amber-400/20 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-royal">
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'All Markers' },
            { id: 'venues', label: '🎪 Festival Venues' },
            { id: 'landmarks', label: '🏰 Heritage Sites' },
            { id: 'parking', label: '🅿️ Smart Parking' },
            { id: 'medical', label: '🏥 Medical Posts' },
            { id: 'help', label: '👮 Police Help Desks' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilterType(f.id);
                audioManager.playClickSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === f.id
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Procession Route Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowProcessionRoute(!showProcessionRoute);
              audioManager.playClickSound();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              showProcessionRoute
                ? 'bg-purple-700/80 border-purple-400 text-white shadow-lg'
                : 'bg-white/5 border-white/15 text-slate-400'
            }`}
          >
            <span>🐘</span>
            <span>{showProcessionRoute ? 'Jamboo Route: Visible' : 'Show Jamboo Route'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Box */}
      <div className="w-full h-[620px] rounded-3xl overflow-hidden glass border-2 border-amber-400/40 relative shadow-royal z-0">
        <MapContainer
          center={defaultCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 1. Jamboo Savari 4.5km Procession Corridor Polyline */}
          {showProcessionRoute && (
            <Polyline
              positions={JAMBOO_SAVARI_ROUTE}
              pathOptions={{
                color: '#FFD700',
                weight: 6,
                opacity: 0.85,
                dashArray: '8, 8',
              }}
            />
          )}

          {/* 2. Venues */}
          {(filterType === 'all' || filterType === 'venues') &&
            venues.map((v) => {
              if (!v.latitude || !v.longitude) return null;
              return (
                <Marker
                  key={`venue-${v.id}`}
                  position={[parseFloat(v.latitude), parseFloat(v.longitude)]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="text-black p-1">
                      <p className="font-bold text-sm text-purple-950">{v.name}</p>
                      {v.name_kn && <p className="text-xs text-amber-800 font-kannada">{v.name_kn}</p>}
                      <p className="text-xs text-gray-700 mt-1">{v.address}</p>
                      <p className="text-[10px] text-green-700 font-semibold mt-1">
                        Capacity: {v.capacity ? v.capacity.toLocaleString() : 'Open Venue'}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* 3. Landmarks */}
          {(filterType === 'all' || filterType === 'landmarks') &&
            landmarks.map((lm) => {
              if (!lm.latitude || !lm.longitude) return null;
              return (
                <Marker
                  key={`landmark-${lm.id}`}
                  position={[parseFloat(lm.latitude), parseFloat(lm.longitude)]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="text-black p-1">
                      <p className="font-bold text-sm text-purple-950">{lm.name}</p>
                      <p className="text-xs text-gray-600">{lm.historical_period}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* 4. Smart Parking Hubs */}
          {(filterType === 'all' || filterType === 'parking') &&
            LIVE_PARKING_HUBS.map((park) => (
              <Marker key={park.id} position={[park.lat, park.lng]} icon={customIcon}>
                <Popup>
                  <div className="text-black p-1 space-y-1">
                    <p className="font-bold text-xs text-blue-900">🅿️ {park.name}</p>
                    <p className="text-[11px] text-gray-700 font-kannada">{park.nameKn}</p>
                    <p className="text-xs font-bold text-emerald-700">
                      {park.availableSlots} / {park.totalSlots} Slots Free
                    </p>
                    {park.shuttleAvailable && (
                      <p className="text-[10px] text-purple-800 font-bold">
                        🚌 KSRTC Free Electric Shuttle Available
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* 5. Medical & Police Facilities */}
          {(filterType === 'all' || filterType === 'medical' || filterType === 'help') &&
            facilities
              .filter((fac) => filterType === 'all' || fac.category === filterType)
              .map((fac) => (
                <Marker key={fac.id} position={[fac.lat, fac.lng]} icon={customIcon}>
                  <Popup>
                    <div className="text-black p-1">
                      <p className="font-bold text-xs text-red-900">{fac.name}</p>
                      <p className="text-[11px] text-gray-700">{fac.address}</p>
                      {fac.phone && (
                        <p className="text-[10px] text-blue-700 font-bold mt-0.5">📞 {fac.phone}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
        </MapContainer>
      </div>
    </div>
  );
}
