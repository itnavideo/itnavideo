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

// ── Types ─────────────────────────────────────────────────────────────────────

type MultiImagesVideoProps = {
  mediaSrc?: string;
  sourceAudioVolume?: number;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;
  mediaTrimStartSeconds?: number;
  title?: string;
  imageSources?: string[];
};

// ── Constants ─────────────────────────────────────────────────────────────────

const SAFE_ZONE_TOP = 60;
const VIDEO_HEIGHT = 580; // 16:9 at full width 1080 = 607, slightly smaller for premium spacing
const TITLE_HEIGHT = 90;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;
const IMAGE_AREA_TOP = SAFE_ZONE_TOP + VIDEO_HEIGHT + TITLE_HEIGHT;
const IMAGE_AREA_HEIGHT = CANVAS_HEIGHT - IMAGE_AREA_TOP - 30; // 30px bottom padding

// Image animation types
type ImageAnimation = 'kenBurnsIn' | 'kenBurnsOut' | 'panLeft' | 'panRight' | 'slideUp' | 'parallax';
const ANIMATIONS: ImageAnimation[] = ['kenBurnsIn', 'panLeft', 'kenBurnsOut', 'panRight', 'slideUp', 'parallax'];

// ── Helpers ───────────────────────────────────────────────────────────────────

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

// ── Sub-Components ────────────────────────────────────────────────────────────

function SafeZoneGradient() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: SAFE_ZONE_TOP + 20,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
      zIndex: 10,
    }} />
  );
}

function VideoSection({ src, fps, startFrom, volume }: { src: string; fps: number; startFrom: number; volume: number }) {
  return (
    <div style={{
      position: 'absolute',
      top: SAFE_ZONE_TOP,
      left: 20,
      right: 20,
      height: VIDEO_HEIGHT,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
    }}>
      <OffthreadVideo
        src={src}
        startFrom={startFrom}
        volume={volume}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Subtle bottom gradient for blending into title */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        background: 'linear-gradient(0deg, rgba(12,15,23,0.7) 0%, transparent 100%)',
      }} />
    </div>
  );
}

function TitleSection({ title, frame, fps }: { title: string; frame: number; fps: number }) {
  const entrance = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 16, mass: 0.5 } });
  const y = interpolate(entrance, [0, 1], [12, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div style={{
      position: 'absolute',
      top: SAFE_ZONE_TOP + VIDEO_HEIGHT,
      left: 0,
      right: 0,
      height: TITLE_HEIGHT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 32px',
      opacity,
      transform: `translateY(${y}px)`,
    }}>
      {/* Accent line */}
      <div style={{
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 40,
        height: 3,
        borderRadius: 2,
        background: 'linear-gradient(90deg, #10B981, #22C55E)',
      }} />
      <h1 style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 38,
        fontWeight: 900,
        color: '#F8FAFC',
        textAlign: 'center',
        lineHeight: 1.2,
        maxHeight: '2.4em',
        overflow: 'hidden',
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        letterSpacing: -0.5,
      }}>
        {(title || 'Your Story Title Here').slice(0, 80)}
      </h1>
    </div>
  );
}

