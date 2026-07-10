import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from 'remotion';
import {SubtitleRenderer} from '../../components/SubtitleRenderer';
import type {CaptionSegment, SubtitleConfig} from '../../types/subtitles';
import {SUBTITLE_PRESETS} from '../../types/subtitles';
import {resolveFont} from '../../utils/fonts';

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
};

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

function mapCaptionStyle(style?: string): SubtitleConfig['style'] {
  const map: Record<string, SubtitleConfig['style']> = {
    yellowPop: 'highlight',
    clean: 'normal',
    cleanSubtitle: 'normal',
    blackBox: 'box',
    bold: 'big-bold',
    minimal: 'normal',
    classic: 'box',
    highlight: 'highlight',
    normal: 'normal',
    neon: 'neon',
    box: 'box',
    'big-bold': 'big-bold',
    'word-pop': 'word-pop',
    'split-color': 'split-color',
    typewriter: 'typewriter',
    'bold-outline': 'bold-outline',
    'one-word': 'one-word',
    'gold-pill': 'gold-pill',
    stacked: 'stacked',
    'inline-bg': 'inline-bg',
    vollkorn: 'vollkorn',
    Eclipse: 'highlight',
    Hustle: 'bold-outline',
    Marigold: 'normal',
    'Gold Pill': 'gold-pill',
    Midnight: 'inline-bg',
    'Arctic Glow': 'neon',
    'Studio Clean': 'stacked',
    'One Word': 'one-word',
    Vollkorn: 'vollkorn',
    'Pop Candy': 'box',
    Typewriter: 'typewriter',
    'Bold Fire': 'big-bold',
    'Karaoke Fill': 'karaoke',
    'Shorts Karaoke': 'shorts-karaoke',
    'Reels Clean': 'reels-clean',
    'Bold Highlight Strip': 'bold-highlight-strip',
    'Shatter Drop': 'shatter',
    'Pill Bounce': 'pill-bounce',
    Cinematic: 'cinematic',
    'Hacker Type': 'typewriter-code',
    'Marker Highlight': 'marker-highlight',
    'Floating Serif': 'floating-serif',
    'Metallic Gradient': 'metallic-gradient',
    'Neon Pulse': 'neon-pulse',
    'Minimal Fade': 'minimal-fade',
    'Gradient Wave': 'gradient-wave',
    'Retro VHS': 'retro-vhs',
    'Handwritten': 'handwritten',
    'Glass Blur': 'glass-blur',
    karaoke: 'karaoke',
    'shorts-karaoke': 'shorts-karaoke',
    'reels-clean': 'reels-clean',
    'bold-highlight-strip': 'bold-highlight-strip',
    shatter: 'shatter',
    'pill-bounce': 'pill-bounce',
    cinematic: 'cinematic',
    'typewriter-code': 'typewriter-code',
    'marker-highlight': 'marker-highlight',
    'floating-serif': 'floating-serif',
    'metallic-gradient': 'metallic-gradient',
    'neon-pulse': 'neon-pulse',
    'minimal-fade': 'minimal-fade',
    'gradient-wave': 'gradient-wave',
    'retro-vhs': 'retro-vhs',
    'handwritten': 'handwritten',
    'glass-blur': 'glass-blur',
  };
  return map[style || ''] || 'stacked';
}

function getCaptionFont(styleOrPreset?: string, selectedFont?: string): string {
  if (selectedFont) return resolveFont(selectedFont);
  const preset = styleOrPreset ? SUBTITLE_PRESETS[styleOrPreset] : undefined;
  return resolveFont(preset?.fontFamily || 'Inter, sans-serif');
}

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
    durationInFrames={1800}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as AutoCaptionProps;
      const durationSeconds = Math.max(5, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 60
      ));
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
