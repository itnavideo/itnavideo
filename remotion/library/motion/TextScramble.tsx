import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TextScrambleProps {
  finalText: string;
  durationFrames?: number;
  delayFrames?: number;
  characters?: string;
  style?: React.CSSProperties;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?';

export const TextScramble: React.FC<TextScrambleProps> = ({
  finalText,
  durationFrames = 25,
  delayFrames = 0,
  characters = DEFAULT_CHARS,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - delayFrames, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const revealedCount = Math.floor(progress * finalText.length);

  let output = '';
  for (let i = 0; i < finalText.length; i++) {
    if (i < revealedCount) {
      output += finalText[i];
    } else {
      // Deterministic pseudo-random character based on frame & index
      const charIndex = (frame * 7 + i * 13) % characters.length;
      output += characters[charIndex];
    }
  }

  return (
    <span style={{ fontFamily: 'JetBrains Mono, Menlo, monospace', ...style }}>
      {output}
    </span>
  );
};
