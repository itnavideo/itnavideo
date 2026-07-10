'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

// ── Fake caption words simulating transcript output ───────────────────────────
const CAPTION_LINES = [
  { words: ['Kya', 'aapko', 'pata', 'hai'], highlight: 3 },
  { words: ['credit', 'card', 'ka', 'sahi', 'use'], highlight: 1 },
  { words: ['aapki', 'CIBIL', 'score', 'badhata', 'hai?'], highlight: 2 },
];

// ── Style cards: show 4 distinct caption looks ────────────────────────────────
const STYLE_DEMOS = [
  {
    key: 'karaoke',
    label: 'Karaoke Fill',
    accent: '#22C55E',
    bg: 'rgba(0,0,0,0.82)',
    words: ['credit', 'card', 'ka', 'sahi'],
    active: 1,
    renderWord: (w: string, isActive: boolean) => (
      <span
        key={w}
        style={{
          display: 'inline-block',
          marginRight: 8,
          fontWeight: 900,
          fontSize: 22,
          color: isActive ? '#22C55E' : '#ffffff',
          textDecoration: isActive ? 'underline' : 'none',
          textDecorationColor: '#22C55E',
          textUnderlineOffset: 3,
        }}
      >
        {w}
      </span>
    ),
  },
  {
    key: 'studio-clean',
    label: 'Studio Clean',
    accent: '#60A5FA',
    bg: 'rgba(24,24,27,0.88)',
    words: ['credit', 'card', 'ka', 'sahi'],
    active: 2,
    renderWord: (w: string, isActive: boolean) => (
      <span
        key={w}
        style={{
          display: 'inline-block',
          marginRight: 6,
          fontWeight: 800,
          fontSize: 21,
          color: isActive ? '#60A5FA' : '#f1f5f9',
          background: isActive ? 'rgba(96,165,250,0.18)' : 'transparent',
          borderRadius: 4,
          padding: isActive ? '0 4px' : 0,
        }}
      >
        {w}
      </span>
    ),
  },
  {
    key: 'bold-fire',
    label: 'Bold Fire',
    accent: '#F97316',
    bg: 'rgba(0,0,0,0.9)',
    words: ['CREDIT', 'CARD', 'KA', 'SAHI'],
    active: 0,
    renderWord: (w: string, isActive: boolean) => (
      <span
        key={w}
        style={{
          display: 'inline-block',
          marginRight: 8,
          fontWeight: 950,
          fontSize: isActive ? 28 : 22,
          color: isActive ? '#F97316' : '#ffffff',
          textShadow: isActive ? '0 0 18px #F9731688' : 'none',
          letterSpacing: -0.5,
        }}
      >
        {w}
      </span>
    ),
  },
  {
    key: 'metallic',
    label: 'Metallic Gradient',
    accent: '#D9B76E',
    bg: 'linear-gradient(180deg, rgba(17,24,39,0.82), rgba(2,6,23,0.72))',
    words: ['credit', 'card', 'ka', 'sahi'],
    active: 3,
    renderWord: (w: string, isActive: boolean) => (
      <span
        key={w}
        style={{
          display: 'inline-block',
          marginRight: 8,
          fontWeight: 900,
          fontSize: 22,
          background: isActive
            ? 'linear-gradient(100deg,#FFFFFF 0%,#D9B76E 38%,#94A3B8 70%,#FFFFFF 100%)'
            : 'linear-gradient(100deg,#F8FAFC 0%,#B8C2D8 46%,#E5E7EB 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {w}
      </span>
    ),
  },
];

function PhoneMockup({ children, accentColor = '#22C55E' }: { children: React.ReactNode; accentColor?: string }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '9/16',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#0a0a0a',
        border: `1.5px solid ${accentColor}44`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${accentColor}18`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </div>
  );
}

function BeforePhone() {
  return (
    <PhoneMockup accentColor="#64748B">
      {/* Simulated video frame */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/preview/Auto Caption Reel.png"
          alt="Video without captions"
          fill
          className="object-cover object-center"
          sizes="240px"
          style={{ filter: 'grayscale(0.3) brightness(0.7)' }}
        />
      </div>
      {/* No captions label */}
      <div style={{
        position: 'absolute',
        top: 12, left: 12,
        background: 'rgba(0,0,0,0.7)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 8,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 700,
        color: '#94A3B8',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        No captions
      </div>
      {/* Muted icon */}
      <div style={{
        position: 'absolute',
        bottom: 60, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <div style={{
          width: 48, height: 48,
          borderRadius: 999,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <span style={{ fontSize: 20 }}>🔇</span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
          Watched on mute
        </span>
      </div>
      {/* Scroll-past rate */}
      <div style={{
        position: 'absolute',
        bottom: 12, left: 12, right: 12,
        background: 'rgba(220,38,38,0.18)',
        border: '1px solid rgba(220,38,38,0.35)',
        borderRadius: 8,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>📉</span>
        <div>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#FCA5A5', margin: 0 }}>High scroll-past rate</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Viewers skip without reading</p>
        </div>
      </div>
    </PhoneMockup>
  );
}

function AfterPhone() {
  return (
    <PhoneMockup accentColor="#22C55E">
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/preview/Auto Caption Reel.png"
          alt="Video with captions"
          fill
          className="object-cover object-center"
          sizes="240px"
        />
      </div>
      {/* Caption badge */}
      <div style={{
        position: 'absolute',
        top: 12, left: 12,
        background: 'rgba(34,197,94,0.2)',
        border: '1px solid rgba(34,197,94,0.4)',
        borderRadius: 8,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 700,
        color: '#86EFAC',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        ✓ Auto captions
      </div>
      {/* Live caption simulation */}
      <div style={{
        position: 'absolute',
        bottom: 90,
        left: 12, right: 12,
        background: 'rgba(24,24,27,0.88)',
        borderRadius: 10,
        padding: '10px 14px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
          {['credit', 'card', 'ka', 'sahi', 'use'].map((w, i) => (
            <span key={w} style={{
              fontWeight: 900,
              fontSize: 18,
              color: i === 1 ? '#22C55E' : '#f1f5f9',
              background: i === 1 ? 'rgba(34,197,94,0.15)' : 'transparent',
              borderRadius: 4,
              padding: i === 1 ? '0 4px' : 0,
              lineHeight: 1.3,
            }}>
              {w}
            </span>
          ))}
        </div>
      </div>
      {/* Retention badge */}
      <div style={{
        position: 'absolute',
        bottom: 12, left: 12, right: 12,
        background: 'rgba(34,197,94,0.12)',
        border: '1px solid rgba(34,197,94,0.3)',
        borderRadius: 8,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>📈</span>
        <div>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#86EFAC', margin: 0 }}>Higher watch time</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Readable even on mute</p>
        </div>
      </div>
    </PhoneMockup>
  );
}

export default function CaptionBeforeAfter() {
  return (
    <section className="relative overflow-hidden border-t border-white/8 px-5 py-20 sm:px-8 md:py-28" style={{ background: '#080C14' }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)',
      }} />

      <div className="relative mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/[0.07] px-4 py-1.5 text-xs font-bold text-green-400">
            Before vs After
          </div>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            Same video. Completely different result.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400">
            80% of viewers watch reels on mute. Without captions they scroll past. With Itnavideo auto captions, every word is readable.
          </p>
        </div>

        {/* Before / After phones */}
        <div className="mb-16 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-8">
          {/* Before */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-sm font-black text-red-400 ring-1 ring-red-500/30">
              ✕
            </div>
            <div className="w-full max-w-[220px]">
              <BeforePhone />
            </div>
            <p className="text-center text-sm font-black text-red-400">Without captions</p>
            <p className="max-w-[200px] text-center text-xs text-slate-500">Viewer watches on mute, misses the message, scrolls away</p>
          </div>

          {/* Arrow divider */}
          <div className="flex flex-col items-center gap-2 py-4">
            <ArrowRight size={28} className="text-slate-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Upload once</span>
          </div>

          {/* After */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-sm font-black text-green-400 ring-1 ring-green-500/30">
              ✓
            </div>
            <div className="w-full max-w-[220px]">
              <AfterPhone />
            </div>
            <p className="text-center text-sm font-black text-green-400">With Itnavideo auto captions</p>
            <p className="max-w-[200px] text-center text-xs text-slate-500">Every word shows as it's spoken — readable on mute, all platforms</p>
          </div>
        </div>

        {/* Style showcase */}
        <div className="mb-12">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            15+ caption styles — pick the one that fits your brand
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STYLE_DEMOS.map((demo) => (
              <div key={demo.key}
                className="flex flex-col items-center gap-3 rounded-xl border border-white/8 p-4"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                {/* Mini phone */}
                <div style={{
                  width: 100,
                  aspectRatio: '9/16',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#0a0a12',
                  border: `1px solid ${demo.accent}44`,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                  {/* Simulated video bg */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(160deg, #0f1a2e 0%, #0a0a1a 100%)',
                    opacity: 0.9,
                  }} />
                  {/* Caption strip */}
                  <div style={{
                    position: 'absolute',
                    bottom: 12, left: 6, right: 6,
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: demo.bg,
                    textAlign: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2,
                  }}>
                    {demo.words.map((w, i) => demo.renderWord(w, i === demo.active))}
                  </div>
                </div>
                {/* Label */}
                <span className="text-center text-[11px] font-bold text-slate-300">{demo.label}</span>
                <div className="h-1.5 w-6 rounded-full" style={{ background: demo.accent }} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Link
            href="/dashboard?videoType=auto-caption-reel"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-green-400"
            style={{ boxShadow: '0 0 28px rgba(34,197,94,0.45)' }}
          >
            <Play size={15} fill="currentColor" />
            Add captions to my video free
          </Link>
          <p className="text-xs text-slate-500">No editing skills · English & Hinglish · 1080p MP4 export</p>
        </div>

      </div>
    </section>
  );
}
