import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface PyramidTier {
  name: string;
  description: string;
  color: string;
}

export interface PyramidDiagramProps {
  title?: string;
  tiers?: PyramidTier[];
  className?: string;
}

const DEFAULT_TIERS: PyramidTier[] = [
  { name: 'AUTONOMOUS CREATION', description: 'Agentic AI self-orchestrating video renders', color: '#f59e0b' },
  { name: 'REMOTION COMPOSITION', description: 'Deterministic frame-level 30fps animation logic', color: '#10b981' },
  { name: 'SPEECH & MEDIA PIPELINE', description: 'Groq Whisper word-level transcription & S3 assets', color: '#38bdf8' },
  { name: 'INFRASTRUCTURE BASE', description: 'Google Cloud Run + AWS Lambda serverless cluster', color: '#6366f1' },
];

export const PyramidDiagram: React.FC<PyramidDiagramProps> = ({
  title = 'STRATEGIC ARCHITECTURE PYRAMID',
  tiers = DEFAULT_TIERS,
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
          <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            EXECUTIVE PYRAMID DIAGRAM
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Stepped Pyramid Slices */}
      <div className="space-y-2.5 flex flex-col items-center">
        {tiers.map((tier, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          // Width increases from top to bottom
          const tierWidth = 40 + idx * 20;

          return (
            <div
              key={idx}
              className="h-14 rounded-xl flex items-center justify-between px-6 text-zinc-950 shadow-xl transition-all"
              style={{
                width: `${tierWidth * itemSpring}%`,
                backgroundColor: tier.color,
                boxShadow: `0 4px 15px ${tier.color}40`,
              }}
            >
              <span className="text-xs font-serif font-black uppercase tracking-wider truncate">
                {tier.name}
              </span>
              <span className="text-[10px] font-mono font-bold opacity-80 truncate hidden sm:inline ml-4">
                {tier.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
