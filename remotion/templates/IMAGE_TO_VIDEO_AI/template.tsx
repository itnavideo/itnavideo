import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import type { CaptionChunk } from '../../components/library/UniversalCaptionLayer';

export interface ImageToVideoScene {
  id: string;
  startSeconds: number;
  endSeconds: number;
  parentStartSeconds?: number;
  parentEndSeconds?: number;
  imageUrl?: string;
  text?: string;
  cameraMotion?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
  transition?: 'hard-cut' | 'dissolve' | 'push-left' | 'push-right';
  title?: string;
  fitMode?: 'blur-fill' | 'cover';
  sceneType?: 'image' | 'typography';
  typographyPrimary?: string;
  typographySecondary?: string;
  typographyAccent?: string;
}

export interface ImageToVideoAiProps {
  mediaSrc?: string;
  audioSrc?: string;
  audioUrl?: string;
  bgmSrc?: string;
  bgmUrl?: string;
  bgmVolume?: number;
  scenes?: ImageToVideoScene[];
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  sfxEvents?: Array<{
    id: string;
    sfxUrl: string;
    startFrame: number;
    volume: number;
  }>;
  durationSeconds?: number;
  renderWindowSeconds?: number;
  sourceDurationSeconds?: number;
  title?: string;
  cameraMotionPreset?: 'ken-burns' | 'dynamic-flow' | 'subtle-drift';
  subtitleStyle?: string;
  fitMode?: 'blur-fill' | 'cover';
}

const FALLBACK_SCENE_IMAGE = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688233/person_calculating_typing_laptop_npimij.png';

const resolveUrl = (src?: string) => {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed || trimmed === '[object Object]' || trimmed.includes('[object')) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  try {
    return staticFile(cleanPath);
  } catch {
    return cleanPath;
  }
};

const isValidAudioUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '[object Object]' || trimmed.includes('[object')) return false;
  return /^(https?:|data:|blob:|\/)/i.test(trimmed);
};

const resolveImageUrl = (src?: string) => {
  const url = resolveUrl(src);
  if (!url) return FALLBACK_SCENE_IMAGE;
  // Block legacy GCS bucket — all other URLs (S3 presigned, Cloudinary, data URIs) pass through
  if (url.includes('storage.googleapis.com/itnavideo-media-assets')) {
    return FALLBACK_SCENE_IMAGE;
  }
  return url;
};

/**
 * 35mm Cinematic Film Grain & Anamorphic Edge Vignette Overlay
 */
const FilmGrainOverlay: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 80,
        overflow: 'hidden',
      }}
    >
      {/* 1. Subtle Anamorphic Edge Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.40) 100%)',
        }}
      />
      {/* 2. 35mm Micro-Noise Texture */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.025,
          mixBlendMode: 'overlay',
        }}
      >
        <filter id="cinematic-film-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cinematic-film-noise)" />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * 16:9 Cinema-Grade Impact Typography Scene (5% Pacing Beat & Visual Fallback)
 */
