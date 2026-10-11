import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { CAPTION_PRESET_CONFIGS } from '../captions/registry/captionPresets';

export const ContactSheetGrid: React.FC = () => {
  const presetKeys = Object.keys(CAPTION_PRESET_CONFIGS);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#070B14',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, color: '#FF6D00' }}>
          ITNAVIDEO AUTO CAPTION PRESETS CONTACT SHEET
        </h1>
        <p style={{ fontSize: 18, color: '#94A3B8', margin: '4px 0 0 0' }}>
          37 Registered 9:16 Preset Stills (Frame 45 @ 1080x1920)
        </p>
      </div>

      {/* Grid Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 12,
          flex: 1,
          alignContent: 'start',
        }}
      >
        {presetKeys.map((id) => {
          const config = CAPTION_PRESET_CONFIGS[id];
          const imgSrc = staticFile(`caption-tests/png/${id}.png`);

          return (
            <div
              key={id}
              style={{
                backgroundColor: '#0E1526',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Thumbnail Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '9 / 16',
                  backgroundColor: '#000000',
                }}
              >
                <Img
                  src={imgSrc}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Label Badge */}
              <div
                style={{
                  padding: '6px 8px',
                  backgroundColor: '#0B1120',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#FFD700',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {id}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: '#94A3B8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {config.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
