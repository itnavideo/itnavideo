import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MultiRegionReplicationProps {
  regions?: { name: string; role: string; ping: string }[];
  className?: string;
}

export const MultiRegionReplication: React.FC<MultiRegionReplicationProps> = ({
  regions = [
    { name: 'us-east-1 (N. Virginia)', role: 'Primary Leader', ping: '0 ms' },
    { name: 'eu-west-1 (Ireland)', role: 'Read Replica', ping: '68 ms' },
    { name: 'ap-south-1 (Mumbai)', role: 'Read Replica', ping: '124 ms' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          MULTI-REGION MESH
        </span>
        <span className="text-white/40">GLOBAL LATENCY</span>
      </div>

      <div className="flex-1 my-4 space-y-2 flex flex-col justify-center font-mono">
        {regions.map((r, i) => (
          <div key={i} className="p-3 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white">{r.name}</span>
              <div className="text-[10px] text-sky-300">{r.role}</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-black text-emerald-400 text-[10px] font-bold">
              {r.ping}
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>CONSISTENCY: EVENTUAL CONSISTENCY (CRDT)</span>
        <span>GEO-ROUTING ENABLED</span>
      </div>
    </div>
  );
};
