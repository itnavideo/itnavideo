'use client';

import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import VideoBeforeAfterCard from './VideoBeforeAfterCard';

export const CAPTION_PAIRS = [
  {
    id: 'doctor',
    label: 'Doctor / Healthcare',
    description: 'Medical explainer with technical terms — clean professional captions',
    beforeSrc: '/videos/auto-captions/doctor-before.mp4',
    afterSrc: '/videos/auto-captions/doctor-after.mp4',
    accentColor: '#38BDF8',
  },
  {
    id: 'content-creator',
    label: 'Content Creator',
    description: 'Talking-head creator reel with bold karaoke-style captions',
    beforeSrc: '/videos/auto-captions/content-creator-before.mp4',
    afterSrc: '/videos/auto-captions/content-creator-after.mp4',
    accentColor: '#22C55E',
  },
  {
    id: 'professional-creator',
    label: 'Professional / Corporate',
    description: 'Polished business presenter with studio-clean subtitle style',
    beforeSrc: '/videos/auto-captions/professional-creator-before.mp4',
    afterSrc: '/videos/auto-captions/professional-creator-after.mp4',
    accentColor: '#A78BFA',
  },
  {
    id: 'professional-creator-girl',
    label: 'Coach / Educator',
    description: 'Female presenter coaching content with highlight captions',
    beforeSrc: '/videos/auto-captions/professional-creator-girl-before.mp4',
    afterSrc: '/videos/auto-captions/professional-creator-girl-after.mp4',
    accentColor: '#F472B6',
  },
  {
    id: 'real-estate-advisor',
    label: 'Real Estate Advisor',
    description: 'Property consultant — bold captions that stay readable on busy backgrounds',
    beforeSrc: '/videos/auto-captions/real-estate-advisor-before.mp4',
    afterSrc: '/videos/auto-captions/real-estate-advisor-after.mp4',
    accentColor: '#F59E0B',
  },
  {
    id: 'traveler',
    label: 'Travel / Lifestyle',
    description: 'Outdoor creator with fast speech — accurate word-level sync',
    beforeSrc: '/videos/auto-captions/traveler-before.mp4',
    afterSrc: '/videos/auto-captions/traveler-after.mp4',
    accentColor: '#34D399',
  },
] as const;

export default function AutoCaptionsShowcase({ limit }: { limit?: number }) {
  const pairs = limit ? CAPTION_PAIRS.slice(0, limit) : CAPTION_PAIRS;
  const isPreview = Boolean(limit);

  return (
    <section
      className="relative"
      style={{ background: '#080C14' }}
    >
      {/* Top border glow */}
      {!isPreview && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)' }}
        />
      )}

      {/* Ambient radial */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 900px 500px at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 60%)' }}
      />

      <div className={`relative mx-auto max-w-7xl px-5 sm:px-8 ${isPreview ? 'py-20 md:py-24' : 'pb-28 pt-28 md:pt-36'}`}>

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/[0.07] px-4 py-1.5 text-xs font-bold text-green-400">
            <Sparkles size={12} />
            {isPreview ? 'Real output examples' : 'Auto Caption Video — Full Gallery'}
          </div>

          <h2 className={`font-black leading-tight text-white ${isPreview ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl md:text-6xl'}`}>
            {isPreview ? (
              <>See the difference<br className="hidden sm:block" /> before and after captions.</>
            ) : (
              <>Every video type.<br className="hidden sm:block" /> Every caption style.</>
            )}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-400">
            {isPreview
              ? 'Hover to play. Word-level captions sync to every spoken word automatically.'
              : '6 real creators. Raw input vs Itnavideo Auto Caption output. Hover to play — no autoplay, fully muted by default.'}
          </p>

          {/* Stats row — full page only */}
          {!isPreview && (
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              {[
                ['6', 'Real examples'],
                ['15+', 'Caption styles'],
                ['2', 'Languages'],
                ['1080p', 'MP4 export'],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-green-400">{val}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video grid — pl-5 gives room for the overlapping Before card on the left */}
        <div className={`grid gap-x-8 gap-y-16 pl-5 sm:pl-6 ${isPreview ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-3'}`}
          style={{ overflow: 'visible' }}>
          {pairs.map((pair) => (
            <VideoBeforeAfterCard
              key={pair.id}
              label={pair.label}
              description={pair.description}
              beforeSrc={pair.beforeSrc}
              afterSrc={pair.afterSrc}
              accentColor={pair.accentColor}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          {isPreview ? (
            <>
              <Link
                href="/auto-caption-generator"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-sm font-black text-slate-200 transition hover:bg-white/[0.09] hover:text-white"
              >
                See all 6 caption examples
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/dashboard?videoType=auto-caption-generator"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-8 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-green-400"
                style={{ boxShadow: '0 0 28px rgba(34,197,94,0.4)' }}
              >
                <Play size={14} fill="currentColor" />
                Add captions to my video free
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard?videoType=auto-caption-generator"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-9 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-green-400"
                style={{ boxShadow: '0 0 28px rgba(34,197,94,0.4)' }}
              >
                <Play size={16} fill="currentColor" />
                Add captions to my video free
              </Link>
              <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-500">
                {['No editing skills needed', 'English & Hinglish', 'Paid exports: no watermark', 'Free trial includes watermark'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="text-green-500">✓</span> {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
