import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface MetroLine {
  name: string;
  color: string;
  stations: string[];
}

export interface MetroMapProps {
  metroSystem?: string;
  lines?: MetroLine[];
  className?: string;
}

const DEFAULT_LINES: MetroLine[] = [
  { name: 'Red Line (Central Express)', color: '#ef4444', stations: ['Downtown', 'Union Sq', 'Airport'] },
  { name: 'Blue Line (Coastal Loop)', color: '#3b82f6', stations: ['Harbor', 'Union Sq', 'Tech Park'] },
];

export const MetroMap: React.FC<MetroMapProps> = ({
  metroSystem = 'METROPOLITAN RAPID TRANSIT SCHEMATIC',
  lines = DEFAULT_LINES,
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
            SUBWAY & METRO SCHEMATIC
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {metroSystem}
          </h3>
        </div>
      </div>

      {/* Schematic Transit SVG Lines */}
      <div className="relative w-full aspect-[16/7] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6 flex items-center justify-center">
        <svg viewBox="0 0 600 240" className="w-full h-full">
          {/* Red Line */}
          <line x1="80" y1="120" x2="520" y2="120" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
          {/* Blue Line */}
          <path d="M 160 40 L 300 120 L 460 200" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />

          {/* Interchange Station Ring */}
          <circle cx="300" cy="120" r="14" fill="#ffffff" stroke="#18181b" strokeWidth="4" />
          <text x="300" y="150" fill="#ffffff" textAnchor="middle" className="text-[10px] font-mono font-black uppercase">
            UNION SQ (TRANSFER)
          </text>
        </svg>
      </div>
    </div>
  );
};
