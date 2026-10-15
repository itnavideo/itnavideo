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
    { label: 'English + Roman Hinglish', Icon: Languages },
    { label: '1080p Full HD Export', Icon: CheckCircle2 },
  ];

  return (
    <section aria-label="Platform facts" className="border-b border-slate-200/80 bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        {facts.map(({ label, Icon }) => (
          <div key={label} className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-center text-xs font-bold text-slate-700 shadow-2xs transition hover:border-orange-500/40 hover:text-orange-900 hover:bg-orange-50/40">
            <Icon size={15} className="shrink-0 text-[#FF5722]" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepIcon1() {
  return (
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-[#FF5722] to-amber-500 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_10px_20px_-4px_rgba(255,87,34,0.35)] group-hover:scale-110 transition-transform duration-300">
      <Upload size={26} strokeWidth={2.4} className="drop-shadow" />
    </div>
  );
}

function StepIcon2() {
  return (
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_10px_20px_-4px_rgba(245,158,11,0.35)] group-hover:scale-110 transition-transform duration-300">
      <Sparkles size={26} strokeWidth={2.4} className="drop-shadow" />
    </div>
  );
}

function StepIcon3() {
  return (
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF5722] via-[#FF7043] to-orange-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_10px_20px_-4px_rgba(255,87,34,0.35)] group-hover:scale-110 transition-transform duration-300">
      <Settings2 size={26} strokeWidth={2.4} className="drop-shadow" />
    </div>
  );
}

function StepIcon4() {
  return (
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_10px_20px_-4px_rgba(16,185,129,0.35)] group-hover:scale-110 transition-transform duration-300">
      <CheckCircle2 size={26} strokeWidth={2.4} className="drop-shadow" />
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
      badgeStyle: 'border-orange-500/40 bg-orange-500/15 text-orange-700 shadow-2xs',
      iconBoxStyle: 'border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-white text-orange-600 shadow-orange-500/10 group-hover:border-orange-400',
      glowColor: 'bg-orange-500/10 group-hover:bg-orange-500/20',
      tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    {
      number: 'STEP 02',
      title: '2. AI Storyboard',
      sub: 'Cloud speech transcription, scene pacing & automatic visual matching.',
      tag: 'Auto B-Roll & SFX',
      IconComponent: StepIcon2,
      badgeStyle: 'border-amber-500/40 bg-amber-500/15 text-amber-700 shadow-2xs',
      iconBoxStyle: 'border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-white text-amber-600 shadow-amber-500/10 group-hover:border-amber-400',
      glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      number: 'STEP 03',
      title: '3. Storyboard Review',
      sub: 'Inspect scene visuals, subtitle styles, and timings before cloud render.',
      tag: 'Interactive Review',
      IconComponent: StepIcon3,
      badgeStyle: 'border-orange-500/40 bg-orange-500/15 text-orange-700 shadow-2xs',
      iconBoxStyle: 'border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-white text-orange-600 shadow-orange-500/10 group-hover:border-orange-400',
      glowColor: 'bg-orange-500/10 group-hover:bg-orange-500/20',
      tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    {
      number: 'STEP 04',
      title: '4. 1080p Cloud Export',
      sub: 'Download crisp 1080p Full HD MP4 video ready to publish.',
      tag: '30 FPS Full HD',
      IconComponent: StepIcon4,
      badgeStyle: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 shadow-2xs',
      iconBoxStyle: 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-white text-emerald-600 shadow-emerald-500/10 group-hover:border-emerald-400',
      glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
      tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <section className="relative border-b border-slate-200/80 bg-white px-4 py-16 sm:px-6 sm:py-24 overflow-hidden text-slate-900">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-r from-orange-500/10 via-amber-400/8 to-rose-400/5 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-[#10B981]/10 blur-[130px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-orange-700 shadow-2xs">
            <Sparkles size={14} className="text-[#FF5722] animate-pulse" />
            <span>How Itnavideo Works</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl font-sans">
            Simple 4-Step Creation.{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Zero Timeline Lag.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base max-w-2xl mx-auto">
            Upload &rarr; AI creates &rarr; Review &rarr; Download. From raw media to a polished 1080p Full HD video in seconds.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left 4 Steps List, Right Image 2 Visual */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 4 Creation Steps Vertical List */}
          <div className="lg:col-span-6 space-y-3.5">
            {steps.map(({ number, title, sub, tag, IconComponent, badgeStyle, iconBoxStyle, tagColor }, idx) => (
              <div
                key={number}
                className="group relative flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-orange-500/40 hover:shadow-md hover:bg-orange-50/15"
              >
                {/* Step Icon */}
                <div className={`shrink-0 flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border shadow-xs relative ${iconBoxStyle}`}>
                  <IconComponent />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full border font-mono text-[10px] font-black tracking-wider ${badgeStyle}`}>
                      {number}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${tagColor}`}>
                      {tag}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
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
            ))}
          </div>

          {/* Right Column: Cloudinary Image 2 (Smart Input & B-Roll Matcher) */}
          <div className="lg:col-span-6">
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-white/95 to-orange-50/25 p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] drop-shadow-xl transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.10)]">
              {/* SaaS Window Chrome */}
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 border-b border-slate-100/90 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="uppercase tracking-wider font-extrabold text-orange-700">
                    Smart Media Input &amp; B-Roll Matcher
                  </span>
                </div>
                <span className="text-slate-400 font-semibold text-[10px] hidden sm:inline">
                  Waveform &amp; Scene Alignment
                </span>
              </div>

              {/* Crisp Visual Container */}
              <div className="relative overflow-hidden rounded-xl bg-white/70 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dhouh9idx/image/upload/v1792056190/Step_1_Smart_Input_B-Roll_Matcher_Visual_How_It_Works_ybdykd.png"
                  alt="Smart Input &amp; B-Roll Matcher Workflow"
                  className="w-full h-auto object-contain rounded-lg drop-shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
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
      stat: 'A/अ',
      title: 'Native Hinglish',
      subtext: 'Accurate phonetic Roman captions without typing.',
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
    <section className="relative border-b border-slate-200/80 bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-orange-700 shadow-2xs">
            <CheckCircle2 size={14} className="text-[#FF5722]" />
            <span>Why Creators Choose Itnavideo</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Built for creators,<br className="hidden sm:block" /> not editors.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Pick the outcome you want. The studio handles scene timing, subtitles, pacing, and 1080p rendering — you just press render.
          </p>
          <Link
            href="/video-types"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-800 shadow-2xs transition hover:border-orange-500/50 hover:bg-orange-50/50 hover:text-orange-900 active:scale-95"
          >
            <span>Compare all {HOMEPAGE_WORKFLOW_COUNT} video studios</span>
            <ArrowRight size={15} className="text-[#FF5722]" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map(({ stat, title, subtext, Icon }) => (
            <article key={title} className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-orange-600 group-hover:border-orange-500/30 group-hover:bg-orange-50 transition">
                  <Icon size={19} />
                </span>
                <span className="rounded-xl border border-orange-500/20 bg-orange-50 px-3 py-1 text-xs font-black text-orange-700 group-hover:bg-[#FF5722] group-hover:text-white transition">
                  {stat}
                </span>
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{subtext}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomepageFinalCta() {
  return (
    <section className="relative border-t border-slate-200/80 bg-gradient-to-b from-[#FFF8F5] to-white px-4 py-12 sm:px-6 sm:py-16 overflow-hidden text-slate-900">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border-2 border-orange-500/30 bg-white p-7 text-center shadow-xl shadow-orange-500/10 sm:p-12">
        {/* Glow blur backgrounds */}
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-orange-700 shadow-2xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>Ready to Create?</span>
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Ready to create your first{' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              AI video?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm font-semibold text-slate-600">
            No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200 sm:w-auto"
            >
              <span>Start Creating Free →</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 shadow-2xs transition hover:border-orange-500/40 hover:bg-slate-50 hover:text-slate-900 active:scale-95 sm:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
