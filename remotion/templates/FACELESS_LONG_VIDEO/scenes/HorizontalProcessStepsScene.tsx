import React, { useMemo } from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { useVideoDesignSystem, type AccentTone } from '../designSystem';
import { SceneCanvas, SceneHeader, StudioCard, RelationshipArrow } from '../components/DesignSystemPrimitives';

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

function StepIcon({
  type,
  color = '#0284C7',
  size = 34,
}: {
  type: ProcessStepItem['iconType'];
  color?: string;
  size?: number;
}) {
  switch (type) {
    case 'lightbulb':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
          <path
            d="M24 6C16.268 6 10 12.268 10 20C10 24.8 12.5 28.9 16.5 31.4C17.5 32 18 33.2 18 34.4V36H30V34.4C30 33.2 30.5 32 31.5 31.4C35.5 28.9 38 24.8 38 20C38 12.268 31.732 6 24 6Z"
            fill={`${color}16`}
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M19 36H29M21 40H27" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 13V19M21 16H27" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'plan':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
          <rect
            x="10"
            y="8"
            width="28"
            height="32"
            rx="6"
            fill={`${color}16`}
            stroke={color}
            strokeWidth="2.5"
          />
          <path d="M17 18H31M17 24H31M17 30H24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="29" cy="30" r="2.5" fill={color} />
        </svg>
      );
    case 'gear':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
          <circle cx="24" cy="24" r="6" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
          <path
            d="M24 8V12M24 36V40M8 24H12M36 24H40M12.69 12.69L15.51 15.51M32.49 32.49L35.31 35.31M12.69 35.31L15.51 32.49M32.49 15.51L35.31 12.69"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
          <path
            d="M24 8C30 8 36 14 36 22C36 30 24 40 24 40C24 40 12 30 12 22C12 14 18 8 24 8Z"
            fill={`${color}16`}
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="20" r="4" fill={color} />
          <path d="M17 32L12 37M31 32L36 37" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'growth':
    default:
      return (
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
          <rect x="10" y="28" width="6" height="12" rx="2" fill={`${color}20`} stroke={color} strokeWidth="2" />
          <rect x="21" y="20" width="6" height="20" rx="2" fill={`${color}30`} stroke={color} strokeWidth="2" />
          <rect x="32" y="12" width="6" height="28" rx="2" fill={color} stroke={color} strokeWidth="2" />
          <path
            d="M10 22L22 14L34 8M34 8H26M34 8V16"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function HorizontalProcessStepsScene({
  scene,
  headingFont = 'Lora, "Playfair Display", Georgia, "Times New Roman", serif',
  bodyFont = 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: HorizontalProcessStepsSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration || 5,
    palette,
  });

  const { isVertical } = ds.layout;
  const headingText = scene.heading || 'Step-by-Step Execution Process';
  const supportingText = scene.supportingText || '';

  const steps: ProcessStepItem[] = useMemo(() => {
    const iconTypes: Array<ProcessStepItem['iconType']> = ['lightbulb', 'plan', 'gear', 'rocket', 'growth'];
    if (scene.timelineSteps && scene.timelineSteps.length >= 3) {
      return scene.timelineSteps.slice(0, isVertical ? 4 : 5).map((rawStep: any, idx: number) => {
        const stepObj = typeof rawStep === 'string' ? { title: rawStep, description: '' } : rawStep;
        return {
          number: `0${idx + 1}`,
          title: stepObj?.title || `Step ${idx + 1}`,
          description: stepObj?.description || stepObj?.label || 'Execute with structured focus.',
          iconType: iconTypes[idx % iconTypes.length],
          tone: STEP_TONES[idx % STEP_TONES.length],
        };
      });
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
      {/* ── Editorial Header: Clean, confident, broadcast-grade typography ── */}
      <SceneHeader
        categoryPill={scene.categoryPill || 'EXECUTION ROADMAP'}
        heading={headingText}
        supportingText={supportingText}
        highlightedWords={scene.highlightedWords}
        headingFont={headingFont}
        bodyFont={bodyFont}
        sceneFrame={sceneFrame || ds.localFrame}
        palette={palette}
        compact={!isVertical}
      />

      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.maxContentWidth,
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: isVertical ? '14px' : '14px',
        }}
      >
        {steps.map((step, idx) => {
          const itemSpring = ds.motion.stagger(idx, 5, 7);
          const accent = ds.accents[step.tone];
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={idx}>
              <StudioCard
                ds={ds}
                entranceProgress={itemSpring}
                padding={isVertical ? '20px 22px' : '32px 24px'}
                style={{
                  flex: 1,
                  width: isVertical ? '100%' : undefined,
                  display: 'flex',
                  flexDirection: isVertical ? 'row' : 'column',
                  alignItems: 'center',
                  textAlign: isVertical ? 'left' : 'center',
                  gap: isVertical ? 20 : 16,
                  backgroundColor: ds.surface.isDark
                    ? 'rgba(30, 41, 59, 0.5)'
                    : 'rgba(241, 245, 249, 0.7)',
                  border: 'none',
                  borderRadius: '24px',
                  boxShadow: 'none',
                }}
              >
                {/* Modern Numeric Step Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    backgroundColor: accent.SoftBg,
                    color: accent.solid,
                    fontFamily: headingFont,
                    fontSize: 14,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    flexShrink: 0,
                  }}
                >
                  STEP {step.number}
                </div>

                {/* Minimalist Duotone Vector Icon */}
                <div
                  style={{
                    width: isVertical ? 56 : 68,
                    height: isVertical ? 56 : 68,
                    borderRadius: '20px',
                    backgroundColor: accent.SoftBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <StepIcon type={step.iconType} color={accent.solid} size={isVertical ? 32 : 38} />
                </div>

                {/* Typography Hierarchy */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    flex: 1,
                    width: '100%',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: headingFont,
                      fontSize: 21,
                      fontWeight: 800,
                      letterSpacing: '-0.025em',
                      color: ds.surface.textPrimary,
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: bodyFont,
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: ds.surface.textSecondary,
                      margin: 0,
                      lineHeight: 1.48,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </StudioCard>

              {/* Semantic Progression Arrow */}
              {!isLast && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <RelationshipArrow
                    type="sequence"
                    direction={isVertical ? 'down' : 'right'}
                    tone={step.tone}
                    progress={itemSpring}
                    sceneFrame={sceneFrame || ds.localFrame}
                    size={isVertical ? 22 : 26}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </SceneCanvas>
  );
}

export default HorizontalProcessStepsScene;
