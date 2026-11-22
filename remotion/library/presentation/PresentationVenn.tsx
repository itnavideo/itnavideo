import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface VennCircle {
  name: string;
  items: string[];
  color: string;
}

export interface PresentationVennProps {
  title?: string;
  circleA?: VennCircle;
  circleB?: VennCircle;
  circleC?: VennCircle;
  centerSynergy?: string;
  className?: string;
}

const DEFAULT_A: VennCircle = {
  name: 'VIABILITY',
  items: ['Market Demand', 'Pricing Power', 'Unit Economics'],
  color: '#38bdf8',
};

const DEFAULT_B: VennCircle = {
  name: 'FEASIBILITY',
  items: ['Tech Stack', 'Architecture', 'Engineering Team'],
  color: '#ec4899',
};

const DEFAULT_C: VennCircle = {
  name: 'DESIRABILITY',
  items: ['UX Flow', 'Aesthetics', 'Customer Retention'],
  color: '#f59e0b',
};

export const PresentationVenn: React.FC<PresentationVennProps> = ({
  title = 'PRODUCT MARKET SWEET SPOT',
  circleA = DEFAULT_A,
  circleB = DEFAULT_B,
  circleC = DEFAULT_C,
  centerSynergy = 'OPTIMAL PRODUCT LAUNCH',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 75 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="text-center border-b border-zinc-800 pb-3 mb-6">
        <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold mb-1">
          EXECUTIVE VENN DIAGRAM
        </div>
        <h3 className="text-lg sm:text-2xl font-serif font-black tracking-wide text-zinc-100 uppercase">
          {title}
        </h3>
      </div>

      {/* SVG 3-Circle Venn Graphic */}
      <div className="relative w-full h-[340px] flex items-center justify-center">
        <svg viewBox="0 0 500 400" className="w-full h-full max-w-lg overflow-visible">
          <defs>
            <radialGradient id="grad-venn-a" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={circleA.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={circleA.color} stopOpacity="0.15" />
            </radialGradient>
            <radialGradient id="grad-venn-b" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={circleB.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={circleB.color} stopOpacity="0.15" />
            </radialGradient>
            <radialGradient id="grad-venn-c" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={circleC.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={circleC.color} stopOpacity="0.15" />
            </radialGradient>
          </defs>

          {/* Circle A (Top Center) */}
          <circle
            cx="250"
            cy="150"
            r="120"
            fill="url(#grad-venn-a)"
            stroke={circleA.color}
            strokeWidth="2.5"
            className="mix-blend-screen"
          />

          {/* Circle B (Bottom Left) */}
          <circle
            cx="180"
            cy="260"
            r="120"
            fill="url(#grad-venn-b)"
            stroke={circleB.color}
            strokeWidth="2.5"
            className="mix-blend-screen"
          />

          {/* Circle C (Bottom Right) */}
          <circle
            cx="320"
            cy="260"
            r="120"
            fill="url(#grad-venn-c)"
            stroke={circleC.color}
            strokeWidth="2.5"
            className="mix-blend-screen"
          />

          {/* Circle Labels */}
          <text x="250" y="90" fill={circleA.color} textAnchor="middle" className="text-xs font-mono font-bold tracking-widest uppercase">
            {circleA.name}
          </text>
          <text x="130" y="320" fill={circleB.color} textAnchor="middle" className="text-xs font-mono font-bold tracking-widest uppercase">
            {circleB.name}
          </text>
          <text x="370" y="320" fill={circleC.color} textAnchor="middle" className="text-xs font-mono font-bold tracking-widest uppercase">
            {circleC.name}
          </text>

          {/* Center Sweet Spot Badge */}
          <g transform="translate(250, 225)">
            <circle r="30" fill="#18181b" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 8px rgba(255,255,255,0.4))" />
            <text y="4" fill="#ffffff" textAnchor="middle" className="text-[9px] font-mono font-black uppercase">
              SWEET SPOT
            </text>
          </g>
        </svg>
      </div>

      {/* Central Synergy Callout Footer */}
      <div className="mt-4 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-center text-xs font-mono text-zinc-300">
        <span className="text-amber-400 font-bold mr-2">INTERSECTION:</span>
        <span>{centerSynergy}</span>
      </div>
    </div>
  );
};
