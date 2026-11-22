import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface LifecyclePhase {
  phase: string;
  focus: string;
  color: string;
}

export interface CustomerLifecycleProps {
  title?: string;
  phases?: LifecyclePhase[];
  className?: string;
}

const DEFAULT_PHASES: LifecyclePhase[] = [
  { phase: '1. ACQUIRE', focus: 'SEO landing pages & free signups', color: '#38bdf8' },
  { phase: '2. ONBOARD', focus: 'First video rendered under 2 minutes', color: '#10b981' },
  { phase: '3. ADOPT', focus: 'Daily shorts creation quota usage', color: '#f59e0b' },
  { phase: '4. EXPAND', focus: 'Pro subscription & team tier upgrade', color: '#ec4899' },
  { phase: '5. RENEW', focus: 'Low churn, annual contract extension', color: '#6366f1' },
];

export const CustomerLifecycle: React.FC<CustomerLifecycleProps> = ({
  title = 'CIRCULAR CUSTOMER RETENTION LIFECYCLE',
  phases = DEFAULT_PHASES,
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
            RETENTION FLYWHEEL
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {phases.map((p, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between"
            style={{ borderLeftColor: p.color, borderLeftWidth: '4px' }}
          >
            <span className="font-bold text-zinc-100">{p.phase}</span>
            <span className="text-zinc-400">{p.focus}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
