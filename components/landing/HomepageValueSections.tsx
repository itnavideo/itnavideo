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
    <section aria-label="Platform facts" className="border-b border-white/10 bg-[#050505] px-4 py-5 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        {facts.map(({ label, Icon }) => (
          <div key={label} className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/[0.07] bg-[#0F1117] px-3.5 py-3 text-center text-xs font-bold text-zinc-300 shadow-sm transition hover:border-[#FF6D00]/40 hover:text-white">
            <Icon size={15} className="shrink-0 text-[#FF9100]" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Icon3DStep1() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(255,109,0,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#FF6D00" />
        </radialGradient>
        <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="20" r="14" fill="url(#bulbGlow)" />
      <path d="M18 28C18 28 20 32 24 32C28 32 30 28 30 28" fill="url(#bulbGlow)" />
      <path d="M24 12V24M18 18H30" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="18" y="32" width="12" height="6" rx="2" fill="url(#baseGrad)" stroke="#FF8F00" strokeWidth="1" />
      <rect x="20" y="38" width="8" height="3" rx="1.5" fill="#FF8F00" />
      <path d="M8 12L11 15M40 12L37 15M24 2L24 5" stroke="#FFA726" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Icon3DStep2() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(255,109,0,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="micBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#FF6D00" />
        </linearGradient>
        <linearGradient id="micMesh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
      </defs>
      <rect x="18" y="6" width="12" height="20" rx="6" fill="url(#micBody)" stroke="#FFF" strokeWidth="1" />
      <rect x="19" y="8" width="10" height="10" rx="5" fill="url(#micMesh)" opacity="0.8" />
      <path d="M12 20V22C12 26.4183 15.5817 30 20 30H28C32.4183 30 36 26.4183 36 22V20" stroke="#FFA726" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 30V40M16 40H32" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 20C6 14 9 10 12 8M42 20C42 14 39 10 36 8" stroke="#FF6D00" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  );
}

function Icon3DStep3() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(255,109,0,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="clapperBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="orangeBar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6D00" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
      </defs>
      <rect x="8" y="18" width="32" height="24" rx="4" fill="url(#clapperBody)" stroke="#FF8F00" strokeWidth="1.5" />
      <circle cx="24" cy="30" r="7" fill="url(#orangeBar)" />
      <polygon points="22,26 28,30 22,34" fill="#FFFFFF" />
      <rect x="8" y="8" width="32" height="8" rx="2" fill="url(#orangeBar)" />
      <path d="M14 8L18 16M24 8L28 16M34 8L38 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Icon3DStep4() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_20px_rgba(255,109,0,0.6)] group-hover:scale-110 transition-transform duration-300">
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#FF6D00" />
        </linearGradient>
      </defs>
      <path d="M24 6C24 6 32 14 32 26H16C16 14 24 6 24 6Z" fill="url(#rocketBody)" stroke="#FF8F00" strokeWidth="1" />
      <circle cx="24" cy="18" r="4" fill="#0F172A" stroke="#FF6D00" strokeWidth="1.5" />
      <circle cx="24" cy="18" r="1.5" fill="#38BDF8" />
      <path d="M16 22L10 28V32L16 28V22Z" fill="#FF6D00" />
      <path d="M32 22L38 28V32L32 28V22Z" fill="#FF6D00" />
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
      title: '1. Upload your media',
      sub: 'Drop your voiceover, audio, images, or raw video',
      IconComponent: Icon3DStep1,
      badgeStyle: 'border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      iconBoxStyle: 'border-amber-500/40 bg-gradient-to-br from-amber-500/25 via-amber-500/10 to-[#151821] text-amber-400 shadow-amber-500/20 group-hover:border-amber-400 group-hover:shadow-amber-500/40',
      glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/25',
    },
    {
      number: 'STEP 02',
      title: '2. AI does the heavy work',
      sub: 'Smart transcription, scene pacing & motion layout',
      IconComponent: Icon3DStep2,
      badgeStyle: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
      iconBoxStyle: 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/25 via-cyan-500/10 to-[#151821] text-cyan-400 shadow-cyan-500/20 group-hover:border-cyan-400 group-hover:shadow-cyan-500/40',
      glowColor: 'bg-cyan-500/10 group-hover:bg-cyan-500/25',
    },
    {
      number: 'STEP 03',
      title: '3. Review your result',
      sub: 'Inspect captions, pacing, and visual style in real-time',
      IconComponent: Icon3DStep3,
      badgeStyle: 'border-purple-500/40 bg-purple-500/10 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.25)]',
      iconBoxStyle: 'border-purple-500/40 bg-gradient-to-br from-purple-500/25 via-purple-500/10 to-[#151821] text-purple-400 shadow-purple-500/20 group-hover:border-purple-400 group-hover:shadow-purple-500/40',
      glowColor: 'bg-purple-500/10 group-hover:bg-purple-500/25',
    },
    {
      number: 'STEP 04',
      title: '4. Download your video',
      sub: 'Export crisp 1080p Full HD MP4 ready to publish',
      IconComponent: Icon3DStep4,
      badgeStyle: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      iconBoxStyle: 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-[#151821] text-emerald-400 shadow-emerald-500/20 group-hover:border-emerald-400 group-hover:shadow-emerald-500/40',
      glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/25',
    },
  ];

  return (
    <section className="relative border-b border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-16 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF6D00]/10 blur-[140px] rounded-full" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100]">
            <Sparkles size={14} className="text-[#FF8F00] animate-pulse" />
            <span>How Itnavideo works</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Simple 4-step creation.{' '}
            <span className="text-[#FF8F00]">
              Zero timeline lag.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Upload → AI creates → Review → Download. From media to a published 1080p Full HD video in seconds.
          </p>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, sub, IconComponent, badgeStyle, iconBoxStyle, glowColor }) => (
            <article key={number} className="group relative flex flex-col items-center text-center rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl">
              {/* Step glowing micro-badge */}
              <span className={`absolute top-4 right-4 flex h-6 px-2.5 items-center justify-center rounded-full border font-mono text-[10px] font-black tracking-wider ${badgeStyle}`}>
                {number}
              </span>

              {/* Large 3D Micro-Illustration Container */}
              <div className={`mt-2 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[28px] border shadow-xl group-hover:scale-110 transition-all duration-300 relative ${iconBoxStyle}`}>
                <div className={`absolute inset-0 rounded-[28px] blur-md transition duration-300 ${glowColor}`} />
                <div className="relative z-10">
                  <IconComponent />
                </div>
              </div>

              <h3 className="mt-6 text-base sm:text-lg font-black text-white group-hover:text-[#FFA726] transition-colors">{title}</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{sub}</p>
            </article>
          ))}
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
      subtext: 'Pre-formatted 9:16 & 16:9 1080p exports.',
      Icon: CheckCircle2,
    },
  ];

  return (
    <section className="relative border-b border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100]">
            <CheckCircle2 size={14} className="text-[#FF8F00]" />
            <span>Why Creators Choose Itnavideo</span>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Built for creators,<br className="hidden sm:block" /> not editors.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Pick the outcome you want. The studio handles scene timing, subtitles, pacing, and 1080p rendering — you just press render.
          </p>
          <Link
            href="/video-types"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0F1117] px-6 py-3.5 text-sm font-black text-white shadow-md transition hover:border-[#FF6D00]/50 hover:bg-[#151821] hover:text-[#FFA726] active:scale-95"
          >
            <span>Compare all 11 video studios</span>
            <ArrowRight size={15} className="text-[#FF8F00]" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map(({ stat, title, subtext, Icon }) => (
            <article key={title} className="group rounded-[28px] border border-white/[0.07] bg-[#0F1117] p-5 shadow-lg transition-all duration-300 hover:border-[#FF6D00]/50 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#151821] text-[#FF9100] group-hover:border-[#FF6D00]/50 group-hover:text-[#FFA726] transition">
                  <Icon size={19} />
                </span>
                <span className="rounded-xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3 py-1 text-xs font-black text-[#FF9100] group-hover:bg-[#FF6D00] group-hover:text-black transition">
                  {stat}
                </span>
              </div>
              <h3 className="mt-4 text-base font-black text-white">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{subtext}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomepageFinalCta() {
  return (
    <section className="relative border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-16 overflow-hidden">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-[#FF6D00]/30 bg-gradient-to-b from-[#0F1117] via-[#12141A] to-[#050505] p-7 text-center shadow-2xl shadow-[#FF6D00]/10 sm:p-12">
        {/* Glow blur backgrounds */}
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#FF6D00]/15 blur-3xl" />
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#FFA726]/10 blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100] shadow-sm">
            <Sparkles size={14} className="text-[#FF8F00]" />
            <span>Ready to Create?</span>
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Ready to create your first{' '}
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
              AI video?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm font-semibold text-zinc-400">
            No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-4 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/30 transition hover:brightness-110 active:scale-95 sm:w-auto"
            >
              <span>Start Creating Free →</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-[#0F1117] px-7 py-4 text-sm font-bold text-white shadow-md transition hover:border-[#FF6D00]/50 hover:bg-[#151821] hover:text-[#FFA726] active:scale-95 sm:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
