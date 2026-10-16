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

export interface SplitScreenLayoutProps {
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
  return '';
}

export function SplitScreenLayout({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: SplitScreenLayoutProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Editorial Slide Entrance
  const leftEntrance = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.9 },
  });

  const leftTranslateX = interpolate(leftEntrance, [0, 1], [-60, 0]);
  const leftOpacity = interpolate(leftEntrance, [0, 1], [0, 1]);

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = resolveMediaSrc(activeMediaUrl);
  const isVid = isVideo(activeMediaUrl);

  const headline = scene.heading || 'KEY PRINCIPLE';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const emoji = getContextualEmoji(`${headline} ${scene.supportingText || ''}`);

  // Continuous subtle Ken Burns on the right-hand media panel (1.0 -> 1.09x)
  const mediaScale = interpolate(frame, [0, 180], [1.0, 1.09], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: '#070B14',
        zIndex: 10,
      }}
    >
      {/* ── LEFT PANEL: Full-Height Solid Obsidian Editorial Column (50% Width) ── */}
      <div
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#070B14',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '100px 90px',
          boxSizing: 'border-box',
          transform: `translateX(${leftTranslateX}px)`,
          opacity: leftOpacity,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Concept Pill with Guaranteed SVG Sparkle / Context Emoji */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '20px',
            padding: '7px 18px',
            width: 'fit-content',
            marginBottom: '28px',
          }}
        >
          {emoji ? (
            <span style={{ fontSize: '20px' }}>{emoji}</span>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#FFA000"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
          )}
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#FFA000',
            }}
          >
            CORE CONCEPT
          </span>
        </div>

        {/* Clean High-Contrast Headline */}
        <h1
          style={{
            fontFamily: headingFont,
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#FFFFFF',
            marginBottom: '24px',
            letterSpacing: '-0.025em',
            margin: '0 0 24px 0',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.8)',
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
                drawDurationFrames={18}
              />
              {headline.slice(
                headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
              )}
            </>
          ) : (
            headline
          )}
        </h1>

        {/* Clean Concept Takeaway Subtext */}
        {scene.supportingText && scene.supportingText.toLowerCase() !== headline.toLowerCase() && (
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: 1.5,
              color: '#94A3B8',
              margin: 0,
              maxWidth: '680px',
            }}
          >
            {scene.supportingText}
          </p>
        )}
      </div>

      {/* ── RIGHT PANEL: Edge-to-Edge Full-Height Cinema Visual (50% Width) ── */}
      <div
        style={{
          width: '50%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#020617',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${mediaScale})`,
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
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse at center, #1E293B 0%, #0F172A 50%, #020617 100%)',
              }}
            />
          )}
        </div>

        {/* Seamless edge blend between Left obsidian panel and Right visual */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100px',
            background: 'linear-gradient(90deg, #070B14 0%, rgba(7, 11, 20, 0.4) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Top & Bottom Broadcast Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.4) 0%, transparent 40%, rgba(2, 6, 23, 0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

export default SplitScreenLayout;
