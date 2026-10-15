"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Play, Pause, Volume2, VolumeX, Clapperboard, Check } from "lucide-react";

export interface CompareDemoVideo {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  videoUrl: string;
  posterUrl: string;
  leftTopic: string;
  rightTopic: string;
}

export const COMPARE_EXPLAINER_DEMO_VIDEOS: CompareDemoVideo[] = [
  {
    id: "demo-1",
    title: "Dajjal & Yajooj Majooj",
    subtitle: "Rajesh vs Kaka Stickman Trial",
    tag: "Trending Story",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1792018840/Dajjal_aur_Yajooj_Majooj_ka_Khauf_%EF%B8%8F_Rajesh_Machis_aur_Kaka_par_sabse_bada_imtihan_Is_Stickm_ypizlo.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/so_2/v1792018840/Dajjal_aur_Yajooj_Majooj_ka_Khauf_%EF%B8%8F_Rajesh_Machis_aur_Kaka_par_sabse_bada_imtihan_Is_Stickm_ypizlo.jpg",
    leftTopic: "Rajesh",
    rightTopic: "Kaka",
  },
  {
    id: "demo-2",
    title: "Passport vs Visa",
    subtitle: "Viral Education Stickman Reel",
    tag: "Viral Education",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1792018841/Defference_between_Passport_And_Visa_viral_education_stickman_viralreels_passport_fwqrg5.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/so_2/v1792018841/Defference_between_Passport_And_Visa_viral_education_stickman_viralreels_passport_fwqrg5.jpg",
    leftTopic: "Passport",
    rightTopic: "Visa",
  },
  {
    id: "demo-3",
    title: "Indian Govt Departments",
    subtitle: "Explained in Simple Words",
    tag: "India Facts",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1792018841/Indian_Government_Departments_Explained_in_Simple_Words....._indiafacts_education_viralree_ww3kcr.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/so_2/v1792018841/Indian_Government_Departments_Explained_in_Simple_Words....._indiafacts_education_viralree_ww3kcr.jpg",
    leftTopic: "Department A",
    rightTopic: "Department B",
  },
  {
    id: "demo-4",
    title: "Coding vs Programming",
    subtitle: "Developer Concept Breakdown",
    tag: "Tech & Dev",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1792018839/Whats_The_Difference_Between_Coding_And_Programming._coding_programming_software_development_fopgdf.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/so_2/v1792018839/Whats_The_Difference_Between_Coding_And_Programming._coding_programming_software_development_fopgdf.jpg",
    leftTopic: "Coding",
    rightTopic: "Programming",
  },
  {
    id: "demo-5",
    title: "90% People Confuse These Two",
    subtitle: "Difference Trending Reel",
    tag: "Viral English",
    videoUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/v1792018839/90_People_Confuse_These_Two_learnenglish_difference_trendingreel_english_b19tsj.mp4",
    posterUrl:
      "https://res.cloudinary.com/dhouh9idx/video/upload/so_2/v1792018839/90_People_Confuse_These_Two_learnenglish_difference_trendingreel_english_b19tsj.jpg",
    leftTopic: "Word A",
    rightTopic: "Word B",
  },
];

interface CompareExplainerShowcaseProps {
  onSelectTopicExample?: (left: string, right: string) => void;
}

export function CompareExplainerShowcase({ onSelectTopicExample }: CompareExplainerShowcaseProps) {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (activePlayingId === id) {
      video.pause();
      setActivePlayingId(null);
    } else {
      // Pause any previously playing video
      if (activePlayingId && videoRefs.current[activePlayingId]) {
        videoRefs.current[activePlayingId]?.pause();
      }
      video.muted = isMuted;
      video.play().catch(() => {});
      setActivePlayingId(id);
    }
  };

  const handleToggleMute = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const video = videoRefs.current[id];
    if (video) {
      video.muted = nextMuted;
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-2">
            <Sparkles size={13} className="text-[#FF5722]" />
            <span>Real Creator Showcases</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Featured Compare Explainer Reels</span>
            <span className="text-xs font-bold text-zinc-400 font-normal">
              (9:16 Vertical Shorts · 1080p)
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Watch real viral shorts produced with Itnavideo&apos;s dual split-screen, stickman presenter reactions, and synced kinetic captions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <Clapperboard size={13} className="text-emerald-400" />
            <span>5 Live Cloud Demos</span>
          </span>
        </div>
      </div>

      {/* 5 Video Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {COMPARE_EXPLAINER_DEMO_VIDEOS.map((item) => {
          const isPlaying = activePlayingId === item.id;

          return (
            <div
              key={item.id}
              className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 overflow-hidden ${
                isPlaying
                  ? "border-[#FF5722] bg-[#070B14] shadow-[0_0_25px_rgba(255,87,34,0.35)] ring-2 ring-[#FF5722]/50 scale-[1.02]"
                  : "border-white/10 bg-[#070B14]/80 hover:border-white/30 hover:bg-[#070B14]"
              }`}
            >
              {/* Top Category Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1">
                <span className="rounded-full bg-black/70 backdrop-blur-md border border-white/15 px-2 py-0.5 text-[9px] font-black uppercase text-orange-300 shadow-md">
                  {item.tag}
                </span>
              </div>

              {/* Mute Toggle on Video */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={(e) => handleToggleMute(e, item.id)}
                  className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:bg-black transition active:scale-90"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-orange-400" />}
                </button>
              )}

              {/* 9:16 Video Player Container */}
              <div
                onClick={() => handleTogglePlay(item.id)}
                className="relative aspect-[9/16] w-full bg-black overflow-hidden cursor-pointer select-none"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[item.id] = el;
                  }}
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  playsInline
                  loop
                  preload="metadata"
                  onEnded={() => setActivePlayingId(null)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient vignette for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                {/* Play / Pause Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 shadow-xl ${
                      isPlaying
                        ? "bg-black/60 text-white opacity-0 group-hover:opacity-100"
                        : "bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-black opacity-90 group-hover:opacity-100 group-hover:scale-110 shadow-[#FF5722]/50"
                    }`}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5 fill-black" />}
                  </div>
                </div>

                {/* Bottom title info over video */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-10 space-y-0.5 pointer-events-none">
                  <p className="text-[11px] font-black text-white leading-tight line-clamp-1 drop-shadow-md">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-zinc-300 font-medium line-clamp-1 drop-shadow-sm">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Footer: Quick Use Concept */}
              {onSelectTopicExample && (
                <div className="p-2 border-t border-white/10 bg-[#0E1526]/60">
                  <button
                    type="button"
                    onClick={() => onSelectTopicExample(item.leftTopic, item.rightTopic)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300 py-1.5 px-2 text-[10px] font-bold text-zinc-300 transition cursor-pointer"
                  >
                    <Check size={11} className="text-orange-400" />
                    <span>Use {item.leftTopic} vs {item.rightTopic}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
