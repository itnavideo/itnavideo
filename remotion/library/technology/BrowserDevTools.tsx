import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface NetworkRequest {
  endpoint: string;
  status: number;
  time: string;
  size: string;
}

export interface BrowserDevToolsProps {
  url?: string;
  requests?: NetworkRequest[];
  activeTab?: 'Network' | 'Console' | 'Elements';
  className?: string;
}

const DEFAULT_REQUESTS: NetworkRequest[] = [
  { endpoint: '/api/reels/jobs', status: 200, time: '142ms', size: '1.2 kB' },
  { endpoint: '/api/media/upload', status: 200, time: '88ms', size: '540 B' },
  { endpoint: '/api/reels/jobs/status', status: 200, time: '64ms', size: '820 B' },
];

export const BrowserDevTools: React.FC<BrowserDevToolsProps> = ({
  url = 'https://itnavideo.com/dashboard/faceless-shorts',
  requests = DEFAULT_REQUESTS,
  activeTab = 'Network',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden select-none font-mono text-xs ${className}`}
      style={{ opacity: entry }}
    >
      {/* DevTools Tab Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-sans">
          <span className="text-zinc-500">Elements</span>
          <span className="text-zinc-500">Console</span>
          <span className="text-sky-400 font-bold border-b-2 border-sky-400 pb-1 -mb-2">
            Network
          </span>
          <span className="text-zinc-500">Application</span>
        </div>
        <span className="text-zinc-500 text-[10px] truncate max-w-xs">{url}</span>
      </div>

      {/* Network Table */}
      <div className="p-4 space-y-2">
        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-zinc-500 border-b border-zinc-800 pb-2">
          <span className="col-span-5">NAME / PATH</span>
          <span className="col-span-2">STATUS</span>
          <span className="col-span-3">LATENCY</span>
          <span className="col-span-2 text-right">SIZE</span>
        </div>

        {requests.map((r, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs py-1 border-b border-zinc-900">
            <span className="col-span-5 text-zinc-200 truncate">{r.endpoint}</span>
            <span className="col-span-2 text-emerald-400 font-bold">{r.status} OK</span>
            <span className="col-span-3 text-zinc-400">{r.time}</span>
            <span className="col-span-2 text-right text-zinc-500">{r.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
