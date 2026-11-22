import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ObjectOrientedDatabaseProps {
  engineName?: string;
  languageBinding?: string;
  zeroOrmMapping?: boolean;
  className?: string;
}

export const ObjectOrientedDatabase: React.FC<ObjectOrientedDatabaseProps> = ({
  engineName = "ObjectDB / db4o / GemStone",
  languageBinding = "Native Java / C# / Python Objects",
  zeroOrmMapping = true,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            OBJECT-ORIENTED DATABASE (OODBMS)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          ZERO ORM OVERHEAD
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Binding Environment</div>
        <code className="text-indigo-300">{languageBinding}</code>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Engine: {engineName}</span>
        <span className="text-emerald-400 font-bold">Eliminates Impedance Mismatch</span>
      </div>
    </div>
  );
};