const ImpactTypographyScene: React.FC<{
  scene: ImageToVideoScene;
  fps: number;
}> = ({ scene, fps }) => {
  const frame = useCurrentFrame();

  // Spring physics for dynamic punch-in scale
  const punchScale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 110,
      mass: 0.8,
    },
  });

  const scale = interpolate(punchScale, [0, 1], [0.85, 1.0]);

  // Subtle continuous drift
  const sceneDuration = Math.max(1, (scene.endSeconds - scene.startSeconds) * fps);
  const progress = frame / sceneDuration;
  const subtleScale = interpolate(progress, [0, 1], [1, 1.05]);

  const primaryText = scene.typographyPrimary || 'CRITICAL SHIFT';

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 100px',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, #121829 0%, #070B14 65%, #03050A 100%)',
        overflow: 'hidden',
      }}
    >
      {/* SFX Trigger on Frame 0 */}
      <Audio src={resolveUrl('/assets/reusable/sfx/chime.mp3')} volume={0.35} />

      {/* Ambient Radial Glow Orb */}
      <div
        style={{
          position: 'absolute',
          width: 650,
          height: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 109, 0, 0.22) 0%, rgba(255, 143, 0, 0.08) 50%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Content Box with Spring Punch-In Scale */}
      <div
        style={{
          transform: `scale(${scale * subtleScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {/* Accent Badge */}
        {scene.typographyAccent ? (
          <div
            style={{
              marginBottom: 28,
              padding: '8px 24px',
              borderRadius: 999,
              border: '1px solid rgba(255, 143, 0, 0.5)',
              backgroundColor: 'rgba(255, 109, 0, 0.15)',
              color: '#FF9100',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              boxShadow: '0 0 30px rgba(255, 109, 0, 0.3)',
            }}
          >
            {scene.typographyAccent}
          </div>
        ) : null}

        {/* Massive Cinema-Grade Impact Text */}
        <div
          style={{
            fontSize: primaryText.length > 20 ? 80 : primaryText.length > 12 ? 96 : 115,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD080 35%, #FF6D00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.95))',
            maxWidth: 1300,
            textTransform: 'uppercase',
          }}
        >
          {primaryText}
        </div>

        {/* Secondary Context Line */}
        {scene.typographySecondary ? (
          <div
            style={{
              marginTop: 26,
              fontSize: 28,
              fontWeight: 700,
              color: 'rgba(241, 245, 249, 0.85)',
              letterSpacing: '0.02em',
              maxWidth: 950,
              textShadow: '0 4px 15px rgba(0,0,0,0.8)',
            }}
          >
            {scene.typographySecondary}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Ken Burns Camera Motion & Scene Renderer
 */
const SceneRenderer: React.FC<{
  scene: ImageToVideoScene;
  nextScene?: ImageToVideoScene;
  fps: number;
  sceneIndex?: number;
  globalFitMode?: 'blur-fill' | 'cover';
}> = ({ scene, fps, sceneIndex = 0, globalFitMode = 'cover' }) => {
  const frame = useCurrentFrame();

  // Continuous Ken Burns: calculate progress relative to the parent asset's full duration
  const parentStart = scene.parentStartSeconds ?? scene.startSeconds;
  const parentEnd = scene.parentEndSeconds ?? scene.endSeconds;
  const globalCurrentTime = scene.startSeconds + (frame / fps);
  const parentDurationSeconds = Math.max(0.1, parentEnd - parentStart);
  const progress = Math.min(1, Math.max(0, (globalCurrentTime - parentStart) / parentDurationSeconds));

  const effectiveFitMode = scene.fitMode || globalFitMode || 'cover';

  // Ken Burns Motion Interpolation: Alternate zoom-in and zoom-out across scenes
  const isEvenScene = sceneIndex % 2 === 0;
  const motion = scene.cameraMotion || (isEvenScene ? 'zoom-in' : 'zoom-out');

  let scale = 1.06;
  let translateX = 0;
  let translateY = 0;

  switch (motion) {
    case 'zoom-in':
      // Continuous smooth zoom from 1.02 to 1.12 over asset duration
      scale = interpolate(progress, [0, 1], [1.02, 1.12], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      translateX = interpolate(progress, [0, 1], [0, -0.8]);
      translateY = interpolate(progress, [0, 1], [0, -0.8]);
      break;
    case 'zoom-out':
      // Continuous smooth zoom out from 1.12 to 1.02
      scale = interpolate(progress, [0, 1], [1.12, 1.02], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      translateX = interpolate(progress, [0, 1], [-0.8, 0]);
      translateY = interpolate(progress, [0, 1], [-0.8, 0]);
      break;
    case 'pan-left':
      scale = 1.10;
      translateX = interpolate(progress, [0, 1], [2.0, -2.0]);
      break;
    case 'pan-right':
      scale = 1.10;
      translateX = interpolate(progress, [0, 1], [-2.0, 2.0]);
      break;
    case 'pan-up':
      scale = 1.12;
      translateY = interpolate(progress, [0, 1], [2.0, -2.0]);
      break;
    case 'pan-down':
      scale = 1.12;
      translateY = interpolate(progress, [0, 1], [-2.0, 2.0]);
      break;
    default:
      scale = interpolate(progress, [0, 1], [1.02, 1.12], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
  }

  // Transitions
  const transition = scene.transition || 'dissolve';
  const sceneDurationFrames = Math.max(1, Math.round((scene.endSeconds - scene.startSeconds) * fps));
  const transitionFrames = Math.min(15, Math.floor(sceneDurationFrames * 0.25));

  let opacity = 1;
  let transitionPushX = 0;

  if (transition === 'dissolve' && transitionFrames > 0) {
    opacity = interpolate(frame, [0, transitionFrames], [0, 1], {
      extrapolateRight: 'clamp',
    });
  } else if (transition === 'push-left' && transitionFrames > 0) {
    transitionPushX = interpolate(frame, [0, transitionFrames], [15, 0], {
      extrapolateRight: 'clamp',
    });
  } else if (transition === 'push-right' && transitionFrames > 0) {
    transitionPushX = interpolate(frame, [0, transitionFrames], [-15, 0], {
      extrapolateRight: 'clamp',
    });
  }

  const isTypographyScene = scene.sceneType === 'typography' || (!scene.imageUrl && (scene.typographyPrimary || scene.title));

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${transitionPushX}%)`,
        overflow: 'hidden',
        backgroundColor: '#070B14',
      }}
    >
      {isTypographyScene ? (
        <ImpactTypographyScene scene={scene} fps={fps} />
      ) : (
        <>
          {/* 1. Full 16:9 Ambient Blurred Fill Layer */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              overflow: 'hidden',
              filter: 'blur(32px) brightness(0.92) saturate(1.15)',
              transform: `scale(${scale * 1.05}) translate(${translateX * 0.2}%, ${translateY * 0.2}%)`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          >
            <Img
              src={resolveImageUrl(scene.imageUrl)}
              alt={scene.title || 'Scene Backdrop'}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_SCENE_IMAGE;
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* 2. Foreground Subject Layer - Dynamic 16:9 Widescreen Fit */}
          {effectiveFitMode === 'blur-fill' ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
                transformOrigin: 'center center',
                transition: 'none',
              }}
            >
              <Img
                src={resolveImageUrl(scene.imageUrl)}
                alt={scene.title || 'Scene Foreground'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_SCENE_IMAGE;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
                transformOrigin: 'center center',
                transition: 'none',
              }}
            >
              <Img
                src={resolveImageUrl(scene.imageUrl)}
                alt={scene.title || 'Scene Visual'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_SCENE_IMAGE;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                }}
              />
            </div>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

