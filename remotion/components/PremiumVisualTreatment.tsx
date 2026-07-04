import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type PremiumVisualStyleLock = {
  colorGrade?: {
    filter?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    grainOpacity?: number;
    vignetteOpacity?: number;
  };
  camera?: {
    kenBurnsIntensity?: number;
    shakeIntensity?: number;
    motionBlur?: number;
  };
  pacing?: {
    patternInterruptEverySeconds?: number;
    patternInterruptIntensity?: number;
  };
  energyCurve?: {
    hook?: number;
    body?: number;
    close?: number;
  };
  depth?: {
    foregroundOpacity?: number;
    backgroundBlur?: number;
  };
};

type PremiumVisualTreatmentProps = {
  styleLock?: PremiumVisualStyleLock;
  enabled?: boolean;
  includeLightSweep?: boolean;
};

export const getPremiumMediaStyle = (
  styleLock?: PremiumVisualStyleLock,
  frame = 0,
  durationInFrames = 1800,
): React.CSSProperties => {
  const camera = styleLock?.camera;
  const intensity = Math.max(0, Math.min(0.05, Number(camera?.kenBurnsIntensity) || 0));
  const shake = Math.max(0, Math.min(0.5, Number(camera?.shakeIntensity) || 0));
  const blur = Math.max(0, Math.min(1.2, Number(camera?.motionBlur) || 0));
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const energy = getEnergyAtProgress(styleLock?.energyCurve, progress);
  const interruptPulse = getPatternInterruptPulse(styleLock, frame);
  const shakeX = Math.sin(frame * 0.7) * shake;
  const shakeY = Math.cos(frame * 0.53) * shake;
  const scale = 1 + intensity * progress * (0.78 + energy * 0.22) + interruptPulse * 0.012;

  return {
    filter: [styleLock?.colorGrade?.filter || '', blur ? `blur(${blur * (0.08 + interruptPulse * 0.08)}px)` : ''].filter(Boolean).join(' '),
    transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
    transformOrigin: 'center center',
  };
};

export const PremiumVisualTreatment: React.FC<PremiumVisualTreatmentProps> = ({
  styleLock,
  enabled = true,
  includeLightSweep = false,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  if (!enabled) return null;

  const grade = styleLock?.colorGrade;
  const overlayColor = grade?.overlayColor || '#0F172A';
  const overlayOpacity = Math.max(0, Math.min(0.24, Number(grade?.overlayOpacity) || 0));
  const grainOpacity = Math.max(0, Math.min(0.08, Number(grade?.grainOpacity) || 0));
  const vignetteOpacity = Math.max(0, Math.min(0.34, Number(grade?.vignetteOpacity) || 0.16));
  const foregroundOpacity = Math.max(0, Math.min(0.12, Number(styleLock?.depth?.foregroundOpacity) || 0));
  const interruptPulse = getPatternInterruptPulse(styleLock, frame);
  const sweepX = interpolate(frame, [0, Math.max(1, durationInFrames)], [-35, 135], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 40}}>
      {overlayOpacity ? (
        <AbsoluteFill style={{background: overlayColor, opacity: overlayOpacity, mixBlendMode: 'soft-light'}} />
      ) : null}
      {vignetteOpacity ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 32%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
          }}
        />
      ) : null}
      {grainOpacity ? (
        <AbsoluteFill
          style={{
            opacity: grainOpacity,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.7) 0.7px, transparent 0.7px), radial-gradient(rgba(0,0,0,0.45) 0.7px, transparent 0.7px)',
            backgroundPosition: `${frame % 4}px ${frame % 3}px, ${(frame + 2) % 5}px ${(frame + 1) % 4}px`,
            backgroundSize: '5px 5px, 7px 7px',
            mixBlendMode: 'overlay',
          }}
        />
      ) : null}
      {foregroundOpacity ? (
        <AbsoluteFill
          style={{
            opacity: foregroundOpacity,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 22%, transparent 78%, rgba(255,255,255,0.08) 100%)',
            mixBlendMode: 'soft-light',
          }}
        />
      ) : null}
      {includeLightSweep ? (
        <AbsoluteFill
          style={{
            opacity: 0.14 + interruptPulse * 0.16,
            background: `linear-gradient(105deg, transparent ${sweepX - 10}%, rgba(255,255,255,0.22) ${sweepX}%, transparent ${sweepX + 10}%)`,
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
      {interruptPulse ? (
        <AbsoluteFill
          style={{
            opacity: interruptPulse * 0.12,
            background:
              'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 28%, transparent 62%)',
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

function getEnergyAtProgress(
  curve: PremiumVisualStyleLock['energyCurve'],
  progress: number,
) {
  const hook = clamp01(Number(curve?.hook) || 0.72);
  const body = clamp01(Number(curve?.body) || 0.48);
  const close = clamp01(Number(curve?.close) || 0.78);
  if (progress < 0.18) return interpolate(progress, [0, 0.18], [hook, body], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (progress > 0.78) return interpolate(progress, [0.78, 1], [body, close], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return body;
}

function getPatternInterruptPulse(styleLock: PremiumVisualStyleLock | undefined, frame: number) {
  const everySeconds = Math.max(0, Number(styleLock?.pacing?.patternInterruptEverySeconds) || 0);
  if (!everySeconds) return 0;
  const assumedFps = 30;
  const intervalFrames = Math.max(1, Math.round(everySeconds * assumedFps));
  const intervalIndex = Math.floor(frame / intervalFrames);
  if (intervalIndex < 1) return 0;
  const localFrame = frame - intervalIndex * intervalFrames;
  const pulseFrames = Math.max(4, Math.round(assumedFps * 0.18));
  const rawPulse = Math.max(0, 1 - localFrame / pulseFrames);
  const intensity = Math.max(0.2, Math.min(1, Number(styleLock?.pacing?.patternInterruptIntensity) || 0.45));
  return rawPulse * intensity;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
