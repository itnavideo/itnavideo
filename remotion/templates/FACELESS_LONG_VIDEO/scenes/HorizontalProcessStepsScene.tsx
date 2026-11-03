import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { useVideoDesignSystem, type AccentTone } from '../designSystem';
import { SceneCanvas, SceneHeader, StudioCard } from '../components/DesignSystemPrimitives';

export interface HorizontalProcessStepsSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
  iconType: 'lightbulb' | 'plan' | 'gear' | 'rocket' | 'growth';
  tone: AccentTone;
}

const DEFAULT_5_STEPS: ProcessStepItem[] = [
  {
    number: '01',
    title: 'Research',
    description: 'Understand your market, audience, and core opportunities.',
    iconType: 'lightbulb',
    tone: 'sky',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'Set clear goals, build a strategy, and outline your roadmap.',
    iconType: 'plan',
    tone: 'indigo',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Bring your plan to life with focused tools and execution.',
    iconType: 'gear',
    tone: 'emerald',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'Go live, reach your audience, and validate real results.',
    iconType: 'rocket',
    tone: 'amber',
  },
  {
    number: '05',
    title: 'Scale',
    description: 'Measure performance, refine systems, and compound growth.',
    iconType: 'growth',
    tone: 'coral',
  },
];

const STEP_TONES: AccentTone[] = ['sky', 'indigo', 'emerald', 'amber', 'coral'];

