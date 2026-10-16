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

export interface StatSceneProps {
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

export function StatScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: StatSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const statVal = scene.statValue || scene.numberBadge?.toString();

  // If there is NO real numeric statistic (e.g. no digits), fallback directly to FullBleedVisualScene
  if (!statVal || !/\d/.test(statVal)) {
    return (
      <FullBleedVisualScene
        scene={scene}
        mediaUrl={mediaUrl}
        headingFont={headingFont}
        bodyFont={bodyFont}
      />
    );
  }

  const entrance = spring({
    frame,
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
  const resolvedSrc = resolveMediaSrc(activeMediaUrl);
  const isVid = isVideo(activeMediaUrl);
  const kenBurns = interpolate(frame, [0, 150], [1.0, 1.08], { extrapolateRight: 'clamp' });

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
        </div>
      )}

      {/* ── 2. Cinematic Dark Frosted Overlay Scrim ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: resolvedSrc
            ? 'radial-gradient(ellipse at center, rgba(7, 11, 20, 0.78) 0%, rgba(2, 6, 23, 0.94) 100%)'
            : 'radial-gradient(ellipse at center, #1E293B 0%, #0F172A 60%, #020617 100%)',
          backdropFilter: resolvedSrc ? 'blur(16px)' : undefined,
          pointerEvents: 'none',
        }}
      />

      {/* ── 3. Ultra-Clean Hero Metric Display in Center ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 140px',
          zIndex: 10,
          opacity: entrance,
          transform: `scale(${interpolate(entrance, [0, 1], [0.94, 1.0])})`,
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            width: '100%',
            borderRadius: '36px',
            border: '1px solid rgba(255, 160, 0, 0.35)',
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            padding: '52px 64px',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 60px rgba(255, 87, 34, 0.18)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <ResponsiveTypography
            text={statLbl}
            mode="stat"
            statData={{ value: statVal, label: statLbl }}
            fontFamily={headingFont}
            color="#F1F5F9"
            accentColor="#FFA000"
            availableWidth={1000}
          />
        </div>
      </div>
    </div>
  );
}
