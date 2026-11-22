import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface IndexScanBenchmarkProps {
  seqScanMs?: number;
  indexScanMs?: number;
  className?: string;
}

export const IndexScanBenchmark: React.FC<IndexScanBenchmarkProps> = ({
  seqScanMs = 480,
  indexScanMs = 0.45,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const speedup = Math.round(seqScanMs / indexScanMs);

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          SCAN BENCHMARK
        </span>
        <span className="text-emerald-400 font-bold">{speedup}x FASTER</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-2 gap-3 items-center font-mono">
        <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl text-center">
          <div className="text-[10px] text-white/40">SEQUENTIAL SCAN</div>
          <div className="text-xl font-bold text-rose-400 mt-1">{seqScanMs} ms</div>
          <div className="text-[10px] text-white/50 mt-1">Full 10M Row Heap Scan</div>
        </div>

        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-center">
          <div className="text-[10px] text-emerald-400 font-bold">B-TREE INDEX SCAN</div>
          <div className="text-xl font-black text-emerald-400 mt-1">{indexScanMs} ms</div>
          <div className="text-[10px] text-emerald-300 mt-1">3 Tree Page Hops</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>IOPS REDUCTION: 99.9%</span>
        <span>SUB-MILLISECOND RESPONSE</span>
      </div>
    </div>
  );
};
