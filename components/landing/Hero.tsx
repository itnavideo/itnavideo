'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Check, Gift, Play, Sparkles, Star, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const videoTypes = [
  {
    image: '/preview/Custom AI Reel.png',
    label: 'Most flexible',
    title: 'Custom AI Reel',
    href: '/custom-ai-reel',
    result: 'Prompt-led reel with your images, text, and logo',
    accent: '#60A5FA',
  },
  {
    image: '/preview/Dynamic Creator Reel.png',
    label: 'Creator edit',
    title: 'Dynamic Creator Reel',
    href: '/video-types/dynamic-creator-reel',
    result: 'Talking video with premium kinetic typography',
    accent: '#38BDF8',
  },
  {
    image: '/preview/Auto Caption Reel.png',
    label: 'Most used',
    title: 'Auto Caption Reel',
    href: '/video-types/auto-caption-reel',
    result: 'Clean word-level captions for creator reels',
    accent: '#22C55E',
  },
  {
    image: '/preview/Background Replace Video.png',
    label: 'Background',
    title: 'Creator Background Replace',
    href: '/video-types/creator-background-replace',
    result: 'Creator video placed over your uploaded background',
    accent: '#F97316',
  },
  {
    image: '/preview/Compare Explainer.png',
    label: 'VS explainer',
    title: 'Compare Explainer',
    href: '/video-types/compare-explainer',
    result: 'Left vs right comparison with a sticker presenter',
    accent: '#F59E0B',
  },
  {
    image: '/preview/Auto Draw Explainer.png',
    label: 'Whiteboard',
    title: 'Auto Draw Explainer',
    href: '/video-types/auto-draw-explainer',
    result: 'Voiceover turned into drawn explainer scenes',
    accent: '#06B6D4',
  },
  {
    image: '/preview/Long Video Promo.png',
    label: 'Promo',
    title: 'Long Video Promo',
    href: '/video-types/long-video-promo',
    result: 'Short vertical promo for long-form videos',
    accent: '#A3E635',
  },
];

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
          <span className="flex items-center gap-1.5"><Zap size={12} className="text-pink-300" />Preview before render</span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span className="flex items-center gap-1.5"><Star size={12} className="text-sky-300" />7 focused video types</span>
        </motion.div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-300/25 bg-pink-500/[0.09] px-5 py-2.5 text-xs font-bold text-pink-100 shadow-[0_14px_38px_rgba(255,61,154,0.13)]"
          >
            <Sparkles size={13} />
            1 Free AI Video Credit for every new signup
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-[2.3rem] font-black leading-[1.03] tracking-normal text-white sm:text-5xl md:text-[5.25rem]"
          >
            Create reels people can judge
            <span className="block bg-[linear-gradient(135deg,#60A5FA_0%,#22D3EE_52%,#FF3D9A_100%)] bg-clip-text text-transparent">
              by watching, not reading
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
          >
            Sign up and get 1 Free AI Video Credit. Create your first video free, no credit card needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mx-auto mt-6 inline-flex max-w-full items-center gap-2 rounded-lg border border-pink-300/30 bg-pink-500/[0.10] px-4 py-2.5 text-sm font-black text-pink-50 shadow-[0_12px_34px_rgba(255,61,154,0.14)]"
          >
            <Gift size={16} className="shrink-0 text-pink-300" />
            <span className="min-w-0">Your free credit is added after signup. Failed renders are not charged.</span>
          </motion.div>

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
              'Ready-to-post 9:16 MP4',
            ].map((item) => (
              <span key={item} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-300">
                <BrainCircuit size={13} className="shrink-0 text-pink-300" />
                <span className="min-w-0">{item}</span>
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-xl px-9 py-4 text-base font-black text-white transition hover:-translate-y-[1px] active:translate-y-0 brand-btn-primary-dark"
            >
              <Play size={18} className="transition group-hover:scale-110" />
              Create My Free Video
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/video-types"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-black text-slate-200 backdrop-blur transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
            >
              See Video Types
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400"
          >
            {['No editing skills needed', '1 free AI video credit', 'English and Hinglish captions', 'No watermark'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><Check size={12} className="text-brand-mint/80" />{t}</span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.62 }}
          className="mx-auto mt-16 max-w-6xl"
        >
          <div className="mb-6 flex flex-col gap-2 text-center sm:mb-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Actual video type output styles</p>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Seven formats, each built to look finished.</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {videoTypes.map((videoType, index) => (
              <Link
                key={videoType.title}
                href={videoType.href}
                className={`group relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20 ${
                  index === 0 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-black">
                  <Image
                    src={videoType.image}
                    alt={`${videoType.title} preview`}
                    fill
                    sizes="(min-width: 1024px) 210px, (min-width: 640px) 30vw, 50vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.035]"
                    priority={index < 2}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/88 via-black/35 to-transparent" />
                  <span
                    className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950"
                    style={{ backgroundColor: videoType.accent }}
                  >
                    {videoType.label}
                  </span>
                  <div className="absolute inset-x-3 bottom-3">
                    <p className="text-sm font-black text-white">{videoType.title}</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-300">{videoType.result}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-3 divide-x divide-white/10 rounded-lg border border-white/10 bg-white/[0.035] py-5 backdrop-blur"
        >
          {[
            { value: '6', sub: 'Production video types' },
            { value: '1', sub: 'Credit only on render' },
            { value: '9:16', sub: 'Ready-to-post MP4' },
          ].map((s) => (
            <div key={s.sub} className="text-center">
              <p className="text-2xl font-black text-brand-mint sm:text-3xl">{s.value}</p>
              <p className="mt-1 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
