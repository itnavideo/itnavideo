'use client';

import Link from 'next/link';
import { ArrowLeft, AudioLines, Captions, Clapperboard, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';

const highlights = [
  { 
    icon: AudioLines, 
    label: 'Voice analysis & sync', 
    desc: 'Automatic Groq Whisper word timestamps & rhythm detection.' 
  },
  { 
    icon: Captions, 
    label: 'Dynamic caption animations', 
    desc: 'Kinetic typography, presenter stickers, and smart highlights.' 
  },
  { 
    icon: Clapperboard, 
    label: '1080p Full HD render engine', 
    desc: 'Cloud Remotion rendering with zero watermarks on all exports.' 
  },
];

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-[#080B11] px-4 py-12 sm:px-6 sm:py-20 text-white overflow-hidden flex items-center justify-center">
      {/* M3 Organic Ambient Glow Surfaces (Replaces harsh retro developer grid) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[550px] w-[550px] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full bg-orange-500/6 blur-[160px]" />
        {/* Soft radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,11,17,0.7)_70%,rgba(8,11,17,0.95)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl w-full gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        {/* Left Editorial Showcase Column */}
        <section className="hidden lg:block">
          <div className="mb-8">
            <BrandLogo size="md" showTagline />
          </div>

          <Link 
            href="/" 
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            <ArrowLeft size={15} />
            <span>Back to home</span>
          </Link>

          {/* M3 Tonal Eyebrow */}
          <div className="mb-6 flex items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 shadow-xs">
              <Sparkles size={14} className="text-amber-400" />
              <span>{eyebrow}</span>
            </div>
          </div>

          <h1 className="max-w-xl text-4xl sm:text-5xl font-black leading-[1.18] tracking-tight text-white font-sans">
            {title}
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-300/90 font-normal">
            {subtitle}
          </p>

          {/* M3 Elevated Tonal Highlight Cards */}
          <div className="mt-8 grid max-w-lg gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.label} 
                  className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-md p-3.5 transition-all duration-200 hover:border-amber-500/30 hover:bg-zinc-900/80 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 transition-transform duration-200 group-hover:scale-105">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{item.label}</h4>
                    <p className="text-xs text-zinc-400 font-normal">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Form Container Column */}
        <section className="mx-auto w-full max-w-md">
          <Link 
            href="/" 
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition-all hover:bg-white/10 hover:text-white lg:hidden"
          >
            <ArrowLeft size={14} />
            <span>Back to home</span>
          </Link>
          {children}
        </section>
      </div>
    </main>
  );
}

