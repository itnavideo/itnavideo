import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SideDockedPresenterLayoutProps {
  sceneFrame?: number;
  presenterVideoSrc?: string; // Video URL or custom placeholder
  presenterName?: string;
  presenterTitle?: string;
  presenterSide?: 'left' | 'right';
  explanationContent: React.ReactNode;
  doodleCalloutText?: string;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * SideDockedPresenterLayout
 * Ali Abdaal Signature Dynamic Screen Partitioning:
 * Solves the problem where a center-stage creator blocks or clashes with infographics.
 * Smoothly docks the presenter into a polished, bordered side-card (35% width) while
 * allocating 65% width to the dedicated warm-paper Explanation Canvas with doodle arrows.
 */
export const SideDockedPresenterLayout: React.FC<SideDockedPresenterLayoutProps> = ({
  sceneFrame,
  presenterVideoSrc,
  presenterName = 'Ali Abdaal',
  presenterTitle = 'Creator & Educator',
  presenterSide = 'left',
  explanationContent,
  doodleCalloutText,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  // Smooth entrance transition for presenter dock
  const dockSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  // Explanation content entrance
  const contentSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Arrow doodle draw
  const arrowSpring = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const isLeft = presenterSide === 'left';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: isLeft ? 'row' : 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '36px 48px',
        boxSizing: 'border-box',
        backgroundColor: isDark ? '#09090B' : '#FAF6F2',
        position: 'relative',
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* 1. Presenter Docked Card (35% width) */}
      <div
        style={{
          width: '35%',
          height: '100%',
          maxHeight: 780,
          opacity: dockSpring,
          transform: `translateX(${interpolate(dockSpring, [0, 1], [isLeft ? -40 : 40, 0])}px)`,
          borderRadius: 22,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: isDark ? '#18181B' : '#FFFFFF',
          border: isDark ? '2px solid rgba(255, 255, 255, 0.12)' : '2px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isDark
            ? '0 20px 50px -12px rgba(0, 0, 0, 0.7)'
            : '0 20px 50px -12px rgba(0, 0, 0, 0.10)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Presenter Camera Frame / Video */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#000000', overflow: 'hidden' }}>
          {presenterVideoSrc ? (
            <video
              src={presenterVideoSrc}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              muted
              autoPlay
              loop
            />
          ) : (
            /* Elegant Placeholder when no raw video src */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                color: '#FFFFFF',
                padding: 20,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                👤
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Lora, serif' }}>
                {presenterName}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{presenterTitle}</div>
            </div>
          )}

          {/* Live Indicator Pill */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              fontSize: 11,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
            PRESENTER
          </div>
        </div>

        {/* Lower Third Tag inside card */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.95)' : '#FFFFFF',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'Lora, Georgia, serif',
                color: isDark ? '#FFFFFF' : '#141414',
              }}
            >
              {presenterName}
            </div>
            <div style={{ fontSize: 11, color: isDark ? '#A1A1AA' : '#71717A' }}>
              {presenterTitle}
            </div>
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              backgroundColor: isDark ? 'rgba(234, 88, 12, 0.2)' : '#FFF7ED',
              color: '#EA580C',
              textTransform: 'uppercase',
            }}
          >
            Explaining
          </div>
        </div>
      </div>

      {/* 2. Cross-Zone Animated Doodle Arrow (Connecting Presenter to Content) */}
      {doodleCalloutText && (
        <div
          style={{
            position: 'absolute',
            top: '24%',
            left: isLeft ? '34%' : 'auto',
            right: !isLeft ? '34%' : 'auto',
            zIndex: 10,
            opacity: arrowSpring,
            transform: `scale(${arrowSpring})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 22,
              fontWeight: 700,
              color: '#EA580C',
              transform: 'rotate(-6deg)',
              backgroundColor: isDark ? 'rgba(9, 9, 11, 0.85)' : '#FFFFFF',
              padding: '2px 10px',
              borderRadius: 8,
              border: '1px dashed #EA580C',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              whiteSpace: 'nowrap',
            }}
          >
            {doodleCalloutText}
          </div>
          <svg width="48" height="40" viewBox="0 0 48 40" fill="none" style={{ marginTop: 2 }}>
            <path
              d={isLeft ? "M 10 5 C 20 20, 30 25, 42 32" : "M 38 5 C 28 20, 18 25, 6 32"}
              stroke="#EA580C"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
            <polygon
              points={isLeft ? "42,32 34,28 38,36" : "6,32 14,28 10,36"}
              fill="#EA580C"
            />
          </svg>
        </div>
      )}

      {/* 3. Dedicated Explanation Canvas (62% width) */}
      <div
        style={{
          width: '62%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: contentSpring,
          transform: `translateX(${interpolate(contentSpring, [0, 1], [isLeft ? 40 : -40, 0])}px)`,
        }}
      >
        {explanationContent}
      </div>
    </div>
  );
};

