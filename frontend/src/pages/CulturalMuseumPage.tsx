import React, { useEffect, useState, useMemo, useRef } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { heritageAPI } from '@/services/api';
import { audioManager } from '@/audio/audioManager';
import GanjifaGameModal from '@/components/games/GanjifaGameModal';

export interface CulturalExhibit {
  id: number | string;
  name: string;
  name_kn: string;
  category: 'dance' | 'theatre' | 'craft' | 'music' | 'costume';
  region: string;
  region_kn: string;
  era: string;
  era_kn: string;
  badge: string;
  badge_kn: string;
  instruments: string;
  instruments_kn: string;
  icon: string;
  color: string;
  soundType: 'drum' | 'fanfare' | 'bell' | 'nadaswara';
  description: string;
  description_kn: string;
  significance: string;
  significance_kn: string;
}

const COMPREHENSIVE_EXHIBITS: CulturalExhibit[] = [
  {
    id: 1,
    name: 'Dollu Kunitha (Drum Dance)',
    name_kn: 'ಡೊಳ್ಳು ಕುಣಿತ (ವೀರ ನೃತ್ಯ)',
    category: 'dance',
    region: 'Shivamogga, Mandya, Mysuru',
    region_kn: 'ಶಿವಮೊಗ್ಗ, ಮಂಡ್ಯ, ಮೈಸೂರು',
    era: 'Ancient Kuruba Pastoral Tradition',
    era_kn: 'ಪ್ರಾಚೀನ ಕುರುಬ ಜನಾಂಗದ ಸಂಪ್ರದಾಯ',
    badge: 'Sacred Martial Folk',
    badge_kn: 'ವೀರ ಜಾನಪದ ಕಲೆ',
    instruments: 'Heavy Dollu Drums, Tala Cymbals, Flute',
    instruments_kn: 'ದೊಡ್ಡ ಡೊಳ್ಳು, ತಾಳ, ಕೊಳಲು',
    icon: '🥁',
    color: 'from-amber-600/30 to-rose-950/40',
    soundType: 'drum',
    description: 'High-energy ritual percussion dance dedicated to deity Beereshwara. Performers beat large drums (Dollu) slung across their chests while executing acrobatic leaps, synchronized circular formations, and thunderous rhythms that echo across Mysuru streets.',
    description_kn: 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಗಂಡುಕಲೆಯಾದ ಡೊಳ್ಳು ಕುಣಿತ. ಬೀರೇಶ್ವರನ ಆರಾಧನೆಯೊಂದಿಗೆ ವೀರಾವೇಶದಿಂದ ಡೊಳ್ಳು ಬಾರಿಸುತ್ತಾ ಮಾಡುವ ಅದ್ಭುತ ನೃತ್ಯ. ದಸರಾ ಜಂಬೂಸವಾರಿಯ ಮುಂಚೂಣಿಯಲ್ಲಿ ಈ ಕಲಾತಂಡಗಳು ಮೆರವಣಿಗೆಗೆ ಅದ್ಭುತ ಚೈತನ್ಯ ತುಂಬುತ್ತವೆ.',
    significance: 'Symbolizes primal vitality and spiritual devotion to Lord Shiva and Beereshwara.',
    significance_kn: 'ಶಿವ ಹಾಗೂ ಬೀರೇಶ್ವರನ ಶಕ್ತಿ ಮತ್ತು ಭಕ್ತಿಯ ಸಂಕೇತವಾಗಿರುವ ಪವಿತ್ರ ಜಾನಪದ ನೃತ್ಯ.',
  },
  {
    id: 2,
    name: 'Yakshagana Folk Theatre',
    name_kn: 'ಯಕ್ಷಗಾನ ರಂಗಕಲೆ',
    category: 'theatre',
    region: 'Coastal Karnataka & Malenadu',
    region_kn: 'ಕರಾವಳಿ ಹಾಗೂ ಮಲೆನಾಡು',
    era: '16th Century Vijayanagara Era',
    era_kn: '೧೬ನೇ ಶತಮಾನದ ವಿಜಯನಗರ ಕಾಲ',
    badge: 'Classical Folk Opera',
    badge_kn: 'ವಿಶ್ವಪ್ರಸಿದ್ಧ ರಂಗಕಲೆ',
    instruments: 'Chende drum, Maddale, Talam (Cymbals)',
    instruments_kn: 'ಚಂಡೆ, ಮದ್ದಳೆ, ಜಾಗಟೆ',
    icon: '🎭',
    color: 'from-purple-900/30 to-amber-950/40',
    soundType: 'drum',
    description: 'Centuries-old theatrical marvel combining layered costumes, towering gilded headdresses (Muguta), vivid facial makeup, operatic Bhagavata singing, and extempore philosophical dialogue portraying epic tales from the Mahabharata and Ramayana.',
    description_kn: 'ಕರಾವಳಿ ಹಾಗೂ ಮಲೆನಾಡಿನ ವಿಶ್ವಪ್ರಸಿದ್ಧ ರಂಗಕಲೆ. ವಿಶಿಷ್ಟ ಕಿರೀಟ (ಮುಗುಟ), ವರ್ಣರಂಜಿತ ಮುಖವರ್ಣಿಕೆ, ಭಾಗವತರ ಗಾಯನ ಮತ್ತು ವಾಗ್ವೈಖರಿಯಿಂದ ಕೂಡಿದ ಮಹಾಭಾರತ-ರಾಮಾಯಣ ಪ್ರಸಂಗಗಳ ಅದ್ಭುತ ಪ್ರದರ್ಶನ.',
    significance: 'Preserves ancient Sanskrit drama aesthetics blended seamlessly with high-octane folk percussion.',
    significance_kn: 'ಭಾರತೀಯ ಪುರಾಣ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಕಲಾತ್ಮಕ ರಂಗಪರಂಪರೆಯ ಸಜೀವ ಪ್ರತೀಕ.',
  },
  {
    id: 3,
    name: 'Veeragase Martial Dance',
    name_kn: 'ವೀರಗಾಸೆ ವೀರಭದ್ರ ನರ್ತನ',
    category: 'dance',
    region: 'Chitradurga, Ballari, Mysuru',
    region_kn: 'ಚಿತ್ರದುರ್ಗ, ಬಳ್ಳಾರಿ, ಮೈಸೂರು',
    era: 'Vedic Shaivite Tradition',
    era_kn: 'ವೈದಿಕ ಶೈವ ಸಂಪ್ರದಾಯ',
    badge: 'Martial Devotion',
    badge_kn: 'ವೀರ ನೃತ್ಯ',
    instruments: 'Halage, Sambala drums, Brass cymbals',
    instruments_kn: 'ಹಲಗೆ, ಸಂಬಾಳ, ಕರಡೆ',
    icon: '⚔️',
    color: 'from-red-900/30 to-amber-950/40',
    soundType: 'drum',
    description: 'Ferocious, valor-filled ritual dance of the Jangama community commemorating the cosmic lore of Veerabhadra. Dancers carry ceremonial swords, adorned with bright crimson turbans, rudraksha beads, and sacred vibhuti markings while performing rapid battle steps.',
    description_kn: 'ಶಿವನ ಅವತಾರವಾದ ವೀರಭದ್ರನ ಕಥಾನಕವನ್ನು ವೀರಾವೇಶದಿಂದ ಪ್ರದರ್ಶಿಸುವ ಜಾನಪದ ವೀರನೃತ್ಯ. ಕೈಯಲ್ಲಿ ಕತ್ತಿ ಹಿಡಿದು, ಕೆಂಪು ರುಮಾಲು ಮತ್ತು ರುದ್ರಾಕ್ಷಿ ಧರಿಸಿ ಮಾಡುವ ನೃತ್ಯವು ಮೈನವಿರೇಳಿಸುತ್ತದೆ.',
    significance: 'Commemorates the triumph of divine righteousness over arrogance during Daksha Yajna.',
    significance_kn: 'ದಕ್ಷಯಜ್ಞ ಧ್ವಂಸ ಹಾಗೂ ಅಧರ್ಮದ ವಿರುದ್ಧ ಧರ್ಮದ ವಿಜಯವನ್ನು ಸಾರುವ ವೀರಕಲೆ.',
  },
  {
    id: 4,
    name: 'Pooja Kunitha (Sacred Balance)',
    name_kn: 'ಪೂಜಾ ಕುಣಿತ (ಶಕ್ತಿ ಆರಾಧನೆ)',
    category: 'dance',
    region: 'Mandya, Mysuru, Bengaluru Rural',
    region_kn: 'ಮಂಡ್ಯ, ಮೈಸೂರು, ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
    era: 'Chola & Hoysala Temple Era',
    era_kn: 'ಚೋಳ ಮತ್ತು ಹೊಯ್ಸಳ ಕಾಲ',
    badge: 'Sacred Folk Rite',
    badge_kn: 'ದೈವೀ ಸಮತೋಲನ ಕಲೆ',
    instruments: 'Tamte, Nagari drums, Wind pipes',
    instruments_kn: 'ತಮಟೆ, ನಗಾರಿ, ವಾದ್ಯ',
    icon: '🌺',
    color: 'from-amber-600/30 to-emerald-950/40',
    soundType: 'bell',
    description: 'Mesmerizing worship dance where performers balance tall, ornate multi-tiered wooden frames crowned with brass deity masks atop their heads without using their hands, stepping in precise geometric rhythm.',
    description_kn: 'ತಲೆಯ ಮೇಲೆ ದೇವತೆಯ ಮುಖವಾಡವಿರುವ ೫ ಅಡಿ ಎತ್ತರದ ಬಿದಿರಿನ ಚೌಕಟ್ಟನ್ನು ಹೊತ್ತು, ಕೈ ಬಿಟ್ಟು ಸಮತೋಲನದಿಂದ ನೃತ್ಯ ಮಾಡುವ ನಯನಮನೋಹರ ಆರಾಧನಾ ಕಲೆ.',
    significance: 'Exemplifies supreme balance, devotion, and reverence toward the Divine Mother.',
    significance_kn: 'ಗ್ರಾಮದೇವತೆಗಳ ಪ್ರಸನ್ನತೆಗಾಗಿ ಶ್ರದ್ಧಾಭಕ್ತಿಗಳಿಂದ ಮಾಡುವ ಪವಿತ್ರ ನೃತ್ಯ.',
  },
  {
    id: 5,
    name: 'Kamsale Nritya (Brass Cymbal Dance)',
    name_kn: 'ಕಂಸಾಳೆ ನೃತ್ಯ',
    category: 'dance',
    region: 'Male Mahadeshwara Hills, Kollegala',
    region_kn: 'ಮಲೆ ಮಹದೇಶ್ವರ ಬೆಟ್ಟ, ಕೊಳ್ಳೇಗಾಲ',
    era: '12th Century Mahadeshwara Lore',
    era_kn: '೧೨ನೇ ಶತಮಾನದ ಮಹದೇಶ್ವರ ಪರಂಪರೆ',
    badge: 'Devotional Percussion',
    badge_kn: 'ಭಕ್ತಿಪೂರ್ವಕ ಕಂಸಾಳೆ',
    instruments: 'Pair of Heavy Bronze Kamsale Cymbals',
    instruments_kn: 'ಕಂಚಿನ ಕಂಸಾಳೆ ತಾಳಗಳು',
    icon: '🔔',
    color: 'from-amber-500/30 to-orange-950/40',
    soundType: 'bell',
    description: 'Unique devotional percussion dance performed exclusively by devotees of Lord Male Mahadeshwara. Dancers clash heavy bell-metal bronze cymbals together in lightning-fast acrobatic patterns over and under their limbs.',
    description_kn: 'ಮಲೆ ಮಹದೇಶ್ವರನ ಭಕ್ತರಾದ ದೇವಗುಡ್ಡರು ಕಂಚಿನ ಕಂಸಾಳೆಗಳನ್ನು ಪರಸ್ಪರ ತಟ್ಟುತ್ತಾ, ನೆಗೆಯುತ್ತಾ ಮಾಡುವ ಭಕ್ತಿಪರವಶತೆಯ ನೃತ್ಯ. ವೇಗವಾದ ತಾಳ ಮತ್ತು ಅದ್ಭುತ ಲಯಬದ್ಧ ಚಲನೆ ಇದರ ವೈಶಿಷ್ಟ್ಯ.',
    significance: 'Sacred chanting and athletic cymbal striking dedicated to eternal Shaivite divinity.',
    significance_kn: 'ಮಹದೇಶ್ವರನ ಪವಾಡಗಳನ್ನು ಕೊಂಡಾಡುವ ಸಮ್ಮೋಹಕ ನಾದ ನೃತ್ಯ.',
  },
  {
    id: 6,
    name: 'Somana Kunitha (Spiritual Masks)',
    name_kn: 'ಸೋಮನ ಕುಣಿತ',
    category: 'dance',
    region: 'Kaveri Basin (Mysuru, Hassan, Mandya)',
    region_kn: 'ಕಾವೇರಿ ಜಲಾನಯನ ಪ್ರದೇಶ (ಹಾಸನ, ಮಂಡ್ಯ)',
    era: 'Ganga & Hoysala Periods',
    era_kn: 'ಗಂಗ ಮತ್ತು ಹೊಯ್ಸಳರ ಕಾಲ',
    badge: 'Guardian Spirit Dance',
    badge_kn: 'ಗ್ರಾಮ ರಕ್ಷಣಾ ನೃತ್ಯ',
    instruments: 'Dudi, Arevadyam, Horns',
    instruments_kn: 'ದುಡಿ, ಅರೆವಾದ್ಯ, ಕೊಂಬು',
    icon: '👺',
    color: 'from-rose-900/30 to-purple-950/40',
    soundType: 'drum',
    description: 'Guardian spirit dance where performers don gigantic carved sacred wooden masks (Kempu Soma and Hasi Soma). The masks are sculpted from sacred Indian Cork tree wood and decorated with colorful silk strips.',
    description_kn: 'ಕೆಂಪು ಸೋಮ ಮತ್ತು ಹಸಿ ಸೋಮ ಎಂಬ ದೈವಿಕ ಮುಖವಾಡಗಳನ್ನು ಧರಿಸಿ ಗ್ರಾಮದ ಒಳಿತಿಗಾಗಿ ನರ್ತಿಸುವ ರಕ್ಷಣಾತ್ಮಕ ಕಲೆ. ದಸರಾ ಮೆರವಣಿಗೆಯಲ್ಲಿ ದುಷ್ಟಶಕ್ತಿ ನಿವಾರಣೆಯ ಸಂಕೇತವಾಗಿ ಇದು ಕಣ್ಮನ ಸೆಳೆಯುತ್ತದೆ.',
    significance: 'Protects the realm against evil spirits and heralds agricultural abundance.',
    significance_kn: 'ಗ್ರಾಮಗಳ ರಕ್ಷಣೆ ಮತ್ತು ಸುಭಿಕ್ಷೆಗಾಗಿ ನಡೆಸುವ ಪುರಾತನ ಆಚರಣೆ.',
  },
  {
    id: 7,
    name: 'Goravara Kunitha (Mylara Lore)',
    name_kn: 'ಗೊರವರ ಕುಣಿತ',
    category: 'dance',
    region: 'Haveri, Ballari, Tumakuru',
    region_kn: 'ಹಾವೇರಿ, ಬಳ್ಳಾರಿ, ತುಮಕೂರು',
    era: 'Karnata Folk Shaivite Heritage',
    era_kn: 'ಪ್ರಾಚೀನ ಜಾನಪದ ಶೈವ ಪರಂಪರೆ',
    badge: 'Mystic Folk Dance',
    badge_kn: 'ಅಧ್ಯಾತ್ಮಿಕ ಜಾನಪದ ಕಲೆ',
    instruments: 'Damaru (Hourglass drum), Pillangovi (Flute)',
    instruments_kn: 'ಡಮರು, ಪಿಳ್ಳಂಗೋವಿ, ಘಂಟೆ',
    icon: '🪕',
    color: 'from-slate-800/40 to-amber-950/40',
    soundType: 'drum',
    description: 'Mystic dance performed by devotees of Lord Mylara Linga dressed in distinctive black woollen coats, towering bearskin caps, yellow turmeric powder markings, holding a sacred bone damaru and brass bell.',
    description_kn: 'ಮೈಲಾರಲಿಂಗನ ಭಕ್ತರಾದ ಗೊರವರು ಕರಡಿಯ ಕೂದಲಿನ ಟೋಪಿ, ಕಪ್ಪು ಕಂಬಳಿ, ಡಮರು ಮತ್ತು ಪಿಳ್ಳಂಗೋವಿ ಹಿಡಿದು ಭಕ್ತಿಯಿಂದ ಕುಣಿಯುವ ವಿಶಿಷ್ಟ ಆಧ್ಯಾತ್ಮಿಕ ಕಲೆ.',
    significance: 'Transcends earthly vanity through ascetic devotion and trance-like chanting.',
    significance_kn: 'ಭಕ್ತಿಪರವಶತೆ ಮತ್ತು ಭವಬಂಧನ ಮುಕ್ತಿಯನ್ನು ಸಾರುವ ಅಧ್ಯಾತ್ಮ ನರ್ತನ.',
  },
  {
    id: 8,
    name: 'Garudi Gombe (Giant Folk Puppets)',
    name_kn: 'ಗಾರುಡಿ ಗೊಂಬೆ',
    category: 'theatre',
    region: 'Ramanagara, Mysuru, Mandya',
    region_kn: 'ರಾಮನಗರ, ಮೈಸೂರು, ಮಂಡ್ಯ',
    era: '18th Century Village Dasara',
    era_kn: '೧೮ನೇ ಶತಮಾನದ ಗ್ರಾಮೀಣ ದಸರಾ',
    badge: 'Procession Landmark',
    badge_kn: 'ಮೆರವಣಿಗೆಯ ಮಹಾ ಗೊಂಬೆಗಳು',
    instruments: 'Tamte, Dholak, Whistle accompaniment',
    instruments_kn: 'ತಮಟೆ, ಢೋಲಕ್, ಸಿಳ್ಳೆ',
    icon: '🎎',
    color: 'from-amber-600/30 to-blue-950/40',
    soundType: 'drum',
    description: 'Enchanting 12-foot giant hollow puppets crafted from light bamboo frames and papier-mache heads. Dancers slip inside these magnificent giants and swirl rhythmically ahead of royal floats.',
    description_kn: 'ಬಿದಿರಿನ ಚೌಕಟ್ಟು ಮತ್ತು ಕಾಗದದ ತಿರುಳಿನಿಂದ ಮಾಡಿದ ೧೦-೧೨ ಅಡಿ ಎತ್ತರದ ಬೃಹತ್ ಗೊಂಬೆಗಳು. ಕಲಾವಿದರು ಗೊಂಬೆಯ ಒಳಗೆ ನಿಂತು ತಾಳಕ್ಕೆ ತಕ್ಕಂತೆ ಹೆಜ್ಜೆಹಾಕುತ್ತಾ ಜನರನ್ನು ರಂಜಿಸುತ್ತಾರೆ.',
    significance: 'Brings folklore giants and guardian deities to life in the grand Vijayadashami carnival.',
    significance_kn: 'ದಸರಾ ಮೆರವಣಿಗೆಗೆ ಅಪೂರ್ವ ಸಡಗರ ಮತ್ತು ಹಬ್ಬದ ರಂಗು ತರುವ ಮಹಾಕಲೆ.',
  },
  {
    id: 9,
    name: 'Mysore Traditional Gold Leaf Painting',
    name_kn: 'ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಚಿತ್ರಕಲೆ',
    category: 'craft',
    region: 'Mysuru Royal Workshops',
    region_kn: 'ಮೈಸೂರು ರಾಜಮನೆತನ',
    era: 'Vijayanagara & Raja Wadiyar (1578)',
    era_kn: 'ವಿಜಯನಗರ ಮತ್ತು ರಾಜ ಒಡೆಯರ್ ಕಾಲ',
    badge: 'GI Tagged Mastercraft',
    badge_kn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ರಾಜಕಲೆ',
    instruments: 'Gesso embossed paste, 24K Pure Gold Foil',
    instruments_kn: 'ಗೆಸ್ಸೋ ಪೇಸ್ಟ್, ೨೪ ಕ್ಯಾರೆಟ್ ಚಿನ್ನದ ತಗಡು',
    icon: '🎨',
    color: 'from-amber-500/30 to-yellow-950/40',
    soundType: 'bell',
    description: 'Renowned classical painting style patronized by the Wadiyar dynasty. Utilizes natural gesso relief embossing covered in pure 24-carat gold leaf foil (Varaka) and semi-precious gems depicting Hindu deities with divine grace.',
    description_kn: 'ಒಡೆಯರ್ ಆಸ್ಥಾನದಲ್ಲಿ ಉಚ್ಛ್ರಾಯ ಸ್ಥಿತಿ ತಲುಪಿದ ಶುದ್ಧ ಚಿನ್ನದ ತಗಡು ಹಾಗೂ ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳ ಸೂಕ್ಷ್ಮ ಕೆತ್ತನೆಯ ಶಾಸ್ತ್ರೀಯ ಕಲೆ. ಚಾಮುಂಡೇಶ್ವರಿ ಹಾಗೂ ಕೃಷ್ಣನ ಚಿತ್ರಗಳು ಜೀವಕಳೆ ತುಂಬಿ ನಿಲ್ಲುತ್ತವೆ.',
    significance: 'Enduring luster that retains its gold gleam for centuries without fading.',
    significance_kn: 'ನೂರಾರು ವರ್ಷಗಳ ಕಾಲ ತನ್ನ ಚಿನ್ನದ ಮೆರುಗನ್ನು ಕಳೆದುಕೊಳ್ಳದ ಅದ್ಭುತ ಕಲಾ ಪರಂಪರೆ.',
  },
  {
    id: 10,
    name: 'Mysore Silk & Gold Zari Weaving',
    name_kn: 'ಮೈಸೂರು ರೇಷ್ಮೆ ಮತ್ತು ಅಪರಂಜಿ ಜರಿ',
    category: 'craft',
    region: 'Mysuru & KSIC Heritage Looms',
    region_kn: 'ಮೈಸೂರು ಕೆ.ಎಸ್.ಐ.ಸಿ ನೇಕಾರಿಕೆ',
    era: 'Founded 1912 by Nalvadi Krishnaraja Wadiyar',
    era_kn: '೧೯೧೨ ರಲ್ಲಿ ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ ಸ್ಥಾಪನೆ',
    badge: 'GI Tagged Heritage Silk',
    badge_kn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ರೇಷ್ಮೆ',
    instruments: 'Jacquard Drop-Box Looms, Pure Silver Zari',
    instruments_kn: 'ಜಾಕ್ವಾರ್ಡ್ ಮಗ್ಗ, ಶುದ್ಧ ಬೆಳ್ಳಿ-ಚಿನ್ನದ ಜರಿ',
    icon: '🧵',
    color: 'from-rose-900/30 to-amber-950/40',
    soundType: 'fanfare',
    description: 'World-famous royal silk weaving established by Maharaja Nalvadi Krishnaraja Wadiyar. Crafted from 100% pure mulberry silk and electroplated with pure gold and silver zari (0.65% real gold, 65% silver).',
    description_kn: 'ಶುದ್ಧ ಹಿಪ್ಪುನೇರಳೆ ರೇಷ್ಮೆ ಹಾಗೂ ಅಪರಂಜಿ ಚಿನ್ನ-ಬೆಳ್ಳಿಯ ಜರಿಯಿಂದ ನೇಯ್ದ ಜಗತ್ಪ್ರಸಿದ್ಧ ಮೈಸೂರು ಸಿಲ್ಕ್ ಸೀರೆಗಳು. ಪ್ರತಿಯೊಂದು ಸೀರೆಯೂ ವಿಶಿಷ್ಟ ಕೋಡ್ ಮತ್ತು ಅಧಿಕೃತ ಜಿಐ ಗುರುತನ್ನು ಹೊಂದಿರುತ್ತದೆ.',
    significance: 'The definitive royal textile worn by Mysore queens and dignitaries for ceremonial darbars.',
    significance_kn: 'ವಿಶ್ವವೇ ಮೆಚ್ಚಿದ ಕರ್ನಾಟಕದ ಹೆಮ್ಮೆಯ ರೇಷ್ಮೆ ರಾಜವಸ್ತ್ರ.',
  },
  {
    id: 11,
    name: 'Channapatna Wooden Toys',
    name_kn: 'ಚನ್ನಪಟ್ಟಣ ಮರದ ಆಟಿಕೆಗಳು',
    category: 'craft',
    region: 'Channapatna (Gombegala Ooru)',
    region_kn: 'ಚನ್ನಪಟ್ಟಣ (ಗೊಂಬೆಗಳ ಊರು)',
    era: 'Tipu Sultan Era & Persian Artisan Guilds',
    era_kn: 'ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ಹಾಗೂ ಪರ್ಷಿಯನ್ ಕಲೆ',
    badge: 'GI Tagged Eco-Craft',
    badge_kn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ಪರಿಸರಸ್ನೇಹಿ ಆಟಿಕೆ',
    instruments: 'Ivory Wood (Aale Mara), Vegetable Dyes',
    instruments_kn: 'ಹಾಲೆ ಮರ, ನೈಸರ್ಗಿಕ ತರಕಾರಿ ಬಣ್ಣಗಳು',
    icon: '🪀',
    color: 'from-emerald-900/30 to-amber-950/40',
    soundType: 'bell',
    description: 'Charming lacquerware toys hand-turned on wooden lathes from soft Ivory Wood (Wrightia tinctoria). Polished using natural organic vegetable dyes (turmeric, indigo, kumkum) with zero chemicals, safe for children worldwide.',
    description_kn: 'ಹಾಲೆ ಮರದಿಂದ ಕೊರೆದು ನೈಸರ್ಗಿಕ ತರಕಾರಿ ಬಣ್ಣಗಳಿಂದ ತಯಾರಾಗುವ ಪರಿಸರಸ್ನೇಹಿ ಲಕ್ವರ್ ಗೊಂಬೆಗಳು. ವಿಶ್ವಸಂಸ್ಥೆ ಮತ್ತು ಜಾಗತಿಕ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಭಾರತದ ಹೆಮ್ಮೆಯ ಕರಕುಶಲ ಕಲೆ.',
    significance: 'UNESCO recognized eco-friendly traditional craftsmanship protecting childhood wonder.',
    significance_kn: 'ವಿಷಕಾರಿ ರಾಸಾಯನಿಕಗಳಿಲ್ಲದ ಕರ್ನಾಟಕದ ನೈಸರ್ಗಿಕ ಆಟಿಕೆ ಪರಂಪರೆ.',
  },
  {
    id: 12,
    name: 'Bidriware Silver Inlay Metalwork',
    name_kn: 'ಬಿದ್ರಿ ಬೆಳ್ಳಿ ಕೆತ್ತನೆ ಕಲೆ',
    category: 'craft',
    region: 'Bidar, Northern Karnataka',
    region_kn: 'ಬೀದರ್, ಉತ್ತರ ಕರ್ನಾಟಕ',
    era: '14th Century Bahmani Sultanate',
    era_kn: '೧೪ನೇ ಶತಮಾನದ ಬಹಮನಿ ಸಾಮ್ರಾಜ್ಯ',
    badge: 'GI Tagged Damascene',
    badge_kn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ಲೋಹ ಕಲೆ',
    instruments: 'Zinc-Copper Alloy, Pure Silver Wire Inlay',
    instruments_kn: 'ಸತು-ತಾಮ್ರ ಮಿಶ್ರಲೋಹ, ಶುದ್ಧ ಬೆಳ್ಳಿ ತಂತಿ',
    icon: '🏺',
    color: 'from-slate-900/40 to-cyan-950/40',
    soundType: 'bell',
    description: 'Striking metal handicraft from Bidar where lustrous pure silver sheets and wires are hammered into hand-chiseled grooves on a blackened zinc-copper alloy, darkened using ancient soil from the Bidar Fort.',
    description_kn: 'ಬೀದರ್ ಕೋಟೆಯ ಮಣ್ಣಿನ ರಾಸಾಯನಿಕ ಗುಣದಿಂದ ಕಪ್ಪಾಗಿಸಿದ ಸತು-ತಾಮ್ರದ ಮಿಶ್ರಲೋಹದ ಮೇಲೆ ಶುದ್ಧ ಬೆಳ್ಳಿಯ ತಂತಿಗಳನ್ನು ಜಡಿದು ಮಾಡುವ ಅದ್ಭುತ ಕರಕುಶಲ ಕಲೆ.',
    significance: 'Historic Indo-Persian metallurgical mastery that produces permanently jet-black contrast.',
    significance_kn: 'ಜಗತ್ತಿನಲ್ಲೇ ಅಪರೂಪದ ಬೆಳ್ಳಿ-ಲೋಹ ಸಮ್ಮಿಲನದ ರಾಯಲ್ ಕಲಾಕೃತಿಗಳು.',
  },
  {
    id: 13,
    name: 'Kinnal Golden Wood Carving',
    name_kn: 'ಕಿನ್ನಾಳ ಕಲೆ (ಕೊಪ್ಪಳ)',
    category: 'craft',
    region: 'Kinnal, Koppal District',
    region_kn: 'ಕಿನ್ನಾಳ, ಕೊಪ್ಪಳ ಜಿಲ್ಲೆ',
    era: 'Vijayanagara Empire Architecture Heritage',
    era_kn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಕಾಲ',
    badge: 'GI Tagged Wood Sculpture',
    badge_kn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ಮರದ ಕಲೆ',
    instruments: 'Polki wood, Tamarind seed gesso paste',
    instruments_kn: 'ಪೊನ್ಕಿ ಮರ, ಹುಣಸೆ ಬೀಜದ ಅಂಟು ಪೇಸ್ಟ್',
    icon: '🪵',
    color: 'from-amber-600/30 to-red-950/40',
    soundType: 'bell',
    description: 'Exquisite wooden craft from Koppal where artisans fashion lightweight Polki wood into divine idols, birds, and Dasara cradle toys. Surfaces are prepared with tamarind-seed paste and highlighted with glowing golden enamel.',
    description_kn: 'ವಿಜಯನಗರ ಕಾಲದ ಮರದ ಕೆತ್ತನೆಯ ಪರಂಪರೆ. ಹುಣಸೆ ಬೀಜದ ಪೇಸ್ಟ್ ಬಳಸಿ ಹಗುರವಾದ ಮರದಿಂದ ದೇವತಾ ಮೂರ್ತಿಗಳು ಮತ್ತು ವರ್ಣರಂಜಿತ ತೊಟ್ಟಿಲುಗಳನ್ನು ನಿರ್ಮಿಸುವ ಕಲೆ.',
    significance: 'Preserved by the Chitragar artisan community across 15 generations of unbroken lineage.',
    significance_kn: 'ತಲೆಮಾರುಗಳಿಂದ ಸಂರಕ್ಷಿಸಲ್ಪಟ್ಟ ವಿಜಯನಗರ ಕಾಲದ ಸಜೀವ ವಾಸ್ತುಕಲೆ.',
  },
  {
    id: 14,
    name: 'Mysore Sandalwood & Rosewood Inlay',
    name_kn: 'ಶ್ರೀಗಂಧ ಮತ್ತು ರೋಸ್‌ವುಡ್ ಕೆತ್ತನೆ',
    category: 'craft',
    region: 'Mysuru Heritage Woodcarvers',
    region_kn: 'ಮೈಸೂರು ಮರಗೆತ್ತನೆ ಗಿಲ್ಡ್',
    era: '18th-19th Century Wadiyar Court',
    era_kn: 'ಒಡೆಯರ್ ಆಸ್ಥಾನದ ಸುವರ್ಣ ಕಾಲ',
    badge: 'GI Tagged Marquetry',
    badge_kn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ಶ್ರೀಗಂಧ ಕಲೆ',
    instruments: 'Mysore Sandalwood, Fine Marquetry Chisels',
    instruments_kn: 'ಮೈಸೂರು ಗಂಧದ ಮರ, ಸೂಕ್ಷ್ಮ ಉಳಿಗಳು',
    icon: '🌳',
    color: 'from-amber-700/30 to-amber-950/40',
    soundType: 'bell',
    description: 'Mysuru is the historic "Sandalwood City". Master craftsmen inlay dark rosewood with contrasting ivory-shaded materials, bone, and fragrant sandalwood depicting the Jamboo Savari procession, deities, and floral vines.',
    description_kn: 'ಗಂಧದ ನಾಡಿನ ಹೆಮ್ಮೆಯ ಕಲೆ. ಸುಗಂಧಭರಿತ ಮೈಸೂರು ಶ್ರೀಗಂಧ ಹಾಗೂ ಕಪ್ಪು ರೋಸ್‌ವುಡ್ ಮರದ ಮೇಲೆ ಜಂಬೂಸವಾರಿಯ ದೃಶ್ಯಗಳನ್ನು ಬಿಡಿಸುವ ಸೂಕ್ಷ್ಮ ಕೆತ್ತನೆ ಕಲೆ.',
    significance: 'Emits a natural lingering divine sandalwood fragrance for decades.',
    significance_kn: 'ದಶಕಗಳ ಕಾಲ ಸುವಾಸನೆ ಬೀರುವ ಕರ್ನಾಟಕದ ಅನನ್ಯ ಗಂಧದ ಕರಕುಶಲ ಕಲೆ.',
  },
  {
    id: 15,
    name: 'Traditional Karnataka Temple Instruments',
    name_kn: 'ಕರ್ನಾಟಕದ ಸಾಂಪ್ರದಾಯಿಕ ಪಂಚವಾದ್ಯಗಳು',
    category: 'music',
    region: 'Mysuru Durbar & Ancient Temples',
    region_kn: 'ಮೈಸೂರು ದರ್ಬಾರ್ ಹಾಗೂ ದೇಗುಲಗಳು',
    era: 'Vedic to Vijayanagara Era',
    era_kn: 'ವೈದಿಕ ಹಾಗೂ ವಿಜಯನಗರ ಕಾಲ',
    badge: 'Sacred Temple Acoustics',
    badge_kn: 'ದೈವಿಕ ಮಂಗಳವಾದ್ಯ',
    instruments: 'Nadaswara, Chende, Thavil, Kombu, Kahale',
    instruments_kn: 'ನಾದಸ್ವರ, ಚಂಡೆ, ತವಿಲ್, ಕೊಂಬು, ಕಹಳೆ',
    icon: '🎺',
    color: 'from-amber-500/30 to-rose-950/40',
    soundType: 'nadaswara',
    description: 'The ceremonial acoustic heart of Mysuru Dasara. Features the sacred Nadaswara oboe, thunderous cylindrical Chende, brass Kombu curved horns, and royal Kahale trumpets sounding royal heralds during the Vijayadashami elephant march.',
    description_kn: 'ದಸರಾ ಮೆರವಣಿಗೆಯ ನಾದಬ್ರಹ್ಮ. ನಾದಸ್ವರ, ಗಂಭೀರ ಚಂಡೆ, ರಣಕಹಳೆ ಹಾಗೂ ಕೊಂಬು ವಾದ್ಯಗಳು ಒಟ್ಟಾಗಿ ಮೊಳಗಿದಾಗ ಮೈಸೂರಿನ ರಾಜಬೀದಿಗಳಲ್ಲಿ ದೈವೀ ಕಂಪನ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ.',
    significance: 'Awakens spiritual auspiciousness (Mangala Vadya) and royal majesty.',
    significance_kn: 'ಮಂಗಳಕರ ವಾತಾವರಣ ಮತ್ತು ರಾಜವೈಭವವನ್ನು ಸಾರುವ ಪವಿತ್ರ ವಾದ್ಯ ಸಂಗೀತ.',
  },
  {
    id: 16,
    name: 'Royal Wadiyar Regalia & Durbar Jewellery',
    name_kn: 'ಒಡೆಯರ್ ರಾಜವೈಭವ ಮತ್ತು ರತ್ನಾಭರಣಗಳು',
    category: 'costume',
    region: 'Mysore Palace Toshakhana (Treasury)',
    region_kn: 'ಮೈಸೂರು ಅರಮನೆ ಭಂಡಾರ',
    era: '1399-Present Yadu Dynasty',
    era_kn: '೧೩೯೯ ರಿಂದ ಇಂದಿನವರೆಗಿನ ಯದುವಂಶ',
    badge: 'Royal Heritage Regalia',
    badge_kn: 'ರಾಜಮನೆತನದ ಆಭರಣಗಳು',
    instruments: '24K Gold, Burmese Rubies, Diamonds',
    instruments_kn: 'ಅಪರಂಜಿ ಚಿನ್ನ, ರತ್ನ, ವಜ್ರದ ಕತ್ತಿ',
    icon: '👑',
    color: 'from-yellow-600/30 to-amber-950/40',
    soundType: 'fanfare',
    description: 'The monumental coronation attire of Mysore Maharajas: jewel-crested Mysore Petas (turbans) brocaded in gold, emerald-studded Gandaberunda pendants, ceremonial swords, and the 750kg 24-carat Golden Throne (Simhasana).',
    description_kn: 'ಒಡೆಯರ್ ಮಹಾರಾಜರು ಧರಿಸುತ್ತಿದ್ದ ರತ್ನಖಚಿತ ಮೈಸೂರು ಪೇಟ, ಜರಿ ಶೇರ್ವಾನಿ, ವಜ್ರಖಚಿತ ಗಂಡಭೇರುಂಡ ಪದಕ ಮತ್ತು ೭೫೦ ಕೆಜಿ ತೂಕದ ಚಿನ್ನದ ಸಿಂಹಾಸನದ ವೈಭವ.',
    significance: 'Preserves the unbroken royal spiritual lineage of the Vijayanagara Karnataka throne.',
    significance_kn: 'ಕರ್ನಾಟಕ ಸಿಂಹಾಸನಾಧೀಶ್ವರರ ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯ ಹಿರಿಮೆ.',
  },
  {
    id: 17,
    name: 'Lambani / Banjara Mirror Embroidery',
    name_kn: 'ಲಂಬಾಣಿ ಕಸೂತಿ ಕಲೆ',
    category: 'craft',
    region: 'Sandur, Ballari, Vijayapura',
    region_kn: 'ಸಂಡೂರು, ಬಳ್ಳಾರಿ, ವಿಜಯಪುರ',
    era: 'Nomadic Banjara Heritage (Centuries-old)',
    era_kn: 'ಸಂಚಾರಿ ಬಂಜಾರ ಸಮುದಾಯದ ಸಂಸ್ಕೃತಿ',
    badge: 'GI Tagged Textile Craft',
    badge_kn: 'ಜಿಐ ಮಾನ್ಯತೆಯ ಕಸೂತಿ',
    instruments: '39 Traditional Stitches, Mirrors, Cowries',
    instruments_kn: '೩೯ ಬಗೆಯ ಹೊಲಿಗೆ, ಗಾಜುಗಳು, ಕವಡೆಗಳು',
    icon: '🪡',
    color: 'from-fuchsia-900/30 to-amber-950/40',
    soundType: 'bell',
    description: 'Exuberant folk textile craft of the Lambani community combining 39 authentic geometric stitches, embedded glass mirrors, metal coins, and cowrie shells on vibrantly dyed crimson and indigo handwoven fabrics.',
    description_kn: 'ಬಂಜಾರ ಮಹಿಳೆಯರು ಕಸೂತಿ ಸೂಜಿಯಿಂದ ಮಾಡುವ ಜಾದೂ. ೩೯ ಬಗೆಯ ಜ್ಯಾಮಿತೀಯ ಹೊಲಿಗೆ, ಗಾಜುಗಳು ಮತ್ತು ಕವಡೆಗಳನ್ನು ಬಳಸಿ ಸಿದ್ಧಪಡಿಸುವ ರಂಗುರಂಗಿನ ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪುಗಳು.',
    significance: 'Celebrated by global fashion houses as an irreplaceable UNESCO intangible folk craft.',
    significance_kn: 'ಜಾಗತಿಕ ಮಟ್ಟದಲ್ಲಿ ಮೆಚ್ಚುಗೆ ಪಡೆದ ಕರ್ನಾಟಕದ ಅದ್ಭುತ ಕಸೂತಿ ಪರಂಪರೆ.',
  },
  {
    id: 18,
    name: 'Suggi Kunitha (Coastal Harvest Dance)',
    name_kn: 'ಸುಗ್ಗಿ ಕುಣಿತ (ಹಾರ್ವೆಸ್ಟ್ ನೃತ್ಯ)',
    category: 'dance',
    region: 'Uttara Kannada & Karwar Coastal Belt',
    region_kn: 'ಉತ್ತರ ಕನ್ನಡ ಹಾಗೂ ಕಾರವಾರ ಕರಾವಳಿ',
    era: 'Havyaka & Halakki Tribal Heritage',
    era_kn: 'ಹಾಲಕ್ಕಿ ಹಾಗೂ ಕೃಷಿಕ ಸಂಸ್ಕೃತಿ',
    badge: 'Agrarian Celebration',
    badge_kn: 'ಸುಗ್ಗಿ ಸಂಭ್ರಮದ ಕಲೆ',
    instruments: 'Gummate, Talam, Folk pipes',
    instruments_kn: 'ಗುಮ್ಮಟೆ, ತಾಳ, ಸುಗ್ಗಿ ಕೊಳಲು',
    icon: '🌾',
    color: 'from-lime-900/30 to-amber-950/40',
    soundType: 'drum',
    description: 'Vibrant spring harvest festival dance of the Halakki Vokkaliga tribe. Dancers wear breathtaking architectural wooden headgears adorned with hundreds of peacock feathers and mirrors, performing synchronized steps celebrating agricultural renewal.',
    description_kn: 'ಉತ್ತರ ಕನ್ನಡದ ಕರಾವಳಿ ಭಾಗದಲ್ಲಿ ಸುಗ್ಗಿಯ ಕಾಲದಲ್ಲಿ ನವಿಲುಗರಿಗಳಿಂದ ಅಲಂಕೃತವಾದ ಭವ್ಯ ಕಿರೀಟಗಳನ್ನು ತಲೆಯ ಮೇಲೆ ಹೊತ್ತು ಮಾಡುವ ಸಡಗರದ ಸುಗ್ಗಿ ನೃತ್ಯ.',
    significance: 'Thanks Mother Earth and nature spirits for bountiful harvests and monsoon rains.',
    significance_kn: 'ಭೂಮಿ ತಾಯಿಗೆ ಕೃತಜ್ಞತೆ ಸಲ್ಲಿಸುವ ಕೃಷಿ ಸಂಸ್ಕೃತಿಯ ಜೀವಂತ ಕಲೆ.',
  },
];

