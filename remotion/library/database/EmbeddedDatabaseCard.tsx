import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EmbeddedDatabaseCardProps {
  engineName?: string;
  memoryOverheadMB?: number;
  zeroNetworkHop?: boolean;
  fileSingleStorage?: boolean;
  className?: string;
}

export const EmbeddedDatabaseCard: React.FC<EmbeddedDatabaseCardProps> = ({
  engineName = "DuckDB / SQLite 3",
  memoryOverheadMB = 12,
  zeroNetworkHop = true,
  fileSingleStorage = true,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            EMBEDDED IN-PROCESS DATABASE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          ZERO NETWORK HOP
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-2xl font-bold text-white">{engineName}</span>
        </div>
        <span className="text-xs text-sky-400 font-bold">Direct C ABI / WASM Binding</span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Memory Footprint</div>
          <div className="text-white font-bold text-sm mt-1">{memoryOverheadMB} MB RAM</div>
          <div className="text-[10px] text-zinc-500">Ultra-lightweight binary</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Storage Architecture</div>
          <div className="text-emerald-400 font-bold text-sm mt-1">Single Portable File</div>
          <div className="text-[10px] text-zinc-500">Zero daemon process</div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Ideal for: Local Analytics, Edge AI, Mobile Apps, CLI Tools</span>
      </div>
    </div>
  );
};
