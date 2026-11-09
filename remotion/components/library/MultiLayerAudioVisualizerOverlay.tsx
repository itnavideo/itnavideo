import React, { memo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Sequence, Img } from 'remotion';
import { safeResolveMediaSrc } from '../../utils/safeMedia';

// =========================================================================
// 1. AUDIO VISUALIZER & WAVEFORM SCHEMA
// =========================================================================

export type AudioVisualizerType =
  | 'equalizer-bars'        // Classic jumping vertical frequency bars
  | 'smooth-wave'           // Continuous fluid sinusoidal waveform line
  | 'spectrum-area'         // Mountainous filled audio frequency spectrum
  | 'circular-audiogram'    // Radial sunburst ring surrounding center avatar
  | 'pulsing-dots';         // Matrix of vertical bouncing dot columns

export interface DynamicAudioVisualizerLayer {
  id: string;
  type: AudioVisualizerType;
  startSeconds: number;
  durationSeconds: number;

  // Viewport Coordinates (1080x1920 reference space)
  x: number;
  y: number;
  width?: number;         // Overall visualizer width (default 480 to 720 px)
  maxHeight?: number;     // Peak wave height in px (default 90)

  // Visualizer Parameters
  barsCount?: number;     // Number of bars (default 32)
  barWidth?: number;      // Width of each bar in px (default 6)
  gap?: number;           // Gap between bars in px (default 4)
  mirror?: boolean;       // Symmetrical vertical reflection (default true)
  roundCaps?: boolean;    // Rounded bar caps (default true)

  // Circular Audiogram specific
  centerAvatarSrc?: string; // Image inside radial ring
  centerRadius?: number;    // Radius of center circle in px (default 65)

  // Audio Reaction & Energy
  energyTimeline?: number[]; // Optional normalized 0-1 energy array
  sensitivity?: number;      // Multiplier (default 1.0)

  // Styling & Theme
  color?: string;         // Primary wave color (default '#10B981')
  secondaryColor?: string;// Gradient color (default '#38BDF8')
  glow?: boolean;         // Neon glow filter (default true)
  opacity?: number;       // Default 1.0
  zIndex?: number;        // Default 25
}

// =========================================================================
// 2. PROCEDURAL AUDIO WAVE ENERGY FORMULA
// =========================================================================

/**
 * Calculates synthetic frame-accurate audio energy when pre-analyzed waveform array is omitted.
 * Combines multi-frequency harmonics to simulate realistic human speech cadences!
 */
function getSpeechCadence(frame: number, fps: number, barIndex: number, totalBars: number, sensitivity: number = 1.0): number {
  const t = (frame / fps) * 3.5;
  const normalizedIndex = barIndex / totalBars;

  // Fundamental voice pitch harmonic + rhythm burst
  const speechRhythm = Math.sin(t * 1.8) * Math.cos(t * 0.9);
  const speechActive = speechRhythm > -0.2 ? 1.0 : 0.2; // Syllables vs micro-pauses

  // Harmonic distribution: voice energy peaks in mid-low frequencies (30% to 60%)
  const freqBell = Math.sin(normalizedIndex * Math.PI);

  const jitter1 = Math.sin(t * 7.2 + barIndex * 1.3) * 0.35;
  const jitter2 = Math.cos(t * 11.5 + barIndex * 2.1) * 0.25;

  const raw = (0.25 + freqBell * 0.65 + jitter1 + jitter2) * speechActive * sensitivity;
  return Math.min(1.0, Math.max(0.08, raw));
}

// =========================================================================
// 3. INDIVIDUAL AUDIO VISUALIZER RENDERERS
// =========================================================================

/**
 * 1. Equalizer Bars: Jumping vertical bars with optional vertical mirror
 */
