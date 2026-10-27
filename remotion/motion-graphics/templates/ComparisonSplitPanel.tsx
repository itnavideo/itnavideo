import React from 'react';
import { ComparisonSchema } from '../schemas';
import { AnimatedText } from '../primitives';
import { interpolate, useCurrentFrame } from 'remotion';

export const ComparisonSplitPanel: React.FC<ComparisonSchema> = ({
  title,
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  theme = { primaryColor: '#4d94ff', secondaryColor: '#1a1a2e', accentColor: '#ff4d4d', backgroundColor: '#0f0f13', textColor: '#ffffff' }
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ flex: 1, backgroundColor: theme.backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px', color: theme.textColor, width: '100%', height: '100%' }}>
      <AnimatedText text={title} style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '60px' }} delay={10} />

      <div style={{ display: 'flex', width: '90%', gap: '40px', flex: 1 }}>
        {/* Left Panel */}
        <div style={{ flex: 1, backgroundColor: 'rgba(77, 148, 255, 0.1)', borderRadius: '32px', padding: '40px', border: `2px solid ${theme.primaryColor}` }}>
          <AnimatedText text={leftTitle} style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '40px', color: theme.primaryColor, textAlign: 'center' }} delay={20} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {leftItems.map((item, index) => {
              const delay = 30 + index * 10;
              const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: item.isPositive ? '#2ecc71' : '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
                    {item.isPositive ? '✓' : '✕'}
                  </div>
                  <div style={{ fontSize: '32px' }}>{item.feature}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, backgroundColor: 'rgba(255, 77, 77, 0.1)', borderRadius: '32px', padding: '40px', border: `2px solid ${theme.accentColor}` }}>
          <AnimatedText text={rightTitle} style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '40px', color: theme.accentColor, textAlign: 'center' }} delay={40} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {rightItems.map((item, index) => {
              const delay = 50 + index * 10;
              const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: item.isPositive ? '#2ecc71' : '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
                    {item.isPositive ? '✓' : '✕'}
                  </div>
                  <div style={{ fontSize: '32px' }}>{item.feature}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
