'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Sparkles, Users, Zap } from 'lucide-react';

/**
 * High-converting CTA section for dedicated template pages.
 * Shows urgency, social proof, and a clear value proposition.
 */
export function ConversionHook({
  templateName,
  dashboardUrl,
  accentColor = '#22C55E',
  inputType = 'video',
  outputTime = '3 minutes',
}: {
  templateName: string;
  dashboardUrl: string;
  accentColor?: string;
  inputType?: string;
  outputTime?: string;
}) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center sm:p-10">
          {/* Animated background glow */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full opacity-30 blur-3xl animate-pulse" style={{ background: accentColor }} />

          <div className="relative">
            {/* Icon with pulse */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full animate-bounce" style={{ background: `${accentColor}18`, border: `2px solid ${accentColor}40` }}>
              <Zap size={24} style={{ color: accentColor }} />
            </div>
            
            <h2 className="text-2xl font-black text-white sm:text-3xl leading-tight">
              Stop editing manually.<br />
              <span className="inline-block mt-1 bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #fff, ${accentColor})` }}>
                Let AI do it in {outputTime}.
              </span>
            </h2>
            
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-400">
              Upload your {inputType} → AI processes it → Download finished {templateName}. 
              No timeline editing, no learning curve, no wasted hours.
            </p>

            {/* Social proof */}
            <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Users size={11} style={{ color: accentColor }} /> Used by creators daily
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={11} style={{ color: accentColor }} /> Render: under {outputTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} style={{ color: accentColor }} /> 1080p paid exports, no watermark
              </span>
            </div>

            {/* Animated CTA Button */}
            <div className="mt-8">
              <Link
                href={dashboardUrl}
                className="group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-8 py-4 text-base font-black text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, boxShadow: `0 12px 30px ${accentColor}30` }}
              >
                {/* Shine animation */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]" />
                <span className="relative flex items-center gap-2.5">
                  Create Your {templateName} Now
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </span>
              </Link>
            </div>

            {/* Pricing hint */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-zinc-400 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              1 free AI video to start · Upgrade anytime for more
            </div>

            {/* Speed metrics */}
            <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3 text-center transition-colors hover:bg-white/[0.07]">
                <p className="text-xl font-black text-white">30s</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">Upload</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3 text-center transition-colors hover:bg-white/[0.07]">
                <p className="text-xl font-black text-white">&lt;{outputTime}</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">AI render</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3 text-center transition-colors hover:bg-white/[0.07]">
                <p className="text-xl font-black text-white">1080p</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">Download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Sticky bottom CTA bar — shows on mobile for immediate action.
 */
export function StickyBottomCTA({
  templateName,
  dashboardUrl,
  accentColor = '#22C55E',
}: {
  templateName: string;
  dashboardUrl: string;
  accentColor?: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0B1120]/95 backdrop-blur-lg px-4 py-3 sm:hidden">
      <Link
        href={dashboardUrl}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-black text-white shadow-lg"
        style={{ background: accentColor, boxShadow: `0 -4px 20px ${accentColor}40` }}
      >
        <Sparkles size={14} className="animate-pulse" />
        Create {templateName}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
