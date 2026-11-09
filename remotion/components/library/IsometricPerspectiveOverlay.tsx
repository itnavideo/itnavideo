import React, { memo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Img } from 'remotion';
import { safeResolveMediaSrc } from '../../utils/safeMedia';

// =========================================================================
// 1. ISOMETRIC & 2.5D PERSPECTIVE SCHEMA
// =========================================================================

export type IsometricArchetype =
  | 'cube'              // 3-Faced shaded 3D isometric block
  | 'platform'          // Tiered floating pedestal / stage with drop shadow
  | 'device-mockup'     // Angled 2.5D smartphone/tablet mockup displaying image
  | 'server-building'   // Extruded skyscraper / data center server tower
  | 'isometric-flow';   // 2.5D connected workflow nodes on angled grid plane

export interface IsometricCubeConfig {
  size?: number;          // Cube width/length in px (default 140)
  height?: number;        // Extruded height in px (default 140)
  topColor?: string;      // Lightest face (default '#38BDF8')
  leftColor?: string;     // Midtone face (default '#0284C7')
  rightColor?: string;    // Shadow face (default '#0369A1')
  label?: string;         // Optional text printed on top face
}

export interface IsometricPlatformConfig {
  radius?: number;        // Width / radius of platform (default 260)
  thickness?: number;     // Platform vertical depth in px (default 28)
  baseColor?: string;     // Main stage color (default '#1E293B')
  edgeColor?: string;     // Front rim color (default '#0F172A')
  glowColor?: string;     // Neon perimeter ring glow (default '#10B981')
  tierCount?: number;     // Number of stepped tiers (default 1)
}

export interface IsometricDeviceConfig {
  deviceType?: 'smartphone' | 'tablet';
  screenImageSrc?: string; // UI Screenshot URL displayed on screen
  width?: number;          // Default 240
  height?: number;         // Default 460
  depth?: number;          // Device thickness in px (default 16)
  bezelColor?: string;     // Default '#0F172A'
  frameColor?: string;     // Metallic rim (default '#334155')
}

export interface IsometricBuildingConfig {
  width?: number;         // Base width in px (default 160)
  floors?: number;        // Number of floors (default 5)
  floorHeight?: number;   // Height per floor (default 36)
  buildingColor?: string; // Default '#1E293B'
  windowGlowColor?: string; // Default '#FACC15'
}

export interface IsometricFlowConfig {
  steps?: Array<{ title: string; subtitle?: string; color?: string }>;
  showConnectors?: boolean;
}

export interface DynamicIsometricLayer {
  id: string;
  archetype: IsometricArchetype;
  startSeconds: number;
  durationSeconds: number;

  // Viewport Coordinates (1080x1920 reference space)
  x: number;
  y: number;
  scale?: number;         // Default 1.0
  rotationDeg?: number;   // In-plane rotation offset (default 0)
  opacity?: number;

  // Archetype Configurations
  cube?: IsometricCubeConfig;
  platform?: IsometricPlatformConfig;
  device?: IsometricDeviceConfig;
  building?: IsometricBuildingConfig;
  flow?: IsometricFlowConfig;

  // Dynamic Motion
  floatingBob?: boolean;  // Idle sinusoidal floating bob
  inAnimation?: 'extrude-up' | 'spring-pop' | 'slide-up' | 'fade';
  outAnimation?: 'shrink' | 'fade';
  zIndex?: number;
}

// =========================================================================
// 2. ISOMETRIC MATH & 2.5D PROJECTION MATRICES
// =========================================================================

/**
 * Standard True Isometric Angle: 30° horizontal, 0.8660254 vertical scale
 * Matrix / CSS transform: rotate(-30deg) skewX(30deg)
 */

// =========================================================================
// 3. INDIVIDUAL 2.5D PROCEDURAL COMPONENT RENDERERS
// =========================================================================

/**
 * 1. Isometric 3D Shaded Cube (Top, Left, Right faces with coordinated lighting)
 */
