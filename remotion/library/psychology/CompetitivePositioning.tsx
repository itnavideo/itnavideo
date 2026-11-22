import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface PositioningPoint {
  name: string;
  x: number; // 0 - 100% (Automation vs Manual)
  y: number; // 0 - 100% (High Retention vs Basic)
  isHero?: boolean;
}

export interface CompetitivePositioningProps {
  title?: string;
  points?: PositioningPoint[];
  className?: string;
}

const DEFAULT_POINTS: PositioningPoint[] = [
  { name: 'Itnavideo.com (AI Cloud Render)', x: 88, y: 88, isHero: true },
  { name: 'Desktop NLEs (Premiere / DaVinci)', x: 20, y: 85, isHero: false },
  { name: 'Template Web Editors', x: 70, y: 40, isHero: false },
  { name: 'Manual Freelancer Outsource', x: 25, y: 50, isHero: false },
];

export const CompetitivePositioning: React.FC<CompetitivePositioningProps> = ({
  title = 'PERCEPTUAL MARKET POSITIONING MATRIX',
  points = DEFAULT_POINTS,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            COMPETITIVE ADVANTAGE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* 2x2 Positioning Map */}
      <div className="relative w-full aspect-[16/8] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6">
        <div className="absolute left-1/2 inset-y-0 w-[1px] bg-zinc-700 -translate-x-1/2" />
        <div className="absolute top-1/2 inset-x-0 h-[1px] bg-zinc-700 -translate-y-1/2" />

        {points.map((pt, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${pt.x}%`,
                top: `${100 - pt.y}%`,
                transform: `translate(-50%, -50%) scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold shadow-xl whitespace-nowrap ${
                  pt.isHero
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-zinc-950 border-zinc-700 text-zinc-400'
                }`}
              >
                {pt.isHero && '★ '}
                {pt.name}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-4 px-2">
        <span>RETENTION OPTIMIZATION ↑</span>
        <span>AUTONOMOUS SPEED →</span>
      </div>
    </div>
  );
};
