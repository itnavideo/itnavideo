'use client';

import React from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  Layers, 
  Smartphone,
} from 'lucide-react';

function InstagramIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 drop-shadow-[0_0_6px_rgba(225,48,108,0.5)]" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="igTickerGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#F56040" />
          <stop offset="75%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#C13584" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#igTickerGrad)" strokeWidth="2.5" fill="none" />
      <circle cx="12" cy="12" r="4.5" stroke="url(#igTickerGrad)" strokeWidth="2" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="#FD1D1D" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 drop-shadow-[0_0_6px_rgba(0,242,254,0.6)]" viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="#00F2FE"
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.32 1.55-1.28 2.55.03.88.52 1.72 1.28 2.18.82.49 1.88.52 2.73.08.82-.41 1.39-1.26 1.43-2.18.06-3.83.02-7.66.03-11.49z"
      />
    </svg>
  );
}

function YouTubeShortsIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-red-500 fill-current drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" viewBox="0 0 24 24">
      <path d="M17.77 10.32l-1.2-.5L18 8.71a4.34 4.34 0 0 0-5.83-5.83l-6.07 3.5A4.34 4.34 0 0 0 8.23 14l1.2.5L8 15.81a4.34 4.34 0 0 0 5.83 5.83l6.07-3.5a4.34 4.34 0 0 0-2.13-7.82zM9.54 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function SubtitleCcIcon() {
  return (
    <div className="inline-flex h-4 px-1.5 items-center justify-center rounded bg-amber-500/20 border border-amber-400/50 font-mono text-[10px] font-black text-amber-300 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
      CC
    </div>
  );
}

function LanguageGlobeIcon() {
  return (
    <div className="inline-flex h-4 px-1.5 items-center justify-center rounded bg-sky-500/20 border border-sky-400/50 font-sans text-[10px] font-black text-sky-300 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.3)]">
      A / अ
    </div>
  );
}

function LightningIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-amber-400 fill-amber-400/30 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const TICKER_ITEMS = [
  { 
    label: '1080×1920 Full HD (30 FPS)', 
    IconComponent: Smartphone, 
    iconColor: 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]' 
  },
  { 
    label: 'YouTube Shorts Ready', 
    IconComponent: YouTubeShortsIcon, 
    isCustom: true 
  },
  { 
    label: 'Instagram Reels Optimized', 
    IconComponent: InstagramIcon, 
    isCustom: true 
  },
  { 
    label: 'TikTok High Retention', 
    IconComponent: TikTokIcon, 
    isCustom: true 
  },
  { 
    label: 'Ultra-Fast Speech Subtitles', 
    IconComponent: SubtitleCcIcon, 
    isCustom: true 
  },
  { 
    label: '60s Instant Cloud Render', 
    IconComponent: LightningIcon, 
    isCustom: true 
  },
  { 
    label: 'Roman Hinglish + English', 
    IconComponent: LanguageGlobeIcon, 
    isCustom: true 
  },
  { 
    label: '11 Dedicated Video Engines', 
    IconComponent: Layers, 
    iconColor: 'text-[#FF9100] drop-shadow-[0_0_6px_rgba(255,109,0,0.5)]' 
  },
  { 
    label: 'Zero Local Hardware Lag', 
    IconComponent: ShieldCheck, 
    iconColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]' 
  },
];

export default function PlatformMarqueeTicker() {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#050505] py-3.5">
      {/* Subtle edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-28 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-28 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent" />

      <div 
        className="flex w-max animate-marquee hover:pause gap-3"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const { IconComponent, isCustom, iconColor } = item;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-[#FF6D00]/50 hover:bg-white/[0.08] hover:text-white hover:scale-[1.03] cursor-pointer"
            >
              {isCustom ? (
                <IconComponent />
              ) : (
                <IconComponent size={15} className={`shrink-0 ${iconColor || 'text-[#FF9100]'}`} />
              )}
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
