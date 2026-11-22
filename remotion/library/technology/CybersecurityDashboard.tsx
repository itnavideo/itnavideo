import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface ThreatEvent {
  time: string;
  ip: string;
  country: string;
  attackType: string;
  status: string;
}

export interface CybersecurityDashboardProps {
  title?: string;
  threatLevel?: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  events?: ThreatEvent[];
  className?: string;
}

const DEFAULT_EVENTS: ThreatEvent[] = [
  { time: '12:14:02', ip: '198.51.100.44', country: 'RU', attackType: 'SYN Flood DDoS', status: 'BLOCKED' },
  { time: '12:14:08', ip: '203.0.113.89', country: 'CN', attackType: 'SQL Injection Probe', status: 'MITIGATED' },
  { time: '12:14:15', ip: '192.0.2.14', country: 'BR', attackType: 'Credential Stuffing', status: 'QUARANTINED' },
];

export const CybersecurityDashboard: React.FC<CybersecurityDashboardProps> = ({
  title = 'SECURITY OPERATIONS CENTER (SOC) TELEMETRY',
  threatLevel = 'NORMAL',
  events = DEFAULT_EVENTS,
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
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">
            ACTIVE DEFENSE MONITOR
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-emerald-400">STATUS: {threatLevel}</span>
        </div>
      </div>

      {/* Blocked Threat Incident Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-12 gap-2 text-[10px] font-mono font-bold text-zinc-500 bg-zinc-800/80 px-4 py-2 border-b border-zinc-700">
          <span className="col-span-2">TIMESTAMP</span>
          <span className="col-span-3">ATTACKER IP</span>
          <span className="col-span-4">VECTOR</span>
          <span className="col-span-3 text-right">ACTION</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {events.map((ev, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 text-xs font-mono px-4 py-2.5 items-center">
              <span className="col-span-2 text-zinc-400">{ev.time}</span>
              <span className="col-span-3 text-zinc-200 font-bold truncate">
                {ev.ip} ({ev.country})
              </span>
              <span className="col-span-4 text-amber-400 truncate">{ev.attackType}</span>
              <span className="col-span-3 text-right">
                <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[9px] font-black px-2 py-0.5 rounded">
                  {ev.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
