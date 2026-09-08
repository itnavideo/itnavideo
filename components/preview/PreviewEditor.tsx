"use client";

/**
 * PreviewEditor — Professional NLE Studio Preview & Editor for ItnaVideo.
 *
 * Matches the exact hand-drawn layout:
 * 1. Top Storyboard Bar (Scene Thumbnails + Text + Script)
 * 2. Main Live Studio Workspace (Video Live Player + Multi-Track Timeline Editor)
 * 3. Bottom Customization Toolbar (Text Size, Font/Colors, AI Prompt Edit, Image Swap)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { type PlayerRef } from "@remotion/player";
import {
  Play, Pause, RotateCcw, CheckCircle2, X, Loader2,
  ChevronLeft, AlertTriangle, Volume2, VolumeX, SlidersHorizontal
} from "lucide-react";

import type { PreviewCaption, PreviewLayout, PreviewPlan, PreviewSticker } from "./types";
import { VideoTypePreviewRenderer } from "./VideoTypePreviewRenderer";
import { SceneStoryboardBar } from "./SceneStoryboardBar";
import { MultiTrackTimelineEditor } from "./MultiTrackTimelineEditor";
import { StudioInspectorToolbar } from "./StudioInspectorToolbar";
import { LayoutSelector } from "./LayoutSelector";
import { StickerEditor } from "./StickerEditor";
import { DEFAULT_FPS } from "@/remotion/constants";

type Props = {
  plan: PreviewPlan;
  /** Called when user confirms — triggers final Lambda render */
  onConfirmRender: (finalInputProps: Record<string, unknown>) => void;
  /** Called when user cancels preview */
  onCancel: () => void;
  isRendering?: boolean;
};

