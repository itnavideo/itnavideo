import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export interface SpeedRampProps {
  startSpeed?: number;
  slowSpeed?: number;
  snapSpeed?: number;
  rampInFrame?: number;
  rampOutFrame?: number;
  accentColor?: string;
  className?: string;
}

export const SpeedRamp: React.FC<SpeedRampProps> = ({
  startSpeed = 1.0,
  slowSpeed = 0.2,
  snapSpeed = 3.5,
  rampInFrame = 30,
  rampOutFrame = 65,
  accentColor = '#f59e0b',
  className = '',
}) => {
  const frame = useCurrentFrame();

  const currentSpeed = interpolate(
    frame,
    [0, rampInFrame, rampInFrame + 10, rampOutFrame, rampOutFrame + 10, 100],
    [startSpeed, startSpeed, slowSpeed, slowSpeed, snapSpeed, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const blurAmount = currentSpeed > 2.0 ? Math.min(12, (currentSpeed - 2.0) * 8) : 0;

  return (
    <div className={"relative w-full h-full flex flex-col justify-between p-6 bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden text-white " + className}>
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
            SPEED RAMP CURVE
          </span>
          <span className="text-xl font-mono font-black" style={{ color: accentColor }}>
            {currentSpeed.toFixed(2)}x
          </span>
        </div>
        <div className="text-xs font-mono text-white/50">T-REMAP VELOCITY</div>
      </div>

      <div
        className="flex-1 my-4 flex items-center justify-center relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900/90"
        style={{
          filter: blurAmount > 0 ? ('blur(' + blurAmount + 'px)') : undefined,
          transform: currentSpeed > 2.0 ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.1s ease',
        }}
      >
        <div className="text-center">
          <div className="text-5xl font-black mb-2 tracking-tighter">
            {currentSpeed < 0.5 ? 'SLOW-MO IMPACT' : currentSpeed > 2.0 ? 'SNAP ACCELERATION' : 'NORMAL PLAYBACK'}
          </div>
          <div className="text-sm font-mono text-white/60">
            Speed: {currentSpeed.toFixed(2)}x Velocity
          </div>
        </div>
      </div>

      <div className="h-16 w-full bg-black/60 rounded-xl border border-white/10 p-2 flex items-end">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path
            d="M 0,25 Q 30,25 35,35 T 65,35 Q 70,10 75,5 L 100,25"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <line
            x1={Math.min(100, Math.max(0, frame))}
            y1="0"
            x2={Math.min(100, Math.max(0, frame))}
            y2="40"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </svg>
      </div>
    </div>
  );
};
