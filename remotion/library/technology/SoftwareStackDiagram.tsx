import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface TechItem {
  category: string;
  technologies: string[];
  color: string;
}

export interface SoftwareStackDiagramProps {
  title?: string;
  stacks?: TechItem[];
  className?: string;
}

const DEFAULT_STACKS: TechItem[] = [
  { category: 'FRONTEND & UI', technologies: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Framer Motion'], color: '#38bdf8' },
  { category: 'VIDEO ENGINE', technologies: ['Remotion', '@remotion/lambda', '@remotion/player', 'Chromium 30fps'], color: '#6366f1' },
  { category: 'AI & SPEECH', technologies: ['Groq Whisper V3', 'Google Gemini 2.0 Flash', 'Vertex AI'], color: '#10b981' },
  { category: 'CLOUD HOSTING', technologies: ['Google Cloud Run', 'AWS Lambda (us-east-1)', 'AWS S3', 'Cloudinary'], color: '#f59e0b' },
];

export const SoftwareStackDiagram: React.FC<SoftwareStackDiagramProps> = ({
  title = 'FULL SOFTWARE PRODUCTION TECH STACK',
  stacks = DEFAULT_STACKS,
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
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            TECHNOLOGY STACK
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Layer Stack */}
      <div className="space-y-3">
        {stacks.map((s, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderLeftColor: s.color,
                borderLeftWidth: '4px',
              }}
            >
              <div className="text-xs font-mono font-bold text-zinc-100 uppercase w-40 shrink-0">
                {s.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {s.technologies.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-xs font-mono px-2.5 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
