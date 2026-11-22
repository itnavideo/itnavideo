import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'photo' | 'document' | 'note';
  snippet?: string;
  x: number; // % coordinates
  y: number; // % coordinates
  rotation?: number;
}

export interface EvidenceConnection {
  fromId: string;
  toId: string;
  color?: string;
}

export interface EvidenceBoardProps {
  title?: string;
  items?: EvidenceItem[];
  connections?: EvidenceConnection[];
  className?: string;
}

const DEFAULT_ITEMS: EvidenceItem[] = [
  { id: 'ev-1', title: 'SURVEILLANCE #4A', type: 'photo', snippet: 'Pier 17 at 23:40', x: 20, y: 30, rotation: -4 },
  { id: 'ev-2', title: 'FLIGHT LOG 802', type: 'document', snippet: 'Manifest redacted', x: 70, y: 25, rotation: 3 },
  { id: 'ev-3', title: 'KEY WITNESS', type: 'note', snippet: 'Call records missing', x: 45, y: 70, rotation: -2 },
];

const DEFAULT_CONNECTIONS: EvidenceConnection[] = [
  { fromId: 'ev-1', toId: 'ev-3', color: '#ef4444' },
  { fromId: 'ev-2', toId: 'ev-3', color: '#ef4444' },
];

export const EvidenceBoard: React.FC<EvidenceBoardProps> = ({
  title = 'INVESTIGATION EVIDENCE BOARD — CASE #89-B',
  items = DEFAULT_ITEMS,
  connections = DEFAULT_CONNECTIONS,
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
      className={`relative w-full h-full overflow-hidden select-none bg-[#1a1412] p-6 ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(#2b201a 15%, transparent 16%), radial-gradient(#221813 15%, transparent 16%)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px',
        opacity: entry,
      }}
    >
      {/* Top Cork Title Tag */}
      <div className="relative z-30 inline-block bg-zinc-900/90 border border-zinc-700 px-4 py-2 rounded shadow-lg mb-4">
        <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-400 font-bold">
          {title}
        </h3>
      </div>

      {/* SVG Red Connecting Yarn Threads */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {connections.map((conn, idx) => {
          const from = items.find((i) => i.id === conn.fromId);
          const to = items.find((i) => i.id === conn.toId);
          if (!from || !to) return null;

          return (
            <line
              key={idx}
              x1={`${from.x + 10}%`}
              y1={`${from.y + 10}%`}
              x2={`${to.x + 10}%`}
              y2={`${to.y + 10}%`}
              stroke={conn.color || '#ef4444'}
              strokeWidth="2.5"
              strokeDasharray="4 2"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
              }}
            />
          );
        })}
      </svg>

      {/* Pinned Evidence Cards */}
      {items.map((item, idx) => {
        const itemSpring = spring({
          frame: Math.max(0, frame - idx * 4),
          fps,
          config: { damping: 12, mass: 0.8, stiffness: 90 },
        });

        return (
          <div
            key={item.id}
            className="absolute z-20 p-3 rounded shadow-2xl transition-all"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg) scale(${itemSpring})`,
              backgroundColor: item.type === 'note' ? '#fef08a' : item.type === 'document' ? '#f4f4f5' : '#e4e4e7',
              color: '#18181b',
              width: '180px',
            }}
          >
            {/* Red Pushpin */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-red-900 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </div>

            <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-600 mb-1">
              {item.type}
            </div>
            <div className="text-xs font-serif font-bold text-zinc-900 leading-tight mb-1">
              {item.title}
            </div>
            {item.snippet && (
              <div className="text-[10px] font-sans text-zinc-700 italic border-t border-zinc-300 pt-1">
                {item.snippet}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
