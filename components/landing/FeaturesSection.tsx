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
    title: 'Explainer-first flow',
    description: 'One focused template for audio/video explainers, tuned for quality and speed.',
    icon: Film,
  },
  {
    title: 'Real transcript timing',
    description: 'Speech-based templates use real audio/video transcript timing.',
    icon: Captions,
  },
  {
    title: 'Three-layer layout',
    description: 'Top media, premium subtitles, and scene visuals stay cleanly separated.',
    icon: Film,
  },
  {
    title: 'Consistent visual system',
    description: 'Safe zones, spacing, and motion stay consistent across reels.',
    icon: Palette,
  },
  {
    title: 'AI transitions',
    description: 'Scene changes are paced around the source content.',
    icon: Zap,
  },
  {
    title: 'Sound intelligence',
    description: 'Optional SFX and music cues support important moments.',
    icon: Music,
  },
  {
    title: 'Multi-language ready',
    description: 'English stays English; Hindi/Urdu becomes Roman Hinglish.',
    icon: Languages,
  },
  {
    title: 'Platform exports',
    description: 'Vertical MP4 output for Reels, TikTok, and Shorts.',
    icon: Smartphone,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden bg-black px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-amber-200">What you get</p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl"
            >
            The practical controls creators expect.
            </motion.h2>
          </div>
          <p className="text-lg leading-8 text-zinc-400">
            The homepage now keeps the feature list focused: Explainer Video, transcript timing, scene visuals, safe zones, motion, language, and export.
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
                className="rounded-lg border border-white/10 bg-zinc-950 p-6 transition hover:border-amber-200/25 hover:bg-zinc-900/70"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-amber-200/10 text-amber-100">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

