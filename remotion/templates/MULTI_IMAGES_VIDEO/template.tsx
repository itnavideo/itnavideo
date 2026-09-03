import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {PremiumVisualTreatment} from '../../components/PremiumVisualTreatment';
import {resolveFont} from '../../utils/fonts';
import {DEFAULT_FPS, secondsToFrames} from '../../constants';

// Self-hosted fonts (Lambda-safe) — this template previously used a bare 'Inter' string that
// fell back to system-ui on Lambda because the font was never loaded here.
const TITLE_FONT = resolveFont('Montserrat');
const CAPTION_FONT = resolveFont('Inter');

type MultiImageTiming = {start: number; end: number};
type MultiImageCaption = {start: number; end: number; text: string};

type MultiImagesVideoProps = {
  mediaSrc?: string;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  mediaTrimStartSeconds?: number;
  title?: string;
  imageSources?: string[];
  // Per-image show windows (seconds), aligned to imageSources order. When provided and
  // valid, images change on these narration-synced beats instead of an even split.
  imageTimings?: MultiImageTiming[];
  // Narration captions (seconds) synced to the audio.
  captions?: MultiImageCaption[];
};

const VIDEO_TOP = 56;
const VIDEO_HEIGHT = 572;
const TITLE_TOP = VIDEO_TOP + VIDEO_HEIGHT;
const TITLE_HEIGHT = 120;
const IMAGE_STAGE_TOP = TITLE_TOP + TITLE_HEIGHT;
const IMAGE_STAGE_BOTTOM = 42;
const ACCENT = '#60A5FA';

type ImageAnimation = 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'lift' | 'drift';
const ANIMATIONS: ImageAnimation[] = ['zoom-in', 'pan-left', 'zoom-out', 'pan-right', 'lift', 'drift'];

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

function clampTitle(value: string, maxChars = 72) {
  const text = String(value || '').replace(/\s+/g, ' ').trim() || 'Your Story Title Here';
  return text.length > maxChars ? `${text.slice(0, maxChars - 1).trimEnd()}…` : text;
}

function getTitleSize(title: string) {
  if (title.length > 54) return 31;
  if (title.length > 38) return 36;
  return 42;
}

function getMotionVariant(source: string, index: number): ImageAnimation {
  const seed = Array.from(source).reduce((total, char) => total + char.charCodeAt(0), index * 17);
  return ANIMATIONS[seed % ANIMATIONS.length];
}

function getImageTransform(animation: ImageAnimation, progress: number) {
  // Slightly stronger Ken Burns so each image feels alive without harsh jumps.
  switch (animation) {
    case 'zoom-in': return `scale(${1.02 + progress * 0.07})`;
    case 'zoom-out': return `scale(${1.09 - progress * 0.07})`;
    case 'pan-left': return `scale(1.06) translateX(${-progress * 3.4}%)`;
    case 'pan-right': return `scale(1.06) translateX(${progress * 3.4}%)`;
    case 'lift': return `scale(1.05) translateY(${-progress * 3}%)`;
    case 'drift': return `scale(${1.03 + progress * 0.04}) translateY(${(0.5 - progress) * 2.4}%)`;
  }
}

