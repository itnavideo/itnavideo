import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RouteWaypoint {
  name: string;
  code: string;
  x: number; // percentage
  y: number; // percentage
  time?: string;
}

export interface RouteMapProps {
  origin?: RouteWaypoint;
  destination?: RouteWaypoint;
  waypoints?: RouteWaypoint[];
  flightNumber?: string;
  distance?: string;
  duration?: string;
  lineColor?: string;
  planeColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_ORIGIN: RouteWaypoint = {
  name: 'New York (JFK)',
  code: 'JFK',
  x: 20,
  y: 65,
  time: '14:30 EST',
};

const DEFAULT_DEST: RouteWaypoint = {
  name: 'London Heathrow (LHR)',
  code: 'LHR',
  x: 80,
  y: 35,
  time: '06:45 GMT',
};

/**
 * RouteMap — Animated transit and flight route tracking map.
 * Visualizes great-circle flight arcs between origin and destination,
 * animated traveling aircraft icon, distance stats, and waypoint timecodes.
 */
export function RouteMap({
  origin = DEFAULT_ORIGIN,
  destination = DEFAULT_DEST,
  flightNumber = 'ITNA-402',
  distance = '3,451 Nautical Miles',
  duration = '6h 45m Non-Stop',
  lineColor = '#38bdf8',
  planeColor = '#10b981',
  delay = 0,
  width = '100%',
  height = 360,
}: RouteMapProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Flight progress percentage along path (loops every 120 frames)
  const flightProgress = (adjustedFrame % 120) / 120;

  // Bezier curve calculations
  const x1 = origin.x * 4;
  const y1 = origin.y * 2.4;
  const x2 = destination.x * 4;
  const y2 = destination.y * 2.4;

  const midX = (x1 + x2) / 2;
  const midY = Math.min(y1, y2) - 60; // arch upwards

  // Quadratic bezier point formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
  const t = flightProgress;
  const planeX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
  const planeY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

  // Tangent angle for plane orientation
  const dx = 2 * (1 - t) * (midX - x1) + 2 * t * (x2 - midX);
  const dy = 2 * (1 - t) * (midY - y1) + 2 * t * (y2 - midY);
  const planeAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Flight Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: '#38bdf820',
              border: '1px solid #38bdf860',
              color: '#38bdf8',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {flightNumber}
          </span>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>
            {origin.code} ➔ {destination.code}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ color: '#10b981', fontSize: 13, fontWeight: 800 }}>IN FLIGHT</span>
          <div style={{ color: '#71717a', fontSize: 11 }}>{duration}</div>
        </div>
      </div>

      {/* Route SVG Map Area */}
      <div style={{ position: 'relative', flex: 1, margin: '14px 0' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 240"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          {/* Great Circle Arc Path */}
          <path
            d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
            fill="none"
            stroke={lineColor}
            strokeWidth="3"
            strokeDasharray="6 6"
            opacity="0.8"
            filter={`drop-shadow(0 0 8px ${lineColor}80)`}
          />

          {/* Origin Airport Node */}
          <g transform={`translate(${x1}, ${y1})`}>
            <circle r="7" fill={lineColor} />
            <circle r="14" fill="none" stroke={lineColor} strokeWidth="1.5" opacity="0.4" />
            <text y="24" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">
              {origin.code}
            </text>
          </g>

          {/* Destination Airport Node */}
          <g transform={`translate(${x2}, ${y2})`}>
            <circle r="7" fill={planeColor} />
            <circle r="14" fill="none" stroke={planeColor} strokeWidth="1.5" opacity="0.4" />
            <text y="24" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">
              {destination.code}
            </text>
          </g>

          {/* Moving Aircraft Icon */}
          <g transform={`translate(${planeX}, ${planeY}) rotate(${planeAngle})`}>
            <polygon
              points="0,-8 14,0 0,8 4,0"
              fill={planeColor}
              filter="drop-shadow(0 0 8px #10b981)"
            />
          </g>
        </svg>
      </div>

      {/* Footer Flight Details */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 10,
        }}
      >
        <span>Departed: <strong style={{ color: '#fff' }}>{origin.time}</strong></span>
        <span>Distance: <strong style={{ color: '#38bdf8' }}>{distance}</strong></span>
        <span>Estimated Arrival: <strong style={{ color: '#fff' }}>{destination.time}</strong></span>
      </div>
    </div>
  );
}
