'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

const INTRO_VIDEO_URL = 'https://remotionlambda-apsouth1-m59wp9dklj.s3.ap-south-1.amazonaws.com/public/marketing/itnavideo-intro-2026.mp4';
const POSTER = '/visuals/banners/intro-video-poster.png';

/**
 * Founder intro video section. Shows who built Itnavideo and why.
 * Click-to-play (no autoplay — saves bandwidth, respects user).
 */
export default function FounderVideoSection() {
  const [started, setStarted] = useState(false);

  return (
    <section className="px-4 py-20 sm:px-6" style={{ background: '#0B1120' }}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Meet the founder</p>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Built by a creator who was tired of editing.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
            Syed Rohi built Itnavideo because he was spending 3+ hours a week captioning and formatting videos. Now the repeatable work is handled by AI.
          </p>
        </div>

        {/* Video */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
          style={{ background: '#081626' }}
        >
          <div className="relative aspect-video overflow-hidden rounded-xl">
            {started ? (
              <video
                className="h-full w-full object-cover"
                src={INTRO_VIDEO_URL}
                autoPlay
                controls
                playsInline
                preload="auto"
              />
            ) : (
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="group relative flex h-full w-full items-center justify-center"
                aria-label="Play founder intro video"
              >
                <Image
                  src={POSTER}
                  alt="Syed Rohi — Founder of Itnavideo"
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="object-cover"
                  style={{ transform: 'scale(1.05)' }}
                />
                <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-cyan shadow-[0_12px_32px_rgba(34,211,238,0.4)] transition group-hover:scale-110">
                  <Play size={24} fill="#0B1120" stroke="none" />
                </span>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                  Watch the founder intro
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-brand-cyan/30">
            <Image src="/founder/syed-mohammed-rohi.webp" alt="Syed Rohi" width={40} height={40} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Syed Mohammed Rohi</p>
            <p className="text-[11px] text-slate-500">Founder, Itnavideo · Bangalore, India</p>
          </div>
        </div>
      </div>
    </section>
  );
}
