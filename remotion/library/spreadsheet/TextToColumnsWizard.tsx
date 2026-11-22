import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TextToColumnsWizardProps {
  rawString?: string;
  delimiter?: string;
  outputColumns?: string[];
  className?: string;
}

export const TextToColumnsWizard: React.FC<TextToColumnsWizardProps> = ({
  rawString = "EMP102,John Doe,Finance,Analyst,$95000",
  delimiter = "Comma (,)",
  outputColumns = ["ID (EMP102)", "Name (John Doe)", "Dept (Finance)", "Role (Analyst)", "Salary ($95k)"],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
            TEXT TO COLUMNS CONVERSION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Delimiter: {delimiter}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Raw Text Payload</div>
        <code className="text-zinc-300">{rawString}</code>
      </div>

      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
        {outputColumns.map((c, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-300">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};
