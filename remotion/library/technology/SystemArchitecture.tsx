import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ArchitectureLayer {
  layerName: string;
  components: string[];
  color: string;
}

export interface SystemArchitectureProps {
  title?: string;
  layers?: ArchitectureLayer[];
  className?: string;
}

const DEFAULT_LAYERS: ArchitectureLayer[] = [
  { layerName: 'PRESENTATION / CLIENT TIER', components: ['Next.js 16 App Router', 'Tailwind CSS', 'Remotion Web Player'], color: '#38bdf8' },
  { layerName: 'SERVERLESS APPLICATION TIER', components: ['Google Cloud Run (itnavideo-web)', 'Secure Route Handlers', 'Credit Quota Guard'], color: '#4285f4' },
  { layerName: 'ASYNCHRONOUS COMPUTE TIER', components: ['AWS Lambda 30fps Chromium Cluster', 'Groq Whisper V3 API', 'S3 Temp Uploads'], color: '#ff9900' },
  { layerName: 'PERSISTENCE & SECURITY TIER', components: ['Supabase PostgreSQL DB', 'Row Level Security (RLS)', 'Cloudinary CDN Edge'], color: '#10b981' },
];

export const SystemArchitecture: React.FC<SystemArchitectureProps> = ({
  title = 'FULL STACK CLOUD SYSTEM BLUEPRINT',
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase font-bold">
            TIERED BLUEPRINT
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Layered Architecture Cake Stack */}
      <div className="space-y-3">
        {layers.map((layer, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-md"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderLeftColor: layer.color,
                borderLeftWidth: '4px',
              }}
            >
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase mb-2" style={{ color: layer.color }}>
                LAYER 0{idx + 1} • {layer.layerName}
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.components.map((comp, cIdx) => (
                  <span
                    key={cIdx}
                    className="bg-zinc-950 border border-zinc-700/80 text-zinc-200 text-xs font-mono px-3 py-1 rounded"
                  >
                    {comp}
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
