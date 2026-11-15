import React, { useState } from 'react';
import { audioManager, SoundscapeType } from '@/audio/audioManager';

export default function AudioControlPanel() {
  const [open, setOpen] = useState(false);
  const [soundscape, setSoundscape] = useState<SoundscapeType>('none');
  const [masterVol, setMasterVol] = useState(80);
  const [musicVol, setMusicVol] = useState(60);
  const [sfxVol, setSfxVol] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  const soundscapes: { id: SoundscapeType; label: string; icon: string; desc: string }[] = [
    { id: 'palace', label: 'Palace Chimes', icon: '🏰', desc: 'Amba Vilas Evening Serenade' },
    { id: 'nadaswara', label: 'Nadaswara Raga', icon: '🎺', desc: 'Temple Sanctum Auspicious Winds' },
    { id: 'chende', label: 'Chende Beats', icon: '🥁', desc: 'Martial Procession Folk Melam' },
    { id: 'procession', label: 'Jamboo Crowd', icon: '🐘', desc: 'Live Procession Fanfare' },
    { id: 'drones', label: 'Drone Synth', icon: '✨', desc: 'Bannimantap Night Laser Show' },
    { id: 'none', label: 'Mute Ambient', icon: '⏹', desc: 'Silence Background Audio' },
  ];

  const handleSoundscapeChange = (type: SoundscapeType) => {
    setSoundscape(type);
    audioManager.setSoundscape(type);
  };

  const handleMuteToggle = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  // Instant SFX Triggers
  const playSoundEffect = (type: 'bell' | 'drum' | 'fanfare' | 'firework') => {
    if (type === 'bell') audioManager.playBellSound();
    else if (type === 'drum') audioManager.playDrumBeat(0.8);
    else if (type === 'fanfare') audioManager.playRoyalFanfare();
    else if (type === 'firework') audioManager.playFireworkSound();
  };

  return (
    <div className="relative">
      {/* Trigger Button in Header */}
      <button
        onClick={() => setOpen(!open)}
        className="h-8 px-2.5 rounded-lg glass border border-amber-400/40 text-amber-300 hover:border-amber-400 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer hover:bg-amber-400/20 active:scale-95 shadow-sm"
        title="Royal Soundscape Mixer & SFX Soundboard (ಧ್ವನಿ ವ್ಯವಸ್ಥೆ)"
      >
        <span>{isMuted ? '🔇' : '🎵'}</span>
        <span className="hidden xl:inline text-[11px] capitalize">
          {soundscape === 'none' ? 'Audio Mixer' : soundscape}
        </span>
        {soundscape !== 'none' && !isMuted && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        )}
      </button>

      {/* Control Drawer / Dropdown */}
      {open && (
        <div className="absolute top-11 right-0 w-84 sm:w-96 glass-dark p-5 rounded-3xl border-2 border-amber-400/50 shadow-royal space-y-4 z-50 backdrop-blur-2xl bg-slate-950/95 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
            <div>
              <h4 className="text-xs uppercase font-black text-amber-400 flex items-center gap-1.5 font-mono">
                <span>🎛️ Akashavani Mysuru Live Studio</span>
              </h4>
              <p className="text-[10px] text-slate-400">
                Spatial Web Audio Synthesizer & Royal Soundboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMuteToggle}
                className="text-xs px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer font-bold"
              >
                {isMuted ? '🔇 Unmute' : '🔊 Mute'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Animated Visualizer Frequency Bars */}
          {soundscape !== 'none' && !isMuted && (
            <div className="flex items-end justify-center gap-1 h-6 bg-black/40 p-1.5 rounded-xl border border-white/10">
              {[18, 32, 24, 45, 12, 38, 52, 28, 40, 20, 48, 16].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-amber-400 to-amber-200 rounded-full animate-pulse"
                  style={{
                    height: `${(h % 20) + 8}px`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Atmospheric Soundscapes Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Atmospheric Soundscapes:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {soundscapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSoundscapeChange(s.id)}
                  className={`p-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                    soundscape === s.id
                      ? 'bg-amber-400 text-black border-amber-300 font-black shadow-gold-glow'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/15'
                  }`}
                >
                  <span className="text-base shrink-0">{s.icon}</span>
                  <div className="overflow-hidden">
                    <p className="truncate leading-tight font-bold">{s.label}</p>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Interactive SFX Soundboard */}
          <div className="pt-2 border-t border-white/10">
            <label className="block text-[11px] font-bold text-amber-300 mb-2 uppercase tracking-wider">
              Instant Royal SFX Soundboard:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => playSoundEffect('bell')}
                className="py-2 px-1 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-[10px] font-bold text-center transition-all cursor-pointer flex flex-col items-center gap-0.5"
              >
                <span className="text-base">🔔</span>
                <span>Temple Bell</span>
              </button>
              <button
                onClick={() => playSoundEffect('drum')}
                className="py-2 px-1 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-[10px] font-bold text-center transition-all cursor-pointer flex flex-col items-center gap-0.5"
              >
                <span className="text-base">🥁</span>
                <span>Chende</span>
              </button>
              <button
                onClick={() => playSoundEffect('fanfare')}
                className="py-2 px-1 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-[10px] font-bold text-center transition-all cursor-pointer flex flex-col items-center gap-0.5"
              >
                <span className="text-base">🎺</span>
                <span>Fanfare</span>
              </button>
              <button
                onClick={() => playSoundEffect('firework')}
                className="py-2 px-1 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-[10px] font-bold text-center transition-all cursor-pointer flex flex-col items-center gap-0.5"
              >
                <span className="text-base">🎆</span>
                <span>Firework</span>
              </button>
            </div>
          </div>

          {/* Volume Faders */}
          <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Master Volume</span>
                <span className="font-mono text-amber-300 font-bold">{masterVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVol}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMasterVol(val);
                  audioManager.setMasterVolume(val / 100);
                }}
                className="w-full accent-amber-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Ambient Synthesis</span>
                <span className="font-mono text-amber-300 font-bold">{musicVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVol}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMusicVol(val);
                  audioManager.setMusicVolume(val / 100);
                }}
                className="w-full accent-amber-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Sound Effects (SFX)</span>
                <span className="font-mono text-amber-300 font-bold">{sfxVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSfxVol(val);
                  audioManager.setSfxVolume(val / 100);
                }}
                className="w-full accent-amber-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
