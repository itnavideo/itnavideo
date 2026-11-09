import React, { memo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// =========================================================================
// 1. GAUGE & PROGRESS VISUALIZATION SCHEMA
// =========================================================================

export type GaugeType =
  | 'percentage-ring'     // Circular ring with center % and animated progress
  | 'speedometer'         // 220° Semicircular radial arc with needle pointer
  | 'linear-meter'        // Horizontal progress bar with glowing bead
  | 'counter'             // Large numerical spring count-up ($0 -> $100k)
  | 'concentric-rings'    // 3 Concentric activity rings (Apple Fitness style)
  | 'loading-spinner';    // High-tech circular loader with glowing head

export interface ConcentricRingItem {
  label: string;
  value: number;        // 0 to 100%
  color: string;
}

export interface DynamicGaugeLayer {
  id: string;
  type: GaugeType;
  startSeconds: number;
  durationSeconds: number;

  // Viewport Coordinates (1080x1920 reference space)
  x: number;
  y: number;
  scale?: number;         // Default 1.0

  // Values & Progress
  startValue?: number;    // Default 0
  targetValue: number;    // e.g. 88 (for 88%) or 250000 (for $250k)
  maxValue?: number;      // Default 100
  prefix?: string;        // e.g. '$' or '+'
  suffix?: string;        // e.g. '%' or 'k' or 'x'
  decimals?: number;      // Default 0

  // Labels & Copy
  title?: string;
  subtitle?: string;

  // Concentric Rings Data (for type === 'concentric-rings')
  rings?: ConcentricRingItem[];

  // Styling & Theme
  color?: string;         // Primary accent (default '#10B981')
  trackColor?: string;    // Background track (default 'rgba(255, 255, 255, 0.12)')
  strokeWidth?: number;   // Default 18

  // Animation
  animDurationFrames?: number; // Default 24 frames
  easing?: 'spring' | 'cubic-out';
  inAnimation?: 'spring-pop' | 'slide-up' | 'scale';
  outAnimation?: 'shrink' | 'fade';
  zIndex?: number;
}

// =========================================================================
// 2. PROCEDURAL GAUGE RENDERERS (Zero Heavy Compute, Pure Math)
// =========================================================================

/**
 * 1. Percentage Ring: Circular progress bar with center percentage readout
 */
const PercentageRingGauge = memo(({
  layer,
  currentValue,
  progress,
}: {
  layer: DynamicGaugeLayer;
  currentValue: number;
  progress: number;
}) => {
  const size = 260;
  const strokeW = layer.strokeWidth ?? 20;
  const radius = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - (currentValue / (layer.maxValue ?? 100)));
  const color = layer.color ?? '#10B981';

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={layer.trackColor ?? 'rgba(255, 255, 255, 0.12)'}
          strokeWidth={strokeW}
        />
        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`drop-shadow(0 0 12px ${color}80)`}
        />
      </svg>

      {/* Center Label Readout */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
          {layer.prefix}{Math.round(currentValue)}{layer.suffix ?? '%'}
        </span>
        {layer.title && (
          <span style={{ fontSize: 13, fontWeight: 800, color: color, textTransform: 'uppercase', marginTop: 6, letterSpacing: '0.06em' }}>
            {layer.title}
          </span>
        )}
      </div>
    </div>
  );
});

/**
 * 2. Speedometer: 220° Radial Arc with Tick Marks & Needle Pointer
 */
