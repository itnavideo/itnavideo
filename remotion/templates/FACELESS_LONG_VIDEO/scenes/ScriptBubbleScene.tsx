import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';

export interface ScriptBubbleSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
}

export function ScriptBubbleScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  sceneFrame,
}: ScriptBubbleSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  // Haptic Pop-in Entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.85, stiffness: 150 },
  });

  const scale = interpolate(entrance, [0, 1], [0.92, 1.0]);
  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const sceneTitle = scene.heading || 'Direct Outreach Script Template';
  const scriptBody =
    scene.supportingText ||
    scene.narrationSegment?.text ||
    "Hey! I am doing a challenge to make my first dollar online. I set up this Gumroad checkout for $1 — would you be open to buying it? You don't get anything, it's literally just to test if my payment processor works haha!";

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
        padding: '60px 120px',
      }}
    >
      {/* Top Header Pill */}
      <div
        style={{
          marginBottom: '32px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '9999px',
          border: '1px solid rgba(2, 132, 199, 0.3)',
          backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentBlueBg,
          padding: '6px 20px',
          fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.annotationText}px`,
          fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: FACELESS_DESIGN_TOKENS.colors.accentBlue,
          opacity,
        }}
      >
        <span>💬 OUTREACH PLAYBOOK</span>
        <span>•</span>
        <span style={{ color: FACELESS_DESIGN_TOKENS.colors.textPrimary }}>{sceneTitle}</span>
      </div>

      {/* Message Chat Bubble Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: FACELESS_DESIGN_TOKENS.colors.surfaceWhite,
          borderRadius: '28px',
          border: FACELESS_DESIGN_TOKENS.colors.borderHairline,
          boxShadow: FACELESS_DESIGN_TOKENS.colors.shadowElevated,
          overflow: 'hidden',
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Chat Header Bar */}
        <div
          style={{
            padding: '16px 28px',
            backgroundColor: '#F8FAFC',
            borderBottom: FACELESS_DESIGN_TOKENS.colors.borderHairline,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentCoralBg,
                color: FACELESS_DESIGN_TOKENS.colors.accentCoral,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
              }}
            >
              ✦
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: headingFont,
                  fontSize: '15px',
                  fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
                  color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
                }}
              >
                Warm Contact / Friend
              </span>
              <span style={{ fontSize: '12px', color: FACELESS_DESIGN_TOKENS.colors.textMuted }}>
                iMessage • Delivered
              </span>
            </div>
          </div>

          <span
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentGreenBg,
              color: FACELESS_DESIGN_TOKENS.colors.accentGreen,
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Verified Script
          </span>
        </div>

        {/* Message Bubble Body */}
        <div style={{ padding: '36px 40px' }}>
          <div
            style={{
              backgroundColor: '#F1F5F9',
              borderRadius: '20px 20px 20px 4px',
              padding: '24px 28px',
              fontFamily: bodyFont,
              fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.bodyText}px`,
              lineHeight: 1.55,
              color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            }}
          >
            {scriptBody}
          </div>
        </div>

        {/* Footer Guidance */}
        <div
          style={{
            padding: '16px 40px',
            borderTop: FACELESS_DESIGN_TOKENS.colors.borderHairline,
            backgroundColor: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: FACELESS_DESIGN_TOKENS.colors.textSecondary,
          }}
        >
          <span>🎯 Goal: 0% friction, 100% psychological validation</span>
          <span style={{ fontWeight: 700, color: FACELESS_DESIGN_TOKENS.colors.accentCoral }}>
            Copy Word-for-Word
          </span>
        </div>
      </div>
    </div>
  );
}
