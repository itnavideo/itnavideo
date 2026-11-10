"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import {
  STUDIO_CARD_COMPACT,
  STUDIO_SECTION_TITLE,
  STUDIO_SECTION_SUBTITLE,
} from "./studioDesignSystem";

export interface StudioSfxToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function StudioSfxToggle({
  enabled,
  onChange,
  title = "Dynamic Sound Effects (SFX)",
  subtitle = "Auto-syncs subtle whooshes, pops and cinematic impacts with visual transitions",
  className = "",
}: StudioSfxToggleProps) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`${STUDIO_CARD_COMPACT} flex items-center justify-between gap-4 cursor-pointer hover:border-slate-300 transition-all ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-8 w-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles size={16} className="text-orange-500" />
        </div>
        <div className="min-w-0">
          <h4 className={STUDIO_SECTION_TITLE}>{title}</h4>
          <p className={STUDIO_SECTION_SUBTITLE}>{subtitle}</p>
        </div>
      </div>

      {/* Modern Switch Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!enabled);
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
          enabled ? "bg-orange-500" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

