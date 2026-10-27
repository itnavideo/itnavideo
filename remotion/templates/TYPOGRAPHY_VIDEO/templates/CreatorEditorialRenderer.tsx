import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { CaptionSegment, WordTiming } from '../../../types/subtitles';
import { LOADED_FONTS } from '../../../utils/fonts';

export interface CreatorEditorialProps {
  durationSeconds?: number;
  captions?: CaptionSegment[];
  mediaSrc?: string;
  audioUrl?: string;
  bgmUrl?: string;
  transcriptText?: string;
  overlayMediaUrl?: string;
  positionZone?: 'headroom' | 'chest' | 'center';
  accentColor?: string;
  sfxIntensity?: 'full' | 'subtle' | 'none';
  textCase?: 'uppercase' | 'natural';
}

// Common connectors that should remain smaller in scale
const CONNECTOR_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but',
  'is', 'are', 'was', 'were', 'it', 'its', 'you', 'your', 'we', 'our', 'they',
  'se', 'ke', 'ka', 'ki', 'ko', 'me', 'mein', 'aur', 'toh', 'bhi', 'hai', 'hain',
  'tha', 'thi', 'the', 'jo', 'wo', 'ab', 'ye', 'par', 'ho', 'kya', 'kyu', 'so',
  'if', 'so', 'then', 'as', 'by', 'with', 'from', 'into'
]);

// Words that favor expressive italic serif
const SERIF_ACCENT_CANDIDATES = new Set([
  'agar', 'creativity', 'update', 'karunga', 'creative', 'style', 'secret',
  'originality', 'think', 'sochte', 'focus', 'flow', 'magic', 'feel', 'love',
  'story', 'life', 'mind', 'idea', 'simple', 'fast', 'smart', 'smooth'
]);

interface WordDisplayMeta {
  word: string;
  cleanWord: string;
  category: 'hero' | 'serif' | 'connector';
  isYellowHighlight: boolean;
  start: number;
  end: number;
  isActive: boolean;
}

