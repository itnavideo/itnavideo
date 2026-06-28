// remotion/components/SubtitleRenderer.tsx
// Single reusable subtitle component for ALL Itnavideo templates

import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
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
import {resolveFont, getFontForLanguage} from '../utils/fonts';

interface SubtitleRendererProps {
  captions: CaptionSegment[];
  config?: Partial<SubtitleConfig>;
}

// Caption entry animation — dramatic transition when a new chunk appears
type CaptionEntryType = 'slide-up' | 'zoom-in' | 'glitch' | 'flip';

function getResponsiveFontSize(
  caption: CaptionSegment,
  baseFontSize: number,
  style: SubtitleConfig['style'],
): number {
  const words = caption.text.trim().split(/\s+/).filter(Boolean);
  const longestWordLength = words.reduce((max, word) => Math.max(max, word.length), 0);
  const characterCount = caption.text.length;
  let scale = 1;

  if (longestWordLength >= 24) scale *= 0.62;
  else if (longestWordLength >= 18) scale *= 0.72;
  else if (longestWordLength >= 14) scale *= 0.84;

  if (characterCount >= 54) scale *= 0.76;
  else if (characterCount >= 42) scale *= 0.86;

  if (style === 'one-word' && longestWordLength >= 14) scale *= 0.72;
  if ((style === 'big-bold' || style === 'bold-outline') && characterCount >= 34) scale *= 0.82;

  return Math.max(30, Math.round(baseFontSize * scale));
}

function getCaptionEntryAnimation(
  localFrame: number,
  fps: number,
  style: CaptionEntryType = 'slide-up'
): React.CSSProperties {
  if (style === 'slide-up') {
    const y = spring({
      frame: localFrame, fps,
      config: { damping: 20, stiffness: 300, mass: 0.7 },
      from: 40, to: 0,
    });
    const opacity = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    return { transform: `translateY(${y}px)`, opacity };
  }

  if (style === 'zoom-in') {
    const scale = spring({
      frame: localFrame, fps,
      config: { damping: 16, stiffness: 380, mass: 0.5 },
      from: 0.6, to: 1,
    });
    const opacity = interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
    return { transform: `scale(${scale})`, opacity };
  }

  if (style === 'glitch') {
    const glitchOffsets = [8, -6, 4, -3, 2, -1, 0];
    const glitchX = localFrame < 7 ? glitchOffsets[Math.min(localFrame, 6)] : 0;
    const opacity = interpolate(localFrame, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
    return {
      transform: `translateX(${glitchX}px)`,
      opacity,
      filter: localFrame < 4 ? `hue-rotate(${glitchX * 15}deg)` : 'none',
    };
  }

  if (style === 'flip') {
    const rotateX = interpolate(
      localFrame, [0, 12], [90, 0],
      { extrapolateRight: 'clamp', easing: (t: number) => 1 - Math.pow(1 - t, 3) }
    );
    const opacity = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    return {
      transform: `perspective(800px) rotateX(${rotateX}deg)`,
      opacity,
      transformOrigin: 'top center',
    };
  }

  return {};
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

  // Resolve font — use loaded Google Font for Lambda render
  const resolvedFont = resolveFont(config.fontFamily) || getFontForLanguage(config.language);
  const resolvedConfig = {...config, fontFamily: resolvedFont};

  const captionWithWords: CaptionSegment = {
    ...activeCaption,
    words: distributeWordTimings(activeCaption),
  };
  const activeWord = getActiveWord(captionWithWords, currentTimeSec);
  const fontSize = getResponsiveFontSize(
    captionWithWords,
    getFontSize(resolvedConfig.fontSize),
    resolvedConfig.style,
  );

  // === CAPTION ENTRY ANIMATION ===
  // Each new caption chunk gets a dramatic entry transition
  const captionStartFrame = Math.round(activeCaption.start * fps);
  const localFrame = frame - captionStartFrame;

  // Pick entry style based on caption style (energetic styles get zoom, clean styles get slide)
  const entryType = (['one-word', 'word-pop', 'big-bold', 'shatter', 'pill-bounce'] as string[]).includes(resolvedConfig.style)
    ? 'zoom-in'
    : (['neon', 'typewriter-code'] as string[]).includes(resolvedConfig.style)
      ? 'glitch'
      : 'slide-up';

  const entryAnimation = getCaptionEntryAnimation(localFrame, fps, entryType);

  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0, right: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    paddingLeft: 40, paddingRight: 40,
    zIndex: 20,
    ...(resolvedConfig.position === 'top' && {top: 120}),
    ...(resolvedConfig.position === 'center' && {top: '50%', transform: 'translateY(-50%)'}),
    ...(resolvedConfig.position === 'bottom' && {bottom: 180}),
  };

  const renderStyle = () => {
    switch (resolvedConfig.style) {
      case 'normal':
        return <NormalStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} />;
      case 'highlight':
        return <HighlightStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'big-bold':
        return <BigBoldStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} frame={frame} fps={fps} />;
      case 'word-pop':
        return <WordPopStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'neon':
        return <NeonStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'box':
        return <BoxStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'split-color':
        return <SplitColorStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'typewriter':
        return <TypewriterStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} currentTimeSec={currentTimeSec} />;
      case 'bold-outline':
        return <BoldOutlineStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'one-word':
        return <OneWordStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'gold-pill':
        return <GoldPillStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} />;
      case 'stacked':
        return <StackedStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'inline-bg':
        return <InlineBgStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'vollkorn':
        return <VollkornStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'karaoke':
        return <KaraokeStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} currentTimeSec={currentTimeSec} />;
      case 'shatter':
        return <ShatterStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'pill-bounce':
        return <PillBounceStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} activeWord={activeWord} />;
      case 'cinematic':
        return <CinematicStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} />;
      case 'typewriter-code':
        return <TypewriterCodeStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} currentTimeSec={currentTimeSec} />;
      default:
        return <NormalStyle caption={captionWithWords} config={resolvedConfig} fontSize={fontSize} />;
    }
  };

  return (
    <div style={positionStyle}>
      <div style={{
        ...entryAnimation,
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '100%',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
      }}>
        {renderStyle()}
      </div>
    </div>
  );
};

