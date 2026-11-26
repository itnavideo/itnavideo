import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  continueRender,
  delayRender,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { UniversalCaptionLayer, splitCaptionChunksToShortPills, type CaptionChunk } from '../../components/library/UniversalCaptionLayer';
import { UniversalLowerThird, type ChapterCardEvent } from '../../components/library/UniversalLowerThird';
import { UniversalStickerLayer, type StickerEvent } from '../../components/library/UniversalStickerLayer';
import { KineticEmojiLayer, type KineticEmojiEvent } from '../../components/library/KineticEmojiLayer';
import { MultiLayerTextOverlay, type DynamicTextLayer } from '../../components/library/MultiLayerTextOverlay';
import { MultiLayerImageOverlay, type DynamicImageLayer } from '../../components/library/MultiLayerImageOverlay';
import { MultiLayerSvgOverlay, type DynamicSvgLayer } from '../../components/library/MultiLayerSvgOverlay';
import { MultiLayerEffectsOverlay, type DynamicEffectLayer } from '../../components/library/MultiLayerEffectsOverlay';
import { MultiLayerAdjustmentOverlay, type DynamicAdjustmentLayer } from '../../components/library/MultiLayerAdjustmentOverlay';
import { MultiLayerTransitionOverlay, type DynamicTransitionEvent } from '../../components/library/MultiLayerTransitionOverlay';
import { MultiLayerMaskOverlay, type DynamicMaskLayer } from '../../components/library/MultiLayerMaskOverlay';
import { MultiLayerPatternOverlay, type DynamicPatternLayer } from '../../components/library/MultiLayerPatternOverlay';
import { MultiLayerCalloutOverlay, type DynamicCalloutLayer } from '../../components/library/MultiLayerCalloutOverlay';
import { IsometricPerspectiveOverlay, type DynamicIsometricLayer } from '../../components/library/IsometricPerspectiveOverlay';
import { MultiLayerGaugeOverlay, type DynamicGaugeLayer } from '../../components/library/MultiLayerGaugeOverlay';
import { MultiLayerAudioVisualizerOverlay, type DynamicAudioVisualizerLayer } from '../../components/library/MultiLayerAudioVisualizerOverlay';
import { MultiLayerBackgroundOverlay, type DynamicBackgroundLayer } from '../../components/library/MultiLayerBackgroundOverlay';
import { MultiLayerAudioOverlay, type DynamicAudioLayer } from '../../components/library/MultiLayerAudioOverlay';
import { composeMultiLayerVideoBlueprint } from '../../../services/ai/facelessMultiLayerEngine';
import { VirtualCameraLayer, type VirtualCameraConfig } from '../../components/library/VirtualCameraLayer';
import { VideoVisualThemeProvider, type VideoVisualTheme } from '../../theme/VideoVisualTheme';
import { CanvasGraphicsLayer } from '../../layers/CanvasGraphicsLayer';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import type { SceneBlueprintItem } from '../../../services/ai/sceneBlueprintTypes';
import { safeResolveMediaSrc, isValidMediaUrl, isVideoMedia as isVideoFile } from '../../utils/safeMedia';

import { Background } from './components/Background';
import { getBackgroundPalette, type BackgroundColorPalette } from '../../components/backgrounds/BackgroundCatalog';
import { HookScene } from './scenes/HookScene';
import { HookTypographyScene } from './scenes/HookTypographyScene';
import { OutroScene } from './scenes/OutroScene';
import { TypographyScene } from './scenes/TypographyScene';
import { SplitScreenLayout } from './components/SplitScreenLayout';
import { StatScene } from './scenes/StatScene';
import { ImageTextScene } from './scenes/ImageTextScene';
import { ComparisonScene } from './scenes/ComparisonScene';
import { QuoteScene } from './scenes/QuoteScene';
import { ScreenshotScene } from './scenes/ScreenshotScene';
import { ConclusionScene } from './scenes/ConclusionScene';
import { ListScene } from './scenes/ListScene';
import { ChartScene } from './scenes/ChartScene';
import { FullBleedVisualScene } from './scenes/FullBleedVisualScene';
import { FacelessGraphicScene } from './scenes/FacelessGraphicScene';
import { ChapterTitleScene } from './scenes/ChapterTitleScene';
import { CardConceptScene } from './scenes/CardConceptScene';
import { EcosystemScene } from './scenes/EcosystemScene';
import { RoadmapScene } from './scenes/RoadmapScene';
import { WorkflowScene } from './scenes/WorkflowScene';
import { GoalTargetScene } from './scenes/GoalTargetScene';
import { PromptWindowScene } from './scenes/PromptWindowScene';
import { CalendarGridScene } from './scenes/CalendarGridScene';
import { MilestoneLadderScene } from './scenes/MilestoneLadderScene';
import { ScriptBubbleScene } from './scenes/ScriptBubbleScene';
import { DrawingStoryScene } from './scenes/DrawingStoryScene';
import { HorizontalProcessStepsScene } from './scenes/HorizontalProcessStepsScene';
import { StoryCharacterDeskScene } from './scenes/StoryCharacterDeskScene';
import { ProductMockupFlowScene } from './scenes/ProductMockupFlowScene';
import { BeforeAfterTransformationScene } from './scenes/BeforeAfterTransformationScene';
import { CreatorCelebrationScene } from './scenes/CreatorCelebrationScene';
import { InfographicScene } from './scenes/InfographicScene';
import { RoughNotationScene } from './scenes/RoughNotationScene';
import { LottieScene } from './scenes/LottieScene';
import { AnimatedCodeDiffScene } from './scenes/AnimatedCodeDiffScene';
import { ThreeGlobeScene } from './scenes/ThreeGlobeScene';
import { MapFlyoverScene } from './scenes/MapFlyoverScene';
import { KineticKitScene } from './scenes/KineticKitScene';
import { FACELESS_DESIGN_TOKENS } from './facelessTokens';
import { BrandWatermark } from '../../components/BrandWatermark';
import { getFacelessFontAssetPath } from '../../../lib/fonts/facelessFontCatalog';
import { DynamicLibraryHost } from '../../components/DynamicLibraryHost';
import {
  GithubRemotionCaption,
  isGithubRemotionCaptionStyle,
} from '../../captions/github-remotion-styles/GithubRemotionCaption';
import {
  AdaptiveCard,
  AnimatedBarChart,
  DonutBreakdown,
  StickyNoteCard,
  NumberedStepsCard,
  SocialPostMockup,
  ChatConversation,
  VectorDrawingIcon,
  TypingSearchBar,
  IPhoneNotificationCard,
  VsBattleCard,
  MetricGrowthPill,
  NewspaperHeadlineCard,
  StampBadge,
  VerticalRoadmapDiagram,
  SupportingNoteCard,
} from '../../components/graphics';

// Reusable image visuals and transparent PNGs enabled
const FACELESS_IMAGE_VISUALS_ENABLED = true;

export interface FacelessLongVideoProps {
  creatorHandle?: string;
  watermark?: boolean;
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
  bgmUrl?: string;
  bgmVolume?: number;
  mediaUrl?: string;
  renderWindowSeconds?: number;
  sourceDurationSeconds?: number;
  chapterEvents?: ChapterCardEvent[];
  stickerEvents?: StickerEvent[];
  enableKineticEmojis?: boolean;
  emojiEvents?: KineticEmojiEvent[];
  textLayers?: DynamicTextLayer[];
  imageLayers?: DynamicImageLayer[];
  mediaLayers?: DynamicImageLayer[];
  svgLayers?: DynamicSvgLayer[];
  backgroundLayers?: DynamicBackgroundLayer[];
  audioLayers?: DynamicAudioLayer[];
  effectsLayers?: DynamicEffectLayer[];
  adjustmentLayers?: DynamicAdjustmentLayer[];
  transitionEvents?: DynamicTransitionEvent[];
  maskLayers?: DynamicMaskLayer[];
  patternLayers?: DynamicPatternLayer[];
  calloutLayers?: DynamicCalloutLayer[];
  isometricLayers?: DynamicIsometricLayer[];
  gaugeLayers?: DynamicGaugeLayer[];
  audioVisualizerLayers?: DynamicAudioVisualizerLayer[];
  cameraConfig?: VirtualCameraConfig;
  visualTheme?: string | Partial<VideoVisualTheme>;
  fontFamily?: string;
  headingFont?: string;
  subheadingFont?: string;
  typographyFont?: string;
  accentFont?: string;
  canvasTexture?: 'solid' | 'dot-grid' | 'square-grid' | 'vignette' | 'paper' | (string & {});
  duckingDb?: number;
  sceneTransitionStyle?: 'crossfade' | 'slide-push' | 'zoom-whip' | 'hard-cut' | (string & {});
  subtitleStyle?: string;
  autoDucking?: boolean;
  pacingStyle?: 'clean' | 'cinematic' | 'documentary' | 'dynamic';
  captionThemeId?: string;
  captionAnimationStyle?: 'mrbeast' | 'handwriting' | 'bouncy' | 'smooth' | 'capsule' | 'stacy-pill' | 'decodingyt' | 'marker' | 'highlighter' | (string & {});
  captionPosition?: 'bottom' | 'center' | 'top';
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

const isAudioFile = (src?: string) => {
  if (!src) return false;
  return /\.(mp3|wav|m4a|aac|ogg|flac)(\?.*)?$/i.test(src) || src.includes('/audio/');
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
    creatorHandle = '',
    watermark = false,
    backgroundTheme = 'solid-white',
    customBgUrl = '',
    sfxEvents = [],
    chapterEvents = [],
    stickerEvents = [],
    enableKineticEmojis = false,
    emojiEvents = [],
    textLayers = [],
    imageLayers = [],
    mediaLayers = [],
    svgLayers = [],
    backgroundLayers = [],
    audioLayers = [],
    effectsLayers = [],
    adjustmentLayers = [],
    transitionEvents = [],
    maskLayers = [],
    patternLayers = [],
    calloutLayers = [],
    isometricLayers = [],
    gaugeLayers = [],
    audioVisualizerLayers = [],
    cameraConfig,
    visualTheme = 'modern-saas',
    fontFamily,
    headingFont: rawHeadingFont = 'Montserrat, sans-serif',
    subheadingFont: rawSubheadingFont = 'Montserrat',
    typographyFont: rawTypographyFont = 'Montserrat, sans-serif',
    accentFont = 'Caveat',
    canvasTexture = 'solid',
    duckingDb = -14,
    sceneTransitionStyle = 'crossfade',
    pacingStyle = 'cinematic',
    templateConfig = {
      captionThemeId: 'bold_yellow',
      lowerThirdId: 'tech_modern',
      stickerPackId: 'none',
    },
    brollUrls = [],
    mediaAssets = [],
    assetTimeline = {},
    sceneBlueprint = [],
    showCaptions = true,
  } = props;

