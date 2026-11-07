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

    const audioUrl = `https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/${track.path}`;
    const newAudio = new Audio(audioUrl);
    newAudio.volume = Math.max(0.75, Math.min(1.0, (volume || 0.12) * 5));
    newAudio.play().catch((err) => {
      console.warn("Could not play audition track:", err);
    });
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
        className="group flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl border border-white/10 bg-[#151E30] hover:border-[#0066FF]/50 hover:bg-[#1A253C] transition-all text-left shadow-xs w-full cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/30 text-[#3B82F6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Music className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Background Music
            </div>
            <div className="text-xs font-bold text-white truncate">
              {selectedTrack.id === "none" ? "No Music (Narration Only)" : selectedTrack.label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 group-hover:text-[#3B82F6] transition-colors">
          <span className="text-[11px] font-semibold hidden sm:inline-block">Change</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Expandable Library Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0E1526] rounded-3xl border border-white/10 w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/30 text-[#3B82F6] flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Background Music Library</h3>
                  <p className="text-xs text-slate-400">Pick a background track or audition before choosing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setAuditionTrackId(null);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control Bar */}
            <div className="px-5 py-3 bg-[#070B14]/60 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 shrink-0">
                {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#3B82F6]" />}
                <span>Volume: {Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-40 sm:w-56 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#0066FF]"
              />
            </div>

            {/* Search & Categories */}
            <div className="p-4 space-y-3 border-b border-white/10 bg-[#070B14]/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search music by name, vibe or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-white/10 bg-[#070B14] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                        ? "bg-[#0066FF] text-white font-bold"
                        : "bg-[#151E30] text-slate-300 hover:text-white"
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
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-[#0066FF]/15 border-[#0066FF] ring-1 ring-[#0066FF]/30 text-white"
                        : "bg-[#151E30] border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {track.path !== "none" ? (
                        <button
                          type="button"
                          onClick={() => handleToggleAudition(track)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
                            isAuditioning
                              ? "bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                          title={isAuditioning ? "Pause audition" : "Audition track"}
                        >
                          {isAuditioning ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 ml-0.5 fill-white" />}
                        </button>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center shrink-0">
                          <VolumeX className="w-4 h-4" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {track.label}
                          </span>
                          {track.category && track.id !== "none" && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-slate-300 border border-white/10">
                              {track.category}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#0052CC] to-[#0066FF] text-white font-bold"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
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
            <div className="p-3 border-t border-white/10 bg-[#070B14]/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setAuditionTrackId(null);
                  setIsOpen(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0052CC] to-[#0066FF] text-white hover:brightness-110 transition cursor-pointer"
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

