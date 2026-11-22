import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BrainLobe {
  name: string;
  role: string;
  color: string;
  x: number;
  y: number;
}

export interface HumanBrainProps {
  title?: string;
  activeLobeIndex?: number;
  lobes?: BrainLobe[];
  className?: string;
}

const DEFAULT_LOBES: BrainLobe[] = [
  { name: 'FRONTAL LOBE', role: 'Executive function, planning, reasoning', color: '#38bdf8', x: 35, y: 35 },
  { name: 'PARIETAL LOBE', role: 'Sensory perception, spatial awareness', color: '#6366f1', x: 65, y: 30 },
  { name: 'OCCIPITAL LOBE', role: 'Visual processing, pattern recognition', color: '#ec4899', x: 80, y: 55 },
  { name: 'TEMPORAL LOBE', role: 'Memory retrieval, language, emotion', color: '#10b981', x: 45, y: 65 },
  { name: 'CEREBELLUM', role: 'Motor coordination, habit automaticity', color: '#f59e0b', x: 75, y: 80 },
];

export const HumanBrain: React.FC<HumanBrainProps> = ({
  title = 'HUMAN BRAIN COGNITIVE ARCHITECTURE',
  activeLobeIndex,
  lobes = DEFAULT_LOBES,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const pulse = 1 + Math.sin(frame * 0.15) * 0.04;

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            NEUROSCIENCE & PSYCHOLOGY
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">● NEURAL FIRING</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* SVG Brain Silhouette with Anatomical Lobes */}
        <div className="relative aspect-[4/3] bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-center">
          <svg viewBox="0 0 320 240" className="w-full h-full overflow-visible">
            {/* Brain Outline Contour */}
            <path
              d="M 80 140 C 60 110, 70 60, 110 40 C 160 20, 230 20, 260 60 C 290 100, 280 160, 250 180 C 220 200, 190 220, 170 190 C 150 160, 120 180, 90 170 Z"
              fill="#18181b"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeOpacity="0.6"
              filter="drop-shadow(0 0 12px rgba(56,189,248,0.25))"
            />

            {/* Neural Gyri / Sulci Convolution Curves */}
            <path
              d="M 120 70 Q 150 90 180 60 T 230 80 M 130 110 Q 170 130 210 100 T 250 130 M 110 140 Q 150 160 190 140"
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.8"
              strokeDasharray="4 2"
              strokeOpacity="0.5"
            />

            {/* Lobe Nodes */}
            {lobes.map((lobe, i) => {
              const isSelected = activeLobeIndex === undefined || activeLobeIndex === i;
              return (
                <g key={i} transform={`translate(${lobe.x * 3}, ${lobe.y * 2.2})`}>
                  <circle
                    r={isSelected ? 10 * pulse : 6}
                    fill={lobe.color}
                    fillOpacity={isSelected ? 0.9 : 0.4}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Lobe Function Explanations */}
        <div className="space-y-2.5">
          {lobes.map((lobe, idx) => {
            const isSelected = activeLobeIndex === undefined || activeLobeIndex === idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-zinc-700 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-800/80 opacity-60'
                }`}
                style={{ borderLeftColor: lobe.color, borderLeftWidth: '3px' }}
              >
                <div className="text-xs font-serif font-black uppercase text-zinc-100">
                  {lobe.name}
                </div>
                <p className="text-[11px] font-sans text-zinc-400 mt-0.5 leading-snug">
                  {lobe.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
