import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';

export interface PromptWindowSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
}

export function PromptWindowScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.codeMono,
  sceneFrame,
}: PromptWindowSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  // Snappy Riser Spring Entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: FACELESS_DESIGN_TOKENS.motion.springConfig,
  });

  const scale = interpolate(entrance, [0, 1], [0.94, 1.0]);
  const translateY = interpolate(entrance, [0, 1], [32, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle Ambient Drift
  const drift = interpolate(currentFrame, [0, 300], [1.0, 1.018], { extrapolateRight: 'clamp' });

  // Eyebrow / Prompt Title
  const windowTitle = scene.heading || 'AI Prompt Engineering System';
  const rawPrompt =
    scene.supportingText ||
    scene.narrationSegment?.text ||
    'Act as a personal learning mentor. Deconstruct [TOPIC] into core mental models, highlight the counter-intuitive traps, and generate 3 active recall challenges.';

  // Highlight bracketed variables like [TOPIC] or key terms
  const parts = rawPrompt.split(/(\[[^\]]+\])/g);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: FACELESS_DESIGN_TOKENS.colors.canvasWhite,
        padding: `${FACELESS_DESIGN_TOKENS.canvas.safeMarginY}px ${FACELESS_DESIGN_TOKENS.canvas.safeMarginX}px`,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          backgroundColor: FACELESS_DESIGN_TOKENS.colors.surfaceWhite,
          borderRadius: '24px',
          border: FACELESS_DESIGN_TOKENS.colors.borderHairline,
          boxShadow: FACELESS_DESIGN_TOKENS.colors.shadowElevated,
          overflow: 'hidden',
          opacity,
          transform: `translateY(${translateY}px) scale(${scale * drift})`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* macOS Window Top Bar */}
        <div
          style={{
            height: '56px',
            backgroundColor: '#F8FAFC',
            borderBottom: FACELESS_DESIGN_TOKENS.colors.borderHairline,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          {/* Traffic Control Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: FACELESS_DESIGN_TOKENS.colors.windowDotClose,
              }}
            />
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: FACELESS_DESIGN_TOKENS.colors.windowDotMinimize,
              }}
            />
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: FACELESS_DESIGN_TOKENS.colors.windowDotExpand,
              }}
            />
          </div>

          {/* Window Header Title */}
          <div
            style={{
              fontFamily: headingFont,
              fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.annotationText}px`,
              fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.semiBold,
              color: FACELESS_DESIGN_TOKENS.colors.textSecondary,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: FACELESS_DESIGN_TOKENS.colors.accentCoral }}>✦</span>
            <span>{windowTitle}</span>
          </div>

          {/* Copy Prompt Pill */}
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentCoralBg,
              color: FACELESS_DESIGN_TOKENS.colors.accentCoral,
              fontFamily: headingFont,
              fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.badgeText}px`,
              fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Copy Prompt
          </div>
        </div>

        {/* Prompt Content Body */}
        <div
          style={{
            padding: '44px 48px',
            fontFamily: bodyFont,
            fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.promptBodyText}px`,
            lineHeight: 1.55,
            color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
            letterSpacing: '-0.01em',
            wordBreak: 'break-word',
          }}
        >
          {parts.map((segment, idx) => {
            const isVariable = segment.startsWith('[') && segment.endsWith(']');
            if (isVariable) {
              return (
                <span
                  key={idx}
                  style={{
                    backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentYellow,
                    color: FACELESS_DESIGN_TOKENS.colors.textPrimary,
                    fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    margin: '0 3px',
                    boxShadow: '0 2px 8px rgba(255, 230, 0, 0.4)',
                  }}
                >
                  {segment}
                </span>
              );
            }
            return <span key={idx}>{segment}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
