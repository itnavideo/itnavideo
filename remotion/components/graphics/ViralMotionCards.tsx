import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTheme, ThemeMode } from './themeTokens';

// ─── 1. IPHONE NOTIFICATION BANNER ───────────────────────────────────────────

export interface IPhoneNotificationCardProps {
  appName?: string;
  appIcon?: 'youtube' | 'twitter' | 'whatsapp' | 'stripe' | 'bank' | 'bell';
  title?: string;
  message?: string;
  timeAgo?: string;
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

const APP_COLORS: Record<string, { bg: string; icon: string }> = {
  youtube: { bg: '#FF0000', icon: '#FFFFFF' },
  twitter: { bg: '#000000', icon: '#FFFFFF' },
  whatsapp: { bg: '#25D366', icon: '#FFFFFF' },
  stripe: { bg: '#635BFF', icon: '#FFFFFF' },
  bank: { bg: '#10B981', icon: '#FFFFFF' },
  bell: { bg: '#F59E0B', icon: '#FFFFFF' },
};

/**
 * iOS-style Dynamic Notification Banner with smooth spring slide-down entrance.
 */
export const IPhoneNotificationCard: React.FC<IPhoneNotificationCardProps> = ({
  appName = 'Stripe',
  appIcon = 'stripe',
  title = 'Payment Received',
  message = '$2,450.00 USD from customer #8912',
  timeAgo = 'now',
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  width = 520,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const floatY = Math.sin((frame / fps) * 2) * 4;
  const translateY = interpolate(entrance, [0, 1], [-40, 0]);
  const opacity = interpolate(entrance, [0, 0.4, 1], [0, 0.9, 1]);
  const palette = resolveTheme(theme, canvasBgColor);
  const iconConfig = APP_COLORS[appIcon] || APP_COLORS.stripe;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '16px',
        width,
        maxWidth: '92%',
        padding: '16px 22px',
        borderRadius: '24px',
        backgroundColor: palette.mode === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)'}`,
        boxShadow: palette.mode === 'light'
          ? '0 20px 45px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
          : '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 255, 255, 0.05)',
        transform: `translateY(${translateY + floatY}px)`,
        opacity,
        ...style,
      }}
    >
      {/* App Icon */}
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: iconConfig.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <span style={{ color: iconConfig.icon, fontSize: '18px', fontWeight: 900 }}>
          {appName.charAt(0)}
        </span>
      </div>

      {/* Notification Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: palette.textPrimary, letterSpacing: '-0.01em' }}>
            {title}
          </span>
          <span style={{ fontSize: '11px', color: palette.textMuted, fontWeight: 500 }}>
            {timeAgo}
          </span>
        </div>
        <div
          style={{
            fontSize: '13.5px',
            color: palette.mode === 'light' ? '#475569' : '#CBD5E1',
            lineHeight: 1.35,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

// ─── 2. VS BATTLE SHOWDOWN CARD ──────────────────────────────────────────────

export interface VsBattleCardProps {
  leftTitle: string;
  leftSubtitle?: string;
  leftStatus?: 'winner' | 'loser' | 'neutral';
  rightTitle: string;
  rightSubtitle?: string;
  rightStatus?: 'winner' | 'loser' | 'neutral';
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  width?: number | string;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

/**
 * High-voltage "VS" comparison battle card for polarizing creator debates.
 */
export const VsBattleCard: React.FC<VsBattleCardProps> = ({
  leftTitle = 'Traditional Job',
  leftSubtitle = '40 Hours/Week • Capped Income',
  leftStatus = 'loser',
  rightTitle = 'Faceless YouTube',
  rightSubtitle = 'Scalable • Passive Cash Flow',
  rightStatus = 'winner',
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  width = 720,
  orientation = 'horizontal',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const vsPulse = 1 + Math.sin((frame / fps) * 6) * 0.08;
  const palette = resolveTheme(theme, canvasBgColor);

  if (orientation === 'vertical') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width,
          maxWidth: '96%',
          borderRadius: '24px',
          backgroundColor: palette.surface,
          border: `1.5px solid ${palette.border}`,
          boxShadow: palette.mode === 'light'
            ? '0 25px 50px rgba(0, 0, 0, 0.08)'
            : '0 30px 70px rgba(0, 0, 0, 0.7)',
          overflow: 'visible',
          transform: `scale(${interpolate(entrance, [0, 1], [0.88, 1])})`,
          opacity: entrance,
          ...style,
        }}
      >
        {/* Top Option */}
        <div
          style={{
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: leftStatus === 'loser' ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
            borderRadius: '24px 24px 0 0',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: leftStatus === 'loser' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: leftStatus === 'loser' ? '#EF4444' : '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {leftStatus === 'loser' ? '✕' : '✓'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: palette.textPrimary, marginBottom: '2px' }}>
              {leftTitle}
            </div>
            {leftSubtitle && (
              <div style={{ fontSize: '13px', color: palette.textMuted, fontWeight: 500 }}>
                {leftSubtitle}
              </div>
            )}
          </div>
        </div>

        {/* Center VS Badge */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${vsPulse})`,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#FF5722',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 900,
            boxShadow: '0 0 25px rgba(255, 87, 34, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 10,
          }}
        >
          VS
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: palette.border }} />

        {/* Bottom Option */}
        <div
          style={{
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: rightStatus === 'winner' ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
            borderRadius: '0 0 24px 24px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: rightStatus === 'winner' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: rightStatus === 'winner' ? '#10B981' : '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {rightStatus === 'winner' ? '✓' : '✕'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: palette.textPrimary, marginBottom: '2px' }}>
              {rightTitle}
            </div>
            {rightSubtitle && (
              <div style={{ fontSize: '13px', color: palette.textMuted, fontWeight: 500 }}>
                {rightSubtitle}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        width,
        maxWidth: '96%',
        borderRadius: '24px',
        backgroundColor: palette.surface,
        border: `1.5px solid ${palette.border}`,
        boxShadow: palette.mode === 'light'
          ? '0 25px 50px rgba(0, 0, 0, 0.08)'
          : '0 30px 70px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        transform: `scale(${interpolate(entrance, [0, 1], [0.88, 1])})`,
        opacity: entrance,
        ...style,
      }}
    >
      {/* Left Option */}
      <div
        style={{
          flex: 1,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: leftStatus === 'loser' ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: leftStatus === 'loser' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: leftStatus === 'loser' ? '#EF4444' : '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 800,
            marginBottom: '14px',
          }}
        >
          {leftStatus === 'loser' ? '✕' : '✓'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: palette.textPrimary, marginBottom: '6px' }}>
          {leftTitle}
        </div>
        {leftSubtitle && (
          <div style={{ fontSize: '13px', color: palette.textMuted, fontWeight: 500 }}>
            {leftSubtitle}
          </div>
        )}
      </div>

      {/* Center "VS" Badge */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${vsPulse})`,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#FF5722',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 900,
          boxShadow: '0 0 25px rgba(255, 87, 34, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 10,
        }}
      >
        VS
      </div>

      {/* Divider */}
      <div style={{ width: '1px', backgroundColor: palette.border }} />

      {/* Right Option */}
      <div
        style={{
          flex: 1,
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: rightStatus === 'winner' ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: rightStatus === 'winner' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: rightStatus === 'winner' ? '#10B981' : '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 800,
            marginBottom: '14px',
          }}
        >
          {rightStatus === 'winner' ? '✓' : '✕'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: palette.textPrimary, marginBottom: '6px' }}>
          {rightTitle}
        </div>
        {rightSubtitle && (
          <div style={{ fontSize: '13px', color: palette.textMuted, fontWeight: 500 }}>
            {rightSubtitle}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── 3. METRIC GROWTH PILL ───────────────────────────────────────────────────

export interface MetricGrowthPillProps {
  value: string;
  label: string;
  growthDelta?: string;
  isPositive?: boolean;
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  style?: React.CSSProperties;
}

/**
 * Glowing high-retention metric badge with animated counter aura.
 */
export const MetricGrowthPill: React.FC<MetricGrowthPillProps> = ({
  value = '$12,450',
  label = 'Monthly Recurring Revenue',
  growthDelta = '+340%',
  isPositive = true,
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const currentScale = interpolate(entrance, [0, 1], [0.82, 1]);
  const palette = resolveTheme(theme, canvasBgColor);
  const accentGreen = '#10B981';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '20px',
        padding: '18px 30px',
        borderRadius: '9999px',
        backgroundColor: palette.mode === 'light' ? '#FFFFFF' : 'rgba(10, 14, 26, 0.94)',
        border: `2px solid ${isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
        boxShadow: isPositive
          ? '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.25)'
          : '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.25)',
        transform: `scale(${currentScale})`,
        opacity: entrance,
        ...style,
      }}
    >
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 900, color: palette.textPrimary, letterSpacing: '-0.03em' }}>
          {value}
        </div>
      </div>


      {growthDelta && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isPositive ? accentGreen : '#EF4444',
            fontSize: '14px',
            fontWeight: 800,
          }}
        >
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{growthDelta}</span>
        </div>
      )}
    </div>
  );
};

// ─── 4. NEWSPAPER HEADLINE CUTOUT ─────────────────────────────────────────────

export interface NewspaperHeadlineCardProps {
  publication?: string;
  date?: string;
  headline: string;
  highlightWords?: string[];
  theme?: ThemeMode;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

/**
 * Authentic editorial newsprint cutout with animated yellow highlighter tape.
 */
export const NewspaperHeadlineCard: React.FC<NewspaperHeadlineCardProps> = ({
  publication = 'THE FINANCIAL JOURNAL',
  date = 'OCTOBER 2026 EDITION',
  headline = 'AI Completely Replaces Traditional Video Editors in Historic Shift',
  highlightWords = ['Completely Replaces', 'Historic Shift'],
  delayFrames = 0,
  width = 640,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const highlightWidth = interpolate(frame - delayFrames, [15, 45], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        maxWidth: '94%',
        backgroundColor: '#F7F5EC',
        color: '#1A1A1A',
        padding: '28px 32px',
        borderRadius: '4px',
        border: '1px solid #D5CEBE',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)',
        transform: `scale(${interpolate(entrance, [0, 1], [0.92, 1])}) rotate(-1deg)`,
        opacity: entrance,
        fontFamily: "'Playfair Display', 'Georgia', serif",
        ...style,
      }}
    >
      {/* Newspaper Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #1A1A1A',
          paddingBottom: '8px',
          marginBottom: '16px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {publication}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#666666', letterSpacing: '0.05em' }}>
          {date}
        </span>
      </div>

      {/* Main Headline with Highlight */}
      <div
        style={{
          position: 'relative',
          fontSize: '24px',
          fontWeight: 800,
          lineHeight: 1.28,
          letterSpacing: '-0.02em',
          color: '#0A0A0A',
        }}
      >
        {headline}
        {/* Animated highlighter tape */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            left: 0,
            width: `${highlightWidth}%`,
            height: '14px',
            backgroundColor: 'rgba(255, 230, 0, 0.45)',
            zIndex: -1,
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
};

// ─── 5. STAMP BADGE ──────────────────────────────────────────────────────────

export interface StampBadgeProps {
  text: string;
  color?: string;
  rotation?: number;
  delayFrames?: number;
  style?: React.CSSProperties;
}

/**
 * Hard-hitting Rubber Stamp that slams onto the canvas with visual impact.
 */
export const StampBadge: React.FC<StampBadgeProps> = ({
  text = 'VERIFIED TRUTH',
  color = '#EF4444',
  rotation = -12,
  delayFrames = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slam = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 9, stiffness: 220 }, // Punchy overshoot
  });

  const currentScale = interpolate(slam, [0, 1], [2.2, 1]);
  const opacity = interpolate(slam, [0, 0.2, 1], [0, 1, 1]);

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '10px 24px',
        border: `4px dashed ${color}`,
        borderRadius: '12px',
        color,
        fontSize: '22px',
        fontWeight: 900,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        transform: `scale(${currentScale}) rotate(${rotation}deg)`,
        opacity,
        boxShadow: `0 0 25px ${color}33`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ─── 6. VERTICAL ROADMAP DIAGRAM (Animated Vector SVG Roadmap for Shorts & Mobile) ───

export interface VerticalRoadmapStep {
  number: string | number;
  title: string;
  detail?: string;
  badge?: string;
  accent?: string;
  isComplete?: boolean;
}

export interface VerticalRoadmapDiagramProps {
  title?: string;
  subtitle?: string;
  steps: VerticalRoadmapStep[];
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

/**
 * Animated Vertical SVG Roadmap engineered for 9:16 Shorts and mobile viewports.
 * Features an animated glowing line with staggered milestone checkpoints.
 */
export const VerticalRoadmapDiagram: React.FC<VerticalRoadmapDiagramProps> = ({
  title = 'STEP-BY-STEP PROGRESSION',
  subtitle,
  steps,
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  width = 720,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!steps || steps.length === 0) return null;

  const headerEntrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const progressSpring = spring({
    frame: Math.max(0, frame - delayFrames - 8),
    fps,
    config: { damping: 18, stiffness: 70 },
  });

  const palette = resolveTheme(theme, canvasBgColor);
  const totalSteps = steps.length;
  const progressPercent = interpolate(progressSpring, [0, 1], [0, 100]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width,
        maxWidth: '96%',
        position: 'relative',
        ...style,
      }}
    >
      {/* Eyebrow & Title */}
      {title && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '28px',
            opacity: headerEntrance,
            transform: `translateY(${interpolate(headerEntrance, [0, 1], [-20, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 87, 34, 0.12)',
              border: '1px solid rgba(255, 87, 34, 0.35)',
              color: '#FF7043',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: subtitle ? '8px' : 0,
            }}
          >
            <span>🚀</span>
            <span>{title}</span>
          </div>
          {subtitle && (
            <div style={{ fontSize: '15px', color: palette.textMuted, fontWeight: 600, marginTop: '6px' }}>
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Vertical Steps Container */}
      <div style={{ position: 'relative', width: '100%', paddingLeft: '56px' }}>
        {/* Animated Vertical Line Track */}
        <div
          style={{
            position: 'absolute',
            left: '26px',
            top: '20px',
            bottom: '20px',
            width: '4px',
            backgroundColor: palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${progressPercent}%`,
              background: 'linear-gradient(180deg, #38BDF8 0%, #FF5722 50%, #10B981 100%)',
              boxShadow: '0 0 16px rgba(255, 87, 34, 0.8)',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* Staggered Step Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((st, i) => {
            const stepSpring = spring({
              frame: Math.max(0, frame - delayFrames - 10 - i * 6),
              fps,
              config: { damping: 14, stiffness: 100 },
            });

            const stepTranslateX = interpolate(stepSpring, [0, 1], [30, 0]);
            const stepOpacity = interpolate(stepSpring, [0, 1], [0, 1]);
            const stepAccent = st.accent || (i === totalSteps - 1 ? '#10B981' : i === 0 ? '#38BDF8' : '#FF5722');

            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderRadius: '18px',
                  backgroundColor: palette.surface,
                  border: `1.5px solid ${palette.border}`,
                  boxShadow: palette.mode === 'light'
                    ? '0 10px 25px rgba(0, 0, 0, 0.05)'
                    : '0 15px 35px rgba(0, 0, 0, 0.6)',
                  transform: `translateX(${stepTranslateX}px)`,
                  opacity: stepOpacity,
                }}
              >
                {/* Node Milestone Circle on the Track */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-48px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: stepAccent,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 900,
                    boxShadow: `0 0 20px ${stepAccent}66`,
                    transform: `scale(${stepSpring})`,
                    zIndex: 5,
                  }}
                >
                  {st.number}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: palette.textPrimary }}>
                      {st.title}
                    </div>
                    {st.badge && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: `${stepAccent}22`,
                          color: stepAccent,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {st.badge}
                      </span>
                    )}
                  </div>
                  {st.detail && (
                    <div style={{ fontSize: '13.5px', color: palette.textMuted, fontWeight: 500, lineHeight: 1.35 }}>
                      {st.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── 7. SUPPORTING TEXT NOTE CARD (High-Impact Editorial Note Card) ──────────

const NOTE_PALETTES = {
  yellow: { bg: '#FEF9C3', text: '#713F12', border: '#FDE047', tape: 'rgba(254, 240, 138, 0.75)', badge: '#EAB308' },
  cyan: { bg: '#E0F2FE', text: '#0C4A6E', border: '#BAE6FD', tape: 'rgba(186, 230, 253, 0.75)', badge: '#0284C7' },
  mint: { bg: '#DCFCE7', text: '#14532D', border: '#BBF7D0', tape: 'rgba(187, 247, 208, 0.75)', badge: '#16A34A' },
  peach: { bg: '#FFEDD5', text: '#7C2D12', border: '#FED7AA', tape: 'rgba(254, 215, 170, 0.75)', badge: '#EA580C' },
  purple: { bg: '#F3E8FF', text: '#581C87', border: '#E9D5FF', tape: 'rgba(233, 213, 255, 0.75)', badge: '#9333EA' },
  slate: { bg: '#F1F5F9', text: '#0F172A', border: '#E2E8F0', tape: 'rgba(226, 232, 240, 0.75)', badge: '#475569' },
};

export interface SupportingNoteCardProps {
  tag?: string;
  title: string;
  content: string;
  bullets?: string[];
  author?: string;
  colorHue?: 'yellow' | 'cyan' | 'mint' | 'peach' | 'purple' | 'slate';
  tiltAngle?: number;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

/**
 * Skeuomorphic, high-retention Supporting Text Note Card for mobile Shorts & Long Video.
 * Emulates a tactile memo pad note pinned to the screen to draw immediate visual focus.
 */
export const SupportingNoteCard: React.FC<SupportingNoteCardProps> = ({
  tag = 'KEY TAKEAWAY',
  title,
  content,
  bullets = [],
  author,
  colorHue = 'yellow',
  tiltAngle = -1.5,
  delayFrames = 0,
  width = 640,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!title && !content && bullets.length === 0) return null;

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const currentScale = interpolate(entrance, [0, 1], [0.86, 1]);
  const palette = NOTE_PALETTES[colorHue] || NOTE_PALETTES.yellow;

  return (
    <div
      style={{
        position: 'relative',
        width,
        maxWidth: '94%',
        backgroundColor: palette.bg,
        border: `1.5px solid ${palette.border}`,
        borderRadius: '16px',
        padding: '32px 30px 24px 30px',
        boxShadow: '0 25px 50px -10px rgba(0, 0, 0, 0.22), 0 8px 16px -4px rgba(0, 0, 0, 0.1)',
        transform: `scale(${currentScale}) rotate(${tiltAngle}deg)`,
        opacity: entrance,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Translucent tape strip at top center */}
      <div
        style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%) rotate(0.8deg)',
          width: '84px',
          height: '28px',
          backgroundColor: palette.tape,
          backdropFilter: 'blur(3px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          borderRadius: '2px',
        }}
      />

      {/* Top Header Row with Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            fontWeight: 800,
            color: palette.badge,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          <span>📌</span>
          <span>{tag}</span>
        </div>
      </div>

      {/* Bold Note Title */}
      {title && (
        <div
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: palette.text,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}
        >
          {title}
        </div>
      )}

      {/* Supporting Text Body */}
      {content && (
        <div
          style={{
            fontSize: '16px',
            color: palette.text,
            opacity: 0.9,
            lineHeight: 1.45,
            fontWeight: 500,
            marginBottom: bullets.length > 0 ? '12px' : 0,
          }}
        >
          {content}
        </div>
      )}

      {/* Optional Bullet Points */}
      {bullets && bullets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: palette.badge, fontWeight: 900, fontSize: '14px', lineHeight: 1.3 }}>•</span>
              <span style={{ fontSize: '15px', color: palette.text, fontWeight: 600, lineHeight: 1.35 }}>
                {b}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Author / Source attribution */}
      {author && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '10px',
            borderTop: `1px dashed ${palette.border}`,
            fontSize: '12px',
            fontWeight: 700,
            color: palette.text,
            opacity: 0.75,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          — {author}
        </div>
      )}
    </div>
  );
};

