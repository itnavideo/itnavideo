"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Music,
  Play,
  Pause,
  Search,
  X,
  Check,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { AWS_WHITEBOARD_BGM_TRACKS } from "@/components/dashboard/WhiteboardStudio";

interface WhiteboardMusicDrawerProps {
  selectedTrackId: string;
  onSelectTrack: (trackId: string) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export function WhiteboardMusicDrawer({
  selectedTrackId,
  onSelectTrack,
  volume,
  onVolumeChange,
}: WhiteboardMusicDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [auditionTrackId, setAuditionTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedTrack = useMemo(() => {
    return (
      AWS_WHITEBOARD_BGM_TRACKS.find((t) => t.id === selectedTrackId) ||
      AWS_WHITEBOARD_BGM_TRACKS[0]
    );
  }, [selectedTrackId]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    AWS_WHITEBOARD_BGM_TRACKS.forEach((t) => {
      if (t.category && t.id !== "none") cats.add(t.category);
    });
    return Array.from(cats);
  }, []);

  const filteredTracks = useMemo(() => {
    return AWS_WHITEBOARD_BGM_TRACKS.filter((track) => {
      const matchesSearch =
        track.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || track.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleToggleAudition = (track: (typeof AWS_WHITEBOARD_BGM_TRACKS)[0]) => {
    if (track.path === "none") {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setAuditionTrackId(null);
      return;
    }

    if (auditionTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setAuditionTrackId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioUrl = `https://itnavideo-media-assets.s3.ap-south-1.amazonaws.com/${track.path}`;
    const newAudio = new Audio(audioUrl);
    newAudio.volume = volume;
    newAudio.play().catch(() => {});
    newAudio.onended = () => setAuditionTrackId(null);
    audioRef.current = newAudio;
    setAuditionTrackId(track.id);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 transition-all text-left shadow-xs w-full"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Music className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Background Music
            </div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {selectedTrack.id === "none" ? "No Music (Narration Only)" : selectedTrack.label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 group-hover:text-orange-500 transition-colors">
          <span className="text-[11px] font-semibold hidden sm:inline-block">Change</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Expandable Library Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Background Music Library</h3>
                  <p className="text-xs text-slate-500">Pick a background track or audition before choosing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setAuditionTrackId(null);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control Bar */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
                {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-orange-500" />}
                <span>Volume: {Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-40 sm:w-56 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Search & Categories */}
            <div className="p-4 space-y-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search music by name, vibe or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredTracks.map((track) => {
                const isSelected = selectedTrackId === track.id;
                const isAuditioning = auditionTrackId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-orange-50/70 border-orange-400 ring-1 ring-orange-400/40"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {track.path !== "none" ? (
                        <button
                          type="button"
                          onClick={() => handleToggleAudition(track)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
                            isAuditioning
                              ? "bg-orange-500 text-white shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                          title={isAuditioning ? "Pause audition" : "Audition track"}
                        >
                          {isAuditioning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                          <VolumeX className="w-4 h-4" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {track.label}
                          </span>
                          {track.category && track.id !== "none" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              {track.category}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {track.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTrack(track.id);
                        if (audioRef.current) audioRef.current.pause();
                        setAuditionTrackId(null);
                        setIsOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? "bg-orange-500 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setAuditionTrackId(null);
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