const SpeedometerGauge = memo(({
  layer,
  currentValue,
}: {
  layer: DynamicGaugeLayer;
  currentValue: number;
}) => {
  const size = 300;
  const max = layer.maxValue ?? 100;
  const fraction = Math.min(1, Math.max(0, currentValue / max));
  // Needle rotates from -110° to +110° (total 220° sweep)
  const needleAngle = -110 + fraction * 220;
  const color = layer.color ?? '#FF5722';

  // Arc path math (220 degrees)
  const cx = size / 2;
  const cy = size / 2 + 20;
  const r = 110;

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size * 0.85}px` }}>
      <svg width={size} height={size * 0.85} viewBox={`0 0 ${size} ${size * 0.85}`} style={{ overflow: 'visible' }}>
        {/* Background Track Arc */}
        <path
          d="M 60,195 A 110,110 0 1,1 240,195"
          fill="none"
          stroke={layer.trackColor ?? 'rgba(255, 255, 255, 0.15)'}
          strokeWidth={16}
          strokeLinecap="round"
        />

        {/* Needle Center Pivot Pin */}
        <circle cx={cx} cy={cy} r={10} fill="#FFFFFF" />
        <circle cx={cx} cy={cy} r={5} fill="#0F172A" />

        {/* Dynamic Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - r + 15}
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          transform={`rotate(${needleAngle} ${cx} ${cy})`}
          filter={`drop-shadow(0 0 8px ${color})`}
        />
      </svg>

      {/* Value Readout below gauge */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 0,
          right: 0,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 38, fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
          {layer.prefix}{Math.round(currentValue)}{layer.suffix ?? ''}
        </span>
        {layer.title && (
          <span style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginTop: 4, letterSpacing: '0.08em' }}>
            {layer.title}
          </span>
        )}
      </div>
    </div>
  );
});

/**
 * 3. Linear Meter: Horizontal Bar with Glowing Bead & Percentage Readout
 */
const LinearMeterGauge = memo(({
  layer,
  currentValue,
}: {
  layer: DynamicGaugeLayer;
  currentValue: number;
}) => {
  const w = 420;
  const h = 24;
  const max = layer.maxValue ?? 100;
  const fraction = Math.min(1, Math.max(0, currentValue / max));
  const color = layer.color ?? '#38BDF8';

  return (
    <div
      style={{
        width: `${w}px`,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: '16px 20px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {layer.title ?? 'PROGRESS'}
        </span>
        <span style={{ fontSize: 16, fontWeight: 900, color: color }}>
          {layer.prefix}{Math.round(currentValue)}{layer.suffix ?? '%'}
        </span>
      </div>

      {/* Horizontal Bar Track */}
      <div
        style={{
          width: '100%',
          height: `${h}px`,
          backgroundColor: layer.trackColor ?? 'rgba(255, 255, 255, 0.1)',
          borderRadius: 9999,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Animated Fill */}
        <div
          style={{
            width: `${fraction * 100}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 9999,
            boxShadow: `0 0 16px ${color}B3`,
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
});

/**
 * 4. Numerical Counter: High-Impact Spring Count-Up Display ($0 -> $100k)
 */
const CounterGauge = memo(({
  layer,
  currentValue,
}: {
  layer: DynamicGaugeLayer;
  currentValue: number;
}) => {
  const formatted = currentValue.toLocaleString(undefined, {
    minimumFractionDigits: layer.decimals ?? 0,
    maximumFractionDigits: layer.decimals ?? 0,
  });

  const color = layer.color ?? '#FACC15';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 32px',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div style={{ fontSize: 58, fontWeight: 900, color: color, lineHeight: 1, letterSpacing: '-0.02em', filter: `drop-shadow(0 0 16px ${color}80)` }}>
        {layer.prefix}{formatted}{layer.suffix}
      </div>
      {layer.title && (
        <div style={{ fontSize: 13, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginTop: 8, letterSpacing: '0.08em' }}>
          {layer.title}
        </div>
      )}
    </div>
  );
});

/**
 * 5. Concentric Activity Rings (Apple Watch Fitness 3-Ring Style)
 */
