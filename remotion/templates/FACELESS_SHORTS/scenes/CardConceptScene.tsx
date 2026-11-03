import React from 'react';
import {
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { HighlightText } from '../components/HighlightText';
import { getBackgroundPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';
import { SVGFullBleedScene } from './SVGFullBleedScene';

export interface CardConceptSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundTheme?: string;
  sceneFrame?: number;
}

function StarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

export function CardConceptScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Plus Jakarta Sans, sans-serif',
  backgroundTheme,
  sceneFrame,
}: CardConceptSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);

  const palette = getBackgroundPalette(backgroundTheme);

  // SVG-First fallback if media is empty
  if (!resolvedSrc) {
    return (
      <SVGFullBleedScene
        scene={scene}
        headingFont={headingFont}
        bodyFont={bodyFont}
        sceneFrame={sceneFrame}
        palette={palette}
      />
    );
  }

  const isVid = isVideoMedia(activeMediaUrl);

  // Smooth entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0.94, 1.0]);
  const translateY = interpolate(entrance, [0, 1], [30 * s, 0]);
  const imageKenBurns = interpolate(currentFrame, [0, 150], [1.02, 1.10], { extrapolateRight: 'clamp' });

  const headline = scene.heading || '';
  const rawHighlight = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const supportingText = scene.supportingText && scene.supportingText !== scene.narrationSegment?.text
    ? scene.supportingText
    : '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPortrait ? `${160 * s}px ${45 * s}px ${180 * s}px` : `${50 * s}px ${80 * s}px`,
        zIndex: 10,
        opacity: entrance,
        transform: `translateY(${translateY}px) scale(${scale})`,
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Adaptive Layout: Column in 9:16 Portrait, Row in 16:9 Landscape ── */}
      <div
        style={{
          width: '100%',
          maxWidth: isPortrait ? '520px' : '1240px',
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          alignItems: 'center',
          gap: isPortrait ? `${28 * s}px` : `${60 * s}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Visual Frame */}
        <div
          style={{
            width: isPortrait ? '100%' : `${500 * s}px`,
            height: isPortrait ? `${320 * s}px` : `${400 * s}px`,
            borderRadius: `${24 * s}px`,
            overflow: 'hidden',
            border: `${5 * s}px solid #FFFFFF`,
            backgroundColor: palette.isDark ? '#070B14' : '#F1F5F9',
            flexShrink: 0,
            position: 'relative',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            transform: isPortrait ? 'none' : 'rotate(-2deg)',
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
                  transform: `scale(${imageKenBurns})`,
                }}
              />
            )
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FF5722 0%, #FFA000 100%)',
              }}
            >
              <StarIcon size={64 * s} />
            </div>
          )}
        </div>

        {/* Content: Direct Canvas Typography Hierarchy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          {/* Concept Kicker Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: `${8 * s}px`,
              backgroundColor: palette.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 87, 34, 0.10)',
              border: `1px solid ${palette.isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 87, 34, 0.25)'}`,
              borderRadius: `${999 * s}px`,
              padding: `${6 * s}px ${16 * s}px`,
              width: 'fit-content',
              marginBottom: `${16 * s}px`,
            }}
          >
            <StarIcon size={16 * s} />
            <span
              style={{
                fontFamily: headingFont,
                fontSize: `${13 * s}px`,
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: palette.isDark ? palette.accentSecondary : '#EA580C',
              }}
            >
              KEY CONCEPT
            </span>
          </div>

          <h2
            style={{
              fontFamily: headingFont,
              fontSize: isPortrait ? `${38 * s}px` : `${50 * s}px`,
              fontWeight: 900,
              color: palette.textPrimary,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              margin: `0 0 ${14 * s}px 0`,
            }}
          >
            {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
              <HighlightText
                text={headline}
                highlightedWords={[highlightWord]}
                accentColor={palette.accent}
                markerColor={palette.highlightBg}
                fontFamily={headingFont}
                themeId={backgroundTheme}
              />
            ) : (
              headline
            )}
          </h2>

          {supportingText && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: isPortrait ? `${20 * s}px` : `${24 * s}px`,
                fontWeight: 500,
                color: palette.textSecondary,
                lineHeight: 1.45,
                margin: 0,
                maxWidth: '920px',
              }}
            >
              {supportingText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardConceptScene;
