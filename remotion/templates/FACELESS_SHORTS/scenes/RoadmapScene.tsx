import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface RoadmapSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

interface MilestoneStep {
  number: string;
  title: string;
  detail: string;
  badge?: string;
  accent?: string;
}

/* ───────────────────────── SVG Icons ───────────────────────── */

function RocketIcon({ size = 16, color = '#FFA000' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 9V4s3.03.55 4 2c1.08 1.62 0 5 0 5" />
    </svg>
  );
}

function FlagCheckIcon({ size = 18, color = '#10B981' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

export function RoadmapScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: RoadmapSceneProps) {
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

  // Entrance springs
  const headerSpring = spring({ frame: currentFrame, fps, config: { damping: 14, stiffness: 110 } });
  const progressSpring = spring({ frame: Math.max(0, currentFrame - 8), fps, config: { damping: 18, stiffness: 80 } });

  const heading = scene.heading || 'STRATEGIC MASTER ROADMAP';
  const supportingText = scene.supportingText || 'Step-by-step sequential blueprint';

  // Extract or synthesize 4 milestone steps
  const steps: MilestoneStep[] =
    scene.listItems && scene.listItems.length >= 3
      ? scene.listItems.slice(0, 4).map((item, i) => {
          const parts = item.split(/[:•-]/);
          return {
            number: `0${i + 1}`,
            title: (parts[0] || `STAGE ${i + 1}`).trim(),
            detail: (parts[1] || parts[0] || 'Core milestone competency').trim(),
            badge: i === 3 ? 'DESTINATION' : `PHASE ${i + 1}`,
            accent: i === 3 ? '#10B981' : i === 0 ? '#38BDF8' : i === 1 ? '#FF5722' : '#FFA000',
          };
        })
      : [
          {
            number: '01',
            title: 'Foundation & Principles',
            detail: 'Core fundamentals, leverage drivers & workflow setup',
            badge: 'PHASE 1',
            accent: '#38BDF8',
          },
          {
            number: '02',
            title: 'Systems & Architecture',
            detail: 'Automated ingestion, context design & scaling loop',
            badge: 'PHASE 2',
            accent: '#FF5722',
          },
          {
            number: '03',
            title: 'Execution & Velocity',
            detail: 'Rapid iteration, distribution engine & optimization',
            badge: 'PHASE 3',
            accent: '#FFA000',
          },
          {
            number: '04',
            title: 'Autonomous Scale',
            detail: 'Compounding assets, sustainable leverage & full mastery',
            badge: 'DESTINATION',
            accent: '#10B981',
          },
        ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPortrait ? `${160 * s}px ${45 * s}px ${180 * s}px` : `${50 * s}px ${80 * s}px`,
        zIndex: 15,
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
            padding: `${6 * s}px ${18 * s}px`,
            borderRadius: `${999 * s}px`,
            backgroundColor: isDark ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 87, 34, 0.15)',
            border: '1.5px solid rgba(255, 87, 34, 0.35)',
            color: '#FFA000',
            fontSize: `${13 * s}px`,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: `${10 * s}px`,
          }}
        >
          <RocketIcon size={16 * s} color="#FFA000" />
          <span>PROGRESSION ROADMAP</span>
        </div>

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: isPortrait ? `${38 * s}px` : `${44 * s}px`,
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

      {/* ── Roadmap Track: Vertical Stack in 9:16 Portrait, Horizontal in 16:9 Landscape ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isPortrait ? '520px' : '1160px',
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          alignItems: 'stretch',
          gap: isPortrait ? `${14 * s}px` : `${18 * s}px`,
        }}
      >
        {/* Animated Connecting Beam (Landscape only) */}
        {!isPortrait && (
          <div
            style={{
              position: 'absolute',
              top: `${40 * s}px`,
              left: `${60 * s}px`,
              right: `${60 * s}px`,
              height: `${4 * s}px`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              zIndex: 1,
              borderRadius: `${2 * s}px`,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${interpolate(progressSpring, [0, 1], [0, 100])}%`,
                background: 'linear-gradient(90deg, #38BDF8 0%, #FF5722 50%, #10B981 100%)',
                boxShadow: '0 0 16px rgba(255, 87, 34, 0.8)',
                borderRadius: `${2 * s}px`,
              }}
            />
          </div>
        )}

        {/* 4 Step Milestone Cards */}
        {steps.map((st, i) => {
          const stepSpring = spring({
            frame: Math.max(0, currentFrame - 10 - i * 5),
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          const scale = interpolate(stepSpring, [0, 1], [0.9, 1.0]);
          const opacity = stepSpring;
          const offset = interpolate(stepSpring, [0, 1], [isPortrait ? 20 * s : 30 * s, 0]);

          return (
            <div
              key={i}
              style={{
                position: 'relative',
                flex: 1,
                zIndex: 2,
                borderRadius: `${20 * s}px`,
                border: `2px solid ${i === 3 ? 'rgba(16, 185, 129, 0.5)' : cardBorder}`,
                backgroundColor: cardBg,
                padding: isPortrait ? `${16 * s}px ${20 * s}px` : `${24 * s}px ${20 * s}px`,
                boxShadow: `0 ${15 * s}px ${40 * s}px rgba(0, 0, 0, ${isDark ? '0.35' : '0.06'})`,
                display: 'flex',
                flexDirection: isPortrait ? 'row' : 'column',
                alignItems: isPortrait ? 'center' : 'stretch',
                gap: isPortrait ? `${16 * s}px` : '0',
                opacity,
                transform: isPortrait ? `translateY(${offset}px)` : `translateY(${offset}px) scale(${scale})`,
                boxSizing: 'border-box',
              }}
            >
              {/* Number Circle Badge */}
              <div
                style={{
                  width: `${44 * s}px`,
                  height: `${44 * s}px`,
                  borderRadius: '50%',
                  backgroundColor: `${st.accent}22`,
                  border: `2px solid ${st.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: st.accent,
                  fontSize: `${18 * s}px`,
                  fontWeight: 900,
                  flexShrink: 0,
                  marginBottom: isPortrait ? '0' : `${14 * s}px`,
                }}
              >
                {i === 3 ? <FlagCheckIcon size={20 * s} color={st.accent} /> : st.number}
              </div>

              {/* Text Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * s}px`, marginBottom: `${4 * s}px` }}>
                  <span
                    style={{
                      fontSize: `${11 * s}px`,
                      fontWeight: 800,
                      color: st.accent,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {st.badge}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: headingFont,
                    fontSize: isPortrait ? `${18 * s}px` : `${19 * s}px`,
                    fontWeight: 800,
                    color: textPrimary,
                    lineHeight: 1.25,
                    marginBottom: `${4 * s}px`,
                  }}
                >
                  {st.title}
                </div>

                <div
                  style={{
                    fontSize: `${13 * s}px`,
                    color: textSecondary,
                    lineHeight: 1.35,
                    fontWeight: 500,
                  }}
                >
                  {st.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoadmapScene;