const getSubtitleCardStyle = (styleMode: string): {
  container: React.CSSProperties;
  text: React.CSSProperties;
} => {
  switch (styleMode) {
    case 'bold-kinetic':
    case 'kinetic-glow':
      return {
        container: {
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(250, 204, 21, 0.55)',
          borderRadius: 24,
          padding: '12px 30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 24px rgba(250, 204, 21, 0.3)',
        },
        text: {
          color: '#FACC15',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.95), 0 0 16px rgba(250, 204, 21, 0.35)',
        },
      };
    case 'minimal-lower':
    case 'minimalist':
      return {
        container: {
          background: 'rgba(0, 0, 0, 0.68)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          padding: '10px 26px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
        },
        text: {
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.01em',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.98), 0 2px 6px rgba(0, 0, 0, 0.9)',
        },
      };
    case 'neon-cyan':
      return {
        container: {
          background: 'rgba(6, 24, 38, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(56, 189, 248, 0.55)',
          borderRadius: 26,
          padding: '12px 30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 26px rgba(56, 189, 248, 0.35)',
        },
        text: {
          color: '#38BDF8',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.01em',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.95), 0 0 18px rgba(56, 189, 248, 0.5)',
        },
      };
    case 'documentary-serif':
      return {
        container: {
          background: 'rgba(10, 10, 12, 0.88)',
          backdropFilter: 'blur(16px)',
          borderLeft: '4px solid #F59E0B',
          borderRadius: '4px 16px 16px 4px',
          padding: '12px 28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 20px rgba(245, 158, 11, 0.2)',
        },
        text: {
          color: '#FFFFFF',
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          letterSpacing: '0.01em',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)',
        },
      };
    case 'netflix-yellow':
      return {
        container: {
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          borderRadius: 14,
          padding: '10px 26px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.9)',
        },
        text: {
          color: '#FFE600',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          letterSpacing: '0.01em',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)',
        },
      };
    case 'gold-editorial':
      return {
        container: {
          background: 'rgba(15, 12, 8, 0.92)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 20,
          padding: '12px 30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 24px rgba(245, 158, 11, 0.25)',
        },
        text: {
          color: '#FCD34D',
          fontFamily: 'Cinzel, Georgia, serif',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)',
        },
      };
    case 'modern-explainer':
      return {
        container: {
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: 20,
          padding: '12px 28px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)',
        },
        text: {
          color: '#F8FAFC',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.01em',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
        },
      };
    case 'spotlight-blue':
      return {
        container: {
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(59, 130, 246, 0.6)',
          borderRadius: 24,
          padding: '12px 30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 26px rgba(59, 130, 246, 0.35)',
        },
        text: {
          color: '#60A5FA',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          letterSpacing: '0.01em',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)',
        },
      };
    case 'impact-red':
      return {
        container: {
          background: 'rgba(185, 28, 28, 0.92)',
          backdropFilter: 'blur(14px)',
          border: '1.5px solid rgba(254, 202, 202, 0.35)',
          borderRadius: 20,
          padding: '12px 30px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 22px rgba(239, 68, 68, 0.35)',
        },
        text: {
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
        },
      };
    case 'parallax-modern':
    default:
      return {
        container: {
          background: 'rgba(18, 16, 26, 0.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(208, 188, 255, 0.3)',
          borderRadius: 28,
          padding: '14px 32px',
          boxShadow: '0 20px 48px -10px rgba(0, 0, 0, 0.75), 0 0 24px rgba(103, 80, 164, 0.25)',
        },
        text: {
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          lineHeight: 1.24,
          letterSpacing: '-0.02em',
          textShadow: '0 4px 16px rgba(0, 0, 0, 0.95)',
        },
      };
  }
};

