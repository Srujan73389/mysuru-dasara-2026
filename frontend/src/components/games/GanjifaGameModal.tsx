import React, { useState, useEffect } from 'react';
import { audioManager } from '@/audio/audioManager';

interface GanjifaCard {
  id: number;
  pairId: number;
  name: string;
  nameKn: string;
  icon: string;
  title: string;
  lore: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GANJIFA_AVATARS = [
  {
    pairId: 1,
    name: 'Matsya Avatar',
    nameKn: 'ಮತ್ಸ್ಯಾವತಾರ (ಮೀನು)',
    icon: '🐟',
    title: 'Divine Golden Fish',
    lore: 'Rescued the sacred Vedas from cosmic deluge. In Ganjifa, the Matsya suit represents purification.',
  },
  {
    pairId: 2,
    name: 'Kurma Avatar',
    nameKn: 'ಕೂರ್ಮಾವತಾರ (ಆಮೆ)',
    icon: '🐢',
    title: 'Cosmic Tortoise',
    lore: 'Supported Mount Mandara during Samudra Manthana to churn the elixir of immortality (Amrita).',
  },
  {
    pairId: 3,
    name: 'Varaha Avatar',
    nameKn: 'ವರಾಹಾವತಾರ (ಕಾಡುಹಂದಿ)',
    icon: '🐗',
    title: 'Earth Uplifter',
    lore: 'Rescued Mother Earth (Bhudevi) from the abyssal ocean. The emblem of the Vijayanagara Empire.',
  },
  {
    pairId: 4,
    name: 'Narasimha Avatar',
    nameKn: 'ನರಸಿಂಹಾವತಾರ (ಸಿಂಹ-ಮಾನವ)',
    icon: '🦁',
    title: 'Fierce Protector',
    lore: 'Emerged from the palace pillar to slay Prahlada’s tyrant father Hiranyakashipu.',
  },
  {
    pairId: 5,
    name: 'Sri Rama',
    nameKn: 'ಶ್ರೀ ರಾಮ (ದಶರಥ ನಂದನ)',
    icon: '🏹',
    title: 'Righteous Sovereign',
    lore: 'Embodied Dharma and righteousness; commemorated nationwide on Vijayadashami as victor over Ravana.',
  },
  {
    pairId: 6,
    name: 'Sri Krishna',
    nameKn: 'ಶ್ರೀ ಕೃಷ್ಣ (ಯದುಕುಲ ರತ್ನ)',
    icon: '🦚',
    title: 'Divine Charioteer',
    lore: 'The ancestral lineage of the Mysore Wadiyars traces back to the celestial Yadu dynasty of Sri Krishna.',
  },
];

interface GanjifaGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GanjifaGameModal({ isOpen, onClose }: GanjifaGameModalProps) {
  const [cards, setCards] = useState<GanjifaCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [recentLore, setRecentLore] = useState<string | null>(null);

  // Initialize and shuffle the 12 circular cards
  const initializeGame = () => {
    const deck: GanjifaCard[] = [];
    GANJIFA_AVATARS.forEach((av, idx) => {
      // Card 1 of pair
      deck.push({
        id: idx * 2,
        pairId: av.pairId,
        name: av.name,
        nameKn: av.nameKn,
        icon: av.icon,
        title: av.title,
        lore: av.lore,
        isFlipped: false,
        isMatched: false,
      });
      // Card 2 of pair
      deck.push({
        id: idx * 2 + 1,
        pairId: av.pairId,
        name: av.name,
        nameKn: av.nameKn,
        icon: av.icon,
        title: av.title,
        lore: av.lore,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setIsCompleted(false);
    setRecentLore(null);
    audioManager.playClickSound();
  };

  useEffect(() => {
    if (isOpen) {
      initializeGame();
    }
  }, [isOpen]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    audioManager.playClickSound();

    // Flip card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (updatedCards[firstIdx].pairId === updatedCards[secondIdx].pairId) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = [...updatedCards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatchedPairs((p) => p + 1);
          setScore((s) => s + 50);
          setRecentLore(matchedCards[firstIdx].lore);
          audioManager.playBellSound();

          if (matchedPairs + 1 === GANJIFA_AVATARS.length) {
            setIsCompleted(true);
            audioManager.playRoyalFanfare();
          }
        }, 400);
      } else {
        // NO MATCH - flip back
        setTimeout(() => {
          const resetCards = [...updatedCards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            MUMMADI KRISHNARAJA WADIYAR COURT TRADITION
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Mysore Ganjifa Royal Circular Card Game
          </h3>
          <p className="text-xs text-amber-300/80 font-kannada">
            ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಗಂಜೀಫಾ ಜೋಡಿ ಹೊಂದಾಣಿಕೆ ಆಟ
          </p>
        </div>

        {/* Score & Moves Bar */}
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-300">
              Moves: <strong className="text-white font-mono">{moves}</strong>
            </span>
            <span className="text-slate-300">
              Matched: <strong className="text-emerald-400 font-mono">{matchedPairs} / {GANJIFA_AVATARS.length}</strong>
            </span>
            <span className="text-slate-300">
              Score: <strong className="text-amber-400 font-mono">{score} Pts</strong>
            </span>
          </div>

          <button
            onClick={initializeGame}
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer"
          >
            🔄 Restart
          </button>
        </div>

        {/* Win Banner */}
        {isCompleted ? (
          <div className="p-6 bg-gradient-to-r from-purple-900/80 to-amber-900/80 rounded-2xl border border-amber-400 text-center space-y-3 shadow-royal animate-fadeIn">
            <span className="text-5xl block">🏆</span>
            <h4 className="text-lg font-black text-amber-300">Royal Victory in Mysore Ganjifa!</h4>
            <p className="text-xs text-slate-200 max-w-md mx-auto">
              You matched all 6 sacred royal Ganjifa pairs in <strong className="text-white">{moves} moves</strong>, earning <strong className="text-amber-300 font-bold">{score} Heritage Points</strong>!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={initializeGame}
                className="px-5 py-2 rounded-xl bg-amber-400 text-black text-xs font-black uppercase tracking-wider hover:bg-amber-300 cursor-pointer shadow-gold-glow"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* 12 Circular Cards Grid (4 cols x 3 rows) */
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
            {cards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 select-none shadow-lg ${
                  card.isFlipped || card.isMatched
                    ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-amber-200 text-black shadow-gold-glow scale-105'
                    : 'bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border-amber-400/40 text-amber-300 hover:border-amber-400 hover:scale-105'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <div className="text-center p-1">
                    <span className="text-2xl sm:text-3xl block leading-none">{card.icon}</span>
                    <p className="text-[9px] font-black uppercase tracking-tight text-black mt-1 leading-tight truncate max-w-[80px]">
                      {card.name.replace(' Avatar', '')}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-xl sm:text-2xl block text-amber-400/80">⚜️</span>
                    <span className="text-[8px] font-mono font-bold text-amber-300/70 uppercase">
                      GANJIFA
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Recently Unlocked Lore Card */}
        {recentLore && !isCompleted && (
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 animate-fadeIn space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
              📖 Royal Lore Unlocked:
            </span>
            <p className="text-[11px] leading-relaxed text-slate-200">{recentLore}</p>
          </div>
        )}
      </div>
    </div>
  );
}
