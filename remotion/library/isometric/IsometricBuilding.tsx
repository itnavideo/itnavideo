import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface IsometricBuildingProps {
  floors?: number;
  width?: number;
  heightPerFloor?: number;
  primaryColor?: string;
  accentColor?: string;
  activeWindows?: boolean;
  beaconGlow?: boolean;
  serverRackMode?: boolean;
  label?: string;
  delay?: number;
}

/**
 * IsometricBuilding — Architectural 3D isometric tower / server rack.
 * Features illuminated windows/rack lights, animated rooftop beacon pulse,
 * and multi-floor tier stacking.
 */
export function IsometricBuilding({
  floors = 5,
  width = 160,
  heightPerFloor = 45,
  primaryColor = '#1e293b',
  accentColor = '#10b981',
  activeWindows = true,
  beaconGlow = true,
  serverRackMode = false,
  label = 'EDGE NODE 01',
  delay = 0,
}: IsometricBuildingProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalHeight = floors * heightPerFloor;
  const depth = width * 0.75;

  const adjustedFrame = Math.max(0, frame - delay);

  // Progressive growth entrance spring
  const growSpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scaleY = interpolate(growSpr, [0, 1], [0.1, 1]);
  const opacity = interpolate(growSpr, [0, 1], [0, 1]);

  // Beacon light pulse
  const beaconPulse = (Math.sin(frame * 0.15) + 1) / 2;

  return (
    <div
      style={{
        position: 'relative',
        width: width * 1.5,
        height: totalHeight + 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        opacity,
      }}
    >
      {/* Ground Shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          width: width * 1.6,
          height: depth * 0.7,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          filter: 'blur(16px)',
          transform: 'rotate(-20deg)',
        }}
      />

      {/* Isometric SVG Skyscraper Structure */}
      <svg
        width={width * 1.5}
        height={totalHeight + 100}
        viewBox={`0 0 ${width * 1.5} ${totalHeight + 100}`}
        style={{
          transformOrigin: 'bottom center',
          transform: `scaleY(${scaleY})`,
          overflow: 'visible',
        }}
      >
        <g transform={`translate(${width * 0.75}, ${totalHeight + 40})`}>
          {/* Base Foundation */}
          {Array.from({ length: floors }).map((_, f) => {
            const floorY = -f * heightPerFloor;
            const isTop = f === floors - 1;

            return (
              <g key={f} transform={`translate(0, ${floorY})`}>
                {/* Left Shaded Face */}
                <polygon
                  points={`0,0 -${width * 0.5},-${width * 0.25} -${width * 0.5},-${width * 0.25 + heightPerFloor} 0,-${heightPerFloor}`}
                  fill={primaryColor}
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Left Face Windows / LED Rack Indicators */}
                {activeWindows &&
                  Array.from({ length: 3 }).map((_, wIdx) => {
                    const winX = -15 - wIdx * 18;
                    const winY = -8 - wIdx * 9 - heightPerFloor * 0.35;
                    const isBlinking = ((frame + f * 7 + wIdx * 3) % 40) > 10;

                    return (
                      <polygon
                        key={wIdx}
                        points={`${winX},${winY} ${winX - 10},${winY - 5} ${winX - 10},${winY + 8} ${winX},${winY + 13}`}
                        fill={isBlinking ? accentColor : '#0f172a'}
                        opacity={isBlinking ? 0.9 : 0.4}
                      />
                    );
                  })}

                {/* Right Dark Face */}
                <polygon
                  points={`0,0 ${width * 0.5},-${width * 0.25} ${width * 0.5},-${width * 0.25 + heightPerFloor} 0,-${heightPerFloor}`}
                  fill="#090d16"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />

                {/* Right Face Windows */}
                {activeWindows &&
                  Array.from({ length: 3 }).map((_, wIdx) => {
                    const winX = 15 + wIdx * 18;
                    const winY = -8 - wIdx * 9 - heightPerFloor * 0.35;
                    const isBlinking = ((frame + f * 5 + wIdx * 11) % 50) > 15;

                    return (
                      <polygon
                        key={wIdx}
                        points={`${winX},${winY} ${winX + 10},${winY - 5} ${winX + 10},${winY + 8} ${winX},${winY + 13}`}
                        fill={isBlinking ? '#38bdf8' : '#020617'}
                        opacity={isBlinking ? 0.85 : 0.3}
                      />
                    );
                  })}

                {/* Rooftop Cap on Top Floor */}
                {isTop && (
                  <g transform={`translate(0, -${heightPerFloor})`}>
                    <polygon
                      points={`0,0 ${width * 0.5},-${width * 0.25} 0,-${width * 0.5} -${width * 0.5},-${width * 0.25}`}
                      fill="#334155"
                      stroke={accentColor}
                      strokeWidth="2"
                    />

                    {/* Rooftop Antenna Spire & Beacon */}
                    <line
                      x1="0"
                      y1={`-${width * 0.25}`}
                      x2="0"
                      y2={`-${width * 0.25 + 40}`}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />

                    {beaconGlow && (
                      <circle
                        cx="0"
                        cy={`-${width * 0.25 + 40}`}
                        r="4"
                        fill="#ef4444"
                        filter="drop-shadow(0px 0px 8px #ef4444)"
                        opacity={0.4 + beaconPulse * 0.6}
                      />
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Label Badge */}
      {label && (
        <div
          style={{
            marginTop: 8,
            padding: '4px 12px',
            borderRadius: 6,
            backgroundColor: 'rgba(9, 9, 11, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f4f4f5',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: accentColor,
            }}
          />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
