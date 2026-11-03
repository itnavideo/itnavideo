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

export interface GoalTargetSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

const BUCKET_TONES: AccentTone[] = ['sky', 'amber', 'emerald', 'indigo'];

export function GoalTargetScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: GoalTargetSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const heading = scene.heading || 'STRATEGIC ALLOCATION & TARGET';
  const categoryPill = scene.categoryPill || 'ALLOCATION BLUEPRINT';
  const targetMetric = scene.statValue || '100%';
  const targetLabel = scene.statLabel || scene.supportingText || 'Target Milestone';

  const buckets = React.useMemo(() => {
    if (scene.donutSlices && scene.donutSlices.length >= 2) {
      return scene.donutSlices.slice(0, 4).map((slice, idx) => ({
        label: slice.label,
        percent: Math.min(100, Math.max(5, slice.value)),
        display: `${slice.value}%`,
        tone: BUCKET_TONES[idx % BUCKET_TONES.length],
      }));
    }
    if (scene.chartItems && scene.chartItems.length >= 2) {
      return scene.chartItems.slice(0, 4).map((item, idx) => ({
        label: item.label,
        percent: Math.min(100, Math.max(10, item.value)),
        display: item.displayValue || `${item.value}%`,
        tone: BUCKET_TONES[idx % BUCKET_TONES.length],
      }));
    }
    return [
      { label: 'Core Essentials & Operations', percent: 50, display: '50%', tone: 'sky' as AccentTone },
      { label: 'Strategic Growth & Skills', percent: 30, display: '30%', tone: 'amber' as AccentTone },
      { label: 'Long-Term Compounding Reserve', percent: 20, display: '20%', tone: 'emerald' as AccentTone },
    ];
  }, [scene.chartItems, scene.donutSlices]);

  const leftSpring = ds.motion.stagger(0, 6, 6);
  const rightSpring = ds.motion.stagger(1, 10, 6);

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

      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1360px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: ds.layout.isVertical ? '20px' : '28px',
        }}
      >
        {/* LEFT CARD: Structured Allocation Breakdown */}
        <StudioCard
          tone="sky"
          topAccentBar
          palette={palette}
          progress={leftSpring}
          style={{
            flex: 1.25,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '22px',
              }}
            >
              <EyebrowPill label="RESOURCE ALLOCATION" tone="sky" palette={palette} />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: ds.surface.textMuted,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                OPTIMIZED SPLIT
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {buckets.map((bucket, idx) => {
                const barProgress = ds.motion.stagger(idx, 10, 5);
                const fillWidth = interpolate(barProgress, [0, 1], [0, bucket.percent]);
                const accent = ds.accents[bucket.tone];

                return (
                  <div key={idx}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: `${ds.type.bodyMd.fontSize}px`,
                          fontWeight: 700,
                          color: ds.surface.textPrimary,
                        }}
                      >
                        {bucket.label}
                      </span>
                      <span
                        style={{
                          fontFamily: headingFont,
                          fontSize: '18px',
                          fontWeight: 900,
                          color: accent.solid,
                        }}
                      >
                        {bucket.display}
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '14px',
                        borderRadius: '9999px',
                        backgroundColor: ds.surface.cardBgMuted,
                        border: ds.surface.borderSubtle,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${fillWidth}%`,
                          height: '100%',
                          borderRadius: '9999px',
                          backgroundColor: accent.solid,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </StudioCard>

        {/* RIGHT CARD: North-Star Goal Target */}
        <StudioCard
          tone="emerald"
          topAccentBar
          elevated
          palette={palette}
          progress={rightSpring}
          style={{
            flex: 0.95,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <EyebrowPill label="PRIMARY TARGET" tone="emerald" palette={palette} />

          <div
            style={{
              fontFamily: headingFont,
              fontSize: ds.layout.isVertical ? '54px' : '64px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: ds.accents.emerald.solid,
              margin: '20px 0 10px 0',
              lineHeight: 1.05,
            }}
          >
            {targetMetric}
          </div>

          <div
            style={{
              fontSize: `${ds.type.bodyLg.fontSize}px`,
              fontWeight: 700,
              color: ds.surface.textPrimary,
              maxWidth: '360px',
              lineHeight: 1.35,
            }}
          >
            {targetLabel}
          </div>
        </StudioCard>
      </div>
    </SceneCanvas>
  );
}
