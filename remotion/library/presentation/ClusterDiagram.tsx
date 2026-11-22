import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ClusterNode {
  title: string;
  color: string;
}

export interface ClusterDiagramProps {
  centerTheme?: string;
  clusters?: ClusterNode[];
  className?: string;
}

const DEFAULT_CLUSTERS: ClusterNode[] = [
  { title: 'Video Automation', color: '#38bdf8' },
  { title: 'Word Kinetic Subtitles', color: '#10b981' },
  { title: 'Faceless YouTube Shorts', color: '#f59e0b' },
  { title: 'Whiteboard Animation', color: '#6366f1' },
  { title: 'AI Scene Direction', color: '#ec4899' },
];

export const ClusterDiagram: React.FC<ClusterDiagramProps> = ({
  centerTheme = 'ITNAVIDEO CORE STUDIO',
  clusters = DEFAULT_CLUSTERS,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="text-center border-b border-zinc-800 pb-3 mb-6">
        <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold mb-1">
          BRAINSTORMING CLUSTERS
        </div>
        <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
          IDEA CLUSTER DIAGRAM
        </h3>
      </div>

      {/* Radial Cluster Nodes around Center */}
      <div className="relative w-full aspect-[16/9] flex items-center justify-center">
        {/* Center Core Node */}
        <div className="w-40 h-40 rounded-full bg-zinc-900 border-2 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.3)] flex items-center justify-center p-4 text-center z-20">
          <span className="text-xs font-serif font-black text-zinc-100 uppercase">
            {centerTheme}
          </span>
        </div>

        {/* Orbiting Satellite Cluster Nodes */}
        {clusters.map((c, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          const angle = (idx * (360 / clusters.length)) * (Math.PI / 180);
          const radius = 135;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={idx}
              className="absolute z-30 rounded-xl px-4 py-2 border shadow-lg text-center"
              style={{
                transform: `translate(${x}px, ${y}px) scale(${itemSpring})`,
                backgroundColor: '#18181b',
                borderColor: c.color,
                boxShadow: `0 0 15px ${c.color}33`,
              }}
            >
              <span className="text-xs font-mono font-bold text-zinc-100 uppercase">
                {c.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
