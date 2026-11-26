import React from 'react';
import { interpolate, spring } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { type AccentTone, useVideoDesignSystem } from '../designSystem';
import {
  RelationshipArrow,
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
    const cleanStep = (raw: string, fallbackIdx: number) => {
      const stripped = String(raw || '')
        .replace(/^(?:step|stage|phase)\s*\d+\s*[:.\-–—]?\s*/i, '')
        .replace(/^\d+\s*[.):\-–—]\s*/, '')
        .trim();
      const parts = stripped.split(/[:•–—]/);
      if (parts.length >= 2) {
        return { title: parts[0].trim(), detail: parts.slice(1).join(' ').trim() };
      }
      const words = stripped.split(/\s+/).filter(Boolean);
      if (words.length <= 5) {
        return { title: stripped || `Key Action ${fallbackIdx + 1}`, detail: '' };
      }
      return { title: words.slice(0, 4).join(' '), detail: words.slice(4).join(' ') };
    };

    if (scene.timelineSteps && scene.timelineSteps.length >= 2) {
      return scene.timelineSteps.slice(0, 4).map((step: any, i: number) => {
        if (typeof step === 'string') {
          const parsed = cleanStep(step, i);
          return { step: String(i + 1).padStart(2, '0'), ...parsed, tone: NODE_TONES[i % NODE_TONES.length] };
        }
        const rawTitle = String(step?.title || '').trim();
        const rawDetail = String(step?.detail || step?.description || '').trim();
        const isGeneric = /^(?:step|stage|phase)\s*\d*$/i.test(rawTitle);
        const parsed = isGeneric && rawDetail ? cleanStep(rawDetail, i) : cleanStep(rawTitle || rawDetail, i);
        return {
          step: String(i + 1).padStart(2, '0'),
          title: parsed.title,
          detail: isGeneric ? parsed.detail : (rawDetail && rawDetail !== parsed.title ? rawDetail : parsed.detail),
          tone: NODE_TONES[i % NODE_TONES.length],
        };
      });
    }
    if (scene.listItems && scene.listItems.length >= 2) {
      return scene.listItems.slice(0, 4).map((item, i) => {
        const parsed = cleanStep(item, i);
        return {
          step: String(i + 1).padStart(2, '0'),
          title: parsed.title,
          detail: parsed.detail,
          tone: NODE_TONES[i % NODE_TONES.length],
        };
      });
    }
    return [
      { step: '01', title: 'Input & Trigger', detail: 'Capture core signal and context', tone: 'sky' as AccentTone },
      { step: '02', title: 'Core Processing', detail: 'Apply structured rules and analysis', tone: 'coral' as AccentTone },
      { step: '03', title: 'Final Output', detail: 'Deliver measurable, repeatable result', tone: 'emerald' as AccentTone },
    ];
  }, [scene.listItems, scene.timelineSteps]);

  const revealFrames = React.useMemo(() => {
    const seg = scene.narrationSegment as { startSeconds?: number; words?: Array<{ word?: string; start?: number }> } | undefined;
    const words = Array.isArray(seg?.words) ? seg.words : [];
    const sceneStartSec = Number(seg?.startSeconds ?? (words[0]?.start ?? 0));
    const safeTotal = Math.max(45, ds.totalFrames);
    const defaults = nodes.map((_, idx) => (idx === 0 ? 4 : Math.round((idx / nodes.length) * (safeTotal * 0.8))));
    if (words.length < 3 || nodes.length <= 1) return defaults;
    const matched = [...defaults];
    let searchIdx = 0;
    for (let i = 1; i < nodes.length; i++) {
      const kws = nodes[i].title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length >= 4);
      let found: number | null = null;
      for (let w = searchIdx; w < words.length; w++) {
        const sp = String(words[w]?.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (sp && kws.some((k) => sp.includes(k) || k.includes(sp))) {
          const cf = Math.round(Math.max(0, Number(words[w].start) - sceneStartSec) * (ds.fps || 30));
          if (cf > matched[i - 1] + 12 && cf < safeTotal - 10) {
            found = cf;
            searchIdx = w + 1;
            break;
          }
        }
      }
      matched[i] = found !== null ? found : Math.max(matched[i - 1] + 18, defaults[i]);
    }
    return matched;
  }, [scene, nodes, ds.totalFrames, ds.fps]);

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
          maxWidth: ds.layout.isVertical ? '960px' : '1680px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: ds.layout.isVertical ? '10px' : '8px',
        }}
      >
        {nodes.map((node, idx) => {
          const revealFrame = revealFrames[idx] ?? 4;
          const nextReveal = revealFrames[idx + 1] ?? ds.totalFrames + 100;
          const hasEntered = ds.localFrame >= revealFrame;
          const isCurrent = hasEntered && ds.localFrame < nextReveal;
          const itemSpring = hasEntered
            ? spring({
                frame: Math.max(0, ds.localFrame - revealFrame),
                fps: ds.fps || 30,
                config: { damping: 16, stiffness: 120 },
              })
            : 0;
          const isLast = idx === nodes.length - 1;
          const accent = ds.accents[node.tone];
          const arrowReveal = revealFrames[idx + 1] ? Math.max(revealFrame + 6, revealFrames[idx + 1] - 6) : revealFrame + 10;
          const arrowSpring =
            ds.localFrame >= arrowReveal
              ? spring({
                  frame: Math.max(0, ds.localFrame - arrowReveal),
                  fps: ds.fps || 30,
                  config: { damping: 16, stiffness: 120 },
                })
              : 0;

          return (
            <React.Fragment key={idx}>
              <StudioCard
                tone={node.tone}
                topAccentBar
                elevated={isCurrent}
                palette={palette}
                progress={itemSpring}
                style={{
                  flex: 1,
                  minHeight: ds.layout.isVertical ? undefined : '320px',
                  display: 'flex',
                  flexDirection: ds.layout.isVertical ? 'row' : 'column',
                  alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
                  justifyContent: 'center',
                  gap: '18px',
                  padding: ds.layout.isVertical ? '24px 28px' : '38px 30px',
                  backgroundColor: ds.surface.isDark
                    ? isCurrent
                      ? 'rgba(30, 41, 59, 0.72)'
                      : 'rgba(30, 41, 59, 0.42)'
                    : isCurrent
                    ? 'rgba(241, 245, 249, 0.92)'
                    : 'rgba(241, 245, 249, 0.65)',
                  border: isCurrent ? `2px solid ${accent.border}` : 'none',
                  borderRadius: '24px',
                }}
              >
                <StepNumberBadge
                  number={node.step}
                  tone={node.tone}
                  size={54}
                  palette={palette}
                />
                <div style={{ flex: ds.layout.isVertical ? 1 : undefined }}>
                  <h3
                    style={{
                      fontFamily: headingFont,
                      fontSize: ds.layout.isVertical ? '26px' : '30px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: ds.surface.textPrimary,
                      margin: node.detail ? '0 0 10px 0' : 0,
                    }}
                  >
                    {node.title}
                  </h3>
                  {node.detail && (
                    <p
                      style={{
                        fontSize: ds.layout.isVertical ? '18px' : '20px',
                        fontWeight: 400,
                        lineHeight: 1.45,
                        color: ds.surface.textSecondary,
                        margin: 0,
                      }}
                    >
                      {node.detail}
                    </p>
                  )}
                </div>
              </StudioCard>

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
                    type="flow"
                    direction={ds.layout.isVertical ? 'down' : 'right'}
                    tone={node.tone}
                    progress={arrowSpring}
                    sceneFrame={sceneFrame || ds.localFrame}
                    size={ds.layout.isVertical ? 24 : 28}
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
