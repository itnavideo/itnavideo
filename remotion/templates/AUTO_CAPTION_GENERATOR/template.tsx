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
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from 'remotion';
import { MotionCaptionRenderer } from '../../components/MotionCaptionRenderer';
import { SubtitleRenderer } from '../../components/SubtitleRenderer';
import type { CaptionSegment, SubtitleConfig } from '../../types/subtitles';
import type { CaptionEvent, TranscriptDocument } from '../../../lib/captions/types';
import { planCaptionEvents } from '../../../lib/captions/eventPlanner';
import { createTranscriptDocument } from '../../../lib/captions/transcriptAlignment';
import { mapCaptionStyle, getCaptionFont } from '../../utils/captionStyleMap';
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
};

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

function normalizeCaptions(captions: CaptionSegment[], subtitleChunks?: CaptionSegment[]): CaptionSegment[] {
  return (captions.length > 0 ? captions : subtitleChunks || [])
    .map((caption) => ({
      start: Number(caption.start ?? 0),
      end: Number(caption.end ?? (caption.start ?? 0) + 2.5),
      text: String(caption.text || ''),
      words: Array.isArray(caption.words)
        ? caption.words.map((word) => ({
            word: String(word.word || ''),
            start: Number(word.start ?? 0),
            end: Number(word.end ?? 0),
          }))
        : undefined,
    }))
    .filter((caption) => caption.text.trim());
}

export function AutoCaptionGenerator({
  mediaSrc,
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
}: AutoCaptionGeneratorProps) {
  const { width, height } = useVideoConfig();
  const resolvedSrc = resolveMediaSrc(mediaSrc);
  const normalizedCaptions = normalizeCaptions(captions, subtitleChunks);
  const activeHighlight = highlightColor || activeWordColor;
  const isLandscape = width > height;

  // Resolve or plan structured CaptionEvents
  let resolvedCaptionEvents: CaptionEvent[] = captionEvents || [];

  if (resolvedCaptionEvents.length === 0 && (transcriptDocument || normalizedCaptions.length > 0)) {
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

    resolvedCaptionEvents = planCaptionEvents(doc, {
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
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Background Media / Video Layer */}
      {resolvedSrc ? (
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
      ) : null}

      {/* Modern High-Performance Motion Caption Layer */}
      {resolvedCaptionEvents.length > 0 ? (
        <MotionCaptionRenderer captionEvents={resolvedCaptionEvents} />
      ) : normalizedCaptions.length > 0 ? (
        <SubtitleRenderer
          captions={normalizedCaptions}
          config={{
            position: captionPosition || 'bottom',
            style: mapCaptionStyle(captionStyle),
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

      {/* Watermark for free trial renders if enabled */}
      {watermark ? (
        <div
          style={{
            position: 'absolute',
            bottom: isLandscape ? 24 : 40,
            right: isLandscape ? 28 : 40,
            padding: '6px 14px',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            borderRadius: 9999,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: isLandscape ? 13 : 15,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            zIndex: 50,
          }}
        >
          Made with Itnavideo
        </div>
      ) : null}
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
          captionStyle: 'Studio Clean',
          captionPosition: 'bottom',
          fontSize: 'medium',
          captions: [],
        }}
      />
    </>
  );
};
