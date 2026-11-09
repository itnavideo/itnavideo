import React, { memo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

// =========================================================================
// 1. CALLOUT & LABEL LAYER SCHEMA
// =========================================================================

export type CalloutType =
  | 'speech-bubble'     // Rounded dialogue bubble with pointing tail
  | 'thought-bubble'    // Cloud-like bubble with ascending circular trail
  | 'target-pointer'    // Target crosshair/dot + leader line + spec label
  | 'info-box'          // Editorial card with badge, title & body description
  | 'status-pill'       // Compact pill with animated pulsing dot (e.g. ● LIVE)
  | 'connector-label';  // Multi-point connector line with center label

export type CalloutTheme = 'dark-card' | 'glass' | 'flame-accent' | 'mint-tech' | 'gold-luxury';

export interface DynamicCalloutLayer {
  id: string;
  type: CalloutType;
  startSeconds: number;
  durationSeconds: number;

  // Anchor Coordinates (1080x1920 reference space)
  x: number;
  y: number;
  width?: number;       // Card width (default 320 to 420 px)

  // Content
  title?: string;
  description?: string;
  badgeText?: string;
  icon?: string;

  // Pointers & Tails
  targetPoint?: { x: number; y: number }; // Where the pointer originates from
  tailPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

  // Styling & Theme
  theme?: CalloutTheme;
  customColor?: string;

  // Animation
  inAnimation?: 'spring-pop' | 'slide-up' | 'scale' | 'none';
  outAnimation?: 'shrink' | 'fade' | 'none';
  zIndex?: number;
}

// =========================================================================
// 2. THEME STYLES
// =========================================================================

const THEME_STYLES: Record<CalloutTheme, { bg: string; border: string; text: string; subtext: string; accent: string }> = {
  'dark-card': {
    bg: 'rgba(15, 23, 42, 0.94)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    text: '#FFFFFF',
    subtext: '#94A3B8',
    accent: '#38BDF8',
  },
  'glass': {
    bg: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    text: '#FFFFFF',
    subtext: '#E2E8F0',
    accent: '#FFFFFF',
  },
  'flame-accent': {
    bg: 'rgba(24, 24, 27, 0.95)',
    border: '1.5px solid #FF5722',
    text: '#FFFFFF',
    subtext: '#D4D4D8',
    accent: '#FF5722',
  },
  'mint-tech': {
    bg: 'rgba(6, 78, 59, 0.9)',
    border: '1.5px solid #10B981',
    text: '#FFFFFF',
    subtext: '#A7F3D0',
    accent: '#10B981',
  },
  'gold-luxury': {
    bg: 'rgba(28, 25, 23, 0.96)',
    border: '1.5px solid #F59E0B',
    text: '#FFFFFF',
    subtext: '#FDE68A',
    accent: '#F59E0B',
  },
};

// =========================================================================
// 3. INDIVIDUAL CALLOUT RENDERERS
// =========================================================================

/**
 * 1. Speech Bubble: Rounded card with an SVG tail pointing towards speaker
 */
const SpeechBubbleCallout = memo(({ layer, theme }: { layer: DynamicCalloutLayer; theme: typeof THEME_STYLES[CalloutTheme] }) => {
  const tailPos = layer.tailPosition ?? 'bottom-left';
  const isBottom = tailPos.startsWith('bottom');
  const isLeft = tailPos.endsWith('left');

  return (
    <div style={{ position: 'relative', width: `${layer.width ?? 340}px` }}>
      <div
        style={{
          backgroundColor: theme.bg,
          border: theme.border,
          borderRadius: 20,
          padding: '16px 22px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {layer.badgeText && (
          <span
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: theme.accent,
              marginBottom: 4,
              letterSpacing: '0.08em',
            }}
          >
            {layer.badgeText}
          </span>
        )}
        {layer.title && (
          <div style={{ fontSize: 18, fontWeight: 800, color: theme.text, lineHeight: 1.3 }}>
            {layer.title}
          </div>
        )}
        {layer.description && (
          <div style={{ fontSize: 13, fontWeight: 500, color: theme.subtext, marginTop: 4, lineHeight: 1.4 }}>
            {layer.description}
          </div>
        )}
      </div>

      {/* SVG Speech Bubble Tail */}
      <svg
        width="24"
        height="16"
        viewBox="0 0 24 16"
        style={{
          position: 'absolute',
          [isBottom ? 'bottom' : 'top']: '-14px',
          [isLeft ? 'left' : 'right']: '28px',
          transform: isBottom ? undefined : 'rotate(180deg)',
        }}
      >
        <path d="M 0,0 Q 8,12 24,16 Q 16,8 14,0 Z" fill={theme.bg} />
      </svg>
    </div>
  );
});

