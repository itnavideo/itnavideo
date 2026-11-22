import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface NullValuePercentageBarProps {
  tableName?: string;
  columns?: { name: string; nullPercent: number }[];
  className?: string;
}

export const NullValuePercentageBar: React.FC<NullValuePercentageBarProps> = ({
  tableName = "public.customer_leads",
  columns = [
    { name: "middle_name", nullPercent: 78.4 },
    { name: "phone_secondary", nullPercent: 62.1 },
    { name: "company_tax_id", nullPercent: 44.5 },
    { name: "referral_source", nullPercent: 18.2 },
    { name: "email", nullPercent: 0.0 },
  ],
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
            NULL VALUE SPARSITY METER
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {tableName}
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {columns.map((c, idx) => {
          const animNull = interpolate(frame, [idx * 3, idx * 3 + 30], [0, c.nullPercent], { extrapolateRight: 'clamp' });
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-300">{c.name}</span>
                <span className="text-amber-400 font-bold">{c.nullPercent.toFixed(1)}% NULL</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${animNull}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
