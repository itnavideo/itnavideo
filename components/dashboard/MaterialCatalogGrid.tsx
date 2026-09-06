"use client";

import React from 'react';
import Image from 'next/image';
import {
  Film,
  Smartphone,
  Mic,
  FolderOpen,
  Check,
  Eye,
  ArrowUpRight,
  Layers,
} from 'lucide-react';

export type VideoTypeCard = {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  videoPreviewUrl?: string;
  badgeType?: "Popular" | "AI" | "Pro" | "New";
  accent: string;
  mode: any;
  category: "creator" | "education" | "long";
  inputType: "video" | "audio" | "text";
  comingSoon?: boolean;
};

interface MaterialCatalogGridProps {
  cards: readonly VideoTypeCard[];
  selectedMode: string;
  hasUserSelected: boolean;
  activeFilter: 'all' | 'shorts' | 'long' | 'audio' | 'video' | 'text' | 'ai_prompt';
  onFilterChange: (filter: 'all' | 'shorts' | 'long' | 'audio' | 'video' | 'text' | 'ai_prompt') => void;
  onSelectMode: (mode: any) => void;
  onPreviewVideoType: (id: string) => void;
  recentRendersCount: number;
}

export function MaterialCatalogGrid({
  cards,
  selectedMode,
  hasUserSelected,
  activeFilter,
  onFilterChange,
  onSelectMode,
  onPreviewVideoType,
  recentRendersCount,
}: MaterialCatalogGridProps) {
  // Filter logic
  const isMatch = (card: VideoTypeCard) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'long') return card.category === 'long';
    if (activeFilter === 'shorts') return card.category !== 'long';
    if (activeFilter === 'audio') return card.inputType === 'audio' || card.id === 'ai-audio-cleaner';
    if (activeFilter === 'video') return card.inputType === 'video';
    return true;
  };

  const visibleLongCards = cards.filter((c) => c.category === 'long' && isMatch(c));
  const visibleShortCards = cards.filter((c) => c.category !== 'long' && isMatch(c));

  const filterTabs = [
    { key: 'all' as const, label: 'All Formats', icon: Layers, count: cards.length },
    { key: 'long' as const, label: '16:9 Landscape', icon: Film, count: cards.filter(c => c.category === 'long').length },
    { key: 'shorts' as const, label: '9:16 Shorts', icon: Smartphone, count: cards.filter(c => c.category !== 'long').length },
    { key: 'audio' as const, label: 'Voice & Audio', icon: Mic, count: cards.filter(c => c.inputType === 'audio' || c.id === 'ai-audio-cleaner').length },
  ];

  const renderBadge = (badgeType?: string) => {
    if (!badgeType) return null;
    switch (badgeType.toLowerCase()) {
      case 'pro':
        return (
          <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-300 backdrop-blur-md shadow-xs">
            PRO
          </span>
        );
      case 'ai':
        return (
          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 backdrop-blur-md shadow-xs">
            AI
          </span>
        );
      case 'new':
        return (
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-xs">
            NEW
          </span>
        );
      case 'popular':
        return (
          <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 backdrop-blur-md shadow-xs">
            POPULAR
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground uppercase tracking-wider">
            {badgeType}
          </span>
        );
    }
  };

  const renderCard = (card: VideoTypeCard) => {
    const isSelected = hasUserSelected && card.mode === selectedMode;
    const isComingSoon = Boolean(card.comingSoon);
    const isLongCard = card.category === 'long';

    return (
      <div
        key={card.id}
        onClick={() => {
          if (!isComingSoon) onSelectMode(card.mode);
        }}
        className={`group relative flex flex-col w-full text-left cursor-pointer transition-all duration-200 select-none ${
          isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'
        }`}
      >
        {/* M3 Elevated Surface Container */}
        <div
          className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 shadow-xs hover:shadow-xl ${
            isSelected
              ? 'border-primary ring-2 ring-primary/40 shadow-lg'
              : 'border-border/80 hover:border-primary/50'
          }`}
        >
          {/* Card Media Container */}
          <div
            className={`relative w-full overflow-hidden bg-muted/30 ${
              isLongCard ? 'aspect-[16/9]' : 'aspect-[9/16]'
            }`}
          >
            <Image
              alt={card.title}
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
              src={card.image}
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Live Video Preview on Hover */}
            {card.videoPreviewUrl && (
              <video
                src={card.videoPreviewUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-10 pointer-events-none"
              />
            )}

            {/* Top Bar inside Media: Aspect Ratio + Badge */}
            <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between pointer-events-none">
              <span className="rounded-full bg-black/50 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur-md">
                {isLongCard ? '16:9' : '9:16'}
              </span>

              {renderBadge(card.badgeType)}
            </div>

            {/* Selected Pill */}
            {isSelected && (
              <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black text-primary-foreground shadow-md animate-in fade-in zoom-in-95">
                <Check size={12} strokeWidth={3} />
                <span>ACTIVE</span>
              </div>
            )}

            {/* Preview Modal Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!isComingSoon) onPreviewVideoType(card.id);
              }}
              className="absolute bottom-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 hover:bg-background border border-border/80 text-foreground shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              title="Preview template video"
            >
              <Eye size={13} />
            </button>
          </div>

          {/* M3 Card Bottom Surface */}
          <div className="flex items-center justify-between gap-2 px-3.5 py-3 bg-card border-t border-border/40">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">
                {card.tag}
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-secondary/80 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
              <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── M3 Studio Header ── */}
      <section id="ai-quick-start" className="scroll-mt-24 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Studio Workflows
              </h1>
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                {cards.length} Styles
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Select a workflow to create your video with automatic AI sync
            </p>
          </div>

          <button
            type="button"
            onClick={() => document.getElementById("recent-projects")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex self-start sm:self-auto items-center gap-2 rounded-full border border-border/80 bg-secondary/60 hover:bg-secondary px-4 py-1.5 text-xs font-bold text-foreground transition-all duration-200 shadow-xs hover:shadow-sm"
          >
            <FolderOpen size={14} className="text-muted-foreground" />
            <span>Saved Videos</span>
            {recentRendersCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-black text-primary-foreground">
                {recentRendersCount}
              </span>
            )}
          </button>
        </div>

        {/* ── M3 Segmented Filter Chips ── */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto no-scrollbar pb-1">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onFilterChange(tab.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-foreground text-background shadow-sm scale-[1.02]'
                    : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-background' : 'text-muted-foreground'} />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 text-[10px] font-semibold opacity-70 ${
                    isActive ? 'text-background' : 'text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <div className="space-y-8 pt-2">
        {/* Long Videos (16:9) */}
        {visibleLongCards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                16:9 Landscape Videos
              </h2>
            </div>
            <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {visibleLongCards.map(renderCard)}
            </div>
          </div>
        )}

        {/* Short Videos (9:16) */}
        {visibleShortCards.length > 0 && (
          <div id="quick-tools" className="scroll-mt-24">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                9:16 Shorts & Reels
              </h2>
            </div>
            <div className="grid min-w-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {visibleShortCards.map(renderCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
