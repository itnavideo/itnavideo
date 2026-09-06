'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Captions, Check, Clock3, Film, Laptop, MonitorPlay, Shield, Volume2 } from 'lucide-react';

export default function LongVideoShowcase() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28" style={{ background: 'linear-gradient(180deg, #022c22 0%, #064e3b 50%, #065f46 100%)' }}>
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_25%_25%,rgba(34,211,238,1)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-5 py-2.5 text-xs font-bold text-emerald-200"
          >
            <Laptop size={13} />
            Faceless Video — 16:9 YouTube
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black leading-tight text-white sm:text-5xl font-sans"
          >
            Turn Voiceovers Into Complete 16:9 Videos.{' '}
            <span className="bg-[linear-gradient(135deg,#38BDF8_0%,#F59E0B_50%,#10B981_100%)] bg-clip-text text-transparent">
              Faceless Video Creation.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
          >
            Upload your voiceover or audio up to 20 minutes. AI automatically pairs cinematic 16:9 visuals from our library, styles clean Canva backgrounds, and generates word-synced subtitles.
          </motion.p>
        </div>

        {/* Hero visual: laptop frame with preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-4xl"
        >
          <div className="rounded-[20px] border-[6px] border-slate-900 bg-background p-1 shadow-[0_30px_80px_rgba(56,189,248,0.15),0_8px_24px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-video overflow-hidden rounded-[12px] bg-slate-950">
              <Image
                src="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png"
                alt="Faceless Video 16:9 YouTube output preview"
                fill
                sizes="(min-width: 1024px) 900px, 90vw"
                className="object-cover"
                priority
              />
              {/* Overlay pill */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/75 px-6 py-2.5 text-center backdrop-blur-md">
                <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Faceless Video • 16:9 YouTube • Voiceover Only • Up to 20 Min
                </p>
              </div>
              {/* Camera dot */}
              <span className="absolute left-1/2 top-2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-slate-700" />
            </div>
          </div>
          {/* Laptop base */}
          <div className="relative mx-auto h-3 w-2/3 rounded-b-xl border-x border-b border-slate-900 bg-muted shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
            <span className="absolute left-1/2 top-0 h-px w-1/4 -translate-x-1/2 bg-amber-400/30" />
          </div>
        </motion.div>

        {/* Feature grid */}
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Clock3, title: 'Up to 20 Minutes', desc: 'Full YouTube documentaries, explainers, or stories — long-form voiceovers fully supported.' },
            { icon: Volume2, title: 'Voiceover Only', desc: 'Zero on-camera appearance required. Upload pure audio narration (.mp3, .wav, .m4a).' },
            { icon: Film, title: 'Curated AI Visuals', desc: 'AI automatically identifies semantic requirements and places matching 16:9 library assets.' },
            { icon: Laptop, title: 'Canva Color Swatches', desc: 'Clean Studio White (default), Warm Cream, Soft Slate, or Obsidian without artificial glare.' },
            { icon: MonitorPlay, title: '3-Font Hierarchy Suite', desc: 'Customizable Heading, Subheading, and Body typography (Montserrat, Jakarta Sans, Inter).' },
            { icon: Captions, title: 'Groq Whisper Captions', desc: 'Sub-second accurate word-synced subtitles in English and clean Roman Hinglish.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-amber-400/30 backdrop-blur-xs"
            >
              <feature.icon size={22} className="mb-3 text-amber-400" />
              <p className="text-sm font-black text-white">{feature.title}</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-14 max-w-3xl rounded-2xl border border-white/15 bg-white/[0.04] p-6 text-center sm:p-8 backdrop-blur-sm"
        >
          <h3 className="text-xl font-black text-white sm:text-2xl font-sans">Ready to create high-retention faceless videos?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Upload your audio voiceover and let Itnavideo generate a complete 16:9 YouTube video in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard?videoType=faceless-video"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-black text-white shadow-[0_8px_24px_rgba(245,158,11,0.25)] transition hover:-translate-y-[1px] hover:brightness-110"
            >
              Create Faceless Video
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 py-4 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/[0.1]"
            >
              Open Dashboard
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          {['No face or camera needed', 'Voiceover audio only', '16:9 YouTube Widescreen', 'Curated AI visual library', 'Canva color swatches'].map((t) => (
            <span key={t} className="flex items-center gap-1.5"><Check size={11} className="text-amber-400" />{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

