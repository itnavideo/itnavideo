'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070B14] px-4 pb-12 pt-8 text-white sm:px-6 sm:pb-20 sm:pt-12">
      {/* Calm Architectural Box Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:54px_54px]"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 30%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 30%, black 40%, transparent 95%)',
        }}
      />

      {/* Standardized Pure Purple Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 h-[350px] w-[700px] max-w-full rounded-full bg-purple-600/15 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">

        {/* Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300"
        >
          <Sparkles size={14} className="text-purple-400" />
          <span>More Than AI — Your Personal Editor</span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] text-white leading-[1.12] sm:leading-[1.08] max-w-4xl mx-auto font-sans"
        >
          Free{' '}
          <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent">
            AI Video Generator
          </span>
          <br className="hidden sm:block" />
          <span className="text-white sm:ml-2">For Creators &amp; Brands</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mx-auto mt-3.5 max-w-xl text-sm font-normal leading-relaxed text-zinc-300 sm:text-base font-sans tracking-tight antialiased"
        >
          Turn scripts and voiceovers into ready-to-publish <span className="font-bold text-white">16:9 YouTube videos</span> &amp; <span className="font-bold text-white">9:16 Shorts</span> with auto B-roll, captions, and visuals — <span className="font-semibold text-purple-300">no camera required</span>.
        </motion.p>

        {/* Streamlined Primary Action (Standardized Purple Button) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-7 flex items-center justify-center"
        >
          <Link
            href="/dashboard/faceless-video"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-purple-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
          >
            <Sparkles size={18} className="text-white" />
            <span>Create Faceless Video Free</span>
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-semibold text-zinc-300 backdrop-blur-md"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" /> 3 free videos on signup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-purple-400" /> No credit card required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap size={15} className="text-purple-400" /> Instant 1080p Cloud Export
          </span>
        </motion.div>

        {/* Studio Showcase Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.24, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 mx-auto max-w-5xl"
        >
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[44px] bg-purple-600/15 blur-2xl opacity-75" />

          <div className="relative rounded-[24px] sm:rounded-[36px] p-1.5 sm:p-2 bg-gradient-to-b from-white/20 via-white/[0.05] to-transparent shadow-[0_20px_70px_-10px_rgba(0,0,0,0.95)] ring-1 ring-white/10 backdrop-blur-2xl">
            <div className="overflow-hidden rounded-[20px] sm:rounded-[30px] border border-white/10 bg-[#070B14]">
              <img
                src="/visuals/homepage/creative_studio_content_flow.png"
                alt="Itnavideo Creative Studio Content Flow"
                className="w-full h-auto object-cover object-top max-h-[640px] transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
