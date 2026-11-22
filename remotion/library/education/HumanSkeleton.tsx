import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface HumanSkeletonProps {
  highlightedBone?: string;
  totalBones?: number;
  systemName?: string;
  className?: string;
}

export const HumanSkeleton: React.FC<HumanSkeletonProps> = ({
  highlightedBone = 'FEMUR (THIGH BONE)',
  totalBones = 206,
  systemName = 'HUMAN SKELETAL OSTEOLOGY',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 18, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-white font-bold uppercase tracking-wider text-[10px]">
            {systemName}
          </span>
          <span className="text-zinc-500 text-[10px]">{totalBones} ADULT BONES</span>
        </div>

        {/* Skeleton Schematic Outline */}
        <div className="h-40 my-3 flex items-center justify-center relative">
          <div className="flex flex-col items-center gap-1.5 opacity-80">
            {/* Cranium */}
            <div className="w-8 h-8 rounded-full border-2 border-zinc-400 bg-zinc-800 flex items-center justify-center text-[8px] text-zinc-300">
              Skull
            </div>
            {/* Spine & Ribs */}
            <div className="w-14 h-12 border-2 border-zinc-400 rounded-lg flex items-center justify-center text-[9px] text-zinc-300">
              Ribcage
            </div>
            {/* Pelvis */}
            <div className="w-12 h-6 border-2 border-zinc-400 rounded-sm flex items-center justify-center text-[8px] text-zinc-300">
              Pelvis
            </div>
            {/* Femur Highlight */}
            <div className="flex gap-4">
              <div className="w-2.5 h-10 rounded bg-cyan-400 border border-white shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <div className="w-2.5 h-10 rounded bg-cyan-400 border border-white shadow-[0_0_8px_#22d3ee] animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-cyan-400 font-bold">{highlightedBone}</span>
          <span className="text-zinc-500 text-[10px]">Longest & Strongest</span>
        </div>
      </div>
    </div>
  );
};
