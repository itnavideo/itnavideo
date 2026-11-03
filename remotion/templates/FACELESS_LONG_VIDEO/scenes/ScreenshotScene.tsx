import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { useVideoDesignSystem } from '../designSystem';
import {
  SceneCanvas,
  SceneHeader,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface ScreenshotSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

export function ScreenshotScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: ScreenshotSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const headline = scene.heading || 'DIGITAL SYSTEM SHOWCASE';
  const categoryPill = scene.categoryPill || 'SYSTEM SHOWCASE';
  const supportingText =
    scene.supportingText && scene.supportingText !== headline
      ? scene.supportingText
      : scene.narrationSegment?.text || '';

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="sky"
      fontFamily={bodyFont}
    >
      <SceneHeader
        categoryPill={categoryPill}
        heading={headline}
        highlightedWords={scene.highlightedWords}
        headingFont={headingFont}
        bodyFont={bodyFont}
        tone="sky"
        sceneFrame={sceneFrame}
        palette={palette}
      />

      {/* Editorial Browser Window Frame */}
      <StudioCard
        tone="sky"
        elevated
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1240px',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Browser Chrome Header */}
        <div
          style={{
            height: '52px',
            backgroundColor: ds.surface.cardBgMuted,
            borderBottom: ds.surface.borderSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>

          <div
            style={{
              padding: '5px 20px',
              borderRadius: '9999px',
              backgroundColor: ds.surface.cardBg,
              border: ds.surface.borderSubtle,
              fontSize: '12px',
              fontWeight: 700,
              color: ds.surface.textMuted,
              letterSpacing: '0.03em',
            }}
          >
            {headline.slice(0, 42)}
          </div>

          <div style={{ width: '48px' }} />
        </div>

        {/* Browser Body Content */}
        <div
          style={{
            padding: ds.layout.isVertical ? '32px 28px' : '40px 48px',
            display: 'flex',
            flexDirection: ds.layout.splitDirection,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '36px',
          }}
        >
          <div style={{ flex: 1.2 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: ds.accents.sky.solid,
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              LIVE INTERFACE VIEW
            </div>
            <h3
              style={{
                fontFamily: headingFont,
                fontSize: `${ds.type.cardTitle.fontSize}px`,
                fontWeight: 800,
                color: ds.surface.textPrimary,
                margin: '0 0 14px 0',
                lineHeight: 1.25,
              }}
            >
              {headline}
            </h3>
            {supportingText && (
              <p
                style={{
                  fontSize: `${ds.type.bodyLg.fontSize}px`,
                  fontWeight: 500,
                  color: ds.surface.textSecondary,
                  lineHeight: 1.48,
                  margin: 0,
                }}
              >
                {supportingText}
              </p>
            )}
          </div>

          <div
            style={{
              width: ds.layout.isVertical ? '240px' : '280px',
              height: ds.layout.isVertical ? '240px' : '260px',
              borderRadius: '20px',
              backgroundColor: ds.surface.cardBgMuted,
              border: ds.surface.borderSubtle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <VectorDrawingIcon
              keyword={scene.vectorDrawingId || `${headline} ${supportingText}`}
              size={ds.layout.isVertical ? 190 : 220}
              strokeWidth={4}
              animated={true}
              frameOverride={ds.localFrame}
              theme={ds.surface.isDark ? 'dark' : 'light'}
            />
          </div>
        </div>
      </StudioCard>
    </SceneCanvas>
  );
}
