import React, { useState } from 'react';
import JambooSavariScene from '@/scenes/JambooSavariScene';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';

interface TuskerProfile {
  id: string;
  name: string;
  nameKn: string;
  role: string;
  roleKn: string;
  age: number;
  weightKg: number;
  heightM: number;
  camp: string;
  mahout: string;
  personality: string;
  yearsCarried: string;
  icon: string;
  badgeColor: string;
}

const DASARA_TUSKERS: TuskerProfile[] = [
  {
    id: 'abhimanyu',
    name: 'Abhimanyu',
    nameKn: 'ಅಭಿಮನ್ಯು (ಹಾಲಿ ಅಂಬಾರಿ ಆನೆ)',
    role: 'Current Lead Ambari Bearer (2020–2026)',
    roleKn: 'ಚಿನ್ನದ ಅಂಬಾರಿ ಹೊರುವ ಹಾಲಿ ಗಜರಾಜ',
    age: 58,
    weightKg: 5160,
    heightM: 2.74,
    camp: 'Mathigodu Elephant Camp, Nagarahole',
    mahout: 'Vasantha (Master Mahout)',
    personality: 'Celebrated for unshakeable composure amidst cannons and 500,000 cheering devotees.',
    yearsCarried: '5 Consecutive Years (2020, 2021, 2022, 2023, 2024)',
    icon: '👑',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
  },
  {
    id: 'arjuna',
    name: 'Captain Arjuna',
    nameKn: 'ಕ್ಯಾಪ್ಟನ್ ಅರ್ಜುನ (ಅಮರ ಗಜರಾಜ)',
    role: 'Legendary 8-Time Howdah Champion',
    roleKn: '೮ ಬಾರಿ ಯಶಸ್ವಿಯಾಗಿ ಅಂಬಾರಿ ಹೊತ್ತ ಧೀರ',
    age: 64,
    weightKg: 5650,
    heightM: 2.95,
    camp: 'Balle Elephant Camp, D.B. Kuppe',
    mahout: 'Vinu (Long-time Caretaker)',
    personality: 'Renowned for towering grandeur, rock-steady gait, and deep spiritual bond with Sri Chamundeshwari.',
    yearsCarried: '8 Times (2012 to 2019)',
    icon: '🐘',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  },
  {
    id: 'dhananjaya',
    name: 'Dhananjaya',
    nameKn: 'ಧನಂಜಯ (ನಿಶಾನೆ ಆನೆ)',
    role: 'Nishan Elephant (Frontline Flag Bearer)',
    roleKn: 'ಮೆರವಣಿಗೆಯ ಮುಂಚೂಣಿ ನಿಶಾನೆ ಆನೆ',
    age: 44,
    weightKg: 4940,
    heightM: 2.8,
    camp: 'Dubare Elephant Camp, Kodagu',
    mahout: 'J. K. Bhaskar',
    personality: 'Brisk, alert, and charismatic tusker designated as the primary successor to the Howdah mantle.',
    yearsCarried: 'Nishan Bearer since 2018',
    icon: '🛡️',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  },
  {
    id: 'bheema',
    name: 'Bheema',
    nameKn: 'ಭೀಮ (ಗಜರಕ್ಷಕ)',
    role: 'Royal Procession Guard & Naupat',
    roleKn: 'ನೌಪತ್ ಹಾಗೂ ಮೆರವಣಿಗೆ ರಕ್ಷಕ',
    age: 24,
    weightKg: 4480,
    heightM: 2.85,
    camp: 'Mathigodu Elephant Camp',
    mahout: 'Ganesh',
    personality: 'Youthful giant known for muscular strength and affectionate temperament.',
    yearsCarried: 'Procession Guard',
    icon: '⚔️',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
  },
];

