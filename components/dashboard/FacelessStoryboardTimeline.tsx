"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowLeftRight,
  Layers,
  Image as ImageIcon,
  Video,
  Check,
  X,
  Tag,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Layout,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SceneBlueprintItem } from "@/services/ai/sceneBlueprintTypes";
import type { TaggedMediaAsset } from "@/services/ai/visionAutoTagger";
import { toAbsoluteS3AssetUrl } from "@/constants/itnavideoStockAssets";

// Curated stock assets for quick visual swapping
const QUICK_STOCK_OPTIONS = [
  {
    title: "Modern Tech Office Workspace",
    url: "/assets/reusable/images/realistic/businesswoman_analyzing_cloud_services_workflow_office.png",
    tags: ["tech", "office", "business", "workspace", "computer"],
  },
  {
    title: "Financial Growth & Investment Chart",
    url: "/assets/reusable/images/realistic/businessman_presenting_financial_growth_chart_modern_of.png",
    tags: ["finance", "growth", "chart", "money", "investing"],
  },
  {
    title: "Urban Skyline & Modern City",
    url: "/assets/reusable/images/realistic/Harbor-Freeway-Los-Angeles.jpg",
    tags: ["city", "urban", "skyline", "modern", "travel"],
  },
  {
    title: "Luxury Penthouse & Success",
    url: "/assets/reusable/images/realistic/professional_man_luxury_penthouse_dubai_skyline.png",
    tags: ["luxury", "success", "wealth", "executive", "penthouse"],
  },
  {
    title: "Digital Payment & E-Commerce",
    url: "/assets/reusable/images/realistic/retail_cashier_customer_contactless_payment_shop.png",
    tags: ["payment", "shopping", "digital", "retail", "card"],
  },
  {
    title: "Couple Reviewing Financial Budget",
    url: "/assets/reusable/images/realistic/overhead_desk_budgeting_financial_planning_tools.png",
    tags: ["budget", "planning", "desk", "financial", "documents"],
  },
  {
    title: "Creator Studio & AI Prompting",
    url: "/assets/reusable/images/realistic/young_man_explaining_ai_prompts_youtube_studio.png",
    tags: ["creator", "studio", "youtube", "ai", "explaining"],
  },
  {
    title: "Data Analytics & Curved Monitor",
    url: "/assets/reusable/images/realistic/woman_analyzing_complex_data_on_curved_monitor_in_moder.png",
    tags: ["analytics", "data", "monitor", "screens", "software"],
  },
];

export interface FacelessStoryboardTimelineProps {
  scenes: SceneBlueprintItem[];
  brollUrls: Record<number, string>;
  onBrollUrlsChange: (newUrls: Record<number, string>) => void;
  uploadedAssets?: TaggedMediaAsset[];
  uploadedImageFiles?: File[];
  onSeekAudio?: (timeSec: number) => void;
}

