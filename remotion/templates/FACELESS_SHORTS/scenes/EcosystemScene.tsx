import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface EcosystemSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
  /** Small tag on the center hub. */
  hubLabel?: string;
  /** Optional fade-out at the end of the scene. 0 = off (parent handles transitions). */
  exitFrames?: number;
  /** Background for the light theme. Default white; pass 'transparent' to let the parent show through. */
  backgroundColor?: string;
}

function renderEcosystemIcon(index: number, size: number, color: string) {
  const s = size;
  switch (index % 4) {
    case 0: // Book
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 1: // Robot / Node
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16.01" />
          <line x1="16" y1="16" x2="16" y2="16.01" />
        </svg>
      );
    case 2: // File / Document
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    default: // Lightning / Power
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
}

const MAX_ITEMS = 4;
const NODE_START = 10; // frames before the first satellite appears
const NODE_STAGGER = 7;

/* ───────────────────────── layout ───────────────────────── */

type Side = 'left' | 'right' | 'top' | 'bottom';

interface Slot {
  x: number; // center offset from hub center (layout units)
  y: number;
  w: number; // node width
  side: Side; // direction from hub to this node
}

/**
 * All numbers are in "layout units": authored for a 1080 short edge
 * (1920×1080 or 1080×1920) and multiplied by `s` at render time.
 */
function buildLayout(isPortrait: boolean, n: number, layoutW: number, layoutH: number) {
  if (isPortrait) {
    const hubW = 640;
    const hubH = 300;
    const nodeH = 190;
    const nodeW = 450;
    const wide = 720;
    const gap = 100;
    const dy = hubH / 2 + gap + nodeH / 2;
    const col = 240;

    // keep clear of Shorts/Reels UI: top 220, bottom 340
    const padTop = 220;
    const padBottom = 340;
    const cy = padTop + (layoutH - padTop - padBottom) / 2;

    let slots: Slot[];
    if (n <= 2) {
      slots = [
        { x: 0, y: -dy, w: wide, side: 'top' },
        { x: 0, y: dy, w: wide, side: 'bottom' },
      ];
    } else if (n === 3) {
      slots = [
        { x: -col, y: -dy, w: nodeW, side: 'top' },
        { x: col, y: -dy, w: nodeW, side: 'top' },
        { x: 0, y: dy, w: wide, side: 'bottom' },
      ];
    } else {
      slots = [
        { x: -col, y: -dy, w: nodeW, side: 'top' },
        { x: col, y: -dy, w: nodeW, side: 'top' },
        { x: -col, y: dy, w: nodeW, side: 'bottom' },
        { x: col, y: dy, w: nodeW, side: 'bottom' },
      ];
    }

    return {
      cx: layoutW / 2,
      cy,
      hubW,
      hubH,
      nodeH,
      slots,
      f: { hub: 54, badge: 20, label: 20, text: 32, iconBox: 68, icon: 38, pad: 26 },
    };
  }

  // 16:9
  const hubW = 500;
  const hubH = 240;
  const nodeH = 150;
  const nodeW = 430;
  const gap = 130;
  // keep side nodes inside the frame even on non-16:9 landscape sizes
  const dx = Math.min(hubW / 2 + gap + nodeW / 2, layoutW / 2 - nodeW / 2 - 60);
  const dy = 150;
  const cy = layoutH / 2;

  let slots: Slot[];
  if (n <= 2) {
    slots = [
      { x: -dx, y: 0, w: nodeW, side: 'left' },
      { x: dx, y: 0, w: nodeW, side: 'right' },
    ];
  } else if (n === 3) {
    slots = [
      { x: -dx, y: -dy, w: nodeW, side: 'left' },
      { x: dx, y: -dy, w: nodeW, side: 'right' },
      { x: 0, y: hubH / 2 + 90 + nodeH / 2, w: nodeW + 60, side: 'bottom' },
    ];
  } else {
    slots = [
      { x: -dx, y: -dy, w: nodeW, side: 'left' },
      { x: dx, y: -dy, w: nodeW, side: 'right' },
      { x: -dx, y: dy, w: nodeW, side: 'left' },
      { x: dx, y: dy, w: nodeW, side: 'right' },
    ];
  }

  return {
    cx: layoutW / 2,
    cy,
    hubW,
    hubH,
    nodeH,
    slots,
    f: { hub: 40, badge: 18, label: 17, text: 28, iconBox: 62, icon: 34, pad: 26 },
  };
}

