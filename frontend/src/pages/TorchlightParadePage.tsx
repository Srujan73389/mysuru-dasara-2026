import React, { useState } from 'react';
import DroneShowScene, { DroneFormation, DroneColorTheme } from '@/scenes/DroneShowScene';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';

export default function TorchlightParadePage() {
  const [formation, setFormation] = useState<DroneFormation>('palace');
  const [colorTheme, setColorTheme] = useState<DroneColorTheme>('gold');
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused'>('playing');
  const [cameraMode, setCameraMode] = useState<'grandstand' | 'sky' | 'parade' | 'cinematic'>('grandstand');
  const [showLasers, setShowLasers] = useState<boolean>(true);
  const [showTorchbearers, setShowTorchbearers] = useState<boolean>(true);
  const [fireworkCount, setFireworkCount] = useState<number>(0);
  const [isFiring, setIsFiring] = useState<boolean>(false);

  const handleLaunchFirework = () => {
    setIsFiring(true);
    setFireworkCount((prev) => prev + 1);
    audioManager.playFireworkSound();
    setTimeout(() => setIsFiring(false), 600);
  };

  const formationsList: { id: DroneFormation; name: string; kn: string; icon: string; desc: string }[] = [
    {
      id: 'palace',
      name: 'Mysore Palace Illuminated',
      kn: 'ಮೈಸೂರು ಅರಮನೆ ದೀಪಾಲಂಕಾರ',
      icon: '🏰',
      desc: '100,000 light facade with central Durbar spire and royal colonnades',
    },
    {
      id: 'elephant',
      name: 'Golden Howdah Elephant',
      kn: 'ಚಿನ್ನದ ಅಂಬಾರಿ ಹೊತ್ತ ಗಜರಾಜ',
      icon: '🐘',
      desc: 'Captain Arjuna carrying the 750kg 24K gold Ambari in divine majesty',
    },
    {
      id: 'kannada',
      name: 'Kannada "ದಸರಾ" Typography',
      kn: 'ಕನ್ನಡ "ದಸರಾ" ಅಕ್ಷರ ಮಾಲೆ',
      icon: '✍️',
      desc: 'Monumental Halegannada calligraphy floating in night sky',
    },
    {
      id: 'gandaberunda',
      name: 'Royal Gandaberunda',
      kn: 'ರಾಜಲಾಂಛನ ಗಂಡಭೇರುಂಡ',
      icon: '🦅',
      desc: 'The mythical two-headed imperial bird symbol of the Wadiyar dynasty',
    },
    {
      id: 'chandrayaan',
      name: 'ISRO Chandrayaan-3 Launch',
      kn: 'ಇಸ್ರೋ ಚಂದ್ರಯಾನ-೩ ನೌಕೆ',
      icon: '🚀',
      desc: 'LVM3 rocket ascending into deep space celebrating India’s space hub',
    },
    {
      id: 'fireworks',
      name: 'Mega Pyrotechnic Burst',
      kn: 'ಭವ್ಯ ಆಕಾಶ ಬಾಣಬಿರುಸು',
      icon: '🎆',
      desc: '360° concentric fireworks sphere with cascading golden embers',
    },
  ];

  const colorThemesList: { id: DroneColorTheme; label: string; kn: string; badge: string; border: string }[] = [
    {
      id: 'gold',
      label: 'Royal Gold',
      kn: 'ರಾಜ ಬಂಗಾರ',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      border: 'hover:border-amber-400',
    },
    {
      id: 'karnataka',
      label: 'Karnataka Pride',
      kn: 'ಕರ್ನಾಟಕ ಧ್ವಜ',
      badge: 'bg-red-500/20 text-yellow-300 border-red-500/40',
      border: 'hover:border-yellow-400',
    },
    {
      id: 'neon',
      label: 'Cyber Electric',
      kn: 'ವಿದ್ಯುತ್ ತರಂಗ',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      border: 'hover:border-cyan-400',
    },
    {
      id: 'diamond',
      label: 'Diamond Cyan',
      kn: 'ವಜ್ರ ನೀಲಿ',
      badge: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
      border: 'hover:border-blue-400',
    },
  ];

  const cameraModesList: { id: 'grandstand' | 'sky' | 'parade' | 'cinematic'; label: string; icon: string }[] = [
    { id: 'grandstand', label: 'VIP Grandstand', icon: '🏟️' },
    { id: 'sky', label: 'Overhead Sky Eye', icon: '🛰️' },
    { id: 'parade', label: 'Torchbearer Ring', icon: '🔥' },
    { id: 'cinematic', label: 'Cinematic Orbit', icon: '🎬' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Torchlight Parade & 1,600 Drone Symphony"
        titleKn="ಬನ್ನಿಮಂಟಪ ಪಂಜಿನ ಕವಾಯಿತು ಮತ್ತು ೧,೬೦೦ ಆಕಾಶ ಡ್ರೋನ್ ಪ್ರದರ್ಶನ"
        subtitle="Simulate the Bannimantap night parade grounds where ceremonial torches blaze, high-power stadium lasers pierce the sky, and 1,600 synchronized LED drones weave royal heritage formations."
      />

      {/* Main 3D Canvas Showcase */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden glass border-2 border-amber-400/30 shadow-[0_20px_60px_-15px_rgba(251,191,36,0.25)] group bg-black/90">
        <DroneShowScene
          formation={formation}
          colorTheme={colorTheme}
          playbackState={playbackState}
          cameraMode={cameraMode}
          showLasers={showLasers}
          showFireworks={true}
          showTorchbearers={showTorchbearers}
          triggerFireworkCount={fireworkCount}
        />

        {/* Top Floating Live HUD Bar */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
          {/* Swarm & Stadium Status */}
          <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/30 pointer-events-auto shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-[11px] font-bold tracking-widest text-amber-300 uppercase flex items-center gap-1.5">
                <span>1,600 DRONES CONNECTED</span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-400 font-mono">RTK LOCKED ±2CM</span>
              </p>
              <p className="text-[10px] text-white/60 font-sans">
                Bannimantap Airspace: <span className="text-amber-200">ALT 125M AGL</span> • Wind: <span className="text-emerald-300">4.2 KT</span> • Sync: <span className="text-emerald-300">100%</span>
              </p>
            </div>
          </div>

          {/* Quick Trigger Bar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Interactive Firework Launch Button */}
            <button
              onClick={handleLaunchFirework}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer ${
                isFiring
                  ? 'scale-105 bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-amber-500/50'
                  : 'bg-gradient-to-r from-amber-500/80 to-rose-500/80 hover:from-amber-400 hover:to-rose-400 text-white border border-amber-300/40 hover:shadow-gold-glow'
              }`}
            >
              <span className="text-base animate-bounce">🎆</span>
              <span>Launch Sky Shells</span>
              <span className="bg-black/40 px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/20">
                {fireworkCount}
              </span>
            </button>

            {/* Swarm Motion Toggle */}
            <button
              onClick={() => {
                setPlaybackState((s) => (s === 'playing' ? 'paused' : 'playing'));
                audioManager.playFireworkSound();
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold border border-white/20 hover:border-amber-400/50 text-white transition-all backdrop-blur-md cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Pause or Resume Formation Motion"
            >
              <span>{playbackState === 'playing' ? '⏸️' : '▶️'}</span>
              <span>{playbackState === 'playing' ? 'Freeze' : 'Resume'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Formation Indicator Badge */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <div className="bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-400/30 shadow-2xl flex items-center gap-3">
            <span className="text-2xl">
              {formationsList.find((f) => f.id === formation)?.icon}
            </span>
            <div>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-amber-400 font-mono">
                Current Formation
              </p>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{formationsList.find((f) => f.id === formation)?.name}</span>
                <span className="text-xs text-amber-300 font-kannada">
                  ({formationsList.find((f) => f.id === formation)?.kn})
                </span>
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Right Controls Help Badge */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:block">
          <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-white/60">
            🖱️ Drag to rotate view • Scroll to zoom in/out
          </div>
        </div>
      </div>

      {/* Control Console Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): 6 Drone Formations & Theme Selectors */}
        <div className="lg:col-span-8 space-y-6">
          {/* Drone Formation Matrix */}
          <div className="glass p-6 rounded-3xl border border-amber-400/25 bg-slate-950/60 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <span>✨ 1,600 LED Drone Sky Choreography</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a precision 3D constellation to reconfigure the swarm in real-time.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono">
                6 Formations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {formationsList.map((f) => {
                const isActive = formation === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFormation(f.id);
                      audioManager.playFireworkSound();
                    }}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                      isActive
                        ? 'bg-gradient-to-br from-amber-500/25 to-rose-500/15 border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)] text-amber-100'
                        : 'bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.08] text-slate-300'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                      </div>
                    )}
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {f.icon}
                    </div>
                    <p className="text-xs font-bold leading-tight text-white mb-0.5">
                      {f.name}
                    </p>
                    <p className="text-[11px] font-kannada text-amber-400/90 font-medium">
                      {f.kn}
                    </p>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1.5 leading-snug">
                      {f.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palettes & Camera Angles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Color Theme Selector */}
            <div className="glass p-5 rounded-3xl border border-white/10 bg-slate-950/50 shadow-lg">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <span>🎨 LED Color Harmonizer</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {colorThemesList.map((c) => {
                  const isActive = colorTheme === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setColorTheme(c.id);
                        audioManager.playFireworkSound();
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? `${c.badge} border-current shadow-sm ring-1 ring-amber-400/40`
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight">{c.label}</p>
                      <p className="text-[10px] opacity-75 font-kannada">{c.kn}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera Perspectives */}
            <div className="glass p-5 rounded-3xl border border-white/10 bg-slate-950/50 shadow-lg">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <span>🎥 Camera Perspectives</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {cameraModesList.map((cam) => {
                  const isActive = cameraMode === cam.id;
                  return (
                    <button
                      key={cam.id}
                      onClick={() => setCameraMode(cam.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? 'bg-amber-400/25 border-amber-400 text-amber-200 font-bold shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base">{cam.icon}</span>
                      <span className="text-xs leading-tight">{cam.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Stadium Features, Lighting Toggles & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stadium Features & Toggles */}
          <div className="glass p-5 rounded-3xl border border-amber-400/25 bg-slate-950/60 shadow-xl space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>🏟️ Bannimantap Atmosphere</span>
            </h4>

            {/* Stadium Lasers Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-xs font-bold text-white">Sky Concert Lasers</p>
                  <p className="text-[10px] text-slate-400">6 sweeping high-lumen stadium beams</p>
                </div>
              </div>
              <button
                onClick={() => setShowLasers(!showLasers)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                  showLasers ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    showLasers ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Marching Torchbearers Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🔥</span>
                <div>
                  <p className="text-xs font-bold text-white">Panjina Kavayathu</p>
                  <p className="text-[10px] text-slate-400">Rotating drill battalion flame rings</p>
                </div>
              </div>
              <button
                onClick={() => setShowTorchbearers(!showTorchbearers)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                  showTorchbearers ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    showTorchbearers ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                <p className="text-lg font-mono font-extrabold text-amber-300">1,600</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Drone Fleet</p>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                <p className="text-lg font-mono font-extrabold text-emerald-400">30,000+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Spectators</p>
              </div>
            </div>
          </div>

          {/* Historical Lore & Event Details */}
          <div className="glass p-5 rounded-3xl border border-amber-400/25 bg-slate-950/60 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>🔥 Torchlight Military Heritage</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Grand Finale
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Historically known as <strong className="text-amber-300">Panjina Kavayathu</strong>, the Torchlight Parade marks the official culmination of Mysore Dasara on Vijayadashami night.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Held at the historic <strong>Bannimantap Grounds</strong>, elite battalions of the Karnataka State Police, Border Security Force (BSF), and Mounted Cavalry present synchronised torch drills, laser spectacles, daredevil motorcycle stunts by the famed ‘Tornadoes’, and a 21-gun royal salute.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">📍 Venue</span>
                <span className="font-semibold text-amber-300">Bannimantap Grounds, Mysuru</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">🗓️ Date & Time</span>
                <span className="font-semibold text-white">Vijayadashami, 7:00 PM IST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">👑 Chief Guest</span>
                <span className="font-semibold text-emerald-300">Governor & Chief Minister</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
