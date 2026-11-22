import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TritoneProps {
  shadowColor?: string;
  midColor?: string;
  highlightColor?: string;
  className?: string;
}

export const Tritone: React.FC<TritoneProps> = ({
  shadowColor = '#0f172a',
  midColor = '#0284c7',
  highlightColor = '#fbbf24',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          TRITONE COLOR MATRIX
        </span>
        <span className="text-white/40">3-POINT SPLIT</span>
      </div>

      <div
        className="flex-1 my-4 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(to right, ' + shadowColor + ' 0%, ' + midColor + ' 50%, ' + highlightColor + ' 100%)',
        }}
      >
        <div className="text-2xl font-black text-white drop-shadow-md">TRITONE FILM RAMP</div>
        <div className="text-xs text-white/80 mt-1">Deep Navy ➔ Azure ➔ Warm Gold</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>MIDPOINT PIVOT: 50%</span>
        <span>SMOOTH INTERPOLATION</span>
      </div>
    </div>
  );
};
