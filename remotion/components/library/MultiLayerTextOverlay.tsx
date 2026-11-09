import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShapeClippingContainer, type ShapeClippingMode, type ShapeClippingRevealAnimation } from './ShapeClippingContainer';

// =========================================================================
// 1. REUSABLE LAYER DATA SCHEMA (Separation of Data from Renderer)
// =========================================================================

export type LayerBlendMode = 'normal' | 'screen' | 'overlay' | 'multiply' | 'lighten' | 'color-dodge';

export type LayerInAnimation =
  | 'spring-pop'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'fade-in'
  | 'typewriter'
  | 'none';

export type LayerOutAnimation =
  | 'fade-out'
  | 'shrink'
  | 'slide-down'
  | 'slide-up'
  | 'slide-right'
  | 'none';

export type LayerKineticTextMode = 'standard' | 'per-word' | 'per-character';

export type LayerPresetType =
  | 'hero-headline'
  | 'kicker-pill'
  | 'editorial-callout'
  | 'kinetic-punch'
  | 'stat-callout'
  | 'quote-card'
  | 'comparison-vs'
  | 'code-mono'
  | 'timer-urgency'
  | 'footnote-disclaimer'
  | 'freeform';

export interface LayerKeyframe {
  frameOffset: number; // Frame relative to layer start
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
}

export interface DynamicTextLayer {
  id: string;
  presetType?: LayerPresetType;
  text: string;
  startSeconds: number;
  durationSeconds: number;

  // 1 & 2. Transform & Positioning
  x: number;          // Horizontal anchor (0 to 1080 px or % string)
  y: number;          // Vertical anchor (0 to 1920 px or % string)
  scale?: number;     // Uniform scaling multiplier (default 1.0)
  rotationDeg?: number; // 2D rotation in degrees (default 0)
  anchor?: 'center' | 'top-left' | 'top-center' | 'top-right' | 'bottom-center';

  // 3. Typography & Styling
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: string;
  letterSpacing?: string;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textShadow?: string;
  border?: string;

  // 4. Kinetic Sub-Element Animations
  kineticMode?: LayerKineticTextMode;
  staggerFrames?: number; // Frames between each word/character animation

  // 5. In / Out Animations & Keyframes
  inAnimation?: LayerInAnimation;
  inDurationFrames?: number;
  outAnimation?: LayerOutAnimation;
  outDurationFrames?: number;
  keyframes?: LayerKeyframe[];

  // 6. Opacity & Blending
  opacity?: number;
  blendMode?: LayerBlendMode;
  clipping?: {
    mode: ShapeClippingMode;
    reveal?: ShapeClippingRevealAnimation;
    customSvgPath?: string;
  };

  // 7. Layer State Management
  isLocked?: boolean;
  isHidden?: boolean;

  // 8. Grouping
  groupId?: string;

  // Extra metadata
  zIndex?: number;
}

export interface DynamicLayerTimeline {
  layers: DynamicTextLayer[];
}

// =========================================================================
// 2. PRACTICAL LAYER TYPE PRESETS (8–12 Templates for Studio UI)
// =========================================================================

