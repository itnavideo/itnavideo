import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FacialExpressionProps {
  title?: string;
  expression?: 'joy' | 'surprise' | 'neutral' | 'focused' | 'skeptical';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const FacialExpression: React.FC<FacialExpressionProps> = ({
  title = 'Facial Expression & Emotion Engine',
  expression = 'joy',
  primaryColor = '#F59E0B',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  const isJoy = expression === 'joy';
  const isSurprise = expression === 'surprise';
  const isSkeptical = expression === 'skeptical';

  const browLeftY = isSurprise ? -8 : isSkeptical ? -6 : 0;
  const browRightY = isSurprise ? -8 : isSkeptical ? 4 : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 20 : 28,
          opacity: anim,
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>😊 MICRO-EXPRESSION</span>
          <span>•</span>
          <span>EMOTION: {expression.toUpperCase()}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Face Canvas Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0e0f14',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Stylized Face Head Form */}
        <div
          style={{
            width: 170,
            height: 200,
            borderRadius: '50% 50% 45% 45%',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          }}
        >
          {/* Eyebrows */}
          <div style={{ display: 'flex', gap: 40, position: 'absolute', top: 55 }}>
            <div style={{ width: 28, height: 4, background: '#f59e0b', borderRadius: 2, transform: `translateY(${browLeftY}px)` }} />
            <div style={{ width: 28, height: 4, background: '#f59e0b', borderRadius: 2, transform: `translateY(${browRightY}px)` }} />
          </div>

          {/* Eyes */}
          <div style={{ display: 'flex', gap: 45, position: 'absolute', top: 75 }}>
            <div style={{ width: 18, height: isSurprise ? 22 : 18, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#09090b' }} />
            </div>
            <div style={{ width: 18, height: isSurprise ? 22 : 18, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#09090b' }} />
            </div>
          </div>

          {/* Mouth */}
          <div
            style={{
              position: 'absolute',
              bottom: 45,
              width: isJoy ? 55 : isSurprise ? 24 : 35,
              height: isJoy ? 26 : isSurprise ? 30 : 6,
              borderRadius: isJoy ? '0 0 30px 30px' : isSurprise ? '50%' : '3px',
              background: '#f43f5e',
              border: '2px solid #ffffff',
            }}
          />
        </div>

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#fde68a',
          }}
        >
          FACS AU: {isJoy ? 'AU6 + AU12 (Duchenne)' : 'AU1 + AU2 (Brow Raiser)'}
        </div>
      </div>
    </div>
  );
};
