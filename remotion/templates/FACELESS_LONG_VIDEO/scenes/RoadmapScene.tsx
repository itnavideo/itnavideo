import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { type AccentTone, useVideoDesignSystem } from '../designSystem';
import {
  SceneCanvas,
  SceneHeader,
  StepNumberBadge,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface RoadmapSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

interface MilestoneStep {
  number: string;
  title: string;
  detail: string;
  badge: string;
  tone: AccentTone;
}

const STEP_TONES: AccentTone[] = ['sky', 'indigo', 'amber', 'emerald'];

export function RoadmapScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: RoadmapSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const heading = scene.heading || 'STEP-BY-STEP PROGRESSION ROADMAP';
  const categoryPill = scene.categoryPill || 'STRATEGIC ROADMAP';

  const steps: MilestoneStep[] = React.useMemo(() => {
    if (scene.timelineSteps && scene.timelineSteps.length >= 2) {
      return scene.timelineSteps.slice(0, 4).map((step, i) => ({
        number: String(i + 1).padStart(2, '0'),
        title: step.title || `Phase ${i + 1}`,
        detail: step.detail || step.title,
        badge: i === scene.timelineSteps!.length - 1 ? 'FINAL GOAL' : `PHASE ${i + 1}`,
        tone: STEP_TONES[i % STEP_TONES.length],
      }));
    }
    if (scene.listItems && scene.listItems.length >= 2) {
      return scene.listItems.slice(0, 4).map((item, i) => {
        const parts = String(item).split(/[:•–-]/);
        const title = (parts[0] || `Phase ${i + 1}`).trim();
        const detail = (parts.slice(1).join(' ').trim() || title).trim();
        return {
          number: String(i + 1).padStart(2, '0'),
          title: title.length > 34 ? `${title.slice(0, 31)}...` : title,
          detail,
          badge: i === Math.min(3, scene.listItems!.length - 1) ? 'OUTCOME' : `STEP ${i + 1}`,
          tone: STEP_TONES[i % STEP_TONES.length],
        };
      });
    }
    return [
      {
        number: '01',
        title: 'Foundation',
        detail: 'Clarify core objective and baseline inputs',
        badge: 'PHASE 1',
        tone: 'sky',
      },
      {
        number: '02',
        title: 'Structure',
        detail: 'Build repeatable workflow and key milestones',
        badge: 'PHASE 2',
        tone: 'indigo',
      },
      {
        number: '03',
        title: 'Execution',
        detail: 'Focus daily actions on high-leverage priorities',
        badge: 'PHASE 3',
        tone: 'amber',
      },
      {
        number: '04',
        title: 'Compounding',
        detail: 'Measure outcomes and scale proven results',
        badge: 'MASTERY',
        tone: 'emerald',
      },
    ];
  }, [scene.listItems, scene.timelineSteps]);

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="indigo"
      fontFamily={bodyFont}
    >
      <SceneHeader
        categoryPill={categoryPill}
        heading={heading}
        supportingText={scene.supportingText}
        highlightedWords={scene.highlightedWords}
        headingFont={headingFont}
        bodyFont={bodyFont}
        tone="indigo"
        sceneFrame={sceneFrame}
        palette={palette}
      />

      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1480px',
          display: 'grid',
          gridTemplateColumns: ds.layout.isVertical
            ? '1fr'
            : `repeat(${steps.length}, minmax(0, 1fr))`,
          gap: ds.layout.isVertical ? '16px' : '22px',
          alignItems: 'stretch',
        }}
      >
        {steps.map((step, idx) => {
          const itemSpring = ds.motion.stagger(idx, 6, 5);
          const isFinal = idx === steps.length - 1;
          const accent = ds.accents[step.tone];

          return (
            <StudioCard
              key={idx}
              tone={step.tone}
              topAccentBar
              elevated={isFinal}
              palette={palette}
              progress={itemSpring}
              translateYFrom={24}
              style={{
                display: 'flex',
                flexDirection: ds.layout.isVertical ? 'row' : 'column',
                alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
                justifyContent: 'space-between',
                gap: ds.layout.isVertical ? '20px' : '18px',
                padding: ds.layout.isVertical ? '22px 26px' : '28px 26px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: ds.layout.isVertical ? 'row' : 'column',
                  alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
                  gap: '16px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: ds.layout.isVertical ? 'auto' : '100%',
                  }}
                >
                  <StepNumberBadge
                    number={step.number}
                    tone={step.tone}
                    size={44}
                    palette={palette}
                  />
                  {!ds.layout.isVertical && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: accent.SoftBg,
                        color: accent.textOnSoft,
                        border: `1px solid ${accent.border}`,
                      }}
                    >
                      {step.badge}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: headingFont,
                      fontSize: `${ds.type.cardTitle.fontSize}px`,
                      fontWeight: ds.type.cardTitle.fontWeight,
                      lineHeight: ds.type.cardTitle.lineHeight,
                      letterSpacing: ds.type.cardTitle.letterSpacing,
                      color: ds.surface.textPrimary,
                      margin: '0 0 8px 0',
                    }}
                  >
                    {step.title}
                  </h3>
                  {step.detail && step.detail !== step.title && (
                    <p
                      style={{
                        fontSize: `${ds.type.bodyMd.fontSize}px`,
                        fontWeight: 500,
                        lineHeight: 1.45,
                        color: ds.surface.textSecondary,
                        margin: 0,
                      }}
                    >
                      {step.detail}
                    </p>
                  )}
                </div>
              </div>
            </StudioCard>
          );
        })}
      </div>
    </SceneCanvas>
  );
}
