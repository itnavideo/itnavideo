// remotion/components/SubtitleRenderer.tsx
// Single reusable subtitle component for ALL Itnavideo templates

import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {
  CaptionSegment,
  SubtitleConfig,
  DEFAULT_SUBTITLE_CONFIG,
  WordTiming,
} from '../types/subtitles';
import {
  getActiveCaption,
  getActiveWord,
  distributeWordTimings,
  getFontSize,
} from '../utils/subtitleUtils';

interface SubtitleRendererProps {
  captions: CaptionSegment[];
  config?: Partial<SubtitleConfig>;
}

export const SubtitleRenderer: React.FC<SubtitleRendererProps> = ({
  captions,
  config: configOverride = {},
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const config: SubtitleConfig = {...DEFAULT_SUBTITLE_CONFIG, ...configOverride};

  if (config.style === 'none') return null;

  const currentTimeSec = frame / fps;
  const activeCaption = getActiveCaption(captions, currentTimeSec);
  if (!activeCaption) return null;

  const captionWithWords: CaptionSegment = {
    ...activeCaption,
    words: distributeWordTimings(activeCaption),
  };
  const activeWord = getActiveWord(captionWithWords, currentTimeSec);
  const fontSize = getFontSize(config.fontSize);

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0, right: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    paddingLeft: 40, paddingRight: 40,
    zIndex: 20,
    ...(config.position === 'top' && {top: 120}),
    ...(config.position === 'center' && {top: '50%', transform: 'translateY(-50%)'}),
    ...(config.position === 'bottom' && {bottom: 180}),
  };

  const renderStyle = () => {
    switch (config.style) {
      case 'normal':
        return <NormalStyle caption={captionWithWords} config={config} fontSize={fontSize} />;
      case 'highlight':
        return <HighlightStyle caption={captionWithWords} config={config} fontSize={fontSize} activeWord={activeWord} />;
      case 'big-bold':
        return <BigBoldStyle caption={captionWithWords} config={config} fontSize={fontSize} frame={frame} fps={fps} />;
      case 'word-pop':
        return <WordPopStyle caption={captionWithWords} config={config} fontSize={fontSize} activeWord={activeWord} />;
      case 'neon':
        return <NeonStyle caption={captionWithWords} config={config} fontSize={fontSize} activeWord={activeWord} />;
      case 'box':
        return <BoxStyle caption={captionWithWords} config={config} fontSize={fontSize} activeWord={activeWord} />;
      case 'split-color':
        return <SplitColorStyle caption={captionWithWords} config={config} fontSize={fontSize} activeWord={activeWord} />;
      case 'typewriter':
        return <TypewriterStyle caption={captionWithWords} config={config} fontSize={fontSize} currentTimeSec={currentTimeSec} />;
      case 'bold-outline':
        return <BoldOutlineStyle caption={captionWithWords} config={config} fontSize={fontSize} activeWord={activeWord} />;
      default:
        return <NormalStyle caption={captionWithWords} config={config} fontSize={fontSize} />;
    }
  };

  return <div style={positionStyle}>{renderStyle()}</div>;
};

// ─── Style Components ────────────────────────────────────────────────────────

type StyleProps = {
  caption: CaptionSegment;
  config: SubtitleConfig;
  fontSize: number;
  activeWord?: string | null;
  frame?: number;
  fps?: number;
  currentTimeSec?: number;
};

const NormalStyle: React.FC<StyleProps> = ({caption, config, fontSize}) => (
  <div style={{
    color: config.textColor, fontSize, fontFamily: config.fontFamily,
    fontWeight: 600, textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    backgroundColor: config.showBackground ? 'rgba(0,0,0,0.45)' : 'transparent',
    borderRadius: 12, padding: '10px 24px', maxWidth: 900,
  }}>
    {caption.text}
  </div>
);

const HighlightStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
    maxWidth: 950,
    backgroundColor: config.showBackground ? 'rgba(0,0,0,0.5)' : 'transparent',
    borderRadius: 16, padding: '12px 28px',
  }}>
    {caption.words?.map((w: WordTiming, i: number) => {
      const isActive = w.word === activeWord;
      return (
        <span key={i} style={{
          fontSize, fontFamily: config.fontFamily,
          fontWeight: isActive ? 800 : 600,
          color: isActive ? config.highlightColor : config.textColor,
          textShadow: isActive
            ? `0 0 20px ${config.highlightColor}99`
            : '0 2px 6px rgba(0,0,0,0.7)',
          transform: isActive ? 'scale(1.12)' : 'scale(1)',
          display: 'inline-block',
        }}>
          {w.word}
        </span>
      );
    })}
  </div>
);

