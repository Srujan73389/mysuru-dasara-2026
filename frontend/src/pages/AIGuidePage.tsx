import React, { useState, useRef, useEffect, useCallback } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import GMSGuide, { GMSGesture } from '@/characters/GMSGuide';
import { aiAPI } from '@/services/api';
import { audioManager } from '@/audio/audioManager';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isAiGenerated?: boolean;
  timestamp: string;
  isStreaming?: boolean;
  landmarkCard?: {
    title: string;
    titleKn?: string;
    badge: string;
    timing: string;
    location: string;
    mapQuery: string;
    ticketPrice?: string;
    actionLabel?: string;
    actionLink?: string;
  };
  suggestedReplies?: string[];
}

type GuidePersona = 'friendly' | 'historian' | 'foodie' | 'family';

// Simple Web Audio Chimes
const playChime = (type: 'send' | 'receive' | 'click' | 'call') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'send') {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'receive') {
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'call') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch {}
};

// Render bold markdown segments
function renderBold(content: string) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-amber-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Markdown-like conversational text formatter
function FormattedMessage({ text }: { text: string }) {
  const paragraphs = text.split('\n\n');
  return (
    <div className="space-y-2.5 leading-relaxed text-xs md:text-sm">
      {paragraphs.map((para, pIdx) => {
        if (!para.trim()) return null;

        const lines = para.split('\n');
        const hasBullets = lines.some(
          (l) => l.trim().startsWith('- ') || l.trim().startsWith('• ') || /^\d+\.\s/.test(l.trim())
        );

        if (hasBullets) {
          return (
            <div key={pIdx} className="space-y-1 pl-1">
              {lines.map((line, lIdx) => {
                if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                  const item = line.trim().replace(/^[-•]\s*/, '');
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-2">
                      <span className="text-amber-400 mt-1 text-xs shrink-0">◆</span>
                      <span>{renderBold(item)}</span>
                    </div>
                  );
                }
                const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
                if (numMatch) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-2">
                      <span className="font-bold text-amber-400 text-xs min-w-[1.2rem] shrink-0">
                        {numMatch[1]}.
                      </span>
                      <span>{renderBold(numMatch[2])}</span>
                    </div>
                  );
                }
                return <p key={lIdx}>{renderBold(line)}</p>;
              })}
            </div>
          );
        }

        return <p key={pIdx}>{renderBold(para)}</p>;
      })}
    </div>
  );
}

// Pulsing Audio Waveform Component
function AudioWaveVisualizer({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs shadow-sm">
      <div className="flex items-end gap-0.5 h-4">
        {[0.6, 1, 0.4, 0.9, 0.5, 0.8, 0.3].map((heightScale, i) => (
          <span
            key={i}
            className={`w-0.5 rounded-full bg-amber-400 transition-all duration-150 ${
              active ? 'animate-pulse' : 'h-1 opacity-40'
            }`}
            style={{
              height: active ? `${Math.max(4, heightScale * 16)}px` : '4px',
              animationDelay: `${i * 90}ms`,
            }}
          />
        ))}
      </div>
      <span className="font-bold text-[11px]">{label}</span>
    </div>
  );
}

