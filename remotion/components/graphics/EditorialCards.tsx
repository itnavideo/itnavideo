import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTheme, ThemeMode } from './themeTokens';

// ─── 1. EDITORIAL QUOTE CARD ──────────────────────────────────────────────────

export interface EditorialQuoteCardProps {
  /** The quote body text */
  quote: string;
  /** Author name (optional, only rendered if supplied) */
  author?: string;
  /** Role / title of author (optional) */
  authorTitle?: string;
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Editorial Quote Card: Crisp newspaper / literary style with prominent typographic quotation marks.
 * Truthfulness: Never fabricates author names or attributions.
 */
export const EditorialQuoteCard: React.FC<EditorialQuoteCardProps> = ({
  quote,
  author,
  authorTitle,
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  width = '100%',
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!quote || quote.trim().length === 0) {
    return null;
  }

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const palette = resolveTheme(theme, canvasBgColor);
  const translateY = interpolate(entrance, [0, 1], [20, 0]);

  return (
    <div
      className={className}
      style={{
        width,
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        borderLeft: `5px solid ${palette.accent}`,
        borderRadius: '16px',
        padding: '32px 36px',
        boxShadow: palette.shadow,
        opacity: entrance,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {/* Decorative quotation mark */}
      <div
        style={{
          fontSize: '48px',
          lineHeight: '24px',
          fontFamily: 'Georgia, serif',
          color: palette.accent,
          opacity: 0.6,
          marginBottom: '12px',
        }}
      >
        “
      </div>

      {/* Quote text */}
      <p
        style={{
          fontSize: '20px',
          fontWeight: 600,
          fontFamily: 'Newsreader, Georgia, serif',
          fontStyle: 'italic',
          color: palette.textPrimary,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {quote}
      </p>

      {/* Author attribution (only if explicitly provided) */}
      {author && (
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '1.5px', backgroundColor: palette.accent }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: palette.textPrimary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {author}
          </span>
          {authorTitle && (
            <span style={{ fontSize: '13px', color: palette.textMuted, fontWeight: 500 }}>
              — {authorTitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── 2. STICKY NOTE CARD ──────────────────────────────────────────────────────

export interface StickyNoteCardProps {
  /** Text content on the sticky note */
  text: string;
  /** Title or headline on the note (optional) */
  title?: string;
  /** Pastel color hue: 'yellow' | 'cyan' | 'mint' | 'peach' */
  colorHue?: 'yellow' | 'cyan' | 'mint' | 'peach';
  /** Degree of organic tilt */
  tiltAngle?: number;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

const STICKY_PALETTES = {
  yellow: { bg: '#FEF9C3', text: '#713F12', tape: 'rgba(254, 240, 138, 0.6)', border: '#FDE047' },
  cyan: { bg: '#E0F2FE', text: '#0C4A6E', tape: 'rgba(186, 230, 253, 0.6)', border: '#BAE6FD' },
  mint: { bg: '#DCFCE7', text: '#14532D', tape: 'rgba(187, 247, 208, 0.6)', border: '#BBF7D0' },
  peach: { bg: '#FFEDD5', text: '#7C2D12', tape: 'rgba(254, 215, 170, 0.6)', border: '#FED7AA' },
};

/**
 * Skeuomorphic Sticky Note with realistic tape corner and handwritten feel.
 */
export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({
  text,
  title,
  colorHue = 'yellow',
  tiltAngle = -2,
  delayFrames = 0,
  width = 340,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!text || text.trim().length === 0) {
    return null;
  }

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const colors = STICKY_PALETTES[colorHue] || STICKY_PALETTES.yellow;
  const currentScale = interpolate(entrance, [0, 1], [0.85, 1]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        padding: '28px 24px 20px 24px',
        boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transform: `scale(${currentScale}) rotate(${tiltAngle}deg)`,
        opacity: entrance,
        display: 'inline-flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Translucent tape strip at top center */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%) rotate(1deg)',
          width: '70px',
          height: '24px',
          backgroundColor: colors.tape,
          backdropFilter: 'blur(2px)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      />

      {title && (
        <div
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: colors.text,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </div>
      )}

      <p
        style={{
          fontSize: '17px',
          fontWeight: 600,
          color: colors.text,
          lineHeight: 1.45,
          margin: 0,
          fontFamily: 'Caveat, Kalam, cursive, sans-serif',
        }}
      >
        {text}
      </p>
    </div>
  );
};

// ─── 3. NUMBERED STEPS CARD ───────────────────────────────────────────────────

export interface NumberedStepItem {
  title: string;
  description?: string;
}

export interface NumberedStepsCardProps {
  title?: string;
  steps: NumberedStepItem[];
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Vertical Numbered Progression Card with clean step connectors and badges.
 */
export const NumberedStepsCard: React.FC<NumberedStepsCardProps> = ({
  title,
  steps,
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  width = '100%',
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return null;
  }

  const palette = resolveTheme(theme, canvasBgColor);

  return (
    <div
      className={className}
      style={{
        width,
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: '20px',
        padding: '28px 32px',
        boxShadow: palette.shadow,
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: '16px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: palette.accent,
            marginBottom: '22px',
          }}
        >
          {title}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {steps.map((step, idx) => {
          const stepDelay = delayFrames + idx * 5;
          const stepSpring = spring({
            frame: Math.max(0, frame - stepDelay),
            fps,
            config: { damping: 14, stiffness: 100 },
          });

          const translateX = interpolate(stepSpring, [0, 1], [-15, 0]);

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                opacity: stepSpring,
                transform: `translateX(${translateX}px)`,
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: idx === 0 ? palette.accent : palette.badgeBg,
                  color: idx === 0 ? '#FFFFFF' : palette.accent,
                  border: `1.5px solid ${palette.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {idx + 1}
              </div>

              {/* Step content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: palette.textPrimary, lineHeight: 1.3 }}>
                  {step.title}
                </div>
                {step.description && (
                  <div style={{ fontSize: '13px', color: palette.textMuted, marginTop: '3px', lineHeight: 1.4 }}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
