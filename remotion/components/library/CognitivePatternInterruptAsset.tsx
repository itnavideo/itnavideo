import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ResetPhaseItem {
  id: string;
  phaseNumber: string;
  title: string;
  neuroAction: string;
  scientificMechanism: string;
  immediateBenefit: string;
  accentColor: string;
}

export interface CognitivePatternInterruptAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  speakerName?: string;
  labName?: string;
}

/**
 * CognitivePatternInterruptAsset
 * The Anti-Doomscroll Pattern Interrupt & Emergency Mental Reset (Dr. Sahar Yousef Forensics)
 * 3-Phase Cognitive De-escalation Protocol:
 * 1. Physiological Sigh (Vagus nerve autonomic reset)
 * 2. Perspective Zoom-Out (Breaks catastrophic visual tunneling)
 * 3. Default Mode Network (DMN) Recharge (True rest vs Fake rest)
 * Learned from Dr. Sahar Yousef (YouTube: iXdb4vK49wU).
 */
export const CognitivePatternInterruptAsset: React.FC<CognitivePatternInterruptAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  speakerName = 'Dr. Sahar Yousef (UC Berkeley)',
  labName = 'Becoming Superhuman Lab • Neuro-De-escalation',
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

  const phases: ResetPhaseItem[] = [
    {
      id: 'phase-1-physiological',
      phaseNumber: 'PHASE 01',
      title: 'Physiological Sigh',
      neuroAction: 'Stop thumb motion. Take 2 quick nasal inhales followed by 1 long, slow mouth exhale.',
      scientificMechanism: 'Re-inflates collapsed alveoli & stimulates the vagus nerve, rapidly lowering heart rate.',
      immediateBenefit: 'Lowers Cortisol in 30s',
      accentColor: '#10B981',
    },
    {
      id: 'phase-2-zoom-out',
      phaseNumber: 'PHASE 02',
      title: 'Perspective Calibration',
      neuroAction: 'Ask: "Will what feels catastrophic today matter in 1 year? In 5 years?"',
      scientificMechanism: 'Deactivates amygdala tunnel vision; engages prefrontal context appraisal & scale realism.',
      immediateBenefit: 'Breaks Threat Tunneling',
      accentColor: '#2563EB',
    },
    {
      id: 'phase-3-dmn-recharge',
      phaseNumber: 'PHASE 03',
      title: 'DMN Recovery (True Rest)',
      neuroAction: 'Park the device face-down. Stare at a distant horizon or embrace deliberate sensory boredom.',
      scientificMechanism: 'Allows the Default Mode Network (DMN) to process emotions and empty cognitive backlog.',
      immediateBenefit: 'Restores Working Memory',
      accentColor: '#8B5CF6',
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
      {/* Title & Pattern Interrupt Header */}
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
                background: '#059669',
                color: '#ECFDF5',
              }}
            >
              PATTERN-INTERRUPT PROTOCOL
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              {speakerName} • {labName}
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
            The Anti-Doomscroll Emergency Mental Reset
          </h2>
        </div>

        {/* The Digital Pacifier Fallacy Badge */}
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
            The Digital Pacifier Trap
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            Scrolling <span style={{ color: '#DC2626' }}>≠</span> Resting
          </div>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>
            Screen feeding keeps working memory 85% loaded
          </div>
        </div>
      </div>

      {/* 3-Phase Horizontal Flow Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 16,
        }}
      >
        {phases.map((phase, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 4,
            fps,
            config: { damping: 15, stiffness: 130 },
          });

          return (
            <div
              key={phase.id}
              style={{
                borderRadius: 14,
                padding: '16px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: `1.5px solid ${phase.accentColor}45`,
                boxShadow: isDark
                  ? `0 10px 25px -5px ${phase.accentColor}18, 0 4px 6px -4px rgba(0, 0, 0, 0.3)`
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [24, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.95, 1])})`,
              }}
            >
              <div>
                {/* Header Tag + Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: `${phase.accentColor}20`,
                      color: phase.accentColor,
                    }}
                  >
                    {phase.phaseNumber}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F1F5F9',
                      color: phase.accentColor,
                    }}
                  >
                    {phase.immediateBenefit}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    margin: '0 0 4px',
                  }}
                >
                  {phase.title}
                </h3>

                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: isDark ? '#E2E8F0' : '#1E293B',
                    lineHeight: 1.4,
                  }}
                >
                  {phase.neuroAction}
                </p>
              </div>

              {/* Scientific Mechanism Box */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, color: phase.accentColor, textTransform: 'uppercase', marginBottom: 2 }}>
                  🧠 Neuroscience Mechanism
                </div>
                <div style={{ fontSize: 10.5, color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.35 }}>
                  {phase.scientificMechanism}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Horizon Anchor Doctrine Banner */}
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
            THE HORIZON DOCTRINE
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Phones Are Input Devices
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            They are not emotional sanctuaries
          </div>
        </div>

        {/* 1. Vagus Reset */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>1. AUTONOMIC BRAKE</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#86EFAC' }}>Physiological Sigh</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            2 quick inhales + 1 long exhale resets pulse instantly
          </div>
        </div>

        {/* 2. Scale Appraisal */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#38BDF8', fontWeight: 700 }}>2. SCALE REALISM</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#BAE6FD' }}>Zoom Out The Lens</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Panic exists only in narrow fields of view
          </div>
        </div>

        {/* 3. Real Recovery */}
        <div>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>3. DELIBERATE BOREDOM</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FDE68A' }}>DMN Activation</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Look at the physical horizon, not at a glass rectangle
          </div>
        </div>
      </div>
    </div>
  );
};
