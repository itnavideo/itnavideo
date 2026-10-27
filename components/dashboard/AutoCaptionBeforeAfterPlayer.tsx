"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  FileAudio,
} from "lucide-react";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import previewTranscripts from "@/lib/cloudinary/autocaption-transcripts.json";
import { getPreviewCaptionAtTime, type SavedPreviewTranscript } from "@/lib/captions/previewTranscript";
import {
  PREVIEW_SCRIPT_CHUNKS,
  CaptionPreviewText,
  PREVIEW_CONFIG,
  CaptionStylePreviewConfig,
  PresetOption,
  CaptionScriptChunk,
} from "@/components/ui/SubtitleStylePicker";
import { getWhiteStairTemplate, type WhiteStairCard } from "@/lib/captions/whiteStairTemplates";
import { WhiteStairCaptionRenderer } from "@/components/captions/WhiteStairCaptionRenderer";
import { segmentTranscriptIntoPhrases } from "@/lib/captions/phraseSegmenter";
import type { TranscriptWordItem } from "@/lib/captions/types";
import {
  AutoCaptionStyleCarousel,
  getPresetVideoFilename,
  getPresetVideoUrl,
  getPresetPosterUrl,
} from "@/components/dashboard/AutoCaptionStyleCarousel";

export interface AutoCaptionBeforeAfterPlayerProps {
  selectedPresetKey: string;
  uploadedFile: File | null;
  mode?: "shorts" | "longForm";
  captionPosition?: "top" | "center" | "bottom";
  onPositionChange?: (pos: "top" | "center" | "bottom") => void;
  onSelectPreset?: (presetKey: string) => void;
  onReplaceFile?: () => void;
  onRemoveFile?: () => void;
  hideCarousel?: boolean;
  previewCaptions?: Array<{ start: number; end: number; text: string; words?: any[] }> | null;
  safeZones?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  externalSeekTime?: number | null;
}

