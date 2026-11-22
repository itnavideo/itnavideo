import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TechnicalAnnotationProps {
  dimension?: string;
  tolerance?: string;
  className?: string;
}

export const TechnicalAnnotation: React.FC<TechnicalAnnotationProps> = ({
  dimension = 'Ø 45.00 mm',
  tolerance = '± 0.02',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          CAD LEADER & TOLERANCE
        </span>
        <span className="text-white/40">ISO 1101 STANDARD</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-2 border-2 border-amber-400 bg-amber-950/20 px-4 py-2 rounded">
          <span className="text-lg font-black text-amber-300">{dimension}</span>
          <span className="text-xs text-white/60">{tolerance}</span>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>GEOMETRIC DIMENSIONING (GD&T)</span>
        <span>DATUM: A</span>
      </div>
    </div>
  );
};
