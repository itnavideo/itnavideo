import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DocumentaryLowerThirdProps {
  name?: string;
  title?: string;
  affiliation?: string;
  badge?: string; // e.g. "SPECIAL COUNSEL"
  accentColor?: string;
  className?: string;
}

export const DocumentaryLowerThird: React.FC<DocumentaryLowerThirdProps> = ({
  name = 'ELIZABETH VANCE',
  title = 'Chief Investigative Correspondent',
  affiliation = 'Global Security Review • Washington Bureau',
  badge = 'VERIFIED WITNESS',
  accentColor = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 85 },
  });

  const lineWidth = interpolate(frame, [0, 25], [0, 100], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={`relative inline-flex flex-col bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-md max-w-lg select-none ${className}`}
      style={{
        transform: `translateY(${interpolate(entry, [0, 1], [25, 0])}px)`,
        opacity: entry,
      }}
    >
      {/* Top Badge Strip */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor,
            border: `1px solid ${accentColor}40`,
          }}
        >
          {badge}
        </span>
      </div>

      {/* Primary Name Header */}
      <h3 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-zinc-100 uppercase">
        {name}
      </h3>

      {/* Animated Accent Divider Line */}
      <div
        className="h-[2px] my-2 transition-all"
        style={{
          width: `${lineWidth}%`,
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}`,
        }}
      />

      {/* Subtitles */}
      <p className="text-xs font-sans font-semibold text-zinc-300">{title}</p>
      <p className="text-[11px] font-sans text-zinc-500 mt-0.5">{affiliation}</p>
    </div>
  );
};
