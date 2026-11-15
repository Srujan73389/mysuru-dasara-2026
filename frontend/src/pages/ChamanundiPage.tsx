import React, { useState } from 'react';
import ChamundiScene from '@/scenes/ChamundiScene';
import PageHeader from '@/components/ui/PageHeader';

export default function ChamanundiPage() {
  const [selectedSpot, setSelectedSpot] = useState<'temple' | 'nandi' | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 max-w-7xl mx-auto flex flex-col">
      <PageHeader
        title="Chamundi Hills & Sri Chamundeshwari"
        titleKn="ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಮತ್ತು ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ಸನ್ನಿಧಿ"
        subtitle="The sacred seat of Goddess Chamundeshwari, patron deity of Mysuru. Discover the 1,000 historic steps and the monolithic 1659 Nandi Bull."
      />

      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden glass border border-amber-400/30 shadow-royal">
        <ChamundiScene
          onTempleClick={() => setSelectedSpot('temple')}
          onNandiClick={() => setSelectedSpot('nandi')}
        />
      </div>

      {/* Info Card when hotspot is clicked */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setSelectedSpot('temple')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            selectedSpot === 'temple'
              ? 'glass-dark border-amber-400 shadow-gold-glow'
              : 'glass border-white/10 hover:border-amber-400/40'
          }`}
        >
          <span className="text-xs font-bold uppercase text-amber-400">Hilltop Sanctum</span>
          <h3 className="text-lg font-bold text-cream mt-0.5">Sri Chamundeshwari Temple</h3>
          <p className="text-xs text-amber-400/80 font-kannada mb-2">ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಸ್ಥಾನ</p>
          <p className="text-xs text-cream/70 leading-relaxed">
            Constructed in the 12th century under the Hoysala Empire and enhanced with a magnificent 7-tier Gopuram by Maharaja Krishnaraja Wadiyar III in 1827. The state festival officially commences with puja offered here.
          </p>
        </div>

        <div
          onClick={() => setSelectedSpot('nandi')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            selectedSpot === 'nandi'
              ? 'glass-dark border-amber-400 shadow-gold-glow'
              : 'glass border-white/10 hover:border-amber-400/40'
          }`}
        >
          <span className="text-xs font-bold uppercase text-amber-400">1659 Monolithic Heritage</span>
          <h3 className="text-lg font-bold text-cream mt-0.5">The Monolithic Nandi Bull</h3>
          <p className="text-xs text-amber-400/80 font-kannada mb-2">ಏಕಶಿಲಾ ನಂದಿ ವಿಗ್ರಹ</p>
          <p className="text-xs text-cream/70 leading-relaxed">
            Carved out of a single black granite boulder in 1659 AD under Maharaja Dodda Devaraja Wadiyar. Measuring over 15 feet high and 24 feet long, adorned with carved garlands and brass bell chains.
          </p>
        </div>
      </div>
    </div>
  );
}
