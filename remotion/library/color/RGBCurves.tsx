import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RGBCurvesProps {
  activeChannel?: 'rgb' | 'r' | 'g' | 'b';
  className?: string;
}

export const RGBCurves: React.FC<RGBCurvesProps> = ({
  activeChannel = 'rgb',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          RGB TONAL CURVES
        </span>
        <div className="flex space-x-2 text-[10px]">
          <span className="text-white font-bold">RGB</span>
          <span className="text-red-400 font-bold">R</span>
          <span className="text-green-400 font-bold">G</span>
          <span className="text-blue-400 font-bold">B</span>
        </div>
      </div>

      <div className="flex-1 my-4 rounded-xl bg-black/70 border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-full h-44" viewBox="0 0 100 100">
          <line x1="0" y1="100" x2="100" y2="0" stroke="#333" strokeDasharray="2 2" strokeWidth="0.5" />
          <path d="M 0,100 C 35,90 65,10 100,0" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M 0,100 C 40,85 70,15 100,0" fill="none" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.7" />
          <path d="M 0,100 C 30,95 60,10 100,0" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.7" />
          <path d="M 0,100 C 35,88 65,18 100,0" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.7" />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CURVE TYPE: BEZIER SPLINE</span>
        <span>CONTROL POINTS: 4</span>
      </div>
    </div>
  );
};
