import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from 'remotion';
import {SubtitleRenderer} from '../../components/SubtitleRenderer';
import type {CaptionSegment, SubtitleConfig} from '../../types/subtitles';
import {mapCaptionStyle, getCaptionFont} from '../../utils/captionStyleMap';

type AutoCaptionProps = {
  mediaSrc?: string;
  mediaType?: 'video' | 'audio';
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

function normalizeCaptions(captions: CaptionSegment[], subtitleChunks?: CaptionSegment[]) {
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

function AutoCaptionReel({
  mediaSrc,
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  subtitleChunks,
  captionStyle = 'Studio Clean',
  captionPosition = 'bottom',
  textColor = '#ffffff',
  highlightColor = '#facc15',
  backgroundColor = '#18181B',
  language,
  subtitleOutputLanguage,
  fontSize = 'medium',
  fontFamily,
  showBackground = true,
  watermark = false,
}: AutoCaptionProps) {
  const {fps} = useVideoConfig();
  const captionData = normalizeCaptions(captions, subtitleChunks);
  const captionLanguage = language || subtitleOutputLanguage || 'en';
  const videoStartFrom = Math.max(0, Math.round(mediaTrimStartSeconds * fps));
  const resolvedMediaSrc = resolveMediaSrc(mediaSrc);

  const subtitleConfig: SubtitleConfig = {
    style: mapCaptionStyle(captionStyle),
    position: captionPosition,
    language: captionLanguage,
    textColor,
    highlightColor,
    backgroundColor,
    fontSize,
    fontFamily: getCaptionFont(captionStyle, fontFamily),
    showBackground,
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      {resolvedMediaSrc && mediaType === 'video' ? (
        <OffthreadVideo
          src={resolvedMediaSrc}
          startFrom={videoStartFrom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          volume={sourceAudioVolume}
        />
      ) : (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          Upload a video to add captions
        </AbsoluteFill>
      )}

      <SubtitleRenderer captions={captionData} config={subtitleConfig} />

      {watermark ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            bottom: 40,
            padding: '14px 24px',
            borderRadius: 999,
            background: 'rgba(11,17,32,0.78)',
            border: '1px solid rgba(255,255,255,0.16)',
            color: '#F8FAFC',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            pointerEvents: 'none',
            zIndex: 5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 3,
              background: '#22D3EE',
            }}
          />
          Made with itnavideo
          <span style={{opacity: 0.55, fontWeight: 500, marginLeft: 2}}>· Free trial</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

const defaultProps: AutoCaptionProps = {
  mediaType: 'video',
  mediaSrc: '',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  captionStyle: 'Studio Clean',
  captionPosition: 'bottom',
  textColor: '#ffffff',
  highlightColor: '#facc15',
  backgroundColor: '#18181B',
  durationSeconds: 60,
  sourceDurationSeconds: 60,
  language: 'en',
  fontSize: 'medium',
  fontFamily: 'Inter, sans-serif',
  showBackground: true,
  watermark: false,
  captions: [
    {start: 0, end: 3, text: 'Upload your reel video here'},
    {start: 3, end: 6, text: 'Subtitles will appear like this'},
    {start: 6, end: 9, text: 'Auto captions sync with speech'},
  ],
};

export {AutoCaptionReel};

export const AutoCaptionReelComposition = () => (
  <Composition
    id="AUTO-CAPTION-REEL"
    component={AutoCaptionReel}
    durationInFrames={2700}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as AutoCaptionProps;
      const durationSeconds = Math.max(5, Math.min(90,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 90
      ));
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
