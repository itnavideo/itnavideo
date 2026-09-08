import React from 'react';
import { AbsoluteFill, Composition, OffthreadVideo, Series, staticFile, useVideoConfig, useCurrentFrame, spring } from 'remotion';
import {
  UniversalCaptionLayer,
  CaptionChunk,
} from '../../components/library/UniversalCaptionLayer';
import {
  UniversalStickerLayer,
  StickerEvent,
} from '../../components/library/UniversalStickerLayer';
import {
  UniversalLowerThird,
  ChapterCardEvent,
} from '../../components/library/UniversalLowerThird';
import { UniversalProgressBar } from '../../components/library/UniversalProgressBar';
import { UniversalLayoutFrame } from '../../components/library/UniversalLayoutFrame';
import { TemplateLibraryConfig } from '../../../services/templates/templateLibrary';
import { SpeechClip } from '../../../services/ai/faceCamSilenceCleaner';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';

export interface FaceKeyframe {
  timeSeconds: number;
  xCenter: number; // 0.0 to 1.0, normalized
  yCenter: number; // 0.0 to 1.0, normalized
  confidence?: number;
}

export interface LongVideoProProps {
  mediaSrc?: string;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  stickerEvents?: StickerEvent[];
  chapterEvents?: ChapterCardEvent[];
  templateConfig?: TemplateLibraryConfig;
  speechClips?: SpeechClip[];
  enableSmartPunchIn?: boolean;
  faceKeyframes?: FaceKeyframe[];
}

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  return /^(https?:|data:|blob:)/i.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
};

function getInterpolatedFacePosition(keyframes: FaceKeyframe[] = [], currentTime: number) {
  if (!keyframes || keyframes.length === 0) {
    return { xCenter: 0.50, yCenter: 0.38 };
  }
  if (keyframes.length === 1 || currentTime <= keyframes[0].timeSeconds) {
    return { xCenter: keyframes[0].xCenter, yCenter: keyframes[0].yCenter };
  }
  const lastKeyframe = keyframes[keyframes.length - 1];
  if (currentTime >= lastKeyframe.timeSeconds) {
    return { xCenter: lastKeyframe.xCenter, yCenter: lastKeyframe.yCenter };
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i];
    const k2 = keyframes[i + 1];
    if (currentTime >= k1.timeSeconds && currentTime <= k2.timeSeconds) {
      const dt = k2.timeSeconds - k1.timeSeconds;
      const progress = dt > 0 ? (currentTime - k1.timeSeconds) / dt : 0;
      // Smoothstep interpolation for human-editor camera re-framing
      const smoothProgress = progress * progress * (3 - 2 * progress);
      const x = k1.xCenter + (k2.xCenter - k1.xCenter) * smoothProgress;
      const y = k1.yCenter + (k2.yCenter - k1.yCenter) * smoothProgress;
      return { xCenter: x, yCenter: y };
    }
  }

  return { xCenter: 0.50, yCenter: 0.38 };
}

export function LongVideoPro({
  mediaSrc = '',
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1,
  durationSeconds = 60,
  captions = [],
  subtitleChunks = [],
  stickerEvents = [],
  chapterEvents = [],
  templateConfig = {
    captionThemeId: 'glow-viral',
    stickerPackId: 'stickman-dev',
    lowerThirdId: 'chapter-badge',
    progressBarId: 'bottom-neon-bar',
  },
  speechClips = [],
  enableSmartPunchIn = true,
  faceKeyframes = [],
}: LongVideoProProps) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  const startFrom = Math.max(0, Math.round(mediaTrimStartSeconds * fps));
  const resolvedMediaSrc = resolveMediaSrc(mediaSrc);
  const activeCaptions = captions.length ? captions : subtitleChunks;

  // Smart Camera Punch-In Zoom Calculation (1.0x wide <-> 1.12x punch-in)
  const punchInCycle = Math.floor(currentTime / 7);
  const isPunchIn = enableSmartPunchIn && (punchInCycle % 2 === 1);

  const zoomSpring = spring({
    frame: frame % Math.round(7 * fps),
    fps,
    config: { damping: 15, stiffness: 140 },
  });

  const activeScale = isPunchIn
    ? 1.0 + 0.12 * zoomSpring
    : 1.12 - 0.12 * zoomSpring;

  // Dynamic Face-Tracking Transform Origin
  const facePos = getInterpolatedFacePosition(faceKeyframes, currentTime);
  const transformOriginX = `${(facePos.xCenter * 100).toFixed(1)}%`;
  const transformOriginY = `${(facePos.yCenter * 100).toFixed(1)}%`;

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
      {/* Background Video Wrapper with Real Face Tracking & Smart Framing */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${activeScale})`,
          transformOrigin: `${transformOriginX} ${transformOriginY}`,
          transition: 'transform-origin 0.4s ease-out, transform 0.2s ease-out',
        }}
      >
        {resolvedMediaSrc && speechClips && speechClips.length > 1 ? (
          /* Multi-Clip Silence Trimmed Video Series */
          <Series>
            {speechClips.map((clip) => {
              const clipDurationInFrames = Math.max(1, Math.round(clip.durationSeconds * fps));
              const clipStartFromFrame = Math.round(clip.startSeconds * fps);

              return (
                <Series.Sequence key={clip.clipId} durationInFrames={clipDurationInFrames}>
                  <OffthreadVideo
                    src={resolvedMediaSrc}
                    startFrom={clipStartFromFrame}
                    volume={sourceAudioVolume}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#020617',
                    }}
                  />
                </Series.Sequence>
              );
            })}
          </Series>
        ) : resolvedMediaSrc ? (
          /* Single Video Track Fallback */
          <OffthreadVideo
            src={resolvedMediaSrc}
            startFrom={startFrom}
            volume={sourceAudioVolume}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#020617',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: 24,
            }}
          >
            No Media Provided
          </div>
        )}
      </div>

      {/* Frame / Branding Canvas Overlay */}
      <UniversalLayoutFrame layoutFrameId="split-16x9" topicTitle="LONG VIDEO PRO" />

      {/* Lower Third Chapter Cards */}
      <UniversalLowerThird chapterEvents={chapterEvents} lowerThirdId={templateConfig.lowerThirdId} />

      {/* Sticker Animation Layer */}
      <UniversalStickerLayer stickerEvents={stickerEvents} stickerPackId={templateConfig.stickerPackId} />

      {/* Kinetic Word-by-Word Caption Subtitles */}
      <UniversalCaptionLayer chunks={activeCaptions} captionThemeId={templateConfig.captionThemeId} />

      {/* Dynamic Render Progress Bar */}
      <UniversalProgressBar totalDurationInSeconds={durationSeconds} progressBarId={templateConfig.progressBarId} />
    </AbsoluteFill>
  );
}

export function LongVideoProComposition() {
  return (
    <Composition
      id="LONG-VIDEO-PRO"
      component={LongVideoPro}
      durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
      fps={DEFAULT_FPS}
      width={1920}
      height={1080}
      defaultProps={{
        mediaSrc: '',
        durationSeconds: 60,
        captions: [],
        speechClips: [],
        faceKeyframes: [],
      }}
      calculateMetadata={({ props }) => {
        const p = props as LongVideoProProps;
        const dur = Math.max(5, Math.min(600, Number(p.durationSeconds) || 60));
        return { durationInFrames: secondsToFrames(dur, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1920, height: 1080 };
      }}
    />
  );
}
