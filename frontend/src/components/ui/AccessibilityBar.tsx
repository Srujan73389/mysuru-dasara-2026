import React, { useState, useEffect } from 'react';

export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [textScale, setTextScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // 1. Text Scaling
    if (textScale === 'large') {
      root.style.fontSize = '18px';
    } else if (textScale === 'xlarge') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }

    // 2. High Contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // 3. Reduced Motion
    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [textScale, highContrast, reducedMotion]);

  return (
    <div className="relative">
      {/* Trigger Button in Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full glass border border-amber-400/40 text-amber-300 hover:border-amber-400 flex items-center justify-center text-xs font-bold transition-all cursor-pointer hover:bg-amber-400/20 active:scale-95 shadow-sm"
        title="Accessibility Settings (ಪ್ರವೇಶಿಸುವಿಕೆ)"
        aria-label="Accessibility Settings"
      >
        ♿
      </button>

      {/* Accessibility Dropdown Dialog */}
      {open && (
        <div className="absolute top-11 right-0 w-72 glass-dark p-5 rounded-2xl border border-amber-400/40 shadow-royal space-y-3.5 text-xs z-50 backdrop-blur-2xl bg-slate-950/95">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <div>
              <h4 className="font-bold text-amber-400 uppercase text-[11px]">Accessibility Options</h4>
              <p className="text-[10px] text-cream/60">ಪ್ರವೇಶಿಸುವಿಕೆ ಆಯ್ಕೆಗಳು</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Text Scaling */}
          <div>
            <label className="block text-[11px] font-semibold text-cream/80 mb-1.5">
              Text Scaling
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'normal', label: '100%' },
                { id: 'large', label: '115%' },
                { id: 'xlarge', label: '130%' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTextScale(s.id as any)}
                  className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    textScale === s.id
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="font-medium text-cream/80">High Contrast Mode</span>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="accent-amber-400 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-cream/80">Reduced Motion</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="accent-amber-400 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