const BigBoldStyle: React.FC<StyleProps> = ({caption, config, fontSize, frame = 0, fps = 30}) => {
  const progress = Math.min(1, (frame % fps) / (fps * 0.15));
  const scale = 0.85 + 0.15 * progress;
  return (
    <div style={{
      color: config.textColor, fontSize: fontSize * 1.4,
      fontFamily: config.fontFamily, fontWeight: 900,
      textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2,
      textShadow: `3px 3px 0px ${config.highlightColor}, 0 4px 20px rgba(0,0,0,0.9)`,
      transform: `scale(${scale})`, maxWidth: 900,
    }}>
      {caption.text}
    </div>
  );
};

const WordPopStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => (
  <div style={{textAlign: 'center', maxWidth: 900}}>
    {activeWord ? (
      <div style={{
        color: config.highlightColor, fontSize: fontSize * 1.6,
        fontWeight: 900, fontFamily: config.fontFamily,
        textShadow: `0 0 30px ${config.highlightColor}`,
        textTransform: 'uppercase', letterSpacing: 4, transform: 'scale(1.05)',
      }}>
        {activeWord}
      </div>
    ) : (
      <div style={{
        color: config.textColor, fontSize, fontWeight: 600,
        fontFamily: config.fontFamily, opacity: 0.5,
      }}>
        {caption.text}
      </div>
    )}
  </div>
);

const NeonStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
    maxWidth: 950, padding: '12px 28px',
  }}>
    {caption.words?.map((w: WordTiming, i: number) => {
      const isActive = w.word === activeWord;
      return (
        <span key={i} style={{
          fontSize, fontFamily: config.fontFamily, fontWeight: 700,
          color: isActive ? config.highlightColor : config.textColor,
          textShadow: isActive
            ? `0 0 10px ${config.highlightColor}, 0 0 30px ${config.highlightColor}, 0 0 60px ${config.highlightColor}`
            : '0 0 8px rgba(255,255,255,0.3)',
        }}>
          {w.word}
        </span>
      );
    })}
  </div>
);

const BoxStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
    maxWidth: 950, padding: '8px',
  }}>
    {caption.words?.map((w: WordTiming, i: number) => {
      const isActive = w.word === activeWord;
      return (
        <span key={i} style={{
          fontSize, fontFamily: config.fontFamily, fontWeight: 700,
          color: isActive ? '#000' : config.textColor,
          backgroundColor: isActive ? config.highlightColor : 'rgba(0,0,0,0.55)',
          borderRadius: 8, padding: '4px 14px', display: 'inline-block',
        }}>
          {w.word}
        </span>
      );
    })}
  </div>
);

const SplitColorStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const words = caption.words ?? [];
  const activeIndex = words.findIndex((w: WordTiming) => w.word === activeWord);
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
      maxWidth: 950, padding: '12px 28px',
      backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16,
    }}>
      {words.map((w: WordTiming, i: number) => (
        <span key={i} style={{
          fontSize, fontFamily: config.fontFamily, fontWeight: 700,
          color: i <= activeIndex ? config.highlightColor : config.textColor,
          opacity: i <= activeIndex ? 1 : 0.5,
        }}>
          {w.word}
        </span>
      ))}
    </div>
  );
};

const TypewriterStyle: React.FC<StyleProps> = ({caption, config, fontSize, currentTimeSec = 0}) => {
  const elapsed = currentTimeSec - caption.start;
  const totalDuration = caption.end - caption.start;
  const progress = Math.min(1, elapsed / totalDuration);
  const visibleChars = Math.floor(caption.text.length * progress);
  const visibleText = caption.text.slice(0, visibleChars);
  return (
    <div style={{
      color: config.textColor, fontSize, fontFamily: 'monospace', fontWeight: 600,
      textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.8)',
      backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 12,
      padding: '10px 24px', maxWidth: 900, minHeight: fontSize * 1.6,
    }}>
      {visibleText}
      <span style={{opacity: Math.sin(currentTimeSec * 5) > 0 ? 1 : 0}}>|</span>
    </div>
  );
};

const BoldOutlineStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
    maxWidth: 950, padding: '12px 28px',
  }}>
    {caption.words?.map((w: WordTiming, i: number) => {
      const isActive = w.word === activeWord;
      return (
        <span key={i} style={{
          fontSize: isActive ? fontSize * 1.15 : fontSize,
          fontFamily: config.fontFamily, fontWeight: 900,
          color: isActive ? config.highlightColor : config.textColor,
          WebkitTextStroke: `3px ${isActive ? config.highlightColor : 'rgba(0,0,0,0.8)'}`,
          paintOrder: 'stroke fill',
          textShadow: '2px 2px 0 #000, -2px -2px 0 #000',
          display: 'inline-block',
        }}>
          {w.word}
        </span>
      );
    })}
  </div>
);
