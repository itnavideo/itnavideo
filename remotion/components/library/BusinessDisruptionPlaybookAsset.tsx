import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DisruptionStageItem {
  id: string;
  stageNumber: string;
  year: string;
  title: string;
  subtitle: string;
  tactic: string;
  impactMetric: string;
  accentColor: string;
}

export interface BusinessDisruptionPlaybookAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  brandName?: string;
  playbookTitle?: string;
  capitalBet?: string;
}

/**
 * BusinessDisruptionPlaybookAsset
 * 4-Stage Zero-Dollar Market Disruption Playbook (CA Rahul Malodia Forensics)
 * Breaks down Mukesh Ambani's Jio Masterstroke:
 * 1. Free Data Habituation (100M in 170 days)
 * 2. Hardware Trojan Horse (JioPhone ₹0)
 * 3. Competitor Annihilation (12 Telcos to Duopoly)
 * 4. Global Big-Tech Monetization (Meta & Google ₹1.52 Lakh Cr)
 * Learned from CA Rahul Malodia (YouTube: BvrgGNyDTSc).
 */
export const BusinessDisruptionPlaybookAsset: React.FC<BusinessDisruptionPlaybookAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  brandName = 'Reliance Jio (Mukesh Ambani)',
  playbookTitle = 'The Zero-Dollar Market Disruption Playbook',
  capitalBet = '$35 Billion Upfront Capex • 100% 4G VoLTE Only',
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

  const stages: DisruptionStageItem[] = [
    {
      id: 'stage-1-free-data',
      stageNumber: 'STAGE 01',
      year: '2016',
      title: 'Free Data Habituation',
      subtitle: 'Unlimited 4G & VoLTE Calls',
      tactic: 'Eliminated per-minute calling and gave unlimited data free for 9 months, creating irreversible user habits.',
      impactMetric: '100M Users in 170 Days',
      accentColor: '#10B981',
    },
    {
      id: 'stage-2-jiophone',
      stageNumber: 'STAGE 02',
      year: '2017',
      title: 'Hardware Trojan Horse',
      subtitle: 'Effective ₹0 4G JioPhone',
      tactic: '₹1,500 refundable security deposit phone brought 100M+ 2G feature phone users into the 4G digital ecosystem.',
      impactMetric: '100M+ JioPhones Sold',
      accentColor: '#2563EB',
    },
    {
      id: 'stage-3-annihilation',
      stageNumber: 'STAGE 03',
      year: '2018-19',
      title: 'Competitor Annihilation',
      subtitle: '12 Telcos Reduced to Duopoly',
      tactic: 'Incumbents bled billions under unsustainable price wars; Aircel & Docomo shut down, Vodafone & Idea merged.',
      impactMetric: '12 Telcos ➔ 2 Survivors',
      accentColor: '#EF4444',
    },
    {
      id: 'stage-4-bigtech-deleveraging',
      stageNumber: 'STAGE 04',
      year: '2020',
      title: 'Big-Tech Deleveraging',
      subtitle: 'Meta & Google Mega Investment',
      tactic: 'Sold 33% stake in Jio Platforms during lockdown to Meta ($5.7B), Google ($4.5B) & top PEs, clearing all debt.',
      impactMetric: '₹1.52 Lakh Cr Raised',
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
      {/* Title & Ambani Masterstroke Header */}
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
                background: '#EA580C',
                color: '#FFF7ED',
              }}
            >
              BUSINESS STRATEGY MASTERSTROKE
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              {capitalBet}
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
            {brandName}: {playbookTitle}
          </h2>
        </div>

        {/* The Habituation Rule Badge */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: isDark ? 'rgba(30, 41, 59, 0.8)' : '#F1F5F9',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
            The Digital Habit Trap
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            Data Cost: ₹250/GB ➔ <span style={{ color: '#16A34A' }}>₹10/GB</span>
          </div>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>
            India moved from #155 to #1 in global mobile data
          </div>
        </div>
      </div>

      {/* 4-Stage Horizontal Progression Deck */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {stages.map((stage, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 4,
            fps,
            config: { damping: 15, stiffness: 130 },
          });

          return (
            <div
              key={stage.id}
              style={{
                borderRadius: 14,
                padding: '16px 14px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: `1.5px solid ${stage.accentColor}45`,
                boxShadow: isDark
                  ? `0 10px 25px -5px ${stage.accentColor}18, 0 4px 6px -4px rgba(0, 0, 0, 0.3)`
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [24, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.95, 1])})`,
                position: 'relative',
              }}
            >
              {/* Top Step + Year Tag */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: `${stage.accentColor}20`,
                      color: stage.accentColor,
                    }}
                  >
                    {stage.stageNumber}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: isDark ? '#94A3B8' : '#64748B',
                    }}
                  >
                    {stage.year}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    margin: '0 0 2px',
                  }}
                >
                  {stage.title}
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: stage.accentColor,
                    marginBottom: 10,
                  }}
                >
                  {stage.subtitle}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: isDark ? '#CBD5E1' : '#475569',
                    lineHeight: 1.4,
                    paddingTop: 8,
                    borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9',
                  }}
                >
                  {stage.tactic}
                </p>
              </div>

              {/* Bottom Result Pill */}
              <div
                style={{
                  marginTop: 12,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 9, color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase' }}>
                  Strategic Result
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: stage.accentColor }}>
                  ⚡ {stage.impactMetric}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Takeaway / The Ambani Doctrine Banner */}
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
            THE AMBANI DOCTRINE
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Scale Destroys Unit Economics
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            Disruption law for business founders
          </div>
        </div>

        {/* 1. Infrastructure Bet */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#38BDF8', fontWeight: 700 }}>1. LEAPFROG TECHNOLOGY</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#BAE6FD' }}>Zero Legacy Baggage</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Skipped 2G/3G entirely; 100% all-IP data network
          </div>
        </div>

        {/* 2. Habit Over Revenue */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>2. HABIT BEFORE MONETIZATION</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#86EFAC' }}>Make It Irreplaceable</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Once 500M people rely on video data, pricing power is won
          </div>
        </div>

        {/* 3. Platform Valuation */}
        <div>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>3. CONVERT TELCO TO TECH</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FDE68A' }}>Software Multiples</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Valued as a digital platform (Meta/Google), not a pipe
          </div>
        </div>
      </div>
    </div>
  );
};
