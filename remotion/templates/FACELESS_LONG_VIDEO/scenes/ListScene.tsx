import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { resolveFont } from '../../../utils/fonts';

export interface ListSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function ListScene({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Inter',
}: ListSceneProps) {
  const resolvedHeadingFont = resolveFont(headingFont);
  const resolvedBodyFont = resolveFont(bodyFont);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEntrance = spring({
    frame,
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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '9999px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              padding: '6px 20px',
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#F59E0B',
              marginBottom: '14px',
            }}
          >
            <span>OVERVIEW &bull; {items.length} KEY TAKEAWAYS</span>
          </div>

          <h1
            style={{
              fontFamily: resolvedHeadingFont,
              fontSize: '52px',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            {heading}
          </h1>
        </div>

        {/* Staggered List Cards */}
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
              frame: frame - (15 + index * 10), // Staggered reveal
              fps,
              config: { damping: 15, mass: 0.7 },
            });

            return (
              <div
                key={index}
                style={{
                  opacity: itemEntrance,
                  transform: `translateX(${interpolate(itemEntrance, [0, 1], [40, 0])}px)`,
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(20px)',
                  padding: '18px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: resolvedHeadingFont,
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#F59E0B',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                <span
                  style={{
                    fontFamily: resolvedBodyFont,
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
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
