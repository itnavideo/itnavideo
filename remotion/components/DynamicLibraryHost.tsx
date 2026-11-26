import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Direct suite imports for 100% deterministic, zero-circularity resolution
import * as Charts from '../library/charts';
import * as Diagrams from '../library/diagrams';
import * as Timelines from '../library/timelines';
import * as Comparisons from '../library/comparisons';
import * as Radial from '../library/radial';
import * as Business from '../library/business';
import * as Network from '../library/network';
import * as Statistics from '../library/statistics';
import * as UiMockups from '../library/ui-mockups';
import * as Primitives from '../library/primitives';
import * as Graphics from '../library/graphics';
import * as Infographics from '../library/infographics';
import * as Scenes from '../library/scenes';
import * as MotionTemplates from '../library/motion-templates';
import * as Overlays from '../library/overlays';
import * as Editorial from '../library/editorial';
import * as Engineering from '../library/engineering';
import * as Finance from '../library/finance';
import * as Geography from '../library/geography';
import * as Isometric from '../library/isometric';
import * as Mathematics from '../library/mathematics';
import * as Scientific from '../library/scientific';
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
  fullScreen?: boolean;
}

// Ordered suites pool
const SUITE_MODULES: Record<string, any>[] = [
  Charts,
  Diagrams,
  Timelines,
  Comparisons,
  Radial,
  Business,
  Network,
  Statistics,
  UiMockups,
  Primitives,
  Graphics,
  Infographics,
  Scenes,
  MotionTemplates,
  Overlays,
  Editorial,
  Engineering,
  Finance,
  Geography,
  Isometric,
  Mathematics,
  Scientific,
  Library,
];

// In-memory cache for fast hot-lookup
const COMPONENT_CACHE = new Map<string, React.FC<any>>();

export function getComponentById(componentId: string): React.FC<any> | null {
  if (!componentId) return null;
  const raw = componentId.trim();
  const normalized = raw.toLowerCase().replace(/[…._\s]/g, '-');

  if (COMPONENT_CACHE.has(normalized)) {
    return COMPONENT_CACHE.get(normalized)!;
  }

  // Registry lookup
  const meta = REMOTION_COMPONENT_REGISTRY.find(
    (c) => c.id.toLowerCase() === normalized || c.name.toLowerCase() === normalized
  );

  // Build candidate names
  const candidates: string[] = [];
  if (meta?.name) candidates.push(meta.name);
  candidates.push(raw);

  // Clean PascalCase
  const cleanPascal = raw
    .replace(/[…._]/g, '-')
    .split(/[-\s]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('');
  candidates.push(cleanPascal);

  // Exact lowercase alphanumeric
  const alphaOnly = raw.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Specific aliases
  if (normalized.includes('line-chart') || normalized === 'linechart') candidates.push('LineChart');
  if (normalized.includes('area-chart') || normalized === 'areachart') candidates.push('AreaChart');
  if (normalized.includes('bar-chart') || normalized === 'barchart') candidates.push('BarChart', 'VideoBarChart', 'MotionBarChart');
  if (normalized.includes('pie-chart') || normalized === 'piechart') candidates.push('PieChart');
  if (normalized.includes('donut-chart') || normalized === 'donutchart') candidates.push('DonutChart');
  if (normalized.includes('radar-chart') || normalized === 'radarchart') candidates.push('RadarChart');
  if (normalized.includes('progress-bar') || normalized === 'progressbar') candidates.push('UiProgressBar', 'MotionProgressBar', 'ProgressBar');
  if (normalized.includes('notification')) candidates.push('VideoNotification', 'NotificationToast', 'Notification');
  if (normalized.includes('toggle')) candidates.push('Toggle', 'MotionToggle');
  if (normalized.includes('like')) candidates.push('LikeBurst');
  if (normalized.includes('spinner')) candidates.push('Spinner', 'VideoSpinner');
  if (normalized.includes('checkbox')) candidates.push('Checkbox', 'MotionCheckbox');
  if (normalized.includes('radio-group')) candidates.push('RadioGroup', 'MotionRadioGroup');
  if (normalized.includes('card-flip')) candidates.push('CardFlip');
  if (normalized.includes('studio-card') || normalized === 'studiocard') candidates.push('StudioCard');
  if (normalized.includes('scene-header') || normalized === 'sceneheader') candidates.push('SceneHeader');
  if (normalized.includes('scene-canvas') || normalized === 'scenecanvas') candidates.push('SceneCanvas');
  if (normalized.includes('step-number') || normalized === 'stepnumberbadge') candidates.push('StepNumberBadge');
  if (normalized.includes('eyebrow')) candidates.push('EyebrowPill');

  // Search through all suites
  for (const mod of SUITE_MODULES) {
    if (!mod) continue;

    // 1. Direct candidate match
    for (const name of candidates) {
      const comp = mod[name];
      if (comp && (typeof comp === 'function' || typeof comp === 'object')) {
        COMPONENT_CACHE.set(normalized, comp);
        return comp;
      }
    }

    // 2. Case-insensitive key scan
    const keys = Object.keys(mod);
    for (const key of keys) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey === normalized ||
        lowerKey === cleanPascal.toLowerCase() ||
        lowerKey.replace(/[^a-z0-9]/g, '') === alphaOnly
      ) {
        const comp = mod[key];
        if (comp && (typeof comp === 'function' || typeof comp === 'object')) {
          COMPONENT_CACHE.set(normalized, comp);
          return comp;
        }
      }
    }
  }

  return null;
}

