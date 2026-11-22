import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface BridgeInitiative {
  title: string;
  impact: string;
  color?: string;
}

export interface BridgeChartProps {
  title?: string;
  baselineState?: string;
  futureTarget?: string;
  initiatives?: BridgeInitiative[];
  className?: string;
}

const DEFAULT_INITIATIVES: BridgeInitiative[] = [
  { title: 'Remotion Cloud Lambda', impact: '+350% Speed', color: '#10b981' },
  { title: 'Zero Local Compute Policy', impact: 'Zero OOM Crash', color: '#38bdf8' },
  { title: 'Groq Whisper Integration', impact: '99% Word Accuracy', color: '#f59e0b' },
];

export const BridgeChart: React.FC<BridgeChartProps> = ({
  title = 'STRATEGIC TRANSFORMATION GAP BRIDGE',
  baselineState = 'CURRENT BASELINE (30 MIN RENDER)',
  futureTarget = 'TARGET GOAL (UNDER 2 MIN)',
  initiatives = DEFAULT_INITIATIVES,
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
            STRATEGIC BRIDGE ANALYSIS
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Bridge Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Left Pillar: Baseline */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center md:col-span-1 shadow-lg">
          <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold mb-1">POINT A</div>
          <h4 className="text-xs font-serif font-black text-zinc-300 uppercase leading-snug">
            {baselineState}
          </h4>
        </div>

        {/* Center Pillars: Strategic Initiatives */}
        <div className="md:col-span-3 space-y-2">
          {initiatives.map((init, idx) => {
            const itemSpring = spring({
              frame: Math.max(0, frame - idx * 6),
              fps,
              config: { damping: 12, mass: 0.8, stiffness: 90 },
            });

            return (
              <div
                key={idx}
                className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-4 py-2 flex items-center justify-between"
                style={{
                  transform: `scale(${itemSpring})`,
                  opacity: itemSpring,
                  borderLeftColor: init.color || '#38bdf8',
                  borderLeftWidth: '3px',
                }}
              >
                <span className="text-xs font-serif font-bold text-zinc-200">{init.title}</span>
                <span className="text-[11px] font-mono font-bold text-emerald-400">{init.impact}</span>
              </div>
            );
          })}
        </div>

        {/* Right Pillar: Future Target */}
        <div className="bg-emerald-950/60 border border-emerald-500 rounded-xl p-4 text-center md:col-span-1 shadow-xl">
          <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-1">POINT B</div>
          <h4 className="text-xs font-serif font-black text-emerald-200 uppercase leading-snug">
            {futureTarget}
          </h4>
        </div>
      </div>
    </div>
  );
};
