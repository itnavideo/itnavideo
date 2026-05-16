'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AudioLines,
  Camera,
  Captions,
  Crop,
  Images,
  Languages,
  Music,
  Palette,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    title: 'Faceless video mode',
    description: 'Start with mandatory audio and add screenshots, images, or clips only when you need them.',
    icon: AudioLines,
  },
  {
    title: 'Face camera mode',
    description: 'Upload one talking-head clip for automatic crop, motion, audio polish, effects, and export.',
    icon: Camera,
  },
  {
    title: 'Dynamic captions',
    description: 'Large colorful word-pop subtitles with black borders, shadows, safe zones, and mobile readability.',
    icon: Captions,
  },
  {
    title: 'Python-assisted rendering',
    description: 'Backend Python tooling helps with jump cuts, zooms, captions, icon overlays, and FFmpeg planning.',
    icon: Crop,
  },
  {
    title: 'Built-in visual library',
    description: 'Use your uploads or let Itnavideo choose fitting backgrounds and graphics.',
    icon: Images,
  },
  {
    title: 'AI transitions',
    description: 'Scene changes selected to fit the story instead of random template effects.',
    icon: Palette,
  },
  {
    title: 'Sound intelligence',
    description: 'Swooshes, pops, music beds, and audio polish can follow timing, motion, and narration flow.',
    icon: Music,
  },
  {
    title: 'Multi-language ready',
    description: 'A foundation for creators who publish across regional and global audiences.',
    icon: Languages,
  },
  {
    title: 'Platform exports',
    description: 'Vertical MP4 output tuned for Instagram Reels, TikTok, and Shorts.',
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
              More than captions. A complete short, ready to refine.
            </motion.h2>
          </div>
          <p className="text-lg leading-8 text-zinc-400">
            Itnavideo brings captions, visuals, fonts, colors, motion, sound, and exports into two simple
            short-form workflows: faceless videos and face-camera edits.
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

