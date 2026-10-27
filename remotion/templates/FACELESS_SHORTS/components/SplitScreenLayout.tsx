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
  sceneFrame?: number;
}

import { safeResolveMediaSrc, isVideoMedia, isValidMediaUrl } from '../../../utils/safeMedia';

function getContextualEmoji(text: string): React.ReactNode {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

export function SplitScreenLayout({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
}: SplitScreenLayoutProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Enforce Scene-Local Frame Law: Measure motion from scene's own start frame
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;
  const sceneDurationFrames = Math.max(30, Math.round((scene.duration || 4) * fps));

  // Smooth Editorial Slide Entrance on Each Scene Transition
  const leftEntrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const leftTranslateX = interpolate(leftEntrance, [0, 1], [-50, 0]);
  const leftOpacity = interpolate(leftEntrance, [0, 1], [0, 1]);

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  const headline = scene.heading || 'KEY PRINCIPLE';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const emoji = getContextualEmoji(`${headline} ${scene.supportingText || ''}`);

  // Dynamic Camera Motion on the Media Panel (Snappy Zoom & Pan)
  const motionMode = (scene.sceneNumber || 0) % 3;
  let mediaTransform = 'scale(1.08)';

  if (motionMode === 0) {
    // Dynamic Zoom In (1.05 -> 1.22)
    const scale = interpolate(currentFrame, [0, sceneDurationFrames], [1.05, 1.22], { extrapolateRight: 'clamp' });
    mediaTransform = `scale(${scale})`;
  } else if (motionMode === 1) {
    // Dynamic Zoom Out (1.22 -> 1.05)
    const scale = interpolate(currentFrame, [0, sceneDurationFrames], [1.22, 1.05], { extrapolateRight: 'clamp' });
    mediaTransform = `scale(${scale})`;
  } else {
    // Subtle Pan + Overscan
    const panX = interpolate(currentFrame, [0, sceneDurationFrames], [20, -25], { extrapolateRight: 'clamp' });
    mediaTransform = `scale(1.15) translateX(${panX}px)`;
  }

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
            fontSize: '64px',
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
              fontSize: '30px',
              fontWeight: 600,
              lineHeight: 1.45,
              color: '#E2E8F0',
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
            transform: mediaTransform,
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