export const CreatorEditorialRenderer: React.FC<CreatorEditorialProps> = ({
  durationSeconds = 10,
  captions = [],
  mediaSrc,
  audioUrl,
  bgmUrl,
  transcriptText,
  overlayMediaUrl,
  positionZone = 'headroom',
  accentColor = '#FACC15', // Vibrant Electric Yellow from reference video
  textCase = 'natural',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTime = frame / fps;

  // 1. Flatten all words with timing
  const allWords: WordTiming[] = React.useMemo(() => {
    if (captions && captions.length > 0) {
      const flattened = captions.flatMap((c) => c.words || []);
      if (flattened.length > 0) return flattened;
    }
    // Fallback: build synthetic words from transcriptText if captions are not chunked
    if (transcriptText) {
      const rawWords = transcriptText.trim().split(/\s+/);
      const pacePerWord = Math.max(0.3, durationSeconds / Math.max(1, rawWords.length));
      return rawWords.map((w, idx) => ({
        word: w,
        start: idx * pacePerWord,
        end: (idx + 1) * pacePerWord,
      }));
    }
    return [
      { word: 'Agar', start: 0, end: 0.6 },
      { word: 'aap', start: 0.6, end: 1.0 },
      { word: 'AI', start: 1.0, end: 1.6 },
      { word: 'se', start: 1.6, end: 2.2 },
      { word: 'BADI', start: 2.3, end: 2.8 },
      { word: 'update', start: 2.8, end: 3.4 },
      { word: 'AAYI', start: 3.4, end: 4.0 },
      { word: 'hai', start: 4.0, end: 4.8 },
    ];
  }, [captions, transcriptText, durationSeconds]);

  // 2. Identify the active word and group into a 2-4 word rhythmic phrase
  const activeWordIndex = allWords.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );
  const currentActiveIdx = activeWordIndex !== -1 ? activeWordIndex : 0;
  const activeWordObj = allWords[currentActiveIdx];

  // Group phrases into short chunks (2 to 4 words)
  const phraseChunkSize = 3;
  const phraseStartIndex = Math.floor(currentActiveIdx / phraseChunkSize) * phraseChunkSize;
  const currentPhraseWords = allWords.slice(phraseStartIndex, phraseStartIndex + phraseChunkSize);

  // Phrase start time for spring entrance calculation
  const phraseStartTime = currentPhraseWords[0]?.start ?? 0;
  const phraseStartFrame = Math.round(phraseStartTime * fps);
  const framesSincePhraseStart = Math.max(0, frame - phraseStartFrame);

  // Snappy spring entrance physics
  const entranceSpring = spring({
    frame: framesSincePhraseStart,
    fps,
    config: {
      mass: 0.5,
      damping: 13,
      stiffness: 210,
    },
  });

  const entranceScale = interpolate(entranceSpring, [0, 1], [0.86, 1.0]);
  const entranceTranslateY = interpolate(entranceSpring, [0, 1], [18, 0]);
  const entranceOpacity = interpolate(framesSincePhraseStart, [0, 3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 3. Classify words in the phrase according to the Reference Video Design Formula
  const processedWords: WordDisplayMeta[] = React.useMemo(() => {
    if (!currentPhraseWords || currentPhraseWords.length === 0) return [];

    let hasYellowKeyword = false;

    return currentPhraseWords.map((w, idx) => {
      const clean = w.word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
      const lower = clean.toLowerCase();
      const isConnector = CONNECTOR_WORDS.has(lower) || clean.length <= 2;
      const isSerifCandidate = SERIF_ACCENT_CANDIDATES.has(lower);
      const isAllUppercase = clean.length > 1 && clean === clean.toUpperCase();

      let category: 'hero' | 'serif' | 'connector' = 'hero';
      let isYellow = false;

      if (isConnector && !isAllUppercase) {
        category = 'connector';
      } else if (isSerifCandidate || (!isAllUppercase && idx === 0 && clean.length > 3)) {
        category = 'serif';
      } else {
        category = 'hero';
      }

      // In the reference, top keywords like "AI", "ORIGINALITY", "MONETIZATION" receive the electric yellow accent
      if (
        (isAllUppercase || clean.length > 5 || lower === 'ai' || lower === 'viral') &&
        !hasYellowKeyword
      ) {
        isYellow = true;
        category = 'hero';
        hasYellowKeyword = true;
      }

      const isActive = currentTime >= w.start && currentTime <= w.end;

      return {
        word: w.word,
        cleanWord: clean,
        category,
        isYellowHighlight: isYellow,
        start: w.start,
        end: w.end,
        isActive,
      };
    });
  }, [currentPhraseWords, currentTime]);

  // Layout stacking lines:
  // If we have 2 words: [Word 1] on line 1, [Word 2] on line 2
  // If we have 3 words: [Word 1] on line 1, [Word 2, Word 3] on line 2 (or 3 lines)
  const line1 = processedWords.slice(0, 1);
  const line2 = processedWords.slice(1, 3);
  const line3 = processedWords.slice(3);

  // Adaptive Vertical Positioning
  // If an overlay media card is active in the top half, position text on the chest (70% top).
  // Otherwise, place text in the headroom (18% top), just above the speaker's face.
  const topPercent = overlayMediaUrl || positionZone === 'chest' ? '70%' : '18%';

  // Font family resolution
  const heroFont = LOADED_FONTS.Montserrat || 'Montserrat, Inter, sans-serif';
  const serifFont = LOADED_FONTS['Playfair Display'] || 'Playfair Display, Georgia, serif';
  const connectorFont = LOADED_FONTS.Inter || 'Inter, sans-serif';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#070B14',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. BACKGROUND LAYER: User's Speaking Video or Studio Backdrop ── */}
      {mediaSrc ? (
        <AbsoluteFill>
          <OffthreadVideo
            src={mediaSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle at 50% 30%, #151A26 0%, #080A10 70%, #030407 100%)',
          }}
        >
          {/* Subtle Studio Glow */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      )}

      {/* ── 2. TOP PICTURE-IN-PICTURE CARD (Floating Screen / B-Roll Overlay) ── */}
      {overlayMediaUrl && (
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '88%',
            aspectRatio: '16/9',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.25)',
            zIndex: 15,
          }}
        >
          <Img
            src={overlayMediaUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* ── 3. HYBRID KINETIC TYPOGRAPHY LOCKUP (Reference Style) ── */}
      <div
        style={{
          position: 'absolute',
          top: topPercent,
          left: '50%',
          transform: `translateX(-50%) translateY(${entranceTranslateY}px) scale(${entranceScale})`,
          opacity: entranceOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '92%',
          zIndex: 30,
          pointerEvents: 'none',
        }}
      >
        {/* Helper function to render a line of words */}
        {[line1, line2, line3].filter((line) => line.length > 0).map((line, lineIdx) => (
          <div
            key={`line-${lineIdx}`}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              gap: '12px',
              margin: '2px 0',
            }}
          >
            {line.map((item, wordIdx) => {
              // Exact typographic rules from reference video
              let font = heroFont;
              let fontSize = '82px';
              let fontWeight: string | number = 900;
              let fontStyle = 'normal';
              let color = '#FFFFFF';
              let textTransform: 'none' | 'uppercase' | 'lowercase' =
                textCase === 'uppercase' ? 'uppercase' : 'none';

              if (item.category === 'serif') {
                font = serifFont;
                fontSize = '78px';
                fontWeight = 700;
                fontStyle = 'italic';
                color = '#FFFFFF';
                textTransform = 'none'; // Flowing natural lowercase/title case for italic
              } else if (item.category === 'connector') {
                font = connectorFont;
                fontSize = '46px';
                fontWeight = 600;
                fontStyle = 'normal';
                color = '#FFFFFF';
                textTransform = 'none';
              } else {
                // Hero Keyword
                font = heroFont;
                fontSize = item.cleanWord.length > 8 ? '72px' : '84px';
                fontWeight = 900;
                textTransform = 'uppercase';
                color = item.isYellowHighlight ? accentColor : '#FFFFFF';
              }

              // Drop shadow for crisp contrast over both light and dark backgrounds
              const textShadow = item.isYellowHighlight
                ? '0 4px 20px rgba(0, 0, 0, 0.95), 0 0 25px rgba(250, 204, 21, 0.45)'
                : '0 4px 18px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.95)';

              // Active word micro-scale pulse
              const wordActiveScale = item.isActive ? 1.05 : 1.0;

              return (
                <span
                  key={`${item.word}-${wordIdx}`}
                  style={{
                    fontFamily: font,
                    fontSize,
                    fontWeight,
                    fontStyle,
                    color,
                    textTransform,
                    textShadow,
                    letterSpacing: item.category === 'hero' ? '0.02em' : '0.01em',
                    transform: `scale(${wordActiveScale})`,
                    transition: 'transform 0.1s ease-out',
                    lineHeight: 1.1,
                    display: 'inline-block',
                  }}
                >
                  {item.word}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── 4. AUDIO PLAYBACK ── */}
      {(mediaSrc || audioUrl) && (
        <Audio src={mediaSrc || audioUrl} volume={1} />
      )}
      {bgmUrl && (
        <Audio src={bgmUrl} volume={0.14} loop />
      )}
    </AbsoluteFill>
  );
};
