// remotion/components/MotionCaptionRenderer.tsx
// Professional Deterministic Motion Caption Engine for Remotion

import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { CaptionEvent, CaptionWordEvent } from '../../lib/captions/types';

interface MotionCaptionRendererProps {
  captionEvents: CaptionEvent[];
  currentTimeSec?: number;
}

export const MotionCaptionRenderer: React.FC<MotionCaptionRendererProps> = ({
  captionEvents,
  currentTimeSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = currentTimeSec ?? frame / fps;

  // Find active caption event
  const activeEvent = captionEvents.find(
    (ev) => currentSec >= ev.start && currentSec < ev.end
  );

  if (!activeEvent) {
    return null;
  }

  // Calculate local frame timings
  const startFrame = Math.round(activeEvent.start * fps);
  const endFrame = Math.round(activeEvent.end * fps);
  const localFrame = frame - startFrame;
  const framesUntilEnd = endFrame - frame;

  const { motion, typography, effects, layout } = activeEvent;

  // ─── 1. PHRASE ENTRANCE ANIMATION (Parametric Spring) ──────────────────────
  const entrySpring = spring({
    frame: Math.max(0, localFrame),
    fps,
    config: {
      mass: motion.mass,
      damping: motion.damping,
      stiffness: motion.stiffness,
    },
    from: 0,
    to: 1,
  });

  const entryScale = interpolate(
    entrySpring,
    [0, 1],
    [motion.scaleEntrance[0], motion.scaleEntrance[1]]
  );

  const entryTranslateY = interpolate(
    entrySpring,
    [0, 1],
    [motion.translateYEntrancePx[0], motion.translateYEntrancePx[1]]
  );

  const entryBlur = interpolate(
    entrySpring,
    [0, 1],
    [motion.blurEntrancePx[0], motion.blurEntrancePx[1]],
    { extrapolateRight: 'clamp' }
  );

  const entryOpacity = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ─── 2. PHRASE EXIT ANIMATION ──────────────────────────────────────────────
  let exitOpacity = 1;
  let exitTranslateY = 0;
  let exitScale = 1;

  if (motion.exitStyle !== 'none' && framesUntilEnd <= motion.exitDurationFrames) {
    const exitProgress = Math.max(0, 1 - framesUntilEnd / motion.exitDurationFrames);
    if (motion.exitStyle === 'whip-up') {
      exitTranslateY = -exitProgress * 24;
      exitOpacity = 1 - exitProgress;
    } else if (motion.exitStyle === 'scale-down') {
      exitScale = 1 - exitProgress * 0.15;
      exitOpacity = 1 - exitProgress;
    } else if (motion.exitStyle === 'fade-out') {
      exitOpacity = 1 - exitProgress;
    }
  }

  // Glitch jitter offset for cyber styles
  let glitchX = 0;
  let glitchY = 0;
  if (motion.glitchJitter && localFrame < 6) {
    glitchX = (localFrame % 2 === 0 ? 3 : -3) * (1 - localFrame / 6);
    glitchY = (localFrame % 3 === 0 ? -2 : 2) * (1 - localFrame / 6);
  }

  const finalScale = entryScale * exitScale;
  const finalTranslateY = entryTranslateY + exitTranslateY;
  const finalOpacity = entryOpacity * exitOpacity;

  // ─── 3. ACTIVE WORD INDEX & TIMINGS ────────────────────────────────────────
  const activeWordIndex = activeEvent.words.findIndex(
    (w) => currentSec >= w.start && currentSec < w.end
  );

  // Style-specific container wrapper
  const isCardBadge = Boolean(
    effects.containerBackground || effects.containerBackdropBlurPx
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: `${layout.verticalOffsetPct}%`,
        transform: 'translateY(-50%)',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: layout.maxLineWidthPx,
          padding: effects.badgePadding || '8px 16px',
          backgroundColor: effects.containerBackground || 'transparent',
          border: effects.containerBorder || 'none',
          borderRadius: effects.badgeRadiusPx || 0,
          backdropFilter: effects.containerBackdropBlurPx
            ? `blur(${effects.containerBackdropBlurPx}px)`
            : undefined,
          WebkitBackdropFilter: effects.containerBackdropBlurPx
            ? `blur(${effects.containerBackdropBlurPx}px)`
            : undefined,
          transform: `scale(${finalScale}) translateY(${finalTranslateY}px) translate(${glitchX}px, ${glitchY}px) rotate(${
            effects.containerTiltDeg || 0
          }deg)`,
          transformOrigin: 'center center',
          opacity: finalOpacity,
          filter: entryBlur > 0.5 ? `blur(${entryBlur}px)` : undefined,
          transition: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: typography.heroSizePx * 0.22,
            rowGap: typography.heroSizePx * 0.12,
            textAlign: layout.textAlign,
            lineHeight: typography.lineHeight,
          }}
        >
          {activeEvent.words.map((w: CaptionWordEvent, idx: number) => {
            const isActive = idx === activeWordIndex;
            const isHero = w.role === 'hero';

            // Word-level local spring pulse
            const wordStartFrame = Math.round(w.start * fps);
            const wordLocalFrame = Math.max(0, frame - wordStartFrame);

            const wordScaleSpring = isActive
              ? spring({
                  frame: wordLocalFrame,
                  fps,
                  config: { mass: 0.3, damping: 10, stiffness: 350 },
                  from: 0.88,
                  to: 1.0,
                })
              : 1.0;

            const wordScale = isActive ? wordScaleSpring * (isHero ? 1.08 : 1.04) : 1.0;

            // Karaoke fill progress calculation
            let fillProgress = 0;
            if (effects.stylePreset === 'karaoke-pro') {
              if (idx < activeWordIndex) {
                fillProgress = 1;
              } else if (isActive && w.end > w.start) {
                fillProgress = Math.min(
                  1,
                  Math.max(0, (currentSec - w.start) / (w.end - w.start))
                );
              }
            }

            // Typography sizing
            const fontSize = isHero ? typography.heroSizePx : typography.leadSizePx;
            const fontFamily = isHero ? typography.heroFont : typography.leadFont;
            const fontWeight = isHero ? typography.heroWeight : typography.leadWeight;

            // Colors
            const baseColor = isActive ? effects.highlightColor : effects.textColor;
            const activeColor = effects.highlightColor;

            return (
              <span
                key={w.id || `${w.word}-${idx}`}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  fontFamily,
                  fontSize,
                  fontWeight,
                  color: baseColor,
                  letterSpacing: `${typography.letterSpacingEm}em`,
                  textTransform: typography.textTransform,
                  textShadow: effects.textShadow,
                  WebkitTextStroke: effects.textStroke,
                  paintOrder: 'stroke fill',
                  transform: `scale(${wordScale})`,
                  transformOrigin: 'center center',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {/* Marker highlight background effect */}
                {effects.stylePreset === 'marker-highlight' && isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: -4,
                      right: -4,
                      bottom: 4,
                      height: '52%',
                      backgroundColor: effects.highlightColor,
                      opacity: 0.88,
                      borderRadius: 6,
                      transform: 'rotate(-1.2deg)',
                      zIndex: -1,
                    }}
                  />
                )}

                {/* Karaoke gradient fill layer */}
                {effects.stylePreset === 'karaoke-pro' ? (
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                    <span style={{ opacity: 0.32 }}>{w.word}</span>
                    {fillProgress > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          color: activeColor,
                          clipPath: `inset(0 ${(1 - fillProgress) * 100}% 0 0)`,
                          textShadow: `0 0 16px ${activeColor}99`,
                        }}
                      >
                        {w.word}
                      </span>
                    )}
                  </span>
                ) : (
                  w.word
                )}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
