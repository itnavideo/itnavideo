"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Sparkles,
  Play,
  Pause,
  Layers,
  Search,
  ArrowRight,
  Palette,
  Film,
  Zap,
  Type,
} from "lucide-react";
import {
  KINETIC_STYLES,
  KineticStyleDefinition,
  KineticCaptionWord,
  KINETIC_DEMO_WORDS,
} from "@/lib/captions/kineticStyles";
import { KineticCaptionLiveRenderer } from "@/components/captions/KineticCaptionLiveRenderer";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import {
  ALL_STYLES_MASTER,
  getPresetCategoryLabel,
  getPresetPosterUrl,
} from "@/components/dashboard/AutoCaptionStyleCarousel";

export interface AutoCaptionExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPreset: string;
  onSelectPreset: (presetName: string) => void;
  onSelectSampleWithPreset: (presetName: string) => void;
}

type TabType = "kinetic" | "templates";
type KineticFilterCategory = "all" | "single-word" | "line" | "stack" | "typewriter" | "editorial";

const COLOR_PRESETS = [
  { name: "Electric Blue", hex: "#0066FF" },
  { name: "Neon Gold", hex: "#FFE14D" },
  { name: "Electric Cyan", hex: "#00E5FF" },
  { name: "Hot Pink", hex: "#FF4081" },
  { name: "Emerald Green", hex: "#00E676" },
  { name: "Pure White", hex: "#FFFFFF" },
];

