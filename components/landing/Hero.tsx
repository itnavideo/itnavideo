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
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070B14] px-4 pb-14 pt-8 text-white sm:px-6 sm:pb-20 sm:pt-12">
      {/* Calm Architectural Box Grid (Invideo / Linear Style) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:54px_54px]"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 70% at 50% 30%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 70% at 50% 30%, black 40%, transparent 95%)',
        }}
      />

      {/* Subtle Warm Studio Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 h-[400px] w-[800px] max-w-full rounded-full bg-gradient-to-tr from-[#FF6D00]/15 via-[#FF8F00]/10 to-transparent blur-[160px]" />
      <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-[#FF6D00]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-[#FFA726]/8 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.03em] text-white leading-[1.08] max-w-5xl mx-auto font-sans"
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
          className="mx-auto mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-300 sm:text-lg font-sans tracking-tight antialiased"
        >
          Turn scripts, voiceovers, images, and long videos into <span className="font-semibold text-white">viral 1080p Full HD Shorts, Reels, & YouTube explainers</span> in seconds. Powered by <span className="font-semibold text-[#FF8F00]">11 purpose-built AI studios</span>.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-7 flex items-center justify-center"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-8 py-3.5 text-base font-black text-black shadow-xl shadow-[#FF6D00]/25 transition duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
          >
            <span>Start Generating Free</span>
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Trust Badges in Refined Glass Capsule */}
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
            <ShieldCheck size={15} className="text-[#FF8F00]" /> No credit card required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap size={15} className="text-[#FF8F00]" /> Instant 1080p Cloud Export
          </span>
        </motion.div>

        {/* Ultra-Premium Studio Showcase Glass Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.24, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 mx-auto max-w-5xl"
        >
          {/* Multi-layered Studio Backglow */}
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[44px] bg-gradient-to-r from-[#FF6D00]/20 via-[#FF8F00]/12 to-[#FFA726]/10 blur-3xl opacity-75" />
          <div className="pointer-events-none absolute -inset-x-10 -bottom-8 h-32 -z-10 bg-gradient-to-t from-[#FF6D00]/15 to-transparent blur-2xl" />

          {/* High-End Frosted Glass Frame with Ambient Shadow */}
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