/**
 * Intelligent default props & sample children generator so every single
 * component renders at full video scale with rich content rather than blank/tiny boxes.
 */
function getComponentSampleProps(
  componentId: string,
  isDark: boolean,
  isVertical: boolean
): Record<string, any> {
  const id = componentId.toLowerCase();

  // Primitives that require children
  if (id.includes('studio-card') || id === 'studiocard') {
    return {
      accentTone: 'orange',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                backgroundColor: '#EA580C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 34,
                boxShadow: '0 8px 24px rgba(234, 88, 12, 0.4)',
              }}
            >
              🎬
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em' }}>
                Studio Production Card
              </div>
              <div style={{ fontSize: 18, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, marginTop: 4 }}>
                Broadcast-grade motion graphics surface • 1080p
              </div>
            </div>
          </div>
          <div style={{ height: 2, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)', margin: '4px 0' }} />
          <div style={{ fontSize: 22, lineHeight: 1.6, color: isDark ? '#CBD5E1' : '#334155', fontWeight: 500 }}>
            Engineered for high-retention video explainers with top accent rules, subtle frosted borders, soft ambient glow, and fluid Remotion spring motion.
          </div>
        </div>
      ),
    };
  }

  if (id.includes('scene-header') || id === 'sceneheader') {
    return {
      heading: 'Audience Retention & Growth',
      supportingText: 'Month-over-month active trajectory across YouTube, Reels, and TikTok',
      align: 'center',
      headingFont: 'Lora, serif',
    };
  }

  if (id.includes('scene-canvas') || id === 'scenecanvas') {
    return {
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em' }}>
            Broadcast Safe-Zone Canvas
          </div>
          <div style={{ fontSize: 22, color: isDark ? '#94A3B8' : '#64748B', maxWidth: 880, lineHeight: 1.5 }}>
            Maintains strict 60px safe title margins across 16:9 widescreen and 9:16 vertical reels with architectural alignment grids.
          </div>
        </div>
      ),
    };
  }

  if (id.includes('step-number') || id === 'stepnumberbadge') {
    return {
      stepNumber: 1,
      label: 'Hook & Retention Beat',
    };
  }

  if (id.includes('eyebrow')) {
    return {
      text: 'FEATURE HIGHLIGHT',
    };
  }

  // Charts
  if (id.includes('chart')) {
    return {
      width: '100%',
      height: isVertical ? 680 : 540,
      delayFrames: 0,
    };
  }

  return {
    width: '100%',
  };
}

