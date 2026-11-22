import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MuscleGroup {
  name: string;
  type: string;
  action: string;
}

export interface HumanMuscleProps {
  primaryMuscle?: string;
  muscleType?: string;
  fiberActivationPercent?: number;
  contractionState?: 'CONCENTRIC' | 'ISOMETRIC' | 'ECCENTRIC';
  className?: string;
}

export const HumanMuscle: React.FC<HumanMuscleProps> = ({
  primaryMuscle = 'BICEPS BRACHII',
  muscleType = 'STRIATED SKELETAL MUSCLE',
  fiberActivationPercent = 88,
  contractionState = 'CONCENTRIC',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Muscle contraction flexing pump
  const flex = Math.sin(frame * 0.15) * 0.1 + 1;
  const fiberOffset = (frame * 3) % 40;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-rose-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(20, 10, 14, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(244, 63, 94, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">
            MUSCULAR SYSTEM ANATOMY
          </span>
          <span className="text-zinc-500 text-[10px]">{contractionState}</span>
        </div>

        {/* Muscle Fiber Diagram Visual */}
        <div className="h-36 my-3 relative flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950 border border-white/5">
          {/* Striated Muscle Belly Graphic */}
          <div
            className="w-48 h-20 rounded-full border-2 border-rose-500/60 bg-gradient-to-r from-rose-900/80 via-red-600/80 to-rose-900/80 flex items-center justify-center shadow-xl relative overflow-hidden"
            style={{
              transform: `scale(${flex})`,
              boxShadow: '0 0 20px rgba(225, 29, 72, 0.5)',
            }}
          >
            {/* Striation Fibers */}
            <div
              className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.2)_9px,transparent_10px)]"
              style={{ transform: `translateX(${fiberOffset}px)` }}
            />

            {/* Muscle Belly Label */}
            <span className="text-white font-black text-xs tracking-wider z-10 drop-shadow">
              {primaryMuscle}
            </span>
          </div>

          {/* Tendon Attachments on sides */}
          <div className="w-6 h-3 bg-zinc-300 rounded-l absolute left-4 border border-zinc-400 opacity-80" />
          <div className="w-6 h-3 bg-zinc-300 rounded-r absolute right-4 border border-zinc-400 opacity-80" />
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400">{muscleType}</span>
            <span className="text-white font-bold text-xs">Motor Unit Recruitment</span>
          </div>
          <div className="flex items-baseline gap-1 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/30">
            <span className="text-xl font-black text-rose-400">{fiberActivationPercent}%</span>
            <span className="text-[9px] text-zinc-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
