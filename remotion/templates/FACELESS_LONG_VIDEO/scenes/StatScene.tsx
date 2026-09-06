import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ResponsiveTypography } from '../components/ResponsiveTypography';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface StatSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function StatScene({
  scene,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: StatSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const statVal = scene.statValue || scene.numberBadge?.toString() || '$5 BILLION';
  const statLbl = scene.statLabel || scene.heading || 'Revenue generated in 2025';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 140px', // Strict 1920x1080 safe area
        zIndex: 10,
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.94, 1.0])})`,
      }}
    >
      <div
        style={{
          maxWidth: '1100px', // Controlled width (never 1800px)
          width: '100%',
          borderRadius: '36px',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          padding: '56px 64px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(16, 185, 129, 0.2)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            padding: '8px 22px',
            fontSize: '13px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#10B981',
          }}
        >
          <span>KEY STATISTIC &bull; DATA HIGHLIGHT</span>
        </div>

        {/* Huge Stat Number + Contextual Label Hierarchy */}
        <ResponsiveTypography
          text={statLbl}
          mode="stat"
          statData={{ value: statVal, label: statLbl }}
          fontFamily={headingFont}
          color="#F1F5F9"
          accentColor="#10B981"
          availableWidth={1000}
        />
      </div>
    </div>
  );
}
