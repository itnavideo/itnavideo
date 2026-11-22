import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FastMotionProps {
  speedMultiplier?: number;
  title?: string;
  accentColor?: string;
  className?: string;
}

export const FastMotion: React.FC<FastMotionProps> = ({
  speedMultiplier = 8,
  title = 'TIMELAPSE SEQUENCE',
  accentColor = '#eab308',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const fastTime = frame * speedMultiplier;

  return (
    <div className={"relative w-full h-full flex flex-col justify-between p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white overflow-hidden " + className}>
      <div className="flex items-center justify-between z-10 font-mono text-xs">
        <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-bold border border-yellow-500/30">
          FAST FORWARD ►► {speedMultiplier}x
        </span>
        <span className="text-white/40">HYPERLAPSE</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center rounded-xl bg-zinc-900/90 border border-white/10">
        <div className="text-5xl font-mono font-black text-yellow-400 mb-2">
          +{fastTime}s
        </div>
        <div className="text-base font-bold tracking-tight">{title}</div>
      </div>

      <div className="font-mono text-xs text-white/50 flex justify-between">
        <span>BASE FPS: 30</span>
        <span>VELOCITY MULTIPLIER: {speedMultiplier}x</span>
      </div>
    </div>
  );
};
