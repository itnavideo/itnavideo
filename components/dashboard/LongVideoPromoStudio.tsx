"use client";

import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Video,
  Layers,
  ArrowRight,
  Eye,
  Clock3,
  Zap,
  Film,
  Check,
} from "lucide-react";
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";

const LongVideoPromoPreview = dynamic(
  () => import("@/components/preview/LongVideoPromoPreview").then((m) => m.LongVideoPromoPreview),
  { ssr: false }
);

function UploadedImagePreview({ alt, className, file }: { alt: string; className?: string; file: File }) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
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

  // Backward-compatible props (optional)
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
  onGenerate,
  isGenerating,
}: LongVideoPromoStudioProps) {
  const [internalGoal, setInternalGoal] = useState<LongVideoPromoGoal>(promoGoal || "watch-full-video");

  const currentGoal = promoGoal || internalGoal;
  const handleGoalSelect = (goal: LongVideoPromoGoal) => {
    setInternalGoal(goal);
    if (onPromoGoalChange) onPromoGoalChange(goal);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectFile(file);
    }
  };

  // AI Processing steps for live animation during generation (Point 9)
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    if (!isGenerating) {
      setActiveStep(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 6 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const aiSteps = [
    "Transcribing audio & speech",
    "Finding the strongest viral moment",
    "Creating the high-retention hook",
    "Generating word-synced captions",
    "Building 9:16 vertical composition",
    "Adding 3D thumbnail & CTA",
    "Finalizing 1080p promo export",
  ];

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF6D00" colorTo="#FFA726" />

      {/* Master Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-md shadow-[#FF6D00]/25">
            <Sparkles size={20} className="fill-black/20" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Long Video Promo Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Turn YouTube videos into 9:16 viral promo teasers with thumbnail graphics & CTA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161720] px-3 py-1.5 text-xs font-bold text-slate-300">
            <Clock3 size={13} className="text-[#FF8F00]" />
            <span>9:16 Vertical • 1080p Full HD</span>
          </span>
        </div>
      </div>

      {/* Process Workflow Roadmap */}
      <StudioWorkflowRoadmap mode="longVideoPromo" />

      {/* 2-Column Grid Container: Form Controls Left (7 cols) & Live 9:16 Preview Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

        {/* 01 — UPLOAD YOUR VIDEO */}
        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] shadow-md shadow-[#FF6D00]/10">
                <Video size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                  <span>01 — Upload Your Video</span>
                  <span className="rounded-full bg-[#FF6D00]/15 px-2 py-0.5 text-[10px] font-bold text-[#FFA726] border border-[#FF6D00]/30">
                    Up to 3 mins
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Drag &amp; drop your video. AI will find the strongest moments automatically.
                </p>
              </div>
            </div>
            {selectedFile && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                <Check size={12} />
                Selected
              </span>
            )}
          </div>

          {!selectedFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border border-dashed border-white/20 hover:border-[#FF6D00]/60 rounded-2xl bg-black/40 hover:bg-black/60 p-8 text-center cursor-pointer transition-all duration-200 relative group"
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-[#FF6D00]/40 group-hover:bg-[#FF6D00]/10 transition">
                <Upload className="h-6 w-6 text-zinc-400 group-hover:text-[#FF9100] transition" />
              </div>
              <p className="text-sm font-bold text-zinc-100">Drag &amp; drop your video, or click to browse</p>
              <p className="text-xs text-zinc-400 mt-1">Supports MP4, MOV, WEBM · No manual trimming needed</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FF6D00]/10 px-3 py-1 text-[10px] font-bold text-[#FFA726] border border-[#FF6D00]/20">
                <Sparkles size={12} />
                AI will cut the best 15–45s hook automatically
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-black/50 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6D00]/20 to-[#FF8F00]/10 text-[#FF9100] border border-[#FF6D00]/30">
                  <Film size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready for AI hook detection
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectFile(null)}
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white px-3.5 py-2 text-[11px] font-bold text-zinc-300 transition shrink-0"
              >
                Change Video
              </button>
            </div>
          )}
        </div>

        {/* 02 — ADD VIDEO DETAILS */}
        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] shadow-md shadow-[#FF6D00]/10">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white">02 — Add Video Details</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Thumbnail and title for the teaser flash and payoff card.</p>
            </div>
          </div>

          {/* Thumbnail Dropzone */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Thumbnail</span>
                <span className="text-[10px] font-normal text-zinc-400">(16:9 widescreen recommended)</span>
              </label>
              {promoThumbnailFile && (
                <button
                  type="button"
                  onClick={() => onPromoThumbnailFileChange(null)}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 transition"
                >
                  Remove
                </button>
              )}
            </div>

            {!promoThumbnailFile ? (
              <div className="relative border border-dashed border-white/15 hover:border-[#FF6D00]/40 rounded-xl bg-black/30 p-5 text-center cursor-pointer transition group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) onPromoThumbnailFileChange(file);
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <Upload size={16} className="mx-auto text-zinc-500 group-hover:text-[#FF9100] transition mb-1.5" />
                <p className="text-xs font-bold text-zinc-200">Upload YouTube Thumbnail</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG, WEBP (Optional: AI will auto-extract if left empty)</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-20 w-36 overflow-hidden rounded-xl border border-white/15 bg-black shadow-md shrink-0">
                  <UploadedImagePreview alt="Thumbnail preview" className="h-full w-full object-cover" file={promoThumbnailFile} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{promoThumbnailFile.name}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{(promoThumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-1">
                    <CheckCircle2 size={11} /> 16:9 Thumbnail Ready
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Video Title</label>
              <input
                type="text"
                maxLength={80}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-[#FF6D00]/50 focus:ring-1 focus:ring-[#FF6D00]/30 focus:outline-none transition"
                placeholder="Enter your YouTube video title"
                value={promoTitle}
                onChange={(e) => onPromoTitleChange(e.target.value)}
              />
              <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1">
                <span>Appears boldly on the teaser banner and finale card</span>
                <span>{promoTitle.length}/80</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Creator Handle <span className="text-[10px] font-normal text-zinc-400">(Optional)</span>
              </label>
              <input
                type="text"
                maxLength={30}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-[#FF6D00]/50 focus:ring-1 focus:ring-[#FF6D00]/30 focus:outline-none transition"
                placeholder="@yourchannel"
                value={promoCreatorHandle}
                onChange={(e) => onPromoCreatorHandleChange(e.target.value)}
              />
              <p className="text-[10px] text-zinc-500 mt-1">AI will add a verified badge and channel watermark.</p>
            </div>
          </div>
        </div>

        {/* 03 — CHOOSE YOUR GOAL */}
        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 text-[#FF9100] shadow-md shadow-[#FF6D00]/10">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white">03 — Choose Your Goal</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">AI will tailor the call-to-action to maximize conversion.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "watch-full-video" as const,
                label: "Watch Full Video",
                sub: "Drive traffic to YouTube",
                cta: "WATCH FULL VIDEO · Link in bio",
                icon: "🎬",
              },
              {
                id: "subscribers" as const,
                label: "Get More Subscribers",
                sub: "Grow your channel base",
                cta: "SUBSCRIBE FOR MORE · @channel",
                icon: "🔔",
              },
              {
                id: "promote-episode" as const,
                label: "Promote Episode",
                sub: "Podcast & series release",
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
                  className={`relative rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
                    active
                      ? "border-[#FF6D00] bg-gradient-to-br from-[#FF6D00]/15 to-[#FF8F00]/5 ring-2 ring-[#FF6D00]/30 shadow-lg shadow-[#FF6D00]/10"
                      : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{goal?.icon}</span>
                    {active && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6D00] text-black">
                        <Check size={10} className="stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-black ${active ? "text-white" : "text-zinc-200"}`}>{goal.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{goal.sub}</p>
                  <div className={`mt-2.5 rounded-lg p-1.5 text-[9px] font-bold ${
                    active ? "bg-[#FF6D00]/10 text-[#FFA726] border border-[#FF6D00]/20" : "bg-white/5 text-zinc-500"
                  }`}>
                    {goal.cta}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 04 — AI PROMO GENERATE BUTTON & LIVE PROCESSING */}
        <div className="space-y-3 pt-2">
          {isGenerating ? (
            /* Point 9: Live AI Processing Stepper */
            <div className="rounded-[28px] border border-[#FF6D00]/40 bg-black/80 p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-[#FF6D00]/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <span className="flex h-2.5 w-2.5 animate-ping rounded-full bg-[#FF6D00]" />
                  <span>Analyzing your video...</span>
                </div>
                <span className="rounded-full bg-[#FF6D00]/20 px-3 py-1 text-xs font-black text-[#FFA726] border border-[#FF6D00]/30">
                  {Math.round(((activeStep + 1) / aiSteps.length) * 100)}%
                </span>
              </div>

              <div className="space-y-2.5">
                {aiSteps.map((step, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                        isDone
                          ? "text-emerald-400 font-bold"
                          : isCurrent
                          ? "text-[#FFA726] font-bold animate-pulse"
                          : "text-zinc-600"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF6D00]/20 border border-[#FF6D00] shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6D00]" />
                        </span>
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border border-white/10 shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onGenerate}
                disabled={!selectedFile}
                className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] p-4.5 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition-all duration-200 active:scale-[0.98] hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Sparkles size={18} />
                <span>Generate AI Promo (1 Credit)</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-center text-[11px] text-zinc-400 leading-relaxed px-4">
                AI will select the best moment, create the hook, generate captions, build the vertical layout and add your CTA.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Column: Live Mockup Editor Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
        <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 relative overflow-hidden text-center">
          <div className="mb-3.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#FFA726]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF8F00]" />
            Live 9:16 Video Preview
          </div>

          {/* Interactive Player Frame */}
          <div className="rounded-2xl overflow-hidden bg-black/60 border border-white/10 p-1 relative flex items-center justify-center">
            <LongVideoPromoPreview
              thumbnailFile={promoThumbnailFile}
              clipFile={selectedFile}
              title={promoTitle}
              promoGoal={currentGoal}
              promoCreatorHandle={promoCreatorHandle}
            />
          </div>

          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3.5 mt-3 text-[11px] text-zinc-400 flex items-start gap-3 leading-relaxed text-left">
            <Eye size={16} className="text-[#FF8F00] shrink-0 mt-0.5" />
            <p>
              This live preview plays your 9:16 vertical promo short with kinetic captions, 3D teaser card, and high-conversion payoff CTA.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
