'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

type CaptionStyle = {
  id: string;
  name: string;
  category: 'basic' | 'dynamic' | 'word';
  colors: { bg: string; text: string; highlight: string; shadow?: string };
};

const STYLES: CaptionStyle[] = [
  // Basic
  { id: 'bold-white', name: 'Bold White', category: 'basic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#ffffff' } },
  { id: 'yellow-pop', name: 'Yellow Pop', category: 'basic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#facc15', shadow: '0 4px 0 rgba(0,0,0,0.4)' } },
  { id: 'blue-box', name: 'Blue Box', category: 'basic', colors: { bg: '#2563eb', text: '#ffffff', highlight: '#ffffff' } },
  { id: 'black-box', name: 'Black Box', category: 'basic', colors: { bg: 'rgba(0,0,0,0.82)', text: '#ffffff', highlight: '#ffffff' } },
  { id: 'red-accent', name: 'Red Accent', category: 'basic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#ef4444' } },
  { id: 'green-fresh', name: 'Green Fresh', category: 'basic', colors: { bg: 'rgba(0,0,0,0.75)', text: '#ffffff', highlight: '#22c55e' } },
  // Dynamic
  { id: 'bounce-purple', name: 'Bounce Purple', category: 'dynamic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#a855f7' } },
  { id: 'wave-cyan', name: 'Wave Cyan', category: 'dynamic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#06b6d4' } },
  { id: 'glow-pink', name: 'Glow Pink', category: 'dynamic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#ec4899', shadow: `0 0 16px #ec489966` } },
  { id: 'scale-orange', name: 'Scale Orange', category: 'dynamic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#f97316' } },
  { id: 'slide-white', name: 'Slide White', category: 'dynamic', colors: { bg: 'rgba(255,255,255,0.15)', text: '#ffffff', highlight: '#ffffff' } },
  { id: 'shake-red', name: 'Shake Red', category: 'dynamic', colors: { bg: 'transparent', text: '#ffffff', highlight: '#dc2626', shadow: '0 3px 0 #dc2626' } },
  // Word
  { id: 'karaoke-yellow', name: 'Karaoke Yellow', category: 'word', colors: { bg: 'transparent', text: 'rgba(255,255,255,0.5)', highlight: '#fbbf24' } },
  { id: 'typewriter', name: 'Typewriter', category: 'word', colors: { bg: 'rgba(0,0,0,0.85)', text: '#22c55e', highlight: '#22c55e' } },
  { id: 'color-word', name: 'Color Per Word', category: 'word', colors: { bg: 'transparent', text: '#ffffff', highlight: '#818cf8' } },
  { id: 'neon-glow', name: 'Neon Glow', category: 'word', colors: { bg: 'rgba(0,0,0,0.8)', text: '#06b6d4', highlight: '#06b6d4', shadow: '0 0 12px #06b6d4, 0 0 24px #06b6d444' } },
  { id: 'outline-bold', name: 'Outline Bold', category: 'word', colors: { bg: 'transparent', text: '#ffffff', highlight: '#ffffff' } },
  { id: 'gradient-text', name: 'Gradient Text', category: 'word', colors: { bg: 'transparent', text: '#ffffff', highlight: 'linear-gradient(90deg, #f59e0b, #ec4899)' } },
];

const TABS = [
  { id: 'basic', label: 'Basic' },
  { id: 'dynamic', label: 'Dynamic' },
  { id: 'word', label: 'Word' },
] as const;

const DEMO_WORDS = ['This', 'is', 'how', 'your', 'captions', 'look'];

