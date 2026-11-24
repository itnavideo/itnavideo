'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PLATFORM_MODE_CONFIG } from '@/lib/config/platformMode';
import { supabase } from '@/lib/supabase/client';
import { getAuthRedirectUrl } from '@/lib/supabase/redirect';

function GoogleSvgIcon({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 10.03 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

const CREATOR_AVATARS = [
  'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018755/USA_Male_YouTube_Creator_axj5rd.jpg',
  'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018755/UK_Female_Video_Agency_Owner_adhqor.jpg',
  'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/Saudi_Arabia_Female_Content_Creator_wycpcd.jpg',
  'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/USA_Female_Technology_Educator_rxlo0i.jpg',
  'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018757/Dubai_UAE_Male_Tech_Podcaster_fipqvv.jpg',
];

export default function Hero() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl('/dashboard'),
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google sign-in error:', err);
      window.location.href = '/login?mode=signup';
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-12 sm:pt-18 sm:pb-16 px-4 sm:px-6 lg:px-8 text-zinc-950 border-b border-zinc-200/80">

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ATMOSPHERIC STUDIO LIGHTING & WARM AMBER-ORANGE AURAS         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Subtle Dot-Matrix Grid with Center Radial Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:28px_28px] opacity-60"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 25%, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 25%, black 40%, transparent 90%)',
        }}
      />

      {/* Luminous Warm Orange Studio Halo (Hero Glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -top-28 h-[460px] sm:h-[560px] w-[750px] sm:w-[1000px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse 65% 45% at 50% 35%, rgba(249, 115, 22, 0.09) 0%, rgba(234, 88, 12, 0.04) 40%, transparent 75%)',
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN HERO CONTENT STACK                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">

        {/* High-Impact Executive Headline with Radiant Sunset Orange Accent */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-[-0.04em] text-zinc-950 leading-[1.08] sm:leading-[1.04] max-w-4xl mx-auto font-sans">
          Don&apos;t edit,{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
            just speak.
          </span>
        </h1>

        {/* Sophisticated Editorial Subtitle */}
        <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-base sm:text-xl font-normal leading-relaxed text-zinc-600 font-sans px-3">
          Upload audio or video. Get a complete, studio-quality video in minutes with AI.
        </p>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* DUAL CTA BUTTONS & HANDWRITTEN ANNOTATION (INSPIRED DESIGN)   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative mt-8 sm:mt-10 flex flex-col items-center">
          
          {/* Handwritten note with curved doodle arrow (Desktop / Tablet) */}
          <div className="hidden md:flex items-start gap-1 absolute -bottom-10 lg:-bottom-12 left-4 lg:left-12 -rotate-6 pointer-events-none select-none z-20">
            <div className="text-left font-['Caveat',cursive] text-lg lg:text-xl font-bold text-emerald-600 leading-tight">
              <span>Set up once.</span>
              <br />
              <span>Create videos on repeat</span>
            </div>
            <svg
              className="w-8 h-8 text-emerald-600 shrink-0 transform -rotate-6 -mt-2 ml-0.5"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hand-drawn curved arrow pointing up-right toward the buttons */}
              <path d="M10 32 C14 18, 22 10, 32 6" />
              <path d="M22 6 L32 6 L30 16" />
            </svg>
          </div>

          {/* Dual Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto z-10">
            
            {/* Button 1: Join with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full sm:rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 hover:border-zinc-300 px-6 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-zinc-800 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-[0.98]"
            >
              <GoogleSvgIcon className="w-5 h-5 shrink-0" />
              <span>{isGoogleLoading ? 'Connecting...' : 'Join with Google'}</span>
            </button>

            {/* Button 2: Get Started for Free */}
            <Link
              href="/dashboard"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 rounded-full sm:rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:via-amber-500 hover:to-orange-600 px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold text-white shadow-[0_12px_28px_-6px_rgba(249,115,22,0.45),0_4px_16px_rgba(249,115,22,0.2)] hover:shadow-[0_16px_36px_-6px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Sparkles size={17} className="text-white group-hover:rotate-12 transition-transform" />
              <span>Get Started for Free</span>
              <ArrowRight size={17} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Social Proof Strip: Creator Avatars + 5 Gold Stars */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="flex -space-x-2 overflow-hidden items-center py-0.5">
              {CREATOR_AVATARS.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt="Creator avatar"
                  className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover shadow-2xs"
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-700">
              <div className="flex items-center text-amber-500 text-xs tracking-wider">
                ★★★★★
              </div>
              <span className="font-semibold text-zinc-800">
                Used by 4,200+ creators & founders
              </span>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STREAMLINED TRUST STRIP & PLAN PERKS                          */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-5 sm:mt-6 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 rounded-full bg-zinc-100 px-4 sm:px-5 py-2 text-xs font-medium text-zinc-600">
            <span className="text-zinc-950 font-bold shrink-0 text-orange-600">
              2 Free Video Downloads Every Day
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-600 shrink-0">
              No Credit Card Required
            </span>
            <span className="text-zinc-300 hidden md:inline">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
              <CheckCircle2 size={13} className="text-emerald-600" />
              No Watermark on Paid Plans
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
