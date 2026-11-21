import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FeynmanStep {
  stepNumber: number;
  title: string;
  desc: string;
  badge: string;
  color: string;
}

export interface FeynmanTechniqueAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  conceptName?: string;
}

/**
 * FeynmanTechniqueAsset
 * The 4-Step Accelerated Learning & Feynman Technique Framework.
 * Learned from Ali Abdaal's "How to Learn So Fast People Assume You're Naturally Gifted" (YouTube: szVXpM7VVMg).
 */
export const FeynmanTechniqueAsset: React.FC<FeynmanTechniqueAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  conceptName = 'Mastering Complex Skills Fast',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const steps: FeynmanStep[] = [
    {
      stepNumber: 1,
      title: 'Choose the Concept',
      desc: 'Isolate one high-yield topic or mental model on a blank page',
      badge: 'Step 1: Focus',
      color: '#0284C7',
    },
    {
      stepNumber: 2,
      title: 'Teach to a 10-Year-Old',
      desc: 'Explain aloud using plain language, simple analogies, and ZERO jargon',
      badge: 'Step 2: Simplify',
      color: '#EA580C',
    },
    {
      stepNumber: 3,
      title: 'Pinpoint Knowledge Gaps',
      desc: 'The exact moment you hesitate or use jargon is where your understanding breaks',
      badge: 'Step 3: Diagnose',
      color: '#EF4444',
    },
    {
      stepNumber: 4,
      title: 'Review, Refine & Retest',
      desc: 'Return to source material, reconstruct the explanation, and lock into memory',
      badge: 'Step 4: Mastery',
      color: '#059669',
    },
  ];

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 780,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
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
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The Feynman Technique
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Evidence-Based Meta-Learning • {conceptName}
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 18,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-4deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '3px 10px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Zero jargon allowed!
        </div>
      </div>

      {/* 4 Steps Vertical Grid / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, idx) => {
          const stepSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={step.stepNumber}
              style={{
                opacity: stepSpring,
                transform: `translateX(${interpolate(stepSpring, [0, 1], [-16, 0])}px)`,
                padding: '12px 18px',
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.07)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left Accent Bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: step.color,
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 6 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F4F4F5',
                    color: step.color,
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.stepNumber}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: isDark ? '#FFFFFF' : '#18181B',
                      marginBottom: 2,
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isDark ? '#A1A1AA' : '#64748B',
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                  border: `1px solid ${step.color}35`,
                  color: step.color,
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {step.badge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

