import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface AnnotatedScreenshotProps {
  title?: string;
  pins?: { x: number; y: number; num: number; label: string }[];
  className?: string;
}

export const AnnotatedScreenshot: React.FC<AnnotatedScreenshotProps> = ({
  title = 'DASHBOARD ANALYTICS UI',
  pins = [
    { x: 30, y: 35, num: 1, label: 'Conversion Funnel' },
    { x: 75, y: 60, num: 2, label: 'Export Button' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
          ANNOTATED SCREENSHOT
        </span>
        <span className="text-white/40">{pins.length} CALLOUTS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 rounded-xl border border-white/15 relative overflow-hidden p-4">
        <div className="text-xs text-white/50 mb-2 font-bold">{title}</div>
        {pins.map((p) => (
          <div
            key={p.num}
            className="absolute flex items-center space-x-1.5"
            style={{ left: p.x + '%', top: p.y + '%' }}
          >
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-lg animate-bounce">
              {p.num}
            </div>
            <div className="px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[10px] text-white">
              {p.label}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>DEVICE: 1920x1080 DISPLAY</span>
        <span>CALLOUT BADGES: ACTIVE</span>
      </div>
    </div>
  );
};
