import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ResponsiveTypography } from '../components/ResponsiveTypography';
import { getFadeAnimation } from '../animations/Fade';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';

export interface QuoteSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: any;
}

export function QuoteScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.editorialSerif,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  sceneFrame,
  palette,
}: QuoteSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isDark = palette?.isDark ?? false;
  const textColor = isDark ? '#F8FAFC' : FACELESS_DESIGN_TOKENS.colors.textPrimary;
  const quoteMarkColor = FACELESS_DESIGN_TOKENS.colors.accentCoral;
  const accentColor = FACELESS_DESIGN_TOKENS.colors.accentAmber;

  const anim = getFadeAnimation(currentFrame, fps);
  const quoteText = scene.heading || scene.narrationSegment?.text || '';
  const author = scene.quoteAuthor || undefined;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 140px', // Strict safe area
        zIndex: 10,
        backgroundColor: 'transparent',
        ...anim,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: headingFont,
            fontSize: '96px',
            color: quoteMarkColor,
            lineHeight: 0.6,
            marginBottom: '20px',
            display: 'block',
            filter: 'drop-shadow(0 4px 16px rgba(234, 88, 12, 0.25))',
          }}
        >
          &ldquo;
        </span>

        <ResponsiveTypography
          text={quoteText}
          mode="quote"
          quoteAuthor={author}
          fontFamily={headingFont}
          color={textColor}
          accentColor={accentColor}
          availableWidth={1100}
        />
      </div>
    </div>
  );
}
