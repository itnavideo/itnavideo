import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CalloutConnectorProps {
  label?: string;
  className?: string;
}

export const CalloutConnector: React.FC<CalloutConnectorProps> = ({
  label = 'Key Revenue Driver',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          CALLOUT LEADER LINE
        </span>
        <span className="text-white/40">ELBOW CONNECTOR</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center">
        <svg className="w-64 h-36" viewBox="0 0 200 100">
          <circle cx="30" cy="70" r="4" fill="#f59e0b" />
          <polyline points="30,70 100,70 130,30 180,30" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        </svg>
        <div className="absolute right-6 top-8 px-3 py-1 rounded bg-amber-500 text-black font-black text-xs shadow-lg">
          {label}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ANCHOR TARGET: [30, 70]</span>
        <span>ANGLE: 45° ELBOW</span>
      </div>
    </div>
  );
};
