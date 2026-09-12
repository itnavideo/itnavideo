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
  imageUrl: string;
  text?: string;
  cameraMotion?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
  transition?: 'hard-cut' | 'dissolve' | 'push-left' | 'push-right';
  title?: string;
  fitMode?: 'blur-fill' | 'cover';
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
  subtitleStyle?: 'parallax-modern' | 'kinetic-glow' | 'minimalist';
  fitMode?: 'blur-fill' | 'cover';
}

const FALLBACK_SCENE_IMAGE = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788780290/ChatGPT_Image_Sep_7_2026_04_53_09_PM_suv9x7.png';

const resolveUrl = (src?: string) => {
  if (!src) return '';
  return /^(https?:|data:|blob:)/i.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
};

const resolveImageUrl = (src?: string) => {
  const url = resolveUrl(src);
  return url || FALLBACK_SCENE_IMAGE;
};

/**
 * Ken Burns Camera Motion & Scene Renderer
 */
const SceneRenderer: React.FC<{
  scene: ImageToVideoScene;
  nextScene?: ImageToVideoScene;
  fps: number;
  globalFitMode?: 'blur-fill' | 'cover';
}> = ({ scene, fps, globalFitMode = 'blur-fill' }) => {
  const frame = useCurrentFrame();
  const sceneDurationFrames = Math.max(1, Math.round((scene.endSeconds - scene.startSeconds) * fps));
  const progress = Math.min(1, Math.max(0, frame / sceneDurationFrames));

  const effectiveFitMode = scene.fitMode || globalFitMode || 'blur-fill';

  // Ken Burns Motion Interpolation
  const motion = scene.cameraMotion || 'zoom-in';

  let scale = 1.0;
  let translateX = 0;
  let translateY = 0;

  switch (motion) {
    case 'zoom-in':
      // Continuous slow zoom from 1.0 to 1.18
      scale = interpolate(progress, [0, 1], [1.0, 1.18]);
      translateX = interpolate(progress, [0, 1], [0, -1]);
      translateY = interpolate(progress, [0, 1], [0, -1]);
      break;
    case 'zoom-out':
      // Continuous slow zoom out from 1.22 to 1.04
      scale = interpolate(progress, [0, 1], [1.22, 1.04]);
      translateX = interpolate(progress, [0, 1], [-1, 0]);
      translateY = interpolate(progress, [0, 1], [-1, 0]);
      break;
    case 'pan-left':
      // Horizontal pan left with 1.12 scale
      scale = 1.12;
      translateX = interpolate(progress, [0, 1], [3, -3]);
      break;
    case 'pan-right':
      // Horizontal pan right with 1.12 scale
      scale = 1.12;
      translateX = interpolate(progress, [0, 1], [-3, 3]);
      break;
    case 'pan-up':
      // Vertical pan up (ideal for 9:16 portrait images)
      scale = 1.14;
      translateY = interpolate(progress, [0, 1], [3.5, -3.5]);
      break;
    case 'pan-down':
      // Vertical pan down (ideal for 9:16 portrait images)
      scale = 1.14;
      translateY = interpolate(progress, [0, 1], [-3.5, 3.5]);
      break;
    default:
      scale = interpolate(progress, [0, 1], [1.0, 1.15]);
  }

  // Transitions
  const transition = scene.transition || 'dissolve';
  const transitionFrames = Math.min(15, Math.floor(sceneDurationFrames * 0.25));

  let opacity = 1;
  let transitionPushX = 0;

  if (transition === 'dissolve' && transitionFrames > 0) {
    // Smooth crossfade enter
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

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${transitionPushX}%)`,
        overflow: 'hidden',
        backgroundColor: '#0a0a0c',
      }}
    >
      {/* 1. Full 16:9 Ambient Blurred Fill Layer - Guarantees 100% canvas utilization without empty black pillarboxes */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          overflow: 'hidden',
          filter: 'blur(42px) brightness(0.55) saturate(1.3)',
          transform: `scale(${scale * 1.10}) translate(${translateX * 0.4}%, ${translateY * 0.4}%)`,
          transformOrigin: 'center center',
          pointerEvents: 'none',
        }}
      >
        <Img
          src={resolveImageUrl(scene.imageUrl)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* 2. Foreground Subject Layer - Dynamic Fit for 9:16 portrait and 16:9 widescreen images */}
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
          <div
            style={{
              height: '92%',
              maxWidth: '92%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 22,
              overflow: 'hidden',
              boxShadow:
                '0 28px 70px rgba(0, 0, 0, 0.70), 0 0 0 1px rgba(255, 255, 255, 0.14)',
            }}
          >
            <Img
              src={resolveImageUrl(scene.imageUrl)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* Cinematic Vignette & Ambient Gradient for Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.35) 80%, rgba(0, 0, 0, 0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Lower Third Ambient Shadow for Subtitle Readability */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '42%',
          background:
            'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.45) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 2.5D Parallax Kinetic Subtitle Layer
 */
const ParallaxSubtitleLayer: React.FC<{
  captions: CaptionChunk[];
  fps: number;
  styleMode?: 'parallax-modern' | 'kinetic-glow' | 'minimalist';
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
  const translateY = interpolate(popSpring, [0, 1], [12, 0]);
  const opacity = interpolate(popSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 85,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 64px',
        zIndex: 50,
        pointerEvents: 'none',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          textAlign: 'center',
          background:
            styleMode === 'parallax-modern'
              ? 'rgba(18, 16, 26, 0.78)'
              : styleMode === 'kinetic-glow'
                ? 'rgba(0, 0, 0, 0.85)'
                : 'transparent',
          backdropFilter: 'blur(16px)',
          border:
            styleMode === 'parallax-modern'
              ? '1px solid rgba(208, 188, 255, 0.25)'
              : styleMode === 'kinetic-glow'
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : 'none',
          padding: '16px 36px',
          borderRadius: 28,
          boxShadow: '0 20px 48px -10px rgba(0, 0, 0, 0.75), 0 0 24px rgba(103, 80, 164, 0.25)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 44,
            fontWeight: 800,
            lineHeight: 1.24,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.95)',
          }}
        >
          {activeChunk.text}
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
  fitMode = 'blur-fill',
}) => {
  const { fps } = useVideoConfig();

  const finalAudioUrl = resolveUrl(audioUrl || audioSrc || mediaSrc);
  const finalBgmUrl = resolveUrl(bgmUrl || bgmSrc);
  const activeCaptions = captions.length > 0 ? captions : subtitleChunks;

  const totalDuration = Math.max(
    5,
    Number(durationSeconds) || Number(renderWindowSeconds) || Number(sourceDurationSeconds) || 60
  );

  // If no scenes provided, build fallback scenes using library image
  const defaultScenes: ImageToVideoScene[] =
    scenes.length > 0
      ? scenes
      : [
          {
            id: 'scene-default-1',
            startSeconds: 0,
            endSeconds: totalDuration,
            imageUrl:
              'https://res.cloudinary.com/dhouh9idx/image/upload/v1788780290/ChatGPT_Image_Sep_7_2026_04_53_09_PM_suv9x7.png',
            cameraMotion: 'zoom-in',
            transition: 'dissolve',
            fitMode,
          },
        ];

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
              globalFitMode={fitMode}
            />
          </Sequence>
        );
      })}

      {/* 2. 2.5D PARALLAX SUBTITLE LAYER */}
      {activeCaptions.length > 0 && (
        <ParallaxSubtitleLayer
          captions={activeCaptions}
          fps={fps}
          styleMode={subtitleStyle}
        />
      )}

      {/* 3. SOUND EFFECTS LAYER (WHOOSH / RISER / AMBIENT HITS ON SCENES) */}
      {sfxEvents.map((sfx, sfxIdx) => {
        const sfxUrl = resolveUrl(sfx.sfxUrl);
        if (!sfxUrl) return null;

        return (
          <Sequence
            key={sfx.id || `sfx-${sfxIdx}`}
            from={Math.max(0, sfx.startFrame)}
            durationInFrames={Math.round(fps * 2.5)}
          >
            <Audio
              src={sfxUrl}
              volume={sfx.volume ?? 0.28}
            />
          </Sequence>
        );
      })}

      {/* 4. BACKGROUND MUSIC (BGM with volume ducking) */}
      {finalBgmUrl && (
        <Audio
          src={finalBgmUrl}
          volume={bgmVolume}
          loop
        />
      )}

      {/* 5. PRIMARY VOICEOVER SPEECH AUDIO */}
      {finalAudioUrl && (
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
      // Max 30 minutes (1800s)
      const durationSeconds = Math.max(5, Math.min(1800, rawDuration));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1920,
        height: 1080,
      };
    }}
  />
);
