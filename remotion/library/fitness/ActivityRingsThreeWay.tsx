import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ActivityRingsThreeWayProps {
  movePercent?: number;
  exercisePercent?: number;
  standPercent?: number;
  className?: string;
}

export const ActivityRingsThreeWay: React.FC<ActivityRingsThreeWayProps> = ({
  movePercent = 110,
  exercisePercent = 85,
  standPercent = 100,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const fillProgress = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 80 } });

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
          background: 'rgba(12, 12, 16, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-white font-bold uppercase tracking-wider text-[10px]">
            ACTIVITY RINGS
          </span>
          <span className="text-emerald-400 font-bold text-[11px]">ALL TARGETS MET</span>
        </div>

        <div className="flex items-center gap-5 mt-3">
          {/* Concentric Trio of Rings */}
          <div className="w-24 h-24 relative flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Outer Ring: Move (Rose) */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(244,63,94,0.15)" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * Math.min(100, movePercent) * fillProgress) / 100}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
              />

              {/* Middle Ring: Exercise (Emerald) */}
              <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="32"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="201"
                strokeDashoffset={201 - (201 * Math.min(100, exercisePercent) * fillProgress) / 100}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
              />

              {/* Inner Ring: Stand (Cyan) */}
              <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="22"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="6"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * Math.min(100, standPercent) * fillProgress) / 100}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
              />
            </svg>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-zinc-400">Move:</span>
              <strong className="text-white">{movePercent}%</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-400">Exercise:</span>
              <strong className="text-white">{exercisePercent}%</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-zinc-400">Stand:</span>
              <strong className="text-white">{standPercent}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
