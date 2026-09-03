import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { UniversalCaptionLayer, type CaptionChunk } from '../../components/library/UniversalCaptionLayer';
import { UniversalLowerThird, type ChapterCardEvent } from '../../components/library/UniversalLowerThird';
import { UniversalStickerLayer, type StickerEvent } from '../../components/library/UniversalStickerLayer';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import type { SceneBlueprintItem } from '../../../services/ai/sceneBlueprintTypes';

import { Background } from './components/Background';
import { HookScene } from './scenes/HookScene';
import { TypographyScene } from './scenes/TypographyScene';
import { SplitScreenLayout } from './components/SplitScreenLayout';
import { StatScene } from './scenes/StatScene';
import { ImageTextScene } from './scenes/ImageTextScene';
import { ComparisonScene } from './scenes/ComparisonScene';
import { QuoteScene } from './scenes/QuoteScene';
import { ScreenshotScene } from './scenes/ScreenshotScene';
import { ConclusionScene } from './scenes/ConclusionScene';

export interface FacelessLongVideoProps {
  mediaSrc?: string;
  audioSrc?: string;
  subjectCutoutSrc?: string;
  enable3DTextBehindSubject?: boolean;
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  durationSeconds?: number;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  title?: string;
  backgroundTheme?: 'purple-vignette' | 'midnight-obsidian' | 'emerald-studio' | 'royal-indigo' | 'pure-dark';
  customBgUrl?: string;
  sfxEvents?: Array<{
    id: string;
    sfxType: string;
    startFrame: number;
    volume: number;
    sfxUrl: string;
  }>;
  chapterEvents?: ChapterCardEvent[];
  stickerEvents?: StickerEvent[];
  headingFont?: string;
  typographyFont?: string;
  templateConfig?: {
    stickerPackId?: string;
    captionThemeId?: string;
    lowerThirdId?: string;
  };
  brollUrls?: Record<number, string> | string[];
  mediaAssets?: Array<{
    id: string;
    type: 'image' | 'video' | 'screenshot';
    url: string;
    startSeconds?: number;
    endSeconds?: number;
    caption?: string;
  }>;
  assetTimeline?: Record<number, { type: string; url: string }>;
  sceneBlueprint?: SceneBlueprintItem[];
}

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  return /^(https?:|data:|blob:)/i.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
};

const isVideoFile = (src?: string) => {
  if (!src) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src) || src.includes('/video/') || src.includes('video');
};

