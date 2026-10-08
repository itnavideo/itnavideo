/**
 * AUTO_CAPTION_GENERATOR
 * Production-grade Professional Motion Caption Engine ($49+ Tier)
 * Supports 9:16 Vertical Reels/Shorts and 16:9 Landscape YouTube Videos.
 * Features:
 * - 10 Dedicated Motion Design Systems (Dynamic Punch, Studio Clean, Karaoke Pro, Neon Kinetic, etc.)
 * - Parametric Remotion Spring Physics (mass, damping, stiffness, overshoot, whip exits)
 * - Optical Line Balancing & Safe Zone Clamping
 * - Full backward-compatibility with legacy SubtitleConfig
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { MotionCaptionRenderer } from '../../components/MotionCaptionRenderer';
import { SubtitleRenderer } from '../../components/SubtitleRenderer';
import type { CaptionSegment, SubtitleConfig } from '../../types/subtitles';
import type { CaptionEvent, TranscriptDocument } from '../../../lib/captions/types';
import { planCaptionEvents } from '../../../lib/captions/eventPlanner';
import { createTranscriptDocument } from '../../../lib/captions/transcriptAlignment';
import { mapCaptionStyle, getCaptionFont, CAPTION_STYLE_MAP } from '../../utils/captionStyleMap';
import { BrandWatermark } from '../../components/BrandWatermark';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';

export type AutoCaptionGeneratorProps = {
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  captions?: CaptionSegment[];
  subtitleChunks?: CaptionSegment[];
  captionEvents?: CaptionEvent[];
  transcriptDocument?: TranscriptDocument;
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  activeWordColor?: string;
  backgroundColor?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  language?: string;
  subtitleOutputLanguage?: string;
  fontSize?: SubtitleConfig['fontSize'];
  fontFamily?: string;
  showBackground?: boolean;
  watermark?: boolean;
  wordClickSound?: boolean;
  captionEmphasisAnimation?: 'bounce' | 'glow' | 'none';
  youtubeSubtitleSafeZone?: 'standard' | 'scrubber' | 'high';
  youtubeSubtitleCase?: 'natural' | 'uppercase';
};

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

function normalizeCaptions(
  captions: CaptionSegment[],
  subtitleChunks?: CaptionSegment[],
  casing: 'natural' | 'uppercase' = 'natural'
): CaptionSegment[] {
  return (captions.length > 0 ? captions : subtitleChunks || [])
    .map((caption) => {
      const rawText = String(caption.text || '');
      const text = casing === 'uppercase' ? rawText.toUpperCase() : rawText;
      const words = Array.isArray(caption.words)
        ? caption.words.map((word) => ({
            word: casing === 'uppercase' ? String(word.word || '').toUpperCase() : String(word.word || ''),
            start: Number(word.start ?? 0),
            end: Number(word.end ?? 0),
          }))
        : undefined;

      return {
        start: Number(caption.start ?? 0),
        end: Number(caption.end ?? (caption.start ?? 0) + 2.5),
        text,
        words,
      };
    })
    .filter((caption) => caption.text.trim());
}

export function AutoCaptionGenerator({
  mediaSrc,
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  subtitleChunks,
  captionEvents,
  transcriptDocument,
  captionStyle = 'Studio Clean',
  captionPosition = 'bottom',
  textColor,
  highlightColor,
  activeWordColor,
  backgroundColor,
  fontSize = 'medium',
  fontFamily,
  showBackground,
  language = 'en',
  subtitleOutputLanguage,
  durationSeconds = 60,
  watermark = false,
  wordClickSound = false,
  captionEmphasisAnimation = 'bounce',
  youtubeSubtitleSafeZone = 'scrubber',
  youtubeSubtitleCase = 'natural',
}: AutoCaptionGeneratorProps) {
  const { width, height } = useVideoConfig();
  const resolvedSrc = resolveMediaSrc(mediaSrc);
  const normalizedCaptions = normalizeCaptions(captions, subtitleChunks, youtubeSubtitleCase);
  const activeHighlight = highlightColor || activeWordColor;
  const isLandscape = width > height;
  const isAudioOnly = mediaType === 'audio' || /\.(mp3|wav|m4a|aac|ogg|flac)($|\?)/i.test(resolvedSrc);

  // Resolve or plan structured CaptionEvents (Memoized to avoid per-frame overhead during rendering)
  const resolvedCaptionEvents: CaptionEvent[] = React.useMemo(() => {
    if (captionEvents && captionEvents.length > 0) return captionEvents;
    if (!transcriptDocument && normalizedCaptions.length === 0) return [];

    // Flatten words from normalized captions or transcriptDocument
    const allWords: Array<{ word: string; start: number; end: number }> = [];
    let fullText = '';

    if (transcriptDocument && transcriptDocument.words.length > 0) {
      allWords.push(...transcriptDocument.words);
      fullText = transcriptDocument.editedTranscript || transcriptDocument.rawTranscript;
    } else {
      for (const cap of normalizedCaptions) {
        if (cap.words && cap.words.length > 0) {
          allWords.push(...cap.words);
        } else {
          // Approximate word breakdown if missing
          const split = cap.text.trim().split(/\s+/);
          const perWord = (cap.end - cap.start) / Math.max(1, split.length);
          split.forEach((w, i) => {
            allWords.push({
              word: w,
              start: cap.start + i * perWord,
              end: cap.start + (i + 1) * perWord,
            });
          });
        }
      }
      fullText = normalizedCaptions.map((c) => c.text).join(' ');
    }

    const doc = transcriptDocument || createTranscriptDocument(fullText, allWords, durationSeconds, language);

    const anchorPos =
      captionPosition === 'top'
        ? 'top-center'
        : captionPosition === 'center'
        ? 'center'
        : 'bottom-center';

    return planCaptionEvents(doc, {
      styleName: captionStyle,
      canvasWidth: width,
      canvasHeight: height,
      anchorPosition: anchorPos,
      customTextColor: textColor,
      customHighlightColor: activeHighlight,
      customBackgroundColor: backgroundColor,
      customFontFamily: fontFamily,
      customFontSize: fontSize,
    });
  }, [
    captionEvents,
    transcriptDocument,
    normalizedCaptions,
    durationSeconds,
    language,
    captionPosition,
    captionStyle,
    width,
    height,
    textColor,
    activeHighlight,
    backgroundColor,
    fontFamily,
    fontSize,
  ]);

  // Click/pop audio frames on word transitions when wordClickSound is enabled (with 120ms debounce gap)
  const clickFrames = React.useMemo(() => {
    if (!wordClickSound) return [];
    const minFrameGap = Math.ceil(0.12 * DEFAULT_FPS); // Enforce 120ms minimum gap
    const rawFrames: number[] = [];
    normalizedCaptions.forEach((cap) => {
      if (cap.words && cap.words.length > 0) {
        cap.words.forEach((w) => {
          const f = Math.round(w.start * DEFAULT_FPS);
          if (f >= 0) rawFrames.push(f);
        });
      } else {
        const f = Math.round(cap.start * DEFAULT_FPS);
        if (f >= 0) rawFrames.push(f);
      }
    });

    rawFrames.sort((a, b) => a - b);
    const debouncedFrames: number[] = [];
    let lastFrame = -999;
    for (const f of rawFrames) {
      if (f - lastFrame >= minFrameGap) {
        debouncedFrames.push(f);
        lastFrame = f;
      }
    }
    return debouncedFrames.slice(0, 100);
  }, [wordClickSound, normalizedCaptions]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Background Media / Video or Audio Layer */}
      {resolvedSrc ? (
        isAudioOnly ? (
          <>
            <Audio
              src={resolvedSrc}
              startFrom={Math.round(mediaTrimStartSeconds * DEFAULT_FPS)}
              volume={sourceAudioVolume}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, #1e1b4b 0%, #09090b 100%)',
              }}
            />
          </>
        ) : (
          <OffthreadVideo
            src={resolvedSrc}
            startFrom={Math.round(mediaTrimStartSeconds * DEFAULT_FPS)}
            volume={sourceAudioVolume}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )
      ) : null}

      {/* Modern High-Performance Motion Caption or Subtitle Preset Layer */}
      {captionEvents && captionEvents.length > 0 ? (
        <MotionCaptionRenderer captionEvents={captionEvents} />
      ) : captionStyle && CAPTION_STYLE_MAP[captionStyle] && normalizedCaptions.length > 0 ? (
        <SubtitleRenderer
          captions={normalizedCaptions}
          config={{
            position: captionPosition || 'bottom',
            style: mapCaptionStyle(captionStyle).style,
            fontSize: fontSize || 'medium',
            fontFamily: getCaptionFont(captionStyle, fontFamily),
            textColor: textColor || undefined,
            highlightColor: activeHighlight || undefined,
            backgroundColor: backgroundColor || undefined,
            showBackground: typeof showBackground === 'boolean' ? showBackground : undefined,
            language: subtitleOutputLanguage || language || 'en',
          }}
        />
      ) : resolvedCaptionEvents.length > 0 ? (
        <MotionCaptionRenderer captionEvents={resolvedCaptionEvents} />
      ) : normalizedCaptions.length > 0 ? (
        <SubtitleRenderer
          captions={normalizedCaptions}
          config={{
            position: captionPosition || 'bottom',
            style: mapCaptionStyle(captionStyle).style,
            fontSize: fontSize || 'medium',
            fontFamily: getCaptionFont(captionStyle, fontFamily),
            textColor: textColor || undefined,
            highlightColor: activeHighlight || undefined,
            backgroundColor: backgroundColor || undefined,
            showBackground: typeof showBackground === 'boolean' ? showBackground : undefined,
            language: subtitleOutputLanguage || language || 'en',
          }}
        />
      ) : null}

      {/* Dynamic Word Pop / Click Sound Effect */}
      {wordClickSound && clickFrames.length > 0
        ? clickFrames.map((f, idx) => (
            <Sequence key={`click-${idx}`} from={f} durationInFrames={10} layout="none">
              <Audio src="https://storage.googleapis.com/itnavideo-media-assets/click_aydqtp.mp3" volume={0.25} />
            </Sequence>
          ))
        : null}

      {/* Universal Anti-Crop Watermark for Free Plan */}
      <BrandWatermark watermark={watermark} isLandscape={isLandscape} />
    </AbsoluteFill>
  );
}