const IsometricCube = memo(({
  config = {},
  extrudeProgress,
}: {
  config: IsometricCubeConfig;
  extrudeProgress: number;
}) => {
  const size = config.size ?? 140;
  const targetH = config.height ?? 140;
  const h = targetH * extrudeProgress;

  const topColor = config.topColor ?? '#38BDF8';
  const leftColor = config.leftColor ?? '#0284C7';
  const rightColor = config.rightColor ?? '#0369A1';

  // True Isometric Polygon Projections (W=size, H=size*0.577)
  const isoW = size * 0.866;
  const isoH = size * 0.5;

  return (
    <svg width={size * 2} height={size * 2 + h} viewBox={`0 0 ${size * 2} ${size * 2 + h}`} style={{ overflow: 'visible' }}>
      <g transform={`translate(${size}, ${isoH})`}>
        {/* Soft Drop Shadow on ground */}
        <polygon
          points={`0,${h + isoH * 0.8} ${isoW * 1.1},${h + isoH * 1.3} 0,${h + isoH * 1.9} ${-isoW * 1.1},${h + isoH * 1.3}`}
          fill="rgba(0, 0, 0, 0.35)"
          filter="blur(8px)"
        />

        {/* Left Face (Midtone) */}
        <polygon
          points={`0,0 ${-isoW},${isoH} ${-isoW},${isoH + h} 0,${h}`}
          fill={leftColor}
        />

        {/* Right Face (Shadow) */}
        <polygon
          points={`0,0 ${isoW},${isoH} ${isoW},${isoH + h} 0,${h}`}
          fill={rightColor}
        />

        {/* Top Face (Lightest) */}
        <polygon
          points={`0,${-isoH} ${isoW},0 0,${isoH} ${-isoW},0`}
          fill={topColor}
        />

        {/* Top Face Label */}
        {config.label && (
          <text
            x="0"
            y={isoH * 0.2}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize={14}
            fontWeight={900}
            fontFamily="Inter, sans-serif"
            transform="scale(1, 0.6) rotate(-30)"
          >
            {config.label}
          </text>
        )}
      </g>
    </svg>
  );
});

/**
 * 2. Isometric Stepped Platform (Pedestal Stage with Neon Perimeter Ring)
 */
const IsometricPlatform = memo(({
  config = {},
  animProgress,
}: {
  config: IsometricPlatformConfig;
  animProgress: number;
}) => {
  const r = (config.radius ?? 260) * animProgress;
  const thickness = config.thickness ?? 28;
  const baseColor = config.baseColor ?? '#1E293B';
  const edgeColor = config.edgeColor ?? '#0F172A';
  const glowColor = config.glowColor ?? '#10B981';

  const rx = r;
  const ry = r * 0.5;

  return (
    <svg width={rx * 2 + 40} height={ry * 2 + thickness + 60} viewBox={`0 0 ${rx * 2 + 40} ${ry * 2 + thickness + 60}`} style={{ overflow: 'visible' }}>
      <g transform={`translate(${rx + 20}, ${ry + 20})`}>
        {/* Ambient Ground Shadow */}
        <ellipse cx="0" cy={thickness + 15} rx={rx * 1.1} ry={ry * 1.1} fill="rgba(0, 0, 0, 0.45)" filter="blur(12px)" />

        {/* Front Cylindrical Rim Extrusion */}
        <path
          d={`M ${-rx},0 A ${rx} ${ry} 0 0 0 ${rx},0 L ${rx},${thickness} A ${rx} ${ry} 0 0 1 ${-rx},${thickness} Z`}
          fill={edgeColor}
        />

        {/* Top Elliptical Platform Face */}
        <ellipse cx="0" cy="0" rx={rx} ry={ry} fill={baseColor} />

        {/* Neon Glow Perimeter Ring */}
        <ellipse
          cx="0"
          cy="0"
          rx={rx - 4}
          ry={ry - 4}
          fill="none"
          stroke={glowColor}
          strokeWidth={3}
          strokeDasharray="16, 6"
          filter={`drop-shadow(0 0 10px ${glowColor})`}
        />
      </g>
    </svg>
  );
});

