'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const guides = [
  {
    title: 'Auto Caption Video',
    emoji: '🎙️',
    accent: '#22C55E',
    mascot: '/brand/mascot-screen.webp',
    steps: [
      { emoji: '📹', text: 'Upload your talking video' },
      { emoji: '🎨', text: 'Pick a caption style' },
      { emoji: '✨', text: 'Click Generate' },
    ],
    result: 'You get a captioned reel with word-level sync — ready to post.',
    href: '/dashboard?videoType=auto-caption-reel',
  },
  {
    title: 'Compare Explainer',
    emoji: '⚖️',
    accent: '#F59E0B',
    mascot: '/visuals/stickers/previews/shia-moulana-3d.png',
    steps: [
      { emoji: '🖼️', text: 'Upload Image A & Image B' },
      { emoji: '✍️', text: 'Write both titles' },
      { emoji: '🎙️', text: 'Upload your voiceover' },
      { emoji: '🧑‍🏫', text: 'Choose your character' },
    ],
    result: 'We create an animated comparison video with a presenter sticker.',
    href: '/dashboard?videoType=compare-explainer',
  },
  {
    title: 'Whiteboard Video',
    emoji: '📝',
    accent: '#10B981',
    mascot: '/brand/mascot-notebook.webp',
    steps: [
      { emoji: '🎙️', text: 'Upload audio or video with speech' },
      { emoji: '🤖', text: 'AI extracts key points' },
      { emoji: '✨', text: 'Points appear on whiteboard' },
    ],
    result: 'Professional whiteboard explainer with marker-style text.',
    href: '/dashboard?videoType=whiteboard-video',
  },
  {
    title: 'Long Video Promo',
    emoji: '🎬',
    accent: '#A3E635',
    mascot: '/brand/mascot-clipboard.webp',
    steps: [
      { emoji: '🖼️', text: 'Upload your YouTube thumbnail' },
      { emoji: '📝', text: 'Add the video title' },
      { emoji: '📹', text: 'Upload a 16:9 YouTube clip' },
    ],
    result: 'You get a professional YouTube Shorts promo in minutes.',
    href: '/dashboard?videoType=long-video-promo',
  },
];

export default function VideoTypeGuide() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8" style={{ background: '#0B1120' }}>
      {/* Subtle grid bg */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header with mascot */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto mb-5 h-24 w-24 sm:h-28 sm:w-28"
          >
            <Image
              src="/brand/mascot-notebook.webp"
              alt="ItnaVideo mascot"
              width={120}
              height={120}
              className="h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(96,165,250,0.2)]"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500"
          >
            How each video type works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-white sm:text-4xl"
          >
            Upload. Click. Done.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mt-3 max-w-md text-sm text-slate-400"
          >
            No tutorials needed. Each video type is a simple 3-step flow.
          </motion.p>
        </div>

        {/* Guide cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 p-5 sm:p-6 transition hover:border-white/15"
              style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
            >
              {/* Accent glow on hover */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: guide.accent }}
              />

              {/* Mascot image — positioned top-right */}
              <div className="pointer-events-none absolute -right-2 -top-1 h-36 w-36 opacity-30 sm:h-40 sm:w-40 sm:opacity-40 transition-opacity group-hover:opacity-60">
                <Image
                  src={guide.mascot}
                  alt=""
                  width={160}
                  height={160}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Title row */}
              <div className="relative mb-4 flex items-center gap-3">
                <span className="text-2xl">{guide.emoji}</span>
                <h3 className="text-lg font-black text-white">{guide.title}</h3>
              </div>

              {/* Steps — sticky note style */}
              <div className="relative mb-4 space-y-2.5 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
                {guide.steps.map((step, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <span className="text-base">{step.emoji}</span>
                    <span className="text-sm text-slate-300">{step.text}</span>
                  </div>
                ))}
              </div>

              {/* Result */}
              <p className="mb-4 flex items-start gap-2 text-xs leading-5 text-slate-400">
                <span className="mt-0.5 text-sm">🎉</span>
                <span>{guide.result}</span>
              </p>

              {/* CTA */}
              <Link
                href={guide.href}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5"
                style={{ background: guide.accent + '22', border: '1px solid ' + guide.accent + '44', color: guide.accent }}
              >
                <Play size={11} fill="currentColor" />
                Try it now
                <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          {['No editing skills needed', 'Uploads are private & temporary', '1 free credit on signup', '9:16 MP4 for Reels & Shorts'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
