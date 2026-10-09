'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070B14] px-4 pb-16 pt-20 text-white sm:px-6 sm:pb-28 sm:pt-28">
      {/* Crisp Box-Grid Background (Invideo Style) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:42px_42px]"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 35%, black 45%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 35%, black 45%, transparent 95%)',
        }}
      />

      {/* Subtle Warm Studio Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[450px] w-[850px] max-w-full rounded-full bg-gradient-to-tr from-[#FF6D00]/15 via-[#FF8F00]/10 to-transparent blur-[160px]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full bg-[#FF6D00]/10 blur-[150px]" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-[#FFA726]/8 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[78px] font-extrabold tracking-[-0.03em] text-white leading-[1.08] max-w-5xl mx-auto font-sans"
        >
          The Free{' '}
          <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
            AI Video Generator
          </span>
          <br />
          <span className="text-white">For Creators & Brands</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mx-auto mt-6 max-w-3xl text-base font-normal leading-relaxed text-zinc-300 sm:text-xl font-sans tracking-tight antialiased"
        >
          Turn scripts, voiceovers, images, and long videos into <span className="font-semibold text-white">viral 1080p Full HD Shorts, Reels, & YouTube explainers</span> in seconds. Powered by <span className="font-semibold text-[#FF8F00]">11 purpose-built AI studios</span>.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-9 flex items-center justify-center"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-8 py-4 text-base font-black text-black shadow-xl shadow-[#FF6D00]/25 transition duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
          >
            <span>Start Generating Free</span>
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-zinc-400"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" /> 3 free videos on signup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-[#FF8F00]" /> No credit card required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap size={15} className="text-[#FF8F00]" /> Instant 1080p Cloud Export
          </span>
        </motion.div>

        {/* Wide Studio Showcase Image Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.24, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12 mx-auto max-w-5xl"
        >
          {/* Warm Ambient Glow behind Studio Preview */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[380px] w-[92%] rounded-full bg-gradient-to-r from-[#FF6D00]/20 via-[#FF8F00]/15 to-[#FFA726]/10 blur-[120px]" />

          {/* Clean Borderless Image Container */}
          <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/visuals/homepage/creative_studio_content_flow.png"
              alt="Itnavideo Creative Studio Content Flow"
              className="w-full h-auto rounded-3xl object-cover object-top max-h-[650px]"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
