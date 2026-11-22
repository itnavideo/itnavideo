import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface JSONNestedTreeViewerProps {
  rootKey?: string;
  nestedKeys?: { key: string; type: string; value: string }[];
  className?: string;
}

export const JSONNestedTreeViewer: React.FC<JSONNestedTreeViewerProps> = ({
  rootKey = "payload (JSONB)",
  nestedKeys = [
    { key: "user.profile.tier", type: "string", value: "'enterprise'" },
    { key: "user.settings.mfa", type: "boolean", value: "true" },
    { key: "billing.limits.max_qps", type: "number", value: "25000" },
    { key: "tags[]", type: "array[4]", value: "['db', 'ai', 'video', 'prod']" },
  ],
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
            JSONB HIERARCHY TREE
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          GIN Indexed
        </span>
      </div>

      <div className="space-y-1.5 font-mono text-xs">
        {nestedKeys.map((k, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-black/60 border border-zinc-800 flex justify-between items-center">
            <span className="text-purple-300 font-bold">{k.key}</span>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 mr-2">({k.type})</span>
              <code className="text-emerald-400">{k.value}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
