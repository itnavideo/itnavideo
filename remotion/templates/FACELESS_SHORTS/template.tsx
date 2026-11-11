import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  continueRender,
  delayRender,
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
import { VirtualCameraLayer, type VirtualCameraConfig } from '../../components/library/VirtualCameraLayer';
import { VideoVisualThemeProvider, type VideoVisualTheme } from '../../theme/VideoVisualTheme';
import { CanvasGraphicsLayer } from '../../layers/CanvasGraphicsLayer';
import { DEFAULT_FPS, secondsToFrames } from '../../constants';
import type { SceneBlueprintItem } from '../../../services/ai/sceneBlueprintTypes';
import { safeResolveMediaSrc, isValidMediaUrl, isVideoMedia as isVideoFile } from '../../utils/safeMedia';

import { Background } from './components/Background';
import { getBackgroundPalette, type BackgroundColorPalette } from '../../components/backgrounds/BackgroundCatalog';
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
import { ChartScene } from './scenes/ChartScene';
import { FullBleedVisualScene } from './scenes/FullBleedVisualScene';
import { FacelessGraphicScene } from './scenes/FacelessGraphicScene';
import { SVGFullBleedScene } from './scenes/SVGFullBleedScene';
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
import { FACELESS_DESIGN_TOKENS } from './facelessTokens';
import { BrandWatermark } from '../../components/BrandWatermark';
import { getFacelessFontAssetPath } from '../../../lib/fonts/facelessFontCatalog';
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

// Temporary editorial setting: faceless videos use typography and native SVG graphics instead of stock or uploaded images.
const FACELESS_IMAGE_VISUALS_ENABLED = true;

