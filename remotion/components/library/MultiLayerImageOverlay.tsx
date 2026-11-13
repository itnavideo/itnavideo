import React, { memo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, OffthreadVideo, Sequence } from 'remotion';
import { safeResolveMediaSrc, isVideoMedia as isVideoFile } from '../../utils/safeMedia';
import { ShapeClippingContainer, type ShapeClippingMode, type ShapeClippingRevealAnimation } from './ShapeClippingContainer';

// =========================================================================
// 1. REUSABLE IMAGE & VIDEO MEDIA LAYER DATA SCHEMA (Unlimited Layers)
// =========================================================================

export type ImageLayerMode =
  | 'full-bleed'
  | 'device-mockup'
  | 'pip-avatar'
  | 'sticker'
  | 'split-screen'
  | 'collage'
  | 'framed'
  | 'watermark'
  | 'freeform';

export type ImageBlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge';

export interface ImageKeyframe {
  frameOffset: number; // Frame relative to layer start
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
}

export interface DynamicImageLayer {
  id: string;
  src: string;
  mediaType?: 'image' | 'video';
  volume?: number;
  trimStartSeconds?: number;
  startSeconds: number;
  durationSeconds: number;
  mode?: ImageLayerMode;

  // 1 & 2. Transform & Positioning (1080x1920 reference space)
  x: number;             // X anchor coordinate in pixels (0 to 1080)
  y: number;             // Y anchor coordinate in pixels (0 to 1920)
  width: number;         // Pixel width (e.g., 1080 for full-bleed, 500 for cards)
  height?: number | 'auto'; // Pixel height or 'auto'
  scale?: number;        // Multiplier (1.0 = 100%)
  rotationDeg?: number;  // 2D rotation in degrees (-45° to +45°)
  anchor?: { x: number; y: number }; // Anchor point [0.5, 0.5] = center, [0, 0] = top-left

  // 3. Styling & Framing
  borderRadius?: number;
  border?: { width: number; color: string; style?: 'solid' | 'dashed' };
  shadow?: { x: number; y: number; blur: number; spread?: number; color: string };
  opacity?: number;
  blendMode?: ImageBlendMode;
  objectFit?: 'cover' | 'contain' | 'fill';
  crop?: { top?: number; bottom?: number; left?: number; right?: number }; // Percentage 0-100
  clipping?: {
    mode: ShapeClippingMode;
    reveal?: ShapeClippingRevealAnimation;
    customSvgPath?: string;
  };

  // 4. Motion & Animation
  motion?: {
    enter?: {
      type: 'spring-pop' | 'slide-up' | 'slide-down' | 'fade' | 'zoom' | 'none';
      durationFrames?: number;
      damping?: number;
      stiffness?: number;
      mass?: number;
    };
    exit?: {
      type: 'fade' | 'shrink' | 'slide-down' | 'none';
      durationFrames?: number;
    };
    continuous?: {
      type: 'ken-burns' | 'float' | 'pulse' | 'none';
      zoomFrom?: number;
      zoomTo?: number;
      panFrom?: { x: number; y: number }; // Normalized 0-1
      panTo?: { x: number; y: number };   // Normalized 0-1
    };
  };

  keyframes?: ImageKeyframe[];

  // 5. State Management & Grouping
  isLocked?: boolean;
  isHidden?: boolean;
  groupId?: string;
  zIndex?: number;
}

// =========================================================================
// 2. THE 8 PRACTICAL CREATOR LAYER PRESETS (Data Factories)
// =========================================================================

