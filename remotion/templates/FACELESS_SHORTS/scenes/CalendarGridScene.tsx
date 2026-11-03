import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface CalendarGridSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

interface CalendarBlock {
  day: string;
  title: string;
  category: string;
  color: string;
  textColor: string;
  time: string;
}

/* ───────────────────────── SVG Icon ───────────────────────── */

function CalendarSvg({ size = 18, color = '#EA580C' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

const DEFAULT_SCHEDULE: CalendarBlock[] = [
  { day: '08:00 AM', title: 'Deep Work: Core Focus', category: 'FOCUS', color: '#BAE6FD', textColor: '#0369A1', time: '90 Mins' },
  { day: '10:30 AM', title: 'Active Recall & Synthesis', category: 'LEARNING', color: '#FEF08A', textColor: '#854D0E', time: '60 Mins' },
  { day: '02:00 PM', title: 'Leverage & Execution', category: 'BUILD', color: '#FFEDD5', textColor: '#9A3412', time: '120 Mins' },
  { day: '05:30 PM', title: 'Health & Reset Protocol', category: 'ENERGY', color: '#D1FAE5', textColor: '#065F46', time: '45 Mins' },
];

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function CalendarGridScene({
  scene,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: CalendarGridSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? false;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  // Entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const sceneTitle = scene.heading || 'TIME-BLOCK ARCHITECTURE';
  const supporting = scene.supportingText || 'Daily High-Leverage Schedule Structure';

  // Extract items from scene.listItems if present
  const scheduleItems: CalendarBlock[] =
    scene.listItems && scene.listItems.length >= 3
      ? scene.listItems.slice(0, 4).map((item, idx) => {
          const parts = item.split(/[:•-]/);
          const colors = [
            { bg: '#BAE6FD', text: '#0369A1' },
            { bg: '#FEF08A', text: '#854D0E' },
            { bg: '#FFEDD5', text: '#9A3412' },
            { bg: '#D1FAE5', text: '#065F46' },
          ][idx % 4];
          return {
            day: parts[0]?.trim() || `0${idx + 1}:00`,
            title: parts[1]?.trim() || parts[0]?.trim() || 'Scheduled Block',
            category: `BLOCK 0${idx + 1}`,
            color: colors.bg,
            textColor: colors.text,
            time: 'Focused',
          };
        })
      : DEFAULT_SCHEDULE;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        padding: isPortrait ? `${160 * s}px ${45 * s}px ${180 * s}px` : `${50 * s}px ${80 * s}px`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: bodyFont,
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.95, 1.0])})`,
      }}
    >
      {/* ── Title Eyebrow Pill ── */}
      <div
        style={{
          marginBottom: isPortrait ? `${20 * s}px` : `${28 * s}px`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${8 * s}px`,
          borderRadius: `${999 * s}px`,
          border: '1.5px solid rgba(234, 88, 12, 0.3)',
          backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.12)',
          padding: `${6 * s}px ${18 * s}px`,
          fontSize: `${13 * s}px`,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#EA580C',
        }}
      >
        <CalendarSvg size={16 * s} color="#EA580C" />
        <span>TIME BLOCKING ARCHITECTURE</span>
      </div>

      <h1
        style={{
          fontFamily: headingFont,
          fontSize: isPortrait ? `${36 * s}px` : `${44 * s}px`,
          fontWeight: 900,
          color: textPrimary,
          margin: `0 0 ${8 * s}px 0`,
          letterSpacing: '-0.025em',
          textAlign: 'center',
        }}
      >
        {sceneTitle}
      </h1>

      <p
        style={{
          fontSize: `${18 * s}px`,
          color: textSecondary,
          margin: `0 0 ${isPortrait ? 24 * s : 32 * s}px 0`,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {supporting}
      </p>

      {/* ── Adaptive Layout: Vertical Block Stack in 9:16 Portrait, 7-Col in 16:9 Landscape ── */}
      {isPortrait ? (
        <div
          style={{
            width: '100%',
            maxWidth: '520px',
            display: 'flex',
            flexDirection: 'column',
            gap: `${14 * s}px`,
          }}
        >
          {scheduleItems.map((item, i) => {
            const blockSpring = spring({
              frame: Math.max(0, currentFrame - 6 - i * 5),
              fps,
              config: { damping: 14, stiffness: 110 },
            });

            return (
              <div
                key={i}
                style={{
                  borderRadius: `${20 * s}px`,
                  backgroundColor: cardBg,
                  border: `2px solid ${cardBorder}`,
                  padding: `${18 * s}px ${22 * s}px`,
                  boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,${isDark ? '0.3' : '0.06'})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: blockSpring,
                  transform: `translateY(${interpolate(blockSpring, [0, 1], [25 * s, 0])}px)`,
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: `${16 * s}px` }}>
                  <div
                    style={{
                      width: `${60 * s}px`,
                      height: `${60 * s}px`,
                      borderRadius: `${16 * s}px`,
                      backgroundColor: item.color,
                      color: item.textColor,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: `${13 * s}px`,
                      flexShrink: 0,
                    }}
                  >
                    <span>{item.category}</span>
                  </div>

                  <div>
                    <div style={{ fontFamily: headingFont, fontSize: `${20 * s}px`, fontWeight: 800, color: textPrimary, marginBottom: `${2 * s}px` }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: `${13 * s}px`, color: textSecondary, fontWeight: 600 }}>
                      {item.day}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    padding: `${4 * s}px ${12 * s}px`,
                    borderRadius: `${8 * s}px`,
                    fontSize: `${12 * s}px`,
                    fontWeight: 800,
                    color: textSecondary,
                  }}
                >
                  {item.time}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 16:9 Landscape 7-Column Grid */
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            backgroundColor: cardBg,
            borderRadius: `${24 * s}px`,
            border: `2px solid ${cardBorder}`,
            padding: `${28 * s}px`,
            boxShadow: `0 ${20 * s}px ${50 * s}px rgba(0,0,0,${isDark ? '0.4' : '0.08'})`,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: `${14 * s}px`,
            boxSizing: 'border-box',
          }}
        >
          {DAYS.map((day, i) => (
            <div key={day} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: `${14 * s}px`, fontWeight: 900, color: textSecondary, marginBottom: `${12 * s}px` }}>
                {day}
              </div>
              <div
                style={{
                  height: `${180 * s}px`,
                  borderRadius: `${14 * s}px`,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${cardBorder}`,
                  padding: `${10 * s}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: DEFAULT_SCHEDULE[i % DEFAULT_SCHEDULE.length].color,
                    color: DEFAULT_SCHEDULE[i % DEFAULT_SCHEDULE.length].textColor,
                    padding: `${6 * s}px ${8 * s}px`,
                    borderRadius: `${8 * s}px`,
                    fontSize: `${11 * s}px`,
                    fontWeight: 800,
                    textAlign: 'center',
                  }}
                >
                  {DEFAULT_SCHEDULE[i % DEFAULT_SCHEDULE.length].title}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarGridScene;
