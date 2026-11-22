import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AudioReactiveShapesProps {
  className?: string;
}

export const AudioReactiveShapes: React.FC<AudioReactiveShapesProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const scale = 1 + Math.sin(frame * 0.2) * 0.25;
  const rot = frame * 2;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
          GEOMETRIC SHAPE MORPH
        </span>
        <span className="text-white/40">AMPLITUDE SYNC</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <div
          className="w-28 h-28 border-4 border-teal-400 bg-teal-950/30 shadow-2xl transition-transform"
          style={{ transform: "scale(" + scale.toFixed(2) + ") rotate(" + rot + "deg)" }}
        />
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>MORPH TOPOLOGY: POLYGON</span>
        <span>SCALE FACTOR: {scale.toFixed(2)}x</span>
      </div>
    </div>
  );
};
