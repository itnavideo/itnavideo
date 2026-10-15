import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Loop,
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
import { ListScene } from './scenes/ListScene';

export interface FacelessLongVideoProps {
  mediaSrc?: string;
  audioSrc?: string;
  musicUrl?: string;
  musicSrc?: string;
  musicVolume?: number;
  subjectCutoutSrc?: string;
  enable3DTextBehindSubject?: boolean;
  showCaptions?: boolean;
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  durationSeconds?: number;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  title?: string;
  backgroundTheme?: string;
  customBgUrl?: string;
  aspectRatio?: '9:16' | '16:9';
  sfxEvents?: Array<{
    id: string;
    sfxType: string;
    startFrame: number;
    volume: number;
    sfxUrl: string;
  }>;
  mediaType?: 'audio' | 'video';
  audioUrl?: string;
  mediaUrl?: string;
  renderWindowSeconds?: number;
  sourceDurationSeconds?: number;
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

const isAudioFile = (src?: string) => {
  if (!src) return false;
  return /\.(mp3|wav|m4a|aac|ogg|flac)(\?.*)?$/i.test(src) || src.includes('/audio/');
};

const isVideoFile = (src?: string) => {
  if (!src) return false;
  if (isAudioFile(src)) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src) || src.includes('/video/');
};

