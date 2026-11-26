import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProofStep {
  stepNumber: number;
  assertion: string;
  justification: string;
}

export interface MathProofProps {
  theoremName?: string;
  statement?: string;
  steps?: ProofStep[];
  staggerFrames?: number;
  delay?: number;
  width?: number | string;
  accentColor?: string;
}

const DEFAULT_PROOF_STEPS: ProofStep[] = [
  { stepNumber: 1, assertion: 'Assume √2 is rational: √2 = p / q with gcd(p, q) = 1', justification: 'Proof by Contradiction hypothesis' },
  { stepNumber: 2, assertion: 'Squaring both sides yields: 2 = p² / q² ⟹ p² = 2q²', justification: 'Algebraic squaring' },
  { stepNumber: 3, assertion: 'Since 2q² is even, p² is even ⟹ p is even (p = 2k)', justification: "Euclid's Lemma on prime divisibility" },
  { stepNumber: 4, assertion: '(2k)² = 2q² ⟹ 4k² = 2q² ⟹ q² = 2k² ⟹ q is even', justification: 'Substitution and division by 2' },
  { stepNumber: 5, assertion: 'Both p and q are even, contradicting gcd(p, q) = 1', justification: 'Contradiction established ∎ Q.E.D.' },
];

/**
 * MathProof — Step-by-step formal mathematical proof presenter.
 * Features theorem statement, numbered logical deduction rows,
 * justification tags, and Q.E.D. resolution badge.
 */
export function MathProof({
  theoremName = 'Irrationality of the Square Root of Two',
  statement = 'Theorem: There are no integers p, q such that (p/q)² = 2.',
  steps = DEFAULT_PROOF_STEPS,
  staggerFrames = 12,
  delay = 0,
  width = '100%',
  accentColor = '#10b981',
}: MathProofProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: 'relative',
        width,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: 'none',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Theorem Title & Statement */}
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>{theoremName}</h3>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#a1a1aa',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            FORMAL PROOF
          </span>
        </div>
        <p style={{ margin: '6px 0 0 0', color: '#38bdf8', fontSize: 13, fontStyle: 'italic', fontFamily: 'serif' }}>
          {statement}
        </p>
      </div>

      {/* Numbered Deduction Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, idx) => {
          const itemFrame = Math.max(0, frame - delay - idx * staggerFrames);
          const spr = spring({
            frame: itemFrame,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.8 },
          });

          const translateY = interpolate(spr, [0, 1], [20, 0]);
          const opacity = interpolate(spr, [0, 1], [0, 1]);

          const isFinal = idx === steps.length - 1;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                borderRadius: 8,
                backgroundColor: isFinal ? `${accentColor}15` : '#18181b',
                border: isFinal ? `1px solid ${accentColor}60` : '1px solid rgba(255, 255, 255, 0.06)',
                transform: `translateY(${translateY}px)`,
                opacity,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: isFinal ? accentColor : 'rgba(255, 255, 255, 0.15)',
                    color: isFinal ? '#09090b' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {step.stepNumber}
                </span>

                <span
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: '"Cambria Math", "Times New Roman", serif',
                  }}
                >
                  {step.assertion}
                </span>
              </div>

              <span style={{ color: '#71717a', fontSize: 11, fontStyle: 'italic', textAlign: 'right' }}>
                {step.justification}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
