import React from 'react';
import {
  Loop,
  OffthreadVideo,
  interpolate,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { getBackgroundPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';

export interface CardConceptSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundTheme?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

export function CardConceptScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  backgroundTheme,
  sceneFrame,
  palette: explicitPalette,
}: CardConceptSceneProps) {
  const resolvedPalette = React.useMemo(
    () => explicitPalette || getBackgroundPalette(backgroundTheme),
    [explicitPalette, backgroundTheme]
  );

  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette: resolvedPalette,
  });

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  const headline = String(scene.heading || 'CORE PRINCIPLE').trim();
  const categoryPill = String(scene.categoryPill || 'CONCEPT BREAKDOWN').trim();
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

  const imageKenBurns = interpolate(ds.localFrame, [0, ds.totalFrames], [1.02, 1.12], {
    extrapolateRight: 'clamp',
  });

  const isReversed = !ds.layout.isVertical && (scene.sceneNumber || 0) % 2 === 1;

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={resolvedPalette}
      accentTone="indigo"
      fontFamily={bodyFont}
    >
      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1480px',
          display: 'flex',
          flexDirection: ds.layout.isVertical
            ? 'column'
            : isReversed
            ? 'row-reverse'
            : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: ds.layout.isVertical ? '28px' : '56px',
        }}
      >
        {/* Visual Showcase Frame */}
        <StudioCard
          tone="indigo"
          elevated
          palette={resolvedPalette}
          progress={ds.motion.contentSpring}
          style={{
            width: ds.layout.isVertical ? '100%' : '540px',
            maxWidth: ds.layout.isVertical ? '520px' : '540px',
            height: ds.layout.isVertical ? '360px' : '420px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: ds.surface.cardBgMuted,
          }}
        >
          {resolvedSrc ? (
            isVid ? (
              <Loop durationInFrames={180}>
                <OffthreadVideo
                  src={resolvedSrc}
                  volume={0}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Loop>
            ) : (
              <img
                src={resolvedSrc}
                alt={headline}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${imageKenBurns})`,
                }}
              />
            )
          ) : (
            <VectorDrawingIcon
              keyword={scene.vectorDrawingId || `${headline} ${supportingText}`}
              size={ds.layout.isVertical ? 300 : 350}
              strokeWidth={4}
              animated={true}
              frameOverride={ds.localFrame}
              theme={ds.surface.isDark ? 'dark' : 'light'}
            />
          )}
        </StudioCard>

        {/* Editorial Typography Column */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
            textAlign: ds.layout.isVertical ? 'center' : 'left',
            opacity: ds.motion.headerSpring,
            transform: `translateY(${interpolate(ds.motion.headerSpring, [0, 1], [22, 0])}px)`,
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <EyebrowPill
              label={categoryPill}
              tone="indigo"
              palette={resolvedPalette}
              progress={ds.motion.eyebrowSpring}
            />
          </div>

          <h2
            style={{
              fontFamily: headingFont,
              fontSize: `${ds.type.sceneTitle.fontSize}px`,
              fontWeight: ds.type.sceneTitle.fontWeight,
              letterSpacing: ds.type.sceneTitle.letterSpacing,
              lineHeight: ds.type.sceneTitle.lineHeight,
              color: ds.surface.textPrimary,
              margin: supportingText ? '0 0 18px 0' : 0,
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
          </h2>

          {supportingText && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: `${ds.type.bodyLg.fontSize}px`,
                fontWeight: 500,
                lineHeight: ds.type.bodyLg.lineHeight,
                color: ds.surface.textSecondary,
                margin: 0,
                maxWidth: '720px',
              }}
            >
              {supportingText}
            </p>
          )}
        </div>
      </div>
    </SceneCanvas>
  );
}
