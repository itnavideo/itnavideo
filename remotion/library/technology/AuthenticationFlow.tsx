import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface AuthSequenceStep {
  step: string;
  from: string;
  to: string;
  payload: string;
}

export interface AuthenticationFlowProps {
  title?: string;
  protocol?: string;
  sequence?: AuthSequenceStep[];
  className?: string;
}

const DEFAULT_SEQUENCE: AuthSequenceStep[] = [
  { step: '1', from: 'Client Browser', to: 'Supabase Auth', payload: 'POST /auth/v1/token (credentials)' },
  { step: '2', from: 'Supabase Auth', to: 'Client Browser', payload: 'Set-Cookie: sb-access-token (JWT)' },
  { step: '3', from: 'Client Browser', to: 'Cloud Run API', payload: 'Authorization: Bearer <JWT>' },
  { step: '4', from: 'Cloud Run API', to: 'Postgres DB', payload: 'RLS Query: auth.uid() = user_id' },
];

export const AuthenticationFlow: React.FC<AuthenticationFlowProps> = ({
  title = 'SECURE OAUTH 2.0 / JWT AUTHENTICATION FLOW',
  protocol = 'SUPABASE SSR + RLS SESSION',
  sequence = DEFAULT_SEQUENCE,
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
            SECURITY PROTOCOL
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">{protocol}</span>
      </div>

      {/* Sequence Steps List */}
      <div className="space-y-3">
        {sequence.map((seq, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-xs font-mono font-black flex items-center justify-center shrink-0">
                  {seq.step}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-200">
                  {seq.from} ➔ {seq.to}
                </span>
              </div>

              <div className="text-xs font-mono text-amber-400 bg-zinc-950 px-3 py-1 rounded border border-zinc-800 w-full sm:w-auto truncate">
                {seq.payload}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
