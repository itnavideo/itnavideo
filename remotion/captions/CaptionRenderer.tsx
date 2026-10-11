// remotion/captions/CaptionRenderer.tsx
// Master Modular Caption Renderer component for 9:16 Vertical Shorts/Reels with Phase 4 upgrades

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionSegment, SubtitleConfig, WordTiming } from '../types/subtitles';
import { getActiveCaption, getActiveWord, distributeWordTimings } from '../utils/subtitleUtils';
import { resolveFont } from '../utils/fonts';
import { getCaptionPresetConfig } from './registry/captionPresets';
import { ContainerBadge } from './ContainerBadge';
import { MotionWrapper } from './MotionWrapper';
import { WordElement } from './WordElement';

export interface CaptionRendererProps {
  captions: CaptionSegment[];
  styleName?: string;
  configOverride?: Partial<SubtitleConfig>;
}

export const CaptionRenderer: React.FC<CaptionRendererProps> = ({
  captions,
  styleName = 'minimal-clean',
  configOverride = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeSec = frame / fps;
  const activeCaption = getActiveCaption(captions, currentTimeSec);
  if (!activeCaption) return null;

  const captionWithWords: CaptionSegment = {
    ...activeCaption,
    words:
      activeCaption.words && activeCaption.words.length > 0
        ? activeCaption.words
        : distributeWordTimings(activeCaption.text, activeCaption.start, activeCaption.end),
  };

  const activeWordObj = getActiveWord(captionWithWords.words || [], currentTimeSec);
  const activeWord = activeWordObj ? activeWordObj.word : null;

  const preset = getCaptionPresetConfig(styleName);

  const resolvedFont = resolveFont(configOverride.fontFamily || preset.fontFamily);
  const textColor = configOverride.textColor || preset.textColor;
  const highlightColor = configOverride.highlightColor || preset.highlightColor;
  const backgroundColor = configOverride.backgroundColor || preset.backgroundColor;

  const captionStartFrame = Math.round(activeCaption.start * fps);

  // 1. News Ticker continuous marquee scroll & tag
  if (preset.id === 'news-ticker') {
    const marqueeOffset = ((frame * 3.5) % 800) - 200;
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Ticker Tag */}
        <div
          style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontFamily: resolvedFont,
            fontSize: '20px',
            fontWeight: 900,
            padding: '4px 18px',
            borderRadius: '4px 4px 0 0',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            boxShadow: '0 -2px 10px rgba(239, 68, 68, 0.5)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 8px #FFFFFF',
            }}
          />
          <span>BREAKING NEWS</span>
        </div>
        {/* Ticker Bar */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#0F172A',
            borderTop: '3px solid #EF4444',
            borderBottom: '3px solid #EF4444',
            padding: '12px 0',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '16px',
              whiteSpace: 'nowrap',
              transform: `translateX(${-marqueeOffset}px)`,
            }}
          >
            {captionWithWords.words?.map((w: WordTiming, idx: number) => (
              <WordElement
                key={`${w.word}-${idx}`}
                word={w.word}
                wordIndex={idx}
                presetId={preset.id}
                start={w.start}
                end={w.end}
                activeWord={activeWord}
                currentTimeSec={currentTimeSec}
                textColor={textColor}
                highlightColor={highlightColor}
                fontSize={preset.fontSizePx}
                fontFamily={resolvedFont}
                fontWeight={preset.fontWeight}
                textTransform="uppercase"
                textStroke={preset.textStroke}
                textShadow={preset.textShadow}
                scaleOnActive={preset.scaleOnActive}
                activeScaleMultiplier={preset.activeScaleMultiplier}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Comic Pop speech bubble container badge
  let customBadgeProps: Partial<React.ComponentProps<typeof ContainerBadge>> = {};
  if (preset.id === 'comic-pop') {
    customBadgeProps = {
      showBackground: true,
      backgroundColor: '#FFFFFF',
      borderRadius: '28px 28px 28px 4px',
      border: '3.5px solid #000000',
      boxShadow: '8px 8px 0px #000000',
      padding: '16px 32px',
    };
  }

  // 3. Typewriter cursor
  const showCursor = preset.id === 'typewriter' && frame % 20 < 10;

  return (
    <MotionWrapper
      motionType={preset.motionType}
      startFrame={captionStartFrame}
      position={configOverride.position || 'bottom'}
    >
      <ContainerBadge
        showBackground={typeof configOverride.showBackground === 'boolean' ? configOverride.showBackground : preset.showBackground}
        backgroundColor={backgroundColor}
        borderRadius={preset.borderRadius}
        padding={preset.padding}
        border={preset.border}
        backdropFilter={preset.backdropFilter}
        {...customBadgeProps}
      >
        {captionWithWords.words?.map((w: WordTiming, idx: number) => (
          <WordElement
            key={`${w.word}-${idx}`}
            word={w.word}
            wordIndex={idx}
            presetId={preset.id}
            start={w.start}
            end={w.end}
            activeWord={activeWord}
            currentTimeSec={currentTimeSec}
            textColor={textColor}
            highlightColor={highlightColor}
            fontSize={preset.fontSizePx}
            fontFamily={resolvedFont}
            fontWeight={preset.fontWeight}
            textTransform={preset.textTransform}
            textStroke={preset.textStroke}
            textShadow={preset.textShadow}
            scaleOnActive={preset.scaleOnActive}
            activeScaleMultiplier={preset.activeScaleMultiplier}
          />
        ))}
        {showCursor && (
          <span
            style={{
              color: highlightColor,
              fontFamily: resolvedFont,
              fontSize: preset.fontSizePx,
              fontWeight: 900,
              marginLeft: '2px',
            }}
          >
            |
          </span>
        )}
      </ContainerBadge>
    </MotionWrapper>
  );
};
