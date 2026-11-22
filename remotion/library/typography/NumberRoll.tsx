import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface NumberRollProps {
  targetNumber?: number;
  prefix?: string;
  suffix?: string;
  accentColor?: string;
  fontSize?: number;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * NumberRoll — Slot-machine mechanical digit tumbler odometer roll.
 * Tumbler columns spin rapidly through 0-9 before snapping into final targeted values.
 */
export function NumberRoll({
  targetNumber = 84920,
  prefix = '$',
  suffix = 'ARR',
  accentColor = '#22c55e',
  fontSize = 48,
  delay = 0,
  width = '100%',
  height = 160,
}: NumberRollProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const digits = targetNumber.toString().split('');

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 20,
        boxSizing: 'border-box',
        fontFamily: 'monospace, Inter, sans-serif',
      }}
    >
      {prefix && (
        <span style={{ fontSize, fontWeight: 900, color: accentColor }}>
          {prefix}
        </span>
      )}

      {/* Tumbler Columns */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {digits.map((digit, colIdx) => {
          const finalVal = parseInt(digit, 10);
          const rollSpr = spring({
            frame: Math.max(0, t - colIdx * 4),
            fps,
            config: { damping: 15, stiffness: 60 },
          });

          // Spin multiple rotations before landing on final digit
          const totalSteps = 20 + finalVal;
          const currentStep = Math.round(interpolate(rollSpr, [0, 1], [0, totalSteps])) % 10;

          return (
            <div
              key={colIdx}
              style={{
                width: fontSize * 0.65,
                height: fontSize * 1.3,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)',
              }}
            >
              <span
                style={{
                  fontSize,
                  fontWeight: 900,
                  color: '#ffffff',
                }}
              >
                {currentStep}
              </span>
            </div>
          );
        })}
      </div>

      {suffix && (
        <span style={{ fontSize: fontSize * 0.45, fontWeight: 800, color: '#94a3b8', marginLeft: 6 }}>
          {suffix}
        </span>
      )}
    </div>
  );
}
