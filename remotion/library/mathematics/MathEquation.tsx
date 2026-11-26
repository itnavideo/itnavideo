import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface EquationStep {
  label: string;
  expression: string;
  explanation?: string;
  highlightToken?: string;
}

export interface MathEquationProps {
  title?: string;
  steps?: EquationStep[];
  currentStepIndex?: number;
  accentColor?: string;
  boxHighlight?: boolean;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_STEPS: EquationStep[] = [
  {
    label: 'Standard Quadratic Form',
    expression: 'a·x² + b·x + c = 0',
    explanation: 'Begin with standard second-degree polynomial form',
    highlightToken: 'a·x²',
  },
  {
    label: 'Divide by Leading Coefficient',
    expression: 'x² + (b/a)·x + (c/a) = 0',
    explanation: 'Normalize by dividing all terms by a (a ≠ 0)',
    highlightToken: 'b/a',
  },
  {
    label: 'Completing the Square',
    expression: '(x + b / 2a)² = (b² - 4ac) / 4a²',
    explanation: 'Add (b/2a)² to both sides to complete binomial square',
    highlightToken: 'b² - 4ac',
  },
  {
    label: 'Quadratic Formula Solution',
    expression: 'x = (-b ± √(b² - 4ac)) / 2a',
    explanation: 'Take square root and isolate x to derive roots',
    highlightToken: 'x =',
  },
];

/**
 * MathEquation — Mathematical formula and derivation presenter.
 * Features LaTeX-style typography, step-by-step equation derivation stages,
 * bounding box focus animation, and variable explanations.
 */
export function MathEquation({
  title = 'Quadratic Formula Derivation',
  steps = DEFAULT_STEPS,
  currentStepIndex,
  accentColor = '#10b981',
  boxHighlight = true,
  delay = 0,
  width = '100%',
  height = 360,
}: MathEquationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Determine active step based on frame timeline if not locked
  const stepDuration = 45; // frames per step
  const autoStep = Math.min(
    steps.length - 1,
    Math.floor(adjustedFrame / stepDuration)
  );
  const activeIdx = currentStepIndex !== undefined ? currentStepIndex : autoStep;
  const currentStep = steps[activeIdx] || steps[0];

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: 'none',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Title & Step Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{title}</h3>

        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 4,
                borderRadius: 2,
                backgroundColor: i <= activeIdx ? accentColor : 'rgba(255, 255, 255, 0.15)',
                transition: 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Focus Formula Showcase */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          margin: '20px 0',
        }}
      >
        <span
          style={{
            color: accentColor,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {currentStep.label}
        </span>

        {/* Formula Box Frame */}
        <div
          style={{
            position: 'relative',
            padding: '16px 36px',
            borderRadius: 12,
            backgroundColor: '#18181b',
            border: boxHighlight
              ? `2px solid ${accentColor}`
              : '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: boxHighlight
              ? `0 0 30px ${accentColor}30, inset 0 0 15px ${accentColor}15`
              : 'none',
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 800,
              fontFamily: '"Cambria Math", "Times New Roman", serif',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            {currentStep.expression}
          </div>
        </div>

        {currentStep.explanation && (
          <p
            style={{
              margin: 0,
              color: '#94a3b8',
              fontSize: 13,
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: 500,
            }}
          >
            {currentStep.explanation}
          </p>
        )}
      </div>

      {/* Footer Step Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 12,
          fontSize: 11,
          color: '#71717a',
          fontWeight: 600,
        }}
      >
        <span>Step {activeIdx + 1} of {steps.length}</span>
        <span style={{ color: accentColor }}>Formal Mathematical Derivation</span>
      </div>
    </div>
  );
}
