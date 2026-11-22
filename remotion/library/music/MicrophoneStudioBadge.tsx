import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MicrophoneStudioBadgeProps {
  micModel?: string;
  polarPattern?: string;
  gainDb?: string;
  className?: string;
}

export const MicrophoneStudioBadge: React.FC<MicrophoneStudioBadgeProps> = ({
  micModel = 'SHURE SM7B BROADCAST DYNAMIC',
  polarPattern = 'CARDIOID POLAR PATTERN',
  gainDb = '+60 dB CLOUDLIFTER',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-4 border border-zinc-700 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(16, 16, 20, 0.95)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center gap-3.5">
          {/* Microphone Icon Badge */}
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-600 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
            🎙️
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              STUDIO RECORDING GEAR
            </span>
            <h4 className="text-white font-bold text-xs truncate mt-0.5">{micModel}</h4>
            <span className="text-zinc-500 text-[10px] truncate block">{polarPattern}</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
          <span>Preamp: <strong className="text-emerald-400">{gainDb}</strong></span>
          <span className="text-rose-400 font-bold">● LIVE FEED</span>
        </div>
      </div>
    </div>
  );
};