export function AutoCaptionExploreModal({
  isOpen,
  onClose,
  selectedPreset,
  onSelectPreset,
  onSelectSampleWithPreset,
}: AutoCaptionExploreModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("kinetic");

  // Kinetic state
  const [activeKineticIndex, setActiveKineticIndex] = useState<number>(() => {
    const found = KINETIC_STYLES.findIndex((s) => s.name === selectedPreset);
    return found >= 0 ? found : 12; // Default to Retro Shadow (index 12)
  });
  const [kineticCategory, setKineticCategory] = useState<KineticFilterCategory>("all");
  const [kineticSearch, setKineticSearch] = useState("");
  const [accentColor, setAccentColor] = useState("#FFE14D");
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState(false);

  // Template gallery state
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState<string>("all");

  const activeKinetic: KineticStyleDefinition = KINETIC_STYLES[activeKineticIndex] || KINETIC_STYLES[0];

  // Auto-switch kinetic style timer
  useEffect(() => {
    if (!autoSwitch || !isOpen || activeTab !== "kinetic") return;
    const interval = setInterval(() => {
      setActiveKineticIndex((prev) => (prev + 1) % KINETIC_STYLES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoSwitch, isOpen, activeTab]);

  // Scrub animation loop when isPlaying is true
  useEffect(() => {
    if (!isOpen || !isPlaying || activeTab !== "kinetic") return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setCurrentTime((prev) => {
        const next = prev + dt;
        return next > 14.5 ? 0 : next;
      });
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPlaying, activeTab]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered kinetic styles
  const filteredKineticStyles = useMemo(() => {
    return KINETIC_STYLES.filter((style) => {
      if (kineticSearch.trim()) {
        const q = kineticSearch.toLowerCase().trim();
        const matchName = style.name.toLowerCase().includes(q);
        const matchCategory = style.category.toLowerCase().includes(q);
        const matchAnim = style.animation.toLowerCase().includes(q);
        if (!matchName && !matchCategory && !matchAnim) return false;
      }
      if (kineticCategory === "single-word") return style.layout === "o";
      if (kineticCategory === "line") return style.layout === "l";
      if (kineticCategory === "stack") return style.layout === "s";
      if (kineticCategory === "typewriter") return style.layout === "t";
      if (kineticCategory === "editorial") return style.layout === "e";
      return true;
    });
  }, [kineticCategory, kineticSearch]);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return ALL_STYLES_MASTER.filter((key) => {
      const preset = SUBTITLE_PRESETS[key];
      if (!preset) return false;
      if (templateSearch.trim()) {
        const q = templateSearch.toLowerCase().trim();
        const matchName = key.toLowerCase().includes(q);
        const matchFont = preset.fontFamily?.toLowerCase().includes(q);
        if (!matchName && !matchFont) return false;
      }
      if (templateCategory !== "all") {
        const cat = getPresetCategoryLabel(key).toLowerCase();
        if (!cat.includes(templateCategory.toLowerCase())) return false;
      }
      return true;
    });
  }, [templateSearch, templateCategory]);

  if (!isOpen) return null;

  const handleUseKinetic = (styleName: string) => {
    onSelectPreset(styleName);
    onSelectSampleWithPreset(styleName);
    onClose();
  };

  const handleUseTemplate = (templateName: string) => {
    onSelectPreset(templateName);
    onSelectSampleWithPreset(templateName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0052CC] to-[#0066FF] text-white shadow-sm shadow-[#0066FF]/30">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-jakarta">
                  Explore Styles &amp; Templates
                </h2>
                <span className="rounded-full bg-blue-100 text-[#0066FF] text-[10px] font-black px-2 py-0.5 border border-blue-200">
                  50+ Kinetic Styles
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Word-synchronized kinetic animations &amp; creator subtitle presets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Switcher */}
            <div className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-200/80 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab("templates")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                  activeTab === "templates"
                    ? "bg-white text-slate-900 shadow-xs font-black"
                    : "hover:text-slate-900"
                }`}
              >
                <Type size={13} className="text-[#0066FF]" />
                <span>Caption Style Templates (Names Only)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("kinetic")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                  activeTab === "kinetic"
                    ? "bg-gradient-to-r from-[#0052CC] to-[#0066FF] text-white shadow-xs font-black"
                    : "hover:text-slate-900"
                }`}
              >
                <Film size={13} />
                <span>Kinetic Styles (With Videos)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex border-b border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("templates")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg text-center transition ${
              activeTab === "templates" ? "bg-white text-[#0066FF] shadow-xs" : "text-slate-600"
            }`}
          >
            Style Templates (Names Only)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kinetic")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg text-center transition ${
              activeTab === "kinetic" ? "bg-white text-[#0066FF] shadow-xs" : "text-slate-600"
            }`}
          >
            Kinetic Styles (With Videos)
          </button>
        </div>

        {/* ── Modal Content ── */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "kinetic" ? (
            /* TAB 1: 50 KINETIC STYLES */
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
              {/* Left Column: Live 9:16 Interactive Phone Preview */}
              <div className="lg:col-span-5 p-5 sm:p-7 bg-slate-900 text-white flex flex-col items-center justify-between border-r border-slate-800">
                <div className="w-full max-w-[270px] space-y-4">
                  {/* Phone Mockup */}
                  <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-[#0B1214] border-2 border-slate-700 shadow-2xl">
                    <KineticCaptionLiveRenderer
                      styleName={activeKinetic.name}
                      words={KINETIC_DEMO_WORDS}
                      playbackTime={currentTime}
                      isPlaying={isPlaying}
                      accentColor={accentColor}
                      className="w-full h-full"
                    />

                    {/* Active Style Watermark Tag */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-white/90 uppercase tracking-wider">
                        #{activeKinetic.index + 1} · {activeKinetic.name}
                      </span>
                      <span className="rounded-md bg-[#0066FF]/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                        {activeKinetic.layout === "o"
                          ? "One Word"
                          : activeKinetic.layout === "l"
                          ? "Line"
                          : activeKinetic.layout === "s"
                          ? "Stack"
                          : activeKinetic.layout === "t"
                          ? "Typewriter"
                          : "Editorial"}
                      </span>
                    </div>
                  </div>

                  {/* Player Controls & Scrubber */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold cursor-pointer"
                      >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={14.8}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                        className="flex-1 accent-[#0066FF] cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                        {currentTime.toFixed(1)}s
                      </span>
                    </div>

                    {/* Color Presets */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Palette size={11} className="text-[#0066FF]" /> Accent
                      </span>
                      <div className="flex items-center gap-1.5">
                        {COLOR_PRESETS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setAccentColor(c.hex)}
                            title={c.name}
                            style={{ backgroundColor: c.hex }}
                            className={`h-4 w-4 rounded-full border transition-all cursor-pointer ${
                              accentColor.toLowerCase() === c.hex.toLowerCase()
                                ? "scale-125 border-white shadow-xs"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="w-full max-w-[270px] pt-4">
                  <button
                    type="button"
                    onClick={() => handleUseKinetic(activeKinetic.name)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#2563EB] text-white text-xs sm:text-sm font-bold transition-all hover:brightness-105 active:scale-98 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer font-jakarta"
                  >
                    <Sparkles size={15} />
                    <span>Use &quot;{activeKinetic.name}&quot; &amp; Start →</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1.5 font-medium">
                    Loads sample reel with this kinetic style selected
                  </p>
                </div>
              </div>

              {/* Right Column: Style Selector & Categories */}
              <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col space-y-4">
                {/* Search & Auto-switch Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search 50 styles (e.g., Pop, Glitch, Neon, Retro)..."
                      value={kineticSearch}
                      onChange={(e) => setKineticSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0066FF] focus:outline-none transition"
                    />
                    {kineticSearch && (
                      <button
                        type="button"
                        onClick={() => setKineticSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSwitch}
                      onChange={(e) => setAutoSwitch(e.target.checked)}
                      className="rounded text-[#0066FF] focus:ring-[#0066FF] h-4 w-4"
                    />
                    <span>Auto-switch every 3.5s</span>
                  </label>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                  {[
                    { id: "all", label: "All 50" },
                    { id: "single-word", label: "Single Word (20)" },
                    { id: "line", label: "Line Rhythm (23)" },
                    { id: "stack", label: "Stacks (3)" },
                    { id: "typewriter", label: "Typewriter (2)" },
                    { id: "editorial", label: "Editorial (2)" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setKineticCategory(cat.id as KineticFilterCategory)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        kineticCategory === cat.id
                          ? "bg-[#0066FF] border-[#0066FF] text-white shadow-xs font-black"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* 50 Styles Grid / Chips */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {filteredKineticStyles.map((style) => {
                      const isSelected = activeKinetic.index === style.index;
                      return (
                        <div
                          key={style.id}
                          onClick={() => setActiveKineticIndex(style.index)}
                          className={`relative p-3 rounded-2xl border text-left cursor-pointer transition-all group ${
                            isSelected
                              ? "border-[#0066FF] bg-blue-50/70 shadow-sm ring-2 ring-[#0066FF]/30"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                                isSelected
                                  ? "bg-[#0066FF] text-white"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                              }`}
                            >
                              #{style.index + 1}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 capitalize">
                              {style.animation || style.layout}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-black text-slate-800 font-jakarta line-clamp-1">
                            {style.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {style.category}
                          </p>

                          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold">
                              {style.layout === "o"
                                ? "1 Word"
                                : style.layout === "l"
                                ? "Line Rhythm"
                                : style.layout === "s"
                                ? "Stack"
                                : style.layout === "t"
                                ? "Typewriter"
                                : "Editorial"}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseKinetic(style.name);
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition cursor-pointer ${
                                isSelected
                                  ? "bg-[#0066FF] text-white hover:bg-[#0052CC]"
                                  : "bg-slate-100 text-slate-700 hover:bg-[#0066FF] hover:text-white"
                              }`}
                            >
                              Use Style
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: VIDEO TEMPLATES */
            <div className="p-5 sm:p-8 space-y-5">
              {/* Filter & Search Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search templates (e.g., Hormozi, Beast, Glow, Minimal)..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0066FF] focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                  {[
                    { id: "all", label: "All Templates" },
                    { id: "viral", label: "Viral Bold" },
                    { id: "glow", label: "Glow & Neon" },
                    { id: "kinetic", label: "Kinetic Motion" },
                    { id: "minimal", label: "Minimalist" },
                    { id: "cinematic", label: "Cinematic" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTemplateCategory(tab.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        templateCategory === tab.id
                          ? "bg-[#0066FF] border-[#0066FF] text-white shadow-xs font-black"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredTemplates.slice(0, 30).map((key) => {
                  const preset = SUBTITLE_PRESETS[key];
                  if (!preset) return null;
                  const posterUrl = getPresetPosterUrl(key);

                  return (
                    <div
                      key={key}
                      className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
                    >
                      {/* Video / Poster Box */}
                      <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                        <img
                          src={posterUrl}
                          alt={key}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                        {/* Top Category Badge */}
                        <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {getPresetCategoryLabel(key)}
                        </span>

                        {/* Centered Play / Sample Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleUseTemplate(key)}
                            className="h-10 w-10 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition cursor-pointer"
                          >
                            <Play size={16} className="ml-0.5" />
                          </button>
                        </div>
                      </div>

                      {/* Info & Action */}
                      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                        <div>
                          <p className="text-xs font-black text-slate-900 truncate font-jakarta">
                            {key}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            {preset.fontFamily || "Sans-serif"} · {preset.style || "Clean"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUseTemplate(key)}
                          className="w-full py-1.5 rounded-xl bg-blue-50 hover:bg-[#0066FF] hover:text-white border border-blue-200 text-xs font-bold text-[#0066FF] transition text-center cursor-pointer"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
