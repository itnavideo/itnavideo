import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ViewerWarningProps {
  advisoryType?: string;
  details?: string;
  ageRating?: string;
  className?: string;
}

export const ViewerWarning: React.FC<ViewerWarningProps> = ({
  advisoryType = 'VIEWER DISCRETION ADVISED',
  details = 'The following video contains rapid flashing lights, high-intensity sound effects, and technical demonstrations.',
  ageRating = 'RATED PG-13',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-4 flex items-center justify-center font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 border border-amber-500/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center"
        style={{
          background: 'rgba(18, 14, 10, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.2)',
        }}
      >
        <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>

        <h3 className="text-amber-400 font-black text-sm tracking-widest uppercase">
          {advisoryType}
        </h3>

        <p className="text-zinc-300 text-xs mt-2 leading-relaxed">
          {details}
        </p>

        <span className="inline-block mt-3 px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold tracking-widest">
          {ageRating}
        </span>
      </div>
    </div>
  );
};
