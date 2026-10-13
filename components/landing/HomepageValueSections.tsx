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

function Icon3DStep1() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
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
      <path d="M8 12L11 15M40 12L37 15M24 2L24 5" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Icon3DStep2() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="micBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="micMesh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <rect x="18" y="6" width="12" height="20" rx="6" fill="url(#micBody)" stroke="#FFF" strokeWidth="1" />
      <rect x="19" y="8" width="10" height="10" rx="5" fill="url(#micMesh)" opacity="0.8" />
      <path d="M12 20V22C12 26.4183 15.5817 30 20 30H28C32.4183 30 36 26.4183 36 22V20" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 30V40M16 40H32" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 20C6 14 9 10 12 8M42 20C42 14 39 10 36 8" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  );
}

function Icon3DStep3() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="clapperBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="purpleBar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#E879F9" />
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
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(16,185,129,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d="M24 6C24 6 32 14 32 26H16C16 14 24 6 24 6Z" fill="url(#rocketBody)" stroke="#34D399" strokeWidth="1" />
      <circle cx="24" cy="18" r="4" fill="#0F172A" stroke="#059669" strokeWidth="1.5" />
      <circle cx="24" cy="18" r="1.5" fill="#38BDF8" />
      <path d="M16 22L10 28V32L16 28V22Z" fill="#059669" />
      <path d="M32 22L38 28V32L32 28V22Z" fill="#059669" />
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
      badgeStyle: 'border-orange-500/40 bg-orange-500/15 text-orange-700 shadow-2xs',
      iconBoxStyle: 'border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-white text-orange-600 shadow-orange-500/10 group-hover:border-orange-400',
      glowColor: 'bg-orange-500/10 group-hover:bg-orange-500/20',
      tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    {
      number: 'STEP 02',
      title: '2. AI Generation',
      sub: 'Ultra-fast speech transcription, scene pacing & kinetic layout.',
      tag: 'Whisper & Gemini',
      IconComponent: Icon3DStep2,
      badgeStyle: 'border-amber-500/40 bg-amber-500/15 text-amber-700 shadow-2xs',
      iconBoxStyle: 'border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-white text-amber-600 shadow-amber-500/10 group-hover:border-amber-400',
      glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
      tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      number: 'STEP 03',
      title: '3. Real-Time Review',
      sub: 'Inspect subtitle styles, captions, and visuals before render.',
      tag: 'Live Style Picker',
      IconComponent: Icon3DStep3,
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
      IconComponent: Icon3DStep4,
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

        {/* Steps Grid with Connected Visual Progression Timeline */}
        <div className="relative mt-16 sm:mt-20">
          {/* Glowing Connected Timeline Rail (Desktop only) */}
          <div className="pointer-events-none hidden lg:block absolute top-[72px] left-[12%] right-[12%] h-[3px] bg-gradient-to-r from-orange-400/40 via-amber-400/40 via-orange-400/40 to-emerald-400/40 rounded-full shadow-[0_0_15px_rgba(255,87,34,0.3)] z-0" />

          <div className="relative z-10 grid gap-6 sm:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, title, sub, tag, IconComponent, badgeStyle, iconBoxStyle, glowColor, tagColor }, idx) => (
              <article
                key={number}
                className="group relative flex flex-col items-center text-center rounded-[32px] border border-slate-200/90 bg-white p-7 sm:p-8 shadow-sm transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10"
              >
                {/* Step Pill Badge */}
                <div className="flex items-center justify-between w-full mb-4">
                  <span className={`flex h-6 px-3 items-center justify-center rounded-full border font-mono text-[11px] font-black tracking-wider ${badgeStyle}`}>
                    {number}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${tagColor}`}>
                    {tag}
                  </span>
                </div>

                {/* Large 3D Micro-Illustration Container */}
                <div className={`mt-2 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[28px] border shadow-md group-hover:scale-110 transition-all duration-300 relative ${iconBoxStyle}`}>
                  <div className={`absolute inset-0 rounded-[28px] blur-md transition duration-300 ${glowColor}`} />
                  <div className="relative z-10">
                    <IconComponent />
                  </div>
                </div>

                <h3 className="mt-6 text-base sm:text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">{title}</h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">{sub}</p>

                {/* Step order indicator dot */}
                <div className="mt-5 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]" />
                  <span>Stage {idx + 1} of 4</span>
                </div>
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
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 transition hover:brightness-110 active:scale-95 sm:w-auto"
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
