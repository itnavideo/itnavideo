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

export interface CardConceptSceneProps {
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

export function CardConceptScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Plus Jakarta Sans, sans-serif',
}: CardConceptSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Zoom-in & Slide-in Entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0.92, 1.0]);
  const translateY = interpolate(entrance, [0, 1], [40, 0]);

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = resolveMediaSrc(activeMediaUrl);
  const isVid = isVideo(activeMediaUrl);

  const headline = scene.heading || 'CORE PRINCIPLE';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const supportingText = scene.supportingText && scene.supportingText.toLowerCase() !== headline.toLowerCase() ? scene.supportingText : '';
  const emoji = getContextualEmoji(`${headline} ${supportingText}`);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 120px',
        zIndex: 10,
        opacity: entrance,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          width: '100%',
          borderRadius: '36px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          backgroundColor: 'rgba(15, 23, 42, 0.90)',
          boxShadow: '0 35px 90px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 112, 67, 0.15)',
          backdropFilter: 'blur(28px)',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '48px',
        }}
      >
        {/* Left Visual Thumbnail (Rounded media card with Ken Burns or OffthreadVideo) */}
        <div
          style={{
            width: '460px',
            height: '350px',
            borderRadius: '26px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: '#020617',
            flexShrink: 0,
            position: 'relative',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
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
                  transform: `scale(${interpolate(frame, [0, 150], [1.0, 1.09], { extrapolateRight: 'clamp' })})`,
                  transition: 'transform 0.1s ease-out',
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
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
                fontSize: '72px',
              }}
            >
              {emoji}
            </div>
          )}
        </div>

        {/* Right Content Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Concept Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '14px',
              padding: '6px 16px',
              width: 'fit-content',
              marginBottom: '18px',
            }}
          >
            <span style={{ fontSize: '20px' }}>{emoji}</span>
            <span
              style={{
                fontFamily: headingFont,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FFA000',
              }}
            >
              INSIGHT
            </span>
          </div>

          <h2
            style={{
              fontFamily: headingFont,
              fontSize: '44px',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
              <>
                {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
                <HandwritingHighlight
                  text={highlightWord.toUpperCase()}
                  variant="underline"
                  color="#FFA000"
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

          {supportingText && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: '22px',
                fontWeight: 500,
                color: '#CBD5E1',
                lineHeight: 1.55,
                margin: 0,
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
