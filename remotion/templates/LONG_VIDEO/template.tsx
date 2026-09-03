/**
 * LONG VIDEO — Master template for fully-produced long-form videos.
 *
 * Takes a Gemini scene plan and renders a complete professional video:
 * - Title cards with motion
 * - Narration with synced captions
 * - Typography keyword emphasis
 * - Image/screenshot reveals with Ken Burns
 * - Animated Charts & Callout text
 * - Progress Indicator Bar & Top Chapter Badges
 * - Speaker / Presenter Lower-Third Cards
 * - Visual Style Presets & B-Roll Atmosphere Backgrounds
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
import {DEFAULT_FPS, secondsToFrames} from '../../constants';
import {SubtitleRenderer} from '../../components/SubtitleRenderer';
import {PremiumVisualTreatment, getPremiumMediaStyle, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {mapCaptionStyle} from '../../utils/captionStyleMap';

const TITLE_FONT = resolveFont('Montserrat');
const BODY_FONT = resolveFont('Inter');

type SceneType = 'title' | 'narration' | 'typography' | 'image' | 'callout' | 'transition' | 'background' | 'face';
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
  chapterTitle?: string;
  speakerInfo?: {
    name: string;
    title?: string;
  };
};

type Word = {
  word: string;
  start: number;
  end: number;
};

type Caption = {
  start: number;
  end: number;
  text: string;
  words?: Word[];
};

type VisualStylePreset = 'cinematic_dark' | 'corporate_clean' | 'documentary_warm' | 'tech_futuristic';

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
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock & PremiumVisualStyleLock;
  soundCues?: PremiumSoundCue[];
  captionStyle?: string;
  captionPosition?: 'bottom' | 'center' | 'top';
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  showBackground?: boolean;
  visualStylePreset?: VisualStylePreset;
  atmosphereBg?: string;
};

const resolveAsset = (value: string) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return staticFile(value.replace(/^\/+/, ''));
};

// Preset Themes
const PRESET_THEMES: Record<VisualStylePreset, { bg: string; accent: string; fontColor: string; cardBg: string }> = {
  cinematic_dark: {
    bg: 'linear-gradient(135deg, #020617 0%, #0F172A 100%)',
    accent: '#38BDF8',
    fontColor: '#F8FAFC',
    cardBg: 'rgba(15, 23, 42, 0.85)',
  },
  corporate_clean: {
    bg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    accent: '#60A5FA',
    fontColor: '#FFFFFF',
    cardBg: 'rgba(30, 41, 59, 0.9)',
  },
  documentary_warm: {
    bg: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
    accent: '#F59E0B',
    fontColor: '#FAFAF9',
    cardBg: 'rgba(41, 37, 36, 0.85)',
  },
  tech_futuristic: {
    bg: 'linear-gradient(135deg, #050505 0%, #09090B 100%)',
    accent: '#22C55E',
    fontColor: '#FFFFFF',
    cardBg: 'rgba(9, 9, 11, 0.9)',
  },
};

// ─── Component: Bottom Video Progress Bar ───

function ProgressIndicator({ accentColor }: { accentColor: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progressPercent = Math.min(100, (frame / durationInFrames) * 100);

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,0.1)', zIndex: 90 }}>
      <div style={{ width: `${progressPercent}%`, height: '100%', background: accentColor, transition: 'width 0.1s linear', boxShadow: `0 0 10px ${accentColor}` }} />
    </div>
  );
}

// ─── Component: Chapter Badge Header ───

function ChapterBadge({ title, accentColor }: { title?: string; accentColor: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!title) return null;

  const slideIn = spring({ frame, fps, config: { damping: 15 } });
  const opacity = interpolate(slideIn, [0, 1], [0, 1]);
  const translateY = interpolate(slideIn, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        left: 48,
        zIndex: 80,
        transform: `translateY(${translateY}px)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 20px',
        borderRadius: 12,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
      <span style={{ fontFamily: TITLE_FONT, fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F8FAFC' }}>
        {title}
      </span>
    </div>
  );
}

// ─── Component: Speaker Lower-Third Card ───

function SpeakerLowerThird({ speaker, accentColor }: { speaker?: { name: string; title?: string }; accentColor: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!speaker?.name) return null;

  const slide = spring({ frame, fps, config: { damping: 14 } });
  const opacity = interpolate(slide, [0, 1], [0, 1]);
  const translateX = interpolate(slide, [0, 1], [-50, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 48,
        zIndex: 85,
        transform: `translateX(${translateX}px)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 24px',
        borderRadius: 14,
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        borderLeft: `4px solid ${accentColor}`,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div>
        <div style={{ fontFamily: TITLE_FONT, fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{speaker.name}</div>
        {speaker.title && (
          <div style={{ fontFamily: BODY_FONT, fontSize: 14, fontWeight: 500, color: accentColor, marginTop: 2 }}>{speaker.title}</div>
        )}
      </div>
    </div>
  );
}

// ─── Scene Renderers ───

function TitleScene({ scene, progress, mediaType }: { scene: Scene; progress: number; mediaType: 'audio' | 'video' }) {
  const scale = interpolate(progress, [0, 0.3, 0.85, 1], [0.85, 1, 1, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity, transform: `scale(${scale})` }}>
      <div style={{ textAlign: 'center', maxWidth: 1200, padding: 40, background: 'rgba(0,0,0,0.6)', borderRadius: 24, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontFamily: TITLE_FONT, fontSize: 64, fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
          {scene.text}
        </h1>
        {scene.keyword && (
          <p style={{ fontFamily: BODY_FONT, fontSize: 28, color: '#38BDF8', marginTop: 16, fontWeight: 600 }}>{scene.keyword}</p>
        )}
      </div>
    </AbsoluteFill>
  );
}

function TypographyScene({ scene, progress, mediaType }: { scene: Scene; progress: number; mediaType: 'audio' | 'video' }) {
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(progress, [0, 0.5, 1], [0.95, 1, 1.05]);

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity }}>
      <div style={{ transform: `scale(${scale})`, textAlign: 'center', maxWidth: 1300, padding: 48, borderRadius: 24, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}>
        <h2 style={{ fontFamily: TITLE_FONT, fontSize: 52, fontWeight: 800, color: '#F8FAFC', margin: 0, lineHeight: 1.3 }}>
          {scene.text}
        </h2>
        {scene.keyword && (
          <div style={{ marginTop: 24, display: 'inline-block', padding: '10px 24px', borderRadius: 12, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', fontFamily: TITLE_FONT, fontSize: 24, fontWeight: 700 }}>
            {scene.keyword}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

function ImageScene({ scene, progress }: { scene: Scene; progress: number }) {
  const scale = interpolate(progress, [0, 1], [1, 1.12]);
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {scene.imageSrc ? (
        <Img src={resolveAsset(scene.imageSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }} />
      ) : null}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.85) 0%, transparent 60%)' }} />
      {scene.text && (
        <div style={{ position: 'absolute', bottom: 100, left: 60, right: 60, maxWidth: 1000 }}>
          <h3 style={{ fontFamily: TITLE_FONT, fontSize: 36, fontWeight: 800, color: '#FFFFFF', margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
            {scene.text}
          </h3>
        </div>
      )}
    </AbsoluteFill>
  );
}

function CalloutScene({ scene, progress, mediaType }: { scene: Scene; progress: number; mediaType: 'audio' | 'video' }) {
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity }}>
      <div style={{ maxWidth: 1100, padding: 48, borderRadius: 24, background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)' }}>
        <h2 style={{ fontFamily: TITLE_FONT, fontSize: 44, fontWeight: 800, color: '#FFFFFF', margin: '0 0 24px 0' }}>
          {scene.text}
        </h2>
        {scene.bullets && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {scene.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#38BDF8' }} />
                <span style={{ fontFamily: BODY_FONT, fontSize: 24, color: '#E2E8F0', fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

function ChartScene({ scene, progress }: { scene: { text?: string; keyword?: string; statisticNumber?: string; statisticLabel?: string }; progress: number }) {
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const barHeight = interpolate(progress, [0, 0.5], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity }}>
      <div style={{ width: 1000, padding: 48, borderRadius: 24, background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: TITLE_FONT, fontSize: 72, fontWeight: 900, color: '#38BDF8', letterSpacing: '-0.02em' }}>
          {scene.statisticNumber || '85%'}
        </div>
        <div style={{ fontFamily: BODY_FONT, fontSize: 28, color: '#E2E8F0', fontWeight: 600, marginTop: 12, maxWidth: 800 }}>
          {scene.text || scene.statisticLabel || 'Key Growth Metric'}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180, marginTop: 24, padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ width: 32, height: barHeight * 0.4, background: '#38BDF8', borderRadius: 6 }} />
          <div style={{ width: 32, height: barHeight * 0.65, background: '#818CF8', borderRadius: 6 }} />
          <div style={{ width: 32, height: barHeight, background: '#C084FC', borderRadius: 6 }} />
          <div style={{ width: 32, height: barHeight * 0.85, background: '#F472B6', borderRadius: 6 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function TransitionScene({ progress }: { progress: number }) {
  const opacity = interpolate(progress, [0, 0.5, 1], [0, 1, 0]);
  return <AbsoluteFill style={{ background: '#000000', opacity }} />;
}

function NarrationScene({ scene, progress, mediaType }: { scene: Scene; progress: number; mediaType: 'audio' | 'video' }) {
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ opacity }}>
      {scene.imageSrc && <Img src={resolveAsset(scene.imageSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </AbsoluteFill>
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
  premiumEditing = true,
  styleLock,
  soundCues = [],
  captionStyle = 'Reels Clean',
  captionPosition = 'bottom',
  textColor = '#FFFFFF',
  highlightColor = '#FACC15',
  backgroundColor = '#0F172A',
  fontSize = 'large',
  showBackground = false,
  visualStylePreset = 'cinematic_dark',
}: LongVideoProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const time = frame / fps;
  const resolvedMedia = resolveAsset(mediaSrc);
  const resolvedMusic = resolveAsset(backgroundMusicSrc);

  const theme = PRESET_THEMES[visualStylePreset] || PRESET_THEMES.cinematic_dark;

  // Active scene & Chapter info
  const activeScene = useMemo(() => {
    return scenes.find((s) => time >= s.startSeconds && time < s.endSeconds) || null;
  }, [scenes, time]);

  const activeChapterTitle = activeScene?.chapterTitle || scenes.slice().reverse().find((s) => s.startSeconds <= time && s.chapterTitle)?.chapterTitle;

  const sceneProgress = activeScene
    ? (time - activeScene.startSeconds) / Math.max(0.1, activeScene.endSeconds - activeScene.startSeconds)
    : 0;

  const subtitleConfig = {
    style: mapCaptionStyle(captionStyle),
    position: captionPosition,
    textColor,
    highlightColor,
    backgroundColor,
    fontSize: fontSize as any,
    showBackground,
  };

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {/* Source audio/video */}
      {resolvedMedia && mediaType === 'video' ? (
        <OffthreadVideo
          src={resolvedMedia}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            ...getPremiumMediaStyle(styleLock, frame, durationInFrames),
          }}
          volume={sourceAudioVolume}
        />
      ) : null}
      {resolvedMedia && mediaType === 'audio' ? <Audio src={resolvedMedia} volume={sourceAudioVolume} /> : null}

      {/* Background music */}
      {resolvedMusic ? <Audio src={resolvedMusic} volume={musicVolume} loop /> : null}

      {/* Premium Sound Layer */}
      <PremiumAudioLayer enabled={premiumEditing} styleLock={styleLock} soundCues={soundCues} />

      {/* Chapter Badge Overlay */}
      <ChapterBadge title={activeChapterTitle} accentColor={theme.accent} />

      {/* Speaker Lower-Third Overlay */}
      <SpeakerLowerThird speaker={activeScene?.speakerInfo} accentColor={theme.accent} />

      {/* Scene Content Layers */}
      {activeScene?.type === 'title' ? <TitleScene scene={activeScene} progress={sceneProgress} mediaType={mediaType} /> : null}
      {activeScene?.type === 'typography' && (activeScene as any).statisticNumber ? <ChartScene scene={activeScene as any} progress={sceneProgress} /> : null}
      {activeScene?.type === 'typography' && !(activeScene as any).statisticNumber ? <TypographyScene scene={activeScene} progress={sceneProgress} mediaType={mediaType} /> : null}
      {activeScene?.type === 'image' ? <ImageScene scene={activeScene} progress={sceneProgress} /> : null}
      {activeScene?.type === 'callout' ? <CalloutScene scene={activeScene} progress={sceneProgress} mediaType={mediaType} /> : null}
      {activeScene?.type === 'transition' ? <TransitionScene progress={sceneProgress} /> : null}
      {activeScene?.type === 'narration' || activeScene?.type === 'background' ? <NarrationScene scene={activeScene} progress={sceneProgress} mediaType={mediaType} /> : null}

      {/* Subtitles Overlay */}
      <SubtitleRenderer captions={captions} config={subtitleConfig} />

      {/* Bottom Progress Bar */}
      <ProgressIndicator accentColor={theme.accent} />

      {/* Premium Visual Treatment */}
      <PremiumVisualTreatment enabled={premiumEditing} styleLock={styleLock} includeLightSweep />
    </AbsoluteFill>
  );
}

export { LongVideo };

export const LongVideoComposition = () => (
  <Composition
    id="LONG-VIDEO"
    component={LongVideo}
    durationInFrames={secondsToFrames(600, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1920}
    height={1080}
    defaultProps={{
      mediaSrc: '',
      mediaType: 'audio' as const,
      durationSeconds: 600,
      title: 'Long Video Pro',
      scenes: [],
      captions: [],
      backgroundMusicSrc: '',
      visualStylePreset: 'cinematic_dark' as VisualStylePreset,
    }}
    calculateMetadata={({ props }) => {
      const p = props as LongVideoProps;
      const dur = Math.max(8, Math.min(600, Number(p.durationSeconds) || 60));
      return { durationInFrames: secondsToFrames(dur, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1920, height: 1080 };
    }}
  />
);
