import React, { useState } from 'react';
import CityExploreScene, { CityLandmark, CITY_LANDMARKS } from '@/scenes/CityExploreScene';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';

export default function ExploreMysuru() {
  const [selectedLandmark, setSelectedLandmark] = useState<CityLandmark | null>(null);
  const [tourMode, setTourMode] = useState<'free' | 'guided'>('guided');
  const [guidedIndex, setGuidedIndex] = useState(0);

  const handleNextStop = () => {
    const next = (guidedIndex + 1) % CITY_LANDMARKS.length;
    setGuidedIndex(next);
    setSelectedLandmark(CITY_LANDMARKS[next]);
    audioManager.playRoyalFanfare();
  };

  const handlePrevStop = () => {
    const prev = (guidedIndex - 1 + CITY_LANDMARKS.length) % CITY_LANDMARKS.length;
    setGuidedIndex(prev);
    setSelectedLandmark(CITY_LANDMARKS[prev]);
    audioManager.playRoyalFanfare();
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 max-w-7xl mx-auto flex flex-col">
      <PageHeader
        title="Explore Mysuru – 3D Digital City"
        titleKn="ಮೈಸೂರು ನಗರ ೩ಡಿ ಪರಿಶೋಧನೆ"
        subtitle="Explore verified 3D heritage landmarks, Balarama and Jayarama gates, Chamundi Hills, Bannimantap parade grounds, and illuminated royal avenues."
      />

      {/* Guided vs Free Exploration Control Bar */}
      <div className="glass p-3 rounded-2xl border border-amber-400/30 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-royal">
        <div className="flex gap-2">
          <button
            onClick={() => setTourMode('guided')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tourMode === 'guided'
                ? 'bg-amber-400 text-black shadow-gold-glow'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🧭 Guided Heritage Tour
          </button>
          <button
            onClick={() => setTourMode('free')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tourMode === 'free'
                ? 'bg-amber-400 text-black shadow-gold-glow'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🕊️ Free Exploration Mode
          </button>
        </div>

        {tourMode === 'guided' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevStop}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-cream transition-colors"
            >
              ← Previous Stop
            </button>
            <div className="text-center">
              <span className="text-xs font-bold text-amber-300 block">
                Stop {guidedIndex + 1} of {CITY_LANDMARKS.length}: {CITY_LANDMARKS[guidedIndex].name.split(' (')[0]}
              </span>
              <span className="text-[10px] text-amber-400/80 font-kannada">
                {CITY_LANDMARKS[guidedIndex].nameKn}
              </span>
            </div>
            <button
              onClick={handleNextStop}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 text-xs font-bold shadow-gold-glow transition-colors"
            >
              Next Stop →
            </button>
          </div>
        )}
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[650px] min-h-[650px] rounded-2xl overflow-hidden glass border border-amber-400/40 shadow-royal">
        <CityExploreScene
          selectedId={CITY_LANDMARKS[guidedIndex].id}
          onSelectLandmark={(landmark) => {
            setSelectedLandmark(landmark);
            const foundIdx = CITY_LANDMARKS.findIndex((l) => l.id === landmark.id);
            if (foundIdx !== -1) setGuidedIndex(foundIdx);
          }}
        />
      </div>

      {/* Guide Note & Legend */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-center glass p-4 rounded-xl border border-white/10 text-xs text-cream/80">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-base">💡</span>
          <span>
            Click & drag to orbit around Mysuru. Click any glowing landmark pin or use the top buttons to fly directly to each monument.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-gold-glow" /> 8 Verified Locations
          </span>
          <span className="flex items-center gap-1.5 font-medium text-cream">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Fortified Palace Gates
          </span>
        </div>
      </div>
    </div>
  );
}
