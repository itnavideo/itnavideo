"use client";

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type KineticEmojiEvent,
  CONTEXTUAL_EMOJI_RULES,
  buildContextualEmojiEvents,
} from '../../../services/ai/contextualEmojiEngine';

export type { KineticEmojiEvent };
export { CONTEXTUAL_EMOJI_RULES, buildContextualEmojiEvents };

export interface KineticEmojiLayerProps {
  events?: KineticEmojiEvent[];
  words?: Array<{ word: string; start: number; end: number }>;
  transcript?: string;
  enabled?: boolean;
  position?: 'above-caption' | 'top-right' | 'top-left' | 'center';
}

export const KineticEmojiLayer: React.FC<KineticEmojiLayerProps> = ({
  events = [],
  words = [],
  enabled = true,
  position = 'above-caption',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  // Auto-generate contextual emoji events if not explicitly passed
  const activeEvents = React.useMemo(() => {
    if (!enabled) return [];
    if (events && events.length > 0) return events;
    return buildContextualEmojiEvents(words);
  }, [events, words, enabled]);

  // Find emoji event currently in its display window
  const currentEvent = activeEvents.find((ev) => {
    const dur = ev.durationSeconds ?? 1.4;
    return currentTimeSec >= ev.startSeconds && currentTimeSec < ev.startSeconds + dur;
  });

  if (!currentEvent) return null;

  const startFrame = Math.round(currentEvent.startSeconds * fps);
  const totalDurationFrames = Math.round((currentEvent.durationSeconds ?? 1.4) * fps);
  const framesSinceStart = Math.max(0, frame - startFrame);

  // ── Kinetic Spring & Overshoot Animation (MrBeast Pop Curve) ──
  // Entrance: spring 0 -> 1.25 -> 1.0 (Frames 0 to 10)
  const enterSpring = spring({
    frame: framesSinceStart,
    fps,
    config: {
      damping: 8,
      stiffness: 240,
      mass: 0.6,
    },
  });

  // Exit: Scale down & fade out during final 8 frames
  const exitFrames = 8;
  const exitStartFrame = totalDurationFrames - exitFrames;
  const exitScale = interpolate(
    framesSinceStart,
    [exitStartFrame, totalDurationFrames],
    [1.0, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const exitOpacity = interpolate(
    framesSinceStart,
    [exitStartFrame, totalDurationFrames],
    [1.0, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const finalScale = enterSpring * exitScale;

  // Kinetic Floating Wiggle (idle motion)
  const floatBob = Math.sin((framesSinceStart - 8) / 3.5) * 6;
  const wiggleRotate = Math.sin((framesSinceStart - 8) / 4) * 5;

  const glowColor = currentEvent.glowColor || 'rgba(255, 215, 0, 0.5)';

  // Positioning
  const effectivePosition = currentEvent.position || position;
  let posStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 330, // Directly above the subtitle strip, clear of bottom seek bar
    left: '50%',
    transform: `translateX(-50%) translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
    transformOrigin: 'center center',
  };

  if (effectivePosition === 'top-right') {
    posStyle = {
      position: 'absolute',
      top: 140,
      right: 110,
      transform: `translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
      transformOrigin: 'center center',
    };
  } else if (effectivePosition === 'top-left') {
    posStyle = {
      position: 'absolute',
      top: 140,
      left: 110,
      transform: `translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
      transformOrigin: 'center center',
    };
  } else if (effectivePosition === 'center') {
    posStyle = {
      position: 'absolute',
      top: '46%',
      left: '50%',
      transform: `translate(-50%, -50%) translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
      transformOrigin: 'center center',
    };
  }

  return (
    <div
      style={{
        ...posStyle,
        zIndex: 38,
        opacity: exitOpacity,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: '92px',
          lineHeight: 1,
          fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
          filter: `drop-shadow(0 16px 32px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 28px ${glowColor})`,
          userSelect: 'none',
        }}
      >
        {currentEvent.emoji}
      </div>
    </div>
  );
};

