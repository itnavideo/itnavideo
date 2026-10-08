import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrowserMockupFrame } from '../components/BrowserMockupFrame';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ScreenshotSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
}

export function ScreenshotScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: ScreenshotSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1.0]);
  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px',
        zIndex: 10,
        opacity: entrance,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ width: '100%', maxWidth: '1200px', height: '620px' }}>
        <BrowserMockupFrame
          src={activeMediaUrl}
          title={scene.heading || 'LIVE DASHBOARD SCREENSHOT'}
          urlAddress="https://www.itnavideo.com/dashboard"
          zoomEffect="browser-scroll"
        />
      </div>
    </div>
  );
}