const AMBARI_ANATOMY = [
  {
    title: '750 kg Golden Howdah (ಚಿನ್ನದ ಅಂಬಾರಿ)',
    desc: 'Crafted from solid gold leaf over sacred rosewood and silver plates. Features intricate carvings of Goddess Chamundeshwari, lions, and floral arabesques.',
    icon: '👑',
  },
  {
    title: 'Nettipattam (Golden Forehead Armor)',
    desc: 'Handcrafted gilded brass and gold plate weighing 12 kg that drapes down the tusker’s forehead, believed to ward off evil energies during public darshan.',
    icon: '⚜️',
  },
  {
    title: 'Zari Mantle (ಚಿನ್ನದ ಜರಿ ಹೊದಿಕೆ - Jhool)',
    desc: 'Heavy royal maroon and violet velvet mantle embroidered with real zari threads, custom-tailored to cushion the tusker’s spine beneath the Ambari cradle.',
    icon: '🧵',
  },
  {
    title: 'Sacred Gante (Ceremonial Bell Harness)',
    desc: 'Rhythmic brass bells strapped to the tusker’s flanks that chime with every measured stride, alerting crowds and keeping the elephant calm.',
    icon: '🔔',
  },
];

export default function JambooSavariPage() {
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'slowmo'>('playing');
  const [cameraMode, setCameraMode] = useState<'follow' | 'spectator' | 'balcony' | 'aerial' | 'devi'>('follow');
  const [selectedTusker, setSelectedTusker] = useState<TuskerProfile>(DASARA_TUSKERS[0]);

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Jamboo Savari Procession & 3D Tusker Simulator"
        titleKn="ವಿಜಯದಶಮಿ ಜಂಬೂ ಸವಾರಿ ಮೆರವಣಿಗೆ ಮತ್ತು ೩ಡಿ ಸಿಮ್ಯುಲೇಟರ್"
        subtitle="Experience Captain Arjuna and Abhimanyu carrying the sacred 750 kg Golden Howdah along the 4.5km Sayyaji Rao Road corridor to Bannimantap."
      />

      {/* Main 3D Canvas Container */}
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden glass border-2 border-amber-400/40 shadow-royal">
        <JambooSavariScene
          playbackState={playbackState}
          cameraMode={cameraMode}
          onElephantClick={() => audioManager.playDrumBeat(0.8)}
        />
      </div>

      {/* Playback & Camera Controls */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Playback Controls */}
        <div className="glass-dark p-4 rounded-2xl border border-amber-400/20 shadow-royal">
          <h4 className="text-xs uppercase font-mono font-bold text-amber-300 mb-2.5 flex items-center gap-1.5">
            <span>⏱️ Procession Playback Speed</span>
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setPlaybackState('playing');
                audioManager.playClickSound();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                playbackState === 'playing'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ▶ Normal
            </button>
            <button
              onClick={() => {
                setPlaybackState('slowmo');
                audioManager.playClickSound();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                playbackState === 'slowmo'
                  ? 'bg-amber-500/40 border border-amber-400 text-amber-200'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ⏳ Slow-Mo
            </button>
            <button
              onClick={() => {
                setPlaybackState('paused');
                audioManager.playClickSound();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                playbackState === 'paused'
                  ? 'bg-purple-600/40 border border-purple-400 text-purple-200'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ⏸ Pause
            </button>
          </div>
        </div>

        {/* Camera Perspectives */}
        <div className="glass-dark p-4 rounded-2xl border border-amber-400/20 shadow-royal">
          <h4 className="text-xs uppercase font-mono font-bold text-amber-300 mb-2.5 flex items-center gap-1.5">
            <span>🎥 3D Vantage Perspectives</span>
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'devi', label: '🙏 Devi Darshan' },
              { id: 'follow', label: 'Follow Arjuna' },
              { id: 'spectator', label: 'Curbside Crowd' },
              { id: 'balcony', label: 'Heritage Balcony' },
            ].map((cam) => (
              <button
                key={cam.id}
                onClick={() => {
                  setCameraMode(cam.id as any);
                  audioManager.playClickSound();
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cameraMode === cam.id
                    ? 'bg-amber-400 text-black shadow-gold-glow'
                    : 'bg-white/5 text-white/70 hover:bg-white/15'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Atmosphere */}
        <div className="glass-dark p-4 rounded-2xl border border-amber-400/20 shadow-royal flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase font-mono font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <span>🥁 Procession Audio Atmosphere</span>
            </h4>
            <p className="text-[11px] text-slate-300">
              Live acoustic resonance of Nadaswaram, Chende melam, and royal fanfares.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => audioManager.playDrumBeat(0.9)}
              className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-xs font-bold transition-all cursor-pointer"
            >
              🥁 Chende Beat
            </button>
            <button
              onClick={() => audioManager.playRoyalFanfare()}
              className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-xs font-bold transition-all cursor-pointer"
            >
              🎺 Fanfare
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2: ROYAL ELEPHANT ROSTER (ಗಜಪಡೆ ಪರಿಚಯ) */}
      {/* =================================================================== */}
      <div className="mt-12 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            OFFICIAL DASARA GAJAPADA ROSTER
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            The Royal Tuskers & Sacred Howdah Bearers
          </h3>
          <p className="text-xs text-slate-300">
            Meet the magnificent pachyderms selected from Karnataka’s tiger reserves for their extraordinary composure, majestic physique, and historic devotion.
          </p>
        </div>

        {/* Tusker Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DASARA_TUSKERS.map((tusker) => (
            <div
              key={tusker.id}
              onClick={() => {
                setSelectedTusker(tusker);
                audioManager.playClickSound();
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedTusker.id === tusker.id
                  ? 'glass-dark border-amber-400 shadow-royal scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tusker.icon}</span>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight">{tusker.name}</h4>
                  <p className="text-[10px] text-amber-400/80 font-kannada">{tusker.nameKn}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${tusker.badgeColor}`}>
                {tusker.yearsCarried}
              </span>
            </div>
          ))}
        </div>

        {/* Active Tusker Full Dossier Card */}
        <div className="glass-dark p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-royal grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedTusker.icon}</span>
              <h3 className="text-2xl font-black text-white">{selectedTusker.name}</h3>
              <span className="text-xs text-amber-300 font-kannada font-bold">
                ({selectedTusker.nameKn})
              </span>
            </div>

            <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
              {selectedTusker.role}
            </p>

            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedTusker.personality}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Weight</p>
                <p className="text-sm font-bold text-amber-300 font-mono">
                  {selectedTusker.weightKg.toLocaleString()} kg
                </p>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Height</p>
                <p className="text-sm font-bold text-white font-mono">{selectedTusker.heightM} meters</p>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Age</p>
                <p className="text-sm font-bold text-white font-mono">{selectedTusker.age} Years</p>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Caretaker</p>
                <p className="text-xs font-bold text-emerald-400 truncate">{selectedTusker.mahout}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              📍 Origin Reserve: <strong className="text-white">{selectedTusker.camp}</strong>
            </p>
          </div>

          <div className="md:col-span-4 bg-gradient-to-br from-purple-900/60 to-slate-900/90 p-5 rounded-2xl border border-amber-400/30 text-center space-y-3">
            <span className="text-5xl block">{selectedTusker.icon}</span>
            <p className="text-xs font-bold text-amber-300">Royal Elephant Training</p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Tuskers undergo 45 days of rigorous conditioning: sandbag weight training, sound cannon habituation, and royal diet (ragi mudde, coconut, jaggery, and sugarcane).
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 3: GOLDEN HOWDAH ANATOMY INSPECTOR */}
      {/* =================================================================== */}
      <div className="mt-12 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            SACRED ARTIFACT ARCHITECTURE
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            Anatomy of the 750 kg Golden Ambari
          </h3>
          <p className="text-xs text-slate-300">
            The masterpiece crafted from 24-karat gold foil over sacred wood that has enshrined Goddess Sri Chamundeshwari for over four centuries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AMBARI_ANATOMY.map((item, idx) => (
            <div
              key={idx}
              className="glass-dark p-5 rounded-2xl border border-amber-400/25 hover:border-amber-400/60 shadow-royal space-y-2.5 transition-all"
            >
              <span className="text-3xl block">{item.icon}</span>
              <h4 className="text-xs font-black text-amber-300">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
