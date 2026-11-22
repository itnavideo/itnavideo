import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ObjectTrackerProps {
  objectName?: string;
  confidence?: number;
  className?: string;
}

export const ObjectTracker: React.FC<ObjectTrackerProps> = ({
  objectName = 'Sports Car',
  confidence = 97.8,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const tx = Math.sin(frame * 0.05) * 30;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
          AI OBJECT DETECTION & TRACKING
        </span>
        <span className="text-white/40">YOLOv8 DETECTOR</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 relative p-4 flex items-center justify-center overflow-hidden">
        <div
          className="w-56 h-32 border-2 border-violet-500 bg-violet-950/20 rounded p-2 flex flex-col justify-between"
          style={{ transform: "translateX(" + tx + "px)" }}
        >
          <div className="flex justify-between text-[10px] text-violet-300 font-bold">
            <span>{objectName}</span>
            <span>{confidence}%</span>
          </div>
          <div className="text-center text-xs text-white/40">BBOX LOCKED</div>
          <div className="text-[9px] text-white/30 text-right">ID: #4092</div>
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>TRACK ID: #4092 (PERSISTENT)</span>
        <span>OCCLUSION SENSITIVITY: HIGH</span>
      </div>
    </div>
  );
};
