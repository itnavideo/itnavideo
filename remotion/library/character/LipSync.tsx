import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LipSyncProps {
  title?: string;
  activePhoneme?: 'A' | 'E' | 'O' | 'U' | 'MBP' | 'FV' | 'L' | 'Rest';
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const LipSync: React.FC<LipSyncProps> = ({
  title = 'Phoneme Viseme Lip-Sync Morpher',
  activePhoneme,
  primaryColor = '#F43F5E',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Cycle through phonemes automatically if not specified
  const phonemes: ('A' | 'E' | 'O' | 'U' | 'MBP' | 'FV' | 'L' | 'Rest')[] = [
    'Rest', 'A', 'E', 'O', 'U', 'MBP', 'FV', 'L'
  ];
  const phonemeIndex = Math.floor((frame / 15) % phonemes.length);
  const currentPhoneme = activePhoneme ?? phonemes[phonemeIndex];

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
            background: 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#fb7185',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>👄 PHONEME MORPHING</span>
          <span>•</span>
          <span>VISEME SHAPE: [{currentPhoneme}]</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Viseme Mouth Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#120a10',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Mouth Shape Representation */}
        <div
          style={{
            width: currentPhoneme === 'O' || currentPhoneme === 'U' ? 60 : currentPhoneme === 'E' || currentPhoneme === 'A' ? 140 : 100,
            height: currentPhoneme === 'A' ? 70 : currentPhoneme === 'O' ? 65 : currentPhoneme === 'MBP' ? 6 : 35,
            borderRadius: currentPhoneme === 'O' ? '50%' : currentPhoneme === 'MBP' ? '3px' : '40% 40% 50% 50%',
            background: currentPhoneme === 'MBP' ? '#e11d48' : '#881337',
            border: '4px solid #f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(244, 63, 94, 0.5)',
            transition: 'all 0.1s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Teeth & Tongue visualization for open vowels */}
          {(currentPhoneme === 'A' || currentPhoneme === 'E' || currentPhoneme === 'L') && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                width: '70%',
                height: 12,
                background: '#ffffff',
                borderRadius: '0 0 6px 6px',
              }}
            />
          )}
        </div>

        {/* Viseme Grid Buttons */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            display: 'flex',
            gap: 8,
          }}
        >
          {phonemes.map((p, idx) => (
            <div
              key={idx}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                background: p === currentPhoneme ? '#f43f5e' : 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: p === currentPhoneme ? 800 : 500,
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
