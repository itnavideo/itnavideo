import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface NoiseGateIndicatorProps {
  thresholdDb?: number;
  className?: string;
}

export const NoiseGateIndicator: React.FC<NoiseGateIndicatorProps> = ({
  thresholdDb = -48,
  className = '',
}) => {
  const frame = useCurrentFrame();
  const isOpen = (frame % 60) < 35;

  return (
    <div className={"relative w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white flex flex-col justify-between font-mono " + className}>
      <div className="flex justify-between items-center text-xs">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          STUDIO NOISE GATE PROCESSOR
        </span>
        <span className="text-white/40">THRESHOLD: {thresholdDb} dB</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900/80 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center">
        <div
          className={"px-6 py-2 rounded-lg border-2 text-sm font-bold " + (
            isOpen ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-red-500 bg-red-950/40 text-red-300'
          )}
        >
          {isOpen ? 'GATE OPEN (VOICE PASS)' : 'GATE MUTED (HISS ELIMINATED)'}
        </div>
      </div>

      <div className="text-xs text-white/40 flex justify-between">
        <span>HOLD: 100ms</span>
        <span>FLOOR REDUCTION: -80 dB</span>
      </div>
    </div>
  );
};
