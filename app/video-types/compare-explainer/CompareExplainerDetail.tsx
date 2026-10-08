'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Crown,
  Play,
  CheckCircle2,
  Sliders,
  Tv,
  HelpCircle,
  Smartphone,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';

const CHARACTERS = [
  {
    id: '3d-presenter-man',
    name: '3D Presenter Pro',
    tag: 'Flagship 3D',
    poses: {
      welcome: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png',
      pointingLeft: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-left.png',
      pointingRight: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-right.png',
      thinking: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-thinking.png',
      warning: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-warning.png',
      success: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-success.png',
    },
  },
  {
    id: '2d-presenter-man',
    name: '2D Presenter Pro',
    tag: 'Flat Vector',
    poses: {
      welcome: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-welcome.png',
      pointingLeft: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-left.png',
      pointingRight: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-right.png',
      thinking: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-thinking.png',
      warning: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-warning.png',
      success: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-success.png',
    },
  },
];

const POSE_LABELS: Record<string, string> = {
  welcome: '👋 Welcome Intro',
  pointingLeft: '👈 Point Left (Card A)',
  pointingRight: '👉 Point Right (Card B)',
  thinking: '🤔 Analysis & Thinking',
  warning: '⚠️ Drawback / Alert',
  success: '👑 Winner Celebration',
};

