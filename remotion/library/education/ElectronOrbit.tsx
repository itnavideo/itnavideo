import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ElectronOrbitProps {
  orbitalType?: string; // 1s, 2s, 2p, 3d
  electronsCount?: number;
  principalQuantumN?: number;
  className?: string;
}

export const ElectronOrbit: React.FC<ElectronOrbitProps> = ({
  orbitalType = '2p DUMBBELL ORBITAL',
  electronsCount = 6,
  principalQuantumN = 2,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const spin = (frame * 2.5) % 360;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-indigo-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 12, 22, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(99, 102, 241, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
            QUANTUM ELECTRON PROBABILITY CLOUD
          </span>
          <span className="text-zinc-500 text-[10px]">n = {principalQuantumN}</span>
        </div>

        {/* 3D Dumbbell / Sphere Quantum Orbital Visual */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
          {/* Probability Lobe 1 */}
          <div
            className="absolute w-20 h-36 rounded-full border border-indigo-400/40 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.3)] origin-center"
            style={{ transform: `rotate(${spin}deg)` }}
          />

          {/* Probability Lobe 2 (Perpendicular) */}
          <div
            className="absolute w-36 h-20 rounded-full border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.3)] origin-center"
            style={{ transform: `rotate(${spin + 90}deg)` }}
          />

          {/* Central Nucleus */}
          <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_12px_#ffffff] z-20" />
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span>{orbitalType}</span>
          <span className="text-cyan-300 font-bold">{electronsCount}e⁻ Max Shell</span>
        </div>
      </div>
    </div>
  );
};
