import React from 'react';
import { interpolate } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface HookSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function HookScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: HookSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const headline = String(scene.heading || 'CORE INSIGHT').trim();
  const categoryPill = String(scene.categoryPill || 'KEY INSIGHT').trim();
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

  const visualKeyword =
    scene.vectorDrawingId || `${headline} ${supportingText} ${scene.narrationSegment?.text || ''}`;

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="coral"
      fontFamily={bodyFont}
    >
      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1480px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: ds.layout.isVertical ? '32px' : '56px',
        }}
      >
        {/* Left / Top Editorial Hook Typography Stage */}
        <div
          style={{
            flex: 1.15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
            textAlign: ds.layout.isVertical ? 'center' : 'left',
            opacity: ds.motion.headerSpring,
            transform: `translateY(${interpolate(ds.motion.headerSpring, [0, 1], [24, 0])}px)`,
          }}
        >
          <div style={{ marginBottom: '18px' }}>
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
            }}
          >
            {highlightIndex !== -1 ? (
              <>
                {headline.slice(0, highlightIndex)}
                <HandwritingHighlight
                  color="#FFE600"
                  textColor="#0F172A"
                  delayFrames={6}
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
                fontWeight: 600,
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

        {/* Right / Bottom Dedicated Vector Illustration Showcase Card */}
        <StudioCard
          tone="coral"
          elevated
          palette={palette}
          progress={ds.motion.contentSpring}
          style={{
            flex: 0.85,
            width: ds.layout.isVertical ? '100%' : 'auto',
            maxWidth: ds.layout.isVertical ? '520px' : '560px',
            minHeight: ds.layout.isVertical ? '360px' : '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px',
          }}
        >
          <VectorDrawingIcon
            keyword={visualKeyword}
            size={ds.layout.isVertical ? 320 : 380}
            strokeWidth={4}
            animated={true}
            frameOverride={ds.localFrame}
            theme={ds.surface.isDark ? 'dark' : 'light'}
          />
        </StudioCard>
      </div>
    </SceneCanvas>
  );
}
