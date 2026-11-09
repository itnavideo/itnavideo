import React, { memo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// =========================================================================
// 1. VIRTUAL CAMERA & KINETIC MOTION SCHEMA
// =========================================================================

export type CameraMovementType =
  | 'none'
  | 'handheld-subtle'
  | 'handheld-intense'
  | 'ken-burns-in'
  | 'ken-burns-out'
  | 'pan-left-to-right'
  | 'pan-right-to-left';

export interface CameraPunchEvent {
  startSeconds: number;
  durationSeconds?: number; // Default 0.6s
  scaleBoost?: number;      // e.g. 1.15
  shakeIntensity?: number;  // e.g. 1.2
}

export interface VirtualCameraConfig {
  movement?: CameraMovementType;
  baseScale?: number;         // Default 1.05 (gives padding so camera shake never exposes canvas edges)
  shakeIntensity?: number;    // 0.0 to 2.0 (default 1.0)
  enablePunches?: boolean;
  punchEvents?: CameraPunchEvent[];
}

// =========================================================================
// 2. VIRTUAL CAMERA STAGE WRAPPER
// =========================================================================

export const VirtualCameraLayer: React.FC<{
  config?: VirtualCameraConfig;
  children: React.ReactNode;
}> = memo(({ config = {}, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const movement = config.movement ?? 'handheld-subtle';
  const baseScale = config.baseScale ?? 1.05;
  const shakeIntensity = config.shakeIntensity ?? 1.0;

  // ── 1. Base Continuous Movement (Handheld / Ken Burns) ──
  let continuousScale = 1.0;
  let continuousTx = 0;
  let continuousTy = 0;
  let continuousRot = 0;

  if (movement === 'handheld-subtle' && shakeIntensity > 0) {
    const t = frame / fps;
    continuousTx = (Math.sin(t * 1.7) * 3.5 + Math.cos(t * 3.1) * 2.0) * shakeIntensity;
    continuousTy = (Math.cos(t * 1.9) * 4.0 + Math.sin(t * 2.8) * 2.2) * shakeIntensity;
    continuousRot = (Math.sin(t * 1.2) * 0.4) * shakeIntensity;
  } else if (movement === 'handheld-intense' && shakeIntensity > 0) {
    const t = frame / fps;
    continuousTx = (Math.sin(t * 3.5) * 8.0 + Math.cos(t * 6.2) * 4.5) * shakeIntensity;
    continuousTy = (Math.cos(t * 3.8) * 8.5 + Math.sin(t * 5.4) * 4.0) * shakeIntensity;
    continuousRot = (Math.sin(t * 2.4) * 1.0) * shakeIntensity;
  } else if (movement === 'ken-burns-in') {
    continuousScale = interpolate(frame, [0, durationInFrames], [1.0, 1.12], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (movement === 'ken-burns-out') {
    continuousScale = interpolate(frame, [0, durationInFrames], [1.12, 1.0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (movement === 'pan-left-to-right') {
    continuousTx = interpolate(frame, [0, durationInFrames], [-25, 25], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (movement === 'pan-right-to-left') {
    continuousTx = interpolate(frame, [0, durationInFrames], [25, -25], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // ── 2. Dynamic Kinetic Zoom Punch Events ──
  let punchScaleMultiplier = 1.0;
  let punchShakeX = 0;
  let punchShakeY = 0;

  if (config.enablePunches && config.punchEvents && config.punchEvents.length > 0) {
    for (const punch of config.punchEvents) {
      const punchStartFrame = Math.round(punch.startSeconds * fps);
      const punchDurFrames = Math.max(1, Math.round((punch.durationSeconds ?? 0.6) * fps));
      const punchScaleBoost = (punch.scaleBoost ?? 1.15) - 1.0;

      if (frame >= punchStartFrame && frame <= punchStartFrame + punchDurFrames) {
        const localFrame = frame - punchStartFrame;
        // High-energy spring pop into punch, then natural return
        const punchProgress = spring({
          frame: localFrame,
          fps,
          config: { damping: 10, stiffness: 220, mass: 0.5 },
        });

        // Decay envelope back to 1.0
        const decay = interpolate(localFrame, [0, punchDurFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: (t) => t * t,
        });

        punchScaleMultiplier += punchScaleBoost * punchProgress * decay;

        // Extra dynamic impact shake
        const pIntensity = punch.shakeIntensity ?? 1.2;
        punchShakeX += (Math.sin(localFrame * 1.8) * 6) * decay * pIntensity;
        punchShakeY += (Math.cos(localFrame * 2.1) * 6) * decay * pIntensity;
      }
    }
  }

  // ── 3. Combined GPU 3D Camera Matrix ──
  const finalScale = baseScale * continuousScale * punchScaleMultiplier;
  const finalX = continuousTx + punchShakeX;
  const finalY = continuousTy + punchShakeY;
  const finalRot = continuousRot;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '50% 45%',
          // GPU composite layer (Hardware accelerated, zero DOM reflows)
          transform: `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) scale(${finalScale.toFixed(4)}) rotate(${finalRot.toFixed(2)}deg)`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
});

