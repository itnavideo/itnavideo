import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock } from '../../components/PremiumAudioLayer';
import { PremiumVisualTreatment, type PremiumVisualStyleLock } from '../../components/PremiumVisualTreatment';
import type { CaptionSegment, SubtitleConfig } from '../../types/subtitles';
import type { KineticPhrase, TypographyHighlightType, TypographyAnimationPreset, TypographyWord } from '../../../lib/typography/types';
import { getStyleBlueprint } from '../../../lib/typography/styleRegistry';
import { TypographyStyleRenderer } from './primitives';
import { FONTS, TypographyFontStyles } from './shared/fonts';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';

export type { KineticPhrase, TypographyHighlightType, TypographyAnimationPreset, TypographyWord };

// ── Bounding Box & Subject Segmentation Types ────────────────────────────────

export type SubjectBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SubjectBoundingBoxFrame = {
  frame?: number;
  timestampSeconds?: number;
  bbox: SubjectBoundingBox;
};

export type TypographyVideoProps = {
  mediaSrc?: string;
  subjectCutoutSrc?: string;
  enable3DTextBehindSubject?: boolean;
  subjectBoundingBox?: SubjectBoundingBox;
  subjectBoundingBoxFrames?: SubjectBoundingBoxFrame[];

  mediaType?: 'video' | 'audio';
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  keywords?: KineticPhrase[];
  captions?: CaptionSegment[];
  typographyStyle?: string;
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontSize?: SubtitleConfig['fontSize'];
  fontFamily?: string;
  showBackground?: boolean;
  showCaptions?: boolean;
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock;
  soundCues?: PremiumSoundCue[];
};

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:|\/|[a-zA-Z]:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

// ── Smart Auto-Positioning & Safe Zone Calculator ────────────────────────────

