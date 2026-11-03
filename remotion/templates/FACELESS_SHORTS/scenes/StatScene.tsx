import React from 'react';
import {
  Easing,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FullBleedVisualScene } from './FullBleedVisualScene';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { safeResolveMediaSrc, isVideoMedia } from '../../../utils/safeMedia';

export interface StatSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

/* ───────────────────────── Constants ───────────────────────── */

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const VIDEO_LOOP_FRAMES = 180; // ek video loop ki length (30fps pe 6 sec)
const ACCENT = '#FF5722';
const DUMMY_LABELS = ['GROWTH METRIC', 'KEY METRIC'];

/* ───────────────────────── Helpers ───────────────────────── */

// Emoji ki jagah SVG icon (har machine pe same render hoga)
function BarChartIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
      <rect x="3" y="12" width="4.5" height="9" rx="1" />
      <rect x="9.75" y="7" width="4.5" height="14" rx="1" />
      <rect x="16.5" y="3" width="4.5" height="18" rx="1" />
    </svg>
  );
}

// "$1.2M", "85%", "3x", "2,500+" ko prefix / number / suffix me todta hai
interface ParsedStat {
  prefix: string;
  value: number;
  decimals: number;
  useComma: boolean;
  suffix: string;
}

function parseStat(raw: string): ParsedStat | null {
  const match = raw.trim().match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const [, prefix, numStr, suffix] = match;
  const cleaned = numStr.replace(/,/g, '');
  const value = parseFloat(cleaned);
  if (Number.isNaN(value)) return null;

  const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0;
  return { prefix, value, decimals, useComma: numStr.includes(','), suffix };
}

function formatCount(value: number, decimals: number, useComma: boolean): string {
  const fixed = value.toFixed(decimals);
  if (!useComma) return fixed;
  const [intPart, decPart] = fixed.split('.');
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decPart ? `.${decPart}` : '');
}

// Number ki length ke hisaab se font size (portrait aur landscape ke alag)
function getStatSize(length: number, isPortrait: boolean): number {
  if (isPortrait) {
    if (length <= 4) return 280;
    if (length <= 6) return 220;
    if (length <= 8) return 170;
    if (length <= 11) return 130;
    return 100;
  }
  if (length <= 4) return 300;
  if (length <= 6) return 260;
  if (length <= 8) return 210;
  if (length <= 11) return 160;
  return 120;
}

/* ───────────────────────── Main component ───────────────────────── */