export function FacelessStoryboardTimeline({
  scenes,
  brollUrls,
  onBrollUrlsChange,
  uploadedAssets = [],
  onSeekAudio,
}: FacelessStoryboardTimelineProps) {
  const [activeSwapSceneNumber, setActiveSwapSceneNumber] = useState<number | null>(null);
  const [swapTab, setSwapTab] = useState<"uploads" | "library">("uploads");
  const [filterLayout, setFilterLayout] = useState<string>("all");

  if (!scenes || scenes.length === 0) return null;

  const formatTime = (sec?: number) => {
    if (sec === undefined || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isVideo = (url?: string) => {
    if (!url) return false;
    return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.includes("/video/");
  };

  const getCleanFileName = (url?: string) => {
    if (!url) return "";
    try {
      const p = url.split("?")[0];
      return decodeURIComponent(p.split("/").pop() || "");
    } catch {
      return url;
    }
  };

  const isUserUpload = (url?: string) => {
    if (!url) return false;
    return url.includes("/facelessVideo/") || uploadedAssets.some((u) => u.url === url);
  };

  const handleAssignAssetToScene = (sceneNum: number, assetUrl: string) => {
    onBrollUrlsChange({
      ...brollUrls,
      [sceneNum]: assetUrl,
    });
    setActiveSwapSceneNumber(null);
  };

  const handleClearAssetFromScene = (sceneNum: number) => {
    const updated = { ...brollUrls };
    delete updated[sceneNum];
    onBrollUrlsChange(updated);
    setActiveSwapSceneNumber(null);
  };

  const filteredScenes = scenes.filter((s) => {
    if (filterLayout === "all") return true;
    return s.layoutType === filterLayout;
  });

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#141519] p-5 sm:p-6 shadow-xl space-y-6">
      {/* ── Storyboard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Scene Timeline &amp; Visual Storyboard</span>
            </h3>
            <span className="rounded-full bg-white/[0.06] border border-white/[0.1] px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
              {scenes.length} Scenes
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Each scene is synchronized with your narration audio. Review scene headings, narration timing, and swap visual assets directly below.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {uploadedAssets.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 text-xs text-zinc-300">
              <Sparkles size={13} className="text-orange-400" />
              <span className="font-semibold text-white">{uploadedAssets.length}</span>
              <span>Uploaded Media</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Visual Scrubber Bar (Horizontal Timeline Flow) ── */}
      <div className="rounded-xl border border-white/[0.06] bg-[#101114] p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 px-1">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Clock size={12} className="text-orange-400" />
            <span>Interactive Timeline Sequence (Click to jump audio)</span>
          </span>
          <span className="font-mono text-zinc-500">
            {formatTime(scenes[0]?.narrationSegment?.startSeconds)} → {formatTime(scenes[scenes.length - 1]?.narrationSegment?.endSeconds)}
          </span>
        </div>

        <div className="flex items-stretch gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
          {scenes.map((scene, idx) => {
            const assignedUrl = brollUrls[scene.sceneNumber];
            const hasAsset = Boolean(assignedUrl);
            const isUser = isUserUpload(assignedUrl);
            const isSelected = activeSwapSceneNumber === scene.sceneNumber;

            return (
              <button
                key={scene.sceneNumber || idx}
                type="button"
                onClick={() => {
                  if (scene.narrationSegment?.startSeconds !== undefined) {
                    onSeekAudio?.(scene.narrationSegment.startSeconds);
                  }
                }}
                className={`flex-shrink-0 w-32 rounded-xl border p-2 text-left transition flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? "border-orange-500/80 bg-[#1E2028] ring-1 ring-orange-500/40"
                    : "border-white/[0.08] bg-[#16171D] hover:border-white/25 hover:bg-[#1B1D24]"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className="font-bold text-white group-hover:text-orange-400 transition">
                    Scene #{scene.sceneNumber}
                  </span>
                  <span className="font-mono text-zinc-400 text-[9.5px]">
                    {formatTime(scene.narrationSegment?.startSeconds)}
                  </span>
                </div>

                <div className="w-full h-12 rounded-lg bg-black/60 relative overflow-hidden flex items-center justify-center mb-1.5 border border-white/[0.06]">
                  {hasAsset ? (
                    isVideo(assignedUrl) ? (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-orange-400">
                        <Video size={13} />
                        <span>Video Clip</span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={toAbsoluteS3AssetUrl(assignedUrl)}
                        alt={scene.heading || "Visual"}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                    )
                  ) : (
                    <div className="flex items-center gap-1 text-[9px] font-semibold text-zinc-400">
                      <Layout size={11} className="text-zinc-500" />
                      <span>SVG / Notes</span>
                    </div>
                  )}

                  {isUser && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-black" />
                  )}
                </div>

                <span className="text-[10px] font-medium text-zinc-300 truncate block">
                  {scene.heading || scene.layoutType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Spacious 2-Column Responsive Scene Cards Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredScenes.map((scene) => {
          const assignedUrl = brollUrls[scene.sceneNumber];
          const hasAsset = Boolean(assignedUrl);
          const isUser = isUserUpload(assignedUrl);
          const isVid = isVideo(assignedUrl);
          const isModalOpen = activeSwapSceneNumber === scene.sceneNumber;
          const matchedUploadedMeta = uploadedAssets.find((u) => u.url === assignedUrl);

          return (
            <div
              key={scene.sceneNumber}
              className={`rounded-2xl border transition flex flex-col justify-between ${
                isModalOpen
                  ? "border-orange-500/60 bg-[#1A1C24] ring-1 ring-orange-500/30 shadow-lg"
                  : "border-white/[0.07] bg-[#16171C] hover:border-white/15 hover:bg-[#191B22]"
              }`}
            >
              <div className="p-4 sm:p-5 space-y-3.5">
                {/* 1. Header Row: Scene Number, Time Range, Layout Badge */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 text-xs font-black border border-orange-500/25">
                      {scene.sceneNumber < 10 ? `0${scene.sceneNumber}` : scene.sceneNumber}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white tracking-wide block">
                        {scene.heading || `Scene Beat #${scene.sceneNumber}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-zinc-300 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-md">
                      <Clock size={10} className="text-zinc-400" />
                      <span>{formatTime(scene.narrationSegment?.startSeconds)} - {formatTime(scene.narrationSegment?.endSeconds)}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/[0.06] border border-white/[0.08] text-zinc-400 px-2 py-0.5 rounded-md">
                      {scene.layoutType.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* 2. Narration Script Beat */}
                <div className="rounded-xl bg-black/30 border border-white/[0.04] p-3">
                  <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans">
                    &ldquo;{scene.narrationSegment?.text}&rdquo;
                  </p>

                  {scene.highlightedWords && scene.highlightedWords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/[0.05]">
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                        Emphasis:
                      </span>
                      {scene.highlightedWords.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="rounded-md bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Visual Asset Bar & Action Controls */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-11 rounded-lg bg-black/60 border border-white/[0.08] relative overflow-hidden flex items-center justify-center shrink-0">
                      {hasAsset ? (
                        isVid ? (
                          <div className="flex flex-col items-center text-orange-400">
                            <Video size={15} />
                            <span className="text-[7.5px] font-bold uppercase">Video</span>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={toAbsoluteS3AssetUrl(assignedUrl)}
                            alt="Scene Visual"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="text-center text-zinc-400 p-1">
                          <Layout size={13} className="mx-auto text-zinc-500 mb-0.5" />
                          <span className="text-[7.5px] font-semibold block leading-tight">SVG Diagram</span>
                        </div>
                      )}

                      {isUser && (
                        <span className="absolute top-0.5 left-0.5 bg-emerald-500 text-white text-[7px] font-black uppercase px-1 rounded shadow">
                          Upload
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-xs">
                        {matchedUploadedMeta?.title || getCleanFileName(assignedUrl) || (hasAsset ? "Stock Asset" : "Dynamic SVG & Canvas")}
                      </p>
                      <p className="text-[10.5px] text-zinc-400 mt-0.5 truncate">
                        {isUser ? "Custom Upload Media" : hasAsset ? "Verified Stock Asset" : "Editorial Whiteboard Canvas"}
                      </p>
                    </div>
                  </div>

                  {/* Swap / Change Button */}
                  <button
                    type="button"
                    onClick={() => setActiveSwapSceneNumber(isModalOpen ? null : scene.sceneNumber)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0 ${
                      isModalOpen
                        ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "border-white/[0.1] bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.1] hover:border-white/20"
                    }`}
                  >
                    <ArrowLeftRight size={12} />
                    <span>{isModalOpen ? "Close Drawer" : "Swap Visual"}</span>
                  </button>
                </div>
              </div>

              {/* ── INLINE ASSET SWAP DRAWER ── */}
              {isModalOpen && (
                <div className="border-t border-white/[0.08] bg-[#111216] p-4 rounded-b-2xl space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Choose Asset for Scene #{scene.sceneNumber}:</span>
                      {hasAsset && (
                        <button
                          type="button"
                          onClick={() => handleClearAssetFromScene(scene.sceneNumber)}
                          className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition underline cursor-pointer ml-1"
                        >
                          Clear Visual (Use Clean SVG)
                        </button>
                      )}
                    </div>

                    {/* Tab Selector */}
                    <div className="inline-flex rounded-lg bg-black/40 border border-white/[0.08] p-0.5">
                      <button
                        type="button"
                        onClick={() => setSwapTab("uploads")}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                          swapTab === "uploads"
                            ? "bg-orange-500 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Your Uploads ({uploadedAssets.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSwapTab("library")}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                          swapTab === "library"
                            ? "bg-orange-500 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Stock Library ({QUICK_STOCK_OPTIONS.length})
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: User Uploaded Assets */}
                  {swapTab === "uploads" && (
                    <div>
                      {uploadedAssets.length === 0 ? (
                        <div className="rounded-xl border border-white/[0.06] bg-[#16171D] p-4 text-center text-xs text-zinc-400">
                          <p>No custom photos or video clips uploaded yet.</p>
                          <p className="text-[11px] text-zinc-500 mt-1">
                            You can upload custom visual assets to assign them to specific narrative scenes.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                          {uploadedAssets.map((asset, aIdx) => {
                            const isSelected = assignedUrl === asset.url;
                            const isVidThumb = asset.mediaType === "video" || isVideo(asset.url);
                            return (
                              <button
                                key={`${asset.url}_${aIdx}`}
                                type="button"
                                onClick={() => handleAssignAssetToScene(scene.sceneNumber, asset.url)}
                                className={`rounded-xl border p-2 text-left transition flex flex-col justify-between group cursor-pointer relative ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                                    : "border-white/[0.08] bg-[#181A20] hover:border-orange-500/50 hover:bg-[#1E2028]"
                                }`}
                              >
                                <div className="w-full h-14 rounded-lg bg-black/50 overflow-hidden relative flex items-center justify-center mb-1">
                                  {isVidThumb ? (
                                    <Video size={18} className="text-orange-400" />
                                  ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={asset.url}
                                      alt={asset.title}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  {isSelected && (
                                    <span className="absolute top-1 right-1 p-0.5 rounded-full bg-emerald-500 text-white">
                                      <Check size={9} />
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] font-bold text-white truncate w-full">
                                  {asset.title || asset.fileName}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Stock Library */}
                  {swapTab === "library" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {QUICK_STOCK_OPTIONS.map((stock, sIdx) => {
                        const isSelected = assignedUrl === stock.url;
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleAssignAssetToScene(scene.sceneNumber, stock.url)}
                            className={`rounded-xl border p-2 text-left transition flex flex-col justify-between cursor-pointer relative ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                                : "border-white/[0.08] bg-[#181A20] hover:border-orange-500/50 hover:bg-[#1E2028]"
                            }`}
                          >
                            <div className="w-full h-14 rounded-lg bg-black/50 overflow-hidden relative mb-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={toAbsoluteS3AssetUrl(stock.url)}
                                alt={stock.title}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <span className="absolute top-1 right-1 p-0.5 rounded-full bg-emerald-500 text-white">
                                  <Check size={9} />
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold text-white truncate w-full">
                              {stock.title}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FacelessStoryboardTimeline;
