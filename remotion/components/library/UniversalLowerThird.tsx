import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { getLowerThirdPreset } from '../../../services/templates/templateLibrary';

export interface ChapterCardEvent {
  id: string;
  title: string;
  subtitle?: string;
  stepNumber?: number | string;
  start: number;
  end: number;
}

export interface UniversalLowerThirdProps {
  chapterEvents?: ChapterCardEvent[];
  lowerThirdId?: string;
}

export const UniversalLowerThird: React.FC<UniversalLowerThirdProps> = ({
  chapterEvents = [],
  lowerThirdId = 'chapter-badge',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const preset = getLowerThirdPreset(lowerThirdId);

  const activeChapter = chapterEvents.find(
    (ch) => currentTime >= ch.start && currentTime <= ch.end
  );

  if (!activeChapter) return null;

  const startFrame = Math.floor(activeChapter.start * fps);
  const slideSpring = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const { badgeStyle } = preset;

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 60,
        zIndex: 45,
        transform: `translateX(${(1 - slideSpring) * -100}%)`,
        opacity: slideSpring,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: badgeStyle.backgroundColor,
        borderRadius: '12px',
        padding: '12px 24px',
        borderLeft: `6px solid ${badgeStyle.accentColor}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {activeChapter.stepNumber !== undefined && (
        <span
          style={{
            backgroundColor: badgeStyle.accentColor,
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '18px',
            padding: '4px 10px',
            borderRadius: '6px',
            letterSpacing: '1px',
          }}
        >
          {typeof activeChapter.stepNumber === 'number'
            ? `STEP ${activeChapter.stepNumber}`
            : activeChapter.stepNumber}
        </span>
      )}
      <div>
        <div
          style={{
            color: badgeStyle.textColor,
            fontWeight: 800,
            fontSize: '22px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {activeChapter.title}
        </div>
        {activeChapter.subtitle && (
          <div
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            {activeChapter.subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
