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
    title: '23+ caption styles',
    description: 'Karaoke, neon pulse, minimal fade, glass blur, metallic gradient — pick the style that fits your brand.',
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
    <section id="features" className="relative overflow-hidden px-6 py-24 sm:py-32 bg-background border-t border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0px,rgba(245,158,11,0.02),transparent_100%)]" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-20 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">What you get</p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl font-sans"
            >
              Everything your reels need, <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">nothing they don&apos;t.</span>
            </motion.h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Upload your video or audio. Pick a video type. Get a polished, ready-to-post reel — no timeline, no manual cuts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm backdrop-blur-md transition duration-300 hover:border-amber-500/20 hover:bg-accent dark:border-border dark:bg-background/20 dark:hover:bg-muted/40 group"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:border-orange-500/20 transition duration-300">
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-bold text-card-foreground transition">{feature.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

