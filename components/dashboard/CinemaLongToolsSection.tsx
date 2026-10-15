"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Film } from "lucide-react";
import type { DashboardToolCard } from "./ShortsReelsToolsSection";

interface CinemaLongToolsSectionProps {
  tools: DashboardToolCard[];
  onOpenTutorial: (tool: DashboardToolCard) => void;
}

function getDashboardCardImage(id: string): string {
  if (id.includes('faceless')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png';
  if (id.includes('book')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892528/book_summary_video_xjvjuf.png';
  if (id.includes('youtube') || id.includes('subtitle')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892530/youtube_subtitles_generator_nrgxle.png';
  if (id.includes('audio') || id.includes('cleaner')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892521/audio_cleaner_tzshum.png';
  if (id.includes('image')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791896597/imagetovideoai_akygiu.jpg';
  return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png';
}

export default function CinemaLongToolsSection({
  tools,
}: CinemaLongToolsSectionProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section Header Banner */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-r from-[#12151F] via-[#181B26] to-[#0B0D13] shadow-2xl min-h-[120px] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-black tracking-wider text-amber-300">
            <Film size={13} className="text-amber-400" />
            <span>16:9 WIDESCREEN CINEMA & LONG-FORM</span>
          </div>
          <span className="rounded-full border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-black text-white">
            {tools.length} Studios
          </span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            16:9 Cinema &amp; Long-Form{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-[#FFA000] bg-clip-text text-transparent">
              Studios
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-300">
            Click any studio image to start creating long-form videos.
          </p>
        </div>
      </div>

      {/* Grid of Image-First Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map((tool) => {
          const cardImage = getDashboardCardImage(tool.id);

          return (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0E1526] shadow-xl hover:border-amber-400/80 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Image Container 16:9 */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cardImage}
                  alt={tool.title}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1526] via-black/10 to-transparent" />
              </div>

              {/* Bottom Card Title & Action CTA */}
              <div className="flex items-center justify-between gap-3 p-4 bg-[#0E1526] border-t border-white/10">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-[#FF7043] px-3 py-1.5 text-[11px] font-black text-black shadow-md group-hover:brightness-110 transition-all">
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
