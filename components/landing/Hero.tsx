'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  Sparkles, 
  Check, 
  Upload, 
  Captions, 
  Layers3, 
  FileText, 
  PenTool, 
  Film, 
  Download, 
  CheckCircle2, 
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';
import Link from 'next/link';

const HERO_MOCK_TYPES = [
  { id: 'auto-caption-reel', label: 'Auto Caption', icon: Captions, sample: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.mp4' },
  { id: 'compare-explainer', label: 'Compare Explainer', icon: Layers3, sample: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4' },
  { id: 'whiteboard-video', label: 'Whiteboard', icon: PenTool, sample: '/videos/demo-captions/demo-2.mp4' },
  { id: 'typography-video', label: 'Typography', icon: FileText, sample: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4' },
  { id: 'long-video-promo', label: 'Long Promo', icon: Film, sample: '/videos/demo-captions/demo-5.mp4' },
];

export default function Hero() {
  const [selectedType, setSelectedType] = useState(HERO_MOCK_TYPES[0]);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 pb-16 pt-24 text-slate-900 sm:px-6 sm:pb-24 sm:pt-32 border-b border-slate-200">
      {/* Background Subtle Grid & Warm Amber/Orange Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-10%,rgba(245,158,11,0.08),transparent_100%)]" />
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* LEFT: Hero Copy */}
          <div className="text-center lg:col-span-6 lg:text-left">
            {/* Top Google Analytics Accent Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-1.5 text-xs font-bold text-amber-800 shadow-xs"
            >
              <Sparkles size={13} className="text-amber-500 animate-pulse" />
              <span>Free AI Video Generator &amp; Platform • Free On Signup</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl text-slate-900 font-sans"
            >
              Free AI Video Generator &amp;{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent font-black">
                AI Video Maker
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium"
            >
              The all-in-one AI video creator. Turn text scripts, voiceovers, raw clips, and photos into viral Reels, Shorts, and 16:9 YouTube videos automatically.
            </motion.p>

            {/* Touch-Optimized CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5"
            >
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 px-8 py-4 text-base font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
              >
                <span>Create Your Video Free</span>
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-800 shadow-xs transition duration-200 hover:bg-slate-100 active:scale-95 w-full sm:w-auto"
              >
                <Play size={15} fill="currentColor" className="text-amber-500" />
                <span>See How It Works</span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-semibold text-slate-600"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                <Star size={13} className="text-amber-500 fill-amber-400" />
                <span>1,000+ Creators</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                <Zap size={13} className="text-amber-500" />
                <span>Groq Whisper Subtitles</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-2xs">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>No Credit Card Needed</span>
              </span>
            </motion.div>
          </div>

          {/* RIGHT: Modern Mobile-First Studio Window Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="lg:col-span-6 relative"
          >
            {/* Background Ambient Glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-600/25 via-orange-500/20 to-amber-500/25 blur-2xl opacity-70" />
            
            <div className="relative mx-auto max-w-lg rounded-3xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl p-3.5 sm:p-5 shadow-2xl shadow-orange-500/10 ring-1 ring-white/10">
              
              {/* Studio Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 bg-slate-950/60 px-3.5 py-2.5 rounded-2xl mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-1 text-[11px] font-bold text-slate-300 font-mono tracking-wide">
                    ITNAVIDEO STUDIO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Engine Ready</span>
                </div>
              </div>

              {/* Video Type Selector Bar */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {HERO_MOCK_TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedType.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition whitespace-nowrap ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={12} className={isSelected ? 'text-white' : 'text-amber-400'} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Workspace Preview */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-950/80 rounded-2xl p-3 border border-white/10 text-white">
                
                {/* Left Upload & Pipeline Stats (Hidden on mobile, visible on desktop) */}
                <div className="hidden sm:flex sm:col-span-5 flex-col justify-between space-y-3">
                  {/* Upload Box */}
                  <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-3 text-center">
                    <Upload size={16} className="mx-auto text-amber-400 mb-1" />
                    <p className="text-[11px] font-bold text-white">Input Content</p>
                    <p className="text-[9px] text-slate-400">narration-audio.mp3 • 4.2 MB</p>
                  </div>

                  {/* AI Progress Steps */}
                  <div className="space-y-1.5 bg-slate-900/90 p-2.5 rounded-xl border border-white/10">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400">AI Pipeline</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                      <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-amber-400" /> Groq Whisper</span>
                      <span className="font-mono text-amber-300">100%</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                      <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-amber-400" /> Scene Planner</span>
                      <span className="font-mono text-amber-300">Done</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                      <span className="flex items-center gap-1"><CheckCircle2 size={11} className="text-amber-400" /> Captions & FX</span>
                      <span className="font-mono text-amber-300">Synced</span>
                    </div>
                  </div>

                  {/* Canvas Info */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>1080x1920 (9:16)</span>
                    <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-bold text-amber-300 border border-amber-500/30">60 FPS</span>
                  </div>
                </div>

                {/* Live Video Preview Canvas (Full width on mobile, 7-col on sm) */}
                <div className="sm:col-span-7 relative flex flex-col items-center justify-center rounded-2xl bg-black overflow-hidden border border-white/15 aspect-[9/14] max-h-[380px] w-full max-w-[280px] mx-auto shadow-xl">
                  <video
                    key={selectedType.sample}
                    src={selectedType.sample}
                    poster="/preview/Auto Caption Reel.png"
                    preload="auto"
                    autoPlay={isPlaying}
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-2.5 flex items-center justify-between">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 active:scale-90 transition"
                    >
                      {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                    </button>
                    <span className="text-[9px] font-mono text-slate-300">00:14 / 00:30</span>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="mt-3 flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400">Template:</span>
                  <span className="text-[11px] font-bold text-amber-300">{selectedType.label}</span>
                </div>
                <Link
                  href={`/dashboard?videoType=${selectedType.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition active:scale-95"
                >
                  <Download size={13} />
                  <span>Create Now →</span>
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