function StepIcon({ type, size = 56 }: { type: ProcessStepItem['iconType']; size?: number }) {
  switch (type) {
    case 'lightbulb':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          <path d="M 40 8 L 40 2 M 18 16 L 12 10 M 62 16 L 68 10 M 10 38 L 4 38 M 70 38 L 76 38" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 28 44 C 20 34 22 20 34 12 C 44 6 56 12 60 22 C 62 28 58 36 54 44 L 54 52 L 28 52 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
          <path d="M 36 44 L 36 32 L 40 36 L 44 32 L 44 44" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="33" y="54" width="16" height="5" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
        </svg>
      );
    case 'plan':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          <rect x="18" y="10" width="44" height="60" rx="8" fill="#6366F1" stroke="#0F172A" strokeWidth="3" />
          <rect x="24" y="16" width="32" height="48" rx="5" fill="#EEF2FF" />
          <line x1="30" y1="26" x2="48" y2="26" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="36" x2="50" y2="36" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="46" x2="44" y2="46" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'gear':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          <path
            d="M 40 16 L 43 22 L 50 20 L 53 26 L 60 27 L 60 34 L 66 37 L 63 43 L 67 48 L 62 53 L 64 60 L 57 62 L 56 68 L 49 67 L 46 72 L 40 69 L 34 72 L 31 67 L 24 68 L 23 62 L 16 60 L 18 53 L 13 48 L 17 43 L 14 37 L 20 34 L 20 27 L 27 26 L 30 20 L 37 22 Z"
            fill="#10B981"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="45" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          <path d="M 28 58 L 22 68 L 32 64 L 38 72 L 40 60" fill="#EF4444" stroke="#F97316" strokeWidth="2.5" />
          <path d="M 32 54 C 28 40 38 22 56 12 C 60 30 52 48 38 54 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
          <circle cx="44" cy="30" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
        </svg>
      );
    case 'growth':
    default:
      return (
        <svg viewBox="0 0 80 80" width={size} height={size} style={{ overflow: 'visible' }}>
          <rect x="18" y="44" width="11" height="26" rx="3" fill="#A78BFA" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="34" y="32" width="11" height="38" rx="3" fill="#8B5CF6" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="50" y="18" width="11" height="52" rx="3" fill="#6D28D9" stroke="#0F172A" strokeWidth="2.5" />
          <path d="M 16 48 Q 36 34 64 12 M 52 12 L 66 12 L 66 26" stroke="#EC4899" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function HorizontalProcessStepsScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: HorizontalProcessStepsSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration || 5,
    palette,
    headingFont,
    bodyFont,
  });

  const { isVertical } = ds.layout;
  const headingText = scene.heading || 'Step-by-Step Execution Process';
  const supportingText = scene.supportingText || '';

  const steps: ProcessStepItem[] = React.useMemo(() => {
    const iconTypes: Array<ProcessStepItem['iconType']> = ['lightbulb', 'plan', 'gear', 'rocket', 'growth'];
    if (scene.timelineSteps && scene.timelineSteps.length >= 3) {
      return scene.timelineSteps.slice(0, isVertical ? 4 : 5).map((step, idx) => ({
        number: `0${idx + 1}`,
        title: step.title || `Step ${idx + 1}`,
        description: step.description || step.label || 'Execute with structured focus.',
        iconType: iconTypes[idx % iconTypes.length],
        tone: STEP_TONES[idx % STEP_TONES.length],
      }));
    }
    if (scene.listItems && scene.listItems.length >= 3) {
      return scene.listItems.slice(0, isVertical ? 4 : 5).map((item, idx) => {
        const parts = item.split(/[:•-]/);
        const title = (parts[0] || `Step ${idx + 1}`).trim();
        const description = (parts.slice(1).join(' ').trim() || parts[0] || 'Execute with precision.').trim();
        return {
          number: `0${idx + 1}`,
          title: title.length > 26 ? `${title.slice(0, 24)}…` : title,
          description,
          iconType: iconTypes[idx % iconTypes.length],
          tone: STEP_TONES[idx % STEP_TONES.length],
        };
      });
    }
    return isVertical ? DEFAULT_5_STEPS.slice(0, 4) : DEFAULT_5_STEPS;
  }, [scene.timelineSteps, scene.listItems, isVertical]);

  return (
    <SceneCanvas ds={ds}>
      <SceneHeader
        ds={ds}
        eyebrow="STEP-BY-STEP PROCESS"
        eyebrowTone="indigo"
        title={headingText}
        highlightWord={scene.highlightedWords?.[0]}
        subtitle={supportingText}
      />

      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.maxContentWidth,
          display: 'grid',
          gridTemplateColumns: isVertical ? '1fr' : `repeat(${steps.length}, 1fr)`,
          gap: ds.layout.cardGap,
          alignItems: 'stretch',
        }}
      >
        {steps.map((step, idx) => {
          const itemSpring = ds.motion.stagger(idx, 5, 7);
          const accent = ds.accents[step.tone];

          return (
            <StudioCard
              key={idx}
              ds={ds}
              entranceProgress={itemSpring}
              topAccentBar={accent.solid}
              padding={isVertical ? '22px 26px' : '28px 22px'}
              style={{
                flexDirection: isVertical ? 'row' : 'column',
                alignItems: 'center',
                textAlign: isVertical ? 'left' : 'center',
                gap: isVertical ? 20 : 14,
              }}
            >
              {/* Step Number Pill */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: accent.solid,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: ds.type.fontHeading,
                  fontSize: 18,
                  fontWeight: 900,
                  flexShrink: 0,
                  boxShadow: `0 6px 16px ${accent.solid}35`,
                }}
              >
                {step.number}
              </div>

              {/* Vector Illustration */}
              <div
                style={{
                  width: isVertical ? 56 : 68,
                  height: isVertical ? 56 : 68,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <StepIcon type={step.iconType} size={isVertical ? 50 : 62} />
              </div>

              {/* Copy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <h3
                  style={{
                    fontFamily: ds.type.fontHeading,
                    fontSize: ds.type.cardTitle.fontSize,
                    fontWeight: ds.type.cardTitle.fontWeight,
                    color: ds.surface.textPrimary,
                    margin: 0,
                    lineHeight: ds.type.cardTitle.lineHeight,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: ds.type.fontBody,
                    fontSize: ds.type.bodyMd.fontSize - 1,
                    fontWeight: 500,
                    color: ds.surface.textSecondary,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </StudioCard>
          );
        })}
      </div>
    </SceneCanvas>
  );
}
export default HorizontalProcessStepsScene;
