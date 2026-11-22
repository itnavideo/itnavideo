import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NewsHeadlinePanelProps {
  headline?: string;
  points?: string[];
  className?: string;
}

export const NewsHeadlinePanel: React.FC<NewsHeadlinePanelProps> = ({
  headline = 'AI COMPUTING INFRASTRUCTURE SEES RECORD EXPANSION',
  points = [
    'Over $40B deployed in renewable data centers this quarter',
    'Latency drops by 35% across multi-region cloud pipelines',
    'International regulatory frameworks draft initial consensus',
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-96 bg-zinc-950/90 border border-white/10 rounded-xl p-5 font-mono text-white shadow-2xl " + className}>
      <div className="text-xs text-red-500 font-black mb-1 uppercase tracking-wider">TOP STORY HIGHLIGHTS</div>
      <h3 className="text-base font-black tracking-tight mb-3 uppercase leading-snug">{headline}</h3>
      <ul className="space-y-2 text-xs text-white/70">
        {points.map((pt, i) => (
          <li key={i} className="flex items-start space-x-2">
            <span className="text-red-500 font-bold">•</span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
