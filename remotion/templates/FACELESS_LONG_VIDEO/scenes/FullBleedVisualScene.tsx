import React from 'react';
import {
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';

export interface FullBleedVisualSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
  renderSeed?: number;
}

function getContextualEmoji(text: string): React.ReactNode {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

export function FullBleedVisualScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
  renderSeed = 0,
}: FullBleedVisualSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Enforce Scene-Local Frame Law: Measure motion from scene's own start frame
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;
  const sceneDurationFrames = Math.max(30, Math.round((scene.duration || 5) * fps));

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  // Generative Diversity Engine: Camera motion & framing dynamic salt
  const salt = renderSeed || ((scene.heading?.length || 0) * 13 + (scene.sceneNumber || 1) * 7);
  const motionMode = ((scene.sceneNumber || 0) + salt) % 5;

  // Snappy Entrance Camera Punch
  const punchScale = interpolate(currentFrame, [0, 4, 10], [1.06, 1.02, 1.0], { extrapolateRight: 'clamp' });

  let transformStyle = 'scale(1.08)';
  if (motionMode === 0) {
    const scale = interpolate(currentFrame, [0, sceneDurationFrames], [1.05, 1.25], { extrapolateRight: 'clamp' });
    transformStyle = `scale(${scale * punchScale})`;
  } else if (motionMode === 1) {
    const scale = interpolate(currentFrame, [0, sceneDurationFrames], [1.25, 1.05], { extrapolateRight: 'clamp' });
    transformStyle = `scale(${scale * punchScale})`;
  } else if (motionMode === 2) {
    const transX = interpolate(currentFrame, [0, sceneDurationFrames], [40, -45], { extrapolateRight: 'clamp' });
    transformStyle = `scale(${1.18 * punchScale}) translateX(${transX}px)`;
  } else if (motionMode === 3) {
    const transX = interpolate(currentFrame, [0, sceneDurationFrames], [-45, 40], { extrapolateRight: 'clamp' });
    transformStyle = `scale(${1.18 * punchScale}) translateX(${transX}px)`;
  } else {
    const transY = interpolate(currentFrame, [0, sceneDurationFrames], [-25, 25], { extrapolateRight: 'clamp' });
    transformStyle = `scale(${1.16 * punchScale}) translateY(${transY}px)`;
  }

  // Smooth Spring-like Entrance for Text Overlay
  const textOpacity = interpolate(currentFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const textTranslateY = interpolate(currentFrame, [0, 12], [28, 0], { extrapolateRight: 'clamp' });

  const headline = String(scene.heading || '').trim();
  const rawHighlight = (scene.highlightedWords && typeof scene.highlightedWords[0] === 'string')
    ? scene.highlightedWords[0].trim()
    : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const emoji = getContextualEmoji(`${headline} ${scene.supportingText || ''}`);

  const placementMode = ((scene.sceneNumber || 0) + salt) % 3;
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
      {/* ── 1. Full-Bleed Media Canvas ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: transformStyle,
          transformOrigin: 'center center',
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
            <Img
              src={resolvedSrc}
              alt={headline || 'Scene Visual'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: isLight
                ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)'
                : 'radial-gradient(ellipse at 50% 40%, #1E1B4B 0%, #0F172A 50%, #020617 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ transform: 'scale(1.15)', marginTop: '20px' }}>
              <VectorDrawingIcon
                keyword={`${headline} ${scene.supportingText || ''}`}
                size={440}
                strokeWidth={3.8}
                animated={true}
                theme={isLight ? 'light' : 'dark'}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cinematic Gradient Vignette & Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 45%, rgba(255, 255, 255, 0.90) 100%)'
            : (placementMode === 2
                ? 'linear-gradient(180deg, rgba(2, 6, 23, 0.45) 0%, rgba(2, 6, 23, 0.2) 40%, rgba(2, 6, 23, 0.92) 100%)'
                : 'linear-gradient(180deg, rgba(2, 6, 23, 0.82) 0%, rgba(2, 6, 23, 0.15) 45%, rgba(2, 6, 23, 0.88) 100%)'),
          pointerEvents: 'none',
        }}
      />
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: '55%',
              height: '55%',
              background: 'radial-gradient(circle, rgba(255, 160, 0, 0.14) 0%, rgba(255, 87, 34, 0.06) 45%, transparent 75%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

      {/* ── 2. Floating Anchor / Category Badge ── */}
      <div
        style={{
          position: 'absolute',
          top: isLight ? '38px' : '65px',
          right: placementMode === 1 ? '70px' : '90px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: isLight ? '#FFFFFF' : 'rgba(7, 11, 20, 0.82)',
          backdropFilter: 'blur(20px)',
          border: isLight ? '1.5px solid rgba(255, 87, 34, 0.35)' : '1.5px solid rgba(255, 160, 0, 0.45)',
          borderRadius: '32px',
          padding: '8px 22px',
          boxShadow: isLight
            ? '0 6px 20px rgba(255, 87, 34, 0.15), 0 2px 6px rgba(15, 23, 42, 0.06)'
            : '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 87, 34, 0.35)',
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px) scale(${interpolate(currentFrame, [0, 15], [0.8, 1], { extrapolateRight: 'clamp' })})`,
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '24px',
            filter: 'drop-shadow(0 2px 8px rgba(255, 160, 0, 0.5))',
            display: 'inline-block',
            transform: `rotate(${Math.sin(currentFrame / 15) * 4}deg)`,
          }}
        >
          {emoji}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '12px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: isLight ? '#FF5722' : '#FFA000',
            }}
          >
            {'KEY INSIGHT'}
          </span>
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isLight ? '#64748B' : 'rgba(255, 255, 255, 0.75)',
            }}
          >
            CHAPTER 0{Math.min(9, Math.max(1, Number(scene.numberBadge) || scene.sceneNumber || 1))}
          </span>
        </div>
      </div>

      {/* ── 3. Dynamic Headline & Supporting Text Overlay ── */}
      {headline && (
        <div
          style={{
            position: 'absolute',
            ...(isLight
              ? { top: '55px', left: '100px', right: '300px', alignItems: 'flex-start' }
              : placementMode === 2
              ? { bottom: '150px', left: '100px', right: '100px', alignItems: 'flex-start' }
              : placementMode === 1
              ? { top: '95px', left: '100px', right: '100px', alignItems: 'flex-start' }
              : { top: '95px', left: 0, right: 0, alignItems: 'center' }),
            opacity: textOpacity,
            transform: `translateY(${textTranslateY}px)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: !isLight && placementMode === 0 ? '0 100px' : '0',
            pointerEvents: 'none',
            zIndex: 15,
            gap: isLight ? '8px' : '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            {(isLight || placementMode === 1) && (
              <div
                style={{
                  width: '6px',
                  alignSelf: 'stretch',
                  borderRadius: '3px',
                  background: 'linear-gradient(180deg, #FF5722, #FFA000)',
                  boxShadow: '0 0 14px rgba(255, 87, 34, 0.8)',
                }}
              />
            )}
            <h1
              style={{
                fontFamily: headingFont,
                fontSize: isLight ? '52px' : placementMode === 0 ? '68px' : '60px',
                fontWeight: 900,
                color: isLight ? '#0F172A' : '#FFFFFF',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                margin: 0,
                maxWidth: isLight ? '1100px' : placementMode === 0 ? '1420px' : '1100px',
                textAlign: !isLight && placementMode === 0 ? 'center' : 'left',
                textShadow: isLight
                  ? '0 2px 10px rgba(255, 255, 255, 0.9)'
                  : '0 4px 35px rgba(0, 0, 0, 0.98), 0 2px 14px rgba(0, 0, 0, 0.95), 0 0 60px rgba(0, 0, 0, 0.85)',
              }}
            >
              {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
                <>
                  {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
                  <HandwritingHighlight
                    text={highlightWord.toUpperCase()}
                    variant="underline"
                    color="#FF5722"
                    delayFrames={10}
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

          {/* Supporting Insight Copy */}
          {scene.supportingText && scene.supportingText.trim().toLowerCase() !== headline.toLowerCase() && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: isLight ? '24px' : '28px',
                fontWeight: 600,
                color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.94)',
                lineHeight: 1.4,
                margin: 0,
                maxWidth: isLight ? '900px' : placementMode === 0 ? '1180px' : '920px',
                textAlign: !isLight && placementMode === 0 ? 'center' : 'left',
                textShadow: isLight ? 'none' : '0 3px 18px rgba(0, 0, 0, 0.98), 0 1px 6px rgba(0, 0, 0, 0.9)',
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(2, 6, 23, 0.55)',
                backdropFilter: 'blur(10px)',
                padding: isLight ? '4px 16px' : '8px 20px',
                borderRadius: '10px',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'inline-block',
                boxShadow: isLight ? '0 2px 8px rgba(15, 23, 42, 0.05)' : undefined,
              }}
            >
              {scene.supportingText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default FullBleedVisualScene;
