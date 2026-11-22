import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ElectricFieldProps {
  chargeA?: number; // positive
  chargeB?: number; // negative
  voltageVolts?: number;
  className?: string;
}

export const ElectricField: React.FC<ElectricFieldProps> = ({
  chargeA = 1,
  chargeB = -1,
  voltageVolts = 240,
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
        className="w-full max-w-sm rounded-3xl p-5 border border-sky-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 14, 24, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(14, 165, 233, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-sky-400 font-bold uppercase tracking-wider text-[10px]">
            COULOMB ELECTROSTATIC FIELD LINES
          </span>
          <span className="text-zinc-500 text-[10px]">{voltageVolts} V POTENTIAL</span>
        </div>

        {/* Electric Field Flux Lines SVG */}
        <div className="relative h-40 my-3 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 240 140">
            {/* Field Vector Lines (Curving + to -) */}
            <path d="M 60,70 Q 120,15 180,70" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 4" opacity="0.7" />
            <path d="M 60,70 Q 120,-15 180,70" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            <path d="M 60,70 L 180,70" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" opacity="0.9" />
            <path d="M 60,70 Q 120,125 180,70" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 4" opacity="0.7" />
            <path d="M 60,70 Q 120,155 180,70" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

            {/* Positive Charge (+) */}
            <circle cx="60" cy="70" r="16" fill="#ef4444" filter="drop-shadow(0 0 8px #ef4444)" />
            <text x="60" y="76" fill="#ffffff" fontWeight="black" fontSize="18" textAnchor="middle">+</text>

            {/* Negative Charge (-) */}
            <circle cx="180" cy="70" r="16" fill="#3b82f6" filter="drop-shadow(0 0 8px #3b82f6)" />
            <text x="180" y="75" fill="#ffffff" fontWeight="black" fontSize="20" textAnchor="middle">-</text>
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-zinc-400">
          <span>Vector: Diverging (+) → Converging (-)</span>
          <span className="text-sky-300 font-bold">E = k·q/r²</span>
        </div>
      </div>
    </div>
  );
};
