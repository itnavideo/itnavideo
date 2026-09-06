import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ResponsiveTypography } from '../components/ResponsiveTypography';
import { getFadeAnimation } from '../animations/Fade';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface QuoteSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function QuoteScene({
  scene,
  headingFont = 'Playfair Display, serif',
  bodyFont = 'Inter, sans-serif',
}: QuoteSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = getFadeAnimation(frame, fps);
  const quoteText = scene.heading || scene.narrationSegment?.text || 'Key Quote';
  const author = scene.quoteAuthor || 'INDUSTRY EXPERT';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 140px', // Strict safe area (140px X, 100px Y)
        zIndex: 10,
        ...anim,
      }}
    >
      <div
        style={{
          maxWidth: '1100px', // Controlled width (never 1800px)
          width: '100%',
          borderRadius: '32px',
          border: '1px solid rgba(129, 140, 248, 0.35)',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          padding: '48px 56px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 50px rgba(129, 140, 248, 0.2)',
          backdropFilter: 'blur(24px)',
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
            fontSize: '84px',
            color: '#818CF8',
            lineHeight: 0.6,
            marginBottom: '16px',
            display: 'block',
          }}
        >
          &ldquo;
        </span>

        <ResponsiveTypography
          text={quoteText}
          mode="quote"
          quoteAuthor={author}
          fontFamily={headingFont}
          color="#FFFFFF"
          accentColor="#818CF8"
          availableWidth={1000}
        />
      </div>
    </div>
  );
}
