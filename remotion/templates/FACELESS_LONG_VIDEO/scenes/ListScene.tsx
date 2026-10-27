import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { resolveFont } from '../../../utils/fonts';

import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface ListSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function ListScene({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Inter',
  sceneFrame,
  palette,
}: ListSceneProps) {
  const resolvedHeadingFont = resolveFont(headingFont);
  const resolvedBodyFont = resolveFont(bodyFont);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isDark = palette?.isDark ?? true;
  const headingColor = isDark ? '#FFFFFF' : '#0F172A';
  const itemBg = isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.92)';
  const itemBorder = isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)';
  const itemTextColor = isDark ? '#F8FAFC' : '#0F172A';

  const titleEntrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const heading = scene.heading || 'KEY PILLARS';
  const rawItems = scene.listItems && scene.listItems.length >= 2
    ? scene.listItems
    : scene.supportingText
    ? scene.supportingText.split(/[•,\n]+/).map((s) => s.trim()).filter((s) => s.length > 2)
    : ['Core Concept', 'Implementation Strategy', 'Key Impact'];

  const items = rawItems.slice(0, 5);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 140px', // Respects 140px X and 100px Y safe area
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: '1150px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Title Header */}
        <div
          style={{
            opacity: titleEntrance,
            transform: `translateY(${interpolate(titleEntrance, [0, 1], [30, 0])}px)`,
            marginBottom: '36px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: resolvedHeadingFont,
              fontSize: '52px',
              fontWeight: 900,
              color: headingColor,
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: isDark ? '0 4px 20px rgba(0,0,0,0.6)' : 'none',
            }}
          >
            {heading}
          </h1>
        </div>

        {/* Staggered List Items */}
        <div
          style={{
            width: '100%',
            maxWidth: '980px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {items.map((item, index) => {
            const itemEntrance = spring({
              frame: Math.max(0, currentFrame - (12 + index * 8)), // Staggered reveal from sceneFrame
              fps,
              config: { damping: 15, mass: 0.7 },
            });

            return (
              <div
                key={index}
                style={{
                  opacity: itemEntrance,
                  transform: `translateX(${interpolate(itemEntrance, [0, 1], [40, 0])}px)`,
                  borderRadius: '16px',
                  border: itemBorder,
                  backgroundColor: itemBg,
                  backdropFilter: 'blur(16px)',
                  padding: '18px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 87, 34, 0.15)',
                    border: '1px solid rgba(255, 87, 34, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: resolvedHeadingFont,
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#FF5722',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                <span
                  style={{
                    fontFamily: resolvedBodyFont,
                    fontSize: '26px',
                    fontWeight: 600,
                    color: itemTextColor,
                    lineHeight: 1.4,
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

