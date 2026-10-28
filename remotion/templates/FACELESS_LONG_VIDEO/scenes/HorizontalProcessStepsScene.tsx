import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface HorizontalProcessStepsSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: {
    isDark?: boolean;
    primary?: string;
    accent?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
  iconType: 'lightbulb' | 'plan' | 'gear' | 'rocket' | 'growth' | 'target' | 'shield' | 'code';
  badgeColor: string;
  bottomBarColor: string;
}

const DEFAULT_5_STEPS: ProcessStepItem[] = [
  {
    number: '01',
    title: 'Research',
    description: 'Understand your market, audience, and opportunities.',
    iconType: 'lightbulb',
    badgeColor: '#2563EB',
    bottomBarColor: '#2563EB',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'Set clear goals, create a strategy, and outline your roadmap.',
    iconType: 'plan',
    badgeColor: '#6366F1',
    bottomBarColor: '#6366F1',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Bring your plan to life with the right tools and resources.',
    iconType: 'gear',
    badgeColor: '#10B981',
    bottomBarColor: '#10B981',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'Go live, reach your audience, and start getting results.',
    iconType: 'rocket',
    badgeColor: '#F59E0B',
    bottomBarColor: '#F59E0B',
  },
  {
    number: '05',
    title: 'Grow',
    description: 'Analyze performance, learn, and scale for long-term success.',
    iconType: 'growth',
    badgeColor: '#8B5CF6',
    bottomBarColor: '#8B5CF6',
  },
];

const STEP_COLORS = [
  { badge: '#2563EB', bar: '#2563EB' },
  { badge: '#6366F1', bar: '#6366F1' },
  { badge: '#10B981', bar: '#10B981' },
  { badge: '#F59E0B', bar: '#F59E0B' },
  { badge: '#8B5CF6', bar: '#8B5CF6' },
];

/**
 * Renders large 2D vector illustrations for each step icon
 */
function StepIcon({ type, size = 64 }: { type: string; size?: number }) {
  switch (type) {
    case 'lightbulb':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Yellow Glow Rays */}
          <path d="M 40 8 L 40 2 M 18 16 L 12 10 M 62 16 L 68 10 M 10 38 L 4 38 M 70 38 L 76 38" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
          {/* Bulb Body */}
          <path d="M 28 44 C 20 34 22 20 34 12 C 44 6 56 12 60 22 C 62 28 58 36 54 44 L 54 52 L 28 52 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
          {/* Filament */}
          <path d="M 36 44 L 36 32 L 40 36 L 44 32 L 44 44" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="33" y="54" width="16" height="5" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
          <rect x="36" y="59" width="10" height="4" rx="2" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
        </svg>
      );

    case 'plan':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Document Sheet */}
          <rect x="18" y="10" width="44" height="60" rx="8" fill="#6366F1" stroke="#0F172A" strokeWidth="3" />
          <rect x="24" y="16" width="32" height="48" rx="5" fill="#EEF2FF" />
          {/* Checklist Lines */}
          <line x1="30" y1="26" x2="48" y2="26" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="36" x2="50" y2="36" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="46" x2="44" y2="46" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
          {/* Pencil */}
          <polygon points="46,62 58,50 66,58 54,70" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
          <polygon points="46,62 42,66 48,64" fill="#1E293B" />
        </svg>
      );

    case 'gear':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Green Cogwheel */}
          <path
            d="M 40 16 L 43 22 L 50 20 L 53 26 L 60 27 L 60 34 L 66 37 L 63 43 L 67 48 L 62 53 L 64 60 L 57 62 L 56 68 L 49 67 L 46 72 L 40 69 L 34 72 L 31 67 L 24 68 L 23 62 L 16 60 L 18 53 L 13 48 L 17 43 L 14 37 L 20 34 L 20 27 L 27 26 L 30 20 L 37 22 Z"
            fill="#10B981"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="45" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
        </svg>
      );

    case 'rocket':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          {/* Flame Exhaust */}
          <path d="M 28 58 L 22 68 L 32 64 L 38 72 L 40 60" fill="#EF4444" stroke="#F97316" strokeWidth="2.5" />
          <path d="M 28 60 L 26 66 L 34 62" fill="#FDE047" />
          {/* Rocket Body */}
          <path d="M 32 54 C 28 40 38 22 56 12 C 60 30 52 48 38 54 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
          {/* Red Nose Cone */}
          <path d="M 48 18 C 52 14 56 12 56 12 C 56 12 54 16 50 20 Z" fill="#EF4444" />
          {/* Wings */}
          <polygon points="32,54 22,50 30,42" fill="#EF4444" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="38,54 48,60 46,50" fill="#EF4444" stroke="#0F172A" strokeWidth="2.5" />
          {/* Window Porthole */}
          <circle cx="44" cy="30" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
        </svg>
      );

    case 'growth':
    default:
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          {/* 3 Rising Gradient Bars */}
          <rect x="18" y="44" width="11" height="26" rx="3" fill="#A78BFA" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="34" y="32" width="11" height="38" rx="3" fill="#8B5CF6" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="50" y="18" width="11" height="52" rx="3" fill="#6D28D9" stroke="#0F172A" strokeWidth="2.5" />
          {/* Upward Trend Curve + Arrow Head */}
          <path d="M 16 48 Q 36 34 64 12 M 52 12 L 66 12 L 66 26" stroke="#EC4899" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

/**
 * HorizontalProcessStepsScene — Premium Full-Width 16:9 Explainer Scene
 * Inspired by the master reference (Image 3: "Turn Your Idea Into Reality")
 * Fills the 1920×1080 canvas with:
 * - Category pill
 * - High-contrast title with gradient accent
 * - Balanced 5-card horizontal progression with large 2D illustrations and connector arrows
 */
