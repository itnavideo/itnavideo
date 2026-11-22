import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface DatabaseCylinderProps {
  dbName?: string;
  engine?: string;
  iops?: number;
  className?: string;
}

export const DatabaseCylinder: React.FC<DatabaseCylinderProps> = ({
  dbName = 'itnavideo_production_db',
  engine = 'PostgreSQL 16 (Supabase)',
  iops = 3200,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
          DATABASE CYLINDER
        </span>
        <span className="text-emerald-400 font-bold">ONLINE (PRIMARY)</span>
      </div>

      <div className="flex-1 my-4 flex items-center justify-center space-x-6">
        {/* 3D SVG Cylinder */}
        <svg width="100" height="130" viewBox="0 0 100 130">
          {/* Bottom Disk */}
          <path d="M 10,95 C 10,115 90,115 90,95 L 90,105 C 90,125 10,125 10,105 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
          {/* Middle Disk */}
          <path d="M 10,60 C 10,80 90,80 90,60 L 90,75 C 90,95 10,95 10,75 Z" fill="#1e40af" stroke="#60a5fa" strokeWidth="2" />
          {/* Top Cylinder Body & Cap */}
          <path d="M 10,25 C 10,45 90,45 90,25 L 90,45 C 90,65 10,65 10,45 Z" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />
          <ellipse cx="50" cy="25" rx="40" ry="16" fill="#3b82f6" stroke="#bfdbfe" strokeWidth="2" />
          {/* LED Ring */}
          <circle cx="50" cy="25" r="4" fill="#10b981" />
        </svg>

        <div>
          <div className="text-sm font-bold text-white font-mono">{dbName}</div>
          <div className="text-xs text-blue-400 mt-0.5">{engine}</div>
          <div className="mt-3 space-y-1 text-xs font-mono text-white/60">
            <div>IOPS: <span className="text-emerald-400 font-bold">{iops} R/W</span></div>
            <div>CONNECTIONS: <span className="text-white">64 / 100</span></div>
            <div>STORAGE: <span className="text-sky-300">128 GB SSD</span></div>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>WAL REPLICATION: ACTIVE</span>
        <span>ACID COMPLIANT</span>
      </div>
    </div>
  );
};
