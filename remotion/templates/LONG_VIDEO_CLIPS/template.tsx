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
import {BrandWatermark} from '../../components/BrandWatermark';

// ── Types ─────────────────────────────────────────────────────────────────────

type LongVideoClipsProps = {
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  aspectRatio?: '9:16' | '16:9' | '1:1';
  layoutMode?: 'auto-speaker' | 'split-screen' | 'fit-widescreen';
  headline?: string;
  showHeadline?: boolean;
  captions?: CaptionSegment[];
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontSize?: SubtitleConfig['fontSize'];
  fontFamily?: string;
  showBackground?: boolean;
  watermark?: boolean;
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

// ── Top Hook Headline Overlay ──────────────────────────────────────────────────

function HeadlineOverlay({
  headline,
  fontFamily,
  aspectRatio = '9:16',
}: {
  headline?: string;
  fontFamily?: string;
  aspectRatio?: '9:16' | '16:9' | '1:1';
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!headline || !headline.trim()) return null;

  const opacity = interpolate(frame, [0, Math.round(fps * 0.35)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, Math.round(fps * 0.35)], [-18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isWide = aspectRatio === '16:9';
  const isSquare = aspectRatio === '1:1';

  const rawText = headline.trim();
  const textLength = rawText.length;

  // Dynamic font sizing based on headline length to clamp strictly to max 2 lines
  let fontSize = isWide ? 26 : isSquare ? 28 : 32;
  if (textLength > 48) {
    fontSize = Math.round(fontSize * 0.74);
  } else if (textLength > 32) {
    fontSize = Math.round(fontSize * 0.85);
  }

  // Highlight key impact words or trailing emojis with Google Analytics Orange
  const words = rawText.split(/\s+/);
  const formattedHeadline = words.map((word, idx) => {
    const isEmojiOrLast = idx === words.length - 1 || /[\u{1F300}-\u{1F9FF}]/u.test(word);
    if (isEmojiOrLast && words.length > 2) {
      return (
        <span key={idx} style={{ color: '#FF9100' }}>
          {word}{' '}
        </span>
      );
    }
    return word + ' ';
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: isWide ? '4.5%' : isSquare ? '5%' : '6%',
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        width: isWide ? '75%' : '88%',
        maxWidth: 960,
        zIndex: 25,
        opacity,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(12, 12, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.65), 0 0 25px rgba(245, 158, 11, 0.22)',
          borderRadius: 16,
          padding: isWide ? '10px 22px' : '12px 24px',
          textAlign: 'center',
          maxHeight: 120,
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontFamily: resolveFont(fontFamily),
            fontSize,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.85)',
            lineHeight: 1.25,
            display: 'inline-block',
          }}
        >
          {formattedHeadline}
        </span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function LongVideoClips({
  mediaSrc = '',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  aspectRatio = '9:16',
  headline,
  showHeadline = true,
  captions = [],
  captionStyle = 'Studio Clean',
  captionPosition = 'bottom',
  textColor = '#ffffff',
  highlightColor = '#facc15',
  backgroundColor = '#18181B',
  fontSize = 'large',
  fontFamily,
  showBackground = true,
  layoutMode = 'auto-speaker',
  watermark = false,
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

  // Normalize captions safely without double-subtracting if timestamps are already clip-relative
  const normalizedCaptions = React.useMemo(() => {
    // If mediaTrimStartSeconds is set (> 2s) and any caption starts before mediaTrimStartSeconds,
    // the incoming captions are ALREADY zero-based / trimmed relative to clip start!
    const isAlreadyTrimmed =
      captions.length > 0 &&
      mediaTrimStartSeconds > 2 &&
      captions.some((c) => Number(c.start ?? 0) < mediaTrimStartSeconds - 0.5);

    const offset = isAlreadyTrimmed ? 0 : mediaTrimStartSeconds;

    return captions
      .map((c) => {
        const start = Number(c.start ?? 0) - offset;
        const end = Number(c.end ?? (c.start ?? 0) + 2) - offset;
        return {
          start,
          end,
          text: String(c.text || ''),
          words: Array.isArray(c.words)
            ? c.words.map((w) => ({
                word: String(w.word || ''),
                start: Number(w.start ?? 0) - offset,
                end: Number(w.end ?? 0) - offset,
              }))
            : undefined,
        };
      })
      .filter((c) => c.text.trim() && c.end >= 0);
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

  // Stable punch-in zoom across inter-word pauses to avoid rapid jumpy camera flickering
  const currentTime = frame / fps;
  const currentSegment = React.useMemo(() => {
    // 1. Check if currently inside a spoken segment
    const active = segmentsWithZoom.find((s) => currentTime >= s.start && currentTime <= s.end);
    if (active) return active;
    // 2. Look back up to 1.0s to bridge natural speech pauses between consecutive sentences
    const prev = [...segmentsWithZoom]
      .reverse()
      .find((s) => currentTime > s.end && currentTime - s.end <= 1.0);
    return prev;
  }, [segmentsWithZoom, currentTime]);

  const maxPunchIn = aspectRatio === '16:9' ? 1.06 : 1.15;
  const punchInZoom = currentSegment?.isZoomed ? maxPunchIn : 1.0;
  const slowZoom = 1 + (frame / Math.max(1, durationInFrames)) * 0.035;
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
      {/* 1. Split Screen Layout Mode (Top/Bottom Stacked 50/50) */}
      {resolvedSrc && layoutMode === 'split-screen' && (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
          {/* Top Half: Host / Speaker 1 (Optimized 32% vertical anchor for natural headroom) */}
          <div style={{ position: 'relative', width: '100%', height: '50%', overflow: 'hidden', borderBottom: '2px solid rgba(255, 109, 0, 0.4)' }}>
            <OffthreadVideo
              src={resolvedSrc}
              startFrom={videoStartFrom}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 32%',
                transform: `scale(${currentScale})`,
              }}
              volume={sourceAudioVolume}
            />
          </div>
          {/* Bottom Half: Guest / Speaker 2 (Optimized 68% vertical anchor for eye-line framing) */}
          <div style={{ position: 'relative', width: '100%', height: '50%', overflow: 'hidden' }}>
            <OffthreadVideo
              src={resolvedSrc}
              startFrom={videoStartFrom}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 68%',
                transform: `scale(${currentScale})`,
              }}
              volume={0}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* 2. Fit Widescreen Layout Mode (Original 16:9 padded with ambient blur) */}
      {resolvedSrc && layoutMode === 'fit-widescreen' && (
        <AbsoluteFill style={{ backgroundColor: '#070B14', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Ambient Blurred Background */}
          <AbsoluteFill style={{ filter: 'blur(28px) brightness(0.35)', transform: 'scale(1.25)' }}>
            <OffthreadVideo
              src={resolvedSrc}
              startFrom={videoStartFrom}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              volume={0}
            />
          </AbsoluteFill>
          {/* Foreground Widescreen Frame */}
          <div style={{ width: '100%', aspectRatio: '16/9', zIndex: 2, boxShadow: '0 20px 50px rgba(0,0,0,0.8)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <OffthreadVideo
              src={resolvedSrc}
              startFrom={videoStartFrom}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${currentScale})` }}
              volume={sourceAudioVolume}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* 3. Auto Speaker Dynamic Pan-and-Crop (Default) */}
      {resolvedSrc && (!layoutMode || layoutMode === 'auto-speaker') && (
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

      {/* Optional Top Hook Headline banner */}
      {showHeadline && (
        <HeadlineOverlay headline={headline} fontFamily={fontFamily} aspectRatio={aspectRatio} />
      )}

      {/* Captions */}
      <SubtitleRenderer captions={normalizedCaptions} config={subtitleConfig} />

      {/* Universal Anti-Crop Watermark for Free Plan */}
      <BrandWatermark watermark={watermark} isLandscape={aspectRatio === '16:9'} />
    </AbsoluteFill>
  );
}

// ── Composition ───────────────────────────────────────────────────────────────

const defaultProps: LongVideoClipsProps = {
  mediaSrc: '',
  mediaTrimStartSeconds: 0,
  sourceAudioVolume: 1,
  durationSeconds: 30,
  aspectRatio: '9:16',
  headline: '',
  showHeadline: true,
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
      const dur = Math.max(
        8,
        Math.min(
          60,
          Number(p.durationSeconds) ||
            Number(p.sourceDurationSeconds) ||
            Number(p.renderWindowSeconds) ||
            30
        )
      );

      let width = 1080;
      let height = 1920;
      if (p.aspectRatio === '16:9') {
        width = 1920;
        height = 1080;
      } else if (p.aspectRatio === '1:1') {
        width = 1080;
        height = 1080;
      }

      return {
        durationInFrames: secondsToFrames(dur, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width,
        height,
      };
    }}
  />
);
