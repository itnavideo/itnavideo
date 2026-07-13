"use client";

/**
 * PreviewEditor — Universal preview editor for all ItnaVideo video types.
 *
 * Shows a Remotion Player preview of the reel before final render.
 * User can edit captions, layout, colors, and scenes.
 * Credits are NOT deducted here — only when user confirms and triggers final render.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { type PlayerRef } from "@remotion/player";
import {
  Play, Pause, RotateCcw, CheckCircle2, X, Loader2,
  ChevronLeft, AlertTriangle, Volume2, VolumeX,
} from "lucide-react";

import type { PreviewCaption, PreviewLayout, PreviewPlan, PreviewSticker } from "./types";
import { CaptionEditor } from "./CaptionEditor";
import { LayoutSelector } from "./LayoutSelector";
import { StickerEditor } from "./StickerEditor";
import { VideoTypePreviewRenderer } from "./VideoTypePreviewRenderer";
import { TimelineEditor } from "./TimelineEditor";

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

  // Editable state — starts from plan, user can modify
  const [captions, setCaptions] = useState<PreviewCaption[]>(plan.captions);
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
    String(plan.inputProps.fontFamily || "Inter, sans-serif")
  );
  const [captionFontSize, setCaptionFontSize] = useState(
    String(plan.inputProps.fontSize || "large")
  );
  const [captionTextColor, setCaptionTextColor] = useState(
    String(plan.inputProps.textColor || "#ffffff")
  );
  const [captionHighlightColor, setCaptionHighlightColor] = useState(
    String(plan.inputProps.highlightColor || "#facc15")
  );
  const [accentColor, setAccentColor] = useState(
    String(plan.inputProps.accentColor || "#10B981")
  );

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

  const fps = 30;
  const durationFrames = Math.ceil(plan.durationSeconds * fps);

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

  const handleCaptionUpdate = (updated: PreviewCaption[]) => {
    setCaptions(updated);
    setHasChanges(true);
  };

  const handleLayoutChange = (l: PreviewLayout) => {
    setLayout(l);
    setHasChanges(true);
  };

  const handleConfirm = () => {
    onConfirmRender(liveInputProps);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[95vh] flex flex-col lg:flex-row gap-4 overflow-hidden">

        {/* ── Left: Player + Timeline ─────────────────────────────── */}
        <div className="flex flex-col gap-3 lg:w-[340px] shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">Preview</h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                Edit before using a credit
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-zinc-500 hover:text-white transition-colors"
              title="Close preview"
            >
              <X size={20} />
            </button>
          </div>

          {/* Player — 9:16 aspect ratio */}
          <div className="relative rounded-xl overflow-hidden bg-black"
            style={{ aspectRatio: "9/16", width: "100%", maxWidth: 280, margin: "0 auto" }}
          >
              <VideoTypePreviewRenderer
                ref={playerRef}
                compositionId={plan.compositionId}
                inputProps={liveInputProps}
                durationInFrames={durationFrames}
                fps={fps}
              />
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={restart}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-2"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          {/* Timeline */}
          <TimelineEditor
            durationSeconds={plan.durationSeconds}
            currentTime={currentTime}
            captions={captions}
            scenes={plan.scenes}
            onSeek={seekTo}
          />

          {/* Confirm / Cancel buttons */}
          <div className="space-y-2 mt-auto">
            {hasChanges && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 rounded-lg px-3 py-2 border border-amber-800/40">
                <AlertTriangle size={12} />
                Unsaved changes applied to preview
              </div>
            )}
            <button
              onClick={handleConfirm}
              disabled={isRendering}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isRendering ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Starting Render…
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Create My Reel — Use 1 Credit
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isRendering}
              className="w-full py-2 rounded-xl border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={14} />
              Go back and change settings
            </button>
          </div>
        </div>

        {/* ── Right: Editors panel ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto space-y-3 lg:max-h-[calc(95vh-2rem)] pr-1">
          <div className="text-sm text-zinc-400 font-medium px-1">
            Edit before rendering
          </div>

          {/* Caption editor */}
          <CaptionEditor
            captions={captions}
            currentTime={currentTime}
            onUpdate={handleCaptionUpdate}
          />

          {/* Layout / style editor */}
          <LayoutSelector
            layout={layout}
            videoTypeId={plan.videoTypeId}
            captionStyle={captionStyle}
            captionFontFamily={captionFontFamily}
            captionFontSize={captionFontSize}
            captionTextColor={captionTextColor}
            captionHighlightColor={captionHighlightColor}
            accentColor={accentColor}
            onLayoutChange={handleLayoutChange}
            onCaptionStyleChange={(s) => { setCaptionStyle(s); setHasChanges(true); }}
            onCaptionFontFamilyChange={(font) => { setCaptionFontFamily(font); setHasChanges(true); }}
            onCaptionFontSizeChange={(size) => { setCaptionFontSize(size); setHasChanges(true); }}
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
            onStickerStyleChange={(style) => { setStickerStyle(style); setHasChanges(true); }}
            onStickerScaleChange={(scale) => { setStickerScale(scale); setHasChanges(true); }}
            onStickerOffsetChange={({x, y}) => {
              setStickerOffsetX(x);
              setStickerOffsetY(y);
              setHasChanges(true);
            }}
            onStickersChange={(nextStickers) => { setStickers(nextStickers); setHasChanges(true); }}
          />

          {/* Transcript info */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <div className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-wide">
              Transcript
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-6">
              {plan.transcript}
            </p>
            <div className="mt-2 text-[10px] text-zinc-600">
              {plan.transcriptWords.length} words · {plan.durationSeconds.toFixed(1)}s
            </div>
          </div>
        </div>
      </div>
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

  // Merge user edits over original inputProps
  return {
    ...plan.inputProps,
    captions,
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
    // For DynamicCreatorReel: scenes may have been updated if captions changed
    ...(plan.videoTypeId === "DYNAMIC_CREATOR_REEL" && plan.inputProps.scenes
      ? { scenes: plan.inputProps.scenes }
      : {}),
  };
}