// ─── Style Components ────────────────────────────────────────────────────────

// Word emphasis — auto-scale important/power words
const EMPHASIS_WORDS_SET = new Set([
  'never', 'always', 'best', 'free', 'now', 'boom', 'new', 'first',
  'stop', 'must', 'only', 'biggest', 'secret', 'real', 'truth',
  'million', 'billion', 'guarantee', 'important', 'finally',
  'kabhi', 'zaroor', 'sabse', 'naya', 'pehla', 'sach', 'asli',
  'sirf', 'bilkul', 'pakka', 'seriously', 'literally',
]);

function isEmphasisWord(word: string): boolean {
  return EMPHASIS_WORDS_SET.has(word.toLowerCase().replace(/[^a-z]/g, ''));
}

type StyleProps = {
  caption: CaptionSegment;
  config: SubtitleConfig;
  fontSize: number;
  activeWord?: string | null;
  frame?: number;
  fps?: number;
  currentTimeSec?: number;
};

const captionBackground = (config: SubtitleConfig, fallback: string) =>
  config.showBackground ? (config.backgroundColor || fallback) : 'transparent';

const NormalStyle: React.FC<StyleProps> = ({caption, config, fontSize}) => (
  <div style={{
    color: config.textColor, fontSize, fontFamily: config.fontFamily,
    fontWeight: 700, textAlign: 'center',
    textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.3)',
    backgroundColor: captionBackground(config, 'rgba(0,0,0,0.5)'),
    borderRadius: 12, padding: '10px 24px', maxWidth: 900,
  }}>
    {caption.text}
  </div>
);

const HighlightStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeSec = frame / fps;
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
      maxWidth: 950,
      backgroundColor: captionBackground(config, 'rgba(0,0,0,0.55)'),
      borderRadius: 16, padding: '12px 28px',
    }}>
      {caption.words?.map((w: WordTiming, i: number) => {
        const isActive = w.word === activeWord;
        // Spring-based scale pulse on active word
        const wordLocalFrame = isActive ? Math.round((currentTimeSec - w.start) * fps) : 0;
        const pulseScale = isActive
          ? 0.85 + 0.23 * spring({frame: wordLocalFrame, fps, config: {damping: 10, mass: 0.3, stiffness: 200}})
          : 1;
        // Word emphasis — auto-bold important words (NEVER, BEST, FREE, etc.)
        const isEmphasis = isEmphasisWord(w.word);
        const emphasisScale = isEmphasis && isActive
          ? spring({frame: wordLocalFrame, fps, config: {damping: 10, stiffness: 500}, from: 1.35, to: 1.15})
          : isEmphasis ? 1.08 : 1.0;
        return (
          <span key={i} style={{
            fontSize: isEmphasis ? fontSize * 1.05 : fontSize,
            fontFamily: config.fontFamily,
            fontWeight: isActive ? 800 : isEmphasis ? 800 : 600,
            color: isActive ? config.highlightColor : config.textColor,
            textShadow: isActive
              ? `0 0 12px ${config.highlightColor}66, 0 2px 4px rgba(0,0,0,0.4)`
              : '0 1px 2px rgba(0,0,0,0.4)',
            transform: `scale(${pulseScale * emphasisScale})`,
            display: 'inline-block',
            textTransform: isEmphasis ? 'uppercase' : 'none',
          }}>
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

const BigBoldStyle: React.FC<StyleProps> = ({caption, config, fontSize, frame = 0, fps = 30}) => {
  const progress = Math.min(1, (frame % fps) / (fps * 0.15));
  const scale = 0.9 + 0.1 * progress;
  return (
    <div style={{
      color: config.textColor, fontSize: fontSize * 1.4,
      fontFamily: config.fontFamily, fontWeight: 900,
      textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2,
      WebkitTextStroke: `2px ${config.highlightColor}`,
      paintOrder: 'stroke fill',
      transform: `scale(${scale})`, maxWidth: 900,
    }}>
      {caption.text}
    </div>
  );
};

const WordPopStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeSec = frame / fps;
  const activeW = caption.words?.find((w: WordTiming) => w.word === activeWord);
  const wordLocalFrame = activeW ? Math.round((currentTimeSec - activeW.start) * fps) : 0;
  const popScale = activeWord
    ? spring({frame: wordLocalFrame, fps, config: {damping: 8, mass: 0.25, stiffness: 220}, from: 0.6, to: 1})
    : 0.8;
  return (
    <div style={{textAlign: 'center', maxWidth: 900}}>
      {activeWord ? (
        <div style={{
          color: config.highlightColor, fontSize: fontSize * 2,
          fontWeight: 900, fontFamily: config.fontFamily,
          textShadow: `0 0 24px ${config.highlightColor}55, 0 4px 12px rgba(0,0,0,0.4)`,
          textTransform: 'uppercase', letterSpacing: 4,
          transform: `scale(${popScale})`,
        }}>
          {activeWord}
        </div>
      ) : (
        <div style={{
          color: config.textColor, fontSize, fontWeight: 600,
          fontFamily: config.fontFamily, opacity: 0.4,
        }}>
          {caption.text}
        </div>
      )}
    </div>
  );
};

const NeonStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeSec = frame / fps;
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
      maxWidth: 950, padding: '12px 28px',
    }}>
      {caption.words?.map((w: WordTiming, i: number) => {
        const isActive = w.word === activeWord;
        const wordLocalFrame = isActive ? Math.round((currentTimeSec - w.start) * fps) : 0;
        const glowIntensity = isActive
          ? spring({frame: wordLocalFrame, fps, config: {damping: 12, mass: 0.3, stiffness: 160}})
          : 0;
        return (
          <span key={i} style={{
            fontSize, fontFamily: config.fontFamily, fontWeight: 700,
            color: isActive ? config.highlightColor : config.textColor,
            textShadow: isActive
              ? `0 0 ${6 + glowIntensity * 14}px ${config.highlightColor}, 0 0 ${2 + glowIntensity * 6}px ${config.highlightColor}aa`
              : '0 1px 2px rgba(0,0,0,0.4)',
            transform: isActive ? `scale(${1 + glowIntensity * 0.06})` : 'scale(1)',
            display: 'inline-block',
          }}>
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

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
      backgroundColor: captionBackground(config, 'rgba(0,0,0,0.5)'), borderRadius: 16,
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
      color: config.textColor, fontSize, fontFamily: config.fontFamily, fontWeight: 600,
      textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.8)',
      backgroundColor: captionBackground(config, 'rgba(0,0,0,0.55)'), borderRadius: 12,
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
          fontSize: isActive ? fontSize * 1.1 : fontSize,
          fontFamily: config.fontFamily, fontWeight: 900,
          color: isActive ? config.highlightColor : config.textColor,
          WebkitTextStroke: `2px ${isActive ? config.highlightColor : 'rgba(0,0,0,0.7)'}`,
          paintOrder: 'stroke fill',
          display: 'inline-block',
        }}>
          {w.word}
        </span>
      );
    })}
  </div>
);