/**
 * 2.5D Parallax Kinetic Subtitle Layer with 2-Line Clamping
 */
const ParallaxSubtitleLayer: React.FC<{
  captions: CaptionChunk[];
  fps: number;
  styleMode?: string;
}> = ({ captions, fps, styleMode = 'parallax-modern' }) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  const activeChunk = captions.find(
    (chunk) => currentTime >= chunk.start && currentTime <= chunk.end
  );

  if (!activeChunk || !activeChunk.text?.trim()) return null;

  const chunkStartFrame = Math.floor(activeChunk.start * fps);
  const chunkLocalFrame = Math.max(0, frame - chunkStartFrame);

  // Spring entrance for punchy 2.5D pop
  const popSpring = spring({
    frame: chunkLocalFrame,
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  const scale = interpolate(popSpring, [0, 1], [0.90, 1.0]);
  const translateY = interpolate(popSpring, [0, 1], [10, 0]);
  const opacity = interpolate(popSpring, [0, 1], [0, 1]);

  const { container: containerStyle, text: textStyle } = getSubtitleCardStyle(styleMode || 'parallax-modern');

  // Clamp words to max 14 words per active chunk to prevent line overflow
  const wordsToDisplay = activeChunk.words && activeChunk.words.length > 0
    ? activeChunk.words.slice(0, 14)
    : null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '12%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        zIndex: 50,
        pointerEvents: 'none',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          textAlign: 'center',
          ...containerStyle,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 36,
            lineHeight: 1.28,
            maxHeight: '2.6em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            ...textStyle,
          }}
        >
          {wordsToDisplay ? (
            wordsToDisplay.map((w, wIdx) => {
              const isCurrent = currentTime >= w.start && currentTime <= w.end;
              const glowColor =
                styleMode === 'bold-kinetic'
                  ? '#38BDF8'
                  : styleMode === 'neon-cyan'
                  ? '#FFFFFF'
                  : styleMode === 'impact-red'
                  ? '#FEF08A'
                  : '#FACC15';
              const textShadow = isCurrent
                ? `0 0 18px ${glowColor}, 0 2px 8px rgba(0, 0, 0, 0.95)`
                : undefined;

              return (
                <span
                  key={`w-${wIdx}-${w.word}`}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.28em',
                    color: isCurrent ? glowColor : undefined,
                    textShadow,
                    fontWeight: isCurrent ? 900 : undefined,
                    transform: isCurrent ? 'scale(1.06)' : 'scale(1)',
                    transition: 'color 0.08s ease, transform 0.08s ease',
                  }}
                >
                  {w.word}
                </span>
              );
            })
          ) : (
            activeChunk.text
          )}
        </p>
      </div>
    </div>
  );
};

