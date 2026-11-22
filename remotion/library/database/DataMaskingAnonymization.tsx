import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DataMaskingAnonymizationProps {
  fields?: { name: string; raw: string; masked: string }[];
  authorizedRole?: string;
  className?: string;
}

export const DataMaskingAnonymization: React.FC<DataMaskingAnonymizationProps> = ({
  fields = [
    { name: "credit_card", raw: "4532-8921-3940-1234", masked: "****-****-****-1234" },
    { name: "email_address", raw: "john.doe@enterprise.com", masked: "j***e@enterprise.com" },
    { name: "ssn_number", raw: "123-45-6789", masked: "***-**-6789" },
  ],
  authorizedRole = "support_agent_tier_1",
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
            DYNAMIC DATA MASKING (DDM)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Role: {authorizedRole}
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {fields.map((f, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">{f.name}</span>
              <span className="text-amber-400 font-bold font-mono tracking-wider">{f.masked}</span>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-amber-950/50 text-amber-300 border border-amber-500/20 font-bold">
              MASKED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
