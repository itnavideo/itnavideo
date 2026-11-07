"use client";

import React, { useRef, useMemo, useState } from "react";
import {
  Play,
  Pause,
  Plus,
  User,
  Sparkles,
  Smile,
  Volume2,
  VolumeX,
  Shield,
  Layers,
  ZoomIn,
  ZoomOut,
  Clock,
} from "lucide-react";

export interface CaptionWordItem {
  word: string;
  start: number;
  end: number;
}

export interface AutoCaptionTimelineProps {
  currentTime: number;
  duration: number;
  words: CaptionWordItem[];
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  behindPerson?: boolean;
  onToggleBehindPerson?: () => void;
  autoEmoji?: boolean;
  onToggleAutoEmoji?: () => void;
  wordClickSound?: boolean;
  onToggleWordClickSound?: () => void;
  safeZones?: boolean;
  onToggleSafeZones?: () => void;
  theme?: "light" | "dark";
}

// Format seconds into MM:SS
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function AutoCaptionTimeline({
  currentTime,
  duration,
  words,
  isPlaying,
  onSeek,
  onTogglePlay,
  behindPerson = false,
  onToggleBehindPerson,
  autoEmoji = true,
  onToggleAutoEmoji,
  wordClickSound = true,
  onToggleWordClickSound,
  safeZones = false,
  onToggleSafeZones,
  theme = "light",
}: AutoCaptionTimelineProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const safeDuration = Math.max(duration || 0, words.length > 0 ? words[words.length - 1].end : 8);

  // Group words into sentence phrases for Track 2 (sentences)
  const phrases = useMemo(() => {
    if (!words || words.length === 0) {
      return [
        { text: "Confident people acknowledge", start: 0, end: 2.2 },
        { text: "your strengths and encourage", start: 2.2, end: 4.8 },
        { text: "your boldest dreams.", start: 4.8, end: safeDuration },
      ];
    }
    const chunks: Array<{ text: string; start: number; end: number }> = [];
    let currentChunk: CaptionWordItem[] = [];

    words.forEach((w, idx) => {
      currentChunk.push(w);
      const isPunctuation = /[.?!]$/.test(w.word);
      const isSizeReached = currentChunk.length >= 4;
      const isLast = idx === words.length - 1;

      if (isPunctuation || isSizeReached || isLast) {
        chunks.push({
          text: currentChunk.map((cw) => cw.word).join(" "),
          start: currentChunk[0].start,
          end: currentChunk[currentChunk.length - 1].end,
        });
        currentChunk = [];
      }
    });
    return chunks;
  }, [words, safeDuration]);

  // Handle click on timeline scrubber to seek
  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * safeDuration);
  };

  const progressPercent = safeDuration > 0 ? (currentTime / safeDuration) * 100 : 0;

  const isLight = theme === "light";

  return (
    <div
      className={`w-full rounded-[24px] border p-4 sm:p-5 shadow-xl space-y-3.5 transition-all ${
        isLight
          ? "bg-white border-slate-200/90 text-slate-900 shadow-slate-200/50"
          : "bg-[#0E1526] border-white/10 text-white shadow-2xl"
      }`}
    >
      {/* ── 1. WhiteStair Action Toolbar ── */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
          isLight ? "border-slate-200" : "border-white/10"
        }`}
      >
        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider pr-2 border-r ${
              isLight ? "text-slate-800 border-slate-200" : "text-slate-300 border-white/10"
            }`}
          >
            <Clock size={14} className="text-[#3B82F6]" />
            <span>Timeline</span>
          </div>

          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              isLight
                ? "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                : "border-white/10 bg-[#070B14] hover:bg-[#131B2E] text-slate-200"
            }`}
            title="Add text layer"
          >
            <Plus size={13} className="text-[#3B82F6]" />
            <span>+ Text</span>
          </button>

          <button
            type="button"
            onClick={onToggleBehindPerson}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              behindPerson
                ? isLight
                  ? "bg-blue-50 border-blue-300 text-[#0066FF] shadow-2xs font-black"
                  : "bg-[#0066FF]/15 border-[#0066FF]/50 text-[#3B82F6] shadow-sm"
                : isLight
                ? "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "border-white/10 bg-[#070B14] text-slate-300 hover:text-white hover:bg-[#131B2E]"
            }`}
            title="Place captions behind person depth layer"
          >
            <User size={13} className={behindPerson ? "text-[#3B82F6]" : isLight ? "text-slate-500" : "text-slate-400"} />
            <span>Behind person</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoEmoji}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              autoEmoji
                ? isLight
                  ? "bg-purple-50 border-purple-300 text-purple-700 shadow-2xs font-black"
                  : "bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-sm"
                : isLight
                ? "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "border-white/10 bg-[#070B14] text-slate-300 hover:text-white hover:bg-[#131B2E]"
            }`}
            title="Toggle automatic kinetic emojis"
          >
            <Smile size={13} className={autoEmoji ? "text-purple-600" : isLight ? "text-slate-500" : "text-slate-400"} />
            <span>Emoji</span>
          </button>

          <button
            type="button"
            onClick={onToggleWordClickSound}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              wordClickSound
                ? isLight
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs font-black"
                  : "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm"
                : isLight
                ? "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "border-white/10 bg-[#070B14] text-slate-300 hover:text-white hover:bg-[#131B2E]"
            }`}
            title="Play kinetic pop SFX on spoken words"
          >
            {wordClickSound ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>Pop Sound</span>
          </button>

          <button
            type="button"
            onClick={onToggleSafeZones}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              safeZones
                ? isLight
                  ? "bg-amber-50 border-amber-300 text-amber-800 shadow-2xs font-black"
                  : "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm"
                : isLight
                ? "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "border-white/10 bg-[#070B14] text-slate-300 hover:text-white hover:bg-[#131B2E]"
            }`}
            title="Toggle 9:16 vertical safe zone guidelines"
          >
            <Shield size={13} className={safeZones ? "text-amber-500" : isLight ? "text-slate-500" : "text-slate-400"} />
            <span>Safe Zones</span>
          </button>
        </div>

        {/* Right Timecode & Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#2563EB] text-white hover:brightness-110 active:scale-95 transition cursor-pointer shadow-md shadow-[#0066FF]/20"
            title={isPlaying ? "Pause playback" : "Start playback"}
          >
            {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
          </button>

          <span
            className={`font-mono text-xs font-black px-3 py-1.5 rounded-xl border ${
              isLight
                ? "text-[#0066FF] bg-slate-50 border-slate-200"
                : "text-[#3B82F6] bg-[#070B14] border-white/10"
            }`}
          >
            {formatTime(currentTime)} / {formatTime(safeDuration)}
          </span>

          {/* Zoom controls */}
          <div
            className={`hidden sm:flex items-center gap-1.5 border rounded-xl px-2 py-1 ${
              isLight
                ? "bg-slate-50 border-slate-200 text-slate-600"
                : "bg-[#070B14] border-white/10 text-slate-400"
            }`}
          >
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className={isLight ? "hover:text-slate-900 p-0.5 transition" : "hover:text-white p-0.5 transition"}
              title="Zoom out"
            >
              <ZoomOut size={12} />
            </button>
            <span
              className={`text-[10px] font-mono font-bold w-7 text-center ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className={isLight ? "hover:text-slate-900 p-0.5 transition" : "hover:text-white p-0.5 transition"}
              title="Zoom in"
            >
              <ZoomIn size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Interactive Timeline Tracks & Audio Waveform ── */}
      <div
        ref={timelineRef}
        onClick={handleTimelineScrub}
        className={`relative w-full overflow-x-auto rounded-2xl border p-3 select-none cursor-pointer group/timeline custom-scrollbar ${
          isLight
            ? "bg-slate-50/80 border-slate-200"
            : "bg-[#070B14] border-white/10"
        }`}
        style={{ minHeight: "135px" }}
      >
        {/* Playhead Red/Orange Scrubber Needle */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-75 flex flex-col items-center"
          style={{ left: `${progressPercent}%` }}
        >
          {/* Top handle pill */}
          <div className="h-4 w-3 rounded-full bg-[#0066FF] border-2 border-white shadow-lg -translate-y-1" />
          {/* Vertical needle line */}
          <div className="w-[2px] flex-1 bg-gradient-to-b from-[#0066FF] via-[#2563EB] to-[#3B82F6] shadow-md shadow-[#0066FF]/50" />
        </div>

        {/* TRACK 1: Word-by-Word Chips Track */}
        <div className="space-y-1 mb-2.5">
          <div
            className={`flex items-center justify-between text-[10px] font-bold px-1 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            <span className="flex items-center gap-1">
              <Sparkles size={10} className="text-[#3B82F6]" />
              <span className={isLight ? "text-slate-800" : "text-slate-200"}>Word Synchronized Captions</span>
            </span>
            <span className={isLight ? "text-slate-500 font-medium" : "text-slate-400 font-medium"}>Click any word to seek</span>
          </div>

          <div
            className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar"
            style={{ width: `${Math.max(100, 100 * zoomLevel)}%` }}
          >
            {words && words.length > 0 ? (
              words.map((w, i) => {
                const isActive = currentTime >= w.start && currentTime <= w.end;
                const isPassed = currentTime > w.end;
                return (
                  <button
                    key={`word-${i}-${w.word}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(w.start);
                    }}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#0066FF] to-[#2563EB] text-white font-black scale-105 shadow-md shadow-[#0066FF]/30 border border-blue-300"
                        : isPassed
                        ? isLight
                          ? "bg-slate-200 text-slate-800 border border-slate-300 hover:border-slate-400"
                          : "bg-[#141C30] text-slate-300 border border-white/10 hover:border-[#0066FF]/40"
                        : isLight
                        ? "bg-white text-slate-700 border border-slate-200 hover:text-slate-900 hover:border-slate-300 shadow-2xs"
                        : "bg-[#090D18] text-slate-300 border border-white/5 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span>{w.word}</span>
                  </button>
                );
              })
            ) : (
              // Default preview words if video is not yet transcribed
              [
                "Confident",
                "people",
                "acknowledge",
                "your",
                "strengths,",
                "and",
                "people",
                "encourage",
                "your",
                "dreams.",
              ].map((sampleWord, i) => {
                const sampleStart = i * 0.5;
                const sampleEnd = (i + 1) * 0.5;
                const isActive = currentTime >= sampleStart && currentTime <= sampleEnd;
                return (
                  <button
                    key={`sample-${i}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(sampleStart);
                    }}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#0066FF] to-[#2563EB] text-white font-black scale-105 shadow-md"
                        : isLight
                        ? "bg-white text-slate-700 border border-slate-200 shadow-2xs"
                        : "bg-[#141C30] text-slate-300 border border-white/10 hover:text-white"
                    }`}
                  >
                    <span>{sampleWord}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* TRACK 2: Sentence / Phrase Blocks Track */}
        <div className="space-y-1 mb-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar" style={{ width: `${Math.max(100, 100 * zoomLevel)}%` }}>
            {phrases.map((phrase, idx) => {
              const isActivePhrase = currentTime >= phrase.start && currentTime <= phrase.end;
              return (
                <div
                  key={`phrase-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(phrase.start);
                  }}
                  className={`shrink-0 rounded-xl px-3 py-1 text-[11px] font-bold border transition cursor-pointer truncate max-w-[260px] ${
                    isActivePhrase
                      ? isLight
                        ? "bg-blue-50 border-blue-300 text-[#0066FF] font-black shadow-2xs"
                        : "bg-indigo-600/25 border-indigo-500/60 text-indigo-200"
                      : isLight
                      ? "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-2xs"
                      : "bg-[#101524] border-white/10 text-slate-300 hover:text-slate-200"
                  }`}
                >
                  {phrase.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* TRACK 3: Audio Spectrum Waveform Track */}
        <div
          className={`relative h-9 w-full rounded-xl border overflow-hidden flex items-center px-1 ${
            isLight
              ? "bg-slate-100 border-slate-200"
              : "bg-[#05070D] border-white/5"
          }`}
        >
          {/* Simulated Audio Waveform Bars */}
          <div className="flex items-center justify-between w-full h-full gap-[2px]">
            {Array.from({ length: 64 }).map((_, barIdx) => {
              const barPercent = (barIdx / 64) * 100;
              const isPlayedBar = progressPercent >= barPercent;
              // Deterministic audio height wave pattern
              const heightMultiplier = Math.sin(barIdx * 0.45) * 0.4 + Math.cos(barIdx * 0.2) * 0.35 + 0.25;
              const barHeight = Math.max(15, Math.min(95, heightMultiplier * 100));

              return (
                <div
                  key={`wave-${barIdx}`}
                  className={`w-full rounded-full transition-all duration-100 ${
                    isPlayedBar
                      ? "bg-gradient-to-t from-[#0066FF] to-[#2563EB]"
                      : isLight
                      ? "bg-slate-300/80"
                      : "bg-white/15"
                  }`}
                  style={{ height: `${barHeight}%` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
