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
  /** Optional fade-out at the end of the scene. 0 = off (parent handles transitions). */
  exitFrames?: number;
  /** Background for the light theme. Default white; pass 'transparent' to let the parent show through. */
  backgroundColor?: string;
}

const ACCENT = '#FF5722';
const MAX_ITEMS = 5;
const ITEM_STAGGER = 9; // frames between list items
const ITEMS_START = 14; // frames after the scene starts

/* ───────────────────────── helpers ───────────────────────── */

function cleanItem(s: string): string {
  // strip leading "-", "•", "1." or "1)" — but never touch things like "5G networks"
  return s.replace(/^\s*(?:[-–•]|\d+[.)])\s+/, '').trim();
}

function resolveItems(scene: SceneBlueprintItem): string[] {
  const fromBlueprint =
    scene.listItems && scene.listItems.length >= 2 ? scene.listItems : null;

  const raw =
    fromBlueprint ??
    (scene.supportingText
      ? scene.supportingText
          .split(/[•,\n]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 2)
      : ['Core Concept', 'Implementation Strategy', 'Key Impact']);

  return raw.map((s) => cleanItem(String(s))).filter(Boolean).slice(0, MAX_ITEMS);
}

/* ───────────────────────── scene ───────────────────────── */

export function ListScene({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Inter',
  sceneFrame,
  palette,
  exitFrames = 0,
  backgroundColor = '#FFFFFF',
}: ListSceneProps) {
  const resolvedHeadingFont = resolveFont(headingFont);
  const resolvedBodyFont = resolveFont(bodyFont);
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  /* ── orientation & scale ──
     All sizes below are authored for a 1080px short edge (1920×1080 or 1080×1920)
     and scaled by `s`, so 720p / 4K / odd sizes also look right. */
  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const px = (n: number) => `${Math.round(n * s)}px`;

  const L = isPortrait
    ? {
        // 9:16 — big, thumb-stopping, clear of Shorts/Reels UI overlays
        padTop: 220,
        padBottom: 340,
        padX: 72,
        headingSize: 92,
        headingGap: 56,
        maxWidth: 936,
        itemFont: 44,
        itemPadY: 32,
        itemPadX: 40,
        badge: 72,
        badgeFont: 36,
        gap: 24,
        radius: 28,
      }
    : {
        // 16:9 — centered column, generous margins
        padTop: 80,
        padBottom: 80,
        padX: 140,
        headingSize: 74,
        headingGap: 44,
        maxWidth: 1240,
        itemFont: 38,
        itemPadY: 22,
        itemPadX: 34,
        badge: 60,
        badgeFont: 30,
        gap: 20,
        radius: 22,
      };

  /* ── theme (white is the default) ── */
  const isDark = palette?.isDark === true;
  const headingColor = isDark ? '#FFFFFF' : '#0F172A';
  const itemTextColor = isDark ? '#F8FAFC' : '#0F172A';
  const itemBg = isDark ? 'rgba(15, 23, 42, 0.78)' : '#F8FAFC';
  const itemBorder = isDark
    ? '1.5px solid rgba(255, 255, 255, 0.14)'
    : '1.5px solid rgba(15, 23, 42, 0.08)';
  const itemShadow = isDark
    ? '0 14px 40px rgba(0, 0, 0, 0.45)'
    : '0 12px 32px rgba(15, 23, 42, 0.08)';

  /* ── content ── */
  const heading = scene.heading || 'KEY PILLARS';
  const items = resolveItems(scene);

  // Long items get slightly smaller type so they stay on 1–2 lines
  const longest = items.reduce((m, t) => Math.max(m, t.length), 0);
  const fitScale = longest > 60 ? 0.78 : longest > 42 ? 0.88 : 1;
  const itemFontSize = L.itemFont * fitScale;

  /* ── motion ── */
  const titleIn = spring({
    frame: currentFrame,
    fps,
    config: { damping: 18, mass: 0.9, stiffness: 120 },
  });
  const barIn = spring({
    frame: currentFrame - 6,
    fps,
    config: { damping: 20, mass: 0.8, stiffness: 110 },
  });

  const exitOpacity =
    exitFrames > 0
      ? interpolate(
          currentFrame,
          [durationInFrames - exitFrames, durationInFrames - 1],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${px(L.padTop)} ${px(L.padX)} ${px(L.padBottom)}`,
        boxSizing: 'border-box',
        zIndex: 10,
        backgroundColor: isDark ? 'transparent' : backgroundColor,
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          maxWidth: px(L.maxWidth),
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── Title ── */}
        <div
          style={{
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [30 * s, 0])}px)`,
            marginBottom: px(L.headingGap),
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: px(22),
          }}
        >
          <h1
            style={
              {
                fontFamily: resolvedHeadingFont,
                fontSize: px(L.headingSize),
                fontWeight: 900,
                color: headingColor,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                textShadow: isDark ? '0 4px 28px rgba(0,0,0,0.6)' : 'none',
                textWrap: 'balance',
              } as React.CSSProperties
            }
          >
            {heading}
          </h1>
          <div
            style={{
              width: `${interpolate(barIn, [0, 1], [0, 120 * s])}px`,
              height: px(6),
              borderRadius: 9999,
              backgroundColor: ACCENT,
              boxShadow: '0 0 24px rgba(255, 87, 34, 0.45)',
            }}
          />
        </div>

        {/* ── Items ── */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: px(L.gap),
          }}
        >
          {items.map((item, index) => {
            const start = ITEMS_START + index * ITEM_STAGGER;
            const p = spring({
              frame: currentFrame - start,
              fps,
              config: { damping: 17, mass: 0.8, stiffness: 140 },
            });

            // Landscape: slide in from the right. Portrait: rise from below.
            const dx = isPortrait ? 0 : interpolate(p, [0, 1], [56 * s, 0]);
            const dy = isPortrait ? interpolate(p, [0, 1], [44 * s, 0]) : 0;

            return (
              <div
                key={`${item}-${index}`}
                style={{
                  opacity: p,
                  transform: `translate(${dx}px, ${dy}px)`,
                  borderRadius: px(L.radius),
                  border: itemBorder,
                  backgroundColor: itemBg,
                  backdropFilter: isDark ? 'blur(16px)' : undefined,
                  padding: `${px(L.itemPadY)} ${px(L.itemPadX)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: px(L.itemPadX * 0.7),
                  boxShadow: itemShadow,
                }}
              >
                <div
                  style={{
                    width: px(L.badge),
                    height: px(L.badge),
                    borderRadius: px(L.badge * 0.3),
                    backgroundColor: ACCENT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: resolvedHeadingFont,
                    fontSize: px(L.badgeFont),
                    fontWeight: 900,
                    color: '#FFFFFF',
                    flexShrink: 0,
                    boxShadow: '0 8px 20px rgba(255, 87, 34, 0.35)',
                  }}
                >
                  {index + 1}
                </div>

                <span
                  style={{
                    fontFamily: resolvedBodyFont,
                    fontSize: px(itemFontSize),
                    fontWeight: 700,
                    lineHeight: 1.25,
                    color: itemTextColor,
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