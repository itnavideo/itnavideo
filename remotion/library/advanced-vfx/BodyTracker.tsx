import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BodyTrackerProps {
  keypoints?: number;
  className?: string;
}

export const BodyTracker: React.FC<BodyTrackerProps> = ({
  keypoints = 17,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const armSway = Math.sin(frame * 0.1) * 8;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          FULL-BODY POSE ESTIMATION
        </span>
        <span className="text-white/40">BLAZEPOSE 3D</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-48 h-56" viewBox="0 0 100 120">
          <circle cx="50" cy="20" r="8" fill="#3b82f6" />
          <line x1="50" y1="28" x2="50" y2="70" stroke="#3b82f6" strokeWidth="3" />
          {/* Arms */}
          <line x1="50" y1="36" x2={25 + armSway} y2="55" stroke="#3b82f6" strokeWidth="2.5" />
          <line x1="50" y1="36" x2={75 - armSway} y2="55" stroke="#3b82f6" strokeWidth="2.5" />
          {/* Legs */}
          <line x1="50" y1="70" x2="35" y2="105" stroke="#3b82f6" strokeWidth="2.5" />
          <line x1="50" y1="70" x2="65" y2="105" stroke="#3b82f6" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>SKELETAL JOINTS: {keypoints}</span>
        <span>KINEMATICS: 30 FPS REALTIME</span>
      </div>
    </div>
  );
};
