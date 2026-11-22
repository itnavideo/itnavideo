import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TypewriterProps {
  text: string;
  speedMultiplier?: number;
  showCursor?: boolean;
  cursorChar?: string;
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speedMultiplier = 1.0,
  showCursor = true,
  cursorChar = '|',
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = (text.length / (15 * speedMultiplier)) * fps;
  const currentCharsCount = Math.floor(
    interpolate(frame - delayFrames, [0, totalFrames], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const displayedText = text.slice(0, currentCharsCount);
  const isTyping = currentCharsCount < text.length;

  return (
    <span style={{ fontFamily: 'inherit', ...style }}>
      {displayedText}
      {showCursor && (
        <span style={{ opacity: isTyping || Math.floor(frame / 15) % 2 === 0 ? 1 : 0, color: '#0066FF' }}>
          {cursorChar}
        </span>
      )}
    </span>
  );
};
