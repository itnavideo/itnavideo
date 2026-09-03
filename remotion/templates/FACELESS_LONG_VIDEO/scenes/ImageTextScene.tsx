import React from 'react';
import { OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import { HighlightText } from '../components/HighlightText';
import { getSlideAnimation } from '../animations/Slide';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ImageTextSceneProps {
  scene: SceneBlueprintItem;
  brollUrl?: string;
  headingFont?: string;
  bodyFont?: string;
}

export function ImageTextScene({
  scene,
  brollUrl,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: ImageTextSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = getSlideAnimation(frame, fps, 'left');

  // Prevent duplicate narration text rendering
  const supportingBullet = scene.supportingText && scene.supportingText !== scene.narrationSegment?.text
    ? scene.supportingText
    : '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
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
          border: '1px solid rgba(56, 189, 248, 0.3)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '48px 56px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, paddingRight: '48px' }}>
          <Heading
            text={scene.heading || 'VISUAL BREAKDOWN'}
            level="h1"
            fontFamily={headingFont}
            color="#FFFFFF"
            style={{ marginBottom: '16px' }}
          />

          {supportingBullet && (
            <HighlightText
              text={supportingBullet}
              highlightedWords={scene.highlightedWords}
              accentColor="#38BDF8"
              fontFamily={bodyFont}
            />
          )}
        </div>

        <div
          style={{
            width: '450px',
            height: '320px',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {brollUrl ? (
            <OffthreadVideo src={brollUrl} volume={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(49, 46, 129, 0.8) 100%)',
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A5B4FC' }}>
                {scene.visualAssetRequirement || 'VISUAL CONCEPT MOCKUP'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
