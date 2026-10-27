import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';

export interface MilestoneLadderSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
}

interface LadderStep {
  stepNumber: number;
  label: string;
  metric: string;
  subtext: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

const DEFAULT_LADDER_STEPS: LadderStep[] = [
  { stepNumber: 1, metric: '$1', label: 'Payment Setup', subtext: 'Overcoming technical & mental barrier of selling online' },
  { stepNumber: 2, metric: '$10', label: 'Digital Product', subtext: 'Packaging knowledge into a mini-guide or template' },
  { stepNumber: 3, metric: '$100', label: 'Organic Distribution', subtext: 'Overcoming fear of selling to strangers in public' },
  { stepNumber: 4, metric: '$1,000', label: 'Repeatable Engine', subtext: 'Systematizing offer, landing page & conversion funnel' },
];

export function MilestoneLadderScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  sceneFrame,
}: MilestoneLadderSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  // Staggered scene entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: FACELESS_DESIGN_TOKENS.motion.springConfig,
  });

  const scale = interpolate(entrance, [0, 1], [0.94, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const sceneTitle = scene.heading || 'The Progressive Milestone Ladder';
  const rawSubtext = scene.supportingText || 'Escalating micro-milestones to guarantee compound execution';

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
        backgroundColor: FACELESS_DESIGN_TOKENS.colors.canvasWhite,
        padding: '60px 100px',
      }}
    >
      {/* Eyebrow Kicker Pill */}
      <div
        style={{
          marginBottom: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '9999px',
          border: '1px solid rgba(234, 88, 12, 0.3)',
          backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentCoralBg,
          padding: '6px 20px',
          fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.annotationText}px`,
          fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: FACELESS_DESIGN_TOKENS.colors.accentCoral,
          opacity,
        }}
      >
        <span>🪜 PROGRESSION ENGINE</span>
        <span>•</span>
        <span style={{ color: FACELESS_DESIGN_TOKENS.colors.textPrimary }}>{sceneTitle}</span>
      </div>

      {/* 4-Step Staircase Ladder Grid */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {DEFAULT_LADDER_STEPS.map((step, idx) => {
          const stepSpring = spring({
            frame: Math.max(0, currentFrame - idx * FACELESS_DESIGN_TOKENS.motion.staggerFrames),
            fps,
            config: { damping: 15, stiffness: 140 },
          });

          const stepScale = interpolate(stepSpring, [0, 1], [0.88, 1.0]);
          const stepOpacity = interpolate(stepSpring, [0, 1], [0, 1]);

          const isTopGoal = idx === 3;
          const borderColor = isTopGoal
            ? '1.5px solid rgba(16, 185, 129, 0.45)'
            : FACELESS_DESIGN_TOKENS.colors.borderHairline;
          const shadow = isTopGoal
            ? '0 16px 40px rgba(16, 185, 129, 0.12)'
            : FACELESS_DESIGN_TOKENS.colors.shadowSoft;

          return (
            <div
              key={step.stepNumber}
              style={{
                backgroundColor: FACELESS_DESIGN_TOKENS.colors.surfaceWhite,
                borderRadius: '20px',
                border: borderColor,
                boxShadow: shadow,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '380px',
                opacity: stepOpacity,
                transform: `scale(${stepScale})`,
              }}
            >
              <div>
                {/* Step Rung Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: headingFont,
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: isTopGoal
                        ? FACELESS_DESIGN_TOKENS.colors.accentGreenBg
                        : '#F1F5F9',
                      color: isTopGoal
                        ? FACELESS_DESIGN_TOKENS.colors.accentGreen
                        : FACELESS_DESIGN_TOKENS.colors.textSecondary,
                    }}
                  >
                    STEP {step.stepNumber}
                  </span>
                  <span style={{ fontSize: '13px' }}>{isTopGoal ? '🎯' : '✦'}</span>
                </div>

                {/* Milestone Metric with Yellow Marker Tape */}
                <div
                  style={{
                    fontFamily: headingFont,
                    fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.statisticNumber}px`,
                    fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.extraBold,
                    color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
                    lineHeight: 1.1,
                    marginBottom: '14px',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentYellow,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(255, 230, 0, 0.35)',
                    }}
                  >
                    {step.metric}
                  </span>
                </div>

                {/* Step Title */}
                <h3
                  style={{
                    fontFamily: headingFont,
                    fontSize: '20px',
                    fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
                    color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
                    lineHeight: 1.3,
                    margin: '0 0 10px 0',
                  }}
                >
                  {step.label}
                </h3>

                {/* Subtext */}
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: FACELESS_DESIGN_TOKENS.colors.textSecondary,
                    margin: 0,
                  }}
                >
                  {step.subtext}
                </p>
              </div>

              {/* Bottom Progress Footnote */}
              <div
                style={{
                  paddingTop: '16px',
                  borderTop: FACELESS_DESIGN_TOKENS.colors.borderHairline,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isTopGoal ? '#059669' : FACELESS_DESIGN_TOKENS.colors.textMuted,
                }}
              >
                <span>{isTopGoal ? '✓ Core Objective' : `Rung ${step.stepNumber} Complete`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