// ─── NEW STYLES (Competitor-Inspired) ────────────────────────────────────────

const OneWordStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeSec = frame / fps;
  const activeW = caption.words?.find((w: WordTiming) => w.word === activeWord);
  const wordLocalFrame = activeW ? Math.round((currentTimeSec - activeW.start) * fps) : 0;
  const popScale = activeWord
    ? spring({frame: wordLocalFrame, fps, config: {damping: 9, mass: 0.25, stiffness: 240}, from: 0.5, to: 1})
    : 0.8;
  return (
    <div style={{
      width: '100%', textAlign: 'center',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: fontSize * 2.5,
    }}>
      <span style={{
        fontSize: fontSize * 2.2,
        fontFamily: config.fontFamily,
        fontWeight: 900,
        color: activeWord ? config.highlightColor : config.textColor,
        textTransform: 'uppercase',
        letterSpacing: 4,
        textShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 20px ${config.highlightColor}33`,
        transform: `scale(${popScale})`,
      }}>
        {activeWord || caption.words?.[0]?.word || caption.text.split(' ')[0] || ''}
      </span>
    </div>
  );
};

const GoldPillStyle: React.FC<StyleProps> = ({caption, config, fontSize}) => {
  const lines = splitIntoLines(caption.text, 5);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center'}}>
      {lines.map((line, i) => (
        <div key={i} style={{
          padding: '12px 28px',
          borderRadius: 50,
          backgroundColor: config.backgroundColor || '#000',
          display: 'inline-block',
        }}>
          <span style={{
            fontSize, fontFamily: config.fontFamily, fontWeight: 800,
            color: config.textColor || '#FFD700',
            letterSpacing: 1,
          }}>
            {line}
          </span>
        </div>
      ))}
    </div>
  );
};

const StackedStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const words = caption.words ?? [];
  const displayWords = words.slice(0, 4);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '20px 32px', borderRadius: 20,
      backgroundColor: config.backgroundColor || 'rgba(24,24,27,0.92)',
      backdropFilter: 'blur(8px)',
    }}>
      {displayWords.map((w: WordTiming, i: number) => {
        const isActive = w.word === activeWord;
        return (
          <span key={i} style={{
            fontSize: isActive ? fontSize * 1.4 : fontSize * 0.9,
            fontFamily: config.fontFamily, fontWeight: isActive ? 900 : 600,
            color: isActive ? config.highlightColor : config.textColor,
            textTransform: 'uppercase',
            transition: 'all 0.1s',
          }}>
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

const InlineBgStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6,
    maxWidth: 950, padding: '12px 24px',
  }}>
    {caption.words?.map((w: WordTiming, i: number) => {
      const isActive = w.word === activeWord;
      return (
        <span key={i} style={{
          fontSize, fontFamily: config.fontFamily, fontWeight: 700,
          color: config.textColor,
          backgroundColor: isActive ? config.highlightColor : 'transparent',
          borderRadius: 6,
          padding: isActive ? '2px 10px' : '2px 4px',
          display: 'inline-block',
          textShadow: isActive ? 'none' : '0 2px 6px rgba(0,0,0,0.8)',
        }}>
          {w.word}
        </span>
      );
    })}
  </div>
);

const VollkornStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
    maxWidth: 950, padding: '14px 28px', borderRadius: 14,
    backgroundColor: config.backgroundColor || 'rgba(0,0,0,0.85)',
  }}>
    {caption.words?.map((w: WordTiming, i: number) => {
      const isActive = w.word === activeWord;
      return (
        <span key={i} style={{
          fontSize, fontFamily: config.fontFamily, fontWeight: 700,
          color: isActive ? config.highlightColor : config.textColor,
          textShadow: isActive ? `0 0 12px ${config.highlightColor}88` : 'none',
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
          display: 'inline-block',
        }}>
          {w.word}
        </span>
      );
    })}
  </div>
);

// ─── NEW STYLES (CapCut-Killer Level) ────────────────────────────────────────

// Style: KARAOKE — words fill left-to-right like music karaoke
const KaraokeStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord, currentTimeSec = 0}) => {
  const words = caption.words ?? [];
  const activeIndex = words.findIndex((w: WordTiming) => w.word === activeWord);

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
      maxWidth: 950, padding: '14px 28px',
      backgroundColor: captionBackground(config, 'rgba(0,0,0,0.6)'),
      borderRadius: 16,
    }}>
      {words.map((w: WordTiming, i: number) => {
        // Calculate fill progress for current word
        let fillProgress = 0;
        if (i < activeIndex) {
          fillProgress = 1; // fully filled
        } else if (i === activeIndex && w.end > w.start) {
          fillProgress = Math.min(1, Math.max(0, (currentTimeSec - w.start) / (w.end - w.start)));
        }

        return (
          <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Base text (dim) */}
            <span style={{
              color: config.textColor,
              opacity: 0.35,
              fontSize, fontFamily: config.fontFamily, fontWeight: 800,
            }}>
              {w.word}
            </span>
            {/* Fill overlay — clips from left */}
            {fillProgress > 0 && (
              <span style={{
                position: 'absolute', left: 0, top: 0,
                color: config.highlightColor,
                clipPath: `inset(0 ${(1 - fillProgress) * 100}% 0 0)`,
                fontSize, fontFamily: config.fontFamily, fontWeight: 800,
                textShadow: `0 0 20px ${config.highlightColor}99`,
              }}>
                {w.word}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Style: SHATTER — words drop in from above one by one with spring
const ShatterStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = caption.words ?? [];
  // Calculate frame offset relative to caption start
  const captionStartFrame = Math.round(caption.start * fps);
  const localBaseFrame = frame - captionStartFrame;

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
      maxWidth: 950, padding: '12px 28px',
    }}>
      {words.map((w: WordTiming, i: number) => {
        const delay = i * 3; // 3 frame stagger per word
        const localF = Math.max(0, localBaseFrame - delay);
        const y = spring({
          frame: localF, fps,
          config: { damping: 14, stiffness: 300, mass: 0.8 },
          from: -80, to: 0,
        });
        const opacity = interpolate(localF, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
        const isActive = w.word === activeWord;

        return (
          <span key={i} style={{
            transform: `translateY(${y}px)`,
            opacity,
            fontSize, fontFamily: config.fontFamily, fontWeight: 900,
            color: isActive ? config.highlightColor : config.textColor,
            textShadow: isActive
              ? `0 0 30px ${config.highlightColor}cc, 3px 3px 0 #000`
              : '3px 3px 0 #000',
            display: 'inline-block',
          }}>
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

// Style: PILL BOUNCE — active word gets a bouncy colored pill background (TikTok style)
const PillBounceStyle: React.FC<StyleProps> = ({caption, config, fontSize, activeWord}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTimeSec = frame / fps;
  const words = caption.words ?? [];

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
      maxWidth: 950, padding: '12px 24px',
    }}>
      {words.map((w: WordTiming, i: number) => {
        const isActive = w.word === activeWord;
        const wordLocalFrame = isActive ? Math.round((currentTimeSec - w.start) * fps) : 0;
        const scale = isActive
          ? spring({ frame: wordLocalFrame, fps, config: { damping: 10, stiffness: 400, mass: 0.5 }, from: 0.85, to: 1 })
          : 1;

        return (
          <span key={i} style={{
            display: 'inline-block',
            transform: `scale(${scale})`,
            padding: isActive ? '8px 20px' : '8px 12px',
            borderRadius: 100,
            background: isActive ? config.highlightColor : 'rgba(255,255,255,0.08)',
            color: isActive ? '#000' : config.textColor,
            fontSize, fontFamily: config.fontFamily, fontWeight: 800,
            boxShadow: isActive ? `0 4px 16px ${config.highlightColor}55` : 'none',
          }}>
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

// Style: CINEMATIC — Netflix-style clean bar with serif font
const CinematicStyle: React.FC<StyleProps> = ({caption, config, fontSize}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const captionStartFrame = Math.round(caption.start * fps);
  const localFrame = frame - captionStartFrame;
  const fadeIn = interpolate(localFrame, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
  const slideUp = interpolate(localFrame, [0, 8], [12, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      display: 'inline-block',
      background: captionBackground(config, 'rgba(0,0,0,0.72)'),
      backdropFilter: 'blur(8px)',
      padding: '14px 32px',
      borderRadius: 8,
      opacity: fadeIn,
      transform: `translateY(${slideUp}px)`,
    }}>
      <p style={{
        color: config.textColor,
        fontSize: fontSize * 0.95,
        fontWeight: 600,
        letterSpacing: '0.02em',
        margin: 0,
        fontFamily: config.fontFamily,
        textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        {caption.text}
      </p>
    </div>
  );
};

// Style: TYPEWRITER CODE — hacker terminal style with green cursor + left border
const TypewriterCodeStyle: React.FC<StyleProps> = ({caption, config, fontSize, currentTimeSec = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const elapsed = currentTimeSec - caption.start;
  const totalDuration = caption.end - caption.start;
  const progress = Math.min(1, elapsed / (totalDuration * 0.7)); // finish typing at 70% of chunk
  const visibleChars = Math.floor(caption.text.length * progress);
  const visibleText = caption.text.slice(0, visibleChars);
  const cursorBlink = Math.sin(frame / fps * 6) > 0;

  return (
    <div style={{
      fontFamily: config.fontFamily,
      fontSize: fontSize * 0.9,
      color: config.highlightColor || '#00FF88',
      textShadow: `0 0 12px ${config.highlightColor || '#00FF88'}66`,
      padding: '16px 24px',
      background: captionBackground(config, 'rgba(0,0,0,0.8)'),
      borderLeft: `4px solid ${config.highlightColor || '#00FF88'}`,
      borderRadius: 8,
      minHeight: fontSize * 1.8,
      maxWidth: 900,
    }}>
      {visibleText}
      <span style={{ opacity: cursorBlink ? 1 : 0 }}>▌</span>
    </div>
  );
};

// Helper
function splitIntoLines(text: string, wordsPerLine: number): string[] {
  const words = text.split(' ').filter(Boolean);
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '));
  }
  return lines.length ? lines : [text];
}
