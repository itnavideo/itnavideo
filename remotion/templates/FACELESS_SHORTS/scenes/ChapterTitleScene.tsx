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
      {/* ── 1. Background Media with Ken Burns (Framed in card on light canvas, or full-bleed on dark) ── */}
      {resolvedSrc && (
        isLight ? (
          <div
            style={{
              position: 'absolute',
              top: '210px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '1440px',
              height: '730px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(15, 23, 42, 0.16)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: '#FFFFFF',
              zIndex: 2,
            }}
          >
            <div
              style={{
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
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.45) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        ) : (
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
                background:
                  'linear-gradient(180deg, rgba(2, 6, 23, 0.78) 0%, rgba(2, 6, 23, 0.2) 40%, rgba(2, 6, 23, 0.88) 100%)',
                pointerEvents: 'none',
              }}
            />
          </>
        )
      )}

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
            maxWidth: '1250px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {chNum > 1 && (
            <div
              style={{
                marginBottom: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                borderRadius: '9999px',
                border: isLight ? '1px solid rgba(255, 87, 34, 0.35)' : '1px solid rgba(255, 87, 34, 0.45)',
                backgroundColor: isLight ? '#FFFFFF' : 'rgba(255, 87, 34, 0.14)',
                backdropFilter: 'blur(12px)',
                padding: '8px 26px',
                fontSize: '15px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: isLight ? '#FF5722' : '#FFA000',
                boxShadow: isLight
                  ? '0 4px 16px rgba(255, 87, 34, 0.15)'
                  : '0 0 24px rgba(255, 87, 34, 0.25)',
              }}
            >
              <span>CHAPTER {chNum < 10 ? `0${chNum}` : chNum}</span>
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
                ? '0 2px 10px rgba(255, 255, 255, 0.8)'
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
                fontSize: '24px',
                fontWeight: 600,
                color: isLight && !resolvedSrc ? '#475569' : '#CBD5E1',
                maxWidth: '900px',
                lineHeight: 1.5,
                margin: 0,
                textShadow: isLight && !resolvedSrc ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.9)',
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(7, 11, 20, 0.65)',
                backdropFilter: 'blur(10px)',
                padding: '8px 24px',
                borderRadius: '12px',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'inline-block',
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
