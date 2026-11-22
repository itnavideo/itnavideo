import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FocusBoxProps {
  boxTitle?: string;
  className?: string;
}

export const FocusBox: React.FC<FocusBoxProps> = ({
  boxTitle = 'CRITICAL CODE BLOCK',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          SPOTLIGHT FOCUS BOX
        </span>
        <span className="text-white/40">DARKENED BACKDROP</span>
      </div>

      <div className="flex-1 my-4 bg-black/90 rounded-xl border border-white/10 relative p-4 flex items-center justify-center">
        <div className="w-56 h-28 border-2 border-emerald-400 bg-emerald-950/20 rounded-lg flex flex-col items-center justify-center p-3 shadow-2xl">
          <span className="text-xs font-bold text-emerald-400 mb-1">{boxTitle}</span>
          <span className="text-[10px] text-white/60 text-center">const response = await dispatch();</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>VIGNETTE OPACITY: 85%</span>
        <span>BORDER PULSE: SUBTLE</span>
      </div>
    </div>
  );
};
