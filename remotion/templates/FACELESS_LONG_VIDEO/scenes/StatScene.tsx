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
import { ResponsiveTypography } from '../components/ResponsiveTypography';
import { FullBleedVisualScene } from './FullBleedVisualScene';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia, isValidMediaUrl } from '../../../utils/safeMedia';

export interface StatSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

// resolveMediaSrc replaced by safeResolveMediaSrc

// isVideo replaced by isVideoMedia

export function StatScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: StatSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;
  const sceneDurationFrames = Math.max(30, Math.round((scene.duration || 5) * fps));

  const statVal = scene.statValue || scene.numberBadge?.toString();

  // If there is NO real numeric statistic (e.g. no digits), fallback directly to FullBleedVisualScene
  if (!statVal || !/\d/.test(statVal)) {
    return (
      <FullBleedVisualScene
        scene={scene}
        mediaUrl={mediaUrl}
        headingFont={headingFont}
        bodyFont={bodyFont}
        sceneFrame={sceneFrame}
        palette={palette}
      />
    );
  }

  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const isDummyLabel =
    !scene.statLabel ||
    scene.statLabel.toUpperCase() === 'GROWTH METRIC' ||
    scene.statLabel.toUpperCase() === 'KEY METRIC';
  const statLbl: string =
    (isDummyLabel ? scene.heading || scene.narrationSegment?.text || '' : scene.statLabel) || '';

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);
  const kenBurns = interpolate(currentFrame, [0, sceneDurationFrames], [1.02, 1.12], { extrapolateRight: 'clamp' });

  const isDark = palette ? palette.isDark : true;
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const labelColor = isDark ? 'rgba(255, 255, 255, 0.85)' : '#334155';

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
      {/* ── 1. Full-Bleed Media in Background (Edge-to-Edge 1920x1080) ── */}
      {resolvedSrc && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${kenBurns})`,
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
              alt="Stat visual"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          {/* Subtle directional scrim over media for 100% legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(7, 11, 20, 0.72) 0%, rgba(2, 6, 23, 0.92) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          />
        </div>
      )}

      {/* ── 2. Cinematic Hero Metric Display in Center (Zero SaaS Card Box) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 140px',
          zIndex: 10,
          opacity: entrance,
          transform: `scale(${interpolate(entrance, [0, 1], [0.92, 1.0])})`,
          textAlign: 'center',
        }}
      >
        {/* Metric Kicker Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isDark ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 87, 34, 0.10)',
            border: '1px solid rgba(255, 87, 34, 0.35)',
            borderRadius: '9999px',
            padding: '8px 24px',
            marginBottom: '28px',
          }}
        >
          <span style={{ fontSize: '18px' }}>📊</span>
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '14px',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#FF7043',
            }}
          >
            KEY METRIC
          </span>
        </div>

        {/* Oversized Glowing Hero Statistic */}
        <div
          style={{
            fontFamily: headingFont,
            fontSize: '130px',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #FF5722 0%, #FF7043 50%, #FFA000 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 15px 35px rgba(255, 87, 34, 0.45))',
            marginBottom: '24px',
          }}
        >
          {statVal}
        </div>

        {/* High-Contrast Context Label */}
        {statLbl && (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: '32px',
              fontWeight: 700,
              color: resolvedSrc ? '#F8FAFC' : textColor,
              maxWidth: '1100px',
              lineHeight: 1.4,
              textShadow: resolvedSrc ? '0 4px 20px rgba(0, 0, 0, 0.9)' : undefined,
            }}
          >
            {statLbl}
          </div>
        )}
      </div>
    </div>
  );
}
