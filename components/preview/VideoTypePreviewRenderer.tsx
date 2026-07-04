"use client";

import { forwardRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Loader2 } from "lucide-react";

import { AutoCaptionReel } from "@/remotion/templates/AUTO_CAPTION_REEL/template";
import { CompareExplainer } from "@/remotion/templates/COMPARE_EXPLAINER/template";
import { DynamicCreatorReel } from "@/remotion/templates/DYNAMIC_CREATOR_REEL/template";

type Props = {
  compositionId: string;
  inputProps: Record<string, unknown>;
  durationInFrames: number;
  fps: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPOSITION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "AUTO-CAPTION-REEL": AutoCaptionReel,
  comparisonImages: CompareExplainer,
  "DYNAMIC-CREATOR-REEL": DynamicCreatorReel,
};

export const VideoTypePreviewRenderer = forwardRef<PlayerRef, Props>(function VideoTypePreviewRenderer(
  { compositionId, inputProps, durationInFrames, fps },
  ref,
) {
  const CompositionComponent = COMPOSITION_COMPONENTS[compositionId];

  if (!CompositionComponent) {
    return <UnsupportedPreview compositionId={compositionId} />;
  }

  return (
    <Player
      ref={ref}
      component={CompositionComponent}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={fps}
      style={{ width: "100%", height: "100%" }}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      renderLoading={() => (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Loader2 className="animate-spin text-blue-400" size={32} />
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
