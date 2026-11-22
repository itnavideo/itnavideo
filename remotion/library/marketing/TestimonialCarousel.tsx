import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface TestimonialCarouselProps {
  quote?: string;
  author?: string;
  role?: string;
  rating?: number;
  className?: string;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  quote = 'Itnavideo cut our editing overhead from 6 hours to 4 minutes per reel. Our organic impressions tripled in 30 days.',
  author = 'Sarah Jenkins',
  role = 'Head of Growth, ScaleMedia',
  rating = 5,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          VERIFIED SOCIAL PROOF
        </span>
        <span className="text-amber-400 font-bold">★★★★★ 5.0 RATING</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div className="text-sm font-medium text-white/90 italic leading-relaxed">
          "{quote}"
        </div>
        <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-white/10">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            SJ
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>{author}</span>
              <span className="text-emerald-400 text-[10px]">✔ VERIFIED</span>
            </div>
            <div className="text-[11px] text-white/50">{role}</div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>G2 SCORE: 4.9 / 5.0</span>
        <span>TRUSTPILOT: EXCELLENT</span>
      </div>
    </div>
  );
};
