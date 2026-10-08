'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, RefreshCw, ArrowRight, Wand2, Volume2 } from 'lucide-react';
import Link from 'next/link';

const SAMPLE_PROMPTS = [
  'Stop scrolling! This 1 AI video trick changed everything.',
  'How top creators get 1M+ views without showing their face.',
  'Turn any voice note into a viral 1080p reel in 60 seconds.',
];

const STYLES = [
  { id: 'karaoke', label: '🔥 Karaoke Pop', desc: 'Warm orange word-by-word pulse' },
  { id: 'kinetic', label: '⚡ Kinetic Stamp', desc: 'High-energy scale-in impact' },
  { id: 'neon', label: '✨ Glowing Strip', desc: 'Obsidian glass with ambient glow' },
];

export default function KineticTypographyTester() {
  const [text, setText] = useState(SAMPLE_PROMPTS[0]);
  const [selectedStyle, setSelectedStyle] = useState('karaoke');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const words = text.trim().split(/\s+/).filter(Boolean);

  // Playback timer cycling through words
  useEffect(() => {
    if (!isPlaying || words.length === 0) return;
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % words.length);
    }, 450);
    return () => clearInterval(interval);
  }, [isPlaying, words.length]);

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070B14] px-4 py-16 sm:px-6 sm:py-24 text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-[#FF6D00]/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100]">
            <Sparkles size={14} className="text-[#FF8F00] animate-pulse" />
            <span>Interactive Live Simulation</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Test Kinetic Typography{' '}
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
              In Real-Time
            </span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Type any sentence or pick a viral hook below to experience our millisecond-timed kinetic subtitle animations.
          </p>
        </div>

        {/* 2-Column Playground: Controls (Left) + 9:16 Live Preview (Right) */}
        <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Controls Panel */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Input Box */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-6 shadow-xl backdrop-blur-xl">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Enter Your Video Script or Hook
              </label>
              <div className="mt-3 relative">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setActiveWordIndex(0);
                  }}
                  rows={3}
                  maxLength={120}
                  placeholder="Type any sentence here to see live kinetic animation..."
                  className="w-full resize-none rounded-2xl border border-white/15 bg-[#0E1526] p-4 text-sm font-semibold text-white placeholder-zinc-500 focus:border-[#FF6D00] focus:outline-none focus:ring-1 focus:ring-[#FF6D00]"
                />
                <span className="absolute bottom-3 right-3 text-[11px] font-mono text-zinc-500">
                  {text.length}/120
                </span>
              </div>

              {/* Sample Prompts Pills */}
              <div className="mt-4">
                <p className="text-[11px] font-bold text-zinc-400 mb-2">Try viral creator hooks:</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setText(prompt);
                        setActiveWordIndex(0);
                      }}
                      className="rounded-full border border-white/10 bg-[#0E1526] px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition-all hover:border-[#FF6D00]/50 hover:bg-[#131926] hover:text-white active:scale-95"
                    >
                      Hook {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Animation Style Selector */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 active:scale-95 ${
                    selectedStyle === style.id
                      ? 'border-[#FF6D00] bg-[#0E1526] ring-1 ring-[#FF6D00]/40 shadow-lg shadow-[#FF6D00]/15'
                      : 'border-white/10 bg-[#0E1526]/80 hover:border-white/20 hover:bg-[#0E1526]'
                  }`}
                >
                  <span className="text-xs font-black text-white">{style.label}</span>
                  <span className="mt-1 text-[11px] text-zinc-400">{style.desc}</span>
                </button>
              ))}
            </div>

            {/* CTA Anchor */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/dashboard/typography-video"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-7 py-4 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
              >
                <span>Generate Video with This Style</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 9:16 Live Animated Phone Canvas (Right) */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative aspect-[9/16] w-full max-w-[320px] sm:max-w-[340px] overflow-hidden rounded-[36px] border-[6px] border-[#182032] bg-[#070B14] shadow-2xl shadow-[#FF6D00]/20">
              {/* Top Dynamic Island / Speaker */}
              <div className="absolute top-3 left-1/2 z-30 h-4 w-24 -translate-x-1/2 rounded-full bg-black/80 backdrop-blur-md" />

              {/* Background gradient visuals */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#070B14] to-black" />
              <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-[#FF6D00]/20 blur-3xl animate-pulse" />
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#FFA726]/15 blur-3xl" />

              {/* Status Header Badge */}
              <div className="relative z-20 flex items-center justify-between px-5 pt-8 text-[11px] font-bold text-zinc-400">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
                <span className="font-mono text-zinc-400">1080×1920</span>
              </div>

              {/* Center Kinetic Typography Stage */}
              <div className="relative z-20 flex h-[65%] flex-col items-center justify-center px-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {words.map((word, idx) => {
                    const isActive = idx === activeWordIndex;
                    return (
                      <motion.span
                        key={`${word}-${idx}`}
                        animate={
                          selectedStyle === 'karaoke'
                            ? {
                                scale: isActive ? 1.25 : 1,
                                color: isActive ? '#FFA726' : '#94A3B8',
                                textShadow: isActive ? '0 0 20px rgba(255,109,0,0.8)' : 'none',
                              }
                            : selectedStyle === 'kinetic'
                            ? {
                                scale: isActive ? 1.3 : 1,
                                y: isActive ? -4 : 0,
                                color: isActive ? '#FFFFFF' : '#64748B',
                                fontWeight: isActive ? 900 : 700,
                              }
                            : {
                                scale: isActive ? 1.15 : 1,
                                backgroundColor: isActive ? 'rgba(255,109,0,0.25)' : 'transparent',
                                color: isActive ? '#FFFFFF' : '#94A3B8',
                              }
                        }
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className={`inline-block rounded-lg px-1.5 py-0.5 text-lg font-black tracking-tight ${
                          isActive ? 'z-10' : ''
                        }`}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Soundwave Visualizer & Controls */}
              <div className="absolute bottom-5 left-0 right-0 z-20 px-5">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5">
                    {[12, 24, 16, 28, 20, 32, 14, 22, 18, 30].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${(h * (activeWordIndex % 3 + 1)) / 3}px` }}
                        className="w-1 rounded-full bg-gradient-to-t from-[#FF6D00] to-[#FFA726] transition-all duration-150"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md transition active:scale-90"
                    aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
                  >
                    {isPlaying ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} className="fill-black ml-0.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