const EqualizerBarsVisualizer = memo(({
  layer,
  frame,
  fps,
}: {
  layer: DynamicAudioVisualizerLayer;
  frame: number;
  fps: number;
}) => {
  const barsCount = layer.barsCount ?? 32;
  const barW = layer.barWidth ?? 6;
  const maxH = layer.maxHeight ?? 90;
  const mirror = layer.mirror ?? true;
  const color = layer.color ?? '#10B981';
  const secColor = layer.secondaryColor ?? '#38BDF8';
  const totalW = layer.width ?? 520;
  const gap = (totalW - barsCount * barW) / Math.max(1, barsCount - 1);

  return (
    <div style={{ position: 'relative', width: `${totalW}px`, height: `${mirror ? maxH * 2 : maxH}px` }}>
      <svg
        width={totalW}
        height={mirror ? maxH * 2 : maxH}
        viewBox={`0 0 ${totalW} ${mirror ? maxH * 2 : maxH}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`eq-grad-${layer.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secColor} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>

        {Array.from({ length: barsCount }).map((_, idx) => {
          const energy = getSpeechCadence(frame, fps, idx, barsCount, layer.sensitivity);
          const barH = Math.max(6, energy * maxH);
          const x = idx * (barW + gap);
          const centerY = mirror ? maxH : maxH;
          const y = mirror ? centerY - barH : maxH - barH;
          const actualH = mirror ? barH * 2 : barH;

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barW}
              height={actualH}
              rx={layer.roundCaps !== false ? barW / 2 : 0}
              fill={`url(#eq-grad-${layer.id})`}
              filter={layer.glow !== false ? `drop-shadow(0 0 8px ${color}80)` : undefined}
            />
          );
        })}
      </svg>
    </div>
  );
});

/**
 * 2. Smooth Wave: Continuous fluid sinusoidal audio curve
 */
const SmoothWaveVisualizer = memo(({
  layer,
  frame,
  fps,
}: {
  layer: DynamicAudioVisualizerLayer;
  frame: number;
  fps: number;
}) => {
  const totalW = layer.width ?? 640;
  const maxH = layer.maxHeight ?? 80;
  const color = layer.color ?? '#38BDF8';
  const pointsCount = 48;
  const step = totalW / pointsCount;

  const pts: string[] = [];
  for (let i = 0; i <= pointsCount; i++) {
    const x = i * step;
    const energy = getSpeechCadence(frame, fps, i, pointsCount, layer.sensitivity);
    const y = maxH / 2 + Math.sin(i * 0.45 + (frame / fps) * 4) * (energy * (maxH / 2));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <div style={{ position: 'relative', width: `${totalW}px`, height: `${maxH}px` }}>
      <svg width={totalW} height={maxH} viewBox={`0 0 ${totalW} ${maxH}`} style={{ overflow: 'visible' }}>
        <path
          d={`M ${pts.join(' L ')}`}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={layer.glow !== false ? `drop-shadow(0 0 10px ${color})` : undefined}
        />
      </svg>
    </div>
  );
});

/**
 * 3. Spectrum Area: Filled mountainous frequency wave with gradient wash
 */