export const ImageToVideoAiTemplate: React.FC<ImageToVideoAiProps> = ({
  mediaSrc = '',
  audioSrc = '',
  audioUrl = '',
  bgmSrc = '',
  bgmUrl = '',
  bgmVolume = 0.15,
  scenes = [],
  captions = [],
  subtitleChunks = [],
  sfxEvents = [],
  durationSeconds = 60,
  renderWindowSeconds,
  sourceDurationSeconds,
  title = 'Image to Video AI',
  subtitleStyle = 'parallax-modern',
  fitMode = 'cover',
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  const finalAudioUrl = resolveUrl(audioUrl || audioSrc || mediaSrc);
  const finalBgmUrl = resolveUrl(bgmUrl || bgmSrc);
  const activeCaptions = captions.length > 0 ? captions : subtitleChunks;

  const totalDuration = Math.max(
    5,
    Number(durationSeconds) || Number(renderWindowSeconds) || Number(sourceDurationSeconds) || 60
  );

  const rawScenes = scenes.length > 0
    ? scenes
    : [
        {
          id: 'scene-default-1',
          startSeconds: 0,
          endSeconds: totalDuration,
          imageUrl: FALLBACK_SCENE_IMAGE,
          cameraMotion: 'zoom-in',
          transition: 'dissolve',
          fitMode,
        },
      ];

  // Enforce Max 4-6s Scene Pacing Rule: Subdivide visual scenes > 6.0s with continuous parent duration tracking
  const defaultScenes: ImageToVideoScene[] = [];
  rawScenes.forEach((scene, sceneIdx) => {
    const sceneDur = scene.endSeconds - scene.startSeconds;
    if (sceneDur > 6.0) {
      const numCuts = Math.ceil(sceneDur / 5.0);
      const cutDur = sceneDur / numCuts;
      for (let c = 0; c < numCuts; c++) {
        const cutStart = scene.startSeconds + c * cutDur;
        const cutEnd = Math.min(scene.endSeconds, cutStart + cutDur);
        const isEvenCut = (sceneIdx + c) % 2 === 0;
        defaultScenes.push({
          ...scene,
          id: `${scene.id || 'scene-' + sceneIdx}-cut-${c + 1}`,
          startSeconds: cutStart,
          endSeconds: cutEnd,
          parentStartSeconds: scene.startSeconds,
          parentEndSeconds: scene.endSeconds,
          cameraMotion: (scene.cameraMotion || (isEvenCut ? 'zoom-in' : 'zoom-out')) as ImageToVideoScene['cameraMotion'],
          transition: scene.transition as ImageToVideoScene['transition'],
        });
      }
    } else {
      const isEvenScene = sceneIdx % 2 === 0;
      defaultScenes.push({
        ...scene,
        parentStartSeconds: scene.startSeconds,
        parentEndSeconds: scene.endSeconds,
        cameraMotion: (scene.cameraMotion || (isEvenScene ? 'zoom-in' : 'zoom-out')) as ImageToVideoScene['cameraMotion'],
        transition: scene.transition as ImageToVideoScene['transition'],
      });
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0c' }}>
      {/* 1. SCENE SEQUENCE LAYER */}
      {defaultScenes.map((scene, idx) => {
        const startFrame = Math.max(0, Math.floor(scene.startSeconds * fps));
        const endFrame = Math.max(startFrame + 1, Math.floor(scene.endSeconds * fps));
        const durationInFrames = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={scene.id || `scene-${idx}`}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <SceneRenderer
              scene={scene}
              nextScene={defaultScenes[idx + 1]}
              fps={fps}
              sceneIndex={idx}
              globalFitMode={fitMode}
            />
          </Sequence>
        );
      })}

      {/* 2. 35mm FILM GRAIN & ANAMORPHIC VIGNETTE OVERLAY */}
      <FilmGrainOverlay />

      {/* 3. 2.5D PARALLAX SUBTITLE LAYER */}
      {activeCaptions.length > 0 && (
        <ParallaxSubtitleLayer
          captions={activeCaptions}
          fps={fps}
          styleMode={subtitleStyle}
        />
      )}

      {/* 4. SLEEK YOUTUBE PROGRESS BAR */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'rgba(255, 255, 255, 0.12)',
          zIndex: 60,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, (currentTime / totalDuration) * 100))}%`,
            background: 'linear-gradient(90deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)',
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.85)',
          }}
        />
      </div>

      {/* 5. SOUND EFFECTS LAYER */}
      {sfxEvents.map((sfx, sfxIdx) => {
        const sfxUrl = resolveUrl(sfx.sfxUrl);
        if (!isValidAudioUrl(sfxUrl) || (sfx.volume ?? 0.28) <= 0) return null;
        const totalDurationFrames = Math.floor(totalDuration * fps);
        const startFrame = Math.max(0, sfx.startFrame);
        if (startFrame >= totalDurationFrames) return null;
        const durationInFrames = Math.min(Math.round(fps * 2.5), Math.max(1, totalDurationFrames - startFrame));

        return (
          <Sequence
            key={sfx.id || `sfx-${sfxIdx}`}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <Audio
              src={sfxUrl}
              volume={sfx.volume ?? 0.28}
            />
          </Sequence>
        );
      })}

      {/* 6. BACKGROUND MUSIC */}
      {isValidAudioUrl(finalBgmUrl) && bgmVolume > 0 && (
        <Audio
          src={finalBgmUrl}
          volume={bgmVolume}
          loop
        />
      )}

      {/* 7. PRIMARY VOICEOVER SPEECH AUDIO */}
      {isValidAudioUrl(finalAudioUrl) && (
        <Audio
          src={finalAudioUrl}
          volume={1.0}
        />
      )}
    </AbsoluteFill>
  );
};

export const ImageToVideoAiComposition: React.FC = () => (
  <Composition
    id="IMAGE-TO-VIDEO-AI"
    component={ImageToVideoAiTemplate}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1920}
    height={1080}
    defaultProps={{
      durationSeconds: 60,
      title: 'Image to Video AI',
      subtitleStyle: 'parallax-modern',
      scenes: [],
    }}
    calculateMetadata={({ props }) => {
      const p = props as ImageToVideoAiProps;
      const rawDuration =
        Number(p.durationSeconds) ||
        Number(p.renderWindowSeconds) ||
        Number(p.sourceDurationSeconds) ||
        60;
      // Max 12 minutes (720s)
      const durationSeconds = Math.max(5, Math.min(720, rawDuration));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1920,
        height: 1080,
      };
    }}
  />
);
