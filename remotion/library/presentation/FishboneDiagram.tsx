import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface FishboneBranch {
  category: string; // e.g. "Methods", "Machines", "People"
  causes: string[];
}

export interface FishboneDiagramProps {
  problemStatement?: string;
  branches?: FishboneBranch[];
  accentColor?: string;
  className?: string;
}

const DEFAULT_BRANCHES: FishboneBranch[] = [
  { category: 'METHODS', causes: ['Uncalibrated compression', 'Lack of pre-render validation'] },
  { category: 'MACHINES', causes: ['Out of memory (4GB RAM thrash)', 'Mechanical HDD write lag'] },
  { category: 'PEOPLE', causes: ['Manual video timeline editing', 'Delayed subtitle review'] },
  { category: 'MATERIALS', causes: ['High-bitrate uncompressed source', 'Missing audio mono track'] },
];

export const FishboneDiagram: React.FC<FishboneDiagramProps> = ({
  problemStatement = 'VIDEO EXPORT BOTTLENECKS',
  branches = DEFAULT_BRANCHES,
  accentColor = '#ef4444',
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
          <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            ISHIKAWA ROOT CAUSE ANALYSIS
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            FISHBONE CAUSE-AND-EFFECT DIAGRAM
          </h3>
        </div>
      </div>

      {/* SVG Fishbone Canvas */}
      <div className="relative w-full aspect-[16/8] flex items-center justify-center">
        <svg viewBox="0 0 800 360" className="w-full h-full overflow-visible">
          {/* Main Central Spine Line */}
          <line
            x1="50"
            y1="180"
            x2="650"
            y2="180"
            stroke="#52525b"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Fish Head / Problem Statement Card */}
          <g transform="translate(650, 140)">
            <rect
              width="140"
              height="80"
              rx="8"
              fill="#18181b"
              stroke={accentColor}
              strokeWidth="2"
              filter="drop-shadow(0 4px 12px rgba(239, 68, 68, 0.3))"
            />
            <text x="70" y="30" fill={accentColor} textAnchor="middle" className="text-[9px] font-mono font-bold uppercase">
              EFFECT / PROBLEM
            </text>
            <text x="70" y="52" fill="#ffffff" textAnchor="middle" className="text-[11px] font-serif font-black uppercase">
              {problemStatement}
            </text>
          </g>

          {/* Top Ribs */}
          <g transform="translate(180, 180)">
            <line x1="0" y1="0" x2="-60" y2="-120" stroke="#71717a" strokeWidth="2.5" />
            <text x="-65" y="-125" fill="#38bdf8" textAnchor="middle" className="text-xs font-mono font-bold">
              {branches[0]?.category}
            </text>
            {branches[0]?.causes.map((c, i) => (
              <text key={i} x="-40" y={-50 - i * 30} fill="#d4d4d8" className="text-[10px] font-sans">
                ↳ {c}
              </text>
            ))}
          </g>

          <g transform="translate(420, 180)">
            <line x1="0" y1="0" x2="-60" y2="-120" stroke="#71717a" strokeWidth="2.5" />
            <text x="-65" y="-125" fill="#38bdf8" textAnchor="middle" className="text-xs font-mono font-bold">
              {branches[1]?.category}
            </text>
            {branches[1]?.causes.map((c, i) => (
              <text key={i} x="-40" y={-50 - i * 30} fill="#d4d4d8" className="text-[10px] font-sans">
                ↳ {c}
              </text>
            ))}
          </g>

          {/* Bottom Ribs */}
          <g transform="translate(180, 180)">
            <line x1="0" y1="0" x2="-60" y2="120" stroke="#71717a" strokeWidth="2.5" />
            <text x="-65" y="140" fill="#f59e0b" textAnchor="middle" className="text-xs font-mono font-bold">
              {branches[2]?.category}
            </text>
            {branches[2]?.causes.map((c, i) => (
              <text key={i} x="-40" y={60 + i * 30} fill="#d4d4d8" className="text-[10px] font-sans">
                ↳ {c}
              </text>
            ))}
          </g>

          <g transform="translate(420, 180)">
            <line x1="0" y1="0" x2="-60" y2="120" stroke="#71717a" strokeWidth="2.5" />
            <text x="-65" y="140" fill="#f59e0b" textAnchor="middle" className="text-xs font-mono font-bold">
              {branches[3]?.category}
            </text>
            {branches[3]?.causes.map((c, i) => (
              <text key={i} x="-40" y={60 + i * 30} fill="#d4d4d8" className="text-[10px] font-sans">
                ↳ {c}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};
