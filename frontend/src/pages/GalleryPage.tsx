import React, { useRef, useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { audioManager } from '@/audio/audioManager';
import { jsPDF } from 'jspdf';

// Aspect ratio presets
type AspectRatioMode = 'landscape' | 'portrait' | 'square';

// Preset greetings
interface GreetingPreset {
  id: string;
  label: string;
  en: string;
  kn: string;
  subEn: string;
}

const GREETING_PRESETS: GreetingPreset[] = [
  {
    id: 'classic',
    label: '🌟 Classic Festive',
    en: 'Happy Mysuru Dasara 2026',
    kn: 'ಮೈಸೂರು ದಸರಾ ಶುಭಾಶಯಗಳು ೨೦೨೬',
    subEn: 'May the royal festival of lights illuminate your life with boundless peace & joy.',
  },
  {
    id: 'chamundi',
    label: '👑 Royal Chamundeshwari Blessing',
    en: 'Blessings of Goddess Sri Chamundeshwari',
    kn: 'ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ತಾಯಿಯ ಕೃಪಾಶೀರ್ವಾದ ಸದಾ ಇರಲಿ',
    subEn: 'Commemorating 416 years of glorious Mysore Wadiyar heritage and tradition.',
  },
  {
    id: 'vijayadashami',
    label: '🎊 Vijayadashami Triumph',
    en: 'Auspicious Vijayadashami Greetings',
    kn: 'ವಿಜಯದಶಮಿಯ ಶುಭ ಸಂದರ್ಭದಲ್ಲಿ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು',
    subEn: 'May truth, righteousness, and victory triumph in every step of your journey.',
  },
  {
    id: 'jamboo',
    label: '🐘 World-Famous Jumboo Savari',
    en: 'Greetings from World-Famous Jumboo Savari',
    kn: 'ವಿಶ್ವವಿಖ್ಯಾತ ಮೈಸೂರು ಜಂಬೂಸವಾರಿಯ ವೈಭವದ ಶುಭಾಶಯಗಳು',
    subEn: 'Witnessing the grand 750kg Golden Howdah procession of the royal tuskers.',
  },
  {
    id: 'palace',
    label: '🏰 Palace Illumination Glory',
    en: 'Radiant Dasara Wishes from the Cultural Capital',
    kn: 'ಸಾಂಸ್ಕೃತಿಕ ರಾಜಧಾನಿ ಮೈಸೂರಿನಿಂದ ದಸರಾ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು',
    subEn: 'Gleaming with the splendor of 100,000 golden incandescent bulbs at Amba Vilas.',
  },
];

// Royal themes
interface ThemeOption {
  id: string;
  name: string;
  nameKn: string;
  bg: string[];
  accent: string;
  motif: string;
  description: string;
}

const THEMES: ThemeOption[] = [
  {
    id: 'palace-illumination',
    name: 'Mysore Palace Illumination',
    nameKn: 'ಅಂಬಾವಿಲಾಸ ಅರಮನೆ ದೀಪಾಲಂಕಾರ',
    bg: ['#180629', '#3b0a54', '#8a1d7c', '#c78f10'],
    accent: '#FFD700',
    motif: '🏰',
    description: 'Golden incandescent glow against royal midnight purple.',
  },
  {
    id: 'golden-ambari',
    name: 'Vijayadashami Golden Ambari',
    nameKn: 'ವಿಜಯದಶಮಿ ಚಿನ್ನದ ಅಂಬಾರಿ',
    bg: ['#2b020a', '#6b001a', '#940026', '#d4af37'],
    accent: '#FFD700',
    motif: '🐘',
    description: 'Regal crimson velvet, pure Mysore gold, and procession fanfare.',
  },
  {
    id: 'chamundi-sacred',
    name: 'Chamundi Hills Sacred Sanctum',
    nameKn: 'ಶ್ರೀ ಚಾಮುಂಡಿ ಬೆಟ್ಟದ ಪವಿತ್ರ ಪ್ರಭೆ',
    bg: ['#080e2b', '#13235b', '#1e40af', '#e07a00'],
    accent: '#F59E0B',
    motif: '⛰️',
    description: 'Auspicious turmeric gold, vermilion dusk, and temple bells.',
  },
  {
    id: 'brindavan-fountains',
    name: 'Brindavan Musical Fountains',
    nameKn: 'ಬೃಂದಾವನ ಕಾರಂಜಿಗಳ ನೃತ್ಯ',
    bg: ['#021b24', '#043b46', '#086e7d', '#00b4d8'],
    accent: '#38BDF8',
    motif: '⛲',
    description: 'Aquamarine water jets, illuminated ripples, and celebration night.',
  },
  {
    id: 'wadiyar-durbar',
    name: 'Wadiyar Durbar Hall Emerald',
    nameKn: 'ಒಡೆಯರ್ ದರ್ಬಾರ್ ಪಚ್ಚೆ ವೈಭವ',
    bg: ['#051c14', '#0b3829', '#145c43', '#c5a059'],
    accent: '#A7F3D0',
    motif: '🏛️',
    description: 'Aristocratic emerald velvet, Belgian stained glass, and teak gold.',
  },
  {
    id: 'vintage-archive',
    name: '1910 Vintage Royal Postal Archive',
    nameKn: '೧೯೧೦ ರ ವಿಂಟೇಜ್ ರಾಯಲ್ ಅಂಚೆ ಲಾಂಛನ',
    bg: ['#1f140a', '#3b2414', '#52341d', '#c29d6d'],
    accent: '#F3D5B5',
    motif: '📜',
    description: 'Antique sepia parchment, regal Mysore stamp aesthetic, and nostalgia.',
  },
];

// Frame styles
interface FrameOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const FRAME_STYLES: FrameOption[] = [
  { id: 'double-gold', name: 'Royal Gold & Corner Rosettes', icon: '⚜️', description: 'Dual gold fillet with 4 floral star rosettes' },
  { id: 'palace-arch', name: 'Darbar Gopura Scalloped Arch', icon: '🏛️', description: 'Palatial cusped royal arch at the crown' },
  { id: 'flower-torana', name: 'Marigold & Jasmine Garland', icon: '🌼', description: 'Draped auspicious festive floral festoons' },
  { id: 'palace-bulbs', name: '100,000 Illuminated Bulbs', icon: '💡', description: 'Glowing incandescent palace fairy lights perimeter' },
  { id: 'gandaberunda', name: 'State Royal Crest Filigree', icon: '🦅', description: 'Karnataka twin-headed mythical eagle insignia' },
];

// Photo filters
const PHOTO_FILTERS = [
  { id: 'none', name: 'Original', filterStr: 'none' },
  { id: 'golden-glow', name: 'Royal Gold Glow', filterStr: 'sepia(0.35) saturate(1.4) brightness(1.05)' },
  { id: 'vintage-1910', name: 'Vintage 1910', filterStr: 'sepia(0.8) contrast(1.15) brightness(0.95)' },
  { id: 'royal-velvet', name: 'Velvet Rich', filterStr: 'contrast(1.3) saturate(1.25) brightness(1.02)' },
  { id: 'monochrome', name: 'Heritage B&W', filterStr: 'grayscale(1) contrast(1.25)' },
  { id: 'vivid-festive', name: 'Festive Radiance', filterStr: 'saturate(1.7) brightness(1.1)' },
];

// Sample royal portraits for instant try-out
const SAMPLE_PORTRAITS = [
  { name: 'Elephant Arjuna', role: 'Legendary Lead Tusker', src: '/real-arjuna-face.jpg', icon: '🐘' },
  { name: 'Golden Howdah', role: '750kg Pure Gold Ambari', src: '/real-howdah.jpg', icon: '👑' },
  { name: 'Palace Procession', role: 'Vijayadashami Jamboo Savari', src: '/jamboo-elephant.jpg', icon: '🏰' },
  { name: 'Caparisoned Tusker', role: 'Royal Guard Elephant', src: '/jamboo-elephant-side.jpg', icon: '🛡️' },
];

export default function GalleryPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Studio State
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('landscape');
  const [backgroundTheme, setBackgroundTheme] = useState<string>('palace-illumination');
  const [frameStyle, setFrameStyle] = useState<string>('double-gold');
  const [activeFilter, setActiveFilter] = useState<string>('golden-glow');

  // Text contents
  const [selectedPreset, setSelectedPreset] = useState<string>('classic');
  const [greetingText, setGreetingText] = useState('Happy Mysuru Dasara 2026');
  const [greetingKn, setGreetingKn] = useState('ಮೈಸೂರು ದಸರಾ ಶುಭಾಶಯಗಳು ೨೦೨೬');
  const [subText, setSubText] = useState('May the royal festival of lights illuminate your life with boundless peace & joy.');
  const [recipientName, setRecipientName] = useState('Srujan G M & Family');
  const [presenterTitle, setPresenterTitle] = useState('Royal Heritage Patron');

  // Photo & Medallion State
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [photoScale, setPhotoScale] = useState<number>(1.0);
  const [photoOffsetX, setPhotoOffsetX] = useState<number>(0);
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(0);
  const [photoRotation, setPhotoRotation] = useState<number>(0);

  // Decorative Props & Overlays
  const [showMysorePeta, setShowMysorePeta] = useState<boolean>(true);
  const [showGoldenEmblem, setShowGoldenEmblem] = useState<boolean>(true);
  const [showDiyas, setShowDiyas] = useState<boolean>(true);
  const [showFloralGarland, setShowFloralGarland] = useState<boolean>(false);
  const [showSparkles, setShowSparkles] = useState<boolean>(true);
  const [showVignette, setShowVignette] = useState<boolean>(true);

  // Live Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Feedback toast & UI tabs
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeControlTab, setActiveControlTab] = useState<'photo' | 'theme' | 'props' | 'text'>('photo');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Auto-load a sample portrait on initial mount so canvas immediately looks gorgeous!
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUserImage(img);
    };
    img.src = '/real-arjuna-face.jpg';
  }, []);

  // Handle Preset Selection
  const applyPreset = (preset: GreetingPreset) => {
    setSelectedPreset(preset.id);
    setGreetingText(preset.en);
    setGreetingKn(preset.kn);
    setSubText(preset.subEn);
    audioManager.playClickSound();
  };

  // Handle File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        setPhotoScale(1.0);
        setPhotoOffsetX(0);
        setPhotoOffsetY(0);
        setPhotoRotation(0);
        audioManager.playClickSound();
        setFeedback('✓ Photo uploaded and framed in the Royal Medallion!');
        setTimeout(() => setFeedback(null), 3000);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Select Sample Avatar
  const selectSamplePortrait = (src: string, name: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUserImage(img);
      setPhotoScale(1.0);
      setPhotoOffsetX(0);
      setPhotoOffsetY(0);
      setPhotoRotation(0);
      audioManager.playClickSound();
      setFeedback(`✓ Loaded royal sample: ${name}`);
      setTimeout(() => setFeedback(null), 3000);
    };
    img.src = src;
  };

  // Webcam Capture Functions with Fallback & Auto-attachment
  const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
    setCameraLoading(true);
    setCameraError(null);
    setIsCameraActive(true);
    audioManager.playClickSound();

    // Stop any existing stream
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (firstErr) {
        console.warn('High-res facingMode camera constraint failed, falling back:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      setCameraStream(stream);
      setCameraLoading(false);
    } catch (err: any) {
      console.error('Camera access failed:', err);
      setCameraLoading(false);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access by clicking the lock icon (🔒) in your browser address bar.'
          : 'Could not access webcam. Make sure no other application is using your camera, or try uploading a photo.'
      );
    }
  };

  // Video Ref Callback to guarantee stream attachment as soon as DOM node mounts
  const setVideoNode = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (node && cameraStream) {
        node.srcObject = cameraStream;
        node.onloadedmetadata = () => {
          node.play().catch((e) => console.warn('Video play error on metadata:', e));
        };
        node.play().catch((e) => console.warn('Direct video play error:', e));
      }
    },
    [cameraStream]
  );

  // Secondary effect to ensure video plays if stream arrives after mount
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      const v = videoRef.current;
      v.srcObject = cameraStream;
      v.play().catch((e) => console.warn('useEffect video play error:', e));
    }
  }, [isCameraActive, cameraStream]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setCameraCountdown(null);
    setCameraLoading(false);
    setCameraError(null);
  }, [cameraStream]);

  const snapPhotoWithCountdown = () => {
    audioManager.playClickSound();
    setCameraCountdown(3);

    const timer = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === null) {
          clearInterval(timer);
          return null;
        }
        if (prev <= 1) {
          clearInterval(timer);
          captureCurrentVideoFrame();
          return null;
        }
        audioManager.playBells();
        return prev - 1;
      });
    }, 1000);
  };

  const captureCurrentVideoFrame = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    
    // Ensure video has loaded frames
    const width = v.videoWidth || 640;
    const height = v.videoHeight || 480;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    // Mirror image horizontally if front facing camera for natural selfie feel
    if (facingMode === 'user') {
      offCtx.translate(width, 0);
      offCtx.scale(-1, 1);
    }
    offCtx.drawImage(v, 0, 0, width, height);

    const dataUrl = offCanvas.toDataURL('image/png');
    const img = new Image();
    img.onload = () => {
      setUserImage(img);
      setPhotoScale(1.0);
      setPhotoOffsetX(0);
      setPhotoOffsetY(0);
      setPhotoRotation(0);
      stopCamera();
      audioManager.playRoyalFanfare();
      setFeedback('📸 Royal selfie captured and framed in your medallion!');
      setTimeout(() => setFeedback(null), 3500);
    };
    img.src = dataUrl;
  };

  // Close webcam if user leaves or component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // =========================================================================
  // MASTER CANVAS RENDERER (Ultra-HD / 60 FPS Responsive)
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Logical Dimensions based on Aspect Ratio
    let W = 1000;
    let H = 640;

    if (aspectRatio === 'portrait') {
      W = 680;
      H = 1020;
    } else if (aspectRatio === 'square') {
      W = 840;
      H = 840;
    }

    // High DPI scaling (2x retina for crisp text and graphics)
    canvas.width = W;
    canvas.height = H;

    const currentTheme = THEMES.find((t) => t.id === backgroundTheme) || THEMES[0];

    // -----------------------------------------------------------------------
    // 1. LAYER 1: Deep Royal Gradient Backdrop
    // -----------------------------------------------------------------------
    const bgGrad = ctx.createLinearGradient(0, 0, W * 0.4, H);
    bgGrad.addColorStop(0, currentTheme.bg[0]);
    bgGrad.addColorStop(0.35, currentTheme.bg[1]);
    bgGrad.addColorStop(0.75, currentTheme.bg[2]);
    bgGrad.addColorStop(1, currentTheme.bg[3]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Radial center aura highlight
    const radial = ctx.createRadialGradient(W / 2, H * 0.38, 10, W / 2, H * 0.38, W * 0.55);
    radial.addColorStop(0, 'rgba(255, 223, 0, 0.22)');
    radial.addColorStop(0.4, 'rgba(212, 175, 55, 0.1)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, W, H);

    // -----------------------------------------------------------------------
    // 2. LAYER 2: Sparkle & Bokeh Gold Dust Particles
    // -----------------------------------------------------------------------
    if (showSparkles) {
      ctx.save();
      const sparklePositions = [
        { x: W * 0.12, y: H * 0.18, r: 2.2, o: 0.6 },
        { x: W * 0.22, y: H * 0.12, r: 1.6, o: 0.5 },
        { x: W * 0.88, y: H * 0.16, r: 2.5, o: 0.7 },
        { x: W * 0.8, y: H * 0.24, r: 1.8, o: 0.4 },
        { x: W * 0.15, y: H * 0.65, r: 1.9, o: 0.4 },
        { x: W * 0.85, y: H * 0.7, r: 2.1, o: 0.5 },
        { x: W * 0.28, y: H * 0.82, r: 1.5, o: 0.3 },
        { x: W * 0.72, y: H * 0.82, r: 1.5, o: 0.3 },
        { x: W * 0.5, y: H * 0.08, r: 2.8, o: 0.8 },
      ];

      sparklePositions.forEach((sp) => {
        ctx.fillStyle = `rgba(255, 235, 150, ${sp.o})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fill();

        // 4-point cross glint
        ctx.strokeStyle = `rgba(255, 245, 180, ${sp.o * 0.8})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sp.x - sp.r * 3, sp.y);
        ctx.lineTo(sp.x + sp.r * 3, sp.y);
        ctx.moveTo(sp.x, sp.y - sp.r * 3);
        ctx.lineTo(sp.x, sp.y + sp.r * 3);
        ctx.stroke();
      });
      ctx.restore();
    }

    // -----------------------------------------------------------------------
    // 3. LAYER 3: Chosen Royal Frame Architecture
    // -----------------------------------------------------------------------
    const inset = 18;
    const innerInset = 28;

    // A. Double Gold & Corner Rosettes
    if (frameStyle === 'double-gold' || frameStyle === 'gandaberunda') {
      // Outer bold border
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);

      // Inner delicate hairline border
      ctx.strokeStyle = '#FFE066';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(innerInset, innerInset, W - innerInset * 2, H - innerInset * 2);

      // 4 Corner Rosettes
      const corners = [
        [innerInset, innerInset],
        [W - innerInset, innerInset],
        [innerInset, H - innerInset],
        [W - innerInset, H - innerInset],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#6B4E00';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = '#800020'; // ruby core
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // B. Darbar Gopura Scalloped Palace Arch
    if (frameStyle === 'palace-arch') {
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 5;
      ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);

      // Crown scalloped palace arch
      ctx.save();
      ctx.strokeStyle = '#FFE066';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.beginPath();
      ctx.moveTo(inset + 40, inset + 90);
      ctx.bezierCurveTo(W * 0.25, inset + 10, W * 0.4, inset + 8, W / 2, inset + 8);
      ctx.bezierCurveTo(W * 0.6, inset + 8, W * 0.75, inset + 10, W - inset - 40, inset + 90);
      ctx.stroke();
      ctx.restore();

      // Top Dome Finial (Kalasha)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(W / 2, inset + 8, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // C. Marigold & Jasmine Flower Garland (Torana)
    if (frameStyle === 'flower-torana' || showFloralGarland) {
      ctx.strokeStyle = '#E69500';
      ctx.lineWidth = 4;
      ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);

      // Draw draped garland across top
      const flowerCount = Math.floor(W / 24);
      for (let i = 0; i <= flowerCount; i++) {
        const fx = inset + (i / flowerCount) * (W - inset * 2);
        // Scalloped drape effect
        const sag = Math.sin((i / flowerCount) * Math.PI * 3) * 12 + 8;
        const fy = inset + 10 + sag;

        // Alternate Marigold (orange) & Jasmine (white/cream)
        ctx.fillStyle = i % 2 === 0 ? '#FFA500' : '#FFFDF0';
        ctx.beginPath();
        ctx.arc(fx, fy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = i % 2 === 0 ? '#FF4500' : '#FFD700';
        ctx.beginPath();
        ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // D. 100,000 Illuminated Palace Bulbs Frame
    if (frameStyle === 'palace-bulbs') {
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);

      const bulbSpacing = 28;
      const drawBulb = (bx: number, by: number) => {
        // Outer warm glow
        ctx.fillStyle = 'rgba(255, 230, 100, 0.35)';
        ctx.beginPath();
        ctx.arc(bx, by, 7.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing filament
        ctx.fillStyle = '#FFF275';
        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx.fill();
      };

      // Top & Bottom rows
      for (let x = inset + 10; x <= W - inset - 10; x += bulbSpacing) {
        drawBulb(x, inset);
        drawBulb(x, H - inset);
      }
      // Left & Right columns
      for (let y = inset + 20; y <= H - inset - 20; y += bulbSpacing) {
        drawBulb(inset, y);
        drawBulb(W - inset, y);
      }
    }

    // -----------------------------------------------------------------------
    // 4. LAYER 4: Portrait Medallion Layout Coordinates
    // -----------------------------------------------------------------------
    let medCenterX = W / 2 + photoOffsetX;
    let medCenterY = H * 0.31 + photoOffsetY;
    let medRadius = Math.min(W, H) * 0.175 * photoScale;

    if (aspectRatio === 'portrait') {
      medCenterY = H * 0.33 + photoOffsetY;
      medRadius = W * 0.24 * photoScale;
    } else if (aspectRatio === 'square') {
      medCenterY = H * 0.35 + photoOffsetY;
      medRadius = W * 0.2 * photoScale;
    }

    // Shadow & glow behind the medallion
    ctx.save();
    ctx.shadowColor = 'rgba(255, 215, 0, 0.45)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#1A0B2E';
    ctx.beginPath();
    ctx.arc(medCenterX, medCenterY, medRadius + 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw User Image OR Fallback Icon inside Circular Clip
    if (userImage) {
      ctx.save();
      // Circular clipping path
      ctx.beginPath();
      ctx.arc(medCenterX, medCenterY, medRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Apply CSS-like canvas filter
      const chosenFilter = PHOTO_FILTERS.find((f) => f.id === activeFilter);
      if (chosenFilter && chosenFilter.filterStr !== 'none') {
        ctx.filter = chosenFilter.filterStr;
      }

      // Rotate around medallion center if rotated
      if (photoRotation !== 0) {
        ctx.translate(medCenterX, medCenterY);
        ctx.rotate((photoRotation * Math.PI) / 180);
        ctx.translate(-medCenterX, -medCenterY);
      }

      // Draw aspect-fill scaled image
      const imgRatio = userImage.width / userImage.height;
      let drawW = medRadius * 2;
      let drawH = medRadius * 2;

      if (imgRatio > 1) {
        drawW = drawH * imgRatio;
      } else {
        drawH = drawW / imgRatio;
      }

      ctx.drawImage(
        userImage,
        medCenterX - drawW / 2,
        medCenterY - drawH / 2,
        drawW,
        drawH
      );
      ctx.restore();
    } else {
      // Fallback Royal Motif
      ctx.fillStyle = 'rgba(20, 10, 40, 0.8)';
      ctx.beginPath();
      ctx.arc(medCenterX, medCenterY, medRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `${Math.floor(medRadius * 1.05)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentTheme.motif, medCenterX, medCenterY);
    }

    // Double Golden Rim with Royal Jewel Studs around Medallion
    ctx.save();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(medCenterX, medCenterY, medRadius + 2.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#FFE27A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(medCenterX, medCenterY, medRadius + 6, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Jewel Studs around rim
    const studCount = 12;
    for (let i = 0; i < studCount; i++) {
      const angle = (i / studCount) * Math.PI * 2;
      const sx = medCenterX + Math.cos(angle) * (medRadius + 4.2);
      const sy = medCenterY + Math.sin(angle) * (medRadius + 4.2);

      ctx.fillStyle = i % 2 === 0 ? '#E60000' : '#FFDF00'; // ruby & gold
      ctx.beginPath();
      ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // -----------------------------------------------------------------------
    // 5. LAYER 5: Mysore Peta (Turban) Overlay on top of Medallion
    // -----------------------------------------------------------------------
    if (showMysorePeta) {
      ctx.save();
      const turbanY = medCenterY - medRadius + 4;
      const turbanW = medRadius * 1.5;
      const turbanH = medRadius * 0.65;

      // Rich Maroon & Gold Royal Mysore Peta Cap
      ctx.fillStyle = '#7A001E'; // deep Mysore royal maroon
      ctx.beginPath();
      ctx.ellipse(medCenterX, turbanY, turbanW / 2, turbanH / 2, 0, Math.PI, 0);
      ctx.fill();

      // Golden Zari wrap line
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(medCenterX, turbanY - 2, turbanW / 2.2, Math.PI * 0.9, Math.PI * 0.1, true);
      ctx.stroke();

      // Top Kalgi / Feather Plume brooch
      ctx.fillStyle = '#FFDF00';
      ctx.beginPath();
      ctx.arc(medCenterX, turbanY - turbanH / 2 - 4, 5, 0, Math.PI * 2);
      ctx.fill();

      // Ruby center gem
      ctx.fillStyle = '#C00020';
      ctx.beginPath();
      ctx.arc(medCenterX, turbanY - turbanH / 2 - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Delicate golden plume sprig
      ctx.strokeStyle = '#FFF3A8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(medCenterX, turbanY - turbanH / 2 - 8);
      ctx.quadraticCurveTo(medCenterX + 10, turbanY - turbanH / 2 - 22, medCenterX + 14, turbanY - turbanH / 2 - 28);
      ctx.stroke();
      ctx.restore();
    }

    // -----------------------------------------------------------------------
    // 6. LAYER 6: Auspicious Diyas (Lamps) on bottom flanks
    // -----------------------------------------------------------------------
    if (showDiyas) {
      const drawDiya = (dx: number, dy: number) => {
        ctx.save();
        // Golden Clay Base
        ctx.fillStyle = '#B3541E';
        ctx.beginPath();
        ctx.ellipse(dx, dy, 16, 7, 0, 0, Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Radiating Golden Flame
        ctx.fillStyle = 'rgba(255, 180, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(dx, dy - 6, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFF176';
        ctx.beginPath();
        ctx.moveTo(dx - 5, dy - 2);
        ctx.quadraticCurveTo(dx - 6, dy - 12, dx, dy - 18);
        ctx.quadraticCurveTo(dx + 6, dy - 12, dx + 5, dy - 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(dx, dy - 6, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const diyaY = H - innerInset - 16;
      drawDiya(innerInset + 26, diyaY);
      drawDiya(W - innerInset - 26, diyaY);
    }

    // -----------------------------------------------------------------------
    // 7. LAYER 7: Royal Gandaberunda / State Crest (Top Left or Top Center)
    // -----------------------------------------------------------------------
    if (showGoldenEmblem) {
      ctx.save();
      const crestX = W * 0.14;
      const crestY = H * 0.12;

      // Small ornamental crest seal
      ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
      ctx.beginPath();
      ctx.arc(crestX, crestY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 15px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👑', crestX, crestY - 1);

      ctx.font = 'bold 7px system-ui, sans-serif';
      ctx.fillStyle = '#FFE082';
      ctx.fillText('1610-2026', crestX, crestY + 12);
      ctx.restore();
    }

    // -----------------------------------------------------------------------
    // 8. LAYER 8: Typography, Headers, Greetings & Recipient Plaque
    // -----------------------------------------------------------------------
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Top Brand Tagline
    let headerY = H * 0.1;
    if (aspectRatio === 'portrait') headerY = H * 0.08;

    ctx.fillStyle = '#FFE082';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('ಕನ್ನಡ ನಾಡಹಬ್ಬ  •  MYSURU DASARA 2026', W / 2, headerY);

    // Decorative divider line under brand
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 120, headerY + 7);
    ctx.lineTo(W / 2 + 120, headerY + 7);
    ctx.stroke();

    // Central Greeting Texts (Positioned beneath the Medallion)
    let textStartY = medCenterY + medRadius + (aspectRatio === 'portrait' ? 44 : 32);

    // Main Greeting English
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 25px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(greetingText, W / 2, textStartY);
    ctx.shadowBlur = 0;

    // Kannada Greeting (Warm Gold)
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 19px "Noto Sans Kannada", sans-serif';
    ctx.fillText(greetingKn, W / 2, textStartY + 28);

    // Subtitle / Commemorative Wish
    ctx.fillStyle = 'rgba(235, 240, 255, 0.85)';
    ctx.font = 'italic 12px system-ui, sans-serif';
    ctx.fillText(subText, W / 2, textStartY + 50);

    // Recipient Royal Name Plaque
    const plaqueY = textStartY + 64;
    const plaqueW = Math.min(W - 80, 480);
    const plaqueH = 46;
    const plaqueX = (W - plaqueW) / 2;

    // Plaque Background with subtle translucent glass
    ctx.fillStyle = 'rgba(12, 15, 38, 0.82)';
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 14);
    ctx.fill();

    // Plaque Gold Border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Plaque Text: "Presented To / In Honor Of"
    ctx.fillStyle = '#FFDF00';
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(
      `${presenterTitle.toUpperCase()} :`,
      W / 2,
      plaqueY + 16
    );

    // Recipient Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillText(recipientName || 'Royal Heritage Visitor', W / 2, plaqueY + 36);

    // -----------------------------------------------------------------------
    // 9. LAYER 9: Footer Seal & Authenticity Stamp
    // -----------------------------------------------------------------------
    const footerY = H - inset - 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '9.5px system-ui, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(
      'OFFICIAL COMMEMORATIVE SOUVENIR  •  OCTOBER 2026  •  DEPARTMENT OF TOURISM, GOVT OF KARNATAKA',
      W / 2,
      footerY
    );

    // -----------------------------------------------------------------------
    // 10. LAYER 10: Vignette Edge Darkening (Optional)
    // -----------------------------------------------------------------------
    if (showVignette) {
      const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.max(W, H) * 0.72);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }
  }, [
    aspectRatio,
    backgroundTheme,
    frameStyle,
    activeFilter,
    greetingText,
    greetingKn,
    subText,
    recipientName,
    presenterTitle,
    userImage,
    photoScale,
    photoOffsetX,
    photoOffsetY,
    photoRotation,
    showMysorePeta,
    showGoldenEmblem,
    showDiyas,
    showFloralGarland,
    showSparkles,
    showVignette,
  ]);

  // =========================================================================
  // EXPORT 1: DOWNLOAD HIGH-RESOLUTION PNG SOUVENIR (2x Retina Clarity)
  // =========================================================================
  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    audioManager.playRoyalFanfare();

    try {
      const link = document.createElement('a');
      const safeName = (recipientName || 'Mysore_Dasara').trim().replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `Mysuru_Dasara_2026_${safeName}_Souvenir.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setFeedback('✓ Ultra-HD Royal Souvenir PNG downloaded!');
    } catch (err) {
      console.error(err);
      setFeedback('❌ Failed to download image.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // =========================================================================
  // EXPORT 2: DOWNLOAD PDF COMMEMORATIVE POSTCARD VIA JSPDF
  // =========================================================================
  const downloadPDFPostcard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    audioManager.playRoyalFanfare();

    try {
      const isPortrait = aspectRatio === 'portrait';
      const doc = new jsPDF({
        orientation: isPortrait ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageW = isPortrait ? 210 : 297;
      const pageH = isPortrait ? 297 : 210;

      // Dark Royal Blue Outer Card Frame
      doc.setFillColor(10, 14, 38);
      doc.rect(0, 0, pageW, pageH, 'F');

      // Double Gold Decorative Border
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1.4);
      doc.rect(8, 8, pageW - 16, pageH - 16);

      doc.setDrawColor(255, 223, 0);
      doc.setLineWidth(0.4);
      doc.rect(11, 11, pageW - 22, pageH - 22);

      // Convert Canvas to High Quality Image
      const imgData = canvas.toDataURL('image/jpeg', 0.96);

      // Fit inside the postcard with neat margins
      const margin = 16;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2 - 14;

      const canvasRatio = canvas.width / canvas.height;
      let finalW = availW;
      let finalH = finalW / canvasRatio;

      if (finalH > availH) {
        finalH = availH;
        finalW = finalH * canvasRatio;
      }

      const imgX = (pageW - finalW) / 2;
      const imgY = margin;

      doc.addImage(imgData, 'JPEG', imgX, imgY, finalW, finalH);

      // Footer Postcard Notation
      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('GOVERNMENT OF KARNATAKA  •  DEPARTMENT OF TOURISM  •  MYSURU DASARA 2026', pageW / 2, pageH - 11, {
        align: 'center',
      });

      const safeName = (recipientName || 'Visitor').trim().replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Mysuru_Dasara_Postcard_${safeName}.pdf`);
      setFeedback('✓ Official PDF Postcard downloaded!');
    } catch (err) {
      console.error(err);
      setFeedback('❌ Failed to export PDF postcard.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // =========================================================================
  // EXPORT 3: COPY IMAGE TO CLIPBOARD
  // =========================================================================
  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    audioManager.playClickSound();

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setFeedback('✓ Image copied to clipboard! Paste directly into WhatsApp or Instagram (Ctrl+V).');
        setTimeout(() => setFeedback(null), 4000);
      });
    } catch (err) {
      console.warn('Clipboard write failed, fallback to download:', err);
      downloadPNG();
    }
  };

  // =========================================================================
  // EXPORT 4: NATIVE WEB SHARE API (WhatsApp / Telegram / Mobile)
  // =========================================================================
  const shareSouvenir = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    audioManager.playClickSound();

    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'mysuru_dasara_2026_souvenir.png', { type: 'image/png' });
          await navigator.share({
            title: 'Mysuru Dasara 2026 Royal Souvenir',
            text: `${greetingText} - ${greetingKn} | Mysuru Dasara 2026`,
            files: [file],
          });
        });
      } catch (err) {
        console.log('Share canceled or not supported:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col text-slate-100">
      <PageHeader
        title="AI & Canvas Festival Photo Studio"
        titleKn="ದಸರಾ ಭಾವಚಿತ್ರ ಸ್ಟುಡಿಯೋ"
        subtitle="Create personalized royal commemorative Dasara greeting cards, upload your photo into the golden medallion, take a live royal selfie, apply festive turban accessories, and download high-resolution souvenirs in PNG & PDF."
      />

      {/* Toast Alert Feedback */}
      {feedback && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce border border-amber-300">
          <span className="text-base">✨</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Aspect Ratio & Format Bar */}
      <div className="glass-dark border border-amber-400/30 p-3 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3 shadow-royal">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>📐 Aspect Ratio:</span>
          </span>
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setAspectRatio('landscape');
                audioManager.playClickSound();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aspectRatio === 'landscape'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Landscape (Postcard)
            </button>
            <button
              onClick={() => {
                setAspectRatio('portrait');
                audioManager.playClickSound();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aspectRatio === 'portrait'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Portrait (Story / Status)
            </button>
            <button
              onClick={() => {
                setAspectRatio('square');
                audioManager.playClickSound();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aspectRatio === 'square'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Square (Avatar / Post)
            </button>
          </div>
        </div>

        {/* Quick Reset Button */}
        <button
          onClick={() => {
            setPhotoScale(1.0);
            setPhotoOffsetX(0);
            setPhotoOffsetY(0);
            setPhotoRotation(0);
            setActiveFilter('golden-glow');
            setShowMysorePeta(true);
            setShowGoldenEmblem(true);
            setShowDiyas(true);
            audioManager.playClickSound();
            setFeedback('✓ Layout controls reset to royal default!');
            setTimeout(() => setFeedback(null), 2500);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>🔄 Reset Alignment</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =================================================================== */}
        {/* LEFT COLUMN: LIVE CANVAS PREVIEW & QUICK EXPORT BAR (7 COLS) */}
        {/* =================================================================== */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          {/* Framed Canvas Box */}
          <div className="w-full glass-dark p-3.5 sm:p-5 rounded-3xl border-2 border-amber-400/40 shadow-royal overflow-hidden relative group">
            <div className="relative w-full flex items-center justify-center bg-slate-950/60 rounded-2xl p-2 border border-white/10">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-[620px] object-contain rounded-xl shadow-2xl transition-all duration-300"
              />
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
            <button
              onClick={downloadPNG}
              disabled={isExporting}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black uppercase tracking-wider hover:from-amber-300 hover:to-amber-400 transition-all shadow-gold-glow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>📥</span>
              <span>Ultra-HD PNG</span>
            </button>

            <button
              onClick={downloadPDFPostcard}
              disabled={isExporting}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-xs font-bold uppercase tracking-wider hover:from-purple-600 hover:to-indigo-700 transition-all border border-purple-400/40 shadow-royal cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>📜</span>
              <span>PDF Postcard</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer flex items-center justify-center gap-1.5"
              title="Copy to clipboard to paste in WhatsApp"
            >
              <span>📋</span>
              <span>Copy Image</span>
            </button>

            <button
              onClick={shareSouvenir}
              className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🔗</span>
              <span>Share Card</span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: RICH STUDIO CONTROLS (5 COLS) */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 glass-dark p-5 sm:p-6 rounded-3xl border border-amber-400/30 shadow-royal space-y-6">
          {/* Studio Category Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setActiveControlTab('photo');
                audioManager.playClickSound();
              }}
              className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeControlTab === 'photo'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-sm">📸</span>
              <span>Photo</span>
            </button>

            <button
              onClick={() => {
                setActiveControlTab('theme');
                audioManager.playClickSound();
              }}
              className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeControlTab === 'theme'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-sm">🎨</span>
              <span>Theme</span>
            </button>

            <button
              onClick={() => {
                setActiveControlTab('props');
                audioManager.playClickSound();
              }}
              className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeControlTab === 'props'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-sm">✨</span>
              <span>Props</span>
            </button>

            <button
              onClick={() => {
                setActiveControlTab('text');
                audioManager.playClickSound();
              }}
              className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeControlTab === 'text'
                  ? 'bg-amber-400 text-black shadow-gold-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-sm">✍️</span>
              <span>Wishes</span>
            </button>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* TAB 1: PHOTO & PORTRAIT CONTROLS */}
          {/* --------------------------------------------------------------- */}
          {activeControlTab === 'photo' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Photo Input Methods: Upload or Webcam */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Add Your Face / Photograph
                </label>

                <div className="flex gap-2.5">
                  <label className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs text-center cursor-pointer transition-all shadow-gold-glow flex items-center justify-center gap-1.5">
                    <span>📁</span>
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => startCamera('user')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white font-bold text-xs border border-purple-400/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>📸</span>
                    <span>Live Royal Selfie</span>
                  </button>
                </div>

                {userImage && (
                  <button
                    onClick={() => {
                      setUserImage(null);
                      audioManager.playClickSound();
                    }}
                    className="text-[11px] text-red-400 hover:text-red-300 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>✕</span>
                    <span>Remove uploaded photo (Switch to theme motif)</span>
                  </button>
                )}
              </div>

              {/* Sample Royal Avatars (Quick-Fill) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-2">
                  Or Pick a Royal Heritage Icon:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_PORTRAITS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSamplePortrait(p.src, p.name)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/60 text-left transition-all flex items-center gap-2 cursor-pointer group"
                    >
                      <span className="text-xl">{p.icon}</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{p.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Filters */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Photo Filters & Aura
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PHOTO_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFilter(f.id);
                        audioManager.playClickSound();
                      }}
                      className={`p-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        activeFilter === f.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine-Tuning Sliders: Scale, Offsets, Rotation */}
              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-3">
                <p className="text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>Medallion Alignment Controls</span>
                  <button
                    onClick={() => {
                      setPhotoScale(1.0);
                      setPhotoOffsetX(0);
                      setPhotoOffsetY(0);
                      setPhotoRotation(0);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Reset
                  </button>
                </p>

                {/* Scale */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Zoom / Scale:</span>
                    <span className="font-mono">{photoScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="2.2"
                    step="0.05"
                    value={photoScale}
                    onChange={(e) => setPhotoScale(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Position Offset X */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Horizontal Position (X):</span>
                    <span className="font-mono">{photoOffsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-120"
                    max="120"
                    step="2"
                    value={photoOffsetX}
                    onChange={(e) => setPhotoOffsetX(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Position Offset Y */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Vertical Position (Y):</span>
                    <span className="font-mono">{photoOffsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-120"
                    max="120"
                    step="2"
                    value={photoOffsetY}
                    onChange={(e) => setPhotoOffsetY(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Rotation:</span>
                    <span className="font-mono">{photoRotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={photoRotation}
                    onChange={(e) => setPhotoRotation(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 2: THEME & FRAME SELECTOR */}
          {/* --------------------------------------------------------------- */}
          {activeControlTab === 'theme' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Background Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Royal Background Backdrop & Aura
                </label>
                <div className="space-y-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setBackgroundTheme(t.id);
                        audioManager.playClickSound();
                      }}
                      className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                        backgroundTheme === t.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-royal'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.motif}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{t.name}</p>
                          <p className="text-[10px] text-amber-300/80 font-kannada">{t.nameKn}</p>
                          <p className="text-[10px] text-slate-400">{t.description}</p>
                        </div>
                      </div>
                      {backgroundTheme === t.id && (
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Style Selector */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Card Frame Architectural Style
                </label>
                <div className="space-y-2">
                  {FRAME_STYLES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFrameStyle(f.id);
                        audioManager.playClickSound();
                      }}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                        frameStyle === f.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{f.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{f.name}</p>
                          <p className="text-[10px] text-slate-400">{f.description}</p>
                        </div>
                      </div>
                      {frameStyle === f.id && <span className="text-amber-400 font-bold text-xs">✓ Active</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Toggles */}
              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Cinematic Dark Vignette</p>
                  <p className="text-[10px] text-slate-400">Adds dramatic focus on the central royal portrait</p>
                </div>
                <input
                  type="checkbox"
                  checked={showVignette}
                  onChange={(e) => setShowVignette(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 3: PROPS, ACCESSORIES & FESTIVE STICKERS */}
          {/* --------------------------------------------------------------- */}
          {activeControlTab === 'props' && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                Royal Props & Auspicious Embellishments
              </label>
              <p className="text-[11px] text-slate-400 mb-3">
                Toggle authentic historical emblems, headwear, and festive symbols directly onto your card:
              </p>

              {/* Prop 1: Mysore Peta */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <p className="text-xs font-bold text-white">Royal Mysore Peta (Turban)</p>
                    <p className="text-[10px] text-slate-400">Traditional maroon & gold zari headwear with jewel plume</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showMysorePeta}
                  onChange={(e) => {
                    setShowMysorePeta(e.target.checked);
                    audioManager.playClickSound();
                  }}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Prop 2: Gandaberunda Seal */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🦅</span>
                  <div>
                    <p className="text-xs font-bold text-white">State Royal Crest Seal (1610-2026)</p>
                    <p className="text-[10px] text-slate-400">Two-headed mythical bird of the Karnataka Wadiyars</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showGoldenEmblem}
                  onChange={(e) => {
                    setShowGoldenEmblem(e.target.checked);
                    audioManager.playClickSound();
                  }}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Prop 3: Auspicious Diyas */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🪔</span>
                  <div>
                    <p className="text-xs font-bold text-white">Sacred Clay Deepa (Lamps)</p>
                    <p className="text-[10px] text-slate-400">Lit oil lamps at bottom corners for festival radiance</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showDiyas}
                  onChange={(e) => {
                    setShowDiyas(e.target.checked);
                    audioManager.playClickSound();
                  }}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Prop 4: Marigold Garland */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌼</span>
                  <div>
                    <p className="text-xs font-bold text-white">Marigold & Jasmine Torana</p>
                    <p className="text-[10px] text-slate-400">Auspicious fresh flower garland draped across the top</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showFloralGarland}
                  onChange={(e) => {
                    setShowFloralGarland(e.target.checked);
                    audioManager.playClickSound();
                  }}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Prop 5: Starlight & Bokeh */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="text-xs font-bold text-white">Golden Sparkle Dust & Bokeh</p>
                    <p className="text-[10px] text-slate-400">Floating celestial particles around the card aura</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showSparkles}
                  onChange={(e) => {
                    setShowSparkles(e.target.checked);
                    audioManager.playClickSound();
                  }}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 4: WISHES, GREETINGS & NAMES */}
          {/* --------------------------------------------------------------- */}
          {activeControlTab === 'text' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Preset Wishes Quick-Pick */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Quick Festival Greeting Presets
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                  {GREETING_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        selectedPreset === p.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{p.label}</p>
                      <p className="text-[11px] text-amber-300/90 font-kannada truncate">{p.kn}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Recipient Name / Family Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Srujan G M & Family"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Title / Honorific */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Honorary Title Ribbon
                </label>
                <input
                  type="text"
                  value={presenterTitle}
                  onChange={(e) => setPresenterTitle(e.target.value)}
                  placeholder="e.g. Royal Heritage Patron / Distinguished Guest"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Custom English Greeting */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Custom Greeting Header (English)
                </label>
                <input
                  type="text"
                  value={greetingText}
                  onChange={(e) => setGreetingText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Custom Kannada Greeting */}
              <div>
                <label className="block text-xs font-bold text-amber-300 font-kannada mb-1">
                  ಶುಭಾಶಯ ಸಂದೇಶ (ಕನ್ನಡ)
                </label>
                <input
                  type="text"
                  value={greetingKn}
                  onChange={(e) => setGreetingKn(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-amber-300 text-xs font-kannada focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Commemorative Subtext */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Festival Blessings Line
                </label>
                <textarea
                  rows={2}
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/20 text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: LIVE WEBCAM SELFIE CAPTURE */}
      {/* ===================================================================== */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 max-w-lg w-full text-center relative shadow-2xl space-y-4">
            {/* Close Button */}
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ROYAL LIVE CAMERA</span>
              </span>
              <h3 className="text-xl font-black text-white mt-1">Capture Your Dasara Selfie</h3>
              <p className="text-xs text-slate-300 mt-1">
                Position your face inside the golden medallion frame and snap!
              </p>
            </div>

            {/* Error State */}
            {cameraError ? (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-400/30 text-left space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <span>⚠️</span>
                  <span>Camera Access Blocked</span>
                </div>
                <p className="text-xs text-slate-300">{cameraError}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 cursor-pointer"
                  >
                    🔄 Retry Camera
                  </button>
                  <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer">
                    📁 Upload Photo Instead
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        stopCamera();
                        handleImageUpload(e);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* Video Viewfinder with Circular Golden Guide */
              <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-amber-400 shadow-gold-glow bg-slate-900 flex items-center justify-center">
                {cameraLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-300 gap-2 z-10 bg-slate-950/80">
                    <span className="animate-spin text-3xl">⚙️</span>
                    <span className="text-xs font-bold">Accessing camera feed...</span>
                  </div>
                )}

                <video
                  ref={setVideoNode}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
                />

                {/* Countdown Overlay */}
                {cameraCountdown !== null && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                    <span className="text-7xl font-black text-amber-300 animate-ping">
                      {cameraCountdown}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Shutter Action Buttons */}
            {!cameraError && (
              <div className="flex flex-wrap gap-2.5 justify-center pt-2">
                <button
                  onClick={captureCurrentVideoFrame}
                  disabled={cameraLoading || cameraCountdown !== null}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-gold-glow transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>⚡</span>
                  <span>Instant Snap</span>
                </button>

                <button
                  onClick={snapPhotoWithCountdown}
                  disabled={cameraLoading || cameraCountdown !== null}
                  className="px-5 py-2.5 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider border border-purple-400/40 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>⏱️</span>
                  <span>{cameraCountdown !== null ? `Snapping in ${cameraCountdown}...` : '3s Timer'}</span>
                </button>

                <button
                  onClick={() => {
                    const nextMode = facingMode === 'user' ? 'environment' : 'user';
                    setFacingMode(nextMode);
                    startCamera(nextMode);
                  }}
                  disabled={cameraLoading}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
                  title="Switch between front and back camera"
                >
                  <span>🔄</span>
                  <span>Flip</span>
                </button>

                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
