"use client";

import { useState } from "react";
import {
  Type, Palette, Wand2, Image as ImageIcon, Plus, Minus, Check, Upload, RefreshCw, Sparkles, Sliders
} from "lucide-react";
import type { PreviewCaption } from "./types";

type Props = {
  activeCaption?: PreviewCaption;
  activeCaptionIndex: number;
  totalCaptions: number;
  fontSize: string;
  fontFamily: string;
  textColor: string;
  highlightColor: string;
  accentColor: string;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onHighlightColorChange: (color: string) => void;
  onCaptionTextChange: (index: number, newLead: string, newHero: string, newSub?: string) => void;
  onImageChange: (index: number, newImageUrl: string) => void;
  onAiPromptEdit?: (prompt: string) => void;
};

type InspectorTab = "text" | "typography" | "color" | "animation" | "ai";

const FONT_OPTIONS = [
  { label: "Montserrat (Bold Clean)", value: "Montserrat, sans-serif" },
  { label: "Plus Jakarta Sans (Modern)", value: "Inter, 'Plus Jakarta Sans', sans-serif" },
  { label: "Playfair Display (Luxury Serif)", value: "'Playfair Display', serif" },
  { label: "Bodoni Moda (Editorial Elegant)", value: "'Bodoni Moda', serif" },
  { label: "Oswald (High Impact Caps)", value: "Oswald, sans-serif" },
];