export function StatScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: StatSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const f = sceneFrame !== undefined ? sceneFrame : frame;
  const sceneDurationFrames = Math.max(30, Math.round((scene.duration || 5) * fps));

  const statVal = scene.statValue || scene.numberBadge?.toString();

  // Agar koi asli number nahi hai to FullBleedVisualScene pe fallback
  if (!statVal || !/\d/.test(statVal)) {
    return (
      <FullBleedVisualScene
        scene={scene}
        mediaUrl={mediaUrl}
        headingFont={headingFont}
        bodyFont={bodyFont}
        sceneFrame={sceneFrame}
        palette={palette}
      />
    );
  }

  /* ── Format detect (16:9 ya 9:16) aur scale ── */
  const isPortrait = height > width;
  const u = isPortrait ? width / 1080 : width / 1920; // dono formats me sizes auto adjust

  /* ── Data ── */
  const isDummyLabel = !scene.statLabel || DUMMY_LABELS.includes(scene.statLabel.toUpperCase());
  const statLbl: string =
    (isDummyLabel ? scene.heading || scene.narrationSegment?.text || '' : scene.statLabel) || '';

  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';
  const resolvedSrc = safeResolveMediaSrc(activeMediaUrl);
  const isVid = isVideoMedia(activeMediaUrl);
  const hasMedia = Boolean(resolvedSrc);

  // Media ho to light text, warna white background pe dark text
  const labelColor = hasMedia ? '#F8FAFC' : '#334155';

  /* ── Animations ── */
  const kenBurns = interpolate(f, [0, sceneDurationFrames], [1.02, 1.12], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });

  const tagWipe = interpolate(f, [0, 12], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  const numberIn = spring({ frame: f - 6, fps, config: { damping: 14, mass: 0.8, stiffness: 150 } });

  const lineGrow = interpolate(f, [16, 38], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  const labelIn = spring({ frame: f - 22, fps, config: { damping: 16, mass: 0.8, stiffness: 140 } });

  // Count-up: number 0 se final tak chadhta hai
  const parsed = parseStat(statVal);
  const countFrames = Math.min(Math.round(fps * 1.5), Math.round(sceneDurationFrames * 0.5));
  const countProgress = interpolate(f, [8, 8 + countFrames], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  let displayStat = statVal;
  if (parsed && countProgress < 1) {
    const current = parsed.value * countProgress;
    displayStat = `${parsed.prefix}${formatCount(current, parsed.decimals, parsed.useComma)}${parsed.suffix}`;
  }

  /* ── Sizes ── */
  const statSize = getStatSize(statVal.length, isPortrait) * u;
  const labelSize = (isPortrait ? 44 : 38) * u;
  const labelMaxWidth = (isPortrait ? 860 : 1200) * u;
  const tagFont = (isPortrait ? 28 : 22) * u;
  const padX = (isPortrait ? 80 : 140) * u;
  const padY = (isPortrait ? 140 : 80) * u;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF', // default white background
      }}
    >
      {/* ── 1. Background: media (full-bleed) ya white + halka accent glow ── */}
      {hasMedia ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${kenBurns})`,
            transformOrigin: 'center center',
          }}
        >
          {isVid ? (
            <Loop durationInFrames={VIDEO_LOOP_FRAMES}>
              <OffthreadVideo
                src={resolvedSrc}
                volume={0}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Loop>
          ) : (
            <Img src={resolvedSrc} alt="Stat visual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          {/* Blur hata diya: ab media clearly dikhta hai, sirf halka scrim text ke liye */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(2, 6, 23, 0.55) 0%, rgba(2, 6, 23, 0.68) 50%, rgba(2, 6, 23, 0.82) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2, 6, 23, 0.5) 100%)',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 45%, rgba(255, 87, 34, 0.10) 0%, rgba(255, 255, 255, 0) 60%)',
          }}
        />
      )}

      {/* ── 2. Hero metric (center) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${padY}px ${padX}px`,
          zIndex: 10,
          textAlign: 'center',
        }}
      >
        {/* Tag: slanted rectangle + SVG icon */}
        <div style={{ clipPath: `inset(0 ${(1 - tagWipe) * 100}% 0 0)`, marginBottom: 32 * u }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12 * u,
              backgroundColor: ACCENT,
              color: '#FFFFFF',
              padding: `${10 * u}px ${44 * u}px ${10 * u}px ${24 * u}px`,
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%)',
            }}
          >
            <BarChartIcon size={tagFont * 1.1} />
            <span
              style={{
                fontFamily: headingFont,
                fontSize: tagFont,
                fontWeight: 900,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              KEY METRIC
            </span>
          </div>
        </div>

        {/* Hero number: count-up, width fixed taaki jitter na ho */}
        <div
          style={{
            display: 'grid',
            opacity: interpolate(numberIn, [0, 1], [0, 1], CLAMP),
            transform: `scale(${interpolate(numberIn, [0, 1], [0.9, 1])})`,
            filter: `drop-shadow(0 ${12 * u}px ${30 * u}px rgba(255, 87, 34, ${hasMedia ? 0.45 : 0.28}))`,
          }}
        >
          {/* Ghost: final text jagah gher leta hai (visible nahi) */}
          <span
            aria-hidden
            style={{
              gridArea: '1 / 1',
              visibility: 'hidden',
              fontFamily: headingFont,
              fontSize: statSize,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            {statVal}
          </span>
          <span
            style={{
              gridArea: '1 / 1',
              justifySelf: 'start',
              fontFamily: headingFont,
              fontSize: statSize,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #FF5722 0%, #FF7043 50%, #FFA000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {displayStat}
          </span>
        </div>

        {/* Accent line: beech se dono taraf draw hoti hai */}
        <div
          style={{
            width: 220 * u,
            height: 8 * u,
            marginTop: 28 * u,
            marginBottom: 32 * u,
            backgroundColor: ACCENT,
            transform: `scaleX(${lineGrow})`,
            transformOrigin: 'center center',
          }}
        />

        {/* Context label */}
        {statLbl && (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: labelSize,
              fontWeight: 700,
              color: labelColor,
              maxWidth: labelMaxWidth,
              lineHeight: 1.35,
              opacity: interpolate(labelIn, [0, 1], [0, 1], CLAMP),
              transform: `translateY(${interpolate(labelIn, [0, 1], [30, 0])}px)`,
              textShadow: hasMedia ? '0 4px 20px rgba(0, 0, 0, 0.9)' : undefined,
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            {statLbl}
          </div>
        )}
      </div>
    </div>
  );
}