function ImageSlideshow({ images, frame, fps, durationFrames }: { images: string[]; frame: number; fps: number; durationFrames: number }) {
  if (!images.length) return null;

  const imageCount = images.length;
  const framesPerImage = Math.floor(durationFrames / imageCount);
  const transitionFrames = 12; // crossfade duration

  return (
    <div style={{
      position: 'absolute',
      top: IMAGE_AREA_TOP,
      left: 20,
      right: 20,
      height: IMAGE_AREA_HEIGHT,
      borderRadius: 14,
      overflow: 'hidden',
      background: '#0A0F1C',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      {images.map((src, index) => {
        const imageStart = index * framesPerImage;
        const imageEnd = imageStart + framesPerImage;
        const isVisible = frame >= imageStart - transitionFrames && frame < imageEnd + transitionFrames;

        if (!isVisible) return null;

        // Opacity: fade in / full / fade out
        let opacity = 1;
        if (frame < imageStart) {
          opacity = interpolate(frame, [imageStart - transitionFrames, imageStart], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        } else if (frame >= imageEnd - transitionFrames) {
          opacity = interpolate(frame, [imageEnd - transitionFrames, imageEnd], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        }

        // Animation progress (0 to 1 within this image's time)
        const localProgress = interpolate(frame, [imageStart, imageEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const animType = ANIMATIONS[index % ANIMATIONS.length];

        let transform = '';
        switch (animType) {
          case 'kenBurnsIn':
            transform = `scale(${1 + localProgress * 0.12})`;
            break;
          case 'kenBurnsOut':
            transform = `scale(${1.12 - localProgress * 0.12})`;
            break;
          case 'panLeft':
            transform = `scale(1.08) translateX(${-localProgress * 4}%)`;
            break;
          case 'panRight':
            transform = `scale(1.08) translateX(${localProgress * 4}%)`;
            break;
          case 'slideUp':
            transform = `scale(1.05) translateY(${-localProgress * 3}%)`;
            break;
          case 'parallax':
            transform = `scale(${1.05 + localProgress * 0.05}) translateY(${-localProgress * 2}%)`;
            break;
        }

        return (
          <div key={index} style={{
            position: 'absolute',
            inset: 0,
            opacity,
            zIndex: index === Math.floor(frame / framesPerImage) ? 2 : 1,
          }}>
            <Img
              src={resolveAsset(src)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform,
                transformOrigin: animType === 'panLeft' ? 'center right' : animType === 'panRight' ? 'center left' : 'center center',
              }}
            />
            {/* Subtle vignette on images */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)',
            }} />
          </div>
        );
      })}

      {/* Image counter badge */}
      {imageCount > 1 && (
        <div style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: 8,
          padding: '4px 10px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}>
            {Math.min(imageCount, Math.floor(frame / framesPerImage) + 1)}/{imageCount}
          </span>
        </div>
      )}

      {/* Progress dots */}
      {imageCount > 1 && imageCount <= 8 && (
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: 6,
        }}>
          {images.map((_, i) => {
            const isActive = Math.floor(frame / framesPerImage) === i;
            return (
              <div key={i} style={{
                width: isActive ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: isActive ? '#22C55E' : 'rgba(255,255,255,0.3)',
                transition: 'width 0.2s',
              }} />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

function MultiImagesVideo({
  mediaSrc = '',
  sourceAudioVolume = 1,
  mediaTrimStartSeconds = 0,
  title = 'Your Story Title Here',
  imageSources = [],
}: MultiImagesVideoProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const resolvedSrc = resolveAsset(mediaSrc);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0C0F17' }}>
      {/* Dark premium background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #0A0D14 0%, #0F1320 40%, #0C0F17 100%)',
      }} />

      {/* Subtle ambient glow */}
      <div style={{
        position: 'absolute',
        top: SAFE_ZONE_TOP + VIDEO_HEIGHT - 50,
        left: '10%',
        right: '10%',
        height: 200,
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      {/* Safe zone gradient */}
      <SafeZoneGradient />

      {/* Video (16:9) */}
      {resolvedSrc && (
        <VideoSection
          src={resolvedSrc}
          fps={fps}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          volume={sourceAudioVolume}
        />
      )}

      {/* Title */}
      <TitleSection title={title} frame={frame} fps={fps} />

      {/* Image slideshow with animations */}
      <ImageSlideshow
        images={imageSources}
        frame={frame}
        fps={fps}
        durationFrames={durationInFrames}
      />
    </AbsoluteFill>
  );
}

// ── Composition ───────────────────────────────────────────────────────────────

const defaultProps: MultiImagesVideoProps = {
  mediaSrc: '',
  sourceAudioVolume: 1,
  durationSeconds: 30,
  title: 'Breaking: Major Update Released',
  imageSources: [],
};

export { MultiImagesVideo };

export const MultiImagesVideoComposition = () => (
  <Composition
    id="MULTI-IMAGES-VIDEO"
    component={MultiImagesVideo}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => {
      const p = props as MultiImagesVideoProps;
      const dur = Math.max(8, Math.min(60,
        Number(p.durationSeconds) || Number(p.sourceDurationSeconds) || Number(p.renderWindowSeconds) || 30
      ));
      return { durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1080, height: 1920 };
    }}
  />
);