const SpectrumAreaVisualizer = memo(({
  layer,
  frame,
  fps,
}: {
  layer: DynamicAudioVisualizerLayer;
  frame: number;
  fps: number;
}) => {
  const totalW = layer.width ?? 600;
  const maxH = layer.maxHeight ?? 110;
  const color = layer.color ?? '#FF5722';
  const secColor = layer.secondaryColor ?? '#FACC15';
  const segments = 40;
  const step = totalW / segments;

  const pts: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const energy = getSpeechCadence(frame, fps, i, segments, layer.sensitivity);
    const y = maxH - energy * maxH;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const d = `M 0,${maxH} L ${pts.join(' L ')} L ${totalW},${maxH} Z`;

  return (
    <div style={{ position: 'relative', width: `${totalW}px`, height: `${maxH}px` }}>
      <svg width={totalW} height={maxH} viewBox={`0 0 ${totalW} ${maxH}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`spectrum-grad-${layer.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <path d={d} fill={`url(#spectrum-grad-${layer.id})`} />
        <path d={`M ${pts.join(' L ')}`} fill="none" stroke={secColor} strokeWidth={3} strokeLinecap="round" />
      </svg>
    </div>
  );
});

/**
 * 4. Circular Audiogram: Radial sunburst equalizer surrounding a center avatar/logo
 */
const CircularAudiogramVisualizer = memo(({
  layer,
  frame,
  fps,
}: {
  layer: DynamicAudioVisualizerLayer;
  frame: number;
  fps: number;
}) => {
  const r = layer.centerRadius ?? 65;
  const barLen = layer.maxHeight ?? 50;
  const totalSize = (r + barLen) * 2 + 20;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const count = layer.barsCount ?? 40;
  const color = layer.color ?? '#10B981';
  const resolvedAvatar = safeResolveMediaSrc(layer.centerAvatarSrc);

  return (
    <div style={{ position: 'relative', width: `${totalSize}px`, height: `${totalSize}px` }}>
      <svg width={totalSize} height={totalSize} viewBox={`0 0 ${totalSize} ${totalSize}`} style={{ overflow: 'visible' }}>
        {Array.from({ length: count }).map((_, idx) => {
          const angleDeg = (idx / count) * 360;
          const rad = (angleDeg * Math.PI) / 180;
          const energy = getSpeechCadence(frame, fps, idx, count, layer.sensitivity);
          const currentLen = 6 + energy * barLen;

          const x1 = cx + Math.cos(rad) * (r + 4);
          const y1 = cy + Math.sin(rad) * (r + 4);
          const x2 = cx + Math.cos(rad) * (r + 4 + currentLen);
          const y2 = cy + Math.sin(rad) * (r + 4 + currentLen);

          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={3.5}
              strokeLinecap="round"
              filter={layer.glow !== false ? `drop-shadow(0 0 6px ${color}90)` : undefined}
            />
          );
        })}
      </svg>

      {/* Center Circular Avatar Image or Fallback Mic Icon */}
      <div
        style={{
          position: 'absolute',
          left: `${cx - r}px`,
          top: `${cy - r}px`,
          width: `${r * 2}px`,
          height: `${r * 2}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `3px solid ${color}`,
          boxShadow: `0 0 20px ${color}60`,
          backgroundColor: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {resolvedAvatar ? (
          <Img src={resolvedAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 24 }}>🎙️</div>
        )}
      </div>
    </div>
  );
});

// =========================================================================
// 4. MAIN TIME-WINDOWED AUDIO VISUALIZER VIEW
// =========================================================================

const SingleAudioVisualizerView = memo(({ layer }: { layer: DynamicAudioVisualizerLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let content: React.ReactNode = null;
  switch (layer.type) {
    case 'equalizer-bars':
    case 'pulsing-dots':
      content = <EqualizerBarsVisualizer layer={layer} frame={frame} fps={fps} />;
      break;
    case 'smooth-wave':
      content = <SmoothWaveVisualizer layer={layer} frame={frame} fps={fps} />;
      break;
    case 'spectrum-area':
      content = <SpectrumAreaVisualizer layer={layer} frame={frame} fps={fps} />;
      break;
    case 'circular-audiogram':
      content = <CircularAudiogramVisualizer layer={layer} frame={frame} fps={fps} />;
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
        opacity: layer.opacity ?? 1.0,
        zIndex: layer.zIndex ?? 25,
        transformOrigin: 'center center',
        // GPU composite layer translate3d
        transform: `translate3d(${layer.x}px, ${layer.y}px, 0)`,
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
// 5. MAIN MULTI-LAYER AUDIO VISUALIZER OVERLAY STAGE
// =========================================================================

export interface MultiLayerAudioVisualizerOverlayProps {
  visualizers?: DynamicAudioVisualizerLayer[];
}

export const MultiLayerAudioVisualizerOverlay: React.FC<MultiLayerAudioVisualizerOverlayProps> = ({ visualizers = [] }) => {
  const { fps } = useVideoConfig();

  if (!visualizers || visualizers.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {visualizers.map((vis) => {
        const fromFrame = Math.round(vis.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(vis.durationSeconds * fps));

        return (
          <Sequence
            key={vis.id}
            name={`audiowave-${vis.type}-${vis.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleAudioVisualizerView layer={vis} />
          </Sequence>
        );
      })}
    </div>
  );
};

