'use client';

import { Sparkles, ArrowRight, Play, Check } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTASection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32 bg-slate-950 text-white text-center overflow-hidden border-t border-slate-800">
      {/* Radial AI Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,rgba(37,99,235,0.25),transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-cyan-300 shadow-md">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <span>Start Creating In Minutes</span>
        </div>

        <h2 className="text-3xl font-black text-white sm:text-5xl md:text-6xl font-sans tracking-tight leading-tight">
          Don&apos;t Just Watch What Itnavideo Can Do.{' '}
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent font-black mt-1">
            Try It Yourself Now.
          </span>
        </h2>

        <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg font-medium leading-relaxed">
          Upload your audio, video, images, or script and let AI turn it into a professional, publish-ready video.
        </p>

        {/* Action Buttons with Glowing CTA */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-9 py-4 text-base font-black text-white shadow-xl shadow-blue-500/30 transition duration-300 hover:scale-105 hover:shadow-cyan-500/50 w-full sm:w-auto"
          >
            <span>Create Your First Video</span>
            <ArrowRight size={20} className="transition group-hover:translate-x-1.5" />
          </Link>

          <a
            href="#gallery"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-7 py-4 text-base font-bold text-white shadow-sm transition duration-200 hover:bg-white/20 w-full sm:w-auto"
          >
            <Play size={16} fill="currentColor" className="text-cyan-400" />
            <span>Explore Examples</span>
          </a>
        </div>

        {/* High-trust badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-2"><Check size={15} className="text-cyan-400" /> Free to explore</span>
          <span className="flex items-center gap-2"><Check size={15} className="text-cyan-400" /> Instant Groq transcription</span>
          <span className="flex items-center gap-2"><Check size={15} className="text-cyan-400" /> Remotion Lambda engine</span>
        </div>
      </div>
    </section>
  );
}

