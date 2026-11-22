import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FlashFillSimulatorProps {
  patternRule?: string;
  samples?: { input: string; output: string }[];
  className?: string;
}

export const FlashFillSimulator: React.FC<FlashFillSimulatorProps> = ({
  patternRule = "Extract Initial + Last Name from Full Name",
  samples = [
    { input: "Sarah Jenkins", output: "S. Jenkins" },
    { input: "Michael Chang", output: "M. Chang" },
    { input: "Robert Oppenheimer", output: "R. Oppenheimer" },
  ],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            FLASH FILL (PATTERN RECOGNITION)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          Ctrl + E
        </span>
      </div>

      <div className="text-xs font-mono text-zinc-400 mb-2.5">
        Pattern: <span className="text-white font-bold">{patternRule}</span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {samples.map((s, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <span className="text-zinc-400">{s.input}</span>
            <span className="text-emerald-400 font-bold">{s.output}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
