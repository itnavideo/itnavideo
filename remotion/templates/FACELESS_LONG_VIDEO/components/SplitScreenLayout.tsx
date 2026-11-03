import React from 'react';
import {
  Loop,
  OffthreadVideo,
  interpolate,
} from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { useVideoDesignSystem } from '../designSystem';
import { SceneCanvas, EyebrowPill, StudioCard } from './DesignSystemPrimitives';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';

export interface SplitScreenLayoutProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function SplitScreenLayout({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, Inter, sans-serif',
  bodyFont = 'Plus Jakarta Sans, Inter, sans-serif',
  sceneFrame,
  palette,
}: SplitScreenLayoutProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration || 4,
    palette,
    headingFont,
    bodyFont,
  });

  const { isVertical } = ds.layout;
  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);

  const headline = (scene.heading || 'Key Concept Breakdown').trim();
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';
  const supportingText = (scene.supportingText || '').trim();
  const bullets = (scene.listItems || []).filter(Boolean).slice(0, 3);

  const illustrationNode = (
    <VectorDrawingIcon
      keyword={scene.vectorDrawingId || `${headline} ${supportingText} ${scene.visualPrompt || ''}`}
      size={isVertical ? 280 : 340}
      strokeWidth={4}
      animated={true}
      frameOverride={ds.motion.localFrame}
      theme={ds.surface.isDark ? 'dark' : 'light'}
    />
  );

  // Subtle camera motion for media or vector showcase
  const mediaScale = interpolate(
    ds.motion.localFrame,
    [0, ds.motion.durationFrames],
    [1.02, 1.12],
    { extrapolateRight: 'clamp' }
  );

  return (
    <SceneCanvas ds={ds}>
      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.maxContentWidth,
          display: 'flex',
          flexDirection: ds.layout.splitDirection,
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: ds.layout.panelGap,
        }}
      >
        {/* ── EDITORIAL COPY PANEL ── */}
        <StudioCard
          ds={ds}
          entranceProgress={ds.motion.headerSpring}
          topAccentBar={ds.accents.coral.solid}
          padding={isVertical ? '36px 36px' : '48px 52px'}
          style={{
            flex: isVertical ? '0 0 auto' : '1.08 1 0%',
            justifyContent: 'center',
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <EyebrowPill
              ds={ds}
              label="CORE INSIGHT"
              tone="coral"
              entranceProgress={ds.motion.eyebrowSpring}
            />
          </div>

          <h1
            style={{
              fontFamily: ds.type.fontHeading,
              fontSize: isVertical ? ds.type.sceneTitle.fontSize - 2 : ds.type.sceneTitle.fontSize,
              fontWeight: ds.type.sceneTitle.fontWeight,
              lineHeight: ds.type.sceneTitle.lineHeight,
              letterSpacing: ds.type.sceneTitle.letterSpacing,
              color: ds.surface.textPrimary,
              margin: '0 0 18px 0',
              textWrap: 'balance',
            }}
          >
            {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
              <>
                {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
                <HandwritingHighlight
                  text={headline.slice(
                    headline.toLowerCase().indexOf(highlightWord.toLowerCase()),
                    headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
                  )}
                  variant="highlight"
                  color={ds.accents.yellow.solid}
                  delayFrames={8}
                  drawDurationFrames={18}
                  textStyle={{ color: '#0F172A', fontWeight: 900 }}
                />
                {headline.slice(
                  headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
                )}
              </>
            ) : (
              headline
            )}
          </h1>

          {supportingText && supportingText.toLowerCase() !== headline.toLowerCase() && (
            <p
              style={{
                fontFamily: ds.type.fontBody,
                fontSize: ds.type.bodyLg.fontSize,
                fontWeight: ds.type.bodyLg.fontWeight,
                lineHeight: ds.type.bodyLg.lineHeight,
                color: ds.surface.textSecondary,
                margin: bullets.length > 0 ? '0 0 22px 0' : 0,
              }}
            >
              {supportingText}
            </p>
          )}

          {bullets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bullets.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: ds.layout.cardRadiusSm,
                    backgroundColor: ds.surface.cardBgSubtle,
                    border: `1px solid ${ds.surface.cardBorder}`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: ds.accents.coral.solid,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: ds.type.fontBody,
                      fontSize: ds.type.bodyMd.fontSize,
                      fontWeight: 600,
                      color: ds.surface.textPrimary,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </StudioCard>

        {/* ── VISUAL / ILLUSTRATION PANEL ── */}
        <StudioCard
          ds={ds}
          entranceProgress={ds.motion.contentSpring}
          variant="subtle"
          padding={resolvedSrc ? '12px' : isVertical ? '32px' : '40px'}
          style={{
            flex: isVertical ? '0 0 auto' : '0.92 1 0%',
            minHeight: isVertical ? 380 : 440,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {resolvedSrc ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                minHeight: isVertical ? 350 : 410,
                borderRadius: ds.layout.cardRadiusMd,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `scale(${mediaScale})`,
                  transformOrigin: 'center center',
                }}
              >
                {isVid ? (
                  <Loop durationInFrames={180}>
                    <OffthreadVideo
                      src={resolvedSrc}
                      volume={0}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Loop>
                ) : (
                  <img
                    src={resolvedSrc}
                    alt={headline}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${interpolate(ds.motion.contentSpring, [0, 1], [0.9, 1])})`,
              }}
            >
              {illustrationNode}
            </div>
          )}
        </StudioCard>
      </div>
    </SceneCanvas>
  );
}

export default SplitScreenLayout;
