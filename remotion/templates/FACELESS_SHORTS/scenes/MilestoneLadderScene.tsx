import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface MilestoneLadderSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

interface LadderStep {
  stepNumber: number;
  label: string;
  metric: string;
  subtext: string;
}

/* ───────────────────────── SVG Icons ───────────────────────── */

function StairsIcon({ size = 16, color = '#EA580C' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 3v4h-4v4h-4v4H7v4H3v2h18V3z" />
    </svg>
  );
}

function TargetIcon({ size = 14, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

const DEFAULT_LADDER_STEPS: LadderStep[] = [
  { stepNumber: 1, metric: '$1', label: 'Payment Setup', subtext: 'Overcoming technical & mental barrier of selling online' },
  { stepNumber: 2, metric: '$10', label: 'Digital Product', subtext: 'Packaging knowledge into a mini-guide or template' },
  { stepNumber: 3, metric: '$100', label: 'Organic Distribution', subtext: 'Overcoming fear of selling to strangers in public' },
  { stepNumber: 4, metric: '$1,000', label: 'Repeatable Engine', subtext: 'Systematizing offer, landing page & conversion funnel' },
];

export function MilestoneLadderScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: MilestoneLadderSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? false;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#475569';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  // Entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const scale = interpolate(entrance, [0, 1], [0.94, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const sceneTitle = scene.heading || 'Progressive Milestone Ladder';
  const rawSubtext = scene.supportingText || 'Escalating micro-milestones to guarantee compound execution';

  const steps: LadderStep[] =
    scene.listItems && scene.listItems.length >= 3
      ? scene.listItems.slice(0, 4).map((item, idx) => {
          const parts = item.split(/[:•-]/);
          return {
            stepNumber: idx + 1,
            metric: parts[0]?.trim() || `Step ${idx + 1}`,
            label: parts[1]?.trim() || parts[0]?.trim() || `Milestone ${idx + 1}`,
            subtext: parts[2]?.trim() || 'Key progression benchmark',
          };
        })
      : DEFAULT_LADDER_STEPS;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        padding: isPortrait ? `${160 * s}px ${45 * s}px ${180 * s}px` : `${50 * s}px ${80 * s}px`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: bodyFont,
      }}
    >
      {/* ── Eyebrow Kicker Pill ── */}
      <div
        style={{
          marginBottom: isPortrait ? `${20 * s}px` : `${24 * s}px`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${8 * s}px`,
          borderRadius: `${999 * s}px`,
          border: '1.5px solid rgba(234, 88, 12, 0.3)',
          backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.12)',
          padding: `${6 * s}px ${18 * s}px`,
          fontSize: `${13 * s}px`,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#EA580C',
          opacity,
        }}
      >
        <StairsIcon size={16 * s} color="#EA580C" />
        <span>PROGRESSION ENGINE</span>
      </div>

      <h1
        style={{
          fontFamily: headingFont,
          fontSize: isPortrait ? `${36 * s}px` : `${44 * s}px`,
          fontWeight: 900,
          color: textPrimary,
          margin: `0 0 ${8 * s}px 0`,
          letterSpacing: '-0.025em',
          textAlign: 'center',
        }}
      >
        {sceneTitle}
      </h1>

      <p
        style={{
          fontSize: `${18 * s}px`,
          color: textSecondary,
          margin: `0 0 ${isPortrait ? 24 * s : 36 * s}px 0`,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {rawSubtext}
      </p>

      {/* ── Adaptive Grid: 2×2 in 9:16 Portrait, 4-Col in 16:9 Landscape ── */}
      <div
        style={{
          width: '100%',
          maxWidth: isPortrait ? '520px' : '1240px',
          display: 'grid',
          gridTemplateColumns: isPortrait ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: `${16 * s}px`,
          opacity,
          transform: `scale(${scale})`,
          boxSizing: 'border-box',
        }}
      >
        {steps.map((step, idx) => {
          const stepSpring = spring({
            frame: Math.max(0, currentFrame - 6 - idx * 4),
            fps,
            config: { damping: 14, stiffness: 110 },
          });

          const isTopGoal = idx === steps.length - 1;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: cardBg,
                borderRadius: `${20 * s}px`,
                border: isTopGoal ? '2px solid rgba(16, 185, 129, 0.5)' : `1.5px solid ${cardBorder}`,
                padding: `${20 * s}px`,
                boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,${isDark ? '0.35' : '0.06'})`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: stepSpring,
                transform: `translateY(${interpolate(stepSpring, [0, 1], [25 * s, 0])}px)`,
                boxSizing: 'border-box',
                minHeight: isPortrait ? `${180 * s}px` : `${260 * s}px`,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${12 * s}px` }}>
                  <span
                    style={{
                      fontSize: `${12 * s}px`,
                      fontWeight: 800,
                      color: isTopGoal ? '#10B981' : textSecondary,
                    }}
                  >
                    STEP 0{step.stepNumber}
                  </span>
                  {isTopGoal ? <TargetIcon size={14 * s} color="#10B981" /> : <span style={{ color: textSecondary }}>✦</span>}
                </div>

                {/* Metric Badge */}
                <div style={{ marginBottom: `${10 * s}px` }}>
                  <span
                    style={{
                      backgroundColor: '#FFE600',
                      color: '#000000',
                      padding: `${2 * s}px ${8 * s}px`,
                      borderRadius: `${4 * s}px`,
                      fontWeight: 900,
                      fontSize: `${18 * s}px`,
                      display: 'inline-block',
                    }}
                  >
                    {step.metric}
                  </span>
                </div>

                {/* Step Title */}
                <div
                  style={{
                    fontFamily: headingFont,
                    fontSize: `${18 * s}px`,
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.25,
                    marginBottom: `${6 * s}px`,
                  }}
                >
                  {step.label}
                </div>

                <div
                  style={{
                    fontSize: `${13 * s}px`,
                    lineHeight: 1.4,
                    color: textSecondary,
                    fontWeight: 500,
                  }}
                >
                  {step.subtext}
                </div>
              </div>

              {/* Bottom Progress Footnote */}
              <div
                style={{
                  marginTop: `${14 * s}px`,
                  paddingTop: `${10 * s}px`,
                  borderTop: `1px solid ${cardBorder}`,
                  fontSize: `${11 * s}px`,
                  fontWeight: 700,
                  color: isTopGoal ? '#10B981' : textSecondary,
                }}
              >
                {isTopGoal ? '✓ Core Objective' : `Rung ${step.stepNumber} Complete`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MilestoneLadderScene;
