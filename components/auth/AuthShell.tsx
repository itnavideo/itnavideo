'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-[#070B14] px-4 py-8 sm:px-6 sm:py-12 text-white overflow-x-hidden flex items-center justify-center">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[560px] w-[560px] rounded-full bg-[#FF6D00]/10 blur-[160px]" />
        <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-[#FFA726]/8 blur-[160px]" />
        <div className="absolute -bottom-32 left-1/4 h-[520px] w-[520px] rounded-full bg-[#FF6D00]/6 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,11,20,0.6)_65%,rgba(7,11,20,0.98)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl w-full gap-8 lg:gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        {/* Left Editorial Showcase Column */}
        <section className="hidden lg:flex lg:flex-col lg:justify-between space-y-6">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <BrandLogo size="md" showTagline />
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:border-[#FF6D00]/40 hover:text-white active:scale-95"
              >
                <ArrowLeft size={14} />
                <span>Back to home</span>
              </Link>
            </div>

            {/* Minimal Punchy Typography */}
            <h1 className="max-w-xl text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.15] tracking-tight text-white font-sans">
              {title || (
                <>
                  Start Creating <span className="text-[#FF8F00]">Viral Videos</span> with AI.
                </>
              )}
            </h1>

            <p className="mt-3 max-w-lg text-sm sm:text-base font-normal leading-relaxed text-slate-400">
              {subtitle || "Claim 45 free render credits on signup. No credit card required."}
            </p>
          </div>

          {/* Transparent Presenter Image Showcase */}
          <div className="relative w-full flex flex-col items-center justify-end pt-2 min-h-[520px] overflow-hidden">
            {/* Subtle Soft Orange Ambient Glow (No Brown Circles) */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ background: 'radial-gradient(circle, rgba(255, 109, 0, 0.08) 0%, transparent 70%)' }}
            />

            <img
              src="/assets/auth/founder-presenter.png"
              alt="Executive Presenter in Charcoal Suit"
              className="relative z-10 max-h-[580px] lg:max-h-[660px] w-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] transition-transform duration-500 hover:scale-[1.01]"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
              }}
            />

            {/* Subtle Floating Quality Tag */}
            <div className="absolute bottom-3 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#070B14]/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 shadow-xl backdrop-blur-md">
              <Sparkles size={13} className="text-[#FF8F00] animate-pulse" />
              <span>AI Presenter • 1080p Full HD</span>
            </div>
          </div>
        </section>

        {/* Right Form Container Column */}
        <section className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <BrandLogo size="sm" />
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={13} />
              <span>Home</span>
            </Link>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}

