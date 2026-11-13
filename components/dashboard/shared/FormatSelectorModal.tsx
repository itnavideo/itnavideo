"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Smartphone,
  Film,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  Monitor,
} from "lucide-react";

export interface FormatOption {
  aspectRatio: "9:16" | "16:9";
  label: string; // e.g. "9:16 Vertical Shorts"
  sublabel: string; // e.g. "Reels · Shorts · TikTok"
  resolution: string; // "1080×1920 Full HD"
  duration: string; // "Up to 90 Seconds"
  pricing: string; // "1 Credit / Video" or "FREE · 5/Day"
  isFree?: boolean;
  href: string; // Destination studio route
  features: string[];
}

export interface UnifiedToolModalData {
  id: string;
  title: string; // e.g. "Faceless Video"
  description: string;
  categoryBadge?: string;
  options: [FormatOption, FormatOption];
}

interface FormatSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: UnifiedToolModalData | null;
}

export default function FormatSelectorModal({
  isOpen,
  onClose,
  tool,
}: FormatSelectorModalProps) {
  const router = useRouter();

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !tool) return null;

  const handleSelectFormat = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="format-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Dark frosted glass backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#101015] p-6 sm:p-8 shadow-2xl shadow-black/80 z-10 animate-scaleUp overflow-hidden">
        {/* Subtle Ambient Glow Behind Modal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-500/20 blur-3xl rounded-full"
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 mb-6 relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={12} />
                <span>Format Selector</span>
              </span>
              {tool.categoryBadge && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium">
                  {tool.categoryBadge}
                </span>
              )}
            </div>
            <h2
              id="format-modal-title"
              className="text-2xl sm:text-3xl font-black text-white tracking-tight"
            >
              {tool.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
              {tool.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer shadow-xs"
            aria-label="Close format selector modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Aspect Ratio Cards Grid: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
          {tool.options.map((opt) => {
            const is916 = opt.aspectRatio === "9:16";

            return (
              <div
                key={opt.aspectRatio}
                onClick={() => handleSelectFormat(opt.href)}
                className={`group relative flex flex-col justify-between rounded-[26px] border p-5 sm:p-6 transition-all duration-300 cursor-pointer text-left ${
                  is916
                    ? "border-orange-500/30 bg-gradient-to-b from-[#18151D] via-[#14121A] to-[#101015] hover:border-orange-500/70 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1"
                    : "border-amber-500/30 bg-gradient-to-b from-[#1C1814] via-[#161310] to-[#101015] hover:border-amber-500/70 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
                }`}
              >
                {/* Top Badge & Aspect Ratio Icon */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                          is916
                            ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                            : "bg-amber-500/15 border-amber-500/40 text-amber-400"
                        }`}
                      >
                        {is916 ? <Smartphone size={20} /> : <Film size={20} />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-zinc-400">
                          {is916 ? "Vertical Mobile" : "Horizontal Cinema"}
                        </span>
                        <div className="text-base sm:text-lg font-black text-white group-hover:text-orange-300 transition-colors">
                          {opt.label}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        opt.isFree
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                          : is916
                          ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                          : "bg-amber-500/15 border-amber-500/40 text-amber-400"
                      }`}
                    >
                      {opt.pricing}
                    </span>
                  </div>

                  {/* Visual Aspect Ratio Representation */}
                  <div className="my-3 py-3 px-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-zinc-300 font-mono text-[11px]">
                      <Monitor size={14} className="text-zinc-500" />
                      <span>{opt.resolution}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                      <Clock size={13} className="text-zinc-500" />
                      <span>{opt.duration}</span>
                    </div>
                  </div>

                  {/* Platforms Supported */}
                  <p className="text-xs font-semibold text-zinc-400 mb-4">
                    {opt.sublabel}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2 mb-6">
                    {opt.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-zinc-300"
                      >
                        <CheckCircle2
                          size={14}
                          className={
                            is916 ? "text-orange-400 shrink-0" : "text-amber-400 shrink-0"
                          }
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    Open Dedicated Studio
                  </span>
                  <div
                    className={`inline-flex items-center gap-1.5 font-bold text-xs text-white px-4 py-2 rounded-xl shadow-md transition-all group-hover:translate-x-1 ${
                      is916
                        ? "bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 shadow-orange-500/25"
                        : "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 shadow-amber-500/25"
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-zinc-400">
          <span>
            ⚡ Both studios retain their independent Remotion cloud render pipelines and dedicated timelines.
          </span>
          <span className="font-mono text-zinc-400">
            Esc to close
          </span>
        </div>
      </div>
    </div>
  );
}

