import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';

export interface ConclusionSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function ConclusionScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: ConclusionSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const headline = String(scene.heading || 'FINAL TAKEAWAY').trim();
  const categoryPill = String(scene.categoryPill || 'FINAL TAKEAWAY').trim();
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
      accentTone="emerald"
      fontFamily={bodyFont}
    >
      <StudioCard
        tone="emerald"
        topAccentBar
        elevated
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '900px' : '1180px',
          padding: ds.layout.isVertical ? '44px 36px' : '56px 64px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: ds.layout.isVertical ? '28px' : '48px',
        }}
      >
        <div
          style={{
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
            textAlign: ds.layout.isVertical ? 'center' : 'left',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <EyebrowPill
              label={categoryPill}
              tone="emerald"
              palette={palette}
              progress={ds.motion.eyebrowSpring}
            />
          </div>

          <h1
            style={{
              fontFamily: headingFont,
              fontSize: `${ds.type.sceneTitle.fontSize}px`,
              fontWeight: ds.type.sceneTitle.fontWeight,
              letterSpacing: ds.type.sceneTitle.letterSpacing,
              lineHeight: ds.type.sceneTitle.lineHeight,
              color: ds.surface.textPrimary,
              margin: supportingText ? '0 0 16px 0' : 0,
            }}
          >
            {highlightIndex !== -1 ? (
              <>
                {headline.slice(0, highlightIndex)}
                <HandwritingHighlight
                  color="#FFE600"
                  textColor="#0F172A"
                  delayFrames={8}
                  durationFrames={14}
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
                maxWidth: '680px',
              }}
            >
              {supportingText}
            </p>
          )}
        </div>

        <div
          style={{
            width: ds.layout.isVertical ? '220px' : '260px',
            height: ds.layout.isVertical ? '220px' : '260px',
            borderRadius: '24px',
            backgroundColor: ds.surface.cardBgMuted,
            border: ds.surface.borderSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <VectorDrawingIcon
            keyword={scene.vectorDrawingId || 'character_celebration'}
            size={ds.layout.isVertical ? 180 : 210}
            strokeWidth={4}
            animated={true}
            frameOverride={ds.localFrame}
            theme={ds.surface.isDark ? 'dark' : 'light'}
          />
        </div>
      </StudioCard>
    </SceneCanvas>
  );
}
