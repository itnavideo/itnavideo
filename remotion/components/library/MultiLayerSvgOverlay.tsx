import React, { memo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { ShapeClippingContainer, type ShapeClippingMode, type ShapeClippingRevealAnimation } from './ShapeClippingContainer';

// =========================================================================
// 1. UNIFIED SVG & VECTOR LAYER SCHEMA (10-in-1 Discriminated Payload)
// =========================================================================

export type SvgLayerType =
  | 'illustration'
  | 'icon'
  | 'chart'
  | 'diagram'
  | 'shape'
  | 'annotation'
  | 'path'
  | 'background'
  | 'badge'
  | 'character';

export interface StrokeStyle {
  color: string;
  width: number;
  lineCap?: 'round' | 'butt' | 'square';
  lineJoin?: 'round' | 'bevel' | 'miter';
  dashArray?: number[];
  dashOffset?: number;
}

export interface RawPathElement {
  id: string;
  d: string;
  fill?: string;
  stroke?: StrokeStyle;
  length?: number; // Precomputed path length (Zero runtime getTotalLength calls)
  transform?: string;
}

export type PrimitiveShapeType = 'rectangle' | 'squircle' | 'pill' | 'circle';

export interface ShapeDefinition {
  shapeType: PrimitiveShapeType;
  width: number;
  height: number;
  cornerRadius?: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartDefinition {
  chartType: 'bar' | 'donut' | 'trendline';
  items: ChartDataPoint[];
  maxValue?: number;
  innerRadius?: number;
}

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  label: string;
  color?: string;
  shape?: PrimitiveShapeType;
}

export interface DiagramEdge {
  fromId: string;
  toId: string;
  label?: string;
  dashed?: boolean;
}

export interface DiagramDefinition {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface BackgroundPatternDefinition {
  patternType: 'dots' | 'grid' | 'particles';
  spacing: number;
  dotSize?: number;
  color: string;
}

// 10-in-1 Vector Data Payload
export type VectorDataPayload =
  | { kind: 'raw-paths'; paths: RawPathElement[] }
  | { kind: 'shape'; shape: ShapeDefinition }
  | { kind: 'chart'; chart: ChartDefinition }
  | { kind: 'diagram'; diagram: DiagramDefinition }
  | { kind: 'annotation'; paths?: RawPathElement[]; annotationStyle: 'underline' | 'circle' | 'arrow' | 'box' }
  | { kind: 'path-line'; path: RawPathElement; showHeadMarker?: boolean }
  | { kind: 'pattern'; pattern: BackgroundPatternDefinition };

export interface StrokeDrawAnimation {
  startOffsetFrame?: number;
  durationInFrames: number;
  easing?: 'linear' | 'ease-out' | 'ease-in-out';
}

export interface VectorMotionConfig {
  strokeDraw?: StrokeDrawAnimation;
  enter?: {
    type: 'spring-pop' | 'fade' | 'slide-up' | 'scale' | 'none';
    durationInFrames?: number;
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  exit?: {
    type: 'fade' | 'shrink' | 'slide-down' | 'none';
    durationInFrames?: number;
  };
  continuous?: {
    type: 'pulse' | 'float' | 'wobble' | 'none';
    speed?: number;
  };
}

export interface DynamicSvgLayer {
  id: string;
  type?: SvgLayerType;
  startSeconds: number;
  durationSeconds: number;

  // Viewport & Transform (1080x1920 reference space)
  x: number;             // X coordinate in px (0 to 1080)
  y: number;             // Y coordinate in px (0 to 1920)
  width: number;         // Width in px
  height: number;        // Height in px
  scale?: number;        // Default 1.0
  rotationDeg?: number;  // Default 0
  opacity?: number;      // Default 1.0
  anchor?: { x: number; y: number }; // [0.5, 0.5] default

  viewBox?: { minX: number; minY: number; width: number; height: number };

  // Styling & Theme
  fill?: string;
  stroke?: StrokeStyle;
  blendMode?: React.CSSProperties['mixBlendMode'];
  themePalette?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    surface?: string;
  };

  // Discriminated Vector Data & Motion
  data: VectorDataPayload;
  motion?: VectorMotionConfig;
  clipping?: {
    mode: ShapeClippingMode;
    reveal?: ShapeClippingRevealAnimation;
    customSvgPath?: string;
  };

  isLocked?: boolean;
  isHidden?: boolean;
  zIndex?: number;
}

// =========================================================================
// 2. VECTOR STROKE-DRAW PHYSICS (Deterministic Dash-Offset Calculation)
// =========================================================================

export function computeStrokeDash(
  frame: number,
  totalLength: number,
  anim?: StrokeDrawAnimation
): { strokeDasharray: number; strokeDashoffset: number } {
  if (!anim || totalLength <= 0) {
    return { strokeDasharray: totalLength, strokeDashoffset: 0 };
  }

  const start = anim.startOffsetFrame ?? 0;
  const duration = Math.max(1, anim.durationInFrames);

  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth cubic out
  });

  return {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength * (1 - progress),
  };
}

