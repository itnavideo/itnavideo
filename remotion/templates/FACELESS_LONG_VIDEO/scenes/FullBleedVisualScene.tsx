import React from 'react';
import {
  Loop,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';

export interface FullBleedVisualSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
}

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  return /^(https?:|data:|blob:)/i.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
};

const isVideo = (src?: string) => {
  if (!src) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src) || src.includes('/video/');
};

function getContextualEmoji(text: string): string {
  const t = text.toLowerCase();
  if (/\b(money|cash|dollar|rupee|wealth|rich|income|profit|revenue|earning|salary|crore|lakh)\b/.test(t)) return '💰';
  if (/\b(invest|investment|stock|market|crypto|bitcoin|compound|growth|portfolio|mutual\s*fund)\b/.test(t)) return '📈';
  if (/\b(freedom|free|independent|escape|lifestyle|travel|peace)\b/.test(t)) return '🕊️';
  if (/\b(focus|discipline|target|goal|habit|routine|consistency|mindset)\b/.test(t)) return '🎯';
  if (/\b(idea|brain|knowledge|learn|smart|think|strategy|secret|tip)\b/.test(t)) return '💡';
  if (/\b(power|energy|fast|speed|rapid|growth|rocket|viral)\b/.test(t)) return '⚡';
  if (/\b(warning|danger|mistake|avoid|lose|loss|broke|debt|risk|trap)\b/.test(t)) return '⚠️';
  if (/\b(time|future|year|hour|clock|patience|wait|schedule)\b/.test(t)) return '⏳';
  if (/\b(success|win|winner|champion|trophy|achieve|unlock)\b/.test(t)) return '🏆';
  if (/\b(book|read|study|summary|author|chapter)\b/.test(t)) return '📚';
  return '✦';
}

export function FullBleedVisualScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: FullBleedVisualSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = resolveMediaSrc(activeMediaUrl);
  const isVid = isVideo(activeMediaUrl);

  // Directional Ken Burns rotation based on sceneNumber
  const motionMode = (scene.sceneNumber || 0) % 4;

  let transformStyle = 'scale(1.05)';
  if (motionMode === 0) {
    // Smooth Slow Zoom In (1.0 -> 1.12)
    const scale = interpolate(frame, [0, 150], [1.0, 1.12], { extrapolateRight: 'clamp' });
    transformStyle = `scale(${scale})`;
  } else if (motionMode === 1) {
    // Smooth Slow Zoom Out (1.14 -> 1.02)
    const scale = interpolate(frame, [0, 150], [1.14, 1.02], { extrapolateRight: 'clamp' });
    transformStyle = `scale(${scale})`;
  } else if (motionMode === 2) {
    // Pan Left + Subtle Zoom
    const transX = interpolate(frame, [0, 150], [0, -35], { extrapolateRight: 'clamp' });
    transformStyle = `scale(1.08) translateX(${transX}px)`;
  } else {
    // Pan Right + Subtle Zoom
    const transX = interpolate(frame, [0, 150], [-35, 0], { extrapolateRight: 'clamp' });
    transformStyle = `scale(1.08) translateX(${transX}px)`;
  }

  // Fade-in entrance for text overlay
  const textOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const textTranslateY = interpolate(frame, [0, 18], [20, 0], { extrapolateRight: 'clamp' });

  const headline = scene.heading || '';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const emoji = getContextualEmoji(`${headline} ${scene.supportingText || ''}`);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#020617',
      }}
    >
      {/* ── 1. Full-Bleed Media with Continuous Cinematic Ken Burns ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: transformStyle,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out',
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
              alt={headline || 'Scene Visual'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )
        ) : (
          /* High-End Dark Atmospheric Ambient Fallback */
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, #1E293B 0%, #0F172A 50%, #020617 100%)',
            }}
          />
        )}
      </div>

      {/* ── 2. Cinematic Gradient Vignette (Crucial for subtitle contrast & broadcast punch) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(2, 6, 23, 0.75) 0%, rgba(2, 6, 23, 0.12) 40%, rgba(2, 6, 23, 0.88) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 3. Clean Broadcast Overlay Headline (NO bulky card box — pure cinema feel) ── */}
      {headline && (
        <div
          style={{
            position: 'absolute',
            top: '85px',
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
            gap: '14px',
          }}
        >
          {emoji && emoji !== '✦' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(2, 6, 23, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '24px',
                padding: '6px 18px',
                fontSize: '20px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              }}
            >
              <span>{emoji}</span>
            </div>
          )}

          <h1
            style={{
              fontFamily: headingFont,
              fontSize: '54px',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              margin: 0,
              maxWidth: '1300px',
              textAlign: 'center',
              textShadow:
                '0 4px 30px rgba(0, 0, 0, 0.98), 0 2px 12px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.8)',
            }}
          >
            {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
                <>
                  {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
                  <HandwritingHighlight
                    text={highlightWord.toUpperCase()}
                    variant="underline"
                    color="#FFA000"
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
      )}
    </div>
  );
}

export default FullBleedVisualScene;
