'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  FileAudio,
  ImagePlus,
  MonitorPlay,
  Play,
  Sparkles,
  Upload,
  Video,
  WandSparkles,
} from 'lucide-react';
import Link from 'next/link';

const draftHighlights = [
  { label: 'Faceless videos', detail: 'Audio required, visuals optional', icon: FileAudio },
  { label: 'Face camera edits', detail: 'Upload one video and let AI polish it', icon: Camera },
  { label: 'Ready to review', detail: 'Built for Reels, TikTok, and Shorts', icon: WandSparkles },
];

const optionalAssets = [
  { label: 'Photos', icon: ImagePlus },
  { label: 'Videos', icon: Video },
  { label: 'Tutorials', icon: BookOpen },
  { label: 'Screen clips', icon: MonitorPlay },
];

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
            AI Shorts maker for faceless and face-camera videos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-white md:text-7xl"
          >
            Upload audio or camera footage.
            <span className="brand-text-gradient block">Get a ready-to-post short.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl"
          >
            Make faceless videos from a required voiceover, or upload a face-camera clip and let Itnavideo cut,
            polish, caption, style, and export the final short.
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
              Create faceless video
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-6 py-4 text-base font-black text-cyan-100 transition hover:bg-cyan-300/15"
            >
              <Camera size={18} />
              Edit face camera video
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
              title="Faceless videos"
              body="Upload voiceover audio. Add images or clips only if you want."
              tone="emerald"
            />
            <WorkflowMiniCard
              icon={<Camera size={20} />}
              title="Face camera videos"
              body="Upload one talking-head clip for automatic Shorts editing."
              tone="cyan"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-9 grid max-w-2xl grid-cols-1 gap-3 text-sm text-zinc-400 sm:grid-cols-3"
          >
            {['Faceless audio workflow', 'Face camera upload workflow', '1080p Shorts exports'].map((item) => (
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
          className="relative"
        >
          <div className="rounded-lg border border-white/10 bg-zinc-950/90 p-3 shadow-2xl shadow-emerald-950/20">
            <div className="mb-3 rounded-lg border border-dashed border-brand-mint/35 bg-brand-mint/[0.055] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-mint text-black">
                    <FileAudio size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-mint">Required</p>
                    <p className="text-lg font-black text-white">Choose your creation mode</p>
                    <p className="text-xs text-zinc-400">Faceless audio or face-camera video</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-4 py-3 text-sm font-black text-black transition hover:bg-white"
                >
                  <Upload size={16} />
                  Start
                </button>
              </div>
            </div>

            <div className="mb-3 rounded-lg border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">Faceless video</p>
                  <p className="text-xs text-zinc-500">Audio is mandatory. Screenshots, images, and clips are optional.</p>
                </div>
                <span className="rounded-md bg-white/8 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                  Voice-first
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {optionalAssets.map((asset) => {
                  const Icon = asset.icon;

                  return (
                    <button
                      key={asset.label}
                      type="button"
                      className="flex items-center gap-2 rounded-md border border-white/8 bg-black/20 px-3 py-3 text-left text-sm font-bold text-zinc-300 transition hover:border-brand-mint/30 hover:text-white"
                    >
                      <Icon size={16} className="text-brand-mint" />
                      <span>{asset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[0.74fr_1fr]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                <div className="absolute inset-0 bg-[linear-gradient(160deg,#111827_0%,#050506_48%,#0f766e_130%)]" />
                <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                  <span className="rounded-md bg-black/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Shorts
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    <Play size={14} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute inset-x-5 top-24 space-y-3">
                  <div className="h-20 rounded-lg border border-white/10 bg-white/8 backdrop-blur" />
                  <div className="ml-8 h-24 rounded-lg border border-emerald-300/20 bg-emerald-300/12 backdrop-blur" />
                  <div className="mr-10 h-16 rounded-lg border border-cyan-300/20 bg-cyan-300/10 backdrop-blur" />
                </div>
                <div className="absolute inset-x-4 bottom-24 rounded-lg bg-black/72 p-3 text-center text-lg font-black leading-tight text-white">
                  Audio or camera footage becomes a finished short.
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-brand-mint" />
                  <div className="h-1 flex-1 rounded-full bg-white/25" />
                  <div className="h-1 flex-1 rounded-full bg-white/25" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/8 p-4">
                  <div className="flex items-start gap-3">
                    <Camera size={20} className="mt-0.5 text-cyan-200" />
                    <div>
                      <p className="font-bold text-white">Face camera video</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        Upload one talking-head clip. Itnavideo crops for Shorts, polishes audio, adds motion, and exports.
                      </p>
                    </div>
                  </div>
                </div>

                {draftHighlights.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-lg border border-white/8 bg-white/[0.035] p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/8 text-brand-mint">
                            <Icon size={19} />
                          </div>
                          <div>
                            <p className="font-bold text-white">{item.label}</p>
                            <p className="text-xs text-zinc-500">{item.detail}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-zinc-500">0{index + 1}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${76 + index * 8}%` }}
                          transition={{ delay: 0.6 + index * 0.18, duration: 0.7 }}
                          className="h-full rounded-full bg-brand-mint"
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="rounded-lg border border-amber-300/20 bg-amber-300/8 p-4">
                  <div className="flex items-start gap-3">
                    <Check size={20} className="mt-0.5 text-amber-200" />
                    <div>
                      <p className="font-bold text-white">Platform-ready output</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        Create vertical videos made for social feeds without opening a complex editor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

