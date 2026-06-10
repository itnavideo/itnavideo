'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Captions, Check, Film, Mic2, ShieldCheck, Sparkles, UploadCloud, Video, Wand2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const proofPoints = ['Audio, video, image inputs', 'First video for ₹9', 'Private 9:16 MP4 output'];

const previewItems = [
  {
    image: '/visuals/template-video-explainer.png',
    label: 'Video template',
    title: 'Video Explainer',
    icon: Video,
  },
];

const workflowSteps = [
  {
    title: 'Upload source',
    body: 'Audio, video, or voiceover',
    icon: UploadCloud,
    accent: 'text-cyan-200',
  },
  {
    title: 'AI processing',
    body: 'Transcript, timing, subtitles, visuals',
    icon: Wand2,
    accent: 'text-brand-mint',
  },
  {
    title: 'Generated explainer',
    body: 'Top video, subtitles, and scene visuals',
    icon: Film,
    accent: 'text-amber-100',
  },
];

const inputTypes = [
  {label: 'Audio', icon: Mic2},
  {label: 'Video', icon: Video},
  {label: 'Subtitles', icon: Captions},
];

export default function Hero() {
  return (
    <section className="brand-surface relative overflow-hidden px-4 pt-24 sm:px-6 md:pt-32">
      <div className="absolute inset-0">
        <Image
          src="/visuals/site-scenes/creator-recording-reel.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.78)_42%,rgba(0,0,0,0.44)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050506]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl pb-12 md:pb-16">
        <div className="max-w-4xl pt-8 sm:pt-14 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex max-w-full items-center gap-2 rounded-lg border border-brand-mint/25 bg-brand-mint/10 px-3 py-2 text-xs font-bold text-brand-mint backdrop-blur-md sm:text-sm"
          >
            <Sparkles size={15} />
            <span className="truncate">AI reel maker for real uploads</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl text-4xl font-black leading-[1.03] tracking-normal text-white sm:text-5xl md:text-7xl"
          >
            Turn Audio or Video Into Explainer Reels
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-2xl text-base leading-7 text-zinc-200 sm:mt-7 sm:text-lg md:text-xl md:leading-8"
          >
            Generate polished Explainer Videos with top media, premium subtitles, and scene visuals automatically for Shorts, Reels, and mobile-first creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row"
          >
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 text-sm font-black text-black transition hover:bg-white"
            >
              Create First Reel
              <ArrowRight size={17} />
            </Link>
            <Link
              href="#template-proof"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-6 py-4 text-sm font-black text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/[0.1]"
            >
              Watch Demo Reels
              <Film size={17} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.36 }}
            className="mt-7 grid max-w-2xl gap-3 text-sm text-zinc-300 sm:mt-9 sm:grid-cols-3"
          >
            {proofPoints.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md">
                <Check size={16} className="shrink-0 text-brand-mint" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.55 }}
          className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch"
        >
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-lg border border-white/12 bg-black/45 p-4 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-mint">Live workflow</p>
                  <h2 className="mt-1 text-xl font-black leading-tight text-white">From source file to finished reel</h2>
                </div>
                <span className="rounded-md border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-xs font-black text-brand-mint">1 minute</span>
              </div>

              <div className="grid gap-3">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="relative rounded-md border border-white/10 bg-white/[0.045] p-4">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-black/35 ${step.accent}`}>
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-black text-white">{step.title}</p>
                          <p className="mt-1 text-xs font-bold leading-5 text-zinc-400">{step.body}</p>
                        </div>
                      </div>
                      {index < workflowSteps.length - 1 ? (
                        <div className="absolute -bottom-3 left-9 z-10 h-3 w-px bg-brand-mint/45" />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {inputTypes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span key={item.label} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-zinc-200">
                      <Icon size={14} className="text-brand-mint" />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {previewItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="overflow-hidden rounded-lg border border-white/12 bg-black/45 shadow-2xl shadow-black/35 backdrop-blur-xl">
                    <div className="relative aspect-[9/16] bg-zinc-950">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-mint">{item.label}</p>
                        <h2 className="mt-1 text-lg font-black leading-tight text-white">{item.title}</h2>
                      </div>
                      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-md bg-black/55 text-brand-mint backdrop-blur-md">
                        <Icon size={19} />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <article className="rounded-lg border border-amber-200/18 bg-black/45 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-200/12 text-amber-100">
                <ShieldCheck size={19} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-100">Launch promise</p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-white">Create your first reel for ₹9.</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-2 text-sm font-bold text-zinc-300">
              <span className="inline-flex items-center gap-2 rounded-md bg-black/25 px-3 py-2">
                <Mic2 size={14} className="text-brand-mint" />
                Upload audio, video, or voiceover
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-black/25 px-3 py-2">
                <ShieldCheck size={14} className="text-cyan-200" />
                Uploads stay private and temporary
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-black/25 px-3 py-2">
                <Film size={14} className="text-amber-100" />
                Download a Shorts/Reels-ready MP4
              </span>
            </div>
          </article>
        </motion.div>
      </div>
    </section>
  );
}
