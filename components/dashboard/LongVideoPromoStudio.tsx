"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Video,
  Layers,
  ArrowRight,
  Clock3,
  Zap,
  Film,
  Check,
  Palette,
  Sliders,
  X,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";

function UploadedImagePreview({ alt, className, file }: { alt: string; className?: string; file: File }) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return <Image alt={alt} className={className} height={360} src={previewUrl} unoptimized width={480} />;
}

export type LongVideoPromoGoal = "watch-full-video" | "subscribers" | "promote-episode";

interface LongVideoPromoStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;

  promoThumbnailFile: File | null;
  onPromoThumbnailFileChange: (file: File | null) => void;

  promoTitle: string;
  onPromoTitleChange: (val: string) => void;

  promoGoal?: LongVideoPromoGoal;
  onPromoGoalChange?: (val: LongVideoPromoGoal) => void;

  promoCreatorHandle: string;
  onPromoCreatorHandleChange: (val: string) => void;

  promoCtaText?: string;
  onPromoCtaTextChange?: (val: string) => void;

  promoCtaStyle?: "youtube-red" | "emerald" | "glass" | "tiktok-yellow";
  onPromoCtaStyleChange?: (val: "youtube-red" | "emerald" | "glass" | "tiktok-yellow") => void;

  promoBackgroundMode?: "blur" | "solid";
  onPromoBackgroundModeChange?: (val: "blur" | "solid") => void;

  onGenerate: () => void;
  isGenerating: boolean;
}