export interface FacelessShortsProps {
  mediaSrc?: string;
  audioSrc?: string;
  musicUrl?: string;
  musicSrc?: string;
  musicVolume?: number;
  bgmUrl?: string;
  bgmVolume?: number;
  subjectCutoutSrc?: string;
  enable3DTextBehindSubject?: boolean;
  showCaptions?: boolean;
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  durationSeconds?: number;
  mediaTrimStartSeconds?: number;
  sourceAudioVolume?: number;
  audioPlaybackRate?: number;
  title?: string;
  creatorHandle?: string;
  watermark?: boolean;
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
  enableKineticEmojis?: boolean;
  emojiEvents?: KineticEmojiEvent[];
  textLayers?: DynamicTextLayer[];
  imageLayers?: DynamicImageLayer[];
  svgLayers?: DynamicSvgLayer[];
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
  headingFont?: string;
  subheadingFont?: string;
  typographyFont?: string;
  subtitleStyle?: string;
  captionThemeId?: string;
  captionAnimationStyle?: 'mrbeast' | 'handwriting' | 'bouncy' | 'smooth';
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

export function FacelessShortsTemplate(props: FacelessShortsProps) {
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
    enableKineticEmojis = true,
    emojiEvents = [],
    textLayers = [],
    imageLayers = [],
    svgLayers = [],
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
    headingFont = 'Montserrat, sans-serif',
    subheadingFont = 'Plus Jakarta Sans',
    typographyFont = 'Inter, sans-serif',
    templateConfig = {
      captionThemeId: 'bold_yellow',
      lowerThirdId: 'tech_modern',
      stickerPackId: 'none',
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
        background: 'solid-white',
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
    visualTheme = 'modern-saas',
  } = props;

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
    const fontFamilies = [...new Set([headingFont, subheadingFont, typographyFont]
      .map((value) => String(value || '').split(',')[0].trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean))];

    Promise.all(fontFamilies.map(async (family) => {
      const assetPath = getFacelessFontAssetPath(family);
      if (!assetPath || typeof FontFace === 'undefined' || typeof document === 'undefined') {
        if (typeof document !== 'undefined') {
          try {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;600;700;800;900&display=swap`;
            document.head.appendChild(fontLink);
          } catch {}
        }
        return;
      }
      try {
        const fontFace = new FontFace(family, 'url("' + staticFile(assetPath) + '")', {
          style: 'normal',
          weight: '400',
        });
        const loaded = await fontFace.load();
        document.fonts.add(loaded);
      } catch (error) {
        if (typeof document !== 'undefined') {
          try {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;600;700;800;900&display=swap`;
            document.head.appendChild(fontLink);
          } catch {}
        }
      }
    }))
      .then(finish)
      .catch((error) => {
        console.warn('[FACELESS_FONT_LOAD]', error);
        finish();
      });

    return finish;
  }, [fontRenderHandle]);
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

  const resolvedMediaSrc = safeResolveMediaSrc(rawVideo);
  const resolvedAudioSrc = safeResolveMediaSrc(rawAudio);
  const resolvedCutoutSrc = safeResolveMediaSrc(subjectCutoutSrc);

  const hasBackgroundVideo = Boolean(resolvedMediaSrc && isVideoFile(rawVideo));
  const hasSubjectCutout = Boolean(enable3DTextBehindSubject && resolvedCutoutSrc);

  const activeCaptions = showCaptions !== false ? (captions.length > 0 ? captions : subtitleChunks) : [];
  const playbackRate = Math.max(0.5, Math.min(2.0, Number(props.audioPlaybackRate) || 1.0));
  const currentTimeSec = (frame / fps) * playbackRate;

  // Collect all speech words for contextual kinetic emoji pops & kinetic typography
  const allCaptionWords = React.useMemo(() => {
    const list: Array<{ word: string; start: number; end: number }> = [];
    activeCaptions.forEach((chunk) => {
      if (Array.isArray(chunk.words) && chunk.words.length > 0) {
        list.push(...chunk.words);
      }
    });
    // Fallback: if no word timestamps, build from sceneBlueprint narration segments
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

  // ── Dynamic Background Music Auto-Ducking Engine ──
  const musicTrackUrl = props.musicUrl || props.musicSrc || props.bgmUrl || '';
  const resolvedMusicSrc = musicTrackUrl === 'none'
    ? ''
    : safeResolveMediaSrc(musicTrackUrl || 'assets/reusable/music/parasail-silent-partner.mp3');

  const dynamicMusicVolume = React.useMemo(() => {
    // Default BGM volume strictly locked at 12% (user configurable)
    const configuredVol = props.bgmVolume ?? props.musicVolume ?? 0.12;
    const baseDuckedVolume = Math.min(0.35, Math.max(0.0, configuredVol));
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

    const swellVolume = Math.min(0.32, Math.max(baseDuckedVolume, 0.25));

    if (isSpeaking) {
      return baseDuckedVolume; // Locked during speech
    }

    // 250ms smooth transition ramp up to swell volume, and ramp down when speech approaches
    if (minDistanceToSpeechSec < 0.25) {
      const rampProgress = minDistanceToSpeechSec / 0.25;
      return baseDuckedVolume + (swellVolume - baseDuckedVolume) * rampProgress;
    }

    return swellVolume;
  }, [activeCaptions, currentTimeSec, props.musicVolume, props.bgmVolume]);

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
  // Image visuals are temporarily paused for faceless videos; keep legacy asset props for compatibility.
  const currentSceneIdx = Math.max(0, (currentScene?.sceneNumber || 1) - 1);

  const matchedBrollUrl = FACELESS_IMAGE_VISUALS_ENABLED ? (
    (brollUrls && typeof brollUrls === 'object' && !Array.isArray(brollUrls)
      ? (brollUrls as Record<number, string>)[currentScene?.sceneNumber] ||
        (allBrollList.length > 0 ? allBrollList[currentSceneIdx % allBrollList.length] : '')
      : Array.isArray(brollUrls) && brollUrls.length > 0
      ? brollUrls[currentSceneIdx % brollUrls.length]
      : '') ||
    assetTimeline?.[currentScene?.sceneNumber]?.url ||
    mediaAssets.find((a) => (a.startSeconds || 0) <= currentTimeSec && (a.endSeconds || durationSeconds) >= currentTimeSec)?.url ||
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
    if (transitionType === 'whip' || transitionType === 'whip_pan') {
      const whipX = interpolate(framesSinceSceneStart, [0, 8], [120, 0], { extrapolateRight: 'clamp' });
      const op = interpolate(framesSinceSceneStart, [0, 6], [0, 1], { extrapolateRight: 'clamp' });
      const blurVal = interpolate(framesSinceSceneStart, [0, 4, 8], [8, 3, 0], { extrapolateRight: 'clamp' });
      return {
        opacity: op,
        transform: `translateX(${whipX}px)`,
        filter: blurVal > 0 ? `blur(${blurVal}px)` : 'none',
        isFadeToBlack: false,
        blackOverlayOpacity: 0,
      };
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

  // ── Audio-Driven Visual Rhythm Engine: Max 2.5s–3.0s Visual Hold Bound ──
  // If a spoken thought lasts > 2.5 seconds, dynamically punch in camera scale (+8% to +12%)
  // over a buttery 8-frame interpolation so no static frame ever exceeds 3.0 seconds!
  const baseSceneZoom = currentScene?.cameraZoomScale ?? (currentSceneIdx % 2 === 1 ? 1.08 : 1.0);
  const intraScenePunchIn = React.useMemo(() => {
    const holdSeconds = framesSinceSceneStart / fps;
    if (holdSeconds < 2.5) {
      // First 0 to 2.5s: smooth entry at base framing scale
      return baseSceneZoom;
    }
    if (holdSeconds >= 2.5 && holdSeconds < 5.0) {
      // 2.5s to 5.0s: punch in by an additional +7% over 8 frames
      const punchProgress = interpolate(
        framesSinceSceneStart,
        [Math.round(2.5 * fps), Math.round(2.5 * fps + 8)],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      return baseSceneZoom + punchProgress * 0.08;
    }
    // > 5.0s (rare long unpunctuated sentence): second subtle pulse (+12% total)
    const secondPunchProgress = interpolate(
      framesSinceSceneStart,
      [Math.round(5.0 * fps), Math.round(5.0 * fps + 8)],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return baseSceneZoom + 0.08 + secondPunchProgress * 0.04;
  }, [framesSinceSceneStart, fps, baseSceneZoom]);

  // Render Vox/Johnny Harris Style Modular Scene Layout
  const renderModularScene = (scene: SceneBlueprintItem) => {
    if (!FACELESS_IMAGE_VISUALS_ENABLED) scene = { ...scene, visualAssetRequirement: '' };
    const layout: string = scene.layoutType || 'big_typography';
    const stype = scene.sceneType || 'main_point';
    const resolvedAssetUrl = FACELESS_IMAGE_VISUALS_ENABLED && matchedBrollUrl ? safeResolveMediaSrc(matchedBrollUrl) : undefined;

    const sceneKey = `scene-${scene.sceneNumber || 0}`;

    if (stype === 'hook' && scene.sceneNumber <= 1) {
      return (
        <HookScene
          key={sceneKey}
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
          key={sceneKey}
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (
      scene.graphicPlan &&
      (scene.graphicPlan.kind === 'allocation' || scene.graphicPlan.kind === 'growth') &&
      scene.graphicPlan.items.length >= 2
    ) {
      return (
        <FacelessGraphicScene
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    // ── Dynamic Modular Layouts (Split Screen, Full Bleed, Mockups, Stats, Charts) ──
    if (layout === 'vs_battle' || layout === 'comparison_battle' || layout === 'battle_card') {
      const leftTitle = scene.comparisonItems?.left || scene.heading || 'Traditional Method';
      const rightTitle = scene.comparisonItems?.right || scene.supportingText || 'AI Advantage';
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 40px', zIndex: 12 }}>
          <VsBattleCard
            leftTitle={leftTitle}
            leftSubtitle={scene.comparisonItems?.left ? scene.supportingText : undefined}
            leftStatus="loser"
            rightTitle={rightTitle}
            rightSubtitle={scene.comparisonItems?.right ? scene.narrationSegment?.text : undefined}
            rightStatus="winner"
            theme={palette?.isDark ? 'dark' : 'light'}
            orientation="vertical"
            width={760}
          />
        </div>
      );
    }

    if (layout === 'metric_pill' || layout === 'growth_stat' || layout === 'metric_stat') {
      const val = scene.statValue || (scene.chartValuePercent ? `+${scene.chartValuePercent}%` : '+340%');
      const lbl = scene.statLabel || scene.heading || 'Key Performance Growth';
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 50px', zIndex: 12 }}>
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
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 50px', zIndex: 12 }}>
          <IPhoneNotificationCard
            title={scene.heading || 'Important Alert'}
            message={scene.supportingText || scene.narrationSegment?.text || ''}
            appName="Alert"
            appIcon="bell"
            theme={palette?.isDark ? 'dark' : 'light'}
            width={720}
          />
        </div>
      );
    }

    if (layout === 'newspaper_headline' || layout === 'breaking_news') {
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 40px', zIndex: 12 }}>
          <NewspaperHeadlineCard
            headline={scene.heading || 'BREAKING INDUSTRY REPORT'}
            highlightWords={scene.highlightedWords || []}
            theme={palette?.isDark ? 'dark' : 'light'}
            width={760}
          />
        </div>
      );
    }

    if (layout === 'stamp_badge' || layout === 'verified_badge') {
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 50px', zIndex: 12 }}>
          <div style={{ fontFamily: headingFont, fontSize: '42px', fontWeight: 900, color: palette?.isDark ? '#FFFFFF' : '#0F172A', marginBottom: '32px', textAlign: 'center', maxWidth: '800px', lineHeight: 1.2 }}>
            {scene.heading}
          </div>
          <StampBadge text={scene.supportingText || 'VERIFIED FACT'} color="#EF4444" />
        </div>
      );
    }

    const isDrawingStoryContext =
      layout === 'drawing_story' ||
      layout === 'sketch_story' ||
      (scene as Record<string, unknown>).explanationMode === 'drawing_story' ||
      Boolean((scene as Record<string, unknown>).drawingKeyword);
    if (isDrawingStoryContext) {
      const explicitKeyword =
        scene.vectorDrawingId ||
        ((scene as Record<string, unknown>).drawingKeyword as string | undefined);
      const rawText = `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`.toLowerCase();
      const fallbackRotation = [
        'dream_big_vision',
        'story_home_workspace',
        'character_journey_walking',
        'mindset_focus_lane',
        'concept_zero_to_one',
        'character_business_leader',
        'story_journey_road',
        'character_burning_passion',
        'business_target_bullseye',
        'character_thinking',
      ];
      let resolvedKeyword = explicitKeyword;
      if (!resolvedKeyword) {
        if (/village|cottage|roots|childhood|rural|basti|gao/i.test(rawText)) resolvedKeyword = 'story_village_house';
        else if (/city|skyline|building|corporate|downtown|shahar/i.test(rawText)) resolvedKeyword = 'story_city_buildings';
        else if (/road|highway|path|journey|future|rasta|safar/i.test(rawText)) resolvedKeyword = 'story_journey_road';
        else if (/struggle|burden|challenge|hardship|mushkil/i.test(rawText)) resolvedKeyword = 'character_struggling_burden';
        else if (/walk|traveler|moving|alone|stride|chalna/i.test(rawText)) resolvedKeyword = 'character_journey_walking';
        else if (/desk|laptop|study|late night|workspace/i.test(rawText)) resolvedKeyword = 'story_home_workspace';
        else if (/win|celebrat|success|victory/i.test(rawText)) resolvedKeyword = 'character_celebration';
        else resolvedKeyword = fallbackRotation[Math.max(0, (scene.sceneNumber || 1) - 1) % fallbackRotation.length];
      }

      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 48px', zIndex: 12 }}>
          <AdaptiveCard theme={palette?.isDark ? 'dark' : 'light'} style={{ width: 760, padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 14px', borderRadius: '999px' }}>
              VISUAL STORYTELLING
            </div>
            <div style={{ width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: palette?.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <VectorDrawingIcon
                drawingId={resolvedKeyword}
                keyword={resolvedKeyword}
                size={230}
                strokeWidth={3}
                animated={true}
                drawDurationFrames={40}
                theme={palette?.isDark ? 'dark' : 'light'}
              />
            </div>
            <div style={{ fontFamily: headingFont, fontSize: '42px', fontWeight: 900, color: palette?.isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.2 }}>
              {scene.heading}
            </div>
            {scene.supportingText && (
              <div style={{ fontFamily: typographyFont, fontSize: '20px', color: palette?.isDark ? '#94A3B8' : '#475569', lineHeight: 1.45 }}>
                {scene.supportingText}
              </div>
            )}
          </AdaptiveCard>
        </div>
      );
    }

    if (layout === 'supporting_note' || layout === 'note_card' || layout === 'editorial_note') {
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 50px', zIndex: 12 }}>
          <SupportingNoteCard
            tag="KEY TAKEAWAY"
            title={scene.heading}
            content={scene.supportingText || scene.narrationSegment?.text || ''}
            bullets={scene.listItems}
            author={scene.quoteAuthor}
            colorHue={scene.sceneNumber % 2 === 0 ? 'yellow' : 'cyan'}
            width={740}
          />
        </div>
      );
    }

    if (layout === 'data_visualization') {
      if (scene.chartItems && scene.chartItems.length >= 2 && scene.chartItems.every(c => c.value > 0)) {
        return (
          <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
            <AdaptiveCard theme={palette?.isDark ? 'dark' : 'light'} style={{ width: 700 }}>
              <AnimatedBarChart
                title={scene.heading}
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
          key={sceneKey}
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }

    if (layout === 'donut_breakdown') {
      if (scene.donutSlices && scene.donutSlices.length >= 2 && scene.donutSlices.every(s => s.value > 0)) {
        return (
          <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
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
          key={sceneKey}
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }

    if (layout === 'sticky_note') {
      const noteText = scene.supportingText || scene.narrationSegment?.text || '';
      if (!noteText.trim()) {
        return (
          <SplitScreenLayout
            key={sceneKey}
            scene={scene}
            mediaUrl={resolvedAssetUrl}
            headingFont={headingFont}
            bodyFont={typographyFont}
            sceneFrame={framesSinceSceneStart}
          />
        );
      }
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
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
          <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 120px', zIndex: 12 }}>
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
          key={sceneKey}
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }

    if (layout === 'social_post') {
      const postContent = scene.supportingText || scene.narrationSegment?.text || '';
      if (!postContent.trim()) {
        return (
          <SplitScreenLayout
            key={sceneKey}
            scene={scene}
            mediaUrl={resolvedAssetUrl}
            headingFont={headingFont}
            bodyFont={typographyFont}
            sceneFrame={framesSinceSceneStart}
          />
        );
      }
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
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
          <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
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
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }

    if (layout === 'vector_concept') {
      // Full-bleed SVG illustration — fills the entire 9:16 phone canvas
      return (
        <SVGFullBleedScene
          key={sceneKey}
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
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <TypingSearchBar
            title={query}
            theme={palette?.isDark ? 'dark' : 'light'}
          />
        </div>
      );
    }

    if (layout === 'card_concept' || (layout as string) === 'cardIconKeyword') {
      return (
        <CardConceptScene
          key={sceneKey}
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
          key={sceneKey}
          scene={scene}
          mediaUrl={resolvedAssetUrl}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
        />
      );
    }
    if (layout === 'image_text') {
      return (
        <FullBleedVisualScene
          key={sceneKey}
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
          key={sceneKey}
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
      return <ChartScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    if (layout === 'screenshot_highlight' || (layout as string) === 'web_mockup') {
      return (
        <FullBleedVisualScene
          key={sceneKey}
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
      return <ComparisonScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    if (layout === 'quote') {
      return (
        <QuoteScene
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }
    if (layout === 'ecosystem' || layout === 'framework' || (layout === 'checklist' && scene.sceneNumber % 3 === 0 && (scene.listItems?.length || 0) >= 3)) {
      return <EcosystemScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    const isRoadmapContext =
      layout === 'roadmap' ||
      layout === 'timeline' ||
      layout === 'vertical_roadmap' ||
      /roadmap|milestone|step by step|stage|timeline|fastest way|progression|career path/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isRoadmapContext) {
      if (scene.listItems && scene.listItems.length >= 2) {
        const roadmapSteps = scene.listItems.slice(0, 4).map((item, i) => {
          const parts = item.split(/[:•-]/);
          return {
            number: i + 1,
            title: (parts[0] || `Phase ${i + 1}`).trim(),
            detail: (parts[1] || parts[0] || '').trim(),
            badge: i === 0 ? 'START' : i === (scene.listItems?.length || 4) - 1 ? 'GOAL' : `STEP ${i + 1}`,
          };
        });
        return (
          <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 40px', zIndex: 12 }}>
            <VerticalRoadmapDiagram
              title={scene.heading || 'STEP-BY-STEP PROGRESSION'}
              subtitle={scene.supportingText}
              steps={roadmapSteps}
              theme={palette?.isDark ? 'dark' : 'light'}
              width={780}
            />
          </div>
        );
      }
      return <RoadmapScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    const isWorkflowContext =
      layout === 'workflow' ||
      /workflow|ai employee|voice agent|automation|pipeline|inbound|call agent|phone agent|booking agent/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isWorkflowContext) {
      return <WorkflowScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
    }
    const isGoalTargetContext =
      layout === 'goal_target' ||
      /salary|emergency fund|lakh|crore|50\/30\/20|allocation|sip|savings rate|target fund|monthly expenses/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isGoalTargetContext) {
      return <GoalTargetScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} sceneFrame={framesSinceSceneStart} palette={palette} />;
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
          key={sceneKey}
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
          key={sceneKey}
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
          key={sceneKey}
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
          key={sceneKey}
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
          key={sceneKey}
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
          key={sceneKey}
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
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (!resolvedAssetUrl) {
      return (
        <SVGFullBleedScene
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    return (
      <FullBleedVisualScene
        key={sceneKey}
        scene={scene}
        mediaUrl={resolvedAssetUrl}
        headingFont={headingFont}
        bodyFont={typographyFont}
        sceneFrame={framesSinceSceneStart}
        palette={palette}
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

      // Enforce professional spacing: at least 3.5s apart to avoid repetitive barrage
      if (startFrame - lastSfxFrame < Math.round(3.5 * fps)) {
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
        volume: 0.28,
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

  return (
    <VideoVisualThemeProvider theme={visualTheme}>
      <AbsoluteFill style={{ fontFamily: typographyFont, backgroundColor: palette.bg, color: palette.textPrimary }}>
      {/* ── LAYER 1 (BOTTOM): Base Atmospheric Motion Canvas or Video ── */}
      {hasBackgroundVideo && resolvedMediaSrc ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Loop durationInFrames={150}>
            <OffthreadVideo
              src={resolvedMediaSrc}
              startFrom={Math.round(mediaTrimStartSeconds * fps)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: removeAiWatermark ? 'scale(1.07)' : undefined }}
              volume={audioSrc ? 0 : sourceAudioVolume}
            />
          </Loop>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.55)', backdropFilter: 'blur(3px)' }} />
        </div>
      ) : (
        <Background theme={activeBackgroundTheme} customBgUrl={customBgUrl} aspectRatio={props.aspectRatio} />
      )}

      {/* ── LAYER 2: Deep Ambient Media Underlay (For Dark/Atmospheric Card & Split Scenes) ── */}
      {isModularCardScene &&
        resolvedSceneBroll &&
        palette.isDark &&
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
              <img
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
        width={1080}
        height={1920}
        zIndex={6}
        effects={[
          {
            type: 'particles',
            startFrame: 0,
            endFrame: durationInFrames,
            config: {
              count: palette.isDark ? 28 : 14,
              color: palette.isDark ? 'rgba(255, 160, 0, 0.40)' : 'rgba(255, 87, 34, 0.22)',
              speed: 0.35,
              maxRadius: 2.5,
            },
          },
        ]}
      />

      {/* ── LAYER 3 (MIDDLE): Dynamic Modular Scene Engine, Transitions & Kinetic Punch-In ── */}
      {cameraConfig ? (
        <VirtualCameraLayer config={cameraConfig}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 15,
              opacity: transitionStyles.opacity,
              transform: [
                transitionStyles.transform && transitionStyles.transform !== 'none' ? transitionStyles.transform : null,
                `scale(${intraScenePunchIn.toFixed(4)})`,
              ]
                .filter(Boolean)
                .join(' '),
              transformOrigin: 'center 45%',
            }}
          >
            {currentScene && renderModularScene(currentScene)}
          </div>
        </VirtualCameraLayer>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            opacity: transitionStyles.opacity,
            transform: [
              transitionStyles.transform && transitionStyles.transform !== 'none' ? transitionStyles.transform : null,
              `scale(${intraScenePunchIn.toFixed(4)})`,
            ]
              .filter(Boolean)
              .join(' '),
            transformOrigin: 'center 45%',
          }}
        >
          {currentScene && renderModularScene(currentScene)}
        </div>
      )}

      {/* ── LAYER 3.0: Reusable Dynamic Pattern & Texture Engine (Halftone, Noise, Hatch, Waves, Mesh) ── */}
      {patternLayers && patternLayers.length > 0 ? (
        <MultiLayerPatternOverlay patterns={patternLayers} />
      ) : null}

      {/* ── LAYER 3.2: Reusable Dynamic Multi-Layer Image Engine (Unlimited Layers & 8 Presets) ── */}
      {imageLayers && imageLayers.length > 0 ? (
        <MultiLayerImageOverlay layers={imageLayers} />
      ) : null}

      {/* ── LAYER 3.3: Reusable Dynamic Multi-Layer SVG Engine (10 Vector Archetypes) ── */}
      {svgLayers && svgLayers.length > 0 ? (
        <MultiLayerSvgOverlay layers={svgLayers} />
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
        <MultiLayerAudioVisualizerOverlay visualizers={audioVisualizerLayers} />
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

      {/* Dynamic Background Music Track */}
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
          playbackRate={playbackRate}
        />
      )}

      {/* Timed Sound Effects (Pops, Swooshes, Risers, Cash Registers) */}
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

      {/* ── Dynamic Kinetic Emoji / Sticker Engine (MrBeast & Hormozi Contextual Pops) ── */}
      {enableKineticEmojis && (
        <KineticEmojiLayer
          events={emojiEvents}
          words={allCaptionWords}
          enabled={enableKineticEmojis}
          position="above-caption"
        />
      )}

      {/* Sticker Layer */}
      {templateConfig.stickerPackId && templateConfig.stickerPackId !== 'none' && resolvedStickerEvents.length > 0 ? (
        <UniversalStickerLayer stickerEvents={resolvedStickerEvents} stickerPackId={templateConfig.stickerPackId} />
      ) : null}

      {/* ── LAYER 4.5: Reusable Dynamic Multi-Layer Text Engine (Unlimited Independent Text Layers) ── */}
      {textLayers && textLayers.length > 0 ? (
        <MultiLayerTextOverlay layers={textLayers} defaultHeadingFont={headingFont} />
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
          height: '4px',
          background: 'linear-gradient(90deg, #FF5722, #FF7043, #FFA000)',
          zIndex: 40,
          boxShadow: '0 0 12px rgba(255, 87, 34, 0.85)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Topic Kicker Badge */}
      {title && (
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 48,
            zIndex: 42,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
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
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: palette.accent,
              boxShadow: `0 0 8px ${palette.accent}`,
            }}
          />
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: palette.textPrimary,
              maxWidth: '340px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </span>
        </div>
      )}

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
            {creatorHandle.startsWith('@') ? creatorHandle : `@${creatorHandle}`}
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
        // Keep captions continuous for viewer retention

        return (
          <UniversalCaptionLayer
            chunks={activeCaptions}
            themeId={props.subtitleStyle || props.captionThemeId || templateConfig.captionThemeId || 'bold_yellow'}
            animationStyle={props.captionAnimationStyle || 'smooth'}
            position={props.captionPosition || 'bottom'}
            emphasisWords={currentScene?.highlightedWords || []}
            backgroundTheme={activeBackgroundTheme}
            styleOverrides={{
              fontSize: 26,
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
        <filter id="faceless-shorts-film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#faceless-shorts-film-grain)" />
      </svg>
    <BrandWatermark watermark={watermark} isLandscape={false} />
    </AbsoluteFill>
    </VideoVisualThemeProvider>
  );
}

export { FacelessShortsTemplate as FacelessLongVideo };

export const FacelessShortsComposition = () => (
  <Composition
    id="FACELESS-SHORTS"
    component={FacelessShortsTemplate}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={{
      durationSeconds: 60,
      title: 'FACELESS SHORTS',
      backgroundTheme: 'solid-white',
      musicVolume: 0.12,
    }}
    calculateMetadata={({ props }) => {
      const p = props as FacelessShortsProps;
      const rate = Math.max(0.5, Math.min(2.0, Number(p.audioPlaybackRate) || 1.0));
      const rawDur = Math.max(5, Number(p.durationSeconds) || 60);
      const durationSeconds = Math.min(90, rawDur / rate);
      return {
        durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS),
        fps: DEFAULT_FPS,
        width: 1080,
        height: 1920,
      };
    }}
  />
);
