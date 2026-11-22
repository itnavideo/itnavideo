import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface WheelRotationProps {
  rpm?: number;
  className?: string;
}

export const WheelRotation: React.FC<WheelRotationProps> = ({
  rpm = 120,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const rot = frame * 6;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          ROLLING WHEEL KINEMATICS
        </span>
        <span className="text-white/40">{rpm} RPM</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex items-center justify-center">
        <div
          className="w-28 h-28 rounded-full border-4 border-zinc-700 bg-zinc-900 relative flex items-center justify-center shadow-xl"
          style={{ transform: "rotate(" + rot + "deg)" }}
        >
          <div className="w-full h-0.5 bg-amber-400 absolute" />
          <div className="h-full w-0.5 bg-amber-400 absolute" />
          <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-white" />
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>ANGULAR VELOCITY (ω): 12.5 rad/s</span>
        <span>SLIP RATIO: 0.0%</span>
      </div>
    </div>
  );
};
