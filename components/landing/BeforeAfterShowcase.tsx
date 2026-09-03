'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  SlidersHorizontal
} from 'lucide-react';

type CaptionStyle = {
  id: string;
  label: string;
  badgeLabel: string;
  description: string;
  presetKey: string;
  previewCanvas: {
    bg: string;
    textColor: string;
    highlightColor: string;
    sampleText: string;
    boxStyle?: string;
  };
};

const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: 'studio-clean',
    label: 'Studio Clean',
    badgeLabel: 'Active Word',
    description: 'Clean white stacked captions with active word highlight in rounded blue box.',
    presetKey: 'Studio Clean',
    previewCanvas: {
      bg: '#0f172a',
      textColor: '#ffffff',
      highlightColor: '#2563eb',
      sampleText: 'Studio [Clean]',
    },
  },
  {
    id: 'karaoke-fill',
    label: 'Karaoke Fill',
    badgeLabel: 'Yellow Glow',
    description: 'Full phrase visible with progressive bright gold karaoke highlight on active words.',
    presetKey: 'Karaoke Fill',
    previewCanvas: {
      bg: '#172554',
      textColor: '#94a3b8',
      highlightColor: '#eab308',
      sampleText: 'KARAOKE [FILL]',
    },
  },
  {
    id: 'bold-highlight',
    label: 'Bold Highlight',
    badgeLabel: 'Green Accent',
    description: 'Bold white captions with key words highlighted using a vibrant green backdrop.',
    presetKey: 'Bold Highlight Strip',
    previewCanvas: {
      bg: '#020617',
      textColor: '#ffffff',
      highlightColor: '#10b981',
      sampleText: 'BOLD [HIGHLIGHT]',
    },
  },
  {
    id: 'boxed-grid',
    label: 'Boxed Grid',
    badgeLabel: 'Neon Box',
    description: 'High-contrast boxed caption container wrapping active words in a solid cyan block.',
    presetKey: 'blackBox',
    previewCanvas: {
      bg: '#090d16',
      textColor: '#ffffff',
      highlightColor: '#06b6d4',
      sampleText: '[ BOXED GRID ]',
      boxStyle: 'border border-cyan-400 bg-cyan-500/20',
    },
  },
  {
    id: 'word-pop',
    label: 'Word Pop',
    badgeLabel: 'Center 1-Word',
    description: 'Displays 1–2 large active words at a time in center screen with a pop animation.',
    presetKey: 'One Word',
    previewCanvas: {
      bg: '#180e29',
      textColor: '#ffffff',
      highlightColor: '#f59e0b',
      sampleText: 'POP!',
    },
  },
  {
    id: 'punchy-impact',
    label: 'Punchy Impact',
    badgeLabel: 'Thick Stroke',
    description: 'Large bold uppercase captions with strong drop shadow and energetic impact.',
    presetKey: 'Screamer',
    previewCanvas: {
      bg: '#111827',
      textColor: '#facc15',
      highlightColor: '#ef4444',
      sampleText: 'ATTENTION NOW',
    },
  },
  {
    id: 'minimal-shadow',
    label: 'Minimal Shadow',
    badgeLabel: 'Clean Subtitle',
    description: 'Simple clean white bottom subtitles with subtle dark outline and shadow.',
    presetKey: 'cleanSubtitle',
    previewCanvas: {
      bg: '#000000',
      textColor: '#ffffff',
      highlightColor: '#ffffff',
      sampleText: 'Clean subtitle style.',
    },
  },
  {
    id: 'glow-cyber',
    label: 'Glow Cyber',
    badgeLabel: 'Neon Pulse',
    description: 'Cyberpunk style with cyan and magenta glowing text on active words.',
    presetKey: 'Arctic Glow',
    previewCanvas: {
      bg: '#050b14',
      textColor: '#ffffff',
      highlightColor: '#38bdf8',
      sampleText: 'CYBER [GLOW]',
    },
  },
  {
    id: 'pill-container',
    label: 'Pill Container',
    badgeLabel: 'Rounded Badge',
    description: 'Encloses active phrases inside a smooth, rounded pill-shaped highlight container.',
    presetKey: 'Gold Pill',
    previewCanvas: {
      bg: '#1e1b4b',
      textColor: '#ffffff',
      highlightColor: '#fbbf24',
      sampleText: '( Active Pill )',
    },
  },
  {
    id: 'typewriter',
    label: 'Typewriter',
    badgeLabel: 'Monospace Code',
    description: 'Retro monospace text with a progressive typewriter reveal and blinking cursor.',
    presetKey: 'Typewriter',
    previewCanvas: {
      bg: '#030712',
      textColor: '#34d399',
      highlightColor: '#34d399',
      sampleText: 'typewriter_ text',
    },
  },
  {
    id: 'bold-fire',
    label: 'Bold Fire',
    badgeLabel: 'Red Energy',
    description: 'Energetic bold fire-red typography designed for high-conversion social reels.',
    presetKey: 'Bold Fire',
    previewCanvas: {
      bg: '#1c1017',
      textColor: '#ffffff',
      highlightColor: '#ef4444',
      sampleText: 'BOLD [FIRE]',
    },
  },
  {
    id: 'metallic-gradient',
    label: 'Metallic Gradient',
    badgeLabel: 'Silver Shine',
    description: 'Sleek silver metallic gradient typography with subtle high-contrast outline.',
    presetKey: 'Metallic Gradient',
    previewCanvas: {
      bg: '#0f172a',
      textColor: '#cbd5e1',
      highlightColor: '#f8fafc',
      sampleText: 'METALLIC',
    },
  },
];

