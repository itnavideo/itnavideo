import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DualPhoneShowcase } from '../components/DualPhoneShowcase';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface ComparisonSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

/* ───────────────────────── SVG Icons ───────────────────────── */

function ScaleIcon({ size = 18, color = '#EA580C' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M6 8l6-5 6 5" />
      <path d="M3 13l3-5 3 5a3 3 0 0 1-6 0z" />
      <path d="M15 13l3-5 3 5a3 3 0 0 1-6 0z" />
    </svg>
  );
}

function TrendDownIcon({ size = 16, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function TrendUpIcon({ size = 16, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function ComparisonScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: ComparisonSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? false;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#475569';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.95)' : '#FFFFFF';

  // Staggered entrances
  const headerSpring = spring({ frame: currentFrame, fps, config: { damping: 14, stiffness: 100 } });
  const leftSpring   = spring({ frame: Math.max(0, currentFrame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const rightSpring  = spring({ frame: Math.max(0, currentFrame - 12), fps, config: { damping: 14, stiffness: 90 } });
  const vsSpring     = spring({ frame: Math.max(0, currentFrame - 8), fps, config: { damping: 10, stiffness: 180 } });

  const heading = scene.heading || 'PARADIGM SHIFT & COMPARISON';
  const leftItem = scene.comparisonItems?.left || scene.heading || 'Traditional Manual Approach';
  const rightItem = scene.comparisonItems?.right || scene.supportingText || 'Strategic Modern Blueprint';

  const contextString = `${heading} ${leftItem} ${rightItem} ${scene.narrationSegment?.text || ''}`;
  const isDualDevice = !isPortrait && /phone|mobile|app|store|sales|revenue|digital product|earnings|\$96|\$356|planner|shop/i.test(contextString);

  const leftOffset = interpolate(leftSpring, [0, 1], [isPortrait ? -30 * s : -60 * s, 0]);
  const rightOffset = interpolate(rightSpring, [0, 1], [isPortrait ? 30 * s : 60 * s, 0]);
  const vsScale = interpolate(vsSpring, [0, 1], [0.3, 1.0]);

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
        zIndex: 15,
        backgroundColor: bg,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: bodyFont,
      }}
    >
      {/* ── Eyebrow + Header ── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isPortrait ? `${24 * s}px` : `${36 * s}px`,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-20 * s, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: `${8 * s}px`,
            padding: `${6 * s}px ${16 * s}px`,
            borderRadius: `${999 * s}px`,
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.12)',
            border: '1px solid rgba(234, 88, 12, 0.35)',
            color: '#EA580C',
            fontSize: `${13 * s}px`,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: `${10 * s}px`,
          }}
        >
          <ScaleIcon size={16 * s} color="#EA580C" />
          <span>PARADIGM COMPARISON</span>
        </div>

        <h2
          style={{
            fontFamily: headingFont,
            fontSize: isPortrait ? `${38 * s}px` : `${44 * s}px`,
            fontWeight: 900,
            color: textPrimary,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: 0,
            maxWidth: isPortrait ? '800px' : '1000px',
          }}
        >
          {heading}
        </h2>
      </div>

      {isDualDevice ? (
        <DualPhoneShowcase
          leftRevenue="$96/day"
          rightRevenue="$356/day"
          leftSubtitle="Manual Workflow"
          rightSubtitle="Automated AI Agent"
        />
      ) : (
        /* Adaptive Comparison Layout: Vertical Stack in 9:16, Side-by-Side in 16:9 */
        <div
          style={{
            display: 'flex',
            flexDirection: isPortrait ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isPortrait ? `${14 * s}px` : `${28 * s}px`,
            width: '100%',
            maxWidth: isPortrait ? '520px' : '1000px',
          }}
        >
          {/* LEFT CARD: The Old Way */}
          <div
            style={{
              flex: 1,
              width: isPortrait ? '100%' : 'auto',
              borderRadius: `${24 * s}px`,
              border: `2px solid rgba(239, 68, 68, ${isDark ? '0.4' : '0.3'})`,
              backgroundColor: cardBg,
              padding: `${26 * s}px ${30 * s}px`,
              boxShadow: `0 ${12 * s}px ${35 * s}px rgba(0, 0, 0, ${isDark ? '0.3' : '0.06'})`,
              opacity: leftSpring,
              transform: isPortrait ? `translateY(${leftOffset}px)` : `translateX(${leftOffset}px)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: isPortrait ? `${130 * s}px` : `${240 * s}px`,
              boxSizing: 'border-box',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${14 * s}px` }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: `${6 * s}px`,
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: `${4 * s}px ${12 * s}px`,
                    borderRadius: `${999 * s}px`,
                    fontSize: `${12 * s}px`,
                    fontWeight: 800,
                    color: '#EF4444',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  ✕ THE OLD WAY
                </span>
                <span style={{ fontSize: `${12 * s}px`, color: textSecondary, fontWeight: 700 }}>Legacy Model</span>
              </div>

              <div
                style={{
                  fontFamily: headingFont,
                  fontSize: isPortrait ? `${24 * s}px` : `${26 * s}px`,
                  fontWeight: 800,
                  color: textPrimary,
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                }}
              >
                {leftItem}
              </div>
            </div>

            <div
              style={{
                marginTop: `${14 * s}px`,
                paddingTop: `${12 * s}px`,
                borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                fontSize: `${13 * s}px`,
                color: '#EF4444',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: `${6 * s}px`,
              }}
            >
              <TrendDownIcon size={16 * s} color="#EF4444" />
              <span>Low retention & high friction</span>
            </div>
          </div>

          {/* CENTER BADGE: VS Node */}
          <div
            style={{
              zIndex: 10,
              width: `${56 * s}px`,
              height: `${56 * s}px`,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF5722 0%, #FFA000 100%)',
              border: `3px solid ${isDark ? '#090D16' : '#FFFFFF'}`,
              boxShadow: `0 ${8 * s}px ${24 * s}px rgba(255, 87, 34, 0.4)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: headingFont,
              fontSize: `${18 * s}px`,
              fontWeight: 900,
              letterSpacing: '0.05em',
              transform: `scale(${vsScale})`,
              flexShrink: 0,
            }}
          >
            VS
          </div>

          {/* RIGHT CARD: The Advantage */}
          <div
            style={{
              flex: 1,
              width: isPortrait ? '100%' : 'auto',
              borderRadius: `${24 * s}px`,
              border: `2px solid rgba(16, 185, 129, ${isDark ? '0.45' : '0.35'})`,
              backgroundColor: cardBg,
              padding: `${26 * s}px ${30 * s}px`,
              boxShadow: `0 ${12 * s}px ${35 * s}px rgba(16, 185, 129, ${isDark ? '0.2' : '0.08'})`,
              opacity: rightSpring,
              transform: isPortrait ? `translateY(${rightOffset}px)` : `translateX(${rightOffset}px)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: isPortrait ? `${130 * s}px` : `${240 * s}px`,
              boxSizing: 'border-box',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: `${14 * s}px` }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: `${6 * s}px`,
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: `${4 * s}px ${12 * s}px`,
                    borderRadius: `${999 * s}px`,
                    fontSize: `${12 * s}px`,
                    fontWeight: 800,
                    color: '#10B981',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  ✓ THE NEW PARADIGM
                </span>
                <span style={{ fontSize: `${12 * s}px`, color: '#10B981', fontWeight: 800 }}>High Leverage</span>
              </div>

              <div
                style={{
                  fontFamily: headingFont,
                  fontSize: isPortrait ? `${24 * s}px` : `${26 * s}px`,
                  fontWeight: 800,
                  color: textPrimary,
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                }}
              >
                {rightItem}
              </div>
            </div>

            <div
              style={{
                marginTop: `${14 * s}px`,
                paddingTop: `${12 * s}px`,
                borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                fontSize: `${13 * s}px`,
                color: '#10B981',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: `${6 * s}px`,
              }}
            >
              <TrendUpIcon size={16 * s} color="#10B981" />
              <span>Effortless compounding advantage</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparisonScene;
