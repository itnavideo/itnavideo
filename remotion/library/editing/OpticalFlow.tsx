import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface OpticalFlowProps {
  gridSize?: number;
  arrowColor?: string;
  className?: string;
}

export const OpticalFlow: React.FC<OpticalFlowProps> = ({
  gridSize = 6,
  arrowColor = '#10b981',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between overflow-hidden " + className}>
      <div className="flex justify-between items-center font-mono text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          OPTICAL FLOW VECTOR FIELD
        </span>
        <span className="text-white/40">LUCAS-KANADE ESTIMATOR</span>
      </div>

      <div className="flex-1 my-4 rounded-xl bg-black/60 border border-white/10 relative p-4 flex items-center justify-center">
        <div className="grid grid-cols-6 gap-6">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = Math.sin((frame + i * 5) * 0.1) * 45;
            return (
              <div key={i} className="flex flex-col items-center justify-center">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={arrowColor}
                  strokeWidth="2"
                  style={{ transform: 'rotate(' + angle + 'deg)' }}
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      <div className="font-mono text-xs text-white/50 flex justify-between z-10">
        <span>MOTION DIRECTION: REALTIME</span>
        <span>CONFIDENCE: 98.4%</span>
      </div>
    </div>
  );
};
