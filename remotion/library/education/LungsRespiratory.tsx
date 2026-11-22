import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LungsRespiratoryProps {
  vitalCapacityL?: number;
  breathsPerMinute?: number;
  phase?: 'INHALATION' | 'EXHALATION';
  className?: string;
}

export const LungsRespiratory: React.FC<LungsRespiratoryProps> = ({
  vitalCapacityL = 4.8,
  breathsPerMinute = 14,
  phase = 'INHALATION',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // Breath expansion animation
  const breath = Math.sin(frame * 0.1) * 0.08 + 1;

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-sky-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 16, 24, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(14, 165, 233, 0.2)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-sky-400 font-bold uppercase tracking-wider text-[10px]">
            RESPIRATORY ALVEOLAR EXCHANGE
          </span>
          <span className="text-zinc-500 text-[10px]">{breathsPerMinute} BPM</span>
        </div>

        {/* Dual Lung Graphic */}
        <div className="h-36 my-2 flex items-center justify-center gap-6" style={{ transform: `scale(${breath})` }}>
          {/* Left Lung */}
          <div className="w-16 h-28 rounded-t-full rounded-br-2xl bg-gradient-to-br from-sky-400 to-indigo-600 border border-white/20 p-2 shadow-lg flex flex-col justify-end">
            <span className="text-[9px] text-white/80 font-bold">L. Lobe</span>
          </div>

          {/* Trachea Center Branch */}
          <div className="w-1.5 h-20 bg-zinc-600 rounded-full" />

          {/* Right Lung */}
          <div className="w-16 h-28 rounded-t-full rounded-bl-2xl bg-gradient-to-bl from-sky-400 to-indigo-600 border border-white/20 p-2 shadow-lg flex flex-col justify-end">
            <span className="text-[9px] text-white/80 font-bold">R. Lobe</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-cyan-300 font-bold">O₂ Intake ⇄ CO₂ Out</span>
          <span className="text-zinc-400 text-[10px]">Capacity: {vitalCapacityL} L</span>
        </div>
      </div>
    </div>
  );
};