type DemoTranscriptWord = {
  start: number;
  end: number;
  word: string;
  phrase: string;
};

const DEMO_TRANSCRIPT: DemoTranscriptWord[] = [
  { start: 0.0, end: 0.6, word: 'If', phrase: 'If you want people' },
  { start: 0.6, end: 1.1, word: 'you', phrase: 'If you want people' },
  { start: 1.1, end: 1.6, word: 'want', phrase: 'If you want people' },
  { start: 1.6, end: 2.2, word: 'people', phrase: 'If you want people' },
  { start: 2.2, end: 2.8, word: 'watching,', phrase: 'watching, even with the' },
  { start: 2.8, end: 3.3, word: 'even', phrase: 'watching, even with the' },
  { start: 3.3, end: 3.8, word: 'with', phrase: 'watching, even with the' },
  { start: 3.8, end: 4.3, word: 'the', phrase: 'watching, even with the' },
  { start: 4.3, end: 4.9, word: 'sound', phrase: 'sound off completely,' },
  { start: 4.9, end: 5.5, word: 'off', phrase: 'sound off completely,' },
  { start: 5.5, end: 6.2, word: 'completely,', phrase: 'sound off completely,' },
  { start: 6.2, end: 6.8, word: 'you', phrase: 'you need captions' },
  { start: 6.8, end: 7.4, word: 'need', phrase: 'you need captions' },
  { start: 7.4, end: 8.0, word: 'captions', phrase: 'you need captions' },
  { start: 8.0, end: 8.6, word: 'that', phrase: 'that stand out.' },
  { start: 8.6, end: 9.2, word: 'stand', phrase: 'that stand out.' },
  { start: 9.2, end: 10.0, word: 'out.', phrase: 'that stand out.' },
];

