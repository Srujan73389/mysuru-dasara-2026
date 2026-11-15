import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{ background: '#0A0F2C' }}
    >
      {/* Royal Crest / Palace Silhouette */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-full border-2 border-amber-400/60 bg-purple-950/80 flex items-center justify-center text-4xl shadow-gold-glow mb-6"
      >
        🏛️
      </motion.div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-display font-bold text-amber-300 text-center mb-1">
        MYSURU DASARA 2026
      </h2>
      <p className="text-sm text-amber-400/80 font-kannada text-center mb-6">
        ಮೈಸೂರು ದಸರಾ ೨೦೨೬ • ಲೋಡಿಂಗ್ ಆಗುತ್ತಿದೆ...
      </p>

      {/* Shimmer Progress Indicator */}
      <div className="w-56 h-1 rounded-full overflow-hidden bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-200"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <p className="text-[11px] text-cream/50 mt-3 font-light">
        Loading royal heritage experience...
      </p>
    </div>
  );
}
