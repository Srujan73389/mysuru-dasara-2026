import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { audioManager } from '@/audio/audioManager';
import AccessibilityBar from '@/components/ui/AccessibilityBar';
import AudioControlPanel from '@/components/ui/AudioControlPanel';

// Primary desktop links
const primaryLinks = [
  { label: 'Home', labelKn: 'ಮುಖಪುಟ', href: '/' },
  { label: 'Explore 3D', labelKn: 'ನಗರ ದರ್ಶನ', href: '/explore' },
  { label: 'Palace', labelKn: 'ಅರಮನೆ', href: '/palace' },
  { label: 'Jamboo Savari', labelKn: 'ಜಂಬೂ ಸವಾರಿ', href: '/jamboo-savari' },
  { label: 'Events', labelKn: 'ಕಾರ್ಯಕ್ರಮಗಳು', href: '/events' },
  { label: 'Planner', labelKn: 'ಯೋಜನೆ', href: '/planner' },
  { label: 'Map', labelKn: 'ನಕ್ಷೆ', href: '/map' },
  { label: 'AI Guide', labelKn: 'ಕಿರಣ್ AI', href: '/ai-guide' },
];

// All 19 Pages for Mega Drawer
export const allPages = [
  { id: 1, title: 'Home / Immersive Landing', titleKn: 'ಮುಖಪುಟ', href: '/', icon: '🏛️' },
  { id: 2, title: 'Explore Mysuru 3D City', titleKn: '೩ಡಿ ನಗರ ಪರಿಶೋಧನೆ', href: '/explore', icon: '🏙️' },
  { id: 3, title: 'Virtual Mysore Palace', titleKn: 'ಮೈಸೂರು ಅರಮನೆ', href: '/palace', icon: '🏰' },
  { id: 4, title: 'Chamundi Hills Experience', titleKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ', href: '/chamundi', icon: '⛰️' },
  { id: 5, title: 'Jamboo Savari Procession', titleKn: 'ಜಂಬೂ ಸವಾರಿ ಮೆರವಣಿಗೆ', href: '/jamboo-savari', icon: '🐘' },
  { id: 6, title: 'Torchlight Parade & Drones', titleKn: 'ಪಂಜಿನ ಕವಾಯಿತು ಮತ್ತು ಡ್ರೋನ್ ಶೋ', href: '/torchlight-parade', icon: '✨' },
  { id: 7, title: 'Karnataka Cultural Museum', titleKn: 'ಸಾಂಸ್ಕೃತಿಕ ಸಂಗ್ರಹಾಲಯ', href: '/cultural-museum', icon: '🎭' },
  { id: 8, title: 'Mysore GI Crafts & Artisans', titleKn: 'ಮೈಸೂರು ಜಿಐ ಕರಕುಶಲ ಕಲೆಗಳು', href: '/gi-crafts', icon: '🧵' },
  { id: 9, title: 'Dasara Event Explorer', titleKn: 'ಕಾರ್ಯಕ್ರಮಗಳ ವೇಳಾಪಟ್ಟಿ', href: '/events', icon: '🗓️' },
  { id: 10, title: 'Smart Festival Planner', titleKn: 'ಸ್ಮಾರ್ಟ್ ಪ್ರವಾಸ ಯೋಜನೆ', href: '/planner', icon: '🗺️' },
  { id: 11, title: 'Interactive Festival Map', titleKn: 'ಉತ್ಸವ ನಕ್ಷೆ', href: '/map', icon: '📍' },
  { id: 12, title: 'AI Mysuru Guide – GMS', titleKn: 'ಜಿ.ಎಂ.ಎಸ್ AI ಮಾರ್ಗದರ್ಶಿ', href: '/ai-guide', icon: '🎙️' },
  { id: 13, title: 'Food & Exhibition Explorer', titleKn: 'ಆಹಾರ ಮೇಳ ಮತ್ತು ವಸ್ತುಪ್ರದರ್ಶನ', href: '/food-exhibition', icon: '🍛' },
  { id: 14, title: 'Visitor Services Dashboard', titleKn: 'ಪ್ರವಾಸಿ ಸೇವೆಗಳು ಮತ್ತು ತುರ್ತು ಮಾಹಿತಿ', href: '/visitor-services', icon: '🚨' },
  { id: 15, title: 'Heritage Passport & Quiz', titleKn: 'ಪರಂಪರೆ ಪಾಸ್‌ಪೋರ್ಟ್', href: '/heritage-passport', icon: '🛂' },
  { id: 16, title: 'Official Certificate Verification', titleKn: 'ಪ್ರಮಾಣಪತ್ರ ಪರಿಶೀಲನೆ', href: '/verify', icon: '🪪' },
  { id: 17, title: 'Festival Photo Studio', titleKn: 'ಭಾವಚಿತ್ರ ಸ್ಟುಡಿಯೋ', href: '/gallery', icon: '📸' },
  { id: 18, title: 'User Profile & Saved Experiences', titleKn: 'ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್', href: '/profile', icon: '👤' },
  { id: 19, title: 'Admin Control Dashboard', titleKn: 'ಆಡಳಿತ ಫಲಕ', href: '/admin', icon: '⚙️' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { language, setLanguage } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-midnight-blue/95 backdrop-blur-md border-b border-amber-400/20 py-2.5 shadow-royal'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo & Emblem */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full border border-amber-400/60 bg-royal-purple/50 flex items-center justify-center text-lg shadow-gold-glow group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <span className="font-display font-black text-sm md:text-base text-cream tracking-tight block leading-tight">
                MYSURU DASARA <span className="text-amber-400">2026</span>
              </span>
              <span className="text-[10px] text-amber-400/80 font-kannada block leading-none">
                ಮೈಸೂರು ದಸರಾ ೨೦೨೬
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
                      : 'text-cream/80 hover:text-amber-300 hover:bg-white/5'
                  }`
                }
              >
                {language === 'kn' ? link.labelKn : link.label}
              </NavLink>
            ))}

            {/* Mega Menu Toggle: All 19 Experiences */}
            <button
              onClick={() => setMegaOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 flex items-center gap-1 ml-1 cursor-pointer"
            >
              <span>Explore All (19)</span>
              <span>▾</span>
            </button>
          </div>

          {/* Right Action Icons (Accessibility, Audio, Language, Auth, Mobile toggle) */}
          <div className="flex items-center gap-2">
            <AccessibilityBar />
            <AudioControlPanel />

            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="px-2.5 py-1 rounded-lg glass border border-amber-400/30 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition-all font-kannada"
              title="Toggle Language"
            >
              {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-amber-400 text-black font-bold text-xs flex items-center justify-center shadow-gold-glow"
                title="My Profile"
              >
                👤
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-block px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg glass text-cream text-lg"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-midnight-blue/98 border-b border-amber-400/20 px-4 py-4 space-y-1.5 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setMegaOpen(true);
                  }}
                  className="py-2 px-3 rounded-lg bg-amber-400 text-black font-bold text-xs"
                >
                  View All 17 Pages
                </button>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 px-3 rounded-lg bg-white/10 text-cream font-bold text-xs text-center"
                >
                  Admin Panel
                </Link>
              </div>

              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-cream hover:bg-white/5 hover:text-amber-300"
                >
                  <span className="font-semibold">{link.label}</span>
                  <span className="text-xs text-amber-400/80 font-kannada ml-2">{link.labelKn}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ALL 17 EXPERIENCES MEGA MODAL */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="glass-dark p-6 md:p-8 rounded-3xl border border-amber-400/40 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-royal">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-widest">
                    Complete Festival Portal
                  </span>
                  <h3 className="text-2xl font-bold text-cream mt-0.5">
                    All 17 Mysuru Dasara 2026 Experiences
                  </h3>
                  <p className="text-xs text-amber-400/80 font-kannada">
                    ಮೈಸೂರು ದಸರಾ ಮಹೋತ್ಸವದ ಸಮಗ್ರ ಡಿಜಿಟಲ್ ವಿಭಾಗಗಳು
                  </p>
                </div>
                <button
                  onClick={() => setMegaOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-cream text-sm flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allPages.map((page) => (
                  <Link
                    key={page.id}
                    to={page.href}
                    onClick={() => {
                      setMegaOpen(false);
                      audioManager.playRoyalFanfare();
                    }}
                    className="p-3.5 rounded-xl glass border border-white/10 hover:border-amber-400/60 hover:bg-white/5 transition-all flex items-start gap-3 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {page.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-cream group-hover:text-amber-300 transition-colors">
                        {page.title}
                      </h4>
                      <p className="text-[10px] text-amber-400/80 font-kannada">
                        {page.titleKn}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
