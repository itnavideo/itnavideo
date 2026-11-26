import React, { useMemo } from 'react';
import { interpolate, spring } from 'remotion';
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

function parseStepHeadingAndDetail(raw: string, idx: number): { title: string; description: string } {
  const cleaned = String(raw || '')
    .replace(/^(?:step|stage|phase)\s*\d+\s*[:.\-–—]?\s*/i, '')
    .replace(/^\d+\s*[.):\-–—]\s*/, '')
    .trim();

  if (!cleaned) {
    return { title: `Key Action ${idx + 1}`, description: '' };
  }

  const sepMatch = cleaned.match(/^([^:•–—]{3,42})[:•–—]\s*(.+)$/);
  if (sepMatch) {
    return {
      title: sepMatch[1].trim(),
      description: sepMatch[2].trim(),
    };
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= 5) {
    return { title: cleaned, description: '' };
  }
  return {
    title: words.slice(0, 4).join(' '),
    description: words.slice(4).join(' '),
  };
}

function computeVoiceoverStepRevealFrames(
  scene: SceneBlueprintItem,
  stepCount: number,
  totalFrames: number,
  fps = 30,
  stepTitles: string[] = []
): number[] {
  const seg = scene.narrationSegment as { startSeconds?: number; words?: Array<{ word?: string; start?: number }> } | undefined;
  const words = Array.isArray(seg?.words) ? seg.words : [];
  const sceneStartSec = Number(seg?.startSeconds ?? (words[0]?.start ?? 0));
  const safeTotal = Math.max(45, totalFrames);

  // Evenly spaced voiceover timeline fallback (Step 1 at ~0s, Step 2 at ~33%, Step 3 at ~65%)
  const defaultFrames = Array.from({ length: stepCount }, (_, idx) =>
    idx === 0 ? 4 : Math.round((idx / stepCount) * (safeTotal * 0.82))
  );

  if (words.length < 3 || stepCount <= 1) {
    return defaultFrames;
  }

  const matched = [...defaultFrames];
  let searchFromIdx = 0;

  for (let i = 0; i < stepCount; i++) {
    if (i === 0) {
      matched[0] = 4;
      continue;
    }
    const keywords = String(stepTitles[i] || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4);

    let foundFrame: number | null = null;
    for (let wIdx = searchFromIdx; wIdx < words.length; wIdx++) {
      const spoken = String(words[wIdx]?.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (spoken && keywords.some((kw) => spoken.includes(kw) || kw.includes(spoken))) {
        const relSec = Math.max(0, Number(words[wIdx].start) - sceneStartSec);
        const candidateFrame = Math.round(relSec * fps);
        if (candidateFrame > matched[i - 1] + 12 && candidateFrame < safeTotal - 10) {
          foundFrame = candidateFrame;
          searchFromIdx = wIdx + 1;
          break;
        }
      }
    }

    if (foundFrame !== null) {
      matched[i] = foundFrame;
    } else {
      matched[i] = Math.max(matched[i - 1] + 18, defaultFrames[i]);
    }
  }

  return matched;
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
    if (scene.timelineSteps && scene.timelineSteps.length >= 2) {
      return scene.timelineSteps.slice(0, isVertical ? 4 : 5).map((rawStep: any, idx: number) => {
        if (typeof rawStep === 'string') {
          const parsed = parseStepHeadingAndDetail(rawStep, idx);
          return {
            number: `0${idx + 1}`,
            title: parsed.title,
            description: parsed.description,
            iconType: iconTypes[idx % iconTypes.length],
            tone: STEP_TONES[idx % STEP_TONES.length],
          };
        }
        const rawTitle = String(rawStep?.title || '').trim();
        const rawDesc = String(rawStep?.description || rawStep?.detail || rawStep?.label || '').trim();
        const isGenericTitle = /^(?:step|stage|phase)\s*\d*$/i.test(rawTitle);
        const parsed = isGenericTitle && rawDesc
          ? parseStepHeadingAndDetail(rawDesc, idx)
          : parseStepHeadingAndDetail(rawTitle || rawDesc, idx);
        return {
          number: `0${idx + 1}`,
          title: parsed.title,
          description: isGenericTitle ? parsed.description : (rawDesc && rawDesc !== parsed.title ? rawDesc : parsed.description),
          iconType: iconTypes[idx % iconTypes.length],
          tone: STEP_TONES[idx % STEP_TONES.length],
        };
      });
    }
    if (scene.listItems && scene.listItems.length >= 2) {
      return scene.listItems.slice(0, isVertical ? 4 : 5).map((item, idx) => {
        const parsed = parseStepHeadingAndDetail(item, idx);
        return {
          number: `0${idx + 1}`,
          title: parsed.title,
          description: parsed.description,
          iconType: iconTypes[idx % iconTypes.length],
          tone: STEP_TONES[idx % STEP_TONES.length],
        };
      });
    }
    // Derive dynamic steps from actual narration / supporting text (never copy-paste static defaults)
    const narrationSource = String(scene.narrationSegment?.text || scene.supportingText || scene.heading || '').trim();
    if (narrationSource) {
      const clauses = narrationSource
        .split(/(?:\b(?:first|second|third|fourth|next|then|finally)\b[:,.-]?|[,;•]|(?:\s+and\s+))/i)
        .map((p) => p.replace(/[.!?]+$/g, '').trim())
        .filter((p) => p.split(/\s+/).length >= 2);
      const dynamicList = clauses.length >= 2 ? clauses.slice(0, 4) : (() => {
        const words = narrationSource.split(/\s+/).filter(Boolean);
        const stepSize = Math.max(2, Math.ceil(words.length / 3));
        const out: string[] = [];
        for (let i = 0; i < words.length; i += stepSize) {
          out.push(words.slice(i, i + stepSize).join(' ').replace(/[.!?]+$/g, ''));
        }
        return out.slice(0, 3);
      })();
      if (dynamicList.length >= 2) {
        return dynamicList.map((item, idx) => {
          const parsed = parseStepHeadingAndDetail(item, idx);
          return {
            number: `0${idx + 1}`,
            title: parsed.title,
            description: parsed.description,
            iconType: iconTypes[idx % iconTypes.length],
            tone: STEP_TONES[idx % STEP_TONES.length],
          };
        });
      }
    }
    return DEFAULT_5_STEPS.slice(0, 3);
  }, [scene.timelineSteps, scene.listItems, scene.narrationSegment?.text, scene.supportingText, scene.heading, isVertical]);

  const revealFrames = useMemo(
    () =>
      computeVoiceoverStepRevealFrames(
        scene,
        steps.length,
        ds.totalFrames,
        ds.fps,
        steps.map((s) => s.title)
      ),
    [scene, steps, ds.totalFrames, ds.fps]
  );

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration || 5}
      palette={palette}
      fontFamily={bodyFont}
    >
      {/* ── Editorial Header ── */}
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
          maxWidth: isVertical ? '960px' : '1680px',
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: isVertical ? '10px' : '8px',
        }}
      >
        {steps.map((step, idx) => {
          const revealFrame = revealFrames[idx] ?? 4;
          const nextRevealFrame = revealFrames[idx + 1] ?? ds.totalFrames + 100;
          const hasEntered = ds.localFrame >= revealFrame;
          const isCurrent = hasEntered && ds.localFrame < nextRevealFrame;
          const itemSpring = hasEntered
            ? spring({
                frame: Math.max(0, ds.localFrame - revealFrame),
                fps: ds.fps || 30,
                config: { damping: 16, stiffness: 120 },
              })
            : 0;
          const accent = ds.accents[step.tone];
          const isLast = idx === steps.length - 1;
          const arrowRevealFrame = revealFrames[idx + 1] ? Math.max(revealFrame + 6, revealFrames[idx + 1] - 6) : revealFrame + 10;
          const arrowSpring =
            ds.localFrame >= arrowRevealFrame
              ? spring({
                  frame: Math.max(0, ds.localFrame - arrowRevealFrame),
                  fps: ds.fps || 30,
                  config: { damping: 16, stiffness: 120 },
                })
              : 0;

          return (
            <React.Fragment key={idx}>
              <StudioCard
                tone={step.tone}
                palette={palette}
                progress={itemSpring}
                style={{
                  flex: 1,
                  width: isVertical ? '100%' : undefined,
                  minHeight: isVertical ? undefined : '350px',
                  padding: isVertical ? '24px 28px' : '40px 30px',
                  display: 'flex',
                  flexDirection: isVertical ? 'row' : 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: isVertical ? 'left' : 'center',
                  gap: isVertical ? 20 : 20,
                  backgroundColor: ds.surface.isDark
                    ? isCurrent
                      ? 'rgba(30, 41, 59, 0.72)'
                      : 'rgba(30, 41, 59, 0.42)'
                    : isCurrent
                    ? 'rgba(241, 245, 249, 0.92)'
                    : 'rgba(241, 245, 249, 0.65)',
                  border: isCurrent ? `2px solid ${accent.border}` : 'none',
                  borderRadius: '26px',
                  boxShadow: 'none',
                }}
              >
                {/* Modern Numeric Step Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '7px 18px',
                    borderRadius: '9999px',
                    backgroundColor: accent.SoftBg,
                    color: accent.solid,
                    fontFamily: headingFont,
                    fontSize: 15,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    flexShrink: 0,
                  }}
                >
                  STEP {step.number}
                </div>

                {/* Minimalist Duotone Vector Icon */}
                <div
                  style={{
                    width: isVertical ? 68 : 84,
                    height: isVertical ? 68 : 84,
                    borderRadius: '22px',
                    backgroundColor: accent.SoftBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <StepIcon type={step.iconType} color={accent.solid} size={isVertical ? 38 : 48} />
                </div>

                {/* Typography Hierarchy */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    flex: isVertical ? 1 : undefined,
                    width: '100%',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: headingFont,
                      fontSize: isVertical ? 26 : 30,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: ds.surface.textPrimary,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p
                      style={{
                        fontFamily: bodyFont,
                        fontSize: isVertical ? 18 : 19,
                        fontWeight: 400,
                        color: ds.surface.textSecondary,
                        margin: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </StudioCard>

              {/* Tight Progression Arrow */}
              {!isLast && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    opacity: arrowSpring,
                    transform: `scale(${interpolate(arrowSpring, [0, 1], [0.7, 1])})`,
                  }}
                >
                  <RelationshipArrow
                    type="sequence"
                    direction={isVertical ? 'down' : 'right'}
                    tone={step.tone}
                    progress={arrowSpring}
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
