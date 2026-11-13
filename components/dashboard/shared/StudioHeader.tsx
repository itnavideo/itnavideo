"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Clock, ArrowUpRight } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

export interface StudioHeaderProps {
  studioName: string;
  badgeLabel?: string;
  aspectRatioLabel?: string;
  alternateFormat?: {
    label: string;
    href: string;
  };
  userRemainingCredits?: number;
  isWorking?: boolean;
  elapsedSeconds?: number;
  onBackClick?: () => void;
  children?: React.ReactNode;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * Standardized Unified SaaS Studio Top Navigation Header across all 15 Itnavideo Studios.
 * Guarantees 100% brand consistency, crisp white surface, orange primary accents, and responsive layout.
 */
export default function StudioHeader({
  studioName,
  badgeLabel,
  aspectRatioLabel,
  alternateFormat,
  userRemainingCredits,
  isWorking = false,
  elapsedSeconds = 0,
  onBackClick,
  children,
}: StudioHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs shrink-0 font-sans">
      <div className="w-full px-4 sm:px-8 lg:px-12 min-h-14 sm:min-h-16 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
        {/* Left: Back Button, Brand Logo & Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {onBackClick ? (
            <button
              type="button"
              onClick={onBackClick}
              className="group flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Back to Studios"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="group flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Back to Studios"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          )}

          <BrandLogo size="sm" showBadge={false} variant="light" />

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Clean Studio Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Studios
            </Link>
            <span className="text-slate-300 text-xs">/</span>
            <span className="text-xs font-black text-slate-900 tracking-tight">{studioName}</span>
            {aspectRatioLabel && (
              <span className="ml-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                {aspectRatioLabel}
              </span>
            )}
            {badgeLabel && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60">
                {badgeLabel}
              </span>
            )}
            {alternateFormat && (
              <Link
                href={alternateFormat.href}
                className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 transition-colors shadow-2xs group"
                title={alternateFormat.label}
              >
                <span>{alternateFormat.label}</span>
                <ArrowUpRight size={12} className="text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Right: Timer, Balance Badge & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isWorking && elapsedSeconds > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-600">
              <Clock size={13} className="animate-pulse" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
          )}

          {children}

          {/* Clean Orange Zap Credits Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-xs text-slate-800">
            <Zap size={14} className="text-orange-500 fill-orange-500" />
            <span className="text-slate-500 hidden xs:inline">Balance:</span>
            <span className="text-slate-900 font-black">
              {userRemainingCredits !== undefined ? `${userRemainingCredits} Cr` : "Balance"}
            </span>
            <Link
              href="/pricing"
              className="ml-0.5 text-[11px] text-orange-600 hover:text-orange-700 underline font-black"
            >
              +Add
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

