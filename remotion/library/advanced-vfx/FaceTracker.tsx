import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface FaceTrackerProps {
  landmarksCount?: number;
  className?: string;
}

export const FaceTracker: React.FC<FaceTrackerProps> = ({
  landmarksCount = 68,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const blink = frame % 60 < 6;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          FACIAL LANDMARK MESH
        </span>
        <span className="text-white/40">{landmarksCount} 3D KEYPOINTS</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-4 relative flex items-center justify-center">
        <svg className="w-48 h-48" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="35" ry="42" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Eyes */}
          <ellipse cx="36" cy="42" rx="6" ry={blink ? 1 : 4} fill="none" stroke="#f43f5e" strokeWidth="1.5" />
          <ellipse cx="64" cy="42" rx="6" ry={blink ? 1 : 4} fill="none" stroke="#f43f5e" strokeWidth="1.5" />
          {/* Nose */}
          <path d="M 50,42 L 50,56 L 46,58 L 54,58" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
          {/* Mouth */}
          <path d="M 38,70 Q 50,78 62,70" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>YAW: 1.2° • PITCH: -0.4°</span>
        <span>EYE BLINK: {blink ? 'CLOSED' : 'OPEN'}</span>
      </div>
    </div>
  );
};
