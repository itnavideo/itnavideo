import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GraphPlotterProps {
  functionType?: 'sine' | 'quadratic' | 'exponential' | 'sigmoid';
  title?: string;
  formula?: string;
  curveColor?: string;
  gridColor?: string;
  animateTrace?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * GraphPlotter — 2D Cartesian coordinate function graph plotter.
 * Renders mathematical functions ($f(x) = \sin(x)$, $x^2$, $e^x$)
 * with animated progressive line trace, axis markers, and grid ticks.
 */
export function GraphPlotter({
  functionType = 'sine',
  title = 'Trigonometric Function: f(x) = sin(x)',
  formula = 'y = A · sin(ωt + φ)',
  curveColor = '#10b981',
  gridColor = 'rgba(255, 255, 255, 0.08)',
  animateTrace = true,
  delay = 0,
  width = '100%',
  height = 360,
}: GraphPlotterProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Progressive graph trace length
  const traceProgress = animateTrace
    ? interpolate(adjustedFrame, [0, 60], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const plotWidth = 440;
  const plotHeight = 200;
  const originX = plotWidth / 2;
  const originY = plotHeight / 2;

  // Generate curve path points
  const pointsCount = 100;
  const activePoints = Math.floor(pointsCount * traceProgress);

  const pathPoints = Array.from({ length: activePoints }).map((_, i) => {
    const xRatio = (i / (pointsCount - 1)) * 2 - 1; // -1 to 1
    const screenX = originX + xRatio * (plotWidth / 2 - 20);

    let screenY = originY;
    if (functionType === 'sine') {
      const wave = Math.sin(xRatio * Math.PI * 2.5 + adjustedFrame * 0.04);
      screenY = originY - wave * 65;
    } else if (functionType === 'quadratic') {
      const quad = xRatio * xRatio;
      screenY = originY + 60 - quad * 120;
    } else if (functionType === 'exponential') {
      const exp = Math.pow(2, xRatio * 3);
      screenY = originY + 70 - (exp / 8) * 140;
    } else if (functionType === 'sigmoid') {
      const sig = 1 / (1 + Math.exp(-xRatio * 6));
      screenY = originY + 60 - sig * 120;
    }

    return `${screenX.toFixed(1)},${screenY.toFixed(1)}`;
  });

  const curveD = pathPoints.length > 0 ? `M ${pathPoints.join(' L ')}` : '';

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: 'none',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{title}</h3>
          <span style={{ color: curveColor, fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>
            {formula}
          </span>
        </div>

        <span
          style={{
            padding: '3px 10px',
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#a1a1aa',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          CARTESIAN (x, y)
        </span>
      </div>

      {/* SVG Coordinate Plot Area */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width={plotWidth}
          height={plotHeight}
          viewBox={`0 0 ${plotWidth} ${plotHeight}`}
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          {[-120, -60, 60, 120].map((dx) => (
            <line key={`gx-${dx}`} x1={originX + dx} y1="0" x2={originX + dx} y2={plotHeight} stroke={gridColor} strokeWidth="1" strokeDasharray="3 3" />
          ))}
          {[-60, 60].map((dy) => (
            <line key={`gy-${dy}`} x1="0" y1={originY + dy} x2={plotWidth} y2={originY + dy} stroke={gridColor} strokeWidth="1" strokeDasharray="3 3" />
          ))}

          {/* Primary X-Axis */}
          <line x1="0" y1={originY} x2={plotWidth} y2={originY} stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
          <text x={plotWidth - 10} y={originY - 8} fill="#fff" fontSize="12" fontWeight="800">x</text>

          {/* Primary Y-Axis */}
          <line x1={originX} y1="0" x2={originX} y2={plotHeight} stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
          <text x={originX + 8} y="14" fill="#fff" fontSize="12" fontWeight="800">y</text>

          {/* Function Plot Curve */}
          {curveD && (
            <path
              d={curveD}
              fill="none"
              stroke={curveColor}
              strokeWidth="3"
              strokeLinecap="round"
              filter={`drop-shadow(0 0 8px ${curveColor}80)`}
            />
          )}
        </svg>
      </div>

      {/* Footer Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 8,
        }}
      >
        <span>Domain: [-π, π] • Range: [-1, 1]</span>
        <span style={{ color: '#10b981' }}>Continuous & Differentiable</span>
      </div>
    </div>
  );
}
