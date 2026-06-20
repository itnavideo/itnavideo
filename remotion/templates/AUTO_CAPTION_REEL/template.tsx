import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {SubtitleRenderer} from '../../components/SubtitleRenderer';
import type {CaptionSegment, SubtitleConfig} from '../../types/subtitles';
import {SUBTITLE_PRESETS} from '../../types/subtitles';
import {resolveFont, getFontForLanguage} from '../../utils/fonts';

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
  topicTitle?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  language?: string;
  subtitleOutputLanguage?: string;
  fontSize?: SubtitleConfig['fontSize'];
  showBackground?: boolean;
};

// Map dashboard style/preset names to SubtitleRenderer styles
function mapCaptionStyle(style?: string): SubtitleConfig['style'] {
  const map: Record<string, SubtitleConfig['style']> = {
    // Legacy names
    yellowPop: 'highlight',
    clean: 'normal',
    blackBox: 'box',
    bold: 'big-bold',
    minimal: 'normal',
    classic: 'box',
    // Direct style keys
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
    none: 'none',
    // Named presets → style
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
  };
  return map[style || ''] || 'highlight';
}

// Get font family from preset name or style key
function getPresetFont(styleOrPreset?: string): string {
  if (!styleOrPreset) return resolveFont('Inter');
  const preset = SUBTITLE_PRESETS[styleOrPreset];
  if (preset) return resolveFont(preset.fontFamily);
  return resolveFont('Inter');
}

function AutoCaptionReel({
  mediaSrc,
  mediaType = 'video',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  subtitleChunks,
  captionStyle = 'yellowPop',
  captionPosition = 'bottom',
  textColor = '#ffffff',
  highlightColor = '#facc15',
  language,
  subtitleOutputLanguage,
  fontSize = 'medium',
  showBackground = true,
}: AutoCaptionProps) {
  const {fps} = useVideoConfig();

  // Language: use 'language' prop OR 'subtitleOutputLanguage' (what route actually sends)
  const captionLanguage = language || subtitleOutputLanguage || 'en';

  // Merge captions + subtitleChunks (fallback prop name from route)
  const captionData: CaptionSegment[] = (captions.length > 0 ? captions : (subtitleChunks || []))
    .map((c) => ({
      start: Number(c.start ?? 0),
      end: Number(c.end ?? (c.start ?? 0) + 2.5),
      text: String(c.text || ''),
      words: Array.isArray(c.words) ? c.words.map((w) => ({word: String(w.word || ''), start: Number(w.start ?? 0), end: Number(w.end ?? 0)})) : undefined,
    }))
    .filter((c) => c.text);

  const subtitleConfig: SubtitleConfig = {
    style: mapCaptionStyle(captionStyle),
    position: captionPosition,
    language: captionLanguage,
    textColor,
    highlightColor,
    fontSize,
    fontFamily: getPresetFont(captionStyle),
    showBackground,
  };

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Premium video frame with padding */}
      <div style={{
        position: 'absolute', inset: 12,
        borderRadius: 24,
        overflow: 'hidden',
        border: '3px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)',
      }}>
        {/* Full-screen video */}
        {mediaSrc && mediaType === 'video' ? (
          <OffthreadVideo
            src={mediaSrc}
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            volume={sourceAudioVolume}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(180deg, #111 0%, #000 100%)',
            color: 'rgba(255,255,255,0.2)', fontSize: 36, fontWeight: 800,
          }}>
            YOUR REEL VIDEO
          </div>
        )}

        {/* Premium vignette — stronger at bottom for caption readability */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
          background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 20%, transparent 40%, transparent 80%, rgba(0,0,0,0.15) 100%)',
        }} />

        {/* Subtle top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          borderRadius: 2, zIndex: 6,
        }} />
      </div>

      {/* Shared SubtitleRenderer — positioned over the frame */}
      <SubtitleRenderer captions={captionData} config={subtitleConfig} />
    </AbsoluteFill>
  );
}

const defaultProps: AutoCaptionProps = {
  mediaType: 'video',
  mediaSrc: '',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  captionStyle: 'yellowPop',
  captionPosition: 'bottom',
  textColor: '#ffffff',
  highlightColor: '#facc15',
  durationSeconds: 30,
  sourceDurationSeconds: 30,
  language: 'en',
  fontSize: 'medium',
  showBackground: true,
  captions: [
    {start: 0, end: 3, text: 'Upload your reel video here'},
    {start: 3, end: 6, text: 'Subtitles will appear like this'},
    {start: 6, end: 9, text: 'Auto captions sync with speech'},
  ],
};

export const AutoCaptionReelComposition = () => (
  <Composition
    id="AUTO-CAPTION-REEL"
    component={AutoCaptionReel}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as AutoCaptionProps;
      const durationSeconds = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return {durationInFrames: Math.ceil(durationSeconds * 30), fps: 30, width: 1080, height: 1920};
    }}
  />
);
