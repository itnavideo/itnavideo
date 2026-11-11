'use client';

/**
 * HowItWorksVideo — Step-by-step tutorial video section.
 *
 * PLACEHOLDER: Upload the actual "how it works" video to Cloudinary under
 * `itnavideo12345/homepage/how-it-works.mp4` then replace the
 * HOW_IT_WORKS_VIDEO_URL constant below.
 *
 * This component shows a chapter-linked video with 3 labelled steps
 * so viewers can jump directly to Upload, AI Planning, or Export.
 *
 * Usage: import and place between <TenStudiosHubArchitecture /> and <TestimonialSection />.
 */

import React, { useRef, useState } from 'react';
import { Play, Pause, UploadCloud, Sparkles, Download } from 'lucide-react';

// ─── Replace these URLs once the video is ready ──────────────────────────────
const HOW_IT_WORKS_VIDEO_URL = ''; // 'https://res.cloudinary.com/dhouh9idx/video/upload/.../how-it-works.mp4'
const HOW_IT_WORKS_POSTER_URL = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1792945906/file_00000000e0588211aef29aa7dc03025e_e09msx.png';
const IS_READY = Boolean(HOW_IT_WORKS_VIDEO_URL);
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  { label: 'Step 1: Upload Audio', icon: UploadCloud, seconds: 0, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { label: 'Step 2: AI Planning', icon: Sparkles, seconds: 20, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { label: 'Step 3: Export HD', icon: Download, seconds: 45, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
];

export default function HowItWorksVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const seekTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    videoRef.current.play();
    setPlaying(true);
  };

  return (
    <section className="relative bg-white px-4 py-12 sm:py-20 border-b border-slate-100">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            How it{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
            Upload → AI creates → Download. Watch the full walkthrough in under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Chapter jump links */}
          <div className="lg:col-span-4 space-y-3">
            {CHAPTERS.map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <button
                  key={ch.label}
                  onClick={() => IS_READY ? seekTo(ch.seconds) : undefined}
                  disabled={!IS_READY}
                  className={`group w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${ch.color} hover:shadow-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${ch.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                      Step {idx + 1}
                    </span>
                    <p className="text-sm font-bold text-zinc-900">{ch.label}</p>
                    {IS_READY && (
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Jump to {Math.floor(ch.seconds / 60)}:{String(ch.seconds % 60).padStart(2, '0')}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Video player */}
          <div className="lg:col-span-8">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_16px_48px_-8px_rgba(0,0,0,0.12)] border border-slate-200/80 bg-slate-950 aspect-video">
              {IS_READY ? (
                <>
                  <video
                    ref={videoRef}
                    src={HOW_IT_WORKS_VIDEO_URL}
                    poster={HOW_IT_WORKS_POSTER_URL}
                    className="w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                    onEnded={() => setPlaying(false)}
                  />
                  <button
                    onClick={togglePlay}
                    aria-label={playing ? 'Pause' : 'Play'}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                      playing ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl shadow-orange-500/30 hover:scale-110 transition-transform">
                      {playing ? (
                        <Pause size={24} className="text-white" fill="white" />
                      ) : (
                        <Play size={24} className="text-white ml-1" fill="white" />
                      )}
                    </div>
                  </button>
                </>
              ) : (
                /* ── PLACEHOLDER ── */
                <div className="relative flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <img
                    src={HOW_IT_WORKS_POSTER_URL}
                    alt="How Itnavideo works"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30">
                      <Play size={24} className="text-orange-500 ml-1" />
                    </div>
                    <p className="text-sm font-bold text-white">How-it-works video coming soon</p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Record a 2-minute walkthrough, upload to Cloudinary, then set{' '}
                      <code className="text-orange-400 font-mono">HOW_IT_WORKS_VIDEO_URL</code>{' '}
                      in <code className="text-orange-400 font-mono">HowItWorksVideo.tsx</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
