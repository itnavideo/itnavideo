import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface ChapterTitleSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  chapterNumber?: number;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function ChapterTitleScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Plus Jakarta Sans, Inter, sans-serif',
  chapterNumber,
  sceneFrame,
  palette,
}: ChapterTitleSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const rawBadge = chapterNumber ?? scene.numberBadge ?? 1;
  const chNum = typeof rawBadge === 'number' ? rawBadge : parseInt(String(rawBadge), 10) || 1;
  const headline = String(scene.heading || 'CORE CHAPTER TAKEAWAY').trim();
  const categoryPill = scene.categoryPill || `CHAPTER ${String(chNum).padStart(2, '0')}`;
  const supportingText =
    scene.supportingText && scene.supportingText.trim().toLowerCase() !== headline.toLowerCase()
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
      fontFamily={bodyFont}
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
          padding: ds.layout.isVertical ? '52px 36px' : '68px 80px',
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
            fontFamily: headingFont,
            fontSize: `${ds.type.displayHero.fontSize}px`,
            fontWeight: ds.type.displayHero.fontWeight,
            letterSpacing: ds.type.displayHero.letterSpacing,
            lineHeight: ds.type.displayHero.lineHeight,
            color: ds.surface.textPrimary,
            margin: supportingText ? '0 0 20px 0' : 0,
            maxWidth: '1020px',
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

        {supportingText && (
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: `${ds.type.bodyLg.fontSize}px`,
              fontWeight: 500,
              lineHeight: ds.type.bodyLg.lineHeight,
              color: ds.surface.textSecondary,
              margin: 0,
              maxWidth: '780px',
            }}
          >
            {supportingText}
          </p>
        )}
      </StudioCard>
    </SceneCanvas>
  );
}
