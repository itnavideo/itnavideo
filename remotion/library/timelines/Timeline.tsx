import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TimelineEvent {
  timeOrDate: string;
  title: string;
  description?: string;
  color?: string;
  badge?: string;
}

export interface TimelineProps {
  title?: string;
  subtitle?: string;
  events?: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
  width?: number | string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_TIMELINE_EVENTS: TimelineEvent[] = [
  { timeOrDate: '00:00 - 00:03', title: 'Viral Pattern Interrupt', description: 'Immediate bold hook statement & sound effect', color: '#0066FF', badge: 'Hook' },
  { timeOrDate: '00:03 - 00:15', title: 'Core Problem Agitation', description: 'Highlight the struggle and cost of inaction', color: '#2563EB', badge: 'Problem' },
  { timeOrDate: '00:15 - 00:45', title: 'The Breakthrough Secret', description: 'Step-by-step tactical solution walkthrough', color: '#10B981', badge: 'Value' },
  { timeOrDate: '00:45 - 00:60', title: 'Irresistible CTA & Loop', description: 'Direct viewer to follow or check bio link', color: '#F59E0B', badge: 'Call To Action' },
];

export const Timeline: React.FC<TimelineProps> = ({
  title = 'Video Narrative Retention Timeline',
  subtitle = 'Pacing schedule & viewer psychological stages',
  events = DEFAULT_TIMELINE_EVENTS,
  orientation = 'vertical',
  width = '100%',
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const items = events && events.length > 0 ? events : DEFAULT_TIMELINE_EVENTS;

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.45)' : '0 8px 30px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '24px' }}>
          {title && <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: textColor }}>{title}</h3>}
          {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 500, color: textMuted }}>{subtitle}</p>}
        </div>
      )}

      {/* Timeline List */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Continuous Vertical Spine Line */}
        <div
          style={{
            position: 'absolute',
            left: '19px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        />

        {items.map((event, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 5),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const nodeColor = event.color || '#0066FF';

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                transform: `translateX(${(1 - itemSpring) * -20}px)`,
                opacity: itemSpring,
                position: 'relative',
              }}
            >
              {/* Glowing Timeline Marker */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: cardBg,
                  border: `3px solid ${nodeColor}`,
                  boxShadow: `0 0 16px ${nodeColor}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 900,
                  color: nodeColor,
                  flexShrink: 0,
                  zIndex: 2,
                }}
              >
                0{idx + 1}
              </div>

              {/* Event Content Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: nodeColor }}>
                    {event.timeOrDate}
                  </span>
                  {event.badge && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: `${nodeColor}22`,
                        color: nodeColor,
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      {event.badge}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '15px', fontWeight: 800, color: textColor }}>
                  {event.title}
                </div>
                {event.description && (
                  <div style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '4px', lineHeight: 1.4 }}>
                    {event.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
