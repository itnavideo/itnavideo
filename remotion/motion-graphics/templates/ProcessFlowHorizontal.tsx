import React from 'react';
import { ProcessFlowSchema } from '../schemas';
import { AnimatedLine, AnimatedText } from '../primitives';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const ProcessFlowHorizontal: React.FC<ProcessFlowSchema> = ({
  title,
  subtitle,
  steps,
  theme = { primaryColor: '#4d94ff', secondaryColor: '#1a1a2e', accentColor: '#ff4d4d', backgroundColor: '#0f0f13', textColor: '#ffffff' }
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  
  const stepDelay = 30; // Frames between each step appearing

  return (
    <div style={{ flex: 1, backgroundColor: theme.backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: theme.textColor, width: '100%', height: '100%' }}>
      <AnimatedText text={title} style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '20px' }} delay={10} />
      {subtitle && <AnimatedText text={subtitle} style={{ fontSize: '32px', opacity: 0.7, marginBottom: '100px' }} delay={20} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90%', gap: '20px' }}>
        {steps.map((step, index) => {
          const delay = 40 + index * stepDelay;
          const scale = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          return (
            <React.Fragment key={step.id}>
              {/* Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: theme.secondaryColor,
                    border: `4px solid ${theme.primaryColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    transform: `scale(${scale})`,
                    boxShadow: `0 0 40px ${theme.primaryColor}80`
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ marginTop: '30px', textAlign: 'center', opacity: scale, transform: `translateY(${interpolate(scale, [0, 1], [20, 0])}px)` }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{step.title}</div>
                  {step.description && <div style={{ fontSize: '20px', opacity: 0.7, marginTop: '10px' }}>{step.description}</div>}
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div style={{ flex: 1, padding: '0 20px', transform: 'translateY(-60px)' }}>
                  <AnimatedLine width={100} height={4} color={theme.primaryColor} delay={delay + 10} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
