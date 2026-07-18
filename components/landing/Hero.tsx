'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Check, Play, Sparkles, Star, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1120] px-4 pb-16 pt-24 text-white sm:px-6 sm:pt-28 md:pb-20 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.16),rgba(6,182,212,0.05)_38%,rgba(15,23,42,0)_72%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 sm:gap-6"
        >
          <span className="flex items-center gap-1.5"><Users size={12} className="text-brand-mint" />Built for creators</span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span className="flex items-center gap-1.5"><Zap size={12} className="text-violet-300" />Preview before render</span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span className="flex items-center gap-1.5"><Star size={12} className="text-sky-300" />Focused video types</span>
        </motion.div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/[0.08] px-5 py-2.5 text-xs font-bold text-cyan-100 shadow-[0_14px_38px_rgba(6,182,212,0.1)]"
          >
            <Sparkles size={13} />
            Focused video types with clear credit costs before render.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-[2.3rem] font-black leading-[1.03] tracking-normal text-white sm:text-5xl md:text-[5.25rem]"
          >
            No editing skills?
            <span className="block bg-[linear-gradient(135deg,#BAE6FD_0%,#22D3EE_48%,#A78BFA_100%)] bg-clip-text text-transparent" style={{ textShadow: '0 0 80px rgba(34,211,238,0.26)' }}>
              NO problem.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
          >
            Turn your audio or video into a professional reel or long video automatically. Just upload and let AI do the work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
            className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-2 text-left sm:grid-cols-2"
          >
            {[
              'AI captions from your video or audio',
              'AI reel planning for explainers',
              'Preview before final render',
              '9:16 reels and 16:9 long-form captions',
            ].map((item) => (
              <span key={item} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-300">
                <BrainCircuit size={13} className="shrink-0 text-violet-300" />
                <span className="min-w-0">{item}</span>
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-xl px-9 py-4 text-base font-black text-white transition hover:-translate-y-[1px] active:translate-y-0 brand-btn-primary-dark"
            >
              <Play size={18} className="transition group-hover:scale-110" />
              Create My Free Video
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Trust strip — bold, unmissable */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24 }}
            className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/[0.1] px-6 py-3 text-sm font-black text-emerald-300"
          >
            <Check size={16} className="text-emerald-400" />
            Clear credit cost before every final render
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400"
          >
            {['No editing skills needed', 'English & Roman Hinglish captions', 'Paid exports: no watermark', '9:16 reels + 16:9 long videos'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><Check size={12} className="text-brand-mint/80" />{t}</span>
            ))}
          </motion.div>

          {/* Founder trust — prominent card with avatar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="mx-auto mt-10 max-w-xl rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.08] via-white/[0.03] to-transparent px-6 py-5 text-center shadow-[0_16px_48px_rgba(6,182,212,0.08)]"
          >
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/[0.12] text-lg">
              👨‍💻
            </div>
            <p className="text-sm leading-6 text-slate-200 italic">
              &ldquo;I built ItnaVideo because I was spending 3+ hours a week captioning and formatting my own videos. Now the repeatable work is handled for me.&rdquo;
            </p>
            <p className="mt-3 text-xs font-black text-slate-400">
              — Syed Rohi, Founder
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Built on AWS Lambda + Remotion
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
