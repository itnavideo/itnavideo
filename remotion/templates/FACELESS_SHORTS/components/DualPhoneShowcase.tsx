import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DualPhoneShowcaseProps {
  leftRevenue?: string;
  leftSubtitle?: string;
  rightRevenue?: string;
  rightSubtitle?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}

export function DualPhoneShowcase({
  leftRevenue = '$96,947',
  leftSubtitle = 'Total Earnings',
  rightRevenue = '$356,598',
  rightSubtitle = 'Digital Product Store',
  fontFamily = 'Montserrat, Inter, system-ui, sans-serif',
  style = {},
}: DualPhoneShowcaseProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Gentle breathing float
  const floatYLeft = Math.sin((frame / fps) * 2.2) * 5;
  const floatYRight = Math.cos((frame / fps) * 2.0) * 5;

  const currentScale = interpolate(entrance, [0, 1], [0.85, 1]);
  const currentOpacity = interpolate(entrance, [0, 0.4, 1], [0, 0.9, 1]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '90px',
        width: '100%',
        maxWidth: '1100px',
        transform: `scale(${currentScale})`,
        opacity: currentOpacity,
        fontFamily,
        ...style,
      }}
    >
      {/* ── LEFT PHONE (Analytics & Income Dashboard) ── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${floatYLeft}px) rotate(-4.5deg)`,
        }}
      >
        {/* Floating Top Revenue Pill */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            backgroundColor: '#FF3D00',
            color: '#FFFFFF',
            fontSize: '34px',
            fontWeight: 900,
            padding: '8px 24px',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(255, 61, 0, 0.45), 0 4px 12px rgba(0,0,0,0.8)',
            border: '3px solid #FFFFFF',
            letterSpacing: '-0.02em',
            zIndex: 10,
          }}
        >
          {leftRevenue}
        </div>

        {/* Hand-drawn curved arrow SVG pointing to phone */}
        <svg
          width="70"
          height="60"
          viewBox="0 0 70 60"
          fill="none"
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-35px',
            zIndex: 11,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
          }}
        >
          <path
            d="M 15 10 Q 5 45 45 45"
            stroke="#FF3D00"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="45,38 58,45 45,52" fill="#FF3D00" />
        </svg>

        {/* Smartphone Shell */}
        <div
          style={{
            width: '270px',
            height: '480px',
            borderRadius: '42px',
            border: '5px solid #475569',
            backgroundColor: '#0F172A',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 61, 0, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            position: 'relative',
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              width: '74px',
              height: '18px',
              backgroundColor: '#000000',
              borderRadius: '12px',
              alignSelf: 'center',
              marginBottom: '18px',
            }}
          />

          {/* App Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              DASHBOARD
            </span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 800 }}>● LIVE</span>
          </div>

          {/* Sales Metric */}
          <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.85)', padding: '14px', borderRadius: '16px', marginBottom: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Total Revenue</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>$13,250.00</div>
            <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 700, marginTop: '4px' }}>+42.8% this week</div>
          </div>

          {/* Mini Bar Chart */}
          <div style={{ flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Sales Velocity</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '8px' }}>
              {[45, 65, 38, 85, 100, 72].map((height, i) => {
                const barProgress = interpolate(
                  frame,
                  [i * 4, i * 4 + 18],
                  [0, height],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${barProgress}%`,
                      backgroundColor: i === 4 ? '#FF3D00' : '#334155',
                      borderRadius: '6px 6px 0 0',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 700, marginTop: '14px' }}>
          {leftSubtitle}
        </div>
      </div>

      {/* ── RIGHT PHONE (Digital Product Storefront) ── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${floatYRight}px) rotate(4.5deg)`,
        }}
      >
        {/* Floating Top Revenue Pill */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            backgroundColor: '#FF3D00',
            color: '#FFFFFF',
            fontSize: '34px',
            fontWeight: 900,
            padding: '8px 24px',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(255, 61, 0, 0.45), 0 4px 12px rgba(0,0,0,0.8)',
            border: '3px solid #FFFFFF',
            letterSpacing: '-0.02em',
            zIndex: 10,
          }}
        >
          {rightRevenue}
        </div>

        {/* Hand-drawn curved arrow SVG pointing to phone */}
        <svg
          width="70"
          height="60"
          viewBox="0 0 70 60"
          fill="none"
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-35px',
            zIndex: 11,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
          }}
        >
          <path
            d="M 55 10 Q 65 45 25 45"
            stroke="#FF3D00"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <polygon points="25,38 12,45 25,52" fill="#FF3D00" />
        </svg>

        {/* Smartphone Shell */}
        <div
          style={{
            width: '270px',
            height: '480px',
            borderRadius: '42px',
            border: '5px solid #475569',
            backgroundColor: '#0F172A',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 61, 0, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            position: 'relative',
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              width: '74px',
              height: '18px',
              backgroundColor: '#000000',
              borderRadius: '12px',
              alignSelf: 'center',
              marginBottom: '18px',
            }}
          />

          {/* Store Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              ONLINE STORE
            </span>
            <span style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 800 }}>✦ VERIFIED</span>
          </div>

          {/* Product Hero Card */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#1E293B',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255, 87, 34, 0.2)',
                  color: '#FF7043',
                  fontSize: '9px',
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.06em',
                }}
              >
                AI DIGITAL PLANNER
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF', margin: '8px 0 4px 0', lineHeight: 1.25 }}>
                Planners that work with your brain
              </h4>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0 }}>
                Instant PDF Download • 2,400+ sold
              </p>
            </div>

            {/* Price & Buy Button */}
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', marginBottom: '8px' }}>
                $27.00
              </div>
              <div
                style={{
                  backgroundColor: '#FF5722',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 18px rgba(255, 87, 34, 0.4)',
                }}
              >
                Buy Now ➔
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 700, marginTop: '14px' }}>
          {rightSubtitle}
        </div>
      </div>
    </div>
  );
}