// =========================================================================
// 3. INLINE VECTOR GENERATORS (Charts, Shapes, Patterns, Diagrams, Annotations)
// =========================================================================

function renderVectorElements(
  data: VectorDataPayload,
  layer: DynamicSvgLayer,
  frame: number,
  fps: number
): React.ReactNode {
  switch (data.kind) {
    case 'raw-paths':
    case 'path-line': {
      const paths = data.kind === 'path-line' ? [data.path] : data.paths;
      return paths.map((p) => {
        const strokeLength = p.length ?? 800;
        const { strokeDasharray, strokeDashoffset } = computeStrokeDash(
          frame,
          strokeLength,
          layer.motion?.strokeDraw
        );

        return (
          <path
            key={p.id}
            d={p.d}
            fill={p.fill ?? layer.fill ?? 'none'}
            stroke={p.stroke?.color ?? layer.stroke?.color ?? 'none'}
            strokeWidth={p.stroke?.width ?? layer.stroke?.width ?? 2}
            strokeLinecap={p.stroke?.lineCap ?? layer.stroke?.lineCap ?? 'round'}
            strokeLinejoin={p.stroke?.lineJoin ?? layer.stroke?.lineJoin ?? 'round'}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            markerEnd={data.kind === 'path-line' && data.showHeadMarker ? `url(#arrowhead-${layer.id})` : undefined}
            transform={p.transform}
          />
        );
      });
    }

    case 'annotation': {
      // If explicit custom paths were passed, render them
      if (data.paths && data.paths.length > 0) {
        return data.paths.map((p) => {
          const strokeLength = p.length ?? 800;
          const { strokeDasharray, strokeDashoffset } = computeStrokeDash(
            frame,
            strokeLength,
            layer.motion?.strokeDraw
          );
          return (
            <path
              key={p.id}
              d={p.d}
              fill="none"
              stroke={p.stroke?.color ?? layer.stroke?.color ?? '#FACC15'}
              strokeWidth={p.stroke?.width ?? layer.stroke?.width ?? 6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          );
        });
      }

      // Otherwise generate kinetic parametric annotation path
      const w = layer.width;
      const h = layer.height;
      let d = '';
      let defaultLength = 600;

      if (data.annotationStyle === 'underline') {
        // Natural hand-drawn wobble underline
        d = `M 4,${h * 0.75} Q ${w * 0.3},${h * 0.9} ${w * 0.6},${h * 0.7} T ${w - 4},${h * 0.8}`;
        defaultLength = w * 1.2;
      } else if (data.annotationStyle === 'circle') {
        // Natural hand-drawn encircling oval
        const rx = w / 2 - 8;
        const ry = h / 2 - 8;
        d = `M ${w / 2},8 A ${rx} ${ry} 0 1 1 ${w / 2 - 0.1} 8`;
        defaultLength = Math.PI * (rx + ry);
      } else if (data.annotationStyle === 'arrow') {
        // Curved emphasis arrow
        d = `M 8,${h - 8} Q ${w * 0.3},${h * 0.2} ${w - 14},${14}`;
        defaultLength = Math.sqrt(w * w + h * h) * 1.1;
      } else {
        // Box / rectangle highlight
        d = `M 8,8 H ${w - 8} V ${h - 8} H 8 Z`;
        defaultLength = (w + h) * 2;
      }

      const { strokeDasharray, strokeDashoffset } = computeStrokeDash(
        frame,
        defaultLength,
        layer.motion?.strokeDraw ?? { durationInFrames: 15 }
      );

      return (
        <path
          d={d}
          fill="none"
          stroke={layer.stroke?.color ?? '#FACC15'}
          strokeWidth={layer.stroke?.width ?? 6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          markerEnd={data.annotationStyle === 'arrow' ? `url(#arrowhead-${layer.id})` : undefined}
        />
      );
    }

    case 'shape': {
      const { shapeType, width, height, cornerRadius = 0 } = data.shape;
      if (shapeType === 'circle') {
        const r = Math.min(width, height) / 2;
        return (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={r}
            fill={layer.fill ?? 'currentColor'}
            stroke={layer.stroke?.color}
            strokeWidth={layer.stroke?.width}
          />
        );
      }
      const rx = shapeType === 'pill' ? height / 2 : cornerRadius;
      return (
        <rect
          width={width}
          height={height}
          rx={rx}
          ry={rx}
          fill={layer.fill ?? 'currentColor'}
          stroke={layer.stroke?.color}
          strokeWidth={layer.stroke?.width}
        />
      );
    }

    case 'chart': {
      const { chart } = data;
      const animProgress = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
      const max = chart.maxValue ?? Math.max(...chart.items.map((i) => i.value), 1);

      if (chart.chartType === 'bar') {
        const barWidth = layer.width / Math.max(1, chart.items.length);
        return (
          <g>
            {chart.items.map((item, idx) => {
              const barHeight = (item.value / max) * layer.height * animProgress;
              return (
                <rect
                  key={idx}
                  x={idx * barWidth + barWidth * 0.12}
                  y={layer.height - barHeight}
                  width={barWidth * 0.76}
                  height={Math.max(4, barHeight)}
                  rx={8}
                  fill={item.color ?? layer.themePalette?.accent ?? '#38BDF8'}
                />
              );
            })}
          </g>
        );
      }

      if (chart.chartType === 'donut') {
        const cx = layer.width / 2;
        const cy = layer.height / 2;
        const radius = Math.min(cx, cy) - (layer.stroke?.width ?? 20);
        const circumference = 2 * Math.PI * radius;
        const total = chart.items.reduce((acc, curr) => acc + curr.value, 0) || 1;
        let cumulative = 0;

        return (
          <g transform={`rotate(-90 ${cx} ${cy})`}>
            {chart.items.map((item, idx) => {
              const fraction = item.value / total;
              const strokeLength = fraction * circumference * animProgress;
              const dashOffset = -cumulative * circumference;
              cumulative += fraction;

              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={item.color ?? '#38BDF8'}
                  strokeWidth={layer.stroke?.width ?? 24}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      }

      if (chart.chartType === 'trendline') {
        // Trendline / Sparkline path
        const pts = chart.items.map((item, idx) => {
          const px = (idx / Math.max(1, chart.items.length - 1)) * layer.width;
          const py = layer.height - (item.value / max) * layer.height * animProgress;
          return `${px},${py}`;
        });
        const pathData = `M ${pts.join(' L ')}`;
        const totalLen = layer.width * 1.5;
        const { strokeDasharray, strokeDashoffset } = computeStrokeDash(
          frame,
          totalLen,
          { durationInFrames: 25 }
        );

        return (
          <g>
            <path
              d={pathData}
              fill="none"
              stroke={layer.stroke?.color ?? '#10B981'}
              strokeWidth={layer.stroke?.width ?? 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
            {chart.items.map((item, idx) => {
              const px = (idx / Math.max(1, chart.items.length - 1)) * layer.width;
              const py = layer.height - (item.value / max) * layer.height * animProgress;
              return (
                <circle
                  key={idx}
                  cx={px}
                  cy={py}
                  r={5}
                  fill={item.color ?? '#10B981'}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              );
            })}
          </g>
        );
      }

      return null;
    }

    case 'diagram': {
      const { diagram } = data;
      const animProgress = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
      const nodeMap = new Map<string, DiagramNode>();
      diagram.nodes.forEach((n) => nodeMap.set(n.id, n));

      return (
        <g>
          {/* Connector Edges */}
          {diagram.edges.map((edge, idx) => {
            const from = nodeMap.get(edge.fromId);
            const to = nodeMap.get(edge.toId);
            if (!from || !to) return null;
            return (
              <line
                key={`edge-${idx}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={layer.stroke?.color ?? '#94A3B8'}
                strokeWidth={layer.stroke?.width ?? 2}
                strokeDasharray={edge.dashed ? '6,4' : undefined}
                markerEnd={`url(#arrowhead-${layer.id})`}
              />
            );
          })}

          {/* Nodes */}
          {diagram.nodes.map((node) => {
            const nodeW = 120;
            const nodeH = 44;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x - nodeW / 2}, ${node.y - nodeH / 2}) scale(${animProgress})`}
              >
                <rect
                  width={nodeW}
                  height={nodeH}
                  rx={10}
                  fill={node.color ?? layer.themePalette?.surface ?? '#1E293B'}
                  stroke={layer.stroke?.color ?? '#38BDF8'}
                  strokeWidth={1.5}
                />
                <text
                  x={nodeW / 2}
                  y={nodeH / 2 + 5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    case 'pattern': {
      const { pattern } = data;
      if (pattern.patternType === 'grid') {
        const lines: React.ReactNode[] = [];
        const cols = Math.floor(layer.width / pattern.spacing);
        const rows = Math.floor(layer.height / pattern.spacing);
        for (let c = 0; c <= cols; c++) {
          const x = c * pattern.spacing;
          lines.push(<line key={`v-${c}`} x1={x} y1={0} x2={x} y2={layer.height} stroke={pattern.color} strokeWidth={1} opacity={0.25} />);
        }
        for (let r = 0; r <= rows; r++) {
          const y = r * pattern.spacing;
          lines.push(<line key={`h-${r}`} x1={0} y1={y} x2={layer.width} y2={y} stroke={pattern.color} strokeWidth={1} opacity={0.25} />);
        }
        return <g>{lines}</g>;
      }

      const dots: React.ReactNode[] = [];
      const cols = Math.floor(layer.width / pattern.spacing);
      const rows = Math.floor(layer.height / pattern.spacing);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push(
            <circle
              key={`${r}-${c}`}
              cx={c * pattern.spacing + pattern.spacing / 2}
              cy={r * pattern.spacing + pattern.spacing / 2}
              r={pattern.dotSize ?? 1.5}
              fill={pattern.color}
              opacity={0.35}
            />
          );
        }
      }
      return <g>{dots}</g>;
    }

    default:
      return null;
  }
}

// =========================================================================
// 4. SINGLE MEMOIZED VECTOR LAYER VIEW (GPU translate3d composite)
// =========================================================================

const SingleSvgLayerView = memo(({ layer }: { layer: DynamicSvgLayer }) => {
  const frame = useCurrentFrame(); // Relative to this <Sequence> start (0 to durationInFrames)
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(layer.durationSeconds * fps));
  const anchor = layer.anchor ?? { x: 0.5, y: 0.5 };

  // ── Entrance Motion ──
  let enterScale = 1.0;
  let enterOpacity = 1.0;
  let enterTranslateY = 0;

  const enter = layer.motion?.enter;
  if (enter && enter.type !== 'none') {
    const enterDur = enter.durationInFrames ?? 10;
    if (enter.type === 'spring-pop') {
      enterScale = spring({
        frame,
        fps,
        config: {
          damping: enter.damping ?? 11,
          stiffness: enter.stiffness ?? 200,
          mass: enter.mass ?? 0.6,
        },
      });
      enterOpacity = interpolate(frame, [0, Math.min(enterDur, 4)], [0, 1], { extrapolateRight: 'clamp' });
    } else if (enter.type === 'slide-up') {
      enterTranslateY = interpolate(frame, [0, enterDur], [50, 0], { extrapolateRight: 'clamp' });
      enterOpacity = interpolate(frame, [0, enterDur], [0, 1], { extrapolateRight: 'clamp' });
    } else if (enter.type === 'scale') {
      enterScale = interpolate(frame, [0, enterDur], [0.5, 1.0], { extrapolateRight: 'clamp' });
      enterOpacity = interpolate(frame, [0, enterDur], [0, 1], { extrapolateRight: 'clamp' });
    } else if (enter.type === 'fade') {
      enterOpacity = interpolate(frame, [0, enterDur], [0, 1], { extrapolateRight: 'clamp' });
    }
  }

  // ── Continuous Motion (Float / Pulse / Wobble) ──
  let contScale = 1.0;
  let contTy = 0;
  let contRot = 0;
  const continuous = layer.motion?.continuous;
  if (continuous && continuous.type !== 'none') {
    const speed = continuous.speed ?? 1.0;
    if (continuous.type === 'float') {
      contTy = Math.sin((frame / fps) * speed * Math.PI) * 5;
    } else if (continuous.type === 'pulse') {
      contScale = 1.0 + Math.sin((frame / fps) * speed * Math.PI) * 0.04;
    } else if (continuous.type === 'wobble') {
      contRot = Math.sin((frame / fps) * speed * Math.PI) * 4;
    }
  }

  // ── Exit Motion ──
  let exitScale = 1.0;
  let exitOpacity = 1.0;
  let exitTranslateY = 0;
  const exit = layer.motion?.exit;
  if (exit && exit.type !== 'none') {
    const exitDur = exit.durationInFrames ?? 8;
    const exitStartFrame = Math.max(0, totalDurationFrames - exitDur);
    if (frame >= exitStartFrame) {
      const exitProgress = frame - exitStartFrame;
      if (exit.type === 'fade') {
        exitOpacity = interpolate(exitProgress, [0, exitDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      } else if (exit.type === 'shrink') {
        exitScale = interpolate(exitProgress, [0, exitDur], [1, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        exitOpacity = interpolate(exitProgress, [0, exitDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      } else if (exit.type === 'slide-down') {
        exitTranslateY = interpolate(exitProgress, [0, exitDur], [0, 50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        exitOpacity = interpolate(exitProgress, [0, exitDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      }
    }
  }

  // Combine transformations
  const finalScale = (layer.scale ?? 1.0) * enterScale * contScale * exitScale;
  const finalOpacity = (layer.opacity ?? 1.0) * enterOpacity * exitOpacity;
  const finalRot = (layer.rotationDeg ?? 0) + contRot;
  const finalX = layer.x - anchor.x * layer.width;
  const finalY = layer.y - anchor.y * layer.height + enterTranslateY + contTy + exitTranslateY;

  const viewBox = layer.viewBox ?? { minX: 0, minY: 0, width: layer.width, height: layer.height };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${layer.width}px`,
        height: `${layer.height}px`,
        opacity: finalOpacity,
        zIndex: layer.zIndex ?? 14,
        transformOrigin: `${anchor.x * 100}% ${anchor.y * 100}%`,
        // GPU composite layer translate3d (zero DOM reflows)
        transform: `translate3d(${finalX}px, ${finalY}px, 0) rotate(${finalRot}deg) scale(${finalScale})`,
        mixBlendMode: layer.blendMode ?? 'normal',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {layer.clipping ? (
        <ShapeClippingContainer
          mode={layer.clipping.mode}
          reveal={layer.clipping.reveal}
          customSvgPath={layer.clipping.customSvgPath}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Arrowhead marker for directed lines and annotations */}
              <marker
                id={`arrowhead-${layer.id}`}
                markerWidth={8}
                markerHeight={8}
                refX={6}
                refY={3}
                orient="auto"
              >
                <path d="M 0,0 L 6,3 L 0,6 Z" fill={layer.stroke?.color ?? '#FACC15'} />
              </marker>
            </defs>
            {renderVectorElements(layer.data, layer, frame, fps)}
          </svg>
        </ShapeClippingContainer>
      ) : (
        <svg
          width="100%"
          height="100%"
          viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Arrowhead marker for directed lines and annotations */}
            <marker
              id={`arrowhead-${layer.id}`}
              markerWidth={8}
              markerHeight={8}
              refX={6}
              refY={3}
              orient="auto"
            >
              <path d="M 0,0 L 6,3 L 0,6 Z" fill={layer.stroke?.color ?? '#FACC15'} />
            </marker>
          </defs>
          {renderVectorElements(layer.data, layer, frame, fps)}
        </svg>
      )}
    </div>
  );
});

// =========================================================================
// 5. THE MAIN STAGE: REUSABLE DYNAMIC MULTI-LAYER SVG RENDERER
// =========================================================================

export interface MultiLayerSvgOverlayProps {
  layers: DynamicSvgLayer[];
}

export const MultiLayerSvgOverlay: React.FC<MultiLayerSvgOverlayProps> = ({ layers = [] }) => {
  const { fps } = useVideoConfig();

  // Filter visible layers. Array order = Z-Order
  const activeLayers = layers.filter((l) => !l.isHidden && Boolean(l.data));

  if (activeLayers.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 14,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {activeLayers.map((layer) => {
        const fromFrame = Math.round(layer.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(layer.durationSeconds * fps));

        // Remotion <Sequence> time-windowing:
        // Automatically unmounts vector elements outside their active window, keeping memory ultra-low!
        return (
          <Sequence
            key={layer.id}
            name={`svg-layer-${layer.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleSvgLayerView layer={layer} />
          </Sequence>
        );
      })}
    </div>
  );
};
