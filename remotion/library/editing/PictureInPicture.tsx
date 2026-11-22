import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PictureInPictureProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  pipWidthPercent?: number;
  className?: string;
  children?: React.ReactNode;
}

export const PictureInPicture: React.FC<PictureInPictureProps> = ({
  position = 'bottom-right',
  pipWidthPercent = 30,
  className = '',
  children,
}) => {
  const frame = useCurrentFrame();

  const posClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }[position];

  return (
    <div className={"relative w-full h-full bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden text-white " + className}>
      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
        <span className="font-mono text-sm text-white/40">MAIN FOOTAGE CANVAS</span>
      </div>

      <div
        className={"absolute " + posClasses + " rounded-xl border-2 border-white/30 bg-black/85 shadow-2xl overflow-hidden p-2 flex flex-col justify-between font-mono"}
        style={{ width: pipWidthPercent + '%', height: '28%' }}
      >
        <div className="flex justify-between items-center text-[10px] text-white/70">
          <span>PIP PRESENTER</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-center text-xs text-emerald-400 font-bold">WEBCAM CAM 2</div>
        <div className="text-[9px] text-white/40 text-right">SYNC</div>
      </div>
    </div>
  );
};
