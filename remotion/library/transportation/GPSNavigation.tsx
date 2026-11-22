import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface GPSNavigationProps {
  instruction?: string;
  nextDistance?: string;
  currentRoad?: string;
  etaTime?: string;
  speedLimit?: number;
  className?: string;
}

export const GPSNavigation: React.FC<GPSNavigationProps> = ({
  instruction = 'In 250 meters, turn right onto Broadway',
  nextDistance = '250 M',
  currentRoad = 'W 42ND STREET',
  etaTime = '12:45 PM • 14 MIN',
  speedLimit = 35,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-2xl p-5 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      {/* Top Turn Banner */}
      <div className="bg-emerald-600 rounded-xl p-4 text-zinc-950 flex items-center gap-4 mb-4 shadow-lg">
        <div className="text-3xl font-black">➔</div>
        <div>
          <div className="text-xl font-mono font-black">{nextDistance}</div>
          <p className="text-xs font-sans font-bold leading-tight">{instruction}</p>
        </div>
      </div>

      {/* Road & Speed Info */}
      <div className="flex items-center justify-between font-mono text-xs text-zinc-300 border-b border-zinc-800 pb-3 mb-3">
        <div>
          <span className="text-[10px] text-zinc-500 block">CURRENT ROAD</span>
          <span className="font-bold text-zinc-100">{currentRoad}</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-white text-zinc-950 font-black flex items-center justify-center text-xs">
          {speedLimit}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>ETA: {etaTime}</span>
        <span className="text-emerald-400 font-bold">GPS LOCKED</span>
      </div>
    </div>
  );
};
