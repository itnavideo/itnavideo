import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrowserMockupFrame } from './BrowserMockupFrame';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface SplitScreenLayoutProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
}

export function SplitScreenLayout({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: SplitScreenLayoutProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Entrance Animations
  const leftEntrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });

  const rightEntrance = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const leftTranslateX = interpolate(leftEntrance, [0, 1], [-80, 0]);
  const rightTranslateX = interpolate(rightEntrance, [0, 1], [80, 0]);

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px',
        gap: '48px',
        zIndex: 10,
      }}
    >
      {/* ── LEFT PANEL: Dark Glassmorphic Typography & Bullet Card ── */}
      <div
        style={{
          flex: 1,
          height: '540px',
          borderRadius: '32px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          padding: '48px 56px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transform: `translateX(${leftTranslateX}px)`,
          opacity: leftEntrance,
        }}
      >
        {/* Category Pill */}
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#00FF9D',
              backgroundColor: 'rgba(0, 255, 157, 0.15)',
              border: '1px solid rgba(0, 255, 157, 0.4)',
              padding: '6px 16px',
              borderRadius: '9999px',
            }}
          >
            {scene.sceneType?.toUpperCase() || 'EXPLAINER BREAKDOWN'}
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: headingFont,
            fontSize: '38px',
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#FFFFFF',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          {scene.heading || 'KEY PERFORMANCE INSIGHTS'}
        </h1>

        {/* Body Text / Supporting Narration */}
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: '20px',
            lineHeight: 1.6,
            color: '#CBD5E1',
            marginBottom: '24px',
          }}
        >
          {scene.supportingText || scene.narrationSegment?.text || ''}
        </p>

        {/* Highlighted Key Points Pills */}
        {scene.highlightedWords && scene.highlightedWords.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
            {scene.highlightedWords.map((word, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#38BDF8',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '6px 14px',
                  borderRadius: '12px',
                }}
              >
                ✦ {word.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL: Sleek Browser / Mobile Frame ── */}
      <div
        style={{
          flex: 1,
          height: '540px',
          transform: `translateX(${rightTranslateX}px)`,
          opacity: rightEntrance,
        }}
      >
        <BrowserMockupFrame
          src={activeMediaUrl}
          title={scene.heading || 'ANALYTICS BREAKDOWN'}
          urlAddress={`https://www.itnavideo.com/tools/${scene.layoutType || 'explainer'}`}
          zoomEffect="browser-scroll"
        />
      </div>
    </div>
  );
}

