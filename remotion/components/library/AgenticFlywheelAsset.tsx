import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FlywheelStage {
  step: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  icon: string;
}

export interface AgenticFlywheelAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * AgenticFlywheelAsset
 * The Agentic AI Coding Flywheel: Chatbot vs Terminal Agent (The Claude Code Paradigm)
 * Learned from Ali Abdaal's "The Ultimate Beginner's Guide to Claude Code" (YouTube: qLMYOhaKcZs).
 */
export const AgenticFlywheelAsset: React.FC<AgenticFlywheelAssetProps> = ({
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

  const stages: FlywheelStage[] = [
    {
      step: '01',
      title: 'Plain-English Intent',
      subtitle: 'Ask AI what to build; describe end-state without syntax anxiety.',
      badge: 'PROMPT SPEC',
      accentColor: '#0284C7',
      icon: '💡',
    },
    {
      step: '02',
      title: 'Direct Shell & File Tools',
      subtitle: 'Agent edits code, installs packages, and triggers local terminal commands.',
      badge: 'AUTONOMOUS ACTIONS',
      accentColor: '#6366F1',
      icon: '⚡',
    },
    {
      step: '03',
      title: 'Self-Correction Loop',
      subtitle: 'Catches compiler errors, inspects test logs, and self-heals bugs.',
      badge: 'AUTO-DEBUGGING',
      accentColor: '#059669',
      icon: '🔄',
    },
    {
      step: '04',
      title: 'Shipped Live Software',
      subtitle: 'Full-stack working dashboards and apps shipped in minutes.',
      badge: 'SHIPPED PRODUCT',
      accentColor: '#D97706',
      icon: '🚀',
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
            The Agentic AI Coding Flywheel
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Passive Text Chat vs Active Terminal Agent (The Claude Code Paradigm)
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
          Shift from coder to director!
        </div>
      </div>

      {/* Top Split Comparison: Chatbot vs Terminal Agent */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Left: Web Chatbot */}
        <div
          style={{
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(148, 163, 184, 0.25)' : '1px solid #E2E8F0',
            padding: '12px 14px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Standard Web Chat (ChatGPT / Claude.ai)
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8' }}>Passive Advice</span>
          </div>
          <p style={{ margin: 0, fontSize: 11.5, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.4 }}>
            Like texting an architect who replies with blueprints. You still have to manually copy-paste, debug errors, and write the code yourself.
          </p>
        </div>

        {/* Right: Terminal Agent */}
        <div
          style={{
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
            padding: '12px 14px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              Terminal Agent (Claude Code / Antigravity)
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#059669',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              ● LIVE EXECUTION
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11.5, color: isDark ? '#E4E4E7' : '#1E293B', lineHeight: 1.4, fontWeight: 500 }}>
            The architect is on-site with power tools. Directly reads directories, edits files, executes terminal commands, and self-heals bugs.
          </p>
        </div>
      </div>

      {/* 4-Stage Flywheel Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {stages.map((st, idx) => {
          const stageSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={st.step}
              style={{
                opacity: stageSpring,
                transform: `translateY(${interpolate(stageSpring, [0, 1], [16, 0])}px)`,
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${st.accentColor}33`
                  : `1px solid ${st.accentColor}25`,
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
                  backgroundColor: st.accentColor,
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: st.accentColor,
                      backgroundColor: isDark ? `${st.accentColor}22` : `${st.accentColor}12`,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    STAGE {st.step}
                  </span>
                  <span style={{ fontSize: 13 }}>{st.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: st.accentColor,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {st.badge}
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
                  {st.title}
                </h4>

                <p style={{ margin: 0, fontSize: 11, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.4 }}>
                  {st.subtitle}
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
                  color: st.accentColor,
                  fontWeight: 600,
                }}
              >
                <span>✓</span>
                <span>Active Flywheel</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

