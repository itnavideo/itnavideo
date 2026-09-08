import React from 'react';
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {SubtitleRenderer} from '../../components/SubtitleRenderer';
import type {CaptionSegment, SubtitleConfig} from '../../types/subtitles';
import {SUBTITLE_PRESETS} from '../../types/subtitles';
import {DEFAULT_FPS, secondsToFrames} from '../../constants';

// ── Types ─────────────────────────────────────────────────────────────────────

type LongVideoClipsProps = {
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  captions?: CaptionSegment[];
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontSize?: SubtitleConfig['fontSize'];
  fontFamily?: string;
  showBackground?: boolean;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

function resolveFont(font?: string): string {
  return font || 'Inter, system-ui, sans-serif';
}

function mapStyle(style?: string): SubtitleConfig['style'] {
  const map: Record<string, SubtitleConfig['style']> = {
    'Studio Clean': 'stacked',
    'Karaoke Fill': 'karaoke',
    'One Word': 'one-word',
    'Bold Fire': 'big-bold',
    'Shorts Karaoke': 'shorts-karaoke',
    'Eclipse': 'highlight',
    'Hustle': 'bold-outline',
    karaoke: 'karaoke',
    stacked: 'stacked',
    'one-word': 'one-word',
    'big-bold': 'big-bold',
    highlight: 'highlight',
  };
  return map[style || ''] || 'stacked';
}

// ── Main Component ────────────────────────────────────────────────────────────

function LongVideoClips({
  mediaSrc = '',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  captions = [],
  captionStyle = 'Studio Clean',
  captionPosition = 'bottom',
  textColor = '#ffffff',
  highlightColor = '#facc15',
  backgroundColor = '#18181B',
  fontSize = 'large',
  fontFamily,
  showBackground = true,
}: LongVideoClipsProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const videoStartFrom = Math.max(0, Math.round(mediaTrimStartSeconds * fps));

  const subtitleConfig: SubtitleConfig = {
    style: mapStyle(captionStyle),
    position: captionPosition,
    language: 'en',
    textColor,
    highlightColor,
    backgroundColor,
    fontSize,
    fontFamily: resolveFont(fontFamily),
    showBackground,
  };

  // Normalize captions
  const normalizedCaptions = React.useMemo(() => {
    return captions
      .map((c) => ({
        start: Number(c.start ?? 0) - mediaTrimStartSeconds,
        end: Number(c.end ?? (c.start ?? 0) + 2) - mediaTrimStartSeconds,
        text: String(c.text || ''),
        words: Array.isArray(c.words)
          ? c.words.map((w) => ({
              word: String(w.word || ''),
              start: Number(w.start ?? 0) - mediaTrimStartSeconds,
              end: Number(w.end ?? 0) - mediaTrimStartSeconds,
            }))
          : undefined,
      }))
      .filter((c) => c.text.trim() && c.start >= 0);
  }, [captions, mediaTrimStartSeconds]);

  // Assign punch-in zoom level to caption segments to create a dynamic jump-cut effect
  const segmentsWithZoom = React.useMemo(() => {
    let isZoomed = false;
    return normalizedCaptions.map((cap, idx) => {
      const text = cap.text.trim();
      const endsSentence = /[.!?]$/.test(text);
      if (endsSentence || idx % 2 === 0) {
        isZoomed = !isZoomed;
      }
      return {
        ...cap,
        isZoomed,
      };
    });
  }, [normalizedCaptions]);

  // Calculate current scale from jump-cuts and a slow continuous camera drift
  const currentTime = frame / fps;
  const activeSegment = segmentsWithZoom.find(s => currentTime >= s.start && currentTime <= s.end);
  const punchInZoom = activeSegment?.isZoomed ? 1.18 : 1.0;
  const slowZoom = 1 + (frame / Math.max(1, durationInFrames)) * 0.04;
  const currentScale = punchInZoom * slowZoom;

  // Cinematic fade transitions
  const transitionOpacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [1, 0, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* Full-screen reframed video clip with pan/zoom scale */}
      {resolvedSrc && (
        <OffthreadVideo
          src={resolvedSrc}
          startFrom={videoStartFrom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${currentScale})`,
          }}
          volume={sourceAudioVolume}
        />
      )}

      {/* Cinematic start/end fade-to-black overlay */}
      {transitionOpacity > 0 && (
        <AbsoluteFill style={{ backgroundColor: '#000', opacity: transitionOpacity, pointerEvents: 'none', zIndex: 9 }} />
      )}

      {/* Captions */}
      <SubtitleRenderer captions={normalizedCaptions} config={subtitleConfig} />
    </AbsoluteFill>
  );
}

// ── Composition ───────────────────────────────────────────────────────────────

const defaultProps: LongVideoClipsProps = {
  mediaSrc: '',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  durationSeconds: 30,
  captionStyle: 'Studio Clean',
  captionPosition: 'bottom',
  textColor: '#ffffff',
  highlightColor: '#facc15',
  backgroundColor: '#18181B',
  fontSize: 'large',
  showBackground: true,
  captions: [
    { start: 0, end: 3, text: 'This is a clip from a longer video' },
    { start: 3, end: 6, text: 'AI picked the best moments' },
  ],
};

export { LongVideoClips };

export const LongVideoClipsComposition = () => (
  <Composition
    id="LONG-VIDEO-CLIPS"
    component={LongVideoClips}
    durationInFrames={secondsToFrames(30, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as LongVideoClipsProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return { durationInFrames: secondsToFrames(dur, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920 };
    }}
  />
);
