'use client';

import React from 'react';

const HERO_SHOWCASE_IMAGE_URL =
  'https://res.cloudinary.com/dhouh9idx/image/upload/v1794739932/Professional_Woman_Working_on_Laptop_xijtb0.png';

export default function BusyBusinessShowcase() {
  return (
    <section className="relative bg-white px-4 pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-100 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* EDITORIAL CALLOUT — DISTINCT SERIF FONT + MARKER HIGHLIGHT    */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          {/* Distinct Serif Font with Marker Highlight */}
          <p className="font-serif italic text-2xl sm:text-4xl lg:text-[40px] text-zinc-800 leading-[1.25] tracking-tight">
            Busy managing multiple businesses?{' '}
            <span className="font-sans font-black not-italic text-zinc-950 inline-block">
              With{' '}
              <span className="relative inline-block px-2.5 py-0.5 bg-amber-200/90 text-zinc-950 rounded-sm shadow-xs -rotate-1 border-b-2 border-amber-300">
                zero time to edit videos?
              </span>
            </span>
          </p>

          {/* Interesting Visual Flow with Arrow & Highlighter Accent (No Pills) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg text-zinc-700 font-sans">
            <span className="font-medium">
              Give us{' '}
              <span className="font-black text-zinc-950 bg-orange-100/90 px-2 py-0.5 rounded text-orange-950 border-b border-orange-200">
                10 minutes
              </span>{' '}
              of your voice
            </span>

            {/* Hand-drawn style directional arrow */}
            <svg
              className="w-10 h-6 text-orange-500 shrink-0 transform rotate-90 sm:rotate-0 my-1 sm:my-0"
              viewBox="0 0 42 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10H36M36 10L26 4M36 10L26 16" />
            </svg>

            <span className="font-extrabold text-zinc-950">
              AI delivers your fully ready-to-publish video.
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl mx-auto pt-1">
            Scene direction, B-roll visuals, kinetic typography, and soundtrack — completed while you work.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PURE TRANSPARENT LARGE IMAGE (EXACTLY AS IS, EXTRA LARGE)     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="mt-8 sm:mt-10 pb-4 mx-auto flex items-center justify-center">
          <img
            src={HERO_SHOWCASE_IMAGE_URL}
            alt="Professional business executive creating videos in 10 minutes"
            className="w-full h-auto max-w-2xl sm:max-w-3xl lg:max-w-4xl object-contain select-none"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
