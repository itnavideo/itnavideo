"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { PreviewSticker } from "./types";

type Props = {
  videoTypeId: string;
  currentTime: number;
  stickers: PreviewSticker[];
  stickerStyle: string;
  stickerScale: number;
  stickerOffsetX: number;
  stickerOffsetY: number;
  onStickerStyleChange: (style: string) => void;
  onStickerScaleChange: (scale: number) => void;
  onStickerOffsetChange: (offset: { x: number; y: number }) => void;
  onStickersChange: (stickers: PreviewSticker[]) => void;
};

const STICKER_STYLES = [
  { value: "explainer", label: "Stickman Explainer" },
  { value: "2d", label: "2D Teacher" },
  { value: "cartoon", label: "Cartoon Teacher" },
  { value: "girl-teacher", label: "Girl Teacher" },
  { value: "girl-teacher-3d", label: "Girl Teacher 3D" },
  { value: "doctor-3d-half", label: "Doctor 3D" },
  { value: "banker-3d-half", label: "Banker 3D" },
  { value: "news-anchor-3d-half", label: "News Anchor 3D" },
  { value: "lawyer-girl-3d", label: "Lawyer Girl 3D" },
  { value: "shia-moulana-3d", label: "Moulana 3D" },
] as const;

const POSES = [
  { value: "sticker_welcome_intro_explainer", label: "Welcome intro" },
  { value: "sticker_pointing_left_side_explainer", label: "Point left item" },
  { value: "sticker_pointing_right_side_explainer", label: "Point right item" },
  { value: "sticker_comparing_both_sides_explainer", label: "Compare both" },
  { value: "sticker_questioning_surprised_explainer", label: "Question/surprise" },
  { value: "sticker_general_explaining_key_point", label: "Explain key point" },
  { value: "sticker_warning_issue_explainer", label: "Warning issue" },
  { value: "sticker_success_conclusion_explainer", label: "Success conclusion" },
  { value: "sticker_happy_celebrating_outro", label: "Celebrating outro" },
] as const;

export function StickerEditor({
  videoTypeId,
  currentTime,
  stickers,
  stickerStyle,
  stickerScale,
  stickerOffsetX,
  stickerOffsetY,
  onStickerStyleChange,
  onStickerScaleChange,
  onStickerOffsetChange,
  onStickersChange,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const supportsStickers = videoTypeId === "comparisonImages";

  const activeIndex = useMemo(() => {
    const found = stickers.findIndex((sticker) => currentTime >= sticker.start && currentTime < sticker.end);
    return found >= 0 ? found : 0;
  }, [currentTime, stickers]);

  if (!supportsStickers) return null;

  const activeSticker = stickers[activeIndex];

  const updateActivePose = (pose: string) => {
    if (!activeSticker) return;
    onStickersChange(stickers.map((sticker, index) => index === activeIndex ? {...sticker, pose} : sticker));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
      >
        <span>Sticker</span>
        {expanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
      </button>

      {expanded ? (
        <div className="space-y-4 px-4 pb-4">
          <label className="block">
            <span className="mb-2 block text-xs text-zinc-500">Character</span>
            <select
              value={stickerStyle}
              onChange={(event) => onStickerStyleChange(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
            >
              {STICKER_STYLES.map((style) => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
          </label>

          {activeSticker ? (
            <label className="block">
              <span className="mb-2 block text-xs text-zinc-500">
                Pose at {activeSticker.start.toFixed(1)}s
              </span>
              <select
                value={activeSticker.pose}
                onChange={(event) => updateActivePose(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
              >
                {POSES.map((pose) => (
                  <option key={pose.value} value={pose.value}>{pose.label}</option>
                ))}
              </select>
            </label>
          ) : null}

          <Slider label="Size" value={stickerScale} min={0.7} max={1.25} step={0.05} onChange={onStickerScaleChange} />
          <Slider
            label="Move left/right"
            value={stickerOffsetX}
            min={-220}
            max={220}
            step={10}
            onChange={(x) => onStickerOffsetChange({x, y: stickerOffsetY})}
          />
          <Slider
            label="Move up/down"
            value={stickerOffsetY}
            min={-180}
            max={160}
            step={10}
            onChange={(y) => onStickerOffsetChange({x: stickerOffsetX, y})}
          />
        </div>
      ) : null}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-500"
      />
    </label>
  );
}
