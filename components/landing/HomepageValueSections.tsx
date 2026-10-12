import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Languages,
  ListChecks,
  MousePointerClick,
  Sparkles,
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
    <section aria-label="Platform facts" className="border-b border-white/10 bg-[#070B14] px-4 py-4 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 lg:grid-cols-4">
        {facts.map(({ label, Icon }) => (
          <div key={label} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0E1526]/80 px-3 py-2.5 text-center text-xs font-bold text-zinc-300 transition hover:border-purple-500/40 hover:text-white">
            <Icon size={14} className="shrink-0 text-purple-400" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Icon3DStep1() {
  return (
    <svg width="44" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#9333EA" />
        </radialGradient>
        <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="20" r="14" fill="url(#bulbGlow)" />
      <path d="M18 28C18 28 20 32 24 32C28 32 30 28 30 28" fill="url(#bulbGlow)" />
      <path d="M24 12V24M18 18H30" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="18" y="32" width="12" height="6" rx="2" fill="url(#baseGrad)" stroke="#C084FC" strokeWidth="1" />
      <rect x="20" y="38" width="8" height="3" rx="1.5" fill="#C084FC" />
    </svg>
  );
}

function Icon3DStep2() {
  return (
    <svg width="44" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="micBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      <rect x="18" y="6" width="12" height="20" rx="6" fill="url(#micBody)" stroke="#FFF" strokeWidth="1" />
      <rect x="19" y="8" width="10" height="10" rx="5" fill="#C084FC" opacity="0.8" />
      <path d="M12 20V22C12 26.4183 15.5817 30 20 30H28C32.4183 30 36 26.4183 36 22V20" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 30V40M16 40H32" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function Icon3DStep3() {
  return (
    <svg width="44" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="clapperBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="purpleBar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <rect x="8" y="18" width="32" height="24" rx="4" fill="url(#clapperBody)" stroke="#C084FC" strokeWidth="1.5" />
      <circle cx="24" cy="30" r="7" fill="url(#purpleBar)" />
      <polygon points="22,26 28,30 22,34" fill="#FFFFFF" />
      <rect x="8" y="8" width="32" height="8" rx="2" fill="url(#purpleBar)" />
      <path d="M14 8L18 16M24 8L28 16M34 8L38 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Icon3DStep4() {
  return (
    <svg width="44" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      <path d="M24 6C24 6 32 14 32 26H16C16 14 24 6 24 6Z" fill="url(#rocketBody)" stroke="#C084FC" strokeWidth="1" />
      <circle cx="24" cy="18" r="4" fill="#0F172A" stroke="#7E22CE" strokeWidth="1.5" />
      <circle cx="24" cy="18" r="1.5" fill="#A855F7" />
      <path d="M16 22L10 28V32L16 28V22Z" fill="#7E22CE" />
      <path d="M32 22L38 28V32L32 28V22Z" fill="#7E22CE" />
      <rect x="20" y="26" width="8" height="4" fill="#475569" />
      <path d="M20 30C20 30 24 42 24 42C24 42 28 30 28 30H20Z" fill="url(#flameGrad)" />
      <path d="M22 30C22 30 24 38 24 38C24 38 26 30 26 30H22Z" fill="#FFFFFF" />
    </svg>
  );
}

export function PlatformJourney() {
  const steps = [
    {
      number: 'STEP 01',
      title: '1. Upload Media',
      sub: 'Drop your voiceover audio, images, or raw video footage.',
      tag: 'Instant Ingest',
      IconComponent: Icon3DStep1,
    },
    {
      number: 'STEP 02',
      title: '2. AI Generation',
      sub: 'Ultra-fast speech transcription, scene pacing & kinetic layout.',
      tag: 'Whisper & Gemini',
      IconComponent: Icon3DStep2,
    },
    {
      number: 'STEP 03',
      title: '3. Real-Time Review',
      sub: 'Inspect subtitle styles, captions, and visuals before render.',
      tag: 'Live Style Picker',
      IconComponent: Icon3DStep3,
    },
    {
      number: 'STEP 04',
      title: '4. 1080p Cloud Export',
      sub: 'Download crisp 1080p Full HD MP4 video ready to publish.',
      tag: '30 FPS Full HD',
      IconComponent: Icon3DStep4,
    },
  ];

  return (
    <section className="relative border-b border-white/10 bg-[#070B14] px-4 py-14 sm:px-6 sm:py-20 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-purple-300">
            <Sparkles size={14} className="text-purple-400" />
            <span>How Itnavideo Works</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl font-sans">
            Simple 4-Step Creation.{' '}
            <span className="text-purple-300">
              Zero Timeline Lag.
            </span>
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-base max-w-2xl mx-auto">
            Upload &rarr; AI creates &rarr; Review &rarr; Download. From raw media to a polished 1080p Full HD video in seconds.
          </p>
        </div>

        <div className="relative mt-12 sm:mt-16">
          <div className="relative z-10 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, title, sub, tag, IconComponent }) => (
              <article
                key={number}
                className="group relative flex flex-col items-center text-center rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-xl transition-all duration-300 hover:border-purple-500/40 hover:bg-[#131E35]"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="flex h-5 px-2.5 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 font-mono text-[10px] font-black tracking-wider text-purple-300">
                    {number}
                  </span>
                  <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-500/25 bg-purple-500/10 text-purple-300">
                    {tag}
                  </span>
                </div>

                <div className="mt-2 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-[22px] border border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-lg group-hover:scale-105 transition-all duration-300 relative">
                  <div className="relative z-10">
                    <IconComponent />
                  </div>
                </div>

                <h3 className="mt-4 text-base font-black text-white group-hover:text-purple-300 transition-colors">{title}</h3>
                <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed font-normal">{sub}</p>
              </article>
            ))}
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
      subtext: 'No timelines, keyframes, or complex software.',
      Icon: MousePointerClick,
    },
    {
      stat: '60s',
      title: '60s Cloud Speed',
      subtext: 'Zero laptop heating, no heavy GPU needed.',
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
    <section className="relative border-b border-white/10 bg-[#070B14] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-purple-300">
            <CheckCircle2 size={14} className="text-purple-400" />
            <span>Why Creators Choose Itnavideo</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Built for creators,<br className="hidden sm:block" /> not editors.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300">
            Pick the outcome you want. The studio handles scene timing, subtitles, pacing, and 1080p rendering — you just press render.
          </p>
          <Link
            href="/video-types"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0E1526] px-5 py-3 text-xs font-bold text-white shadow-md transition hover:border-purple-500/50 hover:bg-[#151E30] hover:text-purple-300 active:scale-95"
          >
            <span>Compare all {HOMEPAGE_WORKFLOW_COUNT} video studios</span>
            <ArrowRight size={14} className="text-purple-400" />
          </Link>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {stats.map(({ stat, title, subtext, Icon }) => (
            <article key={title} className="group rounded-2xl border border-white/10 bg-[#0E1526] p-4 shadow-lg transition-all duration-300 hover:border-purple-500/40 hover:bg-[#131E35]">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#151E30] text-purple-400 group-hover:border-purple-500/50 group-hover:text-purple-300 transition">
                  <Icon size={18} />
                </span>
                <span className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-black text-purple-300">
                  {stat}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-extrabold text-white">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-300">{subtext}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomepageFinalCta() {
  return (
    <section className="relative border-t border-white/10 bg-[#070B14] px-4 py-12 sm:px-6 sm:py-16 overflow-hidden">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-purple-500/30 bg-[#0E1526] p-6 text-center shadow-2xl p-6 sm:p-10">
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-purple-300">
            <Sparkles size={14} className="text-purple-400" />
            <span>Ready to Create?</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Start creating your first{' '}
            <span className="text-purple-300">
              AI video today.
            </span>
          </h2>
          <p className="mx-auto mt-3 text-xs sm:text-sm font-medium text-zinc-300">
            No credit card required • 3 free videos on signup
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-purple-600/25 transition active:scale-95 w-full sm:w-auto"
            >
              <span>Start Creating Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