export default function BeforeAfterShowcase() {
  const [selectedStyle, setSelectedStyle] = useState<CaptionStyle>(CAPTION_STYLES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const videoSrc = 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.mp4';
  const posterSrc = '/preview/Auto Caption Reel.png';

  useEffect(() => {
    if (beforeRef.current && afterRef.current) {
      if (isPlaying) {
        beforeRef.current.play().catch(() => {});
        afterRef.current.play().catch(() => {});
      } else {
        beforeRef.current.pause();
        afterRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (afterRef.current) {
      setCurrentTime(afterRef.current.currentTime);
      if (beforeRef.current && Math.abs(beforeRef.current.currentTime - afterRef.current.currentTime) > 0.3) {
        beforeRef.current.currentTime = afterRef.current.currentTime;
      }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const handleStyleSelect = (style: CaptionStyle, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedStyle(style);
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const activeWordObj = DEMO_TRANSCRIPT.find(
    (item) => currentTime >= item.start && currentTime < item.end
  ) || DEMO_TRANSCRIPT[0];

  const phraseWords = activeWordObj.phrase.split(' ');

  return (
    <section id="see-in-action" className="relative px-4 py-16 sm:px-6 sm:py-24 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Try Different Caption Styles</span>
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl font-sans tracking-tight">
            See It in Action
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 font-normal">
            Preview your video with different caption styles before creating it. Click any style card below to see the live transformation.
          </p>
        </div>

        {/* Outer White Card Frame */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:p-8 shadow-xs">
          
          {/* Top Side-by-Side Video Preview Area */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 max-w-3xl mx-auto items-center">
            
            {/* LEFT: RAW INPUT CONTENT */}
            <div className="flex flex-col items-center space-y-2">
              <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] font-black tracking-wider text-slate-700 uppercase">
                RAW VIDEO (INPUT)
              </span>

              <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
                <video
                  ref={beforeRef}
                  src={videoSrc}
                  poster={posterSrc}
                  preload="auto"
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* RIGHT: ITNAVIDEO AI CAPTIONED OUTPUT */}
            <div className="flex flex-col items-center space-y-2">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-xs flex items-center gap-1">
                <Sparkles size={11} />
                <span>{selectedStyle.label}</span>
              </span>

              <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-blue-500/40 shadow-md flex items-center justify-center">
                <video
                  ref={afterRef}
                  src={videoSrc}
                  poster={posterSrc}
                  preload="auto"
                  muted
                  loop
                  playsInline
                  autoPlay
                  onTimeUpdate={handleTimeUpdate}
                  className="h-full w-full object-cover"
                />

                {/* LIVE DYNAMIC CAPTION OVERLAY LAYER */}
                <div className="absolute inset-x-2 bottom-12 sm:bottom-16 flex flex-col items-center justify-center text-center z-20 pointer-events-none px-2">
                  
                  {/* STYLE 1: Studio Clean */}
                  {selectedStyle.id === 'studio-clean' && (
                    <div className="bg-black/75 backdrop-blur-md px-3 py-2 rounded-xl border border-border shadow-2xl">
                      <p className="text-xs sm:text-base font-extrabold text-white flex flex-wrap justify-center gap-1.5 leading-snug">
                        {phraseWords.map((w, idx) => {
                          const isActive = w.toLowerCase().replace(/[^a-z]/g, '') === activeWordObj.word.toLowerCase().replace(/[^a-z]/g, '');
                          return (
                            <span
                              key={idx}
                              className={`transition-all duration-150 rounded px-1.5 py-0.5 ${
                                isActive ? 'bg-blue-600 text-white shadow-md scale-105 font-black' : 'text-slate-200'
                              }`}
                            >
                              {w}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}

                  {/* STYLE 2: Karaoke Fill */}
                  {selectedStyle.id === 'karaoke-fill' && (
                    <div className="bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-yellow-500/30 shadow-2xl">
                      <p className="text-xs sm:text-base font-black flex flex-wrap justify-center gap-1.5 leading-snug tracking-wide">
                        {phraseWords.map((w, idx) => {
                          const isActive = w.toLowerCase().replace(/[^a-z]/g, '') === activeWordObj.word.toLowerCase().replace(/[^a-z]/g, '');
                          return (
                            <span
                              key={idx}
                              className={`transition-all duration-150 ${
                                isActive 
                                  ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(234,179,8,0.9)] scale-110 font-black' 
                                  : 'text-muted-foreground opacity-60'
                              }`}
                            >
                              {w}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}

                  {/* STYLE 3: Bold Highlight */}
                  {selectedStyle.id === 'bold-highlight' && (
                    <div className="bg-background/90 px-3 py-2 rounded-xl border border-emerald-500/40 shadow-2xl">
                      <p className="text-xs sm:text-base font-black text-white flex flex-wrap justify-center gap-1.5 uppercase">
                        {phraseWords.map((w, idx) => {
                          const isActive = w.toLowerCase().replace(/[^a-z]/g, '') === activeWordObj.word.toLowerCase().replace(/[^a-z]/g, '');
                          return (
                            <span
                              key={idx}
                              className={`transition-all duration-150 ${
                                isActive ? 'bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black shadow-md' : 'text-white'
                              }`}
                            >
                              {w}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}

                  {/* STYLE 4: Boxed Grid */}
                  {selectedStyle.id === 'boxed-grid' && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {phraseWords.map((w, idx) => {
                        const isActive = w.toLowerCase().replace(/[^a-z]/g, '') === activeWordObj.word.toLowerCase().replace(/[^a-z]/g, '');
                        return (
                          <span
                            key={idx}
                            className={`text-xs sm:text-sm font-black px-2 py-1 rounded-md transition-all duration-150 ${
                              isActive 
                                ? 'bg-cyan-400 text-slate-950 shadow-lg scale-105 border-2 border-white' 
                                : 'bg-muted/90 text-cyan-200 border border-cyan-500/40'
                            }`}
                          >
                            {w}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* STYLE 5: Word Pop (1 Word) */}
                  {selectedStyle.id === 'word-pop' && (
                    <div className="bg-black/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-amber-400/50 shadow-2xl">
                      <span className="text-xl sm:text-3xl font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase tracking-wider animate-pulse">
                        {activeWordObj.word.replace(/[^a-zA-Z0-9]/g, '') || 'CAPTIONS'}
                      </span>
                    </div>
                  )}

                  {/* STYLE 6: Punchy Impact */}
                  {selectedStyle.id === 'punchy-impact' && (
                    <div className="bg-black/70 px-4 py-2 rounded-xl">
                      <p className="text-sm sm:text-xl font-black uppercase text-yellow-400 tracking-wider drop-shadow-[0_3px_6px_rgba(0,0,0,1)]">
                        {activeWordObj.phrase}
                      </p>
                    </div>
                  )}

                  {/* STYLE 7: Minimal Shadow */}
                  {selectedStyle.id === 'minimal-shadow' && (
                    <div className="bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
                      <p className="text-xs sm:text-sm font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {activeWordObj.phrase}
                      </p>
                    </div>
                  )}

                  {/* STYLE 8: Glow Cyber */}
                  {selectedStyle.id === 'glow-cyber' && (
                    <div className="bg-background/90 px-3.5 py-2 rounded-xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      <p className="text-xs sm:text-base font-extrabold flex flex-wrap justify-center gap-1.5 tracking-wide">
                        {phraseWords.map((w, idx) => {
                          const isActive = w.toLowerCase().replace(/[^a-z]/g, '') === activeWordObj.word.toLowerCase().replace(/[^a-z]/g, '');
                          return (
                            <span
                              key={idx}
                              className={`transition-all duration-150 ${
                                isActive 
                                  ? 'text-cyan-300 drop-shadow-[0_0_12px_#06b6d4] scale-110 font-black' 
                                  : 'text-purple-200/80'
                              }`}
                            >
                              {w}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}

                  {/* STYLE 9: Pill Container */}
                  {selectedStyle.id === 'pill-container' && (
                    <div className="bg-amber-400 text-slate-950 px-4 py-2 rounded-full font-black text-xs sm:text-sm shadow-xl border-2 border-white flex items-center gap-1.5">
                      <span>{activeWordObj.phrase}</span>
                    </div>
                  )}

                  {/* STYLE 10: Typewriter */}
                  {selectedStyle.id === 'typewriter' && (
                    <div className="bg-background px-3.5 py-2 rounded-lg border border-emerald-500/60 font-mono shadow-2xl">
                      <p className="text-xs sm:text-sm font-bold text-primary tracking-wider">
                        &gt; {activeWordObj.phrase} <span className="animate-ping">_</span>
                      </p>
                    </div>
                  )}

                  {/* STYLE 11: Bold Fire */}
                  {selectedStyle.id === 'bold-fire' && (
                    <div className="bg-black/80 px-3.5 py-2 rounded-2xl border border-red-500/50 shadow-2xl">
                      <p className="text-xs sm:text-base font-black flex flex-wrap justify-center gap-1.5 uppercase">
                        {phraseWords.map((w, idx) => {
                          const isActive = w.toLowerCase().replace(/[^a-z]/g, '') === activeWordObj.word.toLowerCase().replace(/[^a-z]/g, '');
                          return (
                            <span
                              key={idx}
                              className={`transition-all duration-150 ${
                                isActive 
                                  ? 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] scale-110 font-black' 
                                  : 'text-white'
                              }`}
                            >
                              {w}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}

                  {/* STYLE 12: Metallic Gradient */}
                  {selectedStyle.id === 'metallic-gradient' && (
                    <div className="bg-muted/90 px-3.5 py-2 rounded-xl border border-border shadow-2xl">
                      <p className="text-xs sm:text-base font-black bg-gradient-to-r from-slate-100 via-slate-300 to-white text-transparent bg-clip-text uppercase tracking-wider">
                        {activeWordObj.phrase}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>

          {/* Dynamic Explanation Bar */}
          <div className="mb-6 p-3.5 rounded-xl bg-white border border-slate-200 text-center max-w-2xl mx-auto shadow-2xs">
            <p className="text-xs sm:text-sm font-bold text-slate-900 font-sans">
              {selectedStyle.label}: <span className="font-normal text-slate-600">{selectedStyle.description}</span>
            </p>
          </div>

          {/* HORIZONTALLY SCROLLABLE CAPTION STYLE SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">
                  Try Different Styles
                </p>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-sans">
                  CHOOSE CAPTION STYLE
                </span>
              </div>

              {/* Scroll Controls */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground hidden sm:inline">
                  Scroll horizontally →
                </span>
                <button
                  onClick={scrollLeft}
                  aria-label="Scroll Left"
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={scrollRight}
                  aria-label="Scroll Right"
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              onWheel={(e) => {
                if (e.deltaY !== 0 && scrollContainerRef.current) {
                  scrollContainerRef.current.scrollLeft += e.deltaY;
                }
              }}
              className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 px-1 no-scrollbar scroll-smooth w-full touch-pan-x"
            >
              {CAPTION_STYLES.map((style) => {
                const isSelected = selectedStyle.id === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={(e) => handleStyleSelect(style, e)}
                    className={`flex-shrink-0 w-36 sm:w-44 rounded-2xl p-2.5 border text-center transition duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-white ring-2 ring-blue-600 shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm shadow-2xs opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Visual Style Preview Canvas / Thumbnail */}
                    <div
                      className="relative h-18 w-full rounded-xl overflow-hidden border border-slate-200/60 flex flex-col items-center justify-center p-2 mb-2 shadow-inner font-sans"
                      style={{ background: style.previewCanvas.bg }}
                    >
                      <div className={`px-2 py-1 rounded text-center ${style.previewCanvas.boxStyle || ''}`}>
                        <span
                          className="text-xs font-black tracking-wide block truncate"
                          style={{ color: style.previewCanvas.highlightColor }}
                        >
                          {style.previewCanvas.sampleText}
                        </span>
                      </div>

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    {/* Card Label & Sub-badge */}
                    <div>
                      <span className={`text-xs font-bold block truncate font-sans ${isSelected ? 'text-blue-600 font-black' : 'text-slate-900'}`}>
                        {style.label}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 block truncate mt-0.5">
                        {style.badgeLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 text-center font-normal pt-1">
              Preview your video with different caption styles before creating it.
            </p>
          </div>

          {/* Direct Creation CTA */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600 text-center sm:text-left">
              Selected Style: <strong className="text-slate-900 font-bold">{selectedStyle.label}</strong>
            </span>

            <Link
              href={`/dashboard?videoType=auto-caption-reel&preset=${encodeURIComponent(selectedStyle.presetKey)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition duration-150 w-full sm:w-auto"
            >
              <span>Create {selectedStyle.label} Video</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

