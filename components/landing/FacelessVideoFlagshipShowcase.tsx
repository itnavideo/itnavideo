'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Play,
  Film,
  Subtitles,
} from 'lucide-react';

export default function FacelessVideoFlagshipShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="faceless-video-flagship" className="relative w-full overflow-hidden bg-slate-50/80 pt-8 pb-16 sm:pt-10 sm:pb-16 text-slate-900 border-b border-slate-200/80">
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-[500px] w-[900px] max-w-full rounded-full bg-orange-500/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>Flagship 16:9 Video Engine</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Faceless Video AI
          </h2>

          <p className="mt-3 text-lg font-bold bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent sm:text-2xl">
            More Than AI — Your Personal Editor.
          </p>

          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Turn any voiceover audio, podcast clip, or script into a complete 1080p Full HD 16:9 widescreen video with automated cinematic B-roll, subtitles, sound effects, and transitions.
          </p>
        </div>

        {/* Big Flagship 16:9 YouTube Showcase Player Mockup / Laptop Frame */}
        <div className="mt-8 sm:mt-10 max-w-5xl mx-auto">
          <div className="relative rounded-[28px] sm:rounded-[36px] p-2.5 sm:p-3.5 bg-[#0C111D] border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            
            {/* Top Studio Bar */}
            <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-red-500/90 shadow-xs" />
                <span className="flex h-3 w-3 rounded-full bg-amber-500/90 shadow-xs" />
                <span className="flex h-3 w-3 rounded-full bg-emerald-500/90 shadow-xs" />
                <span className="ml-2 font-mono text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  16:9 Widescreen • 1080p 30 FPS • Official YouTube Long-Form Demo
                </span>
              </div>
              <span className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs ${
                isPlaying 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-gradient-to-r from-red-600 to-orange-600'
              }`}>
                {isPlaying ? '● PLAYING OFFICIAL DEMO' : 'CLICK TO WATCH REAL VIDEO'}
              </span>
            </div>

            {/* Main Video Visual Preview Frame (Aspect 16:9) */}
            <div 
              className="relative aspect-video w-full overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-[#070B14] group"
            >
              {isPlaying ? (
                <iframe
                  src="https://www.youtube.com/embed/wg95A8eg7_c?autoplay=1&rel=0&modestbranding=1"
                  title="He Wanted to Become a YouTuber… But Had No Time to Edit | Itnavideo Faceless Video AI"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div 
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full cursor-pointer overflow-hidden"
                >
                  {/* YouTube MaxRes Poster Image */}
                  <img
                    src="https://i.ytimg.com/vi/wg95A8eg7_c/maxresdefault.jpg"
                    alt="Faceless Video AI - Real YouTube Output by Itnavideo"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  {/* High-Contrast Gradient Backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 transition-opacity group-hover:via-black/15" />

                  {/* Top-Left YouTube Quality Tag */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/10">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Real Video Output • YouTube 1080p</span>
                  </div>

                  {/* Play Overlay Button with Pulsing Beacon Ring */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-orange-500/30 animate-ping" />
                      <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-2xl shadow-orange-500/60 group-hover:scale-110 active:scale-95 transition-all duration-200">
                        <Play size={28} className="fill-white translate-x-0.5" />
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-black tracking-wide text-white drop-shadow-md bg-black/60 px-3.5 py-1 rounded-full border border-white/10">
                      Click to Play Real Video Demo
                    </span>
                  </div>

                  {/* Floating Features Badge Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 hidden sm:flex items-center justify-between rounded-2xl bg-black/85 p-3.5 backdrop-blur-md border border-white/10 text-white">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-orange-400">
                        <Film size={14} /> Auto B-Roll Matching
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Subtitles size={14} /> Kinetic Subtitles
                      </span>
                      <a
                        href="https://youtu.be/wg95A8eg7_c"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        <span>Watch on YouTube ↗</span>
                      </a>
                    </div>
                    <Link
                      href="/dashboard/faceless-video"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-4 py-2 text-xs font-black text-white hover:brightness-110 shadow-md transition"
                    >
                      <span>Launch Faceless Studio</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Key Faceless Video Capabilities Cards - Strictly 16:9 */}
        <div className="mt-4 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-orange-500/40 transition-all duration-300">
            <p className="text-xs font-black text-slate-900">📚 Book Summaries</p>
            <p className="text-[11px] text-slate-500 mt-1">Chapter-by-chapter visuals</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-orange-500/40 transition-all duration-300">
            <p className="text-xs font-black text-slate-900">📺 YouTube Explainers</p>
            <p className="text-[11px] text-slate-500 mt-1">16:9 Widescreen 1080p</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-orange-500/40 transition-all duration-300">
            <p className="text-xs font-black text-slate-900">🎙️ Voiceover Sync</p>
            <p className="text-[11px] text-slate-500 mt-1">Automatic B-roll &amp; audio</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] hover:border-orange-500/40 transition-all duration-300">
            <p className="text-xs font-black text-slate-900">⏱️ Up to 10 Minutes</p>
            <p className="text-[11px] text-slate-500 mt-1">Long-form YouTube videos</p>
          </div>
        </div>

        {/* Central CTA Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/faceless-video"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
          >
            <Sparkles size={18} className="text-white" />
            <span>Create Faceless Video AI</span>
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
