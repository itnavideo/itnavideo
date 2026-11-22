import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WriteAmplificationFactorProps {
  waf?: number;
  logicalWritesGB?: number;
  physicalWritesGB?: number;
  deviceModel?: string;
  className?: string;
}

export const WriteAmplificationFactor: React.FC<WriteAmplificationFactorProps> = ({
  waf = 2.4,
  logicalWritesGB = 540,
  physicalWritesGB = 1296,
  deviceModel = "NVMe Enterprise SSD",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const animWaf = interpolate(frame, [0, 45], [1.0, waf], { extrapolateRight: 'clamp' });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            WRITE AMPLIFICATION FACTOR (WAF)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {deviceModel}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-3 font-mono">
        <div>
          <span className="text-4xl font-extrabold text-indigo-400">{animWaf.toFixed(2)}x</span>
          <span className="text-xs text-zinc-400 ml-2">WAF Multiplier</span>
        </div>
        <span className="text-xs px-2 py-1 rounded font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-500/20">
          NAND WEAR HEALTHY
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Host Logical Writes</div>
          <div className="text-white font-bold text-base mt-1">{logicalWritesGB} GB</div>
          <div className="text-[10px] text-zinc-500">Database commit payload</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">NAND Flash Writes</div>
          <div className="text-amber-400 font-bold text-base mt-1">{physicalWritesGB} GB</div>
          <div className="text-[10px] text-zinc-500">WAL + Page flush amplification</div>
        </div>
      </div>
    </div>
  );
};
