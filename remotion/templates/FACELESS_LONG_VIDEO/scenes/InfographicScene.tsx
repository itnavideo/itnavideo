import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import {
  CurvedRoadmapInfographic,
  CircularOrgChartInfographic,
  HorizontalShelvesInfographic,
  ScorecardDashboardInfographic,
  TableOfContentsInfographic,
} from '../../../components/infographics';
import { SceneCanvas } from '../components/DesignSystemPrimitives';
import { CardConceptScene } from './CardConceptScene';

export interface InfographicSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

/**
 * Script-Accurate Infographic Scene for 16:9 Faceless Video.
 * Strict Truthfulness Guard: ONLY renders an infographic if real script-derived
 * steps, list items, or chart metrics exist on the scene — NEVER renders
 * hardcoded corporate placeholder jargon. Otherwise falls back to CardConceptScene.
 */
export function InfographicScene({
  scene,
  headingFont,
  bodyFont,
  sceneFrame,
  palette,
}: InfographicSceneProps) {
  const isDark = palette?.isDark === true;
  const layout = (typeof scene.layoutType === 'string' ? scene.layoutType : '').toLowerCase();
  const title = scene.heading || 'Key Insight';
  const subtitle = scene.supportingText || scene.categoryPill || '';

  const renderAccurateFallback = () => (
    <CardConceptScene
      scene={scene}
      headingFont={headingFont}
      bodyFont={bodyFont}
      sceneFrame={sceneFrame}
      palette={palette as any}
    />
  );

  // ── 1. Curved Serpentine Roadmap (ONLY with real timelineSteps / listItems) ──
  if (
    layout.includes('roadmap') ||
    layout.includes('curved') ||
    layout.includes('milestone') ||
    layout === 'curved_roadmap'
  ) {
    const rawSteps = (scene.timelineSteps && scene.timelineSteps.length >= 2)
      ? scene.timelineSteps
      : (scene.listItems && scene.listItems.length >= 2 ? scene.listItems : null);

    if (!rawSteps) return renderAccurateFallback();

    const milestones = rawSteps.slice(0, 4).map((s: any, i: number) => {
      const text = typeof s === 'string' ? s : String(s?.title || s?.detail || '');
      const parts = text.split(/[:–-]/);
      return {
        step: i + 1,
        quarterOrDate: `Step 0${i + 1}`,
        title: (parts[0] || text).trim() || `Step ${i + 1}`,
        description: parts.slice(1).join(' ').trim() || text.trim(),
        status: i === 1 ? ('active' as const) : undefined,
      };
    });

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <CurvedRoadmapInfographic
          title={title}
          subtitle={subtitle}
          milestones={milestones}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 2. Circular Org / Hub Chart (ONLY with real listItems) ──
  if (
    layout.includes('circular') ||
    layout.includes('org_chart') ||
    layout.includes('radial') ||
    layout === 'ecosystem'
  ) {
    if (!scene.listItems || scene.listItems.length < 2) {
      return renderAccurateFallback();
    }
    const satellites = scene.listItems.slice(0, 5).map((item, i) => {
      const parts = String(item).split(/[:•–-]/);
      return {
        id: `sat-${i}`,
        department: `Point 0${i + 1}`,
        title: parts[0]?.trim() || String(item).trim(),
        subtitle: parts[1]?.trim() || '',
      };
    });

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <CircularOrgChartInfographic
          title={title}
          subtitle={subtitle}
          centerNode={{
            title,
            subtitle,
            badge: 'CORE TOPIC',
          }}
          satellites={satellites}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 3. Horizontal Shelves (ONLY with real listItems) ──
  if (
    layout.includes('shelves') ||
    layout.includes('tier') ||
    layout.includes('stack') ||
    layout === 'horizontal_shelves'
  ) {
    if (!scene.listItems || scene.listItems.length < 2) {
      return renderAccurateFallback();
    }
    const tiers = scene.listItems.slice(0, 3).map((item, idx) => ({
      id: `tier-${idx + 1}`,
      levelNumber: idx + 1,
      name: String(item).trim(),
      items: [{ id: `item-${idx + 1}`, name: String(item).trim() }],
    }));

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <HorizontalShelvesInfographic
          title={title}
          subtitle={subtitle}
          tiers={tiers}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 4. Table of Contents / Agenda (ONLY with real listItems) ──
  if (layout.includes('agenda') || layout.includes('toc') || layout === 'table_of_contents') {
    if (!scene.listItems || scene.listItems.length < 2) {
      return renderAccurateFallback();
    }
    const chapters = scene.listItems.slice(0, 5).map((item, i) => ({
      number: i + 1,
      title: String(item).trim(),
      durationOrPages: `Part ${i + 1}`,
      isActive: i === 0,
    }));

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <TableOfContentsInfographic
          title={title}
          subtitle={subtitle}
          chapters={chapters}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 5. Scorecard Dashboard (ONLY with real chartItems) ──
  if (scene.chartItems && scene.chartItems.length >= 2) {
    const metrics = scene.chartItems.slice(0, 4).map((c, idx) => ({
      id: String(idx + 1),
      label: c.label,
      value: String(c.formattedValue || c.value),
      progressPercent: Math.min(100, Math.max(15, Number(c.value) || 60)),
    }));
    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <ScorecardDashboardInfographic
          title={title}
          subtitle={subtitle}
          metrics={metrics}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  return renderAccurateFallback();
}
