import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TopicDiscussionCardProps {
  segmentNumber?: string;
  topicTitle?: string;
  bulletPoints?: string[];
  className?: string;
}

export const TopicDiscussionCard: React.FC<TopicDiscussionCardProps> = ({
  segmentNumber = 'SEGMENT 03',
  topicTitle = 'The Economics of Autonomous AI Workflows',
  bulletPoints = [
    'Zero manual timeline keyframing in video production',
    'Sub-2-minute cloud rendering turnaround speed',
    'Scaling programmatic video for global marketing campaigns',
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-4 flex items-center justify-center font-sans ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 border border-sky-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(12, 14, 20, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.15)',
        }}
      >
        <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400 pb-2 border-b border-white/10 uppercase tracking-widest">
          <span>{segmentNumber}</span>
          <span>● IN-DEPTH ANALYSIS</span>
        </div>

        <h3 className="text-white font-black text-base md:text-lg tracking-tight mt-2.5 leading-snug">
          {topicTitle}
        </h3>

        <div className="flex flex-col gap-2 mt-3.5">
          {bulletPoints.map((point, idx) => {
            const pointSpring = spring({
              frame: frame - idx * 8,
              fps,
              config: { damping: 12, stiffness: 150 },
            });

            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed"
                style={{
                  transform: `translateX(${interpolate(pointSpring, [0, 1], [-15, 0])}px)`,
                  opacity: pointSpring,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>{point}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
