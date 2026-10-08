'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  MousePointer2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#050505] px-4 pb-16 pt-24 text-white sm:px-6 sm:pb-28 sm:pt-32">
      {/* InVideo Style Blueprint Grid Background */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 35%, black 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 35%, black 40%, transparent 100%)',
        }}
      />

      {/* Dark Ambient Radial Glows */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[450px] w-[800px] max-w-full rounded-full bg-gradient-to-tr from-[#FF6D00]/20 via-[#FF8F00]/10 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full bg-[#FF6D00]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-[#FFA726]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        {/* Floating InVideo Style User Cursor Badges */}
        <div className="relative mx-auto max-w-4xl">
          {/* Cursor Badge 1: Top Left - "You" (Amber/Orange) */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: [0, -6, 0], y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 left-2 z-20 hidden sm:flex items-center gap-1.5"
          >
            <MousePointer2 className="h-5 w-5 text-amber-400 fill-amber-500 drop-shadow-md -rotate-12" />
            <span className="rounded-md bg-amber-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg border border-amber-400/40">
              You
            </span>
          </motion.div>

          {/* Cursor Badge 2: Top Right - "Andrew" (Emerald/Green) */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: [0, 8, 0], y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-8 right-4 z-20 hidden sm:flex items-center gap-1.5"
          >
            <MousePointer2 className="h-5 w-5 text-emerald-400 fill-emerald-500 drop-shadow-md -rotate-45" />
            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg border border-emerald-400/40">
              Andrew
            </span>
          </motion.div>

          {/* Cursor Badge 3: Bottom Left - "Anna" (Orange/Coral) */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: [0, -8, 0], y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-4 left-8 z-20 hidden sm:flex items-center gap-1.5"
          >
            <MousePointer2 className="h-5 w-5 text-[#FF6D00] fill-[#FF6D00] drop-shadow-md -rotate-12" />
            <span className="rounded-md bg-[#FF6D00] px-2 py-0.5 text-[11px] font-bold text-white shadow-lg border border-[#FFA726]/40">
              Anna
            </span>
          </motion.div>

          {/* Cursor Badge 4: Bottom Right - "Agent Two" (Violet/Purple) */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: [0, 6, 0], y: [0, 8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute -bottom-6 right-10 z-20 hidden sm:flex items-center gap-1.5"
          >
            <MousePointer2 className="h-5 w-5 text-purple-400 fill-purple-500 drop-shadow-md -rotate-45" />
            <span className="rounded-md bg-purple-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-lg border border-purple-400/40">
              Agent Two
            </span>
          </motion.div>


          {/* Main InVideo-Style Editorial Serif Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-normal leading-[1.06] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[82px] font-serif max-w-5xl mx-auto"
          >
            The AI Video Generator -{' '}
            <span className="italic font-normal text-[#FF8F00]">
              No editing needed
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-zinc-300 sm:text-xl"
          >
            Don't waste time on AI you have to babysit. Do what you love while Itnavideo's AI agents handle script, audio, visuals, and 1080p rendering.
          </motion.p>
        </div>

        {/* InVideo Centered Light Button & Secondary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-white/10 transition duration-200 hover:bg-slate-100 hover:scale-[1.02] active:scale-95"
          >
            <span>Start Creating Free</span>
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>

          <a
            href="#video-types"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-zinc-200 backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95"
          >
            <span>Or explore 11 specialized AI studios →</span>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-400"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" /> 3 free videos on signup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#FF8F00]" /> No credit card required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap size={14} className="text-[#FF8F00]" /> Instant 1080p Cloud Export
          </span>
        </motion.div>

        {/* Platform Compatibility Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          <span className="text-xs font-semibold text-zinc-400 mr-1">Exports 1080p Full HD for:</span>
          
          {/* YouTube */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0D0D0D]/90 px-3.5 py-1.5 text-xs font-bold text-zinc-200 shadow-sm backdrop-blur-md hover:border-[#FF6D00]/40 transition">
            <svg className="h-3.5 w-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube 16:9</span>
          </div>

          {/* YouTube Shorts */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0D0D0D]/90 px-3.5 py-1.5 text-xs font-bold text-zinc-200 shadow-sm backdrop-blur-md hover:border-[#FF6D00]/40 transition">
            <svg className="h-3.5 w-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M17.77 10.32l-1.2-.5L18 8.71a4.34 4.34 0 0 0-5.83-5.83l-6.07 3.5A4.34 4.34 0 0 0 8.23 14l1.2.5L8 15.81a4.34 4.34 0 0 0 5.83 5.83l6.07-3.5a4.34 4.34 0 0 0-2.13-7.82zM9.54 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Shorts 9:16</span>
          </div>

          {/* TikTok */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0D0D0D]/90 px-3.5 py-1.5 text-xs font-bold text-zinc-200 shadow-sm backdrop-blur-md hover:border-[#FF6D00]/40 transition">
            <svg className="h-3.5 w-3.5 text-cyan-400 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.32 1.55-1.28 2.55.03.88.52 1.72 1.28 2.18.82.49 1.88.52 2.73.08.82-.41 1.39-1.26 1.43-2.18.06-3.83.02-7.66.03-11.49z"/>
            </svg>
            <span>TikTok</span>
          </div>

          {/* Instagram Reels */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0D0D0D]/90 px-3.5 py-1.5 text-xs font-bold text-zinc-200 shadow-sm backdrop-blur-md hover:border-[#FF6D00]/40 transition">
            <svg className="h-3.5 w-3.5 text-pink-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 2.156 4.919 5.419.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 5.271-4.919 5.419-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-2.199-4.919-5.42-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-5.271 4.919-5.419 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram Reels</span>
          </div>
        </motion.div>

        {/* Wide Studio Showcase Image (Seamless Feather Fade Blend into Canvas) */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12 mx-auto max-w-5xl"
        >
          {/* Ambient Emerald/Cyan Backlight Glow behind floating screens */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[380px] w-[90%] rounded-full bg-emerald-500/15 blur-[120px]" />

          {/* Main Image Mask Container with Radial & Linear Edge Feather Fade */}
          <div 
            className="relative aspect-[16/9] w-full overflow-hidden"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 98%)',
              maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 98%)',
            }}
          >
            {/* Top Edge Fade Overlay */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10" />

            {/* Bottom Edge Fade Overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />

            {/* Left Edge Fade Overlay */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-10" />

            {/* Right Edge Fade Overlay */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#050505] via-[#050505]/70 to-transparent z-10" />

            {/* Studio Desk & Floating Screens Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dhouh9idx/image/upload/v1790376849/itnavideo-assets/dashboard/reels.dashboard.png"
              alt="Itnavideo AI Studio Editor"
              className="h-full w-full object-cover object-center scale-[1.02]"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
