import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { resolveFont } from '../../../utils/fonts';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { type AccentTone, useVideoDesignSystem } from '../designSystem';
import {
  SceneCanvas,
  SceneHeader,
  StepNumberBadge,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface ListSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

const ITEM_TONES: AccentTone[] = ['coral', 'indigo', 'emerald', 'amber', 'sky'];

export function ListScene({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Inter',
  sceneFrame,
  palette,
}: ListSceneProps) {
  const resolvedHeadingFont = resolveFont(headingFont);
  const resolvedBodyFont = resolveFont(bodyFont);

  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const heading = scene.heading || 'KEY ACTIONABLE TAKEAWAYS';
  const categoryPill = scene.categoryPill || 'KEY TAKEAWAYS';

  const items = React.useMemo(() => {
    const rawItems =
      scene.listItems && scene.listItems.length >= 2
        ? scene.listItems
        : scene.supportingText
        ? scene.supportingText
            .split(/[•,\n;]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 2)
        : ['Clarify the core objective', 'Execute with a repeatable system', 'Measure and compound results'];
    return rawItems.slice(0, 4);
  }, [scene.listItems, scene.supportingText]);

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="coral"
      fontFamily={resolvedBodyFont}
    >
      <SceneHeader
        categoryPill={categoryPill}
        heading={heading}
        highlightedWords={scene.highlightedWords}
        headingFont={resolvedHeadingFont}
        bodyFont={resolvedBodyFont}
        tone="coral"
        sceneFrame={sceneFrame}
        palette={palette}
      />

      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '960px' : '1480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {items.map((item, idx) => {
          const itemSpring = ds.motion.stagger(idx, 8, 5);
          const tone = ITEM_TONES[idx % ITEM_TONES.length];

          return (
            <StudioCard
              key={idx}
              tone={tone}
              palette={palette}
              progress={itemSpring}
              translateXFrom={32}
              translateYFrom={0}
              style={{
                padding: ds.layout.isVertical ? '18px 24px' : '20px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                backgroundColor: ds.surface.isDark
                  ? 'rgba(30, 41, 59, 0.45)'
                  : 'rgba(241, 245, 249, 0.65)',
                borderRadius: '20px',
              }}
            >
              <StepNumberBadge
                number={idx + 1}
                tone={tone}
                size={52}
                palette={palette}
              />

              <span
                style={{
                  fontFamily: resolvedBodyFont,
                  fontSize: `${ds.type.bodyLg.fontSize}px`,
                  fontWeight: 700,
                  color: ds.surface.textPrimary,
                  lineHeight: 1.4,
                }}
              >
                {item}
              </span>
            </StudioCard>
          );
        })}
      </div>
    </SceneCanvas>
  );
}