const ConcentricRingsGauge = memo(({
  layer,
  progress,
}: {
  layer: DynamicGaugeLayer;
  progress: number;
}) => {
  const size = 280;
  const defaultRings: ConcentricRingItem[] = layer.rings ?? [
    { label: 'RETENTION', value: 92, color: '#EF4444' },
    { label: 'ENGAGEMENT', value: 84, color: '#10B981' },
    { label: 'CONVERSION', value: 76, color: '#38BDF8' },
  ];

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {defaultRings.map((ring, idx) => {
          const r = 110 - idx * 26;
          const strokeW = 18;
          const circ = 2 * Math.PI * r;
          const fraction = (ring.value / 100) * progress;
          const offset = circ * (1 - fraction);

          return (
            <g key={idx}>
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeW}
                opacity={0.2}
              />
              {/* Active Progress Ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeW}
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                filter={`drop-shadow(0 0 8px ${ring.color}80)`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
});

/**
 * 6. High-Tech Rotating Loader Ring
 */
const LoadingSpinnerGauge = memo(({
  layer,
  frame,
  fps,
}: {
  layer: DynamicGaugeLayer;
  frame: number;
  fps: number;
}) => {
  const size = 180;
  const rotation = ((frame / fps) * 240) % 360;
  const color = layer.color ?? '#38BDF8';

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={70}
          fill="none"
          stroke={layer.trackColor ?? 'rgba(255, 255, 255, 0.12)'}
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={70}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray="140 300"
          strokeLinecap="round"
          filter={`drop-shadow(0 0 10px ${color})`}
        />
      </svg>
      {layer.title && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 800,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {layer.title}
        </div>
      )}
    </div>
  );
});

// =========================================================================
// 3. SINGLE TIME-WINDOWED GAUGE VIEW
// =========================================================================

const SingleGaugeView = memo(({ layer }: { layer: DynamicGaugeLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(layer.durationSeconds * fps));
  const animDur = layer.animDurationFrames ?? 24;

  // ── Mathematical Value Interpolation ──
  let progress = 1.0;
  if (layer.easing === 'spring') {
    progress = spring({
      frame,
      fps,
      config: { damping: 14, stiffness: 120, mass: 0.6 },
    });
    progress = Math.min(1, Math.max(0, progress));
  } else {
    progress = interpolate(frame, [0, animDur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth cubic out
    });
  }

  const startVal = layer.startValue ?? 0;
  const currentValue = startVal + (layer.targetValue - startVal) * progress;

  // ── Entrance Motion ──
  let enterScale = 1.0;
  let enterOpacity = 1.0;
  const inAnim = layer.inAnimation ?? 'spring-pop';
  if (inAnim === 'spring-pop') {
    enterScale = spring({
      frame,
      fps,
      config: { damping: 11, stiffness: 200, mass: 0.6 },
    });
    enterOpacity = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
  } else if (inAnim === 'slide-up') {
    enterScale = interpolate(frame, [0, 8], [0.8, 1.0], { extrapolateRight: 'clamp' });
    enterOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
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

  const finalScale = (layer.scale ?? 1.0) * enterScale * exitScale;
  const finalOpacity = enterOpacity * exitOpacity;

  let content: React.ReactNode = null;
  switch (layer.type) {
    case 'percentage-ring':
      content = <PercentageRingGauge layer={layer} currentValue={currentValue} progress={progress} />;
      break;
    case 'speedometer':
      content = <SpeedometerGauge layer={layer} currentValue={currentValue} />;
      break;
    case 'linear-meter':
      content = <LinearMeterGauge layer={layer} currentValue={currentValue} />;
      break;
    case 'counter':
      content = <CounterGauge layer={layer} currentValue={currentValue} />;
      break;
    case 'concentric-rings':
      content = <ConcentricRingsGauge layer={layer} progress={progress} />;
      break;
    case 'loading-spinner':
      content = <LoadingSpinnerGauge layer={layer} frame={frame} fps={fps} />;
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
        zIndex: layer.zIndex ?? 22,
        transformOrigin: 'center center',
        // GPU composite layer translate3d
        transform: `translate3d(${layer.x}px, ${layer.y}px, 0) scale(${finalScale.toFixed(4)})`,
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
// 4. MAIN MULTI-LAYER GAUGE OVERLAY STAGE
// =========================================================================

export interface MultiLayerGaugeOverlayProps {
  gauges?: DynamicGaugeLayer[];
}

export const MultiLayerGaugeOverlay: React.FC<MultiLayerGaugeOverlayProps> = ({ gauges = [] }) => {
  const { fps } = useVideoConfig();

  if (!gauges || gauges.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 22,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {gauges.map((gauge) => {
        const fromFrame = Math.round(gauge.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(gauge.durationSeconds * fps));

        return (
          <Sequence
            key={gauge.id}
            name={`gauge-${gauge.type}-${gauge.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleGaugeView layer={gauge} />
          </Sequence>
        );
      })}
    </div>
  );
};

