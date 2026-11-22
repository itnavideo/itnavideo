import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SubscriberMilestoneProps {
  milestone?: string;
  label?: string;
  channelName?: string;
  theme?: 'gold' | 'silver' | 'diamond';
  className?: string;
}

export const SubscriberMilestone: React.FC<SubscriberMilestoneProps> = ({
  milestone = '100,000',
  label = 'SUBSCRIBERS PASSED',
  channelName = 'ItnaVideo Studio',
  theme = 'gold',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const pulse = Math.sin(frame * 0.1) * 0.05 + 1;

  const themeStyles = {
    gold: {
      gradient: 'linear-gradient(135deg, #fbbf24, #d97706, #78350f)',
      glow: 'rgba(251, 191, 36, 0.4)',
      text: '#fef08a',
    },
    silver: {
      gradient: 'linear-gradient(135deg, #f1f5f9, #94a3b8, #334155)',
      glow: 'rgba(226, 232, 240, 0.4)',
      text: '#ffffff',
    },
    diamond: {
      gradient: 'linear-gradient(135deg, #67e8f9, #0284c7, #1e3a8a)',
      glow: 'rgba(6, 182, 212, 0.4)',
      text: '#cffafe',
    },
  }[theme];

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 border border-white/20 backdrop-blur-2xl shadow-2xl relative text-center overflow-hidden"
        style={{
          background: 'rgba(15, 15, 20, 0.95)',
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.9), 0 0 40px ${themeStyles.glow}`,
        }}
      >
        {/* Trophy icon */}
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-xl border border-white/20 mb-3"
          style={{
            background: themeStyles.gradient,
            transform: `scale(${pulse})`,
          }}
        >
          <svg className="w-8 h-8 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1c1.8-.46 3.16-1.92 3.61-3.96C19.08 11.63 21 9.55 21 7V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
          </svg>
        </div>

        {/* Milestone Number */}
        <h2
          className="text-4xl font-black tracking-tight"
          style={{
            background: themeStyles.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {milestone}
        </h2>

        {/* Label */}
        <p className="text-zinc-400 font-extrabold text-xs tracking-widest uppercase mt-1">
          {label}
        </p>

        {/* Channel Name */}
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-zinc-300 font-medium">
          Presented to <strong className="text-white font-bold">{channelName}</strong>
        </div>
      </div>
    </div>
  );
};
