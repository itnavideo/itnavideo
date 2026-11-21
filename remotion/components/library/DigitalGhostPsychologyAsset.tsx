import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GhostContrastItem {
  id: string;
  dimension: string;
  activePoster: string;
  digitalGhost: string;
  neuroImpact: string;
}

export interface DigitalGhostPsychologyAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * DigitalGhostPsychologyAsset
 * The Psychology of People Who Never Post on Social Media (Dr. Sahar Yousef Forensics)
 * Contrasts Active Posters vs Digital Ghosts across Identity, Dopamine Loops, and Working Memory.
 * Highlights the 3 Cognitive Superpowers of living unobserved.
 * Learned from Dr. Sahar Yousef (YouTube: 5pcw25mQxCg).
 */
export const DigitalGhostPsychologyAsset: React.FC<DigitalGhostPsychologyAssetProps> = ({
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

  const contrastItems: GhostContrastItem[] = [
    {
      id: 'presence-vs-curation',
      dimension: 'Self-Perception Split',
      activePoster: 'Fragmented Self: Experiencing reality while calculating "How does this look online?"',
      digitalGhost: 'Integrated Presence: 100% absorbed in the immediate physical experience.',
      neuroImpact: 'Saves 20% Cognitive Load',
    },
    {
      id: 'dopamine-loop',
      dimension: 'Reward Architecture',
      activePoster: 'External Dopamine Casino: Dependent on intermittent variable rewards (likes, views, comments).',
      digitalGhost: 'Internal Locus of Control: Self-worth anchored in personal mastery & real craft.',
      neuroImpact: 'Zero Dopamine Withdrawal',
    },
    {
      id: 'ghost-audience',
      dimension: 'Audience Monitoring',
      activePoster: 'Ghost Audience Syndrome: Constant subconscious surveillance anxiety.',
      digitalGhost: 'Unobserved Freedom: Actions are private, spontaneous, and unburdened.',
      neuroImpact: 'Low Baseline Cortisol',
    },
    {
      id: 'deep-work-flow',
      dimension: 'Attention & Focus',
      activePoster: 'Attention Fragmentation: Frequent impulse to document, pause, and check stats.',
      digitalGhost: 'Deep Work Dominance: Sustains 3–4 hour deep flow blocks without friction.',
      neuroImpact: '3x Creative Output',
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
                background: '#10B981',
                color: '#ECFDF5',
              }}
            >
              BEHAVIORAL NEUROSCIENCE STUDY
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#94A3B8' : '#64748B',
              }}
            >
              Dr. Sahar Yousef • The Power of the "Digital Ghost"
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
            Psychology of People Who Never Post on Social Media
          </h2>
        </div>

        {/* Cognitive Bandwidth Gain Badge */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
            border: '1.5px solid #10B981',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
            The Digital Ghost Advantage
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            +25% Recovered <span style={{ color: '#10B981' }}>Working Memory</span>
          </div>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>
            Immunity to intermittent variable rewards
          </div>
        </div>
      </div>

      {/* 4 Contrast Rows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 16,
        }}
      >
        {contrastItems.map((item, idx) => {
          const rowSpring = spring({
            frame: frame - idx * 3,
            fps,
            config: { damping: 15, stiffness: 130 },
          });

          return (
            <div
              key={item.id}
              style={{
                borderRadius: 12,
                padding: '12px 16px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr 2fr 1fr',
                gap: 16,
                alignItems: 'center',
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [-16, 0])}px)`,
              }}
            >
              {/* Dimension Title */}
              <div>
                <strong style={{ fontSize: 13, color: isDark ? '#F8FAFC' : '#0F172A', display: 'block' }}>
                  {item.dimension}
                </strong>
              </div>

              {/* Active Poster (Red Flag) */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: 2 }}>
                  ⚠️ Active Poster Trap
                </div>
                <div style={{ fontSize: 11, color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.35 }}>
                  {item.activePoster}
                </div>
              </div>

              {/* Digital Ghost (Superpower) */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: 2 }}>
                  ✨ Digital Ghost Advantage
                </div>
                <div style={{ fontSize: 11, color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.35 }}>
                  {item.digitalGhost}
                </div>
              </div>

              {/* Neuro Impact Chip */}
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: isDark ? '#064E3B' : '#DCFCE7',
                    color: isDark ? '#A7F3D0' : '#15803D',
                    display: 'inline-block',
                  }}
                >
                  {item.neuroImpact}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Digital Sovereignty Banner */}
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
            THE DIGITAL GHOST DOCTRINE
          </span>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Mental Sovereignty
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>
            Live without an audience
          </div>
        </div>

        {/* 1. Internal Validation */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>1. INTERNAL LOCUS</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#86EFAC' }}>Quiet Confidence</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            You do not need strangers to validate your existence
          </div>
        </div>

        {/* 2. Zero Slot Machine */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#38BDF8', fontWeight: 700 }}>2. ZERO DOPAMINE CASINO</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#BAE6FD' }}>Deep Focus Shield</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Never waiting for notifications preserves cognitive flow
          </div>
        </div>

        {/* 3. Deep Relationships */}
        <div>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>3. AUTHENTIC LIVING</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FDE68A' }}>Pure Experience</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Memories are lived deeply, not manufactured for an algorithm
          </div>
        </div>
      </div>
    </div>
  );
};
