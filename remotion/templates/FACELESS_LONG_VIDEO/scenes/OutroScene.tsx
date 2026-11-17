import React from 'react';
import { interpolate, spring } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface OutroSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
  creatorHandle?: string;
}

/**
 * L17. OutroScene
 * Clean, high-impact outro with Call To Action, brand pill, and celebratory accents.
 * Provides a definitive conclusion instead of cutting abruptly on a random visual.
 */
export function OutroScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
  creatorHandle,
}: OutroSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const closingHeadline = String(scene.heading || 'SIMPLIFY YOUR OPERATIONS').trim();
  const ctaText = String(scene.supportingText || 'Follow for more business insights').trim();
  const kicker = String(scene.categoryPill || 'TAKE ACTION').trim();

  const titleSpring = ds.motion.stagger(0, 6, 6);
  const cardSpring = ds.motion.stagger(1, 8, 6);
  const buttonSpring = spring({
    frame: Math.max(0, ds.localFrame - 16),
    fps: ds.fps,
    config: { damping: 12, mass: 0.75, stiffness: 160 },
  });

  const isDark = ds.surface.isDark;

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="emerald"
      fontFamily={bodyFont}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <StudioCard
          tone="emerald"
          elevated
          topAccentBar
          palette={palette}
          progress={cardSpring}
          style={{
            width: '100%',
            maxWidth: '960px',
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            borderRadius: '32px',
          }}
        >
          {/* Top Eyebrow */}
          <EyebrowPill
            label={kicker}
            tone="emerald"
            palette={palette}
            progress={titleSpring}
          />

          {/* Hero Outro Headline */}
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: ds.surface.textPrimary,
              margin: '0',
              maxWidth: '820px',
            }}
          >
            {closingHeadline}
          </h2>

          {/* Supporting Takeaway */}
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: 1.45,
              color: ds.surface.textSecondary,
              margin: '0',
              maxWidth: '720px',
            }}
          >
            {ctaText}
          </p>

          {/* High-Impact CTA Button */}
          <div
            style={{
              marginTop: '12px',
              opacity: buttonSpring,
              transform: `scale(${interpolate(buttonSpring, [0, 1], [0.85, 1])})`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 36px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #059669, #10B981)',
                color: '#FFFFFF',
                fontFamily: headingFont,
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              }}
            >
              <span>{creatorHandle ? `Follow ${creatorHandle}` : 'Subscribe for More'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </StudioCard>
      </div>
    </SceneCanvas>
  );
}

