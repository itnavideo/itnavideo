import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface MultiCameraViewProps {
  activeCamera?: 1 | 2 | 3 | 4;
  className?: string;
}

export const MultiCameraView: React.FC<MultiCameraViewProps> = ({
  activeCamera = 1,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const cameras = [
    { id: 1, label: 'CAM 1 (WIDE A)', angle: 'Front Stage' },
    { id: 2, label: 'CAM 2 (CU B)', angle: 'Speaker Face' },
    { id: 3, label: 'CAM 3 (REACTION C)', angle: 'Audience' },
    { id: 4, label: 'CAM 4 (OVERHEAD D)', angle: 'Top Down' },
  ];

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
          MULTICAM DIRECTORS MONITOR (4-UP)
        </span>
        <span className="text-white/40">SYNC TIMECODE LOCKED</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-2 gap-3">
        {cameras.map((c) => {
          const isActive = c.id === activeCamera;
          return (
            <div
              key={c.id}
              className={"rounded-lg border p-3 flex flex-col justify-between transition-all " + (
                isActive ? 'border-red-500 bg-red-950/20' : 'border-white/10 bg-zinc-900/80'
              )}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold">{c.label}</span>
                {isActive && (
                  <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px] animate-pulse">
                    ON AIR (TALLY)
                  </span>
                )}
              </div>
              <div className="text-center text-xs text-white/50">{c.angle}</div>
              <div className="text-[9px] text-white/40">F: {frame}</div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SWITCHING LATENCY: 0 FRAMES</span>
        <span>AUDIO SOURCE: CAM 1</span>
      </div>
    </div>
  );
};
