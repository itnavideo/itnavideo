import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ServerBlade {
  id: string;
  unit: string; // e.g. "U1-U2"
  name: string;
  cpuLoad: number; // 0 - 100%
  status: 'online' | 'warning' | 'standby';
  portCount?: number;
}

export interface ServerRackProps {
  rackTitle?: string;
  facilityLocation?: string;
  blades?: ServerBlade[];
  className?: string;
}

const DEFAULT_BLADES: ServerBlade[] = [
  { id: '1', unit: 'U38-42', name: 'CORE ROUTER / FIBER SWITCH', cpuLoad: 24, status: 'online', portCount: 8 },
  { id: '2', unit: 'U32-37', name: 'KUBERNETES WORKER #01', cpuLoad: 78, status: 'online', portCount: 6 },
  { id: '3', unit: 'U26-31', name: 'REMOTION LAMBDA DISPATCHER', cpuLoad: 92, status: 'warning', portCount: 6 },
  { id: '4', unit: 'U20-25', name: 'POSTGRES DB PRIMARY CLUSTER', cpuLoad: 45, status: 'online', portCount: 4 },
  { id: '5', unit: 'U14-19', name: 'REDIS CACHE / ASSET STORAGE', cpuLoad: 18, status: 'standby', portCount: 4 },
];

export const ServerRack: React.FC<ServerRackProps> = ({
  rackTitle = 'DATA CENTER RACK ALPHA-04',
  facilityLocation = 'US-EAST-1 • VAULT 3',
  blades = DEFAULT_BLADES,
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
      className={`relative w-full max-w-4xl bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            INFRASTRUCTURE HARDWARE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {rackTitle}
          </h3>
        </div>
        <div className="text-right text-xs font-mono text-zinc-400">
          <div className="text-emerald-400 font-bold flex items-center justify-end gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            42U ONLINE
          </div>
          <span className="text-zinc-500">{facilityLocation}</span>
        </div>
      </div>

      {/* 42U Server Rack Chassis Frame */}
      <div className="bg-zinc-900/90 border-4 border-zinc-800 rounded-xl p-3 sm:p-4 space-y-3 shadow-inner">
        {blades.map((blade, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          // LED Blinking calculation
          const ledBlink = Math.sin(frame * 0.4 + idx) > 0;
          const statusColor =
            blade.status === 'online'
              ? '#10b981'
              : blade.status === 'warning'
              ? '#f59e0b'
              : '#38bdf8';

          return (
            <div
              key={blade.id}
              className="bg-zinc-950 border border-zinc-700/80 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
              style={{
                transform: `scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              {/* Unit Label & Name */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 font-bold shrink-0">
                  {blade.unit}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-100 truncate">
                  {blade.name}
                </span>
              </div>

              {/* Hardware Status LEDs & CPU Meter */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                {/* Port Activity LEDs */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: blade.portCount || 4 }).map((_, pIdx) => {
                    const portBlink = Math.sin(frame * 0.8 + idx * 2 + pIdx) > 0.2;
                    return (
                      <div
                        key={pIdx}
                        className="w-2 h-2 rounded-xs border border-black"
                        style={{
                          backgroundColor: portBlink ? statusColor : '#27272a',
                          boxShadow: portBlink ? `0 0 6px ${statusColor}` : undefined,
                        }}
                      />
                    );
                  })}
                </div>

                {/* CPU Bar */}
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${blade.cpuLoad}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 w-8 text-right">
                    {blade.cpuLoad}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
