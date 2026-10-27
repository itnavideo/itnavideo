"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clapperboard,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Start all moving video previews in muted loop on mount
  useEffect(() => {
    COMPARE_EXPLAINER_DEMO_VIDEOS.forEach((item) => {
      const vid = videoRefs.current[item.id];
      if (vid) {
        vid.muted = true;
        vid.play().catch(() => {
          // Handled silently for strict browser policies
        });
      }
    });
  }, []);

  const handleToggleSound = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (activeAudioId === id) {
      video.muted = true;
      setActiveAudioId(null);
    } else {
      // Mute all other videos first
      COMPARE_EXPLAINER_DEMO_VIDEOS.forEach((item) => {
        const otherVid = videoRefs.current[item.id];
        if (otherVid && otherVid !== video) {
          otherVid.muted = true;
        }
      });
      video.muted = false;
      video.play().catch(() => {});
      setActiveAudioId(id);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-5">
      {/* Header with Title and Scroll Arrows */}
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

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <Clapperboard size={13} className="text-emerald-400" />
            <span>5 Live Cloud Demos</span>
          </span>

          {/* Carousel Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={scrollLeft}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-orange-500/50 hover:bg-white/10 hover:text-white transition active:scale-95 cursor-pointer shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-orange-500/50 hover:bg-white/10 hover:text-white transition active:scale-95 cursor-pointer shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Video Carousel Track with Live Moving Previews */}
      <div className="relative w-full">
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-1 px-1"
        >
          {COMPARE_EXPLAINER_DEMO_VIDEOS.map((item) => {
            const hasAudio = activeAudioId === item.id;

            return (
              <div
                key={item.id}
                className="relative flex-shrink-0 w-[200px] sm:w-[230px] md:w-[250px] snap-start select-none group"
              >
                <div
                  className={`relative w-full aspect-[9/16] rounded-[24px] overflow-hidden border transition-all duration-300 bg-[#070B14] shadow-xl group-hover:-translate-y-1 ${
                    hasAudio
                      ? "border-[#FF5722] ring-2 ring-[#FF5722]/50 shadow-[0_0_30px_rgba(255,87,34,0.35)]"
                      : "border-white/10 hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/10"
                  }`}
                >
                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/75 backdrop-blur-md px-2.5 py-0.5 text-[9.5px] font-black uppercase text-amber-400 shadow-md">
                      <Sparkles size={10} className="text-[#FF5722]" />
                      <span>{item.tag}</span>
                    </span>
                  </div>

                  {/* Sound Toggle Button (Top Right) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSound(item.id);
                    }}
                    className={`absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-lg ${
                      hasAudio
                        ? "bg-[#FF5722] border-[#FFA000] text-white"
                        : "bg-black/70 border-white/20 text-zinc-300 hover:text-white hover:bg-black/90"
                    }`}
                    title={hasAudio ? "Mute audio" : "Listen with audio"}
                  >
                    {hasAudio ? (
                      <Volume2 size={13} className="text-white animate-pulse" />
                    ) : (
                      <VolumeX size={13} />
                    )}
                  </button>

                  {/* Continuous Moving Video Preview Element */}
                  <video
                    ref={(el) => {
                      videoRefs.current[item.id] = el;
                    }}
                    src={item.videoUrl}
                    poster={item.posterUrl}
                    autoPlay
                    muted={!hasAudio}
                    loop
                    playsInline
                    preload="metadata"
                    onClick={() => handleToggleSound(item.id)}
                    className="absolute inset-0 h-full w-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Vignette for Text Legibility */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />

                  {/* Sound Play State Visual Pill */}
                  {!hasAudio && (
                    <div
                      onClick={() => handleToggleSound(item.id)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer z-15"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 border border-white/25 backdrop-blur-sm text-white group-hover:bg-[#FF5722] group-hover:scale-110 transition-all duration-300 shadow-xl opacity-80 group-hover:opacity-100">
                        <Play size={18} className="translate-x-0.5 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Video Metadata & Quick Action Overlay */}
                  <div className="absolute bottom-3 inset-x-3 z-20 space-y-2 pointer-events-auto">
                    <div className="pointer-events-none space-y-0.5">
                      <p className="text-xs font-black text-white leading-tight line-clamp-1 drop-shadow-md">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-zinc-300 font-medium line-clamp-1 drop-shadow-sm">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Pre-fill Compare Form Button */}
                    {onSelectTopicExample && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTopicExample(item.leftTopic, item.rightTopic);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 hover:border-orange-500/50 hover:bg-gradient-to-r hover:from-[#FF5722] hover:to-[#FFA000] hover:text-white py-1.5 px-2 text-[10px] font-bold text-zinc-200 transition-all cursor-pointer backdrop-blur-md shadow-sm active:scale-95"
                      >
                        <Check size={11} className="text-orange-400 group-hover:text-white" />
                        <span>Use {item.leftTopic} vs {item.rightTopic}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
