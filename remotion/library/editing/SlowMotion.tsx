import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface SlowMotionProps {
  speedRate?: number;
  title?: string;
  accentColor?: string;
  className?: string;
}

export const SlowMotion: React.FC<SlowMotionProps> = ({
  speedRate = 0.25,
  title = 'CINEMATIC 120 FPS CAPTURE',
  accentColor = '#3b82f6',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const simulatedTime = (frame * speedRate).toFixed(2);

  return (
    <div className={"relative w-full h-full flex flex-col justify-between p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white overflow-hidden " + className}>
      <div className="flex items-center justify-between z-10 font-mono text-xs">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          SLOW MOTION ({(speedRate * 100).toFixed(0)}%)
        </span>
        <span className="text-white/40">SENSOR: 120 FPS</span>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-950/40 to-zinc-900 border border-white/10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">{title}</h2>
        <div className="text-sm font-mono text-blue-300">
          Slowed Duration Factor: {1 / speedRate}x
        </div>
        <div className="text-xs font-mono text-white/40 mt-1">Elapsed Scene Time: {simulatedTime}s</div>
      </div>

      <div className="font-mono text-xs text-white/50 flex justify-between">
        <span>TIMELINE: {frame}f</span>
        <span>OPTICAL BLENDING: ACTIVE</span>
      </div>
    </div>
  );
};
