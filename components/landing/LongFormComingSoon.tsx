'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock3, GraduationCap, Mic, Route, Youtube } from 'lucide-react';

const longFormFeatures = [
  { icon: Youtube, title: '5-20 minute videos', desc: 'Designed for YouTube explainers, commentary, and creator essays.' },
  { icon: Mic, title: 'Podcast visuals', desc: 'Turn spoken episodes into structured visual stories.' },
  { icon: GraduationCap, title: 'Educational content', desc: 'Build course-style videos from lessons and scripts.' },
  { icon: Route, title: 'Structured episodes', desc: 'Longer stories shaped into clear sections with a consistent viewing flow.' },
];

export default function LongFormComingSoon() {
  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#061112] px-6 py-28">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.12),transparent_35%),linear-gradient(315deg,rgba(59,130,246,0.10),transparent_32%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-7 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100"
          >
            <Clock3 size={16} />
            Private waitlist open
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl"
          >
            Next: long-form YouTube generation.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-6 max-w-xl text-lg leading-8 text-zinc-300"
          >
            The bigger vision is to turn long voiceovers, lessons, and podcast ideas into polished YouTube-ready
            videos from one simple starting point.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="https://forms.gle/WuqDzdRsuhtnEED4A"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-200 px-6 py-4 font-bold text-black transition hover:bg-white"
            >
              Join waitlist
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <div className="rounded-lg border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-sm font-bold text-white">Beta unlock goal</p>
              <p className="mt-1 text-sm text-zinc-400">100+ serious creators before wider rollout</p>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {longFormFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border border-white/10 bg-black/28 p-6 backdrop-blur"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-200/10 text-cyan-100">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{feature.desc}</p>
              </motion.div>
            );
          })}

          <div className="rounded-lg border border-blue-400/20 bg-blue-400/10 p-6 sm:col-span-2">
            <div className="flex gap-4">
              <BookOpen size={22} className="mt-1 text-blue-300" />
              <div>
                <h3 className="font-bold text-white">Founder insight</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Built from real creator pain: years of video production compressed into a tool that starts with the
                  easiest input to record, your voice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

