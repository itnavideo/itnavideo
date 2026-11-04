import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import { UniversalCaptionLayer, CaptionChunk } from '../../components/library/UniversalCaptionLayer';

export interface ImageToVideoScene {
  id: string;
  startSeconds: number;
  endSeconds: number;
  parentStartSeconds?: number;
  parentEndSeconds?: number;
  imageUrl?: string;
  text?: string;
  cameraMotion?:
    | 'zoom-in'
    | 'zoom-out'
    | 'pan-left'
    | 'pan-right'
    | 'pan-up'
    | 'pan-down'
    | 'diagonal-tl-br'
    | 'diagonal-br-tl'
    | 'push-in'
    | 'pull-back';
  transition?: 'hard-cut' | 'dissolve' | 'push-left' | 'push-right';
  title?: string;
  fitMode?: 'blur-fill' | 'cover';
  sceneType?: 'image';
  objectPosition?: string;
  storyBeat?: 'hook' | 'buildup' | 'climax' | 'resolution';
  storyBeatTitle?: string;
  speechEnergy?: 'high-energy' | 'steady-story' | 'ambient-pause';
}

export interface ImageToVideoAiProps {
  mediaSrc?: string;
  audioSrc?: string;
  audioUrl?: string;
  bgmUrl?: string;
  bgmVolume?: number;
  scenes?: ImageToVideoScene[];
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  durationSeconds?: number;
  renderWindowSeconds?: number;
  sourceDurationSeconds?: number;
  title?: string;
  fitMode?: 'blur-fill' | 'cover';
  aspectRatio?: '16:9';
  captionThemeId?: string;
  subtitleStyle?: string;
  removeAiWatermark?: boolean;
  [key: string]: any;
}

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

/**
 * Subtle Ken Burns Camera Motion & Scene Renderer
 * Restricted strictly to user-uploaded images.
 */
