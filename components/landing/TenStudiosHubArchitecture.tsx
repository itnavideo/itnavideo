'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOptimizedCloudinaryUrl } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { UNIFIED_STUDIO_TOOLS, type UnifiedToolItem } from '@/lib/studios/unifiedTools';
import FormatSelectorModal, { type UnifiedToolModalData } from '@/components/dashboard/shared/FormatSelectorModal';

export default function TenStudiosHubArchitecture() {
  const router = useRouter();
  const [selectedToolForModal, setSelectedToolForModal] = useState<UnifiedToolModalData | null>(null);

  const handleCardClick = (tool: UnifiedToolItem) => {
    if (tool.id === 'audio-cleaner') {
      router.push('/dashboard/audio-cleaner');
      return;
    }
    if (tool.modalData) {
      setSelectedToolForModal(tool.modalData);
    } else if (tool.singleHref) {
      router.push(tool.singleHref);
    }
  };

  return (
    <section
      id="video-types"
      className="relative w-full overflow-hidden bg-white py-14 text-zinc-950 sm:py-20 border-y border-zinc-200/80"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-10 sm:space-y-12">
        
        {/* Clean, Minimal Section Header (No Eyebrow Badges per Rule 9.2) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 px-2">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl font-sans">
            AI Video Creation Studios
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Select any video type below. Choose between 9:16 Vertical Shorts or 16:9 Widescreen Cinema with one click.
          </p>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ONE VIDEO TYPE = ONE NAME + ONE IMAGE (CLEAN GRID)            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {UNIFIED_STUDIO_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isAudio = tool.id === 'audio-cleaner';

            return (
              <div
                key={tool.id}
                onClick={() => handleCardClick(tool)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white hover:border-orange-500/50 hover:shadow-[0_16px_36px_-10px_rgba(249,115,22,0.16)] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer text-left"
              >
                <div>
                  {/* One Curated Image Preview Stage */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 border-b border-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getOptimizedCloudinaryUrl(tool.imageCard, 640)}
                      alt={tool.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          getOptimizedCloudinaryUrl('https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png', 640);
                      }}
                    />

                    {/* Top Right Feature Badge */}
                    {tool.badge && (
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="rounded-full bg-zinc-950/80 px-2.5 py-0.5 text-[9px] font-bold text-white border border-white/10 backdrop-blur-md">
                          {tool.badge}
                        </span>
                      </div>
                    )}

                    {/* Bottom Left Aspect Ratio Badge */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-950/85 text-[9px] font-mono font-bold text-white border border-white/10 backdrop-blur-md">
                        {isAudio ? 'Studio Audio' : '9:16 & 16:9'}
                      </span>
                    </div>
                  </div>

                  {/* One Name & One Description */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${tool.iconBgClass} ${tool.iconColorClass} shrink-0`}
                      >
                        <Icon size={14} />
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                        {tool.title}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2 min-h-[32px]">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Single Click Action Footer */}
                <div
                  className="px-3 pb-3.5 sm:px-4 sm:pb-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* What It Does (Public Guide Link) */}
                  <Link
                    href={tool.publicHref || '/video-types'}
                    title={`See what ${tool.title} does`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-700 px-2 py-2 text-[11px] font-semibold text-zinc-700 transition-all text-center"
                  >
                    <BookOpen size={12} className="text-zinc-500 group-hover:text-orange-600 shrink-0" />
                    <span className="truncate">What It Does</span>
                  </Link>

                  {/* Single Primary Action Button */}
                  <button
                    type="button"
                    onClick={() => handleCardClick(tool)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 px-2 py-2 text-[11px] font-bold text-white shadow-sm shadow-orange-500/20 hover:shadow-orange-500/35 transition-all active:scale-95 text-center cursor-pointer"
                  >
                    <span className="truncate">{isAudio ? 'Clean Audio' : 'Create Video'}</span>
                    <ArrowRight size={12} className="shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Bottom CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200"
          >
            <Sparkles size={16} className="text-zinc-300" />
            <span>Launch Any Studio Now</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/video-types"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-zinc-800 hover:text-zinc-950 transition-all duration-200 shadow-xs active:scale-95"
          >
            <BookOpen size={15} className="text-zinc-700" />
            <span>Explore All 15 Dedicated Pages &amp; Specs</span>
            <ChevronRight size={15} className="text-zinc-400" />
          </Link>
        </div>

      </div>

      {/* Interactive Format Selector Modal: Displays 9:16 and 16:9 on click */}
      <FormatSelectorModal
        isOpen={!!selectedToolForModal}
        onClose={() => setSelectedToolForModal(null)}
        tool={selectedToolForModal}
      />
    </section>
  );
}
