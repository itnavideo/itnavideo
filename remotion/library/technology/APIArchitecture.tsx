import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface APIStep {
  label: string;
  protocol: string;
  color: string;
}

export interface APIArchitectureProps {
  title?: string;
  steps?: APIStep[];
  className?: string;
}

const DEFAULT_STEPS: APIStep[] = [
  { label: 'Client Web Browser', protocol: 'HTTPS / JSON', color: '#38bdf8' },
  { label: 'Cloud Run API Gateway', protocol: 'Next.js Route Handlers', color: '#4285f4' },
  { label: 'Supabase JWT Validator', protocol: 'RLS Auth Guard', color: '#10b981' },
  { label: 'Groq Whisper API', protocol: 'gRPC / Streaming Audio', color: '#f59e0b' },
  { label: 'AWS Lambda Render Dispatcher', protocol: 'SDK / Event Invocation', color: '#ec4899' },
];

export const APIArchitecture: React.FC<APIArchitectureProps> = ({
  title = 'API GATEWAY & BACKEND DISPATCH PIPELINE',
  steps = DEFAULT_STEPS,
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
            REST & SERVERLESS APIS
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500 font-bold">{steps.length} HOPS</span>
      </div>

      {/* Sequential Horizontal API Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between shadow-lg"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
                borderTopColor: step.color,
                borderTopWidth: '3px',
              }}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                  STEP 0{idx + 1}
                </span>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-zinc-100 uppercase mt-1 leading-snug">
                  {step.label}
                </h4>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] font-mono font-semibold" style={{ color: step.color }}>
                {step.protocol}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
