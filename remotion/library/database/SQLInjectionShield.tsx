import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SQLInjectionShieldProps {
  maliciousPayload?: string;
  parameterizedQuery?: string;
  blockedStatus?: string;
  wafRule?: string;
  className?: string;
}

export const SQLInjectionShield: React.FC<SQLInjectionShieldProps> = ({
  maliciousPayload = "SELECT * FROM users WHERE email = '' OR '1'='1' --",
  parameterizedQuery = "SELECT * FROM users WHERE email = $1",
  blockedStatus = "ATTACK MITIGATED",
  wafRule = "OWASP-CRS-942100 (SQLi Detected)",
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = Math.sin(frame / 5) * 0.2 + 0.8;

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-red-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs uppercase tracking-wider text-red-400 font-bold">
            SQL INJECTION SHIELD
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/20 font-bold" style={{ opacity: pulse }}>
          {blockedStatus}
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs mb-4">
        <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Blocked Malicious Input</div>
          <code className="text-red-300 block line-through">{maliciousPayload}</code>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1">Safe Parameterized Query</div>
          <code className="text-emerald-300 block">{parameterizedQuery}</code>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
        <span>Active Defense:</span>
        <span className="text-zinc-300">{wafRule}</span>
      </div>
    </div>
  );
};
