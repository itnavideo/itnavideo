'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Youtube } from 'lucide-react';

// Simulated YouTube thumbnail metadata
const MOCK_VIDEO = {
  title: 'Complete SIP Investment Guide for Beginners 2025',
  duration: '18:42',
  channel: '@FinanceWithRohan',
  views: '1.2M views',
};

function PhoneMockup({ children, accentColor = '#A3E635' }: { children: React.ReactNode; accentColor?: string }) {
  return (
    <div style={{
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
    }}>
      {children}
    </div>
  );
}

/** BEFORE — plain link share, no visual reel */
function BeforePhone() {
  return (
    <PhoneMockup accentColor="#64748B">
      {/* Dark feed background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0f172a 0%,#020617 100%)' }} />

      {/* Before badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8, padding: '4px 10px',
        fontSize: 11, fontWeight: 700, color: '#94A3B8',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>No promo reel
      </div>

      {/* Simulated plain link card */}
      <div style={{
        position: 'absolute', top: 80, left: 14, right: 14,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {/* Placeholder thumbnail bar */}
        <div style={{
          height: 90, background: 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Youtube size={28} color="rgba(255,255,255,0.2)" />
        </div>
        <div style={{ padding: '8px 10px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
            youtube.com/watch?v=…
          </p>
          <p style={{ fontSize: 10, color: '#475569', margin: '3px 0 0', lineHeight: 1.3 }}>
            {MOCK_VIDEO.title.slice(0, 36)}…
          </p>
        </div>
      </div>

      {/* Problem callouts */}
      <div style={{
        position: 'absolute', bottom: 40, left: 12, right: 12,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {[
          { icon: '👻', text: 'No visual hook — link looks plain' },
          { icon: '📉', text: 'Low click-through on Reels feed' },
          { icon: '😴', text: 'Audience skips without context' },
        ].map(({ icon, text }) => (
          <div key={text} style={{
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid rgba(220,38,38,0.25)',
            borderRadius: 8, padding: '6px 10px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 13 }}>{icon}</span>
            <span style={{ fontSize: 10, color: '#FCA5A5', fontWeight: 700 }}>{text}</span>
          </div>
        ))}
      </div>
    </PhoneMockup>
  );
}

/** AFTER — polished vertical promo reel */
function AfterPhone() {
  return (
    <PhoneMockup accentColor="#A3E635">
      {/* Dark video bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0a1628 0%,#050a14 100%)' }} />

      {/* After badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        background: 'rgba(163,230,53,0.15)', border: '1px solid rgba(163,230,53,0.35)',
        borderRadius: 8, padding: '4px 10px',
        fontSize: 11, fontWeight: 700, color: '#BEF264',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>✓ Promo reel
      </div>

      {/* Thumbnail area (16:9) */}
      <div style={{
        position: 'absolute', top: 52, left: 10, right: 10,
        aspectRatio: '16/9',
        borderRadius: 10, overflow: 'hidden',
        border: '1.5px solid rgba(163,230,53,0.3)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>
        <Image
          src="/preview/Long Video Promo.png"
          alt="Long Video Promo output"
          fill
          className="object-cover"
          sizes="200px"
        />
        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.25)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Play size={12} fill="white" color="white" />
          </div>
        </div>
        {/* Duration badge */}
        <div style={{
          position: 'absolute', bottom: 6, right: 8,
          background: 'rgba(0,0,0,0.85)', borderRadius: 4, padding: '2px 6px',
          fontSize: 10, fontWeight: 700, color: '#fff',
        }}>{MOCK_VIDEO.duration}
        </div>
      </div>

      {/* Title card */}
      <div style={{
        position: 'absolute', top: 52 + 110 + 14, left: 10, right: 10,
        background: 'rgba(15,23,42,0.88)',
        border: '1px solid rgba(163,230,53,0.2)',
        borderRadius: 8, padding: '10px 12px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        {/* Top accent line */}
        <div style={{ height: 3, borderRadius: 999, background: '#A3E635', marginBottom: 8, width: 40 }} />
        <p style={{ fontSize: 12, fontWeight: 900, color: '#F8FAFC', margin: 0, lineHeight: 1.35 }}>
          {MOCK_VIDEO.title}
        </p>
        <p style={{ fontSize: 10, color: '#94A3B8', margin: '4px 0 0', fontWeight: 600 }}>
          {MOCK_VIDEO.channel}
        </p>
      </div>

      {/* Result badges */}
      <div style={{
        position: 'absolute', bottom: 12, left: 10, right: 10,
        display: 'flex', flexDirection: 'column', gap: 5,
      }}>
        {[
          { icon: '🎬', text: 'Thumbnail + title in vertical format' },
          { icon: '📈', text: 'More clicks to full video' },
          { icon: '⚡', text: 'Ready to post in minutes' },
        ].map(({ icon, text }) => (
          <div key={text} style={{
            background: 'rgba(163,230,53,0.08)',
            border: '1px solid rgba(163,230,53,0.2)',
            borderRadius: 7, padding: '5px 9px',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ fontSize: 12 }}>{icon}</span>
            <span style={{ fontSize: 10, color: '#BEF264', fontWeight: 700 }}>{text}</span>
          </div>
        ))}
      </div>
    </PhoneMockup>
  );
}

export default function PromoBeforeAfter() {
  return (
    <section className="relative overflow-hidden border-t border-white/8 px-5 py-20 sm:px-8 md:py-28"
      style={{ background: '#080C14' }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgba(163,230,53,0.07) 0%, transparent 60%)' }} />

      <div className="relative mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/[0.07] px-4 py-1.5 text-xs font-bold text-lime-400">
            Before vs After
          </div>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            Your long video deserves a proper promo.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400">
            Sharing a plain YouTube link loses your audience before they even click. A vertical promo reel with thumbnail, title, and a highlight clip drives real views.
          </p>
        </div>

        {/* Before / After phones */}
        <div className="mb-16 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-8">
          {/* Before */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-sm font-black text-red-400 ring-1 ring-red-500/30">✕</div>
            <div className="w-full max-w-[220px]">
              <BeforePhone />
            </div>
            <p className="text-center text-sm font-black text-red-400">Plain link share</p>
            <p className="max-w-[200px] text-center text-xs text-slate-500">Low engagement, no visual hook, audience scrolls past</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2 py-4">
            <ArrowRight size={28} className="text-slate-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Upload once</span>
          </div>

          {/* After */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500/20 text-sm font-black text-lime-400 ring-1 ring-lime-500/30">✓</div>
            <div className="w-full max-w-[220px]">
              <AfterPhone />
            </div>
            <p className="text-center text-sm font-black text-lime-400">Vertical promo reel</p>
            <p className="max-w-[200px] text-center text-xs text-slate-500">Thumbnail + title + highlight clip — ready for Reels, Shorts, TikTok</p>
          </div>
        </div>

        {/* What goes in / what comes out */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-white/8" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="grid divide-y divide-white/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {/* Input */}
            <div className="p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">You upload</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: '🖼️', label: 'YouTube thumbnail (16:9 image)' },
                  { icon: '📹', label: 'Short promo clip (10–60s)' },
                  { icon: '✏️', label: 'Video title' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm font-semibold text-slate-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Output */}
            <div className="p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-lime-500">You get</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: '📱', label: '9:16 vertical promo MP4' },
                  { icon: '🎨', label: 'Thumbnail + bold title overlay' },
                  { icon: '▶️', label: 'Highlight clip playing in frame' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-lime-400/15 px-4 py-3" style={{ background: 'rgba(163,230,53,0.04)' }}>
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm font-semibold text-slate-200">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Use cases row */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {[
            '📺 YouTubers', '🎙️ Podcasters', '📚 Course creators',
            '🕌 Bayan & lecture', '🎵 Music releases', '🎓 Teachers',
          ].map((label) => (
            <span key={label} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-300">
              {label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Link
            href="/dashboard?videoType=long-video-promo"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
            style={{ background: '#A3E635', boxShadow: '0 0 28px rgba(163,230,53,0.4)' }}
          >
            <Play size={15} fill="currentColor" />
            Create my promo reel
          </Link>
          <p className="text-xs text-slate-500">No editing skills · Upload thumbnail + clip · 1080p MP4 export</p>
        </div>

      </div>
    </section>
  );
}
