import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import {
  CurvedRoadmapInfographic,
  CircularOrgChartInfographic,
  HorizontalShelvesInfographic,
  ScorecardDashboardInfographic,
  TableOfContentsInfographic,
  MissionVisionInfographic,
  MedicalInfographic,
} from '../../../components/infographics';
import { SceneCanvas } from '../components/DesignSystemPrimitives';

export interface InfographicSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

/**
 * Universal Infographic Scene for 16:9 Faceless Video.
 * Dispatches to one of the 7 PowerPoint/Keynote-grade animated infographic engines.
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
  const title = scene.heading || 'Strategic Overview';
  const subtitle = scene.supportingText || scene.categoryPill || '';

  // ── 1. Curved Serpentine Roadmap with Poles & Milestones ──
  if (
    layout.includes('roadmap') ||
    layout.includes('curved') ||
    layout.includes('milestone') ||
    layout === 'curved_roadmap'
  ) {
    const defaultMilestones = [
      { step: 1, quarterOrDate: 'Phase 01', title: 'Foundation & Setup', description: 'Core architecture and data baseline established.' },
      { step: 2, quarterOrDate: 'Phase 02', title: 'Acceleration Engine', description: 'Scale operations and automation workflows.', status: 'active' as const },
      { step: 3, quarterOrDate: 'Phase 03', title: 'Market Expansion', description: 'Multi-channel distribution and user growth.' },
      { step: 4, quarterOrDate: 'Phase 04', title: 'Global Leadership', description: 'Enterprise dominance and sustained ROI.', metric: '+142% ROI' },
    ];

    const milestones = (scene.timelineSteps && scene.timelineSteps.length >= 2)
      ? scene.timelineSteps.slice(0, 4).map((s, i) => ({
          step: i + 1,
          quarterOrDate: `Phase 0${i + 1}`,
          title: s.title || `Phase ${i + 1}`,
          description: s.detail,
        }))
      : defaultMilestones;

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

  // ── 2. Multi-Level Circular Organizational Chart / Orbit ──
  if (
    layout.includes('circular') ||
    layout.includes('org_chart') ||
    layout.includes('radial') ||
    layout === 'ecosystem'
  ) {
    const satellites = (scene.listItems && scene.listItems.length >= 2)
      ? scene.listItems.slice(0, 5).map((item, i) => {
          const parts = String(item).split(/[:•–-]/);
          return {
            id: `sat-${i}`,
            department: `Division 0${i + 1}`,
            title: parts[0]?.trim() || `Department ${i + 1}`,
            subtitle: parts[1]?.trim() || 'Core execution team',
          };
        })
      : [
          { id: '1', department: 'Leadership', title: 'Executive Strategy', subtitle: 'Global vision & capital allocation' },
          { id: '2', department: 'Product', title: 'AI Engineering', subtitle: 'Core platform & model systems' },
          { id: '3', department: 'Growth', title: 'Performance Marketing', subtitle: 'Customer acquisition & retention' },
          { id: '4', department: 'Operations', title: 'Scale & Logistics', subtitle: 'Automated delivery pipelines' },
        ];

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <CircularOrgChartInfographic
          title={title}
          subtitle={subtitle}
          centerNode={{
            title: scene.keyTakeaway || 'Central Core Engine',
            subtitle: 'Unified operational nexus',
            badge: 'CENTRAL HUB',
          }}
          satellites={satellites}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 3. Horizontal Shelves / Architectural Stack ──
  if (
    layout.includes('shelves') ||
    layout.includes('tier') ||
    layout.includes('stack') ||
    layout === 'horizontal_shelves'
  ) {
    const defaultTiers = [
      {
        id: 'tier-1',
        levelNumber: 1,
        name: 'Client Interface Layer',
        items: [{ id: '1', name: 'Web Studio' }, { id: '2', name: 'Mobile SDK' }, { id: '3', name: 'API Gateway', badge: 'v2.4' }],
      },
      {
        id: 'tier-2',
        levelNumber: 2,
        name: 'AI & Inference Engine',
        items: [{ id: '4', name: 'Groq Whisper' }, { id: '5', name: 'Gemini Flash' }, { id: '6', name: 'Remotion Lambda', badge: 'High Perf' }],
      },
      {
        id: 'tier-3',
        levelNumber: 3,
        name: 'Cloud Data & Asset Hub',
        items: [{ id: '7', name: 'Supabase DB' }, { id: '8', name: 'AWS S3 CDN' }, { id: '9', name: 'Cloudinary' }],
      },
    ];

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <HorizontalShelvesInfographic
          title={title}
          subtitle={subtitle}
          tiers={defaultTiers}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 4. Table of Contents / Modular Agenda ──
  if (layout.includes('agenda') || layout.includes('toc') || layout === 'table_of_contents') {
    const chapters = (scene.listItems && scene.listItems.length >= 2)
      ? scene.listItems.slice(0, 5).map((item, i) => ({
          number: i + 1,
          title: String(item).trim(),
          durationOrPages: `Section ${i + 1}`,
          isActive: i === 0,
        }))
      : [
          { number: 1, title: 'Strategic Thesis & Market Problem', durationOrPages: '00:00 - 01:15', isActive: true },
          { number: 2, title: 'The Core Technology Architecture', durationOrPages: '01:15 - 02:40' },
          { number: 3, title: 'Empirical Results & Comparative Benchmarks', durationOrPages: '02:40 - 03:55' },
          { number: 4, title: 'Actionable Implementation Framework', durationOrPages: '03:55 - 05:00' },
        ];

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <TableOfContentsInfographic
          title={title || 'Agenda & Table of Contents'}
          subtitle={subtitle}
          chapters={chapters}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 5. Mission & Vision Dual Strategic Pillars ──
  if (layout.includes('mission') || layout.includes('vision') || layout === 'mission_vision') {
    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <MissionVisionInfographic
          title={title}
          subtitle={subtitle}
          mission={{
            title: 'Our Mission',
            subtitle: 'PRESENT OPERATING PURPOSE',
            statement: scene.supportingText || 'Democratize studio-quality content creation through autonomous AI workflows.',
            tenets: ['Zero learning curve', 'Real-time cloud rendering', 'Radical cost efficiency'],
          }}
          vision={{
            title: 'Our Vision',
            subtitle: 'FUTURE HORIZON',
            statement: scene.keyTakeaway || 'Empower every digital creator and educator to build global reach effortlessly.',
            tenets: ['10x audience retention', 'Autonomous video generation', 'Universal accessibility'],
          }}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 6. Healthcare / Clinical Vitals Monitor ──
  if (layout.includes('medical') || layout.includes('clinical') || layout.includes('health')) {
    const vitals = [
      { id: '1', label: 'Heart Rate', value: '72', unit: 'BPM', status: 'NORMAL' as const, color: '#10B981', trend: 'Resting Baseline' },
      { id: '2', label: 'Blood Oxygen', value: '98', unit: '% SpO2', status: 'OPTIMAL' as const, color: '#0284C7', trend: 'Target Range' },
      { id: '3', label: 'Clinical Response', value: '94.2', unit: '%', status: 'ELEVATED' as const, color: '#8B5CF6', trend: 'Cohort Efficacy' },
      { id: '4', label: 'Dosage Adherence', value: '99', unit: '%', status: 'STABLE' as const, color: '#EA580C', trend: 'Day 45 Complete' },
    ];

    return (
      <SceneCanvas sceneFrame={sceneFrame} palette={palette} fontFamily={bodyFont}>
        <MedicalInfographic
          title={title}
          subtitle={subtitle}
          vitals={vitals}
          isDark={isDark}
          sceneFrame={sceneFrame}
        />
      </SceneCanvas>
    );
  }

  // ── 7. Default: Scorecard Dashboard Infographic ──
  const metrics = [
    { id: '1', label: 'Annual Growth Rate', value: '184', suffix: '%', trend: '+28.4%', trendDirection: 'up' as const, status: 'EXCEEDED' as const, progressPercent: 92 },
    { id: '2', label: 'Customer Retention', value: '96.2', suffix: '%', trend: '+4.1%', trendDirection: 'up' as const, status: 'OPTIMAL' as const, progressPercent: 88 },
    { id: '3', label: 'Production Cost Reduction', value: '72', suffix: '%', trend: '+15.0%', trendDirection: 'up' as const, status: 'ON TRACK' as const, progressPercent: 78 },
    { id: '4', label: 'Average Watch Time', value: '4.8', suffix: 'm', trend: '+32.2%', trendDirection: 'up' as const, status: 'EXCEEDED' as const, progressPercent: 85 },
  ];

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

