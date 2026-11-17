import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { HookTypographyScene } from './scenes/HookTypographyScene';
import { StatScene } from './scenes/StatScene';
import { ComparisonScene } from './scenes/ComparisonScene';
import { CardConceptScene } from './scenes/CardConceptScene';
import { ListScene } from './scenes/ListScene';
import { HorizontalProcessStepsScene } from './scenes/HorizontalProcessStepsScene';
import { WorkflowScene } from './scenes/WorkflowScene';
import { RoadmapScene } from './scenes/RoadmapScene';
import { ChartScene } from './scenes/ChartScene';
import { OutroScene } from './scenes/OutroScene';
import Background from '../../components/backgrounds/Background';
import type { SceneBlueprintItem } from '../../../services/ai/sceneBlueprintTypes';

const FIXTURES: Array<{ id: string; name: string; scene: SceneBlueprintItem }> = [
  {
    id: 'hook',
    name: '01. HookTypographyScene',
    scene: {
      sceneNumber: 1,
      duration: 3,
      sceneType: 'hook',
      layoutType: 'hook',
      heading: 'SAVE THOUSANDS ON DELIVERY',
      supportingText: 'Eliminate expensive in-house driver payroll and fleet overhead.',
      categoryPill: 'THE DELIVERY REVOLUTION',
      highlightedWords: ['THOUSANDS'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Imagine running a restaurant where you do not have to spend thousands hiring drivers.',
        startSeconds: 0,
        endSeconds: 3,
      },
    },
  },
  {
    id: 'stat',
    name: '02. StatScene',
    scene: {
      sceneNumber: 2,
      duration: 3,
      sceneType: 'example_stat',
      layoutType: 'stat_card',
      heading: 'Average Annual Fleet Savings',
      supportingText: 'Significant cost reductions across all participating locations.',
      statValue: '$10,000+',
      statLabel: 'Operational Cost Reduction',
      statTrend: 'up',
      categoryPill: 'KEY METRIC',
      highlightedWords: ['$10,000+'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Restaurants save thousands by tapping into on-demand delivery networks.',
        startSeconds: 3,
        endSeconds: 6,
      },
    },
  },
  {
    id: 'comparison',
    name: '03. ComparisonScene',
    scene: {
      sceneNumber: 3,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'comparison',
      heading: 'IN-HOUSE FLEET VS ON-DEMAND',
      supportingText: 'Compare fixed fleet expenses with flexible on-demand delivery.',
      categoryPill: 'SIDE-BY-SIDE BREAKDOWN',
      comparisonItems: {
        left: 'In-House Fleet • Paying full-time salaries • Managing vehicle maintenance • Fixed operational liabilities',
        right: 'DoorDash Drive • Zero fixed overhead • Automated driver dispatch • Pay only per completed order',
      },
      highlightedWords: ['COMPARISON'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Instead of hiring full-time drivers, managing vehicles, and paying salaries, restaurants request on demand.',
        startSeconds: 6,
        endSeconds: 9,
      },
    },
  },
  {
    id: 'cards',
    name: '04. CardConceptScene',
    scene: {
      sceneNumber: 4,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'card_concept',
      heading: 'THREE CORE ADVANTAGES',
      supportingText: 'Fewer staffing expenses, lower operational overhead, and no delivery fleet.',
      categoryPill: 'CORE BENEFITS',
      highlightedWords: ['ADVANTAGES'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'This means fewer staffing expenses, lower operational overhead, and no need to maintain a delivery fleet.',
        startSeconds: 9,
        endSeconds: 12,
      },
    },
  },
  {
    id: 'list',
    name: '05. ListScene',
    scene: {
      sceneNumber: 5,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'checklist',
      heading: 'WHAT YOUR RESTAURANT GAINS',
      supportingText: 'Full suite of direct ordering benefits.',
      categoryPill: 'SYSTEM CHECKLIST',
      listItems: [
        'Orders from your own website & apps',
        'Direct automated driver dispatch',
        'Zero fleet maintenance or vehicle insurance',
        'Full customer relationship retention',
      ],
      highlightedWords: ['GAINS'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Orders placed through your websites and apps are fulfilled seamlessly without managing deliveries.',
        startSeconds: 12,
        endSeconds: 15,
      },
    },
  },
  {
    id: 'process',
    name: '06. HorizontalProcessStepsScene',
    scene: {
      sceneNumber: 6,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'horizontal_process',
      heading: '5-STEP AUTOMATED FLOW',
      supportingText: 'From customer checkout to doorstep arrival in minutes.',
      categoryPill: 'WORKFLOW PIPELINE',
      listItems: [
        '1. Customer Orders',
        '2. Kitchen Prepares',
        '3. Driver Dispatched',
        '4. Live Tracking',
        '5. Seamless Delivery',
      ],
      highlightedWords: ['AUTOMATED'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Whenever an order arrives, a delivery driver is dispatched automatically in five seamless steps.',
        startSeconds: 15,
        endSeconds: 18,
      },
    },
  },
  {
    id: 'workflow',
    name: '07. WorkflowScene',
    scene: {
      sceneNumber: 7,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'workflow',
      heading: 'DIRECT ORDERING ARCHITECTURE',
      supportingText: 'Your Branded Channels ➔ DoorDash Delivery Fleet ➔ Customer Doorstep',
      categoryPill: 'END-TO-END SYSTEM',
      highlightedWords: ['ARCHITECTURE'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'DoorDash Drive connects your direct ordering channels to a nationwide fleet network.',
        startSeconds: 18,
        endSeconds: 21,
      },
    },
  },
  {
    id: 'chart',
    name: '08. ChartScene',
    scene: {
      sceneNumber: 8,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'data_visualization',
      heading: 'OPERATIONAL SAVINGS IMPACT',
      supportingText: 'Measurable reductions across recurring delivery costs.',
      categoryPill: 'DATA INTELLIGENCE',
      chartItems: [
        { label: 'Staffing Savings', value: 45, formattedValue: '45%' },
        { label: 'Fleet Overhead', value: 35, formattedValue: '35%' },
        { label: 'Speed Boost', value: 20, formattedValue: '20%' },
      ],
      highlightedWords: ['IMPACT'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Potential savings on the costs of running an in-house delivery team exceed thirty percent.',
        startSeconds: 21,
        endSeconds: 24,
      },
    },
  },
  {
    id: 'roadmap',
    name: '09. RoadmapScene',
    scene: {
      sceneNumber: 9,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'roadmap',
      heading: 'THE EXPANSION ROADMAP',
      supportingText: 'Strategic implementation milestones for restaurants.',
      categoryPill: 'STRATEGIC PHASES',
      listItems: [
        'Phase 1: Launch Direct Web Orders',
        'Phase 2: Connect On-Demand API',
        'Phase 3: Maximize Kitchen Margins',
      ],
      highlightedWords: ['ROADMAP'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Restaurants can scale their business in structured phases without taking on delivery debt.',
        startSeconds: 24,
        endSeconds: 27,
      },
    },
  },
  {
    id: 'outro',
    name: '10. OutroScene',
    scene: {
      sceneNumber: 10,
      duration: 3,
      sceneType: 'main_point',
      layoutType: 'creator_celebration',
      heading: 'FOCUS ON GREAT FOOD',
      supportingText: 'Let automated networks handle your deliveries while you grow your business.',
      categoryPill: 'FINAL TAKEAWAY',
      highlightedWords: ['FOOD'],
      visualAssetRequirement: 'none',
      background: 'solid-white',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Plus Jakarta Sans' },
      animation: 'pop_in',
      SFX: 'none',
      transition: 'cut',
      narrationSegment: {
        text: 'Restaurants can focus resources on preparing great food instead of managing deliveries.',
        startSeconds: 27,
        endSeconds: 30,
      },
    },
  },
];

