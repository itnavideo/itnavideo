import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import { StatBadge } from '../components/StatBadge';
import { HighlightText } from '../components/HighlightText';
import { getSlideAnimation } from '../animations/Slide';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface StatSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function StatScene({ scene, headingFont = 'Montserrat, sans-serif', bodyFont = 'Inter, sans-serif' }: StatSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = getSlideAnimation(frame, fps, 'up');
  const statVal = scene.statValue || scene.numberBadge?.toString() || '3.2%';
  const statLbl = scene.statLabel || scene.heading || 'CTR CONVERSION';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px',
        zIndex: 10,
        ...anim,
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          width: '100%',
          borderRadius: '32px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '48px 56px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, paddingRight: '48px' }}>
          <Heading
            text={scene.heading || 'KEY STATISTIC'}
            level="h1"
            fontFamily={headingFont}
            color="#FFFFFF"
            style={{ marginBottom: '24px' }}
          />
          <HighlightText
            text={scene.supportingText || scene.narrationSegment?.text || ''}
            highlightedWords={scene.highlightedWords}
            accentColor="#10B981"
            fontFamily={bodyFont}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StatBadge
            value={statVal}
            label={statLbl}
            trend={scene.statTrend || 'up'}
            accentColor="#10B981"
            fontFamily={headingFont}
          />
        </div>
      </div>
    </div>
  );
}