/* ───────────────────────── content ───────────────────────── */

function resolveItems(scene: SceneBlueprintItem): string[] {
  const fromBlueprint = scene.listItems && scene.listItems.length >= 2 ? scene.listItems : null;
  const raw =
    fromBlueprint ??
    (scene.supportingText
      ? scene.supportingText
        .split(/[•,\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2)
      : ['Foundational Books', 'AI Personal Tutor', 'Practice Projects', 'Action Blueprint']);
  return raw.map((s) => String(s).trim()).filter(Boolean).slice(0, MAX_ITEMS);
}

/* ───────────────────────── scene ───────────────────────── */

export function EcosystemScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
  hubLabel = 'Framework Engine',
  exitFrames = 0,
  backgroundColor = '#FFFFFF',
}: EcosystemSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const px = (n: number) => `${Math.round(n * s)}px`;

  /* ── theme (white is the default) ── */
  const isDark = palette?.isDark === true;
  const accent = isDark ? '#00F5D4' : '#0D9488'; // darker teal so lines read on white
  const accentText = isDark ? '#00F5D4' : '#0F766E';
  const nodeBg = isDark ? 'rgba(15, 23, 42, 0.92)' : '#F8FAFC';
  const nodeBorder = isDark ? '2px solid rgba(255,255,255,0.16)' : '2px solid rgba(15,23,42,0.09)';
  const nodeShadow = isDark ? '0 20px 50px rgba(0,0,0,0.65)' : '0 16px 40px rgba(15,23,42,0.10)';
  const nodeText = isDark ? '#FFFFFF' : '#0F172A';
  const iconBg = isDark ? 'rgba(0,245,212,0.12)' : 'rgba(13,148,136,0.10)';

  /* ── content & layout ── */
  const heading = scene.heading || 'COMPLETE SYSTEM IN A BOX';
  const items = resolveItems(scene);
  const L = buildLayout(isPortrait, items.length, width / s, height / s);

  const cxPx = L.cx * s;
  const cyPx = L.cy * s;

  const longest = items.reduce((m, t) => Math.max(m, t.length), 0);
  const nodeFit = longest > 40 ? 0.76 : longest > 28 ? 0.88 : 1;
  const hubFit = heading.length > 44 ? 0.72 : heading.length > 30 ? 0.85 : 1;

  /* ── motion ── */
  const hubIn = spring({ frame: currentFrame, fps, config: { damping: 14, stiffness: 110 } });

  const exitOpacity =
    exitFrames > 0
      ? interpolate(
        currentFrame,
        [durationInFrames - exitFrames, durationInFrames - 1],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
      : 1;

  const nodeProgress = (i: number) =>
    spring({
      frame: currentFrame - (NODE_START + i * NODE_STAGGER),
      fps,
      config: { damping: 15, stiffness: 120 },
    });

  /* ── connector geometry: computed from the actual node positions ── */
  const connector = (slot: Slot): string => {
    const inset = 12; // start slightly under the hub so the line emerges from it
    const stop = 12; // end just short of the node so the arrowhead stays visible
    let sx: number, sy: number, ex: number, ey: number;
    let c1x: number, c1y: number, c2x: number, c2y: number;

    if (slot.side === 'left' || slot.side === 'right') {
      const dir = slot.side === 'right' ? 1 : -1;
      sx = dir * (L.hubW / 2 - inset);
      sy = slot.y * 0.3;
      ex = slot.x - dir * (slot.w / 2 + stop);
      ey = slot.y;
      const half = (ex - sx) / 2;
      c1x = sx + half;
      c1y = sy;
      c2x = ex - half;
      c2y = ey;
    } else {
      const dir = slot.side === 'bottom' ? 1 : -1;
      sx = slot.x * 0.5;
      sy = dir * (L.hubH / 2 - inset);
      ex = slot.x;
      ey = slot.y - dir * (L.nodeH / 2 + stop);
      const half = (ey - sy) / 2;
      c1x = sx;
      c1y = sy + half;
      c2x = ex;
      c2y = ey - half;
    }

    const X = (u: number) => (cxPx + u * s).toFixed(1);
    const Y = (u: number) => (cyPx + u * s).toFixed(1);
    return `M ${X(sx)} ${Y(sy)} C ${X(c1x)} ${Y(c1y)}, ${X(c2x)} ${Y(c2y)}, ${X(ex)} ${Y(ey)}`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        overflow: 'hidden',
        fontFamily: bodyFont,
        backgroundColor: isDark ? 'transparent' : backgroundColor,
        opacity: exitOpacity,
      }}
    >
      {/* ── Connectors (hub → nodes) ── */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <defs>
          <marker
            id="eco-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={accent} />
          </marker>
        </defs>

        {items.map((_, i) => {
          const slot = L.slots[i];
          if (!slot) return null;
          const p = nodeProgress(i);
          return (
            <path
              key={i}
              d={connector(slot)}
              fill="none"
              stroke={accent}
              strokeWidth={Math.max(2, 4 * s)}
              strokeLinecap="round"
              strokeDasharray={`${12 * s} ${12 * s}`}
              // dashes drift from the hub toward the node
              strokeDashoffset={-currentFrame * 0.9 * s}
              opacity={interpolate(p, [0, 1], [0, isDark ? 0.8 : 0.9], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}
              markerEnd="url(#eco-arrow)"
            />
          );
        })}
      </svg>

      {/* ── Center hub ── */}
      <div
        style={{
          position: 'absolute',
          zIndex: 10,
          left: cxPx - (L.hubW * s) / 2,
          top: cyPx - (L.hubH * s) / 2,
          width: px(L.hubW),
          height: px(L.hubH),
          boxSizing: 'border-box',
          borderRadius: px(32),
          border: isDark ? `${px(4)} solid #FFFFFF` : 'none',
          backgroundColor: '#070B14',
          padding: `${px(24)} ${px(32)}`,
          boxShadow: isDark
            ? '0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(0,245,212,0.25)'
            : '0 30px 70px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          transform: `scale(${interpolate(hubIn, [0, 1], [0.82, 1])})`,
          opacity: hubIn,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#00F5D4',
            color: '#070B14',
            fontFamily: headingFont,
            fontSize: px(L.f.badge),
            fontWeight: 900,
            padding: `${px(5)} ${px(16)}`,
            borderRadius: px(6),
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: px(16),
            transform: 'rotate(-1.5deg)',
          }}
        >
          {hubLabel}
        </div>

        <h2
          style={
            {
              fontFamily: headingFont,
              fontSize: px(L.f.hub * hubFit),
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.12,
              letterSpacing: '-0.01em',
              margin: 0,
              textWrap: 'balance',
            } as React.CSSProperties
          }
        >
          {heading}
        </h2>
      </div>

      {/* ── Satellite nodes ── */}
      {items.map((itemText, i) => {
        const slot = L.slots[i];
        if (!slot) return null;
        const p = nodeProgress(i);

        // Nodes fly out from the hub into place
        const fly = 1 - p;
        const ax = -slot.x * s * 0.3 * fly;
        const ay = -slot.y * s * 0.3 * fly;

        return (
          <div
            key={`${itemText}-${i}`}
            style={{
              position: 'absolute',
              zIndex: 5,
              left: cxPx + slot.x * s - (slot.w * s) / 2,
              top: cyPx + slot.y * s - (L.nodeH * s) / 2,
              width: px(slot.w),
              height: px(L.nodeH),
              boxSizing: 'border-box',
              padding: `0 ${px(L.f.pad)}`,
              borderRadius: px(26),
              backgroundColor: nodeBg,
              border: nodeBorder,
              boxShadow: nodeShadow,
              backdropFilter: isDark ? 'blur(20px)' : undefined,
              transform: `translate(${ax}px, ${ay}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
              opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
              display: 'flex',
              alignItems: 'center',
              gap: px(18),
            }}
          >
            <div
              style={{
                width: px(L.f.iconBox),
                height: px(L.f.iconBox),
                borderRadius: px(18),
                backgroundColor: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: px(L.f.icon),
                flexShrink: 0,
              }}
            >
              {renderEcosystemIcon(i, px(L.f.icon), isDark ? '#FFFFFF' : accentText)}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: headingFont,
                  fontSize: px(L.f.label),
                  fontWeight: 800,
                  color: accentText,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Module {i + 1}
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontSize: px(L.f.text * nodeFit),
                  fontWeight: 800,
                  color: nodeText,
                  lineHeight: 1.2,
                  marginTop: px(4),
                }}
              >
                {itemText}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
