'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Type,
  Film,
  Sparkles,
  Zap,
  Monitor,
  Smartphone,
  BookOpen,
  Image as ImageIcon,
  Tv,
  PenTool,
  Layers,
  Scissors,
  Play,
  Columns,
  Mic,
} from 'lucide-react';
import { ALL_15_VIDEO_TOOLS, VideoToolInfo } from '@/constants/allVideoTools';

interface ExploreMoreVideoToolsProps {
  currentToolId?: string;
}

export default function ExploreMoreVideoTools({ currentToolId }: ExploreMoreVideoToolsProps) {
  const otherTools = ALL_15_VIDEO_TOOLS.filter((t) => t.id !== currentToolId);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Type':
        return <Type className="h-5 w-5 text-orange-500" />;
      case 'Film':
        return <Film className="h-5 w-5 text-sky-500" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5 text-amber-500" />;
      case 'Zap':
        return <Zap className="h-5 w-5 text-orange-500" />;
      case 'Monitor':
        return <Monitor className="h-5 w-5 text-blue-500" />;
      case 'Smartphone':
        return <Smartphone className="h-5 w-5 text-rose-500" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5 text-amber-600" />;
      case 'Image':
        return <ImageIcon className="h-5 w-5 text-emerald-500" />;
      case 'Tv':
        return <Tv className="h-5 w-5 text-red-500" />;
      case 'PenTool':
        return <PenTool className="h-5 w-5 text-indigo-500" />;
      case 'Layers':
        return <Layers className="h-5 w-5 text-cyan-500" />;
      case 'Scissors':
        return <Scissors className="h-5 w-5 text-orange-600" />;
      case 'Play':
        return <Play className="h-5 w-5 text-violet-500" />;
      case 'Columns':
        return <Columns className="h-5 w-5 text-teal-500" />;
      case 'Mic':
        return <Mic className="h-5 w-5 text-emerald-600" />;
      default:
        return <Film className="h-5 w-5 text-orange-500" />;
    }
  };

  const getCategoryBadgeClass = (category: VideoToolInfo['category']) => {
    switch (category) {
      case '16:9 Cinema':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case '9:16 Shorts':
        return 'bg-orange-50 text-[#FF5722] border-orange-200/60';
      case 'Audio Utility':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200/60';
    }
  };

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Explore More AI Video Creation Tools
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover our complete suite of 15 specialized AI video studios. Every tool is purpose-built with dedicated timelines, automated cloud rendering, and zero editing software required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.route}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-[#FF5722]/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-orange-50 transition-colors">
                    {getIcon(tool.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryBadgeClass(
                        tool.category
                      )}`}
                    >
                      {tool.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FF5722] transition-colors flex items-center gap-1.5">
                  <span>{tool.name}</span>
                </h3>

                <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">{tool.creditCost}</span>
                <span className="inline-flex items-center gap-1 text-[#FF5722] font-bold group-hover:translate-x-1 transition-transform">
                  <span>Explore Tool</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

