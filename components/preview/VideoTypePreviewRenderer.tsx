"use client";

import { forwardRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Loader2 } from "lucide-react";

import { AutoCaptionGenerator } from "@/remotion/templates/AUTO_CAPTION_GENERATOR/template";
import { CompareExplainer } from "@/remotion/templates/COMPARE_EXPLAINER/template";
import { FacelessVideoTemplate } from "@/remotion/templates/FACELESS_VIDEO/template";
import { DEFAULT_FPS, secondsToFrames } from "@/remotion/constants";

type Props = {
  compositionId?: string;
  inputProps?: Record<string, unknown>;
  durationInFrames?: number;
  fps?: number;
  plan?: import("./types").PreviewPlan;
  liveInputProps?: Record<string, unknown>;
  playerRef?: React.RefObject<PlayerRef | null>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPOSITION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "AUTO-CAPTION-GENERATOR": AutoCaptionGenerator,
  "AUTO-CAPTION-GENERATOR-LANDSCAPE": AutoCaptionGenerator,
  AUTO_CAPTION_GENERATOR: AutoCaptionGenerator,
  comparisonImages: CompareExplainer,
  "FACELESS-VIDEO": FacelessVideoTemplate,
  facelessVideo: FacelessVideoTemplate,
  "AI-VIDEO-GENERATOR": FacelessVideoTemplate,
  aiVideoGenerator: FacelessVideoTemplate,
};

export const VideoTypePreviewRenderer = forwardRef<PlayerRef, Props>(function VideoTypePreviewRenderer(
  props,
  ref,
) {
  const plan = props.plan;
  const compositionId = props.compositionId || plan?.compositionId || "AUTO-CAPTION-GENERATOR";
  const liveInputProps = props.liveInputProps || props.inputProps || plan?.inputProps || {};
  const fps = props.fps || DEFAULT_FPS;
  const durationInFrames = props.durationInFrames || Math.max(fps, secondsToFrames(plan?.durationSeconds || 30, fps));
  const effectiveRef = ref || props.playerRef;
  const CompositionComponent = COMPOSITION_COMPONENTS[compositionId];

  if (!CompositionComponent) {
    return <UnsupportedPreview compositionId={compositionId} />;
  }

  const isLandscape =
    compositionId === "FACELESS-VIDEO" ||
    compositionId === "facelessVideo" ||
    compositionId === "AI-VIDEO-GENERATOR" ||
    compositionId === "aiVideoGenerator";
  const compositionWidth = isLandscape ? 1920 : 1080;
  const compositionHeight = isLandscape ? 1080 : 1920;

  return (
    <Player
      ref={effectiveRef}
      component={CompositionComponent}
      inputProps={liveInputProps}
      durationInFrames={durationInFrames}
      compositionWidth={compositionWidth}
      compositionHeight={compositionHeight}
      fps={fps}
      style={{ width: "100%", height: "100%" }}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      renderLoading={() => (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
        </div>
      )}
    />
  );
});

function UnsupportedPreview({ compositionId }: { compositionId: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 p-6 text-center">
      <div className="mb-3 text-4xl">Preview</div>
      <p className="mb-1 text-sm font-semibold text-white">In-browser preview</p>
      <p className="text-xs text-zinc-500">
        Preview not available for <strong>{compositionId}</strong> yet. Your edits will still apply to the final render.
      </p>
    </div>
  );
}
