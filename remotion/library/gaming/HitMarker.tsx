import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HitMarkerProps {
  isCritical?: boolean;
  damage?: number;
  triggerFrame?: number;
  className?: string;
}

export const HitMarker: React.FC<HitMarkerProps> = ({
  isCritical = true,
  damage = 185,
  triggerFrame = 15,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 10, stiffness: 220 },
  });

  const opacity = interpolate(frame - triggerFrame, [0, 8, 25], [0, 1, 0]);
  const markerColor = isCritical ? '#ef4444' : '#ffffff';

  return (
    <div
      className={`relative flex items-center justify-center w-24 h-24 pointer-events-none font-mono font-black ${className}`}
      style={{
        transform: `scale(${interpolate(progress, [0, 0.4, 1], [0.6, 1.25, 1])})`,
        opacity,
      }}
    >
      {/* 4 Diagonal Crosshair Hit Ticks */}
      <svg className="w-12 h-12 stroke-[3]" viewBox="0 0 40 40" stroke={markerColor} strokeLinecap="round">
        {/* Top-Left */}
        <line x1="12" y1="12" x2="16" y2="16" />
        {/* Top-Right */}
        <line x1="28" y1="12" x2="24" y2="16" />
        {/* Bottom-Left */}
        <line x1="12" y1="28" x2="16" y2="24" />
        {/* Bottom-Right */}
        <line x1="28" y1="28" x2="24" y2="24" />
      </svg>

      {/* Floating Damage Number */}
      <div
        className="absolute -top-3 text-sm font-black drop-shadow-md"
        style={{ color: markerColor }}
      >
        {damage}
      </div>
    </div>
  );
};
