'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Quote, Rocket, Users, Zap } from 'lucide-react';

const INTRO_VIDEO_URL = 'https://remotionlambda-apsouth1-m59wp9dklj.s3.ap-south-1.amazonaws.com/public/marketing/itnavideo-intro-2026.mp4';
const POSTER = '/visuals/banners/intro-video-poster.png';

export default function FounderVideoSection() {
  const [started, setStarted] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 bg-background border-t border-border">
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] [background-image:radial-gradient(circle_at_60%_40%,rgba(245,158,11,1)_1px,transparent_1px)] [background-size:50px_50px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(245,158,11,0.03),transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left: Story + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
              <Rocket size={12} className="text-amber-500 dark:text-amber-400" />
              <span>The story behind Itnavideo</span>
            </div>

            <h2 className="text-3xl font-black leading-tight text-foreground sm:text-4xl font-sans tracking-tight">
              Built by a creator{' '}
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">who was tired of editing.</span>
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              I was spending 3+ hours every week captioning and formatting my own videos. Manual work that added zero creative value. So I built the tool I wished existed.
            </p>

            {/* Quote */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm backdrop-blur-md dark:border-border dark:bg-background/30">
              <Quote size={18} className="mb-3 text-amber-500/40 dark:text-amber-400/40" />
              <p className="text-xs italic leading-relaxed text-muted-foreground">
                &ldquo;If you create content, you shouldn&apos;t waste time on formatting. Upload, choose your style, get a professional video. That&apos;s it.&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-amber-500/20">
                  <Image src="/founder/syed-mohammed-rohi.webp" alt="Syed Rohi" width={40} height={40} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground dark:text-white">Syed Mohammed Rohi</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Founder & Developer · Bangalore</p>
                </div>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users, value: '500+', label: 'Creators' },
                { icon: Zap, value: '10K+', label: 'Videos made' },
                { icon: Rocket, value: '11', label: 'Video types' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-3 text-center shadow-sm backdrop-blur-md dark:border-border dark:bg-background/20">
                  <stat.icon size={13} className="mx-auto mb-1.5 text-amber-500 dark:text-amber-400/80" />
                  <p className="text-sm font-black text-foreground dark:text-white sm:text-base">{stat.value}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Video */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm dark:border-border dark:bg-background">
              <div className="pointer-events-none absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_60%)] z-10" />

              <div className="relative aspect-video overflow-hidden rounded-2xl bg-card dark:bg-background">
                {started ? (
                  <video
                    className="h-full w-full object-cover"
                    src={INTRO_VIDEO_URL}
                    autoPlay
                    controls
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setStarted(true)}
                    className="group relative flex h-full w-full items-center justify-center"
                    aria-label="Play founder intro video"
                  >
                    <Image
                      src={POSTER}
                      alt="Syed Rohi — Founder of Itnavideo explaining the product"
                      fill
                      sizes="(min-width: 1024px) 600px, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute inset-0 bg-background/40 transition group-hover:bg-background/30" />

                    {/* Play button */}
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/90 dark:bg-muted/60 shadow-2xl backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:border-blue-500/20 group-hover:bg-blue-600/20 sm:h-20 sm:w-20">
                      <Play size={22} className="ml-1 text-slate-950 dark:text-white fill-current" />
                    </span>

                    {/* Duration badge */}
                    <span className="absolute bottom-4 right-4 rounded-xl bg-background/80 px-2.5 py-1 text-[10px] font-black tracking-wide text-white backdrop-blur-md">
                      2:45
                    </span>

                    {/* Label */}
                    <span className="absolute bottom-4 left-4 rounded-xl bg-background/80 px-3 py-1.5 text-[10px] font-black tracking-wide text-white backdrop-blur-md">
                      🎬 Founder intro
                    </span>
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

