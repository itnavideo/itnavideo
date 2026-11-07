'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';

export interface WatermarkRemoverToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  mediaType?: 'video' | 'image' | 'both';
  className?: string;
  label?: string;
  description?: string;
}

export function WatermarkRemoverToggle({
  enabled,
  onChange,
  mediaType = 'both',
  className = '',
  label = 'Auto-Remove AI Watermark & Logos',
  description,
}: WatermarkRemoverToggleProps) {
  const defaultDesc =
    mediaType === 'video'
      ? 'Automatically crops corner watermarks from Google Veo 3, Sora, Runway & Luma video generators.'
      : mediaType === 'image'
      ? 'Automatically crops corner logos from Google Gemini, Midjourney, DALL-E & Flux images.'
      : 'Auto-crops corner watermarks from Google Veo 3, Sora, Runway, Midjourney & Gemini.';

  return (
    <div
      onClick={() => onChange(!enabled)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(!enabled);
        }
      }}
      className={`group relative flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 cursor-pointer select-none ${
        enabled
          ? 'border-orange-500/40 bg-gradient-to-r from-orange-500/[0.08] via-amber-500/[0.04] to-transparent shadow-lg shadow-orange-500/5'
          : 'border-white/[0.08] bg-[#0C101A]/80 hover:border-white/15 hover:bg-[#0E1320]'
      } ${className}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Glow Icon Container */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            enabled
              ? 'bg-gradient-to-tr from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30'
              : 'border border-white/10 bg-white/5 text-slate-400 group-hover:text-white'
          }`}
        >
          <Sparkles size={18} className={enabled ? 'animate-pulse' : ''} />
        </div>

        {/* Text Info */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white font-sans tracking-tight">
              {label}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                enabled
                  ? 'border border-orange-500/30 bg-orange-500/15 text-orange-400'
                  : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {mediaType === 'video' ? 'Veo 3 · Sora' : mediaType === 'image' ? 'Gemini · Midjourney' : 'Veo 3 · Gemini · Sora'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-xl">
            {description || defaultDesc}
          </p>
        </div>
      </div>

      {/* Modern iOS-Style Toggle Switch */}
      <div className="shrink-0 flex items-center">
        <div
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${
            enabled
              ? 'bg-gradient-to-r from-orange-600 to-amber-600'
              : 'bg-zinc-800 border border-white/10'
          }`}
        >
          <span
            className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out mt-0.5 ${
              enabled ? 'translate-x-5 text-orange-500' : 'translate-x-0.5 text-zinc-400'
            }`}
          >
            {enabled && <Check size={11} strokeWidth={3} />}
          </span>
        </div>
      </div>
    </div>
  );
}
export default WatermarkRemoverToggle;

