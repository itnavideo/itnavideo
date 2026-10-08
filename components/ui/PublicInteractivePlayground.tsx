"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Play, Pause, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Download, Wand2 } from "lucide-react";
import type { SeoContentPage } from "@/lib/seoContent";

type Props = {
  page: SeoContentPage;
};

const SAMPLE_AUDIOS = [
  {
    id: "finance",
    label: "💰 Finance & Numbers",
    text: "Rule number 1: Never invest in things you don't understand. A $2,000 mistake can set you back 5 years.",
    previewImg: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788688233/person_calculating_typing_laptop_npimij.png",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    accentWord: "$2,000 MISTAKE",
  },
  {
    id: "tech",
    label: "⚡ AI & Productivity",
    text: "Generative AI is changing video creation forever. 800,000 creators are using 1080p automated workflows.",
    previewImg: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788688233/person_calculating_typing_laptop_npimij.png",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    accentWord: "800,000 CREATORS",
  },
  {
    id: "story",
    label: "🎙️ Storytelling",
    text: "The greatest turning point came when we eliminated manual timeline editing and switched to automated scenes.",
    previewImg: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788688233/person_calculating_typing_laptop_npimij.png",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    accentWord: "TURNING POINT",
  },
];

export default function PublicInteractivePlayground({ page }: Props) {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_AUDIOS[0]);
  const [activeStyle, setActiveStyle] = useState<"realistic" | "2d" | "3d">("realistic");
  const [isPlaying, setIsPlaying] = useState(false);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomAudioName(file.name);
      setIsPlaying(false);
    }
  };

  const handleDownloadClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#0E1526]/90 p-5 shadow-2xl backdrop-blur-md">
      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black">
            <Wand2 size={15} className="font-bold" />
          </div>
          <span className="text-sm font-black uppercase tracking-wider text-white">
            Interactive Demo Studio
          </span>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
          ⚡ Instant No-Login Preview
        </span>
      </div>

      {/* Grid: Player Preview vs Quick Controls */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: 16:9 / 9:16 Video Stage Canvas */}
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070B14] shadow-inner group">
          {/* Preview Image with Ken Burns Zoom Effect */}
          <Image
            src={selectedSample.previewImg}
            alt="Demo Preview"
            fill
            className={`object-cover object-center transition-transform duration-700 ${isPlaying ? "scale-110" : "scale-100"}`}
          />

          {/* Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

          {/* Style Badge */}
          <div className="absolute top-3 left-3 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-bold text-amber-400 backdrop-blur-md uppercase tracking-wide">
            Style: {activeStyle}
          </div>

          {/* Center Play Button Overlay */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 z-20 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-lg shadow-[#FF6D00]/40 transition hover:scale-110 active:scale-95"
          >
            {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}
          </button>

          {/* Kinetic Impact Typography Overlay */}
          <div className="absolute inset-x-4 bottom-12 z-20 text-center">
            <div className="inline-block rounded-full border border-[#FF6D00]/50 bg-[#FF6D00]/20 px-3 py-0.5 text-[10px] font-black uppercase text-[#FF9100] mb-2 tracking-widest shadow-md">
              IMPACT BEAT
            </div>
            <div className="text-xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-amber-200 to-[#FF6D00] bg-clip-text text-transparent drop-shadow-md">
              "{selectedSample.accentWord}"
            </div>
            <p className="mt-1 text-xs text-zinc-300 font-medium line-clamp-2 px-2">
              {customAudioName ? `Audio: ${customAudioName}` : selectedSample.text}
            </p>
          </div>

          {/* Hidden HTML Audio Element */}
          <audio ref={audioRef} src={selectedSample.audioSrc} onEnded={() => setIsPlaying(false)} />
        </div>

        {/* Right: Quick Controls & Style Toggles */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            {/* Step 1: Select Audio or Upload */}
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
              1. Choose Sample or Upload Audio
            </label>
            <div className="space-y-2">
              {SAMPLE_AUDIOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSample(sample);
                    setCustomAudioName(null);
                    setIsPlaying(false);
                  }}
                  className={`w-full rounded-xl border p-2.5 text-left text-xs font-bold transition ${
                    selectedSample.id === sample.id && !customAudioName
                      ? "border-[#FF6D00] bg-[#FF6D00]/15 text-white"
                      : "border-white/10 bg-[#151E30] text-zinc-300 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{sample.label}</span>
                    <Sparkles size={12} className="text-[#FF8F00]" />
                  </div>
                </button>
              ))}

              {/* Upload Custom File Box */}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-[#151E30]/60 p-2.5 text-xs font-bold text-zinc-300 hover:border-[#FF6D00]/50 hover:text-white transition">
                <Upload size={14} className="text-[#FF8F00]" />
                <span>{customAudioName ? `Uploaded: ${customAudioName.slice(0, 20)}...` : "Drop 10s Audio File"}</span>
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Step 2: Select Visual Style Bucket */}
            <label className="mt-4 mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
              2. Select Visual Style
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(["realistic", "2d"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setActiveStyle(style)}
                  className={`rounded-lg border py-1.5 text-[11px] font-bold capitalize transition ${
                    activeStyle === style
                      ? "border-[#FF6D00] bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-black"
                      : "border-white/10 bg-[#151E30] text-zinc-300 hover:border-white/20"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleDownloadClick}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] p-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
            >
              <Download size={15} />
              <span>Download 1080p Full HD Video</span>
            </button>
            <p className="mt-2 text-center text-[10px] text-zinc-400">
              ✓ Free 10 Credits on Google Login • Zero Watermark
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal Gated Trigger */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0E1526] p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6D00]/20 text-[#FF9100] border border-[#FF6D00]/40">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-black text-white">Your 1080p HD Video is Ready!</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              Sign in with 1-click Google Auth to claim your <strong>10 Free Credits</strong> and download your Full HD video without watermark.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`/dashboard?type=${page.dashboardType}`}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-slate-900 hover:bg-slate-100 transition shadow-md"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </a>

              <button
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-zinc-400 hover:text-white transition"
              >
                Close and customize preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
