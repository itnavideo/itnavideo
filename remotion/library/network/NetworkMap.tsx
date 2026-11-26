import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ServerRegionPin {
  id: string;
  name: string;
  latencyText: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  status?: 'active' | 'synced' | 'standby';
  color?: string;
}

export interface NetworkMapProps {
  title?: string;
  subtitle?: string;
  regions?: ServerRegionPin[];
  width?: number | string;
  height?: number;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_REGIONS: ServerRegionPin[] = [
  { id: 'us-east', name: 'AWS Lambda (us-east-1)', latencyText: '12ms', x: 26, y: 38, status: 'active', color: '#0066FF' },
  { id: 'us-central', name: 'Cloud Run (us-central1)', latencyText: '18ms', x: 20, y: 44, status: 'active', color: '#10B981' },
  { id: 'eu-west', name: 'Frankfurt Edge CDN', latencyText: '34ms', x: 52, y: 32, status: 'synced', color: '#F59E0B' },
  { id: 'ap-south', name: 'Mumbai Groq Whisper', latencyText: '22ms', x: 72, y: 52, status: 'active', color: '#8B5CF6' },
  { id: 'ap-east', name: 'Tokyo Media Mirror', latencyText: '48ms', x: 86, y: 42, status: 'standby', color: '#06B6D4' },
];

export const NetworkMap: React.FC<NetworkMapProps> = ({
  title = 'Global Distributed Server Mesh Map',
  subtitle = 'Edge rendering nodes & low-latency cross-region replication',
  regions = DEFAULT_REGIONS,
  width = '100%',
  height = 360,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const gridDotColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const items = regions && regions.length > 0 ? regions : DEFAULT_REGIONS;

  return (
    <div
      style={{
        width,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '20px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Cyber World Grid Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `${height - 90}px`,
          backgroundColor: isDark ? '#090D16' : '#F1F5F9',
          borderRadius: '16px',
          border: 'none',
          backgroundImage: `radial-gradient(circle, ${gridDotColor} 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          overflow: 'hidden',
        }}
      >
        {/* Inter-region communication arcs */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {items.map((r, i) => {
            if (i === items.length - 1) return null;
            const next = items[i + 1];

            const arcSpring = spring({
              frame: Math.max(0, frame - delayFrames - i * 4),
              fps,
              config: { damping: 15, stiffness: 80 },
            });

            return (
              <line
                key={i}
                x1={`${r.x}%`}
                y1={`${r.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="#0066FF"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                opacity={arcSpring * 0.4}
              />
            );
          })}
        </svg>

        {/* Region Server Pins */}
        {items.map((region, idx) => {
          const pinSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 4),
            fps,
            config: { damping: 13, stiffness: 95 },
          });

          const pinColor = region.color || '#0066FF';

          return (
            <div
              key={region.id}
              style={{
                position: 'absolute',
                left: `${region.x}%`,
                top: `${region.y}%`,
                transform: `translate(-50%, -50%) scale(${pinSpring})`,
                opacity: pinSpring,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                zIndex: 10,
              }}
            >
              {/* Outer Ping Ripple */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: `${pinColor}22`,
                  border: `2px solid ${pinColor}`,
                  boxShadow: `0 0 16px ${pinColor}88`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pinColor }} />
              </div>

              {/* Pin Callout Badge */}
              <div
                style={{
                  backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '3px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: textColor }}>{region.name}</span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: pinColor }}>{region.latencyText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
