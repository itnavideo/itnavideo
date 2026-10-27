import React from 'react';
import { StatisticsSchema } from '../schemas';
import { AnimatedText } from '../primitives';
import { interpolate, useCurrentFrame } from 'remotion';

export const StatisticsCounterBold: React.FC<StatisticsSchema> = ({
  title,
  subtitle,
  stats,
  theme = { primaryColor: '#4d94ff', secondaryColor: '#1a1a2e', accentColor: '#ff4d4d', backgroundColor: '#0f0f13', textColor: '#ffffff' }
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ flex: 1, backgroundColor: theme.backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: theme.textColor, width: '100%', height: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <AnimatedText text={title} style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '20px' }} delay={10} />
        {subtitle && <AnimatedText text={subtitle} style={{ fontSize: '36px', opacity: 0.7 }} delay={20} />}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '60px', width: '100%' }}>
        {stats.map((stat, index) => {
          const delay = 40 + index * 15;
          const progress = interpolate(frame - delay, [0, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          // Animate the number counting up
          const currentValue = Math.floor(interpolate(progress, [0, 1], [0, stat.value]));

          return (
            <div key={stat.id} style={{ 
              backgroundColor: theme.secondaryColor, 
              padding: '60px 40px', 
              borderRadius: '24px', 
              border: `1px solid rgba(255,255,255,0.1)`,
              minWidth: '300px',
              textAlign: 'center',
              opacity: progress > 0 ? 1 : 0,
              transform: `scale(${interpolate(progress, [0, 0.2], [0.8, 1], {extrapolateRight: 'clamp'})})`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.5)`
            }}>
              <div style={{ 
                fontSize: '96px', 
                fontWeight: '900', 
                color: theme.primaryColor,
                marginBottom: '20px',
                textShadow: `0 0 30px ${theme.primaryColor}80`
              }}>
                {stat.prefix}{currentValue}{stat.suffix}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '500', opacity: 0.9 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
