"use client";

import React, { useState } from "react";
import { Sparkles, Check, Play, Film, Layers, Type, Flame } from "lucide-react";

export interface KineticTemplate {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  tag: string;
  description: string;
  previewVideo: string;
  fontCombo: string;
  colorPalette: string[];
  isReady: boolean;
}

export const KINETIC_TEMPLATES: KineticTemplate[] = [
  {
    id: "creator-editorial",
    title: "Creator Editorial",
    subtitle: "Hybrid Serif & Bold Sans",
    badge: "Template #01",
    tag: "🔥 Viral Creator",
    description: "Multi-font typography featuring bold sans-serif keywords with elegant italic serif accents, smart headroom/chest placement, and electric yellow pops.",
    previewVideo: "https://res.cloudinary.com/dhouh9idx/video/upload/v1792952622/vidssave.com_Great_Update_for_AI_Channels_youtube_480P_inrbb1.mp4",
    fontCombo: "Montserrat Heavy + Playfair Display Italic",
    colorPalette: ["#FFFFFF", "#FACC15", "#070B14"],
    isReady: true,
  },
  {
    id: "coming-soon-02",
    title: "Next Creator Template",
    subtitle: "New Reference Template",
    badge: "Template #02",
    tag: "⚡ Expanding Suite",
    description: "New kinetic typography templates based on top creator references are being rolled out.",
    previewVideo: "",
    fontCombo: "Curated Typography",
    colorPalette: ["#FF5722", "#FFFFFF", "#111827"],
    isReady: false,
  },
];

interface TypographyTemplatePickerProps {
  value?: string;
  onChange?: (templateId: string) => void;
}

export function TypographyTemplatePicker({
  value = "creator-editorial",
  onChange,
}: TypographyTemplatePickerProps) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>("creator-editorial");

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Step Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFA000] text-black text-sm font-black shadow-md shadow-[#FF5722]/30">
            2
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Film size={18} className="text-[#FF9100]" />
              <span>Select Kinetic Template</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FFA000]">
                Reference Matching
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Upload your video or audio above. Your final output will replicate the exact typography choreography, font hierarchy, and timing of the chosen template.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-mono font-bold text-emerald-400 shrink-0">
          <Sparkles size={12} />
          <span>9:16 Shorts • 1 Credit</span>
        </div>
      </div>

      {/* Templates Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KINETIC_TEMPLATES.map((tmpl) => {
          const isSelected = value === tmpl.id || (value === "" && tmpl.id === "creator-editorial");

          return (
            <div
              key={tmpl.id}
              onClick={() => {
                if (tmpl.isReady) {
                  onChange?.(tmpl.id);
                }
              }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 text-left ${
                tmpl.isReady ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              } ${
                isSelected
                  ? "border-[#FF5722] bg-gradient-to-b from-[#1E1715] to-[#120F0D] ring-2 ring-[#FF5722]/40 shadow-xl shadow-[#FF5722]/15 -translate-y-1"
                  : "border-white/10 bg-[#161720]/80 hover:border-white/20 hover:bg-[#1A1C28]"
              }`}
            >
              <div>
                {/* Video Preview Stage */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black/80 border-b border-white/5">
                  {tmpl.previewVideo ? (
                    <video
                      src={tmpl.previewVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-900 to-black">
                      <Layers size={28} className="text-zinc-600 mb-2" />
                      <span className="text-xs font-bold text-zinc-400">Coming Soon</span>
                    </div>
                  )}

                  {/* Gradient Overlay for Video Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badge Row */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className="rounded-full bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-400">
                      {tmpl.badge}
                    </span>

                    <span className="rounded-full bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      {tmpl.tag}
                    </span>
                  </div>

                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full bg-[#FF5722] px-3 py-1 text-[11px] font-black text-black shadow-lg">
                      <Check size={13} strokeWidth={3} />
                      <span>Active Template</span>
                    </div>
                  )}
                </div>

                {/* Template Content & Specs */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#FFA000] transition-colors">
                        {tmpl.title}
                      </h4>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {tmpl.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Font Combo & Palette Spec Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Type size={12} className="text-[#FF9100]" />
                      <span className="font-mono text-[10px]">{tmpl.fontCombo}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {tmpl.colorPalette.map((color, i) => (
                        <span
                          key={i}
                          className="h-3 w-3 rounded-full border border-white/30"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TypographyTemplatePicker;
