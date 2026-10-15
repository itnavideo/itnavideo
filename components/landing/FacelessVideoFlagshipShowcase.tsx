'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Film,
  Subtitles,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';

export default function FacelessVideoFlagshipShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="faceless-video-flagship" className="relative w-full overflow-hidden bg-white py-16 sm:py-24 text-slate-900 border-b border-slate-200/80">
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-[500px] w-[900px] max-w-full rounded-full bg-orange-500/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>Flagship 16:9 Video Engine</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Faceless Video AI
          </h2>

          <p className="mt-3 text-lg font-bold bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent sm:text-2xl">
            More Than AI — Your Personal Editor.
          </p>

          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Turn any voiceover audio, podcast clip, or script into a complete 1080p Full HD 16:9 widescreen video with automated cinematic B-roll, subtitles, sound effects, and transitions.
          </p>
        </div>

        {/* Big Flagship 16:9 YouTube Showcase Player Mockup - Placed Right Under Heading */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="relative rounded-[28px] sm:rounded-[36px] p-2.5 sm:p-3.5 bg-gradient-to-b from-orange-500/20 via-slate-100 to-slate-200 border border-orange-500/30 shadow-[0_25px_80px_-20px_rgba(255,87,34,0.25)]">
            
            {/* Top YouTube Studio Bar */}
            <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-red-500" />
                <span className="flex h-3 w-3 rounded-full bg-amber-500" />
                <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-[11px] text-slate-500 font-semibold hidden sm:inline">
                  16:9 Widescreen • 1080p 30 FPS • YouTube Long-Form Videos (Up to 10 Minutes)
                </span>
              </div>
              <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {isPlaying ? 'PLAYING PREVIEW' : 'CLICK TO WATCH DEMO'}
              </span>
            </div>

            {/* Main Video Visual Preview Frame */}
            <div 
              className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] border border-slate-900/10 bg-[#070B14] cursor-pointer group"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src="https://res.cloudinary.com/dhouh9idx/video/upload/v1791489914/InShot_20261009_011644112_vtrkhq.mp4"
                poster="https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png"
                playsInline
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-auto object-cover max-h-[580px] transition-transform duration-700 group-hover:scale-[1.01]"
              />

              {/* Play Overlay Button */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px] transition-opacity">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-2xl shadow-orange-500/50 hover:scale-110 active:scale-95 transition-all duration-200">
                    <Play size={28} className="fill-white translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Floating Features Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 hidden sm:flex items-center justify-between rounded-2xl bg-black/80 p-3.5 backdrop-blur-md border border-white/10 text-white">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-orange-400">
                    <Film size={14} /> Auto B-Roll Matching
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Subtitles size={14} /> Kinetic Subtitles
                  </span>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
                  </button>
                </div>
                <Link
                  href="/dashboard/faceless-video"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-4 py-2 text-xs font-black text-white hover:brightness-110 shadow-md transition"
                >
                  <span>Launch Faceless Studio</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Key Faceless Video Capabilities Cards - Strictly 16:9 */}
          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs hover:border-orange-500/40 transition">
              <p className="text-xs font-black text-slate-900">📚 Book Summaries</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Chapter-by-chapter visuals</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs hover:border-orange-500/40 transition">
              <p className="text-xs font-black text-slate-900">📺 YouTube Explainers</p>
              <p className="text-[11px] text-slate-500 mt-0.5">16:9 Widescreen 1080p</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs hover:border-orange-500/40 transition">
              <p className="text-xs font-black text-slate-900">🎙️ Voiceover Sync</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Automatic B-roll &amp; audio</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs hover:border-orange-500/40 transition">
              <p className="text-xs font-black text-slate-900">⏱️ Up to 10 Minutes</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Long-form YouTube videos</p>
            </div>
          </div>

          {/* Central CTA Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard/faceless-video"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 transition duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles size={18} className="text-white" />
              <span>Create Faceless Video AI</span>
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