export default function CompareExplainerDetail() {
  const [selectedChar, setSelectedChar] = useState<0 | 1>(0);
  const [selectedPose, setSelectedPose] = useState<string>('pointingLeft');
  const [simActiveSide, setSimActiveSide] = useState<'left' | 'neutral' | 'right'>('left');

  const activeChar = CHARACTERS[selectedChar];
  const charImageSrc = (activeChar.poses as any)[selectedPose] || activeChar.poses.welcome;

  return (
    <div className="min-h-screen bg-[#0E0E12] text-zinc-100 selection:bg-amber-400 selection:text-black">
      {/* M3 Top App Bar */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0E0E12]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              ← Back to Studio
            </Link>
            <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-zinc-300">Compare Explainer Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard?mode=compare"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-black shadow-md shadow-amber-500/20 transition hover:scale-[1.02] hover:from-amber-300 hover:to-amber-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Open Studio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/15 via-purple-600/10 to-transparent blur-3xl" />

        <div className="mx-auto max-w-5xl text-center">
          {/* M3 Assist Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-amber-300 shadow-sm backdrop-blur">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Material Design 3 • Viral 9:16 Compare Reels</span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Side-by-Side Comparison <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              With Dedicated Characters
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Turn product vs product, tech comparisons, and finance debates into high-retention 9:16 vertical reels with active spotlights, automated audio captions, and animated 3D/2D presenters.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard?mode=compare"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/25 transition hover:scale-[1.03] hover:from-amber-300 hover:to-amber-400"
            >
              <Zap className="h-4 w-4" />
              Create Compare Reel in Studio
            </Link>
            <a
              href="#character-showcase"
              className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Tv className="h-4 w-4 text-zinc-400" />
              Explore Characters & Poses
            </a>
          </div>

          {/* Hero Showcase Image */}
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-2 shadow-2xl">
            <img
              src="/visuals/heroimages/compareexplainer.hero.png"
              alt="Compare Explainer Side-by-Side Video Showcase"
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Interactive A/B Comparison Simulator (M3 Showcase) */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Interactive Simulator
                </h2>
              </div>
              <p className="mt-1 text-2xl font-black text-white">Live Split-Screen Spotlight Preview</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Experience how the presenter actively spotlights Card A or Card B while dimming the opposite side.
              </p>
            </div>

            {/* M3 Segmented Buttons to switch spotlight */}
            <div className="flex rounded-2xl border border-white/10 bg-black/50 p-1">
              {[
                { id: 'left', label: '👈 Spotlight Left (A)' },
                { id: 'neutral', label: '⚖️ Neutral' },
                { id: 'right', label: 'Spotlight Right (B) 👉' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSimActiveSide(btn.id as any)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    simActiveSide === btn.id
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated 9:16 Mobile View Box */}
          <div className="relative mx-auto mt-8 max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#181822] to-[#0A0A0F] p-4 shadow-2xl">
            {/* Top Creator Pill */}
            <div className="flex justify-center">
              <span className="rounded-full border border-white/15 bg-black/60 px-4 py-1 text-[11px] font-bold tracking-widest text-zinc-300 uppercase">
                @itnavideo
              </span>
            </div>

            {/* Split Title Headers */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-center text-xs font-black uppercase text-white shadow">
                iPhone 16 Pro
              </div>
              <div className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 p-2 text-center text-xs font-black uppercase text-white shadow">
                Galaxy S25 Ultra
              </div>
            </div>

            {/* Visual Box Cards with Active Spotlight & Dim Effect */}
            <div className="relative mt-3 grid grid-cols-2 gap-3">
              {/* Left Card */}
              <div
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  simActiveSide === 'left'
                    ? 'scale-[1.04] border-blue-400 ring-2 ring-blue-500/50 shadow-[0_8px_24px_rgba(37,99,235,0.4)] opacity-100'
                    : simActiveSide === 'right'
                    ? 'scale-[0.98] border-white/10 opacity-70 filter saturate-[0.8]'
                    : 'scale-100 border-white/10 opacity-100'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80"
                  alt="Left Subject"
                  className="h-44 w-full object-cover"
                />
                <div className="absolute bottom-1 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  Titanium A18 Pro
                </div>
              </div>

              {/* Right Card */}
              <div
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  simActiveSide === 'right'
                    ? 'scale-[1.04] border-purple-400 ring-2 ring-purple-500/50 shadow-[0_8px_24px_rgba(124,58,237,0.4)] opacity-100'
                    : simActiveSide === 'left'
                    ? 'scale-[0.98] border-white/10 opacity-70 filter saturate-[0.8]'
                    : 'scale-100 border-white/10 opacity-100'
                }`}
              >
                <img
                  src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80"
                  alt="Right Subject"
                  className="h-44 w-full object-cover"
                />
                <div className="absolute bottom-1 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  Snapdragon 8 Elite
                </div>
              </div>

              {/* VS Slam Badge */}
              <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-white bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-black text-black shadow-lg">
                VS
              </div>
            </div>

            {/* Subtitle Caption */}
            <div className="mt-4 rounded-xl bg-black/60 p-2.5 text-center text-xs font-bold text-amber-300">
              {simActiveSide === 'left'
                ? '"iPhone gives unmatched video stabilization and raw ProRes colors!"'
                : simActiveSide === 'right'
                ? '"Samsung wins on 100x zoom and ultra-bright 2600 nits display!"'
                : '"Which flagship flagship should you pick in 2026?"'}
            </div>

            {/* Presenter in Simulator */}
            <div className="mt-2 flex justify-center">
              <img
                src={
                  simActiveSide === 'left'
                    ? activeChar.poses.pointingLeft
                    : simActiveSide === 'right'
                    ? activeChar.poses.pointingRight
                    : activeChar.poses.welcome
                }
                alt="Presenter"
                className="h-44 w-auto object-contain transition-transform duration-300 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Character Showcase Section */}
      <section id="character-showcase" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
            Curated Pro Character Packs
          </div>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Meet the New 3D & 2D Compare Presenters
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-400">
            Crafted specifically for 9:16 vertical reels with hands pointing towards the upper cards, clean transparency, and high-res detail.
          </p>
        </div>

        {/* Character Switcher Tabs */}
        <div className="mt-8 flex justify-center gap-3">
          {CHARACTERS.map((char, index) => (
            <button
              key={char.id}
              onClick={() => setSelectedChar(index as any)}
              className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition ${
                selectedChar === index
                  ? 'border-amber-400 bg-amber-400/10 text-amber-300 ring-2 ring-amber-400/30 shadow-md'
                  : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{char.name}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-zinc-300">
                {char.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Character Interactive Canvas */}
        <div className="mt-8 grid gap-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl md:grid-cols-12 md:p-8">
          {/* Pose Selector Column */}
          <div className="flex flex-col justify-center space-y-2 md:col-span-5">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Select Pose To Preview:
            </p>
            {Object.entries(POSE_LABELS).map(([poseKey, label]) => {
              const isActive = selectedPose === poseKey;
              return (
                <button
                  key={poseKey}
                  onClick={() => setSelectedPose(poseKey)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-bold transition ${
                    isActive
                      ? 'border-amber-400 bg-amber-400/15 text-amber-300 shadow-sm'
                      : 'border-white/10 bg-black/30 text-zinc-300 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span>{label}</span>
                  {isActive ? <ChevronRight className="h-4 w-4 text-amber-400" /> : null}
                </button>
              );
            })}
          </div>

          {/* Character Stage */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/50 p-6 md:col-span-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.12),_transparent_65%)]" />
            <img
              src={charImageSrc}
              alt="Character Preview"
              className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transition-all duration-300"
            />
            <div className="relative z-10 mt-4 text-center">
              <span className="rounded-full border border-white/15 bg-black/80 px-4 py-1 text-xs font-bold text-zinc-300">
                {activeChar.name} • {POSE_LABELS[selectedPose]}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* M3 Features Bento Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Engine Features</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Everything Built For Maximum Retention
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Layers className="h-5 w-5 text-amber-400" />,
              title: 'Adaptive Descender Titles',
              desc: 'Titles automatically scale font size to prevent descender clipping on letters like g, y, p, and q.',
            },
            {
              icon: <Crown className="h-5 w-5 text-amber-400" />,
              title: 'Winner Outro & Confetti',
              desc: 'Declare Option A or Option B as the winner with golden crown rays and celebratory animated confetti.',
            },
            {
              icon: <Sliders className="h-5 w-5 text-amber-400" />,
              title: '5 Image Frame Styles',
              desc: 'Choose between Rounded Cards, Circular Avatars, Mobile Smartphones, 3D Perspective Tilt, or Polaroid Photos.',
            },
            {
              icon: <Sparkles className="h-5 w-5 text-amber-400" />,
              title: 'AI Auto-Suggest Presets',
              desc: 'One-click presets for iPhones vs Samsung, SIP vs Lump Sum, and Debit vs Credit Cards for fast production.',
            },
            {
              icon: <Smartphone className="h-5 w-5 text-amber-400" />,
              title: 'Hinglish Subtitle Engine',
              desc: 'Accurate speech-to-text with auto-highlighted key terms and synced timestamps for maximum clarity.',
            },
            {
              icon: <CheckCircle2 className="h-5 w-5 text-amber-400" />,
              title: 'Decoupled Image Slots',
              desc: 'Upload, change, or remove either visual independently without unexpected slot jumping or index shifts.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md transition hover:border-amber-400/40 hover:bg-zinc-900/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10">
                {item?.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <section className="border-t border-white/10 bg-gradient-to-b from-zinc-900/40 to-black px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Ready to generate your first Compare Reel?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Open the Compare Studio, upload your narration, pick your presenter, and render in under 30 seconds.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard?mode=compare"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-base font-bold text-black shadow-xl shadow-amber-500/25 transition hover:scale-105 hover:from-amber-300 hover:to-amber-400"
            >
              <Sparkles className="h-5 w-5" />
              Launch Compare Explainer Studio
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