/**
 * 2. Thought Bubble: Cloud-like rounded card with 3 trailing ascending bubbles
 */
const ThoughtBubbleCallout = memo(({ layer, theme }: { layer: DynamicCalloutLayer; theme: typeof THEME_STYLES[CalloutTheme] }) => (
  <div style={{ position: 'relative', width: `${layer.width ?? 320}px` }}>
    <div
      style={{
        backgroundColor: theme.bg,
        border: theme.border,
        borderRadius: 26,
        padding: '18px 24px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {layer.title && (
        <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, fontStyle: 'italic', lineHeight: 1.3 }}>
          "{layer.title}"
        </div>
      )}
      {layer.description && (
        <div style={{ fontSize: 13, color: theme.subtext, marginTop: 4 }}>
          {layer.description}
        </div>
      )}
    </div>

    {/* 3 Trailing thought circles */}
    <div style={{ position: 'absolute', bottom: -12, left: 24, width: 14, height: 14, borderRadius: '50%', backgroundColor: theme.bg, border: theme.border }} />
    <div style={{ position: 'absolute', bottom: -24, left: 16, width: 9, height: 9, borderRadius: '50%', backgroundColor: theme.bg, border: theme.border }} />
    <div style={{ position: 'absolute', bottom: -32, left: 10, width: 5, height: 5, borderRadius: '50%', backgroundColor: theme.bg, border: theme.border }} />
  </div>
));

/**
 * 3. Target Pointer: Dot on subject + angled leader line + spec label pill
 */
