import React, { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';

interface GICraft {
  id: string;
  name: string;
  nameKn: string;
  tagline: string;
  category: 'textiles' | 'aromatics' | 'handicrafts' | 'agro';
  icon: string;
  giYear: string;
  history: string;
  uniqueness: string;
  patron: string;
  hallmark: string;
  officialOutlet: string;
  address: string;
  timing: string;
  color: string;
}

const MYSORE_GI_CRAFTS: GICraft[] = [
  {
    id: 'silk',
    name: 'Mysore Silk Sarees',
    nameKn: 'ಮೈಸೂರು ರೇಷ್ಮೆ ಸೀರೆಗಳು (ಕೆ.ಎಸ್.ಐ.ಸಿ)',
    tagline: '100% Pure Mulberry Silk with 0.65% Pure Gold & 65% Silver Zari',
    category: 'textiles',
    icon: '🧵',
    giYear: '2005 (GI Reg. #18)',
    history:
      'Established in 1912 by Maharaja Nalwadi Krishnaraja Wadiyar with 32 imported looms from Switzerland. It remains India’s only silk factory producing sarees with guaranteed gold and silver content verified by individual laser-embroidered micro-barcodes.',
    uniqueness:
      'Features high-twist natural mulberry crepe de chine weave that never creases, tested for 100-year longevity and passed down generations as royal family heirlooms.',
    patron: 'Maharaja Nalwadi Krishnaraja Wadiyar',
    hallmark: 'Unique Laser-embroidered Code + KSIC Government Hologram',
    officialOutlet: 'KSIC Mysore Silk Showroom & Factory Outlet',
    address: 'Mananthavady Road, Ashokapuram, Mysuru, Karnataka 570008',
    timing: '10:00 AM – 8:00 PM (Daily)',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'sandalwood',
    name: 'Mysore Sandalwood Oil & Soap',
    nameKn: 'ಮೈಸೂರು ಶ್ರೀಗಂಧದ ಎಣ್ಣೆ ಮತ್ತು ಸಾಬೂನು',
    tagline: 'The World’s Gold Standard of Pure Santalum Album Fragrance',
    category: 'aromatics',
    icon: '🪵',
    giYear: '2006 (GI Reg. #29)',
    history:
      'When World War I halted sandalwood exports to Europe in 1916, Sir M. Visvesvaraya and the Maharaja established the Government Sandalwood Oil Factory in Mysore. In 1918, chemist S.G. Sastry formulated the world-renowned Mysore Sandal Soap.',
    uniqueness:
      'Extracted from 30+ year mature heartwood, containing 90%+ natural santalol, possessing unparalleled calming, therapeutic, and aromatic persistence.',
    patron: 'Sir M. Visvesvaraya & Nalwadi Krishnaraja Wadiyar',
    hallmark: 'KSDL 100% Pure Sandalwood Oil Emblem & Mysore Sharabha Seal',
    officialOutlet: 'KSDL Government Sandalwood Factory Showroom',
    address: 'Kuvempunagar Road, Mysuru, Karnataka 570008',
    timing: '9:30 AM – 6:30 PM (Closed Sundays)',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'rosewood-inlay',
    name: 'Mysore Traditional Rosewood Inlay',
    nameKn: 'ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಶೀಶಂ ಕಾಷ್ಠ ಕೆತ್ತನೆ',
    tagline: 'Exquisite Intricate Woodcraft Depicting Royal Processions',
    category: 'handicrafts',
    icon: '🪑',
    giYear: '2005 (GI Reg. #24)',
    history:
      'Patronized during the reign of Maharaja Chamaraja Wadiyar IX in the late 19th century. Master craftsmen settled around Mandi Mohalla, evolving from ivory inlay to vibrant colored endemic woods like Jackfruit, Rosewood, and Sandalwood.',
    uniqueness:
      'Hand-chiseled into dark seasoned rosewood planks with microscopic precision, depicting the 400-year Dasara Jamboo Savari, Royal Durbar court, and wildlife.',
    patron: 'Maharaja Chamaraja Wadiyar IX',
    hallmark: 'Cauvery Handicrafts Craftmark & GI Certified Artisan Guild Mark',
    officialOutlet: 'Cauvery Arts & Crafts Emporium (Govt. of Karnataka)',
    address: 'Sayyaji Rao Road, Near K.R. Circle, Mysuru, Karnataka 570001',
    timing: '10:00 AM – 8:30 PM (Daily)',
    color: 'from-orange-600 to-amber-700',
  },
  {
    id: 'ganjifa',
    name: 'Mysore Ganjifa Royal Painted Cards',
    nameKn: 'ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಗಂಜೀಫಾ ಕಲೆ',
    tagline: 'Ancient Circular Playing Cards Codified in the Royal Court',
    category: 'handicrafts',
    icon: '🃏',
    giYear: '2008 (GI Reg. #83)',
    history:
      'Elevated into high court art by Maharaja Mummadi Krishnaraja Wadiyar (1794–1868), who documented complex 18-card and 144-card Dasavatara games in his encyclopedic Sanskrit masterwork "Kautuka Nidhi".',
    uniqueness:
      'Circular cards made from multiple layers of pasteboard, primed with tamarind seed powder and zinc white, painted with squirrel-hair brushes and 24-karat gold leaf foil.',
    patron: 'Maharaja Mummadi Krishnaraja Wadiyar',
    hallmark: 'Hand-signed Master Artist Monogram + Karnataka Lalithakala Seal',
    officialOutlet: 'Ramsons Kala Pratishtana Heritage Gallery',
    address: 'Opposite Mysore Palace Zoo Gate, Nazarbad, Mysuru',
    timing: '10:30 AM – 7:30 PM (Daily)',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'betel-leaf',
    name: 'Mysore Betel Leaf (ವೀಳೆಯದೆಲೆ)',
    nameKn: 'ಮೈಸೂರು ವಿಶಿಷ್ಟ ಸುವಾಸಿತ ವೀಳೆಯದೆಲೆ',
    tagline: 'Heart-Shaped Aromatic Leaves of Sacred Royal Hospitality',
    category: 'agro',
    icon: '🍃',
    giYear: '2006 (GI Reg. #31)',
    history:
      'Cultivated for over four centuries in the nutrient-dense fertile soils along the Cauvery and Kapila river basins. Historically presented to visiting ambassadors and royal guests during Dasara Vijaya Darbar.',
    uniqueness:
      'Extremely tender, thin, and glossy with a unique spicy-peppery yet sweet tingling taste, unmatched by any other betel leaf variety across the subcontinent.',
    patron: 'Wadiyar Royal Household & Agrahara Guilds',
    hallmark: 'Registered Mysuru Horticultural Society GI GI-31 Tag',
    officialOutlet: 'Devaraja Market Heritage Betel Bazaars',
    address: 'Sayyaji Rao Road, Central Mysuru (Stalls 42 to 78)',
    timing: '6:00 AM – 9:00 PM (Daily)',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'rasabale',
    name: 'Nanjangud Rasabale Banana',
    nameKn: 'ನಂಜನಗೂಡು ರಸಬಾಳೆ (ವಿಶ್ವವಿಖ್ಯಾತ ಹಣ್ಣು)',
    tagline: 'The King of Bananas with Unrivaled Ambrosial Scent',
    category: 'agro',
    icon: '🍌',
    giYear: '2005 (GI Reg. #28)',
    history:
      'Famed in classical Kannada literature. Thrives exclusively in the unique black clay soil and warm humid microclimate along the banks of the sacred Kapila River in Nanjangud, 20 km from Mysuru.',
    uniqueness:
      'Distinctive golden-yellow slender skin, melting pulp with rich honey-like aroma, and high digestive and therapeutic properties.',
    patron: 'Sri Srikanteshwara Temple & Wadiyar Rulers',
    hallmark: 'Horticultural Producers Co-operative Marketing Society (HOPCOMS)',
    officialOutlet: 'Mysore HOPCOMS Outlets & Devaraja Fruit Stalls',
    address: 'Curzon Park HOPCOMS Center, Near Palace North Gate, Mysuru',
    timing: '8:00 AM – 8:00 PM (Daily)',
    color: 'from-yellow-300 to-amber-500',
  },
];

export default function GICraftsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCraft, setSelectedCraft] = useState<GICraft>(MYSORE_GI_CRAFTS[0]);

  const filteredCrafts = MYSORE_GI_CRAFTS.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Mysore Geographical Indication (GI) Crafts & Artisans"
        titleKn="ಮೈಸೂರು ಭೌಗೋಳಿಕ ಮಾನ್ಯತೆ (ಜಿಐ) ಕರಕುಶಲ ಕಲೆಗಳು"
        subtitle="Explore the 6 world-famous GI certified royal crafts of Mysuru — from 100% gold-zari Mysore Silk and pure Sandalwood to historic Ganjifa cards and traditional Rosewood inlay."
      />

      {/* Top GI Overview Banner */}
      <div className="glass-dark p-6 rounded-3xl border-2 border-amber-400/40 shadow-royal mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase">
              GOVERNMENT OF INDIA GEOGRAPHICAL INDICATION REGISTRY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            The Cultural & Artisanal Heritage of Mysuru
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            A Geographical Indication (GI) certifies that a product possesses specific qualities and reputation originating from Mysuru's unique terroir, 400-year royal patronage, and generational artisan mastery.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <div>
            <p className="text-3xl font-black text-amber-400 font-mono">6</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">GI Certified Crafts</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-3xl font-black text-emerald-400 font-mono">100%</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Guaranteed Pure</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-3xl font-black text-cyan-300 font-mono">1912</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Royal Origins</p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'all', label: 'All 6 GI Crafts' },
            { id: 'textiles', label: '🧵 Textiles (Silk)' },
            { id: 'aromatics', label: '🪵 Aromatics (Sandalwood)' },
            { id: 'handicrafts', label: '🪑 Inlay & Ganjifa' },
            { id: 'agro', label: '🍃 Agro (Betel & Banana)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                audioManager.playClickSound();
              }}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-black shadow-gold-glow font-black'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Crafts Selector, Right Deep-Dive Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Craft Cards Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCrafts.map((craft) => (
            <div
              key={craft.id}
              onClick={() => {
                setSelectedCraft(craft);
                audioManager.playClickSound();
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedCraft.id === craft.id
                  ? 'glass-dark border-amber-400 shadow-royal scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${craft.color} flex items-center justify-center text-2xl shadow-gold-glow shrink-0`}
                >
                  {craft.icon}
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                    {craft.giYear}
                  </span>
                  <h4 className="text-sm font-black text-white truncate">{craft.name}</h4>
                  <p className="text-xs text-amber-400/90 font-kannada truncate">{craft.nameKn}</p>
                </div>
              </div>

              <span className="text-amber-400 text-sm font-bold">
                {selectedCraft.id === craft.id ? '●' : '→'}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column: Active Craft Full Dossier & Emporium Guide (7 cols) */}
        <div className="lg:col-span-7 glass-dark p-6 sm:p-8 rounded-3xl border-2 border-amber-400/50 shadow-royal space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-black uppercase tracking-wider">
                  {selectedCraft.giYear}
                </span>
                <span className="text-xs text-slate-400">• Authenticated Heritage Product</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-wide">{selectedCraft.name}</h3>
              <p className="text-sm text-amber-300 font-kannada font-bold mt-0.5">
                {selectedCraft.nameKn}
              </p>
              <p className="text-xs text-slate-300 italic mt-1.5">{selectedCraft.tagline}</p>
            </div>

            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedCraft.color} flex items-center justify-center text-3xl shadow-gold-glow shrink-0`}
            >
              {selectedCraft.icon}
            </div>
          </div>

          {/* History & Royal Origins */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>📖 Royal History & Patronage</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedCraft.history}</p>
            <p className="text-[11px] text-amber-300">
              Royal Patron: <strong>{selectedCraft.patron}</strong>
            </p>
          </div>

          {/* Craft Uniqueness */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>✨ GI Distinctive Hallmark & Terroir</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">{selectedCraft.uniqueness}</p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-emerald-300 font-mono mt-1">
              ✓ Authenticity Hallmark: {selectedCraft.hallmark}
            </div>
          </div>

          {/* Government Emporium & Buying Guide */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-amber-400/30 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️ Verified Government Outlet (Avoid Fakes)</span>
            </h4>
            <p className="text-xs font-bold text-white">{selectedCraft.officialOutlet}</p>
            <p className="text-[11px] text-slate-300">📍 {selectedCraft.address}</p>
            <p className="text-[11px] text-slate-400 font-mono">🕒 {selectedCraft.timing}</p>

            <div className="pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedCraft.officialOutlet + ' ' + selectedCraft.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-all shadow-gold-glow cursor-pointer"
              >
                <span>🗺️</span>
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
