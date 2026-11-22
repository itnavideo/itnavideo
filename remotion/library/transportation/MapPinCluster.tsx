import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PinClusterItem {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  count: number;
  label: string;
  color?: string;
}

export interface MapPinClusterProps {
  title?: string;
  subtitle?: string;
  clusters?: PinClusterItem[];
  totalLocations?: string;
  className?: string;
}

export const MapPinCluster: React.FC<MapPinClusterProps> = ({
  title = 'REGIONAL LOGISTICS & STORE NETWORK',
  subtitle = 'DYNAMIC GEOSPATIAL DENSITY CLUSTERING',
  clusters = [
    { id: 'nyc', x: 28, y: 35, count: 142, label: 'New York Metro Hub', color: '#0284c7' },
    { id: 'ldn', x: 52, y: 28, count: 98, label: 'London Distribution Hub', color: '#059669' },
    { id: 'dxb', x: 65, y: 52, count: 64, label: 'Dubai Cargo Terminal', color: '#d97706' },
    { id: 'tky', x: 82, y: 40, count: 215, label: 'Tokyo Central Logistics', color: '#7c3aed' },
  ],
  totalLocations = '519 Active Facilities',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`flex items-center justify-center p-3 font-mono ${className}`}
      style={{
        transform: `scale(${enter})`,
        opacity: enter,
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-5 border border-sky-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 14, 20, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), 0 0 35px rgba(2, 132, 199, 0.15)',
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-white font-black text-[11px] tracking-wider uppercase">
              {title}
            </span>
          </div>
          <span className="text-sky-400 font-bold text-[10px]">{totalLocations}</span>
        </div>

        {/* Map Canvas Background Grid */}
        <div className="relative h-60 my-3 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden flex items-center justify-center">
          {/* Subtle Grid Lat/Long Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Faint World Map Continent Contours SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 200">
            {/* Americas */}
            <path d="M 50,40 Q 80,60 70,120 Q 90,160 80,180" fill="none" stroke="#38bdf8" strokeWidth="2" />
            {/* Europe / Africa */}
            <path d="M 180,30 Q 220,50 200,100 Q 220,160 210,180" fill="none" stroke="#38bdf8" strokeWidth="2" />
            {/* Asia / Pacific */}
            <path d="M 260,35 Q 340,40 320,110 Q 350,150 330,170" fill="none" stroke="#38bdf8" strokeWidth="2" />
          </svg>

          {/* Render Map Pin Clusters */}
          {clusters.map((cluster, idx) => {
            const clusterSpring = spring({
              frame: frame - idx * 8,
              fps,
              config: { damping: 12, stiffness: 150 },
            });

            const pulseRing = ((frame * 1.5 + idx * 20) % 60) / 60;
            const clusterColor = cluster.color || '#0284c7';

            return (
              <div
                key={cluster.id}
                className="absolute flex flex-col items-center pointer-events-none"
                style={{
                  top: `${cluster.y}%`,
                  left: `${cluster.x}%`,
                  transform: `translate(-50%, -50%) scale(${clusterSpring})`,
                  opacity: clusterSpring,
                }}
              >
                {/* Expanding Ripple Ring */}
                <span
                  className="absolute w-12 h-12 rounded-full border pointer-events-none"
                  style={{
                    borderColor: clusterColor,
                    transform: `scale(${1 + pulseRing * 1.5})`,
                    opacity: 1 - pulseRing,
                  }}
                />

                {/* Center High-Density Cluster Badge */}
                <div
                  className="w-10 h-10 rounded-full flex flex-col items-center justify-center text-white font-black text-xs shadow-xl border-2 border-white/40 z-10"
                  style={{
                    backgroundColor: clusterColor,
                    boxShadow: `0 0 15px ${clusterColor}`,
                  }}
                >
                  <span className="leading-none">{cluster.count}</span>
                  <span className="text-[7px] font-bold opacity-80 uppercase leading-none">PTS</span>
                </div>

                {/* Location Callout Tag */}
                <div className="mt-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-[9px] text-zinc-300 font-semibold whitespace-nowrap shadow-md z-10">
                  {cluster.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
          <span>{subtitle}</span>
          <span className="text-emerald-400 font-bold">● CLUSTER AGGREGATION: ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
