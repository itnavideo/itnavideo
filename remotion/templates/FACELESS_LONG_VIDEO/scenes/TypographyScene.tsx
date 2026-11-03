import React from 'react';
import { interpolate } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { resolveFont } from '../../../utils/fonts';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface TypographySceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function TypographyScene({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Inter',
  sceneFrame,
  palette,
}: TypographySceneProps) {
  const resolvedHeadingFont = resolveFont(headingFont);
  const resolvedBodyFont = resolveFont(bodyFont);

  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const headline = String(scene.heading || scene.narrationSegment?.text || 'CORE TAKEAWAY').trim();
  const categoryPill = String(scene.categoryPill || 'KEY STATEMENT').trim();
  const supportingBullet =
    scene.supportingText &&
    scene.supportingText.trim().toLowerCase() !== headline.toLowerCase() &&
    scene.supportingText !== scene.narrationSegment?.text
      ? scene.supportingText.trim()
      : '';

  const rawHighlight =
    scene.highlightedWords && typeof scene.highlightedWords[0] === 'string'
      ? scene.highlightedWords[0].trim()
      : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const highlightIndex = highlightWord
    ? headline.toLowerCase().indexOf(highlightWord.toLowerCase())
    : -1;

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="coral"
      fontFamily={resolvedBodyFont}
    >
      <StudioCard
        tone="coral"
        topAccentBar
        elevated
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '900px' : '1240px',
          padding: ds.layout.isVertical ? '48px 36px' : '64px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '22px' }}>
          <EyebrowPill
            label={categoryPill}
            tone="coral"
            palette={palette}
            progress={ds.motion.eyebrowSpring}
          />
        </div>

        <h1
          style={{
            fontFamily: resolvedHeadingFont,
            fontSize: `${ds.type.displayHero.fontSize}px`,
            fontWeight: ds.type.displayHero.fontWeight,
            letterSpacing: ds.type.displayHero.letterSpacing,
            lineHeight: ds.type.displayHero.lineHeight,
            color: ds.surface.textPrimary,
            margin: supportingBullet ? '0 0 22px 0' : 0,
            maxWidth: '1040px',
            opacity: ds.motion.headerSpring,
            transform: `translateY(${interpolate(ds.motion.headerSpring, [0, 1], [18, 0])}px)`,
          }}
        >
          {highlightIndex !== -1 ? (
            <>
              {headline.slice(0, highlightIndex)}
              <HandwritingHighlight
                color="#FFE600"
                textColor="#0F172A"
                delayFrames={8}
                durationFrames={15}
                type="highlighter"
              >
                {headline.slice(highlightIndex, highlightIndex + highlightWord.length)}
              </HandwritingHighlight>
              {headline.slice(highlightIndex + highlightWord.length)}
            </>
          ) : (
            headline
          )}
        </h1>

        {supportingBullet && (
          <p
            style={{
              fontFamily: resolvedBodyFont,
              fontSize: `${ds.type.bodyLg.fontSize}px`,
              fontWeight: 500,
              color: ds.surface.textSecondary,
              margin: 0,
              maxWidth: '820px',
              lineHeight: ds.type.bodyLg.lineHeight,
            }}
          >
            {supportingBullet}
          </p>
        )}
      </StudioCard>
    </SceneCanvas>
  );
}
