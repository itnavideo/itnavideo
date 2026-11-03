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
        topAccentBar
        elevated
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '900px' : '1240px',
          padding: ds.layout.isVertical ? '44px 36px' : '56px 64px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: ds.layout.isVertical ? '32px' : '56px',
        }}
      >
        {/* Left / Top Metric Column */}
        <div
          style={{
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
            textAlign: ds.layout.isVertical ? 'center' : 'left',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <EyebrowPill
              label={categoryPill}
              tone={trendTone}
              palette={palette}
              progress={ds.motion.eyebrowSpring}
            />
          </div>

          {/* Hero Stat Number */}
          <div
            style={{
              fontFamily: headingFont,
              fontSize: `${ds.type.metricHero.fontSize}px`,
              fontWeight: ds.type.metricHero.fontWeight,
              letterSpacing: ds.type.metricHero.letterSpacing,
              lineHeight: ds.type.metricHero.lineHeight,
              color: ds.accents[trendTone].solid,
              marginBottom: '18px',
            }}
          >
            {statVal}
          </div>

          {/* Primary Stat Headline */}
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: `${ds.type.sceneTitle.fontSize}px`,
              fontWeight: ds.type.sceneTitle.fontWeight,
              letterSpacing: ds.type.sceneTitle.letterSpacing,
              lineHeight: 1.15,
              color: ds.surface.textPrimary,
              margin: supporting ? '0 0 14px 0' : 0,
            }}
          >
            {statTitle}
          </h2>

          {supporting && (
            <p
              style={{
                fontSize: `${ds.type.bodyLg.fontSize}px`,
                fontWeight: 500,
                lineHeight: 1.48,
                color: ds.surface.textSecondary,
                margin: 0,
                maxWidth: '680px',
              }}
            >
              {supporting}
            </p>
          )}
        </div>

        {/* Right / Bottom Vector Visual Accent */}
        <div
          style={{
            width: ds.layout.isVertical ? '260px' : '320px',
            height: ds.layout.isVertical ? '260px' : '320px',
            borderRadius: '28px',
            backgroundColor: ds.surface.cardBgMuted,
            border: ds.surface.borderSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <VectorDrawingIcon
            keyword={scene.vectorDrawingId || `${statTitle} ${supporting} chart metric`}
            size={ds.layout.isVertical ? 210 : 250}
            strokeWidth={4}
            animated={true}
            frameOverride={ds.localFrame}
            theme={ds.surface.isDark ? 'dark' : 'light'}
          />
        </div>
      </StudioCard>
    </SceneCanvas>
  );
}
