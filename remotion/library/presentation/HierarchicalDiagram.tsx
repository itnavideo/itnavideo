import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface HierarchyNode {
  title: string;
  role: string;
  color?: string;
  children?: HierarchyNode[];
}

export interface HierarchicalDiagramProps {
  title?: string;
  rootNode?: HierarchyNode;
  className?: string;
}

const DEFAULT_ROOT: HierarchyNode = {
  title: 'ENGINEERING DIRECTING',
  role: 'Founder / Lead Architect',
  color: '#38bdf8',
  children: [
    {
      title: 'FRONTEND SUITE',
      role: 'Next.js 16 + Tailwind',
      color: '#10b981',
      children: [{ title: 'STUDIOS', role: '15 Active Video Types', color: '#10b981' }],
    },
    {
      title: 'VIDEO ENGINE',
      role: 'Remotion Lambda',
      color: '#f59e0b',
      children: [{ title: 'CLOUD CLUSTER', role: 'Chromium Distributed', color: '#f59e0b' }],
    },
  ],
};

export const HierarchicalDiagram: React.FC<HierarchicalDiagramProps> = ({
  title = 'SYSTEM TAXONOMY HIERARCHICAL DIAGRAM',
  rootNode = DEFAULT_ROOT,
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            ORGANIZATIONAL TAXONOMY
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="flex flex-col items-center space-y-6">
        {/* Level 0: Root */}
        <div
          className="bg-zinc-900 border-2 border-sky-400 rounded-xl px-6 py-3 text-center shadow-lg"
          style={{ transform: `scale(${entry})` }}
        >
          <div className="text-xs font-serif font-black text-sky-400 uppercase">
            {rootNode.title}
          </div>
          <div className="text-[10px] font-mono text-zinc-400">{rootNode.role}</div>
        </div>

        {/* Level 1: Sub-branches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
          {rootNode.children?.map((child, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-[2px] h-6 bg-zinc-700 -mt-6 mb-2" />
              <div className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-4 text-center shadow">
                <div className="text-xs font-serif font-bold text-zinc-100 uppercase">
                  {child.title}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mb-2">{child.role}</div>

                {child.children?.map((sub, sIdx) => (
                  <div key={sIdx} className="mt-2 bg-zinc-950 border border-zinc-800 rounded p-2 text-[10px] font-mono text-amber-400 font-bold">
                    {sub.title} ({sub.role})
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