export function PreviewEditor({ plan, onConfirmRender, onCancel, isRendering = false }: Props) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Editable state — starts from plan, user can modify
  const [captions, setCaptions] = useState<PreviewCaption[]>(() => {
    // If inputProps.keywords exist (e.g. typography video), build phrases into captions
    if (Array.isArray(plan.inputProps.keywords) && plan.inputProps.keywords.length > 0) {
      return (plan.inputProps.keywords as Array<Record<string, unknown>>).map((kw) => ({
        start: Number(kw.start ?? 0),
        end: Number(kw.end ?? 2),
        text: String(kw.heroText || kw.word || kw.leadText || ""),
        leadText: String(kw.leadText || ""),
        heroText: String(kw.heroText || kw.word || ""),
        subText: String(kw.subText || ""),
        customImage: String(kw.customImage || ""),
      }));
    }
    return plan.captions || [];
  });

  const [stickers, setStickers] = useState<PreviewSticker[]>(plan.stickers || []);
  const [layout, setLayout] = useState<PreviewLayout>(plan.layout as PreviewLayout);
  const [stickerStyle, setStickerStyle] = useState(String(plan.inputProps.stickerStyle || "explainer"));
  const [stickerScale, setStickerScale] = useState(Number(plan.inputProps.stickerScale || 1));
  const [stickerOffsetX, setStickerOffsetX] = useState(Number(plan.inputProps.stickerOffsetX || 0));
  const [stickerOffsetY, setStickerOffsetY] = useState(Number(plan.inputProps.stickerOffsetY || 0));
  const [captionStyle, setCaptionStyle] = useState(
    String(plan.inputProps.captionStyle || "Studio Clean")
  );
  const [captionFontFamily, setCaptionFontFamily] = useState(
    String(plan.inputProps.fontFamily || "Inter, 'Plus Jakarta Sans', sans-serif")
  );
  const [captionFontSize, setCaptionFontSize] = useState(
    String(plan.inputProps.fontSize || "large")
  );
  const [captionTextColor, setCaptionTextColor] = useState(
    String(plan.inputProps.textColor || "#ffffff")
  );
  const [captionHighlightColor, setCaptionHighlightColor] = useState(
    String(plan.inputProps.highlightColor || "#e087ff")
  );
  const [accentColor, setAccentColor] = useState(
    String(plan.inputProps.accentColor || "#c084fc")
  );

  const fps = DEFAULT_FPS;

  // Track active caption phrase based on current time
  useEffect(() => {
    const idx = captions.findIndex((c) => currentTime >= c.start && currentTime < c.end);
    if (idx !== -1) {
      setActiveCaptionIndex(idx);
    }
  }, [currentTime, captions]);

  // Build live inputProps from current editor state
  const liveInputProps = buildLiveInputProps({
    plan,
    captions,
    stickers,
    layout,
    stickerStyle,
    stickerScale,
    stickerOffsetX,
    stickerOffsetY,
    captionStyle,
    captionFontFamily,
    captionFontSize,
    captionTextColor,
    captionHighlightColor,
    accentColor,
  });

  // Player event listeners
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onFrame = () => {
      const frame = player.getCurrentFrame();
      setCurrentTime(frame / fps);
    };

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    player.addEventListener("frameupdate", onFrame);

    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
      player.removeEventListener("frameupdate", onFrame);
    };
  }, [fps]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) player.pause();
    else player.play();
  };

  const restart = () => {
    playerRef.current?.seekTo(0);
    playerRef.current?.pause();
    setCurrentTime(0);
  };

  const seekTo = useCallback((time: number) => {
    const frame = Math.round(time * fps);
    playerRef.current?.seekTo(frame);
    setCurrentTime(time);
  }, [fps]);

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    player.setVolume(newMuted ? 0 : 1);
  };

  // Handlers for Studio Inspector Toolbar
  const handleCaptionTextChange = (index: number, newLead: string, newHero: string, newSub?: string) => {
    setCaptions((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          leadText: newLead,
          heroText: newHero,
          subText: newSub ?? next[index].subText,
          text: `${newLead} ${newHero}`.trim(),
        };
      }
      return next;
    });
    setHasChanges(true);
  };

  const handleImageChange = (index: number, newImageUrl: string) => {
    setCaptions((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          customImage: newImageUrl,
        };
      }
      return next;
    });
    setHasChanges(true);
  };

  const handleConfirm = () => {
    onConfirmRender(liveInputProps);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col overflow-hidden font-sans select-none">
      {/* ── TOP HEADER BAR ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isRendering}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Go back"
          >
            <X size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight">ItnaVideo Editor Studio</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Live Interactive Preview
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Customize text, fonts, colors, and images freely before exporting
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-xs text-amber-400 flex items-center gap-1 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg">
              <AlertTriangle size={13} />
              Unsaved Live Customizations
            </span>
          )}

          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal size={14} />
            <span>Layout & Stickers</span>
          </button>

          <button
            onClick={handleConfirm}
            disabled={isRendering}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-60 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:scale-102 active:scale-98"
          >
            {isRendering ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Starting Render…
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Export / Render Reel (1 Credit)
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT ────────────────────────────────── */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto min-h-0 bg-zinc-950/50">
        {/* 1. TOP STORYBOARD STRIP (Text + Scene + Script) */}
        <SceneStoryboardBar
          scenes={plan.scenes}
          currentTime={currentTime}
          durationSeconds={plan.durationSeconds}
          onSelectScene={seekTo}
        />

        {/* 2. MAIN MIDDLE SPLIT WORKSPACE (Video Live + Multi-Track Timeline) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 items-stretch">
          {/* LEFT: Video Live Player Box */}
          <div className="lg:col-span-5 bg-zinc-950/90 rounded-2xl border border-zinc-800/80 p-3 flex flex-col justify-between shadow-2xl relative group min-h-[360px]">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Video Live Preview
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                9:16 vertical · {plan.durationSeconds.toFixed(1)}s
              </span>
            </div>

            {/* Video Player Render Frame */}
            <div className="flex-1 relative flex items-center justify-center min-h-0 my-1 overflow-hidden rounded-xl bg-black border border-zinc-900">
              <VideoTypePreviewRenderer
                plan={plan}
                liveInputProps={liveInputProps}
                playerRef={playerRef}
              />
            </div>

            {/* Live Playback Controls */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={restart}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                  title="Restart"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={togglePlay}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-800"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              <div className="font-mono text-xs text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                {currentTime.toFixed(1)}s
              </div>
            </div>
          </div>

          {/* RIGHT: Multi-Track Timeline Editor */}
          <div className="lg:col-span-7 flex flex-col min-h-[360px]">
            <MultiTrackTimelineEditor
              durationSeconds={plan.durationSeconds}
              currentTime={currentTime}
              captions={captions}
              scenes={plan.scenes}
              stickers={stickers}
              onSeek={seekTo}
              onSelectCaption={(idx) => setActiveCaptionIndex(idx)}
              onSelectImageBlock={(idx) => setActiveCaptionIndex(idx)}
            />
          </div>
        </div>

        {/* 3. BOTTOM INSPECTOR CUSTOMIZATION TOOLBAR */}
        <StudioInspectorToolbar
          activeCaption={captions[activeCaptionIndex]}
          activeCaptionIndex={activeCaptionIndex}
          totalCaptions={captions.length}
          fontSize={captionFontSize}
          fontFamily={captionFontFamily}
          textColor={captionTextColor}
          highlightColor={captionHighlightColor}
          accentColor={accentColor}
          onFontSizeChange={(size) => { setCaptionFontSize(size); setHasChanges(true); }}
          onFontFamilyChange={(font) => { setCaptionFontFamily(font); setHasChanges(true); }}
          onTextColorChange={(color) => { setCaptionTextColor(color); setHasChanges(true); }}
          onHighlightColorChange={(color) => { setCaptionHighlightColor(color); setHasChanges(true); }}
          onCaptionTextChange={handleCaptionTextChange}
          onImageChange={handleImageChange}
        />
      </div>

      {/* OPTIONAL ADVANCED SIDE PANEL (Layout & Stickers) */}
      {showAdvancedSettings && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-zinc-950 border-l border-zinc-800 p-4 shadow-2xl flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-emerald-400" />
              Advanced Settings
            </h3>
            <button
              onClick={() => setShowAdvancedSettings(false)}
              className="text-zinc-400 hover:text-white font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <LayoutSelector
            layout={layout}
            videoTypeId={plan.videoTypeId}
            captionStyle={captionStyle}
            captionFontFamily={captionFontFamily}
            captionFontSize={captionFontSize}
            captionTextColor={captionTextColor}
            captionHighlightColor={captionHighlightColor}
            accentColor={accentColor}
            onLayoutChange={(l) => { setLayout(l); setHasChanges(true); }}
            onCaptionStyleChange={(s) => { setCaptionStyle(s); setHasChanges(true); }}
            onCaptionFontFamilyChange={(f) => { setCaptionFontFamily(f); setHasChanges(true); }}
            onCaptionFontSizeChange={(sz) => { setCaptionFontSize(sz); setHasChanges(true); }}
            onCaptionTextColorChange={(c) => { setCaptionTextColor(c); setHasChanges(true); }}
            onCaptionHighlightColorChange={(c) => { setCaptionHighlightColor(c); setHasChanges(true); }}
            onAccentColorChange={(c) => { setAccentColor(c); setHasChanges(true); }}
          />

          <StickerEditor
            videoTypeId={plan.videoTypeId}
            currentTime={currentTime}
            stickers={stickers}
            stickerStyle={stickerStyle}
            stickerScale={stickerScale}
            stickerOffsetX={stickerOffsetX}
            stickerOffsetY={stickerOffsetY}
            onStickerStyleChange={(st) => { setStickerStyle(st); setHasChanges(true); }}
            onStickerScaleChange={(sc) => { setStickerScale(sc); setHasChanges(true); }}
            onStickerOffsetChange={({ x, y }) => {
              setStickerOffsetX(x);
              setStickerOffsetY(y);
              setHasChanges(true);
            }}
            onStickersChange={(st) => { setStickers(st); setHasChanges(true); }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildLiveInputProps({
  plan,
  captions,
  stickers,
  layout,
  stickerStyle,
  stickerScale,
  stickerOffsetX,
  stickerOffsetY,
  captionStyle,
  captionFontFamily,
  captionFontSize,
  captionTextColor,
  captionHighlightColor,
  accentColor,
}: {
  plan: PreviewPlan;
  captions: PreviewCaption[];
  stickers: PreviewSticker[];
  layout: PreviewLayout;
  stickerStyle: string;
  stickerScale: number;
  stickerOffsetX: number;
  stickerOffsetY: number;
  captionStyle: string;
  captionFontFamily: string;
  captionFontSize: string;
  captionTextColor: string;
  captionHighlightColor: string;
  accentColor: string;
}): Record<string, unknown> {
  const overlayTimeline = stickers.length > 0
    ? stickers.map((sticker) => ({
        id: sticker.id,
        start: sticker.start,
        end: sticker.end,
        text: captions.find((caption) => caption.start === sticker.start)?.text || '',
        stickerPose: sticker.pose,
        pose: sticker.pose,
      }))
    : plan.inputProps.overlayTimeline;

  // Build keywords for typography template if active
  const keywords = captions.map((cap) => ({
    start: cap.start,
    end: cap.end,
    leadText: cap.leadText || cap.text,
    heroText: cap.heroText || cap.text.toUpperCase(),
    subText: cap.subText || "",
    customImage: cap.customImage || "",
    icon: "sparkle",
  }));

  // Merge user edits over original inputProps
  return {
    ...plan.inputProps,
    captions,
    keywords,
    subtitleChunks: captions,
    transcriptSegments: captions,
    overlayTimeline,
    stickers,
    captionStyle,
    fontFamily: captionFontFamily,
    fontSize: captionFontSize,
    textColor: captionTextColor,
    highlightColor: captionHighlightColor,
    accentColor,
    stickerStyle,
    stickerScale,
    stickerOffsetX,
    stickerOffsetY,
    videoLayout: layout.videoLayout,
    captionPosition: layout.captionPosition,
    progressStyle: layout.progressStyle,
    ...(plan.videoTypeId === "DYNAMIC_CREATOR_REEL" && plan.inputProps.scenes
      ? { scenes: plan.inputProps.scenes }
      : {}),
  };
}