function VideoSection({
  src,
  frame,
  fps,
  startFrom,
  volume,
}: {
  src: string;
  frame: number;
  fps: number;
  startFrom: number;
  volume: number;
}) {
  const entrance = spring({frame: Math.max(0, frame - 2), fps, config: {damping: 22, mass: 0.7}});
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const y = interpolate(entrance, [0, 1], [18, 0]);

  return (
    <div style={{
      position: 'absolute',
      top: VIDEO_TOP,
      left: 32,
      right: 32,
      height: VIDEO_HEIGHT,
      overflow: 'hidden',
      borderRadius: 24,
      opacity,
      transform: `translateY(${y}px) scale(${0.985 + entrance * 0.015})`,
      transformOrigin: 'center top',
      background: '#07111F',
      boxShadow: '0 24px 72px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.12)',
    }}>
      <OffthreadVideo
        src={src}
        startFrom={startFrom}
        volume={volume}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(4,10,24,0.12) 0%, transparent 40%, rgba(4,10,24,0.5) 100%)',
      }} />
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${ACCENT}B8 50%, transparent)`,
        opacity: 0.72,
      }} />
    </div>
  );
}

function TitleSection({title, frame, fps}: {title: string; frame: number; fps: number}) {
  const displayTitle = clampTitle(title);
  const entrance = spring({frame: Math.max(0, frame - 10), fps, config: {damping: 18, mass: 0.55}});
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const y = interpolate(entrance, [0, 1], [18, 0]);

  return (
    <div style={{
      position: 'absolute',
      top: TITLE_TOP,
      left: 42,
      right: 42,
      height: TITLE_HEIGHT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity,
      transform: `translateY(${y}px)`,
      textAlign: 'center',
    }}>
      <div style={{position: 'relative', maxWidth: '100%', padding: '14px 28px 12px'}}>
        <div style={{
          position: 'absolute',
          left: '15%',
          right: '15%',
          bottom: 0,
          height: 3,
          borderRadius: 999,
          background: `linear-gradient(90deg, transparent, ${ACCENT}B3 50%, transparent)`,
          boxShadow: `0 0 18px ${ACCENT}42`,
        }} />
        <h1 style={{
          position: 'relative',
          margin: 0,
          color: '#F8FAFC',
          fontFamily: TITLE_FONT,
          fontSize: getTitleSize(displayTitle),
          fontWeight: 850,
          letterSpacing: -0.65,
          lineHeight: 1.16,
          maxHeight: '2.32em',
          overflow: 'hidden',
          textShadow: '0 3px 16px rgba(0,0,0,0.7)',
        }}>
          {displayTitle}
        </h1>
      </div>
    </div>
  );
}

function buildImageBounds(
  imageCount: number,
  durationFrames: number,
  fps: number,
  timings?: MultiImageTiming[],
): Array<{start: number; end: number}> {
  // Use narration-synced timings when they line up with the image count and are ordered.
  const valid =
    Array.isArray(timings) &&
    timings.length === imageCount &&
    timings.every((t, i) => Number.isFinite(t?.start) && Number.isFinite(t?.end) && t.end > t.start && (i === 0 || t.start >= timings[i - 1].start - 0.001));
  if (valid && timings) {
    return timings.map((t, i) => ({
      start: i === 0 ? 0 : Math.max(0, Math.round(t.start * fps)),
      end: i === imageCount - 1 ? durationFrames : Math.min(durationFrames, Math.round(t.end * fps)),
    }));
  }
  // Fallback: even split across the duration.
  return Array.from({length: imageCount}, (_, i) => ({
    start: Math.floor((i * durationFrames) / imageCount),
    end: i === imageCount - 1 ? durationFrames : Math.floor(((i + 1) * durationFrames) / imageCount),
  }));
}

function ImageSlideshow({
  images,
  frame,
  fps,
  durationFrames,
  timings,
}: {
  images: string[];
  frame: number;
  fps: number;
  durationFrames: number;
  timings?: MultiImageTiming[];
}) {
  if (!images.length) return null;

  const imageCount = images.length;
  const bounds = buildImageBounds(imageCount, durationFrames, fps, timings);
  let activeIndex = 0;
  for (let i = 0; i < bounds.length; i += 1) {
    if (frame >= bounds[i].start) activeIndex = i;
  }
  const transitionFrames = imageCount > 1
    ? Math.max(10, Math.min(Math.round(fps * 0.45), Math.floor(durationFrames / imageCount / 3)))
    : 0;

  return (
    <div style={{
      position: 'absolute',
      top: IMAGE_STAGE_TOP,
      left: 32,
      right: 32,
      bottom: IMAGE_STAGE_BOTTOM,
      overflow: 'hidden',
      borderRadius: 24,
      background: '#081222',
      boxShadow: '0 24px 70px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      {images.map((src, index) => {
        const imageStart = bounds[index].start;
        const imageEnd = bounds[index].end;
        const visibleFrom = index === 0 ? imageStart : imageStart - transitionFrames;
        const isVisible = frame >= visibleFrom && frame < imageEnd;
        if (!isVisible) return null;

        let opacity = 1;
        if (index > 0 && frame < imageStart) {
          opacity = interpolate(frame, [visibleFrom, imageStart], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
        } else if (index < imageCount - 1 && frame >= imageEnd - transitionFrames) {
          opacity = interpolate(frame, [imageEnd - transitionFrames, imageEnd], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
        }

        const progress = interpolate(frame, [imageStart, imageEnd], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const animation = getMotionVariant(src, index);
        const transform = getImageTransform(animation, progress);

        return (
          <div key={`${src}-${index}`} style={{position: 'absolute', inset: 0, opacity, zIndex: index === activeIndex ? 2 : 1}}>
            <Img
              src={resolveAsset(src)}
              style={{
                position: 'absolute',
                inset: -32,
                width: 'calc(100% + 64px)',
                height: 'calc(100% + 64px)',
                objectFit: 'cover',
                filter: 'blur(28px) brightness(0.42) saturate(1.12)',
                transform: 'scale(1.08)',
              }}
            />
            <div style={{position: 'absolute', inset: 0, background: 'rgba(4,11,24,0.24)'}} />
            <Img
              src={resolveAsset(src)}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform,
                transformOrigin: animation === 'pan-left' ? 'center right' : animation === 'pan-right' ? 'center left' : 'center center',
                filter: 'drop-shadow(0 20px 34px rgba(0,0,0,0.34))',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 48%, rgba(2,6,14,0.32) 100%)',
            }} />
          </div>
        );
      })}

      {imageCount > 1 && (
        <>
          <div style={{
            position: 'absolute',
            left: 18,
            right: 18,
            bottom: 18,
            height: 3,
            borderRadius: 999,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.16)',
            zIndex: 10,
          }}>
            <div style={{
              width: `${((activeIndex + 1) / imageCount) * 100}%`,
              height: '100%',
              borderRadius: 999,
              background: `linear-gradient(90deg, ${ACCENT}, #C4E4FF)`,
              boxShadow: `0 0 14px ${ACCENT}80`,
            }} />
          </div>
          <div style={{
            position: 'absolute',
            right: 20,
            top: 18,
            zIndex: 10,
            padding: '5px 9px',
            borderRadius: 999,
            background: 'rgba(5,12,24,0.62)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
          }}>
            <span style={{fontFamily: CAPTION_FONT, fontSize: 12, fontWeight: 750, color: 'rgba(248,250,252,0.88)', letterSpacing: 0.4}}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(imageCount).padStart(2, '0')}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function CaptionBar({captions, frame, fps}: {captions?: MultiImageCaption[]; frame: number; fps: number}) {
  if (!captions || !captions.length) return null;
  const time = frame / fps;
  const active = captions.find((c) => time >= c.start && time < c.end);
  if (!active || !active.text) return null;
  return (
    <div style={{position: 'absolute', left: 48, right: 48, bottom: 96, display: 'flex', justifyContent: 'center', zIndex: 20, pointerEvents: 'none'}}>
      <span style={{
        display: 'inline-block',
        maxWidth: '100%',
        background: 'rgba(4,10,24,0.72)',
        backdropFilter: 'blur(8px)',
        borderRadius: 14,
        padding: '12px 22px',
        color: '#F8FAFC',
        fontFamily: CAPTION_FONT,
        fontSize: 33,
        fontWeight: 800,
        lineHeight: 1.22,
        textAlign: 'center',
        letterSpacing: -0.3,
        textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {active.text}
      </span>
    </div>
  );
}

function MultiImagesVideo({
  mediaSrc = '',
  sourceAudioVolume = 1,
  mediaTrimStartSeconds = 0,
  title = 'Your Story Title Here',
  imageSources = [],
  imageTimings,
  captions,
}: MultiImagesVideoProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);
  const images = imageSources.filter(Boolean).slice(0, 20);

  return (
    <AbsoluteFill style={{background: '#07101E'}}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #07101E 0%, #0A1628 42%, #07101B 100%)',
      }} />
      <div style={{
        position: 'absolute',
        top: 420,
        left: '8%',
        right: '8%',
        height: 460,
        background: `radial-gradient(ellipse, ${ACCENT}12 0%, transparent 70%)`,
        filter: 'blur(50px)',
      }} />
      {resolvedSrc ? (
        <VideoSection
          src={resolvedSrc}
          frame={frame}
          fps={fps}
          startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
          volume={sourceAudioVolume}
        />
      ) : null}
      <TitleSection title={title} frame={frame} fps={fps} />
      <ImageSlideshow images={images} frame={frame} fps={fps} durationFrames={durationInFrames} timings={imageTimings} />
      <CaptionBar captions={captions} frame={frame} fps={fps} />
      <PremiumVisualTreatment enabled />
    </AbsoluteFill>
  );
}

const defaultProps: MultiImagesVideoProps = {
  mediaSrc: '',
  sourceAudioVolume: 1,
  durationSeconds: 30,
  title: 'Breaking: Major Update Released',
  imageSources: [],
};

export {MultiImagesVideo};

export const MultiImagesVideoComposition = () => (
  <Composition
    id="MULTI-IMAGES-VIDEO"
    component={MultiImagesVideo}
    durationInFrames={secondsToFrames(30, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => {
      const p = props as MultiImagesVideoProps;
      const duration = Math.max(8, Math.min(90,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30,
      ));
      return {durationInFrames: secondsToFrames(duration, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920};
    }}
  />
);
