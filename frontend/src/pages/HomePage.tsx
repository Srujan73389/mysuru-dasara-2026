import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { eventsAPI, festivalAPI, announcementsAPI } from '@/services/api';
import { audioManager } from '@/audio/audioManager';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [festivalInfo, setFestivalInfo] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);

  useEffect(() => {
    festivalAPI.getInfo().then((res) => {
      if (res.data) {
        setFestivalInfo(Array.isArray(res.data) ? res.data[0] : res.data.results ? res.data.results[0] : res.data);
      }
    }).catch(() => {});

    announcementsAPI.getAnnouncements().then((res) => {
      if (res.data) {
        setAnnouncements(Array.isArray(res.data) ? res.data : res.data.results || []);
      }
    }).catch(() => {});

    eventsAPI.getEvents({ is_featured: true }).then((res) => {
      if (res.data) {
        setFeaturedEvents(Array.isArray(res.data) ? res.data.slice(0, 3) : (res.data.results || []).slice(0, 3));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen text-cream overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 bg-palace-gradient">
        {/* Subtle decorative radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Official Announcement Marquee */}
        {announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-2 rounded-full glass border border-amber-400/40 text-xs text-amber-200 flex items-center gap-2 max-w-xl mx-auto"
          >
            <span className="bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
              Notice
            </span>
            <span className="truncate">
              {i18n.language === 'kn' && announcements[0].title_kn
                ? announcements[0].title_kn
                : announcements[0].title}
            </span>
          </motion.div>
        )}

        {/* Royal Crest / Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-20 h-20 mb-4 rounded-full border-2 border-amber-400/60 flex items-center justify-center bg-deep-purple/60 shadow-gold-glow cursor-pointer"
          onClick={() => audioManager.playRoyalFanfare()}
        >
          <span className="text-3xl">🏛️</span>
        </motion.div>

        {/* Titles */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-amber-400 text-lg md:text-xl font-kannada tracking-wide mb-1"
        >
          ನಾಡಹಬ್ಬ ಮೈಸೂರು ದಸರಾ ೨೦೨೬
        </motion.p>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-7xl font-display font-black tracking-tight mb-4 text-gradient-gold"
        >
          MYSURU DASARA 2026
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl text-cream/80 text-sm md:text-lg mb-8 leading-relaxed font-light"
        >
          {festivalInfo?.description ||
            'Step into Karnataka’s greatest state festival. Experience the 100,000-bulb illuminated Mysore Palace, virtual Vijayadashami Jamboo Savari, and real-time AI heritage guidance.'}
        </motion.p>

        {/* Primary Call to Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 z-10"
        >
          <Link
            to="/palace"
            onClick={() => audioManager.playRoyalFanfare()}
            className="px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-gold-glow hover:brightness-110 transition-all flex items-center gap-2 text-sm md:text-base"
          >
            <span>Explore 3D Palace</span>
            <span>✨</span>
          </Link>

          <Link
            to="/jamboo-savari"
            onClick={() => audioManager.playDrumBeat(0.7)}
            className="px-6 py-3.5 rounded-xl font-semibold glass border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 transition-all flex items-center gap-2 text-sm md:text-base"
          >
            <span>Jamboo Savari 3D</span>
            <span>🐘</span>
          </Link>

          <Link
            to="/ai-guide"
            className="px-6 py-3.5 rounded-xl font-semibold bg-royal-purple/70 border border-purple-400/40 text-cream hover:bg-royal-purple transition-all flex items-center gap-2 text-sm md:text-base"
          >
            <span>Ask GMS AI (ಜಿ.ಎಂ.ಎಸ್)</span>
            <span>🎙️</span>
          </Link>
        </motion.div>

        {/* Dasara 2026 Countdown / Dates Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl w-full"
        >
          {[
            { label: 'Festival Dates', val: 'Oct 11 – 20, 2026', sub: 'ಅಕ್ಟೋಬರ್ ೧೧ - ೨೦' },
            { label: 'Palace Lights', val: '100,000 Bulbs', sub: 'ಲಕ್ಷ ದೀಪಗಳ ವೈಭವ' },
            { label: 'Golden Howdah', val: '750 kg Pure Gold', sub: 'ಚಿನ್ನದ ಅಂಬಾರಿ' },
            { label: 'Drone Symphony', val: '1,000 Sky Drones', sub: 'ಆಕಾಶ ಡ್ರೋನ್ ಶೋ' },
          ].map((item, idx) => (
            <div key={idx} className="glass p-3.5 rounded-xl border border-amber-400/20 text-center">
              <p className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-base font-bold text-cream">{item.val}</p>
              <p className="text-[11px] text-cream/60 font-kannada mt-0.5">{item.sub}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 2. IMMERSIVE EXPERIENCE TILES */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 font-kannada">
            ಅನುಭವಿಸಿ • Interactive 3D Journeys
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-cream">
            Immerse In Royal Mysuru
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Mysore Palace */}
          <Link
            to="/palace"
            className="group relative rounded-2xl overflow-hidden glass border border-amber-400/30 hover:border-amber-400 transition-all p-6 flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏰</div>
              <span className="text-xs uppercase font-bold text-amber-400">Virtual Heritage</span>
              <h3 className="text-2xl font-bold text-cream group-hover:text-amber-300 transition-colors mt-1">
                Mysore Palace 3D
              </h3>
              <p className="text-xs text-amber-400/80 font-kannada mb-3">ಮೈಸೂರು ಅರಮನೆ ದೀಪಾಲಂಕಾರ</p>
              <p className="text-sm text-cream/70 leading-relaxed">
                Toggle the world-famous 100,000-bulb golden illumination, launch virtual fireworks, and inspect the Durbar Hall.
              </p>
            </div>
            <div className="pt-4 flex items-center text-amber-400 text-sm font-semibold gap-1">
              <span>Enter Palace</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Jamboo Savari */}
          <Link
            to="/jamboo-savari"
            className="group relative rounded-2xl overflow-hidden glass border border-amber-400/30 hover:border-amber-400 transition-all p-6 flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🐘</div>
              <span className="text-xs uppercase font-bold text-amber-400">Procession Simulator</span>
              <h3 className="text-2xl font-bold text-cream group-hover:text-amber-300 transition-colors mt-1">
                Jamboo Savari 3D
              </h3>
              <p className="text-xs text-amber-400/80 font-kannada mb-3">ವಿಜಯದಶಮಿ ಜಂಬೂ ಸವಾರಿ</p>
              <p className="text-sm text-cream/70 leading-relaxed">
                Follow the 750 kg Golden Howdah, folk dancers, and Caparisoned elephant troupes with multiple camera angles and slow-motion.
              </p>
            </div>
            <div className="pt-4 flex items-center text-amber-400 text-sm font-semibold gap-1">
              <span>Experience Procession</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3: Torchlight Parade & Drones */}
          <Link
            to="/torchlight-parade"
            className="group relative rounded-2xl overflow-hidden glass border border-amber-400/30 hover:border-amber-400 transition-all p-6 flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">✨</div>
              <span className="text-xs uppercase font-bold text-amber-400">Night Spectacle</span>
              <h3 className="text-2xl font-bold text-cream group-hover:text-amber-300 transition-colors mt-1">
                Parade & Drone Show
              </h3>
              <p className="text-xs text-amber-400/80 font-kannada mb-3">ಪಂಜಿನ ಕವಾಯಿತು ಮತ್ತು ಡ್ರೋನ್ ಶೋ</p>
              <p className="text-sm text-cream/70 leading-relaxed">
                Watch Bannimantap night parade drills and 1,000 synchronized drones morphing into royal motifs in the sky.
              </p>
            </div>
            <div className="pt-4 flex items-center text-amber-400 text-sm font-semibold gap-1">
              <span>Watch Simulation</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. FESTIVAL HIGHLIGHTS GRID */}
      <section className="py-16 px-4 bg-deep-purple/30 border-y border-amber-400/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <span className="text-xs uppercase font-bold text-amber-400">Daily Programme</span>
              <h2 className="text-3xl font-display font-bold text-cream">Featured Dasara Events</h2>
            </div>
            <Link
              to="/events"
              className="mt-4 md:mt-0 text-sm font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1"
            >
              <span>View All Events</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <div key={evt.id} className="glass p-5 rounded-xl border border-amber-400/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                    {evt.category}
                  </span>
                  <span className="text-xs text-amber-200">
                    {evt.is_free ? 'Free Entry' : `₹${evt.ticket_price}`}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-cream mb-1">{evt.title}</h3>
                {evt.title_kn && (
                  <p className="text-xs text-amber-400/80 font-kannada mb-2">{evt.title_kn}</p>
                )}
                <p className="text-xs text-cream/70 line-clamp-2 mb-4">{evt.description}</p>
                <div className="flex items-center justify-between text-xs text-cream/50 pt-3 border-t border-white/10">
                  <span>📍 {evt.venue_name || 'Mysuru Venue'}</span>
                  <span>🗓️ {new Date(evt.start_datetime).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
