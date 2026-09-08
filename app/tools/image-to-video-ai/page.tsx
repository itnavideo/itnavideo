import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Film, Sparkles, Layers, Sliders, Music, Zap, Video } from "lucide-react";

export const metadata: Metadata = {
  title: "Image to Video AI – Turn Voiceover & Photos into 16:9 Cinematic Videos | Itnavideo",
  description: "Upload your voiceover and any number of images. AI synchronizes scenes per line, applies Ken Burns pan & zoom camera motion, 2.5D parallax subtitles, and cinematic transitions. Up to 10 minutes at 30 FPS.",
  alternates: { canonical: "/tools/image-to-video-ai" },
  openGraph: {
    title: "Image to Video AI – 16:9 Cinematic Video Generator",
    description: "Transform voiceover narration and photos into 16:9 widescreen videos with Ken Burns motion, 2.5D subtitles, and background music.",
    images: ["https://res.cloudinary.com/dhouh9idx/image/upload/v1788780290/ChatGPT_Image_Sep_7_2026_04_53_09_PM_suv9x7.png"],
  },
};

export default function ImageToVideoAiPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0a0a0f' }}>
      {/* Hero Section */}
      <section className="px-4 pb-12 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}>
            <Film size={14} />
            16:9 Widescreen • 30 FPS • Max 10 Min
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl tracking-tight">
            Image to Video AI<br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
              Turn Voiceover &amp; Photos into Cinematic 16:9 Videos
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg text-zinc-300">
            Upload your audio voiceover and any number of images. Our AI automatically extracts the script, cuts scenes per line of thought, applies smooth Ken Burns camera pan &amp; zoom, 2.5D parallax subtitles, and seamless audio ducking.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard?videoType=image-to-video-ai"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20 brand-btn-primary-dark"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
            >
              Open Image to Video AI
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            1 minute of generated video = 2 credits • No image limit • Auto-curated library fallback
          </p>
        </div>
      </section>

      {/* Visual Infographic & Background System Architecture */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-purple-500/25 bg-purple-950/20 p-2 sm:p-4 shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="mb-3 px-3 pt-2 text-center sm:text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-300">
                System Workflow &amp; Architecture Overview
              </span>
              <p className="text-sm font-semibold text-zinc-300">
                How Image to Video AI synchronizes narration, motion, and visual assets behind the scenes
              </p>
            </div>
            <img
              src="https://res.cloudinary.com/dhouh9idx/image/upload/v1788780290/ChatGPT_Image_Sep_7_2026_04_53_04_PM_grkkjj.png"
              alt="Image to Video AI System Workflow and Background Architecture"
              className="w-full rounded-2xl border border-white/10 object-contain shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-2xl font-black sm:text-3xl">
            Built for Cinematic Storytelling
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-400 max-w-xl mx-auto">
            From automated sentence boundary detection to multi-layer Remotion rendering, every frame is crafted at 30 frames per second.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Film,
                title: "Scene Flow & Script Sync",
                desc: "High-precision Groq Whisper transcription detects complete sentences and narrative pauses to slice audio into perfectly timed scene intervals.",
                accent: "text-purple-400",
              },
              {
                icon: Sliders,
                title: "Ken Burns Camera Motion",
                desc: "1.0x to 1.18x continuous slow zoom in / zoom out with horizontal panning (left-to-right & right-to-left) to bring static images alive.",
                accent: "text-violet-400",
              },
              {
                icon: Layers,
                title: "2.5D Parallax Subtitles",
                desc: "Layered glassmorphic subtitle pills with spring-damped pop physics and subtle ambient drop shadows for effortless readability.",
                accent: "text-indigo-400",
              },
              {
                icon: Video,
                title: "Zero Limit on Images",
                desc: "Upload as many images as you want. If none are provided, the system seamlessly pulls curated 16:9 thematic visuals from Itnavideo.",
                accent: "text-sky-400",
              },
              {
                icon: Music,
                title: "BGM Upload & Auto-Ducking",
                desc: "Upload your custom background music with interactive volume control. Audio automatically ducks behind speech so your voice stands out.",
                accent: "text-emerald-400",
              },
              {
                icon: Zap,
                title: "Transition SFX Cues",
                desc: "Smooth dissolves, directional pushes, and synchronized whoosh sound effects give your video high-production Polish.",
                accent: "text-amber-400",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md transition hover:border-purple-500/30"
              >
                <div className={`mb-3 inline-flex rounded-xl p-2.5 bg-white/5 ${feature.accent}`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Flow */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-black sm:text-3xl">How It Works in 3 Steps</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload Audio",
                desc: "Upload any voiceover recording (MP3, WAV, M4A) up to 10 minutes long.",
              },
              {
                step: "02",
                title: "Add Visuals & BGM",
                desc: "Optionally add your images (no limit) or let AI select curated 16:9 visuals automatically.",
              },
              {
                step: "03",
                title: "1-Click Render",
                desc: "Watch AI sequence scenes, camera pans, 2.5D subtitles, and download your full 1080p 16:9 video.",
              },
            ].map((card) => (
              <div
                key={card.step}
                className="relative rounded-2xl border border-white/10 bg-zinc-900/40 p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-xs font-black text-purple-400 border border-purple-500/30">
                  {card.step}
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{card.title}</h4>
                <p className="text-xs leading-5 text-zinc-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-900/30 via-zinc-900/80 to-zinc-950 p-8 sm:p-12 text-center shadow-2xl">
          <Sparkles className="mx-auto mb-4 text-purple-400" size={32} />
          <h2 className="text-2xl font-black sm:text-4xl text-white mb-3">
            Start Creating with Image to Video AI
          </h2>
          <p className="mx-auto max-w-xl text-sm text-zinc-300 mb-8 leading-relaxed">
            Turn your narration into widescreen presentations, educational videos, and YouTube stories without spending hours in traditional video editors.
          </p>
          <Link
            href="/dashboard?videoType=image-to-video-ai"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white brand-btn-primary-dark transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}
          >
            Create Video Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