export function FacelessLongVideoTemplate(props: FacelessLongVideoProps) {
  const {
    mediaSrc = '',
    audioSrc = '',
    audioUrl = '',
    mediaUrl = '',
    mediaType = 'audio',
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
    showCaptions = true,
  } = props;

  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const rawAudio =
    audioSrc ||
    audioUrl ||
    (mediaType === 'audio' || isAudioFile(mediaSrc || mediaUrl) ? mediaSrc || mediaUrl : '');
  const rawVideo =
    mediaType !== 'audio' && !isAudioFile(mediaSrc || mediaUrl) && isVideoFile(mediaSrc || mediaUrl)
      ? mediaSrc || mediaUrl
      : '';

  const resolvedMediaSrc = resolveMediaSrc(rawVideo);
  const resolvedAudioSrc = resolveMediaSrc(rawAudio);
  const resolvedCutoutSrc = resolveMediaSrc(subjectCutoutSrc);

  const hasBackgroundVideo = Boolean(resolvedMediaSrc && isVideoFile(rawVideo));
  const hasSubjectCutout = Boolean(enable3DTextBehindSubject && resolvedCutoutSrc);

  const activeCaptions = showCaptions !== false ? (captions.length > 0 ? captions : subtitleChunks) : [];
  const currentTimeSec = frame / fps;

  // ── Dynamic Background Music Auto-Ducking Engine ──
  const musicTrackUrl = props.musicUrl || props.musicSrc || '';
  const resolvedMusicSrc = resolveMediaSrc(musicTrackUrl);

  const dynamicMusicVolume = React.useMemo(() => {
    const baseDuckedVolume = props.musicVolume || 0.13;
    if (!activeCaptions || activeCaptions.length === 0) return baseDuckedVolume;

    const isSpeaking = activeCaptions.some((c) => {
      const start = Number(c.start ?? (c as any).startSeconds ?? 0);
      const end = Number(c.end ?? (c as any).endSeconds ?? 0);
      return currentTimeSec >= start - 0.1 && currentTimeSec <= end + 0.15;
    });

    if (isSpeaking) {
      return baseDuckedVolume; // Stay ducked at 0.12 - 0.15 during active speech
    }

    let minSilenceSec = 999;
    for (const c of activeCaptions) {
      const end = Number(c.end ?? (c as any).endSeconds ?? 0);
      if (currentTimeSec > end) {
        minSilenceSec = Math.min(minSilenceSec, currentTimeSec - end);
      }
    }

    // Swell to 0.28 - 0.30 if silence gap exceeds 1.5s
    if (minSilenceSec > 1.5) {
      const swellRatio = Math.min(1, (minSilenceSec - 1.5) / 1.0);
      return baseDuckedVolume + (0.28 - baseDuckedVolume) * swellRatio;
    }

    return baseDuckedVolume;
  }, [activeCaptions, currentTimeSec, props.musicVolume]);

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
  const activeBackgroundTheme: string =
    backgroundTheme ||
    currentScene?.background ||
    'studio-white';
  const isLightBackground =
    activeBackgroundTheme === 'studio-white' ||
    activeBackgroundTheme === 'warm-cream' ||
    activeBackgroundTheme === 'soft-slate';

  // ── Dynamic Scene Transition Engine ──
  // 1. Cut: Direct cut, instantaneous (no fade)
  // 2. Crossfade / Dissolve: Smooth opacity blend over 10 frames
  // 3. Slide / Wipe: Enters with subtle horizontal push (50px -> 0) and smooth opacity
  // 4. Zoom: Camera-like smooth scale (1.08 -> 1.0) and opacity
  // 5. Fade to Black: Dips through black overlay at scene transition
  const sceneStartFrame = Math.round(
    Number(currentScene?.narrationSegment?.startSeconds ?? (currentScene?.narrationSegment as any)?.start ?? 0) * fps
  );
  const framesSinceSceneStart = Math.max(0, frame - sceneStartFrame);
  const transitionType = (currentScene?.transition || 'dissolve').toLowerCase();

  const transitionStyles = React.useMemo(() => {
    if (transitionType === 'cut') {
      return { opacity: 1, transform: 'none', isFadeToBlack: false, blackOverlayOpacity: 0 };
    }
    if (transitionType === 'slide' || transitionType === 'wipe') {
      const slideX = interpolate(framesSinceSceneStart, [0, 9], [50, 0], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
      return { opacity: op, transform: `translateX(${slideX}px)`, isFadeToBlack: false, blackOverlayOpacity: 0 };
    }
    if (transitionType === 'zoom' || transitionType === 'zoom_blur') {
      const scaleVal = interpolate(framesSinceSceneStart, [0, 10], [1.08, 1.0], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [0, 7], [0, 1], { extrapolateRight: 'clamp' });
      return { opacity: op, transform: `scale(${scaleVal})`, isFadeToBlack: false, blackOverlayOpacity: 0 };
    }
    if (transitionType === 'fade_to_black' || transitionType === 'dip_to_black') {
      const blackOpacity = interpolate(framesSinceSceneStart, [0, 4, 8], [1, 0.75, 0], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [2, 8], [0, 1], { extrapolateRight: 'clamp' });
      return { opacity: op, transform: 'none', isFadeToBlack: true, blackOverlayOpacity: blackOpacity };
    }
    // Default: crossfade / dissolve
    const dissolveOp = interpolate(framesSinceSceneStart, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
    return { opacity: dissolveOp, transform: 'none', isFadeToBlack: false, blackOverlayOpacity: 0 };
  }, [transitionType, framesSinceSceneStart]);

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
    if (layout === 'checklist' || scene.typographyTreatment === 'list' || (scene.listItems && scene.listItems.length >= 2)) {
      return <ListScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }
    if (stype === 'next_point') {
      return <ConclusionScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }

    return <TypographyScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
  };

  return (
    <AbsoluteFill style={{ fontFamily: typographyFont, backgroundColor: isLightBackground ? '#FFFFFF' : '#000000', color: isLightBackground ? '#0F172A' : '#FFFFFF' }}>
      {/* ── LAYER 1 (BOTTOM): Base Video Media or Animated Dynamic Background ── */}
      {hasBackgroundVideo && resolvedMediaSrc ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Loop durationInFrames={150}>
            <OffthreadVideo
              src={resolvedMediaSrc}
              startFrom={Math.round(mediaTrimStartSeconds * fps)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              volume={audioSrc ? 0 : sourceAudioVolume}
            />
          </Loop>
          {/* Vox-Style Ambient Dark Backdrop Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.55)', backdropFilter: 'blur(3px)' }} />
        </div>
      ) : (
        <Background theme={activeBackgroundTheme} customBgUrl={customBgUrl} aspectRatio={props.aspectRatio} />
      )}

      {/* ── LAYER 2 (MIDDLE): Dynamic Modular Scene Engine & Transitions ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          opacity: transitionStyles.opacity,
          transform: transitionStyles.transform,
        }}
      >
        {/* Dynamic Modular Scene Engine */}
        {currentScene && renderModularScene(currentScene)}
      </div>

      {/* Fade to Black Transition Overlay */}
      {transitionStyles.isFadeToBlack && (transitionStyles.blackOverlayOpacity || 0) > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 25,
            backgroundColor: '#000000',
            opacity: transitionStyles.blackOverlayOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

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

      {/* Dynamic Background Music Track (Auto-Ducked During Voiceover & Swelled During Pauses) */}
      {resolvedMusicSrc && (
        <Audio
          src={resolvedMusicSrc}
          volume={dynamicMusicVolume}
        />
      )}

      {/* Voiceover Audio Stream */}
      {resolvedAudioSrc && (
        <Audio
          src={resolvedAudioSrc}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
          volume={sourceAudioVolume}
        />
      )}

      {/* Timed Sound Effects (Pops, Swooshes, Risers) */}
      {sfxEvents
        .filter((sfx) => Boolean(sfx?.sfxUrl) && sfx.startFrame >= 0 && sfx.startFrame < durationInFrames)
        .map((sfx) => (
          <Sequence
            key={sfx.id}
            from={sfx.startFrame}
            durationInFrames={Math.min(Math.round(2.5 * fps), Math.max(1, durationInFrames - sfx.startFrame))}
          >
            <Audio src={resolveMediaSrc(sfx.sfxUrl)} volume={sfx.volume} />
          </Sequence>
        ))}

      {/* Sticker Layer */}
      <UniversalStickerLayer stickerEvents={stickerEvents} stickerPackId={templateConfig.stickerPackId} />

      {/* Chapter Lower Third Cards */}
      <UniversalLowerThird chapterEvents={chapterEvents} lowerThirdId={templateConfig.lowerThirdId} />

      {/* Karaoke Word-Highlight Subtitles (Clean Lower Third) */}
      {showCaptions !== false && activeCaptions.length > 0 && (
        <UniversalCaptionLayer
          chunks={activeCaptions}
          themeId={templateConfig.captionThemeId}
          styleOverrides={{
            bottom: 55,
            fontSize: 36,
          }}
        />
      )}
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
    width={1920}
    height={1080}
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
        width: 1920,
        height: 1080,
      };
    }}
  />
);
