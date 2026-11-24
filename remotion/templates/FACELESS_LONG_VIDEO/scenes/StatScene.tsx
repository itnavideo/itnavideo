import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface StatSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function StatScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: StatSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const statVal =
    scene.statValue ||
    (scene.numberBadge !== undefined ? String(scene.numberBadge) : '') ||
    (scene.chartValuePercent !== undefined ? `${scene.chartValuePercent}%` : '10x');

  const isGenericLabel =
    !scene.statLabel ||
    scene.statLabel.toUpperCase() === 'GROWTH METRIC' ||
    scene.statLabel.toUpperCase() === 'KEY METRIC';

  const statTitle = isGenericLabel
    ? scene.heading || 'Key Performance Indicator'
    : scene.statLabel!;

  const supporting =
    scene.supportingText && scene.supportingText !== statTitle
      ? scene.supportingText
      : scene.heading && scene.heading !== statTitle
      ? scene.heading
      : '';

  const categoryPill = scene.categoryPill || 'KEY METRIC CALLOUT';
  const trendTone =
    scene.statTrend === 'down' ? 'rose' : scene.statTrend === 'neutral' ? 'sky' : 'emerald';

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone={trendTone}
      fontFamily={bodyFont}
    >
      <StudioCard
        tone={trendTone}
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '960px' : '1620px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: ds.layout.isVertical ? '36px' : '72px',
        }}
      >
        {/* Left / Top Metric Column */}
        <div
          style={{
            flex: 1.3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
            textAlign: ds.layout.isVertical ? 'center' : 'left',
          }}
        >
          {/* Hero Stat Number — Bold Broadcast Scale */}
          <div
            style={{
              fontFamily: headingFont,
              fontSize: `${ds.type.metricHero.fontSize}px`,
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
              color: ds.accents[trendTone].solid,
              marginBottom: '20px',
              textShadow: ds.surface.isDark ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {statVal}
          </div>

          {/* Primary Stat Headline */}
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: `${ds.type.sceneTitle.fontSize}px`,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              color: ds.surface.textPrimary,
              margin: supporting ? '0 0 16px 0' : 0,
            }}
          >
            {statTitle}
          </h2>

          {supporting && (
            <p
              style={{
                fontSize: `${ds.type.bodyLg.fontSize}px`,
                fontWeight: 500,
                lineHeight: 1.5,
                color: ds.surface.textSecondary,
                margin: 0,
                maxWidth: '740px',
              }}
            >
              {supporting}
            </p>
          )}
        </div>

        {/* Right / Bottom Vector Visual Accent — Clean & Floating Without Card Boxes */}
        <div
          style={{
            width: ds.layout.isVertical ? '300px' : '380px',
            height: ds.layout.isVertical ? '300px' : '380px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <VectorDrawingIcon
            keyword={scene.vectorDrawingId || `${statTitle} ${supporting} chart metric`}
            size={ds.layout.isVertical ? 260 : 340}
            strokeWidth={3.5}
            animated={true}
            frameOverride={ds.localFrame}
            theme={ds.surface.isDark ? 'dark' : 'light'}
          />
        </div>
      </StudioCard>
    </SceneCanvas>
  );
}
