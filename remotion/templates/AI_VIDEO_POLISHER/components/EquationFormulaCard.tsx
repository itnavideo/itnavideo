import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface EquationStep {
  value: string;
  label: string;
  accentColor?: string;
}

export interface EquationFormulaCardProps {
  step1: EquationStep;
  operator1?: string; // '×', '+', '÷'
  step2: EquationStep;
  operator2?: string; // '='
  result: EquationStep;
  triggerFrame?: number;
  style?: React.CSSProperties;
}

/**
 * Top Creator Equation & Formula Breakdown Card
 * Observed in Video 1 (Vanessa Lau at 95s: 1,000 VIEWS × $5 RPM = $5,000 ADSENSE)
 */
export const EquationFormulaCard: React.FC<EquationFormulaCardProps> = ({
  step1,
  operator1 = '×',
  step2,
  operator2 = '=',
  result,
  triggerFrame = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);

  // Staggered Spring Physics for each card & operator
  const s1 = spring({ frame: relFrame, fps, config: { damping: 13, stiffness: 180 } });
  const op1 = spring({ frame: Math.max(0, relFrame - 5), fps, config: { damping: 12, stiffness: 190 } });
  const s2 = spring({ frame: Math.max(0, relFrame - 10), fps, config: { damping: 13, stiffness: 180 } });
  const op2 = spring({ frame: Math.max(0, relFrame - 15), fps, config: { damping: 12, stiffness: 190 } });
  const sRes = spring({ frame: Math.max(0, relFrame - 20), fps, config: { damping: 11, stiffness: 170 } });

  const renderCard = (step: EquationStep, scale: number, isWinner = false) => (
    <div
      style={{
        transform: `scale(${scale})`,
        background: isWinner
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
          : '#FFFFFF',
        color: isWinner ? '#FFFFFF' : '#0F172A',
        borderRadius: 22,
        padding: '24px 32px',
        minWidth: 170,
        textAlign: 'center',
        border: isWinner ? '2px solid #22C55E' : '2px solid rgba(0,0,0,0.06)',
        boxShadow: isWinner
          ? '0 20px 40px rgba(34, 197, 94, 0.35), 0 10px 20px rgba(0,0,0,0.6)'
          : '0 20px 40px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 34,
          fontWeight: 900,
          color: step.accentColor || (isWinner ? '#22C55E' : '#E11D48'),
          letterSpacing: '-0.02em',
        }}
      >
        {step.value}
      </div>
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 16,
          fontWeight: 800,
          marginTop: 6,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: isWinner ? '#94A3B8' : '#64748B',
        }}
      >
        {step.label}
      </div>
    </div>
  );

  const renderOp = (symbol: string, scale: number) => (
    <div
      style={{
        transform: `scale(${scale})`,
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 38,
        fontWeight: 900,
        color: '#FFFFFF',
        textShadow: '0 4px 16px rgba(0,0,0,0.8)',
        margin: '0 16px',
      }}
    >
      {symbol}
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(5, 8, 15, 0.75)',
          backdropFilter: 'blur(20px)',
          padding: '24px 36px',
          borderRadius: 32,
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        {renderCard(step1, s1)}
        {renderOp(operator1, op1)}
        {renderCard(step2, s2)}
        {renderOp(operator2, op2)}
        {renderCard(result, sRes, true)}
      </div>
    </div>
  );
};

