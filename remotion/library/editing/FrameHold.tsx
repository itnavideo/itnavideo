import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FrameHoldProps {
  holdStartFrame?: number;
  holdDuration?: number;
  label?: string;
  accentColor?: string;
  className?: string;
}

export const FrameHold: React.FC<FrameHoldProps> = ({
  holdStartFrame = 30,
  holdDuration = 45,
  label = 'DRAMATIC PAUSE / RECORD SCRATCH',
  accentColor = '#e11d48',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const isHolding = frame >= holdStartFrame && frame < holdStartFrame + holdDuration;

  return (
    <div className={"relative w-full h-full flex flex-col justify-between p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white " + className}>
      <div className="flex items-center justify-between z-10 font-mono text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          FRAME HOLD
        </span>
        <span className="text-white/40">HOLD LENGTH: {holdDuration}f</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
        <div className="text-center">
          <div className="text-3xl font-black mb-2">
            {isHolding ? '⏸ FRAME HELD STILL' : '▶ PLAYING FORWARD'}
          </div>
          <div className="text-xs font-mono text-white/50">{label}</div>
        </div>

        {isHolding && (
          <div className="absolute inset-0 border-4 border-rose-500/50 pointer-events-none animate-pulse" />
        )}
      </div>

      <div className="font-mono text-xs text-white/40 flex justify-between">
        <span>Timeline F: {frame}</span>
        <span style={{ color: isHolding ? accentColor : undefined }}>
          {isHolding ? 'STATUS: HOLD ACTIVE' : 'STATUS: NORMAL RUN'}
        </span>
      </div>
    </div>
  );
};
