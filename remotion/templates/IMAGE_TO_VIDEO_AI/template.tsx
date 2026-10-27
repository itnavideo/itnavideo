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
import type { CaptionChunk } from '../../components/library/UniversalCaptionLayer';

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
}> = ({ scene, fps, sceneIndex = 0, globalFitMode = 'cover' }) => {
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
      scale = interpolate(progress, [0, 1], [1.02, 1.08], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'zoom-out':
      scale = interpolate(progress, [0, 1], [1.08, 1.02], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'pan-left':
      scale = 1.07;
      translateX = interpolate(progress, [0, 1], [1.5, -1.5], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
      break;
    case 'pan-right':
      scale = 1.07;
      translateX = interpolate(progress, [0, 1], [-1.5, 1.5], {
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

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: 'hidden',
        backgroundColor: 'transparent',
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
 * Simple, Highly Readable Subtitle Layer
 * Pure white text on subtle translucent backing, synchronized strictly to spoken audio.
 * Zero kinetic bouncy animations, zero neon colors, zero oversized typography.
 */
const SimpleReadableSubtitleLayer: React.FC<{
  captions: CaptionChunk[];
  fps: number;
}> = ({ captions, fps }) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  const activeChunk = captions.find(
    (chunk) => currentTime >= chunk.start && currentTime <= chunk.end
  );

  if (!activeChunk || !activeChunk.text?.trim()) return null;

  // Gentle opacity fade on subtitle boundary (3 frames)
  const chunkStartFrame = Math.floor(activeChunk.start * fps);
  const chunkLocalFrame = Math.max(0, frame - chunkStartFrame);
  const opacity = interpolate(chunkLocalFrame, [0, 3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
        zIndex: 50,
        pointerEvents: 'none',
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.72)',
          borderRadius: 12,
          padding: '8px 24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#FFFFFF',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            letterSpacing: '0.01em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {activeChunk.text.trim()}
        </p>
      </div>
    </div>
  );
};

export const ImageToVideoAiTemplate: React.FC<ImageToVideoAiProps> = ({
  mediaSrc = '',
  audioSrc = '',
  audioUrl = '',
  bgmUrl = '',
  bgmVolume = 0.15,
  scenes = [],
  captions = [],
  subtitleChunks = [],
  durationSeconds = 60,
  renderWindowSeconds,
  sourceDurationSeconds,
  fitMode = 'cover',
}) => {
  const { fps } = useVideoConfig();

  const finalAudioUrl = resolveUrl(audioUrl || audioSrc || mediaSrc);
  const finalBgmUrl = resolveUrl(bgmUrl);
  const activeCaptions = captions.length > 0 ? captions : subtitleChunks;

  const totalDuration = Math.max(
    3,
    Number(durationSeconds) || Number(renderWindowSeconds) || Number(sourceDurationSeconds) || 60
  );

  const validScenes = scenes.filter((s) => s && s.imageUrl);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* 1. SCENE SEQUENCE LAYER (100% User Uploaded Images Only) */}
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
            />
          </Sequence>
        );
      })}

      {/* 2. SIMPLE, READABLE CAPTIONS SYNCHRONIZED WITH AUDIO */}
      {activeCaptions.length > 0 && (
        <SimpleReadableSubtitleLayer
          captions={activeCaptions}
          fps={fps}
        />
      )}

      {/* 3. ORIGINAL USER SPEECH AUDIO ONLY */}
      {isValidAudioUrl(finalAudioUrl) && (
        <Audio
          src={finalAudioUrl}
          volume={1.0}
        />
      )}

      {/* 4. OPTIONAL BACKGROUND MUSIC (DUCKED UNDER SPEECH) */}
      {isValidAudioUrl(finalBgmUrl) && (
        <Audio
          src={finalBgmUrl}
          volume={Math.max(0, Math.min(1, typeof bgmVolume === 'number' ? bgmVolume : 0.15))}
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

