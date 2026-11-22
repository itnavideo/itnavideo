import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import * as Library from '../library';
import { REMOTION_COMPONENT_REGISTRY } from '../library/registry';

export interface DynamicLibraryHostProps {
  componentId: string;
  props?: Record<string, any>;
  cinematic?: boolean;
  sceneFrame?: number;
  sceneDurationFrames?: number;
  palette?: { isDark?: boolean; primary?: string; bg?: string };
  scale?: number;
  placement?: 'center' | 'lower-third' | 'split-right' | 'split-left';
}

// Fast lookup cache from componentId -> Component React Function
const COMPONENT_MAP = new Map<string, React.FC<any>>();

function getComponentById(componentId: string): React.FC<any> | null {
  if (COMPONENT_MAP.has(componentId)) {
    return COMPONENT_MAP.get(componentId)!;
  }

  const meta = REMOTION_COMPONENT_REGISTRY.find((c) => c.id === componentId);
  if (!meta) return null;

  const componentFn = (Library as Record<string, any>)[meta.name];
  if (componentFn) {
    COMPONENT_MAP.set(componentId, componentFn);
    return componentFn;
  }

  return null;
}

/**
 * DynamicLibraryHost:
 * Autonomous Remotion Broadcast Renderer for all 1,282 Motion Graphic Components.
 * Renders any library component with cinematic 3D perspective, spring entrance,
 * floating ambient hover, and radial bloom lighting so it looks like professional
 * documentary motion design rather than a flat web card.
 */
export const DynamicLibraryHost: React.FC<DynamicLibraryHostProps> = ({
  componentId,
  props = {},
  cinematic = true,
  sceneFrame = 0,
  sceneDurationFrames = 150,
  palette,
  scale = 1.0,
  placement = 'center',
}) => {
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width; // 9:16 vertical shorts vs 16:9 widescreen

  const TargetComponent = React.useMemo(() => getComponentById(componentId), [componentId]);

  if (!TargetComponent) {
    return null;
  }

  // Physics-based snappy spring entry
  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Smooth exit fade in last 8 frames
  const exitOpacity = interpolate(
    sceneFrame,
    [Math.max(0, sceneDurationFrames - 8), sceneDurationFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Subtle breathing hover
  const floatY = Math.sin(sceneFrame / 14) * 5;

  // Responsive sizing & positioning
  const containerWidth = isVertical ? 680 : 880;
  const containerHeight = isVertical ? 420 : 480;

  const perspectiveTransform = cinematic
    ? `perspective(1000px) rotateX(4deg) rotateY(-3deg) scale(${entrance * scale}) translateY(${floatY}px)`
    : `scale(${entrance * scale}) translateY(${floatY}px)`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        pointerEvents: 'none',
        opacity: entrance * exitOpacity,
      }}
    >
      {/* Cinematic Ambient Radial Bloom */}
      {cinematic && (
        <div
          style={{
            position: 'absolute',
            width: `${containerWidth * 1.4}px`,
            height: `${containerHeight * 1.4}px`,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.22) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 75%)',
            filter: 'blur(30px)',
            zIndex: 0,
          }}
        />
      )}

      {/* 3D Motion Graphics Canvas Container */}
      <div
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          transform: perspectiveTransform,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 15px rgba(56, 189, 248, 0.2))',
          borderRadius: '16px',
          overflow: 'hidden',
          zIndex: 1,
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <TargetComponent {...props} theme={palette?.isDark ? 'dark' : 'dark'} />
      </div>
    </div>
  );
};
