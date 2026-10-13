"use client";

import React from "react";
import Link from "next/link";
import { X, Sparkles, Zap, Shield, Play, ExternalLink, ArrowRight, CheckCircle2, Film } from "lucide-react";
import ToolVisualPreview from "./ToolVisualPreview";

interface DemoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: {
    id: string;
    title: string;
    slug: string;
    description: string;
    aspectRatio: string;
    aspectBadge: string;
    renderSpeed?: string;
    exportFormat?: string;
    demoUrl?: string;
    youtubeTutorialUrl?: string;
    highlights: string[];
  } | null;
}

export default function DemoPreviewModal({ isOpen, onClose, tool }: DemoPreviewModalProps) {
  if (!isOpen || !tool) return null;

  // Standard YouTube tutorial fallback embed if no custom URL specified
  const embedUrl = tool.youtubeTutorialUrl || "https://www.youtube.com/embed/LXb3EKWsInQ";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#FF5722] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" /> 1-Min Video Tutorial
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200 font-bold">
            {tool.aspectBadge}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {tool.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
          {tool.description}
        </p>

        {/* Embedded YouTube Tutorial Video Player */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-[#070B14] mb-5 shadow-2xl">
          <iframe
            src={embedUrl}
            title={`${tool.title} Video Tutorial`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Specs Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Speed</p>
            <p className="text-xs font-black text-[#FFA000] flex items-center gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5 fill-[#FFA000]" /> {tool.renderSpeed || "⚡ ~30s"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quality</p>
            <p className="text-xs font-black text-emerald-600 flex items-center gap-1 mt-0.5">
              <Film className="w-3.5 h-3.5 text-emerald-600" /> {tool.exportFormat || "1080p Full HD"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Format</p>
            <p className="text-xs font-black text-slate-800 mt-0.5">
              {tool.aspectRatio}
            </p>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Key Pipeline Features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tool.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          {tool.demoUrl ? (
            <a
              href={tool.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              <span>View Full Spec Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          ) : (
            <div className="text-xs text-slate-400 font-mono">Cloud Engine: Ultra Speed</div>
          )}

          <Link
            href={tool.slug}
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white text-sm font-bold shadow-lg shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95"
          >
            <span>Open Dedicated Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
