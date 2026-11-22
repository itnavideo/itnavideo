import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GeometricProofProps {
  theoremName?: string;
  formula?: string;
  qed?: boolean;
  className?: string;
}

export const GeometricProof: React.FC<GeometricProofProps> = ({
  theoremName = 'PYTHAGOREAN THEOREM',
  formula = 'a² + b² = c²',
  qed = true,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const qedSlam = spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 220 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(18, 14, 10, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            EUCLIDEAN GEOMETRIC PROOF
          </span>
          <span className="text-zinc-500 text-[10px]">RIGHT TRIANGLE</span>
        </div>

        {/* Triangle Illustration with Sides a, b, c */}
        <div className="h-32 my-3 relative flex items-center justify-center">
          <svg className="w-48 h-full" viewBox="0 0 160 100">
            {/* Right Triangle */}
            <polygon points="30,85 130,85 30,20" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Right angle square mark */}
            <rect x="30" y="70" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Side labels */}
            <text x="15" y="55" fill="#ffffff" fontSize="12" fontWeight="bold">a</text>
            <text x="80" y="98" fill="#ffffff" fontSize="12" fontWeight="bold">b</text>
            <text x="90" y="45" fill="#facc15" fontSize="14" fontWeight="black">c</text>
          </svg>
        </div>

        {/* Formula & Q.E.D. */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
          <span className="text-white font-black text-base">{formula}</span>
          {qed && (
            <span
              className="px-2 py-0.5 rounded bg-amber-500 text-black font-black text-[10px] tracking-widest shadow-md"
              style={{ transform: `scale(${qedSlam})` }}
            >
              Q.E.D. ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
