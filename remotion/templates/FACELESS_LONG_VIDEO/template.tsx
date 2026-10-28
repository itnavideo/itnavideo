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
import { FACELESS_DESIGN_TOKENS } from './facelessTokens';
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

// Reusable image visuals and transparent PNGs enabled
const FACELESS_IMAGE_VISUALS_ENABLED = true;

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
  bgmUrl?: string;
  bgmVolume?: number;
  mediaUrl?: string;
  renderWindowSeconds?: number;
  sourceDurationSeconds?: number;
  chapterEvents?: ChapterCardEvent[];
  stickerEvents?: StickerEvent[];
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
    backgroundTheme = 'solid-white',
    customBgUrl = '',
    sfxEvents = [],
    chapterEvents = [],
    stickerEvents = [],
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
      if (!assetPath || typeof FontFace === 'undefined' || typeof document === 'undefined') return;
      const fontFace = new FontFace(family, 'url("' + staticFile(assetPath) + '")', {
        style: 'normal',
        weight: '400',
      });
      document.fonts.add(await fontFace.load());
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
  const currentTimeSec = frame / fps;

  // ── Dynamic Background Music Auto-Ducking Engine ──
  const musicTrackUrl = props.musicUrl || props.musicSrc || '';
  const resolvedMusicSrc = safeResolveMediaSrc(musicTrackUrl);

  const dynamicMusicVolume = React.useMemo(() => {
    // Default BGM volume strictly locked at 12% (capped at 30% per standard)
    const baseDuckedVolume = Math.min(0.30, Math.max(0.08, props.musicVolume ?? 0.12));
    if (!activeCaptions || activeCaptions.length === 0) return baseDuckedVolume;

    const isSpeaking = activeCaptions.some((c) => {
      const start = Number(c.start ?? (c as any).startSeconds ?? 0);
      const end = Number(c.end ?? (c as any).endSeconds ?? 0);
      return currentTimeSec >= start - 0.1 && currentTimeSec <= end + 0.15;
    });

    if (isSpeaking) {
      return baseDuckedVolume; // Stay strictly locked at 10% - 12% during active voiceover
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

  // Resolve legacy asset props only when the temporary image pause is lifted.
  const allBrollList = React.useMemo(() => {
    if (!brollUrls) return [];
    if (Array.isArray(brollUrls)) return brollUrls.filter(Boolean);
    if (typeof brollUrls === 'object') return Object.values(brollUrls).filter(Boolean);
    return [];
  }, [brollUrls]);
  // Image visuals are temporarily paused for faceless videos; keep legacy asset props for compatibility.
  const currentSceneIdx = Math.max(0, (currentScene?.sceneNumber || 1) - 1);

  // Resolve legacy asset props strictly within the 10% image budget (never recycle across scenes)
  const matchedBrollUrl = FACELESS_IMAGE_VISUALS_ENABLED ? (
    (brollUrls && typeof brollUrls === 'object' && !Array.isArray(brollUrls)
      ? (brollUrls as Record<number, string>)[currentScene?.sceneNumber] || ''
      : Array.isArray(brollUrls) && brollUrls.length > 0 && currentSceneIdx === 0
      ? brollUrls[0]
      : '') ||
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

  // Render Vox/Johnny Harris Style Modular Scene Layout
  const renderModularScene = (scene: SceneBlueprintItem) => {
    const layout: string = scene.layoutType || 'big_typography';
    const stype = scene.sceneType || 'main_point';
    const resolvedAssetUrl = matchedBrollUrl ? safeResolveMediaSrc(matchedBrollUrl) : undefined;
    const sceneKey = `scene-${scene.sceneNumber || 0}`;

    // ── High-Impact 16:9 Widescreen Narrative Archetypes (Priority Dispatch) ──
    if (layout === 'story_character_desk' || layout === 'creator_desk' || layout === 'character_desk') {
      return (
        <StoryCharacterDeskScene
          key={sceneKey}
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
          key={sceneKey}
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
          key={sceneKey}
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
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (layout === 'creator_celebration' || layout === 'celebration' || layout === 'conclusion_celebration') {
      return (
        <CreatorCelebrationScene
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    // 1. Context-Aware Vector Storytelling Engine (Human stories, struggles, journeys, startups, mindsets)
    const isDrawingStoryContext =
      layout === 'drawing_story' ||
      layout === 'sketch_story' ||
      layout === 'vector_concept' ||
      (scene as Record<string, unknown>).explanationMode === 'drawing_story' ||
      Boolean((scene as Record<string, unknown>).drawingKeyword) ||
      /village|cottage|skyline|skyscraper|city|road|highway|journey|safar|walk|travel|alone|struggle|burden|challenge|hardship|mushkil|obstacle|desk|laptop|study|late night|workspace|working hard|works hard|mistake|failure|give up|giving up|start today|first step|determination|patience|consistency|dream|founder|skills|decision|zero|shunya|start|shuruat|kadam|first step|scratch|zero se|beginning|paisa|paise|money|capital|resource|fund|salary|investment|kharcha|wealth|passion|junoon|fire|drive|energy|grit|mehnat|hard work|compare|comparison|tulna|focus|distraction|apni tulna|others|lane|sapna|vision|bada|reach|summit|mountain|star|hope|ambition|safalta|seekhna|soch|manzil|target|goal|future/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );

    if (isDrawingStoryContext && !resolvedAssetUrl) {
      return (
        <DrawingStoryScene
          key={sceneKey}
          scene={scene}
          headingFont={headingFont}
          bodyFont={typographyFont}
          sceneFrame={framesSinceSceneStart}
          palette={palette}
        />
      );
    }

    if (scene.graphicPlan) {
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
    // ── Dynamic Modular Layouts (Split Screen, Card Concept, Mockups, Stats, Charts) ──
    if (layout === 'split_screen' || layout === 'card_concept') {
      return (
        <CardConceptScene
          key={sceneKey}
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
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 80px', zIndex: 12, gap: '36px' }}>
          {scene.heading && (
            <div style={{ textAlign: 'center', maxWidth: '1400px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ width: '28px', height: '3px', backgroundColor: '#FF5722', borderRadius: '2px' }} />
                <span style={{ fontFamily: headingFont, fontSize: '14px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FF5722' }}>
                  HEAD TO HEAD
                </span>
                <span style={{ width: '28px', height: '3px', backgroundColor: '#FF5722', borderRadius: '2px' }} />
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
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
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
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
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
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
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
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <div style={{ fontFamily: headingFont, fontSize: '52px', fontWeight: 900, color: palette?.isDark ? '#FFFFFF' : '#0F172A', marginBottom: '32px', textAlign: 'center', maxWidth: '1000px', lineHeight: 1.2 }}>
            {scene.heading}
          </div>
          <StampBadge text={scene.supportingText || 'VERIFIED FACT'} color="#EF4444" />
        </div>
      );
    }

    if (layout === 'supporting_note' || layout === 'note_card' || layout === 'editorial_note') {
      return (
        <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 100px', zIndex: 12 }}>
          <SupportingNoteCard
            tag="KEY TAKEAWAY"
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
          <div key={sceneKey} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 80px', zIndex: 12, gap: '32px' }}>
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
          palette={palette}
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
            palette={palette}
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
          palette={palette}
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
            palette={palette}
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
      return (
        <DrawingStoryScene
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
          palette={palette}
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
      return <ChartScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
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
      return <ComparisonScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
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
      return <EcosystemScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
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
          key={sceneKey}
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
      return <RoadmapScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }
    const isWorkflowContext =
      layout === 'workflow' ||
      /workflow|ai employee|voice agent|automation|pipeline|inbound|call agent|phone agent|booking agent/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isWorkflowContext) {
      return <WorkflowScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
    }
    const isGoalTargetContext =
      layout === 'goal_target' ||
      /salary|emergency fund|lakh|crore|50\/30\/20|allocation|sip|savings rate|target fund|monthly expenses/i.test(
        `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`
      );
    if (isGoalTargetContext) {
      return <GoalTargetScene key={sceneKey} scene={scene} headingFont={headingFont} bodyFont={typographyFont} />;
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

    if (resolvedAssetUrl) {
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

    // Default 90%+ Explanatory Visual Fallback (when no stock image is assigned):
    // Explain content through large animated vector illustration + kinetic typography!
    return (
      <DrawingStoryScene
        key={sceneKey}
        scene={scene}
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
    <AbsoluteFill style={{ fontFamily: typographyFont, backgroundColor: palette.bg, color: palette.textPrimary }}>
      {/* ── LAYER 1 (BOTTOM): Base Atmospheric Motion Canvas or Video ── */}
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
        width={1920}
        height={1080}
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

      {/* ── LAYER 3 (MIDDLE): Dynamic Modular Scene Engine & Transitions ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 15,
          opacity: transitionStyles.opacity,
          transform: transitionStyles.transform,
        }}
      >
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

      {/* Sticker Layer */}
      {templateConfig.stickerPackId && templateConfig.stickerPackId !== 'none' && resolvedStickerEvents.length > 0 ? (
        <UniversalStickerLayer stickerEvents={resolvedStickerEvents} stickerPackId={templateConfig.stickerPackId} />
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
              fontSize: '15px',
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
        <filter id="faceless-film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#faceless-film-grain)" />
      </svg>

      {/* ── LAYER 8: Audio Infrastructure (Voiceover Speech + S3 Background Music + SFX) ── */}
      {Boolean(props.bgmUrl) && Boolean(safeResolveMediaSrc(props.bgmUrl)) && (
        <Audio
          src={safeResolveMediaSrc(props.bgmUrl)}
          volume={props.bgmVolume ?? 0.12}
          loop
        />
      )}

      {Boolean(resolvedAudioSrc || (isAudioFile(resolvedMediaSrc) ? resolvedMediaSrc : '')) && Boolean(safeResolveMediaSrc(resolvedAudioSrc || resolvedMediaSrc)) && (
        <Audio
          src={safeResolveMediaSrc(resolvedAudioSrc || resolvedMediaSrc)}
          volume={sourceAudioVolume}
          startFrom={Math.round(mediaTrimStartSeconds * fps)}
        />
      )}

      {resolvedSfxEvents.map((evt) => {
        const sfxSrc = safeResolveMediaSrc(evt.sfxUrl);
        if (!sfxSrc) return null;
        return (
          <Sequence key={evt.id} from={evt.startFrame} durationInFrames={Math.round(fps * 2)}>
            <Audio src={sfxSrc} volume={evt.volume || 0.25} />
          </Sequence>
        );
      })}
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
      musicVolume: 0.12,
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
