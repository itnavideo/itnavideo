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
            Long Videos — New Category
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black leading-tight text-white sm:text-5xl"
          >
            Your full video.{' '}
            <span className="bg-[linear-gradient(135deg,#34D399_0%,#A78BFA_100%)] bg-clip-text text-transparent">
              Professional captions.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Upload your 16:9 YouTube video, podcast, or lecture. We keep the original video and audio intact — just add clean, timed captions. Up to 10 minutes.
          </motion.p>
        </div>

        {/* Hero visual: laptop frame with preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-4xl"
        >
          <div className="rounded-[20px] border-[6px] border-slate-900 bg-background p-1 shadow-[0_30px_80px_rgba(6,182,212,0.12),0_8px_24px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-video overflow-hidden rounded-[12px] bg-muted">
              <Image
                src="/visuals/previews/long-form-captioned-video-new.png"
                alt="Long-form captioned video 16:9 preview showing clean readable captions on a landscape video"
                fill
                sizes="(min-width: 1024px) 900px, 90vw"
                className="object-cover"
                priority
              />
              {/* Caption mockup overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-lg bg-muted/85 px-6 py-3 text-center backdrop-blur-sm">
                <p className="text-sm font-bold text-white sm:text-base">Professional captions for your full video</p>
              </div>
              {/* Camera dot */}
              <span className="absolute left-1/2 top-2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-slate-700" />
            </div>
          </div>
          {/* Laptop base */}
          <div className="relative mx-auto h-3 w-2/3 rounded-b-xl border-x border-b border-slate-900 bg-muted shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
            <span className="absolute left-1/2 top-0 h-px w-1/4 -translate-x-1/2 bg-emerald-200/20" />
          </div>
        </motion.div>

        {/* Feature grid */}
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Clock3, title: 'Up to 10 minutes', desc: 'Full podcast episodes, interviews, lectures — not trimmed to 60 seconds.' },
            { icon: Volume2, title: 'Original audio preserved', desc: 'No replacement music, SFX, or AI narration. Your voice stays primary.' },
            { icon: Captions, title: 'Speech-synced captions', desc: 'Groq Whisper transcribes word-by-word. English and Roman Hinglish.' },
            { icon: MonitorPlay, title: '1920×1080 landscape', desc: 'Your 16:9 video stays in its native resolution. No cropping or letterboxing.' },
            { icon: Shield, title: 'Private & temporary', desc: 'Uploads auto-delete after 48 hours. We never store or share your content.' },
            { icon: Film, title: '6 caption styles', desc: 'Studio Clean, Cinematic, Marker Highlight, Midnight, Glass Blur, Metallic Gradient.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-white/8 bg-white/[0.025] p-5 transition hover:border-emerald-400/20"
            >
              <feature.icon size={22} className="mb-3 text-primary" />
              <p className="text-sm font-black text-white">{feature.title}</p>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-14 max-w-3xl rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.04] p-6 text-center sm:p-8"
        >
          <h3 className="text-xl font-black text-white sm:text-2xl">Duration-based credits</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            1 credit per started minute through 5 minutes, then 0.8 credits per additional minute. A 10-minute video costs just 9 credits.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {['1 min = 1', '5 min = 5', '6 min = 5.8', '10 min = 9'].map((ex) => (
              <span key={ex} className="rounded-full border border-emerald-400/20 bg-emerald-500/[0.08] px-4 py-1.5 text-xs font-bold text-emerald-200">{ex} credits</span>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard?videoType=long-form-captioned-video"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.1)] transition hover:-translate-y-[1px] hover:bg-zinc-100"
            >
              Create Long Video Captions
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/long-form-captioned-video"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-bold text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              Learn more
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          {['No editing skills needed', 'Failed renders release credits', 'Original video never altered', 'Works with any 16:9 video'].map((t) => (
            <span key={t} className="flex items-center gap-1.5"><Check size={11} className="text-primary/70" />{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

