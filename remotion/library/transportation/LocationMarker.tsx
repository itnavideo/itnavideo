import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface LocationMarkerProps {
  label?: string;
  subLabel?: string;
  color?: string;
  pulsingRipple?: boolean;
  className?: string;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  label = 'MISSION CONTROL HQ',
  subLabel = '37°46\'29"N 122°25\'10"W',
  color = '#ef4444',
  pulsingRipple = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 90 },
  });

  const rippleScale = 1 + (Math.sin(frame * 0.2) + 1) * 0.6;
  const rippleOpacity = Math.max(0, 1 - (rippleScale - 1) * 0.8);

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={{ transform: `scale(${entry})` }}
    >
      {/* Pulsing Target Waves */}
      {pulsingRipple && (
        <div
          className="absolute -top-3 w-12 h-12 rounded-full pointer-events-none"
          style={{
            border: `2px solid ${color}`,
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
          }}
        />
      )}

      {/* Pin Icon Node */}
      <div
        className="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black z-20"
        style={{ backgroundColor: color }}
      >
        📍
      </div>

      {/* Label Badge */}
      <div className="mt-2 bg-zinc-950/90 border border-zinc-700 px-3 py-1.5 rounded-lg shadow-xl text-center whitespace-nowrap z-20">
        <div className="text-xs font-serif font-black text-zinc-100 uppercase">{label}</div>
        <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{subLabel}</div>
      </div>
    </div>
  );
};
