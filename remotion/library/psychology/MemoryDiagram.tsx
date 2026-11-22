import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface MemoryStore {
  name: string;
  duration: string;
  capacity: string;
  color: string;
}

export interface MemoryDiagramProps {
  title?: string;
  stores?: MemoryStore[];
  className?: string;
}

const DEFAULT_STORES: MemoryStore[] = [
  { name: 'SENSORY REGISTER', duration: '0.5 — 3 SECONDS', capacity: 'High sensory detail (visual/audio)', color: '#38bdf8' },
  { name: 'WORKING MEMORY', duration: '15 — 30 SECONDS', capacity: '7 ± 2 chunks of conscious focus', color: '#f59e0b' },
  { name: 'LONG-TERM MEMORY', duration: 'DAYS TO DECADES', capacity: 'Unlimited semantic & episodic archive', color: '#10b981' },
];

export const MemoryDiagram: React.FC<MemoryDiagramProps> = ({
  title = 'ATKINSON-SHIFFRIN MULTI-STORE MEMORY MODEL',
  stores = DEFAULT_STORES,
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
            COGNITIVE MEMORY RETENTION
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Memory Stores Progression */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stores.map((s, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-lg"
            style={{ borderTopColor: s.color, borderTopWidth: '3px' }}
          >
            <div>
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                STORE 0{idx + 1}
              </span>
              <h4 className="text-sm font-serif font-black text-zinc-100 uppercase mt-1">
                {s.name}
              </h4>
              <p className="text-xs font-mono text-amber-400 mt-2">{s.duration}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-zinc-800 text-[11px] font-sans text-zinc-400">
              {s.capacity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
