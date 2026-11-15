import React, { useState, useMemo, useEffect, useRef } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';
import { QUIZ_BANK, QuizQuestion } from '@/data/heritageQuizData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PassportStamp {
  id: string;
  name: string;
  nameKn: string;
  landmark: string;
  icon: string;
  points: number;
  earned: boolean;
  dateEarned?: string;
  coord: string;
  lore: string;
}

const MYSORE_STAMPS: PassportStamp[] = [
  {
    id: 'palace',
    name: 'Mysore Palace (Amba Vilas)',
    nameKn: 'ಅಂಬಾ ವಿಲಾಸ ಅರಮನೆ',
    landmark: 'Mysore Palace Durbar Courtyard',
    icon: '🏰',
    points: 30,
    earned: true,
    dateEarned: 'Oct 12, 2026',
    coord: '12.3051° N, 76.6551° E',
    lore: 'Witnessed the 100,000 incandescent bulbs illuminate the three-storied Indo-Saracenic palace facade.',
  },
  {
    id: 'savari',
    name: '750kg Golden Howdah',
    nameKn: 'ಚಿನ್ನದ ಅಂಬಾರಿ ಜಂಬೂಸವಾರಿ',
    landmark: 'Sayyaji Rao Road Corridor',
    icon: '🐘',
    points: 40,
    earned: true,
    dateEarned: 'Oct 14, 2026',
    coord: '12.3115° N, 76.6528° E',
    lore: 'Received divine darshan of Goddess Chamundeshwari enshrined in the 750kg pure gold Ambari atop lead tusker Arjuna.',
  },
  {
    id: 'chamundi',
    name: 'Chamundi Hill 1,008 Steps',
    nameKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಮೆಟ್ಟಿಲು ಯಾತ್ರೆ',
    landmark: 'Chamundi Hill Footsteps & Nandi',
    icon: '⛰️',
    points: 35,
    earned: true,
    dateEarned: 'Oct 15, 2026',
    coord: '12.2723° N, 76.6710° E',
    lore: 'Climbed the sacred 1,008 stone steps built in 1659 by Dodda Devaraja Wadiyar, paying homage at the monolithic Nandi.',
  },
  {
    id: 'parade',
    name: 'Bannimantap 1,600 Drones',
    nameKn: 'ಬನ್ನಿಮಂಟಪ ಆಕಾಶ ಡ್ರೋನ್ ಶೋ',
    landmark: 'Bannimantap Torchlight Parade Ground',
    icon: '✨',
    points: 35,
    earned: true,
    dateEarned: 'Oct 16, 2026',
    coord: '12.3364° N, 76.6517° E',
    lore: 'Watched 1,600 synchronized high-density LED drones weave the royal Gandaberunda and Mysore Palace in the night sky.',
  },
  {
    id: 'philomena',
    name: 'St. Philomena’s Cathedral',
    nameKn: 'ಸಂತ ಫಿಲೋಮಿನಾ ಕ್ಯಾಥೆಡ್ರಲ್',
    landmark: 'Ashoka Road, Central Mysuru',
    icon: '⛪',
    points: 25,
    earned: false,
    coord: '12.3211° N, 76.6583° E',
    lore: 'Admired the 175-foot Neo-Gothic twin spires modeled after Cologne Cathedral, consecrated in 1936 under Nalvadi Krishnaraja Wadiyar.',
  },
  {
    id: 'lalitha',
    name: 'Lalitha Mahal Palace',
    nameKn: 'ಲಲಿತ ಮಹಲ್ ಅರಮನೆ',
    landmark: 'Lalitha Mahal Helipad Road',
    icon: '🏛️',
    points: 30,
    earned: false,
    coord: '12.2985° N, 76.6859° E',
    lore: 'Explored the sparkling pure white Italian marble palace built in 1921, inspired by London’s St. Paul’s Cathedral.',
  },
  {
    id: 'zoo',
    name: 'Mysuru Zoo (Chamarajendra)',
    nameKn: 'ಶ್ರೀ ಚಾಮರಾಜೇಂದ್ರ ಮೃಗಾಲಯ',
    landmark: 'Indiranagar, Mysore Zoo',
    icon: '🦁',
    points: 25,
    earned: true,
    dateEarned: 'Oct 13, 2026',
    coord: '12.3025° N, 76.6644° E',
    lore: 'Visited one of India’s oldest and most prestigious zoological gardens established in 1892 by Chamarajendra Wadiyar X.',
  },
  {
    id: 'krs',
    name: 'Brindavan Gardens & KRS Dam',
    nameKn: 'ಬೃಂದಾವನ ಮತ್ತು ಕೃಷ್ಣರಾಜ ಸಾಗರ',
    landmark: 'KRS Dam, Kaveri River',
    icon: '🌊',
    points: 30,
    earned: false,
    coord: '12.4244° N, 76.5728° E',
    lore: 'Marvelled at Sir M. Visvesvaraya’s engineering landmark and the illuminated dancing musical fountains across Kaveri river.',
  },
  {
    id: 'ranganathittu',
    name: 'Ranganathittu Bird Sanctuary',
    nameKn: 'ರಂಗನತಿಟ್ಟು ಪಕ್ಷಿಧಾಮ',
    landmark: 'Kaveri River Islets, Srirangapatna',
    icon: '🐦',
    points: 25,
    earned: false,
    coord: '12.4242° N, 76.6586° E',
    lore: 'Boated along the Kaveri river islets hosting painted storks, pelicans, and spoonbills declared a sanctuary by Dr. Salim Ali in 1940.',
  },
  {
    id: 'jaganmohan',
    name: 'Jaganmohan Art Gallery',
    nameKn: 'ಜಗನ್ಮೋಹನ ಅರಮನೆ ಕಲಾಶಾಲೆ',
    landmark: 'Jaganmohan Palace & Art Pavilion',
    icon: '🖼️',
    points: 30,
    earned: true,
    dateEarned: 'Oct 14, 2026',
    coord: '12.3072° N, 76.6491° E',
    lore: 'Admired the iconic "Glow of Hope" by S.L. Haldankar and original royal oil paintings by Raja Ravi Varma.',
  },
  {
    id: 'devaraja',
    name: 'Devaraja Heritage Bazaar',
    nameKn: 'ದೇವರಾಜ ಪಾರಂಪರಿಕ ಮಾರುಕಟ್ಟೆ',
    landmark: 'Sayyaji Rao Road, Central Mysuru',
    icon: '🛍️',
    points: 20,
    earned: true,
    dateEarned: 'Oct 15, 2026',
    coord: '12.3112° N, 76.6515° E',
    lore: 'Walked through the century-old bustling bazaar filled with Mysore mallige jasmine, fresh betel leaves, and traditional oils.',
  },
  {
    id: 'railway',
    name: 'Mysuru Railway Museum',
    nameKn: 'ಮೈಸೂರು ರೈಲ್ವೆ ಮ್ಯೂಸಿಯಂ',
    landmark: 'KRS Road, Railway Station Back',
    icon: '🚂',
    points: 20,
    earned: false,
    coord: '12.3168° N, 76.6447° E',
    lore: 'Inspected the 1899 Maharani royal saloon coach, vintage Austin rail motor, and historic steam locomotives.',
  },
  {
    id: 'somnathpur',
    name: 'Somnathpur Keshava Temple',
    nameKn: 'ಸೋಮನಾಥಪುರ ಕೇಶವ ದೇವಾಲಯ',
    landmark: 'Somnathpur Heritage Enclosure',
    icon: '🛕',
    points: 35,
    earned: false,
    coord: '12.2758° N, 76.8821° E',
    lore: 'Witnessed the breathtaking 1268 AD Hoysala Trikuta temple celebrated for microscopic soapstone friezes and star architecture.',
  },
  {
    id: 'ori',
    name: 'Oriental Research Institute (ORI)',
    nameKn: 'ಪ್ರಾಚ್ಯ ವಿದ್ಯಾ ಸಂಶೋಧನಾಲಯ',
    landmark: 'Crawford Hall Campus, JLB Road',
    icon: '📚',
    points: 25,
    earned: false,
    coord: '12.3089° N, 76.6421° E',
    lore: 'Visited the historic 1891 treasury preserving 70,000 palm-leaf manuscripts where Kautilya’s Arthashastra was discovered in 1905.',
  },
  {
    id: 'srirangapatna',
    name: 'Dariya Daulat Summer Palace',
    nameKn: 'ದರಿಯಾ ದೌಲತ್ ಬಾಗ್ (ಶ್ರೀರಂಗಪಟ್ಟಣ)',
    landmark: 'Srirangapatna Island',
    icon: '🌿',
    points: 30,
    earned: false,
    coord: '12.4172° N, 76.6975° E',
    lore: 'Explored Tipu Sultan’s 1784 teakwood summer palace surrounded by Mughal gardens with intricate battle mural frescoes.',
  },
  {
    id: 'cava',
    name: 'Chamarajendra Visual Arts (CAVA)',
    nameKn: 'ಚಾಮರಾಜೇಂದ್ರ ದೃಶ್ಯಕಲಾ ಅಕಾಡೆಮಿ',
    landmark: 'Siddartha Layout, Mysuru',
    icon: '🎨',
    points: 20,
    earned: false,
    coord: '12.3090° N, 76.6780° E',
    lore: 'Discovered the historic 1906 royal visual arts institute fostering classical Mysore gesso and gold leaf painting.',
  },
  {
    id: 'sandalwood',
    name: 'Govt Sandalwood Oil Factory',
    nameKn: 'ಸರ್ಕಾರಿ ಗಂಧದ ಎಣ್ಣೆ ಕಾರ್ಖಾನೆ (೧೯೧೬)',
    landmark: 'Kuvempunagar Industrial Area',
    icon: '🪵',
    points: 25,
    earned: true,
    dateEarned: 'Oct 13, 2026',
    coord: '12.2890° N, 76.6341° E',
    lore: 'Breathed the pure aroma of Santalum album distillation founded in 1916 by Nalvadi Krishnaraja Wadiyar and Sir M.V.',
  },
  {
    id: 'gurusweets',
    name: 'Guru Sweets (Original Mysore Pak)',
    nameKn: 'ಗುರು ಸ್ವೀಟ್ಸ್ (ಅಸಲಿ ಮೈಸೂರು ಪಾಕ್)',
    landmark: 'Sayyaji Rao Road, Near Palace',
    icon: '🍛',
    points: 20,
    earned: true,
    dateEarned: 'Oct 12, 2026',
    coord: '12.3102° N, 76.6521° E',
    lore: 'Tasted the authentic honeycomb Mysore Pak made by the direct descendants of royal palace chef Kakasura Madappa.',
  },
  {
    id: 'kukkarahalli',
    name: 'Kukkarahalli Lake Wetland',
    nameKn: 'ಕುಕ್ಕರಹಳ್ಳಿ ಕೆರೆ (ಕುವೆಂಪು ತಾಣ)',
    landmark: 'Manasagangotri University Campus',
    icon: '🛶',
    points: 20,
    earned: false,
    coord: '12.3095° N, 76.6322° E',
    lore: 'Strolled along the 120-acre 1864 lake where Rashtrakavi Kuvempu walked daily, composing immortal Kannada poems.',
  },
  {
    id: 'crawford',
    name: 'Crawford Hall (Mysore University)',
    nameKn: 'ಕ್ರಾಫರ್ಡ್ ಭವನ (ಮೈಸೂರು ವಿವಿ)',
    landmark: 'KRS Road / JLB Road Junction',
    icon: '🏛️',
    points: 25,
    earned: false,
    coord: '12.3120° N, 76.6430° E',
    lore: 'Honored the Greco-Roman neoclassical administrative headquarters of the University of Mysore, established in 1916.',
  },
];

