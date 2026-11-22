import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MidnightChimeProps {
  status?: string;
  className?: string;
}

export const MidnightChime: React.FC<MidnightChimeProps> = ({
  status = 'THE WITCHING HOUR • NEW DAY BEGINS',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-72 bg-black border border-purple-500/40 rounded-2xl p-5 font-mono text-white shadow-2xl text-center " + className}>
      <div className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-2">MIDNIGHT CHIME</div>
      <div className="text-5xl font-black text-purple-300 tracking-wider mb-2 shadow-sm animate-pulse">00:00</div>
      <div className="text-[10px] text-white/50 uppercase">{status}</div>
    </div>
  );
};