export function AutoCaptionBeforeAfterPlayer({
  selectedPresetKey,
  uploadedFile,
  mode = "shorts",
  captionPosition = "center",
  onPositionChange,
  onSelectPreset,
  onReplaceFile,
  onRemoveFile,
  hideCarousel = false,
  previewCaptions = null,
  safeZones = false,
  onTimeUpdate,
  externalSeekTime = null,
}: AutoCaptionBeforeAfterPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Safe local object URL for user uploaded file with automatic revocation
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedFile) {
      setUploadedMediaUrl(null);
      return;
    }
    const url = URL.createObjectURL(uploadedFile);
    setUploadedMediaUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [uploadedFile]);

  const isAudioFile = Boolean(uploadedFile && (uploadedFile.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(uploadedFile.name)));
  const isUploadedVideo = Boolean(uploadedMediaUrl && !isAudioFile);
  const isUploadedAudio = Boolean(uploadedMediaUrl && isAudioFile);

  // Standard clean 10-second 16:9 talking-head preview video hosted on Cloudinary
  const YOUTUBE_TALKING_HEAD_PREVIEW_VIDEO =
    "https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.3gp";

  // Dedicated 9:16 vertical talking-head video for Shorts
  const DEFAULT_SHORTS_PREVIEW_VIDEO = "/visuals/homepage/autocaption.mp4";

  const defaultPreviewVideo = mode === "longForm"
    ? YOUTUBE_TALKING_HEAD_PREVIEW_VIDEO
    : DEFAULT_SHORTS_PREVIEW_VIDEO;

  const activeVideoUrl = isUploadedVideo ? uploadedMediaUrl! : defaultPreviewVideo;

  // Whenever activeVideoUrl changes (or on initial mount), reload video and attempt autoplay
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    setPlaybackTime(0);
    setDuration(8);
    v.load();

    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [activeVideoUrl]);

  // Ensure audio mute matches state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isUploadedAudio ? true : isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted, isUploadedAudio]);

  // Keep caption preview timing responsive without rerendering the full studio at 60fps.
  useEffect(() => {
    let animId: number;
    let lastUpdateAt = 0;
    const loop = (now: number) => {
      const activeEl = isUploadedAudio && audioRef.current ? audioRef.current : videoRef.current;
      if (activeEl && !activeEl.paused && now - lastUpdateAt >= 80) {
        setPlaybackTime(activeEl.currentTime);
        if (onTimeUpdate) {
          onTimeUpdate(activeEl.currentTime, activeEl.duration || duration || 8);
        }
        lastUpdateAt = now;
      }
      animId = requestAnimationFrame(loop);
    };
    if (isPlaying) {
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isUploadedAudio, onTimeUpdate, duration]);

  // Handle external seek requests from timeline
  useEffect(() => {
    if (externalSeekTime !== null && externalSeekTime !== undefined) {
      if (videoRef.current) {
        const vDur = videoRef.current.duration || 8;
        videoRef.current.currentTime = externalSeekTime % vDur;
      }
      if (audioRef.current) {
        audioRef.current.currentTime = externalSeekTime;
      }
      setPlaybackTime(externalSeekTime);
      if (onTimeUpdate) {
        onTimeUpdate(externalSeekTime, duration || 8);
      }
    }
  }, [externalSeekTime, onTimeUpdate, duration]);

  const togglePlay = () => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (v) {
      if (v.paused) {
        v.play().then(() => setIsPlaying(true)).catch(() => {});
        if (a) a.play().catch(() => {});
      } else {
        v.pause();
        if (a) a.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleSelectPreset = (presetKey: string) => {
    if (onSelectPreset) {
      onSelectPreset(presetKey);
    }
  };

  // 1. Resolve active WhiteStair template (e.g. Creator 4, Solo, Crazy, etc.)
  const activeWhiteStairTemplate = useMemo(() => {
    return getWhiteStairTemplate(selectedPresetKey);
  }, [selectedPresetKey]);

  // Resolve preset configuration for live overlay
  const presetData = SUBTITLE_PRESETS[selectedPresetKey] || SUBTITLE_PRESETS["Hormozi Viral Pop"] || {
    name: activeWhiteStairTemplate?.name || selectedPresetKey,
    style: "one-word",
    fontFamily: "Impact, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#22C55E",
    fontSize: "xlarge",
  };

  const presetOption: PresetOption = {
    key: selectedPresetKey,
    label: activeWhiteStairTemplate?.name || presetData.name,
    style: presetData.style,
    font: presetData.fontFamily,
    textColor: presetData.textColor,
    highlightColor: presetData.highlightColor,
    bgColor: presetData.backgroundColor,
  };

  const config: CaptionStylePreviewConfig = PREVIEW_CONFIG[selectedPresetKey] || {
    sampleLines: ["VIRAL CAPTIONS", "THAT POP"],
    activeWord: "VIRAL",
  };

  // 2. Gather all word-level items from previewCaptions or raw transcript
  const allWordItems = useMemo<TranscriptWordItem[]>(() => {
    if (previewCaptions && previewCaptions.length > 0) {
      const items: TranscriptWordItem[] = [];
      previewCaptions.forEach((seg, sIdx) => {
        if (seg.words && seg.words.length > 0) {
          seg.words.forEach((w: any, wIdx: number) => {
            items.push({
              id: `w-${sIdx}-${wIdx}`,
              word: String(w.word || w.text || ""),
              start: Number(w.start ?? seg.start),
              end: Number(w.end ?? seg.end),
            });
          });
        } else if (seg.text) {
          const segWords = seg.text.trim().split(/\s+/).filter(Boolean);
          const segDur = Math.max(0.2, seg.end - seg.start);
          segWords.forEach((w, i) => {
            items.push({
              id: `w-${sIdx}-${i}`,
              word: w,
              start: seg.start + (i / Math.max(1, segWords.length)) * segDur,
              end: seg.start + ((i + 1) / Math.max(1, segWords.length)) * segDur,
            });
          });
        }
      });
      return items;
    }
    return [];
  }, [previewCaptions]);

  // 3. Segment into dynamic, single-line phrases (max 2-4 words per phrase based on template)
  const singleLinePhrases = useMemo(() => {
    const maxWords = activeWhiteStairTemplate?.maxWordsPerLine || 3;
    if (allWordItems.length > 0) {
      return segmentTranscriptIntoPhrases(allWordItems, {
        minWordsPerPhrase: 1,
        maxWordsPerPhrase: maxWords,
        maxDurationSeconds: 2.0,
      });
    }
    return [];
  }, [allWordItems, activeWhiteStairTemplate]);

  // 4. Find active phrase dynamically synchronized with currentTime
  const defaultTranscript = (Object.values(previewTranscripts)[0] || undefined) as SavedPreviewTranscript | undefined;

  const activePhrase = useMemo(() => {
    if (singleLinePhrases.length > 0) {
      const found = singleLinePhrases.find(
        (p) => playbackTime >= p.start && playbackTime <= p.end
      );
      if (found) return found;

      // During brief speech pauses, keep recent phrase on screen for 0.6s
      const recent = singleLinePhrases.find(
        (p) => playbackTime >= p.start && playbackTime <= p.end + 0.6
      );
      if (recent) return recent;

      if (!isPlaying) return singleLinePhrases[0];
      return null;
    }

    // Fallback when no audio is uploaded yet
    if (activeWhiteStairTemplate && activeWhiteStairTemplate.words && activeWhiteStairTemplate.words.length > 0) {
      return {
        id: "demo",
        text: activeWhiteStairTemplate.words.map((w) => w.text).join(" "),
        start: 0,
        end: 8,
        duration: 8,
        words: activeWhiteStairTemplate.words.map((w, idx) => ({
          id: `demo-${idx}`,
          word: w.text || "SAMPLE",
          start: idx * 0.8,
          end: (idx + 1) * 0.8,
        })),
        hasMajorPunctuation: false,
        pauseAfterSeconds: 0,
      };
    }

    return null;
  }, [singleLinePhrases, playbackTime, isPlaying, activeWhiteStairTemplate]);

  // Dynamic chunk built from the active single-line phrase
  const currentChunk = useMemo<CaptionScriptChunk | null>(() => {
    if (activePhrase) {
      const activeWordObj = activePhrase.words.find(
        (w: any) => playbackTime >= w.start && playbackTime <= w.end
      );
      return {
        id: 1,
        start: activePhrase.start,
        end: activePhrase.end,
        sampleLines: [activePhrase.text],
        lines: [activePhrase.text],
        activeWord: activeWordObj?.word || activePhrase.words[0]?.word || "",
        words: activePhrase.words,
      } as CaptionScriptChunk;
    }

    if (uploadedMediaUrl) {
      return isPlaying
        ? PREVIEW_SCRIPT_CHUNKS.find((chunk) => playbackTime >= chunk.start && playbackTime < chunk.end) || PREVIEW_SCRIPT_CHUNKS[0]
        : PREVIEW_SCRIPT_CHUNKS[0];
    }

    return getPreviewCaptionAtTime(defaultTranscript, playbackTime) || PREVIEW_SCRIPT_CHUNKS[Math.floor((playbackTime % 8) / 2) % PREVIEW_SCRIPT_CHUNKS.length];
  }, [activePhrase, playbackTime, uploadedMediaUrl, isPlaying, defaultTranscript]);

  const currentWordObj = isPlaying && currentChunk
    ? currentChunk.words.find((word: any) => playbackTime >= word.start && playbackTime <= word.end)
    : undefined;

  const currentActiveWord = currentWordObj
    ? currentWordObj.word.replace(/[^a-zA-Z0-9']/g, "")
    : currentChunk?.activeWord || "";

  // Never show overlay if "No Caption" template is selected
  const isNoCaptionSelected = activeWhiteStairTemplate?.isCrossed || selectedPresetKey === "none";
  const shouldShowCaptionOverlay = !isNoCaptionSelected && Boolean(activePhrase || currentChunk);

  const fileSizeText = uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB` : "";

  return (
    <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/10 bg-[#0E1526] p-4 sm:p-5 shadow-2xl text-white">
      {/* Top Stage Player: Always Active */}
      <div className="w-full">
        {/* Main Video Display Stage */}
        <div className="flex flex-col items-center">
          <div
            className={`relative overflow-hidden rounded-[20px] bg-[#070B14] border border-white/15 shadow-2xl transition-all ${
              mode === "longForm"
                ? "w-full max-w-[440px] aspect-video"
                : "w-[220px] sm:w-[260px] aspect-[9/16]"
            }`}
          >


            {/* Floating Mute/Unmute Control */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white hover:bg-black transition shadow-md border border-white/15 cursor-pointer"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
            </button>

            {/* HTML5 Video Player with Talking Presenter Background */}
            <div className="relative h-full w-full">
              <video
                ref={videoRef}
                src={activeVideoUrl}
                poster="/visuals/homepage/autocaption.1.png"
                autoPlay
                playsInline
                loop
                muted={isUploadedAudio ? true : isMuted}
                preload="auto"
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  if (d && !isNaN(d) && isFinite(d) && d > 0) {
                    if (!isUploadedAudio) setDuration(d);
                  }
                }}
                onCanPlay={(e) => {
                  const d = e.currentTarget.duration;
                  if (d && !isNaN(d) && isFinite(d) && d > 0) {
                    if (!isUploadedAudio) setDuration(d);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="h-full w-full object-cover cursor-pointer"
              />

              {/* If user uploaded audio, audio track plays in sync with talking video background */}
              {isUploadedAudio && (
                <>
                  <audio
                    ref={audioRef}
                    src={uploadedMediaUrl!}
                    loop
                    muted={isMuted}
                    preload="auto"
                    onLoadedMetadata={(e) => {
                      const d = e.currentTarget.duration;
                      if (d && !isNaN(d) && isFinite(d) && d > 0) setDuration(d);
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                    <FileAudio size={12} className="text-[#FF7043]" />
                    <span className="truncate max-w-[120px]">{uploadedFile?.name}</span>
                  </div>
                </>
              )}
            </div>


            {/* Use the saved transcript for each Cloudinary style preview. */}
            {shouldShowCaptionOverlay && currentChunk && (
              <>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div
                  onPointerMove={(e) => {
                    if (!e.buttons) return;
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (!rect) return;
                    const relativeY = (e.clientY - rect.top) / rect.height;
                    if (relativeY < 0.35) {
                      if (onPositionChange) onPositionChange("top");
                    } else if (relativeY < 0.65) {
                      if (onPositionChange) onPositionChange("center");
                    } else {
                      if (onPositionChange) onPositionChange("bottom");
                    }
                  }}
                  className={`absolute inset-x-2.5 ${
                    captionPosition === "top"
                      ? "top-[12%]"
                      : captionPosition === "center"
                      ? "top-[42%]"
                      : "bottom-[20%]"
                  } flex justify-center text-center z-10 cursor-ns-resize group/drag transition-all duration-150`}
                  title="Drag Up/Down to Reposition Captions"
                >
                  {/* WhiteStair Interactive Caption Layer Bounding Box */}
                  <div className="relative p-2 rounded-2xl border border-indigo-400/80 bg-indigo-500/10 hover:border-[#FF5722] hover:bg-[#FF5722]/10 transition-all duration-150 shadow-lg">
                    {/* 4 Corner Anchor Handles (WhiteStair Signature) */}
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm pointer-events-none" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm pointer-events-none" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm pointer-events-none" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm pointer-events-none" />

                    {activeWhiteStairTemplate && activeWhiteStairTemplate.words && activeWhiteStairTemplate.words.length > 0 && activePhrase ? (
                      <WhiteStairCaptionRenderer
                        template={activeWhiteStairTemplate}
                        phrase={activePhrase}
                        playbackTime={playbackTime}
                        isPlaying={isPlaying}
                      />
                    ) : currentChunk ? (
                      <CaptionPreviewText
                        preset={presetOption}
                        config={config}
                        chunk={currentChunk}
                        playbackTime={playbackTime}
                        isPlaying={isPlaying}
                        activeWord={currentActiveWord}
                        currentWordObj={currentWordObj}
                      />
                    ) : null}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/drag:opacity-100 transition-opacity bg-black/90 text-[9px] text-[#FFA000] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap pointer-events-none border border-[#FF5722]/40 shadow-lg">
                      ↕ Drag to Reposition (Top / Middle / Bottom)
                    </div>
                  </div>
                </div>
                {/* 9:16 Vertical Safe Zone Lines (WhiteStair Style) */}
                {safeZones && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 border-2 border-dashed border-amber-400/40 rounded-[20px]">
                    <div className="h-[12%] border-b border-dashed border-amber-400/35 flex items-start justify-end pr-1">
                      <span className="text-[8px] font-mono text-amber-300/90 bg-black/70 px-1.5 py-0.5 rounded">
                        Top Header Safe Zone
                      </span>
                    </div>
                    <div className="h-[20%] border-t border-dashed border-amber-400/35 flex items-end justify-end pr-1 pb-1">
                      <span className="text-[8px] font-mono text-amber-300/90 bg-black/70 px-1.5 py-0.5 rounded">
                        Bottom Scrubber Safe Zone
                      </span>
                    </div>
                  </div>
                )}
                {mode === "longForm" && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-[14%] border-b border-dashed border-red-500/30 z-10 flex justify-end pr-2">
                    <span className="text-[9px] font-mono font-bold text-red-400/70 -translate-y-full">
                      14% YouTube Scrubber Safe Line
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Center Play/Pause button when paused */}
            {!isPlaying ? (
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-all cursor-pointer group z-20"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF5722] text-black shadow-2xl transition-transform group-hover:scale-110">
                  <Play size={24} className="fill-current ml-1 text-black" />
                </div>
              </button>
            ) : null}

            {/* Bottom Scrub Progress Line */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 z-20">
              <div
                className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF7043] transition-all duration-150"
                style={{
                  width: duration > 0 ? `${(playbackTime / duration) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* Video Stage Controls Bar */}
          <div className="mt-3 flex items-center justify-between w-full max-w-[340px] text-xs font-semibold text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-[#FF7043] transition cursor-pointer font-bold"
            >
              {isPlaying ? <Pause size={14} className="text-[#FF7043]" /> : <Play size={14} className="fill-current text-[#FF7043]" />}
              <span>{isPlaying ? "Pause" : "Play Preview"}</span>
            </button>

            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {Math.floor(playbackTime)}s / {Math.floor(duration || 8)}s
            </span>

            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-[#FF7043] transition cursor-pointer"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-emerald-500" />}
              <span>{isMuted ? "Unmute" : "Muted"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Style Gallery Carousel: Conditionally rendered if not hidden */}
      {!hideCarousel && (
        <div className={uploadedMediaUrl ? "w-full mt-4 pt-4 border-t border-slate-100 dark:border-white/10" : "w-full"}>
          <AutoCaptionStyleCarousel
            selectedPresetKey={selectedPresetKey}
            onSelectPreset={handleSelectPreset}
            mode={mode}
            videoUrl={uploadedMediaUrl || undefined}
          />
        </div>
      )}
    </div>
  );
}
