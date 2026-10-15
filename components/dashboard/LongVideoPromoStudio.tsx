"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Video,
  ArrowRight,
  Clock3,
  Film,
  Check,
  Palette,
  Sliders,
  Tv,
  Clock,
  ShieldCheck,
  Loader2,
  Play,
  Image as ImageIcon,
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

  const isReadyToRender = Boolean(selectedFile);

  return (
    <div className="space-y-8">
      {/* 2-Column Standardized Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Input Controls (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 min-w-0 max-w-full overflow-x-hidden space-y-6">
          <div className="relative rounded-[32px] border border-white/10 bg-[#0E131F]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 text-white min-w-0 max-w-full overflow-hidden">
            <BorderBeam size={320} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

            {/* Master Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-lg shadow-[#FF5722]/30">
                  <Sparkles size={24} className="fill-black/20" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                    <span>Long Video Promo Studio</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      1 Credit
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Turn long YouTube videos into viral 9:16 Shorts &amp; Reels teasers with 3D thumbnail cards.
                  </p>
                </div>
              </div>

              {/* Strict 9:16 Vertical Shorts Format Badge */}
              <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 shadow-inner shrink-0">
                <Clock3 size={14} className="text-[#FFA000]" />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#FFA000]">Strictly 9:16 Vertical</div>
                  <div className="text-[10px] text-zinc-400">1080×1920 Full HD • Up to 90s</div>
                </div>
              </div>
            </div>

            {/* Workflow Roadmap */}
            <StudioWorkflowRoadmap mode="longVideoPromo" />

            {/* STEP 1: UPLOAD SOURCE VIDEO CLIP */}
            <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                    <Video size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">1. Upload Source Video Clip</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">MP4, MOV, or WebM teaser clip (up to 90 seconds recommended).</p>
                  </div>
                </div>

                {selectedFile && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    <CheckCircle2 size={13} />
                    <span>Clip Loaded</span>
                  </span>
                )}
              </div>

              {!selectedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 rounded-2xl bg-[#0B0F19] p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 relative group flex flex-col items-center justify-center hover:bg-[#0E1422]"
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#FF5722]/40 group-hover:bg-[#FF5722]/10 transition mb-3">
                    <Upload className="h-7 w-7 text-zinc-400 group-hover:text-[#FFA000] transition" />
                  </div>
                  <p className="text-sm font-bold text-zinc-200">Drag &amp; drop video teaser clip here, or click to browse</p>
                  <p className="text-xs text-zinc-500 mt-1">Supports MP4, MOV, WebM up to 100MB (Duration: up to 90 seconds)</p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF5722]/25 group-hover:scale-105 transition duration-200">
                    <Upload size={14} className="stroke-[2.5]" />
                    <span>Choose Video File</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/15 text-[#FFA000] border border-[#FF5722]/30">
                      <Film size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">Ready for 9:16 Conforming</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectFile(null)}
                    className="self-start sm:self-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-3.5 py-1.5 text-xs font-bold text-zinc-300 transition cursor-pointer active:scale-95"
                  >
                    Change Video
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: YOUTUBE VIDEO THUMBNAIL */}
            <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">2. Long Video Thumbnail (Optional)</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Displays as a floating 3D teaser card above your video clip.</p>
                  </div>
                </div>

                {promoThumbnailFile && (
                  <button
                    type="button"
                    onClick={() => onPromoThumbnailFileChange(null)}
                    className="text-xs text-red-400 hover:text-red-300 font-bold transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              {!promoThumbnailFile ? (
                <label className="border border-dashed border-white/15 hover:border-[#FF5722]/50 rounded-2xl bg-[#0B0F19] p-5 text-center cursor-pointer transition flex items-center justify-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onPromoThumbnailFileChange(f);
                    }}
                    className="hidden"
                  />
                  <Upload size={16} className="text-[#FFA000]" />
                  <span className="text-xs font-bold text-zinc-300">Upload YouTube Thumbnail (JPG or PNG)</span>
                </label>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#0B0F19] p-3 flex items-center gap-3">
                  <UploadedImagePreview alt="Thumbnail preview" className="h-14 w-24 rounded-lg object-cover" file={promoThumbnailFile} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{promoThumbnailFile.name}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">✓ 3D Card Active</p>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: TITLE & CREATOR HANDLE */}
            <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">3. YouTube Title &amp; Channel</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Headline shown on the teaser overlay banner.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Video Headline / Title</label>
                  <input
                    type="text"
                    value={promoTitle}
                    onChange={(e) => onPromoTitleChange(e.target.value)}
                    placeholder="e.g. How I Built a $10k/mo Micro-SaaS"
                    className="w-full rounded-xl border border-white/10 bg-[#080B13] px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Creator Channel Handle</label>
                  <input
                    type="text"
                    value={promoCreatorHandle}
                    onChange={(e) => onPromoCreatorHandleChange(e.target.value)}
                    placeholder="@yourchannel"
                    className="w-full rounded-xl border border-white/10 bg-[#080B13] px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>
            </div>

            {/* STEP 4: CTA BUTTON STYLE */}
            <div className="rounded-[24px] border border-white/10 bg-[#141A28] p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/15 text-[#FFA000]">
                  <Palette size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">4. Call to Action Button Style</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">High-conversion button design rendered on the teaser frame.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "youtube-red", label: "YouTube Red", bg: "bg-red-600" },
                  { id: "emerald", label: "Emerald Green", bg: "bg-emerald-600" },
                  { id: "glass", label: "Modern Glass", bg: "bg-white/20" },
                  { id: "tiktok-yellow", label: "Amber Gold", bg: "bg-amber-500" },
                ].map((s) => {
                  const isSelected = activeCtaStyle === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleCtaStyleSelect(s.id as any)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-white/15 text-white border border-[#FF5722] ring-1 ring-[#FF5722]"
                          : "bg-[#0B0F19] text-zinc-400 border border-white/5 hover:text-white"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full shrink-0 ${s.bg}`} />
                      <span className="truncate">{s.label}</span>
                      {isSelected && <Check size={12} className="ml-auto text-[#FFA000]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Canvas Preview & Studio Output Config (4 cols sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Live Stage Preview
                </span>
              </div>
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                9:16 Vertical
              </span>
            </div>

            {/* 9:16 Canvas Mockup Frame */}
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[260px] rounded-2xl border-2 border-white/10 bg-[#0B0F19] overflow-hidden shadow-2xl flex flex-col justify-between p-3.5">
              {/* Blurred background mockup */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-black to-orange-900/30 opacity-70 pointer-events-none" />

              {/* Top Watermark */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-0.5 text-[9px] font-black text-[#FFA000]">
                  <span>🎬 Promo Teaser</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-400">
                  {promoCreatorHandle || "@channel"}
                </span>
              </div>

              {/* Floating 3D Thumbnail Mockup in Center */}
              <div className="relative z-10 my-auto text-center space-y-3 px-1">
                <div className="mx-auto aspect-video w-full rounded-xl border border-white/20 bg-black/60 overflow-hidden shadow-2xl flex items-center justify-center transform -rotate-1 hover:rotate-0 transition duration-300">
                  {promoThumbnailFile ? (
                    <UploadedImagePreview alt="Mockup" className="w-full h-full object-cover" file={promoThumbnailFile} />
                  ) : (
                    <div className="space-y-1 p-3">
                      <Play size={20} className="mx-auto text-[#FFA000] fill-[#FFA000]/30" />
                      <p className="text-[10px] font-black text-white truncate">
                        {promoTitle || "Full Video Available Now"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black text-white line-clamp-2 leading-tight">
                    {promoTitle || "Watch the full breakdown on YouTube"}
                  </p>
                </div>
              </div>

              {/* High-Impact CTA Pill */}
              <div className="relative z-10">
                <div className={`w-full py-2 rounded-xl text-center text-xs font-black shadow-lg ${
                  activeCtaStyle === "youtube-red"
                    ? "bg-red-600 text-white"
                    : activeCtaStyle === "emerald"
                    ? "bg-emerald-500 text-black"
                    : activeCtaStyle === "tiktok-yellow"
                    ? "bg-amber-400 text-black"
                    : "bg-white/20 backdrop-blur-md text-white border border-white/20"
                }`}>
                  ▶ WATCH FULL VIDEO
                </div>
              </div>
            </div>

            {/* Studio Output Specs Breakdown */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Tv size={12} className="text-slate-500" />
                  <span>Resolution</span>
                </span>
                <span className="font-bold text-white">1080×1920 (Vertical)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-500" />
                  <span>Max Duration</span>
                </span>
                <span className="font-bold text-white">Up to 90 Seconds</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Credit Cost</span>
                </span>
                <span className="font-bold text-emerald-400">1 Credit</span>
              </div>
            </div>

            {/* Primary Generate Button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating || !isReadyToRender}
              className={`w-full inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl text-sm font-black tracking-tight transition-all duration-200 ${
                !isReadyToRender
                  ? "bg-[#141A28] text-zinc-500 border border-white/10 shadow-inner cursor-not-allowed"
                  : isGenerating
                  ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black opacity-80 cursor-wait animate-pulse"
                  : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-black shadow-xl shadow-[#FF5722]/25 hover:brightness-110 active:scale-[0.99] cursor-pointer"
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Directing Promo Video Reel...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className={!isReadyToRender ? "text-zinc-600" : "text-black"} />
                  <span>
                    {!selectedFile
                      ? "Upload Video Clip"
                      : "Generate AI Promo Reel (1 Credit)"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
