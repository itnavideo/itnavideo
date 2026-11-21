import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AiSkillItem {
  id: string;
  number: string;
  title: string;
  role: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  description: string;
  bullets: string[];
  moatType: string;
}

export interface AiSkillsTrioAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * AiSkillsTrioAsset
 * 3-Pillar Card Framework: The 3 Core Human Skills in the Age of AI
 * 1. Practical AI Workflows (The AI Operator)
 * 2. Revenue Proximity (The Rainmaker / Value Generator)
 * 3. Personal Brand & Distribution (The Moat / Unfair Advantage)
 * Learned from Ali Abdaal's "3 Skills I'd Learn In the Age of AI" (YouTube: 7IeFVWJXp7E).
 */
export const AiSkillsTrioAsset: React.FC<AiSkillsTrioAssetProps> = ({
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

  const skills: AiSkillItem[] = [
    {
      id: 'ai-workflows',
      number: '01',
      title: 'Practical AI Workflows',
      role: 'The AI Operator',
      badge: '10x EXECUTION',
      badgeColor: '#0284C7',
      accentColor: '#0284C7',
      bgLight: '#F0F9FF',
      bgDark: 'rgba(2, 132, 199, 0.12)',
      description: 'Moving beyond casual chat to programmatic tool orchestration and agentic pipelines.',
      bullets: [
        'LLM chaining & agentic dev tools',
        'Automated media & content pipelines',
        '10x output as a solo operator',
      ],
      moatType: 'Efficiency Moat',
    },
    {
      id: 'revenue-proximity',
      number: '02',
      title: 'Revenue Proximity',
      role: 'The Rainmaker',
      badge: 'DIRECT CASHFLOW',
      badgeColor: '#059669',
      accentColor: '#059669',
      bgLight: '#F0FDF4',
      bgDark: 'rgba(5, 150, 105, 0.12)',
      description: 'Moving directly to where transactions happen — sales, client negotiation, and high-ticket offers.',
      bullets: [
        'High-ticket sales & deal closing',
        'Irresistible offer engineering',
        'Solving $10k+ client pain points',
      ],
      moatType: 'Economic Moat',
    },
    {
      id: 'personal-brand',
      number: '03',
      title: 'Personal Distribution',
      role: 'The Brand Moat',
      badge: 'UNFAIR ADVANTAGE',
      badgeColor: '#D97706',
      accentColor: '#D97706',
      bgLight: '#FFFBEB',
      bgDark: 'rgba(217, 119, 6, 0.12)',
      description: 'Reputation, voice, and trusted audience that cannot be copied or hallucinated by algorithms.',
      bullets: [
        'High-signal weekly newsletter',
        'Direct relationship with audience',
        'Inbound client pull vs outbound cold outreach',
      ],
      moatType: 'Distribution Moat',
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
          marginBottom: 18,
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
            3 Skills I&apos;d Learn in the Age of AI
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Defensible Human Moats vs Commoditized Labor
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
          Move closer to revenue!
        </div>
      </div>

      {/* 3 Columns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {skills.map((skill, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={skill.id}
              style={{
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [20, 0])}px)`,
                borderRadius: 16,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${skill.accentColor}33`
                  : `1px solid ${skill.accentColor}25`,
                boxShadow: isDark
                  ? '0 8px 24px rgba(0, 0, 0, 0.35)'
                  : '0 8px 24px rgba(0, 0, 0, 0.04)',
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: skill.accentColor,
                }}
              />

              <div>
                {/* Header row: Number + Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: skill.accentColor,
                      backgroundColor: isDark ? skill.bgDark : skill.bgLight,
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    SKILL {skill.number}
                  </span>

                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: skill.accentColor,
                      textTransform: 'uppercase',
                    }}
                  >
                    {skill.badge}
                  </span>
                </div>

                {/* Title & Role */}
                <h4
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: 16,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#18181B',
                    fontFamily: 'Lora, Georgia, serif',
                    lineHeight: 1.25,
                  }}
                >
                  {skill.title}
                </h4>

                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: skill.accentColor,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {skill.role}
                </div>

                {/* Description */}
                <p
                  style={{
                    margin: '0 0 14px 0',
                    fontSize: 12,
                    color: isDark ? '#A1A1AA' : '#64748B',
                    lineHeight: 1.45,
                  }}
                >
                  {skill.description}
                </p>

                {/* Bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                  {skill.bullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 6,
                        fontSize: 11.5,
                        color: isDark ? '#D4D4D8' : '#334155',
                        lineHeight: 1.35,
                      }}
                    >
                      <span
                        style={{
                          color: skill.accentColor,
                          fontWeight: 700,
                          fontSize: 12,
                          lineHeight: 1,
                          marginTop: 1,
                        }}
                      >
                        •
                      </span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Footer Tag */}
              <div
                style={{
                  marginTop: 6,
                  paddingTop: 8,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 10.5, color: isDark ? '#71717A' : '#94A3B8' }}>
                  Competitive Moat:
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#1E293B',
                  }}
                >
                  {skill.moatType}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

