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
} from "@/components/ui/SubtitleStylePicker";
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
  onHighlightColorChange?: (color: string) => void;
  onReplaceFile?: () => void;
  onRemoveFile?: () => void;
  hideCarousel?: boolean;
}

export function AutoCaptionBeforeAfterPlayer({
  selectedPresetKey,
  uploadedFile,
  mode = "shorts",
  captionPosition = "center",
  onPositionChange,
  onSelectPreset,
  onHighlightColorChange,
  onReplaceFile,
  onRemoveFile,
  hideCarousel = false,
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

  const mediaType = uploadedFile && (uploadedFile.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac)$/i.test(uploadedFile.name))
    ? "audio"
    : "video";
  const activeMediaRef = mediaType === "audio" && uploadedMediaUrl ? audioRef : videoRef;

  // Standard clean 10-second 16:9 talking-head preview video hosted on Cloudinary
  const YOUTUBE_TALKING_HEAD_PREVIEW_VIDEO =
    "https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.3gp";

  const videoFilename = getPresetVideoFilename(selectedPresetKey);
  const defaultPreviewVideo = mode === "longForm"
    ? YOUTUBE_TALKING_HEAD_PREVIEW_VIDEO
    : getPresetVideoUrl(selectedPresetKey);

  const activeVideoUrl = uploadedMediaUrl || defaultPreviewVideo;

  // Whenever activeVideoUrl changes (or on initial mount), reload video and attempt autoplay
  useEffect(() => {
    const v = activeMediaRef.current;
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
  }, [activeVideoUrl, activeMediaRef]);

  // Ensure audio mute matches state
  useEffect(() => {
    if (activeMediaRef.current) {
      activeMediaRef.current.muted = isMuted;
    }
  }, [isMuted, activeMediaRef]);

  // Sync playback time loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      const v = activeMediaRef.current;
      if (v && !v.paused) {
        setPlaybackTime(v.currentTime);
      }
      animId = requestAnimationFrame(loop);
    };
    if (isPlaying) {
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeMediaRef]);

  const togglePlay = () => {
    const v = activeMediaRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
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

  // Resolve preset configuration for live overlay
  const presetData = SUBTITLE_PRESETS[selectedPresetKey] || SUBTITLE_PRESETS["Hormozi Viral Pop"] || {
    name: selectedPresetKey,
    style: "one-word",
    fontFamily: "Impact, sans-serif",
    textColor: "#FFFFFF",
    highlightColor: "#22C55E",
    fontSize: "xlarge",
  };

  const presetOption: PresetOption = {
    key: selectedPresetKey,
    label: presetData.name,
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

  const savedPreviewTranscript = (previewTranscripts as Record<string, SavedPreviewTranscript>)[videoFilename];
  const currentChunk = uploadedMediaUrl
    ? isPlaying
      ? PREVIEW_SCRIPT_CHUNKS.find((chunk) => playbackTime >= chunk.start && playbackTime < chunk.end) || PREVIEW_SCRIPT_CHUNKS[0]
      : PREVIEW_SCRIPT_CHUNKS[0]
    : getPreviewCaptionAtTime(savedPreviewTranscript, playbackTime) || PREVIEW_SCRIPT_CHUNKS[Math.floor((playbackTime % 8) / 2) % PREVIEW_SCRIPT_CHUNKS.length];

  const currentWordObj = isPlaying && currentChunk
    ? currentChunk.words.find((word) => playbackTime >= word.start && playbackTime <= word.end)
    : undefined;

  const currentActiveWord = currentWordObj
    ? currentWordObj.word.replace(/[^a-zA-Z0-9']/g, "")
    : currentChunk?.activeWord || "";
  const shouldShowCaptionOverlay = Boolean(currentChunk);

  const fileSizeText = uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB` : "";

  return (
    <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/10 bg-[#111218] p-3.5 sm:p-4 shadow-2xl text-white">
      {/* Top Stage Player: Always Active */}
      <div className="w-full">
        {/* Main Video Display Stage */}
        <div className="flex flex-col items-center">
          <div
            className={`relative overflow-hidden rounded-[20px] bg-[#090A0F] border border-white/15 shadow-xl transition-all ${
              mode === "longForm"
                ? "w-full max-w-[420px] aspect-video"
                : "w-[210px] sm:w-[240px] aspect-[9/16]"
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

            {/* HTML5 Video or Audio Player */}
            {uploadedMediaUrl && mediaType === "audio" ? (
              <div
                onClick={togglePlay}
                className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#070B14] to-slate-950 p-6 cursor-pointer select-none"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6D00]/10 text-[#FF8F00] border border-[#FF6D00]/25 mb-4 shadow-lg shadow-[#FF6D00]/15">
                  <FileAudio size={32} />
                </div>
                <p className="text-xs font-bold text-white text-center truncate max-w-[200px]">
                  {uploadedFile?.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Audio Track Active</p>

                <audio
                  ref={audioRef}
                  src={uploadedMediaUrl}
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
              </div>
            ) : (
              <video
                ref={videoRef}
                src={activeVideoUrl}
                poster={!uploadedMediaUrl && mode === "shorts" ? getPresetPosterUrl(selectedPresetKey) : undefined}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                preload="auto"
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration;
                  if (d && !isNaN(d) && isFinite(d) && d > 0) setDuration(d);
                }}
                onCanPlay={(e) => {
                  const d = e.currentTarget.duration;
                  if (d && !isNaN(d) && isFinite(d) && d > 0) setDuration(d);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="h-full w-full object-cover cursor-pointer"
              />
            )}

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
                  <div className="relative">
                    <CaptionPreviewText
                      preset={presetOption}
                      config={config}
                      chunk={currentChunk}
                      playbackTime={playbackTime}
                      isPlaying={isPlaying}
                      activeWord={currentActiveWord}
                      currentWordObj={currentWordObj}
                    />
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/drag:opacity-100 transition-opacity bg-black/80 text-[9px] text-amber-400 font-bold px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none border border-amber-400/30">
                      ↕ Drag to Reposition
                    </div>
                  </div>
                </div>
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
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6D00] text-black shadow-2xl transition-transform group-hover:scale-110">
                  <Play size={24} className="fill-current ml-1 text-black" />
                </div>
              </button>
            ) : null}

            {/* Bottom Scrub Progress Line */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 z-20">
              <div
                className="h-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] transition-all duration-150"
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
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-[#FF8F00] transition cursor-pointer font-bold"
            >
              {isPlaying ? <Pause size={14} className="text-[#FF8F00]" /> : <Play size={14} className="fill-current text-[#FF8F00]" />}
              <span>{isPlaying ? "Pause" : "Play Preview"}</span>
            </button>

            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {Math.floor(playbackTime)}s / {Math.floor(duration || 8)}s
            </span>

            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-[#FF8F00] transition cursor-pointer"
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
            onHighlightColorChange={onHighlightColorChange}
            mode={mode}
            videoUrl={uploadedMediaUrl || undefined}
          />
        </div>
      )}
    </div>
  );
}