// Charismatic Living Digital Avatar of G M SRUJAN
function LivingGMSAvatar({
  speaking,
  listening,
  onGreet,
}: {
  speaking: boolean;
  listening: boolean;
  onGreet: () => void;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full h-full min-h-[380px] bg-gradient-to-b from-[#1a082b] via-[#120520] to-[#0a0212] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden rounded-2xl border border-amber-400/20 group select-none"
    >
      {/* Decorative Palace Arch Background Silhouette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating Sparkles & Rings */}
      <div className="absolute w-64 h-64 rounded-full border border-amber-400/20 animate-spin-slow pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full border border-yellow-300/15 pointer-events-none" />

      {/* Interactive Avatar Face Circle */}
      <div
        className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1.5 shadow-gold-glow cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
        onClick={onGreet}
        title="Tap G M Srujan to say hello!"
      >
        <div className="w-full h-full rounded-full bg-[#180927] flex flex-col items-center justify-center relative overflow-hidden border-2 border-white/20">
          {/* Royal Mysore Peta on head */}
          <div className="absolute top-2 w-28 h-12 bg-gradient-to-r from-[#660A18] via-[#851025] to-[#660A18] rounded-t-full border-b-2 border-amber-400 shadow-md flex items-center justify-center">
            {/* Jewel Kalgi */}
            <div className="w-3 h-4 bg-amber-400 rounded-full border border-amber-200 shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            {/* Golden Ribbon */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300" />
          </div>

          {/* Face Area */}
          <div className="mt-8 flex flex-col items-center">
            {/* Vermilion Kumkum Tilak */}
            <div className="w-1.5 h-3 bg-red-600 rounded-full mb-1 shadow-sm" />

            {/* Smart Spectacles & Expressive Eyes */}
            <div className="flex items-center gap-2 relative">
              <div className="w-7 h-7 rounded-full border-2 border-amber-400 bg-black/40 flex items-center justify-center shadow-inner">
                {/* Eye pupil tracking mouse */}
                <div
                  className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>
              </div>

              {/* Specs bridge */}
              <div className="w-2 h-0.5 bg-amber-400" />

              <div className="w-7 h-7 rounded-full border-2 border-amber-400 bg-black/40 flex items-center justify-center shadow-inner">
                <div
                  className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>
              </div>
            </div>

            {/* Confident Friendly Smile */}
            <div
              className={`w-6 border-b-2 border-amber-300 rounded-b-full mt-2 transition-all ${
                speaking ? 'h-4 bg-red-950/80 animate-pulse' : 'h-2'
              }`}
            />
          </div>

          {/* Modern Royal Bandhgala Collar Strip */}
          <div className="absolute -bottom-1 inset-x-0 h-10 bg-gradient-to-r from-[#5E0F21] via-[#FAF5EB] to-[#5E0F21] border-t border-amber-400/50 flex items-center justify-center">
            <span className="text-[9px] font-black text-amber-400 tracking-wider">
              ✦ G M SRUJAN ✦
            </span>
          </div>
        </div>

        {/* Dynamic Speaking / Listening Aura */}
        {speaking && (
          <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-60 pointer-events-none" />
        )}
        {listening && (
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-75 pointer-events-none" />
        )}
      </div>

      {/* Guide Identity & Status */}
      <div className="relative z-10 mt-4 space-y-1">
        <h4 className="text-base md:text-lg font-black text-cream flex items-center justify-center gap-1.5">
          <span>G M SRUJAN</span>
          <span className="text-amber-400 font-kannada text-sm">(ಜಿ.ಎಂ. ಸೃಜನ್)</span>
        </h4>
        <p className="text-xs text-amber-300/90 font-medium">
          Official Mysuru Dasara AI Guide & Cultural Ambassador
        </p>
        <p className="text-[11px] text-cream/70 max-w-xs pt-1 leading-relaxed">
          {speaking
            ? '🗣️ "Sharing real festival insights with you right now..."'
            : listening
            ? '👂 "Listening to your voice..."'
            : '😊 "Ask me anything about festival events, secret spots, or delicious food!"'}
        </p>
      </div>

      {/* Interactive Quick Greet Button */}
      <div className="mt-4 relative z-10">
        <button
          onClick={onGreet}
          className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>👋 Say "Namaskara Srujan!"</span>
        </button>
      </div>
    </div>
  );
}

export default function AIGuidePage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        '**ನಮಸ್ಕಾರ! Welcome to Mysuru Dasara 2026.**\n\nI am **G M SRUJAN (ಜಿ.ಎಂ. ಸೃಜನ್)**, your official AI Tour Guide & Cultural Ambassador. I am here to help you experience our royal city to the fullest!\n\nWhether you need insider tips on the 100,000 bulb palace illumination, the 750kg Golden Howdah procession, authentic food spots, or parking logistics... ask me anything!\n\n**How can I help you plan your visit today?**',
      isAiGenerated: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedReplies: [
        '✨ What time are the palace lights turned on?',
        '🐘 Tell me about the Golden Howdah procession',
        '🍛 Where can I taste original Mysore Pak?',
        '🎫 How to get tickets & passes?',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [guidePersona, setGuidePersona] = useState<GuidePersona>('friendly');
  const [avatarView, setAvatarView] = useState<'portrait' | '3d'>('portrait');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [gesture, setGesture] = useState<GMSGesture>('namaskara');
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [id: string]: 'up' | 'down' }>({});
  const [voicePlaybackEnabled, setVoicePlaybackEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Phone / Voice Call Mode State
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  // Scoped ref for the chat message container (fixes the full page scrolling issue!)
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fixed container-only scroll: Keeps outer page window completely still!
  useEffect(() => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTo({
        top: chatMessagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  // Call duration timer
  useEffect(() => {
    let timer: any = null;
    if (isVoiceCallActive) {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isVoiceCallActive]);

  // Specific Landmark Card Detection (Checks user query & specific topic; ignores generic greetings!)
  const detectLandmarkCard = (userQuery: string, replyText: string) => {
    const q = userQuery.toLowerCase().trim();
    const r = replyText.toLowerCase();

    // Do NOT show landmark cards for greetings or personal questions
    const isGreeting =
      q.includes('how are you') ||
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('hey') ||
      q.includes('who are you') ||
      q.includes('srujan') ||
      q.includes('ಹೇಗಿದ್ದೀರಿ') ||
      q.includes('ಯಾರು ನೀವು');

    if (isGreeting && !q.includes('palace') && !q.includes('jamboo') && !q.includes('chamundi')) {
      return undefined;
    }

    // Palace illumination
    if (
      q.includes('palace') ||
      q.includes('light') ||
      q.includes('illumination') ||
      q.includes('bulb') ||
      q.includes('ಅರಮನೆ') ||
      q.includes('ದೀಪ') ||
      (r.includes('100,000 golden incandescent bulbs') && (q.includes('when') || q.includes('time') || q.includes('visit')))
    ) {
      return {
        title: 'Mysore Palace (Amba Vilas)',
        titleKn: 'ಅಂಬಾವಿಲಾಸ ಮೈಸೂರು ಅರಮನೆ',
        badge: 'Top Highlight • 100,000 Bulbs',
        timing: 'Illumination: 7:00 PM – 9:30 PM daily (Courtyard Free)',
        location: 'Sayyaji Rao Road, Agrahara, Mysuru',
        mapQuery: 'Mysore Palace Mysuru',
        ticketPrice: 'Courtyard View: 100% FREE',
        actionLabel: 'Explore 3D Palace',
        actionLink: '/palace',
      };
    }

    // Jamboo Savari
    if (
      q.includes('jamboo') ||
      q.includes('savari') ||
      q.includes('ambari') ||
      q.includes('howdah') ||
      q.includes('procession') ||
      q.includes('elephant') ||
      q.includes('ಜಂಬೂ') ||
      q.includes('ಅಂಬಾರಿ')
    ) {
      return {
        title: 'Vijayadashami Jamboo Savari',
        titleKn: 'ವಿಜಯದಶಮಿ ಜಂಬೂ ಸವಾರಿ ಮೆರವಣಿಗೆ',
        badge: 'Grand Finale • Oct 20, 2026',
        timing: 'Flag-off: 1:30 PM | Route: Palace to Bannimantap (5 km)',
        location: 'Balarama Gate to Bannimantap, Mysuru',
        mapQuery: 'Bannimantap Parade Grounds Mysuru',
        ticketPrice: 'Public Route Free • Torchlight: ₹250',
        actionLabel: 'View Procession 3D',
        actionLink: '/jamboo-savari',
      };
    }

    // Chamundi Hill
    if (
      q.includes('chamundi') ||
      q.includes('nandi') ||
      q.includes('hill') ||
      q.includes('temple') ||
      q.includes('steps') ||
      q.includes('ಬೆಟ್ಟ') ||
      q.includes('ಚಾಮುಂಡಿ')
    ) {
      return {
        title: 'Sri Chamundeshwari Temple & Nandi Monolith',
        titleKn: 'ಶ್ರೀ ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಹಾಗೂ ಏಕಶಿಲಾ ನಂದಿ',
        badge: 'Sacred Sanctum • 1,062m Peak',
        timing: 'Darshan: 7:30 AM – 2:00 PM, 3:30 PM – 9:00 PM',
        location: 'Chamundi Hills, Mysuru (13 km from city center)',
        mapQuery: 'Chamundeshwari Temple Mysuru',
        ticketPrice: 'Free General Entry • KSRTC EV Shuttle Available',
        actionLabel: 'Chamundi Guide',
        actionLink: '/chamundi',
      };
    }

    // Food & Sweets
    if (
      q.includes('food') ||
      q.includes('pak') ||
      q.includes('dosa') ||
      q.includes('sweet') ||
      q.includes('aahara') ||
      q.includes('mela') ||
      q.includes('ದೋಸೆ') ||
      q.includes('ಆಹಾರ')
    ) {
      return {
        title: 'Guru Sweet Mart & Dasara Aahara Mela',
        titleKn: 'ಗುರು ಸ್ವೀಟ್ಸ್ ಮತ್ತು ದಸರಾ ಆಹಾರ ಮೇಳ',
        badge: 'Culinary Trail • Royal Origin',
        timing: '10:00 AM – 10:30 PM daily (Oct 11 – 20)',
        location: 'Devaraja Market & Scouts Grounds, Mysuru',
        mapQuery: 'Guru Sweet Mart Sayyaji Rao Road Mysuru',
        ticketPrice: 'Items from ₹30 to ₹250',
        actionLabel: 'Food Festival Guide',
        actionLink: '/food-exhibition',
      };
    }

    return undefined;
  };

  // Generate Interactive Human Follow-up Replies based on topic
  const generateInteractiveReplies = (userQuery: string, text: string, lang: 'en' | 'kn'): string[] => {
    const q = userQuery.toLowerCase();
    const lower = text.toLowerCase();

    if (q.includes('how are you') || q.includes('hi') || q.includes('hello') || q.includes('who are you') || q.includes('ಹೇಗಿದ್ದೀರಿ')) {
      return lang === 'kn'
        ? [
            '✨ ಇವತ್ತಿನ ದಸರಾ ಕಾರ್ಯಕ್ರಮಗಳು ಯಾವುವು?',
            '🏰 ಅರಮನೆ ದೀಪಾಲಂಕಾರ ಸಮಯ ತಿಳಿಸಿ',
            '🍛 ಮೈಸೂರಿನ ಅತ್ಯುತ್ತಮ ತಿಂಡಿ ಸ್ಥಳಗಳು',
          ]
        : [
            '✨ What are today\'s festival highlights?',
            '🏰 When are the 100,000 palace lights turned on?',
            '🍛 Where can I taste authentic Mysore Pak?',
          ];
    }

    if (lower.includes('light') || lower.includes('illumination') || lower.includes('ದೀಪ')) {
      return lang === 'kn'
        ? [
            '🚗 ಪಾರ್ಕಿಂಗ್ ಎಲ್ಲಿ ಮಾಡಬೇಕು ತಿಳಿಸಿ',
            '📸 ಫೋಟೋ ತೆಗೆಯಲು ಉತ್ತಮ ಸ್ಥಳ ಯಾವುದು?',
            '🍽️ ಅರಮನೆ ಬಳಿ ಒಳ್ಳೆಯ ಡಿನ್ನರ್ ಎಲ್ಲಿ?',
          ]
        : [
            '🚗 Where should I park my car?',
            '📸 Best spot to take photos without crowd',
            '🍽️ Great dinner spot near palace',
          ];
    }

    if (lower.includes('jamboo') || lower.includes('ambari') || lower.includes('ಜಂಬೂ')) {
      return lang === 'kn'
        ? [
            '🎫 ಗೋಲ್ಡ್ ಪಾಸ್ ಹೇಗೆ ಪಡೆಯುವುದು?',
            '📍 ಮೆರವಣಿಗೆಯ ಸಂಪೂರ್ಣ ಮಾರ್ಗ ತಿಳಿಸಿ',
            '🔥 ಬನ್ನಿಮಂಟಪ ಪಂಜಿನ ಕವಾಯತು ಸಮಯ',
          ]
        : [
            '🎫 How can I get a Gold Pass?',
            '📍 Show the full 5 km route',
            '🔥 What time is the Torchlight parade?',
          ];
    }

    if (lower.includes('food') || lower.includes('pak') || lower.includes('dosa') || lower.includes('ಆಹಾರ')) {
      return lang === 'kn'
        ? [
            '🥞 ಮೈಲಾರಿ ದೋಸೆ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?',
            '🍯 ಅಸಲಿ ಮೈಸೂರು ಪಾಕ್ ಅಂಗಡಿ ಯಾವುದು?',
            '🍛 ಆಹಾರ ಮೇಳದಲ್ಲಿ ಏನು ವಿಶೇಷ?',
          ]
        : [
            '🥞 Where is the original Mylari dosa?',
            '🍯 Which shop sells genuine hot Mysore Pak?',
            '🍛 What is famous at Aahara Mela?',
          ];
    }

    return lang === 'kn'
      ? [
          '✨ ಇವತ್ತಿನ ಕಾರ್ಯಕ್ರಮಗಳ ಪಟ್ಟಿ ತಿಳಿಸಿ',
          '🚌 ಉಚಿತ ಇವಿ ಬಸ್ ಸೇವೆಗಳು ಹೇಗೆ?',
          '👑 ಅರಮನೆ ಇತಿಹಾಸದ ಬಗ್ಗೆ ಹೇಳಿ',
        ]
      : [
          '✨ What are today\'s festival events?',
          '🚌 How to take the free EV shuttles?',
          '👑 Tell me about the Golden Throne',
        ];
  };

  // Streaming assistant response
  const streamAssistantResponse = useCallback(
    (fullText: string, userQuery: string) => {
      const msgId = 'gms-' + Date.now();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const landmark = detectLandmarkCard(userQuery, fullText);
      const suggestedReplies = generateInteractiveReplies(userQuery, fullText, language);

      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          role: 'assistant',
          content: '',
          isAiGenerated: true,
          timestamp: timeStr,
          isStreaming: true,
          landmarkCard: landmark,
          suggestedReplies,
        },
      ]);

      playChime('receive');
      setGesture('talking');

      const words = fullText.split(' ');
      let currentIdx = 0;
      let accumulated = '';

      const interval = setInterval(() => {
        if (currentIdx < words.length) {
          accumulated += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
          setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, content: accumulated } : m))
          );
          currentIdx++;
        } else {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, isStreaming: false } : m))
          );

          if (voicePlaybackEnabled || isVoiceCallActive) {
            setIsSpeaking(true);
            audioManager.speak(fullText, language, () => {
              setIsSpeaking(false);
              setGesture('idle');
            });
          } else {
            setGesture('idle');
          }
        }
      }, 32);
    },
    [language, voicePlaybackEnabled, isVoiceCallActive]
  );

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const trimmedQuery = text.trim();
    setInputText('');
    playChime('send');

    const userMsg: ChatMsg = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: trimmedQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setGesture('talking');

    try {
      const res = await aiAPI.sendMessage(trimmedQuery, language, sessionId);
      if (res.data) {
        if (res.data.session_id) setSessionId(res.data.session_id);
        const reply = res.data.response;
        streamAssistantResponse(reply, trimmedQuery);
      }
    } catch {
      const fallbackReply =
        language === 'kn'
          ? 'ನಮಸ್ಕಾರ! ನಾನು ಜಿ.ಎಂ. ಸೃಜನ್ (G M Srujan). ಮೈಸೂರು ದಸರಾ ೨೦೨೬ರ ಅದ್ಭುತ ಲೋಕಕ್ಕೆ ಸುಸ್ವಾಗತ! ಅರಮನೆ ದೀಪಾಲಂಕಾರ, ಜಂಬೂ ಸವಾರಿ ಅಥವಾ ನಗರದ ರುಚಿಕರ ಆಹಾರ ಮೇಳದ ಬಗ್ಗೆ ಏನು ತಿಳಿಯಲು ಇಷ್ಟಪಡ್ತೀರಿ?'
          : 'Namaskara! I am G M Srujan. Welcome to Mysuru Dasara 2026! What would you like to explore today — our world-famous Palace illumination, the Golden Howdah procession, or authentic local food spots?';
      streamAssistantResponse(fallbackReply, trimmedQuery);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech-to-Text Microphone
  const handleVoiceInput = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please type your query in the box.');
      return;
    }
    const recognition = new SpeechRec();
    recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    playChime('click');
    recognition.start();

    recognition.onresult = (e: any) => {
      setIsListening(false);
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('📋 Copied G M Srujan\'s reply to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const replaySpeech = (text: string) => {
    setIsSpeaking(true);
    setGesture('talking');
    audioManager.speak(text, language, () => {
      setIsSpeaking(false);
      setGesture('idle');
    });
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackGiven((prev) => ({ ...prev, [id]: type }));
    playChime('click');
    showToast(type === 'up' ? '👍 Thank you for your feedback!' : '🙏 Feedback noted! G M Srujan will refine his tips.');
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-fresh',
        role: 'assistant',
        content:
          language === 'kn'
            ? 'ನಮಸ್ಕಾರ! ನಾನು **ಜಿ.ಎಂ. ಸೃಜನ್ (G M Srujan)**. ನಮ್ಮ ಮೈಸೂರಿನ ಬಗ್ಗೆ ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ, ಸಂತೋಷದಿಂದ ತಿಳಿಸಿಕೊಡ್ತೀನಿ!'
            : 'Welcome back! I am **G M Srujan**. Ask me anything about our festival, food, or heritage — I\'m here to help!',
        isAiGenerated: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: [
          '✨ What are the highlights today?',
          '🍛 Where can I taste original Mysore Pak?',
          '🚗 Where should I park near the palace?',
        ],
      },
    ]);
    audioManager.playBellSound();
    showToast('🧹 Chat refreshed');
  };

  const startVoiceCall = () => {
    setIsVoiceCallActive(true);
    playChime('call');
    audioManager.speak(
      language === 'kn'
        ? 'ನಮಸ್ಕಾರ! ನಾನು ಜಿ.ಎಂ. ಸೃಜನ್. ಹೇಳಿ, ನಿಮ್ಮ ಮೈಸೂರು ಪ್ರವಾಸ ಹೇಗಿದೆ?'
        : 'Namaskara! G M Srujan here on the line. How is your trip to Mysuru going so far?',
      language,
      () => {
        handleVoiceInput();
      }
    );
  };

  const endVoiceCall = () => {
    setIsVoiceCallActive(false);
    audioManager.stopSpeech();
    playChime('click');
    showToast('📞 Call ended');
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-3 md:px-6 max-w-7xl mx-auto flex flex-col space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-gold-glow flex items-center gap-2 text-xs border border-amber-300 animate-slide-up">
          <span>👑</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="G M SRUJAN – AI Tour Guide & Cultural Ambassador"
        titleKn="ಜಿ.ಎಂ. ಸೃಜನ್ – ನಿಮ್ಮ ಮೈಸೂರು ದಸರಾ ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿ"
        subtitle="Chat or voice-call in real-time with G M Srujan. Instant festival timings, Golden Howdah lore, culinary secrets, and smart navigation in Kannada and English."
      />

      {/* Human Interaction Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Voice Call Button */}
          <button
            onClick={startVoiceCall}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-gold-glow flex items-center gap-2 transition-all active:scale-95 animate-pulse"
          >
            <span>📞</span>
            <span>Call G M Srujan (Live Voice)</span>
          </button>

          {/* Guide Persona Selector */}
          <div className="flex items-center gap-1.5 pl-2">
            {[
              { id: 'friendly', label: '🤝 Friendly Guide' },
              { id: 'historian', label: '👑 Palace Historian' },
              { id: 'foodie', label: '🍛 Foodie Insider' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setGuidePersona(p.id as GuidePersona);
                  audioManager.playBellSound();
                  showToast(`Switched tone to ${p.label}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  guidePersona === p.id
                    ? 'bg-amber-400 text-black border-amber-400 shadow-sm'
                    : 'bg-white/5 border-white/10 text-cream/70 hover:bg-white/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher: Living Avatar vs 3D Avatar */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setAvatarView('portrait')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              avatarView === 'portrait'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-cream/60 hover:text-white'
            }`}
          >
            👑 Living Portrait
          </button>
          <button
            onClick={() => setAvatarView('3d')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              avatarView === '3d'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-cream/60 hover:text-white'
            }`}
          >
            🎭 3D Avatar
          </button>
        </div>
      </div>

      {/* Main Grid: Avatar Display (Left) + Human Chat Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Left Column: Avatar & Interactive Guide Card (5 cols) */}
        <div className="lg:col-span-5 glass p-5 md:p-6 rounded-3xl border border-amber-400/30 flex flex-col justify-between shadow-royal space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {avatarView === 'portrait' ? 'Living Digital Guide' : 'Interactive 3D Avatar'}
              </span>
              {isSpeaking ? (
                <AudioWaveVisualizer active={true} label="Srujan Speaking..." />
              ) : isListening ? (
                <AudioWaveVisualizer active={true} label="Listening to you..." />
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Ready to chat
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-cream tracking-wide">
                  G M SRUJAN <span className="text-amber-400 font-kannada text-lg">(ಜಿ.ಎಂ. ಸೃಜನ್)</span>
                </h3>
                <p className="text-xs text-amber-300/80 font-kannada">
                  ಮೈಸೂರು ದಸರಾ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿ
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">
                  Engine
                </span>
                <span className="text-xs font-black text-amber-300">
                  Gemini 3.8 + RAG
                </span>
              </div>
            </div>
          </div>

          {/* Avatar Rendering Area */}
          <div className="w-full h-[400px] min-h-[380px] relative rounded-2xl overflow-hidden border border-amber-400/20 shadow-inner">
            {avatarView === 'portrait' ? (
              <LivingGMSAvatar
                speaking={isSpeaking}
                listening={isListening}
                onGreet={() => {
                  handleSendMessage(
                    language === 'kn'
                      ? 'ನಮಸ್ಕಾರ ಜಿ.ಎಂ. ಸೃಜನ್! ಹೇಗಿದ್ದೀರಿ?'
                      : 'Namaskara G M Srujan! How are you today?'
                  );
                }}
              />
            ) : (
              <GMSGuide gesture={gesture} speaking={isSpeaking} />
            )}

            {/* Gesture Quick Pills in 3D Mode */}
            {avatarView === '3d' && (
              <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1.5 text-[11px] bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
                {(
                  [
                    { id: 'namaskara', label: '🙏 Namaskara' },
                    { id: 'pointing', label: '👉 Point' },
                    { id: 'waving', label: '👋 Wave' },
                    { id: 'talking', label: '🗣️ Speak' },
                    { id: 'idle', label: '🧘 Rest' },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setGesture(g.id);
                      playChime('click');
                    }}
                    className={`px-2.5 py-1 rounded-xl transition-all ${
                      gesture === g.id
                        ? 'bg-amber-400 text-black font-black shadow-gold-glow scale-105'
                        : 'bg-white/5 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heritage Knowledge Highlights Bar */}
          <div className="pt-2 border-t border-white/10 text-[11px] text-white/60 flex items-center justify-between">
            <span className="flex items-center gap-1 text-amber-300/90 font-medium">
              <span>🏛️</span> Mysuru Heritage Certified
            </span>
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <span>⚡</span> Real-time AI Assistant
            </span>
          </div>
        </div>

        {/* Right Column: Natural Conversational Human Chat (7 cols) */}
        <div className="lg:col-span-7 glass p-5 md:p-6 rounded-3xl border border-amber-400/30 flex flex-col shadow-royal min-h-[600px] h-[680px]">
          {/* Top Bar with Language Selector & Voice Toggle */}
          <div className="flex flex-wrap justify-between items-center pb-3 border-b border-white/10 mb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/70">Language:</span>
              <button
                onClick={() => {
                  setLanguage('en');
                  audioManager.playBellSound();
                  showToast('Switched to English');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  language === 'en'
                    ? 'bg-amber-400 text-black shadow-gold-glow'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage('kn');
                  audioManager.playBellSound();
                  showToast('ಕನ್ನಡ ಭಾಷೆಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black font-kannada transition-all ${
                  language === 'kn'
                    ? 'bg-amber-400 text-black shadow-gold-glow'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice playback toggle */}
              <button
                onClick={() => {
                  setVoicePlaybackEnabled(!voicePlaybackEnabled);
                  playChime('click');
                  showToast(
                    voicePlaybackEnabled ? '🔇 Voice playback muted' : '🔊 Voice playback enabled'
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  voicePlaybackEnabled
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
                title="Toggle Text-to-Speech Output"
              >
                <span>{voicePlaybackEnabled ? '🔊 Voice On' : '🔇 Muted'}</span>
              </button>

              <button
                onClick={clearChat}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cream/70 text-xs font-medium border border-white/10 transition-all"
                title="Clear Conversation"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Chat Messages Stream (Scoped Container with Container-only Scroll) */}
          <div
            ref={chatMessagesContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] md:max-w-[82%] p-4 rounded-3xl space-y-2 relative transition-all ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-medium rounded-tr-none shadow-gold-glow'
                      : 'glass-dark border border-amber-400/25 text-cream rounded-tl-none shadow-royal'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex justify-between items-center text-[10px] opacity-75 font-semibold pb-1 border-b border-white/10 gap-4">
                    <span>
                      {msg.role === 'user'
                        ? 'You (ಯಾತ್ರಿಕರು)'
                        : 'G M SRUJAN (ಜಿ.ಎಂ. ಸೃಜನ್)'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  <FormattedMessage text={msg.content} />

                  {/* Embedded Landmark Preview Card (ONLY if specifically relevant!) */}
                  {msg.landmarkCard && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-black/60 border border-amber-400/40 space-y-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-amber-400 block">
                            {msg.landmarkCard.badge}
                          </span>
                          <h5 className="font-extrabold text-cream text-sm">
                            {msg.landmarkCard.title}
                          </h5>
                          {msg.landmarkCard.titleKn && (
                            <p className="text-[11px] text-amber-300/80 font-kannada">
                              {msg.landmarkCard.titleKn}
                            </p>
                          )}
                        </div>
                        <span className="text-xl">📍</span>
                      </div>

                      <div className="text-[11px] text-cream/70 space-y-0.5">
                        <p>⏰ {msg.landmarkCard.timing}</p>
                        <p>🎟️ {msg.landmarkCard.ticketPrice}</p>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2 items-center">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            msg.landmarkCard.mapQuery
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span>🗺️ Directions</span>
                        </a>

                        {msg.landmarkCard.actionLink && (
                          <a
                            href={msg.landmarkCard.actionLink}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-semibold border border-white/20 transition-all"
                          >
                            {msg.landmarkCard.actionLabel || 'Details'}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Bar for Assistant Message */}
                  {msg.role === 'assistant' && !msg.isStreaming && (
                    <div className="pt-2 flex flex-wrap items-center justify-between border-t border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => replaySpeech(msg.content)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-amber-300 transition-colors"
                          title="Listen with voice"
                        >
                          🔊
                        </button>
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-cream/70 hover:text-white transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? '✓' : '📋'}
                        </button>
                      </div>

                      {/* Helpful Feedback */}
                      <div className="flex items-center gap-1.5 text-[11px] text-cream/60">
                        <span>Helpful?</span>
                        <button
                          onClick={() => handleFeedback(msg.id, 'up')}
                          className={`p-1 rounded transition-all ${
                            feedbackGiven[msg.id] === 'up'
                              ? 'text-emerald-400 font-bold scale-110'
                              : 'hover:text-white'
                          }`}
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'down')}
                          className={`p-1 rounded transition-all ${
                            feedbackGiven[msg.id] === 'down'
                              ? 'text-rose-400 font-bold scale-110'
                              : 'hover:text-white'
                          }`}
                        >
                          👎
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Human Conversational Reply Pills */}
                {msg.role === 'assistant' &&
                  msg.suggestedReplies &&
                  msg.suggestedReplies.length > 0 &&
                  !msg.isStreaming && (
                    <div className="flex flex-wrap gap-2 mt-2.5 pl-2 max-w-[88%]">
                      {msg.suggestedReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleSendMessage(reply)}
                          className="text-xs font-semibold px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400/15 to-yellow-500/10 hover:from-amber-400/30 hover:to-yellow-500/25 border border-amber-400/40 text-amber-200 hover:text-amber-100 transition-all shadow-sm flex items-center gap-1.5 text-left active:scale-95"
                        >
                          <span>💬</span>
                          <span>{reply}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium p-3 rounded-2xl glass-dark w-fit border border-amber-400/20">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>G M Srujan is thinking of the best local advice for you...</span>
              </div>
            )}
          </div>

          {/* Interactive Chat Input Box */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/15 focus-within:border-amber-400 transition-all shadow-inner"
            >
              {/* Voice Speech-to-Text Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-gold-glow'
                    : 'bg-white/10 hover:bg-white/20 text-cream'
                }`}
                title="Tap and speak to G M Srujan in Kannada or English"
              >
                <span>{isListening ? '🎙️...' : '🎤'}</span>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  language === 'kn'
                    ? 'ಜಿ.ಎಂ. ಸೃಜನ್ ಜೊತೆ ಚಾಟ್ ಮಾಡಿ: "ಅರಮನೆ ದೀಪಾಲಂಕಾರ ಯಾವಾಗ?", "ದೋಸೆ ಎಲ್ಲಿ ಒಳ್ಳೆಯದು?"...'
                    : 'Chat with G M Srujan: "When are the lights?", "Best Mysore Pak?", "Where to park?"...'
                }
                className="flex-1 bg-transparent text-cream placeholder-cream/40 text-xs md:text-sm px-2 py-2 outline-none"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-gold-glow flex items-center gap-1.5"
              >
                <span>Send</span>
                <span>✨</span>
              </button>
            </form>

            <div className="flex justify-between items-center text-[10px] text-cream/50 px-2 font-medium">
              <span>💡 Tap 🎤 to speak naturally • G M Srujan will talk back!</span>
              <span>Mysuru Dasara Official Tour Companion</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LIVE VOICE CALL MODAL (HUMAN-TO-AI VOICE CALL)           */}
      {/* ======================================================== */}
      {isVoiceCallActive && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-dark p-6 md:p-8 rounded-3xl border-2 border-emerald-400/50 max-w-lg w-full shadow-royal text-center space-y-6 relative overflow-hidden">
            {/* Top Call Info */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Voice Call Active • 0{Math.floor(callDurationSeconds / 60)}:
                {callDurationSeconds % 60 < 10
                  ? `0${callDurationSeconds % 60}`
                  : callDurationSeconds % 60}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-cream">
                G M SRUJAN <span className="text-amber-400 font-kannada text-lg">(ಜಿ.ಎಂ. ಸೃಜನ್)</span>
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                Official Mysuru Dasara AI Guide • Speaking Live
              </p>
            </div>

            {/* Glowing Pulsing Face Avatar */}
            <div className="relative mx-auto w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-400 to-yellow-400 p-1 shadow-gold-glow flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#160826] flex items-center justify-center overflow-hidden border-2 border-white/20">
                <span className="text-6xl animate-bounce-gentle">👑</span>
              </div>
              {/* Soundwaves */}
              <div className="absolute -inset-4 rounded-full border border-emerald-400/40 animate-ping pointer-events-none" />
              <div className="absolute -inset-8 rounded-full border border-amber-400/20 animate-pulse pointer-events-none" />
            </div>

            {/* Live Subtitle Transcript */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 min-h-[80px] flex items-center justify-center text-xs md:text-sm text-cream/90 leading-relaxed italic">
              {isSpeaking
                ? '🗣️ "G M Srujan is speaking back to you..."'
                : isListening
                ? '🎙️ "G M Srujan is listening to your voice..."'
                : '✨ "Go ahead, speak to G M Srujan like you are on the phone!"'}
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handleVoiceInput}
                className={`p-4 rounded-full border text-base transition-all ${
                  isListening
                    ? 'bg-amber-400 text-black border-amber-400 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title="Tap to speak"
              >
                <span>🎙️</span>
              </button>

              <button
                onClick={endVoiceCall}
                className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2"
              >
                <span>🔴 End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
