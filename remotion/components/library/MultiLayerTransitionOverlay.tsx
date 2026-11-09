import React, { memo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// =========================================================================
// 1. TRANSITION LAYER SCHEMA
// =========================================================================

export type TransitionType =
  | 'whip-pan-left'
  | 'whip-pan-right'
  | 'whip-pan-up'
  | 'zoom-snap'
  | 'glitch-cut'
  | 'white-flash'
  | 'fade-black';

export interface DynamicTransitionEvent {
  id: string;
  type: TransitionType;
  triggerSeconds: number;     // Center of transition
  durationSeconds?: number;   // Total duration (typically 0.2s to 0.4s)
  color?: string;
  zIndex?: number;
}

// =========================================================================
// 2. INDIVIDUAL TRANSITION RENDERERS
// =========================================================================

const WhipPanTransition = memo(({ progress, direction }: { progress: number; direction: 'left' | 'right' | 'up' }) => {
  // progress goes 0 -> 0.5 (exit) -> 1.0 (enter)
  const isExit = progress < 0.5;
  const t = isExit ? progress * 2 : (progress - 0.5) * 2;
  const blurPx = Math.sin(progress * Math.PI) * 16;
  const sign = direction === 'left' ? -1 : 1;

  let tx = 0;
  let ty = 0;
  if (direction === 'up') {
    ty = isExit ? interpolate(t, [0, 1], [0, -100]) : interpolate(t, [0, 1], [100, 0]);
  } else {
    tx = isExit ? interpolate(t, [0, 1], [0, sign * 100]) : interpolate(t, [0, 1], [-sign * 100, 0]);
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backdropFilter: blurPx > 1 ? `blur(${blurPx}px)` : undefined,
        WebkitBackdropFilter: blurPx > 1 ? `blur(${blurPx}px)` : undefined,
        background: `linear-gradient(${direction === 'up' ? '180deg' : '90deg'}, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)`,
        opacity: Math.sin(progress * Math.PI) * 0.8,
        transform: `translate3d(${tx}%, ${ty}%, 0)`,
      }}
    />
  );
});

const GlitchCutTransition = memo(({ frame, progress }: { frame: number; progress: number }) => {
  const intensity = Math.sin(progress * Math.PI);
  const rgbShift = Math.sin(frame * 7) * 18 * intensity;
  const bandY = ((frame * 23) % 100);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: intensity,
        mixBlendMode: 'screen',
      }}
    >
      {/* Glitch chromatic split */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset ${rgbShift}px 0 0 rgba(255, 0, 50, 0.7), inset ${-rgbShift}px 0 0 rgba(0, 230, 255, 0.7)`,
        }}
      />
      {/* Glitch horizontal scanline band */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${bandY}%`,
          height: '14%',
          backgroundColor: 'rgba(255, 255, 255, 0.35)',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
});

const FlashTransition = memo(({ progress, color = '#FFFFFF' }: { progress: number; color?: string }) => {
  // Fast flash: rises to 1.0 at center, then quickly fades out
  const opacity = interpolate(progress, [0, 0.35, 1], [0, 0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: color,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
});

const FadeBlackTransition = memo(({ progress }: { progress: number }) => {
  // Dip to black: 0 -> 1 -> 0
  const opacity = Math.sin(progress * Math.PI);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
});

const ZoomSnapTransition = memo(({ progress }: { progress: number }) => {
  const intensity = Math.sin(progress * Math.PI);
  const blurPx = intensity * 14;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: intensity * 0.7,
        backdropFilter: blurPx > 1 ? `blur(${blurPx}px)` : undefined,
        WebkitBackdropFilter: blurPx > 1 ? `blur(${blurPx}px)` : undefined,
        background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.7) 100%)',
      }}
    />
  );
});

// =========================================================================
// 3. SINGLE TIME-WINDOWED TRANSITION VIEW
// =========================================================================

const SingleTransitionView = memo(({ event }: { event: DynamicTransitionEvent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const durSec = event.durationSeconds ?? 0.3;
  const durationFrames = Math.max(1, Math.round(durSec * fps));
  const progress = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  switch (event.type) {
    case 'whip-pan-left':
      return <WhipPanTransition progress={progress} direction="left" />;
    case 'whip-pan-right':
      return <WhipPanTransition progress={progress} direction="right" />;
    case 'whip-pan-up':
      return <WhipPanTransition progress={progress} direction="up" />;
    case 'glitch-cut':
      return <GlitchCutTransition frame={frame} progress={progress} />;
    case 'white-flash':
      return <FlashTransition progress={progress} color={event.color ?? '#FFFFFF'} />;
    case 'fade-black':
      return <FadeBlackTransition progress={progress} />;
    case 'zoom-snap':
      return <ZoomSnapTransition progress={progress} />;
    default:
      return null;
  }
});

// =========================================================================
// 4. MAIN MULTI-LAYER TRANSITION OVERLAY STAGE
// =========================================================================

export interface MultiLayerTransitionOverlayProps {
  transitions?: DynamicTransitionEvent[];
}

export const MultiLayerTransitionOverlay: React.FC<MultiLayerTransitionOverlayProps> = ({ transitions = [] }) => {
  const { fps } = useVideoConfig();

  if (!transitions || transitions.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {transitions.map((event) => {
        const durSec = event.durationSeconds ?? 0.3;
        const halfDur = durSec / 2;
        const fromFrame = Math.max(0, Math.round((event.triggerSeconds - halfDur) * fps));
        const durationInFrames = Math.max(1, Math.round(durSec * fps));

        return (
          <Sequence
            key={event.id}
            name={`transition-${event.type}-${event.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleTransitionView event={event} />
          </Sequence>
        );
      })}
    </div>
  );
};

