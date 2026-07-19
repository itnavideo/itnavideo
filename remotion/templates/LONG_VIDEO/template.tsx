/**
 * LONG VIDEO — Master template for fully-produced long-form videos.
 *
 * Takes a Gemini scene plan and renders a complete professional video:
 * - Title cards with motion
 * - Narration with synced captions
 * - Typography keyword emphasis
 * - Image/screenshot reveals with Ken Burns
 * - Callout text with bullet points
 * - Transitions between sections
 * - Full background music + SFX
 *
 * 16:9, up to 10 minutes.
 */

import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {resolveFont} from '../../utils/fonts';

const TITLE_FONT = resolveFont('Montserrat');
const BODY_FONT = resolveFont('Inter');

type SceneType = 'title' | 'narration' | 'typography' | 'image' | 'callout' | 'transition';
type MotionType = 'fade' | 'slide-left' | 'slide-right' | 'zoom-in' | 'scale-up' | 'none';

type Scene = {
  type: SceneType;
  startSeconds: number;
  endSeconds: number;
  text?: string;
  keyword?: string;
  imageSrc?: string;
  bullets?: string[];
  motion?: MotionType;
  sfx?: string;
};

type Caption = {
  start: number;
  end: number;
  text: string;
};

type LongVideoProps = {
  mediaSrc?: string;
  mediaType?: 'audio' | 'video';
  durationSeconds?: number;
  scenes?: Scene[];
  captions?: Caption[];
  title?: string;
  backgroundMusicSrc?: string;
  musicVolume?: number;
  sourceAudioVolume?: number;
};

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

// ─── Scene Renderers ───

