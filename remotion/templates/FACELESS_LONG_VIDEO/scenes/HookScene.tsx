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

export interface HookSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

function getContextualEmoji(text: string): React.ReactNode {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

export function HookScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: HookSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  // High-Energy Opening Spring Scale
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 13, mass: 0.9, stiffness: 180 },
  });

  // Continuous Dynamic Ken Burns Zoom (1.0 -> 1.15) for high hook retention
  const kenBurnsScale = interpolate(currentFrame, [0, 180], [1.0, 1.15], { extrapolateRight: 'clamp' });
  const textOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const textTranslateY = interpolate(entrance, [0, 1], [30, 0]);

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  const headline = String(scene.heading || 'EXCLUSIVE INSIGHT').trim();
  const rawHighlight = (scene.highlightedWords && typeof scene.highlightedWords[0] === 'string')
    ? scene.highlightedWords[0].trim()
    : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const emoji = getContextualEmoji(`${headline} ${scene.supportingText || ''}`);
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
      {/* ── 1. Full-Bleed Cinematic Background & Media Canvas ── */}
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: isLight
                ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)'
                : 'radial-gradient(ellipse at 50% 45%, #1E1B4B 0%, #0F172A 55%, #020617 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ transform: 'scale(1.15)', marginTop: '40px' }}>
              <VectorDrawingIcon
                keyword={`${headline} ${scene.supportingText || ''}`}
                size={360}
                strokeWidth={3.8}
                animated={true}
                frameOverride={currentFrame}
                theme={isLight ? 'light' : 'dark'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 45%, rgba(255, 255, 255, 0.90) 100%)'
            : 'linear-gradient(180deg, rgba(2, 6, 23, 0.82) 0%, rgba(2, 6, 23, 0.2) 45%, rgba(2, 6, 23, 0.90) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 2. High-Impact Broadcast Hook Headline ── */}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          right: 0,
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 80px',
          pointerEvents: 'none',
          zIndex: 15,
          gap: '16px',
        }}
      >
        {/* Subtle Hook Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
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
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: isLight ? '#FF5722' : '#FFA000',
            }}
          >
            KEY TAKEAWAY
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

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: isLight ? '54px' : '60px',
            fontWeight: 900,
            color: isLight ? '#0F172A' : '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: 0,
            maxWidth: '1300px',
            textAlign: 'center',
            textShadow: isLight
              ? '0 2px 12px rgba(255, 255, 255, 0.9), 0 1px 4px rgba(15, 23, 42, 0.08)'
              : '0 4px 30px rgba(0, 0, 0, 0.98), 0 2px 14px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.85)',
          }}
        >
          {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
            <>
              {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
              <HandwritingHighlight
                text={highlightWord.toUpperCase()}
                variant="underline"
                color="#FF5722"
                delayFrames={6}
                drawDurationFrames={16}
              />
              {headline.slice(
                headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
              )}
            </>
          ) : (
            headline
          )}
        </h1>
      </div>
    </div>
  );
}

export default HookScene;
