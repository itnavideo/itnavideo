import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface RoadmapSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

interface MilestoneStep {
  number: string;
  title: string;
  detail: string;
  badge?: string;
  accent?: string;
}

export function RoadmapScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
}: RoadmapSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const progressSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 18, stiffness: 80 } });

  const heading = scene.heading || 'THE 2026 ACCELERATED ROADMAP';
  const supportingText = scene.supportingText || 'Step-by-step master progression';

  // Extract or synthesize 4 milestone steps
  const steps: MilestoneStep[] =
    scene.listItems && scene.listItems.length >= 3
      ? scene.listItems.slice(0, 4).map((item, i) => {
          const parts = item.split(/[:•-]/);
          return {
            number: `0${i + 1}`,
            title: (parts[0] || `STAGE ${i + 1}`).trim(),
            detail: (parts[1] || parts[0] || 'Core milestone competency').trim(),
            badge: i === 3 ? 'FINAL DESTINATION' : `PHASE ${i + 1}`,
            accent: i === 3 ? '#10B981' : i === 0 ? '#38BDF8' : i === 1 ? '#FF5722' : '#FFA000',
          };
        })
      : [
          {
            number: '01',
            title: 'Foundations & Math',
            detail: 'Python syntax, tensors, vectors & GPU compute',
            badge: 'STEP 1',
            accent: '#38BDF8',
          },
          {
            number: '02',
            title: 'RAG & Context',
            detail: 'Embedding models, vector stores & chunk retrieval',
            badge: 'STEP 2',
            accent: '#FF5722',
          },
          {
            number: '03',
            title: 'Fine-Tuning',
            detail: 'LoRA, Unsloth, Llama 3 & open weights',
            badge: 'STEP 3',
            accent: '#FFA000',
          },
          {
            number: '04',
            title: 'Autonomous Agents',
            detail: 'Tool calling, Model Context Protocol & production swarms',
            badge: 'MASTERY',
            accent: '#10B981',
          },
        ];

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
          marginBottom: '50px',
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
            backgroundColor: 'rgba(255, 87, 34, 0.12)',
            border: '1px solid rgba(255, 87, 34, 0.35)',
            color: '#FFA000',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <span>🚀</span>
          <span>STEP-BY-STEP PROGRESSION</span>
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
        <p style={{ fontSize: '15px', color: '#94A3B8', margin: '8px 0 0 0', fontWeight: 600 }}>
          {supportingText}
        </p>
      </div>

      {/* Horizontal Roadmap Track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1240px',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        {/* Animated Connecting Beam Behind Cards */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '60px',
            right: '60px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${interpolate(progressSpring, [0, 1], [0, 100])}%`,
              background: 'linear-gradient(90deg, #38BDF8 0%, #FF5722 50%, #10B981 100%)',
              boxShadow: '0 0 16px rgba(255, 87, 34, 0.8)',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* 4 Step Milestone Cards */}
        {steps.map((st, i) => {
          const stepSpring = spring({
            frame: Math.max(0, frame - 12 - i * 6),
            fps,
            config: { damping: 13, stiffness: 100 },
          });

          const scale = interpolate(stepSpring, [0, 1], [0.85, 1.0]);
          const opacity = interpolate(stepSpring, [0, 0.5, 1], [0, 0.8, 1]);
          const translateY = interpolate(stepSpring, [0, 1], [30, 0]);

          return (
            <div
              key={i}
              style={{
                position: 'relative',
                flex: 1,
                zIndex: 2,
                borderRadius: '24px',
                border: `2px solid ${i === 3 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
                backgroundColor: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(20px)',
                padding: '24px 20px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transform: `scale(${scale}) translateY(${translateY}px)`,
                opacity,
              }}
            >
              {/* Top Node Pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: st.accent,
                    color: '#070B14',
                    fontWeight: 900,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 16px ${st.accent}80`,
                  }}
                >
                  {st.number}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    color: st.accent,
                    backgroundColor: `${st.accent}15`,
                    border: `1px solid ${st.accent}40`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.06em',
                  }}
                >
                  {st.badge}
                </div>
              </div>

              {/* Title & Detail */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: headingFont,
                    fontSize: '19px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    margin: '0 0 8px 0',
                    lineHeight: 1.25,
                  }}
                >
                  {st.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
                  {st.detail}
                </p>
              </div>

              {/* Bottom Progress Check */}
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: st.accent,
                }}
              >
                <span>✓</span>
                <span>MILESTONE {st.number}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
