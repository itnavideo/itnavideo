import React from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type MockupFrameType = 'browser' | 'mobile' | 'perspective-3d' | 'card-clean';

export interface PremiumAssetShowcaseProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  mockupType?: MockupFrameType;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  headline?: string;
  subheadline?: string;
  annotationText?: string;
  browserUrl?: string;
  badgeText?: string;
  badgeColor?: string;
}

/**
 * PremiumAssetShowcase
 * High-Perception Asset Presentation Container for User Uploads (Images, Videos, Screen Recordings)
 * Features: macOS Browser Frame, Mobile Phone Frame, 3D Perspective Tilt, and Minimalist Editorial Card.
 * Learned from "The Psychology of Premium Ecommerce Brands" (Learn With Shopify - YouTube: kcQFBNc7JJw).
 */
export const PremiumAssetShowcase: React.FC<PremiumAssetShowcaseProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  mockupType = 'browser',
  mediaUrl,
  headline = 'High-Converting Digital Experience',
  subheadline = 'Engineered for perceived value, trust, and premium brand perception',
  annotationText = 'Presentation drives 80% of perceived value!',
  browserUrl = 'https://itnavideo.com/studio/preview',
  badgeText = 'PREMIUM SHOWCASE',
  badgeColor = '#059669',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  // Entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Subtle continuous Ken Burns drift
  const kenBurnsScale = interpolate(
    frame,
    [0, Math.max(durationInFrames, 90)],
    [1.0, 1.04],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 880,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header & Annotation Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          opacity: enterSpring,
          transform: `translateY(${interpolate(enterSpring, [0, 1], [14, 0])}px)`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                fontFamily: 'Inter, monospace',
                color: badgeColor,
                backgroundColor: isDark ? `${badgeColor}22` : `${badgeColor}15`,
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: '0.04em',
              }}
            >
              {badgeText}
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            {headline}
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            {subheadline}
          </span>
        </div>

        {annotationText && (
          <div
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 19,
              fontWeight: 700,
              color: '#EA580C',
              transform: 'rotate(-3deg)',
              backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
              padding: '4px 12px',
              borderRadius: 8,
              border: '1px dashed #EA580C',
            }}
          >
            {annotationText}
          </div>
        )}
      </div>

      {/* Main Container by Mockup Type */}
      <div
        style={{
          opacity: enterSpring,
          transform: `translateY(${interpolate(enterSpring, [0, 1], [22, 0])}px)`,
        }}
      >
        {/* Frame Type 1: macOS Desktop Browser Window */}
        {mockupType === 'browser' && (
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: isDark ? '#18181B' : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
              boxShadow: isDark
                ? '0 25px 60px -15px rgba(0, 0, 0, 0.6)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* macOS Chrome / Window Title Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                backgroundColor: isDark ? '#1F1F23' : '#F8FAFC',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              }}
            >
              {/* Traffic Lights */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>

              {/* URL Address Pill */}
              <div
                style={{
                  flex: 1,
                  maxWidth: 420,
                  margin: '0 auto',
                  padding: '4px 12px',
                  borderRadius: 6,
                  backgroundColor: isDark ? '#141416' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: isDark ? '#A1A1AA' : '#64748B',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 10, color: '#10B981' }}>🔒</span>
                <span>{browserUrl}</span>
              </div>
            </div>

            {/* Media Content Stage with Ken Burns */}
            <div
              style={{
                height: 380,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: isDark ? '#09090B' : '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `scale(${kenBurnsScale})`,
                  transformOrigin: 'center center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {mediaUrl ? (
                  <Img
                    src={mediaUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      color: '#94A3B8',
                    }}
                  >
                    <span style={{ fontSize: 40 }}>🖥️</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC' }}>
                      Screen Recording &amp; Web Mockup Viewport
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>
                      High-fidelity resolution with soft ambient drop-shadow
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Frame Type 2: Sleek Mobile Phone Frame */}
        {mockupType === 'mobile' && (
          <div
            style={{
              width: 320,
              margin: '0 auto',
              borderRadius: 40,
              padding: 10,
              backgroundColor: isDark ? '#1C1917' : '#27272A',
              boxShadow: isDark
                ? '0 30px 70px -15px rgba(0, 0, 0, 0.7)'
                : '0 30px 60px -15px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
          >
            {/* Dynamic Island Pill */}
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 90,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#000000',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 8,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0A2540' }} />
            </div>

            {/* Screen Viewport */}
            <div
              style={{
                borderRadius: 32,
                height: 440,
                overflow: 'hidden',
                backgroundColor: isDark ? '#09090B' : '#0F172A',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `scale(${kenBurnsScale})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {mediaUrl ? (
                  <Img src={mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Mobile App Viewport</div>
                    <div style={{ fontSize: 10, color: '#71717A' }}>9:16 In-App Flow &amp; Paywall</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Frame Type 3: 3D Perspective Floating Card */}
        {(mockupType === 'perspective-3d' || mockupType === 'card-clean') && (
          <div
            style={{
              perspective: 1200,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 760,
                borderRadius: 18,
                overflow: 'hidden',
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
                boxShadow: isDark
                  ? '0 30px 60px -15px rgba(0, 0, 0, 0.5)'
                  : '0 30px 60px -15px rgba(0, 0, 0, 0.12)',
                transform:
                  mockupType === 'perspective-3d'
                    ? 'rotateX(6deg) rotateY(-8deg) scale(0.96)'
                    : 'none',
                transition: 'transform 0.4s ease',
              }}
            >
              <div
                style={{
                  height: 360,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: isDark ? '#09090B' : '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `scale(${kenBurnsScale})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {mediaUrl ? (
                    <Img src={mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                      <div style={{ fontSize: 38, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>
                        3D Floating Asset Viewport
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        Isometric Depth Angle with Ambient Multi-Layer Shadow
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