export const LayoutGallery: React.FC = () => {
  const FRAMES_PER_LAYOUT = 90; // 3 seconds @ 30fps

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFFFFF' }}>
      <Background theme="solid-white" />

      {FIXTURES.map((fixture, idx) => {
        const from = idx * FRAMES_PER_LAYOUT;

        return (
          <Sequence key={fixture.id} from={from} durationInFrames={FRAMES_PER_LAYOUT}>
            <AbsoluteFill>
              {/* Layout Label Badge at top */}
              <div
                style={{
                  position: 'absolute',
                  top: 28,
                  left: 48,
                  zIndex: 100,
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  color: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
              >
                {fixture.name}
              </div>

              {/* Render Layout Fixture */}
              {fixture.id === 'hook' && (
                <HookTypographyScene scene={fixture.scene} />
              )}
              {fixture.id === 'stat' && (
                <StatScene scene={fixture.scene} />
              )}
              {fixture.id === 'comparison' && (
                <ComparisonScene scene={fixture.scene} />
              )}
              {fixture.id === 'cards' && (
                <CardConceptScene scene={fixture.scene} />
              )}
              {fixture.id === 'list' && (
                <ListScene scene={fixture.scene} />
              )}
              {fixture.id === 'process' && (
                <HorizontalProcessStepsScene scene={fixture.scene} />
              )}
              {fixture.id === 'workflow' && (
                <WorkflowScene scene={fixture.scene} />
              )}
              {fixture.id === 'chart' && (
                <ChartScene scene={fixture.scene} />
              )}
              {fixture.id === 'roadmap' && (
                <RoadmapScene scene={fixture.scene} />
              )}
              {fixture.id === 'outro' && (
                <OutroScene scene={fixture.scene} creatorHandle="DoorDashDrive" />
              )}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
