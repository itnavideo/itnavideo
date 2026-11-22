import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CDCStreamPipelineProps {
  sourceDb?: string;
  eventBroker?: string;
  topic?: string;
  className?: string;
}

export const CDCStreamPipeline: React.FC<CDCStreamPipelineProps> = ({
  sourceDb = 'PostgreSQL WAL Stream',
  eventBroker = 'Debezium + Apache Kafka',
  topic = 'cdc.production.render_jobs',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          CHANGE DATA CAPTURE (CDC)
        </span>
        <span className="text-emerald-400 font-bold">REALTIME STREAM</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-between space-x-2 font-mono">
        <div className="flex-1 p-3 bg-zinc-900 border border-white/15 rounded-lg text-center">
          <div className="text-[9px] text-white/40">SOURCE</div>
          <div className="text-xs font-bold text-white mt-0.5">{sourceDb}</div>
        </div>

        <span className="text-amber-400 font-bold text-xs">──CDC──▶</span>

        <div className="flex-1 p-3 bg-amber-950/60 border border-amber-500/50 rounded-lg text-center">
          <div className="text-[9px] text-amber-300 font-bold">CONNECTOR</div>
          <div className="text-xs font-bold text-white mt-0.5">{eventBroker}</div>
        </div>

        <span className="text-amber-400 font-bold text-xs">──PUB──▶</span>

        <div className="flex-1 p-3 bg-zinc-900 border border-white/15 rounded-lg text-center">
          <div className="text-[9px] text-white/40">TOPIC</div>
          <div className="text-[11px] font-bold text-emerald-400 mt-0.5 truncate">{topic}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>TRANSACTIONAL INTEGRITY PRESERVED</span>
        <span>LATENCY: &lt; 50ms</span>
      </div>
    </div>
  );
};
