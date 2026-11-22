import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DataTypeBadgeProps {
  types?: { name: string; category: string; color: string }[];
  className?: string;
}

export const DataTypeBadge: React.FC<DataTypeBadgeProps> = ({
  types = [
    { name: 'UUID', category: 'Key', color: '#6366f1' },
    { name: 'VARCHAR(255)', category: 'String', color: '#10b981' },
    { name: 'TIMESTAMPTZ', category: 'Temporal', color: '#f59e0b' },
    { name: 'JSONB', category: 'Document', color: '#ec4899' },
    { name: 'INT8 / BIGINT', category: 'Numeric', color: '#3b82f6' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          SQL DATA TYPE PALETTE
        </span>
        <span className="text-white/40">POSTGRES ENGINE</span>
      </div>

      <div className="flex-1 my-4 flex flex-wrap gap-2 items-center justify-center">
        {types.map((t, i) => (
          <div
            key={i}
            className="px-3 py-2 rounded-lg border flex items-center space-x-2 font-mono"
            style={{ backgroundColor: t.color + '20', borderColor: t.color + '60' }}
          >
            <span className="text-xs font-black text-white">{t.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-white/70">{t.category}</span>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STRICT SCHEMA TYPING</span>
        <span>BINARY SERIALIZATION</span>
      </div>
    </div>
  );
};
