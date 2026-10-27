import React from 'react';
import { FeatureHighlightsSchema } from '../schemas';
import { AnimatedText } from '../primitives';
import { interpolate, useCurrentFrame } from 'remotion';

export const FeatureHighlightsGrid: React.FC<FeatureHighlightsSchema> = ({
  title,
  subtitle,
  features,
  theme = { primaryColor: '#4d94ff', secondaryColor: '#1a1a2e', accentColor: '#ff4d4d', backgroundColor: '#0f0f13', textColor: '#ffffff' }
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ flex: 1, backgroundColor: theme.backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: theme.textColor, width: '100%', height: '100%' }}>
      <AnimatedText text={title} style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '20px' }} delay={10} />
      {subtitle && <AnimatedText text={subtitle} style={{ fontSize: '32px', opacity: 0.7, marginBottom: '60px' }} delay={20} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', width: '100%', maxWidth: '1400px' }}>
        {features.map((feature, index) => {
          const delay = 40 + index * 10;
          const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const translateY = interpolate(frame - delay, [0, 20], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          return (
            <div key={feature.id} style={{ 
              backgroundColor: theme.secondaryColor, 
              padding: '40px', 
              borderRadius: '24px', 
              border: `1px solid rgba(255,255,255,0.05)`,
              opacity,
              transform: `translateY(${translateY}px)`
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: theme.primaryColor, marginBottom: '24px' }}></div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>{feature.title}</div>
              <div style={{ fontSize: '20px', opacity: 0.7, lineHeight: 1.5 }}>{feature.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