  const headingFont = fontFamily || rawHeadingFont;
  const subheadingFont = fontFamily || rawSubheadingFont;
  const typographyFont = fontFamily || rawTypographyFont;

  const [fontRenderHandle] = React.useState(() =>
    typeof window === 'undefined' ? null : delayRender('Loading selected Faceless fonts')
  );

  React.useEffect(() => {
    if (fontRenderHandle === null) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      continueRender(fontRenderHandle);
    };
    const fontFamilies = [...new Set([headingFont, subheadingFont, typographyFont, accentFont]
      .map((value) => String(value || '').split(',')[0].trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean))];

    Promise.all(fontFamilies.map(async (family) => {
      if (typeof document !== 'undefined') {
        try {
          const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700;800;900&display=swap`;
          const alreadyLinked = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).some(
            (el) => (el as HTMLLinkElement).href === href
          );
          if (!alreadyLinked) {
            await new Promise<void>((resolve) => {
              const fontLink = document.createElement('link');
              fontLink.rel = 'stylesheet';
              fontLink.href = href;
              const done = () => resolve();
              fontLink.onload = done;
              fontLink.onerror = done;
              setTimeout(done, 2500);
              document.head.appendChild(fontLink);
            });
          }
        } catch { }
      }

      const assetPath = getFacelessFontAssetPath(family);
      if (assetPath && typeof FontFace !== 'undefined' && typeof document !== 'undefined') {
        try {
          const fontFace = new FontFace(family, 'url("' + staticFile(assetPath) + '")', {
            style: 'normal',
            weight: '400',
          });
          document.fonts.add(await fontFace.load());
        } catch { }
      }

      if (typeof document !== 'undefined' && document.fonts?.ready) {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise<void>((resolve) => setTimeout(resolve, 1500)),
          ]);
        } catch { }
      }
    }))
      .then(finish)
      .catch((error) => {
        console.warn('[FACELESS_FONT_LOAD]', error);
        finish();
      });

    return finish;
  }, [fontRenderHandle]);
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const isVertical = height > width;
  const frame = useCurrentFrame();

  const rawAudio =
    audioSrc ||
    audioUrl ||
    (mediaType === 'audio' || isAudioFile(mediaSrc || mediaUrl) ? mediaSrc || mediaUrl : '');
  const rawVideo =
    mediaType !== 'audio' && !isAudioFile(mediaSrc || mediaUrl) && isVideoFile(mediaSrc || mediaUrl)
      ? mediaSrc || mediaUrl
      : '';

  const resolvedMediaSrc = safeResolveMediaSrc(rawVideo);
  const resolvedAudioSrc = safeResolveMediaSrc(rawAudio);
  const resolvedCutoutSrc = safeResolveMediaSrc(subjectCutoutSrc);

  const hasBackgroundVideo = Boolean(resolvedMediaSrc && isVideoFile(rawVideo));
  const hasSubjectCutout = Boolean(enable3DTextBehindSubject && resolvedCutoutSrc);

  const rawActiveCaptions = showCaptions !== false ? (captions.length > 0 ? captions : subtitleChunks) : [];
  const activeCaptions = React.useMemo(
    () =>
      splitCaptionChunksToShortPills(rawActiveCaptions, {
        maxWords: isVertical ? 5 : 7,
        maxChars: isVertical ? 32 : 44,
        minDurationSec: isVertical ? 0.95 : 1.15,
      }),
    [rawActiveCaptions, isVertical]
  );
  const currentTimeSec = frame / fps;

  // ── Dynamic Background Music Auto-Ducking Engine ──
  const isMusicEnabled = (props as any).bgmEnabled !== false && (props as any).musicEnabled !== false;
  const rawMusicUrl = props.musicUrl || props.musicSrc || props.bgmUrl || '';
  const musicTrackUrl = isMusicEnabled ? rawMusicUrl : 'none';
  const resolvedMusicSrc = !isMusicEnabled || musicTrackUrl === 'none' || !musicTrackUrl
    ? ''
    : safeResolveMediaSrc(musicTrackUrl);

  const dynamicMusicVolume = React.useMemo(() => {
    // User configured volume level (e.g. 0.12 for 12%, 0.20 for 20%, 0.35 for 35%)
    const configuredVol = typeof props.bgmVolume === 'number'
      ? props.bgmVolume
      : (typeof props.musicVolume === 'number' ? props.musicVolume : 0.12);

    if (!isMusicEnabled || configuredVol <= 0 || !resolvedMusicSrc) return 0;
    if (props.autoDucking === false) return Math.min(1.0, Math.max(0.0, configuredVol));

    // Base volume during voiceover speech is strictly the user's configured volume
    const baseDuckedVolume = Math.min(1.0, Math.max(0.0, configuredVol));
    if (!activeCaptions || activeCaptions.length === 0) return baseDuckedVolume;

    // Smooth 250ms (0.25s) ramp to prevent audio "pumping" artifacts
    let minDistanceToSpeechSec = 999;
    let isSpeaking = false;

    for (const c of activeCaptions) {
      const start = Number(c.start ?? (c as any).startSeconds ?? 0);
      const end = Number(c.end ?? (c as any).endSeconds ?? 0);
      if (currentTimeSec >= start && currentTimeSec <= end) {
        isSpeaking = true;
        break;
      }
      if (currentTimeSec < start) {
        minDistanceToSpeechSec = Math.min(minDistanceToSpeechSec, start - currentTimeSec);
      } else if (currentTimeSec > end) {
        minDistanceToSpeechSec = Math.min(minDistanceToSpeechSec, currentTimeSec - end);
      }
    }

    // Ducking depth from selected preset (-8 dB Gentle, -14 dB Balanced, -20 dB Podcast Clear)
    const dbRatio = duckingDb <= -18 ? 0.25 : duckingDb >= -10 ? 0.58 : 0.40;
    const swellVolume = Math.min(1.0, Math.max(baseDuckedVolume, baseDuckedVolume * (1 / dbRatio) * 0.55));
    const speechDuckedVolume = Math.max(0.015, baseDuckedVolume * (duckingDb <= -18 ? 0.65 : duckingDb >= -10 ? 1.15 : 1.0));

    if (isSpeaking) {
      return speechDuckedVolume; // Smoothly ducked during speech per selected dB preset
    }

    // 250ms smooth transition ramp up to swell volume, and ramp down when speech approaches
    if (minDistanceToSpeechSec < 0.25) {
      const rampProgress = minDistanceToSpeechSec / 0.25;
      return speechDuckedVolume + (swellVolume - speechDuckedVolume) * rampProgress;
    }

    return swellVolume;
  }, [activeCaptions, currentTimeSec, props.musicVolume, props.bgmVolume, props.autoDucking, duckingDb, isMusicEnabled, resolvedMusicSrc]);

  // Collect all speech words for contextual kinetic emoji pops & kinetic typography
  const allCaptionWords = React.useMemo(() => {
    const list: Array<{ word: string; start: number; end: number }> = [];
    activeCaptions.forEach((chunk) => {
      if (Array.isArray(chunk.words) && chunk.words.length > 0) {
        list.push(...chunk.words);
      }
    });
    if (list.length === 0 && sceneBlueprint && sceneBlueprint.length > 0) {
      sceneBlueprint.forEach((sc) => {
        const seg = sc.narrationSegment;
        const sStart = Number(seg?.startSeconds ?? (seg as any)?.start ?? 0);
        const sEnd = Number(seg?.endSeconds ?? (seg as any)?.end ?? 0);
        const text = seg?.text || sc.heading || '';
        const tokens = text.split(/\s+/).filter(Boolean);
        const dur = Math.max(0.5, sEnd - sStart);
        tokens.forEach((t, i) => {
          list.push({
            word: t,
            start: sStart + (i / Math.max(1, tokens.length)) * dur,
            end: sStart + ((i + 1) / Math.max(1, tokens.length)) * dur,
          });
        });
      });
    }
    return list;
  }, [activeCaptions, sceneBlueprint]);

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

  // Resolve legacy asset props only when the temporary image pause is lifted.
  const allBrollList = React.useMemo(() => {
    if (!brollUrls) return [];
    if (Array.isArray(brollUrls)) return brollUrls.filter(Boolean);
    if (typeof brollUrls === 'object') return Object.values(brollUrls).filter(Boolean);
    return [];
  }, [brollUrls]);

  // Automated Master Multi-Layer Timeline Composition (Unlimited Tracks)
  const autoComposedBlueprint = React.useMemo(() => {
    return composeMultiLayerVideoBlueprint(
      sceneBlueprint,
      '16:9',
      allBrollList,
      resolvedMusicSrc,
      props.bgmVolume ?? props.musicVolume ?? 0.12
    );
  }, [sceneBlueprint, allBrollList, resolvedMusicSrc, props.bgmVolume, props.musicVolume]);

  const resolvedTextLayers = textLayers && textLayers.length > 0
    ? textLayers
    : [];

  const resolvedBackgroundLayers = backgroundLayers && backgroundLayers.length > 0
    ? backgroundLayers
    : [];

  const resolvedAudioLayers = audioLayers && audioLayers.length > 0
    ? audioLayers
    : [];

  const resolvedSvgLayers = svgLayers && svgLayers.length > 0
    ? svgLayers
    : [];

  const resolvedMediaLayers = (mediaLayers && mediaLayers.length > 0
    ? mediaLayers
    : (imageLayers && imageLayers.length > 0 ? imageLayers : []));

  const speechActiveIntervals = React.useMemo(() => {
    if (activeCaptions && activeCaptions.length > 0) {
      return activeCaptions.map((c) => ({
        start: Number(c.start ?? (c as any).startSeconds ?? 0),
        end: Number(c.end ?? (c as any).endSeconds ?? 0),
      }));
    }
    return sceneBlueprint.map((sc) => ({
      start: Number(sc.narrationSegment?.startSeconds ?? 0),
      end: Number(sc.narrationSegment?.endSeconds ?? (Number(sc.narrationSegment?.startSeconds ?? 0) + (sc.duration || 5))),
    }));
  }, [activeCaptions, sceneBlueprint]);
  // Image visuals are temporarily paused for faceless videos; keep legacy asset props for compatibility.
  const currentSceneIdx = Math.max(0, (currentScene?.sceneNumber || 1) - 1);

  // Resolve legacy asset props strictly within the 10% image budget (never recycle across scenes)
  const matchedBrollUrl = FACELESS_IMAGE_VISUALS_ENABLED ? (
    (brollUrls && typeof brollUrls === 'object' && !Array.isArray(brollUrls)
      ? (currentScene?.sceneNumber
          ? ((brollUrls as Record<number, string>)[currentScene.sceneNumber] ||
              (brollUrls as Record<string, string>)[String(currentScene.sceneNumber)] ||
              '')
          : '')
      : Array.isArray(brollUrls) && brollUrls.length > 0 && currentSceneIdx === 0
        ? brollUrls[0]
        : '') ||
    currentScene?.assetUrl ||
    currentScene?.brollUrl ||
    '') : '';

  // Faceless Video Master Canvas: Permanently Pure White (#FFFFFF)
  const activeBackgroundTheme: string = backgroundTheme || 'solid-white';
  const palette = React.useMemo(() => getBackgroundPalette(activeBackgroundTheme), [activeBackgroundTheme]);
  const isLightBackground = !palette.isDark;

  // ── Dynamic Scene Transition Engine ──
  // 1. Cut: Direct cut, instantaneous (no fade)
  // 2. Crossfade / Dissolve: Smooth opacity blend over 10 frames
  // 3. Slide / Wipe: Enters with subtle horizontal push (50px -> 0) and smooth opacity
  // 4. Zoom: Camera-like smooth scale (1.08 -> 1.0) and opacity
  // 5. Fade to Black: Dips through black overlay at scene transition
  const sceneStartFrame = Math.round(
    Number(currentScene?.narrationSegment?.startSeconds ?? (currentScene?.narrationSegment as any)?.start ?? 0) * fps
  );
  const sceneEndFrame = Math.round(
    Number(currentScene?.narrationSegment?.endSeconds ?? (currentScene?.narrationSegment as any)?.end ?? (sceneStartFrame / fps + (currentScene?.duration || 5))) * fps
  );
  const sceneTotalFrames = Math.max(24, sceneEndFrame - sceneStartFrame);
  const framesSinceSceneStart = Math.max(0, frame - sceneStartFrame);
  const framesUntilSceneEnd = Math.max(0, sceneEndFrame - frame);

  // Rotate dynamic transitions across scenes unless user explicitly picked hard-cut / specific override
  const TRANSITION_CYCLE = ['slide', 'zoom', 'dissolve', 'whip'] as const;
  const cycleTransition = TRANSITION_CYCLE[currentSceneIdx % TRANSITION_CYCLE.length];
  const explicitOverride =
    sceneTransitionStyle === 'hard-cut'
      ? 'cut'
      : sceneTransitionStyle === 'slide-push'
        ? 'slide'
        : sceneTransitionStyle === 'zoom-whip'
          ? 'zoom'
          : undefined;
  const transitionType = (
    currentSceneIdx === 0
      ? 'zoom'
      : explicitOverride || currentScene?.transition || cycleTransition
  ).toLowerCase();

  const pacingMult =
    pacingStyle === 'dynamic'
      ? 0.75
      : pacingStyle === 'clean'
        ? 1.15
        : pacingStyle === 'documentary'
          ? 1.1
          : 1.0;

  const transitionStyles = React.useMemo(() => {
    const f = (baseFrames: number) => Math.max(4, Math.round(baseFrames * pacingMult));
    const exitFade = framesUntilSceneEnd < 6 && currentSceneIdx < sceneBlueprint.length - 1
      ? interpolate(framesUntilSceneEnd, [0, 6], [0.25, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;

    if (transitionType === 'cut') {
      return { opacity: 1, transform: 'none', filter: 'none', isFadeToBlack: false, blackOverlayOpacity: 0 };
    }
    if (transitionType === 'slide' || transitionType === 'wipe') {
      const slideX = interpolate(framesSinceSceneStart, [0, f(13)], [140, 0], { extrapolateRight: 'clamp' });
      const sc = interpolate(framesSinceSceneStart, [0, f(13)], [0.96, 1], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [0, f(10)], [0, 1], { extrapolateRight: 'clamp' });
      return {
        opacity: op * exitFade,
        transform: `translateX(${slideX}px) scale(${sc})`,
        filter: 'none',
        isFadeToBlack: false,
        blackOverlayOpacity: 0,
      };
    }
    if (transitionType === 'whip' || transitionType === 'whip_pan') {
      const whipX = interpolate(framesSinceSceneStart, [0, f(11)], [220, 0], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [0, f(8)], [0, 1], { extrapolateRight: 'clamp' });
      const blurVal = interpolate(framesSinceSceneStart, [0, f(5), f(10)], [10, 4, 0], { extrapolateRight: 'clamp' });
      return {
        opacity: op * exitFade,
        transform: `translateX(${whipX}px)`,
        filter: blurVal > 0 ? `blur(${blurVal}px)` : 'none',
        isFadeToBlack: false,
        blackOverlayOpacity: 0,
      };
    }
    if (transitionType === 'zoom' || transitionType === 'zoom_blur') {
      const scaleVal = interpolate(framesSinceSceneStart, [0, f(14)], [1.14, 1.0], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [0, f(9)], [0, 1], { extrapolateRight: 'clamp' });
      return {
        opacity: op * exitFade,
        transform: `scale(${scaleVal})`,
        filter: 'none',
        isFadeToBlack: false,
        blackOverlayOpacity: 0,
      };
    }
    if (transitionType === 'fade_to_black' || transitionType === 'dip_to_black') {
      const blackOpacity = interpolate(framesSinceSceneStart, [0, f(6), f(12)], [0.9, 0.55, 0], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [Math.max(1, f(3)), f(11)], [0, 1], { extrapolateRight: 'clamp' });
      return { opacity: op * exitFade, transform: 'none', filter: 'none', isFadeToBlack: true, blackOverlayOpacity: blackOpacity };
    }
    // Crossfade / dissolve with subtle scale drift
    const dissolveOp = interpolate(framesSinceSceneStart, [0, f(13)], [0, 1], { extrapolateRight: 'clamp' });
    const dissolveScale = interpolate(framesSinceSceneStart, [0, f(13)], [1.04, 1.0], { extrapolateRight: 'clamp' });
    return {
      opacity: dissolveOp * exitFade,
      transform: `scale(${dissolveScale})`,
      filter: 'none',
      isFadeToBlack: false,
      blackOverlayOpacity: 0,
    };
  }, [transitionType, framesSinceSceneStart, framesUntilSceneEnd, currentSceneIdx, sceneBlueprint.length, pacingMult]);

  // Render Vox/Johnny Harris Style Modular Scene Layout
  const renderModularScene = (scene: SceneBlueprintItem) => {
    const rawLayout: string = typeof scene.layoutType === 'string' && scene.layoutType ? scene.layoutType : 'card_concept';
    const norm = rawLayout.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Canonical Layout Normalizer (2026 Engine - maps PascalCase & snake_case)
    let layout = rawLayout;
    if (norm.includes('curvedroadmap') || norm.includes('curvedroad')) layout = 'curved_roadmap';
    else if (norm.includes('orgchart') || norm.includes('circularorg') || norm.includes('radialorbit')) layout = 'circular_org_chart';
    else if (norm.includes('horizontalshelves') || norm.includes('shelves') || norm.includes('tierstack')) layout = 'horizontal_shelves';
    else if (norm.includes('scorecard') || norm.includes('kpidashboard')) layout = 'scorecard_dashboard';
    else if (norm.includes('tableofcontent') || norm.includes('agenda') || norm === 'toc') layout = 'table_of_contents';
    else if (norm.includes('missionvision') || norm.includes('visionmission')) layout = 'mission_vision';
    else if (norm.includes('medical') || norm.includes('clinical') || norm.includes('vitalsmonitor')) layout = 'medical_infographic';
    else if (norm.includes('roughnotation') || norm.includes('handdrawn') || norm === 'rough') layout = 'rough_notation';
    else if (norm.includes('lottiemotion') || norm === 'lottie') layout = 'lottie_motion';
    else if (norm.includes('codediff') || norm.includes('codeupgrade') || norm === 'diff') layout = 'code_diff';
    else if (norm.includes('threeglobe') || norm.includes('globe3d') || norm === 'globe') layout = 'three_globe';
    else if (norm.includes('mapflyover') || norm.includes('routemap') || norm === 'flyover') layout = 'map_flyover';
    else if (norm.includes('kinetickit') || norm.includes('kineticword') || norm === 'kinetic') layout = 'kinetic_kit';
    else if (norm.includes('statscene') || norm === 'stat' || norm === 'statcard' || norm === 'metricpill') layout = 'stat_card';
    else if (norm.includes('comparisonscene') || norm === 'comparison' || norm === 'vsbattle' || norm === 'battlecard') layout = 'comparison';
    else if (norm.includes('horizontalprocess') || norm.includes('processsteps') || norm === '5stepprocess') layout = 'horizontal_process';
    else if (norm.includes('workflowscene') || norm === 'workflow' || norm === 'pipeline' || norm === 'automation') layout = 'workflow';
    else if (norm.includes('roadmapscene') || norm === 'roadmap' || norm === 'timeline') layout = 'roadmap';
    else if (norm.includes('cardconceptscene') || norm === 'cardconcept' || norm === 'splitimage' || norm === 'splitscreen') layout = 'card_concept';
    else if (norm.includes('listscene') || norm === 'checklist' || norm === 'iconlist') layout = 'checklist';
    else if (norm.includes('chartscene') || norm === 'datavisualization' || norm === 'chart') layout = 'data_visualization';
    else if (norm.includes('hooktypographyscene') || norm === 'hookscene' || norm === 'hook') layout = 'hook';
    else if (norm.includes('quotescene')) layout = 'quote';
    else if (norm.includes('chaptertitlescene')) layout = 'chapter_title';
    else if (norm.includes('drawingstoryscene')) layout = 'drawing_story';
    else if (norm.includes('typographyscene')) layout = 'big_typography';
    else if (norm.includes('beforeafter')) layout = 'before_after_transformation';
    else if (norm.includes('creatorcelebration') || norm === 'outro') layout = 'creator_celebration';

    const stype = scene.sceneType || 'main_point';
    const resolvedAssetUrl = matchedBrollUrl ? safeResolveMediaSrc(matchedBrollUrl) : undefined;
    const sceneKey = `scene-${scene.sceneNumber || 0}`;

    // ── Autonomous Motion Graphic Library Component Overlay (1,282 Components) ──
    if (scene.overlayComponent?.componentId || layout === 'library_overlay') {
      const compId = scene.overlayComponent?.componentId;
      if (compId) {
        return (
          <DynamicLibraryHost
            key={sceneKey}
            componentId={compId}
            props={scene.overlayComponent?.props || {}}
            cinematic={scene.overlayComponent?.cinematic ?? true}
            sceneFrame={framesSinceSceneStart}
            sceneDurationFrames={Math.round((scene.duration || 5) * fps)}
            palette={palette}
            scale={scene.overlayComponent?.scale || 1.0}
            placement={scene.overlayComponent?.placement || 'center'}
          />
        );
      }
    }

    // ── High-Impact 16:9 Widescreen Narrative Archetypes (Priority Dispatch) ──
    if (layout === 'story_character_desk' || layout === 'creator_desk' || layout === 'character_desk') {
      return (
        <StoryCharacterDeskScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'horizontal_process' || layout === 'process_steps' || layout === '5_step_process') {
      return (
        <HorizontalProcessStepsScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'product_mockup_flow' || layout === 'interface_mockup' || layout === 'workflow_flow') {
      return (
        <ProductMockupFlowScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'before_after_transformation' || layout === 'transformation' || layout === 'before_after') {
      return (
        <BeforeAfterTransformationScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'outro' || layout === 'conclusion_celebration' || layout === 'creator_celebration') {
      return (
        <OutroScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
          creatorHandle={creatorHandle}
        />
      );
    }

    // ── Modern PowerPoint/Keynote-Grade Infographic Presentation Suites ──
    if (
      layout === 'curved_roadmap' ||
      layout === 'circular_org_chart' ||
      layout === 'horizontal_shelves' ||
      layout === 'scorecard_dashboard' ||
      layout === 'table_of_contents' ||
      layout === 'mission_vision' ||
      layout === 'medical_infographic' ||
      layout === 'infographic'
    ) {
      return (
        <InfographicScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if ((layout === 'hook' || stype === 'hook') && scene.sceneNumber <= 1) {
      return (
        <HookScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (layout === 'chapter_title' || (layout as string) === 'chapterTitle' || (stype === 'hook' && scene.sceneNumber > 1)) {
      return (
        <ChapterTitleScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    // Explicit drawing_story layout from Scene-by-Scene JSON
    if (
      (layout === 'drawing_story' ||
        layout === 'sketch_story' ||
        (scene as Record<string, unknown>).explanationMode === 'drawing_story' ||
        Boolean((scene as Record<string, unknown>).drawingKeyword)) &&
      !resolvedAssetUrl
    ) {
      return (
        <DrawingStoryScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    // Use FacelessGraphicScene strictly for multi-point allocation / time-series growth plans
    if (
      scene.graphicPlan &&
      (scene.graphicPlan.kind === 'allocation' || scene.graphicPlan.kind === 'growth') &&
      scene.graphicPlan.items.length >= 2
    ) {
      return (
        <FacelessGraphicScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    // ── Dynamic Modular Layouts (Card Concept, Split Screen, Mockups, Stats, Charts) ──
    if (layout === 'card_concept') {
      return (
        <CardConceptScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          backgroundTheme={backgroundTheme}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }

    if (layout === 'vs_battle' || layout === 'comparison_battle' || layout === 'battle_card') {
      const leftTitle = scene.comparisonItems?.left || scene.heading || 'Traditional Method';
      const rightTitle = scene.comparisonItems?.right || scene.supportingText || 'AI Advantage';
      const battleAccent = (scene as any).accentColor || palette.accent || '#EA580C';
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 80px', zIndex: 12, gap: '36px' }}>
          {scene.heading && (
            <div style={{ textAlign: 'center', maxWidth: '1400px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ width: '28px', height: '3px', backgroundColor: battleAccent, borderRadius: '2px' }} />
                <span style={{ fontFamily: headingFont, fontSize: '14px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: battleAccent }}>
                  HEAD TO HEAD
                </span>
                <span style={{ width: '28px', height: '3px', backgroundColor: battleAccent, borderRadius: '2px' }} />
              </div>
              <h2 style={{ fontFamily: headingFont, fontSize: '48px', fontWeight: 900, color: palette?.isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>
                {scene.heading}
              </h2>
              {scene.supportingText && (
                <p style={{ fontFamily: typographyFont, fontSize: '20px', color: palette?.isDark ? '#94A3B8' : '#64748B', margin: '8px 0 0', fontWeight: 500 }}>
                  {scene.supportingText}
                </p>
              )}
            </div>
          )}
          <VsBattleCard
            leftTitle={leftTitle}
            leftSubtitle={scene.comparisonItems?.left ? scene.supportingText : undefined}
            leftStatus="loser"
            rightTitle={rightTitle}
            rightSubtitle={scene.comparisonItems?.right ? scene.narrationSegment?.text : undefined}
            rightStatus="winner"
            theme={palette?.isDark ? 'dark' : 'light'}
            orientation="horizontal"
            width={1120}
          />
        </div>
      );
    }

    if (layout === 'metric_pill' || layout === 'growth_stat' || layout === 'metric_stat') {
      const val = scene.statValue || (scene.chartValuePercent ? `+${scene.chartValuePercent}%` : '+340%');
      const lbl = scene.statLabel || scene.heading || 'Key Performance Growth';
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <MetricGrowthPill
            value={val}
            label={lbl}
            growthDelta={scene.chartValuePercent ? `+${scene.chartValuePercent}%` : '+142%'}
            isPositive={true}
            theme={palette?.isDark ? 'dark' : 'light'}
          />
        </div>
      );
    }

    if (layout === 'notification' || layout === 'iphone_alert' || layout === 'ios_notification') {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <IPhoneNotificationCard
            title={scene.heading || 'Important Alert'}
            message={scene.supportingText || scene.narrationSegment?.text || ''}
            appName="Alert"
            appIcon="bell"
            theme={palette?.isDark ? 'dark' : 'light'}
            width={640}
          />
        </div>
      );
    }

    if (layout === 'newspaper_headline' || layout === 'breaking_news') {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <NewspaperHeadlineCard
            headline={scene.heading || 'BREAKING INDUSTRY REPORT'}
            highlightWords={scene.highlightedWords || []}
            theme={palette?.isDark ? 'dark' : 'light'}
            width={880}
          />
        </div>
      );
    }

    if (layout === 'stamp_badge' || layout === 'verified_badge') {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <div style={{ fontFamily: headingFont, fontSize: '52px', fontWeight: 900, color: palette?.isDark ? '#FFFFFF' : '#0F172A', marginBottom: '32px', textAlign: 'center', maxWidth: '1000px', lineHeight: 1.2 }}>
            {scene.heading}
          </div>
          <StampBadge text={scene.supportingText || 'VERIFIED FACT'} color="#EF4444" />
        </div>
      );
    }

    if (layout === 'supporting_note' || layout === 'note_card' || layout === 'editorial_note') {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <SupportingNoteCard
            tag={scene.categoryPill || 'CORE CONCEPT'}
            title={scene.heading}
            content={scene.supportingText || scene.narrationSegment?.text || ''}
            bullets={scene.listItems}
            author={scene.quoteAuthor}
            colorHue={scene.sceneNumber % 2 === 0 ? 'yellow' : 'cyan'}
            width={820}
          />
        </div>
      );
    }

    if (layout === 'data_visualization') {
      if (scene.chartItems && scene.chartItems.length >= 2 && scene.chartItems.every(c => c.value > 0)) {
        return (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 80px', zIndex: 12, gap: '32px' }}>
            {scene.heading && (
              <div style={{ textAlign: 'center', maxWidth: '1400px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ width: '28px', height: '3px', backgroundColor: '#FF5722', borderRadius: '2px' }} />
                  <span style={{ fontFamily: headingFont, fontSize: '14px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FF5722' }}>
                    DATA INTELLIGENCE
                  </span>
                  <span style={{ width: '28px', height: '3px', backgroundColor: '#FF5722', borderRadius: '2px' }} />
                </div>
                <h2 style={{ fontFamily: headingFont, fontSize: '46px', fontWeight: 900, color: palette?.isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>
                  {scene.heading}
                </h2>
                {scene.supportingText && (
                  <p style={{ fontFamily: typographyFont, fontSize: '20px', color: palette?.isDark ? '#94A3B8' : '#64748B', margin: '8px 0 0', fontWeight: 500 }}>
                    {scene.supportingText}
                  </p>
                )}
              </div>
            )}
            <AdaptiveCard theme={palette?.isDark ? 'dark' : 'light'} style={{ width: 840, padding: '32px 40px' }}>
              <AnimatedBarChart
                title=""
                items={scene.chartItems}
                theme={palette?.isDark ? 'dark' : 'light'}
              />
            </AdaptiveCard>
          </div>
        );
      }
      // Context-preserving fallback: Preserve text & concept via SplitScreenLayout (never full-screen stock footage)
      return (
        <SplitScreenLayout
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'donut_breakdown') {
      if (scene.donutSlices && scene.donutSlices.length >= 2 && scene.donutSlices.every(s => s.value > 0)) {
        return (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
            <AdaptiveCard theme={palette?.isDark ? 'dark' : 'light'} style={{ width: 580 }}>
              <DonutBreakdown
                slices={scene.donutSlices}
                centerValue={scene.statValue || (scene.donutSlices[0] ? `${scene.donutSlices[0].value}%` : undefined)}
                centerLabel={scene.heading}
                theme={palette?.isDark ? 'dark' : 'light'}
              />
            </AdaptiveCard>
          </div>
        );
      }
      // Context-preserving fallback: Preserve text & concept via SplitScreenLayout (never full-screen stock footage)
      return (
        <SplitScreenLayout
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'sticky_note') {
      const noteText = scene.supportingText || scene.narrationSegment?.text || '';
      if (!noteText.trim()) {
        return (
          <SplitScreenLayout
            scene={scene}
            mediaUrl={resolvedAssetUrl}
            headingFont={headingFont}
            bodyFont={typographyFont}
            sceneFrame={framesSinceSceneStart}
            palette={palette}
          />
        );
      }
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <StickyNoteCard
            title={scene.heading}
            text={noteText}
            colorHue="yellow"
            width={480}
          />
        </div>
      );
    }

    if (layout === 'numbered_steps') {
      if (scene.listItems && scene.listItems.length >= 2) {
        const stepItems = scene.listItems.map((item) => ({ title: item, description: undefined }));
        return (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 120px', zIndex: 12 }}>
            <AdaptiveCard theme={palette?.isDark ? 'dark' : 'light'} style={{ width: 680 }}>
              <NumberedStepsCard
                title={scene.heading}
                steps={stepItems}
                theme={palette?.isDark ? 'dark' : 'light'}
              />
            </AdaptiveCard>
          </div>
        );
      }
      // Fallback: If no distinct sequential steps exist, render standard ListScene or SplitScreenLayout
      return (
        <SplitScreenLayout
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'social_post') {
      const postContent = scene.supportingText || scene.narrationSegment?.text || '';
      if (!postContent.trim()) {
        return (
          <SplitScreenLayout
            scene={scene}
            mediaUrl={resolvedAssetUrl}
            headingFont={headingFont}
            bodyFont={typographyFont}
            sceneFrame={framesSinceSceneStart}
            palette={palette}
          />
        );
      }
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <SocialPostMockup
            postText={postContent}
            authorName={scene.quoteAuthor}
            theme={palette?.isDark ? 'dark' : 'light'}
            width={580}
          />
        </div>
      );
    }

    if (layout === 'chat_dialogue') {
      if (scene.chatMessages && scene.chatMessages.length >= 2) {
        return (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
            <ChatConversation
              messages={scene.chatMessages}
              theme={palette?.isDark ? 'dark' : 'light'}
              width={520}
            />
          </div>
        );
      }
      // Fallback: Single message bubble or SplitScreenLayout (never fabricated dialogue)
      return (
        <ScriptBubbleScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }

    if (layout === 'vector_concept') {
      return (
        <DrawingStoryScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'search_discovery') {
      const query = scene.searchQuery || scene.heading;
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <TypingSearchBar
            title={query}
            theme={palette?.isDark ? 'dark' : 'light'}
          />
        </div>
      );
    }

    if (layout === 'rough_notation') {
      return (
        <RoughNotationScene
          heading={scene.heading || (scene as any).title || 'Key Principle'}
          keyPhrase={(scene as any).keyTakeaway || scene.heading || (scene as any).title}
          supportingText={scene.supportingText || scene.narrationSegment?.text}
          accentColor={(scene as any).accentColor || palette.accent}
          headingFont={headingFont}
          typographyFont={typographyFont}
          palette={palette}
        />
      );
    }
    if (layout === 'lottie_motion') {
      return (
        <LottieScene
          heading={scene.heading || (scene as any).title || 'Animated Concept'}
          supportingText={scene.supportingText || (scene as any).keyTakeaway || scene.narrationSegment?.text}
          lottieUrl={(scene as any).lottieUrl}
          accentColor={(scene as any).accentColor || palette.accent}
          headingFont={headingFont}
          typographyFont={typographyFont}
          palette={palette}
        />
      );
    }
    if (layout === 'code_diff') {
      return (
        <AnimatedCodeDiffScene
          heading={scene.heading || (scene as any).title || 'Code Comparison'}
          filename={(scene as any).filename}
          language={(scene as any).language}
          lines={(scene as any).diffLines}
          headingFont={headingFont}
          typographyFont={typographyFont}
          palette={palette}
        />
      );
    }
    if (layout === 'three_globe') {
      return (
        <ThreeGlobeScene
          heading={scene.heading || (scene as any).title || 'Global Scale'}
          supportingText={scene.supportingText || scene.narrationSegment?.text}
          statLabel={(scene as any).statLabel || 'Key Metric'}
          statValue={(scene as any).statValue || (scene as any).keyTakeaway || '100%'}
          accentColor={(scene as any).accentColor || palette.accent}
          headingFont={headingFont}
          typographyFont={typographyFont}
          palette={palette}
        />
      );
    }
    if (layout === 'map_flyover') {
      return (
        <MapFlyoverScene
          heading={scene.heading || (scene as any).title || 'Route Flyover'}
          originLabel={(scene as any).originLabel || 'Origin'}
          destinationLabel={(scene as any).destinationLabel || 'Destination'}
          accentColor={(scene as any).accentColor || palette.accent}
          headingFont={headingFont}
          typographyFont={typographyFont}
          palette={palette}
        />
      );
    }
    if (layout === 'kinetic_kit') {
      return (
        <KineticKitScene
          heading={scene.heading || (scene as any).title || 'Key Takeaway'}
          supportingText={scene.supportingText || scene.narrationSegment?.text}
          badgeText={(scene as any).keyTakeaway ? 'KEY INSIGHT' : 'HIGHLIGHT'}
          metricValue={(scene as any).statValue || '94%'}
          accentColor={(scene as any).accentColor || palette.accent}
          headingFont={headingFont}
          typographyFont={typographyFont}
          palette={palette}
        />
      );
    }

    if (layout === 'card_concept' || (layout as string) === 'cardIconKeyword') {
      return (
        <CardConceptScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          backgroundTheme={palette?.isDark ? 'purple-vignette' : 'studio-white'}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }
    if (layout === 'split_screen' || (layout as string) === 'side_by_side' || (layout as string) === 'splitImageText') {
      return (
        <SplitScreenLayout
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (layout === 'image_text') {
      return (
        <FullBleedVisualScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (layout === 'stat_card' || (layout as string) === 'stat' || stype === 'example_stat') {
      return (
        <StatScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (layout === 'data_visualization' || (layout as string) === 'chart' || (layout as string) === 'diagram') {
      return <ChartScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    if (layout === 'screenshot_highlight' || (layout as string) === 'web_mockup') {
      return (
        <FullBleedVisualScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (layout === 'comparison') {
      return <ComparisonScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    if (layout === 'quote') {
      return (
        <QuoteScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (layout === 'ecosystem' || layout === 'framework' || (layout === 'checklist' && scene.sceneNumber % 3 === 0 && (scene.listItems?.length || 0) >= 3)) {
      return <EcosystemScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    const isProcessStepsContext =
      layout === 'horizontal_process' ||
      layout === 'process_steps' ||
      layout === '5_step_process' ||
      layout === 'roadmap' ||
      layout === 'numbered_steps' ||
      /5 step|5-step|five step|process|step 1|steps to|roadmap|strategy steps|simple steps|how to start|turn your idea/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isProcessStepsContext) {
      return (
        <HorizontalProcessStepsScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    const isRoadmapContext =
      layout === 'roadmap' ||
      layout === 'timeline' ||
      /roadmap|milestone|step by step|stage|timeline|fastest way|progression|career path/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isRoadmapContext) {
      return <RoadmapScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    const isWorkflowContext =
      layout === 'workflow' ||
      /workflow|ai employee|voice agent|automation|pipeline|inbound|call agent|phone agent|booking agent/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isWorkflowContext) {
      return <WorkflowScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    const isGoalTargetContext =
      layout === 'goal_target' ||
      /salary|emergency fund|lakh|crore|50\/30\/20|allocation|sip|savings rate|target fund|monthly expenses/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isGoalTargetContext) {
      return <GoalTargetScene scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    const isCalendarContext =
      layout === 'calendar_grid' ||
      layout === 'calendar' ||
      layout === 'time_block' ||
      /calendar|schedule|time block|time-block|weekly plan|daily plan/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isCalendarContext) {
      return (
        <CalendarGridScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }
    const isPromptContext =
      layout === 'prompt_window' ||
      layout === 'code_prompt' ||
      layout === 'ai_prompt' ||
      /prompt|chatgpt|claude|llm|socratic tutor|terminal|query template/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isPromptContext) {
      return (
        <PromptWindowScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }
    const isMilestoneLadderContext =
      layout === 'milestone_ladder' ||
      layout === 'milestone' ||
      /ladder|milestone|staircase|progression|mission 1|mission 2|mission 3|1k ladder/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isMilestoneLadderContext) {
      return (
        <MilestoneLadderScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }
    const isScriptBubbleContext =
      layout === 'script_bubble' ||
      /outreach script|text message|script template|message bubble|dm script/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isScriptBubbleContext) {
      return (
        <ScriptBubbleScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }
    if (layout === 'checklist' || (layout as string) === 'iconList' || scene.typographyTreatment === 'list' || (scene.listItems && scene.listItems.length >= 2)) {
      return (
        <ListScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (stype === 'next_point') {
      return (
        <ConclusionScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'big_typography' || layout === 'bold_headline' || layout === 'headline' || layout === 'fullscreen_statement') {
      return (
        <TypographyScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (resolvedAssetUrl) {
      return (
        <FullBleedVisualScene
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    // Default Flagship 16:9 Explanatory Visual Fallback (2026 Engine):
    // Prioritize high-end CardConceptScene or ListScene (never default to stickman drawing!)
    if (scene.listItems && scene.listItems.length >= 2) {
      return (
        <ListScene
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    return (
      <CardConceptScene
        scene={scene}
        mediaUrl={resolvedAssetUrl}
        headingFont={headingFont}
        bodyFont={typographyFont}
        backgroundTheme={backgroundTheme}
        sceneFrame={framesSinceSceneStart}
      />
    );
  };

  const isModularCardScene =
    currentScene?.layoutType === 'split_screen';

  const resolvedSceneBroll = (matchedBrollUrl && isValidMediaUrl(matchedBrollUrl)) ? safeResolveMediaSrc(matchedBrollUrl) : '';

  // ── Auto-generate Rich Beat-Matched Sound Effects with Anti-Repetition Rotation ──
  const resolvedSfxEvents = React.useMemo(() => {
    if (sfxEvents && sfxEvents.length > 0) return sfxEvents;

    const HOOK_SFX = [
      '/assets/reusable/sound-effects/cinematic-boom.wav',
      '/assets/reusable/sound-effects/bass-drop-light.wav',
      '/assets/reusable/sound-effects/transition-sweep.wav',
      '/assets/reusable/sound-effects/hit-strong.wav',
    ];

    const TRANSITION_SWEEPS = [
      '/assets/reusable/sound-effects/whoosh-fast.wav',
      '/assets/reusable/sound-effects/transition-sweep.wav',
      '/assets/reusable/sound-effects/whoosh-short.wav',
      '/assets/reusable/sound-effects/air-rush.wav',
      '/assets/reusable/sound-effects/swipe-left.wav',
      '/assets/reusable/sound-effects/swipe-right.wav',
    ];

    const POPS_AND_CLICKS = [
      '/assets/reusable/sound-effects/pop-medium.wav',
      '/assets/reusable/sound-effects/bubble-pop.wav',
      '/assets/reusable/sound-effects/pop-soft.wav',
      '/assets/reusable/sound-effects/ui-click-pop.wav',
      '/assets/reusable/sound-effects/pop-strong.wav',
    ];

    const SUCCESS_ACHIEVEMENT = [
      '/assets/reusable/sound-effects/success-bell.wav',
      '/assets/reusable/sound-effects/trophy-sound.wav',
      '/assets/reusable/sound-effects/achievement-unlock.wav',
      '/assets/reusable/sound-effects/success-chime.wav',
      '/assets/reusable/sound-effects/score-reveal.wav',
    ];

    const WEALTH_MONEY = [
      '/assets/reusable/sound-effects/cash-register.wav',
      '/assets/reusable/sound-effects/coin-drop.wav',
      '/assets/reusable/sound-effects/coin-stack.wav',
      '/assets/reusable/sound-effects/cash-count.wav',
      '/assets/reusable/sound-effects/payment-success.wav',
    ];

    const WARNING_DANGER = [
      '/assets/reusable/sound-effects/warning-beep.wav',
      '/assets/reusable/sound-effects/negative-buzz.wav',
      '/assets/reusable/sound-effects/error-sound.wav',
    ];

    const EVENTS: Array<{ id: string; startFrame: number; sfxUrl: string; volume: number }> = [];
    let lastSfxFrame = -90; // Minimum 3.5s spacing between sound effects

    sceneBlueprint.forEach((scene, i) => {
      const startSec = Number(scene.narrationSegment?.startSeconds ?? (scene.narrationSegment as any)?.start ?? 0);
      const startFrame = Math.round(startSec * fps);

      // Enforce professional spacing: at least 2.6s apart to avoid repetitive barrage
      if (startFrame - lastSfxFrame < Math.round(2.6 * fps)) {
        return;
      }

      const fullText = `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`.toLowerCase();
      let chosenPool = TRANSITION_SWEEPS;

      if (i === 0) {
        chosenPool = HOOK_SFX;
      } else if (/\b(warning|danger|mistake|risk|trap|avoid|loss|bad|lose|broke|debt|nuksan|problem|wrong|quit|quitting)\b/.test(fullText)) {
        chosenPool = WARNING_DANGER;
      } else if (/\b(invest|investing|money|cash|dollar|wealth|rich|profit|revenue|salary|crore|lakh)\b/.test(fullText)) {
        chosenPool = WEALTH_MONEY;
      } else if (/\b(win|winner|success|achieve|champion|growth|trophy|compound|victory|milestone)\b/.test(fullText)) {
        chosenPool = SUCCESS_ACHIEVEMENT;
      } else if (i % 2 === 0) {
        chosenPool = TRANSITION_SWEEPS;
      } else {
        chosenPool = POPS_AND_CLICKS;
      }

      // Pick rotating variant based on scene index so it NEVER repeats the same file
      const sfxPath = chosenPool[i % chosenPool.length];

      EVENTS.push({
        id: `sfx-scene-${i}`,
        startFrame,
        sfxUrl: sfxPath,
        volume: 0.32,
      });

      lastSfxFrame = startFrame;
    });

    return EVENTS;
  }, [sfxEvents, sceneBlueprint, fps]);

  // ── Faceless Video Stickers: Strictly clean creator graphics (NO cheesy cartoon avatar man) ──
  const resolvedStickerEvents = React.useMemo(() => {
    if (templateConfig.stickerPackId === '3d-presenter-man' || templateConfig.stickerPackId === 'none') {
      return [];
    }
    return stickerEvents && stickerEvents.length > 0 ? stickerEvents : [];
  }, [stickerEvents, templateConfig.stickerPackId]);

  // Dynamic Caption Safe Zone: adjusts automatically based on whether captions are enabled and their position
  const hasVisibleCaptions = showCaptions !== false && activeCaptions.length > 0;
  const captionSafeZoneStyle: React.CSSProperties = React.useMemo(() => {
    if (!hasVisibleCaptions) {
      return { paddingTop: 0, paddingBottom: 0 };
    }
    if (props.captionPosition === 'top') {
      return { paddingTop: 112, paddingBottom: 0 };
    }
    if (props.captionPosition === 'center') {
      return { paddingTop: 0, paddingBottom: 72 };
    }
    return { paddingTop: 0, paddingBottom: 120 };
  }, [hasVisibleCaptions, props.captionPosition]);

  return (
    <VideoVisualThemeProvider theme={visualTheme}>
      <AbsoluteFill
        style={{
          fontFamily: typographyFont,
          backgroundColor: palette.bg,
          color: palette.textPrimary,
          ['--font-heading' as any]: headingFont,
          ['--font-body' as any]: typographyFont,
          ['--font-accent' as any]: accentFont,
          ['--scene-accent' as any]: (currentScene as any)?.accentColor || palette.accent,
          ['--scene-secondary' as any]: (currentScene as any)?.secondaryColor || palette.accent,
        }}
      >
        {/* ── GLOBAL VISUAL LAYER 1: Background + Texture Overlay ── */}
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
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.55)', backdropFilter: 'blur(3px)' }} />
          </div>
        ) : (
          <MultiLayerBackgroundOverlay
            layers={resolvedBackgroundLayers}
            fallbackTheme={activeBackgroundTheme}
            aspectRatio="16:9"
          />
        )}
        {canvasTexture === 'dot-grid' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              backgroundImage: `radial-gradient(${palette.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)'} 1.5px, transparent 1.5px)`,
              backgroundSize: '28px 28px',
            }}
          />
        )}
        {canvasTexture === 'square-grid' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              backgroundImage: `linear-gradient(0deg, ${palette.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${palette.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'} 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        )}
        {canvasTexture === 'vignette' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              background: palette.isDark
                ? 'radial-gradient(circle at center, transparent 48%, rgba(0,0,0,0.48) 100%)'
                : 'radial-gradient(circle at center, transparent 52%, rgba(15,23,42,0.12) 100%)',
            }}
          />
        )}
        {canvasTexture === 'paper' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              opacity: 0.45,
              backgroundImage: `repeating-linear-gradient(0deg, ${palette.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.025)'} 0px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, ${palette.isDark ? 'rgba(255,255,255,0.025)' : 'rgba(15,23,42,0.02)'} 0px, transparent 1px, transparent 5px)`,
            }}
          />
        )}

        {/* ── LAYER 2: Deep Ambient Media Underlay (For Dark/Atmospheric Card & Split Scenes) ── */}
        {isModularCardScene &&
          resolvedSceneBroll &&
          palette.isDark &&
          typeof activeBackgroundTheme === 'string' &&
          !activeBackgroundTheme.startsWith('solid-') &&
          activeBackgroundTheme !== 'studio-white' &&
          activeBackgroundTheme !== 'solid-cream' &&
          activeBackgroundTheme !== 'minimal-gray' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                overflow: 'hidden',
                pointerEvents: 'none',
                opacity: 0.55,
              }}
            >
              {isVideoFile(resolvedSceneBroll) ? (
                <Loop durationInFrames={180}>
                  <OffthreadVideo
                    src={resolvedSceneBroll}
                    volume={0}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scale(1.2)',
                      filter: 'blur(38px) brightness(0.32) saturate(1.4)',
                    }}
                  />
                </Loop>
              ) : (
                <Img
                  src={resolvedSceneBroll}
                  alt="Ambient underlay"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.2)',
                    filter: 'blur(38px) brightness(0.32) saturate(1.4)',
                  }}
                />
              )}
            </div>
          )}

        {/* ── LAYER 2.5: Ambient Canvas Motion Graphics (Particles & Kinetic Visual Energy) ── */}
        <CanvasGraphicsLayer
          width={1920}
          height={1080}
          zIndex={6}
          effects={[
            {
              type: 'particles',
              startFrame: 0,
              endFrame: durationInFrames,
              config: {
                count: palette.isDark ? 28 : 0,
                color: palette.isDark ? 'rgba(255, 160, 0, 0.40)' : 'transparent',
                speed: 0.35,
                maxRadius: 2.5,
              },
            },
          ]}
        />

        {/* ── LAYER 3 (MIDDLE): Independent Scene Pipeline with Dynamic Caption Safe Zone & Keynote Callouts ── */}
        {(() => {
          const sceneAccent = (currentScene as any)?.accentColor || palette.accent || '#EA580C';
          const stickerId = (currentScene as any)?.conceptSticker as string | undefined;
          const hasArrow = Boolean((currentScene as any)?.highlightArrow);
          const arrowDrawProgress = interpolate(framesSinceSceneStart, [4, 22], [120, 0], { extrapolateRight: 'clamp' });
          const stickerScale = spring({ frame: Math.max(0, framesSinceSceneStart - 4), fps, config: { damping: 14, stiffness: 180 } });
          const stickerMap: Record<string, { emoji: string; label: string }> = {
            lightbulb: { emoji: '💡', label: 'Key Insight' },
            rocket: { emoji: '🚀', label: 'Fast Growth' },
            check: { emoji: '✅', label: 'Verified' },
            trending: { emoji: '📈', label: 'Trending Up' },
            warning: { emoji: '⚠️', label: 'Watch Out' },
          };
          const activeSticker = stickerId ? stickerMap[stickerId] : undefined;

          const sceneNode = (
            <>
              {currentScene && renderModularScene(currentScene)}
              {hasArrow && (
                <svg
                  width="110"
                  height="90"
                  viewBox="0 0 110 90"
                  fill="none"
                  style={{
                    position: 'absolute',
                    top: '14%',
                    right: '8%',
                    zIndex: 24,
                    pointerEvents: 'none',
                  }}
                >
                  <path
                    d="M12 14 C 48 12, 76 34, 84 72"
                    stroke={sceneAccent}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray="120"
                    strokeDashoffset={arrowDrawProgress}
                  />
                  <path
                    d="M68 62 L84 74 L94 56"
                    stroke={sceneAccent}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={framesSinceSceneStart > 16 ? 1 : 0}
                  />
                </svg>
              )}
              {activeSticker && (
                <div
                  style={{
                    position: 'absolute',
                    top: '9%',
                    left: '5%',
                    zIndex: 24,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: palette.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)',
                    border: `2px solid ${sceneAccent}`,
                    transform: `scale(${stickerScale}) rotate(-3deg)`,
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{activeSticker.emoji}</span>
                  <span
                    style={{
                      fontFamily: accentFont,
                      fontSize: '26px',
                      fontWeight: 700,
                      color: sceneAccent,
                      lineHeight: 1,
                    }}
                  >
                    {activeSticker.label}
                  </span>
                </div>
              )}
            </>
          );

          return cameraConfig ? (
            <VirtualCameraLayer config={cameraConfig}>
              <div
                key={`scene-wrap-${currentScene?.sceneNumber || currentSceneIdx}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 15,
                  opacity: transitionStyles.opacity,
                  transform: transitionStyles.transform,
                  filter: transitionStyles.filter !== 'none' ? transitionStyles.filter : undefined,
                  boxSizing: 'border-box',
                  ...captionSafeZoneStyle,
                }}
              >
                {sceneNode}
              </div>
            </VirtualCameraLayer>
          ) : (
            <div
              key={`scene-wrap-${currentScene?.sceneNumber || currentSceneIdx}`}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 15,
                opacity: transitionStyles.opacity,
                transform: transitionStyles.transform,
                filter: transitionStyles.filter !== 'none' ? transitionStyles.filter : undefined,
                boxSizing: 'border-box',
                ...captionSafeZoneStyle,
              }}
            >
              {sceneNode}
            </div>
          );
        })()}

        {/* ── LAYER 3.0: Reusable Dynamic Pattern & Texture Engine (Halftone, Noise, Hatch, Waves, Mesh) ── */}
        {patternLayers && patternLayers.length > 0 ? (
          <MultiLayerPatternOverlay patterns={patternLayers} />
        ) : null}

        {/* ── LAYER 3.2: Reusable Dynamic Multi-Layer Media Engine (Unlimited Image & Video Clips) ── */}
        {resolvedMediaLayers && resolvedMediaLayers.length > 0 ? (
          <MultiLayerImageOverlay layers={resolvedMediaLayers} />
        ) : null}

        {/* ── LAYER 3.3: Reusable Dynamic Multi-Layer SVG Engine (Unlimited Vector Archetypes) ── */}
        {resolvedSvgLayers && resolvedSvgLayers.length > 0 ? (
          <MultiLayerSvgOverlay layers={resolvedSvgLayers} />
        ) : null}

        {/* ── LAYER 3.3B: Reusable 2.5D Isometric Engine (Cubes, Platforms, 3D Mockups) ── */}
        {isometricLayers && isometricLayers.length > 0 ? (
          <IsometricPerspectiveOverlay layers={isometricLayers} />
        ) : null}

        {/* ── LAYER 3.3C: Reusable Gauge & Progress Engine (Rings, Speedometers, Counters) ── */}
        {gaugeLayers && gaugeLayers.length > 0 ? (
          <MultiLayerGaugeOverlay gauges={gaugeLayers} />
        ) : null}

        {/* ── LAYER 3.3D: Reusable Audio Visualizer Engine (Equalizer Bars, Waves, Audiograms) ── */}
        {audioVisualizerLayers && audioVisualizerLayers.length > 0 ? (
          <MultiLayerAudioVisualizerOverlay visualizers={audioVisualizerLayers} audioSrc={resolvedAudioSrc} />
        ) : null}

        {/* ── LAYER 3.4: Reusable Dynamic Multi-Layer Mask Engine (Scrims & Cutouts) ── */}
        {maskLayers && maskLayers.length > 0 ? (
          <MultiLayerMaskOverlay masks={maskLayers} />
        ) : null}

        {/* ── LAYER 3.5: Reusable Dynamic Adjustment Layer (Color Grading & LUTs) ── */}
        {adjustmentLayers && adjustmentLayers.length > 0 ? (
          <MultiLayerAdjustmentOverlay layers={adjustmentLayers} />
        ) : null}

        {/* ── LAYER 3.6: Reusable Dynamic Effects Engine (Grain, Leaks, Vignette) ── */}
        {effectsLayers && effectsLayers.length > 0 ? (
          <MultiLayerEffectsOverlay effects={effectsLayers} />
        ) : null}

        {/* ── LAYER 3.7: Reusable Dynamic Transitions Engine (Whips, Snaps, Glitches) ── */}
        {transitionEvents && transitionEvents.length > 0 ? (
          <MultiLayerTransitionOverlay transitions={transitionEvents} />
        ) : null}

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

        {/* ── LAYER 4: Subject Cutout Mask & Floating Stickers ── */}
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

        {/* ── Multi-Track Audio Engine (Background Music & Audio Layers) ── */}
        {resolvedAudioLayers && resolvedAudioLayers.length > 0 ? (
          <MultiLayerAudioOverlay
            layers={resolvedAudioLayers}
            speechActiveIntervals={speechActiveIntervals}
          />
        ) : (
          <>
            {resolvedMusicSrc && (
              <Audio
                src={resolvedMusicSrc}
                volume={dynamicMusicVolume}
              />
            )}
          </>
        )}

        {/* Voiceover Audio Stream (Always active when not handled by audioLayers) */}
        {resolvedAudioSrc && (!resolvedAudioLayers || resolvedAudioLayers.length === 0) && (
          <Audio
            src={resolvedAudioSrc}
            startFrom={Math.round(mediaTrimStartSeconds * fps)}
            volume={sourceAudioVolume}
          />
        )}

        {/* ── Timed Sound Effects Layer (Beat-synced impacts, whooshes, chimes, pops) ── */}
        {resolvedSfxEvents
          .filter((sfx) => Boolean(sfx?.sfxUrl) && sfx.startFrame >= 0 && sfx.startFrame < durationInFrames)
          .map((sfx) => (
            <Sequence
              key={sfx.id}
              from={sfx.startFrame}
              durationInFrames={Math.min(Math.round(2.5 * fps), Math.max(1, durationInFrames - sfx.startFrame))}
            >
              <Audio src={safeResolveMediaSrc(sfx.sfxUrl)} volume={sfx.volume} />
            </Sequence>
          ))}

        {/* Sticker Layer */}
        {templateConfig.stickerPackId && templateConfig.stickerPackId !== 'none' && resolvedStickerEvents.length > 0 ? (
          <UniversalStickerLayer stickerEvents={resolvedStickerEvents} stickerPackId={templateConfig.stickerPackId} />
        ) : null}

        {/* ── Dynamic Kinetic Emoji / Sticker Engine (MrBeast & Hormozi Contextual Pops) ── */}
        {enableKineticEmojis && props.aspectRatio !== '16:9' && (
          <KineticEmojiLayer
            events={emojiEvents}
            words={allCaptionWords}
            enabled={enableKineticEmojis}
            position="above-caption"
          />
        )}

        {/* ── LAYER 4.5: Reusable Dynamic Multi-Layer Text Engine (Unlimited Independent Text Layers) ── */}
        {resolvedTextLayers && resolvedTextLayers.length > 0 ? (
          <MultiLayerTextOverlay layers={resolvedTextLayers} defaultHeadingFont={headingFont} />
        ) : null}

        {/* ── LAYER 4.6: Reusable Dynamic Callout & Label Engine (Speech Bubbles, Infocards, Pointers) ── */}
        {calloutLayers && calloutLayers.length > 0 ? (
          <MultiLayerCalloutOverlay callouts={calloutLayers} />
        ) : null}

        {/* ── LAYER 5: Broadcast HUD & Chapter Progress Bar ── */}
        {/* Top Edge Flame Orange Progress Indicator */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${Math.min(100, Math.max(0, (currentTimeSec / Math.max(1, durationSeconds)) * 100))}%`,
            height: '6px',
            background: 'linear-gradient(90deg, #FF5722, #FF7043, #FFA000)',
            zIndex: 40,
            boxShadow: '0 0 12px rgba(255, 87, 34, 0.85)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating Creator Handle / Brand Watermark Badge */}
        {creatorHandle && (
          <div
            style={{
              position: 'absolute',
              top: 28,
              right: 48,
              zIndex: 42,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: palette.isDark ? 'rgba(7, 11, 20, 0.75)' : 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${palette.cardBorder}`,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: headingFont,
                fontSize: '12px',
                fontWeight: 800,
                color: palette.accent,
                letterSpacing: '0.04em',
              }}
            >
              {typeof creatorHandle === 'string' && creatorHandle.startsWith('@') ? creatorHandle : `@${creatorHandle || ''}`}
            </span>
          </div>
        )}

        {/* Chapter Lower Third Cards */}
        <UniversalLowerThird chapterEvents={chapterEvents} lowerThirdId={templateConfig.lowerThirdId} />

        {/* ── LAYER 6: Context-Aware Subtitles with Speech Adequacy Evaluation ── */}
        {(() => {
          if (showCaptions === false || activeCaptions.length === 0) return null;

          // Find active spoken chunk at the current timestamp
          const activeChunk = activeCaptions.find(
            (c) => currentTimeSec >= c.start && currentTimeSec <= c.end
          );

          // Check if on-screen text adequately represents current spoken words
          let isAdequatelyRepresented = false;
          if (currentScene && activeChunk?.text) {
            const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
            const spoken = normalize(activeChunk.text);
            if (spoken && spoken.length >= 5) {
              const onScreenCandidates = [
                currentScene.heading,
                currentScene.supportingText,
                currentScene.quoteAuthor ? `${currentScene.heading} ${currentScene.quoteAuthor}` : '',
              ]
                .filter(Boolean)
                .map((t) => normalize(String(t)));

              for (const text of onScreenCandidates) {
                if (!text) continue;
                if (text.includes(spoken) || spoken.includes(text)) {
                  isAdequatelyRepresented = true;
                  break;
                }
                const words = spoken.split(/\s+/).filter((w) => w.length > 2);
                if (words.length > 0) {
                  const matchCount = words.filter((w) => text.includes(w)).length;
                  if (matchCount / words.length >= 0.75) {
                    isAdequatelyRepresented = true;
                    break;
                  }
                }
              }
            }
          }

          // Suppress subtitle ONLY when on-screen text already conveys the spoken words
          if (isAdequatelyRepresented) return null;

          const resolvedThemeId =
            props.subtitleStyle && props.subtitleStyle !== 'bold_yellow' && props.subtitleStyle !== 'netflix-yellow'
              ? props.subtitleStyle
              : 'classic-clean';

          if (isGithubRemotionCaptionStyle(props.subtitleStyle)) {
            return (
              <GithubRemotionCaption
                captions={activeCaptions.map((c) => ({
                  text: c.text,
                  start: c.start,
                  end: c.end,
                }))}
                styleName={props.subtitleStyle!}
                position={props.captionPosition || 'bottom'}
              />
            );
          }

          return (
            <UniversalCaptionLayer
              chunks={activeCaptions}
              themeId={resolvedThemeId}
              animationStyle={props.captionAnimationStyle || 'smooth'}
              position={props.captionPosition || 'bottom'}
              emphasisWords={currentScene?.highlightedWords || []}
              backgroundTheme="solid-white"
              styleOverrides={{
                fontSize: 40,
                fontFamily: typographyFont,
                fontWeight: 800,
              }}
            />
          );
        })()}

        {/* ── LAYER 7: Subtle Architectural Frame (Zero Dark Vignette) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 55,
            pointerEvents: 'none',
          }}
        />
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 56,
            opacity: 0.045,
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        >
          <filter id="faceless-longvideo-film-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#faceless-longvideo-film-grain)" />
        </svg>
        <BrandWatermark watermark={watermark} isLandscape />
      </AbsoluteFill>
    </VideoVisualThemeProvider>
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
      backgroundTheme: 'solid-white',
      musicVolume: 0.12,
    }}
    calculateMetadata={({ props }) => {
      const p = props as FacelessLongVideoProps;
      const durationSeconds = Math.max(5, Math.min(300, Number(p.durationSeconds) || 60));
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1920,
        height: 1080,
      };
    }}
  />
);
