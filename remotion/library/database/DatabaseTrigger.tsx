import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DatabaseTriggerProps {
  triggerName?: string;
  eventTiming?: string;
  functionCalled?: string;
  className?: string;
}

export const DatabaseTrigger: React.FC<DatabaseTriggerProps> = ({
  triggerName = 'tr_after_render_completed',
  eventTiming = 'AFTER UPDATE OF status ON render_jobs',
  functionCalled = 'EXECUTE FUNCTION notify_lambda_webhook()',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          DATABASE TRIGGER
        </span>
        <span className="text-rose-400 font-bold">EVENT LISTENER</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between font-mono">
        <div>
          <div className="text-sm font-bold text-white">⚡ {triggerName}</div>
          <div className="text-xs text-rose-400 mt-0.5">{eventTiming}</div>
        </div>

        <div className="p-3 bg-zinc-950 rounded border border-white/10 text-xs my-2">
          <span className="text-white/40 text-[10px] block mb-1">TRIGGER ACTION:</span>
          <span className="text-emerald-400 font-bold">{functionCalled}</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ROW-LEVEL TRIGGER (FOR EACH ROW)</span>
        <span>ZERO ASYNC POLLING OVERHEAD</span>
      </div>
    </div>
  );
};
