import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StarRatingCardProps {
  score?: number;
  maxScore?: number;
  totalReviews?: string;
  highlightText?: string;
  source?: string;
  className?: string;
}

export const StarRatingCard: React.FC<StarRatingCardProps> = ({
  score = 4.9,
  maxScore = 5,
  totalReviews = '2,480+ reviews',
  highlightText = '“The best video automation engine we have ever used.”',
  source = 'Trustpilot & G2 Crowd',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-5 border border-white/10 backdrop-blur-2xl shadow-2xl relative"
        style={{
          background: 'rgba(18, 18, 22, 0.94)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 30px rgba(251, 191, 36, 0.15)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Star Icons Animated Cascade */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const starSpring = spring({
                frame: frame - starIndex * 4,
                fps,
                config: { damping: 10, stiffness: 200 },
              });
              return (
                <div
                  key={starIndex}
                  style={{
                    transform: `scale(${starSpring})`,
                    opacity: starSpring,
                  }}
                >
                  <svg className="w-5 h-5 text-amber-400 fill-current drop-shadow-md" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* Numerical Score */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white">{score.toFixed(1)}</span>
            <span className="text-xs font-semibold text-zinc-500">/{maxScore}</span>
          </div>
        </div>

        {/* Highlight quote */}
        <p className="text-zinc-200 text-sm font-medium italic mt-3 leading-relaxed">
          {highlightText}
        </p>

        {/* Source & count footer */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold text-emerald-400">✓ Verified Customer</span>
          <span className="text-zinc-500">{totalReviews}</span>
        </div>
      </div>
    </div>
  );
};
