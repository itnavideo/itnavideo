import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { FACELESS_DESIGN_TOKENS } from '../facelessTokens';

export interface CalendarGridSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
}

interface CalendarBlock {
  dayIndex: number; // 0 (Mon) to 6 (Sun)
  title: string;
  category: 'deep_work' | 'health' | 'learning' | 'personal';
  color: string;
  textColor: string;
  startHour: string;
}

const DEFAULT_BLOCKS: CalendarBlock[] = [
  { dayIndex: 0, title: 'Deep Work: Project', category: 'deep_work', color: '#BAE6FD', textColor: '#0369A1', startHour: '08:00 AM' },
  { dayIndex: 1, title: 'Active AI Recall', category: 'learning', color: '#FEF08A', textColor: '#854D0E', startHour: '09:30 AM' },
  { dayIndex: 2, title: 'Writing / Synthesis', category: 'deep_work', color: '#BAE6FD', textColor: '#0369A1', startHour: '08:00 AM' },
  { dayIndex: 3, title: 'Zone 2 Cardio / Gym', category: 'health', color: '#D1FAE5', textColor: '#065F46', startHour: '05:00 PM' },
  { dayIndex: 4, title: 'Weekly Review Block', category: 'personal', color: '#E9D5FF', textColor: '#6B21A8', startHour: '03:00 PM' },
  { dayIndex: 5, title: 'Creative Sandbox', category: 'learning', color: '#FFEDD5', textColor: '#9A3412', startHour: '10:00 AM' },
  { dayIndex: 6, title: 'Reset & Plan Ahead', category: 'personal', color: '#E9D5FF', textColor: '#6B21A8', startHour: '06:00 PM' },
];

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function CalendarGridScene({
  scene,
  headingFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  bodyFont = FACELESS_DESIGN_TOKENS.typography.interfaceSans,
  sceneFrame,
}: CalendarGridSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  // Grid Entrance
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: FACELESS_DESIGN_TOKENS.motion.springConfig,
  });

  const scale = interpolate(entrance, [0, 1], [0.95, 1.0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const sceneTitle = scene.heading || 'The 7-Day Time-Block Architecture';

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
        backgroundColor: FACELESS_DESIGN_TOKENS.colors.canvasWhite,
        padding: '60px 100px',
      }}
    >
      {/* Title Eyebrow Pill */}
      <div
        style={{
          marginBottom: '28px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '9999px',
          border: '1px solid rgba(234, 88, 12, 0.25)',
          backgroundColor: FACELESS_DESIGN_TOKENS.colors.accentCoralBg,
          padding: '8px 24px',
          fontSize: `${FACELESS_DESIGN_TOKENS.typography.sizes.annotationText}px`,
          fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: FACELESS_DESIGN_TOKENS.colors.accentCoral,
          opacity,
        }}
      >
        <span>📅 TIME BLOCKING SYSTEM</span>
        <span>•</span>
        <span style={{ color: FACELESS_DESIGN_TOKENS.colors.textPrimary }}>{sceneTitle}</span>
      </div>

      {/* 7-Column Calendar Card Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          backgroundColor: FACELESS_DESIGN_TOKENS.colors.surfaceWhite,
          borderRadius: '24px',
          border: FACELESS_DESIGN_TOKENS.colors.borderHairline,
          boxShadow: FACELESS_DESIGN_TOKENS.colors.shadowElevated,
          padding: '28px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '16px',
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {DAYS.map((day, idx) => {
          const block = DEFAULT_BLOCKS.find((b) => b.dayIndex === idx);

          // Staggered block drop-in
          const blockSpring = spring({
            frame: Math.max(0, currentFrame - idx * FACELESS_DESIGN_TOKENS.motion.staggerFrames),
            fps,
            config: { damping: 14, stiffness: 140 },
          });

          const blockScale = interpolate(blockSpring, [0, 1], [0.85, 1.0]);
          const blockOpacity = interpolate(blockSpring, [0, 1], [0, 1]);

          return (
            <div
              key={day}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                minHeight: '440px',
              }}
            >
              {/* Day Header */}
              <div
                style={{
                  textAlign: 'center',
                  fontFamily: headingFont,
                  fontSize: '14px',
                  fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
                  letterSpacing: '0.1em',
                  color: idx < 5 ? FACELESS_DESIGN_TOKENS.colors.textPrimary : FACELESS_DESIGN_TOKENS.colors.textMuted,
                  padding: '8px 0',
                  borderBottom: FACELESS_DESIGN_TOKENS.colors.borderHairline,
                }}
              >
                {day}
              </div>

              {/* Day Slot / Active Time Block */}
              {block && (
                <div
                  style={{
                    backgroundColor: block.color,
                    borderRadius: '16px',
                    padding: '18px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                    opacity: blockOpacity,
                    transform: `scale(${blockScale})`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: bodyFont,
                      fontSize: '12px',
                      fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
                      letterSpacing: '0.04em',
                      color: block.textColor,
                      opacity: 0.85,
                    }}
                  >
                    {block.startHour}
                  </span>
                  <span
                    style={{
                      fontFamily: headingFont,
                      fontSize: '15px',
                      fontWeight: FACELESS_DESIGN_TOKENS.typography.weights.bold,
                      lineHeight: 1.3,
                      color: block.textColor,
                    }}
                  >
                    {block.title}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
