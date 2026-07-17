'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

const INTRO_VIDEO_URL = 'https://remotionlambda-apsouth1-m59wp9dklj.s3.ap-south-1.amazonaws.com/public/marketing/itnavideo-intro-2026.mp4';
const INTRO_POSTER = '/visuals/banners/hero-homepage.png';

export default function IntroVideoSection() {
  // The intro is a large file. We never autoplay/preload it on scroll (that caused jank);
  // instead we show a lightweight poster image and only load + play the video on click.
  const [started, setStarted] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20" style={{ background: 'linear-gradient(180deg, #0B1120 0%, #080C14 100%)' }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 900px 500px at 50% 30%, rgba(34,211,238,0.08) 0%, transparent 60%)' }}
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/[0.08] px-4 py-1.5 text-xs font-bold text-cyan-100">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
            See Itnavideo in action
          </div>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            Watch how Itnavideo turns your uploads<br className="hidden sm:block" />
            <span className="text-cyan-300"> into ready-to-post videos.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
            A quick walkthrough of the dashboard, templates, and the AI workflow behind every render.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl bg-[#081626] p-2 pb-3 shadow-[0_30px_80px_rgba(6,182,212,0.18)]"
          style={{ border: '1px solid rgba(34,211,238,0.28)' }}
        >
          {/* Laptop-style bezel to visually match the Long Videos card language */}
          <div className="relative aspect-video overflow-hidden rounded-[15px] border-[7px] border-slate-950 bg-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
            <span className="absolute left-1/2 top-1 z-30 h-px w-8 -translate-x-1/2 rounded-full bg-slate-700" />

            {started ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={INTRO_VIDEO_URL}
                autoPlay
                controls
                playsInline
                preload="auto"
                poster={INTRO_POSTER}
              />
            ) : (
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="group absolute inset-0 z-20 flex items-center justify-center"
                aria-label="Play introduction video"
              >
                <Image
                  src={INTRO_POSTER}
                  alt="Itnavideo walkthrough preview"
                  fill
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover"
                  priority={false}
                />
                <span className="absolute inset-0 bg-slate-950/35 transition group-hover:bg-slate-950/25" />
                <span
                  className="relative flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition group-hover:scale-105"
                  style={{ background: '#22D3EE', color: '#0B1120', boxShadow: '0 16px 40px rgba(34,211,238,0.55)' }}
                >
                  <Play size={30} strokeWidth={2.5} fill="currentColor" />
                </span>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/70 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                  Tap to watch the walkthrough
                </span>
              </button>
            )}
          </div>
          {/* Laptop base stub */}
          <div className="relative z-10 mx-auto -mt-px h-2 w-1/2 rounded-b-full border-x border-b border-slate-950 bg-slate-800 shadow-[0_6px_12px_rgba(0,0,0,0.35)]">
            <span className="absolute left-1/2 top-0 h-px w-1/4 -translate-x-1/2 bg-cyan-200/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
