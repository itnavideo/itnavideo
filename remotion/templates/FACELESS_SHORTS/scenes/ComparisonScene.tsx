import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DualPhoneShowcase } from '../components/DualPhoneShowcase';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';

export interface ComparisonSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function ComparisonScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
}: ComparisonSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered entrances
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const rightSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 14, stiffness: 90 } });
  const vsSpring = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 10, stiffness: 180 } });

  const heading = scene.heading || 'PARADIGM SHIFT & COMPARISON';
  const leftItem = scene.comparisonItems?.left || scene.heading || 'Traditional Search & SEO';
  const rightItem = scene.comparisonItems?.right || scene.supportingText || 'AI Agent Recommendation';

  const contextString = `${heading} ${leftItem} ${rightItem} ${scene.narrationSegment?.text || ''}`;
  const isDualDevice =
    /phone|mobile|app|store|sales|revenue|digital product|earnings|\$96|\$356|planner|shop/i.test(
      contextString
    );

  const leftX = interpolate(leftSpring, [0, 1], [-80, 0]);
  const rightX = interpolate(rightSpring, [0, 1], [80, 0]);
  const vsScale = interpolate(vsSpring, [0, 1], [0.3, 1.0]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        zIndex: 15,
        backgroundColor: FACELESS_DESIGN_TOKENS.colors.canvasWhite,
        fontFamily: bodyFont,
      }}
    >
      {/* Eyebrow + Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '44px',
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentCoralBg,
            border: '1px solid rgba(234, 88, 12, 0.3)',
            color: FACELESS_DESIGN_TOKENS.colors.accentCoral,
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '12px',
          }}
        >
          <span>⚖️</span>
          <span>PARADIGM SHIFT</span>
        </div>

        <h2
          style={{
            fontFamily: headingFont,
            fontSize: '44px',
            fontWeight: 900,
            color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {heading}
        </h2>
      </div>

      {isDualDevice ? (
        <DualPhoneShowcase
          leftRevenue="$96/day"
          rightRevenue="$356/day"
          leftSubtitle="Manual Workflow"
          rightSubtitle="Automated AI Agent"
        />
      ) : (
        /* Standard Side-by-Side Comparison Grid */
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            width: '100%',
            maxWidth: '1000px',
          }}
        >
          {/* LEFT CARD: The Old / Passive Playbook */}
          <div
            style={{
              flex: 1,
              borderRadius: '24px',
              border: '1.5px solid rgba(239, 68, 68, 0.35)',
              backgroundColor: FACELESS_DESIGN_TOKENS.colors.surfaceWhite,
              padding: '40px 36px',
              boxShadow: FACELESS_DESIGN_TOKENS.colors.shadowElevated,
              opacity: leftSpring,
              transform: `translateX(${leftX}px)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentRedBg,
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: FACELESS_DESIGN_TOKENS.colors.accentRed,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  ✕ THE OLD WAY
                </span>

                <span style={{ fontSize: '12px', color: FACELESS_DESIGN_TOKENS.colors.textMuted, fontWeight: 600 }}>Legacy Model</span>
              </div>

              <div
                style={{
                  fontFamily: headingFont,
                  fontSize: '28px',
                  fontWeight: 800,
                  color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}
              >
                {leftItem}
              </div>
            </div>

            <div
              style={{
                paddingTop: '16px',
                borderTop: FACELESS_DESIGN_TOKENS.colors.borderHairline,
                fontSize: '14px',
                color: FACELESS_DESIGN_TOKENS.colors.accentRed,
                fontWeight: 700,
              }}
            >
              📉 Low retention & high cognitive friction
            </div>
          </div>

          {/* CENTER BADGE: Flame Orange Energy VS Node */}
          <div
            style={{
              zIndex: 10,
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF5722 0%, #FFA000 100%)',
              border: '3px solid #FFFFFF',
              boxShadow: '0 8px 24px rgba(255, 87, 34, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: headingFont,
              fontSize: '19px',
              fontWeight: 900,
              letterSpacing: '0.05em',
              transform: `scale(${vsScale})`,
              flexShrink: 0,
            }}
          >
            VS
          </div>

          {/* RIGHT CARD: The Active AI Advantage */}
          <div
            style={{
              flex: 1,
              borderRadius: '24px',
              border: '1.5px solid rgba(16, 185, 129, 0.45)',
              backgroundColor: FACELESS_DESIGN_TOKENS.colors.surfaceWhite,
              padding: '40px 36px',
              boxShadow: FACELESS_DESIGN_TOKENS.colors.shadowElevated,
              opacity: rightSpring,
              transform: `translateX(${rightX}px)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentGreenBg,
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: FACELESS_DESIGN_TOKENS.colors.accentGreen,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  ✓ THE AI ADVANTAGE
                </span>

                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>Compound Mastery</span>
              </div>

              <div
                style={{
                  fontFamily: headingFont,
                  fontSize: '28px',
                  fontWeight: 800,
                  color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}
              >
                {rightItem}
              </div>
            </div>

            <div
              style={{
                paddingTop: '16px',
                borderTop: FACELESS_DESIGN_TOKENS.colors.borderHairline,
                fontSize: '14px',
                color: '#059669',
                fontWeight: 700,
              }}
            >
              🚀 Compounding retention & effortless recall
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
