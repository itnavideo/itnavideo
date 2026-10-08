import React from 'react';

export interface BrandWatermarkProps {
  watermark?: boolean;
  isLandscape?: boolean;
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right';
  showCenterStamp?: boolean;
}

/**
 * Universal BrandWatermark for Itnavideo Free Renders.
 * 
 * Placed in the top-right / top-safe zone with an anti-crop center security stamp.
 * Cannot be cropped by phone crop tools without destroying the video.
 * Drives free users to upgrade to Pro for 100% clean, watermark-free exports.
 */
export const BrandWatermark: React.FC<BrandWatermarkProps> = ({
  watermark = false,
  isLandscape = false,
  position = 'top-right',
  showCenterStamp = true,
}) => {
  if (!watermark) return null;

  const topOffset = isLandscape ? 28 : 52;
  const sideOffset = isLandscape ? 32 : 44;

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top-left':
        return { top: topOffset, left: sideOffset };
      case 'top-center':
        return { top: topOffset, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { bottom: topOffset, right: sideOffset };
      case 'top-right':
      default:
        return { top: topOffset, right: sideOffset };
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* ── ANTI-CROP SUBTLE CENTER STAMP ── */}
      {showCenterStamp && (
        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-24deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.11,
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: isLandscape ? 54 : 64,
              fontWeight: 900,
              letterSpacing: '0.22em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textShadow: '0 2px 16px rgba(0,0,0,0.8)',
            }}
          >
            ITNAVIDEO
          </span>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: isLandscape ? 16 : 20,
              fontWeight: 700,
              letterSpacing: '0.35em',
              color: '#FACC15',
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            FREE PREVIEW · UPGRADE TO REMOVE
          </span>
        </div>
      )}

      {/* ── PROMINENT TOP-RIGHT BRAND BADGE ── */}
      <div
        style={{
          position: 'absolute',
          ...getPositionStyles(),
          display: 'flex',
          alignItems: 'center',
          gap: isLandscape ? 8 : 10,
          padding: isLandscape ? '7px 14px' : '9px 18px',
          backgroundColor: 'rgba(9, 9, 11, 0.78)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 9999,
          border: '1.5px solid rgba(250, 204, 21, 0.45)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(250, 204, 21, 0.25)',
        }}
      >
        {/* Glowing Brand Icon Dot */}
        <div
          style={{
            width: isLandscape ? 10 : 12,
            height: isLandscape ? 10 : 12,
            borderRadius: '50%',
            backgroundColor: '#FACC15',
            boxShadow: '0 0 10px #FACC15, 0 0 20px #EAB308',
            flexShrink: 0,
          }}
        />

        {/* Text Container */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: isLandscape ? 13 : 15,
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              ITNAVIDEO<span style={{ color: '#FACC15' }}>.COM</span>
            </span>
          </div>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: isLandscape ? 9 : 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            Free Plan · Upgrade to Remove
          </span>
        </div>
      </div>
    </div>
  );
};
