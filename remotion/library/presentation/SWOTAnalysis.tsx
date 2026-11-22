import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SWOTSection {
  title: string;
  points: string[];
  color: string;
  badge: string;
}

export interface SWOTAnalysisProps {
  title?: string;
  companyName?: string;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  className?: string;
}

export const SWOTAnalysis: React.FC<SWOTAnalysisProps> = ({
  title = 'STRATEGIC SWOT ASSESSMENT',
  companyName = 'ITNAVIDEO PLATFORM',
  strengths = ['Deterministic Remotion 30fps', 'Cloud Render Scalability', 'Word-Level Accurate Captions'],
  weaknesses = ['High GPU/Lambda concurrency cost', 'Dependency on Cloudinary bandwidth'],
  opportunities = ['Enterprise video marketing teams', 'Automated YouTube shorts syndication'],
  threats = ['Rapid changes in desktop NLE software', 'Browser rendering sandbox limits'],
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  const quadrants: SWOTSection[] = [
    { title: 'STRENGTHS', points: strengths, color: '#10b981', badge: 'S' },
    { title: 'WEAKNESSES', points: weaknesses, color: '#f59e0b', badge: 'W' },
    { title: 'OPPORTUNITIES', points: opportunities, color: '#38bdf8', badge: 'O' },
    { title: 'THREATS', points: threats, color: '#ef4444', badge: 'T' },
  ];

  return (
    <div
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            STRATEGY MATRIX
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-semibold">{companyName}</span>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quad, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={quad.badge}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderLeftColor: quad.color,
                borderLeftWidth: '4px',
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-sm text-zinc-950"
                    style={{ backgroundColor: quad.color }}
                  >
                    {quad.badge}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-zinc-100 uppercase tracking-wider">
                    {quad.title}
                  </h4>
                </div>

                <ul className="space-y-2">
                  {quad.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs font-sans text-zinc-300">
                      <span className="text-zinc-600 mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500 flex justify-between">
                <span>{quad.points.length} FACTORS IDENTIFIED</span>
                <span style={{ color: quad.color }}>ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
