'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import {
  ArrowRight,
  Check,
  FileAudio,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

function WorkflowMiniCard({
  icon,
  title,
  body,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: 'emerald' | 'cyan';
}) {
  const toneClass = tone === 'emerald'
    ? 'border-brand-mint/25 bg-brand-mint/[0.07] text-brand-mint'
    : 'border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-200';

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black/35">
          {icon}
        </div>
        <div>
          <p className="font-black text-white">{title}</p>
          <p className="mt-1 text-sm leading-5 text-zinc-400">{body}</p>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="brand-surface relative min-h-[92vh] overflow-hidden px-6 pb-20 pt-32 md:pt-40">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.22),transparent_44%),radial-gradient(circle_at_82%_10%,rgba(99,102,241,0.16),transparent_34%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-semibold text-brand-mint"
          >
            <Sparkles size={15} />
            AI Shorts maker for audio-first MVP videos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-white md:text-7xl"
          >
            Upload voiceover audio.
            <span className="brand-text-gradient block">Get a ready-to-post short.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl"
          >
            Make typography-first Shorts from one required voiceover. Extra media uploads are paused while the MVP demo stays fast and stable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 text-base font-black text-black transition hover:bg-white"
            >
              Create audio video
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-6 py-4 text-base font-black text-zinc-300 transition hover:bg-white/[0.08]"
            >
              Media uploads paused
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-2"
          >
            <WorkflowMiniCard
              icon={<FileAudio size={20} />}
              title="Audio-only videos"
              body="Upload voiceover audio and generate a clean typography short."
              tone="emerald"
            />
            <WorkflowMiniCard
              icon={<Sparkles size={20} />}
              title="Stable MVP mode"
              body="Screenshots, images, clips, and camera uploads return after demo stabilization."
              tone="cyan"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-9 grid max-w-2xl grid-cols-1 gap-3 text-sm text-zinc-400 sm:grid-cols-3"
          >
            {['Audio-only workflow', 'Typography-first visuals', '720p Shorts exports'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check size={16} className="text-brand-mint" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.6 }}
          className="relative mx-auto w-full max-w-[520px] lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950/80 p-3 shadow-2xl shadow-emerald-950/20">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-black/40">
              <img
                src="/visuals/homepage-product-mockup.png"
                alt="Itnavideo AI video editor product mockup"
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                <span className="rounded-md border border-brand-mint/25 bg-black/55 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-mint backdrop-blur">
                  AI video engine
                </span>
                <span className="rounded-md bg-brand-mint px-3 py-2 text-xs font-black text-black">
                  720p
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/10 bg-black/62 p-4 backdrop-blur">
                <p className="text-sm font-black text-white">Upload, caption, render, export.</p>
                <p className="mt-1 text-xs leading-5 text-zinc-300">
                  One focused workflow for audio-first Shorts.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