/**
 * 3. Isometric Floating 2.5D Device Mockup (Angled smartphone holding screen UI)
 */
const IsometricDevice = memo(({
  config = {},
  animProgress,
}: {
  config: IsometricDeviceConfig;
  animProgress: number;
}) => {
  const w = config.width ?? 240;
  const h = config.height ?? 460;
  const depth = config.depth ?? 16;
  const resolvedSrc = safeResolveMediaSrc(config.screenImageSrc);

  return (
    <div
      style={{
        position: 'relative',
        width: `${w}px`,
        height: `${h}px`,
        // 2.5D Isometric Tilt Matrix
        transform: `rotateX(55deg) rotateZ(-38deg) scale(${animProgress})`,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
    >
      {/* 2.5D Ground Shadow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 36,
          transform: `translate3d(24px, 36px, -40px)`,
          filter: 'blur(16px)',
        }}
      />

      {/* 3D Extruded Metallic Frame Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: config.frameColor ?? '#334155',
          borderRadius: 36,
          transform: `translate3d(0, 0, -${depth}px)`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}
      />

      {/* Device Outer Bezel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: config.bezelColor ?? '#0F172A',
          borderRadius: 36,
          border: '3px solid #64748B',
          padding: '12px 10px',
          boxShadow: 'inset 0 0 12px rgba(255,255,255,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Speaker / Camera Notch */}
        <div
          style={{
            width: 60,
            height: 12,
            backgroundColor: '#000000',
            borderRadius: 6,
            alignSelf: 'center',
            marginBottom: 8,
          }}
        />

        {/* Screen Display Container */}
        <div
          style={{
            flex: 1,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: '#1E293B',
            position: 'relative',
          }}
        >
          {resolvedSrc ? (
            <Img
              src={resolvedSrc}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: 18,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              APP SCREEN
            </div>
          )}

          {/* Glossy Screen Glare Reflection */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '45%',
              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
});

/**
 * 4. Isometric Server Skyscraper (Extruded Building Tower with Floor Windows)
 */
const IsometricBuilding = memo(({
  config = {},
  animProgress,
}: {
  config: IsometricBuildingConfig;
  animProgress: number;
}) => {
  const w = config.width ?? 160;
  const floors = config.floors ?? 5;
  const floorH = config.floorHeight ?? 36;
  const totalH = floors * floorH * animProgress;

  const isoW = w * 0.866;
  const isoH = w * 0.5;
  const buildingColor = config.buildingColor ?? '#1E293B';
  const glowColor = config.windowGlowColor ?? '#FACC15';

  return (
    <svg width={w * 2} height={totalH + isoH * 2 + 40} viewBox={`0 0 ${w * 2} ${totalH + isoH * 2 + 40}`} style={{ overflow: 'visible' }}>
      <g transform={`translate(${w}, ${isoH + 10})`}>
        {/* Left Facade */}
        <polygon
          points={`0,0 ${-isoW},${isoH} ${-isoW},${isoH + totalH} 0,${totalH}`}
          fill={buildingColor}
        />

        {/* Right Facade */}
        <polygon
          points={`0,0 ${isoW},${isoH} ${isoW},${isoH + totalH} 0,${totalH}`}
          fill="#0F172A"
        />

        {/* Roof Top Face */}
        <polygon
          points={`0,${-isoH} ${isoW},0 0,${isoH} ${-isoW},0`}
          fill="#334155"
        />

        {/* Windows / Server Rack LEDs */}
        {Array.from({ length: floors }).map((_, f) => {
          const y = (f + 0.5) * floorH * animProgress;
          return (
            <g key={f}>
              <circle cx={-isoW * 0.5} cy={y + isoH * 0.5} r={3} fill={glowColor} filter={`drop-shadow(0 0 6px ${glowColor})`} />
              <circle cx={-isoW * 0.3} cy={y + isoH * 0.35} r={3} fill={glowColor} filter={`drop-shadow(0 0 6px ${glowColor})`} />
              <circle cx={isoW * 0.4} cy={y + isoH * 0.4} r={3} fill="#38BDF8" filter="drop-shadow(0 0 6px #38BDF8)" />
            </g>
          );
        })}
      </g>
    </svg>
  );
});

// =========================================================================
// 4. SINGLE TIME-WINDOWED ISOMETRIC LAYER VIEW
// =========================================================================

const SingleIsometricView = memo(({ layer }: { layer: DynamicIsometricLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(layer.durationSeconds * fps));

  // ── Entrance Motion ──
  let enterProgress = 1.0;
  const inAnim = layer.inAnimation ?? 'spring-pop';
  if (inAnim === 'spring-pop' || inAnim === 'extrude-up') {
    enterProgress = spring({
      frame,
      fps,
      config: { damping: 12, stiffness: 180, mass: 0.6 },
    });
  } else if (inAnim === 'slide-up') {
    enterProgress = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  }

  // ── Idle Floating Bob ──
  let bobY = 0;
  if (layer.floatingBob) {
    bobY = Math.sin((frame / fps) * 2.5) * 8;
  }

  // ── Exit Motion ──
  let exitScale = 1.0;
  let exitOpacity = 1.0;
  const outAnim = layer.outAnimation ?? 'shrink';
  const outDur = 8;
  const exitStartFrame = Math.max(0, totalDurationFrames - outDur);

  if (frame >= exitStartFrame) {
    const exitProgress = frame - exitStartFrame;
    if (outAnim === 'shrink') {
      exitScale = interpolate(exitProgress, [0, outDur], [1, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      exitOpacity = interpolate(exitProgress, [0, outDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    } else if (outAnim === 'fade') {
      exitOpacity = interpolate(exitProgress, [0, outDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    }
  }

  const finalScale = (layer.scale ?? 1.0) * enterProgress * exitScale;
  const finalOpacity = (layer.opacity ?? 1.0) * exitOpacity;
  const finalX = layer.x;
  const finalY = layer.y + bobY;
  const finalRot = layer.rotationDeg ?? 0;

  let content: React.ReactNode = null;
  switch (layer.archetype) {
    case 'cube':
      content = <IsometricCube config={layer.cube ?? {}} extrudeProgress={enterProgress} />;
      break;
    case 'platform':
      content = <IsometricPlatform config={layer.platform ?? {}} animProgress={enterProgress} />;
      break;
    case 'device-mockup':
      content = <IsometricDevice config={layer.device ?? {}} animProgress={enterProgress} />;
      break;
    case 'server-building':
      content = <IsometricBuilding config={layer.building ?? {}} animProgress={enterProgress} />;
      break;
    default:
      content = null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: finalOpacity,
        zIndex: layer.zIndex ?? 16,
        transformOrigin: 'center center',
        // GPU composite layer translate3d
        transform: `translate3d(${finalX}px, ${finalY}px, 0) scale(${finalScale.toFixed(4)}) rotate(${finalRot}deg)`,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}
    </div>
  );
});

// =========================================================================
// 5. MAIN MULTI-LAYER ISOMETRIC OVERLAY STAGE
// =========================================================================

export interface IsometricPerspectiveOverlayProps {
  layers?: DynamicIsometricLayer[];
}

export const IsometricPerspectiveOverlay: React.FC<IsometricPerspectiveOverlayProps> = ({ layers = [] }) => {
  const { fps } = useVideoConfig();

  if (!layers || layers.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 16,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {layers.map((layer) => {
        const fromFrame = Math.round(layer.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(layer.durationSeconds * fps));

        return (
          <Sequence
            key={layer.id}
            name={`isometric-${layer.archetype}-${layer.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleIsometricView layer={layer} />
          </Sequence>
        );
      })}
    </div>
  );
};
