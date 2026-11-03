import React from 'react';
import { interpolate } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { type AccentTone, useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  SceneHeader,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface ChartSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

const BAR_TONES: AccentTone[] = ['sky', 'indigo', 'amber', 'emerald', 'coral'];

export function ChartScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: ChartSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const heading = scene.heading || 'PERFORMANCE & GROWTH TRAJECTORY';
  const categoryPill = scene.categoryPill || 'DATA & ANALYTICS';
  const heroMetric = scene.statValue || (scene.chartValuePercent ? `+${scene.chartValuePercent}%` : '+240%');
  const heroLabel = scene.statLabel || 'Measured Trajectory';

  const chartItems = React.useMemo(() => {
    if (scene.chartItems && scene.chartItems.length >= 2) {
      const maxVal = Math.max(1, ...scene.chartItems.map((c) => Math.abs(c.value || 10)));
      return scene.chartItems.slice(0, 5).map((item, idx) => ({
        label: item.label || `Point ${idx + 1}`,
        displayValue: item.displayValue || `${item.value}`,
        heightPercent: Math.min(100, Math.max(18, Math.round((Math.abs(item.value || 10) / maxVal) * 100))),
        tone: BAR_TONES[idx % BAR_TONES.length],
      }));
    }
    return [
      { label: 'Phase 1', displayValue: '24%', heightPercent: 28, tone: 'sky' as AccentTone },
      { label: 'Phase 2', displayValue: '48%', heightPercent: 52, tone: 'indigo' as AccentTone },
      { label: 'Phase 3', displayValue: '74%', heightPercent: 76, tone: 'amber' as AccentTone },
      { label: 'Phase 4', displayValue: '100%', heightPercent: 100, tone: 'emerald' as AccentTone },
    ];
  }, [scene.chartItems]);

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="emerald"
      fontFamily={bodyFont}
    >
      <SceneHeader
        categoryPill={categoryPill}
        heading={heading}
        supportingText={scene.supportingText}
        highlightedWords={scene.highlightedWords}
        headingFont={headingFont}
        bodyFont={bodyFont}
        tone="emerald"
        sceneFrame={sceneFrame}
        palette={palette}
      />

      <StudioCard
        tone="emerald"
        topAccentBar
        elevated
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Top Metric Summary Row */}
        <div
          style={{
            display: 'flex',
            flexDirection: ds.layout.isVertical ? 'column' : 'row',
            alignItems: ds.layout.isVertical ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingBottom: '20px',
            borderBottom: ds.surface.borderSubtle,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: ds.surface.textMuted,
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {heroLabel}
            </div>
            <div
              style={{
                fontFamily: headingFont,
                fontSize: ds.layout.isVertical ? '44px' : '52px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: ds.accents.emerald.solid,
                lineHeight: 1.05,
              }}
            >
              {heroMetric}
            </div>
          </div>

          <EyebrowPill label="VERIFIED TREND" tone="emerald" palette={palette} />
        </div>

        {/* Animated Bar Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${chartItems.length}, minmax(0, 1fr))`,
            gap: ds.layout.isVertical ? '16px' : '28px',
            alignItems: 'end',
            height: ds.layout.isVertical ? '260px' : '240px',
            paddingTop: '16px',
          }}
        >
          {chartItems.map((bar, idx) => {
            const barSpring = ds.motion.stagger(idx, 10, 5);
            const animatedHeight = interpolate(barSpring, [0, 1], [8, bar.heightPercent]);
            const accent = ds.accents[bar.tone];

            return (
              <div
                key={idx}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: headingFont,
                    fontSize: '18px',
                    fontWeight: 900,
                    color: accent.solid,
                    opacity: barSpring,
                  }}
                >
                  {bar.displayValue}
                </span>

                <div
                  style={{
                    width: '100%',
                    maxWidth: '120px',
                    height: `${animatedHeight}%`,
                    borderRadius: '14px 14px 6px 6px',
                    backgroundColor: accent.SoftBg,
                    border: `2px solid ${accent.solid}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: accent.solid,
                      opacity: 0.22,
                    }}
                  />
                </div>

                <span
                  style={{
                    fontSize: `${ds.type.bodyMd.fontSize}px`,
                    fontWeight: 700,
                    color: ds.surface.textPrimary,
                    textAlign: 'center',
                    maxWidth: '160px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </StudioCard>
    </SceneCanvas>
  );
}
