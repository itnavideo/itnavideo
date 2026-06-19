'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Film, Layers3, Play, Sparkles, Star, Users, Video, Zap , Captions} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const templates = [
  {
    image: '/preview/Auto Caption Reel.png',
    label: 'Caption only',
    title: 'Auto Caption Reel',
    description: 'Best for existing reels that need subtitles',
    icon: Captions,
    href: '/templates/auto-caption-reel',
    gradient: 'from-brand-mint to-emerald-500',
    glow: 'rgba(94,234,212,0.18)',
  },
  {
    image: '/preview/Video Simple Explainer.png',
    label: 'Most popular',
    title: 'Video Simple Explainer',
    description: 'Best for teaching & talking-head clips',
    icon: Video,
    href: '/templates/video-simple-explainer',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.15)',
  },
  {
    image: '/preview/Compare Explainer.png',
    label: 'Comparison',
    title: 'Compare Explainer',
    description: 'Best for vs / difference videos',
    icon: Layers3,
    href: '/templates/compare-explainer',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    image: '/preview/Cinematic Collage (Image Story).png',
    label: 'Cinematic',
    title: 'Cinematic Collage',
    description: 'Best for story-driven narration reels',
    icon: Film,
    href: '/templates/cinematic-collage',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    image: '/preview/Auto Draw Explainer.png',
    label: 'Whiteboard',
    title: 'Auto Draw Explainer',
    description: 'Best for tips, steps & educational content',
    icon: Film,
    href: '/templates/auto-draw-explainer',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    image: '/preview/Long Video Promo.png',
    label: 'Promo',
    title: 'Long Video Promo',
    description: 'Promote your YouTube videos with short reels',
    icon: Film,
    href: '/templates/long-video-promo',
    gradient: 'from-emerald-400 to-green-600',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    image: '/preview/Voice Synced Notes.png',
    label: 'Study Notes',
    title: 'Voice Synced Notes',
    description: 'Best for educational & revision reels',
    icon: Film,
    href: '/templates/voice-synced-notes',
    gradient: 'from-yellow-500 to-amber-600',
    glow: 'rgba(245,158,11,0.15)',
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#030304] px-4 pt-28 sm:px-6 md:pt-36">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Central glow */}
        <div className="absolute left-1/2 top-0 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_65%)]" />
        {/* Side accents */}
        <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_60%)]" />
        <div className="absolute -right-40 top-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.04)_0%,transparent_60%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_40%,transparent_100%)]" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#030304]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl pb-24 md:pb-32">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 sm:gap-6"
        >
          <span className="flex items-center gap-1.5"><Users size={12} className="text-brand-mint" />Built for creators</span>
          <span className="hidden h-3 w-px bg-zinc-800 sm:block" />
          <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-400" />2–3 min renders</span>
          <span className="hidden h-3 w-px bg-zinc-800 sm:block" />
          <span className="flex items-center gap-1.5"><Star size={12} className="text-cyan-400" />No editing skills</span>
        </motion.div>

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-mint/20 bg-brand-mint/[0.06] px-5 py-2.5 text-xs font-bold text-brand-mint"
          >
            <Sparkles size={13} />
            7 Templates Live — One payment, all templates
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-[2.6rem] font-black leading-[1.02] tracking-tight text-white sm:text-6xl md:text-[5.2rem]"
          >
            Turn Video, Audio or Images<br />
            <span className="bg-gradient-to-r from-brand-mint via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              into Ready-to-Post Reels
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            Choose a template, upload your content, and get a 9:16 reel with captions, visuals, and clean layouts in minutes. One payment unlocks all templates.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-brand-mint px-8 py-4.5 text-[15px] font-black text-black shadow-xl shadow-brand-mint/15 transition hover:bg-white hover:shadow-white/15"
            >
              <Play size={17} className="transition group-hover:scale-110" />
              Create My Reel
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700/80 bg-zinc-900/40 px-7 py-4.5 text-sm font-black text-zinc-300 backdrop-blur transition hover:border-zinc-500 hover:text-white"
            >
              View Pricing
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-7 flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-600"
          >
            {['Private uploads', 'No watermark', 'MP4 download', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><Check size={12} className="text-brand-mint/60" />{t}</span>
            ))}
          </motion.div>
        </div>

        {/* ─── Template Cards ─── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.65 }}
          className="mx-auto mt-20 grid max-w-7xl gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          id="templates"
        >
          {templates.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.title}
                href={t.href}
                className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur transition duration-300 hover:border-zinc-600 hover:shadow-2xl"
                style={{ boxShadow: `0 40px 80px -20px ${t.glow}` }}
              >
                {/* Hover gradient overlay */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 transition duration-500 group-hover:opacity-[0.06]`} />

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden lg:aspect-[2/3]">
                  <Image
                    src={t.image}
                    alt={`${t.title} template preview`}
                    fill
                    sizes="(min-width: 768px) 340px, 100vw"
                    className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                    priority
                  />
                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />

                  {/* Badge */}
                  <span className={`absolute left-4 top-4 rounded-full bg-gradient-to-r ${t.gradient} px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg`}>
                    {t.label}
                  </span>

                  {/* Icon */}
                  <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 text-white/70 ring-1 ring-white/10 backdrop-blur-md transition group-hover:bg-brand-mint/20 group-hover:text-brand-mint group-hover:ring-brand-mint/30">
                    <Icon size={20} />
                  </span>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-black text-white sm:text-2xl">{t.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{t.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/[0.05] px-5 py-3 text-xs font-black text-zinc-300 ring-1 ring-white/10 transition group-hover:bg-brand-mint group-hover:text-black group-hover:ring-brand-mint">
                    Use Template
                    <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-16 flex max-w-lg items-center justify-center divide-x divide-zinc-800 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 px-2 py-5 backdrop-blur"
        >
          {[
            { value: '$19', sub: 'Starter pack' },
            { value: '1 min', sub: 'Max reel length' },
            { value: '7', sub: 'Templates' },
            { value: '16', sub: 'Sticker characters' },
          ].map((s) => (
            <div key={s.sub} className="flex-1 text-center">
              <p className="text-2xl font-black text-white sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* What you get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <p className="text-center text-xs font-black uppercase tracking-widest text-zinc-600 mb-6">What you get with every reel</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: '🎬', text: 'HD 1080×1920 MP4' },
              { icon: '📝', text: 'AI subtitles synced' },
              { icon: '🌍', text: '13 languages' },
              { icon: '🎨', text: '15 caption styles' },
              { icon: '🔊', text: 'Original audio kept' },
              { icon: '📱', text: 'Reels / Shorts / TikTok' },
              { icon: '⚡', text: '2-4 min render' },
              { icon: '🔒', text: 'Private & secure' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-3 py-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-bold text-zinc-300">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

