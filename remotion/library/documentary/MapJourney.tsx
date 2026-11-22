import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface Waypoint {
  name: string;
  x: number; // % coordinates (0 - 100)
  y: number; // % coordinates (0 - 100)
  date?: string;
}

export interface MapJourneyProps {
  mapTitle?: string;
  waypoints?: Waypoint[];
  accentColor?: string;
  className?: string;
}

const DEFAULT_WAYPOINTS: Waypoint[] = [
  { name: 'LONDON (ORIGIN)', x: 20, y: 35, date: '08:00' },
  { name: 'PARIS (TRANSFER)', x: 45, y: 50, date: '12:30' },
  { name: 'VIENNA (DESTINATION)', x: 80, y: 40, date: '19:45' },
];

export const MapJourney: React.FC<MapJourneyProps> = ({
  mapTitle = 'TRANSMISSION ROUTE TRAJECTORY',
  waypoints = DEFAULT_WAYPOINTS,
  accentColor = '#ef4444',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(frame, [0, fps * 4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      className={`relative w-full h-full min-h-[360px] bg-[#0c1017] border border-zinc-800 rounded-2xl p-6 overflow-hidden select-none shadow-2xl ${className}`}
    >
      {/* Top Header */}
      <div className="relative z-30 flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase">{mapTitle}</span>
        </div>
        <span className="text-zinc-500">TRAIL ACTIVE</span>
      </div>

      {/* Topographic Grid Vector Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="doc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#doc-grid)" />
      </svg>

      {/* Flight Path SVG Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {waypoints.map((wp, idx) => {
          if (idx === waypoints.length - 1) return null;
          const next = waypoints[idx + 1];

          return (
            <line
              key={idx}
              x1={`${wp.x}%`}
              y1={`${wp.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke={accentColor}
              strokeWidth="3"
              strokeDasharray="6 3"
              style={{
                filter: `drop-shadow(0 0 6px ${accentColor})`,
              }}
            />
          );
        })}
      </svg>

      {/* Waypoint Pins */}
      {waypoints.map((wp, idx) => {
        const pinSpring = spring({
          frame: Math.max(0, frame - idx * 15),
          fps,
          config: { damping: 12, mass: 0.8, stiffness: 90 },
        });

        return (
          <div
            key={idx}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            style={{
              left: `${wp.x}%`,
              top: `${wp.y}%`,
              transform: `translate(-50%, -50%) scale(${pinSpring})`,
              opacity: pinSpring,
            }}
          >
            {/* Glowing Waypoint Node */}
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: accentColor }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Label Card */}
            <div className="mt-1 bg-zinc-950/90 border border-zinc-700 px-2 py-0.5 rounded shadow text-center whitespace-nowrap">
              <span className="text-[10px] font-mono font-bold text-zinc-100">{wp.name}</span>
              {wp.date && <span className="text-[9px] font-mono text-amber-400 ml-1.5">[{wp.date}]</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
