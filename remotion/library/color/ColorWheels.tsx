import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ColorWheelsProps {
  className?: string;
}

export const ColorWheels: React.FC<ColorWheelsProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
          3-WAY COLOR WHEELS
        </span>
        <span className="text-white/40">LIFT / GAMMA / GAIN</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-3 gap-3 items-center">
        {['LIFT (Shadows)', 'GAMMA (Midtones)', 'GAIN (Highlights)'].map((wheel, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/20 relative flex items-center justify-center bg-gradient-to-tr from-blue-900/40 via-green-900/40 to-red-900/40 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-white shadow-md" />
            </div>
            <span className="text-[10px] text-white/70 mt-2 text-center">{wheel}</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>COLOR DISC: CIE 1931</span>
        <span>HUE PRECISION: 360°</span>
      </div>
    </div>
  );
};
