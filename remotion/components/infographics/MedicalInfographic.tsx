import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MedicalVitalItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  status?: 'NORMAL' | 'ELEVATED' | 'OPTIMAL' | 'STABLE';
  color?: string;
  trend?: string;
}

export interface MedicalProtocolStep {
  phase: string;
  title: string;
  dosageOrTiming: string;
  status?: string;
}

export interface MedicalInfographicProps {
  title?: string;
  subtitle?: string;
  patientOrTrialContext?: string;
  vitals: MedicalVitalItem[];
  protocolSteps?: MedicalProtocolStep[];
  isDark?: boolean;
  accentColor?: string;
  sceneFrame?: number;
}

/**
 * MedicalInfographic
 * Healthcare, Biotech, and Clinical trial presentation infographic slide.
 * Features an animated ECG heart-rate monitor waveform, clinical vitals deck,
 * and therapeutic protocol roadmap.
 */
export const MedicalInfographic: React.FC<MedicalInfographicProps> = ({
  title = 'Clinical Vitals & Protocol Monitor',
  subtitle = 'Real-time physiological metrics and clinical intervention response',
  patientOrTrialContext = 'Phase III Trial • Cohort Alpha (N=1,420)',
  vitals,
  protocolSteps,
  isDark = false,
  accentColor = '#0284C7', // Clinical Medical Cyan-Sky
  sceneFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(30, 41, 59, 0.08)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#2C2B29';

  // ECG Pulse animation offset
  const ecgOffset = (frame * 4) % 400;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '50px 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          transform: `translateY(${(1 - headerSpring) * -20}px)`,
          opacity: headerSpring,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '6px',
                height: '32px',
                backgroundColor: accentColor,
                borderRadius: '3px',
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: '34px',
                fontFamily: 'Lora, "Playfair Display", Georgia, serif',
                fontWeight: 700,
                color: textPrimary,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h2>
          </div>
          {subtitle && (
            <p
              style={{
                margin: '8px 0 0 20px',
                fontSize: '17px',
                fontWeight: 500,
                color: textSecondary,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {patientOrTrialContext && (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 650,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: accentColor,
              backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)',
              border: `1px solid ${accentColor}33`,
            }}
          >
            ✚ {patientOrTrialContext}
          </span>
        )}
      </div>

      {/* ── LIVE ECG PULSE MONITOR STRIP ── */}
      <div
        style={{
          width: '100%',
          height: '90px',
          borderRadius: '16px',
          backgroundColor: isDark ? '#050B14' : '#0B132B',
          border: '1px solid rgba(2, 132, 199, 0.3)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* ECG Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(2, 132, 199, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(2, 132, 199, 0.12) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Animated ECG Pulse Waveform SVG */}
        <svg
          viewBox="0 0 1600 80"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <path
            d="
              M 0 40 L 100 40 L 120 40 L 130 18 L 140 65 L 155 8 L 170 52 L 180 40 L 250 40
              L 350 40 L 370 40 L 380 18 L 390 65 L 405 8 L 420 52 L 430 40 L 500 40
              L 600 40 L 620 40 L 630 18 L 640 65 L 655 8 L 670 52 L 680 40 L 750 40
              L 850 40 L 870 40 L 880 18 L 890 65 L 905 8 L 920 52 L 930 40 L 1000 40
              L 1100 40 L 1120 40 L 1130 18 L 1140 65 L 1155 8 L 1170 52 L 1180 40 L 1250 40
              L 1350 40 L 1370 40 L 1380 18 L 1390 65 L 1405 8 L 1420 52 L 1430 40 L 1600 40
            "
            fill="none"
            stroke="#10B981"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(-${ecgOffset}, 0)`}
          />
        </svg>

        {/* Live Status indicator */}
        <div
          style={{
            position: 'absolute',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(5, 11, 20, 0.8)',
            padding: '4px 12px',
            borderRadius: '999px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 650, color: '#10B981', letterSpacing: '0.06em' }}>
            ECG ACTIVE • 72 BPM
          </span>
        </div>
      </div>

      {/* ── 4-NODE CLINICAL VITALS DECK ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '18px',
          width: '100%',
          flex: 1,
        }}
      >
        {vitals.slice(0, 4).map((vital, idx) => {
          const vitalSpring = spring({
            frame: Math.max(0, frame - (10 + idx * 5)),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const vitalColor = vital.color || (
            idx === 0 ? '#EF4444' :
              idx === 1 ? '#0284C7' :
                idx === 2 ? '#10B981' :
                  '#8B5CF6'
          );

          return (
            <div
              key={`vital-${idx}`}
              style={{
                transform: `scale(${vitalSpring})`,
                opacity: vitalSpring,
                borderRadius: '20px',
                backgroundColor: cardBg,
                border: `1.5px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 14px 32px rgba(0,0,0,0.45)'
                  : '0 14px 32px rgba(180, 160, 140, 0.15)',
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: textSecondary, textTransform: 'uppercase' }}>
                  {vital.label}
                </span>
                {vital.status && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 650,
                      color: vitalColor,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: `${vitalColor}15`,
                    }}
                  >
                    {vital.status}
                  </span>
                )}
              </div>

              <div style={{ margin: '14px 0 6px 0' }}>
                <div style={{ fontSize: '38px', fontWeight: 700, color: textPrimary, lineHeight: 1.0 }}>
                  {vital.value}
                  {vital.unit && (
                    <span style={{ fontSize: '18px', fontWeight: 600, color: textSecondary, marginLeft: '4px' }}>
                      {vital.unit}
                    </span>
                  )}
                </div>
              </div>

              {vital.trend && (
                <div style={{ fontSize: '12px', fontWeight: 600, color: textSecondary }}>
                  {vital.trend}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