export function HorizontalProcessStepsScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
  sceneFrame,
}: HorizontalProcessStepsSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  // Header entrance
  const headerEntrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const headingText = scene.heading || 'Turn Your Idea Into Reality';
  const supportingText =
    scene.supportingText ||
    'Follow these simple steps to get started, stay on track, and achieve your goals with confidence.';

  // Extract category pill or synthesize
  const categoryPill = (scene as Record<string, unknown>).categoryPill as string || 'SIMPLE 5 STEP PROCESS';

  // Build steps from scene.listItems if present, or use high-converting default 5 steps
  const steps: ProcessStepItem[] = React.useMemo(() => {
    if (scene.listItems && scene.listItems.length >= 3) {
      return scene.listItems.slice(0, 5).map((item, idx) => {
        const parts = item.split(/[:•-]/);
        const title = (parts[0] || `Step ${idx + 1}`).trim();
        const description = (parts[1] || parts[0] || 'Execute with precision and clear strategy.').trim();
        const iconTypes: Array<ProcessStepItem['iconType']> = ['lightbulb', 'plan', 'gear', 'rocket', 'growth'];
        const colors = STEP_COLORS[idx % STEP_COLORS.length];

        return {
          number: `0${idx + 1}`,
          title,
          description,
          iconType: iconTypes[idx % iconTypes.length],
          badgeColor: colors.badge,
          bottomBarColor: colors.bar,
        };
      });
    }
    return DEFAULT_5_STEPS;
  }, [scene.listItems]);

  // Separate title words so the last word receives a vibrant gradient accent
  const words = headingText.trim().split(' ');
  const mainWords = words.slice(0, Math.max(1, words.length - 1)).join(' ');
  const accentWord = words.length > 1 ? words[words.length - 1] : '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: 1920,
        height: 1080,
        backgroundColor: '#F8FAFC',
        backgroundImage: `
          radial-gradient(circle at 10% 15%, rgba(219, 234, 254, 0.65) 0%, transparent 45%),
          radial-gradient(circle at 90% 85%, rgba(243, 232, 255, 0.65) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, transparent 80%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '70px 100px 60px 100px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: bodyFont,
        zIndex: 20,
      }}
    >
      {/* ── TOP HEADER SECTION ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 1100,
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-20, 0])}px)`,
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '7px 22px',
            borderRadius: '9999px',
            backgroundColor: '#E0E7FF',
            border: '1.5px solid #C7D2FE',
            color: '#4338CA',
            fontFamily: headingFont,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 16,
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.12)',
          }}
        >
          {categoryPill}
        </div>

        {/* Main Headline with Gradient Accent */}
        <h1
          style={{
            fontFamily: headingFont,
            fontSize: 58,
            fontWeight: 900,
            color: '#0F172A',
            margin: '0 0 14px 0',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
          }}
        >
          {mainWords}{' '}
          {accentWord && (
            <span
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              {accentWord}
            </span>
          )}
        </h1>

        {/* Supporting Subtitle */}
        <p
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: '#64748B',
            margin: 0,
            lineHeight: 1.45,
            maxWidth: 820,
          }}
        >
          {supportingText}
        </p>
      </div>

      {/* ── 5 HORIZONTAL PROCESS CARDS WITH CONNECTOR ARROWS ────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: 1720,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          margin: '20px 0',
        }}
      >
        {steps.map((step, idx) => {
          // Staggered card entrance
          const cardSpring = spring({
            frame: Math.max(0, currentFrame - 6 - idx * 5),
            fps,
            config: { damping: 14, mass: 0.85, stiffness: 120 },
          });

          const scale = interpolate(cardSpring, [0, 1], [0.88, 1.0]);
          const translateY = interpolate(cardSpring, [0, 1], [30, 0]);
          const opacity = interpolate(cardSpring, [0, 0.4, 1], [0, 0.7, 1]);

          return (
            <React.Fragment key={idx}>
              {/* Process Step Card */}
              <div
                style={{
                  flex: 1,
                  maxWidth: 310,
                  height: 380,
                  opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 24,
                  border: '1.5px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 18px 36px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px 20px 20px 20px',
                  boxSizing: 'border-box',
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                {/* Circular Number Pill (01, 02, etc.) */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: step.badgeColor,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: headingFont,
                    fontSize: 20,
                    fontWeight: 900,
                    marginBottom: 18,
                    boxShadow: `0 6px 16px ${step.badgeColor}40`,
                  }}
                >
                  {step.number}
                </div>

                {/* 2D Vector Illustration / Icon */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <StepIcon type={step.iconType} size={70} />
                </div>

                {/* Step Title */}
                <h3
                  style={{
                    fontFamily: headingFont,
                    fontSize: 25,
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 10px 0',
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#64748B',
                    margin: 0,
                    lineHeight: 1.4,
                    maxWidth: 240,
                  }}
                >
                  {step.description}
                </p>

                {/* Bottom Color Accent Bar */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    right: '20%',
                    height: 5,
                    backgroundColor: step.bottomBarColor,
                    borderRadius: '4px 4px 0 0',
                  }}
                />
              </div>

              {/* Connecting Arrow between cards */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    opacity: interpolate(cardSpring, [0, 0.7, 1], [0, 0.5, 1]),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    padding: '0 2px',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M 5 12 L 18 12 M 13 7 L 18 12 L 13 17"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── BOTTOM PAGINATION INDICATOR DOTS ────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 10,
        }}
      >
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? 22 : 9,
              height: 9,
              borderRadius: '9999px',
              backgroundColor: i === 0 ? '#2563EB' : '#CBD5E1',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
