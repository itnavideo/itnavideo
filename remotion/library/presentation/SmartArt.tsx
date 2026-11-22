import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SmartArtStep {
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

export interface SmartArtProps {
  title?: string;
  steps?: SmartArtStep[];
  type?: 'process' | 'chevron' | 'cycle';
  activeStep?: number;
  className?: string;
}

const DEFAULT_STEPS: SmartArtStep[] = [
  { title: 'ASSESS', description: 'Evaluate current baseline architecture', color: '#38bdf8' },
  { title: 'OPTIMIZE', description: 'Streamline bottlenecks and latency', color: '#6366f1' },
  { title: 'DEPLOY', description: 'Roll out distributed cloud workflows', color: '#10b981' },
  { title: 'SCALE', description: 'Auto-scale across global edge nodes', color: '#f59e0b' },
];

export const SmartArt: React.FC<SmartArtProps> = ({
  title = 'STRATEGIC TRANSFORMATION ROADMAP',
  steps = DEFAULT_STEPS,
  type = 'chevron',
  activeStep,
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none ${className}`}
      style={{ opacity: entry }}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            EXECUTIVE SMARTART PROCESS
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500">{steps.length} STAGES</span>
      </div>

      {/* Chevrons Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const isCurrent = activeStep !== undefined ? activeStep === idx : true;
          const stepColor = step.color || '#38bdf8';

          return (
            <div
              key={idx}
              className={`relative rounded-xl p-4 sm:p-5 flex flex-col justify-between border transition-all ${
                isCurrent
                  ? 'bg-zinc-900 border-zinc-700 shadow-xl'
                  : 'bg-zinc-950/60 border-zinc-800/80 opacity-70'
              }`}
              style={{
                transform: `translateY(${interpolate(itemSpring, [0, 1], [25, 0])}px) scale(${itemSpring})`,
                borderColor: isCurrent ? `${stepColor}55` : undefined,
              }}
            >
              {/* Top Accent Strip */}
              <div
                className="w-8 h-1 rounded-full mb-3"
                style={{ backgroundColor: stepColor }}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500">
                    STAGE 0{idx + 1}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="text-xs font-mono text-zinc-600 hidden lg:inline">→</span>
                  )}
                </div>
                <h4
                  className="text-base font-serif font-bold tracking-wider uppercase mb-1.5"
                  style={{ color: stepColor }}
                >
                  {step.title}
                </h4>
                <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>PHASE COMPLETE</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stepColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
