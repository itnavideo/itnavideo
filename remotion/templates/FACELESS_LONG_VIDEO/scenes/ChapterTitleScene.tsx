import React from 'react';
import {
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';

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
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Plus Jakarta Sans, sans-serif',
  chapterNumber,
  sceneFrame,
  palette,
}: ChapterTitleSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  // Dramatic Riser Spring Entrance (frame-relative)
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 13, mass: 0.9, stiffness: 140 },
  });

  const scale = interpolate(entrance, [0, 1], [0.88, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const kenBurnsScale = interpolate(currentFrame, [0, 150], [1.02, 1.12], { extrapolateRight: 'clamp' });

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  const rawBadge = chapterNumber ?? scene.numberBadge ?? 1;
  const chNum = typeof rawBadge === 'number' ? rawBadge : (parseInt(String(rawBadge), 10) || 1);
  const headline = String(scene.heading || 'CORE CHAPTER TAKEAWAY').trim();
  const rawHighlight = (scene.highlightedWords && typeof scene.highlightedWords[0] === 'string')
    ? scene.highlightedWords[0].trim()
    : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const supportingText = scene.supportingText && scene.supportingText !== headline ? scene.supportingText : '';
  const isLight = palette?.isDark === false;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {/* ── 1. Background Media with Ken Burns (Cinematic Full Bleed) ── */}
      {resolvedSrc ? (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transform: `scale(${kenBurnsScale})`,
              transformOrigin: 'center center',
            }}
          >
            {isVid ? (
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
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: isLight
                ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.4) 40%, rgba(255, 255, 255, 0.92) 100%)'
                : 'linear-gradient(180deg, rgba(2, 6, 23, 0.82) 0%, rgba(2, 6, 23, 0.3) 40%, rgba(2, 6, 23, 0.92) 100%)',
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}

      {/* ── 2. Chapter Content (Broadcast Typography) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 120px',
          zIndex: 10,
          opacity,
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!resolvedSrc && (
            <div style={{ marginBottom: '32px' }}>
              <VectorDrawingIcon
                keyword={headline}
                size={340}
                strokeWidth={3.5}
                animated={true}
                theme={isLight ? 'light' : 'dark'}
              />
            </div>
          )}

          {chNum > 1 && (
            <div
              style={{
                marginBottom: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  width: '28px',
                  height: '3px',
                  backgroundColor: '#FF5722',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  fontFamily: headingFont,
                  fontSize: '15px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: isLight ? '#FF5722' : '#FFA000',
                }}
              >
                CHAPTER {chNum < 10 ? `0${chNum}` : chNum}
              </span>
              <span
                style={{
                  width: '28px',
                  height: '3px',
                  backgroundColor: '#FF5722',
                  borderRadius: '2px',
                }}
              />
            </div>
          )}

          <h1
            style={{
              fontFamily: headingFont,
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: isLight && !resolvedSrc ? '#0F172A' : '#FFFFFF',
              letterSpacing: '-0.025em',
              maxWidth: '1200px',
              marginBottom: supportingText ? '20px' : '0',
              textShadow: isLight && !resolvedSrc
                ? 'none'
                : '0 4px 30px rgba(0, 0, 0, 0.98), 0 2px 12px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.8)',
            }}
          >
            {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
              <>
                {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
                <HandwritingHighlight
                  text={highlightWord.toUpperCase()}
                  variant="underline"
                  color="#FF5722"
                  delayFrames={8}
                  drawDurationFrames={20}
                />
                {headline.slice(
                  headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
                )}
              </>
            ) : (
              headline
            )}
          </h1>

          {supportingText && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: '26px',
                fontWeight: 500,
                color: isLight && !resolvedSrc ? '#475569' : '#CBD5E1',
                maxWidth: '960px',
                lineHeight: 1.5,
                margin: '16px 0 0 0',
                textShadow: isLight && !resolvedSrc ? 'none' : '0 2px 14px rgba(0, 0, 0, 0.9)',
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

export default ChapterTitleScene;
