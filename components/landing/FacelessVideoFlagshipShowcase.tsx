'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Play,
} from 'lucide-react';

export default function FacelessVideoFlagshipShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="faceless-video-flagship" className="relative w-full overflow-hidden bg-slate-50/80 pt-8 pb-16 sm:pt-10 sm:pb-16 text-slate-900 border-b border-slate-200/80">
      {/* Ambient Radial Lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[900px] max-w-full -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(255,87,34,0.065), transparent 72%)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>16:9 Cinema &amp; YouTube Explainer Studio</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            16:9 Faceless &amp; YouTube AI
          </h2>

          <p className="mt-3 text-lg font-bold bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent sm:text-2xl">
            More Than AI — Your Personal Editor.
          </p>

          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            One of our 10+ dedicated studios: turn any voiceover audio, podcast clip, or script into a complete 1080p Full HD 16:9 widescreen video with automated cinematic B-roll, subtitles, sound effects, and transitions.
          </p>
        </div>

        {/* Flagship 16:9 Video Showcase Player */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group">
            {isPlaying ? (
              <iframe
                src="https://www.youtube.com/embed/wg95A8eg7_c?autoplay=1&rel=0&modestbranding=1"
                title="Itnavideo Faceless Video AI"
                className="w-full h-full border-0 rounded-2xl sm:rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div 
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl"
              >
                {/* YouTube MaxRes Poster Image */}
                <img
                  src="https://i.ytimg.com/vi/wg95A8eg7_c/maxresdefault.jpg"
                  alt="Faceless Video AI - Real YouTube Output by Itnavideo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Subtle scrim for play button contrast */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Clean Centered Play Button Only */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-orange-500/30 animate-ping" />
                    <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-2xl shadow-orange-500/60 group-hover:scale-110 active:scale-95 transition-all duration-200">
                      <Play size={28} className="fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Key Faceless Video Capabilities Cards - Strictly 16:9 */}
        <div className="mt-4 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
          <div className="group relative rounded-2xl border-2 border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-lg hover:border-[#FF5722] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent group-hover:via-[#FF5722] transition-all duration-300" />
            <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">📚 Book Summaries</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Chapter-by-chapter visuals</p>
          </div>
          <div className="group relative rounded-2xl border-2 border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-lg hover:border-[#FF5722] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent group-hover:via-[#FF5722] transition-all duration-300" />
            <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">📺 YouTube Explainers</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">16:9 Widescreen 1080p</p>
          </div>
          <div className="group relative rounded-2xl border-2 border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-lg hover:border-[#FF5722] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent group-hover:via-[#FF5722] transition-all duration-300" />
            <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">🎙️ Voiceover Sync</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Automatic B-roll &amp; audio</p>
          </div>
          <div className="group relative rounded-2xl border-2 border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-lg hover:border-[#FF5722] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent group-hover:via-[#FF5722] transition-all duration-300" />
            <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">⏱️ Up to 5 Minutes</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Widescreen YouTube videos</p>
          </div>
        </div>

        {/* Central Secondary CTA Button - Distinct from Hero Primary */}
        <div className="mt-7 flex justify-center">
          <Link
            href="/dashboard/faceless-video"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white px-8 py-3.5 text-sm sm:text-base font-bold shadow-md hover:shadow-xl border border-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Sparkles size={18} className="text-[#FF5722]" />
            <span>Open 16:9 Studio</span>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-white transition group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
