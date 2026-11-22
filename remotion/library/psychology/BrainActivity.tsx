import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface BrainWave {
  band: string; // e.g. "BETA", "ALPHA"
  frequency: string; // e.g. "14-30 Hz"
  state: string; // e.g. "High focus, analytical thinking"
  color: string;
}

export interface BrainActivityProps {
  title?: string;
  waves?: BrainWave[];
  cognitiveLoadPercent?: number;
  className?: string;
}

const DEFAULT_WAVES: BrainWave[] = [
  { band: 'GAMMA (30-100 Hz)', frequency: 'High-level cognition, peak attention', state: 'ACTIVE', color: '#ec4899' },
  { band: 'BETA (14-30 Hz)', frequency: 'Analytical reasoning, active focus', state: 'DOMINANT', color: '#38bdf8' },
  { band: 'ALPHA (8-13 Hz)', frequency: 'Relaxed alertness, creative flow', state: 'BALANCED', color: '#10b981' },
  { band: 'THETA (4-7 Hz)', frequency: 'Deep intuition, memory consolidation', state: 'RESTING', color: '#f59e0b' },
];

export const BrainActivity: React.FC<BrainActivityProps> = ({
  title = 'EEG BRAIN WAVE COGNITIVE ACTIVITY MONITOR',
  waves = DEFAULT_WAVES,
  cognitiveLoadPercent = 74,
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
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            NEURO-TELEMETRY
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">COGNITIVE LOAD</span>
          <span className="text-sm font-mono font-bold text-amber-400">{cognitiveLoadPercent}%</span>
        </div>
      </div>

      {/* Wave Frequency Strips */}
      <div className="space-y-3 font-mono text-xs">
        {waves.map((w, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderLeftColor: w.color,
                borderLeftWidth: '4px',
              }}
            >
              <div>
                <span className="text-xs font-serif font-bold text-zinc-100 uppercase">
                  {w.band}
                </span>
                <p className="text-[11px] font-sans text-zinc-400 mt-0.5">{w.frequency}</p>
              </div>

              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase"
                style={{
                  backgroundColor: `${w.color}22`,
                  color: w.color,
                }}
              >
                ● {w.state}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
