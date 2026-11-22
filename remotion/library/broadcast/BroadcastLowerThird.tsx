import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BroadcastLowerThirdProps {
  name?: string;
  title?: string;
  company?: string;
  themeColor?: string;
  className?: string;
}

export const BroadcastLowerThird: React.FC<BroadcastLowerThirdProps> = ({
  name = 'Dr. Sarah Mitchell, Ph.D.',
  title = 'Chief AI Research Scientist',
  company = 'DeepMind AI Robotics',
  themeColor = '#0284c7',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const barWidth = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 90 } });

  return (
    <div
      className={`p-4 flex items-center justify-start pointer-events-none ${className}`}
      style={{
        transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
        opacity: enter,
      }}
    >
      <div className="flex flex-col shadow-2xl relative">
        {/* Accent Color Edge Line */}
        <div
          className="h-1 rounded-t-sm"
          style={{
            width: `${barWidth * 100}%`,
            backgroundColor: themeColor,
            boxShadow: `0 0 10px ${themeColor}`,
          }}
        />

        {/* Primary Name Block */}
        <div className="bg-zinc-950/90 backdrop-blur-xl px-5 py-2.5 border-l-4 border-b border-white/10" style={{ borderColor: themeColor }}>
          <span className="text-white font-black text-base md:text-lg tracking-tight">
            {name}
          </span>
        </div>

        {/* Title & Credential Sub-block */}
        <div className="bg-zinc-900/95 backdrop-blur px-5 py-1.5 flex items-center gap-2 border-l-4 border-b border-white/5" style={{ borderColor: themeColor }}>
          <span className="text-zinc-300 font-semibold text-xs tracking-normal">{title}</span>
          <span className="text-zinc-500 text-xs">•</span>
          <span className="text-zinc-400 font-mono text-[11px]">{company}</span>
        </div>
      </div>
    </div>
  );
};
