import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ChronotypeItem {
  id: string;
  name: string;
  animalIcon: string;
  percentage: string;
  idealWakeTime: string;
  peakFocusWindow: string;
  riskFactor: string;
  accentColor: string;
}

export interface ChronotypeSleepMatrixAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * ChronotypeSleepMatrixAsset
 * Circadian Biology vs 5 AM Club Scam Matrix (Dr. Sahar Yousef Forensics)
 * Breaks down the 4 genetic chronotypes (Lions, Bears, Wolves, Dolphins),
 * Peak focus windows, Sleep Debt compound interest, and the Bedroom Sanctuary rule.
 * Learned from Dr. Sahar Yousef (YouTube: 203-Zj0FQG4).
 */
export const ChronotypeSleepMatrixAsset: React.FC<ChronotypeSleepMatrixAssetProps> = ({
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

  const chronotypes: ChronotypeItem[] = [
    {
      id: 'lion',
      name: 'The Lion',
      animalIcon: '🦁',
      percentage: '15% of Pop.',
      idealWakeTime: '5:00 AM – 6:00 AM',
      peakFocusWindow: '8:00 AM – 12:00 PM',
      riskFactor: 'Crashes early by 8:00 PM; struggles with late networking',
      accentColor: '#10B981',
    },
    {
      id: 'bear',
      name: 'The Bear',
      animalIcon: '🐻',
      percentage: '55% of Pop.',
      idealWakeTime: '7:00 AM – 8:00 AM',
      peakFocusWindow: '10:00 AM – 2:00 PM',
      riskFactor: 'Afternoon post-lunch slump; requires sunlight reset',
      accentColor: '#2563EB',
    },
    {
      id: 'wolf',
      name: 'The Wolf',
      animalIcon: '🐺',
      percentage: '15% of Pop.',
      idealWakeTime: '8:30 AM – 9:30 AM',
      peakFocusWindow: '4:00 PM – 10:00 PM',
      riskFactor: 'Forced 5 AM waking causes chronic sleep debt & brain fog',
      accentColor: '#8B5CF6',
    },
    {
      id: 'dolphin',
      name: 'The Dolphin',
      animalIcon: '🐬',
      percentage: '15% of Pop.',
      idealWakeTime: '6:30 AM – 7:30 AM',
      peakFocusWindow: '3:00 PM – 7:00 PM',
      riskFactor: 'Light sleeper / fragile deep sleep; highly sensitive to blue light',
      accentColor: '#F59E0B',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1220,
        margin: '0 auto',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Title & Neuroscientist Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-16, 0])}px)`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 999,
                background: '#6366F1',
                color: '#EEF2FF',
              }}
            >
              COGNITIVE NEUROSCIENCE DEBUNK
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              Dr. Sahar Yousef (UC Berkeley) • Circadian Biology
            </span>
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: isDark ? '#F8FAFC' : '#0F172A',
              margin: '6px 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            Why The 5 AM Morning Routine Fails Your Biology
          </h2>
        </div>

        {/* The Sleep Debt Warning Badge */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
            border: '1.5px solid #EF4444',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>
            The Sleep Debt Compound Trap
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            1 Hr Debt = <span style={{ color: '#DC2626' }}>-15% IQ & Focus</span>
          </div>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>
            Energy management beats time management
          </div>
        </div>
      </div>

      {/* 4 Chronotype Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {chronotypes.map((chrono, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 4,
            fps,
            config: { damping: 15, stiffness: 130 },
          });

          return (
            <div
              key={chrono.id}
              style={{
                borderRadius: 14,
                padding: '16px 14px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: `1.5px solid ${chrono.accentColor}45`,
                boxShadow: isDark
                  ? `0 10px 25px -5px ${chrono.accentColor}18, 0 4px 6px -4px rgba(0, 0, 0, 0.3)`
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [24, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.95, 1])})`,
                position: 'relative',
              }}
            >
              <div>
                {/* Header Icon + Name */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 20 }}>{chrono.animalIcon}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A', margin: 0 }}>
                      {chrono.name}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: `${chrono.accentColor}20`,
                      color: chrono.accentColor,
                    }}
                  >
                    {chrono.percentage}
                  </span>
                </div>

                {/* Metrics Stack */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: '8px 0',
                    borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <span style={{ color: isDark ? '#94A3B8' : '#64748B', display: 'block', fontSize: 10 }}>
                      Biological Wake Window
                    </span>
                    <strong style={{ color: chrono.accentColor, fontSize: 13 }}>
                      {chrono.idealWakeTime}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: isDark ? '#94A3B8' : '#64748B', display: 'block', fontSize: 10 }}>
                      Peak Deep Work Flow
                    </span>
                    <strong style={{ color: isDark ? '#E2E8F0' : '#1E293B', fontSize: 12 }}>
                      ⚡ {chrono.peakFocusWindow}
                    </strong>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: 11, color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.35 }}>
                  {chrono.riskFactor}
                </p>
              </div>

              {/* Bottom 5 AM Fit Badge */}
              <div
                style={{
                  marginTop: 10,
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: chrono.id === 'lion' ? '#10B981' : '#DC2626',
                  }}
                >
                  {chrono.id === 'lion' ? '✅ Natural 5 AM Fit' : '❌ 5 AM Destroys REM'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 Golden Neuroscience Sleep Rules Banner */}
      <div
        style={{
          borderRadius: 12,
          padding: '14px 20px',
          background: isDark ? 'rgba(15, 23, 42, 0.95)' : '#0F172A',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
          gap: 16,
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: '#38BDF8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            DR. SAHAR YOUSEF SLEEP PROTOCOL
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            The 3 Non-Negotiable Laws
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            Protect your cognitive energy bank
          </div>
        </div>

        {/* Rule 1 */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#F87171', fontWeight: 700 }}>1. NO-PHONE BEDROOM</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FCA5A5' }}>Sleep Sanctuary</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Charge phone in another room; eliminates pre-sleep dopamine spikes
          </div>
        </div>

        {/* Rule 2 */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>2. 30-MIN DIGITAL SUNSET</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FDE68A' }}>Zero Blue Light</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Screens off 30 min before bed allows natural melatonin release
          </div>
        </div>

        {/* Rule 3 */}
        <div>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>3. ANCHOR WAKE TIME</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#86EFAC' }}>Consistent Alarm</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Wake at the same time 7 days/week to lock your circadian clock
          </div>
        </div>
      </div>
    </div>
  );
};
