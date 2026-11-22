import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SankeyFlow {
  source: string;
  target: string;
  value: number; // proportional flow width
  color?: string;
}

export interface SankeyDiagramProps {
  title?: string;
  totalFlow?: string;
  flows?: SankeyFlow[];
  className?: string;
}

const DEFAULT_FLOWS: SankeyFlow[] = [
  { source: 'Inbound Organic', target: 'Free Signups', value: 45, color: '#10b981' },
  { source: 'Paid Ads', target: 'Free Signups', value: 30, color: '#38bdf8' },
  { source: 'Referral', target: 'Free Signups', value: 25, color: '#6366f1' },
  { source: 'Free Signups', target: 'Pro Subscriptions', value: 40, color: '#f59e0b' },
  { source: 'Free Signups', target: 'Churn / Inactive', value: 60, color: '#ef4444' },
];

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  title = 'USER CONVERSION CAPITAL & FLOW SANKEY',
  totalFlow = '$128,000 / MO',
  flows = DEFAULT_FLOWS,
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            SANKEY FLOW ANALYSIS
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-semibold">{totalFlow}</span>
      </div>

      {/* SVG Smooth Cubic Bezier Ribbon Paths */}
      <div className="relative w-full aspect-[16/8] flex items-center justify-center">
        <svg viewBox="0 0 700 300" className="w-full h-full overflow-visible">
          {/* Level 1 Node Pills */}
          <g transform="translate(40, 50)">
            <rect width="120" height="40" rx="6" fill="#18181b" stroke="#10b981" strokeWidth="2" />
            <text x="60" y="24" fill="#ffffff" textAnchor="middle" className="text-xs font-mono font-bold">
              Organic (45%)
            </text>
          </g>
          <g transform="translate(40, 130)">
            <rect width="120" height="40" rx="6" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
            <text x="60" y="24" fill="#ffffff" textAnchor="middle" className="text-xs font-mono font-bold">
              Paid Ads (30%)
            </text>
          </g>
          <g transform="translate(40, 210)">
            <rect width="120" height="40" rx="6" fill="#18181b" stroke="#6366f1" strokeWidth="2" />
            <text x="60" y="24" fill="#ffffff" textAnchor="middle" className="text-xs font-mono font-bold">
              Referral (25%)
            </text>
          </g>

          {/* Level 2 Center Node */}
          <g transform="translate(280, 100)">
            <rect width="140" height="100" rx="8" fill="#18181b" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="70" y="45" fill="#f59e0b" textAnchor="middle" className="text-[10px] font-mono font-bold uppercase">
              PLATFORM CONVERSION
            </text>
            <text x="70" y="68" fill="#ffffff" textAnchor="middle" className="text-xs font-serif font-black uppercase">
              100% SIGNUPS
            </text>
          </g>

          {/* Level 3 Destination Nodes */}
          <g transform="translate(520, 70)">
            <rect width="140" height="50" rx="6" fill="#18181b" stroke="#10b981" strokeWidth="2" />
            <text x="70" y="30" fill="#10b981" textAnchor="middle" className="text-xs font-mono font-bold">
              Paid Pro (40%)
            </text>
          </g>
          <g transform="translate(520, 180)">
            <rect width="140" height="50" rx="6" fill="#18181b" stroke="#ef4444" strokeWidth="2" />
            <text x="70" y="30" fill="#ef4444" textAnchor="middle" className="text-xs font-mono font-bold">
              Churned (60%)
            </text>
          </g>

          {/* Bezier Flow Waves */}
          <path
            d="M 160 70 C 220 70, 220 130, 280 130"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
            strokeOpacity="0.35"
          />
          <path
            d="M 160 150 C 220 150, 220 150, 280 150"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="12"
            strokeOpacity="0.35"
          />
          <path
            d="M 160 230 C 220 230, 220 170, 280 170"
            fill="none"
            stroke="#6366f1"
            strokeWidth="10"
            strokeOpacity="0.35"
          />

          <path
            d="M 420 130 C 470 130, 470 95, 520 95"
            fill="none"
            stroke="#10b981"
            strokeWidth="18"
            strokeOpacity="0.4"
          />
          <path
            d="M 420 170 C 470 170, 470 205, 520 205"
            fill="none"
            stroke="#ef4444"
            strokeWidth="24"
            strokeOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
};
