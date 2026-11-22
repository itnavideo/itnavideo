import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DrawingAnnotationProps {
  className?: string;
}

export const DrawingAnnotation: React.FC<DrawingAnnotationProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          FREEFORM SKETCH ANNOTATION
        </span>
        <span className="text-white/40">PEN DRAWING</span>
      </div>

      <div className="flex-1 my-4 bg-black/60 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-64 h-36" viewBox="0 0 200 100">
          <path
            d="M 20,80 Q 60,20 100,60 T 180,30"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>STROKE INTERPOLATION: ON</span>
        <span>LINE PRESSURE: VARIABLE</span>
      </div>
    </div>
  );
};
