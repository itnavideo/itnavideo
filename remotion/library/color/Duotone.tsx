import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DuotoneProps {
  shadowColor?: string;
  highlightColor?: string;
  presetName?: string;
  className?: string;
}

export const Duotone: React.FC<DuotoneProps> = ({
  shadowColor = '#1e1b4b',
  highlightColor = '#f43f5e',
  presetName = 'Midnight Rose (Spotify Style)',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">
          DUOTONE GRADIENT MAP
        </span>
        <span className="text-white/40">2-COLOR GRADIENT</span>
      </div>

      <div
        className="flex-1 my-4 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center shadow-inner"
        style={{
          background: 'linear-gradient(to right, ' + shadowColor + ', ' + highlightColor + ')',
        }}
      >
        <div className="text-2xl font-black text-white drop-shadow-md">{presetName}</div>
        <div className="text-xs text-white/80 mt-1 drop-shadow">Dual-Tone Color Ramp</div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SHADOW: {shadowColor}</span>
        <span>HIGHLIGHT: {highlightColor}</span>
      </div>
    </div>
  );
};