export const AutoCaptionGeneratorComposition = () => {
  return (
    <>
      {/* 9:16 Vertical Reel (Default) */}
      <Composition
        id="AUTO-CAPTION-GENERATOR"
        component={AutoCaptionGenerator}
        durationInFrames={secondsToFrames(60)}
        fps={DEFAULT_FPS}
        width={1080}
        height={1920}
        defaultProps={{
          mediaSrc: '',
          captionStyle: 'Studio Clean',
          captionPosition: 'bottom',
          fontSize: 'medium',
          captions: [],
        }}
        calculateMetadata={({ props }) => {
          const p = props as AutoCaptionGeneratorProps;
          const dur = Math.max(
            3,
            Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 60
          );
          return {
            durationInFrames: secondsToFrames(dur, DEFAULT_FPS),
            fps: DEFAULT_FPS,
            width: 1080,
            height: 1920,
          };
        }}
      />
      {/* 16:9 Landscape YouTube Widescreen */}
      <Composition
        id="AUTO-CAPTION-GENERATOR-LANDSCAPE"
        component={AutoCaptionGenerator}
        durationInFrames={secondsToFrames(60)}
        fps={DEFAULT_FPS}
        width={1920}
        height={1080}
        defaultProps={{
          mediaSrc: '',
          captionStyle: 'Warikoo Black Card',
          captionPosition: 'bottom',
          fontSize: 'medium',
          captions: [],
        }}
        calculateMetadata={({ props }) => {
          const p = props as AutoCaptionGeneratorProps;
          const dur = Math.max(
            3,
            Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 60
          );
          return {
            durationInFrames: secondsToFrames(dur, DEFAULT_FPS),
            fps: DEFAULT_FPS,
            width: 1920,
            height: 1080,
          };
        }}
      />
    </>
  );
};
