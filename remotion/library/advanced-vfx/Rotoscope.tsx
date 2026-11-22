import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RotoscopeProps {
  strokeColor?: string;
  fillOpacity?: number;
  label?: string;
  className?: string;
}

export const Rotoscope: React.FC<RotoscopeProps> = ({
  strokeColor = '#38bdf8',
  fillOpacity = 0.25,
  label = 'AI ROTOSCOPE MATTE',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * 0.1) * 6;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs z-10">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          ROTOSCOPE SPLINE MASK
        </span>
        <span className="text-white/40">BEZIER POINTS: 14</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        <svg className="w-64 h-64" viewBox="0 0 200 200">
          <path
            d={"M 100,30 Q " + (140 + wave) + ",40 150,90 T " + (130 - wave) + ",160 T 70,150 T " + (50 + wave) + ",80 Z"}
            fill={strokeColor}
            fillOpacity={fillOpacity}
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <circle cx="100" cy="30" r="3" fill="#fff" />
          <circle cx={150} cy={90} r="3" fill="#fff" />
          <circle cx={130 - wave} cy={160} r="3" fill="#fff" />
          <circle cx="70" cy="150" r="3" fill="#fff" />
          <circle cx={50 + wave} cy={80} r="3" fill="#fff" />
        </svg>
        <div className="absolute bottom-3 text-xs text-sky-300 font-bold">{label}</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between z-10">
        <span>INTERPOLATION: SUB-PIXEL</span>
        <span>EDGE FEATHER: 2.0px</span>
      </div>
    </div>
  );
};
