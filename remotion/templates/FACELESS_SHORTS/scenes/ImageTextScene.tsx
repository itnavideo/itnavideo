import React from 'react';
import { Img, Loop, OffthreadVideo, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';

export interface ImageTextSceneProps {
  scene: SceneBlueprintItem;
  brollUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function ImageTextScene({
  scene,
  brollUrl,
  headingFont = 'Montserrat, Inter, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: ImageTextSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? true;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#475569';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 0, 0, 0.08)';

  // Entrances
  const cardSpring = spring({ frame: currentFrame, fps, config: { damping: 14, stiffness: 100 } });
  const kenBurnsScale = interpolate(currentFrame, [0, 150], [1.0, 1.08], { extrapolateRight: 'clamp' });

  const activeMedia = brollUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMedia);
  const isVid = isVideoMedia(activeMedia);

  const headline = scene.heading || 'KEY CONCEPT INSIGHT';
  const rawHighlight = scene.highlightedWords?.[0] || '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const supporting = scene.supportingText && scene.supportingText !== scene.narrationSegment?.text
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
        padding: isPortrait ? `${160 * s}px ${45 * s}px ${180 * s}px` : `${60 * s}px ${80 * s}px`,
        zIndex: 10,
        backgroundColor: bg,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: bodyFont,
        opacity: cardSpring,
        transform: `translateY(${interpolate(cardSpring, [0, 1], [30 * s, 0])}px)`,
      }}
    >
      <div
        style={{
          maxWidth: isPortrait ? '520px' : '1100px',
          width: '100%',
          borderRadius: `${28 * s}px`,
          border: `2px solid ${cardBorder}`,
          backgroundColor: cardBg,
          padding: isPortrait ? `${24 * s}px` : `${36 * s}px ${44 * s}px`,
          boxShadow: isDark
            ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.15)'
            : '0 15px 40px rgba(0, 0, 0, 0.08), 0 0 25px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isPortrait ? `${20 * s}px` : `${36 * s}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Text Container */}
        <div style={{ flex: 1, width: '100%' }}>
          <div
            style={{
              display: 'inline-block',
              padding: `${4 * s}px ${12 * s}px`,
              borderRadius: `${999 * s}px`,
              backgroundColor: 'rgba(56, 189, 248, 0.14)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              fontSize: `${12 * s}px`,
              fontWeight: 800,
              color: '#0284C7',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: `${12 * s}px`,
            }}
          >
            VISUAL BREAKDOWN
          </div>

          <h2
            style={{
              fontFamily: headingFont,
              fontSize: isPortrait ? `${32 * s}px` : `${38 * s}px`,
              fontWeight: 900,
              color: textPrimary,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              margin: `0 0 ${12 * s}px 0`,
            }}
          >
            {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
              <>
                {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
                <HandwritingHighlight
                  text={highlightWord.toUpperCase()}
                  variant="underline"
                  color="#0284C7"
                  delayFrames={8}
                />
                {headline.slice(
                  headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
                )}
              </>
            ) : (
              headline
            )}
          </h2>

          {supporting && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: isPortrait ? `${18 * s}px` : `${20 * s}px`,
                color: textSecondary,
                lineHeight: 1.45,
                margin: 0,
                fontWeight: 500,
              }}
            >
              {supporting}
            </p>
          )}
        </div>

        {/* Media Frame */}
        <div
          style={{
            width: isPortrait ? '100%' : `${420 * s}px`,
            height: isPortrait ? `${240 * s}px` : `${280 * s}px`,
            borderRadius: `${20 * s}px`,
            overflow: 'hidden',
            border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.6)' : '#F1F5F9',
            position: 'relative',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
            flexShrink: 0,
          }}
        >
          {resolvedSrc ? (
            isVid ? (
              <Loop durationInFrames={120}>
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
                  transform: `scale(${kenBurnsScale})`,
                }}
              />
            )
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(14, 165, 233, 0.1) 100%)',
                padding: `${24 * s}px`,
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              <svg width={36 * s} height={36 * s} viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: `${8 * s}px` }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ fontSize: `${16 * s}px`, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0284C7' }}>
                Key Visual Focus
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageTextScene;
