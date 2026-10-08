"use client";

import Link from "next/link";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Film,
  Type,
  Mic,
  ArrowRight,
  Flame,
  CheckCircle2,
} from "lucide-react";

export default function AnnouncementsTab() {
  const updates = [
    {
      version: "v2.8.0 • Cloud Engine Upgrade",
      date: "September 2026",
      title: "1080p Full HD Cloud Rendering",
      badge: "Performance",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      description:
        "All 10 creation studios now render directly on our dedicated serverless cloud render fleet. Export 1080p Full HD 30/60 FPS MP4 videos in ~30 seconds without putting any CPU or RAM stress on your laptop.",
      highlights: [
        "Zero local rendering lag or memory freezing",
        "Crisp 1080×1920 (Shorts) and 1920×1080 (Cinema) outputs",
        "48-hour secure cloud asset lifecycle",
      ],
      icon: Zap,
    },
    {
      version: "v2.7.4 • Safe Zone Physics",
      date: "September 2026",
      title: "Automated Instagram Reels Safe-Zone Calibration",
      badge: "Algorithm",
      badgeColor: "bg-[#FF6D00]/20 text-[#FF9100] border-[#FF6D00]/40",
      description:
        "Auto Caption and Kinetic Typography templates now automatically position subtitles between Y=850px and Y=1250px, ensuring zero overlap with Instagram handles, captions boxes, audio pills, or TikTok side icons.",
      highlights: [
        "Zero clipping by like/comment buttons",
        "Optimized for human eye-level focal tracking",
        "Compatible with TikTok, Reels & YouTube Shorts",
      ],
      icon: ShieldCheck,
    },
    {
      version: "v2.6.0 • Financial Documentaries",
      date: "September 2026",
      title: "POV Finance & Compare Explainer Studio",
      badge: "New Studio",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      description:
        "Create Hollywood-grade split-screen financial documentaries like POV Finance and MagnatesMedia. Features dark obsidian #070B14 palette, glowing gold stats, and dynamic scene pacing.",
      highlights: [
        "Side-by-side asset comparison metrics",
        "High-RPM finance channel visual formatting",
        "1080p widescreen 16:9 & vertical 9:16 support",
      ],
      icon: Film,
    },
    {
      version: "v2.5.2 • Audio AI",
      date: "September 2026",
      title: "AI Audio Cleaner with Retake Detection",
      badge: "Studio Audio",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      description:
        "Clean your podcast and voiceover tracks in seconds. Automatically detects and removes verbal stumbles, coughs, false starts, and background noise to export 48kHz studio masters.",
      highlights: [
        "Precision Speech AI high-accuracy script review",
        "Automatic false start & retake identification",
        "Clean 48kHz broadcast audio export",
      ],
      icon: Mic,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-white/[0.12] via-white/[0.04] to-transparent backdrop-blur-2xl border border-white/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.35)] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
          <Sparkles size={14} className="text-amber-400" />
          <span>Product Updates & Changelog</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          What&apos;s New in{" "}
          <span className="bg-gradient-to-r from-amber-400 via-[#FF8F00] to-[#FF6D00] bg-clip-text text-transparent">
            Itnavideo AI Studio
          </span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl">
          Discover the latest engine improvements, rendering speeds, and new video templates designed to maximize your creator retention and YouTube RPM.
        </p>
      </div>

      {/* Changelog Timeline */}
      <div className="space-y-6">
        {updates.map((update, index) => {
          const Icon = update.icon;
          return (
            <div
              key={index}
              className="relative rounded-[28px] bg-gradient-to-b from-white/[0.10] via-white/[0.04] to-transparent backdrop-blur-2xl border border-white/15 p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-[#FF6D00]/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6D00]/20 to-[#FFA726]/20 border border-[#FF6D00]/40 flex items-center justify-center text-[#FF9100] shadow-md shadow-[#FF6D00]/20 shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white">{update.title}</h2>
                    <div className="text-xs text-slate-300 font-medium">{update.version}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${update.badgeColor}`}
                  >
                    {update.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{update.date}</span>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-4">{update.description}</p>

              <div className="grid sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/10">
                {update.highlights.map((h, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-center gap-2 text-xs text-slate-300 font-medium bg-white/[0.03] p-2.5 rounded-xl border border-white/5"
                  >
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
