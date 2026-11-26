import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo';
import { evolvePath, getPointAtLength, getLength } from '@remotion/paths';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface MapFlyoverSceneProps {
  heading?: string;
  originLabel?: string;
  destinationLabel?: string;
  originCoords?: [number, number];      // [lon, lat]
  destinationCoords?: [number, number]; // [lon, lat]
  accentColor?: string;
  headingFont?: string;
  typographyFont?: string;
  palette?: BackgroundColorPalette;
}

/**
 * d3-geo + @remotion/paths animated map route flyover scene.
 * Draws a world graticule + projected great-circle route arc with animated marker.
 */
export const MapFlyoverScene: React.FC<MapFlyoverSceneProps> = ({
  heading = 'Global Route Flyover',
  originLabel = 'New York',
  destinationLabel = 'Tokyo',
  originCoords = [-74.006, 40.7128],
  destinationCoords = [139.6917, 35.6895],
  accentColor = '#EA580C',
  headingFont = 'Inter, sans-serif',
  typographyFont = 'Inter, sans-serif',
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = palette?.isDark ?? false;
  const textPrimary = palette?.textPrimary ?? (isDark ? '#FFFFFF' : '#0F172A');
  const cardBg = palette?.cardBg ?? (isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF');
  const cardBorder = palette?.cardBorder ?? (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)');
  const accent = accentColor || palette?.accent || '#EA580C';

  const entry = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const routeProgress = interpolate(frame, [10, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const mapGeometry = useMemo(() => {
    const width = 1100;
    const height = 520;
    const projection = geoNaturalEarth1().scale(205).translate([width / 2, height / 2 + 15]);
    const pathGen = geoPath(projection);

    const graticulePath = pathGen(geoGraticule10()) || '';
    const spherePath = pathGen({ type: 'Sphere' }) || '';
    const routeLinePath =
      pathGen({
        type: 'LineString',
        coordinates: [originCoords, destinationCoords],
      }) || '';

    const p1 = projection(originCoords) || [250, 220];
    const p2 = projection(destinationCoords) || [850, 220];
    const totalLen = routeLinePath ? getLength(routeLinePath) : 0;

    return { width, height, graticulePath, spherePath, routeLinePath, p1, p2, totalLen };
  }, [originCoords, destinationCoords]);

  const evolved = mapGeometry.routeLinePath
    ? evolvePath(routeProgress, mapGeometry.routeLinePath)
    : { strokeDasharray: '0', strokeDashoffset: 0 };

  const currentPoint =
    mapGeometry.routeLinePath && mapGeometry.totalLen > 0
      ? getPointAtLength(mapGeometry.routeLinePath, mapGeometry.totalLen * routeProgress)
      : { x: mapGeometry.p1[0], y: mapGeometry.p1[1] };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
        opacity: entry,
      }}
    >
      <h2
        style={{
          fontFamily: headingFont,
          fontSize: '46px',
          fontWeight: 900,
          color: textPrimary,
          margin: '0 0 24px',
          textAlign: 'center',
        }}
      >
        {heading}
      </h2>

      <div
        style={{
          position: 'relative',
          width: '1100px',
          height: '520px',
          borderRadius: '28px',
          backgroundColor: cardBg,
          border: `1.5px solid ${cardBorder}`,
          boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.45)' : '0 24px 60px rgba(15,23,42,0.08)',
          overflow: 'hidden',
        }}
      >
        <svg width={mapGeometry.width} height={mapGeometry.height} viewBox={`0 0 ${mapGeometry.width} ${mapGeometry.height}`}>
          <path
            d={mapGeometry.spherePath}
            fill={isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.9)'}
            stroke={isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(15, 23, 42, 0.14)'}
            strokeWidth={1.5}
          />
          <path
            d={mapGeometry.graticulePath}
            fill="none"
            stroke={isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(15, 23, 42, 0.09)'}
            strokeWidth={1}
          />
          {mapGeometry.routeLinePath && (
            <path
              d={mapGeometry.routeLinePath}
              fill="none"
              stroke={accent}
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeDasharray={evolved.strokeDasharray}
              strokeDashoffset={evolved.strokeDashoffset}
            />
          )}

          {/* Origin Marker */}
          <circle cx={mapGeometry.p1[0]} cy={mapGeometry.p1[1]} r={8} fill={accent} />
          <text
            x={mapGeometry.p1[0]}
            y={mapGeometry.p1[1] - 16}
            textAnchor="middle"
            fill={textPrimary}
            style={{ fontFamily: typographyFont, fontSize: '18px', fontWeight: 800 }}
          >
            {originLabel}
          </text>

          {/* Destination Marker */}
          <circle cx={mapGeometry.p2[0]} cy={mapGeometry.p2[1]} r={8} fill={accent} opacity={routeProgress > 0.85 ? 1 : 0.4} />
          <text
            x={mapGeometry.p2[0]}
            y={mapGeometry.p2[1] - 16}
            textAnchor="middle"
            fill={textPrimary}
            style={{ fontFamily: typographyFont, fontSize: '18px', fontWeight: 800 }}
          >
            {destinationLabel}
          </text>

          {/* Moving Pulse Pin */}
          <circle cx={currentPoint.x} cy={currentPoint.y} r={12} fill={accent} opacity={0.28} />
          <circle cx={currentPoint.x} cy={currentPoint.y} r={6} fill="#FFFFFF" stroke={accent} strokeWidth={3} />
        </svg>
      </div>
    </div>
  );
};

