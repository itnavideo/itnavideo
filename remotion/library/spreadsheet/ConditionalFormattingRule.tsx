import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ConditionalFormattingRuleProps {
  ruleType?: string;
  criteria?: string;
  previewSamples?: { value: string; pass: boolean }[];
  className?: string;
}

export const ConditionalFormattingRule: React.FC<ConditionalFormattingRuleProps> = ({
  ruleType = "Highlight Cell Rules (Greater Than)",
  criteria = "Cell Value > 10,000",
  previewSamples = [
    { value: "$14,500", pass: true },
    { value: "$22,100", pass: true },
    { value: "$8,400", pass: false },
    { value: "$12,800", pass: true },
    { value: "$3,200", pass: false },
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
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            CONDITIONAL FORMATTING RULE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {ruleType}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3 text-emerald-300 font-bold">
        Formula Condition: {criteria}
      </div>

      <div className="grid grid-cols-5 gap-2 font-mono text-xs text-center">
        {previewSamples.map((s, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border ${
              s.pass
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
            }`}
          >
            <div>{s.value}</div>
            <div className="text-[10px] mt-0.5">{s.pass ? 'HIGHLIGHT' : 'NORMAL'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