export const PRACTICAL_IMAGE_PRESETS: Record<ImageLayerMode, (o: { id: string; src: string; start: number; duration: number }) => DynamicImageLayer> = {
  // 1. Full-Bleed B-Roll Backdrop (1080x1920 with edge-clamped Ken Burns)
  'full-bleed': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'full-bleed',
    x: 540,
    y: 960,
    width: 1080,
    height: 1920,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    objectFit: 'cover',
    motion: {
      continuous: {
        type: 'ken-burns',
        zoomFrom: 1.0,
        zoomTo: 1.12,
        panFrom: { x: 0.5, y: 0.5 },
        panTo: { x: 0.48, y: 0.52 },
      },
      enter: { type: 'fade', durationFrames: 8 },
      exit: { type: 'fade', durationFrames: 8 },
    },
    zIndex: 5,
  }),

  // 2. App Screenshot / Device Mockup (Floating card with shadow & radius)
  'device-mockup': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'device-mockup',
    x: 540,
    y: 940,
    width: 760,
    height: 1100,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    borderRadius: 24,
    border: { width: 3, color: 'rgba(255, 255, 255, 0.25)', style: 'solid' },
    shadow: { x: 0, y: 24, blur: 48, spread: 0, color: 'rgba(0, 0, 0, 0.65)' },
    objectFit: 'cover',
    motion: {
      enter: { type: 'spring-pop', durationFrames: 12, damping: 11, stiffness: 190, mass: 0.6 },
      exit: { type: 'shrink', durationFrames: 8 },
    },
    zIndex: 20,
  }),

  // 3. Circular PiP Avatar (Presenter / Reaction circle in corner)
  'pip-avatar': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'pip-avatar',
    x: 220,
    y: 1420,
    width: 260,
    height: 260,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    borderRadius: 9999, // Circle mask
    border: { width: 6, color: '#FFFFFF', style: 'solid' },
    shadow: { x: 0, y: 12, blur: 28, spread: 0, color: 'rgba(0, 0, 0, 0.5)' },
    objectFit: 'cover',
    motion: {
      enter: { type: 'spring-pop', durationFrames: 10, damping: 12, stiffness: 210, mass: 0.5 },
      exit: { type: 'shrink', durationFrames: 7 },
    },
    zIndex: 25,
  }),

  // 4. Floating Sticker / Emoji Cutout (High-energy pop)
  'sticker': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'sticker',
    x: 540,
    y: 720,
    width: 320,
    height: 320,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    objectFit: 'contain',
    shadow: { x: 0, y: 16, blur: 32, spread: 0, color: 'rgba(0, 0, 0, 0.6)' },
    motion: {
      enter: { type: 'spring-pop', durationFrames: 10, damping: 9, stiffness: 230, mass: 0.5 },
      continuous: { type: 'float' },
      exit: { type: 'shrink', durationFrames: 7 },
    },
    zIndex: 30,
  }),

  // 5. Split-Screen Comparison (Half canvas)
  'split-screen': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'split-screen',
    x: 540,
    y: 480,
    width: 1080,
    height: 960,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    objectFit: 'cover',
    motion: {
      enter: { type: 'slide-up', durationFrames: 8 },
      exit: { type: 'fade', durationFrames: 8 },
    },
    zIndex: 10,
  }),

  // 6. Multi-Image Collage (Grid frame)
  'collage': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'collage',
    x: 540,
    y: 960,
    width: 500,
    height: 600,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    borderRadius: 16,
    shadow: { x: 0, y: 12, blur: 24, spread: 0, color: 'rgba(0, 0, 0, 0.4)' },
    objectFit: 'cover',
    motion: {
      enter: { type: 'zoom', durationFrames: 10 },
      exit: { type: 'fade', durationFrames: 7 },
    },
    zIndex: 15,
  }),

  // 7. Framed Editorial Card (Vox style)
  'framed': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'framed',
    x: 540,
    y: 880,
    width: 720,
    height: 720,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    borderRadius: 20,
    border: { width: 2, color: 'rgba(255, 255, 255, 0.2)', style: 'solid' },
    shadow: { x: 0, y: 18, blur: 36, spread: 0, color: 'rgba(0, 0, 0, 0.55)' },
    objectFit: 'cover',
    motion: {
      enter: { type: 'slide-up', durationFrames: 9 },
      exit: { type: 'fade', durationFrames: 8 },
    },
    zIndex: 18,
  }),

  // 8. Watermark / Brand Logo (Corner anchor, subtle opacity)
  'watermark': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'watermark',
    x: 940,
    y: 120,
    width: 140,
    height: 140,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    opacity: 0.65,
    objectFit: 'contain',
    zIndex: 35,
  }),

  // Freeform fallback
  'freeform': ({ id, src, start, duration }) => ({
    id,
    src,
    startSeconds: start,
    durationSeconds: duration,
    mode: 'freeform',
    x: 540,
    y: 960,
    width: 600,
    height: 600,
    scale: 1.0,
    rotationDeg: 0,
    anchor: { x: 0.5, y: 0.5 },
    objectFit: 'cover',
    zIndex: 15,
  }),
};

// =========================================================================
// 3. EDGE-CLAMPED KEN BURNS MATH (Claude's Log-Space Formula)
// =========================================================================

function computeKenBurnsTransform(
  kb: NonNullable<NonNullable<DynamicImageLayer['motion']>['continuous']>,
  frame: number,
  durationFrames: number,
  boxW: number,
  boxH: number
) {
  const p = Math.min(1, Math.max(0, frame / Math.max(1, durationFrames)));
  const zoomFrom = Math.max(1.0, kb.zoomFrom ?? 1.0);
  const zoomTo = Math.max(1.0, kb.zoomTo ?? 1.15);

  // Log-space interpolation for perceptually constant zoom velocity
  const currentScale = Math.exp(Math.log(zoomFrom) + (Math.log(zoomTo) - Math.log(zoomFrom)) * p);

  const panFrom = kb.panFrom ?? { x: 0.5, y: 0.5 };
  const panTo = kb.panTo ?? { x: 0.5, y: 0.5 };
  const fx = panFrom.x + (panTo.x - panFrom.x) * p;
  const fy = panFrom.y + (panTo.y - panFrom.y) * p;

  // Clamping: Guarantees zoom >= 1 NEVER exposes empty canvas background borders
  const maxX = ((currentScale - 1) * boxW) / 2;
  const maxY = ((currentScale - 1) * boxH) / 2;
  const tx = Math.max(-maxX, Math.min(maxX, -(fx - 0.5) * boxW * currentScale));
  const ty = Math.max(-maxY, Math.min(maxY, -(fy - 0.5) * boxH * currentScale));

  return { scale: currentScale, tx, ty };
}

