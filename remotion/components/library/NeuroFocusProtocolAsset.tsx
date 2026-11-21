import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FocusFixItem {
  id: string;
  fixNumber: string;
  title: string;
  mechanism: string;
  actionRule: string;
  neuroBenefit: string;
  accentColor: string;
}

export interface NeuroFocusProtocolAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  speakerName?: string;
  labName?: string;
}

/**
 * NeuroFocusProtocolAsset
 * Why You Can't Focus Anymore & 6 Science-Backed Fixes (Dr. Sahar Yousef Forensics)
 * 6 Protocol Cards:
 * 1. Notification Audit (Orienting Reflex)
 * 2. Grayscale & Phone Parking Lot (Dopamine Casino)
 * 3. Daily MITs vs LITs (Needle Movers)
 * 4. Strict Single-Tasking (Attention Residue)
 * 5. Structured Focus Sprints (Deep Blocks)
 * 6. Chronotype Alignment (Biological Peaks)
 * Learned from Dr. Sahar Yousef (YouTube: E0CUX5RfI1k).
 */
export const NeuroFocusProtocolAsset: React.FC<NeuroFocusProtocolAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  speakerName = 'Dr. Sahar Yousef (UC Berkeley)',
  labName = 'Becoming Superhuman Lab • Cognitive Neuroscience',
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

  const fixes: FocusFixItem[] = [
    {
      id: 'fix-1-notifications',
      fixNumber: '01',
      title: 'The Notification Audit',
      mechanism: 'Pings trigger involuntary orienting responses, stealing attention before conscious awareness.',
      actionRule: 'Turn off all non-human app notifications; allow only direct emergency calls.',
      neuroBenefit: 'Stops Attention Hijack',
      accentColor: '#EF4444',
    },
    {
      id: 'fix-2-grayscale',
      fixNumber: '02',
      title: 'Grayscale & Phone Parking',
      mechanism: 'Vibrant app icons act as digital slot machines, stimulating compulsive dopamine loops.',
      actionRule: 'Set display to Grayscale; park phone physically in another room during deep work.',
      neuroBenefit: 'Saves ~60 Min/Day',
      accentColor: '#64748B',
    },
    {
      id: 'fix-3-mits-vs-lits',
      fixNumber: '03',
      title: 'Daily MITs vs LITs',
      mechanism: 'Brain craves easy Least Important Tasks (LITs) for fake dopamine while avoiding hard needle movers.',
      actionRule: 'Select 1–3 non-negotiable Most Important Tasks (MITs) before opening email or Slack.',
      neuroBenefit: 'High-Impact Leverage',
      accentColor: '#F59E0B',
    },
    {
      id: 'fix-4-single-tasking',
      fixNumber: '04',
      title: 'Strict Single-Tasking',
      mechanism: 'Multitasking is rapid task-switching that leaves heavy "Attention Residue" on the brain.',
      actionRule: 'Close all background tabs; complete one discrete task loop before opening the next.',
      neuroBenefit: 'Eliminates 40% Brain Tax',
      accentColor: '#2563EB',
    },
    {
      id: 'fix-5-focus-sprints',
      fixNumber: '05',
      title: 'Structured Focus Sprints',
      mechanism: 'Unstructured work leads to cognitive fatigue, daydreaming, and screen bouncing.',
      actionRule: 'Work in 45–90 min timed sprints with a predefined definition of success, then rest.',
      neuroBenefit: 'Sustainable Flow State',
      accentColor: '#10B981',
    },
    {
      id: 'fix-6-chronotype',
      fixNumber: '06',
      title: 'Chronotype Alignment',
      mechanism: 'Heavy cognitive lifting during biological energy valleys causes severe friction and burnout.',
      actionRule: 'Schedule hardest MITs during your natural circadian peak (Lion, Bear, or Wolf).',
      neuroBenefit: 'Peak Energy Sync',
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
      {/* Title & Neuroscientist Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
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
                background: '#4F46E5',
                color: '#EEF2FF',
              }}
            >
              ATTENTION NEUROSCIENCE BLUEPRINT
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
              fontSize: 25,
              fontWeight: 800,
              color: isDark ? '#F8FAFC' : '#0F172A',
              margin: '6px 0 0',
              letterSpacing: '-0.02em',
            }}
          >
            Why You Can't Focus Anymore (6 Science-Backed Fixes)
          </h2>
        </div>

        {/* Not A Willpower Failure Badge */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: isDark ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF',
            border: '1.5px solid #6366F1',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase' }}>
            The Core Neurological Truth
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: isDark ? '#F8FAFC' : '#0F172A' }}>
            Not a Willpower Failure
          </div>
          <div style={{ fontSize: 10, color: isDark ? '#94A3B8' : '#64748B' }}>
            Biological brains vs engineered dopamine traps
          </div>
        </div>
      </div>

      {/* 6 Protocol Cards (3x2 Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 14,
        }}
      >
        {fixes.map((fix, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 3,
            fps,
            config: { damping: 15, stiffness: 130 },
          });

          return (
            <div
              key={fix.id}
              style={{
                borderRadius: 12,
                padding: '14px',
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
                border: `1.5px solid ${fix.accentColor}40`,
                boxShadow: isDark
                  ? `0 8px 20px -4px ${fix.accentColor}15, 0 4px 6px -4px rgba(0, 0, 0, 0.3)`
                  : '0 8px 20px -4px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [20, 0])}px) scale(${interpolate(cardSpring, [0, 1], [0.96, 1])})`,
                position: 'relative',
              }}
            >
              <div>
                {/* Header Number + Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: `${fix.accentColor}20`,
                      color: fix.accentColor,
                    }}
                  >
                    FIX #{fix.fixNumber}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F1F5F9',
                      color: fix.accentColor,
                    }}
                  >
                    {fix.neuroBenefit}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    margin: '0 0 6px',
                  }}
                >
                  {fix.title}
                </h3>

                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: 11,
                    color: isDark ? '#94A3B8' : '#64748B',
                    lineHeight: 1.35,
                  }}
                >
                  {fix.mechanism}
                </p>
              </div>

              {/* Action Rule */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 800, color: fix.accentColor, textTransform: 'uppercase', marginBottom: 2 }}>
                  ⚡ Practical Rule
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#CBD5E1' : '#334155', lineHeight: 1.3 }}>
                  {fix.actionRule}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Attention Protection Banner */}
      <div
        style={{
          borderRadius: 12,
          padding: '12px 18px',
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
            THE ATTENTION BALANCE SHEET
          </span>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            Attention is a Finite Resource
          </div>
          <div style={{ fontSize: 10, color: '#94A3B8' }}>
            Protect your cognitive energy bank
          </div>
        </div>

        {/* 1. Time Lost */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#F87171', fontWeight: 700 }}>SCREEN-BOUNCING COST</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FCA5A5' }}>2+ Hours / Day Lost</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Constant rapid app switching destroys focus
          </div>
        </div>

        {/* 2. Attention Residue */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700 }}>ATTENTION RESIDUE</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FDE68A' }}>-40% Cognitive Speed</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Multitasking cuts IQ and executive function
          </div>
        </div>

        {/* 3. Grayscale ROI */}
        <div>
          <div style={{ fontSize: 10, color: '#4ADE80', fontWeight: 700 }}>GRAYSCALE RECOVERY</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#86EFAC' }}>+60 Min / Day Saved</div>
          <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.3 }}>
            Black & white display strips visual casino loops
          </div>
        </div>
      </div>
    </div>
  );
};
