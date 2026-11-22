import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface InvertedIndexVisualizerProps {
  terms?: { term: string; docIds: number[] }[];
  className?: string;
}

export const InvertedIndexVisualizer: React.FC<InvertedIndexVisualizerProps> = ({
  terms = [
    { term: "remotion", docIds: [12, 45, 89, 104] },
    { term: "video", docIds: [3, 12, 19, 45, 89] },
    { term: "database", docIds: [45, 104, 210] },
    { term: "performance", docIds: [12, 89, 210] },
  ],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            INVERTED INDEX ARCHITECTURE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Term Dictionary & Postings
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {terms.map((t, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <span className="text-amber-400 font-bold w-28">"{t.term}"</span>
            <div className="flex items-center space-x-1.5 flex-1 justify-end">
              <span className="text-[10px] text-zinc-500 mr-2">Postings ({t.docIds.length}):</span>
              {t.docIds.map((id, idIdx) => (
                <span key={idIdx} className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 text-[10px]">
                  doc#{id}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
