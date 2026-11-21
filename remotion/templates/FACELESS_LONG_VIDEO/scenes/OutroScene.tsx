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
import { SubscribeBellAsset } from '../../../components/library/SubscribeBellAsset';

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
 * Clean, high-impact outro with Call To Action, brand pill, celebratory accents,
 * and animated YouTube Subscribe + Bell overlay asset.
 */
export function OutroScene({
  scene,
  headingFont = 'Lora, "Playfair Display", Georgia, serif',
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
              fontSize: '52px',
              fontWeight: 700,
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
              fontSize: '22px',
              fontWeight: 500,
              lineHeight: 1.45,
              color: ds.surface.textSecondary,
              margin: '0',
              maxWidth: '720px',
            }}
          >
            {ctaText}
          </p>

          {/* Ultra-Premium YouTube Subscribe + Bell Asset */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '90px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '16px',
            }}
          >
            <SubscribeBellAsset
              scale={1.05}
              position="center"
              sceneFrame={sceneFrame}
              startDelayFrames={10}
            />
          </div>
        </StudioCard>
      </div>
    </SceneCanvas>
  );
}

