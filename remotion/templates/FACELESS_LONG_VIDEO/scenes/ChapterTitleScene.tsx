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

export interface ChapterTitleSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  chapterNumber?: number;
}

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  return /^(https?:|data:|blob:)/i.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
};

const isVideo = (src?: string) => {
  if (!src) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src) || src.includes('/video/');
};

export function ChapterTitleScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Plus Jakarta Sans, sans-serif',
  chapterNumber,
}: ChapterTitleSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic Riser Spring Entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.9, stiffness: 140 },
  });

  const scale = interpolate(entrance, [0, 1], [0.88, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const kenBurnsScale = interpolate(frame, [0, 150], [1.02, 1.12], { extrapolateRight: 'clamp' });

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = resolveMediaSrc(activeMediaUrl);
  const isVid = isVideo(activeMediaUrl);

  const rawBadge = chapterNumber ?? scene.numberBadge ?? 1;
  const chNum = typeof rawBadge === 'number' ? rawBadge : (parseInt(String(rawBadge), 10) || 1);
  const headline = scene.heading || 'CORE CHAPTER TAKEAWAY';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const supportingText = scene.supportingText && scene.supportingText !== headline ? scene.supportingText : '';

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
      {/* ── 1. Full-Bleed Background Media with Continuous Ken Burns ── */}
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
              background: 'radial-gradient(ellipse at 50% 50%, #1E1B4B 0%, #0F172A 50%, #020617 100%)',
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
            'linear-gradient(180deg, rgba(2, 6, 23, 0.78) 0%, rgba(2, 6, 23, 0.2) 40%, rgba(2, 6, 23, 0.88) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 3. Chapter Content (Broadcast Typography) ── */}
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
                border: '1px solid rgba(255, 87, 34, 0.45)',
                backgroundColor: 'rgba(255, 87, 34, 0.14)',
                backdropFilter: 'blur(12px)',
                padding: '8px 26px',
                fontSize: '15px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#FFA000',
                boxShadow: '0 0 24px rgba(255, 87, 34, 0.25)',
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
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              maxWidth: '1200px',
              marginBottom: supportingText ? '20px' : '0',
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
                color: '#CBD5E1',
                maxWidth: '900px',
                lineHeight: 1.5,
                margin: 0,
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.9)',
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