export default function HeritagePassportPage() {
  const [activeTab, setActiveTab] = useState<'passport' | 'quiz' | 'certificate'>('passport');
  const [stamps, setStamps] = useState<PassportStamp[]>(MYSORE_STAMPS);
  const [holderName, setHolderName] = useState<string>('SRUJAN G M');
  const [passportId] = useState<string>('MYS-DASARA-2026-84920');
  const [stampFeedback, setStampFeedback] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Quiz state
  const [quizCategory, setQuizCategory] = useState<string>('all');
  const [quizMode, setQuizMode] = useState<'sprint' | 'challenge' | 'marathon'>('sprint');
  const [quizPool, setQuizPool] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Initialize or filter Quiz questions
  const initializeQuiz = (mode: 'sprint' | 'challenge' | 'marathon', cat: string) => {
    let pool = QUIZ_BANK;
    if (cat !== 'all') {
      pool = pool.filter((q) => q.category === cat);
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count =
      mode === 'sprint'
        ? Math.min(10, shuffled.length)
        : mode === 'challenge'
        ? Math.min(25, shuffled.length)
        : shuffled.length;
    setQuizPool(shuffled.slice(0, count));
    setQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setQuizCompleted(false);
  };

  useEffect(() => {
    initializeQuiz(quizMode, quizCategory);
  }, [quizCategory, quizMode]);

  // Dynamic stamp points
  const earnedStamps = useMemo(() => stamps.filter((s) => s.earned), [stamps]);
  const stampPoints = useMemo(() => earnedStamps.reduce((acc, curr) => acc + curr.points, 0), [earnedStamps]);
  const totalScore = stampPoints + score;

  // Determine Tier
  const tierInfo = useMemo(() => {
    if (totalScore >= 450)
      return { name: 'PLATINUM WADIYAR LEGEND', badge: '👑', color: 'from-amber-400 to-rose-400 text-amber-200' };
    if (totalScore >= 250)
      return { name: 'GOLD ROYAL AMBASSADOR', badge: '🥇', color: 'from-amber-400 to-yellow-500 text-amber-300' };
    if (totalScore >= 120)
      return { name: 'SILVER HERITAGE CONNOISSEUR', badge: '🥈', color: 'from-slate-300 to-slate-100 text-slate-200' };
    return { name: 'BRONZE FESTIVAL EXPLORER', badge: '🥉', color: 'from-amber-600 to-amber-700 text-amber-200' };
  }, [totalScore]);

  // Toggle Stamp Check/Uncheck
  const toggleStamp = (stampId: string) => {
    setStamps((prev) =>
      prev.map((s) => {
        if (s.id === stampId) {
          const willEarn = !s.earned;
          if (willEarn) {
            audioManager.playRoyalFanfare();
            setStampFeedback(`✓ Checked & Verified: ${s.name} (+${s.points} Pts)`);
          } else {
            audioManager.playDrumBeat(0.4);
            setStampFeedback(`Unchecked: ${s.name} (-${s.points} Pts)`);
          }
          return {
            ...s,
            earned: willEarn,
            dateEarned: willEarn ? 'Verified Just Now' : undefined,
          };
        }
        return s;
      })
    );
    setTimeout(() => setStampFeedback(null), 2500);
  };

  // Reset All Stamps
  const handleResetAllStamps = () => {
    audioManager.playDrumBeat(0.6);
    setStamps((prev) => prev.map((s) => ({ ...s, earned: false, dateEarned: undefined })));
    setStampFeedback('🔄 All stamps have been reset to uncollected.');
    setTimeout(() => setStampFeedback(null), 2500);
  };

  // Collect All Stamps (Demo Mode)
  const handleCollectAllStamps = () => {
    audioManager.playRoyalFanfare();
    setStamps((prev) => prev.map((s) => ({ ...s, earned: true, dateEarned: 'Verified Demo Check-In' })));
    setStampFeedback('🎉 All 20 Heritage Stamps Verified & Collected!');
    setTimeout(() => setStampFeedback(null), 2500);
  };

  // Quiz Option Click
  const handleSelectOption = (idx: number) => {
    if (isAnswered || !quizPool[quizIndex]) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === quizPool[quizIndex].correct;
    if (isCorrect) {
      const bonus = streak >= 2 ? 15 : 10;
      setScore((s) => s + 25 + bonus);
      setStreak((st) => st + 1);
      audioManager.playRoyalFanfare();
    } else {
      setStreak(0);
      audioManager.playDrumBeat(0.6);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (quizIndex < quizPool.length - 1) {
      setQuizIndex((i) => i + 1);
    } else {
      setQuizCompleted(true);
      audioManager.playRoyalFanfare();
    }
  };

  // =========================================================================
  // DOWNLOAD RELIABLE VECTOR PDF CERTIFICATE VIA JSPDF
  // =========================================================================
  const downloadCertificatePDF = () => {
    setIsDownloading(true);
    audioManager.playRoyalFanfare();

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;

      // 1. Dark Royal Midnight Blue Background
      doc.setFillColor(10, 15, 44);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // 2. Outer Royal Golden Border
      doc.setDrawColor(212, 175, 55); // Rich Mysore Gold
      doc.setLineWidth(1.6);
      doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

      // 3. Inner Royal Thin Golden Border
      doc.setLineWidth(0.5);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // 4. Four Corner Floral Rosettes
      doc.setFillColor(212, 175, 55);
      const corners = [
        [10, 10],
        [pageWidth - 10, 10],
        [10, pageHeight - 10],
        [pageWidth - 10, pageHeight - 10],
      ];
      corners.forEach(([cx, cy]) => {
        doc.circle(cx, cy, 2.2, 'F');
      });

      // 5. Official Top Header Ribbon
      doc.setFillColor(59, 7, 68); // Deep Royal Purple
      doc.rect(11, 11, pageWidth - 22, 18, 'F');

      doc.setTextColor(255, 215, 0); // Gold
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('GOVERNMENT OF KARNATAKA   |   DEPARTMENT OF TOURISM', pageWidth / 2, 18.5, { align: 'center' });

      doc.setTextColor(220, 225, 240);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('MYSURU DASARA 2026   *   OFFICIAL DIGITAL HERITAGE AUTHORITY', pageWidth / 2, 24.5, { align: 'center' });

      // 6. Sub-header & Title
      doc.setTextColor(180, 185, 205);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('OFFICIAL STATE FESTIVAL CREDENTIAL OF MERIT', pageWidth / 2, 36, { align: 'center' });

      doc.setTextColor(255, 223, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('CERTIFICATE OF HERITAGE CITIZENSHIP', pageWidth / 2, 45, { align: 'center' });

      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('[ DIGITAL HERITAGE PASSPORT VERIFICATION ]', pageWidth / 2, 51, { align: 'center' });

      // 7. Conferred Upon
      doc.setTextColor(210, 215, 225);
      doc.setFontSize(9.5);
      doc.text('This credential is officially and proudly conferred upon', pageWidth / 2, 60, { align: 'center' });

      // 8. Holder Name
      const cleanName = (holderName || 'SRUJAN G M').trim().toUpperCase();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(21);
      doc.setTextColor(255, 255, 255);
      doc.text(cleanName, pageWidth / 2, 72, { align: 'center' });

      // Underline for Name
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.6);
      doc.line(65, 75, pageWidth - 65, 75);

      // 9. Commendation Text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(215, 220, 230);
      doc.text(
        'in recognition of exemplary on-ground exploration across Mysuru’s historic monuments,',
        pageWidth / 2,
        83,
        { align: 'center' }
      );
      doc.text(
        'successfully verifying official landmark check-in stamps and achieving distinction in the 400-Year Wadiyar Royal Heritage Challenge.',
        pageWidth / 2,
        88.5,
        { align: 'center' }
      );

      // 10. Awarded Tier Box (Pure Vector, No Emojis, No Mojibake)
      const tierBoxWidth = 130;
      const tierBoxX = (pageWidth - tierBoxWidth) / 2;
      doc.setFillColor(74, 18, 89); // Royal Plum
      doc.roundedRect(tierBoxX, 96, tierBoxWidth, 14, 2.5, 2.5, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.8);
      doc.roundedRect(tierBoxX, 96, tierBoxWidth, 14, 2.5, 2.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 223, 0);
      doc.text(`* * *   ${tierInfo.name}   * * *`, pageWidth / 2, 105, { align: 'center' });

      // 11. Statistics Box (4 Clean Columns)
      const statsBoxWidth = 230;
      const statsBoxX = (pageWidth - statsBoxWidth) / 2;
      doc.setFillColor(18, 25, 60);
      doc.roundedRect(statsBoxX, 116, statsBoxWidth, 16, 2, 2, 'F');
      doc.setDrawColor(60, 75, 120);
      doc.setLineWidth(0.4);
      doc.roundedRect(statsBoxX, 116, statsBoxWidth, 16, 2, 2);

      // 4 Columns inside Stats
      const colW = statsBoxWidth / 4;
      const statLabels = [
        { label: 'PASSPORT NUMBER', val: passportId, color: [255, 215, 0] },
        { label: 'VERIFIED STAMPS', val: `${earnedStamps.length} / ${stamps.length} LANDMARKS`, color: [0, 255, 136] },
        { label: 'TOTAL SCORE', val: `${totalScore} POINTS`, color: [255, 215, 0] },
        {
          label: 'DATE OF ISSUE',
          val: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
          color: [255, 255, 255],
        },
      ];

      statLabels.forEach((st, idx) => {
        const cx = statsBoxX + colW * idx + colW / 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(160, 170, 195);
        doc.text(st.label, cx, 122, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(st.color[0], st.color[1], st.color[2]);
        doc.text(st.val, cx, 128, { align: 'center' });

        if (idx < 3) {
          doc.setDrawColor(40, 50, 90);
          doc.setLineWidth(0.3);
          doc.line(statsBoxX + colW * (idx + 1), 118, statsBoxX + colW * (idx + 1), 130);
        }
      });

      // 12. Verification Ledger Footnote
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 145, 170);
      doc.text(
        'Digitally Authenticated by the Mysuru Dasara 2026 Festival Registry   |   Verification Hash: #MYS-84920-VERIFIED-OFFICIAL',
        pageWidth / 2,
        138,
        { align: 'center' }
      );

      // 13. Bottom Signatures & Center Gold Seal (Spaced Perfectly)
      // Left Signature
      const sig1X = 65;
      doc.setFont('times', 'italic');
      doc.setFontSize(13);
      doc.setTextColor(255, 224, 130);
      doc.text('K. R. Chamaraja', sig1X, 161, { align: 'center' });

      doc.setDrawColor(200, 205, 220);
      doc.setLineWidth(0.4);
      doc.line(sig1X - 28, 164, sig1X + 28, 164);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(230, 235, 245);
      doc.text('Chairman, Dasara High-Power Committee', sig1X, 169, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(170, 175, 190);
      doc.text('Government of Karnataka', sig1X, 173.5, { align: 'center' });

      // Center Official Gold Seal
      const sealCenterX = pageWidth / 2;
      const sealCenterY = 166;
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.9);
      doc.circle(sealCenterX, sealCenterY, 13.5);
      doc.setLineWidth(0.4);
      doc.circle(sealCenterX, sealCenterY, 11.5);

      doc.setFillColor(30, 20, 60);
      doc.circle(sealCenterX, sealCenterY, 11, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(255, 215, 0);
      doc.text('GOVERNMENT OF KARNATAKA', sealCenterX, sealCenterY - 4.5, { align: 'center' });

      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('MYSURU DASARA', sealCenterX, sealCenterY, { align: 'center' });

      doc.setFontSize(5.5);
      doc.setTextColor(0, 255, 136);
      doc.text('OFFICIAL SEAL 2026', sealCenterX, sealCenterY + 4.5, { align: 'center' });

      // Right Signature
      const sig2X = pageWidth - 65;
      doc.setFont('times', 'italic');
      doc.setFontSize(13);
      doc.setTextColor(255, 224, 130);
      doc.text('Dr. S. V. Manjunath', sig2X, 161, { align: 'center' });

      doc.setDrawColor(200, 205, 220);
      doc.setLineWidth(0.4);
      doc.line(sig2X - 28, 164, sig2X + 28, 164);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(230, 235, 245);
      doc.text('Director, Department of Tourism', sig2X, 169, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(170, 175, 190);
      doc.text('Government of Karnataka', sig2X, 173.5, { align: 'center' });

      // 14. Save PDF
      const filename = `Mysuru_Dasara_Heritage_Certificate_${cleanName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(filename);
      setStampFeedback('✓ Official PDF Certificate successfully downloaded!');
    } catch (err) {
      console.error(err);
      setStampFeedback('❌ Failed to export PDF. Please try again.');
    } finally {
      setIsDownloading(false);
      setTimeout(() => setStampFeedback(null), 3000);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-36 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="Heritage Passport & Cultural Quiz"
        titleKn="ಡಿಜಿಟಲ್ ಪರಂಪರೆ ಪಾಸ್‌ಪೋರ್ಟ್ ಮತ್ತು ರಸಪ್ರಶ್ನೆ"
        subtitle="Collect 20 verified Mysore landmark check-in stamps, test your mastery with a 50+ question Wadiyar heritage quiz bank, and download your official Government of Karnataka certificate in high-resolution PDF."
      />

      {/* Toast Alert */}
      {stampFeedback && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce border border-amber-300">
          <span className="text-base">🎖️</span>
          <span>{stampFeedback}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 mb-8">
        <div className="glass p-1.5 rounded-2xl border border-amber-400/30 flex flex-wrap gap-1.5 bg-slate-950/80 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('passport');
              audioManager.playBellSound();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'passport'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-gold-glow scale-102 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🛂</span>
            <span>Digital Passport ({earnedStamps.length}/20)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              audioManager.playBellSound();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-gold-glow scale-102 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎯</span>
            <span>50+ Heritage Quiz Bank</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('certificate');
              audioManager.playBellSound();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'certificate'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-gold-glow scale-102 font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📜</span>
            <span>Official PDF Certificate</span>
          </button>
        </div>

        {/* Live Score Pill */}
        <div className="flex items-center gap-3 bg-slate-950/90 border border-amber-400/40 px-4 py-2 rounded-2xl shadow-md">
          <span className="text-2xl">{tierInfo.badge}</span>
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider font-mono">
              {tierInfo.name}
            </p>
            <p className="text-sm font-black text-white font-mono">
              {totalScore} Total Points ({earnedStamps.length} Stamps)
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. DIGITAL PASSPORT & STAMPS (20 MYSORE LANDMARKS) */}
      {/* ========================================================= */}
      {activeTab === 'passport' && (
        <div className="space-y-6">
          {/* Controls Bar: Name Customizer & Reset / Collect All */}
          <div className="glass p-5 rounded-3xl border border-amber-400/30 bg-slate-950/80 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Passport Holder Name Input */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs uppercase font-extrabold text-amber-400 font-mono whitespace-nowrap">
                Certificate Name:
              </span>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Enter your name for the official certificate..."
                className="w-full px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/20 focus:border-amber-400 text-xs font-bold text-white focus:outline-none"
              />
            </div>

            {/* Stamp Reset & Collect Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCollectAllStamps}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Verify all 20 stamps for demo"
              >
                <span>✓</span>
                <span>Collect All (20)</span>
              </button>

              <button
                onClick={handleResetAllStamps}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 hover:text-white border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Reset all stamps back to uncollected"
              >
                <span>🔄</span>
                <span>Reset All Stamps</span>
              </button>

              <button
                onClick={() => setActiveTab('certificate')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer shadow-gold-glow flex items-center gap-1.5"
              >
                <span>📜</span>
                <span>Preview Certificate</span>
              </button>
            </div>
          </div>

          {/* Passport Booklet Card */}
          <div className="glass-dark p-6 sm:p-8 rounded-3xl border-2 border-amber-400/50 shadow-royal bg-slate-950/95 relative overflow-hidden">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 block">
                  GOVERNMENT OF KARNATAKA • TOURISM HERITAGE PASSPORT
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Mysuru 20-Landmark Heritage Passport
                </h3>
                <p className="text-xs text-amber-400/90 font-kannada">
                  ಮೈಸೂರಿನ ೨೦ ಪಾರಂಪರಿಕ ತಾಣಗಳ ಡಿಜಿಟಲ್ ಮುದ್ರೆಗಳ ಸಂಗ್ರಹ
                </p>
              </div>

              <div className="text-left sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-white/10">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  PASSPORT NUMBER
                </span>
                <span className="text-sm font-mono font-bold text-amber-300">
                  {passportId}
                </span>
                <p className="text-[10px] text-emerald-400 font-semibold">
                  ● Verified Citizen Pass: {holderName}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="py-4 border-b border-white/10">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-300">
                  Exploration Stamp Completion
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {earnedStamps.length} of {stamps.length} Collected ({Math.round((earnedStamps.length / stamps.length) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-gold-glow"
                  style={{ width: `${(earnedStamps.length / stamps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="py-3 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <span>💡 Tip:</span>
                <span>Click any stamp to <strong>Check (Verify)</strong> or <strong>Uncheck</strong> at any time.</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Each verified stamp earns +20 to +40 points
              </span>
            </div>

            {/* 20 Stamps Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pt-2">
              {stamps.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleStamp(st.id)}
                  className={`p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer relative flex flex-col justify-between group ${
                    st.earned
                      ? 'bg-gradient-to-b from-amber-500/20 to-slate-900/90 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] ring-1 ring-amber-400/40'
                      : 'bg-slate-900/40 border-white/10 hover:border-amber-400/50 hover:bg-slate-900/70 opacity-60 hover:opacity-100'
                  }`}
                  title="Click to check or uncheck stamp"
                >
                  {/* Status Indicator Icon */}
                  <div className="absolute top-2 right-2">
                    {st.earned ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] font-bold flex items-center justify-center shadow-sm">
                        ✓
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-white/10 text-white/40 text-[10px] flex items-center justify-center">
                        ○
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {st.icon}
                    </div>
                    <h5 className="text-xs font-bold text-white leading-tight">
                      {st.name}
                    </h5>
                    <p className="text-[10px] text-amber-400/90 font-kannada mt-0.5">
                      {st.nameKn}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate mt-1">
                      {st.landmark.split(',')[0]}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/10">
                    {st.earned ? (
                      <div className="space-y-0.5">
                        <span className="inline-block text-[9px] uppercase px-2 py-0.5 rounded-full font-bold bg-amber-400/25 text-amber-300 border border-amber-400/40">
                          ✓ Verified ({st.points} Pts)
                        </span>
                        <span className="block text-[8px] text-slate-400 group-hover:text-rose-400">
                          (Click to Uncheck)
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block text-[9px] uppercase px-2 py-0.5 rounded-full font-bold bg-white/10 text-slate-300 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                        📍 Tap to Check
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. 50+ HERITAGE QUIZ BANK & MARATHON */}
      {/* ========================================================= */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Quiz Mode & Category Switchers */}
          <div className="glass p-4 rounded-3xl border border-white/10 bg-slate-950/70 shadow-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs uppercase font-extrabold text-amber-400 font-mono">
                Select Quiz Challenge Mode:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'sprint', label: '🚀 10-Q Sprint', mode: 'sprint' },
                  { id: 'challenge', label: '🏃 25-Q Challenge', mode: 'challenge' },
                  { id: 'marathon', label: '🏆 52-Q Marathon', mode: 'marathon' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setQuizMode(m.mode as any);
                      audioManager.playBellSound();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      quizMode === m.mode
                        ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-white/10">
              {[
                { id: 'all', label: 'All 52 Questions' },
                { id: 'history', label: 'Royal History (11)' },
                { id: 'gajapade', label: 'Gaja Pade & Howdah (11)' },
                { id: 'architecture', label: 'Palace & Monuments (10)' },
                { id: 'culture', label: 'Culture & Traditions (10)' },
                { id: 'culinary', label: 'Culinary & GI Crafts (10)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setQuizCategory(c.id);
                    audioManager.playBellSound();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    quizCategory === c.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Quiz Box */}
          {!quizCompleted && quizPool.length > 0 ? (
            <div className="glass-dark p-6 sm:p-8 rounded-3xl border-2 border-amber-400/40 shadow-royal bg-slate-950/95 relative overflow-hidden">
              {/* Quiz Header Bar */}
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-extrabold uppercase tracking-wider font-mono">
                    Question {quizIndex + 1} of {quizPool.length}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-sans">
                    {quizPool[quizIndex]?.categoryLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {streak >= 2 && (
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 animate-pulse">
                      <span>🔥</span>
                      <span>Streak x{streak} (+15 Pts)</span>
                    </span>
                  )}
                  <span className="text-sm font-mono font-black text-amber-300">
                    Score: {score} Pts
                  </span>
                  <button
                    onClick={() => initializeQuiz(quizMode, quizCategory)}
                    className="text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                    title="Restart Quiz"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 leading-snug">
                {quizPool[quizIndex]?.q}
              </h3>
              <p className="text-sm text-amber-400/90 font-kannada font-medium mb-6">
                {quizPool[quizIndex]?.qKn}
              </p>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {quizPool[quizIndex]?.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === quizPool[quizIndex].correct;
                  let btnStyle = 'bg-white/5 border-white/15 text-slate-200 hover:border-amber-400/60 hover:bg-white/10';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-600/30 border-rose-400 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'bg-white/5 border-white/10 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold border transition-all duration-200 flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-xs font-mono">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && <span className="text-emerald-400 font-bold">✓ Correct (+25 Pts)</span>}
                      {isAnswered && isSelected && !isCorrect && <span className="text-rose-400 font-bold">✕ Incorrect</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-slate-200 mb-6 space-y-1.5 animate-fadeIn">
                  <p className="font-extrabold text-amber-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <span>📖 Heritage Lore:</span>
                  </p>
                  <p>{quizPool[quizIndex]?.explanation}</p>
                  <p className="text-amber-400/80 font-kannada pt-1 border-t border-white/10">
                    {quizPool[quizIndex]?.explanationKn}
                  </p>
                </div>
              )}

              {/* Next Question Button */}
              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:from-amber-300 hover:to-amber-400 transition-all shadow-gold-glow cursor-pointer"
                >
                  {quizIndex < quizPool.length - 1 ? 'Next Question →' : 'Complete Challenge 🎉'}
                </button>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="glass-dark p-8 rounded-3xl border-2 border-amber-400/50 shadow-royal bg-slate-950/95 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-4xl shadow-gold-glow">
                🏆
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  CHALLENGE COMPLETE
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Master Historian of Mysuru!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-2">
                  You scored <strong className="text-amber-300">{score} Points</strong> on the {quizPool.length}-Question Quiz. Points have been added to your official Heritage Passport.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <p className="text-xl font-mono font-bold text-amber-300">{score}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Quiz Score</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <p className="text-xl font-mono font-bold text-emerald-400">{quizPool.length}/{quizPool.length}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Answered</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <p className="text-xl font-mono font-bold text-cyan-300">{tierInfo.badge}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Rank Tier</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => initializeQuiz(quizMode, quizCategory)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🔄</span>
                  <span>Restart Quiz Challenge</span>
                </button>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-extrabold hover:bg-amber-300 transition-all shadow-gold-glow cursor-pointer flex items-center gap-1.5"
                >
                  <span>📜</span>
                  <span>View & Download Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CERTIFICATE PREVIEW & PDF DOWNLOAD */}
      {/* ========================================================= */}
      {activeTab === 'certificate' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="glass p-5 rounded-3xl border border-amber-400/30 bg-slate-950/80 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs uppercase font-extrabold text-amber-400 font-mono whitespace-nowrap">
                Recipient Name:
              </span>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Name on certificate..."
                className="w-full max-w-xs px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/20 focus:border-amber-400 text-xs font-bold text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadCertificatePDF}
                disabled={isDownloading}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black uppercase tracking-wider hover:from-amber-300 hover:to-amber-400 transition-all shadow-gold-glow cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <span>📥</span>
                <span>{isDownloading ? 'Generating...' : 'Download PDF Certificate'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Print certificate directly"
              >
                <span>🖨️</span>
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Framed Certificate Document Preview Container */}
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div
              ref={certificateRef}
              className="w-[960px] h-[670px] mx-auto bg-gradient-to-br from-slate-950 via-[#0d1235] to-slate-950 border-[5px] border-amber-400 p-8 rounded-3xl relative text-center text-white shadow-2xl flex flex-col justify-between overflow-hidden select-none"
              style={{ minWidth: '960px', minHeight: '670px' }}
            >
              {/* Inner Double Gold Border */}
              <div className="absolute inset-2.5 border border-amber-400/40 rounded-2xl pointer-events-none" />
              <div className="absolute inset-4 border border-amber-400/20 rounded-xl pointer-events-none" />

              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 text-amber-400 text-sm">⚜</div>
              <div className="absolute top-4 right-4 text-amber-400 text-sm">⚜</div>
              <div className="absolute bottom-4 left-4 text-amber-400 text-sm">⚜</div>
              <div className="absolute bottom-4 right-4 text-amber-400 text-sm">⚜</div>

              {/* Background Crest Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* 1. Header: Government & State Emblem */}
              <div className="pt-1">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <span className="text-2xl">🏛️</span>
                  <div className="text-center">
                    <h4 className="text-[11px] uppercase font-black tracking-widest text-amber-300 font-mono">
                      GOVERNMENT OF KARNATAKA • DEPARTMENT OF TOURISM
                    </h4>
                    <p className="text-[10px] text-amber-400/90 font-kannada">
                      ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಪ್ರವಾಸೋದ್ಯಮ ಇಲಾಖೆ • ಮೈಸೂರು ದಸರಾ ೨೦೨೬
                    </p>
                  </div>
                  <span className="text-2xl">👑</span>
                </div>
              </div>

              {/* 2. Certificate Main Title */}
              <div className="my-0.5">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono block">
                  OFFICIAL STATE FESTIVAL CREDENTIAL
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide font-serif mt-0.5">
                  CERTIFICATE OF HERITAGE CITIZENSHIP
                </h2>
                <p className="text-[11px] text-amber-400/80 font-kannada">
                  ಡಿಜಿಟಲ್ ಪರಂಪರೆ ಪ್ರಶಸ್ತಿ ಪತ್ರ
                </p>
              </div>

              {/* 3. Conferred Upon */}
              <div className="my-0.5">
                <p className="text-xs text-slate-300 italic">
                  This credential is officially and proudly conferred upon
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider mt-1 uppercase font-sans border-b-2 border-amber-400/40 inline-block px-8 pb-1">
                  {holderName || 'SRUJAN G M'}
                </h1>
              </div>

              {/* 4. Commendation Text */}
              <p className="text-xs text-slate-200 max-w-2xl mx-auto leading-relaxed">
                in recognition of exemplary on-ground exploration across Mysuru’s historic monuments,
                successfully verifying official landmark check-in stamps and achieving distinction
                in the 400-Year Wadiyar Royal Heritage Knowledge Challenge.
              </p>

              {/* 5. Tier Plaque */}
              <div className="my-1">
                <div className="inline-flex items-center gap-3 px-8 py-2 rounded-2xl bg-[#350d45] border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                  <span className="text-2xl">{tierInfo.badge}</span>
                  <span className="text-sm font-black tracking-widest text-amber-200 font-mono uppercase">
                    {tierInfo.name}
                  </span>
                </div>
              </div>

              {/* 6. Statistics Grid */}
              <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto my-1 text-xs">
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Passport Number</span>
                  <span className="font-bold text-amber-300 font-mono">{passportId}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Verified Stamps</span>
                  <span className="font-bold text-emerald-300 font-mono">{earnedStamps.length} / {stamps.length} Landmarks</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Total Score</span>
                  <span className="font-bold text-amber-300 font-mono">{totalScore} Points</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Issue Date</span>
                  <span className="font-bold text-white font-mono">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* 7. Signatures & Seal Footer */}
              <div className="pt-2 border-t border-amber-400/20 flex items-center justify-between px-6 pb-1">
                {/* Left Signature */}
                <div className="text-center w-56">
                  <div className="h-7 flex items-center justify-center font-serif italic text-amber-200 text-base font-bold">
                    K. R. Chamaraja
                  </div>
                  <div className="w-36 h-0.5 bg-white/40 mx-auto mb-1" />
                  <p className="text-[9px] font-bold text-slate-200">Chairman, Dasara High-Power Committee</p>
                  <p className="text-[8px] text-slate-400">Government of Karnataka</p>
                </div>

                {/* Center Royal Gold Seal */}
                <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-amber-500/10 flex flex-col items-center justify-center shadow-gold-glow relative">
                  <span className="text-base">👑</span>
                  <span className="text-[6.5px] font-black text-amber-300 uppercase tracking-tighter font-mono">
                    DASARA 2026
                  </span>
                  <span className="text-[5.5px] text-emerald-400 font-bold uppercase">
                    OFFICIAL SEAL
                  </span>
                </div>

                {/* Right Signature */}
                <div className="text-center w-56">
                  <div className="h-7 flex items-center justify-center font-serif italic text-amber-200 text-base font-bold">
                    Dr. S. V. Manjunath
                  </div>
                  <div className="w-36 h-0.5 bg-white/40 mx-auto mb-1" />
                  <p className="text-[9px] font-bold text-slate-200">Director, Department of Tourism</p>
                  <p className="text-[8px] text-slate-400">Government of Karnataka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
