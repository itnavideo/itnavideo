'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Captions, Volume2, VolumeX, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BeforeAfterShowcase() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeTab, setActiveTab] = useState<'audio' | 'captions'>('captions');
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070B14] px-4 py-16 sm:px-6 sm:py-24 text-white">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[400px] w-[500px] rounded-full bg-[#FF6D00]/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100]">
            <Sparkles size={14} className="text-[#FF8F00] animate-pulse" />
            <span>Interactive Proof</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            See the Transformation{' '}
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
              Before &amp; After
            </span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Drag the slider to see how Itnavideo upgrades raw uploads into crisp, studio-grade content.
          </p>

          {/* Mode Tabs Switcher */}
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0E1526] p-1.5 shadow-md">
            <button
              type="button"
              onClick={() => setActiveTab('captions')}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black transition-all ${
                activeTab === 'captions'
                  ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Captions size={15} />
              <span>Auto Captions (9:16)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audio')}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black transition-all ${
                activeTab === 'audio'
                  ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/25'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Mic size={15} />
              <span>AI Audio Cleaner</span>
            </button>
          </div>
        </div>

        {/* Interactive Comparison Card */}
        <div className="mt-12 mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-[#0E1526] shadow-2xl">
            {/* Visual Screen Container */}
            <div
              className="relative aspect-video sm:aspect-[21/9] w-full select-none overflow-hidden bg-slate-950"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setSliderPosition(Math.max(5, Math.min(95, pos)));
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((touch.clientX - rect.left) / rect.width) * 100;
                setSliderPosition(Math.max(5, Math.min(95, pos)));
              }}
            >
              {/* BEFORE LAYER (Left Side / Full Base) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 text-center">
                <span className="absolute top-4 left-4 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-red-400">
                  Before: Raw Upload
                </span>
                {activeTab === 'captions' ? (
                  <div className="max-w-md space-y-3 opacity-60">
                    <p className="text-sm sm:text-lg font-mono text-zinc-400">
                      "so basically today i am going to show you how to edit video..."
                    </p>
                    <p className="text-xs text-red-400">❌ Boring monotone text • No timing • Low retention</p>
                  </div>
                ) : (
                  <div className="max-w-md space-y-3 opacity-60">
                    <div className="flex items-center justify-center gap-1.5 h-12">
                      {[15, 8, 22, 10, 18, 9, 25, 12, 16, 7].map((h, i) => (
                        <div key={i} style={{ height: `${h}px` }} className="w-1.5 rounded-full bg-red-400/50" />
                      ))}
                    </div>
                    <p className="text-xs text-red-400">❌ Background echo • Fan noise • Low voice volume</p>
                  </div>
                )}
              </div>

              {/* AFTER LAYER (Right Side / Clipped Overlay) */}
              <div
                className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#070B14] to-[#0E1526]"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="absolute top-4 right-4 rounded-full border border-[#FF6D00]/40 bg-[#FF6D00]/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#FFA726] shadow-sm">
                    After: Itnavideo 1080p AI
                  </span>
                  {activeTab === 'captions' ? (
                    <div className="max-w-md space-y-3">
                      <p className="text-lg sm:text-2xl font-black text-white">
                        <span className="bg-gradient-to-r from-[#FF6D00] to-[#FFA726] bg-clip-text text-transparent underline decoration-[#FF6D00] decoration-wavy">
                          INSTANT
                        </span>{' '}
                        Viral Reels Pacing ⚡
                      </p>
                      <p className="text-xs font-bold text-emerald-400">✓ Precision word timing • GA Orange highlights • 1080p Full HD</p>
                    </div>
                  ) : (
                    <div className="max-w-md space-y-3">
                      <div className="flex items-center justify-center gap-1.5 h-12">
                        {[20, 38, 28, 44, 30, 48, 24, 40, 32, 45].map((h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}px` }}
                            className="w-1.5 rounded-full bg-gradient-to-t from-[#FF6D00] to-[#FFA726]"
                          />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-emerald-400">✓ Studio noise cleanup • Broadcast loudness • Crystal vocal tone</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Slider Handle Line */}
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-30 w-1 bg-gradient-to-b from-[#FFA726] via-[#FF6D00] to-[#FFA726] shadow-[0_0_15px_rgba(255,109,0,0.8)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-[#FF6D00] to-[#FFA726] text-black shadow-xl">
                  <span className="text-[10px] font-black">↔</span>
                </div>
              </div>
            </div>

            {/* Bottom Comparison Info Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#0E1526] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0E1526] text-[#FF8F00] border border-white/10">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {activeTab === 'captions' ? '1-Click Kinetic Subtitle Studio' : 'AI Audio Mastering & Cleaner'}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {activeTab === 'captions'
                      ? 'No manual typing or timeline syncing needed.'
                      : 'Eliminates background hiss and balances speech.'}
                  </p>
                </div>
              </div>

              <Link
                href={activeTab === 'captions' ? '/dashboard/auto-caption' : '/dashboard/audio-cleaner'}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-3 text-xs font-black text-black shadow-md shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
              >
                <span>Try Free</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
