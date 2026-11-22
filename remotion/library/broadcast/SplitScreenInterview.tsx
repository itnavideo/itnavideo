import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SplitScreenInterviewProps {
  hostName?: string;
  hostTitle?: string;
  guestName?: string;
  guestTitle?: string;
  activeSpeaker?: 'host' | 'guest' | 'both';
  className?: string;
}

export const SplitScreenInterview: React.FC<SplitScreenInterviewProps> = ({
  hostName = 'David Brooks',
  hostTitle = 'Studio Anchor • New York',
  guestName = 'Dr. Elena Rostova',
  guestTitle = 'Director of Quantum Computing • Zurich',
  activeSpeaker = 'guest',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`w-full p-4 pointer-events-none flex flex-col justify-end font-sans ${className}`}
      style={{
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        opacity: enter,
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Host Name Bar */}
        <div
          className={`p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 ${
            activeSpeaker === 'host' || activeSpeaker === 'both'
              ? 'bg-zinc-900/90 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
              : 'bg-zinc-950/70 border-white/10 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white font-black text-sm">{hostName}</span>
            {activeSpeaker === 'host' && (
              <span className="px-1.5 py-0.5 rounded bg-sky-500 text-black font-mono font-bold text-[9px]">
                SPEAKING
              </span>
            )}
          </div>
          <span className="text-zinc-400 text-[11px] truncate block mt-0.5">{hostTitle}</span>
        </div>

        {/* Guest Name Bar */}
        <div
          className={`p-3 rounded-xl border backdrop-blur-xl transition-all duration-300 ${
            activeSpeaker === 'guest' || activeSpeaker === 'both'
              ? 'bg-zinc-900/90 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
              : 'bg-zinc-950/70 border-white/10 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white font-black text-sm">{guestName}</span>
            {activeSpeaker === 'guest' && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-black font-mono font-bold text-[9px]">
                SPEAKING
              </span>
            )}
          </div>
          <span className="text-zinc-400 text-[11px] truncate block mt-0.5">{guestTitle}</span>
        </div>
      </div>
    </div>
  );
};
