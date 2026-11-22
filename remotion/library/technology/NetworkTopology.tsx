import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface NetworkDevice {
  name: string;
  ip: string;
  type: 'router' | 'switch' | 'firewall' | 'server';
  x: number; // %
  y: number; // %
}

export interface NetworkTopologyProps {
  title?: string;
  subnet?: string;
  devices?: NetworkDevice[];
  className?: string;
}

const DEFAULT_DEVICES: NetworkDevice[] = [
  { name: 'Gateway Firewall', ip: '10.0.0.1', type: 'firewall', x: 50, y: 20 },
  { name: 'Core Switch Alpha', ip: '10.0.1.1', type: 'switch', x: 50, y: 50 },
  { name: 'API Server #01', ip: '10.0.1.10', type: 'server', x: 20, y: 80 },
  { name: 'Worker Cluster #02', ip: '10.0.1.20', type: 'server', x: 50, y: 80 },
  { name: 'Postgres DB #03', ip: '10.0.1.30', type: 'server', x: 80, y: 80 },
];

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  title = 'PRIVATE VPC NETWORK TOPOLOGY MESH',
  subnet = 'SUBNET: 10.0.0.0/16',
  devices = DEFAULT_DEVICES,
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
      className={`relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            VPC SUBNET INFRASTRUCTURE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">{subnet}</span>
      </div>

      {/* Network Canvas */}
      <div className="relative w-full aspect-[16/8] bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden p-6">
        {/* SVG Connecting Cables */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <line x1="50%" y1="20%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2.5" />
          <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
        </svg>

        {/* Devices */}
        {devices.map((dev, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-center z-20 shadow-xl"
              style={{
                left: `${dev.x}%`,
                top: `${dev.y}%`,
                transform: `translate(-50%, -50%) scale(${itemSpring})`,
                opacity: itemSpring,
              }}
            >
              <div className="text-xs font-serif font-bold text-zinc-100 uppercase truncate">
                {dev.name}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-semibold">{dev.ip}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
