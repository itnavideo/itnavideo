'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Captions,
  Film,
  Languages,
  Music,
  Palette,
  Smartphone,
  Zap,
} from 'lucide-react';

const features = [
  {
    title: 'Focused video types',
    description: 'Each type has its own upload flow, AI pipeline, and output style — no generic one-size-fits-all.',
    icon: Film,
  },
  {
    title: 'Word-level caption sync',
    description: 'Captions appear exactly when each word is spoken. Powered by Groq Whisper transcription.',
    icon: Captions,
  },
  {
    title: 'Preview before render',
    description: 'See your reel layout before spending a credit. Adjust style, timing, and position first.',
    icon: Film,
  },
  {
    title: '15+ caption styles',
    description: 'Bold karaoke, neon pulse, minimal fade, glass blur — pick the style that fits your brand.',
    icon: Palette,
  },
  {
    title: 'Under 3 minute renders',
    description: 'Upload to finished MP4 in minutes, not hours. No timeline editing required.',
    icon: Zap,
  },
  {
    title: 'Background music & SFX',
    description: 'Optional audio layers that match your content mood and pacing.',
    icon: Music,
  },
  {
    title: 'English & Hinglish',
    description: 'English stays English. Hindi/Hinglish audio becomes clean Roman captions — no Devanagari.',
    icon: Languages,
  },
  {
    title: 'Platform-ready export',
    description: '1080p vertical 9:16 MP4. Ready for Reels, TikTok, and YouTube Shorts.',
    icon: Smartphone,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-28" style={{ background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%), var(--bg-hero)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">What you get</p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl"
            >
            Everything your reels need, nothing they don&apos;t.
            </motion.h2>
          </div>
          <p className="text-lg leading-8 text-zinc-400">
            Upload your video or audio. Pick a video type. Get a polished, ready-to-post reel — no timeline, no manual cuts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="rounded-lg border border-white/10 bg-zinc-950 p-6 transition hover:border-amber-200/25 hover:bg-zinc-900/80"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-amber-200/10 text-amber-100">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
