import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { getProgressBarPreset } from '../../../services/templates/templateLibrary';

export interface UniversalProgressBarProps {
  progressBarId?: string;
  totalDurationInSeconds?: number;
}

export const UniversalProgressBar: React.FC<UniversalProgressBarProps> = ({
  progressBarId = 'bottom-neon-bar',
  totalDurationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalFrames = totalDurationInSeconds ? Math.floor(totalDurationInSeconds * fps) : durationInFrames;
  const progressPercent = Math.min(100, Math.max(0, (frame / totalFrames) * 100));

  const preset = getProgressBarPreset(progressBarId);

  const isTop = preset.position === 'top';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [isTop ? 'top' : 'bottom']: 0,
        height: preset.height,
        backgroundColor: preset.backgroundColor,
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: `${progressPercent}%`,
          height: '100%',
          backgroundColor: preset.barColor,
          boxShadow: preset.glow ? `0 0 12px ${preset.barColor}` : 'none',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
};
