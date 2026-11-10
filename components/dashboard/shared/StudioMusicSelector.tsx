"use client";

import React, { useState, useRef } from "react";
import { Music2, Play, Pause, Volume2, Check, X } from "lucide-react";
import {
  STUDIO_CARD_CLASS,
  STUDIO_SECTION_TITLE,
  STUDIO_SECTION_SUBTITLE,
  STUDIO_LABEL,
} from "./studioDesignSystem";
import { AWS_BGM_TRACKS, type LibraryBgmTrack } from "../ImageToVideoStudio";

export interface StudioMusicSelectorProps {
  selectedTrackId: string;
  onSelectTrack: (trackId: string, trackUrl?: string) => void;
  volume: number; // 0.0 to 1.0
  onVolumeChange: (volume: number) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function StudioMusicSelector({
  selectedTrackId,
  onSelectTrack,
  volume,
  onVolumeChange,
  title = "Background Music",
  subtitle = "Copyright-free cinematic tracks balanced for speech clarity",
  className = "",
}: StudioMusicSelectorProps) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = (track: LibraryBgmTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.path);
      audio.volume = volume;
      audio.onended = () => setPlayingTrackId(null);
      audio.onerror = () => setPlayingTrackId(null);
      audio.play().catch(() => setPlayingTrackId(null));
      audioRef.current = audio;
      setPlayingTrackId(track.id);
    }
  };

  return (
    <div className={`${STUDIO_CARD_CLASS} ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className={STUDIO_SECTION_TITLE}>
            <Music2 size={16} className="text-orange-500 shrink-0" />
            <span>{title}</span>
          </h3>
          <p className={STUDIO_SECTION_SUBTITLE}>{subtitle}</p>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 shrink-0">
          <Volume2 size={14} className="text-slate-500 shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onVolumeChange(val);
              if (audioRef.current) {
                audioRef.current.volume = val;
              }
            }}
            className="w-16 sm:w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
          <span className="text-[11px] font-black text-slate-700 w-7 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Track Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {/* No Music / Mute Option */}
        <button
          type="button"
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            setPlayingTrackId(null);
            onSelectTrack("none", "");
          }}
          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedTrackId === "none" || !selectedTrackId
              ? "border-orange-500 bg-orange-50/40 text-orange-600 font-bold ring-1 ring-orange-500/30"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <div className="min-w-0 pr-1">
            <p className="text-xs font-black truncate">No Music</p>
            <p className="text-[10px] text-slate-400">Pure Voiceover</p>
          </div>
          {(selectedTrackId === "none" || !selectedTrackId) && (
            <Check size={14} className="text-orange-500 shrink-0" />
          )}
        </button>

        {/* Library Tracks */}
        {AWS_BGM_TRACKS.slice(0, 11).map((track) => {
          const isSelected = selectedTrackId === track.id || selectedTrackId === track.path;
          const isPlaying = playingTrackId === track.id;

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id, track.path)}
              className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-orange-500 bg-orange-50/40 text-orange-950 font-bold ring-1 ring-orange-500/30"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/70"
              }`}
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-black truncate">{track.title}</p>
                <p className="text-[10px] text-slate-500 truncate capitalize">
                  {track.genre || track.energy || "Cinematic"}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => handleTogglePlay(track, e)}
                className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isPlaying
                    ? "bg-orange-500 text-white shadow-xs scale-105"
                    : isSelected
                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                title={isPlaying ? "Pause preview" : "Play preview"}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

