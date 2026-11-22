import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface VoiceActivityIndicatorProps {
  className?: string;
}

export const VoiceActivityIndicator: React.FC<VoiceActivityIndicatorProps> = ({
  className = '',
}) => {
  const frame = useCurrentFrame();
  const isActive = (frame % 45) < 30;

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-mono flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
          VAD SPEECH ACTIVITY
        </span>
        <span className="text-white/40">ENERGY THRESHOLD</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex items-center justify-center space-x-3">
        <span className={"w-3 h-3 rounded-full " + (isActive ? 'bg-emerald-500 animate-ping' : 'bg-zinc-700')} />
        <span className={"text-lg font-bold " + (isActive ? 'text-emerald-400' : 'text-white/40')}>
          {isActive ? 'SPEECH DETECTED (ACTIVE)' : 'SILENCE / AMBIENT PAUSE'}
        </span>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>CONFIDENCE: 99.1%</span>
        <span>LATENCY: 5ms</span>
      </div>
    </div>
  );
};
