import React from 'react';
import {
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import { HighlightText } from '../components/HighlightText';
import { getBackgroundPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface CardConceptSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundTheme?: string;
  sceneFrame?: number;
}

import { safeResolveMediaSrc, isVideoMedia, isValidMediaUrl } from '../../../utils/safeMedia';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';

function getContextualEmoji(text: string): React.ReactNode {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
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
  const { fps } = useVideoConfig();

  // Enforce Scene-Local Frame Law
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;
  const sceneDurationFrames = Math.max(30, Math.round((scene.duration || 5) * fps));

  const palette = React.useMemo(() => getBackgroundPalette(backgroundTheme), [backgroundTheme]);

  // Smooth Zoom-in & Slide-in Entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0.94, 1.0]);
  const translateY = interpolate(entrance, [0, 1], [35, 0]);

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  const headline = scene.heading || 'CORE PRINCIPLE';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const supportingText = scene.supportingText && scene.supportingText.toLowerCase() !== headline.toLowerCase() ? scene.supportingText : '';
  const emoji = getContextualEmoji(`${headline} ${supportingText}`);

  const imageKenBurns = interpolate(currentFrame, [0, sceneDurationFrames], [1.02, 1.14], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 120px',
        zIndex: 10,
        opacity: entrance,
        transform: `translateY(${translateY}px) scale(${scale})`,
        backgroundColor: 'transparent',
      }}
    >
      {/* ── Editorial Cinema Split (No Boxed Web Container) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '1600px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '80px',
        }}
      >
        {/* Left Visual: 3D Tilted Sticker Cutout with Cinema Shadow */}
        <div
          style={{
            width: '540px',
            height: '420px',
            borderRadius: '28px',
            overflow: 'hidden',
            border: '6px solid #FFFFFF',
            backgroundColor: palette.isDark ? '#070B14' : '#F1F5F9',
            flexShrink: 0,
            position: 'relative',
            boxShadow: '0 35px 80px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            transform: 'rotate(-2.5deg)',
          }}
        >
          {resolvedSrc ? (
            isVid ? (
              <Loop durationInFrames={180}>
                <OffthreadVideo
                  src={resolvedSrc}
                  volume={0}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
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
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: palette.isDark
                  ? 'radial-gradient(circle, #1E293B 0%, #0F172A 100%)'
                  : 'radial-gradient(circle, #F8FAFC 0%, #E2E8F0 100%)',
              }}
            >
              <VectorDrawingIcon
                keyword={`${headline} ${supportingText}`}
                size={380}
                strokeWidth={4.5}
                animated={true}
                theme={palette.isDark ? 'dark' : 'light'}
              />
            </div>
          )}
        </div>

        {/* Right Content: Direct Canvas Typography Hierarchy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Concept Kicker Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: palette.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 87, 34, 0.10)',
              border: `1px solid ${palette.isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 87, 34, 0.25)'}`,
              borderRadius: '9999px',
              padding: '8px 20px',
              width: 'fit-content',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '22px' }}>{emoji}</span>
            <span
              style={{
                fontFamily: headingFont,
                fontSize: '13px',
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
              fontSize: '66px',
              fontWeight: 900,
              color: palette.textPrimary,
              letterSpacing: '-0.025em',
              lineHeight: 1.18,
              marginBottom: '20px',
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
                fontSize: '30px',
                fontWeight: 600,
                color: palette.textSecondary,
                lineHeight: 1.5,
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
