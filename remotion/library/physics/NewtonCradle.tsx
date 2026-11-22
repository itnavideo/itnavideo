import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NewtonCradleProps {
  className?: string;
}

export const NewtonCradle: React.FC<NewtonCradleProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const phase = frame % 40;
  const swingL = phase < 20 ? (Math.sin(phase * 0.16) * 35) : 0;
  const swingR = phase >= 20 ? (-Math.sin((phase - 20) * 0.16) * 35) : 0;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
          NEWTON'S CRADLE MOMENTUM
        </span>
        <span className="text-white/40">ELASTIC MOMENTUM</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-start">
        <div className="w-48 h-2 bg-zinc-600 rounded-xs mb-1" />
        <div className="flex justify-center space-x-1 h-32 items-start">
          <div
            className="w-0.5 h-24 bg-white/60 origin-top flex flex-col justify-end items-center"
            style={{ transform: "rotate(" + swingL.toFixed(1) + "deg)" }}
          >
            <div className="w-6 h-6 rounded-full bg-zinc-300 border border-zinc-600 shadow-md -mb-3" />
          </div>
          <div className="w-0.5 h-24 bg-white/60 origin-top flex flex-col justify-end items-center">
            <div className="w-6 h-6 rounded-full bg-zinc-300 border border-zinc-600 shadow-md -mb-3" />
          </div>
          <div className="w-0.5 h-24 bg-white/60 origin-top flex flex-col justify-end items-center">
            <div className="w-6 h-6 rounded-full bg-zinc-300 border border-zinc-600 shadow-md -mb-3" />
          </div>
          <div
            className="w-0.5 h-24 bg-white/60 origin-top flex flex-col justify-end items-center"
            style={{ transform: "rotate(" + swingR.toFixed(1) + "deg)" }}
          >
            <div className="w-6 h-6 rounded-full bg-zinc-300 border border-zinc-600 shadow-md -mb-3" />
          </div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CONSERVATION OF MOMENTUM</span>
        <span>ENERGY TRANSFER: 100%</span>
      </div>
    </div>
  );
};
