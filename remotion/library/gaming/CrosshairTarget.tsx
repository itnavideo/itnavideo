import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CrosshairTargetProps {
  targetLocked?: boolean;
  targetName?: string;
  distanceMeters?: number;
  reticleColor?: string;
  className?: string;
}

export const CrosshairTarget: React.FC<CrosshairTargetProps> = ({
  targetLocked = true,
  targetName = 'HOSTILE_ALPHA',
  distanceMeters = 342,
  reticleColor = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const lockPop = spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 220 } });
  const spinRing = (frame * 1.5) % 360;

  return (
    <div
      className={`relative flex items-center justify-center w-64 h-64 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      {/* Outer Rotating Reticle Ring */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 200"
        style={{ transform: `rotate(${spinRing}deg)` }}
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={targetLocked ? reticleColor : '#06b6d4'}
          strokeWidth="1.5"
          strokeDasharray="20 15 40 15"
          opacity="0.6"
        />
      </svg>

      {/* Target Lock Diamond Corner Brackets */}
      <div
        className="w-32 h-32 relative border-2 border-transparent transition-all"
        style={{
          transform: targetLocked ? `scale(${interpolate(lockPop, [0, 0.5, 1], [1.3, 0.95, 1])})` : 'scale(1)',
        }}
      >
        {/* Top-Left */}
        <div
          className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2"
          style={{ borderColor: targetLocked ? reticleColor : '#06b6d4' }}
        />
        {/* Top-Right */}
        <div
          className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2"
          style={{ borderColor: targetLocked ? reticleColor : '#06b6d4' }}
        />
        {/* Bottom-Left */}
        <div
          className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2"
          style={{ borderColor: targetLocked ? reticleColor : '#06b6d4' }}
        />
        {/* Bottom-Right */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2"
          style={{ borderColor: targetLocked ? reticleColor : '#06b6d4' }}
        />

        {/* Center Precision Crosshair Cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-red-500/60" />
          <div className="h-full w-[1px] bg-red-500/60 absolute" />
          <div className="w-3 h-3 rounded-full border border-red-500 absolute" />
          <div className="w-1 h-1 rounded-full bg-red-500 absolute" />
        </div>
      </div>

      {/* Target Telemetry HUD Pill */}
      <div
        className="absolute -bottom-6 flex flex-col items-center bg-black/80 px-3 py-1 rounded border border-white/10 backdrop-blur font-mono text-[10px]"
        style={{
          borderColor: targetLocked ? `${reticleColor}60` : 'rgba(255,255,255,0.1)',
        }}
      >
        <span className="font-bold tracking-wider" style={{ color: targetLocked ? reticleColor : '#38bdf8' }}>
          {targetLocked ? '● TARGET LOCKED' : 'SEARCHING...'}
        </span>
        <div className="flex items-center gap-2 text-zinc-400 mt-0.5">
          <span>{targetName}</span>
          <span>•</span>
          <span className="text-white font-semibold">{distanceMeters}m</span>
        </div>
      </div>
    </div>
  );
};
