import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FactCheckStampProps {
  status?: 'VERIFIED TRUE' | 'FALSE / DEBUNKED' | 'MISLEADING';
  topic?: string;
  source?: string;
  slamFrame?: number;
  className?: string;
}

export const FactCheckStamp: React.FC<FactCheckStampProps> = ({
  status = 'VERIFIED TRUE',
  topic = 'Claim: AI video rendering is 10x faster than traditional rendering',
  source = 'Source: Independent Render Benchmark Audit 2024',
  slamFrame = 15,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  // Heavy stamp slam physics
  const slam = spring({
    frame: frame - slamFrame,
    fps,
    config: { damping: 8, stiffness: 220 },
  });

  const isTrue = status === 'VERIFIED TRUE';
  const stampColor = isTrue ? '#10b981' : status === 'MISLEADING' ? '#f59e0b' : '#ef4444';

  return (
    <div
      className={`p-4 flex flex-col items-center justify-center font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(15, 15, 20, 0.95)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px ${stampColor}20`,
        }}
      >
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">
          INDEPENDENT FACT CHECK
        </span>
        <p className="text-zinc-200 text-xs font-semibold leading-relaxed mb-4">
          {topic}
        </p>

        {/* Big Slammed Stamp */}
        <div
          className="w-full py-2.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider shadow-lg"
          style={{
            borderColor: stampColor,
            color: stampColor,
            backgroundColor: `${stampColor}15`,
            transform: frame >= slamFrame
              ? `scale(${interpolate(slam, [0, 0.4, 1], [1.6, 0.92, 1])}) rotate(-2deg)`
              : 'scale(1.6)',
            opacity: frame >= slamFrame ? 1 : 0,
          }}
        >
          <span className="text-base">{isTrue ? '✓' : '✗'}</span>
          <span>{status}</span>
        </div>

        <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-zinc-500 truncate">
          {source}
        </div>
      </div>
    </div>
  );
};
