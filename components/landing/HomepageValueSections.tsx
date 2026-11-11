'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  Cloud,
  Download,
  Film,
  Languages,
  ListChecks,
  LockKeyhole,
  MousePointerClick,
  Settings2,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react';
import { HOMEPAGE_WORKFLOW_COUNT } from '@/constants/homepageWorkflows';

export function HomepageTrustStrip() {
  const facts = [
    { label: `${HOMEPAGE_WORKFLOW_COUNT} AI Video Types`, Icon: ListChecks },
    { label: 'Ultra-Fast Cloud Rendering', Icon: Cloud },
    { label: 'Global Accents & Dialects', Icon: Languages },
    { label: '1080p Full HD Export', Icon: CheckCircle2 },
  ];

  return (
    <section aria-label="Platform facts" className="border-b border-stone-200/80 bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        {facts.map(({ label, Icon }) => (
          <div key={label} className="flex items-center justify-center gap-2.5 rounded-xl border border-stone-200/80 bg-white px-3.5 py-3 text-center text-xs font-bold text-slate-700 shadow-xs transition hover:border-orange-500/30 hover:text-zinc-950 hover:bg-orange-50/30">
            <Icon size={15} className="shrink-0 text-orange-600" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepIcon1() {
  return (
    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0">
      <Upload size={20} strokeWidth={2.2} />
    </div>
  );
}

function StepIcon2() {
  return (
    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0">
      <Sparkles size={20} strokeWidth={2.2} />
    </div>
  );
}

function StepIcon3() {
  return (
    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0">
      <Settings2 size={20} strokeWidth={2.2} />
    </div>
  );
}

function StepIcon4() {
  return (
    <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 shrink-0">
      <CheckCircle2 size={20} strokeWidth={2.2} />
    </div>
  );
}

export function PlatformJourney() {
  const steps = [
    {
      number: 'STEP 01',
      title: '1. Smart Input & Ingest',
      sub: 'Drop your voiceover audio, podcast recording, or video files.',
      tag: 'Smart Input & B-Roll',
      IconComponent: StepIcon1,
    },
    {
      number: 'STEP 02',
      title: '2. AI Storyboard & Visual Matcher',
      sub: 'Cloud speech-to-text with semantic visual matching: spoken ideas are paired with rich cinematic B-roll and visual assets.',
      tag: 'Auto B-Roll & SFX',
      IconComponent: StepIcon2,
    },
    {
      number: 'STEP 03',
      title: '3. Storyboard Review',
      sub: 'Inspect scene visuals, subtitle styles, and timings before cloud render.',
      tag: 'Interactive Review',
      IconComponent: StepIcon3,
    },
    {
      number: 'STEP 04',
      title: '4. 1080p Cloud Export',
      sub: 'Download crisp 1080p Full HD MP4 video ready to publish.',
      tag: '30 FPS Full HD',
      IconComponent: StepIcon4,
    },
  ];

  return (
    <section className="relative border-b border-stone-200/80 bg-white px-4 py-16 sm:px-6 sm:py-24 overflow-hidden text-slate-900">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl font-sans">
            Simple 4-Step Creation.{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              Zero Timeline Lag.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base max-w-2xl mx-auto">
            Upload &rarr; AI creates &rarr; Review &rarr; Download. From raw media to a polished 1080p Full HD video in seconds.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left 5 Steps List, Right 7 Visual Mockup */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 4 Creation Steps Vertical List */}
          <div className="lg:col-span-5 space-y-3.5">
            {steps.map(({ number, title, sub, tag, IconComponent }, idx) => {
              const isActive = idx === 0;
              return (
                <div
                  key={number}
                  className={`group relative flex items-start gap-4 rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                    isActive
                      ? 'border-orange-500/40 bg-orange-50/20 shadow-xs ring-1 ring-orange-500/20'
                      : 'border-stone-200/80 bg-white shadow-xs hover:border-orange-500/30 hover:shadow-sm'
                  }`}
                >
                  {/* Step Icon */}
                  <IconComponent />

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/10 font-mono text-[10px] font-bold text-orange-700">
                        {number}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-stone-200/80 bg-stone-50 text-slate-700">
                        {tag}
                      </span>
                    </div>
                    <h3 className={`text-sm sm:text-base font-extrabold transition-colors ${
                      isActive ? 'text-[#FF5722]' : 'text-slate-900 group-hover:text-orange-600'
                    }`}>
                      {title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                      {sub}
                    </p>
                  </div>

                  {/* Stage Indicator */}
                  <div className="shrink-0 hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-orange-600 self-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]" />
                    <span>Stage {idx + 1}/4</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Cloudinary Image 2 Mockup Showcase */}
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-3 sm:p-5 shadow-xs transition-all duration-300 hover:border-orange-500/30 hover:shadow-sm">
              {/* SaaS Window Chrome */}
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 border-b border-stone-100 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="uppercase tracking-wider font-extrabold text-orange-700">
                    Smart Media Input &amp; B-Roll Matcher
                  </span>
                </div>
                <span className="text-slate-400 font-semibold text-[11px] hidden sm:inline">
                  Waveform &amp; Scene Alignment
                </span>
              </div>

              {/* Crisp Visual Container */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-1 sm:p-2 border border-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dhouh9idx/image/upload/v1792056190/Step_1_Smart_Input_B-Roll_Matcher_Visual_How_It_Works_ybdykd.png"
                  alt="Smart Input &amp; B-Roll Matcher Workflow"
                  className="w-full h-auto object-contain rounded-xl select-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function WhyItnavideo() {
  const stats = [
    {
      stat: '0',
      title: '0 Learning Curve',
      subtext: 'No timelines, no keyframes, no complex software.',
      Icon: MousePointerClick,
    },
    {
      stat: '60s',
      title: '60s Cloud Speed',
      subtext: 'Zero laptop heating, no heavy GPU/RAM needed.',
      Icon: Zap,
    },
    {
      stat: 'AI',
      title: 'Accents & Dialects',
      subtext: 'Accurately understands spoken accents and matches rich B-roll with kinetic subtitles.',
      Icon: Languages,
    },
    {
      stat: '1080p',
      title: 'Ready for Reels & YT',
      subtext: 'Pre-formatted 1080p Full HD video exports.',
      Icon: CheckCircle2,
    },
  ];

  return (
    <section className="relative border-b border-slate-100 bg-white px-4 py-12 sm:px-6 sm:py-16 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Built for creators,<br className="hidden sm:block" /> not editors.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Pick the outcome you want. The studio handles scene timing, subtitles, pacing, and 1080p rendering — you just press render.
          </p>
          <Link
            href="/video-types"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition hover:bg-stone-50 active:scale-95"
          >
            <span>Compare all {HOMEPAGE_WORKFLOW_COUNT} video studios</span>
            <ArrowRight size={15} className="text-orange-600" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map(({ stat, title, subtext, Icon }) => (
            <article key={title} className="group rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-orange-500/30 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-600 transition shrink-0">
                  <Icon size={18} />
                </span>
                <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-700 transition">
                  {stat}
                </span>
              </div>
              <h3 className="mt-4 text-sm sm:text-base font-extrabold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 font-medium">{subtext}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomepageFinalCta() {
  return (
    <section className="relative border-t border-slate-100 bg-white px-4 py-14 sm:px-6 sm:py-20 overflow-hidden text-slate-900">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-14">
        {/* Ambient Halo behind CTA */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] max-w-full opacity-50 blur-3xl"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(234, 88, 12, 0.05) 50%, transparent 75%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl font-sans">
            Ready to create your first{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              AI video?
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm font-semibold text-zinc-600">
            Instant Cloud Access • 1080p Full HD Export • 1 Min = 1 Credit
          </p>

          {/* Clean Direct CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/45 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
            >
              <Sparkles size={16} className="text-white" />
              <span>Start Creating Free</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <p className="mt-4 text-[11px] sm:text-xs text-zinc-400 font-medium">
            Free Trial on Signup • No Credit Card Required • No Watermark on Paid Plans
          </p>
        </div>
      </div>
    </section>
  );
}
