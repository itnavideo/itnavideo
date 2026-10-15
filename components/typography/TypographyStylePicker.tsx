'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    activeIndex = words.findIndex((w, i) => {
      const next = words[i + 1];
      return currentTime >= w.start && (!next || currentTime < next.start);
    });
  }

  const startIdx = Math.max(0, activeIndex - 1);
  const endIdx = Math.min(words.length, startIdx + 4);
  const visibleWords = words.slice(startIdx, endIdx);
  const activeWordObj = activeIndex >= 0 ? words[activeIndex] : null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 pointer-events-none transition-all duration-150">
      <div className="w-full flex flex-col items-center justify-center text-center space-y-1.5 animate-in fade-in duration-150">
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[90%]">
          {visibleWords.map((item, idx) => {
            const isCurrent = activeWordObj && item.word === activeWordObj.word && item.start === activeWordObj.start;
            return (
              <span
                key={`${item.word}-${idx}`}
                className={`transition-all duration-100 font-black uppercase tracking-tight text-xs sm:text-sm ${
                  isCurrent
                    ? 'text-black px-2 py-0.5 rounded-md shadow-lg scale-110'
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
    </div>
  );
}

// Single 9:16 Kinetic Typography Card (Instant 60 FPS, Zero Video Decoder Lag)
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
    if (!video || !style.videoSrc) return;

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setCurrentTime(0);
    }
  }, [isPlaying, style.videoSrc]);

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
      className={`group relative flex flex-col rounded-[22px] border overflow-hidden cursor-pointer transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#FF5722] ring-2 ring-[#FF5722]/50 bg-gradient-to-b from-[#FF5722]/15 via-[#0E1526] to-[#070B14] shadow-xl shadow-[#FF5722]/20 scale-[1.02] z-10'
          : 'border-white/10 bg-[#0E1526] hover:border-[#FF5722]/50 hover:bg-[#131B2E] hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      {/* 9:16 Aspect Ratio Stage */}
      <div className="relative w-full aspect-[9/12] min-h-[140px] sm:min-h-[160px] bg-[#070B14] overflow-hidden flex flex-col justify-between p-2.5">
        {/* Dynamic ambient radial glow */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${style.accentColor} 0%, transparent 75%)`,
          }}
        />

        {/* Real video if available and playing */}
        {style.videoSrc && isPlaying && (
          <video
            ref={videoRef}
            src={style.videoSrc}
            poster={style.posterSrc}
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            className="absolute inset-0 h-full w-full object-cover z-0 opacity-80"
          />
        )}

        {/* Video Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />

        {/* Interactive Kinetic Text Stage */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-2">
          {isPlaying && style.words && style.words.length > 0 ? (
            <KineticLiveOverlay style={style} currentTime={currentTime} />
          ) : (
            <div className="space-y-1">
              <span
                className="inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black uppercase tracking-tight shadow-md transition group-hover:scale-105"
                style={{
                  backgroundColor: `${style.accentColor}25`,
                  color: style.accentColor,
                  border: `1px solid ${style.accentColor}40`,
                  boxShadow: `0 0 14px ${style.accentColor}20`,
                }}
              >
                {style.name}
              </span>
              <p className="text-[10px] text-slate-300 font-semibold line-clamp-2 max-w-[150px] mx-auto">
                {style.description}
              </p>
            </div>
          )}
        </div>

        {/* Top Header Overlay */}
        <div className="absolute top-2 inset-x-2.5 z-30 flex items-center justify-between pointer-events-none">
          {isSelected ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF5722] px-2 py-0.5 text-[9px] font-black uppercase text-black shadow-md">
              <Check size={10} strokeWidth={3.5} />
              <span>Active</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase shadow-xs"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {style.tag.split('·')[0]}
            </span>
          )}

          {style.videoSrc && (
            <div className="flex items-center gap-1 pointer-events-auto">
              <button
                type="button"
                onClick={onTogglePlay}
                className="p-1 rounded-full bg-black/70 hover:bg-[#FF5722] hover:text-black text-white transition cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play Preview'}
              >
                {isPlaying ? <Pause size={11} /> : <Play size={11} />}
              </button>

              {isPlaying && (
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="p-1 rounded-full bg-black/70 text-white hover:text-[#FFA000] transition cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Tag Info */}
      <div className="p-2.5 flex items-center justify-between border-t border-white/5 bg-[#0E1526]">
        <span className="text-[10px] font-black text-white truncate max-w-[130px]">
          {style.name}
        </span>
        <span
          className="h-2 w-2 rounded-full border border-black/20 shrink-0"
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

// Direct All Styles Typography Picker (NO CATEGORIES)
export function TypographyStylePicker({ value, onChange }: TypographyStylePickerProps) {
  const [playingStyleId, setPlayingStyleId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Directly filter all styles without category fragmentation
  const filteredStyles = useMemo(() => {
    if (!searchQuery.trim()) return TYPOGRAPHY_STYLES;
    const q = searchQuery.toLowerCase().trim();
    return TYPOGRAPHY_STYLES.filter(
      (style) =>
        style.name.toLowerCase().includes(q) ||
        style.tag.toLowerCase().includes(q) ||
        style.description.toLowerCase().includes(q) ||
        style.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div id="typography-style-gallery" className="relative rounded-[28px] border border-white/10 bg-[#0E1526] p-4 sm:p-6 shadow-2xl space-y-5">
      {/* Header + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF5722] animate-pulse shadow-[0_0_10px_rgba(255,87,34,0.8)]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              2. Select Typography Style
            </h3>
            <span className="rounded-full bg-[#FF5722]/15 border border-[#FF5722]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFA000]">
              {filteredStyles.length} Dedicated Styles
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Direct visual gallery. Click any 9:16 card to select for rendering.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search styles (e.g. gold, vox, slam)..."
            className="w-full rounded-xl border border-white/10 bg-[#070B14] py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-400 transition-all focus:border-[#FF5722] focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Direct Unified All Styles Grid (NO CATEGORIES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-h-[640px] overflow-y-auto pr-1.5 custom-scrollbar">
        {filteredStyles.map((style) => {
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
                onChange(style.id as TypographyStyleId);
                setPlayingStyleId(style.id);
              }}
              onTogglePlay={(e) => {
                e.stopPropagation();
                setPlayingStyleId(isPlaying ? null : style.id);
                if (!isSelected) onChange(style.id as TypographyStyleId);
              }}
              onToggleMute={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
            />
          );
        })}
      </div>

      {filteredStyles.length === 0 && (
        <div className="py-12 text-center space-y-2.5 rounded-2xl border border-dashed border-white/10 bg-[#070B14] p-6">
          <p className="text-sm font-bold text-slate-300">
            No typography styles found matching "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#131B2E] px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:border-[#FF5722]/50 transition cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset Search</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TypographyStylePicker;
