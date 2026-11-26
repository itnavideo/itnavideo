import React from 'react';
import {
  Img,
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
  headingFont = 'Lora, "Playfair Display", Georgia, serif',
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

  const customMediaSize = scene.composition?.mediaSlot?.size;
  const mediaWidthPx = customMediaSize?.width && typeof customMediaSize.width === 'number' ? `${customMediaSize.width}px` : undefined;
  const mediaHeightPx = customMediaSize?.height && typeof customMediaSize.height === 'number' ? `${customMediaSize.height}px` : undefined;

  // Layout dictates WHERE (placement: left vs right) and IN WHAT SIZE (width & height); timestamp dictates WHEN
  const isReversed =
    scene.composition?.canvasLayout === 'split_screen_left_media'
      ? false
      : scene.composition?.canvasLayout === 'split_screen_right_media'
        ? true
        : !ds.layout.isVertical && (scene.sceneNumber || 0) % 2 === 1;

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
          maxWidth: ds.layout.isVertical ? '960px' : '1620px',
          display: 'flex',
          flexDirection: ds.layout.isVertical
            ? 'column'
            : isReversed
              ? 'row-reverse'
              : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: ds.layout.isVertical ? '32px' : '64px',
        }}
      >
        {/* Visual Showcase Frame: High-retention cinematic frame */}
        {/* overflow is 'hidden' for image/video (clean crop), 'visible' for SVG icons (no clip) */}
        <div
          style={{
            width: ds.layout.isVertical ? '100%' : (mediaWidthPx || '680px'),
            maxWidth: ds.layout.isVertical ? '580px' : (mediaWidthPx || '680px'),
            height: ds.layout.isVertical ? '400px' : (mediaHeightPx || '480px'),
            borderRadius: '24px',
            overflow: resolvedSrc ? 'hidden' : 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: resolvedSrc ? 0 : '24px',      // 24px padding for SVG so it never clips on edges
            flexShrink: 0,
            backgroundColor: 'transparent',
            boxShadow: resolvedSrc
              ? (ds.surface.isDark
                  ? '0 24px 64px -16px rgba(0, 0, 0, 0.55)'
                  : '0 20px 48px -12px rgba(15, 23, 42, 0.14)')
              : 'none',
            transform: `scale(${interpolate(ds.motion.contentSpring, [0, 1], [1.12, 1])})`,
            opacity: ds.motion.contentSpring,
            transformOrigin: 'center center',
            boxSizing: 'border-box',
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
              <Img
                src={resolvedSrc}
                alt={headline}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  transform: `scale(${imageKenBurns})`,
                }}
              />
            )
          ) : (
            /* SVG wrapper: transparent, borderless, crisp stroke */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible',
              }}
            >
              <VectorDrawingIcon
                keyword={scene.vectorDrawingId || `${headline} ${supportingText}`}
                size={ds.layout.isVertical ? 320 : 420}
                strokeWidth={2.4}
                animated={true}
                frameOverride={ds.localFrame}
                theme={ds.surface.isDark ? 'dark' : 'light'}
              />
            </div>
          )}
        </div>

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
                  text={headline.slice(highlightIndex, highlightIndex + highlightWord.length)}
                  color="#FFE600"
                  variant="marker_box"
                  delayFrames={8}
                  drawDurationFrames={14}
                />
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
