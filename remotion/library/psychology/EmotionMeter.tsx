import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface EmotionMeterProps {
  score?: number; // 0 to 100
  emotionLabel?: string;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  valence?: string;
  className?: string;
}

export const EmotionMeter: React.FC<EmotionMeterProps> = ({
  score = 82,
  emotionLabel = 'EUPHORIC DELIGHT & HIGH TRUST',
  sentiment = 'POSITIVE',
  valence = '+0.84 HIGH VALENCE',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const needleSpring = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 100 } });

  // Angle from -90deg (Negative) to +90deg (Positive)
  const angle = -90 + (score / 100) * needleSpring * 180;

  const sentimentColor =
    sentiment === 'POSITIVE' ? '#10b981' : sentiment === 'NEUTRAL' ? '#f59e0b' : '#ef4444';

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col items-center"
        style={{
          background: 'rgba(14, 16, 22, 0.95)',
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px ${sentimentColor}20`,
        }}
      >
        <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <span className="text-white font-bold uppercase tracking-wider text-[10px]">
            PSYCHOLOGICAL EMOTION & SENTIMENT METER
          </span>
          <span className="text-zinc-500 text-[10px]">PLUTCHIK SCALE</span>
        </div>

        {/* Semi-circular Gauge */}
        <div className="relative w-64 h-32 overflow-hidden my-3 flex items-end justify-center">
          <svg className="w-64 h-64 absolute -top-0" viewBox="0 0 200 200">
            {/* Background Arch Track */}
            <circle
              cx="100"
              cy="100"
              r="75"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="14"
              strokeDasharray="235.6 235.6"
              strokeDashoffset="117.8"
              strokeLinecap="round"
            />
            {/* Segment Colors (Negative Red, Neutral Amber, Positive Green) */}
            <circle
              cx="100"
              cy="100"
              r="75"
              fill="none"
              stroke={sentimentColor}
              strokeWidth="14"
              strokeDasharray={`${(235.6 * score * needleSpring) / 100} 300`}
              strokeDashoffset="117.8"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${sentimentColor})` }}
            />
          </svg>

          {/* Needle Indicator */}
          <div
            className="w-1 h-20 bg-gradient-to-t from-white to-transparent origin-bottom rounded-full shadow-lg z-10"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: 'bottom center',
              transition: 'transform 0.05s ease-out',
            }}
          />

          {/* Pivot Hub */}
          <div className="w-6 h-6 rounded-full bg-zinc-950 border-2 border-white absolute bottom-0 z-20" />
        </div>

        {/* Score & Sentiment Tag */}
        <div className="flex flex-col items-center mt-1 text-center">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{Math.round(score * needleSpring)}</span>
            <span className="text-zinc-500 text-xs font-bold">/100</span>
          </div>
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mt-1"
            style={{ backgroundColor: `${sentimentColor}25`, color: sentimentColor }}
          >
            {sentiment}
          </span>
          <p className="text-zinc-300 text-xs font-bold mt-1.5">{emotionLabel}</p>
        </div>

        <div className="w-full flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-white/10 mt-3">
          <span>Negative (-1.0)</span>
          <span className="text-white font-bold">{valence}</span>
          <span>Positive (+1.0)</span>
        </div>
      </div>
    </div>
  );
};