// =========================================================================
// 4. SINGLE MEMOIZED LAYER VIEW (Stateless, GPU-Accelerated translate3d)
// =========================================================================

const SingleImageLayerView = memo(({ layer }: { layer: DynamicImageLayer }) => {
  const frame = useCurrentFrame(); // Frame relative to this <Sequence> start (0 to durationInFrames)
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(layer.durationSeconds * fps));
  const anchor = layer.anchor ?? { x: 0.5, y: 0.5 };
  const boxW = layer.width;
  const boxH = layer.height === 'auto' || !layer.height ? layer.width : layer.height;

  // ── Entrance Motion ──
  let enterScale = 1.0;
  let enterOpacity = 1.0;
  let enterTranslateY = 0;

  const enter = layer.motion?.enter;
  if (enter && enter.type !== 'none') {
    const enterDur = enter.durationFrames ?? 10;
    if (enter.type === 'spring-pop') {
      enterScale = spring({
        frame,
        fps,
        config: {
          damping: enter.damping ?? 10,
          stiffness: enter.stiffness ?? 220,
          mass: enter.mass ?? 0.6,
        },
      });
      enterOpacity = interpolate(frame, [0, Math.min(enterDur, 4)], [0, 1], { extrapolateRight: 'clamp' });
    } else if (enter.type === 'slide-up') {
      enterTranslateY = interpolate(frame, [0, enterDur], [60, 0], { extrapolateRight: 'clamp' });
      enterOpacity = interpolate(frame, [0, enterDur], [0, 1], { extrapolateRight: 'clamp' });
    } else if (enter.type === 'slide-down') {
      enterTranslateY = interpolate(frame, [0, enterDur], [-60, 0], { extrapolateRight: 'clamp' });
      enterOpacity = interpolate(frame, [0, enterDur], [0, 1], { extrapolateRight: 'clamp' });
    } else if (enter.type === 'zoom') {
      enterScale = interpolate(frame, [0, enterDur], [1.25, 1.0], { extrapolateRight: 'clamp' });
      enterOpacity = interpolate(frame, [0, enterDur], [0, 1], { extrapolateRight: 'clamp' });
    } else if (enter.type === 'fade') {
      enterOpacity = interpolate(frame, [0, enterDur], [0, 1], { extrapolateRight: 'clamp' });
    }
  }

  // ── Continuous Motion (Ken Burns / Float / Pulse) ──
  let contScale = 1.0;
  let contTx = 0;
  let contTy = 0;
  const continuous = layer.motion?.continuous;
  if (continuous && continuous.type !== 'none') {
    if (continuous.type === 'ken-burns') {
      const kb = computeKenBurnsTransform(continuous, frame, totalDurationFrames, boxW, boxH);
      contScale = kb.scale;
      contTx = kb.tx;
      contTy = kb.ty;
    } else if (continuous.type === 'float') {
      contTy = Math.sin(frame / 6) * 6;
    } else if (continuous.type === 'pulse') {
      contScale = 1.0 + Math.sin(frame / 8) * 0.03;
    }
  }

  // ── Exit Motion ──
  let exitScale = 1.0;
  let exitOpacity = 1.0;
  let exitTranslateY = 0;
  const exit = layer.motion?.exit;
  if (exit && exit.type !== 'none') {
    const exitDur = exit.durationFrames ?? 8;
    const exitStartFrame = Math.max(0, totalDurationFrames - exitDur);
    if (frame >= exitStartFrame) {
      const exitProgress = frame - exitStartFrame;
      if (exit.type === 'fade') {
        exitOpacity = interpolate(exitProgress, [0, exitDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      } else if (exit.type === 'shrink') {
        exitScale = interpolate(exitProgress, [0, exitDur], [1, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        exitOpacity = interpolate(exitProgress, [0, exitDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      } else if (exit.type === 'slide-down') {
        exitTranslateY = interpolate(exitProgress, [0, exitDur], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        exitOpacity = interpolate(exitProgress, [0, exitDur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      }
    }
  }

  // ── Keyframe Overrides ──
  let kfX = 0;
  let kfY = 0;
  let kfScale = 1.0;
  let kfRot = 0;
  let kfOpacity = 1.0;

  if (Array.isArray(layer.keyframes) && layer.keyframes.length >= 2) {
    const sorted = [...layer.keyframes].sort((a, b) => a.frameOffset - b.frameOffset);
    const offsets = sorted.map((k) => k.frameOffset);
    kfX = interpolate(frame, offsets, sorted.map((k) => k.x ?? 0), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    kfY = interpolate(frame, offsets, sorted.map((k) => k.y ?? 0), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    kfScale = interpolate(frame, offsets, sorted.map((k) => k.scale ?? 1.0), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    kfRot = interpolate(frame, offsets, sorted.map((k) => k.rotation ?? 0), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    kfOpacity = interpolate(frame, offsets, sorted.map((k) => k.opacity ?? 1.0), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  }

  // Combine transforms
  const finalScale = (layer.scale ?? 1.0) * enterScale * contScale * exitScale * kfScale;
  const finalOpacity = (layer.opacity ?? 1.0) * enterOpacity * exitOpacity * kfOpacity;
  const finalRotation = (layer.rotationDeg ?? 0) + kfRot;
  const finalX = layer.x + contTx + kfX;
  const finalY = layer.y + enterTranslateY + contTy + exitTranslateY + kfY;

  const resolvedSrc = safeResolveMediaSrc(layer.src);
  if (!resolvedSrc) return null;

  const isVideo = layer.mediaType === 'video' || isVideoFile(layer.src);
  const trimStartFrames = Math.round((layer.trimStartSeconds ?? 0) * fps);

  const mediaElement = isVideo ? (
    <OffthreadVideo
      src={resolvedSrc}
      startFrom={trimStartFrames}
      style={{
        width: '100%',
        height: '100%',
        objectFit: layer.objectFit ?? 'cover',
      }}
      volume={layer.volume ?? 0}
    />
  ) : (
    <Img
      src={resolvedSrc}
      style={{
        width: '100%',
        height: '100%',
        objectFit: layer.objectFit ?? 'cover',
      }}
    />
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${boxW}px`,
        height: `${boxH}px`,
        opacity: finalOpacity,
        zIndex: layer.zIndex ?? 10,
        transformOrigin: `${anchor.x * 100}% ${anchor.y * 100}%`,
        // GPU composite layer translate3d (Gemini recommendation: zero DOM reflows)
        transform: `translate3d(${finalX - anchor.x * boxW}px, ${finalY - anchor.y * boxH}px, 0) rotate(${finalRotation}deg) scale(${finalScale})`,
        mixBlendMode: (layer.blendMode as any) ?? 'normal',
        borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
        border: layer.border ? `${layer.border.width}px ${layer.border.style ?? 'solid'} ${layer.border.color}` : undefined,
        boxShadow: layer.shadow
          ? `${layer.shadow.x}px ${layer.shadow.y}px ${layer.shadow.blur}px ${layer.shadow.spread ?? 0}px ${layer.shadow.color}`
          : undefined,
        clipPath: layer.crop
          ? `inset(${layer.crop.top ?? 0}% ${layer.crop.right ?? 0}% ${layer.crop.bottom ?? 0}% ${layer.crop.left ?? 0}%)`
          : undefined,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {layer.clipping ? (
        <ShapeClippingContainer
          mode={layer.clipping.mode}
          reveal={layer.clipping.reveal}
          customSvgPath={layer.clipping.customSvgPath}
          cornerRadiusPx={layer.borderRadius}
        >
          {mediaElement}
        </ShapeClippingContainer>
      ) : (
        mediaElement
      )}
    </div>
  );
});

// =========================================================================
// 5. THE MAIN STAGE: REUSABLE DYNAMIC MULTI-LAYER IMAGE RENDERER
// =========================================================================

export interface MultiLayerImageOverlayProps {
  layers: DynamicImageLayer[];
}

export const MultiLayerImageOverlay: React.FC<MultiLayerImageOverlayProps> = ({ layers = [] }) => {
  const { fps } = useVideoConfig();

  // Filter non-hidden layers. Array order = Z-Order (Claude & Gemini recommendation)
  const activeLayers = layers.filter((l) => !l.isHidden && Boolean(l.src));

  if (activeLayers.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 12,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {activeLayers.map((layer) => {
        const fromFrame = Math.round(layer.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(layer.durationSeconds * fps));

        // Remotion <Sequence> time-windowing:
        // Automatically unmounts layers outside their start/end window, ensuring zero memory leaks!
        return (
          <Sequence
            key={layer.id}
            name={`image-layer-${layer.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleImageLayerView layer={layer} />
          </Sequence>
        );
      })}
    </div>
  );
};

// Aliases for unified Media layer usage (supporting both Image and Video clips)
export type DynamicMediaLayer = DynamicImageLayer;
export const MultiLayerMediaOverlay = MultiLayerImageOverlay;


