import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StudioCameraRecBugProps {
  timecode?: string;
  resolution?: string;
  fps?: number;
  batteryPercent?: number;
  className?: string;
}

export const StudioCameraRecBug: React.FC<StudioCameraRecBugProps> = ({
  timecode = '01:24:50:18',
  resolution = '4K UHD 3840x2160',
  fps = 30,
  batteryPercent = 94,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps: videoFps } = useVideoConfig();

  const enter = spring({ frame, fps: videoFps, config: { damping: 14, stiffness: 120 } });
  const isRecFlashing = frame % 30 < 15;

  return (
    <div
      className={`p-3 flex items-center font-mono pointer-events-none ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/15 backdrop-blur-2xl shadow-xl bg-black/80 text-xs">
        {/* Flashing RED REC Dot */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full bg-red-600 ${
              isRecFlashing ? 'opacity-100 shadow-[0_0_8px_#ef4444]' : 'opacity-30'
            }`}
          />
          <span className="text-white font-black text-xs tracking-wider">REC</span>
        </div>

        {/* Timecode */}
        <span className="text-white font-black text-xs tracking-tight border-l border-white/10 pl-2.5">
          {timecode}
        </span>

        {/* Resolution & FPS */}
        <span className="text-zinc-400 text-[10px] hidden md:inline border-l border-white/10 pl-2.5">
          {resolution} @ {fps}fps
        </span>

        {/* Battery */}
        <span className="text-emerald-400 font-bold text-[10px] border-l border-white/10 pl-2.5">
          🔋 {batteryPercent}%
        </span>
      </div>
    </div>
  );
};
