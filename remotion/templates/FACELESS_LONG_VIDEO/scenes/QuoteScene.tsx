import React from 'react';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface QuoteSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
}

export function QuoteScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.editorialSerif,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  sceneFrame,
  palette,
}: QuoteSceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const quoteText = String(scene.heading || scene.narrationSegment?.text || '').trim();
  const author = scene.quoteAuthor || scene.supportingText || undefined;
  const categoryPill = scene.categoryPill || 'CORE PRINCIPLE';

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="amber"
      fontFamily={bodyFont}
    >
      <StudioCard
        tone="amber"
        topAccentBar
        elevated
        palette={palette}
        progress={ds.motion.contentSpring}
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '900px' : '1180px',
          padding: ds.layout.isVertical ? '48px 36px' : '60px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <EyebrowPill
            label={categoryPill}
            tone="amber"
            palette={palette}
            progress={ds.motion.eyebrowSpring}
          />
        </div>

        <span
          style={{
            fontFamily: headingFont,
            fontSize: '76px',
            color: ds.accents.amber.solid,
            lineHeight: 0.65,
            marginBottom: '16px',
            display: 'block',
          }}
        >
          &ldquo;
        </span>

        <blockquote
          style={{
            fontFamily: headingFont,
            fontSize: `${ds.type.sceneTitle.fontSize}px`,
            fontStyle: 'italic',
            fontWeight: 700,
            lineHeight: 1.24,
            letterSpacing: '-0.015em',
            color: ds.surface.textPrimary,
            margin: '0 0 22px 0',
            maxWidth: '960px',
          }}
        >
          {quoteText}
        </blockquote>

        {author && author !== quoteText && (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: `${ds.type.bodyMd.fontSize}px`,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: ds.surface.textMuted,
            }}
          >
            — {author}
          </div>
        )}
      </StudioCard>
    </SceneCanvas>
  );
}
