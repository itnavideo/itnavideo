import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SpreadsheetMacroVBAProps {
  macroName?: string;
  vbaSnippet?: string;
  executionTimeMs?: number;
  className?: string;
}

export const SpreadsheetMacroVBA: React.FC<SpreadsheetMacroVBAProps> = ({
  macroName = "Sub FormatMonthlyReport()",
  vbaSnippet = "Range(\"A1:D1\").Font.Bold = True\nRange(\"A2:D50\").Borders.LineStyle = xlContinuous",
  executionTimeMs = 45,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            VBA MACRO AUTOMATION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Alt + F11
        </span>
      </div>

      <div className="text-xs font-mono text-indigo-300 font-bold mb-2">
        {macroName}
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-line mb-3">
        {vbaSnippet}
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Language: Visual Basic for Applications</span>
        <span className="text-emerald-400 font-bold">Executed in {executionTimeMs}ms</span>
      </div>
    </div>
  );
};
