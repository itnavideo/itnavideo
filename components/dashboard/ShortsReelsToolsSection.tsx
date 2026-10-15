"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DashboardToolCard {
  id: string;
  title: string;
  slug: string;
  category: "long" | "social" | "utility";
  categoryLabel: string;
  aspectRatio: string;
  aspectBadge: string;
  renderSpeed: string;
  exportFormat: string;
  inputFormat?: string;
  badge?: string;
  demoUrl?: string;
  youtubeTutorialUrl?: string;
  icon: LucideIcon;
  colorScheme: {
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    hoverBorder: string;
  };
  description: string;
  highlights: string[];
}

interface ShortsReelsToolsSectionProps {
  tools: DashboardToolCard[];
  onOpenTutorial: (tool: DashboardToolCard) => void;
}

function getDashboardCardImage(id: string): string {
  if (id.includes('caption')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png';
  if (id.includes('compare')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892515/compare_explainer_wheox5.png';
  if (id.includes('typography') || id.includes('kinetic')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892516/typography_kinetic_motion_lrpawu.png';
  if (id.includes('whiteboard')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892527/whiteboard_video_wamtgr.png';
  if (id.includes('clips')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892526/viral_video_clips_hnlav3.png';
  if (id.includes('promo')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892524/longvideopromo_sq4ank.png';
  if (id.includes('audio') || id.includes('cleaner')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892521/audio_cleaner_tzshum.png';
  if (id.includes('faceless')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892533/faceless_video_ytyxdo.png';
  if (id.includes('image')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791896597/imagetovideoai_akygiu.jpg';
  if (id.includes('youtube') || id.includes('subtitle')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892530/youtube_subtitles_generator_nrgxle.png';
  if (id.includes('book')) return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892528/book_summary_video_xjvjuf.png';
  return 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791892531/auto_captions_x9khtt.png';
}

export default function ShortsReelsToolsSection({
  tools,
}: ShortsReelsToolsSectionProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section Header Banner */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-r from-[#12151F] via-[#181B26] to-[#0B0D13] shadow-2xl min-h-[120px] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/40 bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-black tracking-wider text-[#FF9100]">
            <Smartphone size={13} className="text-[#FF9100]" />
            <span>9:16 (REELS/SHORTS/TIKTOK)</span>
          </div>
          <span className="rounded-full border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] font-black text-white">
            {tools.length} Studios
          </span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
            9:16 (Reels/Shorts/Tiktok){' '}
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              Studios
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-300">
            Click any studio image to start creating instantly.
          </p>
        </div>
      </div>

      {/* Grid of Image-First Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {tools.map((tool) => {
          const cardImage = getDashboardCardImage(tool.id);

          return (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0E1526] shadow-xl hover:border-[#FF5722]/80 hover:shadow-2xl hover:shadow-[#FF5722]/20 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Image Container 9:16 */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black/50">
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
              <div className="flex flex-col justify-between p-3.5 bg-[#0E1526] border-t border-white/10 flex-1">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FFA000] transition-colors truncate font-heading">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 line-clamp-2 mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono">1 Credit</span>
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] px-2.5 py-1 text-[10px] font-black text-black shadow-md group-hover:brightness-110 transition-all">
                    <span>Open</span>
                    <ArrowRight size={11} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
