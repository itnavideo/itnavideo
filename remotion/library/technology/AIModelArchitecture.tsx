import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ModelLayer {
  name: string;
  shape: string;
  color: string;
}

export interface AIModelArchitectureProps {
  modelName?: string;
  parameterCount?: string;
  layers?: ModelLayer[];
  className?: string;
}

const DEFAULT_LAYERS: ModelLayer[] = [
  { name: 'Input Token Embedding', shape: 'Seq Length × 4096 Dim', color: '#38bdf8' },
  { name: 'Multi-Head Self Attention (32 Heads)', shape: 'Query, Key, Value Projections', color: '#6366f1' },
  { name: 'Feed-Forward Neural Network (SwiGLU)', shape: '14,336 Hidden Dim', color: '#10b981' },
  { name: 'RMSNorm & Residual Add', shape: 'Layer Normalization', color: '#f59e0b' },
  { name: 'Output Head / Softmax Probabilities', shape: 'Vocab Size: 32,000 Tokens', color: '#ec4899' },
];

export const AIModelArchitecture: React.FC<AIModelArchitectureProps> = ({
  modelName = 'TRANSFORMER DECODER ARCHITECTURE',
  parameterCount = '7B PARAMETERS',
  layers = DEFAULT_LAYERS,
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
            NEURAL NETWORK SPEC
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {modelName}
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-400 font-bold">{parameterCount}</span>
      </div>

      {/* Model Transformer Layers Stack */}
      <div className="space-y-3">
        {layers.map((l, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between shadow-md"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderLeftColor: l.color,
                borderLeftWidth: '4px',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-xs font-serif font-bold text-zinc-100 uppercase">
                  {l.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">{l.shape}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
