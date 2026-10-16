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
} from "lucide-react";
import type { SceneBlueprintItem } from "@/services/ai/sceneBlueprintTypes";
import type { TaggedMediaAsset } from "@/services/ai/visionAutoTagger";
import { toAbsoluteS3AssetUrl } from "@/constants/itnavideoStockAssets";

// Sample top curated realistic stock assets for quick swapping
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
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D111D] p-5 shadow-2xl space-y-5">
      {/* ── Storyboard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FF5722] animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span>Scene-by-Scene Timeline &amp; Visual Storyboard</span>
            </h3>
            <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold text-orange-400">
              {scenes.length} Scenes
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vision AI has automatically mapped user uploads &amp; b-roll to matching narration beats. You can visually verify or swap assets below.
          </p>
        </div>

        {uploadedAssets.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-xl bg-[#161C2E] border border-white/10 px-3 py-1.5 text-xs text-zinc-300">
            <Sparkles size={13} className="text-[#FF5722]" />
            <span className="font-semibold text-white">{uploadedAssets.length}</span>
            <span>Custom Media Tagged</span>
          </div>
        )}
      </div>

      {/* ── Visual Scrubber Bar (Mini Timeline Strip) ── */}
      <div className="rounded-xl border border-white/10 bg-[#121624] p-2.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 px-1 flex items-center justify-between">
          <span>Timeline Flow (Click any scene to preview)</span>
          <span className="font-mono text-zinc-500">Total: {scenes.length} Scenes</span>
        </p>
        <div className="flex items-stretch gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-700">
          {scenes.map((scene, idx) => {
            const assignedUrl = brollUrls[scene.sceneNumber];
            const hasAsset = Boolean(assignedUrl);
            const isUser = isUserUpload(assignedUrl);
            return (
              <button
                key={scene.sceneNumber || idx}
                type="button"
                onClick={() => {
                  if (scene.narrationSegment?.startSeconds !== undefined) {
                    onSeekAudio?.(scene.narrationSegment.startSeconds);
                  }
                }}
                className={`flex-shrink-0 w-28 rounded-lg border p-1.5 text-left transition flex flex-col justify-between hover:border-[#FF5722]/60 cursor-pointer ${
                  activeSwapSceneNumber === scene.sceneNumber
                    ? "border-[#FF5722] bg-[#1A2035] ring-1 ring-[#FF5722]"
                    : "border-white/10 bg-[#0A0D16]/80"
                }`}
              >
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className="font-bold text-white">#{scene.sceneNumber}</span>
                  <span className="font-mono text-zinc-400">{formatTime(scene.narrationSegment?.startSeconds)}</span>
                </div>
                <div className="w-full h-10 rounded bg-black/60 relative overflow-hidden flex items-center justify-center mb-1">
                  {hasAsset ? (
                    isVideo(assignedUrl) ? (
                      <div className="flex items-center gap-1 text-[8.5px] font-bold text-orange-400">
                        <Video size={12} /> Video
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={toAbsoluteS3AssetUrl(assignedUrl)}
                        alt={scene.heading || "Visual"}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <span className="text-[8.5px] font-bold text-zinc-500">Text Only</span>
                  )}
                  {isUser && (
                    <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                  )}
                </div>
                <span className="text-[8.5px] font-medium text-zinc-400 truncate block">
                  {scene.heading || scene.layoutType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scene-by-Scene Cards ── */}
      <div className="space-y-3.5">
        {scenes.map((scene) => {
          const assignedUrl = brollUrls[scene.sceneNumber];
          const hasAsset = Boolean(assignedUrl);
          const isUser = isUserUpload(assignedUrl);
          const isVid = isVideo(assignedUrl);
          const isModalOpen = activeSwapSceneNumber === scene.sceneNumber;

          // Find Vision AI metadata for assigned upload if present
          const matchedUploadedMeta = uploadedAssets.find((u) => u.url === assignedUrl);

          return (
            <div
              key={scene.sceneNumber}
              className={`rounded-2xl border transition-all ${
                isModalOpen
                  ? "border-[#FF5722] bg-[#141B2D] ring-1 ring-[#FF5722]/50 shadow-lg"
                  : "border-white/10 bg-[#111625] hover:border-white/20"
              }`}
            >
              <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* 1. Left Column: Scene Metadata & Time */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] uppercase font-bold text-zinc-500">Scene</span>
                    <span className="text-base font-extrabold text-white leading-none">
                      {scene.sceneNumber}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                        {formatTime(scene.narrationSegment?.startSeconds)} - {formatTime(scene.narrationSegment?.endSeconds)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-300 px-2 py-0.5 rounded">
                        {scene.layoutType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1">
                      {scene.heading || "Visual Scene Beat"}
                    </p>
                  </div>
                </div>

                {/* 2. Center Column: Spoken Script & Keywords */}
                <div className="flex-1 w-full md:px-4">
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    &ldquo;{scene.narrationSegment?.text}&rdquo;
                  </p>
                  {scene.highlightedWords && scene.highlightedWords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-zinc-500 font-semibold">Keywords:</span>
                      {scene.highlightedWords.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="rounded bg-yellow-400/15 border border-yellow-400/30 px-1.5 py-0.5 text-[10px] font-bold text-yellow-300"
                        >
                          ✦ {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Right Column: Assigned Asset & Swap Button */}
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  <div className="flex items-center gap-2.5">
                    {/* Visual Asset Thumbnail */}
                    <div className="w-24 h-14 rounded-lg bg-black/60 border border-white/15 relative overflow-hidden flex items-center justify-center shadow-inner">
                      {hasAsset ? (
                        isVid ? (
                          <div className="flex flex-col items-center text-orange-400">
                            <Video size={18} />
                            <span className="text-[8px] font-bold uppercase mt-0.5">Video Clip</span>
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
                        <div className="text-center text-zinc-500 p-1">
                          <span className="text-[9px] font-bold block leading-tight">Typography</span>
                          <span className="text-[8px] block">No visual</span>
                        </div>
                      )}

                      {/* User upload badge indicator */}
                      {isUser && (
                        <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[7.5px] font-black uppercase px-1 rounded shadow">
                          User Upload
                        </span>
                      )}
                    </div>

                    {/* Metadata details */}
                    <div className="max-w-[140px] text-left">
                      <p className="text-[11px] font-bold text-white truncate">
                        {matchedUploadedMeta?.title || getCleanFileName(assignedUrl) || (hasAsset ? "Stock Asset" : "Kinetic Text")}
                      </p>
                      <p className="text-[9.5px] text-zinc-400 truncate">
                        {isUser ? "👤 Custom Upload" : hasAsset ? "✨ AI Stock Library" : "🔤 Clean Typography"}
                      </p>
                      {matchedUploadedMeta?.tags && matchedUploadedMeta.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Tag size={9} className="text-emerald-400 shrink-0" />
                          <span className="text-[9px] text-emerald-300 font-mono truncate">
                            {matchedUploadedMeta.tags.slice(0, 2).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Swap / Change Button */}
                  <button
                    type="button"
                    onClick={() => setActiveSwapSceneNumber(isModalOpen ? null : scene.sceneNumber)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                      isModalOpen
                        ? "border-[#FF5722] bg-[#FF5722] text-white shadow-lg"
                        : "border-white/15 bg-white/5 text-zinc-200 hover:border-[#FF5722]/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ArrowLeftRight size={13} />
                    <span>{isModalOpen ? "Close" : "Swap"}</span>
                  </button>
                </div>
              </div>

              {/* ── INLINE SWAP DRAWER / MODAL ── */}
              {isModalOpen && (
                <div className="border-t border-white/10 bg-[#0B0F19] p-4 rounded-b-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Choose Asset for Scene #{scene.sceneNumber}:</span>
                      {hasAsset && (
                        <button
                          type="button"
                          onClick={() => handleClearAssetFromScene(scene.sceneNumber)}
                          className="text-[10.5px] font-bold text-red-400 hover:text-red-300 transition underline cursor-pointer"
                        >
                          Clear Visual (Make Typography Only)
                        </button>
                      )}
                    </div>

                    {/* Source Tab Toggle */}
                    <div className="inline-flex rounded-xl bg-black/40 border border-white/10 p-0.5">
                      <button
                        type="button"
                        onClick={() => setSwapTab("uploads")}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                          swapTab === "uploads"
                            ? "bg-[#FF5722] text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Your Uploads ({uploadedAssets.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSwapTab("library")}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                          swapTab === "library"
                            ? "bg-[#FF5722] text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        AI Stock Library ({QUICK_STOCK_OPTIONS.length})
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: User Uploaded Assets */}
                  {swapTab === "uploads" && (
                    <div className="space-y-2">
                      {uploadedAssets.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-[#121624] p-4 text-center text-xs text-zinc-400">
                          <p>No custom photos or video clips uploaded yet.</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Use the &ldquo;Upload Custom Media&rdquo; section above to add your own visual assets.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto pr-1">
                          {uploadedAssets.map((asset, aIdx) => {
                            const isSelected = assignedUrl === asset.url;
                            const isVid = asset.mediaType === "video" || isVideo(asset.url);
                            return (
                              <button
                                key={`${asset.url}_${aIdx}`}
                                type="button"
                                onClick={() => handleAssignAssetToScene(scene.sceneNumber, asset.url)}
                                className={`rounded-xl border p-2 text-left transition flex flex-col justify-between group cursor-pointer relative ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500"
                                    : "border-white/10 bg-[#161C2E] hover:border-orange-500/60 hover:bg-[#1E263E]"
                                }`}
                              >
                                <div className="w-full h-16 rounded-lg bg-black/50 overflow-hidden relative flex items-center justify-center mb-1.5">
                                  {isVid ? (
                                    <Video size={22} className="text-orange-400" />
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
                                      <Check size={10} />
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] font-bold text-white truncate w-full">
                                  {asset.title || asset.fileName}
                                </p>
                                <div className="flex flex-wrap gap-0.5 mt-1 overflow-hidden h-4">
                                  {asset.tags?.slice(0, 2).map((t, tidx) => (
                                    <span
                                      key={tidx}
                                      className="text-[8px] font-mono text-zinc-400 bg-black/40 px-1 rounded truncate max-w-[50px]"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Curated Stock Library */}
                  {swapTab === "library" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {QUICK_STOCK_OPTIONS.map((stock, sIdx) => {
                        const isSelected = assignedUrl === stock.url;
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleAssignAssetToScene(scene.sceneNumber, stock.url)}
                            className={`rounded-xl border p-2 text-left transition flex flex-col justify-between cursor-pointer relative ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500"
                                : "border-white/10 bg-[#161C2E] hover:border-orange-500/60 hover:bg-[#1E263E]"
                            }`}
                          >
                            <div className="w-full h-16 rounded-lg bg-black/50 overflow-hidden relative mb-1.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={toAbsoluteS3AssetUrl(stock.url)}
                                alt={stock.title}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <span className="absolute top-1 right-1 p-0.5 rounded-full bg-emerald-500 text-white">
                                  <Check size={10} />
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold text-white truncate w-full">
                              {stock.title}
                            </p>
                            <div className="flex flex-wrap gap-0.5 mt-1 overflow-hidden h-4">
                              {stock.tags.slice(0, 3).map((t, tidx) => (
                                <span
                                  key={tidx}
                                  className="text-[8px] font-mono text-zinc-400 bg-black/40 px-1 rounded"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
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
