"use client";

import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowRight,
  Check,
  Smartphone,
  Monitor,
  Image as ImageIcon,
  Film,
  Type,
  Sparkles,
  Captions,
  Layers,
} from "lucide-react";

export interface FormatOption {
  aspectRatio: "9:16" | "16:9";
  label: string;
  sublabel: string;
  resolution: string;
  duration: string;
  pricing: string;
  isFree?: boolean;
  href: string;
  features: string[];
  image?: string;
}

export interface UnifiedToolModalData {
  id: string;
  title: string;
  description: string;
  categoryBadge?: string;
  options: [FormatOption, FormatOption];
}

interface FormatSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: UnifiedToolModalData | null;
}

const INCLUDED_CHIPS = [
  { icon: Type,      label: "Text"       },
  { icon: ImageIcon, label: "Images"     },
  { icon: Layers,    label: "SVGs"       },
  { icon: Film,      label: "Video Clips"},
  { icon: Sparkles,  label: "Animations" },
  { icon: Captions,  label: "Subtitles"  },
];

const PLATFORM_COPY: Record<string, { platform: string; icon: React.ElementType }> = {
  "9:16": { platform: "Instagram · TikTok · YouTube Shorts", icon: Smartphone },
  "16:9": { platform: "YouTube · Docs · Presentations",      icon: Monitor     },
};

export default function FormatSelectorModal({
  isOpen,
  onClose,
  tool,
}: FormatSelectorModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<"9:16" | "16:9">("16:9");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setSelected("16:9");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !tool) return null;

  const handleContinue = () => {
    const opt = tool.options.find((o) => o.aspectRatio === selected);
    if (opt) { onClose(); router.push(opt.href); }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="format-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop — dark so white modal pops */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── White modal shell ── */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white shadow-2xl shadow-black/40 overflow-hidden border border-zinc-200">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-zinc-100">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
              Choose Format
            </p>
            <h2
              id="format-modal-title"
              className="text-2xl font-black text-zinc-900 tracking-tight leading-none"
            >
              {tool.title}
            </h2>
            <p className="text-sm text-zinc-500 mt-1.5 font-medium">
              Select the aspect ratio that fits your platform.
            </p>
          </div>

          {/* Close — prominent on white bg */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-300 bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 hover:border-zinc-400 transition cursor-pointer shadow-sm"
            aria-label="Close format selector"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Format cards ── */}
        <div className="grid grid-cols-2 gap-3 px-5 pt-5">
          {tool.options.map((opt) => {
            const isSelected = selected === opt.aspectRatio;
            const is916      = opt.aspectRatio === "9:16";
            const meta       = PLATFORM_COPY[opt.aspectRatio];
            const PlatIcon   = meta.icon;

            return (
              <button
                key={opt.aspectRatio}
                type="button"
                onClick={() => setSelected(opt.aspectRatio)}
                className={`group relative flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer text-left focus:outline-none ${
                  isSelected
                    ? "border-orange-500 shadow-md shadow-orange-200"
                    : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                }`}
              >
                {/* Orange selected checkmark */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 shadow-sm shadow-orange-400/50">
                    <Check size={13} className="text-white" strokeWidth={3} />
                  </span>
                )}

                {/* Preview image — fixed height both cards */}
                <div className="relative w-full h-40 overflow-hidden bg-zinc-100">
                  {opt.image ? (
                    <Image
                      src={opt.image}
                      alt={`${opt.aspectRatio} format preview`}
                      fill
                      // For 9:16 collage image: focus on center-top to show clearest single frame
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                        isSelected ? "brightness-100" : "brightness-90 group-hover:brightness-100"
                      } ${is916 ? "object-top" : "object-center"}`}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                      <span className="text-3xl font-black text-zinc-200">{opt.aspectRatio}</span>
                    </div>
                  )}
                </div>

                {/* Card info footer — orange-50 when selected, white otherwise */}
                <div
                  className={`px-3 py-3 flex flex-col gap-1 border-t transition-colors duration-200 ${
                    isSelected
                      ? "bg-orange-50 border-orange-100"
                      : "bg-white border-zinc-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black tracking-tight ${
                        isSelected ? "text-orange-600" : "text-zinc-800"
                      }`}
                    >
                      {opt.aspectRatio}
                    </span>
                    <span className="text-xs text-zinc-500 font-semibold">
                      {is916 ? "Vertical" : "Landscape"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PlatIcon size={11} className="text-zinc-400 shrink-0" />
                    <span className="text-[10px] text-zinc-500 font-medium leading-tight">
                      {meta.platform}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Included chips ── */}
        <div className="px-5 pt-4 pb-1">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Included
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INCLUDED_CHIPS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-semibold text-zinc-600"
              >
                <Icon size={10} className="text-zinc-400" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Single CTA ── */}
        <div className="px-5 pt-4 pb-5">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-orange-500/25"
          >
            Continue with{" "}
            {selected === "9:16" ? "9:16 Vertical" : "16:9 Landscape"}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* ── Footer ── visible contrast on white */}
        <div className="px-6 pb-5 -mt-1 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
          <span>You can switch formats later</span>
          <span className="font-mono">Esc to close</span>
        </div>
      </div>
    </div>
  );
}
