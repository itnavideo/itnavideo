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
  const { fps } = useVideoConfig();
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
  const normalizedCaptions = captions
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

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      {/* Full-screen video clip */}
      {resolvedSrc && (
        <OffthreadVideo
          src={resolvedSrc}
          startFrom={videoStartFrom}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          volume={sourceAudioVolume}
        />
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
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as LongVideoClipsProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return { durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920 };
    }}
  />
);
