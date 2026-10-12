'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Tv,
  Smartphone,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function FacelessVideoFlagshipShowcase() {
  return (
    <section id="faceless-video-flagship" className="relative w-full overflow-hidden bg-[#070B14] py-14 sm:py-20 text-white border-b border-white/10">
      {/* Standardized Ambient Lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] max-w-full rounded-full bg-purple-600/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Sparkles size={14} className="text-purple-400" />
            <span>Primary Focus • Flagship Feature</span>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
            Faceless Video AI Generator
          </h2>

          <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-purple-300 sm:text-sm">
            Automated Video Production — No Camera Needed
          </p>

          <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto">
            Turn audio, scripts, or images into ready-to-publish 16:9 YouTube videos and 9:16 Reels with automated B-roll visuals, voiceovers, and subtitles.
          </p>
        </div>

        {/* Two Options for Faceless Video */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 items-stretch max-w-5xl mx-auto">

          {/* Option 1: 16:9 Widescreen */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col justify-between rounded-[28px] border border-purple-500/40 bg-[#0E1526] p-6 sm:p-8 shadow-xl hover:shadow-purple-500/20"
          >
            <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
              <Zap size={13} />
              <span>Primary • 16:9 YouTube Widescreen</span>
            </div>

            <div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                    <Tv size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">Faceless Video — 16:9</h3>
                    <p className="text-xs font-semibold text-purple-300">Widescreen Long-Form (YouTube)</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                Built for YouTubers &amp; creators. Turns voiceover audio &amp; scripts into 1080p Full HD widescreen videos with AI visual matching and stock B-roll.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Powers Multiple Use Cases:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-200">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> Book Summaries</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> YouTube Explainers</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> Voiceover Stories</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> Image Stories</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <Link
                href="/dashboard/faceless-video"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-600/20 transition active:scale-95"
              >
                <span>Create 16:9 Widescreen Video</span>
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Option 2: 9:16 Vertical */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col justify-between rounded-[28px] border border-white/10 bg-[#0E1526] p-6 sm:p-8 hover:border-purple-500/40 transition shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">Faceless Video — 9:16</h3>
                    <p className="text-xs font-semibold text-purple-300">Vertical Shorts &amp; Reels</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                Built for TikTok, Instagram Reels &amp; YouTube Shorts. Turns scripts and voiceovers into fast-paced 1080p vertical shorts with word-by-word captions.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Short-Form Format Highlights:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-200">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> 9:16 1080p Full HD</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> Word Highlights</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> Rapid B-Roll Cuts</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-purple-400" /> Auto Voiceover Sync</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <Link
                href="/dashboard/faceless-video?ratio=9:16"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-[#151E30] px-6 py-3.5 text-sm font-bold text-zinc-200 hover:bg-[#1C2840] hover:text-white transition active:scale-95"
              >
                <span>Create 9:16 Vertical Short</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
