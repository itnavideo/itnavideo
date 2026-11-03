import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface GoalTargetSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

/* ───────────────────────── SVG Icons ───────────────────────── */

function TargetIcon({ size = 20, color = '#EA580C' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ShieldIcon({ size = 18, color = '#FFA000' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function HomeIcon({ size = 18, color = '#38BDF8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ShoppingIcon({ size = 18, color = '#A855F7' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function LightbulbIcon({ size = 16, color = '#94A3B8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

export function GoalTargetScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: GoalTargetSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? true;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  // Entrances
  const headerSpring = spring({ frame: currentFrame, fps, config: { damping: 14, stiffness: 110 } });
  const card1Spring = spring({ frame: Math.max(0, currentFrame - 6), fps, config: { damping: 13, stiffness: 95 } });
  const card2Spring = spring({ frame: Math.max(0, currentFrame - 12), fps, config: { damping: 13, stiffness: 95 } });

  // Staggered animated progress bars
  const bar1Spring = spring({ frame: Math.max(0, currentFrame - 10), fps, config: { damping: 16, stiffness: 90 } });
  const bar2Spring = spring({ frame: Math.max(0, currentFrame - 14), fps, config: { damping: 16, stiffness: 90 } });
  const bar3Spring = spring({ frame: Math.max(0, currentFrame - 18), fps, config: { damping: 16, stiffness: 90 } });
  const goalSpring = spring({ frame: Math.max(0, currentFrame - 22), fps, config: { damping: 18, stiffness: 80 } });

  const heading = scene.heading || 'WEALTH CREATION BLUEPRINT';
  const supportingText = scene.supportingText || 'Target Savings & Strategic Capital Allocation';
  const statVal = scene.statValue || '$10,000 TARGET';

  // Dynamic progress fill
  const goalFill = interpolate(goalSpring, [0, 1], [0, 72]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPortrait ? `${160 * s}px ${50 * s}px ${180 * s}px` : `${50 * s}px ${80 * s}px`,
        backgroundColor: bg,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: bodyFont,
      }}
    >
      {/* ── Top Header ── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isPortrait ? `${24 * s}px` : `${32 * s}px`,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-20 * s, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: `${8 * s}px`,
            padding: `${6 * s}px ${18 * s}px`,
            borderRadius: `${999 * s}px`,
            backgroundColor: isDark ? 'rgba(255, 160, 0, 0.14)' : 'rgba(255, 160, 0, 0.16)',
            border: '1.5px solid rgba(255, 160, 0, 0.4)',
            color: '#FFA000',
            fontSize: `${13 * s}px`,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: `${10 * s}px`,
          }}
        >
          <TargetIcon size={16 * s} color="#FFA000" />
          <span>GOAL & ALLOCATION BLUEPRINT</span>
        </div>

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: isPortrait ? `${40 * s}px` : `${46 * s}px`,
            fontWeight: 900,
            color: textPrimary,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
          }}
        >
          {heading}
        </h1>
        <p style={{ fontSize: `${18 * s}px`, color: textSecondary, margin: `${8 * s}px 0 0 0`, fontWeight: 600 }}>
          {supportingText}
        </p>
      </div>

      {/* ── Main Cards Container: Column in 9:16 Portrait, Row in 16:9 Landscape ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: isPortrait ? `${18 * s}px` : `${28 * s}px`,
          width: '100%',
          maxWidth: isPortrait ? '540px' : '1160px',
        }}
      >
        {/* CARD 1: Allocation Breakdown */}
        <div
          style={{
            flex: 1,
            borderRadius: `${24 * s}px`,
            border: `2px solid ${cardBorder}`,
            backgroundColor: cardBg,
            padding: `${24 * s}px ${28 * s}px`,
            boxShadow: `0 ${15 * s}px ${40 * s}px rgba(0,0,0,0.2)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: card1Spring,
            transform: `scale(${interpolate(card1Spring, [0, 1], [0.92, 1])})`,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${14 * s}px` }}>
              <span style={{ fontSize: `${13 * s}px`, fontWeight: 900, color: textSecondary, textTransform: 'uppercase' }}>
                STRATEGIC SPLIT
              </span>
              <span
                style={{
                  backgroundColor: '#FFE600',
                  color: '#000000',
                  fontSize: `${12 * s}px`,
                  fontWeight: 900,
                  padding: `${3 * s}px ${10 * s}px`,
                  borderRadius: `${6 * s}px`,
                }}
              >
                50 / 30 / 20
              </span>
            </div>

            {/* Stepped Buckets with Animated Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${14 * s}px` }}>
              {/* Bucket 1: Needs */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: `${15 * s}px`, fontWeight: 700, color: textPrimary, marginBottom: `${6 * s}px` }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: `${6 * s}px` }}>
                    <HomeIcon size={16 * s} color="#38BDF8" /> Essential Needs
                  </span>
                  <span style={{ color: textSecondary }}>50%</span>
                </div>
                <div style={{ width: '100%', height: `${8 * s}px`, backgroundColor: isDark ? '#1E293B' : '#E2E8F0', borderRadius: `${4 * s}px`, overflow: 'hidden' }}>
                  <div style={{ width: `${50 * bar1Spring}%`, height: '100%', backgroundColor: '#38BDF8', borderRadius: `${4 * s}px` }} />
                </div>
              </div>

              {/* Bucket 2: Wants */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: `${15 * s}px`, fontWeight: 700, color: textPrimary, marginBottom: `${6 * s}px` }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: `${6 * s}px` }}>
                    <ShoppingIcon size={16 * s} color="#A855F7" /> Lifestyle & Growth
                  </span>
                  <span style={{ color: textSecondary }}>30%</span>
                </div>
                <div style={{ width: '100%', height: `${8 * s}px`, backgroundColor: isDark ? '#1E293B' : '#E2E8F0', borderRadius: `${4 * s}px`, overflow: 'hidden' }}>
                  <div style={{ width: `${30 * bar2Spring}%`, height: '100%', backgroundColor: '#A855F7', borderRadius: `${4 * s}px` }} />
                </div>
              </div>

              {/* Bucket 3: Emergency / Investments */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: `${15 * s}px`, fontWeight: 800, color: '#FFA000', marginBottom: `${6 * s}px` }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: `${6 * s}px` }}>
                    <ShieldIcon size={16 * s} color="#FFA000" /> Capital Compounding
                  </span>
                  <span style={{ color: '#FFA000', fontWeight: 900 }}>20%</span>
                </div>
                <div style={{ width: '100%', height: `${10 * s}px`, backgroundColor: isDark ? '#1E293B' : '#E2E8F0', borderRadius: `${5 * s}px`, overflow: 'hidden' }}>
                  <div style={{ width: `${20 * bar3Spring}%`, height: '100%', backgroundColor: '#FFA000', borderRadius: `${5 * s}px` }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: `${18 * s}px`, paddingTop: `${12 * s}px`, borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`, fontSize: `${13 * s}px`, color: textSecondary, display: 'flex', alignItems: 'center', gap: `${6 * s}px` }}>
            <LightbulbIcon size={14 * s} /> Automated deduction on receipt
          </div>
        </div>

        {/* CARD 2: Primary Goal Target Easel */}
        <div
          style={{
            flex: 1,
            borderRadius: `${24 * s}px`,
            border: `3px solid ${isDark ? '#FFA000' : '#EA580C'}`,
            backgroundColor: isDark ? '#1A2235' : '#FFFFFF',
            padding: `${24 * s}px ${28 * s}px`,
            boxShadow: `0 ${20 * s}px ${50 * s}px rgba(0,0,0,0.25)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: card2Spring,
            transform: `scale(${interpolate(card2Spring, [0, 1], [0.92, 1])})`,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${12 * s}px` }}>
              <span style={{ fontSize: `${13 * s}px`, fontWeight: 900, color: textSecondary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                PRIMARY TARGET
              </span>
              <span
                style={{
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  fontSize: `${12 * s}px`,
                  fontWeight: 900,
                  padding: `${3 * s}px ${10 * s}px`,
                  borderRadius: `${6 * s}px`,
                }}
              >
                MILESTONE
              </span>
            </div>

            {/* Giant Stat Value */}
            <div style={{ marginBottom: `${18 * s}px` }}>
              <div
                style={{
                  fontSize: isPortrait ? `${44 * s}px` : `${50 * s}px`,
                  fontWeight: 900,
                  color: textPrimary,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                {statVal}
              </div>
              <div
                style={{
                  width: `${120 * s}px`,
                  height: `${5 * s}px`,
                  backgroundColor: '#EA580C',
                  borderRadius: `${3 * s}px`,
                  marginTop: `${8 * s}px`,
                }}
              />
            </div>

            {/* Goal Progress Bar */}
            <div style={{ marginBottom: `${14 * s}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${14 * s}px`, fontWeight: 800, color: textPrimary, marginBottom: `${6 * s}px` }}>
                <span>Milestone Progress</span>
                <span style={{ color: '#10B981', fontWeight: 900 }}>72% Achieved</span>
              </div>
              <div style={{ width: '100%', height: `${12 * s}px`, backgroundColor: isDark ? '#0F172A' : '#E2E8F0', borderRadius: `${6 * s}px`, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${goalFill}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                    borderRadius: `${6 * s}px`,
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: `${16 * s}px`,
              paddingTop: `${12 * s}px`,
              borderTop: `2px dashed ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: `${13 * s}px`, fontWeight: 800, color: textSecondary }}>
              TIMELINE TO TARGET
            </span>
            <span style={{ fontSize: `${14 * s}px`, fontWeight: 900, color: '#10B981' }}>
              ON TRACK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalTargetScene;
