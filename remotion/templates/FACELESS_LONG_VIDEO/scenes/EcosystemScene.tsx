import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { type AccentTone, useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  SceneHeader,
  StepNumberBadge,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface EcosystemSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

const PILLAR_TONES: AccentTone[] = ['sky', 'indigo', 'amber', 'emerald'];

export function EcosystemScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: EcosystemSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const heading = scene.heading || 'CORE ECOSYSTEM ARCHITECTURE';
  const categoryPill = scene.categoryPill || 'SYSTEM ARCHITECTURE';

  const pillars = React.useMemo(() => {
    const rawItems =
      scene.listItems && scene.listItems.length >= 2
        ? scene.listItems
        : scene.supportingText
        ? scene.supportingText
            .split(/[•,\n;]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 2)
        : [
            'Core Strategy & Vision',
            'Repeatable Execution Engine',
            'Feedback & Analytics Loop',
            'Compounding Distribution',
          ];

    return rawItems.slice(0, 4).map((item, idx) => {
      const parts = String(item).split(/[:–-]/);
      return {
        number: String(idx + 1).padStart(2, '0'),
        title: (parts[0] || `Pillar ${idx + 1}`).trim(),
        detail: parts.slice(1).join(' ').trim() || 'Integrated system pillar',
        tone: PILLAR_TONES[idx % PILLAR_TONES.length],
      };
    });
  }, [scene.listItems, scene.supportingText]);

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

      {/* Responsive 2x2 Pillar Matrix (or 1-col in compact vertical if needed) */}
      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1280px',
          display: 'grid',
          gridTemplateColumns: ds.layout.isVertical ? '1fr' : 'repeat(2, minmax(0, 1fr))',
          gap: ds.layout.isVertical ? '16px' : '24px',
        }}
      >
        {pillars.map((pillar, idx) => {
          const cardSpring = ds.motion.stagger(idx, 6, 5);
          return (
            <StudioCard
              key={idx}
              tone={pillar.tone}
              topAccentBar
              palette={palette}
              progress={cardSpring}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '20px',
                padding: ds.layout.isVertical ? '22px 26px' : '26px 30px',
              }}
            >
              <StepNumberBadge
                number={pillar.number}
                tone={pillar.tone}
                size={48}
                palette={palette}
              />

              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '6px' }}>
                  <EyebrowPill
                    label={`PILLAR 0${idx + 1}`}
                    tone={pillar.tone}
                    palette={palette}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: headingFont,
                    fontSize: `${ds.type.cardTitle.fontSize}px`,
                    fontWeight: ds.type.cardTitle.fontWeight,
                    lineHeight: ds.type.cardTitle.lineHeight,
                    color: ds.surface.textPrimary,
                    margin: '6px 0 4px 0',
                  }}
                >
                  {pillar.title}
                </h3>
                {pillar.detail && pillar.detail !== pillar.title && (
                  <p
                    style={{
                      fontSize: `${ds.type.bodyMd.fontSize}px`,
                      fontWeight: 500,
                      color: ds.surface.textSecondary,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {pillar.detail}
                  </p>
                )}
              </div>
            </StudioCard>
          );
        })}
      </div>
    </SceneCanvas>
  );
}
