import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FunnelPillar {
  step: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  icon: string;
}

export interface ConversionFunnelPsychologyAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * ConversionFunnelPsychologyAsset
 * What 500M App Downloads Taught Me About Human Psychology (The Superwall Blueprint)
 * Vanity Views vs Conversion Fit, The "Main Character" Rule, and Psychological Onboarding.
 * Learned from Superwall / Joseph Choi (YouTube: Qh314MypshM).
 */
export const ConversionFunnelPsychologyAsset: React.FC<ConversionFunnelPsychologyAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const pillars: FunnelPillar[] = [
    {
      step: '01',
      title: 'Targeted Pain Hooks',
      subtitle: 'Mine 1-star reviews and comments to use the user’s exact emotional vocabulary.',
      badge: 'CONTENT-MARKET FIT',
      accentColor: '#0284C7',
      icon: '🎯',
    },
    {
      step: '02',
      title: 'The Main Character Rule',
      subtitle: 'The product organically solves the story climax without feeling like an ad.',
      badge: 'ORGANIC INTEGRATION',
      accentColor: '#6366F1',
      icon: '📱',
    },
    {
      step: '03',
      title: 'Psychological Priming',
      subtitle: 'Force user self-reflection on their pain point before displaying the paywall.',
      badge: 'EMOTIONAL BUY-IN',
      accentColor: '#059669',
      icon: '🧠',
    },
    {
      step: '04',
      title: 'The FYP Trust Loop',
      subtitle: 'Seeing the app 3-5x builds subconscious safety and triggers organic search.',
      badge: 'INTENT CONVERSION',
      accentColor: '#D97706',
      icon: '🔄',
    },
  ];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 880,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title & Callout Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [14, 0])}px)`,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The 500M Download Conversion Blueprint
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Superwall Insights: Why 30M Vanity Views Fail &amp; How Real Funnels Convert
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 20,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-3deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '4px 12px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Views don&apos;t pay bills — conversions do!
        </div>
      </div>

      {/* Split Comparison Cards: Vanity vs Conversion */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Left: Vanity Trap */}
        <div
          style={{
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px 14px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: '#EF4444',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>
              The Vanity Trap: Generic Viral Views
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                color: '#EF4444',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              30M Views = 0 Downloads
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11.5, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.4 }}>
            Entertaining pranks and broad memes generate millions of eyes but zero commercial intent. Audience watches for the joke, not the product.
          </p>
        </div>

        {/* Right: Content-Market Fit */}
        <div
          style={{
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.25)',
            padding: '12px 14px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: '#059669',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              Content-Market Fit: Targeted Problem-Solving
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                color: '#059669',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              50k Views = 5k Paid Buyers
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11.5, color: isDark ? '#E4E4E7' : '#1E293B', lineHeight: 1.4, fontWeight: 500 }}>
            Exact before-and-after transformations speaking to an acute pain point. Higher commercial intent converts viewers directly into paying subscribers.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {pillars.map((pil, idx) => {
          const pillarSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={pil.step}
              style={{
                opacity: pillarSpring,
                transform: `translateY(${interpolate(pillarSpring, [0, 1], [16, 0])}px)`,
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${pil.accentColor}33`
                  : `1px solid ${pil.accentColor}25`,
                boxShadow: isDark
                  ? '0 6px 18px rgba(0, 0, 0, 0.35)'
                  : '0 6px 18px rgba(0, 0, 0, 0.04)',
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: pil.accentColor,
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: pil.accentColor,
                      backgroundColor: isDark ? `${pil.accentColor}22` : `${pil.accentColor}12`,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    PILLAR {pil.step}
                  </span>
                  <span style={{ fontSize: 13 }}>{pil.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: pil.accentColor,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {pil.badge}
                </div>

                <h4
                  style={{
                    margin: '0 0 6px 0',
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#18181B',
                    fontFamily: 'Lora, Georgia, serif',
                    lineHeight: 1.25,
                  }}
                >
                  {pil.title}
                </h4>

                <p style={{ margin: 0, fontSize: 11, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.4 }}>
                  {pil.subtitle}
                </p>
              </div>

              <div
                style={{
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 10,
                  color: pil.accentColor,
                  fontWeight: 600,
                }}
              >
                <span>✓</span>
                <span>High-Converting</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

