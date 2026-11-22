import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BlackHoleVisualizationProps {
  blackHoleName?: string;
  solarMasses?: string;
  spinParameter?: string;
  className?: string;
}

export const BlackHoleVisualization: React.FC<BlackHoleVisualizationProps> = ({
  blackHoleName = 'SAGITTARIUS A* SINGULARITY',
  solarMasses = '4.15 × 10⁶ M☉ (SUPERMASSIVE)',
  spinParameter = 'a* = 0.92 KERR METRIC',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const diskRotation = (frame * 3) % 360;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-purple-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(6, 6, 12, 0.98)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.95), 0 0 35px rgba(168, 85, 247, 0.25)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px]">
            {blackHoleName}
          </span>
          <span className="text-zinc-500 text-[10px]">EVENT HORIZON</span>
        </div>

        {/* Accretion Disk & Singularity Shadow */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-3">
          {/* Relativistic Accretion Disk Glow */}
          <div
            className="absolute w-44 h-16 rounded-full blur-sm origin-center"
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #ef4444, #7c3aed)',
              transform: `rotate(${diskRotation}deg)`,
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
            }}
          />

          {/* Gravitational Photon Ring */}
          <div className="w-24 h-24 rounded-full border-2 border-amber-300 shadow-[0_0_20px_#fde047] z-10 flex items-center justify-center">
            {/* Black Hole Singularity Shadow (Pitch Black Event Horizon) */}
            <div className="w-20 h-20 rounded-full bg-black shadow-2xl z-20" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span className="truncate">{solarMasses}</span>
          <span className="text-purple-300 font-bold">{spinParameter}</span>
        </div>
      </div>
    </div>
  );
};
