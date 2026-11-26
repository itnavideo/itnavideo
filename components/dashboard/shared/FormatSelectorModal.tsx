"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight } from "lucide-react";

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

const PLATFORM_LABEL: Record<"9:16" | "16:9", string> = {
  "9:16": "Instagram · TikTok · YouTube Shorts",
  "16:9": "YouTube",
};

export default function FormatSelectorModal({
  isOpen,
  onClose,
  tool,
}: FormatSelectorModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<"9:16" | "16:9">("16:9");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
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
    if (opt) {
      onClose();
      router.push(opt.href);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="format-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Minimal Luxury Modal Shell */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl shadow-black/40 overflow-hidden border border-zinc-200/80">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6">
          <div>
            <h2
              id="format-modal-title"
              className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight"
            >
              {tool.title}
            </h2>
            <p className="text-sm text-zinc-500 mt-1.5">
              Choose a format for your video.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close format selector"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Minimal Format Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-8 pb-2">
          {tool.options.map((opt) => {
            const isSelected = selected === opt.aspectRatio;
            const is916 = opt.aspectRatio === "9:16";

            return (
              <button
                key={opt.aspectRatio}
                type="button"
                onClick={() => setSelected(opt.aspectRatio)}
                className="group flex flex-col items-center gap-3.5 text-center cursor-pointer focus:outline-none"
              >
                {/* Clean Card Surface */}
                <div
                  className={`w-full h-48 rounded-2xl flex items-center justify-center transition-all duration-200 border ${
                    isSelected
                      ? "bg-orange-50/70 border-orange-500 ring-2 ring-orange-500/20"
                      : "bg-zinc-50 border-zinc-200/80 group-hover:bg-zinc-100/80 group-hover:border-zinc-300"
                  }`}
                >
                  {is916 ? (
                    /* Actual Mobile Phone-Shaped Frame (72x128 = exact 9:16) */
                    <div
                      style={{ width: 72, height: 128 }}
                      className={`relative shrink-0 rounded-[18px] flex flex-col items-center pt-2.5 transition-all duration-200 ${
                        isSelected
                          ? "bg-orange-600 shadow-[0_14px_30px_-8px_rgba(234,88,12,0.5)] scale-[1.03]"
                          : "bg-zinc-900 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.35)] group-hover:bg-zinc-800"
                      }`}
                    >
                      {/* Minimal Phone Speaker Notch */}
                      <span className="w-5 h-1 rounded-full bg-white/30" />
                    </div>
                  ) : (
                    /* Proper Wide-Screen Frame (224x126 = exact 16:9) */
                    <div
                      style={{ width: 224, height: 126 }}
                      className={`relative shrink-0 rounded-[14px] transition-all duration-200 ${
                        isSelected
                          ? "bg-orange-600 shadow-[0_14px_30px_-8px_rgba(234,88,12,0.5)] scale-[1.03]"
                          : "bg-zinc-900 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.35)] group-hover:bg-zinc-800"
                      }`}
                    />
                  )}
                </div>

                {/* Single Clean Platform Label Below Card */}
                <span
                  className={`text-xs font-medium tracking-tight transition-colors ${
                    isSelected ? "text-zinc-950 font-semibold" : "text-zinc-500"
                  }`}
                >
                  {PLATFORM_LABEL[opt.aspectRatio]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Single Continue CTA */}
        <div className="px-8 pt-5 pb-8">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
