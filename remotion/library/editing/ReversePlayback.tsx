import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ReversePlaybackProps {
  totalFrames?: number;
  showScanlines?: boolean;
  accentColor?: string;
  className?: string;
}

export const ReversePlayback: React.FC<ReversePlaybackProps> = ({
  totalFrames = 90,
  showScanlines = true,
  accentColor = '#f43f5e',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const reversedFrame = Math.max(0, totalFrames - frame);

  return (
    <div className={"relative w-full h-full flex flex-col justify-between p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white overflow-hidden " + className}>
      {showScanlines && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 4px)',
          }}
        />
      )}

      <div className="flex items-center justify-between z-10 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold text-rose-400">REWIND ◄◄</span>
        </div>
        <div className="text-white/60">TAPE SPEED: -2.0x</div>
      </div>

      <div className="flex-1 my-4 flex flex-col items-center justify-center rounded-xl bg-zinc-900/90 border border-white/10 z-10">
        <div className="text-6xl font-mono font-black tracking-wider text-rose-400">
          -{reversedFrame.toString().padStart(4, '0')}
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-white/40 mt-3">
          INVERTED PLAYBACK VECTOR
        </div>
      </div>

      <div className="z-10 flex justify-between font-mono text-xs text-white/50">
        <span>RAW PLAYHEAD: {frame}</span>
        <span>OUTPUT REWIND: {reversedFrame}</span>
      </div>
    </div>
  );
};
