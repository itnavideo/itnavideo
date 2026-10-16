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

export interface HookSceneProps {
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
  return '🔥';
}

export function HookScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: HookSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // High-Energy Opening Spring Scale
  const entrance = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.9, stiffness: 180 },
  });

  // Continuous Dynamic Ken Burns Zoom (1.0 -> 1.15) for high hook retention
  const kenBurnsScale = interpolate(frame, [0, 180], [1.0, 1.15], { extrapolateRight: 'clamp' });
  const textOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const textTranslateY = interpolate(entrance, [0, 1], [30, 0]);

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = resolveMediaSrc(activeMediaUrl);
  const isVid = isVideo(activeMediaUrl);

  const headline = scene.heading || 'EXCLUSIVE INSIGHT';
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
      {/* ── 1. Full-Bleed Media with Continuous Cinematic Ken Burns (NO blank dark screen!) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${kenBurnsScale})`,
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
              alt={headline}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )
        ) : (
          /* High-Impact Atmospheric Flare Fallback */
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at 50% 40%, #1E1B4B 0%, #0F172A 50%, #020617 100%)',
            }}
          />
        )}
      </div>

      {/* ── 2. Cinematic Gradient Vignette ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(2, 6, 23, 0.80) 0%, rgba(2, 6, 23, 0.15) 45%, rgba(2, 6, 23, 0.88) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 3. High-Impact Broadcast Hook Headline (NO bulky card box) ── */}
      <div
        style={{
          position: 'absolute',
          top: '90px',
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
        {/* Dynamic Concept Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(2, 6, 23, 0.70)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 160, 0, 0.4)',
            borderRadius: '24px',
            padding: '6px 20px',
            fontSize: '20px',
            boxShadow: '0 8px 30px rgba(255, 87, 34, 0.3)',
          }}
        >
          <span>{emoji}</span>
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#FFA000',
            }}
          >
            MUST WATCH
          </span>
        </div>

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: '60px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: 0,
            maxWidth: '1300px',
            textAlign: 'center',
            textShadow:
              '0 4px 30px rgba(0, 0, 0, 0.98), 0 2px 14px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 0, 0, 0.85)',
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