const TargetPointerCallout = memo(({
  layer,
  theme,
  progress,
}: {
  layer: DynamicCalloutLayer;
  theme: typeof THEME_STYLES[CalloutTheme];
  progress: number;
}) => {
  const target = layer.targetPoint ?? { x: layer.x - 120, y: layer.y + 80 };
  const dx = layer.x - target.x;
  const dy = layer.y - target.y;

  return (
    <div style={{ position: 'relative' }}>
      {/* Target Dot on Subject */}
      <div
        style={{
          position: 'absolute',
          left: `${target.x - layer.x}px`,
          top: `${target.y - layer.y}px`,
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: theme.accent,
          border: '2px solid #FFFFFF',
          boxShadow: `0 0 16px ${theme.accent}`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Leader Line linking Target to Label */}
      <svg
        width="400"
        height="300"
        style={{
          position: 'absolute',
          left: `${Math.min(0, dx)}px`,
          top: `${Math.min(0, dy)}px`,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <line
          x1={target.x - layer.x}
          y1={target.y - layer.y}
          x2={0}
          y2={0}
          stroke={theme.accent}
          strokeWidth={1.5}
          strokeDasharray="4,3"
          strokeOpacity={progress}
        />
      </svg>

      {/* Spec Pill Badge */}
      <div
        style={{
          backgroundColor: theme.bg,
          border: theme.border,
          borderRadius: 12,
          padding: '8px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          whiteSpace: 'nowrap',
        }}
      >
        {layer.badgeText && (
          <span style={{ fontSize: 10, fontWeight: 900, color: theme.accent, letterSpacing: '0.08em' }}>
            [{layer.badgeText}]
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>
          {layer.title ?? 'FEATURE'}
        </span>
      </div>
    </div>
  );
});

/**
 * 4. Information Box / Infocard: Structured editorial card with tag, title & body
 */
const InfoBoxCallout = memo(({ layer, theme }: { layer: DynamicCalloutLayer; theme: typeof THEME_STYLES[CalloutTheme] }) => (
  <div
    style={{
      width: `${layer.width ?? 380}px`,
      backgroundColor: theme.bg,
      border: theme.border,
      borderRadius: 18,
      padding: '20px 24px',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      {layer.badgeText && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '3px 9px',
            borderRadius: 6,
            color: theme.accent,
            letterSpacing: '0.06em',
          }}
        >
          {layer.badgeText}
        </span>
      )}
      {layer.icon && <span style={{ fontSize: 18 }}>{layer.icon}</span>}
    </div>
    {layer.title && (
      <div style={{ fontSize: 20, fontWeight: 900, color: theme.text, lineHeight: 1.25 }}>
        {layer.title}
      </div>
    )}
    {layer.description && (
      <div style={{ fontSize: 14, color: theme.subtext, marginTop: 6, lineHeight: 1.45 }}>
        {layer.description}
      </div>
    )}
  </div>
));

/**
 * 5. Status Pill: Compact pill with animated pulsing dot (e.g. ● LIVE / ● STEP 1)
 */
const StatusPillCallout = memo(({
  layer,
  theme,
  frame,
  fps,
}: {
  layer: DynamicCalloutLayer;
  theme: typeof THEME_STYLES[CalloutTheme];
  frame: number;
  fps: number;
}) => {
  const pulse = 0.5 + Math.sin((frame / fps) * 4) * 0.5;

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        border: theme.border,
        borderRadius: 9999,
        padding: '8px 18px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: theme.accent,
          boxShadow: `0 0 ${8 * pulse + 4}px ${theme.accent}`,
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 800, color: theme.text, letterSpacing: '0.04em' }}>
        {layer.title ?? 'STATUS'}
      </span>
    </div>
  );
});

// =========================================================================
// 4. SINGLE TIME-WINDOWED CALLOUT VIEW (GPU translate3d composite)
// =========================================================================

const SingleCalloutView = memo(({ layer }: { layer: DynamicCalloutLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDurationFrames = Math.max(1, Math.round(layer.durationSeconds * fps));
  const theme = THEME_STYLES[layer.theme ?? 'dark-card'];

  // ── Entrance Motion ──
  let enterScale = 1.0;
  let enterOpacity = 1.0;
  let enterTranslateY = 0;

  const inAnim = layer.inAnimation ?? 'spring-pop';
  if (inAnim === 'spring-pop') {
    enterScale = spring({
      frame,
      fps,
      config: { damping: 11, stiffness: 200, mass: 0.6 },
    });
    enterOpacity = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
  } else if (inAnim === 'slide-up') {
    enterTranslateY = interpolate(frame, [0, 8], [40, 0], { extrapolateRight: 'clamp' });
    enterOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  } else if (inAnim === 'scale') {
    enterScale = interpolate(frame, [0, 8], [0.6, 1.0], { extrapolateRight: 'clamp' });
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

  const finalScale = enterScale * exitScale;
  const finalOpacity = enterOpacity * exitOpacity;
  const finalY = layer.y + enterTranslateY;

  let content: React.ReactNode = null;
  switch (layer.type) {
    case 'speech-bubble':
      content = <SpeechBubbleCallout layer={layer} theme={theme} />;
      break;
    case 'thought-bubble':
      content = <ThoughtBubbleCallout layer={layer} theme={theme} />;
      break;
    case 'target-pointer':
      content = <TargetPointerCallout layer={layer} theme={theme} progress={enterOpacity} />;
      break;
    case 'info-box':
      content = <InfoBoxCallout layer={layer} theme={theme} />;
      break;
    case 'status-pill':
      content = <StatusPillCallout layer={layer} theme={theme} frame={frame} fps={fps} />;
      break;
    case 'connector-label':
      content = <TargetPointerCallout layer={layer} theme={theme} progress={enterOpacity} />;
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
        zIndex: layer.zIndex ?? 32,
        transformOrigin: 'center center',
        // GPU composite layer translate3d
        transform: `translate3d(${layer.x}px, ${finalY}px, 0) scale(${finalScale.toFixed(4)})`,
        pointerEvents: 'none',
      }}
    >
      {content}
    </div>
  );
});

// =========================================================================
// 5. MAIN MULTI-LAYER CALLOUT OVERLAY STAGE
// =========================================================================

export interface MultiLayerCalloutOverlayProps {
  callouts?: DynamicCalloutLayer[];
}

export const MultiLayerCalloutOverlay: React.FC<MultiLayerCalloutOverlayProps> = ({ callouts = [] }) => {
  const { fps } = useVideoConfig();

  if (!callouts || callouts.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 32,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {callouts.map((callout) => {
        const fromFrame = Math.round(callout.startSeconds * fps);
        const durationInFrames = Math.max(1, Math.round(callout.durationSeconds * fps));

        return (
          <Sequence
            key={callout.id}
            name={`callout-${callout.type}-${callout.id}`}
            from={fromFrame}
            durationInFrames={durationInFrames}
          >
            <SingleCalloutView layer={callout} />
          </Sequence>
        );
      })}
    </div>
  );
};