const SceneRenderer: React.FC<{
  scene: ImageToVideoScene;
  fps: number;
  sceneIndex?: number;
  globalFitMode?: 'blur-fill' | 'cover';
  visualStyle?: string;
  removeAiWatermark?: boolean;
}> = ({ scene, fps, sceneIndex = 0, globalFitMode = 'cover', visualStyle, removeAiWatermark = false }) => {
  const frame = useCurrentFrame();

  const parentStart = scene.parentStartSeconds ?? scene.startSeconds;
  const parentEnd = scene.parentEndSeconds ?? scene.endSeconds;
  const globalCurrentTime = scene.startSeconds + frame / fps;
  const parentDurationSeconds = Math.max(0.1, parentEnd - parentStart);
  const progress = Math.min(1, Math.max(0, (globalCurrentTime - parentStart) / parentDurationSeconds));

  const effectiveFitMode = scene.fitMode || globalFitMode || 'cover';

  // Subtle, professional, restrained image-only motion
  const isEvenScene = sceneIndex % 2 === 0;
  const motion = scene.cameraMotion || (isEvenScene ? 'zoom-in' : 'zoom-out');

  let scale = 1.04;
  let translateX = 0;
  let translateY = 0;

  switch (motion) {
    case 'zoom-in':
    case 'push-in':
      if (scene.storyBeat === 'climax' || scene.speechEnergy === 'high-energy') {
        // High energy speech / climax: dramatic dynamic punch-in zoom
        scale = interpolate(progress, [0, 1], [1.02, 1.15], {
          extrapolateRight: 'clamp',
          extrapolateLeft: 'clamp',
        });
      } else {
        scale = interpolate(progress, [0, 1], [1.02, 1.07], {
          extrapolateRight: 'clamp',
          extrapolateLeft: 'clamp',
        });
      }
      break;
    case 'zoom-out':
    case 'pull-back':
      if (scene.storyBeat === 'hook') {
        // Hook: energetic initial presence pulling out to reveal full scene
        scale = interpolate(progress, [0, 1], [1.12, 1.03], {
          extrapolateRight: 'clamp',
          extrapolateLeft: 'clamp',
        });
      } else if (scene.storyBeat === 'resolution' || scene.speechEnergy === 'ambient-pause') {
        // Resolution / ambient pause: gentle settling drift
        scale = interpolate(progress, [0, 1], [1.05, 1.01], {
          extrapolateRight: 'clamp',
          extrapolateLeft: 'clamp',
        });
      } else {
        scale = interpolate(progress, [0, 1], [1.08, 1.02], {
          extrapolateRight: 'clamp',
          extrapolateLeft: 'clamp',
        });
      }
      break;
    case 'pan-left':
      // Gentle, slow panoramic glide during narrative explanation
      scale = scene.speechEnergy === 'high-energy' ? 1.09 : 1.06;
      translateX = interpolate(progress, [0, 1], [1.6, -1.6], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'pan-right':
      scale = scene.speechEnergy === 'high-energy' ? 1.09 : 1.06;
      translateX = interpolate(progress, [0, 1], [-1.6, 1.6], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'pan-up':
      scale = 1.08;
      translateY = interpolate(progress, [0, 1], [1.5, -1.5], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'pan-down':
      scale = 1.08;
      translateY = interpolate(progress, [0, 1], [-1.5, 1.5], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'diagonal-tl-br':
      scale = interpolate(progress, [0, 1], [1.04, 1.09], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      translateX = interpolate(progress, [0, 1], [-1.2, 1.2], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      translateY = interpolate(progress, [0, 1], [-1.0, 1.0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'diagonal-br-tl':
      scale = interpolate(progress, [0, 1], [1.09, 1.04], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      translateX = interpolate(progress, [0, 1], [1.2, -1.2], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      translateY = interpolate(progress, [0, 1], [1.0, -1.0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'push-in':
      scale = interpolate(progress, [0, 1], [1.02, 1.10], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'pull-back':
      scale = interpolate(progress, [0, 1], [1.10, 1.02], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    default:
      scale = interpolate(progress, [0, 1], [1.02, 1.08], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
  }

  // Smooth cross-dissolve transition
  if (removeAiWatermark) {
    scale = scale * 1.07;
  }
  const sceneDurationFrames = Math.max(1, Math.round((scene.endSeconds - scene.startSeconds) * fps));
  const transitionFrames = Math.min(12, Math.floor(sceneDurationFrames * 0.2));

  let opacity = 1;
  if (scene.transition !== 'hard-cut' && transitionFrames > 0) {
    opacity = interpolate(frame, [0, transitionFrames], [0, 1], {
      extrapolateRight: 'clamp',
    });
  }

  const resolvedImage = resolveUrl(scene.imageUrl);
  if (!resolvedImage) return null;

  const visualStyleFilter = (() => {
    if (!visualStyle) return 'none';
    const v = visualStyle.toLowerCase();
    if (v.includes('film') || v.includes('cinema')) return 'contrast(1.05) saturate(1.06)';
    if (v.includes('dark') || v.includes('mystery')) return 'contrast(1.12) brightness(0.92) saturate(0.88)';
    if (v.includes('3d')) return 'saturate(1.12) contrast(1.03)';
    if (v.includes('anime') || v.includes('storybook')) return 'brightness(1.03) saturate(1.08)';
    return 'none';
  })();

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        filter: visualStyleFilter,
      }}
    >
      {effectiveFitMode === 'blur-fill' ? (
        <>
          {/* Ambient Blurred Backdrop for Non-16:9 Images */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              filter: 'blur(28px) brightness(0.7)',
              transform: `scale(${scale * 1.06})`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          >
            <Img
              src={resolvedImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          {/* Centered Contained Subject */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
              transformOrigin: 'center center',
            }}
          >
            <Img
              src={resolvedImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </>
      ) : (
        /* Full Widescreen 16:9 Cover Fit with Responsive Subject-Aware Framing */
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
            transformOrigin: scene.objectPosition || 'center 35%',
          }}
        >
          <Img
            src={resolvedImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: scene.objectPosition || 'center 35%',
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

/**
 * Clean White Editorial Ambient Background for Image to Video AI
 * Pure White (#FFFFFF / #FAFAFA) canvas with delicate grid texture and soft warm ambient blooms.
 */
const SubtleAmbientBackground: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const t = frame / fps;
  const pulseOpacity = interpolate(Math.sin(t * 0.8), [-1, 1], [0.03, 0.07]);
  const gradientAngle = (t * 8) % 360;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAFA', overflow: 'hidden' }}>
      {/* 1. Delicate Light Grey Dot Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.05) 1.5px, transparent 1.5px)`,
          backgroundSize: '36px 36px',
          opacity: 0.85,
        }}
      />

      {/* 2. Soft Warm Orange & Amber Ambient Bloom (Top-Left) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 87, 34, ${pulseOpacity}) 0%, rgba(255, 160, 0, 0.02) 60%, transparent 80%)`,
          filter: 'blur(100px)',
          transform: `rotate(${gradientAngle}deg) scale(${1 + Math.sin(t * 0.4) * 0.04})`,
        }}
      />

      {/* 3. Soft Subtle Slate Warm Ambient Glow (Bottom-Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 143, 0, 0.04) 0%, rgba(241, 245, 249, 0.6) 50%, transparent 80%)`,
          filter: 'blur(90px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const ImageToVideoAiTemplate: React.FC<ImageToVideoAiProps> = ({
  mediaSrc = '',
  audioSrc = '',
  audioUrl = '',
  bgmUrl = '',
  bgmVolume = 0.12,
  scenes = [],
  captions = [],
  subtitleChunks = [],
  durationSeconds = 60,
  renderWindowSeconds,
  sourceDurationSeconds,
  fitMode = 'cover',
  visualStyle = 'cinematic-film',
  captionThemeId = 'glow-viral',
  subtitleStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const finalAudioUrl = resolveUrl(audioUrl || audioSrc || mediaSrc);
  const finalBgmUrl = resolveUrl(bgmUrl);
  const activeCaptions = captions.length > 0 ? captions : subtitleChunks;
  const activeCaptionTheme = captionThemeId || subtitleStyle || 'glow-viral';

  const validScenes = scenes.filter((s) => s && s.imageUrl);

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAFA' }}>
      {/* 1. CLEAN WHITE AMBIENT BACKGROUND */}
      <SubtleAmbientBackground frame={frame} fps={fps} />

      {/* 2. SCENE SEQUENCE LAYER (100% User Uploaded Images Only) */}
      {validScenes.map((scene, idx) => {
        const startFrame = Math.max(0, Math.floor(scene.startSeconds * fps));
        const endFrame = Math.max(startFrame + 1, Math.floor(scene.endSeconds * fps));
        const durationInFrames = Math.max(1, endFrame - startFrame) + (idx < validScenes.length - 1 ? 12 : 0);

        return (
          <Sequence
            key={scene.id || `scene-${idx}`}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <SceneRenderer
              scene={scene}
              fps={fps}
              sceneIndex={idx}
              globalFitMode={fitMode}
              visualStyle={visualStyle}
            />
          </Sequence>
        );
      })}

      {/* 3. SCENE TRANSITION SFX EVENTS */}
      {validScenes.map((s, idx) => {
        const startFrame = Math.max(0, Math.floor(s.startSeconds * fps));
        const sfxFile = idx === 0 ? 'assets/reusable/sfx/chime.mp3' : 'assets/reusable/sfx/pop.mp3';
        return (
          <Sequence key={`sfx-${s.id || idx}`} from={startFrame} durationInFrames={Math.round(fps * 1.5)}>
            <Audio src={resolveUrl(sfxFile)} volume={0.22} />
          </Sequence>
        );
      })}

      {/* 4. UNIVERSAL 20 CAPTION STYLES SYNCHRONIZED WITH AUDIO */}
      {activeCaptions.length > 0 && (
        <UniversalCaptionLayer
          captions={activeCaptions}
          captionThemeId={activeCaptionTheme}
          backgroundTheme="solid-white"
          styleOverrides={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
            color: '#0F172A',
            textShadow: 'none',
            filter: 'none',
          }}
        />
      )}

      {/* 5. ORIGINAL USER SPEECH AUDIO */}
      {isValidAudioUrl(finalAudioUrl) && (
        <Audio
          src={finalAudioUrl}
          volume={1.0}
        />
      )}

      {/* 6. BACKGROUND MUSIC (12% Default, user adjustable) */}
      {isValidAudioUrl(finalBgmUrl) && finalBgmUrl !== 'none' && (
        <Audio
          src={finalBgmUrl}
          volume={Math.max(0, Math.min(1, typeof bgmVolume === 'number' ? bgmVolume : 0.12))}
          loop
        />
      )}
      {!finalBgmUrl && bgmUrl !== 'none' && (
        <Audio
          src={resolveUrl('assets/reusable/music/parasail-silent-partner.mp3')}
          volume={Math.max(0, Math.min(1, typeof bgmVolume === 'number' ? bgmVolume : 0.12))}
          loop
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
      scenes: [],
    }}
    calculateMetadata={({ props }) => {
      const p = props as ImageToVideoAiProps;
      const rawDuration =
        Number(p.durationSeconds) ||
        Number(p.renderWindowSeconds) ||
        Number(p.sourceDurationSeconds) ||
        60;
      // Max 5 minutes (300s)
      const durationSeconds = Math.max(3, Math.min(300, rawDuration));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1920,
        height: 1080,
      };
    }}
  />
);