export function getResponsivePlacement(
  frame: number,
  fps: number,
  userPosition?: 'top' | 'center' | 'bottom-mid' | 'bottom' | 'left' | 'right' | 'auto',
  frames?: SubjectBoundingBoxFrame[],
  staticBbox?: SubjectBoundingBox
): { top: string; left: string; transform: string } {
  if (userPosition && userPosition !== 'auto') {
    switch (userPosition) {
      case 'top':
        return { top: '18%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom-mid':
      case 'bottom':
        return { top: '74%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'left':
        return { top: '68%', left: '4%', transform: 'translateY(-50%)' };
      case 'right':
        return { top: '68%', left: '60%', transform: 'translateY(-50%)' };
      case 'center':
      default:
        return { top: '68%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  }

  // If frame tracking exists, find the active bounding box
  let currentBbox = staticBbox;
  if (frames && frames.length > 0) {
    const currentTime = frame / fps;
    const closest = frames.find(
      (f) => Math.abs((f.timestampSeconds ?? (f.frame ? f.frame / fps : 0)) - currentTime) < 0.1
    );
    if (closest) currentBbox = closest.bbox;
  }

  // If no subject detected, default to cinematic lower-chest hero area
  if (!currentBbox) {
    return { top: '68%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  const subjectTop = currentBbox.y;
  const subjectHeight = currentBbox.height;
  const subjectBottom = subjectTop + subjectHeight;

  // If subject is seated in middle/bottom, place text in open top zone
  if (subjectTop > 0.28) {
    const topZoneCenterY = subjectTop / 2;
    return {
      top: `${Math.round(topZoneCenterY * 100)}%`,
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  // If subject is close-up at top, place text in lower third
  if (subjectBottom < 0.72) {
    return { top: '74%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  // Default center anchor
  return { top: '68%', left: '50%', transform: 'translate(-50%, -50%)' };
}

// ── Main Kinetic Phrase Component ──────────────────────────────────────────

function KineticPhraseSegment({
  phrase,
  frame,
  fps,
  typographyStyle,
  subjectBoundingBox,
  subjectBoundingBoxFrames,
}: {
  phrase: KineticPhrase;
  frame: number;
  fps: number;
  typographyStyle: string;
  subjectBoundingBox?: SubjectBoundingBox;
  subjectBoundingBoxFrames?: SubjectBoundingBoxFrame[];
}) {
  const currentTime = frame / fps;
  if (currentTime < phrase.start || currentTime >= phrase.end) return null;

  const localFrame = Math.round((currentTime - phrase.start) * fps);
  const durationFrames = Math.round((phrase.end - phrase.start) * fps);

  // Exit transition
  const exitStart = Math.max(10, durationFrames - 6);
  const exitProgress =
    localFrame > exitStart
      ? interpolate(localFrame, [exitStart, durationFrames], [0, 1], { extrapolateRight: 'clamp' })
      : 0;
  const finalOpacity = 1 - exitProgress;

  // Smart Auto-Positioning
  const pos = getResponsivePlacement(
    frame,
    fps,
    phrase.position,
    subjectBoundingBoxFrames,
    subjectBoundingBox
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        transform: pos.transform,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        pointerEvents: 'none',
        opacity: finalOpacity,
        zIndex: 20,
        width: '100%',
        maxWidth: 1080,
      }}
    >
      <TypographyStyleRenderer
        styleId={typographyStyle}
        phrase={phrase}
        localFrame={localFrame}
        fps={fps}
      />
    </div>
  );
}

// ── Primary Template Component ───────────────────────────────────────────────

function TypographyVideo({
  mediaSrc = '',
  subjectCutoutSrc = '',
  enable3DTextBehindSubject = true,
  subjectBoundingBox,
  subjectBoundingBoxFrames = [],
  mediaTrimStartSeconds = 0,
  mediaType = 'video',
  sourceAudioVolume = 1,
  keywords = [],
  captions = [],
  typographyStyle = 'dynamic-punch',
  captionStyle = 'Cinematic',
  captionPosition = 'bottom',
  textColor = '#F8FAFC',
  highlightColor,
  backgroundColor = 'rgba(15,23,42,0.45)',
  fontSize = 'medium',
  fontFamily,
  showBackground = true,
  showCaptions = false,
  premiumEditing = true,
  styleLock,
  soundCues = [],
}: TypographyVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const resolvedCutoutSrc = resolveAsset(subjectCutoutSrc);
  const blueprint = getStyleBlueprint(typographyStyle);

  const hasSubjectCutout = Boolean(enable3DTextBehindSubject && resolvedCutoutSrc);

  // Automatic transcript word-by-word parser fallback when keywords are omitted
  const activePhrases: KineticPhrase[] = React.useMemo(() => {
    if (keywords && keywords.length > 0) return keywords;

    const generated: KineticPhrase[] = [];
    if (!captions || captions.length === 0) return generated;

    captions.forEach((seg, sIndex) => {
      if (seg.words && seg.words.length > 0) {
        for (let i = 0; i < seg.words.length; i += 2) {
          const chunk = seg.words.slice(i, i + 2);
          const chunkText = chunk.map((w) => w.word).join(' ');

          generated.push({
            id: `auto-${sIndex}-${i}`,
            leadText: chunk.length > 1 ? chunk[0].word : '',
            heroText: chunk.length > 1 ? chunk[1].word.toUpperCase() : chunk[0].word.toUpperCase(),
            start: chunk[0].start,
            end: chunk[chunk.length - 1].end + 0.3,
            highlightType: 'emphasis',
          });
        }
      } else if (seg.text) {
        const segWords = seg.text.split(/\s+/).filter(Boolean);
        generated.push({
          id: `auto-seg-${sIndex}`,
          leadText: segWords.length > 1 ? segWords.slice(0, Math.floor(segWords.length / 2)).join(' ') : '',
          heroText: segWords.length > 1 ? segWords.slice(Math.floor(segWords.length / 2)).join(' ').toUpperCase() : seg.text.toUpperCase(),
          start: seg.start,
          end: seg.end,
          highlightType: 'emphasis',
        });
      }
    });

    return generated;
  }, [keywords, captions]);

  const visualStyleLock: PremiumVisualStyleLock = {
    colorGrade: blueprint.colorGrade,
    camera: { kenBurnsIntensity: blueprint.kenBurnsIntensity, shakeIntensity: 0, motionBlur: 0.18 },
    depth: { foregroundOpacity: 0.06, backgroundBlur: 0 },
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <TypographyFontStyles />
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />

      {/* ── LAYER 1 (BOTTOM): Background Media ───────────────────────────────── */}
      {(!resolvedSrc || mediaType === 'audio') && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 40%, #0F172A 0%, #020617 80%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}

      {resolvedSrc && mediaType === 'audio' && (
        <Audio
          src={resolvedSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          volume={sourceAudioVolume}
        />
      )}

      {resolvedSrc && mediaType !== 'audio' && (
        <OffthreadVideo
          src={resolvedSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: blueprint.colorGrade.filter,
          }}
          volume={sourceAudioVolume}
        />
      )}

      {/* ── LAYER 2 (MIDDLE): Custom Dynamic Typography Style Component ──────── */}
      {activePhrases.map((phrase, i) => (
        <KineticPhraseSegment
          key={phrase.id || `${phrase.start}-${i}`}
          phrase={phrase}
          frame={frame}
          fps={fps}
          typographyStyle={typographyStyle}
          subjectBoundingBox={subjectBoundingBox}
          subjectBoundingBoxFrames={subjectBoundingBoxFrames}
        />
      ))}

      {/* ── LAYER 3 (TOP): Subject Cutout Video (Text Behind Subject) ────────── */}
      {hasSubjectCutout && (
        <OffthreadVideo
          src={resolvedCutoutSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            zIndex: 30,
          }}
          volume={0}
        />
      )}

      <PremiumVisualTreatment enabled={premiumEditing} styleLock={visualStyleLock} includeLightSweep />
    </AbsoluteFill>
  );
}

// ── Default Test Sequence Props (5-Second Verification) ────────────────────

const defaultProps: TypographyVideoProps = {
  mediaSrc: '',
  subjectCutoutSrc: '',
  enable3DTextBehindSubject: true,
  mediaType: 'video',
  sourceAudioVolume: 1,
  durationSeconds: 5,
  typographyStyle: 'dynamic-punch',
  captionStyle: 'Cinematic',
  captionPosition: 'bottom',
  showCaptions: false,
  premiumEditing: true,
  subjectBoundingBox: { x: 0.5, y: 0.15, width: 0.4, height: 0.7 },
  keywords: [
    {
      leadText: 'Discover the',
      heroText: 'TRUE POTENTIAL',
      subText: 'high impact growth',
      start: 0.2,
      end: 2.2,
      highlightType: 'emphasis',
    },
    {
      leadText: 'Unlock your',
      heroText: 'SECRET POWER',
      subText: 'with kinetic typography',
      start: 2.4,
      end: 4.8,
      highlightType: 'emphasis',
    },
  ],
  captions: [],
};

export { TypographyVideo };

export const TypographyVideoComposition = () => (
  <Composition
    id="TYPOGRAPHY-VIDEO"
    component={TypographyVideo}
    durationInFrames={secondsToFrames(5, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as TypographyVideoProps;
      const dur = Math.max(
        5,
        Math.min(
          90,
          Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 5
        )
      );
      return { durationInFrames: secondsToFrames(dur, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920 };
    }}
  />
);