export const PRACTICAL_LAYER_PRESETS: Record<LayerPresetType, Partial<DynamicTextLayer>> = {
  'hero-headline': {
    presetType: 'hero-headline',
    fontSize: 56,
    fontWeight: 900,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 87, 34, 0.4)',
    inAnimation: 'spring-pop',
    outAnimation: 'fade-out',
    x: 540,
    y: 450,
    anchor: 'center',
    kineticMode: 'per-word',
    staggerFrames: 3,
  },
  'kicker-pill': {
    presetType: 'kicker-pill',
    fontSize: 22,
    fontWeight: 800,
    textTransform: 'uppercase',
    color: '#FF7043',
    backgroundColor: 'rgba(255, 87, 34, 0.14)',
    border: '1px solid rgba(255, 87, 34, 0.4)',
    borderRadius: 999,
    padding: '8px 20px',
    letterSpacing: '0.12em',
    inAnimation: 'slide-up',
    outAnimation: 'fade-out',
    x: 540,
    y: 360,
    anchor: 'center',
    kineticMode: 'standard',
  },
  'editorial-callout': {
    presetType: 'editorial-callout',
    fontSize: 32,
    fontWeight: 600,
    color: '#E2E8F0',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 16,
    padding: '16px 28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    inAnimation: 'slide-up',
    outAnimation: 'fade-out',
    x: 540,
    y: 1100,
    anchor: 'center',
    lineHeight: 1.35,
    kineticMode: 'standard',
  },
  'kinetic-punch': {
    presetType: 'kinetic-punch',
    fontSize: 76,
    fontWeight: 900,
    textTransform: 'uppercase',
    color: '#FACC15',
    textShadow: '0 8px 32px rgba(0, 0, 0, 0.95), 0 0 30px rgba(250, 204, 21, 0.7)',
    inAnimation: 'spring-pop',
    outAnimation: 'shrink',
    x: 540,
    y: 850,
    anchor: 'center',
    kineticMode: 'per-character',
    staggerFrames: 2,
  },
  'stat-callout': {
    presetType: 'stat-callout',
    fontSize: 68,
    fontWeight: 900,
    color: '#10B981',
    textShadow: '0 4px 24px rgba(16, 185, 129, 0.5)',
    inAnimation: 'zoom-in',
    outAnimation: 'fade-out',
    x: 540,
    y: 800,
    anchor: 'center',
    kineticMode: 'standard',
  },
  'quote-card': {
    presetType: 'quote-card',
    fontSize: 28,
    fontWeight: 500,
    color: '#F8FAFC',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 18,
    padding: '24px 32px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    inAnimation: 'slide-up',
    outAnimation: 'fade-out',
    x: 540,
    y: 950,
    anchor: 'center',
    lineHeight: 1.45,
    kineticMode: 'per-word',
    staggerFrames: 2,
  },
  'comparison-vs': {
    presetType: 'comparison-vs',
    fontSize: 34,
    fontWeight: 900,
    color: '#FFFFFF',
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: '6px 16px',
    textTransform: 'uppercase',
    inAnimation: 'spring-pop',
    outAnimation: 'shrink',
    x: 540,
    y: 960,
    anchor: 'center',
    kineticMode: 'standard',
  },
  'code-mono': {
    presetType: 'code-mono',
    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
    fontSize: 24,
    fontWeight: 600,
    color: '#38BDF8',
    backgroundColor: 'rgba(2, 6, 23, 0.9)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: 12,
    padding: '16px 24px',
    inAnimation: 'typewriter',
    outAnimation: 'fade-out',
    x: 540,
    y: 920,
    anchor: 'center',
    kineticMode: 'per-character',
    staggerFrames: 1,
  },
  'timer-urgency': {
    presetType: 'timer-urgency',
    fontSize: 26,
    fontWeight: 800,
    color: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: 999,
    padding: '8px 22px',
    inAnimation: 'spring-pop',
    outAnimation: 'fade-out',
    x: 540,
    y: 280,
    anchor: 'center',
    kineticMode: 'standard',
  },
  'footnote-disclaimer': {
    presetType: 'footnote-disclaimer',
    fontSize: 16,
    fontWeight: 600,
    color: '#94A3B8',
    inAnimation: 'fade-in',
    outAnimation: 'fade-out',
    x: 540,
    y: 1720,
    anchor: 'center',
    kineticMode: 'standard',
  },
  freeform: {
    presetType: 'freeform',
    fontSize: 44,
    fontWeight: 700,
    color: '#FFFFFF',
    inAnimation: 'spring-pop',
    outAnimation: 'fade-out',
    x: 540,
    y: 960,
    anchor: 'center',
    kineticMode: 'standard',
  },
};

// =========================================================================
// 3. SINGLE DYNAMIC RENDERER COMPONENT (Zero Per-Layer Render Overhead)
// =========================================================================

export interface MultiLayerTextOverlayProps {
  layers: DynamicTextLayer[];
  defaultHeadingFont?: string;
}

