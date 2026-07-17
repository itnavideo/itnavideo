import { AbsoluteFill, Composition, OffthreadVideo, staticFile, useVideoConfig } from 'remotion';
import { SubtitleRenderer } from '../../components/SubtitleRenderer';
import type { CaptionSegment, SubtitleConfig } from '../../types/subtitles';
import { mapCaptionStyle, getCaptionFont } from '../../utils/captionStyleMap';

export type LongFormCaptionedVideoProps = {
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  captions?: CaptionSegment[];
  subtitleChunks?: CaptionSegment[];
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  fontSize?: SubtitleConfig['fontSize'];
  fontFamily?: string;
  showBackground?: boolean;
  language?: string;
};

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  return /^(https?:|data:|blob:)/i.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
};

const normalizeCaptions = (captions: CaptionSegment[], subtitleChunks?: CaptionSegment[]) => (
  (captions.length ? captions : subtitleChunks || [])
    .map((caption) => ({
      start: Number(caption.start ?? 0),
      end: Number(caption.end ?? (caption.start ?? 0) + 2.5),
      text: String(caption.text || ''),
      words: Array.isArray(caption.words)
        ? caption.words.map((word) => ({ word: String(word.word || ''), start: Number(word.start ?? 0), end: Number(word.end ?? 0) }))
        : undefined,
    }))
    .filter((caption) => caption.text.trim())
);

export function LongFormCaptionedVideo({
  mediaSrc = '',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  subtitleChunks,
  captionStyle = 'Studio Clean',
  captionPosition = 'bottom',
  textColor = '#FFFFFF',
  highlightColor = '#22D3EE',
  backgroundColor = '#0F172A',
  fontSize = 'large',
  fontFamily,
  showBackground = true,
  language = 'en',
}: LongFormCaptionedVideoProps) {
  const { fps } = useVideoConfig();
  const startFrom = Math.max(0, Math.round(mediaTrimStartSeconds * fps));
  const subtitleConfig: SubtitleConfig = {
    style: mapCaptionStyle(captionStyle),
    position: captionPosition,
    language,
    textColor,
    highlightColor,
    backgroundColor,
    fontSize,
    fontFamily: getCaptionFont(captionStyle, fontFamily),
    showBackground,
  };
  const resolvedMediaSrc = resolveMediaSrc(mediaSrc);

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
      {resolvedMediaSrc ? (
        <OffthreadVideo
          src={resolvedMediaSrc}
          startFrom={startFrom}
          volume={sourceAudioVolume}
          style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#020617' }}
        />
      ) : null}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, transparent 56%, rgba(2,6,23,0.52) 100%)' }} />
      <SubtitleRenderer captions={normalizeCaptions(captions, subtitleChunks)} config={subtitleConfig} />
    </AbsoluteFill>
  );
}

const defaultProps: LongFormCaptionedVideoProps = {
  mediaSrc: '',
  durationSeconds: 60,
  sourceDurationSeconds: 60,
  captionStyle: 'Studio Clean',
  captionPosition: 'bottom',
  textColor: '#FFFFFF',
  highlightColor: '#22D3EE',
  backgroundColor: '#0F172A',
  fontSize: 'large',
  showBackground: true,
  captions: [
    { start: 0, end: 2.5, text: 'Professional captions for your long-form video' },
    { start: 2.5, end: 5, text: 'Original video and audio stay intact' },
  ],
};

export const LongFormCaptionedVideoComposition = () => (
  <Composition
    id="LONG-FORM-CAPTIONED-VIDEO"
    component={LongFormCaptionedVideo}
    durationInFrames={1800}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const input = props as LongFormCaptionedVideoProps;
      const durationSeconds = Math.max(1, Math.min(600, Number(input.durationSeconds) || Number(input.sourceDurationSeconds) || 60));
      return { durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1920, height: 1080 };
    }}
  />
);
