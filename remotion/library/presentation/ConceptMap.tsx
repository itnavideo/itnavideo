import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ConceptRelation {
  from: string;
  to: string;
  relationship: string;
}

export interface ConceptMapProps {
  title?: string;
  relations?: ConceptRelation[];
  className?: string;
}

const DEFAULT_RELATIONS: ConceptRelation[] = [
  { from: 'User Audio File', to: 'Whisper Cloud API', relationship: 'transcribes via' },
  { from: 'Whisper Cloud API', to: 'Word Timing JSON', relationship: 'produces millisecond' },
  { from: 'Word Timing JSON', to: 'Remotion Lambda', relationship: 'renders 30fps onto' },
];

export const ConceptMap: React.FC<ConceptMapProps> = ({
  title = 'KNOWLEDGE ONTOLOGY CONCEPT MAP',
  relations = DEFAULT_RELATIONS,
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
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            COGNITIVE CONCEPT MAP
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Relational Chain */}
      <div className="space-y-4">
        {relations.map((rel, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/80 border border-zinc-800 rounded-xl p-4"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              {/* Origin Concept */}
              <div className="bg-zinc-950 border border-zinc-700 px-4 py-2 rounded-lg text-xs font-mono font-bold text-zinc-200">
                {rel.from}
              </div>

              {/* Proposition Link Arrow */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono italic text-amber-400">
                  [{rel.relationship}]
                </span>
                <span className="text-zinc-500 font-mono text-xs">───►</span>
              </div>

              {/* Target Concept */}
              <div className="bg-zinc-950 border border-emerald-500/80 px-4 py-2 rounded-lg text-xs font-mono font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                {rel.to}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
