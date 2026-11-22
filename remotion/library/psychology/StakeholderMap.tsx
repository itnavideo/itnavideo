import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface StakeholderGroup {
  quadrant: string;
  strategy: string;
  stakeholders: string[];
  color: string;
}

export interface StakeholderMapProps {
  title?: string;
  groups?: StakeholderGroup[];
  className?: string;
}

const DEFAULT_GROUPS: StakeholderGroup[] = [
  { quadrant: 'HIGH POWER / HIGH INTEREST', strategy: 'MANAGE CLOSELY', stakeholders: ['Platform Founder', 'Lead Investors', 'Core Creator Partners'], color: '#ef4444' },
  { quadrant: 'HIGH POWER / LOW INTEREST', strategy: 'KEEP SATISFIED', stakeholders: ['Cloud Infrastructure Providers (GCP/AWS)', 'Payment Gateways'], color: '#f59e0b' },
  { quadrant: 'LOW POWER / HIGH INTEREST', strategy: 'KEEP INFORMED', stakeholders: ['Community Users', 'Social Media Audience', 'Affiliate Marketers'], color: '#38bdf8' },
  { quadrant: 'LOW POWER / LOW INTEREST', strategy: 'MONITOR', stakeholders: ['Peripheral Tool Integrators', 'General Web Browsers'], color: '#52525b' },
];

export const StakeholderMap: React.FC<StakeholderMapProps> = ({
  title = 'POWER VS. INTEREST STAKEHOLDER MATRIX',
  groups = DEFAULT_GROUPS,
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
            STAKEHOLDER ENGAGEMENT
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-md"
            style={{ borderLeftColor: g.color, borderLeftWidth: '4px' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">{g.quadrant}</span>
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: g.color }}>
                {g.strategy}
              </span>
            </div>
            <div className="space-y-1 mt-2 text-xs font-sans text-zinc-300">
              {g.stakeholders.map((s, sIdx) => (
                <div key={sIdx}>• {s}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
