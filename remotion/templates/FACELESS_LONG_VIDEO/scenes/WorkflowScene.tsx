import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { type AccentTone, useVideoDesignSystem } from '../designSystem';
import {
  SceneCanvas,
  SceneHeader,
  StepNumberBadge,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface WorkflowSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

const NODE_TONES: AccentTone[] = ['sky', 'coral', 'indigo', 'emerald'];

export function WorkflowScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: WorkflowSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const heading = scene.heading || 'END-TO-END EXECUTION WORKFLOW';
  const categoryPill = scene.categoryPill || 'SYSTEM WORKFLOW';

  const nodes = React.useMemo(() => {
    if (scene.timelineSteps && scene.timelineSteps.length >= 2) {
      return scene.timelineSteps.slice(0, 4).map((step, i) => ({
        step: String(i + 1).padStart(2, '0'),
        title: step.title || `Stage ${i + 1}`,
        detail: step.detail || '',
        tone: NODE_TONES[i % NODE_TONES.length],
      }));
    }
    if (scene.listItems && scene.listItems.length >= 2) {
      return scene.listItems.slice(0, 4).map((item, i) => {
        const parts = String(item).split(/[:•–-]/);
        const title = (parts[0] || `Stage ${i + 1}`).trim();
        const detail = parts.slice(1).join(' ').trim();
        return {
          step: String(i + 1).padStart(2, '0'),
          title,
          detail,
          tone: NODE_TONES[i % NODE_TONES.length],
        };
      });
    }
    return [
      { step: '01', title: 'Input & Trigger', detail: 'Capture core signal and context', tone: 'sky' as AccentTone },
      { step: '02', title: 'Core Processing', detail: 'Apply structured rules and analysis', tone: 'coral' as AccentTone },
      { step: '03', title: 'Quality Check', detail: 'Verify accuracy against target standard', tone: 'indigo' as AccentTone },
      { step: '04', title: 'Final Output', detail: 'Deliver measurable, repeatable result', tone: 'emerald' as AccentTone },
    ];
  }, [scene.listItems, scene.timelineSteps]);

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="coral"
      fontFamily={bodyFont}
    >
      <SceneHeader
        categoryPill={categoryPill}
        heading={heading}
        supportingText={scene.supportingText}
        highlightedWords={scene.highlightedWords}
        headingFont={headingFont}
        bodyFont={bodyFont}
        tone="coral"
        sceneFrame={sceneFrame}
        palette={palette}
      />

      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1480px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: ds.layout.isVertical ? '16px' : '18px',
        }}
      >
        {nodes.map((node, idx) => {
          const itemSpring = ds.motion.stagger(idx, 6, 5);
          const isLast = idx === nodes.length - 1;
          const accent = ds.accents[node.tone];

          return (
            <React.Fragment key={idx}>
              <StudioCard
                tone={node.tone}
                topAccentBar
                elevated={isLast}
                palette={palette}
                progress={itemSpring}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: ds.layout.isVertical ? 'row' : 'column',
                  alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
                  gap: '16px',
                  padding: ds.layout.isVertical ? '22px 26px' : '28px 24px',
                }}
              >
                <StepNumberBadge
                  number={node.step}
                  tone={node.tone}
                  size={44}
                  palette={palette}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.09em',
                      color: accent.textOnSoft,
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    STAGE {idx + 1}
                  </div>
                  <h3
                    style={{
                      fontFamily: headingFont,
                      fontSize: `${ds.type.cardTitle.fontSize}px`,
                      fontWeight: ds.type.cardTitle.fontWeight,
                      lineHeight: ds.type.cardTitle.lineHeight,
                      color: ds.surface.textPrimary,
                      margin: node.detail ? '0 0 8px 0' : 0,
                    }}
                  >
                    {node.title}
                  </h3>
                  {node.detail && (
                    <p
                      style={{
                        fontSize: `${ds.type.bodyMd.fontSize}px`,
                        fontWeight: 500,
                        lineHeight: 1.42,
                        color: ds.surface.textSecondary,
                        margin: 0,
                      }}
                    >
                      {node.detail}
                    </p>
                  )}
                </div>
              </StudioCard>

              {!isLast && !ds.layout.isVertical && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: itemSpring,
                    flexShrink: 0,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke={ds.surface.textMuted}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </SceneCanvas>
  );
}