function TitleScene({scene, progress}: {scene: Scene; progress: number}) {
  const scale = interpolate(progress, [0, 0.3, 0.85, 1], [0.85, 1, 1, 0.95], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', opacity, transform: `scale(${scale})`}}>
      <h1 style={{fontFamily: TITLE_FONT, fontSize: 72, fontWeight: 900, color: '#F8FAFC', textAlign: 'center', maxWidth: '80%', lineHeight: 1.1, letterSpacing: -2, textShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>
        {scene.text || 'Title'}
      </h1>
    </AbsoluteFill>
  );
}

function TypographyScene({scene, progress}: {scene: Scene; progress: number}) {
  const scale = interpolate(progress, [0, 0.2, 0.8, 1], [0.7, 1.05, 1, 0.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = interpolate(progress, [0, 0.1, 0.85, 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', opacity}}>
      <div style={{transform: `scale(${scale})`, textAlign: 'center', padding: '0 60px'}}>
        <p style={{fontFamily: TITLE_FONT, fontSize: 96, fontWeight: 900, color: '#22D3EE', lineHeight: 1.0, letterSpacing: -3, textShadow: '0 6px 32px rgba(34,211,238,0.3)'}}>
          {scene.keyword || scene.text || ''}
        </p>
      </div>
    </AbsoluteFill>
  );
}

function ImageScene({scene, progress}: {scene: Scene; progress: number}) {
  const src = resolveAsset(scene.imageSrc || '');
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kenBurns = interpolate(progress, [0, 1], [1, 1.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  if (!src) return null;

  return (
    <AbsoluteFill style={{opacity}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${kenBurns})`, background: '#0F172A'}} />
    </AbsoluteFill>
  );
}

function CalloutScene({scene, progress}: {scene: Scene; progress: number}) {
  const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bullets = scene.bullets || [scene.text || ''];

  return (
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.92)', opacity}}>
      <div style={{maxWidth: '75%'}}>
        {bullets.map((bullet, i) => {
          const delay = i * 0.12;
          const itemProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
          const x = interpolate(itemProgress, [0, 0.3], [40, 0], {extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, opacity: itemProgress, transform: `translateX(${x}px)`}}>
              <div style={{width: 10, height: 10, borderRadius: '50%', background: '#22D3EE', flexShrink: 0}} />
              <p style={{fontFamily: BODY_FONT, fontSize: 36, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.4}}>{bullet}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function TransitionScene({progress}: {progress: number}) {
  const opacity = interpolate(progress, [0, 0.5, 1], [0, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#0F172A', opacity}} />;
}

// ─── Caption Overlay ───

function CaptionOverlay({captions, frame, fps}: {captions: Caption[]; frame: number; fps: number}) {
  const time = frame / fps;
  const active = captions.find(c => time >= c.start && time < c.end);
  if (!active) return null;

  return (
    <div style={{position: 'absolute', bottom: 80, left: 80, right: 80, display: 'flex', justifyContent: 'center', zIndex: 50}}>
      <span style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: '14px 28px',
        fontFamily: BODY_FONT,
        fontSize: 32,
        fontWeight: 700,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: '90%',
      }}>
        {active.text}
      </span>
    </div>
  );
}

// ─── Main Composition ───

function LongVideo({
  mediaSrc = '',
  mediaType = 'audio',
  scenes = [],
  captions = [],
  title = 'Video',
  backgroundMusicSrc = '',
  musicVolume = 0.12,
  sourceAudioVolume = 1,
}: LongVideoProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const resolvedMedia = resolveAsset(mediaSrc);
  const resolvedMusic = resolveAsset(backgroundMusicSrc);

  // Find active scene
  const activeScene = useMemo(() => {
    return scenes.find(s => time >= s.startSeconds && time < s.endSeconds) || null;
  }, [scenes, time]);

  // Scene progress (0-1 within the active scene)
  const sceneProgress = activeScene
    ? (time - activeScene.startSeconds) / Math.max(0.1, activeScene.endSeconds - activeScene.startSeconds)
    : 0;

  return (
    <AbsoluteFill style={{background: '#0F172A'}}>
      {/* Source audio/video (primary narration) */}
      {resolvedMedia && mediaType === 'video' ? (
        <OffthreadVideo src={resolvedMedia} style={{width: '100%', height: '100%', objectFit: 'cover'}} volume={sourceAudioVolume} />
      ) : null}
      {resolvedMedia && mediaType === 'audio' ? (
        <Audio src={resolvedMedia} volume={sourceAudioVolume} />
      ) : null}

      {/* Background music */}
      {resolvedMusic ? <Audio src={resolvedMusic} volume={musicVolume} loop /> : null}

      {/* Scene layers (render on top of video if video source) */}
      {activeScene?.type === 'title' ? <TitleScene scene={activeScene} progress={sceneProgress} /> : null}
      {activeScene?.type === 'typography' ? <TypographyScene scene={activeScene} progress={sceneProgress} /> : null}
      {activeScene?.type === 'image' ? <ImageScene scene={activeScene} progress={sceneProgress} /> : null}
      {activeScene?.type === 'callout' ? <CalloutScene scene={activeScene} progress={sceneProgress} /> : null}
      {activeScene?.type === 'transition' ? <TransitionScene progress={sceneProgress} /> : null}
      {/* narration type = no overlay, just captions below */}

      {/* Caption overlay */}
      <CaptionOverlay captions={captions} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
}

// ─── Composition Registration ───

export {LongVideo};

export const LongVideoComposition = () => (
  <Composition
    id="LONG-VIDEO"
    component={LongVideo}
    durationInFrames={18000}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      mediaSrc: '',
      mediaType: 'audio' as const,
      durationSeconds: 600,
      title: 'Long Video',
      scenes: [],
      captions: [],
      backgroundMusicSrc: '',
    }}
    calculateMetadata={({props}) => {
      const p = props as LongVideoProps;
      const dur = Math.max(8, Math.min(600, Number(p.durationSeconds) || 60));
      return {durationInFrames: Math.ceil(dur * 30), fps: 30, width: 1920, height: 1080};
    }}
  />
);
