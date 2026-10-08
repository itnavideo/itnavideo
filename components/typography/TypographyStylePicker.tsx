'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Flame,
  Zap,
  Star,
  Check,
  RotateCcw,
} from 'lucide-react';
import type { TypographyStyleId } from '@/lib/typography/types';
import {
  TYPOGRAPHY_STYLES,
  getTypographyStyle,
  type TypographyStyle,
  type TypographyCategory,
  type TypographyWordTimestamp,
} from '@/lib/typography/typographyStylesData';

export { TYPOGRAPHY_STYLES, getTypographyStyle };
export type { TypographyStyle, TypographyCategory };

// Helper to get active words and render style-specific kinetic overlay
function KineticLiveOverlay({
  style,
  currentTime,
}: {
  style: TypographyStyle;
  currentTime: number;
}) {
  const words = style.words;
  if (!words || words.length === 0) return null;

  // Find active word index
  let activeIndex = words.findIndex((w) => currentTime >= w.start && currentTime <= w.end);
  if (activeIndex === -1) {
    // If between words, find closest preceding word
    activeIndex = words.findIndex((w, i) => {
      const next = words[i + 1];
      return currentTime >= w.start && (!next || currentTime < next.start);
    });
  }

  // Display a window of 3-5 words around the active word
  const startIdx = Math.max(0, activeIndex - 1);
  const endIdx = Math.min(words.length, startIdx + 4);
  const visibleWords = words.slice(startIdx, endIdx);

  const activeWordObj = activeIndex >= 0 ? words[activeIndex] : null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pointer-events-none transition-all duration-150">
      {/* Category / Style Specific Kinetic Box */}
      {style.category === 'kinetic' && (
        <div className="w-full flex flex-col items-center justify-center text-center space-y-1.5 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[90%]">
            {visibleWords.map((item, idx) => {
              const isCurrent = activeWordObj && item.word === activeWordObj.word && item.start === activeWordObj.start;
              return (
                <span
                  key={`${item.word}-${idx}`}
                  className={`transition-all duration-100 font-black uppercase tracking-tight text-xs sm:text-sm ${
                    isCurrent
                      ? 'bg-[#FF6D00] text-black px-2 py-0.5 rounded-md shadow-lg scale-110 rotate-[-1deg]'
                      : 'text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? style.accentColor : undefined,
                    color: isCurrent ? '#000000' : undefined,
                  }}
                >
                  {item.word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {style.category === 'minimal' && (
        <div className="w-full flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[85%]">
            {visibleWords.map((item, idx) => {
              const isCurrent = activeWordObj && item.word === activeWordObj.word && item.start === activeWordObj.start;
              return (
                <span
                  key={`${item.word}-${idx}`}
                  className={`transition-all duration-150 font-serif text-xs sm:text-sm tracking-wide ${
                    isCurrent
                      ? 'text-white font-bold italic underline decoration-2 scale-105'
                      : 'text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                  }`}
                  style={{
                    textDecorationColor: isCurrent ? style.accentColor : undefined,
                  }}
                >
                  {item.word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {style.category === 'depth' && (
        <div className="w-full flex flex-col items-center justify-center text-center space-y-1.5 animate-in fade-in duration-150">
          <div className="rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-3 py-2 max-w-[90%] shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {visibleWords.map((item, idx) => {
                const isCurrent = activeWordObj && item.word === activeWordObj.word && item.start === activeWordObj.start;
                return (
                  <span
                    key={`${item.word}-${idx}`}
                    className={`transition-all duration-100 font-mono text-[11px] sm:text-xs font-bold uppercase ${
                      isCurrent
                        ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]'
                        : 'text-zinc-400'
                    }`}
                    style={{
                      color: isCurrent ? style.accentColor : undefined,
                      textShadow: isCurrent ? `0 0 10px ${style.accentColor}` : undefined,
                    }}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {style.category === 'real-estate' && (
        <div className="w-full flex flex-col items-center justify-center text-center space-y-1.5 animate-in fade-in duration-150">
          <div className="rounded-lg border border-[#FFA726]/40 bg-gradient-to-r from-black/80 via-black/90 to-black/80 backdrop-blur-md px-3.5 py-2 max-w-[90%] shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {visibleWords.map((item, idx) => {
                const isCurrent = activeWordObj && item.word === activeWordObj.word && item.start === activeWordObj.start;
                return (
                  <span
                    key={`${item.word}-${idx}`}
                    className={`transition-all duration-150 text-xs sm:text-sm font-black tracking-wider uppercase ${
                      isCurrent
                        ? 'text-[#FFD700] scale-105 drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                        : 'text-zinc-200'
                    }`}
                    style={{
                      color: isCurrent ? style.accentColor : undefined,
                    }}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Single 9:16 Video Style Card
function StyleCard({
  style,
  isSelected,
  isPlaying,
  isMuted,
  onSelect,
  onTogglePlay,
  onToggleMute,
}: {
  style: TypographyStyle;
  isSelected: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  onSelect: () => void;
  onTogglePlay: (e: React.MouseEvent) => void;
  onToggleMute: (e: React.MouseEvent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setCurrentTime(0);
    }
  }, [isPlaying]);

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#FF6D00] bg-[#FF6D00]/10 ring-2 ring-[#FF6D00] shadow-xl shadow-[#FF6D00]/25 scale-[1.02] z-10'
          : 'border-white/10 bg-[#161720] hover:border-[#FF6D00]/50 hover:bg-[#1C1E28] hover:-translate-y-1'
      }`}
    >
      {/* 9:16 Aspect Ratio Stage */}
      <div className="relative w-full aspect-[9/16] bg-[#090A0F] overflow-hidden flex flex-col justify-between">
        {!isPlaying && (
          <img
            src={style.posterSrc}
            alt={style.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}

        <video
          ref={videoRef}
          src={style.videoSrc}
          poster={style.posterSrc}
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          className={`absolute inset-0 h-full w-full object-cover z-0 transition-opacity duration-200 ${
            isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 z-10 pointer-events-none" />

        {isPlaying && <KineticLiveOverlay style={style} currentTime={currentTime} />}

        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={onTogglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#FF6D00] hover:text-black hover:border-[#FF6D00] cursor-pointer"
              title="Play Style Preview"
            >
              <Play size={18} className="fill-current ml-0.5" />
            </button>
          </div>
        )}

        {/* Top Header Overlay */}
        <div className="relative z-30 p-2.5 flex items-center justify-between pointer-events-none">
          {isSelected ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6D00] px-2 py-0.5 text-[9px] font-black uppercase text-black shadow-md">
              <Check size={10} strokeWidth={3.5} />
              <span>Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[9px] font-extrabold uppercase text-zinc-300">
              9:16
            </span>
          )}

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={onTogglePlay}
              className="p-1 rounded-full bg-black/70 backdrop-blur-xs text-white hover:text-[#FF9100] transition cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play Preview'}
            >
              {isPlaying ? <Pause size={12} className="fill-white" /> : <Play size={12} className="fill-white" />}
            </button>

            {isPlaying && (
              <button
                type="button"
                onClick={onToggleMute}
                className="p-1 rounded-full bg-black/70 backdrop-blur-xs text-white hover:text-[#FF9100] transition cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-[#FF9100]" />}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Title Pill */}
        <div className="relative z-30 p-2 text-center pointer-events-none pt-6">
          <span
            className={`inline-block w-full truncate rounded-lg bg-black/85 backdrop-blur-md px-2 py-1 text-[10px] font-black tracking-tight ${
              isSelected ? 'text-[#FF9100] border border-[#FF6D00]/50' : 'text-white'
            }`}
          >
            {style.name}
          </span>
        </div>
      </div>

      {/* Card Footer Tag Info */}
      <div className="p-2 flex items-center justify-between border-t border-white/5 bg-[#161720]">
        <span className="text-[9px] font-bold text-[#FF9100] truncate max-w-[120px]">
          {style.tag.split('·')[0]}
        </span>
        <span
          className="h-2 w-2 rounded-full border border-black/20"
          style={{ backgroundColor: style.accentColor, boxShadow: `0 0 6px ${style.accentColor}` }}
        />
      </div>
    </div>
  );
}

export function TypographyKineticPreviewOverlay() {
  return null;
}

type TypographyStylePickerProps = {
  value: string;
  onChange: (value: TypographyStyleId) => void;
};

export function TypographyStylePicker({ value, onChange }: TypographyStylePickerProps) {
  const [playingStyleId, setPlayingStyleId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TypographyCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES: { id: TypographyCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'kinetic', label: '🔥 High Impact', icon: <Flame size={12} className="text-[#FF9100]" /> },
    { id: 'minimal', label: '📐 Clean & Editorial', icon: <Sparkles size={12} className="text-amber-400" /> },
    { id: 'depth', label: '⚡ 3D & Cyber', icon: <Zap size={12} className="text-[#FF9100]" /> },
    { id: 'real-estate', label: '🏠 Real Estate', icon: <Star size={12} className="text-amber-400" /> },
    { id: 'all', label: `✨ All ${TYPOGRAPHY_STYLES.length} Styles`, icon: <Sparkles size={12} className="text-[#FF9100]" /> },
  ];

  const SECTIONS = [
    {
      id: 'kinetic',
      title: 'High Impact Typography',
      badge: '🔥 10 Styles · Viral Retention',
      items: TYPOGRAPHY_STYLES.filter((s) => s.category === 'kinetic'),
    },
    {
      id: 'minimal',
      title: 'Clean & Editorial Poster',
      badge: '💎 10 Styles · Luxury Elegance',
      items: TYPOGRAPHY_STYLES.filter((s) => s.category === 'minimal'),
    },
    {
      id: 'depth',
      title: '3D & Cyber HUD Motion',
      badge: '⚡ 8 Styles · Spatial Depth',
      items: TYPOGRAPHY_STYLES.filter((s) => s.category === 'depth'),
    },
    {
      id: 'real-estate',
      title: 'Real Estate & Luxury Tours',
      badge: '🏠 6 Styles · Dubai & Luxury Listings',
      items: TYPOGRAPHY_STYLES.filter((s) => s.category === 'real-estate'),
    },
  ];

  const visibleSections = SECTIONS.map((section) => {
    const items = section.items.filter((style) => {
      if (selectedCategory !== 'all' && selectedCategory !== section.id) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        style.name.toLowerCase().includes(q) ||
        style.tag.toLowerCase().includes(q) ||
        style.description.toLowerCase().includes(q) ||
        style.transcriptText.toLowerCase().includes(q) ||
        style.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    return { ...section, items };
  }).filter((s) => s.items.length > 0);

  return (
    <div id="typography-style-gallery" className="relative rounded-[28px] border border-white/10 bg-[#111218] p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF6D00] animate-pulse shadow-[0_0_10px_rgba(255,109,0,0.8)]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              2. Select Typography Style
            </h3>
            <span className="rounded-full bg-[#FF6D00]/15 border border-[#FF6D00]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FF9100]">
              {TYPOGRAPHY_STYLES.length} Dedicated Styles
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Click any 9:16 card to select. Click play on any card to preview spoken audio &amp; synchronized kinetic typography.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 34 typography styles..."
            className="w-full rounded-xl border border-white/10 bg-[#090A0F] py-2 pl-9 pr-8 text-xs font-medium text-white placeholder-zinc-500 transition-all focus:border-[#FF6D00] focus:outline-none focus:ring-1 focus:ring-[#FF6D00]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 rounded-full cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Direct Unified Style Gallery View */}

      {/* Stacked Category Sections with 9:16 Vertical Video Cards */}
      <div className="space-y-8">
        {visibleSections.map((section) => (
          <div key={section.id} className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                  {section.title}
                </h4>
                <span className="rounded-full bg-[#161720] border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[#FF9100]">
                  {section.badge}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {section.items.length} {section.items.length === 1 ? 'style' : 'styles'}
              </span>
            </div>

            {/* 9:16 Vertical Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {section.items.map((style) => {
                const isSelected = value === style.id;
                const isPlaying = playingStyleId === style.id;

                return (
                  <StyleCard
                    key={style.id}
                    style={style}
                    isSelected={isSelected}
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    onSelect={() => {
                      onChange(style.id);
                      setPlayingStyleId(style.id);
                    }}
                    onTogglePlay={(e) => {
                      e.stopPropagation();
                      setPlayingStyleId(isPlaying ? null : style.id);
                      if (!isSelected) onChange(style.id);
                    }}
                    onToggleMute={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {visibleSections.length === 0 && (
          <div className="py-12 text-center space-y-2.5 rounded-2xl border border-dashed border-white/10 bg-[#161720] p-6">
            <p className="text-sm font-bold text-zinc-300">
              No typography styles found matching "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('kinetic');
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161720] px-4 py-2 text-xs font-bold text-zinc-200 hover:text-white hover:border-[#FF6D00]/50 transition cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypographyStylePicker;
