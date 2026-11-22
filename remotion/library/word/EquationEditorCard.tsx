import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EquationEditorCardProps {
  formulaTitle?: string;
  formulaLatex?: string;
  themeColor?: string;
}

export const EquationEditorCard: React.FC<EquationEditorCardProps> = (props) => {
  const {
    formulaTitle = "Quadratic Formula & Root Derivation",
    formulaLatex = "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    themeColor = "#2B579A",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: '8px',
        padding: '32px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>EQUATION TOOLS • DESIGN</span>
          <span style={{ fontSize: '11px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Cambria Math</span>
        </div>

        {/* Center Display Equation Box */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>{formulaTitle}</div>
          <div style={{
            fontSize: '28px',
            fontFamily: 'Cambria Math, Cambria, Georgia, serif',
            fontStyle: 'italic',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>x = </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '2px' }}>-b ± √(b² - 4ac)</div>
              <div style={{ paddingTop: '2px' }}>2a</div>
            </div>
          </div>
        </div>

        {/* Formula Structure Toolbar Mock */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {['Fraction', 'Script', 'Radical', 'Integral', 'Large Operator', 'Bracket'].map((btn) => (
            <div key={btn} style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#475569' }}>
              {btn}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
