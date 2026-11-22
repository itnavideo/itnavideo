import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SpeedometerHUDProps {
  speed?: number;
  maxSpeed?: number;
  gear?: 'P' | 'R' | 'N' | 'D' | 'S';
  unit?: 'MPH' | 'KM/H';
  boostActive?: boolean;
  className?: string;
}

export const SpeedometerHUD: React.FC<SpeedometerHUDProps> = ({
  speed = 142,
  maxSpeed = 200,
  gear = 'S',
  unit = 'KM/H',
  boostActive = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const dialSpring = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 100 } });

  const speedRatio = Math.min(1, Math.max(0, speed / maxSpeed));
  // Needle sweep angle from -135deg to +135deg (total 270 degrees)
  const needleAngle = -135 + speedRatio * dialSpring * 270;

  return (
    <div
      className={`flex items-center justify-center p-3 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-72 h-72 rounded-full border border-cyan-500/20 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(6, 182, 212, 0.25)',
        }}
      >
        {/* Circular SVG Gauge Track & Tick Marks */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Background arc */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            strokeDasharray="386 128"
            strokeDashoffset="-64"
            strokeLinecap="round"
          />
          {/* Active speed progress arc */}
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke={boostActive ? '#06b6d4' : '#38bdf8'}
            strokeWidth="8"
            strokeDasharray={`${386 * speedRatio * dialSpring} 514`}
            strokeDashoffset="-64"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))',
            }}
          />
        </svg>

        {/* Speedometer Needle */}
        <div
          className="absolute w-1 h-28 origin-bottom flex flex-col items-center pointer-events-none"
          style={{
            transform: `rotate(${needleAngle}deg)`,
            top: '20px',
            transition: 'transform 0.05s ease-out',
          }}
        >
          <div className="w-1.5 h-20 bg-gradient-to-t from-cyan-400 to-rose-500 rounded-full shadow-[0_0_10px_#f43f5e]" />
        </div>

        {/* Center Pivot Hub */}
        <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-cyan-400 flex items-center justify-center z-10 shadow-lg">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Digital Speed Readout */}
        <div className="flex flex-col items-center mt-6 z-10 font-mono">
          <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">
            {Math.round(speed * dialSpring)}
          </span>
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest">{unit}</span>
        </div>

        {/* Gear and Boost Indicators */}
        <div className="flex items-center gap-3 mt-2 z-10 text-xs font-mono">
          <div className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
            GEAR: {gear}
          </div>
          {boostActive && (
            <div className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-400 font-black animate-pulse">
              NITRO BOOST
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