export default function CaptionStylePicker() {
  const [tab, setTab] = useState<'basic' | 'dynamic' | 'word'>('basic');
  const [selected, setSelected] = useState('yellow-pop');
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const filtered = STYLES.filter((s) => s.category === tab);
  const style = STYLES.find((s) => s.id === selected) || STYLES[1];

  // Animate word highlight
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((i) => (i + 1) % DEMO_WORDS.length);
    }, 600);
    return () => clearInterval(interval);
  }, [selected]);

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
      <div className="p-5 sm:p-7">
        <p className="text-xs font-black uppercase tracking-wider text-zinc-400">Select a caption style below to apply to the video</p>

        {/* Tabs */}
        <div className="mt-4 inline-flex rounded-xl bg-zinc-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`rounded-lg px-5 py-2.5 text-xs font-black transition ${tab === t.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              onClick={() => setTab(t.id)}
              type="button"
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
        {/* Style cards grid */}
        <div className="border-t border-zinc-100 p-5 sm:p-7 lg:border-r lg:border-t-0">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`group relative flex h-20 flex-col items-center justify-center overflow-hidden rounded-xl border transition ${
                  selected === s.id
                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
                    : 'border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:shadow-sm'
                }`}
                type="button"
              >
                {/* Mini word preview */}
                <div className="flex items-center gap-1">
                  {['Hey', 'there'].map((w, i) => (
                    <span
                      key={`${s.id}-${i}`}
                      className="text-xs font-black"
                      style={{
                        color: i === 1 ? s.colors.highlight : (s.colors.bg !== 'transparent' ? '#fff' : '#374151'),
                        textShadow: s.colors.shadow || 'none',
                        WebkitBackgroundClip: s.colors.highlight.startsWith('linear') ? 'text' : undefined,
                        WebkitTextFillColor: s.colors.highlight.startsWith('linear') && i === 1 ? 'transparent' : undefined,
                        background: s.colors.highlight.startsWith('linear') && i === 1 ? s.colors.highlight : undefined,
                      } as React.CSSProperties}
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[10px] font-bold text-zinc-500">{s.name}</p>
                {selected === s.id ? (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />
                ) : null}
              </button>
            ))}
          </div>

          <Link
            href={`/dashboard?template=auto-caption-reel&captionStyle=${selected}`}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Use This Style <ArrowRight size={15} />
          </Link>
        </div>

        {/* Live video preview */}
        <div className="relative flex items-center justify-center bg-zinc-900 p-6 lg:p-8">
          <div className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border-4 border-zinc-800 shadow-2xl">
            {/* Fake video */}
            <div className="relative aspect-[9/16] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900">
              <div className="absolute inset-0 bg-[url('/visuals/previews/Auto%20Caption%20Reel%20Home.png')] bg-cover bg-center opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Play button center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Play size={22} className="ml-1 text-white/80" fill="currentColor" />
                </div>
              </div>

              {/* Live caption at bottom */}
              <div className="absolute bottom-12 left-3 right-3">
                <LiveCaptionPreview style={style} activeIndex={activeWordIndex} />
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="h-1 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full animate-[progress_4s_linear_infinite] rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>

          {/* Style label */}
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-[10px] font-black text-zinc-300">
              {style.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveCaptionPreview({ style, activeIndex }: { style: CaptionStyle; activeIndex: number }) {
  const { colors } = style;
  const hasBg = colors.bg !== 'transparent';

  return (
    <div
      className="animate-[fadeInUp_0.3s_ease-out] rounded-xl px-4 py-3 text-center"
      style={{
        background: hasBg ? colors.bg : 'transparent',
        backdropFilter: hasBg ? 'blur(6px)' : undefined,
      }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-[6px] gap-y-1">
        {DEMO_WORDS.map((word, i) => {
          const isActive = i === activeIndex;
          const isKaraoke = style.id.includes('karaoke') || style.category === 'word';
          const shouldHighlight = isKaraoke ? i <= activeIndex : isActive;

          return (
            <span
              key={`${word}-${i}-${style.id}`}
              className={`inline-block transition-all duration-200 ${isActive && style.category === 'dynamic' ? 'animate-[bounceWord_0.4s_ease-out]' : ''}`}
              style={{
                color: shouldHighlight ? colors.highlight : colors.text,
                fontSize: 18,
                fontWeight: 900,
                textShadow: shouldHighlight && colors.shadow ? colors.shadow : '0 1px 3px rgba(0,0,0,0.4)',
                transform: isActive && style.category === 'dynamic' ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                opacity: style.id.includes('karaoke') && i > activeIndex ? 0.4 : 1,
                letterSpacing: -0.3,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