const PRESET_IMAGES = [
  { label: "Modern Luxury Villa", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80" },
  { label: "Sunset Skyline Estate", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80" },
  { label: "Architectural Glass Home", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80" },
  { label: "Minimalist Penthouse", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80" },
];

export function StudioInspectorToolbar({
  activeCaption,
  activeCaptionIndex,
  totalCaptions,
  fontSize,
  fontFamily,
  textColor,
  highlightColor,
  onFontSizeChange,
  onFontFamilyChange,
  onTextColorChange,
  onHighlightColorChange,
  onCaptionTextChange,
  onImageChange,
  onAiPromptEdit,
}: Props) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("text");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isApplyingPrompt, setIsApplyingPrompt] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  // Local text state for active phrase
  const leadText = activeCaption?.leadText || activeCaption?.text || "";
  const heroText = activeCaption?.heroText || "";
  const subText = activeCaption?.subText || "";

  // Numerical font size scale conversion
  const numericSize = fontSize === "small" ? 36 : fontSize === "medium" ? 48 : fontSize === "large" ? 64 : 80;

  const handleDecreaseSize = () => {
    if (numericSize > 64) onFontSizeChange("large");
    else if (numericSize > 48) onFontSizeChange("medium");
    else onFontSizeChange("small");
  };

  const handleIncreaseSize = () => {
    if (numericSize < 48) onFontSizeChange("medium");
    else if (numericSize < 64) onFontSizeChange("large");
    else onFontSizeChange("extra-large");
  };

  const handleAiPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsApplyingPrompt(true);
    if (onAiPromptEdit) {
      onAiPromptEdit(aiPrompt);
    } else {
      onCaptionTextChange(activeCaptionIndex, leadText, aiPrompt.toUpperCase(), subText);
    }
    setTimeout(() => {
      setIsApplyingPrompt(false);
      setAiPrompt("");
    }, 400);
  };

  return (
    <div className="bg-zinc-950/95 rounded-2xl border border-zinc-800/80 p-4 shadow-2xl backdrop-blur-md space-y-3 text-xs select-none">
      {/* Inspector Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="font-extrabold text-zinc-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Sliders size={14} className="text-emerald-400" />
          <span>Inspector Controls</span>
        </div>

        {/* Tab Buttons matching architecture diagram: [Text] [Typography] [Color] [Animation] [AI Edit] */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "text", label: "Text", icon: Type },
            { id: "typography", label: "Typography", icon: Sliders },
            { id: "color", label: "Color", icon: Palette },
            { id: "animation", label: "Animation", icon: Sparkles },
            { id: "ai", label: "AI Edit", icon: Wand2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as InspectorTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* INSPECTOR PANEL CONTENT BASED ON ACTIVE TAB */}
      <div className="pt-1">
        {/* TAB 1: TEXT */}
        {activeTab === "text" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 space-y-1.5">
              <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                Lead-in Context Text
              </label>
              <input
                type="text"
                value={leadText}
                onChange={(e) => onCaptionTextChange(activeCaptionIndex, e.target.value, heroText, subText)}
                placeholder="e.g. Walking into..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 space-y-1.5">
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                3D Hero Headline Text
              </label>
              <input
                type="text"
                value={heroText}
                onChange={(e) => onCaptionTextChange(activeCaptionIndex, leadText, e.target.value, subText)}
                placeholder="e.g. NEW TERRITORY"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white font-black uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 space-y-1.5">
              <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Subtext Accent
              </label>
              <input
                type="text"
                value={subText}
                onChange={(e) => onCaptionTextChange(activeCaptionIndex, leadText, heroText, e.target.value)}
                placeholder="e.g. asking the right questions"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white font-medium italic focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY */}
        {activeTab === "typography" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Font Size Adjustment
              </label>
              <div className="flex items-center justify-between bg-zinc-950 rounded-lg p-1.5 border border-zinc-800">
                <button
                  onClick={handleDecreaseSize}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  Size: {numericSize}px
                </span>
                <button
                  onClick={handleIncreaseSize}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Custom Scene Image
              </label>
              <button
                onClick={() => setShowImagePickerModal(true)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <ImageIcon size={13} />
                <span>{activeCaption?.customImage ? "Image Custom Set" : "Change Image"}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: COLOR */}
        {activeTab === "color" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Subtitle Text Color</div>
                <div className="text-[10px] text-zinc-400">Crisp lead-in & subtext font color</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => onTextColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-xs text-zinc-300">{textColor}</span>
              </div>
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">3D Metallic Gradient</div>
                <div className="text-[10px] text-zinc-400">Hero headline metallic shine color</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => onHighlightColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-xs text-zinc-300">{highlightColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANIMATION */}
        {activeTab === "animation" && (
          <div className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles size={14} />
                3D Pop Spring & Neon Motion Trails
              </div>
              <p className="text-[11px] text-zinc-400">
                Kinetic typography motion animations active (Spring Dampening 15, Mass 0.5, Stiffness 140).
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
              Enabled
            </div>
          </div>
        )}

        {/* TAB 5: AI EDIT */}
        {activeTab === "ai" && (
          <form onSubmit={handleAiPromptSubmit} className="bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 space-y-2">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Wand2 size={13} />
              AI Prompt Instruction
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder='AI: "Make this headline more impactful..."'
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!aiPrompt.trim() || isApplyingPrompt}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
              >
                {isApplyingPrompt ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Wand2 size={14} />
                    Apply AI Edit
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* IMAGE PICKER MODAL */}
      {showImagePickerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-400" />
                Change Image for Phrase {activeCaptionIndex + 1}
              </h3>
              <button
                onClick={() => setShowImagePickerModal(false)}
                className="text-zinc-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Custom Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    if (customImageUrl) {
                      onImageChange(activeCaptionIndex, customImageUrl);
                      setShowImagePickerModal(false);
                    }
                  }}
                  disabled={!customImageUrl}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Stock Presets */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="text-xs font-semibold text-zinc-300">Select Preset High-Res Stock Asset</label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onImageChange(activeCaptionIndex, img.url);
                      setShowImagePickerModal(false);
                    }}
                    className="relative group rounded-xl overflow-hidden border border-zinc-800 hover:border-blue-500 text-left transition-all h-20"
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex items-end">
                      <span className="text-[10px] font-bold text-white leading-tight drop-shadow">
                        {img.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
