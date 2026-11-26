import React from 'react';
import { interpolate, spring } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  SceneHeader,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface ComparisonSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

export function ComparisonScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: ComparisonSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const heading = scene.heading || 'PARADIGM SHIFT & COMPARISON';
  const categoryPill = scene.categoryPill || 'SIDE-BY-SIDE COMPARISON';

  const leftRaw = scene.comparisonItems?.left || 'Traditional Manual Approach';
  const rightRaw = scene.comparisonItems?.right || scene.supportingText || 'Modern High-Leverage System';

  const splitPoints = (raw: string, fallbackHeading: string) => {
    const cleaned = String(raw || '').trim();
    const parts = cleaned
      .split(/[•;\n|]+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2);
    if (parts.length >= 2) {
      return {
        title: parts[0],
        bullets: parts.slice(1, 4),
      };
    }
    const commaParts = cleaned
      .split(/,\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 3);
    if (commaParts.length >= 2) {
      return {
        title: commaParts[0],
        bullets: commaParts.slice(1, 4),
      };
    }
    return {
      title: cleaned || fallbackHeading,
      bullets: [] as string[],
    };
  };

  const leftParsed = splitPoints(leftRaw, 'Previous Approach');
  const rightParsed = splitPoints(rightRaw, 'Recommended Approach');

  const leftSpring = ds.motion.stagger(0, 6, 6);
  const vsSpring = spring({
    frame: Math.max(0, ds.localFrame - 10),
    fps: ds.fps,
    config: { damping: 12, mass: 0.75, stiffness: 170 },
  });
  const rightSpring = ds.motion.stagger(1, 8, 6);

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
        supportingText={
          scene.supportingText && scene.supportingText !== rightRaw
            ? scene.supportingText
            : undefined
        }
        highlightedWords={scene.highlightedWords}
        headingFont={headingFont}
        bodyFont={bodyFont}
        tone="coral"
        sceneFrame={sceneFrame}
        palette={palette}
      />

      {/* Responsive Split Grid: Row on 16:9, Column on 9:16 */}
      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '960px' : '1620px',
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: ds.layout.isVertical ? '24px' : '48px',
          position: 'relative',
        }}
      >
        {/* LEFT / TOP COLUMN: The Old or Contrast Way */}
        <StudioCard
          tone="rose"
          palette={palette}
          progress={leftSpring}
          translateXFrom={ds.layout.isVertical ? 0 : -44}
          translateYFrom={ds.layout.isVertical ? 24 : 0}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: ds.accents.rose.solid,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                ● CONVENTIONAL WAY
              </span>
              <span
                style={{
                  fontSize: `${ds.type.captionMeta.fontSize}px`,
                  fontWeight: 700,
                  color: ds.surface.textMuted,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Low Leverage
              </span>
            </div>

            <h3
              style={{
                fontFamily: headingFont,
                fontSize: `${ds.type.cardTitle.fontSize}px`,
                fontWeight: ds.type.cardTitle.fontWeight,
                lineHeight: ds.type.cardTitle.lineHeight,
                letterSpacing: ds.type.cardTitle.letterSpacing,
                color: ds.surface.textPrimary,
                margin: '0 0 20px 0',
              }}
            >
              {leftParsed.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {leftParsed.bullets.map((point, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    backgroundColor: ds.accents.rose.SoftBg,
                  }}
                >
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: ds.accents.rose.solid,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </span>
                  <span
                    style={{
                      fontSize: `${ds.type.bodyMd.fontSize}px`,
                      fontWeight: 600,
                      color: ds.surface.textPrimary,
                      lineHeight: 1.4,
                    }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StudioCard>

        {/* CENTER VS BADGE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            zIndex: 5,
            margin: ds.layout.isVertical ? '-6px 0' : '0 -16px',
            transform: `scale(${interpolate(vsSpring, [0, 1], [0.4, 1])})`,
            opacity: vsSpring,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: ds.surface.textPrimary,
              color: ds.surface.textInverse,
              border: `4px solid ${ds.surface.isDark ? '#0F172A' : '#FFFFFF'}`,
              boxShadow: ds.surface.shadowElevated,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: headingFont,
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '0.04em',
            }}
          >
            VS
          </div>
        </div>

        {/* RIGHT / BOTTOM COLUMN: The High-Impact / New Way */}
        <StudioCard
          tone="emerald"
          palette={palette}
          progress={rightSpring}
          translateXFrom={ds.layout.isVertical ? 0 : 44}
          translateYFrom={ds.layout.isVertical ? 24 : 0}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: ds.accents.emerald.solid,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                ● RECOMMENDED PATH
              </span>
              <span
                style={{
                  fontSize: `${ds.type.captionMeta.fontSize}px`,
                  fontWeight: 800,
                  color: ds.accents.emerald.textOnSoft,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                High Impact
              </span>
            </div>

            <h3
              style={{
                fontFamily: headingFont,
                fontSize: `${ds.type.cardTitle.fontSize}px`,
                fontWeight: ds.type.cardTitle.fontWeight,
                lineHeight: ds.type.cardTitle.lineHeight,
                letterSpacing: ds.type.cardTitle.letterSpacing,
                color: ds.surface.textPrimary,
                margin: '0 0 20px 0',
              }}
            >
              {rightParsed.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rightParsed.bullets.map((point, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: ds.accents.emerald.SoftBg,
                    border: `1px solid ${ds.accents.emerald.border}`,
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: ds.accents.emerald.solid,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: `${ds.type.bodyMd.fontSize}px`,
                      fontWeight: 600,
                      color: ds.surface.textPrimary,
                      lineHeight: 1.35,
                    }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </StudioCard>
      </div>
    </SceneCanvas>
  );
}
