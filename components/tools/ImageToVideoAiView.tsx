'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Film,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  Flame,
  Image as ImageIcon,
  Tv,
  Volume2,
  Layers,
  ZoomIn,
  MoveRight,
  Sparkle,
  Compass,
  Check,
  X,
} from 'lucide-react';

export default function ImageToVideoAiView() {
  const [activeMotion, setActiveMotion] = useState<'zoom' | 'pan' | 'parallax' | 'crossfade'>('zoom');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: "What is Image to Video AI, and how does it transform photos into documentary videos?",
      a: "Image to Video AI transforms still photos and voiceover narration into cinematic 16:9 widescreen videos. Our rendering engine automatically applies Ken Burns pan and zoom camera curves, smooth crossfade dissolves, 2.5D parallax subtitles, and background music auto-ducking in the cloud."
    },
    {
      q: "How does the AI synchronize image duration to spoken voiceover?",
      a: "Speech AI transcribes your audio with sub-second accuracy, detects sentence pauses and topic transitions, and automatically paces each photo so visual cuts align naturally with your spoken story."
    },
    {
      q: "What is the credit cost for Image to Video AI?",
      a: "Image to Video AI is priced strictly by video duration: 1 Min = 1 Credit (1 min = 1 credit, 2 min = 2 credits, 3 min = 3 credits, 4 min = 4 credits, up to 5 minutes maximum = 5 credits). Rendered in 1080p 16:9 widescreen MP4."
    },
    {
      q: "Do I need Adobe Premiere Pro or After Effects skills to create photo slideshows?",
      a: "Zero editing skills are needed. Traditional documentary slideshows require setting manual keyframes for scale, pan coordinates, and easing curves across multiple video tracks—taking 4+ hours per video. Itnavideo handles all motion keyframing automatically."
    },
    {
      q: "Can I upload vertical or square photos for 16:9 widescreen videos?",
      a: "Yes. Our engine intelligently crops or frames vertical and square photos with blurred aesthetic backdrops, ensuring zero awkward black bars appear in your 16:9 video."
    },
    {
      q: "What camera motion styles are available?",
      a: "Includes Ken Burns Slow Zoom In, Slow Zoom Out, Left-to-Right Panning, Whip Dissolve, and 2.5D Parallax subtitle typography overlays."
    },
    {
      q: "What background music tracks are provided?",
      a: "You get access to a curated library of documentary orchestral beds, ambient acoustic tracks, and minimal cinematic pulses that automatically duck (-14dB) behind your spoken narration."
    },
    {
      q: "What video length and resolution are exported?",
      a: "Videos are exported in 16:9 Widescreen (1920x1080 at 30 FPS MP4) optimized for YouTube, supporting durations from 30 seconds up to 5 full minutes (300 seconds)."
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Itnavideo Image to Video AI Generator',
    operatingSystem: 'Web-based App',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Transform voiceover audio and photos into cinematic 16:9 widescreen videos with Ken Burns camera motion and transitions.',
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1] max-w-5xl mx-auto">
            Transform Photos &amp; Voiceovers Into 16:9 Widescreen Cinematic Videos
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
            Turn static photos and voiceover narration into broadcast-grade 1080p videos with dynamic Ken Burns pan/zoom motion, crossfade transitions, 2.5D parallax subtitles, and ambient background music.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=imageToVideoAi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <span>Convert Images to Video Free</span>
            </Link>
            <a
              href="#motion-studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <Film size={18} className="text-purple-600" />
              <span>Explore Camera Motion Studio</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-medium text-slate-500 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Ken Burns 2.5D Camera Panning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Speech-Sync Scene Pacing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Cinematic Crossfade Transitions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>1 Min = 1 Credit (16:9 Up to 5m)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CAMERA MOTION STUDIO INTERACTIVE */}
      <section id="motion-studio" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Interactive Ken Burns Camera Motion Studio
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Test how camera curves and transitions elevate static photos into fluid, television-quality documentary scenes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {/* Motion Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {[
                { id: 'zoom', label: '🔍 Slow Zoom In', desc: 'Focus camera curve' },
                { id: 'pan', label: '🔭 Sweeping Pan', desc: 'Horizontal landscape sweep' },
                { id: 'parallax', label: '✨ 2.5D Parallax Subtitles', desc: 'Depth layer typography' },
                { id: 'crossfade', label: '🌊 Cinematic Crossfade', desc: 'Seamless scene dissolve' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMotion(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    activeMotion === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 16:9 Canvas Mockup */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center p-6 sm:p-12 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/40 via-slate-950 to-slate-950" />

              {/* View 1: Slow Zoom In */}
              {activeMotion === 'zoom' && (
                <div className="relative z-10 text-center space-y-4 max-w-md">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 text-xs font-semibold">
                    <ZoomIn size={14} />
                    <span>Scale Curve: 1.00x → 1.15x Easing</span>
                  </div>
                  <div className="h-44 w-72 mx-auto rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 p-4 flex flex-col justify-end shadow-2xl transform scale-105 transition-transform duration-700">
                    <div className="text-left">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Scene 01</span>
                      <h4 className="text-sm font-bold text-white">Mount Everest Base Camp Expedition</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Gentle forward camera zoom draws viewer focus into the subject, maintaining narrative momentum.
                  </p>
                </div>
              )}

              {/* View 2: Sweeping Pan */}
              {activeMotion === 'pan' && (
                <div className="relative z-10 text-center space-y-4 max-w-md">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 text-xs font-semibold">
                    <MoveRight size={14} />
                    <span>Horizontal Drift: -40px → +40px Sweep</span>
                  </div>
                  <div className="h-44 w-80 mx-auto rounded-xl bg-gradient-to-r from-blue-900/60 via-slate-800 to-indigo-900/60 border border-slate-600 p-4 flex flex-col justify-end shadow-2xl">
                    <div className="text-left">
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Scene 02</span>
                      <h4 className="text-sm font-bold text-white">Ancient Rome Architectural Wonders</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Sweeping left-to-right drift simulates a high-end tripod pan across wide landscape photographs.
                  </p>
                </div>
              )}

              {/* View 3: 2.5D Parallax Subtitles */}
              {activeMotion === 'parallax' && (
                <div className="relative z-10 text-center space-y-4 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-semibold">
                    <Sparkle size={14} />
                    <span>Multi-Plane Kinetic Typography</span>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-2xl">
                    <p className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
                      "In 1912, the grandest ship in human history departed on its fateful voyage."
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-mono">
                      <span>Word Sync Active</span>
                      <span>•</span>
                      <span>Karaoke Highlights</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 4: Cinematic Crossfade */}
              {activeMotion === 'crossfade' && (
                <div className="relative z-10 text-center space-y-4 max-w-md">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 text-xs font-semibold">
                    <Compass size={14} />
                    <span>1.2s Hermite Smooth Dissolve</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 h-36">
                    <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3 flex flex-col justify-end opacity-40">
                      <span className="text-[10px] text-slate-400 font-mono">Photo A (Out)</span>
                      <span className="text-xs font-bold text-slate-300">Previous Scene</span>
                    </div>
                    <div className="rounded-xl bg-slate-800 border border-purple-500 p-3 flex flex-col justify-end ring-2 ring-purple-500/30">
                      <span className="text-[10px] text-purple-400 font-mono">Photo B (In)</span>
                      <span className="text-xs font-bold text-white">Next Scene</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Smooth Hermite crossfade blends overlapping images seamlessly with zero jarring cuts.
                  </p>
                </div>
              )}

              {/* Canvas Status Bar */}
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                  <span>1080p 16:9 YouTube Widescreen</span>
                </div>
                <span>Strictly 1 Min = 1 Credit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE STORYTELLING REVOLUTION */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Why Static Slideshows Lose Viewers (And How Ken Burns Fixes It)
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Static photo slideshows feel flat and dated. When a video displays still images without motion, viewer brain engagement drops immediately—resulting in high drop-off rates on YouTube documentaries and education modules.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                The famous <strong className="text-slate-900 font-semibold">Ken Burns motion effect</strong> slow-pans and zooms across still photographs, mimicking the camera movement of television documentaries produced by the BBC and National Geographic.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                With Itnavideo, you simply upload your voiceover and photos. The cloud engine calculates exact sentence timing and applies camera motion curves automatically.
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Broadcast Documentary Polish</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Smooth camera easing transforms static image uploads into television-grade educational documentaries.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">45-Second Cloud Render</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Cloud engine renders all camera motion keyframes, transitions, and audio ducking in under 45 seconds.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">1 Min = 1 Credit</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fair, transparent pricing for long-form creators. Produce up to 5-minute widescreen videos effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 6 CORE CAPABILITIES */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              6 Built-In Photo-to-Video Production Capabilities
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Everything needed to produce professional 16:9 documentary videos without tedious keyframing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 mb-5">
                <Film size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Ken Burns Motion</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Eliminates manual scale and position timeline keyframing in Premiere or Final Cut. Every image moves with gentle documentary easing.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Zero manual keyframes needed.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-5">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Speech-Sync Scene Timing</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Groq Whisper transcribes speech to identify sentence boundaries, automatically calculating the exact frame duration for every photo.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Cuts match spoken natural beats.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2.5D Parallax Subtitles</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Multi-plane typography floats above your moving images with subtle drop shadows, making narration easy to follow silently.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Crystal-clear readability.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 mb-5">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart 16:9 Letterbox Fill</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Got vertical phone photos or vintage archives? Our engine applies soft gaussian blur backdrops so awkward black bars never appear.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Works with any photo dimensions.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 mb-5">
                <Volume2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Documentary Soundtracks</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Atmospheric orchestral textures and ambient soundscapes that auto-duck beneath voiceover narration to keep speech crystal clear.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Auto -14dB speech ducking.
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5">
                <Tv size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Up to 5 Minutes (300s)</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Ideal for in-depth historical documentaries, real estate tours, and case study explainers with hundreds of photos.
              </p>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs font-medium text-slate-700">
                <strong className="text-slate-900">Itnavideo Engine:</strong> Strictly 1 Min = 1 Credit.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STEP BY STEP WORKFLOW */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              How It Works in 3 Simple Steps
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Produce documentary-grade 16:9 widescreen videos in under a minute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-purple-600 block mb-3">01</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Voiceover Audio</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Upload your voice recording or script. Groq Whisper transcribes your narration and extracts sentence-level cut points.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto speech transcription &amp; beat timing
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-indigo-600 block mb-3">02</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Photos &amp; Images</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Drop your JPG or PNG photos. The engine arranges images to match your narration beats and applies Ken Burns motion curves.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ Auto pan/zoom motion curves
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-3xl font-extrabold text-emerald-600 block mb-3">03</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export 1080p 16:9 Video</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download a broadcast-ready 1080p widescreen MP4 with ambient music and subtitles, ready to publish on YouTube.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                ✓ 1 Min = 1 Credit • Cloud Render in ~45s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Manual Timeline Editing vs. Itnavideo Image to Video AI
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Why documentary creators choose our automated cloud pipeline over manual NLE software.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-5 text-xs font-bold uppercase text-slate-600">Production Feature</th>
                  <th className="p-5 text-xs font-bold uppercase text-rose-600">Manual Video Editing</th>
                  <th className="p-5 text-xs font-bold uppercase text-emerald-700 bg-emerald-50/60">Itnavideo Image to Video AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Production Time per Video</td>
                  <td className="p-5 text-slate-600">4 to 8 hours per video</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Under 45 seconds</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Ken Burns Motion Curves</td>
                  <td className="p-5 text-slate-600">Manual position &amp; scale keyframing per photo</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Automated easing curves &amp; panning sweeps</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Speech-Sync Scene Timing</td>
                  <td className="p-5 text-slate-600">Manual waveform listening &amp; razor cutting</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Sub-second sentence detection via Groq Whisper</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Background Audio Balancing</td>
                  <td className="p-5 text-slate-600">Manual volume keyframing and audio compression</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Auto -14dB ducking behind voiceover speech</td>
                </tr>
                <tr>
                  <td className="p-5 font-semibold text-slate-900">Cost per Video</td>
                  <td className="p-5 text-slate-600">$75 – $200 editor fee</td>
                  <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30">Strictly 1 Min = 1 Credit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-slate-600 text-base">Everything you need to know about Image to Video AI.</p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-slate-900 text-white' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM ACTION CTA */}
      <section className="py-20 bg-slate-900 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Convert Your Photos Into Cinematic Videos Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Upload your audio narration and photos to create television-grade 16:9 widescreen documentaries in seconds.
          </p>
          <Link
            href="/dashboard?videoType=imageToVideoAi"
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition active:scale-95"
          >
            <Sparkles size={18} className="text-purple-600" />
            <span>Convert Images to Video Free</span>
          </Link>
          <div className="mt-4 text-xs text-slate-400">
            1 Min = 1 Credit (16:9 Up to 5m) • No Credit Card Required
          </div>
        </div>
      </section>
    </div>
  );
}