export const MultiLayerTextOverlay: React.FC<MultiLayerTextOverlayProps> = ({
  layers = [],
  defaultHeadingFont = 'Montserrat, sans-serif',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  // Filter visible layers at current playback frame
  const visibleLayers = layers.filter((layer) => {
    if (layer.isHidden) return false;
    const endSec = layer.startSeconds + layer.durationSeconds;
    return currentTimeSec >= layer.startSeconds && currentTimeSec <= endSec;
  });

  if (visibleLayers.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 36,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {visibleLayers.map((layer) => {
        const startFrame = Math.round(layer.startSeconds * fps);
        const totalDurationFrames = Math.max(1, Math.round(layer.durationSeconds * fps));
        const framesSinceStart = Math.max(0, frame - startFrame);

        const inFrames = layer.inDurationFrames ?? 10;
        const outFrames = layer.outDurationFrames ?? 8;
        const exitStartFrame = Math.max(0, totalDurationFrames - outFrames);

        // ── 5. In-Animation Calculations ──
        let inScale = 1.0;
        let inTranslateY = 0;
        let inTranslateX = 0;
        let inOpacity = 1.0;

        const inAnim = layer.inAnimation || 'spring-pop';
        if (inAnim === 'spring-pop') {
          inScale = spring({
            frame: framesSinceStart,
            fps,
            config: { damping: 10, stiffness: 220, mass: 0.6 },
          });
        } else if (inAnim === 'slide-up') {
          inTranslateY = interpolate(framesSinceStart, [0, inFrames], [70, 0], { extrapolateRight: 'clamp' });
          inOpacity = interpolate(framesSinceStart, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' });
        } else if (inAnim === 'slide-down') {
          inTranslateY = interpolate(framesSinceStart, [0, inFrames], [-70, 0], { extrapolateRight: 'clamp' });
          inOpacity = interpolate(framesSinceStart, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' });
        } else if (inAnim === 'slide-left') {
          inTranslateX = interpolate(framesSinceStart, [0, inFrames], [100, 0], { extrapolateRight: 'clamp' });
          inOpacity = interpolate(framesSinceStart, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' });
        } else if (inAnim === 'slide-right') {
          inTranslateX = interpolate(framesSinceStart, [0, inFrames], [-100, 0], { extrapolateRight: 'clamp' });
          inOpacity = interpolate(framesSinceStart, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' });
        } else if (inAnim === 'zoom-in') {
          inScale = interpolate(framesSinceStart, [0, inFrames], [1.3, 1.0], { extrapolateRight: 'clamp' });
          inOpacity = interpolate(framesSinceStart, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' });
        } else if (inAnim === 'fade-in') {
          inOpacity = interpolate(framesSinceStart, [0, inFrames], [0, 1], { extrapolateRight: 'clamp' });
        }

        // ── 5. Out-Animation Calculations ──
        let outScale = 1.0;
        let outOpacity = 1.0;
        let outTranslateY = 0;
        let outTranslateX = 0;

        const outAnim = layer.outAnimation || 'fade-out';
        if (framesSinceStart >= exitStartFrame) {
          if (outAnim === 'fade-out') {
            outOpacity = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [1.0, 0.0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
          } else if (outAnim === 'shrink') {
            outScale = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [1.0, 0.0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
          } else if (outAnim === 'slide-down') {
            outTranslateY = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [0, 80],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            outOpacity = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [1.0, 0.0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
          } else if (outAnim === 'slide-up') {
            outTranslateY = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [0, -80],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            outOpacity = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [1.0, 0.0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
          } else if (outAnim === 'slide-right') {
            outTranslateX = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [0, 100],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            outOpacity = interpolate(
              framesSinceStart,
              [exitStartFrame, totalDurationFrames],
              [1.0, 0.0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
          }
        }

        // ── 5. Keyframe Transform Overrides (If Defined) ──
        let keyframeX = 0;
        let keyframeY = 0;
        let keyframeScale = 1.0;
        let keyframeRot = 0;
        let keyframeOpacity = 1.0;

        if (Array.isArray(layer.keyframes) && layer.keyframes.length >= 2) {
          const sortedKfs = [...layer.keyframes].sort((a, b) => a.frameOffset - b.frameOffset);
          const offsets = sortedKfs.map((k) => k.frameOffset);
          const xs = sortedKfs.map((k) => k.x ?? 0);
          const ys = sortedKfs.map((k) => k.y ?? 0);
          const scales = sortedKfs.map((k) => k.scale ?? 1.0);
          const rots = sortedKfs.map((k) => k.rotation ?? 0);
          const opacities = sortedKfs.map((k) => k.opacity ?? 1.0);

          keyframeX = interpolate(framesSinceStart, offsets, xs, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          keyframeY = interpolate(framesSinceStart, offsets, ys, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          keyframeScale = interpolate(framesSinceStart, offsets, scales, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          keyframeRot = interpolate(framesSinceStart, offsets, rots, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          keyframeOpacity = interpolate(framesSinceStart, offsets, opacities, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        }

        // Combine all transforms
        const finalScale = (layer.scale ?? 1.0) * inScale * outScale * keyframeScale;
        const finalOpacity = (layer.opacity ?? 1.0) * inOpacity * outOpacity * keyframeOpacity;
        const finalTranslateX = inTranslateX + outTranslateX + keyframeX;
        const finalTranslateY = inTranslateY + outTranslateY + keyframeY;
        const finalRotation = (layer.rotationDeg ?? 0) + keyframeRot;

        // ── 2. Positioning & Anchors ──
        const anchor = layer.anchor || 'center';
        let anchorTranslate = 'translate(-50%, -50%)';
        if (anchor === 'top-left') anchorTranslate = 'translate(0, 0)';
        else if (anchor === 'top-center') anchorTranslate = 'translate(-50%, 0)';
        else if (anchor === 'top-right') anchorTranslate = 'translate(-100%, 0)';
        else if (anchor === 'bottom-center') anchorTranslate = 'translate(-50%, -100%)';

        const transformStr = `${anchorTranslate} translate(${finalTranslateX}px, ${finalTranslateY}px) scale(${finalScale}) rotate(${finalRotation}deg)`;

        // ── 4. Per-Word and Per-Character Kinetic Rendering ──
        const kineticMode = layer.kineticMode || 'standard';
        const stagger = layer.staggerFrames ?? 3;

        const renderTextContent = () => {
          if (kineticMode === 'per-word') {
            const words = layer.text.split(/(\s+)/);
            let wordIdx = 0;
            return words.map((chunk, i) => {
              if (/^\s+$/.test(chunk)) {
                return <span key={i}> </span>;
              }
              const currentWordIdx = wordIdx++;
              const wordFrameOffset = currentWordIdx * stagger;
              const wordSpring = spring({
                frame: Math.max(0, framesSinceStart - wordFrameOffset),
                fps,
                config: { damping: 9, stiffness: 220, mass: 0.5 },
              });
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: `scale(${wordSpring})`,
                    transformOrigin: 'bottom center',
                    willChange: 'transform',
                  }}
                >
                  {chunk}
                </span>
              );
            });
          }

          if (kineticMode === 'per-character') {
            const characters = layer.text.split('');
            return characters.map((char, i) => {
              if (char === ' ') {
                return <span key={i}> </span>;
              }
              const charFrameOffset = i * stagger;
              const charSpring = spring({
                frame: Math.max(0, framesSinceStart - charFrameOffset),
                fps,
                config: { damping: 8, stiffness: 250, mass: 0.4 },
              });
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: `scale(${charSpring})`,
                    transformOrigin: 'bottom center',
                    willChange: 'transform',
                  }}
                >
                  {char}
                </span>
              );
            });
          }

          return layer.text;
        };

        return (
          <div
            key={layer.id}
            style={{
              position: 'absolute',
              left: `${layer.x}px`,
              top: `${layer.y}px`,
              transform: transformStr,
              transformOrigin: 'center center',
              opacity: finalOpacity,
              mixBlendMode: layer.blendMode || 'normal',
              zIndex: layer.zIndex ?? 36,
              maxWidth: '960px',
              textAlign: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {layer.clipping ? (
              <ShapeClippingContainer
                mode={layer.clipping.mode}
                reveal={layer.clipping.reveal}
                customSvgPath={layer.clipping.customSvgPath}
                cornerRadiusPx={layer.borderRadius}
              >
                <div
                  style={{
                    fontFamily: layer.fontFamily || defaultHeadingFont,
                    fontWeight: layer.fontWeight ?? 800,
                    fontSize: `${layer.fontSize ?? 48}px`,
                    color: layer.color || '#FFFFFF',
                    backgroundColor: layer.backgroundColor || 'transparent',
                    borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
                    border: layer.border || undefined,
                    padding: layer.padding || '0px',
                    letterSpacing: layer.letterSpacing || 'normal',
                    lineHeight: layer.lineHeight ?? 1.25,
                    textTransform: layer.textTransform || 'none',
                    textShadow:
                      layer.textShadow ||
                      (layer.backgroundColor ? 'none' : '0 4px 18px rgba(0, 0, 0, 0.85), 0 2px 4px rgba(0, 0, 0, 0.9)'),
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35))',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {renderTextContent()}
                </div>
              </ShapeClippingContainer>
            ) : (
              <div
                style={{
                  fontFamily: layer.fontFamily || defaultHeadingFont,
                  fontWeight: layer.fontWeight ?? 800,
                  fontSize: `${layer.fontSize ?? 48}px`,
                  color: layer.color || '#FFFFFF',
                  backgroundColor: layer.backgroundColor || 'transparent',
                  borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
                  border: layer.border || undefined,
                  padding: layer.padding || '0px',
                  letterSpacing: layer.letterSpacing || 'normal',
                  lineHeight: layer.lineHeight ?? 1.25,
                  textTransform: layer.textTransform || 'none',
                  textShadow:
                    layer.textShadow ||
                    (layer.backgroundColor ? 'none' : '0 4px 18px rgba(0, 0, 0, 0.85), 0 2px 4px rgba(0, 0, 0, 0.9)'),
                  filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.35))',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {renderTextContent()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