/**
 * DynamicLibraryHost:
 * Autonomous Remotion Broadcast Renderer for all 1,292 Motion Graphic Components.
 * Renders every component at full video scale (1760x940 in 16:9), clean 2D proportions,
 * high-contrast light/dark themes, and valid sample props.
 */
export const DynamicLibraryHost: React.FC<DynamicLibraryHostProps> = ({
  componentId,
  props = {},
  cinematic = false,
  sceneFrame,
  sceneDurationFrames,
  palette,
  scale = 1.0,
  placement = 'center',
  fullScreen = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const isVertical = height > width;

  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;
  const currentDuration = sceneDurationFrames !== undefined ? sceneDurationFrames : (durationInFrames || 180);

  // Resolve component dynamically
  const TargetComponent = React.useMemo(() => getComponentById(componentId), [componentId]);

  // Entrance physics: scale down smoothly from 1.15 -> 1.0 on entrance, fade out cleanly at exit
  const isInspectorMode = !cinematic;
  const enterSpring = isInspectorMode
    ? 1.0
    : spring({ frame: currentFrame, fps, config: { damping: 16, stiffness: 110 } });

  const entranceScale = isInspectorMode ? 1.0 : interpolate(enterSpring, [0, 1], [1.15, 1.0]);
  const exitProgress = isInspectorMode
    ? 1.0
    : interpolate(currentFrame, [Math.max(0, currentDuration - 10), currentDuration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const exitScale = isInspectorMode ? 1.0 : interpolate(exitProgress, [0, 1], [0.96, 1.0]);
  const combinedOpacity = isInspectorMode ? 1.0 : Math.min(enterSpring, exitProgress);
  const baseScale = isVertical ? 1.08 : 1.0;
  const effectiveScale = (scale || 1.0) * baseScale * entranceScale * exitScale;

  const isDark = palette?.isDark === true;

  // Broadcast safe canvas sizing (stays inside 1920x1080 / 1080x1920 safe margins)
  const containerWidth = isVertical ? 960 : 1680;
  const containerHeight = isVertical ? 1720 : 900;

  // Generate sample props if none were passed
  const sampleProps = React.useMemo(
    () => getComponentSampleProps(componentId, isDark, isVertical),
    [componentId, isDark, isVertical]
  );

  const mergedProps = {
    ...sampleProps,
    ...props,
    theme: isDark ? 'dark' : 'light',
    palette: { isDark },
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        backgroundColor: 'transparent',
      }}
    >
      {/* Broadcast Canvas Stage — Clean, Seamless, Larger & Animated */}
      <div
        style={{
          width: '100%',
          height: '100%',
          maxWidth: `${containerWidth}px`,
          maxHeight: `${containerHeight}px`,
          opacity: combinedOpacity,
          transform: `scale(${effectiveScale})`,
          transformOrigin: 'center center',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 36px',
          boxSizing: 'border-box',
        }}
      >
        {TargetComponent ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TargetComponent {...mergedProps} />
          </div>
        ) : (props?.title || props?.heading) ? (
          /* Clean Editorial Concept Fallback if a component ID is unresolved */
          <div
            style={{
              width: '100%',
              maxWidth: isVertical ? 880 : 1240,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: isDark ? '#FFFFFF' : '#0F172A',
              padding: '48px 56px',
              borderRadius: 28,
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)',
              border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.1)'}`,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.18)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: 64, height: 5, borderRadius: 99, backgroundColor: '#EA580C' }} />
            <div style={{ fontSize: isVertical ? 44 : 52, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {props.title || props.heading}
            </div>
            {props.subtitle && (
              <div style={{ fontSize: isVertical ? 24 : 26, color: isDark ? '#CBD5E1' : '#475569', maxWidth: 880, lineHeight: 1.5, fontWeight: 500 }}>
                {props.subtitle}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DynamicLibraryHost;