export default function CulturalMuseumPage() {
  const [exhibits, setExhibits] = useState<CulturalExhibit[]>(COMPREHENSIVE_EXHIBITS);
  const [selectedExhibit, setSelectedExhibit] = useState<CulturalExhibit>(COMPREHENSIVE_EXHIBITS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [isGanjifaOpen, setIsGanjifaOpen] = useState<boolean>(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Load any dynamic backend exhibits and merge cleanly
  useEffect(() => {
    heritageAPI
      .getExhibits()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        if (data.length > 0) {
          const combined = [...COMPREHENSIVE_EXHIBITS];
          data.forEach((backendEx: any) => {
            if (!combined.some((c) => c.name.toLowerCase().includes(backendEx.name.toLowerCase().split(' ')[0]))) {
              combined.push({
                id: backendEx.id || Math.random(),
                name: backendEx.name,
                name_kn: backendEx.name_kn || backendEx.name,
                category: backendEx.category || 'dance',
                region: backendEx.region || 'Karnataka',
                region_kn: backendEx.region_kn || 'ಕರ್ನಾಟಕ',
                era: backendEx.era || 'Heritage Tradition',
                era_kn: backendEx.era_kn || 'ಪರಂಪರೆ',
                badge: 'Karnataka Heritage',
                badge_kn: 'ಪರಂಪರೆ ಕಲೆ',
                instruments: 'Traditional Instruments',
                instruments_kn: 'ಸಾಂಪ್ರದಾಯಿಕ ವಾದ್ಯಗಳು',
                icon: '🏛️',
                color: 'from-amber-600/30 to-purple-950/40',
                soundType: 'drum',
                description: backendEx.description || '',
                description_kn: backendEx.description_kn || backendEx.description || '',
                significance: 'Living intangible cultural heritage of Mysuru Dasara.',
                significance_kn: 'ಮೈಸೂರು ದಸರಾದ ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ.',
              });
            }
          });
          setExhibits(combined);
        }
      })
      .catch(() => {});
  }, []);

  // Filtered exhibits by Category and Search query
  const filteredExhibits = useMemo(() => {
    return exhibits.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.name_kn.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.region_kn.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.description_kn.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [exhibits, activeCategory, searchQuery]);

  const handleSelectExhibit = (ex: CulturalExhibit) => {
    setSelectedExhibit(ex);
    if (isPlayingAudio) {
      audioManager.stopSpeech();
      setIsPlayingAudio(false);
    }
    // Smoothly scroll spotlight card to top
    if (spotlightRef.current) {
      spotlightRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // On mobile screens (< 1024px), smooth scroll the spotlight into view
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && spotlightRef.current) {
      spotlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    // Play preview sound
    if (ex.soundType === 'drum') audioManager.playDrumBeat(0.6);
    else if (ex.soundType === 'fanfare') audioManager.playRoyalFanfare();
    else if (ex.soundType === 'nadaswara') audioManager.playRoyalFanfare();
    else audioManager.playBellSound();
  };

  const handleNarration = (exhibit: CulturalExhibit) => {
    if (isPlayingAudio) {
      audioManager.stopSpeech();
      setIsPlayingAudio(false);
      return;
    }
    const text =
      language === 'kn' && exhibit.description_kn
        ? `${exhibit.name_kn}. ${exhibit.description_kn} ${exhibit.significance_kn}`
        : `${exhibit.name}. ${exhibit.description} ${exhibit.significance}`;

    setIsPlayingAudio(true);
    audioManager.speak(text, language, () => {
      setIsPlayingAudio(false);
    });
  };

  const categories = [
    { id: 'all', label: 'All Heritage', kn: 'ಎಲ್ಲಾ ಕಲೆಗಳು', icon: '🌟' },
    { id: 'dance', label: 'Folk & Martial Dances', kn: 'ಜಾನಪದ ನೃತ್ಯಗಳು', icon: '💃' },
    { id: 'theatre', label: 'Folk Theatre & Opera', kn: 'ರಂಗಭೂಮಿ', icon: '🎭' },
    { id: 'craft', label: 'GI Master Crafts', kn: 'ಹಸ್ತಕಲೆಗಳು', icon: '🎨' },
    { id: 'music', label: 'Temple Instruments', kn: 'ಸಂಗೀತ ವಾದ್ಯಗಳು', icon: '🎺' },
    { id: 'costume', label: 'Royal Regalia', kn: 'ರಾಜವೈಭವ', icon: '👑' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-36 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Interactive Karnataka Cultural Museum"
        titleKn="ಕರ್ನಾಟಕ ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ ಸಂಗ್ರಹಾಲಯ"
        subtitle="Explore 18 living arts of Karnataka: Dollu Kunitha, Yakshagana, Veeragase, Mysore 24K gold paintings, Bidriware, Channapatna wooden toys, and royal silk craftsmanship."
      />

      {/* Filter and Search Navigation Bar */}
      <div className="mt-4 mb-8 space-y-4">
        {/* Top Controls: Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dances, crafts, or instruments (e.g. Silk, ಡೊಳ್ಳು)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900/80 border border-white/15 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-400 backdrop-blur-md transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Counter Badge & Ganjifa Game Button */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
              {filteredExhibits.length} of {exhibits.length} Exhibits Showing
            </span>

            <button
              onClick={() => {
                setIsGanjifaOpen(true);
                audioManager.playRoyalFanfare();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white text-xs font-black border border-amber-400/40 shadow-royal transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🃏</span>
              <span>Play Mysore Ganjifa Game</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[10px] font-black">+50 Pts</span>
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count =
              cat.id === 'all'
                ? exhibits.length
                : exhibits.filter((e) => e.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-amber-400 text-black border-amber-300 shadow-gold-glow font-bold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-amber-400/40'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-kannada hidden md:inline">({cat.kn})</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Responsive Grid Layout (Exhibits + Sticky Spotlight) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols on lg): Responsive Exhibit Showcase Cards */}
        <div className="lg:col-span-7 space-y-4">
          {filteredExhibits.length === 0 ? (
            <div className="glass p-12 rounded-3xl border border-white/10 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-base font-bold text-white">No cultural exhibits match your search</h3>
              <p className="text-xs text-slate-400">
                Try searching for "dance", "silk", "drum", "ಚಿನ್ನ", or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 cursor-pointer shadow-gold-glow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredExhibits.map((ex) => {
                const isSelected = selectedExhibit?.id === ex.id;
                return (
                  <div
                    key={ex.id}
                    onClick={() => handleSelectExhibit(ex)}
                    className={`p-4 rounded-3xl cursor-pointer transition-all duration-200 relative overflow-hidden group flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-slate-900/90 border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/50'
                        : 'bg-slate-950/60 border-white/10 hover:border-amber-400/50 hover:bg-slate-900/80 shadow-md'
                    }`}
                  >
                    {/* Top Row: Category Pill & Sound Button */}
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          {ex.category}
                        </span>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/25">
                          {ex.badge}
                        </span>
                      </div>
                      <span className="text-2xl transform group-hover:scale-110 transition-transform">
                        {ex.icon}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="mb-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {ex.name}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-kannada font-medium mt-0.5">
                        {ex.name_kn}
                      </p>
                    </div>

                    {/* Description preview with clamped 2 lines */}
                    <p className="text-[11px] text-slate-300/80 line-clamp-2 leading-relaxed mb-3">
                      {ex.description}
                    </p>

                    {/* Bottom Metadata & Region */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[140px] flex items-center gap-1 text-slate-300 font-sans">
                        <span>📍</span>
                        <span className="truncate">{ex.region.split(',')[0]}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectExhibit(ex);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 text-amber-300 font-semibold transition-all cursor-pointer flex items-center gap-1"
                        title="Preview audio beat & select"
                      >
                        <span>🔊</span>
                        <span>Play Beat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (5 cols on lg): Sticky Interactive Spotlight & Audio Narration */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          {selectedExhibit ? (
            <div
              ref={spotlightRef}
              tabIndex={0}
              className="glass-dark p-5 rounded-3xl border-2 border-amber-400/40 shadow-royal flex flex-col justify-between bg-slate-950/95 backdrop-blur-xl relative max-h-[calc(100vh-6.5rem)] overflow-y-auto custom-scrollbar focus:outline-none"
            >
              {/* Top Decorative Amber Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Spotlight Header Bar */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5 font-mono">
                      <span>✨ EXHIBIT SPOTLIGHT</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live
                    </span>
                    <span className="hidden sm:inline-block text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                      ↕ Scroll for audio
                    </span>
                  </div>

                  {/* Language Selector */}
                  <div className="flex rounded-xl overflow-hidden border border-white/20 text-xs bg-slate-900/90 p-0.5">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        language === 'en'
                          ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('kn')}
                      className={`px-2.5 py-1 rounded-lg font-kannada transition-all cursor-pointer ${
                        language === 'kn'
                          ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                {/* Visual Showcase Card with Dynamic Gradient */}
                <div
                  className={`w-full py-5 rounded-2xl bg-gradient-to-br ${selectedExhibit.color} border border-amber-400/30 flex flex-col items-center justify-center mb-3.5 text-center p-3 relative shadow-md group`}
                >
                  <span className="text-5xl mb-1.5 filter drop-shadow-md transform group-hover:scale-110 transition-transform">
                    {selectedExhibit.icon}
                  </span>
                  <p className="text-sm font-extrabold text-amber-200">
                    {language === 'kn' ? selectedExhibit.name_kn : selectedExhibit.name}
                  </p>
                  <p className="text-xs text-amber-400/80 font-mono mt-1 px-3 py-0.5 rounded-full bg-black/40 border border-white/10">
                    {language === 'kn' ? selectedExhibit.region_kn : selectedExhibit.region}
                  </p>
                </div>

                {/* Exhibit Title & Badge */}
                <div className="mb-3">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                      {selectedExhibit.badge}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10 font-sans">
                      {selectedExhibit.era}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white leading-tight">
                    {selectedExhibit.name}
                  </h2>
                  <p className="text-xs text-amber-400 font-kannada font-bold mt-0.5">
                    {selectedExhibit.name_kn}
                  </p>
                </div>

                {/* Cultural Narrative Description */}
                <div className="text-xs text-slate-200 leading-relaxed mb-3 bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
                  <p>
                    {language === 'kn'
                      ? selectedExhibit.description_kn
                      : selectedExhibit.description}
                  </p>
                  <p className="pt-2 border-t border-white/10 text-[11px] text-amber-300/90 font-medium">
                    <strong className="text-amber-400">
                      {language === 'kn' ? 'ಧಾರ್ಮಿಕ ಮಹತ್ವ: ' : 'Significance: '}
                    </strong>
                    {language === 'kn'
                      ? selectedExhibit.significance_kn
                      : selectedExhibit.significance}
                  </p>
                </div>

                {/* Key Cultural Facts Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3.5">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                      Origin Hub
                    </p>
                    <p className="text-xs font-semibold text-white truncate mt-0.5">
                      {language === 'kn' ? selectedExhibit.region_kn : selectedExhibit.region}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/10">
                    <p className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                      Key Instruments
                    </p>
                    <p className="text-xs font-semibold text-white truncate mt-0.5">
                      {language === 'kn'
                        ? selectedExhibit.instruments_kn
                        : selectedExhibit.instruments}
                    </p>
                  </div>
                </div>

                {/* Interactive Sound Samples Panel */}
                <div className="mb-3.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20">
                  <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                    <span>🎵 Listen to Traditional Acoustics</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => audioManager.playDrumBeat(0.8)}
                      className="py-1.5 px-2 rounded-xl bg-black/40 hover:bg-amber-400 hover:text-black border border-white/15 text-[11px] font-semibold text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>🥁</span>
                      <span>Dollu Beat</span>
                    </button>
                    <button
                      onClick={() => audioManager.playRoyalFanfare()}
                      className="py-1.5 px-2 rounded-xl bg-black/40 hover:bg-amber-400 hover:text-black border border-white/15 text-[11px] font-semibold text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>🎺</span>
                      <span>Fanfare</span>
                    </button>
                    <button
                      onClick={() => audioManager.playBellSound()}
                      className="py-1.5 px-2 rounded-xl bg-black/40 hover:bg-amber-400 hover:text-black border border-white/15 text-[11px] font-semibold text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>🔔</span>
                      <span>Chimes</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Audio Voice Narration Controls */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <button
                  onClick={() => handleNarration(selectedExhibit)}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    isPlayingAudio
                      ? 'bg-rose-600/90 border border-rose-400 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-gold-glow'
                  }`}
                >
                  <span className="text-base">{isPlayingAudio ? '⏹' : '🔊'}</span>
                  <span>
                    {isPlayingAudio
                      ? language === 'kn'
                        ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ (Stop Narration)'
                        : 'Stop Voice Narration'
                      : language === 'kn'
                      ? 'ವಿವರಣೆ ಆಲಿಸಿ (Play Audio Tour)'
                      : 'Play Bilingual Audio Narration'}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/20 text-current">
                    {language === 'kn' ? 'ಕನ್ನಡ' : 'English'}
                  </span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  🎙️ Powered by Web Speech Synthesis with natural Karnataka voice modulation
                </p>
              </div>
            </div>
          ) : (
            <div className="glass p-8 rounded-3xl border border-white/10 text-center text-slate-400">
              Select any exhibit from the catalog to view details and hear narration.
            </div>
          )}
        </div>
      </div>

      {/* Mysore Ganjifa Royal Circular Card Game Modal */}
      <GanjifaGameModal isOpen={isGanjifaOpen} onClose={() => setIsGanjifaOpen(false)} />
    </div>
  );
}
