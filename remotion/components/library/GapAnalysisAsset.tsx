import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface GapAnalysisAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  pointA_Title?: string;
  pointA_Desc?: string;
  pointB_Title?: string;
  pointB_Desc?: string;
  bridgeTitle?: string;
  bridgeFee?: string;
}

/**
 * GapAnalysisAsset
 * The Current State (Point A) -> The Gap -> Desired State (Point B) Sales Framework.
 * Learned from Ali Abdaal & Daniel Priestley's "The Most Valuable Sales Training You'll Ever Watch" (YouTube: DDB7E6aUJa8).
 */
export const GapAnalysisAsset: React.FC<GapAnalysisAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 6,
  pointA_Title = 'Point A: Current State',
  pointA_Desc = 'Stuck trading time for money • $100k salary ceiling • High burnout',
  pointB_Title = 'Point B: Desired State',
  pointB_Desc = '$250k+ revenue • 100% retained equity • Autonomous schedule',
  bridgeTitle = 'Your High-ROI Solution (The Bridge)',
  bridgeFee = 'Cost of Inaction: -$50k/yr',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const bridgeSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 780,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          opacity: cardSpring,
          transform: `translateY(${interpolate(cardSpring, [0, 1], [14, 0])}px)`,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The Gap Analysis Framework
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Diagnosis Before Prescription • Point A to Point B
          </span>
        </div>

        <div
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.10)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            fontSize: 11,
            fontWeight: 700,
            color: '#EA580C',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Daniel Priestley Model
        </div>
      </div>

      {/* Point A & Point B Dual Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 14,
        }}
      >
        {/* Point A: Current State */}
        <div
          style={{
            opacity: cardSpring,
            transform: `translateX(${interpolate(cardSpring, [0, 1], [-20, 0])}px)`,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.88)' : '#FFFFFF',
            borderRadius: 16,
            border: isDark ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(239, 68, 68, 0.20)',
            boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.05)',
            padding: '18px 20px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2',
              color: '#EF4444',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            <span>🚩</span> Current Bottleneck
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: isDark ? '#FFFFFF' : '#18181B',
              marginBottom: 4,
            }}
          >
            {pointA_Title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: isDark ? '#A1A1AA' : '#64748B',
              lineHeight: 1.45,
            }}
          >
            {pointA_Desc}
          </div>
        </div>

        {/* Point B: Desired State */}
        <div
          style={{
            opacity: cardSpring,
            transform: `translateX(${interpolate(cardSpring, [0, 1], [20, 0])}px)`,
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.88)' : '#FFFFFF',
            borderRadius: 16,
            border: isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(16, 185, 129, 0.20)',
            boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.05)',
            padding: '18px 20px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#F0FDF4',
              color: '#059669',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            <span>🎯</span> Desired Outcome
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: isDark ? '#FFFFFF' : '#18181B',
              marginBottom: 4,
            }}
          >
            {pointB_Title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: isDark ? '#A1A1AA' : '#64748B',
              lineHeight: 1.45,
            }}
          >
            {pointB_Desc}
          </div>
        </div>
      </div>

      {/* The Connecting Solution Bridge */}
      <div
        style={{
          opacity: bridgeSpring,
          transform: `translateY(${interpolate(bridgeSpring, [0, 1], [16, 0])}px)`,
          backgroundColor: isDark ? 'rgba(234, 88, 12, 0.12)' : '#FFF7ED',
          border: '1.5px dashed rgba(234, 88, 12, 0.4)',
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            🌉
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: isDark ? '#FAFAFA' : '#18181B',
              }}
            >
              {bridgeTitle}
            </div>
            <div style={{ fontSize: 12, color: '#EA580C', fontWeight: 600 }}>
              The safe, proven vehicle bridging Point A to Point B
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            fontSize: 12,
            fontWeight: 700,
            color: '#EA580C',
            whiteSpace: 'nowrap',
          }}
        >
          {bridgeFee}
        </div>
      </div>
    </div>
  );
};

