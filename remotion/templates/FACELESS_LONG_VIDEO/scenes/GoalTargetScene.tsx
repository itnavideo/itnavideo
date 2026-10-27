import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface GoalTargetSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function GoalTargetScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
}: GoalTargetSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrances
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const leftCardSpring = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 13, stiffness: 95 } });
  const rightCardSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 13, stiffness: 95 } });
  const progressSpring = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 18, stiffness: 80 } });

  const heading = scene.heading || '₹30,000 SALARY BLUEPRINT';
  const supportingText = scene.supportingText || '₹1 LAKH EMERGENCY FUND TARGET';
  const statVal = scene.statValue || '₹1,00,000';

  // Dynamic progress fill (0% -> 68%)
  const fillPercent = interpolate(progressSpring, [0, 1], [0, 68]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 80px',
        zIndex: 15,
        fontFamily: bodyFont,
      }}
    >
      {/* Top Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '38px',
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-25, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 230, 0, 0.15)',
            border: '1px solid rgba(255, 230, 0, 0.4)',
            color: '#FFE600',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <span>🇮🇳</span>
          <span>WEALTH CREATION BLUEPRINT</span>
        </div>

        <h1
          style={{
            fontFamily: headingFont,
            fontSize: '44px',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.85)',
          }}
        >
          {heading}
        </h1>
        <p style={{ fontSize: '16px', color: '#CBD5E1', margin: '8px 0 0 0', fontWeight: 600 }}>
          {supportingText}
        </p>
      </div>

      {/* Main 2-Card Warikoo Allocation Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: '32px',
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {/* LEFT CARD: Monthly Allocation (50/30/20) */}
        <div
          style={{
            flex: 1,
            borderRadius: '28px',
            border: '2px solid rgba(255, 255, 255, 0.14)',
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(20px)',
            padding: '36px 32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: leftCardSpring,
            transform: `scale(${interpolate(leftCardSpring, [0, 1], [0.9, 1])})`,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>
                MONTHLY CASHFLOW
              </span>
              <span
                style={{
                  backgroundColor: '#FFE600',
                  color: '#000000',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '6px',
                }}
              >
                50/30/20 RULE
              </span>
            </div>

            <div style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '24px' }}>
              ₹30,000 <span style={{ fontSize: '16px', color: '#64748B', fontWeight: 600 }}>/ month</span>
            </div>

            {/* Stepped Buckets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Needs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  <span>🏠 Needs (Rent, Food, EMI)</span>
                  <span style={{ color: '#94A3B8' }}>₹15,000 (50%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', backgroundColor: '#38BDF8', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Wants */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#CBD5E1', marginBottom: '6px' }}>
                  <span>☕ Wants (Outing, Shopping)</span>
                  <span style={{ color: '#94A3B8' }}>₹9,000 (30%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '30%', height: '100%', backgroundColor: '#A855F7', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Emergency Fund Savings (Key Focus) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#FFE600', marginBottom: '6px' }}>
                  <span>🛡️ Emergency Savings</span>
                  <span style={{ color: '#FFE600', fontWeight: 900 }}>₹6,000 (20%)</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#334155', borderRadius: '5px', overflow: 'hidden', boxShadow: '0 0 12px rgba(255, 230, 0, 0.4)' }}>
                  <div style={{ width: '20%', height: '100%', backgroundColor: '#FFE600', borderRadius: '5px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '12px', color: '#94A3B8' }}>
            💡 Automated SIP deduction on salary day
          </div>
        </div>

        {/* RIGHT CARD: The Physical Target Easel Card */}
        <div
          style={{
            flex: 1,
            borderRadius: '28px',
            border: '4px solid #FFFFFF',
            backgroundColor: '#FAFAFA',
            color: '#0F172A',
            padding: '36px 36px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 45px rgba(255, 230, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: rightCardSpring,
            transform: `scale(${interpolate(rightCardSpring, [0, 1], [0.9, 1])}) rotate(1.5deg)`,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                SAVINGS GOAL
              </span>
              <span
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '6px',
                }}
              >
                TARGET
              </span>
            </div>

            {/* Huge ₹1 LAKH Target with Red Underline */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 900,
                  color: '#070B14',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                {statVal}
              </div>
              {/* Red Accent Underline Bar */}
              <div
                style={{
                  width: '180px',
                  height: '6px',
                  backgroundColor: '#DC2626',
                  borderRadius: '3px',
                  marginTop: '8px',
                }}
              />
            </div>

            {/* Target Progress Bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                <span>Accumulated Fund</span>
                <span style={{ color: '#16A34A', fontWeight: 900 }}>₹68,000 (68%)</span>
              </div>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#E2E8F0', borderRadius: '7px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${fillPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #16A34A 0%, #22C55E 100%)',
                    borderRadius: '7px',
                    boxShadow: '0 0 10px rgba(22, 163, 74, 0.5)',
                  }}
                />
              </div>
            </div>

            {/* Milestones */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
              <span>₹0</span>
              <span>₹25K</span>
              <span>₹50K</span>
              <span>₹75K</span>
              <span style={{ color: '#070B14', fontWeight: 900 }}>₹1 Lakh 🎯</span>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '2px dashed #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>
              ESTIMATED TIME TO FREEDOM
            </span>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#16A34A' }}>
              ~5 MONTHS REMAINING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
