import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Explore Mysuru', href: '/explore' },
  { label: 'Mysore Palace', href: '/palace' },
  { label: 'Jamboo Savari', href: '/jamboo-savari' },
  { label: 'Torchlight Parade', href: '/torchlight-parade' },
  { label: 'Cultural Museum', href: '/cultural-museum' },
]

const moreLinks = [
  { label: 'Events & Tickets', href: '/events' },
  { label: 'Trip Planner', href: '/planner' },
  { label: 'Festival Map', href: '/map' },
  { label: 'Food Exhibition', href: '/food-exhibition' },
  { label: 'Heritage Passport', href: '/heritage-passport' },
  { label: 'AI Guide (G M Srujan)', href: '/ai-guide' },
]

export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [activeCity, setActiveCity] = useState<'bengaluru' | 'mysuru' | null>(null)

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText('gms73389@gmail.com')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <footer className="relative mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-6">
        {/* Compact Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="font-semibold text-white tracking-wide text-xs">
                MYSURU DASARA
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 max-w-xs">
              Digital cultural heritage platform for Mysuru Dasara 2026. Explore royal events, route itineraries, and live AI guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-200 mb-2">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-1.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[11px] text-slate-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-200 mb-2">
              Experiences
            </h4>
            <ul className="flex flex-col gap-1.5">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-[11px] text-slate-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visitor Info */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-200 mb-2">
              Festival Info
            </h4>
            <div className="flex flex-col gap-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Dates:</span>
                <span className="text-slate-200 font-medium">Oct 2 – 12, 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Venue:</span>
                <span className="text-slate-200 font-medium">Mysuru, Karnataka</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Helpline:</span>
                <span className="text-slate-200 font-medium">+91-821-2420966</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Portal:</span>
                <span className="text-slate-200 font-medium">mysoredasara.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PREMIUM, ATTRACTIVE DEVELOPER & KARNATAKA MAP BAR */}
        {/* ============================================================== */}
        <div className="my-5 relative rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 backdrop-blur-xl p-5 md:p-6 shadow-2xl transition hover:border-slate-700/80 overflow-hidden">
          {/* Subtle ambient lighting effects */}
          <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left: Author Identity + Direct Connect Pills */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full lg:w-auto">
              {/* Creator Monogram Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-red-500/20 border border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-300 font-mono shrink-0 shadow-lg shadow-black/40">
                SG
              </div>

              <div>
                {/* Creator Header */}
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25">
                    Lead Creator & Architect
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/70 px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Place: <strong className="font-semibold text-white">Bangalore</strong>
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  <span className="text-slate-400 font-normal">Made with ❤️ by </span>
                  <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    SRUJAN G M
                  </span>
                </h3>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start mt-3">
                  {/* GitHub Button */}
                  <a
                    href="https://github.com/Srujan73389"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 hover:border-amber-400/40 hover:text-white transition shadow-sm hover:shadow-amber-500/10"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-slate-400 group-hover:text-amber-300 transition-colors" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>GitHub</span>
                    <span className="text-slate-500 font-mono text-[11px]">/Srujan73389</span>
                    <svg className="w-3 h-3 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  {/* Email & One-Click Copy */}
                  <div className="inline-flex rounded-xl border border-slate-700/80 bg-slate-800/90 overflow-hidden text-xs shadow-sm hover:border-slate-600 transition">
                    <a
                      href="mailto:gms73389@gmail.com"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-slate-200 hover:text-white hover:bg-slate-700/50 transition font-medium"
                      title="Send email"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>gms73389@gmail.com</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="px-2.5 py-1.5 border-l border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
                      title={copiedEmail ? 'Copied to clipboard' : 'Copy email'}
                    >
                      {copiedEmail ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </span>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Attractive Authentic Karnataka Map Visual */}
            <div className="flex items-center gap-5 sm:gap-6 lg:border-l lg:border-slate-800/80 lg:pl-6 w-full lg:w-auto justify-center lg:justify-end">
              {/* Karnataka Map Container with Clean Glow & Beacons */}
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 shrink-0 flex items-center justify-center">
                {/* Backlight halo behind the map */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 via-amber-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

                <img
                  src="/karnataka-map.png"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://i.pinimg.com/736x/20/1e/8e/201e8e74149ef6982ea3e3399bd4db76.jpg'
                  }}
                  alt="Karnataka Map"
                  className="h-full w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] select-none pointer-events-none transition-transform duration-300 hover:scale-105"
                />

                {/* Dotted neon route connector between Bangalore and Mysore */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line
                    x1="74"
                    y1="78"
                    x2="54"
                    y2="87"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    strokeDasharray="2.5 2"
                    strokeOpacity="0.85"
                  />
                </svg>

                {/* Clean Glowing Beacon for Bangalore (Creator Location) */}
                <div
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 group/bengaluru"
                  style={{ left: '74%', top: '78%' }}
                  onMouseEnter={() => setActiveCity('bengaluru')}
                  onMouseLeave={() => setActiveCity(null)}
                  title="Bangalore (Developer Base)"
                >
                  <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping" />
                  <span className="relative block w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_10px_#10b981]" />
                </div>

                {/* Clean Glowing Beacon for Mysuru (Dasara Festival) */}
                <div
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 group/mysuru"
                  style={{ left: '54%', top: '87%' }}
                  onMouseEnter={() => setActiveCity('mysuru')}
                  onMouseLeave={() => setActiveCity(null)}
                  title="Mysuru (Dasara 2026)"
                >
                  <span className="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping" />
                  <span className="relative block w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-950 shadow-[0_0_10px_#f59e0b]" />
                </div>
              </div>

              {/* State & City Legend */}
              <div className="flex flex-col text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold text-white tracking-wide mb-2">
                  <span className="text-sm sm:text-base">Karnataka</span>
                  <span className="text-[10px] font-semibold text-amber-300 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/30">
                    ಕರ್ನಾಟಕ
                  </span>
                </div>

                {/* Bangalore point */}
                <div
                  className={`flex items-center gap-2 py-1 transition-all cursor-default ${
                    activeCity === 'bengaluru' ? 'text-emerald-300 translate-x-1 font-semibold' : 'text-slate-300'
                  }`}
                  onMouseEnter={() => setActiveCity('bengaluru')}
                  onMouseLeave={() => setActiveCity(null)}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] shrink-0" />
                  <span className="font-medium">Bangalore</span>
                  <span className="text-[11px] text-slate-400">(Creator)</span>
                </div>

                {/* Mysore point */}
                <div
                  className={`flex items-center gap-2 py-1 transition-all cursor-default ${
                    activeCity === 'mysuru' ? 'text-amber-300 translate-x-1 font-semibold' : 'text-slate-300'
                  }`}
                  onMouseEnter={() => setActiveCity('mysuru')}
                  onMouseLeave={() => setActiveCity(null)}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] shrink-0" />
                  <span className="font-medium">Mysuru</span>
                  <span className="text-[11px] text-slate-400">(Dasara)</span>
                </div>

                {/* Expressway Route badge */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 font-mono shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>140 km Corridor</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2026 Mysuru Dasara Platform. All rights reserved.</p>
          <p className="text-center">Digital cultural heritage showcase • Crafted with pride in Karnataka</p>
          <p>Bengaluru & Mysuru 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
