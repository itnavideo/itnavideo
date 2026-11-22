import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TablePartitionProps {
  parentTable?: string;
  partitionStrategy?: string;
  partitions?: string[];
  className?: string;
}

export const TablePartition: React.FC<TablePartitionProps> = ({
  parentTable = 'audit_logs',
  partitionStrategy = 'PARTITION BY RANGE (created_at)',
  partitions = ['audit_logs_2026_q1', 'audit_logs_2026_q2', 'audit_logs_2026_q3'],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          TABLE PARTITIONING
        </span>
        <span className="text-teal-400 font-bold">HORIZONTAL SHARDING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">{parentTable}</div>
          <div className="text-xs text-teal-300 mt-0.5">{partitionStrategy}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          {partitions.map((p, i) => (
            <div key={i} className="p-2 bg-zinc-950 rounded border border-teal-500/30 text-center">
              <div className="text-[9px] text-white/40 font-bold">PARTITION {i + 1}</div>
              <div className="text-xs font-bold text-teal-300 mt-1 truncate">{p}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>QUERY PRUNING: ACTIVE</span>
          <span className="text-emerald-400 font-bold">ZERO FULL-TABLE SCANS</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ARCHIVAL: DROP OLD PARTITIONS INSTANTLY</span>
        <span>POSTGRES DECLARATIVE</span>
      </div>
    </div>
  );
};