export function FacelessLongVideoTemplate({
  mediaSrc = '',
  audioSrc = '',
  subjectCutoutSrc = '',
  enable3DTextBehindSubject = false,
  captions = [],
  subtitleChunks = [],
  durationSeconds = 60,
  mediaTrimStartSeconds = 0,
  sourceAudioVolume = 1.0,
  title = '',
  backgroundTheme = 'purple-vignette',
  customBgUrl = '',
  sfxEvents = [],
  chapterEvents = [],
  stickerEvents = [],
  headingFont = 'Montserrat, sans-serif',
  typographyFont = 'Inter, sans-serif',
  templateConfig = {
    captionThemeId: 'bold_yellow',
    lowerThirdId: 'tech_modern',
    stickerPackId: '2d-teacher',
  },
  brollUrls = [],
  mediaAssets = [],
  assetTimeline = {},
  sceneBlueprint = [
    {
      sceneNumber: 1,
      sceneType: 'hook',
      heading: 'EXCLUSIVE INSIGHT',
      duration: 6,
      supportingText: 'Spending hours adding captions manually?',
      visualAssetRequirement: 'none',
      background: 'purple-vignette',
      narrationSegment: { text: 'Spending hours adding captions manually?', startSeconds: 0, endSeconds: 6 },
      highlightedWords: ['hours', 'captions', 'manually'],
      layoutType: 'big_typography',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Inter' },
      animation: 'pop_in',
      SFX: 'whoosh',
      transition: 'cut',
    },
    {
      sceneNumber: 2,
      sceneType: 'main_point',
      heading: 'AUTOMATED PIPELINE',
      duration: 9,
      supportingText: 'Generate Vox style documentary videos in seconds.',
      visualAssetRequirement: 'none',
      background: 'purple-vignette',
      narrationSegment: { text: 'Generate Vox style documentary videos in seconds.', startSeconds: 6, endSeconds: 15 },
      highlightedWords: ['automated', 'seconds'],
      layoutType: 'split_screen',
      fontHierarchy: { headingFont: 'Montserrat', bodyFont: 'Inter' },
      animation: 'spring',
      SFX: 'rise',
      transition: 'dissolve',
    },
  ],
}: FacelessLongVideoProps) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const resolvedMediaSrc = resolveMediaSrc(mediaSrc);
  const resolvedAudioSrc = resolveMediaSrc(audioSrc);
  const resolvedCutoutSrc = resolveMediaSrc(subjectCutoutSrc);

  const hasBackgroundVideo = isVideoFile(mediaSrc) || Boolean(resolvedMediaSrc && !audioSrc);
  const hasSubjectCutout = Boolean(enable3DTextBehindSubject && resolvedCutoutSrc);

  const activeCaptions = captions.length > 0 ? captions : subtitleChunks;
  const currentTimeSec = frame / fps;

  // Active Scene Selection based on narration timestamps or proportional fallback
  const currentScene =
    sceneBlueprint.find((scene) => {
      const start = Number(scene.narrationSegment?.startSeconds ?? (scene.narrationSegment as any)?.start ?? 0);
      const end = Number(scene.narrationSegment?.endSeconds ?? (scene.narrationSegment as any)?.end ?? 0);
      return currentTimeSec >= start && currentTimeSec < end;
    }) ||
    sceneBlueprint[
      Math.min(
        Math.floor((currentTimeSec / Math.max(1, durationSeconds)) * sceneBlueprint.length),
        sceneBlueprint.length - 1
      )
    ] ||
    sceneBlueprint[0];

  // Resolve Secondary Asset (B-Roll, Screenshot, Image) for current scene
  const matchedBrollUrl =
    brollUrls && typeof brollUrls === 'object'
      ? (brollUrls as Record<number, string>)[currentScene?.sceneNumber]
      : Array.isArray(brollUrls)
      ? brollUrls[0]
      : assetTimeline?.[currentScene?.sceneNumber]?.url ||
        mediaAssets.find((a) => (a.startSeconds || 0) <= currentTimeSec && (a.endSeconds || durationSeconds) >= currentTimeSec)?.url ||
        '';

  // Background Theme Variety Engine
  const BACKGROUND_THEMES: Array<'purple-vignette' | 'midnight-obsidian' | 'emerald-studio' | 'royal-indigo' | 'pure-dark'> = [
    'purple-vignette',
    'midnight-obsidian',
    'emerald-studio',
    'royal-indigo',
    'pure-dark',
  ];
  const activeBackgroundTheme =
    currentScene?.background ||
    BACKGROUND_THEMES[(currentScene?.sceneNumber || 1) % BACKGROUND_THEMES.length] ||
    backgroundTheme;

  // Scene Cut Transition Animation (Cross-fade between scenes)
  const sceneStartFrame = Math.round(
    Number(currentScene?.narrationSegment?.startSeconds ?? (currentScene?.narrationSegment as any)?.start ?? 0) * fps
  );
  const framesSinceSceneStart = Math.max(0, frame - sceneStartFrame);
  const sceneTransitionOpacity = interpolate(framesSinceSceneStart, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Render Vox/Johnny Harris Style Modular Scene Layout
  const renderModularScene = (scene: SceneBlueprintItem) => {
    const layout = scene.layoutType || 'big_typography';
    const stype = scene.sceneType || 'main_point';
    const resolvedAssetUrl = matchedBrollUrl ? resolveMediaSrc(matchedBrollUrl) : undefined;

    if (stype === 'hook') {
      return <HookScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }
    if (layout === 'split_screen' || (layout as string) === 'side_by_side') {
      return (
        <SplitScreenLayout
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
        />
      );
    }
    if (layout === 'stat_card' || stype === 'example_stat') {
      return <StatScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }
    if (layout === 'image_text' || layout === 'broll_overlay') {
      return (
        <ImageTextScene
          scene={scene}
          brollUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
        />
      );
    }
    if (layout === 'screenshot_highlight' || (layout as string) === 'web_mockup') {
      return (
        <ScreenshotScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
        />
      );
    }
    if (layout === 'comparison') {
      return <ComparisonScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }
    if (layout === 'quote') {
      return <QuoteScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }
    if (stype === 'next_point' || layout === 'checklist') {
      return <ConclusionScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }

    return <TypographyScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
  };

  return (
    <AbsoluteFill className="bg-black text-white" style={{ fontFamily: typographyFont }}>
      {/* ── LAYER 1 (BOTTOM): Base Video Media or Animated Dynamic Background ── */}
      {hasBackgroundVideo && resolvedMediaSrc ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <OffthreadVideo
            src={resolvedMediaSrc}
            startFrom={Math.round(mediaTrimStartSeconds * fps)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            volume={audioSrc ? 0 : sourceAudioVolume}
          />
          {/* Vox-Style Ambient Dark Backdrop Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.55)', backdropFilter: 'blur(3px)' }} />
        </div>
      ) : (
        <Background theme={activeBackgroundTheme} customBgUrl={customBgUrl} />
      )}

      {/* ── LAYER 2 (MIDDLE): Dynamic Modular Scene Engine & Vox Graphics ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, opacity: sceneTransitionOpacity }}>
        {/* Dynamic Modular Scene Engine */}
        {currentScene && renderModularScene(currentScene)}
      </div>

      {/* ── LAYER 3 (TOP): Subject Mask Cutout Video (Text Behind Subject) ── */}
      {hasSubjectCutout && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
          <OffthreadVideo
            src={resolvedCutoutSrc}
            startFrom={Math.round(mediaTrimStartSeconds * fps)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            volume={0}
          />
        </div>
      )}

      {/* Voiceover Audio Stream */}
      {audioSrc && resolvedAudioSrc && <Audio src={resolvedAudioSrc} volume={sourceAudioVolume} />}

      {/* Timed Sound Effects (Pops, Swooshes, Risers) */}
      {sfxEvents.map((sfx) => (
        <Sequence key={sfx.id} from={sfx.startFrame}>
          <Audio src={resolveMediaSrc(sfx.sfxUrl)} volume={sfx.volume} />
        </Sequence>
      ))}

      {/* Sticker Layer */}
      <UniversalStickerLayer stickerEvents={stickerEvents} stickerPackId={templateConfig.stickerPackId} />

      {/* Chapter Lower Third Cards */}
      <UniversalLowerThird chapterEvents={chapterEvents} lowerThirdId={templateConfig.lowerThirdId} />

      {/* Karaoke Word-Highlight Subtitles (Clean Lower Third) */}
      <UniversalCaptionLayer chunks={activeCaptions} themeId={templateConfig.captionThemeId} />
    </AbsoluteFill>
  );
}

export { FacelessLongVideoTemplate as FacelessLongVideo };

export const FacelessLongVideoComposition = () => (
  <Composition
    id="FACELESS-LONG-VIDEO"
    component={FacelessLongVideoTemplate}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={{
      durationSeconds: 60,
      title: 'FACELESS LONG VIDEO',
      backgroundTheme: 'purple-vignette',
    }}
    calculateMetadata={({ props }) => {
      const p = props as FacelessLongVideoProps;
      const durationSeconds = Math.max(5, Math.min(600, Number(p.durationSeconds) || 60));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1080,
        height: 1920,
      };
    }}
  />
);
