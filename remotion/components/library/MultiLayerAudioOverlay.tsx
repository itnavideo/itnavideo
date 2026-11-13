import React, { memo, useMemo } from 'react';
import {
  Audio,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { safeResolveMediaSrc } from '../../utils/safeMedia';

// =========================================================================
// 1. DYNAMIC AUDIO LAYER DATA SCHEMA (Unlimited Multi-Track Audio Engine)
// =========================================================================

export type AudioTrackType =
  | 'voiceover'
  | 'music'
  | 'ambient'
  | 'sfx'
  | 'impact'
  | 'transition'
  | 'chime'
  | 'foley';

export interface DynamicAudioLayer {
  id: string;
  src: string;
  type?: AudioTrackType;
  startSeconds?: number;
  durationSeconds?: number;
  volume?: number;           // 0.0 to 1.0 (default 1.0 for sfx/voiceover, 0.12 for music)
  fadeInSeconds?: number;    // Fade in duration
  fadeOutSeconds?: number;   // Fade out duration
  loop?: boolean;
  duckOnSpeech?: boolean;    // When true, automatically ducks volume during active voiceover
  duckedVolume?: number;     // e.g. 0.08
  startFromSeconds?: number; // Audio trim start offset
}

export interface MultiLayerAudioOverlayProps {
  layers?: DynamicAudioLayer[];
  speechActiveIntervals?: Array<{ start: number; end: number }>;
}

// =========================================================================
// 2. SINGLE AUDIO TRACK VIEW WITH FADE ENVELOPE & DUCKING
// =========================================================================

const SingleAudioTrackView = memo(({
  layer,
  totalFrames,
  speechIntervals,
}: {
  layer: DynamicAudioLayer;
  totalFrames: number;
  speechIntervals: Array<{ start: number; end: number }>;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSeconds = (layer.startSeconds ?? 0) + frame / fps;
  const baseVolume = layer.volume ?? (layer.type === 'music' ? 0.12 : layer.type === 'ambient' ? 0.08 : 1.0);

  // 1. Fade In Envelope
  const fadeInFrames = Math.max(0, Math.round((layer.fadeInSeconds ?? (layer.type === 'music' ? 1.0 : 0)) * fps));
  let fadeInMultiplier = 1.0;
  if (fadeInFrames > 0 && frame < fadeInFrames) {
    fadeInMultiplier = interpolate(frame, [0, fadeInFrames], [0, 1], { extrapolateRight: 'clamp' });
  }

  // 2. Fade Out Envelope
  const fadeOutFrames = Math.max(0, Math.round((layer.fadeOutSeconds ?? (layer.type === 'music' ? 1.5 : 0)) * fps));
  let fadeOutMultiplier = 1.0;
  if (fadeOutFrames > 0 && frame > totalFrames - fadeOutFrames) {
    fadeOutMultiplier = interpolate(frame, [totalFrames - fadeOutFrames, totalFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // 3. Dynamic Auto-Ducking on Active Spoken Speech
  let duckMultiplier = 1.0;
  if (layer.duckOnSpeech && speechIntervals.length > 0) {
    const isSpeechActive = speechIntervals.some(
      (int) => currentSeconds >= int.start && currentSeconds <= int.end
    );
    const duckFloor = (layer.duckedVolume ?? 0.08) / Math.max(0.01, baseVolume);
    duckMultiplier = isSpeechActive ? Math.min(1.0, duckFloor) : 1.0;
  }

  const finalVolume = Math.max(0, Math.min(1.0, baseVolume * fadeInMultiplier * fadeOutMultiplier * duckMultiplier));
  const resolvedSrc = safeResolveMediaSrc(layer.src);

  if (!resolvedSrc) return null;

  return (
    <Audio
      src={resolvedSrc}
      volume={finalVolume}
      loop={layer.loop ?? (layer.type === 'music' || layer.type === 'ambient')}
      startFrom={Math.round((layer.startFromSeconds ?? 0) * fps)}
    />
  );
});
SingleAudioTrackView.displayName = 'SingleAudioTrackView';

// =========================================================================
// 3. MULTI-LAYER AUDIO OVERLAY (Professional Multi-Track Timeline)
// =========================================================================

export const MultiLayerAudioOverlay: React.FC<MultiLayerAudioOverlayProps> = memo(({
  layers = [],
  speechActiveIntervals = [],
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  if (!layers || layers.length === 0) return null;

  return (
    <>
      {layers.map((layer) => {
        const startSec = Math.max(0, layer.startSeconds ?? 0);
        const fromFrame = Math.round(startSec * fps);
        const durSec = layer.durationSeconds;
        const totalTrackFrames = durSec
          ? Math.max(1, Math.round(durSec * fps))
          : Math.max(1, durationInFrames - fromFrame);

        // Clamp within composition bounds
        if (fromFrame >= durationInFrames) return null;

        return (
          <Sequence
            key={layer.id}
            name={`audio-track-${layer.type ?? 'sfx'}-${layer.id}`}
            from={fromFrame}
            durationInFrames={Math.min(totalTrackFrames, durationInFrames - fromFrame)}
          >
            <SingleAudioTrackView
              layer={layer}
              totalFrames={totalTrackFrames}
              speechIntervals={speechActiveIntervals}
            />
          </Sequence>
        );
      })}
    </>
  );
});
MultiLayerAudioOverlay.displayName = 'MultiLayerAudioOverlay';

