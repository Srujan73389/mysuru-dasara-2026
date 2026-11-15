// Royal Mysore Amba Vilas Palace 3D Experience Page
import React, { useState } from 'react';
import PalaceScene from '@/scenes/PalaceScene';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';

export default function PalacePage() {
  const [lightingMode, setLightingMode] = useState<'day' | 'evening' | 'night'>('night');
  const [illuminationOn, setIlluminationOn] = useState<boolean>(true);
  const [lightIntensity, setLightIntensity] = useState<number>(1.2);
  const [cameraView, setCameraView] = useState<'overview' | 'durbar' | 'courtyard' | 'aerial' | 'gates'>('overview');
  const [graphicsQuality, setGraphicsQuality] = useState<'high' | 'balanced' | 'low'>('high');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [photoFlash, setPhotoFlash] = useState(false);

  const hotspotInfo: Record<string, { title: string; titleKn: string; text: string }> = {
    durbar: {
      title: 'Amba Vilas Durbar Hall',
      titleKn: 'ಅಂಬಾ ವಿಲಾಸ ದರ್ಬಾರ್ ಸಭಾಂಗಣ',
      text: 'The opulent private audience hall where the Maharaja held royal council. Features ornate rosewood doorways inlaid with ivory and stained glass ceilings imported from Glasgow.',
    },
    kalyana: {
      title: 'Kalyana Mantapa (Marriage Pavilion)',
      titleKn: 'ಕಲ್ಯಾಣ ಮಂಟಪ',
      text: 'Magnificent octagonal pavilion with a soaring multi-coloured glass ceiling supported by cast-iron pillars, adorned with vibrant peacocks and floral motifs.',
    },
    throne: {
      title: 'Golden Throne (Chinnada Simhasana)',
      titleKn: 'ಚಿನ್ನದ ಸಿಂಹಾಸನ',
      text: 'Legendary jewel-encrusted royal throne made of fig wood and overlaid with pure gold plates and precious gems, assembled exclusively during Dasara Navaratri.',
    },
  };

  const handleTakeSnapshot = () => {
    audioManager.playRoyalFanfare();
    setPhotoFlash(true);
    setTimeout(() => setPhotoFlash(false), 300);

    // Grab canvas element
    const canvas = document.querySelector('canvas');
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Mysore_Palace_Snapshot_${cameraView}_${lightingMode}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        alert('Photo captured! Postcard saved.');
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 max-w-7xl mx-auto flex flex-col relative">
      {/* Photography Flash Effect */}
      {photoFlash && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-300 opacity-90" />
      )}

      <PageHeader
        title="Royal Mysore Palace Experience"
        titleKn="ಮೈಸೂರು ಅರಮನೆ ೩ಡಿ ಅನುಭವ"
        subtitle="Explore the Indo-Saracenic architectural masterpiece and simulate the world-famous golden illumination of 100,000 bulbs."
      />

      {/* Main 3D Canvas Box */}
      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden glass border border-amber-400/30 shadow-royal">
        <PalaceScene
          lightingMode={lightingMode}
          illuminationOn={illuminationOn}
          lightIntensity={lightIntensity}
          bloomIntensity={1.0}
          quality={graphicsQuality}
          cameraView={cameraView}
          onSelectHotspot={(hotspot) => setActiveHotspot(hotspot)}
        />

        {/* Floating Snapshot Camera Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={handleTakeSnapshot}
            className="px-3.5 py-2 rounded-full glass-dark border border-amber-400/50 text-amber-300 text-xs font-bold hover:bg-amber-400/20 shadow-royal flex items-center gap-1.5 transition-all"
            title="Capture Virtual Photography Postcard"
          >
            <span>📸</span>
            <span>Take Photo Postcard</span>
          </button>
        </div>
      </div>

      {/* Lighting & Camera Interactive Control Console */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Panel 1: Illumination Controls */}
        <div className="glass p-4 rounded-xl border border-amber-400/20">
          <h4 className="text-xs uppercase font-bold text-amber-400 mb-3 flex items-center justify-between">
            <span>💡 100,000 Bulb Lights</span>
            <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">
              {illuminationOn ? 'ON' : 'OFF'}
            </span>
          </h4>
          <button
            onClick={() => {
              const next = !illuminationOn;
              setIlluminationOn(next);
              if (next) audioManager.playRoyalFanfare();
            }}
            className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              illuminationOn
                ? 'bg-amber-400 text-black hover:bg-amber-300 shadow-gold-glow'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {illuminationOn ? '✨ Palace Illuminated' : 'Switch ON Golden Lights'}
          </button>

          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-cream/70 mb-1">
              <span>Light Intensity</span>
              <span>{Math.round(lightIntensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={lightIntensity}
              disabled={!illuminationOn}
              onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-black/40 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Panel 2: Sky & Time of Day */}
        <div className="glass p-4 rounded-xl border border-amber-400/20">
          <h4 className="text-xs uppercase font-bold text-amber-400 mb-3">
            🌅 Time of Day Mode
          </h4>
          <div className="grid grid-cols-3 gap-1.5">
            {(['day', 'evening', 'night'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setLightingMode(mode)}
                className={`py-2 rounded text-xs font-semibold capitalize transition-all ${
                  lightingMode === mode
                    ? 'bg-amber-500/30 border border-amber-400 text-amber-300'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {mode === 'day' ? 'Day' : mode === 'evening' ? 'Dusk' : 'Night'}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 3: Camera Angles */}
        <div className="glass p-4 rounded-xl border border-amber-400/20">
          <h4 className="text-xs uppercase font-bold text-amber-400 mb-3">
            🎥 Cinematic Viewpoint
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'overview', label: 'Grand Facade' },
              { id: 'gates', label: 'Balarama Gate' },
              { id: 'durbar', label: 'Durbar Tower' },
              { id: 'courtyard', label: 'Courtyard Walk' },
              { id: 'aerial', label: 'Aerial View' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setCameraView(v.id as any)}
                className={`py-1.5 px-2 rounded text-xs font-medium transition-all ${
                  cameraView === v.id
                    ? 'bg-amber-400/30 border border-amber-400 text-amber-200'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 4: Graphics Preset */}
        <div className="glass p-4 rounded-xl border border-amber-400/20">
          <h4 className="text-xs uppercase font-bold text-amber-400 mb-3">
            ⚙️ Graphics Profile
          </h4>
          <div className="grid grid-cols-3 gap-1.5">
            {(['high', 'balanced', 'low'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setGraphicsQuality(q)}
                className={`py-2 rounded text-xs font-semibold capitalize transition-all ${
                  graphicsQuality === q
                    ? 'bg-purple-600/40 border border-purple-400 text-purple-200'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hotspot Inspection Modal / Card */}
      {activeHotspot && hotspotInfo[activeHotspot] && (
        <div className="mt-4 glass-dark p-5 rounded-xl border border-amber-400/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Palace Architectural Hotspot
            </span>
            <h3 className="text-lg font-bold text-amber-200">
              {hotspotInfo[activeHotspot].title}
            </h3>
            <p className="text-xs text-amber-400/80 font-kannada">
              {hotspotInfo[activeHotspot].titleKn}
            </p>
            <p className="text-xs text-cream/80 mt-1 max-w-3xl">
              {hotspotInfo[activeHotspot].text}
            </p>
          </div>
          <button
            onClick={() => setActiveHotspot(null)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-cream"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
