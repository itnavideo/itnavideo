import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SunburstSegment {
  name: string;
  value: number;
  color: string;
}

export interface SunburstChartProps {
  title?: string;
  centerLabel?: string;
  segments?: SunburstSegment[];
  className?: string;
}

const DEFAULT_SEGMENTS: SunburstSegment[] = [
  { name: 'YouTube Shorts', value: 35, color: '#ef4444' },
  { name: 'Instagram Reels', value: 30, color: '#ec4899' },
  { name: 'TikTok Viral', value: 20, color: '#00f0ff' },
  { name: 'LinkedIn Video', value: 15, color: '#3b82f6' },
];

export const SunburstChart: React.FC<SunburstChartProps> = ({
  title = 'MULTI-TIER SUNBURST DISTRIBUTION',
  centerLabel = 'TOTAL CHANNELS',
  segments = DEFAULT_SEGMENTS,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const rotate = interpolate(frame, [0, fps * 15], [0, 360]);

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="text-center border-b border-zinc-800 pb-3 mb-6">
        <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold mb-1">
          CONCENTRIC RADIAL SUNBURST
        </div>
        <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
          {title}
        </h3>
      </div>

      {/* SVG Concentric Ring Segments */}
      <div className="relative w-full h-[320px] flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full max-w-sm overflow-visible">
          {/* Outer Sunburst Tier */}
          <g transform="translate(200, 200)">
            {segments.map((seg, i) => {
              const startAngle = (i * 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * 90 - 4) * (Math.PI / 180);
              const rInner = 100;
              const rOuter = 160;

              const x1 = Math.cos(startAngle) * rInner;
              const y1 = Math.sin(startAngle) * rInner;
              const x2 = Math.cos(startAngle) * rOuter;
              const y2 = Math.sin(startAngle) * rOuter;
              const x3 = Math.cos(endAngle) * rOuter;
              const y3 = Math.sin(endAngle) * rOuter;
              const x4 = Math.cos(endAngle) * rInner;
              const y4 = Math.sin(endAngle) * rInner;

              const d = `M ${x1} ${y1} L ${x2} ${y2} A ${rOuter} ${rOuter} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rInner} ${rInner} 0 0 0 ${x1} ${y1} Z`;

              return (
                <path
                  key={i}
                  d={d}
                  fill={seg.color}
                  opacity="0.85"
                  className="transition-all hover:opacity-100"
                />
              );
            })}

            {/* Inner Core Circle */}
            <circle r="70" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            <text y="-8" fill="#a1a1aa" textAnchor="middle" className="text-[10px] font-mono uppercase font-bold">
              {centerLabel}
            </text>
            <text y="14" fill="#ffffff" textAnchor="middle" className="text-sm font-serif font-black uppercase">
              100%
            </text>
          </g>
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-zinc-800">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-zinc-300 truncate">{s.name}</span>
            <span className="text-zinc-500 font-bold ml-auto">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
