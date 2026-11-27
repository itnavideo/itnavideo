import React from 'react';
import { Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { useVideoDesignSystem, resolveDynamicImageBorder } from '../designSystem';
import {
  SceneCanvas,
  SceneHeader,
  StudioCard,
} from '../components/DesignSystemPrimitives';
import { safeResolveMediaSrc } from '../../../utils/safeMedia';

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
  mediaUrl,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: ScreenshotSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = sceneFrame !== undefined ? sceneFrame : frame;
  const totalFrames = Math.max(30, Math.round((scene.duration || 5) * fps));

  // 75%-80% Screenshot Rule: Continuous slow 5% Ken Burns zoom so canvas never looks frozen
  const kenBurnsScale = interpolate(localFrame, [0, totalFrames], [1.0, 1.05], {
    extrapolateRight: 'clamp',
  });

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

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedImgSrc = activeMediaUrl ? safeResolveMediaSrc(activeMediaUrl) : '';
  const hasImage = Boolean(
    resolvedImgSrc &&
    typeof resolvedImgSrc === 'string' &&
    (resolvedImgSrc.startsWith('http') || resolvedImgSrc.startsWith('data:') || resolvedImgSrc.startsWith('/'))
  );

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

      {/* Editorial Browser Window Frame (78% canvas width per 75-80% specification) */}
      <StudioCard
        tone="sky"
        elevated
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: ds.layout.isVertical ? '90%' : '78%',
          maxWidth: ds.layout.isVertical ? '920px' : '1500px',
          padding: 0,
          overflow: 'hidden',
          transform: `scale(${kenBurnsScale})`,
          transformOrigin: 'center center',
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
        {hasImage ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: ds.layout.isVertical ? '420px' : '520px',
              overflow: 'hidden',
              backgroundColor: ds.surface.cardBgMuted,
            }}
          >
            <Img
              src={resolvedImgSrc}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                border: ds.surface.imageBorder,
                boxSizing: 'border-box',
                display: 'block',
              }}
            />
            {/* Subtle Gradient Vignette Overlay to ensure text readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '28px 36px',
              }}
            >
              <h3
                style={{
                  fontFamily: headingFont,
                  fontSize: `${ds.type.cardTitle.fontSize}px`,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 6px 0',
                  textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                }}
              >
                {headline}
              </h3>
              {supportingText && (
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: `${ds.type.bodyLg.fontSize}px`,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)',
                    margin: 0,
                    textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                  }}
                >
                  {supportingText}
                </p>
              )}
            </div>
          </div>
        ) : (
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
        )}
      </StudioCard>
    </SceneCanvas>
  );
}