export function LongVideoPromoStudio({
  selectedFile,
  onSelectFile,
  promoThumbnailFile,
  onPromoThumbnailFileChange,
  promoTitle,
  onPromoTitleChange,
  promoGoal = "watch-full-video",
  onPromoGoalChange,
  promoCreatorHandle,
  onPromoCreatorHandleChange,
  promoCtaText = "",
  onPromoCtaTextChange,
  promoCtaStyle = "youtube-red",
  onPromoCtaStyleChange,
  promoBackgroundMode = "blur",
  onPromoBackgroundModeChange,
  onGenerate,
  isGenerating,
}: LongVideoPromoStudioProps) {
  const [internalGoal, setInternalGoal] = useState<LongVideoPromoGoal>(promoGoal || "watch-full-video");
  const currentGoal = promoGoal || internalGoal;
  const handleGoalSelect = (goal: LongVideoPromoGoal) => {
    setInternalGoal(goal);
    if (onPromoGoalChange) onPromoGoalChange(goal);
  };

  const [internalCtaStyle, setInternalCtaStyle] = useState<"youtube-red" | "emerald" | "glass" | "tiktok-yellow">(promoCtaStyle);
  const activeCtaStyle = promoCtaStyle || internalCtaStyle;
  const handleCtaStyleSelect = (style: "youtube-red" | "emerald" | "glass" | "tiktok-yellow") => {
    setInternalCtaStyle(style);
    if (onPromoCtaStyleChange) onPromoCtaStyleChange(style);
  };

  const [internalBgMode, setInternalBgMode] = useState<"blur" | "solid">(promoBackgroundMode);
  const activeBgMode = promoBackgroundMode || internalBgMode;
  const handleBgModeSelect = (mode: "blur" | "solid") => {
    setInternalBgMode(mode);
    if (onPromoBackgroundModeChange) onPromoBackgroundModeChange(mode);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onSelectFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
  };

  // Processing animation steps for live feedback
  const [activeStep, setActiveStep] = useState(0);
  React.useEffect(() => {
    if (!isGenerating) {
      setActiveStep(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const promoSteps = [
    "Preparing video media & aspect conforming",
    "Composing 9:16 vertical teaser layout",
    "Integrating 3D thumbnail & YouTube title banner",
    "Applying high-conversion CTA & audio mastering",
    "Finalizing 1080p promo video export",
  ];

  return (
    <div className="relative rounded-[32px] border border-white/10 bg-[#0E131F]/90 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8 text-white min-w-0 max-w-full overflow-hidden">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={320} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/30">
            <Sparkles size={24} className="fill-black/20" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Long Video Promo Studio</span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                1 Credit
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Turn YouTube &amp; long videos into high-converting 9:16 promo teasers with thumbnail graphics &amp; CTA.
            </p>
          </div>
        </div>

        {/* Strict 9:16 Vertical Shorts Format Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 shadow-inner shrink-0">
          <span className="text-base">📱</span>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FFA000]">Strictly 9:16 Vertical</div>
            <div className="text-[10px] text-zinc-400">1080×1920 Full HD • Max 90s</div>
          </div>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="longVideoPromo" />

      {/* Spacious Full-Width Studio Form Container */}
      <div className="space-y-7">
        {/* 01 — UPLOAD YOUR VIDEO CLIP */}
        <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                <Video size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>01 — Upload Promo Video Clip</span>
                  <span className="rounded-full bg-[#FF5722]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#FFA000] border border-[#FF5722]/30">
                    Max 90s
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Upload the video clip you want to promote (MP4, MOV, or WEBM up to 90 seconds).
                </p>
              </div>
            </div>
            {selectedFile && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={13} />
                Video Selected
              </span>
            )}
          </div>

          {!selectedFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 rounded-2xl bg-[#0B0F19] p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 relative group flex flex-col items-center justify-center hover:bg-[#0E1422]"
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#FF5722]/40 group-hover:bg-[#FF5722]/10 transition mb-4">
                <Upload className="h-8 w-8 text-zinc-400 group-hover:text-[#FFA000] transition" />
              </div>
              <p className="text-sm font-bold text-zinc-200">Drag &amp; drop promo video clip here, or click to browse</p>
              <p className="text-xs text-zinc-500 mt-1.5">Supports MP4, MOV, WEBM up to 100MB (Duration: up to 90 seconds)</p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-6 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 group-hover:scale-105 transition duration-200">
                <Upload size={14} className="stroke-[2.5]" />
                <span>Choose Video File</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FFA000] border border-[#FF5722]/30">
                  <Film size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready for 9:16 layout conforming
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectFile(null)}
                className="self-start sm:self-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-4 py-2 text-xs font-bold text-zinc-300 transition cursor-pointer active:scale-95 shrink-0"
              >
                Change Video
              </button>
            </div>
          )}
        </div>

        {/* 02 — ADD VIDEO DETAILS (Thumbnail & Title) */}
        <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">02 — Video Details &amp; Thumbnail</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Thumbnail and title for the teaser flash and finale payoff card.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 16:9 Thumbnail Dropzone (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0B0F19] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>YouTube Thumbnail</span>
                  <span className="text-[10px] font-normal text-zinc-500">(16:9)</span>
                </label>
                {promoThumbnailFile && (
                  <button
                    type="button"
                    onClick={() => onPromoThumbnailFileChange(null)}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition inline-flex items-center gap-1"
                  >
                    <X size={12} /> Remove
                  </button>
                )}
              </div>

              {!promoThumbnailFile ? (
                <div className="relative border-2 border-dashed border-white/15 hover:border-[#FF5722]/50 rounded-xl bg-black/40 p-6 text-center cursor-pointer transition group flex flex-col items-center justify-center min-h-[140px]">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) onPromoThumbnailFileChange(file);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                  <Upload size={20} className="text-zinc-500 group-hover:text-[#FFA000] transition mb-2" />
                  <p className="text-xs font-bold text-zinc-200">Upload 16:9 Thumbnail</p>
                  <p className="text-[11px] text-zinc-500 mt-1">PNG, JPG, or WebP</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="w-full aspect-video overflow-hidden rounded-xl border border-white/15 bg-black shadow-md relative">
                    <UploadedImagePreview alt="Thumbnail preview" className="h-full w-full object-cover" file={promoThumbnailFile} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                    <span className="truncate max-w-[200px] text-white font-medium">{promoThumbnailFile.name}</span>
                    <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                      <CheckCircle2 size={12} /> 16:9 Ready
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Title & Creator Handle (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Video Title <span className="text-[#FF5722]">*</span>
                </label>
                <input
                  type="text"
                  maxLength={80}
                  className="w-full rounded-xl border border-white/15 bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none transition font-medium"
                  placeholder="e.g. Complete Guide to SBI Credit Card"
                  value={promoTitle}
                  onChange={(e) => onPromoTitleChange(e.target.value)}
                />
                <div className="flex justify-between items-center text-xs text-zinc-500 mt-1.5 px-1">
                  <span>Appears boldly on the teaser banner and finale card</span>
                  <span className="font-mono">{promoTitle.length}/80</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Creator Handle <span className="text-zinc-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  className="w-full rounded-xl border border-white/15 bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 focus:outline-none transition font-medium"
                  placeholder="@yourchannel"
                  value={promoCreatorHandle}
                  onChange={(e) => onPromoCreatorHandleChange(e.target.value)}
                />
                <p className="text-xs text-zinc-500 mt-1.5 px-1">Adds a channel watermark and verified badge to the teaser.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 03 — CHOOSE YOUR GOAL & CTA */}
        <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">03 — Conversion Call-to-Action</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Select the promo goal to customize the on-screen call-to-action button.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "watch-full-video" as const,
                label: "Watch Full Video",
                sub: "Drive traffic directly to YouTube",
                cta: "WATCH FULL VIDEO · Link in bio",
                icon: "🎬",
              },
              {
                id: "subscribers" as const,
                label: "Get More Subscribers",
                sub: "Grow your channel subscriber base",
                cta: "SUBSCRIBE FOR MORE · @channel",
                icon: "🔔",
              },
              {
                id: "promote-episode" as const,
                label: "Promote Episode",
                sub: "Podcast episode or series launch",
                cta: "WATCH FULL EPISODE · Out now",
                icon: "🎙️",
              },
            ].map((goal) => {
              const active = currentGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`relative rounded-2xl border p-5 text-left transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between ${
                    active
                      ? "border-[#FF5722] bg-gradient-to-br from-[#FF5722]/15 via-[#FF7043]/10 to-transparent ring-2 ring-[#FF5722]/40 shadow-xl shadow-[#FF5722]/15"
                      : "border-white/10 bg-[#0B0F19] hover:border-white/20 hover:bg-[#0E1422] text-zinc-400"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{goal.icon}</span>
                      {active ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5722] text-black">
                          <Check size={12} className="stroke-[3]" />
                        </span>
                      ) : (
                        <span className="h-5 w-5 rounded-full border border-white/20" />
                      )}
                    </div>
                    <p className={`text-sm font-black ${active ? "text-white" : "text-zinc-200"}`}>{goal.label}</p>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{goal.sub}</p>
                  </div>
                  <div className={`mt-4 rounded-xl p-2 text-[10px] font-bold text-center ${
                    active ? "bg-[#FF5722]/15 text-[#FFA000] border border-[#FF5722]/30" : "bg-white/5 text-zinc-500"
                  }`}>
                    {goal.cta}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional Custom CTA Input */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-zinc-300">Custom CTA Text (Optional):</span>
              <p className="text-[11px] text-zinc-500">Overrides the default button text if you have a specific action.</p>
            </div>
            <input
              type="text"
              maxLength={40}
              placeholder="e.g. Get Tickets Now · Link below"
              value={promoCtaText}
              onChange={(e) => onPromoCtaTextChange && onPromoCtaTextChange(e.target.value)}
              className="w-full sm:w-72 rounded-xl border border-white/15 bg-[#141A28] px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#FF5722] focus:outline-none transition"
            />
          </div>
        </div>

        {/* 04 — VISUAL STYLING ACCENTS */}
        <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">04 — Promo Visual Styling</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Customize CTA button accent colors and background aesthetic.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CTA Button Accent Color */}
            <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4 space-y-3">
              <span className="text-xs font-bold text-zinc-300">CTA Button Style:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "youtube-red" as const, label: "YouTube Red", bg: "bg-red-600" },
                  { id: "emerald" as const, label: "Emerald Green", bg: "bg-emerald-600" },
                  { id: "tiktok-yellow" as const, label: "Amber Gold", bg: "bg-amber-500" },
                  { id: "glass" as const, label: "Obsidian Glass", bg: "bg-slate-700" },
                ].map((s) => {
                  const isSelected = activeCtaStyle === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleCtaStyleSelect(s.id)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-white/15 text-white border border-[#FF5722] ring-1 ring-[#FF5722] shadow-md"
                          : "bg-[#141A28] text-zinc-400 border border-white/5 hover:text-white"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full shrink-0 ${s.bg}`} />
                      <span className="truncate">{s.label}</span>
                      {isSelected && <Check size={12} className="ml-auto text-[#FFA000] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Treatment */}
            <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4 space-y-3">
              <span className="text-xs font-bold text-zinc-300">Background Treatment:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "blur" as const, label: "Cinematic Blur", desc: "Blurred video backdrop" },
                  { id: "solid" as const, label: "Studio Slate", desc: "Clean Obsidian surface" },
                ].map((b) => {
                  const isSelected = activeBgMode === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleBgModeSelect(b.id)}
                      className={`flex flex-col text-left rounded-xl p-2.5 transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? "bg-white/15 text-white border border-[#FF5722] ring-1 ring-[#FF5722] shadow-md"
                          : "bg-[#141A28] text-zinc-400 border border-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold">{b.label}</span>
                        {isSelected && <Check size={12} className="text-[#FFA000]" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-0.5">{b.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 05 — GENERATE AI PROMO CTA BUTTON */}
        <div className="space-y-4 pt-2">
          {isGenerating ? (
            <div className="rounded-[28px] border border-[#FF5722]/40 bg-[#0E131F] p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-[#FF5722]/30 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 text-base font-black text-white">
                  <span className="flex h-3 w-3 animate-ping rounded-full bg-[#FF5722]" />
                  <span>Directing Promo Video Reel...</span>
                </div>
                <span className="rounded-full bg-[#FF5722]/20 px-3.5 py-1 text-xs font-black text-[#FFA000] border border-[#FF5722]/30">
                  {Math.round(((activeStep + 1) / promoSteps.length) * 100)}%
                </span>
              </div>

              <div className="space-y-3">
                {promoSteps.map((step, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                        isDone
                          ? "text-emerald-400 font-bold"
                          : isCurrent
                          ? "text-[#FFA000] font-bold animate-pulse"
                          : "text-zinc-600"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5722]/20 border border-[#FF5722] shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]" />
                        </span>
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-white/15 shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={onGenerate}
                disabled={!selectedFile}
                className={`w-full inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl text-base font-black tracking-tight transition-all duration-200 ${
                  !selectedFile
                    ? "bg-[#141A28] text-[#FFA000] border border-[#FF5722]/30 shadow-inner cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-2xl shadow-[#FF5722]/30 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                }`}
              >
                <Sparkles size={18} className={!selectedFile ? "text-[#FFA000]" : "text-black"} />
                <span>
                  {!selectedFile
                    ? "Upload Promo Video Clip Above"
                    : "Generate AI Promo Reel (1 Credit) • 9:16 Vertical"}
                </span>
                <ArrowRight size={18} className={!selectedFile ? "text-[#FFA000]" : "text-black"} />
              </button>

              <p className="text-center text-xs text-zinc-500 leading-relaxed px-4">
                Exports a high-retention 1080×1920 Full HD video teaser formatted for YouTube Shorts, Instagram Reels &amp; TikTok.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
