import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseIAMAuthenticationProps {
  iamRoleArn?: string;
  dbUsername?: string;
  tokenTtlMin?: number;
  className?: string;
}

export const DatabaseIAMAuthentication: React.FC<DatabaseIAMAuthenticationProps> = ({
  iamRoleArn = "arn:aws:iam::123456789:role/AppServiceDatabaseRole",
  dbUsername = "app_iam_user",
  tokenTtlMin = 15,
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
            IAM PASSWORDLESS AUTHENTICATION
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          NO STATIC PASSWORDS
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3 overflow-hidden text-ellipsis">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Assumed IAM Role</div>
        <code className="text-indigo-300 text-[11px]">{iamRoleArn}</code>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Database Identity</div>
          <div className="text-white font-bold mt-0.5">{dbUsername}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-400 uppercase">Token Lifespan</div>
          <div className="text-amber-400 font-bold mt-0.5">{tokenTtlMin}m Ephemeral TTL</div>
        </div>
      </div>
    </div>
  );
};
