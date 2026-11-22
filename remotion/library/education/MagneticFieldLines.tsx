import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MagneticFieldLinesProps {
  fluxDensityTesla?: number;
  poleDistance?: number;
  className?: string;
}

export const MagneticFieldLines: React.FC<MagneticFieldLinesProps> = ({
  fluxDensityTesla = 1.45,
  poleDistance = 120,
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
        className="w-full max-w-sm rounded-2xl p-4 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 14, 24, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(6, 182, 212, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
            DIPOLE MAGNETIC FLUX LINES
          </span>
          <span className="text-zinc-500 text-[10px]">B = {fluxDensityTesla} T</span>
        </div>

        {/* Magnetic Field SVG */}
        <div className="relative h-36 my-2 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 120">
            {/* Curved Field Lines (Top & Bottom) */}
            <path d="M 60,60 Q 120,5 180,60" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 60,60 Q 120,-25 180,60" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            <path d="M 60,60 Q 120,115 180,60" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 60,60 Q 120,145 180,60" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

            {/* Bar Magnet: North Pole (Red) */}
            <rect x="50" y="45" width="70" height="30" fill="#ef4444" rx="4" />
            <text x="85" y="65" fill="#ffffff" fontWeight="bold" fontSize="14" textAnchor="middle">
              N
            </text>

            {/* Bar Magnet: South Pole (Blue) */}
            <rect x="120" y="45" width="70" height="30" fill="#3b82f6" rx="4" />
            <text x="155" y="65" fill="#ffffff" fontWeight="bold" fontSize="14" textAnchor="middle">
              S
            </text>
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span>Vector: North → South Flux</span>
          <span className="text-cyan-300">Lorentz Force F = q(v×B)</span>
        </div>
      </div>
    </div>
  );
};
