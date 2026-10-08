"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mic } from "lucide-react";
import type { DashboardToolCard } from "./ShortsReelsToolsSection";

interface AudioUtilitiesToolsSectionProps {
  tools: DashboardToolCard[];
  onOpenTutorial: (tool: DashboardToolCard) => void;
}

function getDashboardCardImage(id: string): string {
  if (id.includes('audio') || id.includes('cleaner')) return '/visuals/dashboard-cards/audio-cleaner.webp';
  return '/visuals/dashboard-cards/audio-cleaner.webp';
}

export default function AudioUtilitiesToolsSection({
  tools,
}: AudioUtilitiesToolsSectionProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section Header Banner */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-r from-[#0E1526] via-[#151E30] to-[#070B14] shadow-2xl min-h-[120px] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-black tracking-wider text-emerald-300">
            <Mic size={13} className="text-emerald-400" />
            <span>AUDIO & AI UTILITIES STUDIO</span>
          </div>
          <span className="rounded-full border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-black text-white">
            {tools.length} Studio
          </span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Audio &amp; AI Utilities{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Studio
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-300">
            Click studio image to clean noise, remove silences and master voice recordings.
          </p>
        </div>
      </div>

      {/* Grid of Image-First Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => {
          const cardImage = getDashboardCardImage(tool.id);

          return (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0E1526] shadow-xl hover:border-emerald-400/80 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50">
                <Image
                  src={cardImage}
                  alt={tool.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1526] via-black/20 to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                  <span className="rounded-full bg-black/70 border border-white/20 px-2.5 py-0.5 text-[10px] font-black text-white backdrop-blur-md">
                    Audio Studio
                  </span>
                  {tool.badge && (
                    <span className="rounded-full bg-emerald-500/90 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black text-black backdrop-blur-md uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Title & Action CTA */}
              <div className="flex items-center justify-between gap-3 p-4 bg-[#0E1526] border-t border-white/10">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-1.5 text-[11px] font-black text-black shadow-md group-hover:brightness-110 transition-all">
                  <span>Open</span>
                  <ArrowRight size={13} strokeWidth={3} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
