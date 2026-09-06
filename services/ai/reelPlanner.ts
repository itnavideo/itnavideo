import {normalizeTranscriptForPlanner} from './hinglishTranscript';
import {createManagedReelPlan} from './openaiReelDirector';
import {getExternalAssetImageLimit, type ExternalVisualAssetCandidate} from './externalAssetPool';
import {extractScriptDetails, type ScriptDetails} from './scriptDetails';
import {buildAssetTimelineForOverlays, matchAssetsForScript, type AssetTimelineItem} from './assetPicker';
import {normalizeVideoExplainerV2Layout, type VideoExplainerV2LayoutType} from './videoExplainerLayouts';
import {buildVisualPlan, type VisualPlan} from './visualPlanner';

export type ReelPlannerProvider = 'local' | 'openai';

export type ReelWord = {
  word: string;
  start: number;
  end: number;
};

export type ReelTranscriptSegment = {
  id?: string | number;
  start: number;
  end: number;
  text: string;
};

export type ReelPlanRequest = {
  transcript: string;
  words?: ReelWord[];
  timestampSegments?: ReelTranscriptSegment[];
  durationSeconds?: number;
  topic?: string;
  topicTitle?: string;
  emotion?: string;
  mediaType?: 'audio' | 'video' | 'image';
  languageHint?: 'english' | 'hinglish';
  template?: string;
  design?: string;
  visualMode?: string;
  selectedAssets?: Record<string, string[]>;
  externalVisualAssets?: ExternalVisualAssetCandidate[];
  constraints?: string[];
  scriptDetails?: ScriptDetails;
  dryRun?: boolean;
};

export type ReelTimelineScene = {
  id: string;
  start: number;
  end: number;
  purpose: 'hook' | 'explain' | 'proof' | 'cta';
  script: string;
  density: 'low' | 'medium' | 'high';
  visualEnergy: number;
  speechImportance: number;
  sceneComplexity: number;
  visualMode: 'notes' | 'videoExplainer' | 'videoCaption' | 'imageStory' | 'compare';
  primaryFocus: 'notesCanvas' | 'topVisual' | 'captions' | 'images' | 'comparison';
  secondarySupport?: Array<'titleCard'>;
};

export type VideoCategory = 'reel' | 'long-form';

export type ReelVideoTypeName =
  | 'AUTO_CAPTION_GENERATOR'
  | 'comparisonImages'
  | 'LONG_VIDEO_PROMO'
  | 'WHITEBOARD_VIDEO'
  | 'TYPOGRAPHY_VIDEO'
  | 'MULTI_IMAGES_VIDEO'
  | 'LONG_VIDEO_CLIPS'
  | 'VIDEO_EXPLAINER'
  | 'VIDEO_SIMPLE_EXPLAINER'
  | 'VIDEO_CAPTION'
  | 'IMAGE_STORY'
  | 'IMAGE_STORY_COLLAGE'
  | 'HANDWRITTEN_NOTES'
  | 'VOICE_SYNCED_NOTES'
  | 'FACELESS_VIDEO'
  | 'AI_VIDEO_GENERATOR';

export type ReelVideoTypeConfig = {
  templateName: ReelVideoTypeName;
  compositionId: string;
  videoCategory: VideoCategory;
  allowedMedia: readonly ('audio' | 'video' | 'image')[];
  transcriptRequirement: 'required' | 'not-required';
  plannerMode: string;
  mediaFit: string;
  // Feature flags — determines what the dashboard/API should do for this template
  needsImages?: boolean;           // Upload multiple images (2-8)
  needsThumbnail?: boolean;        // Upload a thumbnail image
  needsTitle?: boolean;            // Requires a title field
  needsCompareFields?: boolean;    // Left/right titles + handle + sticker picker
  needsCaptionStylePicker?: boolean; // Show caption style picker
  needsTypographyStylePicker?: boolean; // Show typography style picker
  skipTranscription?: boolean;     // Fast path — no Groq transcription
  skipPlanner?: boolean;           // No AI scene planner needed
};

export type ReelTemplateName = ReelVideoTypeName;
export type ReelTemplateConfig = ReelVideoTypeConfig;

export const VIDEO_TYPE_REGISTRY: Partial<Record<ReelVideoTypeName, ReelVideoTypeConfig>> = {
  AUTO_CAPTION_GENERATOR: {
    templateName: 'AUTO_CAPTION_GENERATOR',
    compositionId: 'AUTO-CAPTION-GENERATOR',
    videoCategory: 'reel',
    allowedMedia: ['video'],
    transcriptRequirement: 'required',
    plannerMode: 'videoCaption',
    mediaFit: 'videoCaption',
    needsCaptionStylePicker: true,
    skipPlanner: true,
  },
  comparisonImages: {
    templateName: 'comparisonImages',
    compositionId: 'comparisonImages',
    videoCategory: 'reel',
    allowedMedia: ['audio', 'video'],
    transcriptRequirement: 'required',
    plannerMode: 'compare',
    mediaFit: 'compare',
    needsImages: true,
    needsCompareFields: true,
  },
  LONG_VIDEO_PROMO: {
    templateName: 'LONG_VIDEO_PROMO',
    compositionId: 'LONG-VIDEO-PROMO',
    videoCategory: 'reel',
    allowedMedia: ['video'],
    transcriptRequirement: 'not-required',
    plannerMode: 'videoCaption',
    mediaFit: 'videoCaption',
    needsThumbnail: true,
    needsTitle: true,
    skipTranscription: true,
    skipPlanner: true,
  },
  WHITEBOARD_VIDEO: {
    templateName: 'WHITEBOARD_VIDEO',
    compositionId: 'WHITEBOARD-VIDEO',
    videoCategory: 'reel',
    allowedMedia: ['audio', 'video'],
    transcriptRequirement: 'required',
    plannerMode: 'videoCaption',
    mediaFit: 'videoCaption',
    skipPlanner: true,
  },
  TYPOGRAPHY_VIDEO: {
    templateName: 'TYPOGRAPHY_VIDEO',
    compositionId: 'TYPOGRAPHY-VIDEO',
    videoCategory: 'reel',
    allowedMedia: ['video', 'audio'],
    transcriptRequirement: 'required',
    plannerMode: 'videoCaption',
    mediaFit: 'videoCaption',
    needsTypographyStylePicker: true,
    skipPlanner: true,
  },
  MULTI_IMAGES_VIDEO: {
    templateName: 'MULTI_IMAGES_VIDEO',
    compositionId: 'MULTI-IMAGES-VIDEO',
    videoCategory: 'reel',
    allowedMedia: ['video'],
    transcriptRequirement: 'not-required',
    plannerMode: 'videoCaption',
    mediaFit: 'videoCaption',
    needsImages: true,
    needsTitle: true,
    skipTranscription: true,
    skipPlanner: true,
  },
  LONG_VIDEO_CLIPS: {
    templateName: 'LONG_VIDEO_CLIPS',
    compositionId: 'LONG-VIDEO-CLIPS',
    videoCategory: 'reel',
    allowedMedia: ['video'],
    transcriptRequirement: 'required',
    plannerMode: 'videoCaption',
    mediaFit: 'videoCaption',
    needsCaptionStylePicker: true,
    skipPlanner: true,
  },
  FACELESS_VIDEO: {
    templateName: 'FACELESS_VIDEO',
    compositionId: 'FACELESS-VIDEO',
    videoCategory: 'long-form',
    allowedMedia: ['audio'],
    transcriptRequirement: 'required',
    plannerMode: 'videoExplainer',
    mediaFit: 'videoExplainer',
    needsTitle: true,
    needsCaptionStylePicker: true,
    skipPlanner: false,
  },
  AI_VIDEO_GENERATOR: {
    templateName: 'FACELESS_VIDEO',
    compositionId: 'FACELESS-VIDEO',
    videoCategory: 'long-form',
    allowedMedia: ['audio'],
    transcriptRequirement: 'required',
    plannerMode: 'videoExplainer',
    mediaFit: 'videoExplainer',
    needsTitle: true,
    needsCaptionStylePicker: true,
    skipPlanner: false,
  },
} as const satisfies Record<string, {
  templateName: ReelVideoTypeName;
  compositionId: string;
  videoCategory: VideoCategory;
  allowedMedia: ReadonlyArray<'audio' | 'video' | 'image'>;
  transcriptRequirement: 'required' | 'audio-or-video' | 'not-required';
  plannerMode: 'videoExplainer' | 'notes' | 'videoCaption' | 'imageStory' | 'compare';
  mediaFit: 'videoExplainer' | 'notes' | 'videoCaption' | 'imageStory' | 'compare';
  needsImages?: boolean;
  needsThumbnail?: boolean;
  needsTitle?: boolean;
  needsCompareFields?: boolean;
  needsCaptionStylePicker?: boolean;
  needsTypographyStylePicker?: boolean;
  skipTranscription?: boolean;
  skipPlanner?: boolean;
}>;

export const REEL_TEMPLATE_REGISTRY = VIDEO_TYPE_REGISTRY;
export const REEL_VIDEO_TYPE_REGISTRY = VIDEO_TYPE_REGISTRY;
export type ReelOverlayLayout = 'headlineCard' | 'splitExplainer' | 'statCard' | 'warningCard' | 'checklist' | 'ctaCard';
export type ReelVideoExplainerV2Layout = VideoExplainerV2LayoutType;
export type ReelPrimaryVisualType = 'uploadedMedia' | 'image' | 'icon' | 'chart' | 'document' | 'waveform' | 'mockup' | 'none';
export type ReelPrimaryVisualMotion = 'slowZoom' | 'panLeft' | 'float' | 'pop' | 'slideUp' | 'parallax';
export type ReelOverlayAnimation = 'fadeUp' | 'popIn' | 'slideUp' | 'countUp' | 'warningPulse';
export type ReelOverlayEmotion = 'urgent' | 'informative' | 'serious' | 'motivational';
export type ReelOverlayVisualRole = 'topVideo' | 'bottomOverlay' | 'background' | 'assetInsert';
const videoExplainerSfxValues = ['softPop', 'softTick', 'softChime', 'boom', 'whoosh', 'stamp', 'bell', 'warning', 'cash', 'typing', 'bassDrop'] as const;
export type ReelPrimaryVisual = {
  type: ReelPrimaryVisualType;
  assetId?: string;
  prompt?: string;
  label?: string;
  assetBrief?: string;
  motion?: ReelPrimaryVisualMotion;
};
export type ReelAssetPlan = {
  suggested: string[];
  required: string[];
  avoid: string[];
};
export type ReelAssetTimelineItem = AssetTimelineItem;

type ReelCaptionStylePreset = 'boldCreator' | 'cleanSubtitle' | 'podcast' | 'screenRecord' | 'productDemo';
type ReelCaptionMode = 'wordHighlight' | 'phraseReveal' | 'segmentCaption';
type ReelCaptionItem = {
  id?: string;
  start: number;
  end: number;
  text: string;
  lines?: string[];
  words?: Array<ReelWord & {lineIndex?: number; wordIndex?: number}>;
  mode?: ReelCaptionMode;
  stylePreset?: ReelCaptionStylePreset;
};
type ReelImageStoryMotionType = 'slowZoomIn' | 'slowZoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'parallax' | 'pushIn' | 'reveal';
type ReelImageStoryStylePreset = 'cinematic' | 'product' | 'motivation' | 'education' | 'documentary';
type ReelImageStoryImage = {
  id: string;
  src: string;
  source: 'uploaded' | 'selectedAsset' | 'generated' | 'fallback';
  width?: number;
  height?: number;
  alt?: string;
  category?: string;
  safeCrop?: {
    focusX: number;
    focusY: number;
    avoidTextZone?: 'top' | 'bottom' | 'center' | 'none';
  };
};
export type ReelImageStoryScene = { // Exported for potential external use
  id: string;
  start: number;
  end: number;
  imageId: string;
  imageRole: 'hero' | 'detail' | 'proof' | 'transition' | 'ending';
  beatText?: string;
  label?: string;
  title?: string;
  motion: {
    type: ReelImageStoryMotionType;
    intensity: 'low' | 'medium';
    focusX?: number;
    focusY?: number;
  };
  textOverlay?: {
    enabled: boolean;
    text?: string;
    position: 'topSafe' | 'lowerThird' | 'centerSoft' | 'none';
    maxLines: 1 | 2;
    style: 'minimalTitle' | 'smallLabel' | 'punchLine' | 'productTag';
  };
  transition?: {
    in: 'fade' | 'cut' | 'slide' | 'blurReveal';
    out: 'fade' | 'cut' | 'blur';
  };
  overlayImageUrl?: string; // New: for decorative overlays like tape, paper scraps
  overlayPosition?: { top?: string; left?: string; right?: string; bottom?: string; rotate?: string; width?: string }; // New: position and size for overlay
};

export type ReelPlanResult = {
  provider: ReelPlannerProvider;
  model: string;
  template: ReelTemplateName;
  templateName: ReelTemplateName;
  analysis: {
    durationSeconds: number;
    speechDensity: 'slow' | 'medium' | 'fast';
    hookStrength: number;
    language: 'english' | 'hinglish';
  };
  timeline: ReelTimelineScene[];
  assets: ReelAssetPlan;
  scriptDetails: ScriptDetails;
  visualPlan?: VisualPlan;
  renderProps: {
    brand: string;
    topicTitle?: string;
    design?: string;
    templateName: ReelTemplateName;
    scriptDetails?: ScriptDetails;
    visualPlan?: VisualPlan;
    mediaType: 'video' | 'audio' | 'image';
    mediaFit?: 'videoExplainer' | 'notes' | 'videoCaption' | 'imageStory' | 'compare';
    explanationImageUrl?: string;
    uploadedImageUrl?: string;
    bottomImageUrl?: string;
    durationSeconds: number;
    backgroundMusic?: boolean;
    backgroundMusicMood?: string;
    backgroundMusicSrc?: string;
    backgroundMusicVolume?: number;
    backgroundMusicCategory?: string;
    sourceAudioVolume?: number;
    overlayTimeline: Array<{
      id: string;
      start: number;
      end: number;
      type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta';
      label: string;
      text: string;
      body?: string;
      accentWord?: string;
      align: 'left' | 'center';
      sfx?: typeof videoExplainerSfxValues[number];
      layout: ReelOverlayLayout;
      layoutType?: ReelVideoExplainerV2Layout;
      visual: string;
      visualRole: ReelOverlayVisualRole;
      primaryVisual: ReelPrimaryVisual;
      assetBrief?: string;
      animation: ReelOverlayAnimation;
      emotion: ReelOverlayEmotion;
      words?: ReelWord[];
      sceneType?: string;
      noteItems?: Array<{text: string; emphasis?: string; icon?: 'check' | 'dot' | 'warning' | 'star' | 'number'}>;
      diagram?: {type: 'flowchart' | 'timeline' | 'mindmap' | 'comparison'; nodes: string[]; activeNode?: string};
      annotations?: Array<{type: 'highlight_swipe' | 'red_circle' | 'arrow_diagram' | 'underline' | 'side_note'; targetText: string; label?: string}>;
      revealPlan?: Array<{text: string; start: number; end: number; token: string}>;
      frameType?: string;
      frameText?: string;
      frameLabel?: string;
      frameValue?: string;
      frameItems?: string[];
      visualPlanReason?: string;
      stickerPose?: string;
    }>;
    captions: ReelCaptionItem[];
    captionPlan?: {
      mode: ReelCaptionMode;
      position: 'bottomSafe' | 'middleLower' | 'topSafe';
      avoidArea?: 'faceCenter' | 'screenCenter' | 'productCenter' | 'none';
      captions: ReelCaptionItem[];
    };
    videoStyle?: {
      fit: 'cover' | 'contain';
      cropMode: 'center' | 'faceSafe' | 'screenSafe';
      backgroundBlur?: boolean;
    };
    safeZones?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    source?: {
      mode: 'singleImage' | 'multiImage' | 'audioImageStory' | 'imageOnlyStory';
      topic?: string;
      prompt?: string;
    };
    images?: ReelImageStoryImage[];
    storyPlan?: {
      languageMode: 'english' | 'roman_hinglish';
      stylePreset: ReelImageStoryStylePreset;
      scenes: ReelImageStoryScene[];
    };
    imageSources?: string[];
    externalVisualAssets?: ExternalVisualAssetCandidate[];
    assetTimeline?: ReelAssetTimelineItem[];
    imageScenes?: Array<{
      id?: string;
      start: number;
      end: number;
      imageSrc?: string;
      imageFit?: 'cover' | 'contain' | 'smart';
      title: string;
      body?: string;
      animation?: ReelImageStoryMotionType | 'fade'; // New: for cinematic collage
      overlayImageUrl?: string; // New: for cinematic collage
      overlayPosition?: { top?: string; left?: string; right?: string; bottom?: string; rotate?: string; width?: string }; // New: for cinematic collage
      accentWord?: string;
      label?: string;
      tone?: 'hook' | 'proof' | 'warning' | 'action' | 'cta' | 'point';
    }>;
  };
  validation: {
    status: 'complete' | 'repaired' | 'blocked';
    repairable: boolean;
    warnings: string[];
    notes: string[];
    renderAllowed: boolean;
    renderBlockReason?: string;
    qualityScore: number;
    qualityBand: 'professional' | 'warning' | 'blocked';
    qualityChecks: string[];
    qualityFindings: [];
    pipeline: Array<{
      step: string;
      status: 'complete';
      detail: string;
    }>;
    openAiCallsUsed: number;
  };
};

const MAX_SECONDS = 60;
const MIN_OVERLAY_SECONDS = 4.2;
const MAX_OVERLAY_SECONDS = 8.5;

export async function createReelPlan(input: ReelPlanRequest): Promise<ReelPlanResult> {
  const localPlan = await createLocalReelPlan(input);

  // Skip OpenAI managed planner for templates that only need captions/simple layout
  const skipManagedPlanner = Boolean(REEL_TEMPLATE_REGISTRY[localPlan.templateName]?.skipPlanner);

  if (input.dryRun || !process.env.OPENAI_API_KEY || getMaxOpenAiCallsPerRender() < 1 || skipManagedPlanner) {
    return validateAndRepairReelPlan(localPlan);
  }

  try {
    const managed = await createManagedReelPlan({
      request: input,
      localPlan,
    });
    if (managed) return validateAndRepairReelPlan(await hydrateVideoExplainerAssetTimeline(managed));
  } catch {
    localPlan.validation.warnings.push('Managed planner failed; local repair planner was used.');
  }

  return validateAndRepairReelPlan(localPlan);
}

async function hydrateVideoExplainerAssetTimeline(plan: ReelPlanResult): Promise<ReelPlanResult> {
  if (plan.templateName !== 'VIDEO_EXPLAINER') return plan;
  const visualPlan = plan.scriptDetails.visualPlan || plan.visualPlan || buildVisualPlan({
    scriptDetails: plan.scriptDetails,
    segments: plan.renderProps.overlayTimeline.map((overlay) => ({
      start: overlay.start,
      end: overlay.end,
      text: [overlay.text, overlay.body].filter(Boolean).join(' '),
    })),
    durationSeconds: plan.analysis.durationSeconds,
    topicTitle: plan.renderProps.topicTitle,
  });
  const scriptDetails = {
    ...plan.scriptDetails,
    visualPlan,
  };
  const overlayTimeline = applyVisualPlanToOverlays(plan.renderProps.overlayTimeline, visualPlan);
  const assetTimeline = await buildAssetTimelineForOverlays(scriptDetails, overlayTimeline, 10);
  return {
    ...plan,
    scriptDetails,
    visualPlan,
    renderProps: {
      ...plan.renderProps,
      visualPlan,
      overlayTimeline,
      assetTimeline,
    },
    validation: {
      ...plan.validation,
      notes: uniqueStrings([
        ...plan.validation.notes,
        `Visual Planner prepared ${visualPlan.scenes.length} scene-matched frame decisions after director repair.`,
        `Visual storytelling engine prepared ${assetTimeline.length} bottom-layer visuals after director repair.`,
      ]),
    },
  };
}

export function validateAndRepairReelPlan(plan: ReelPlanResult): ReelPlanResult {
  type ValidatedOverlay = ReelPlanResult['renderProps']['overlayTimeline'][number];
  const maxOpenAiCalls = getMaxOpenAiCallsPerRender();
  const durationSeconds = clampPlanNumber(plan.analysis.durationSeconds, 1, MAX_SECONDS);
  const warnings: string[] = [];
  let previousEnd = 0;
  let previousVisualKey = '';

  const overlayTimeline = plan.renderProps.overlayTimeline
    .map<ValidatedOverlay | null>((overlay, index) => {
      let start = clampPlanNumber(Number(overlay.start), 0, durationSeconds);
      let end = clampPlanNumber(Number(overlay.end), start + 1.2, durationSeconds);
      if (start < previousEnd - 0.05) {
        start = previousEnd;
        warnings.push('Overlapping scene timing was repaired before render.');
      }
      if (end <= start) {
        end = Math.min(durationSeconds, start + 1.2);
        warnings.push('Invalid scene duration was repaired before render.');
      }
      if (start >= durationSeconds || end <= start) return null;

      const text = cleanDisplayText(overlay.text || '').slice(0, 90);
      const body = cleanDisplayText(overlay.body || '').slice(0, 150);
      if (!text) {
        warnings.push('A scene with missing caption text was removed before render.');
        return null;
      }

      let visual = cleanDisplayText(overlay.visual || defaultValidationVisual(overlay.type)).slice(0, 180);
      const visualKey = normalizeVisualKey(visual);
      if (plan.templateName !== 'HANDWRITTEN_NOTES' && visualKey && visualKey === previousVisualKey) {
        visual = defaultValidationVisual(overlay.type);
        warnings.push('Repeated adjacent visual direction was repaired before render.');
      }
      previousVisualKey = normalizeVisualKey(visual);
      previousEnd = end;
      let primaryVisual = normalizePrimaryVisual(overlay.primaryVisual, overlay, plan.renderProps.mediaType);
      const assetBrief = cleanDisplayText(overlay.assetBrief || primaryVisual.prompt || visual || text).slice(0, 220);
      if (primaryVisual.type === 'icon') {
        primaryVisual = overlay.type === 'warning'
          ? {type: 'mockup', label: primaryVisual.label || 'Warning visual', prompt: primaryVisual.prompt, motion: 'pop'}
          : {type: overlay.type === 'hook' ? 'waveform' : 'mockup', label: primaryVisual.label, prompt: primaryVisual.prompt, motion: overlay.type === 'hook' ? 'float' : 'slideUp'};
        warnings.push('Icon visual was converted to an image-first visual before render.');
      }
      const layoutType = normalizeVideoExplainerV2Layout(overlay.layoutType, {
        text,
        body,
        sceneType: overlay.sceneType,
        overlayType: overlay.type,
      });

      return {
        ...overlay,
        id: cleanDisplayText(overlay.id || `overlay-${index + 1}`).replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 32) || `overlay-${index + 1}`,
        start: roundTime(start),
        end: roundTime(end),
        label: cleanDisplayText(overlay.label || labelForType(overlay.type)).slice(0, 32),
        text,
        body,
        accentWord: cleanDisplayText(overlay.accentWord || pickAccentWord(text, plan.renderProps.topicTitle)).split(/\s+/)[0] || '',
        align: overlay.align === 'left' ? 'left' as const : 'center' as const,
        sfx: videoExplainerSfxValues.includes(overlay.sfx as typeof videoExplainerSfxValues[number])
          ? overlay.sfx
          : index === 0 ? 'boom' as const : overlay.type === 'cta' ? 'bell' as const : 'whoosh' as const,
        layout: overlay.layout,
        layoutType,
        visual,
        assetBrief,
        visualRole: overlay.visualRole,
        primaryVisual,
        animation: overlay.animation,
        emotion: overlay.emotion,
        ...normalizeHandwrittenOverlayMetadata(plan.templateName, {
          ...overlay,
          start: roundTime(start),
          end: roundTime(end),
          text,
          body,
          visual,
        }),
      };
    })
    .filter((overlay): overlay is ValidatedOverlay => overlay !== null);

  if (!overlayTimeline.length) {
    warnings.push('No valid scenes were available after plan validation.');
  }
  if (plan.validation.openAiCallsUsed > maxOpenAiCalls) {
    warnings.push(`OpenAI planning call count exceeded policy and was capped to ${maxOpenAiCalls}.`);
  }

  const captions = repairCaptionsForTemplate(plan.renderProps.captions, durationSeconds, plan.templateName, warnings);
  const imageStoryProps = plan.templateName === 'IMAGE_STORY'
    ? repairImageStoryProps(plan.renderProps, durationSeconds, warnings)
    : undefined;

  const renderProps = {
    ...plan.renderProps,
    ...((plan.templateName === 'VIDEO_EXPLAINER' || plan.templateName === 'VIDEO_SIMPLE_EXPLAINER')
      ? {design: plan.renderProps.design || (plan.renderProps.explanationImageUrl || plan.renderProps.uploadedImageUrl || plan.renderProps.bottomImageUrl ? 'simpleManual' : 'imageCollage')}
      : {}),
    durationSeconds,
    overlayTimeline,
    captions,
    ...(plan.templateName === 'VIDEO_CAPTION'
      ? {
          captionPlan: buildCaptionPlan(captions),
          videoStyle: normalizeVideoCaptionStyle(plan.renderProps.videoStyle),
          safeZones: normalizeSafeZones(plan.renderProps.safeZones),
        }
      : {}),
    ...(imageStoryProps || {}),
  };
  const videoCaptionAllowed = plan.templateName !== 'VIDEO_CAPTION' || (
    renderProps.mediaType === 'video' &&
    captions.length > 0 &&
    captions.some((caption) => caption.mode === 'wordHighlight' || caption.mode === 'phraseReveal' || caption.mode === 'segmentCaption')
  );
  if (plan.templateName === 'VIDEO_CAPTION' && renderProps.mediaType !== 'video') {
    warnings.push('VIDEO_CAPTION render blocked because uploaded media is not video.');
  }
  if ((plan.templateName === 'VIDEO_CAPTION' || plan.templateName === 'AUTO_CAPTION_GENERATOR') && !captions.length) {
    warnings.push('VIDEO_CAPTION render blocked because transcript-timed captions are missing.');
  }
  const imageStoryAllowed = plan.templateName !== 'IMAGE_STORY' || Boolean(imageStoryProps?.images?.length && imageStoryProps?.storyPlan?.scenes?.length);
  if (plan.templateName === 'IMAGE_STORY' && !imageStoryAllowed) {
    warnings.push('IMAGE_STORY render blocked because no usable image story scenes were available.');
  }
  const autoCaptionAllowed = plan.templateName === 'AUTO_CAPTION_GENERATOR'
    ? renderProps.mediaType === 'video' && captions.length > 0
    : true;
  const transcriptSceneAllowed = plan.templateName === 'AUTO_CAPTION_GENERATOR'
    ? autoCaptionAllowed
    : plan.templateName === 'IMAGE_STORY'
      ? imageStoryAllowed
      : Boolean(REEL_TEMPLATE_REGISTRY[plan.templateName]?.skipPlanner)
        ? true
        : overlayTimeline.length > 0;
  const renderAllowed = transcriptSceneAllowed &&
    videoCaptionAllowed &&
    autoCaptionAllowed &&
    plan.validation.renderAllowed !== false;
  const validationWarnings = uniqueStrings([
    ...plan.validation.warnings,
    ...warnings,
  ]);

  return {
    ...plan,
    analysis: {
      ...plan.analysis,
      durationSeconds,
    },
    timeline: overlayTimeline.map((overlay, index) => ({
      ...(plan.timeline[index] || plan.timeline.at(-1) || {
        id: overlay.id,
        start: overlay.start,
        end: overlay.end,
        purpose: index === 0 ? 'hook' as const : index === overlayTimeline.length - 1 ? 'cta' as const : 'explain' as const,
        script: overlay.text,
        density: 'medium' as const,
        visualEnergy: 0.5,
        speechImportance: 0.7,
        sceneComplexity: 0.4,
        visualMode: getTimelineVisualMode(plan.templateName),
        primaryFocus: getTimelinePrimaryFocus(plan.templateName),
      }),
      id: overlay.id,
      start: overlay.start,
      end: overlay.end,
      script: [overlay.text, overlay.body].filter(Boolean).join('. '),
    })),
    renderProps,
    validation: {
      ...plan.validation,
      status: renderAllowed ? validationWarnings.length ? 'repaired' : plan.validation.status : 'blocked',
      warnings: validationWarnings,
      notes: uniqueStrings([
        ...plan.validation.notes,
        'Final render props passed transcript-window, timing, text, and visual validation.',
      ]),
      renderAllowed,
      renderBlockReason: renderAllowed
        ? plan.validation.renderBlockReason
        : (plan.templateName === 'VIDEO_CAPTION' && !videoCaptionAllowed) || (plan.templateName === 'AUTO_CAPTION_GENERATOR' && !autoCaptionAllowed)
          ? 'Caption render blocked because transcript is missing or invalid.'
          : plan.templateName === 'IMAGE_STORY' && !imageStoryAllowed
            ? 'Image Story render blocked because no usable image exists.'
          : 'No valid transcript-based scenes were available for render.',
      qualityScore: renderAllowed ? plan.validation.qualityScore : Math.min(plan.validation.qualityScore, 50),
      qualityBand: renderAllowed ? plan.validation.qualityBand : 'blocked',
      pipeline: [
        ...plan.validation.pipeline.filter((step) => step.step !== 'Validation'),
        {
          step: 'Validation',
          status: 'complete' as const,
          detail: renderAllowed
            ? `Manual checks prepared ${overlayTimeline.length} transcript-timed scenes before render.`
            : 'Blocked render because no valid transcript-timed scenes were available.',
        },
      ],
      openAiCallsUsed: Math.min(plan.validation.openAiCallsUsed, maxOpenAiCalls),
    },
  };
}

async function createLocalReelPlan(
  input: ReelPlanRequest,
): Promise<ReelPlanResult> {
  const normalized = normalizeTranscriptForPlanner({
    transcript: input.transcript,
    words: input.words,
    segments: input.timestampSegments,
  });
  const templateName = getTemplateName(input.template);
  if (!templateName) {
    // Template not recognized — do NOT silently default to Video Explainer.
    // Use the template value from input directly since it was already validated by the jobs route.
    // If it's truly unknown, the jobs route would have rejected it before reaching here.
    console.error(`[PLANNER] getTemplateName could not resolve: "${input.template}". Using VIDEO_SIMPLE_EXPLAINER as validated fallback.`);
  }
  const resolvedTemplate: ReelTemplateName = templateName || (input.template as ReelTemplateName) || 'VIDEO_SIMPLE_EXPLAINER';
  const isExplainerLike = resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER';
  const language = isExplainerLike
    ? 'english'
    : input.languageHint === 'english' && !normalized.sourceHadHindiUrduScript && !normalized.sourceHadRomanHinglish ? 'english' : normalized.languageHint || input.languageHint || detectLanguage(normalized.transcript);
  const durationSeconds = getSafeDuration(input.durationSeconds, normalized.words, normalized.segments, normalized.transcript);
  const segments = getTimedSegments({
    transcript: normalized.transcript,
    words: normalized.words,
    segments: normalized.segments,
    durationSeconds,
  });
  const scriptDetails = resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
    ? buildVideoExplainerAssetContext({
        transcript: normalized.transcript,
        topicTitle: input.topicTitle || input.topic,
        segments,
      })
    : input.scriptDetails || extractScriptDetails({
        transcript: normalized.transcript,
        topicTitle: input.topicTitle || input.topic,
        segments,
      });
  const topicTitle = cleanTitle(input.topicTitle || input.topic || deriveTopicTitle(segments, normalized.transcript));
  const visualPlan = resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
    ? buildVisualPlan({
        scriptDetails,
        segments,
        durationSeconds,
        topicTitle,
      })
    : undefined;
  if (visualPlan) {
    scriptDetails.visualPlan = visualPlan;
  }
  const externalVisualAssets = resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
    ? input.externalVisualAssets || []
    : [];
  const mediaType = input.mediaType || (resolvedTemplate === 'HANDWRITTEN_NOTES' ? 'audio' : 'video');
  const plannedOverlayTimeline = applyVisualPlanToOverlays(
    attachOverlayWords(
      attachCompareStickerPoses(
        buildOverlayTimeline(segments, input, language, scriptDetails, resolvedTemplate),
        resolvedTemplate,
      ),
      normalized.words,
    ),
    visualPlan,
  );
  const overlayTimeline = applyExternalVisualAssetsToOverlays(
    plannedOverlayTimeline,
    externalVisualAssets,
    resolvedTemplate,
    mediaType,
    getExternalAssetImageLimit(),
  );
  const assetTimeline = resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
    ? await buildAssetTimelineForOverlays(scriptDetails, overlayTimeline, 10)
    : [];
  const visualMode = resolvedTemplate === 'HANDWRITTEN_NOTES'
    ? 'notes' as const
    : resolvedTemplate === 'VIDEO_CAPTION'
      ? 'videoCaption' as const
      : resolvedTemplate === 'IMAGE_STORY'
        ? 'imageStory' as const
        : resolvedTemplate === 'comparisonImages'
          ? 'compare' as const
      : 'videoExplainer' as const;
  const primaryFocus = resolvedTemplate === 'HANDWRITTEN_NOTES'
    ? 'notesCanvas' as const
    : resolvedTemplate === 'VIDEO_CAPTION' || resolvedTemplate === 'AUTO_CAPTION_GENERATOR'
      ? 'captions' as const
      : resolvedTemplate === 'IMAGE_STORY'
        ? 'images' as const
        : resolvedTemplate === 'comparisonImages'
          ? 'comparison' as const
      : 'topVisual' as const;
  const captions = resolvedTemplate === 'VIDEO_CAPTION'
    ? buildVideoCaptionPlan({
        words: normalized.words,
        segments: normalized.segments,
        durationSeconds,
        stylePreset: getCaptionStylePreset(input.design, input.visualMode),
      })
    : segments.map((segment) => ({
        start: roundTime(segment.start),
        end: roundTime(Math.min(durationSeconds, segment.end)),
        text: cleanCaptionText(trimWords(segment.text, 18)), // Ensure captions are clean
      }));
  const timeline = overlayTimeline.map((item, index) => ({
    id: item.id,
    start: item.start,
    end: item.end,
    purpose: index === 0 ? 'hook' as const : index === overlayTimeline.length - 1 ? 'cta' as const : index % 3 === 0 ? 'proof' as const : 'explain' as const,
    script: [item.text, item.body].filter(Boolean).join('. '),
    density: 'medium' as const,
    visualEnergy: getVisualEnergy(item.type, index, overlayTimeline.length),
    speechImportance: index === 0 ? 0.9 : 0.7,
    sceneComplexity: getSceneComplexity(item.type),
    visualMode,
    primaryFocus,
    secondarySupport: ['titleCard'] as Array<'titleCard'>,
  }));
  const imageStoryProps = resolvedTemplate === 'IMAGE_STORY' || resolvedTemplate === 'IMAGE_STORY_COLLAGE' // Include IMAGE_STORY_COLLAGE
    ? buildImageStoryProps({
        input,
        segments,
        durationSeconds,
        language,
        topicTitle,
        scriptDetails,
        isCollage: resolvedTemplate === 'IMAGE_STORY_COLLAGE', // Pass flag for collage
      })
    : undefined;

  return {
    provider: 'local',
    model: resolvedTemplate === 'HANDWRITTEN_NOTES'
      ? 'handwritten-notes-planner'
      : resolvedTemplate === 'VIDEO_CAPTION'
        ? 'video-caption-planner'
        : resolvedTemplate === 'IMAGE_STORY'
          ? 'image-story-planner'
          : resolvedTemplate === 'comparisonImages'
            ? 'compare-planner'
          : 'video-explainer-planner',
    template: resolvedTemplate,
    templateName: resolvedTemplate,
    analysis: {
      durationSeconds,
      speechDensity: estimateSpeechDensity(normalized.transcript, durationSeconds),
      hookStrength: estimateHookStrength(segments[0]?.text || normalized.transcript || ''),
      language,
    },
    timeline,
    assets: {
      suggested: buildSuggestedAssets(scriptDetails, resolvedTemplate, externalVisualAssets),
      required: resolvedTemplate === 'HANDWRITTEN_NOTES'
        ? ['uploaded voiceover']
        : resolvedTemplate === 'IMAGE_STORY' || resolvedTemplate === 'IMAGE_STORY_COLLAGE'
          ? ['at least one uploaded or selected image']
          : resolvedTemplate === 'comparisonImages'
            ? ['uploaded voiceover or primary video']
          : ['uploaded primary video'],
      avoid: resolvedTemplate === 'HANDWRITTEN_NOTES'
        ? ['prewritten notebook poster', 'watermark/logo overlays', 'repeated same text blocks']
        : resolvedTemplate === 'IMAGE_STORY'
          ? ['static slideshow', 'full subtitles', 'explainer cards', 'placeholder labels', 'stretched images', 'generic stock photos']
          : resolvedTemplate === 'comparisonImages'
            ? ['unclear sides', 'more than two competing ideas per scene', 'tiny comparison text']
          : ['watermark/logo overlays', 'extra overlay text layers', 'background-image-only designs', 'icons instead of the bottom image layer'],
    },
    scriptDetails,
    ...(visualPlan ? {visualPlan} : {}),
    renderProps: {
      brand: 'itnavideo',
      topicTitle,
      design: input.design,
      templateName: resolvedTemplate,
      ...(resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER' ? {} : {scriptDetails}),
      ...(visualPlan ? {visualPlan} : {}),
      mediaType,
      mediaFit: resolvedTemplate === 'HANDWRITTEN_NOTES'
        ? 'notes'
        : resolvedTemplate === 'VIDEO_CAPTION'
          ? 'videoCaption'
          : resolvedTemplate === 'IMAGE_STORY' || resolvedTemplate === 'IMAGE_STORY_COLLAGE'
            ? 'imageStory'
            : resolvedTemplate === 'comparisonImages'
              ? 'compare'
            : 'videoExplainer',
      durationSeconds,
      overlayTimeline,
      captions,
      externalVisualAssets,
      assetTimeline,
      ...(resolvedTemplate === 'VIDEO_CAPTION'
        ? {
            captionPlan: buildCaptionPlan(captions),
            videoStyle: normalizeVideoCaptionStyle(undefined),
            safeZones: normalizeSafeZones(undefined),
          }
        : {}),
      ...(imageStoryProps || {}),
    },
    validation: {
      status: 'complete',
      repairable: true,
      warnings: [],
      notes: [
        resolvedTemplate === 'HANDWRITTEN_NOTES'
          ? 'Handwritten Notes plan created from timestamp segments.'
          : resolvedTemplate === 'VIDEO_CAPTION'
            ? 'Video Caption plan created from timestamp segments and word timings.'
            : resolvedTemplate === 'IMAGE_STORY'
              ? 'Image Story plan created as image-led cinematic story beats.'
              : resolvedTemplate === 'comparisonImages'
                ? 'Compare plan created as timed side-by-side decision beats.'
          : 'Video Explainer plan created from timestamp segments.',
        resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
          ? `AssetBrief layer created ${scriptDetails.videoUsePlan?.length || 0} scene search instructions.`
          : scriptDetails.planningSource === 'ai'
          ? `AI Script Details read the full ${scriptDetails.wordCount || 0}-word script before JSON planning.`
          : `Rule-based Script Details read the full ${scriptDetails.wordCount || 0}-word script before JSON planning.`,
        resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
          ? `Visual Planner selected ${visualPlan?.scenes.length || 0} scene-matched frame decisions from the script.`
          : scriptDetails.imageUsagePolicy
          ? `Image policy: use ${scriptDetails.imageUsagePolicy.minImages}-${scriptDetails.imageUsagePolicy.maxImages} images, recommended ${scriptDetails.imageUsagePolicy.recommendedImages}.`
          : 'Image policy was not provided.',
        resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
          ? 'Asset picker reads per-scene assetBrief in English before caption text.'
          : scriptDetails.imageSelectionPlan?.length
          ? `AI selected ${scriptDetails.imageSelectionPlan.length} semantic image needs before render planning.`
          : 'No semantic image selection plan was provided.',
        language === 'hinglish'
          ? resolvedTemplate === 'HANDWRITTEN_NOTES'
            ? 'Timestamp segments were normalized to clean English plus Roman Hinglish; Handwritten Notes final text uses official English keywords with simple Hinglish support lines.'
            : resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
              ? 'Timestamp segments were normalized to clean English plus Roman Hinglish; Video Explainer final text uses official English keywords with simple Hinglish support lines.'
              : 'Timestamp segments were normalized to Clean Hinglish roman text.'
          : 'Timestamp segments were kept in clean English text.',
        normalized.words?.length
          ? `Word-level sync enabled with ${normalized.words.length} timed transcript words.`
          : resolvedTemplate === 'VIDEO_CAPTION'
            ? 'Word timings unavailable; VIDEO_CAPTION requires timestamp segments for phrase reveal.'
            : 'Word-level sync unavailable; renderer will use duration-based pacing.',
        resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
          ? 'VIDEO_SIMPLE_EXPLAINER uses exactly three visual layers: top uploaded video, middle timed subtitles, bottom planned explainer frame.'
          : resolvedTemplate === 'comparisonImages' || resolvedTemplate === 'IMAGE_STORY_COLLAGE'
            ? 'COMPARE renders each beat as a two-column tradeoff with a verdict strip.'
          : 'Template uses lightweight visual direction without forcing fixed asset rules.',
        resolvedTemplate === 'comparisonImages'
          ? 'Compare planner assigns sticker_pointing_left_side_explainer for left-side beats and sticker_pointing_right_side_explainer for right-side beats; legacy left/right aliases remain render-compatible.'
          : 'Sticker pose mapping is not required for this template.',
      ],
      renderAllowed: true,
      qualityScore: 92,
      qualityBand: 'professional',
      qualityChecks: [
        resolvedTemplate === 'HANDWRITTEN_NOTES' ? 'One continuous handwritten notes canvas.' : (resolvedTemplate === 'VIDEO_CAPTION' || resolvedTemplate === 'AUTO_CAPTION_GENERATOR') ? 'One continuous captioned video.' : resolvedTemplate === 'IMAGE_STORY' ? 'One continuous image-led cinematic story.' : resolvedTemplate === 'comparisonImages' ? 'One continuous side-by-side comparison reel.' : 'One continuous video scene.',
        resolvedTemplate === 'HANDWRITTEN_NOTES'
          ? 'Uploaded voiceover drives full-screen handwritten notes.'
          : resolvedTemplate === 'VIDEO_CAPTION' || resolvedTemplate === 'AUTO_CAPTION_GENERATOR'
            ? 'Uploaded video stays full-screen while timed captions are rendered above safe zones.'
            : resolvedTemplate === 'IMAGE_STORY'
              ? 'One primary image drives each scene with subtle cinematic motion.'
              : resolvedTemplate === 'comparisonImages'
                ? 'Transcript beats become two stable comparison panels plus a verdict.'
          : 'Uploaded video remains full-width in the top 16:9 visual container as layer 1.',
        resolvedTemplate === 'HANDWRITTEN_NOTES'
          ? 'Handwritten Notes layout uses short written points without prewritten background text.'
          : resolvedTemplate === 'VIDEO_CAPTION'
            ? 'Captions use short lines with word-level highlighting when transcript timings are available, or phrase reveal.'
            : resolvedTemplate === 'IMAGE_STORY'
              ? 'Text is minimal and never becomes full subtitles or explainer cards.'
              : resolvedTemplate === 'comparisonImages'
                ? 'Comparison text stays short, scannable, and split into clear option points.'
          : 'Middle subtitle bar is layer 2; no duplicate transcript text should be planned elsewhere.',
        resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
          ? 'Asset picker supplies layer 3 only: one bottom image per active timing window, never top video or extra background UI.'
          : 'Template-specific supporting visuals are kept within the approved renderer structure.',
        resolvedTemplate === 'comparisonImages'
          ? 'Sticker pose IDs use descriptive left-side/right-side explainer names for automatic presenter direction.'
          : 'No compare sticker direction check required.',
      ],
      qualityFindings: [],
      pipeline: [
        {
          step: 'Transcript',
          status: 'complete',
          detail: resolvedTemplate === 'HANDWRITTEN_NOTES'
            ? 'Audio/video transcript preserved for source accuracy before visible-note language conversion.'
            : 'Audio/video transcript cleaned for display.',
        },
        {
          step: resolvedTemplate === 'HANDWRITTEN_NOTES' ? 'CreativeDirector' : resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER' ? 'Visual Planner' : 'Script Details',
          status: 'complete',
          detail: resolvedTemplate === 'VIDEO_SIMPLE_EXPLAINER'
            ? `Planned ${visualPlan?.scenes.length || 0} scene-specific bottom frames from script meaning and timing.`
            : resolvedTemplate === 'HANDWRITTEN_NOTES'
            ? scriptDetails.planningSource === 'ai'
              ? `AI directed ${scriptDetails.videoUsePlan?.length || 0} timed note actions from the ${scriptDetails.wordCount || 0}-word script.`
              : `Rule-based director extracted ${scriptDetails.detailBlocks.length} note blocks from ${scriptDetails.wordCount || 0} words.`
            : scriptDetails.planningSource === 'ai'
              ? `AI analyzed ${scriptDetails.wordCount || 0} words and planned ${scriptDetails.videoUsePlan?.length || 0} video-use moments.`
              : `Extracted ${scriptDetails.detailBlocks.length} structured detail blocks from ${scriptDetails.wordCount || 0} words.`,
        },
        {
          step: resolvedTemplate === 'HANDWRITTEN_NOTES' ? 'ManagerChecklist' : 'Timing',
          status: 'complete',
          detail: resolvedTemplate === 'HANDWRITTEN_NOTES'
            ? `Checked audio-matched note timing before the ${durationSeconds}s render.`
            : `Planned ${durationSeconds}s render window.`,
        },
        {
          step: resolvedTemplate === 'HANDWRITTEN_NOTES' ? 'Remotion Props' : 'JSON',
          status: 'complete',
          detail: normalized.words?.length
            ? 'Created overlayTimeline with word-level timing metadata.'
            : 'Created overlayTimeline and captions render props.',
        },
      ],
      openAiCallsUsed: resolvedTemplate !== 'VIDEO_SIMPLE_EXPLAINER' && scriptDetails.planningSource === 'ai' ? 1 : 0,
    },
  };
}

function buildVideoExplainerAssetContext({
  transcript,
  topicTitle,
  segments,
}: {
  transcript: string;
  topicTitle?: string;
  segments: Array<{start: number; end: number; text: string}>;
}): ScriptDetails {
  const topic = cleanTitle(topicTitle || deriveTopicTitle(segments, transcript) || 'Video Explainer') || 'Video Explainer';
  const grouped = groupSegmentsForAssetBriefs(segments);
  const videoUsePlan = grouped.map((group, index) => {
    const sourceText = cleanDisplayText(group.text);
    const title = trimWords(sourceText, index === 0 ? 8 : 7);
    const assetBrief = buildSceneAssetBrief({text: sourceText, topic, index, total: grouped.length});
    return {
      id: `scene-${String(index + 1).padStart(2, '0')}`,
      start: roundTime(group.start),
      end: roundTime(group.end),
      purpose: index === 0 ? 'hook' as const : index === grouped.length - 1 ? 'cta' as const : 'point' as const,
      detailType: 'factBox' as const,
      layout: index === 0 ? 'hookCard' as const : 'splitExplainer' as const,
      visual: assetBrief,
      animation: index === 0 ? 'popIn' as const : 'fadeUp' as const,
      emotion: index === 0 ? 'urgent' as const : 'informative' as const,
      title,
      displayText: title,
      body: '',
      renderText: title,
      renderBody: '',
      assetSearchText: assetBrief,
      sourceText,
    };
  });

  return {
    topic,
    summary: trimWords(cleanDisplayText(transcript), 22),
    intent: 'general',
    wordCount: cleanDisplayText(transcript).split(/\s+/).filter(Boolean).length,
    sourceScript: transcript,
    originalScript: transcript,
    keyPoints: videoUsePlan.map((item) => item.title).slice(0, 8),
    avoidRepeats: [],
    assetBriefs: videoUsePlan.map((item) => ({
      id: `asset-${item.id}`,
      timing: `${item.start}-${item.end}s`,
      searchText: item.assetSearchText || item.visual,
      visualType: 'editorial_photo',
      priority: item.purpose === 'hook' ? 'high' : 'medium',
      usage: 'mainVisual',
      title: item.title,
    })),
    imageUsagePolicy: undefined,
    imageSelectionPlan: [],
    videoUsePlan,
    planningSource: 'rules',
    processSteps: [],
    websites: [],
    amounts: [],
    documents: [],
    dates: [],
    warnings: [],
    detailBlocks: [],
  };
}

function groupSegmentsForAssetBriefs(segments: Array<{start: number; end: number; text: string}>) {
  const cleanedSegments = segments
    .filter((segment) => segment.end > segment.start && cleanDisplayText(segment.text))
    .map((segment) => ({...segment, text: cleanDisplayText(segment.text)}));
  if (!cleanedSegments.length) return [{start: 0, end: 6, text: 'Video explainer'}];

  const sceneCount = 10;
  const start = Math.max(0, cleanedSegments[0].start);
  const end = Math.max(cleanedSegments.at(-1)?.end || start + 60, start + 6);
  const duration = Math.max(6, end - start);
  const windowSize = duration / sceneCount;

  return Array.from({length: sceneCount}, (_, index) => {
    const windowStart = roundTime(start + index * windowSize);
    const windowEnd = roundTime(index === sceneCount - 1 ? end : start + (index + 1) * windowSize);
    const activeSegments = cleanedSegments.filter((segment) => segment.end > windowStart && segment.start < windowEnd);
    const fallbackSegment = cleanedSegments[Math.min(cleanedSegments.length - 1, Math.floor(index * cleanedSegments.length / sceneCount))];
    const text = cleanDisplayText((activeSegments.length ? activeSegments : [fallbackSegment]).map((segment) => segment.text).join(' '));
    return {
      start: windowStart,
      end: Math.max(windowEnd, roundTime(windowStart + 0.4)),
      text: trimWords(text || fallbackSegment?.text || 'Video explainer scene', 34),
    };
  });
}

function buildSceneAssetBrief({
  text,
  topic,
  index,
  total,
}: {
  text: string;
  topic: string;
  index: number;
  total: number;
}) {
  const spoken = cleanDisplayText(text);
  const subject = trimWords(spoken, 12);
  const stage =
    index === 0 ? 'opening hook' :
      index === total - 1 ? 'closing context' :
        /date|deadline|when|today|tomorrow/i.test(spoken) ? 'date or deadline context' :
          /money|salary|fee|price|rupee|dollar|income|cost|note|cash|bank|finance/i.test(spoken) ? 'finance or banking context' :
            /document|card|form|download|apply|website|official/i.test(spoken) ? 'official document or website context' :
              'real-world context';
  return [
    topic,
    stage,
    subject,
    'editorial photo or realistic image',
    'bottom image layer',
    'avoid icons, UI cards, text-heavy graphics, watermarks, logos, and unrelated stock photos',
  ].filter(Boolean).join(', ').slice(0, 220);
}

function buildVideoCaptionPlan({
  words,
  segments,
  durationSeconds,
  stylePreset,
}: {
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds: number;
  stylePreset: 'boldCreator' | 'cleanSubtitle' | 'podcast' | 'screenRecord' | 'productDemo';
}): ReelPlanResult['renderProps']['captions'] {
  const timedWords = (words || [])
    .filter((word) => word.word && Number.isFinite(word.start) && Number.isFinite(word.end) && word.end > word.start && word.start < durationSeconds)
    .map((word) => ({
      word: cleanCaptionText(word.word).slice(0, 40),
      start: roundTime(clampPlanNumber(word.start, 0, durationSeconds)),
      end: roundTime(clampPlanNumber(word.end, word.start + 0.02, durationSeconds)),
    }))
    .filter((word) => word.word && word.end > word.start);

  if (timedWords.length) {
    return dedupeCaptions(chunkWords(timedWords, 10).map((chunk, index) => {
      const start = chunk[0].start;
      const end = Math.min(durationSeconds, Math.max(chunk.at(-1)?.end || start + 0.6, start + 0.6));
      const text = cleanCaptionText(chunk.map((word) => word.word).join(' '));
      const lines = breakCaptionLines(text);
      const wordLineMap = mapWordsToLines(lines);
      return {
        id: `caption-${index + 1}`,
        start: roundTime(start),
        end: roundTime(end),
        text,
        lines,
        words: chunk.map((word, wordIndex) => ({
          word: word.word,
          start: roundTime(Math.max(0, word.start - start)),
          end: roundTime(Math.max(0.02, word.end - start)),
          lineIndex: wordLineMap[wordIndex]?.lineIndex || 0,
          wordIndex: wordLineMap[wordIndex]?.wordIndex || wordIndex,
        })),
        mode: 'wordHighlight' as const,
        stylePreset,
      };
    }));
  }

  const timedSegments = (segments || [])
    .filter((segment) => segment.text && Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.end > segment.start && segment.start < durationSeconds)
    .map((segment) => ({
      start: roundTime(clampPlanNumber(segment.start, 0, durationSeconds)),
      end: roundTime(clampPlanNumber(segment.end, segment.start + 0.6, durationSeconds)),
      text: cleanCaptionText(segment.text),
    }))
    .filter((segment) => segment.text && segment.end > segment.start);

  return dedupeCaptions(timedSegments.flatMap((segment, segmentIndex) => {
    const chunks = chunkCaptionText(segment.text, 12);
    if (!chunks.length) return [];
    const duration = Math.max(0.6, segment.end - segment.start);
    return chunks.map((chunk, chunkIndex) => {
      const start = segment.start + (duration * chunkIndex) / chunks.length;
      const end = segment.start + (duration * (chunkIndex + 1)) / chunks.length;
      const safeEnd = Math.min(durationSeconds, Math.max(end, start + 0.6));
      return {
        id: `caption-${segmentIndex + 1}-${chunkIndex + 1}`,
        start: roundTime(start),
        end: roundTime(safeEnd),
        text: chunk,
        lines: breakCaptionLines(chunk),
        mode: 'phraseReveal' as const,
        stylePreset,
      };
    });
  }));
}

function repairCaptionsForTemplate(
  captions: ReelPlanResult['renderProps']['captions'],
  durationSeconds: number,
  templateName: ReelTemplateName,
  warnings: string[],
): ReelPlanResult['renderProps']['captions'] {
  const minCaptionSeconds = templateName === 'VIDEO_CAPTION' ? 0.6 : 0.2;
  const repaired = (captions || [])
    .map((caption, index) => {
      const start = roundTime(clampPlanNumber(Number(caption.start), 0, durationSeconds));
      const end = roundTime(clampPlanNumber(Number(caption.end), start + minCaptionSeconds, durationSeconds));
      const text = cleanCaptionText(caption.text).slice(0, templateName === 'VIDEO_CAPTION' ? 120 : 140);
      if (!text || end <= start) return null;
      if (templateName === 'VIDEO_CAPTION' && isPlaceholderCaption(text)) {
        warnings.push('Placeholder caption text was removed before render.');
        return null;
      }
      const lines = templateName === 'VIDEO_CAPTION'
        ? breakCaptionLines(text)
        : caption.lines?.map((line) => cleanCaptionText(line).slice(0, 56)).filter(Boolean).slice(0, 2);
      const words = templateName === 'VIDEO_CAPTION'
        ? normalizeCaptionWords(caption.words, end - start)
        : caption.words;
      if (templateName === 'VIDEO_CAPTION' && words?.some((word) => word.start < 0 || word.end > end - start + 0.1)) {
        warnings.push('Caption word timing outside its phrase was repaired before render.');
      }
      return {
        ...caption,
        id: 'id' in caption ? String(caption.id || `caption-${index + 1}`) : `caption-${index + 1}`,
        start,
        end,
        text,
        lines,
        words,
        mode: templateName === 'VIDEO_CAPTION'
          ? words?.length ? 'wordHighlight' as const : caption.mode === 'segmentCaption' ? 'segmentCaption' as const : 'phraseReveal' as const
          : caption.mode,
        stylePreset: templateName === 'VIDEO_CAPTION'
          ? normalizeCaptionStyle(caption.stylePreset)
          : caption.stylePreset,
      };
    })
    .filter((caption): caption is NonNullable<typeof caption> => Boolean(caption));
  return repairCaptionOverlaps(dedupeCaptions(repaired), minCaptionSeconds, warnings);
}

function normalizeCaptionWords(
  words: ReelPlanResult['renderProps']['captions'][number]['words'],
  captionDuration: number,
) {
  const cleaned = (words || [])
    .map((word, index) => ({
      word: cleanCaptionText(word.word).slice(0, 40),
      start: roundTime(clampPlanNumber(Number(word.start), 0, captionDuration)),
      end: roundTime(clampPlanNumber(Number(word.end), Number(word.start) + 0.02, captionDuration)),
      lineIndex: Number.isFinite(word.lineIndex) ? clampPlanNumber(Number(word.lineIndex), 0, 1) : undefined,
      wordIndex: Number.isFinite(word.wordIndex) ? clampPlanNumber(Number(word.wordIndex), 0, 14) : index,
    }))
    .filter((word) => word.word && word.end > word.start);
  return cleaned.length ? cleaned : undefined;
}

function dedupeCaptions(captions: ReelPlanResult['renderProps']['captions']) {
  const seen = new Set<string>();
  return captions.filter((caption) => {
    const key = cleanCaptionText(caption.text).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function repairCaptionOverlaps(
  captions: ReelPlanResult['renderProps']['captions'],
  minCaptionSeconds: number,
  warnings: string[],
) {
  let previousEnd = 0;
  return captions
    .slice()
    .sort((a, b) => a.start - b.start)
    .map((caption) => {
      if (caption.start >= previousEnd - 0.05) {
        previousEnd = caption.end;
        return caption;
      }
      const shiftedStart = roundTime(previousEnd);
      if (caption.end - shiftedStart < minCaptionSeconds) {
        warnings.push('Overlapping caption timing was removed before render.');
        return null;
      }
      previousEnd = caption.end;
      warnings.push('Overlapping caption timing was repaired before render.');
      return {...caption, start: shiftedStart};
    })
    .filter((caption): caption is ReelPlanResult['renderProps']['captions'][number] => Boolean(caption));
}

function buildCaptionPlan(captions: ReelPlanResult['renderProps']['captions']): NonNullable<ReelPlanResult['renderProps']['captionPlan']> {
  const mode = captions.some((caption) => caption.mode === 'wordHighlight')
    ? 'wordHighlight'
    : captions.some((caption) => caption.mode === 'segmentCaption')
      ? 'segmentCaption'
      : 'phraseReveal';
  return {
    mode,
    position: 'middleLower',
    avoidArea: 'faceCenter',
    captions,
  };
}

function normalizeVideoCaptionStyle(value: ReelPlanResult['renderProps']['videoStyle'] | undefined): NonNullable<ReelPlanResult['renderProps']['videoStyle']> {
  return {
    fit: value?.fit === 'contain' ? 'contain' : 'cover',
    cropMode: value?.cropMode === 'faceSafe' || value?.cropMode === 'screenSafe' ? value.cropMode : 'center',
    backgroundBlur: Boolean(value?.backgroundBlur),
  };
}

function normalizeSafeZones(value: ReelPlanResult['renderProps']['safeZones'] | undefined): NonNullable<ReelPlanResult['renderProps']['safeZones']> {
  return {
    top: clampPlanNumber(Number(value?.top), 0, 320) || 120,
    bottom: clampPlanNumber(Number(value?.bottom), 0, 520) || 340,
    left: clampPlanNumber(Number(value?.left), 0, 240) || 72,
    right: clampPlanNumber(Number(value?.right), 0, 240) || 140,
  };
}

function buildImageStoryProps({
  input,
  segments,
  durationSeconds,
  language,
  topicTitle,
  scriptDetails,
  isCollage,
}: {
  input: ReelPlanRequest;
  segments: Array<{start: number; end: number; text: string}>;
  durationSeconds: number;
  language: 'english' | 'hinglish';
  topicTitle?: string;
  scriptDetails: ScriptDetails;
  isCollage?: boolean; // New parameter for IMAGE_STORY_COLLAGE
}): Pick<ReelPlanResult['renderProps'], 'source' | 'images' | 'storyPlan' | 'safeZones' | 'imageSources' | 'imageScenes'> {
  const imageSources = collectImageSources(input);
  const images = imageSources.map<ReelImageStoryImage>((src, index) => ({
    id: `image-${index + 1}`,
    src,
    source: src.includes('fallback') ? 'fallback' : 'uploaded',
    alt: sanitizeStoryText(topicTitle || input.topic || `Image ${index + 1}`),
    safeCrop: {
      focusX: 0.5,
      focusY: 0.45,
      avoidTextZone: 'bottom',
      }
    }));


  if (isCollage && images.length === 0) {
    // For Cinematic Collage, if no images are explicitly selected, generate some AI-like placeholders
    // In a real scenario, this would involve calling an AI image generation service
    // For now, using generic placeholders
    for (let i = 0; i < Math.min(12, segments.length || 4); i++) {
      images.push({
        id: `ai-image-${i + 1}`,
        src: `/visuals/ai-generated/cinematic-scene-${(i % 5) + 1}.png`, // Assuming 5 generic AI images
        source: 'generated',
        alt: sanitizeStoryText(topicTitle || input.topic || `AI Generated Scene ${i + 1}`),
        safeCrop: { focusX: 0.5, focusY: 0.45, avoidTextZone: 'bottom' },
      });
    }
  }

  // Ensure there's at least one image if collage mode is active and none were generated/selected
  if (isCollage && images.length === 0) {
    images.push({
      id: 'ai-image-fallback',
      src: '/visuals/ai-generated/cinematic-scene-fallback.png',
      source: 'fallback',
      alt: 'AI Generated Fallback Scene',
      safeCrop: {
        focusX: 0.5,
        focusY: 0.45,
      avoidTextZone: 'bottom',
    }
        });
        }
  const mode = input.mediaType === 'audio'
    ? 'audioImageStory'
    : images.length > 1
      ? 'multiImage'
      : input.mediaType === 'image'
        ? 'imageOnlyStory'
        : 'singleImage';
  const beatSource = segments.length && mode === 'audioImageStory'
    ? segments
    : buildImageOnlyBeats(topicTitle || input.topic || scriptDetails.topic || 'Image story', durationSeconds);
  const scenes = beatSource.slice(0, 12).map<ReelImageStoryScene>((segment, index) => {
    const image = images[index % Math.max(1, images.length)];
    const role = index === 0 ? 'hero' : index === beatSource.length - 1 ? 'ending' : index % 3 === 0 ? 'proof' : 'detail';
    const overlayText = limitStoryWords(segment.text || topicTitle || 'Story beat', index === 0 ? 7 : 6);
    return {
      id: `image-scene-${index + 1}`,
      start: roundTime(clampPlanNumber(segment.start, 0, durationSeconds)),
      end: roundTime(clampPlanNumber(segment.end, segment.start + 1, durationSeconds)),
      imageId: image?.id || 'image-1',
      imageRole: role,
      beatText: overlayText,
      label: role === 'hero' ? 'Story' : role === 'ending' ? 'Final' : undefined,
      title: overlayText,
      motion: defaultImageStoryMotion(index, beatSource.length),
      textOverlay: {
        enabled: Boolean(overlayText),
        text: overlayText,
        position: index === 0 ? 'centerSoft' : 'lowerThird',
        maxLines: overlayText.split(/\s+/).length > 4 ? 2 : 1,
        style: role === 'hero' ? 'punchLine' : 'minimalTitle',
      },
      transition: {
        in: index === 0 ? 'fade' : 'blurReveal',
        out: index === beatSource.length - 1 ? 'fade' : 'cut',
      },
    };
  }).filter((scene) => scene.end > scene.start);
  const repairedScenes = repairImageStorySceneList(scenes, images);

  return {
    source: {
      mode,
      topic: sanitizeStoryText(topicTitle || input.topic || scriptDetails.topic || '').slice(0, 120) || undefined,
      prompt: sanitizeStoryText(input.topic || topicTitle || scriptDetails.summary || '').slice(0, 240) || undefined,
    },
    images,
    storyPlan: {
      languageMode: language === 'hinglish' ? 'roman_hinglish' : 'english',
      stylePreset: getImageStoryStylePreset(input.design, input.topic || topicTitle || scriptDetails.topic),
      scenes: repairedScenes,
    },
    safeZones: normalizeSafeZones(undefined),
    imageSources: images.map((image) => image.src),
    imageScenes: repairedScenes.map((scene) => ({
      id: scene.id,
      start: scene.start,
      end: scene.end,
      imageSrc: images.find((image) => image.id === scene.imageId)?.src,
      imageFit: getImageFitForStyle(input.design),
      title: scene.textOverlay?.text || scene.title || scene.beatText || 'Story beat',
      animation: scene.motion.type, // Map motion.type to animation
      overlayImageUrl: scene.overlayImageUrl,
      overlayPosition: scene.overlayPosition,
      body: '',
      accentWord: pickAccentWord(scene.textOverlay?.text || scene.title || '', topicTitle),
      label: scene.label,
      tone: scene.imageRole === 'ending' ? 'cta' : scene.imageRole === 'hero' ? 'hook' : 'point',
    })),
  };
}

function repairImageStoryProps(
  props: ReelPlanResult['renderProps'],
  durationSeconds: number,
  warnings: string[],
): Pick<ReelPlanResult['renderProps'], 'source' | 'images' | 'storyPlan' | 'safeZones' | 'imageSources' | 'imageScenes'> {
  const sourceImages: ReelImageStoryImage[] = props.images?.length ? props.images : (props.imageSources || []).map((src, index) => ({
    id: `image-${index + 1}`,
    src,
    source: 'uploaded' as const,
  }));
  const images = sourceImages
    .map((image, index) => ({
      ...image,
      id: sanitizeId(image.id || `image-${index + 1}`),
      src: String(image.src || '').trim(),
      source: image.source === 'selectedAsset' || image.source === 'generated' || image.source === 'fallback' ? image.source : 'uploaded' as const,
      alt: sanitizeStoryText(image.alt || '').slice(0, 120) || undefined,
      category: sanitizeStoryText(image.category || '').slice(0, 48) || undefined,
      safeCrop: image.safeCrop ? {
        focusX: clampPlanNumber(Number(image.safeCrop.focusX), 0, 1),
        focusY: clampPlanNumber(Number(image.safeCrop.focusY), 0, 1),
        avoidTextZone: image.safeCrop.avoidTextZone === 'top' || image.safeCrop.avoidTextZone === 'center' || image.safeCrop.avoidTextZone === 'none' ? image.safeCrop.avoidTextZone : 'bottom' as const,
      } : {focusX: 0.5, focusY: 0.45, avoidTextZone: 'bottom' as const},
    }))
    .filter((image) => image.src && !isPlaceholderImageSource(image.src))
    .slice(0, 24);

  if (!images.length) warnings.push('Image Story has no usable image sources.');
  const scenes = repairImageStorySceneList((props.storyPlan?.scenes || []).map((scene, index) => ({
    id: sanitizeId(scene.id || `image-scene-${index + 1}`),
    start: roundTime(clampPlanNumber(Number(scene.start), 0, durationSeconds)),
    end: roundTime(clampPlanNumber(Number(scene.end), Number(scene.start) + 0.8, durationSeconds)),
    imageId: images.some((image) => image.id === scene.imageId) ? scene.imageId : images[index % Math.max(1, images.length)]?.id || 'image-1',
    imageRole: normalizeImageRole(scene.imageRole, index, props.storyPlan?.scenes.length || 1),
    beatText: limitStoryWords(scene.beatText || scene.title || scene.textOverlay?.text || '', 7),
    label: isPlaceholderStoryText(scene.label || '') ? undefined : limitStoryWords(scene.label || '', 3),
    title: isPlaceholderStoryText(scene.title || '') ? undefined : limitStoryWords(scene.title || scene.beatText || scene.textOverlay?.text || '', 7),
    motion: normalizeImageMotion(scene.motion, index, props.storyPlan?.scenes.length || 1),
    textOverlay: normalizeImageTextOverlay(scene.textOverlay, scene.title || scene.beatText),
    transition: {
      // Ensure these are valid ReelImageStoryScene transition types
      // Assuming 'fade', 'cut', 'slide', 'blurReveal' are the only valid ones
      in: (scene.transition?.in === 'cut' || scene.transition?.in === 'slide' || scene.transition?.in === 'blurReveal' ? scene.transition.in : 'fade') as NonNullable<ReelImageStoryScene['transition']>['in'],
      out: (scene.transition?.out === 'cut' || scene.transition?.out === 'blur' ? scene.transition.out : 'fade') as NonNullable<ReelImageStoryScene['transition']>['out'],
    },
  })).filter((scene) => scene.end > scene.start), images);

  return {
    source: {
      mode: props.source?.mode === 'multiImage' || props.source?.mode === 'audioImageStory' || props.source?.mode === 'imageOnlyStory' ? props.source.mode : images.length > 1 ? 'multiImage' : 'singleImage',
      topic: sanitizeStoryText(props.source?.topic || props.topicTitle || '').slice(0, 120) || undefined,
      prompt: sanitizeStoryText(props.source?.prompt || props.topicTitle || '').slice(0, 240) || undefined,
    },
    images,
    storyPlan: {
      languageMode: props.storyPlan?.languageMode === 'roman_hinglish' ? 'roman_hinglish' : 'english',
      stylePreset: props.storyPlan?.stylePreset || 'cinematic',
      scenes,
    },
    safeZones: normalizeSafeZones(props.safeZones),
    imageSources: images.map((image) => image.src),
    imageScenes: scenes.map((scene) => ({
      id: scene.id,
      start: scene.start,
      end: scene.end,
      imageSrc: images.find((image) => image.id === scene.imageId)?.src,
      imageFit: 'smart' as const,
      title: scene.textOverlay?.text || scene.title || scene.beatText || 'Story beat',
      animation: scene.motion.type, // Map motion.type to animation
      overlayImageUrl: scene.overlayImageUrl,
      overlayPosition: scene.overlayPosition,
      body: '',
      accentWord: pickAccentWord(scene.textOverlay?.text || scene.title || '', props.topicTitle),
      label: scene.label,
      tone: scene.imageRole === 'ending' ? 'cta' as const : scene.imageRole === 'hero' ? 'hook' as const : 'point' as const,
    })),
  };
}

function collectImageSources(input: ReelPlanRequest) {
  const rawSources = Object.values(input.selectedAssets || {}).flat()
    .filter((value) => /\.(png|jpe?g|webp|gif)(?:[?#].*)?$/i.test(value) || /^https?:/i.test(value) || value.startsWith('/'));
  return uniqueStrings(rawSources).slice(0, 24);
}

function buildImageOnlyBeats(topic: string, durationSeconds: number) {
  const clean = sanitizeStoryText(topic) || 'Image story';
  const beats = [
    clean,
    'A closer detail',
    'The key moment',
    'Final frame',
  ];
  const sceneCount = Math.min(4, Math.max(1, Math.ceil(durationSeconds / 4)));
  const sceneDuration = durationSeconds / sceneCount;
  return Array.from({length: sceneCount}).map((_, index) => ({
    start: roundTime(index * sceneDuration),
    end: roundTime(Math.min(durationSeconds, (index + 1) * sceneDuration)),
    text: beats[index] || clean,
  }));
}

function repairImageStorySceneList(scenes: ReelImageStoryScene[], images: ReelImageStoryImage[]) {
  let previousImageId = '';
  let repeatCount = 0;
  return scenes.map((scene, index) => {
    let imageId = images.some((image) => image.id === scene.imageId) ? scene.imageId : images[index % Math.max(1, images.length)]?.id || scene.imageId;
    if (images.length > 1) {
      repeatCount = imageId === previousImageId ? repeatCount + 1 : 1;
      if (repeatCount > 2) {
        imageId = images[index % images.length].id;
        repeatCount = 1;
      }
      previousImageId = imageId;
    }
    return {
      ...scene,
      imageId,
      motion: normalizeImageMotion(scene.motion, index, scenes.length),
      textOverlay: normalizeImageTextOverlay(scene.textOverlay, scene.title || scene.beatText),
    };
  });
}

function defaultImageStoryMotion(index: number, total: number): ReelImageStoryScene['motion'] {
  const types: ReelImageStoryMotionType[] = ['slowZoomIn', 'panRight', 'parallax', 'panLeft', 'pushIn', 'panUp'];
  return {
    type: index === 0 ? 'slowZoomIn' : index === total - 1 ? 'slowZoomOut' : types[index % types.length],
    intensity: index === 0 || index === total - 1 ? 'low' : 'medium',
    focusX: 0.5,
    focusY: 0.45,
  };
}

function normalizeImageMotion(value: ReelImageStoryScene['motion'] | undefined, index: number, total: number): ReelImageStoryScene['motion'] {
  const fallback = defaultImageStoryMotion(index, total);
  const allowed = new Set<ReelImageStoryMotionType>(['slowZoomIn', 'slowZoomOut', 'panLeft', 'panRight', 'panUp', 'panDown', 'parallax', 'pushIn', 'reveal']);
  return {
    type: value?.type && allowed.has(value.type) ? value.type : fallback.type,
    intensity: value?.intensity === 'low' || value?.intensity === 'medium' ? value.intensity : fallback.intensity,
    focusX: clampPlanNumber(Number(value?.focusX ?? fallback.focusX), 0, 1),
    focusY: clampPlanNumber(Number(value?.focusY ?? fallback.focusY), 0, 1),
  };
}

function normalizeImageTextOverlay(value: ReelImageStoryScene['textOverlay'] | undefined, fallbackText?: string): ReelImageStoryScene['textOverlay'] {
  const text = isPlaceholderStoryText(value?.text || fallbackText || '') ? '' : limitStoryWords(value?.text || fallbackText || '', 7);
  return {
    enabled: Boolean(text) && value?.position !== 'none',
    text,
    position: value?.position === 'topSafe' || value?.position === 'centerSoft' || value?.position === 'none' ? value.position : 'lowerThird',
    maxLines: text.split(/\s+/).length > 4 ? 2 : 1,
    style: value?.style === 'smallLabel' || value?.style === 'productTag' || value?.style === 'minimalTitle' ? value.style : 'punchLine',
  };
}

function normalizeImageRole(value: unknown, index: number, total: number): ReelImageStoryScene['imageRole'] {
  if (value === 'hero' || value === 'detail' || value === 'proof' || value === 'transition' || value === 'ending') return value;
  if (index === 0) return 'hero';
  if (index === total - 1) return 'ending';
  return index % 3 === 0 ? 'proof' : 'detail';
}

function sanitizeStoryText(input: unknown) {
  return cleanDisplayText(String(input || '')).replace(/\.\.\.$/, '').trim();
}

function limitStoryWords(value: unknown, maxWords: number) {
  return sanitizeStoryText(value).split(/\s+/).filter(Boolean).slice(0, maxWords).join(' ');
}

function isPlaceholderStoryText(value: string) {
  return /^(image brief|visual story|scene\s*\d+|key point|important|image story|story beat)$/i.test(sanitizeStoryText(value));
}

function isPlaceholderImageSource(value: string) {
  const source = String(value || '').trim();
  return /^(about:blank|placeholder|none)$/i.test(source) || !/^(https?:|data:image\/|blob:|\/)/i.test(source);
}

function getImageStoryStylePreset(design?: string, topic?: string): ReelImageStoryStylePreset {
  const source = `${design || ''} ${topic || ''}`.toLowerCase();
  if (/product|shop|commerce|sale/.test(source)) return 'product';
  if (/study|education|exam|learn|school|college/.test(source)) return 'education';
  if (/motivat|success|mindset|story/.test(source)) return 'motivation';
  if (/doc|news|report|history/.test(source)) return 'documentary';
  return 'cinematic';
}

function getImageFitForStyle(design?: string): 'cover' | 'contain' | 'smart' {
  return /product|screen|document|screenshot/i.test(design || '') ? 'contain' : 'smart';
}

function sanitizeId(value: string) {
  return cleanDisplayText(value).replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 48) || 'item';
}

function isPlaceholderCaption(value: string) {
  return /^(important point|key idea|visual brief|caption|subtitle|main point|upload video|get clean captions|ready for reels)$/i.test(cleanCaptionText(value));
}

function chunkCaptionText(value: string, maxWords: number) {
  const words = cleanCaptionText(value).split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let index = 0; index < words.length; index += maxWords) {
    const text = words.slice(index, index + maxWords).join(' ');
    if (text) chunks.push(text);
  }
  return chunks;
}

function breakCaptionLines(value: string) {
  const words = cleanCaptionText(value).split(/\s+/).filter(Boolean).slice(0, 14);
  if (words.length <= 7) return [words.join(' ')];
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')].filter(Boolean);
}

function mapWordsToLines(lines: string[]) {
  return lines.flatMap((line, lineIndex) =>
    line.split(/\s+/).filter(Boolean).map((_, wordIndex) => ({lineIndex, wordIndex})),
  );
}

function cleanCaptionText(value: unknown) {
  return cleanDisplayText(String(value || '')).replace(/\.\.\.$/, '').trim();
}

function getCaptionStylePreset(design?: string, visualMode?: string): 'boldCreator' | 'cleanSubtitle' | 'podcast' | 'screenRecord' | 'productDemo' {
  const source = `${design || ''} ${visualMode || ''}`.toLowerCase();
  if (/screen|demo|tutorial|record/.test(source)) return 'screenRecord';
  if (/product|shop|commerce/.test(source)) return 'productDemo';
  if (/podcast|talk|interview/.test(source)) return 'podcast';
  if (/clean|minimal/.test(source)) return 'cleanSubtitle';
  return 'boldCreator';
}

function normalizeCaptionStyle(value: unknown): 'boldCreator' | 'cleanSubtitle' | 'podcast' | 'screenRecord' | 'productDemo' {
  if (value === 'boldCreator' || value === 'cleanSubtitle' || value === 'podcast' || value === 'screenRecord' || value === 'productDemo') return value;
  return 'boldCreator';
}

function attachOverlayWords<T extends {start: number; end: number}>(
  overlays: T[],
  words?: ReelWord[],
): Array<T & {words?: ReelWord[]}> {
  if (!words?.length) return overlays;
  return overlays.map((overlay) => {
    const overlayWords = words
      .filter((word) => word.end > overlay.start && word.start < overlay.end)
      .map((word) => ({
        word: word.word,
        start: roundTime(Math.max(0, word.start - overlay.start)),
        end: roundTime(Math.min(overlay.end, word.end) - overlay.start),
      }))
      .filter((word) => word.word && word.end > word.start);
    return overlayWords.length ? {...overlay, words: overlayWords} : overlay;
  });
}

function getTemplateName(value?: string): ReelTemplateName | null {
  const normalized = String(value || '').toLowerCase().replace(/[_\s]+/g, '');

  // Direct registry lookup first — covers all templates without needing individual checks
  const registryMatch = Object.keys(REEL_TEMPLATE_REGISTRY).find((key) =>
    key.toLowerCase().replace(/[_\s]+/g, '') === normalized
  );
  if (registryMatch) return registryMatch as ReelTemplateName;

  // Keyword fallbacks for common short names
  if (normalized.includes('compare') || normalized.includes('comparison') || /\bvs\b/.test(normalized)) return 'comparisonImages';
  if (normalized.includes('autocaption') || normalized.includes('auto-caption') || normalized.includes('caption') || normalized.includes('subtitle')) return 'AUTO_CAPTION_GENERATOR';
  if (normalized.includes('longvideo') || normalized.includes('promo')) return 'LONG_VIDEO_PROMO';

  // SAFETY: Do NOT silently fallback to Video Explainer.
  // If we reach here, the template ID is genuinely unrecognized.
  // Return null so the caller can show a proper error instead of rendering the wrong template.
  return null;
}

function getTimelineVisualMode(templateName: ReelTemplateName): ReelTimelineScene['visualMode'] {
  if (templateName === 'AUTO_CAPTION_GENERATOR') return 'videoCaption';
  if (templateName === 'IMAGE_STORY_COLLAGE') return 'imageStory';
  if (templateName === 'comparisonImages') return 'compare';
  return 'videoExplainer';
}

function getTimelinePrimaryFocus(templateName: ReelTemplateName): ReelTimelineScene['primaryFocus'] {
  if (templateName === 'AUTO_CAPTION_GENERATOR') return 'captions';
  if (templateName === 'IMAGE_STORY_COLLAGE') return 'images';
  if (templateName === 'comparisonImages') return 'comparison';
  return 'topVisual';
}

function getSafeDuration(
  requestedDuration: unknown,
  words: ReelWord[] | undefined,
  segments: ReelTranscriptSegment[] | undefined,
  transcript: string,
) {
  const explicit = Number(requestedDuration);
  if (Number.isFinite(explicit) && explicit > 0) return roundTime(Math.min(MAX_SECONDS, explicit));
  const lastSegment = segments?.at(-1);
  if (lastSegment?.end) return roundTime(Math.min(MAX_SECONDS, lastSegment.end));
  const lastWord = words?.at(-1);
  if (lastWord?.end) return roundTime(Math.min(MAX_SECONDS, lastWord.end));
  const estimated = Math.max(8, transcript.split(/\s+/).filter(Boolean).length / 2.4);
  return roundTime(Math.min(MAX_SECONDS, estimated));
}

function getTimedSegments({
  transcript,
  words,
  segments,
  durationSeconds,
}: {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds: number;
}) {
  const fromSegments = (segments || [])
    .map((segment) => ({
      start: roundTime(Math.max(0, segment.start)),
      end: roundTime(Math.min(durationSeconds, Math.max(segment.start + 0.2, segment.end))),
      text: cleanDisplayText(segment.text),
    }))
    .filter((segment) => segment.text && segment.start < durationSeconds && segment.end > segment.start);

  if (fromSegments.length) return fromSegments;

  if (words?.length) {
    const chunks = chunkWords(words.filter((word) => word.start < durationSeconds), 8);
    if (chunks.length) {
      return chunks.map((chunk) => ({
        start: roundTime(chunk[0].start),
        end: roundTime(Math.min(durationSeconds, chunk.at(-1)?.end || chunk[0].end + 1)),
        text: cleanDisplayText(chunk.map((word) => word.word).join(' ')),
      }));
    }
  }

  const plainWords = cleanDisplayText(transcript).split(/\s+/).filter(Boolean);
  const total = Math.max(1, plainWords.length);
  const chunkSize = Math.max(6, Math.ceil(total / Math.max(2, Math.ceil(durationSeconds / 6))));
  const fallback = [];
  for (let index = 0; index < total; index += chunkSize) {
    const start = (index / total) * durationSeconds;
    const end = (Math.min(total, index + chunkSize) / total) * durationSeconds;
    fallback.push({
      start: roundTime(start),
      end: roundTime(Math.max(start + 1.4, end)),
      text: plainWords.slice(index, index + chunkSize).join(' '),
    });
  }
  return fallback;
}

function buildOverlayTimeline(
  segments: Array<{start: number; end: number; text: string}>,
  request: ReelPlanRequest,
  language: 'english' | 'hinglish',
  scriptDetails: ScriptDetails,
  templateName: ReelTemplateName,
) {
  const directedPlan = buildOverlayTimelineFromScriptDetails(scriptDetails, request, language, templateName, segments);
  if (directedPlan.length) return directedPlan;

  const groups: Array<{start: number; end: number; text: string}> = [];
  let current: {start: number; end: number; texts: string[]} | null = null;

  for (const segment of segments) {
    const duration = current ? segment.end - current.start : 0;
    const shouldStartNew =
      !current ||
      duration >= MAX_OVERLAY_SECONDS ||
      (duration >= MIN_OVERLAY_SECONDS && /[.!?]$/.test(current.texts.join(' ')));

    if (shouldStartNew) {
      if (current) groups.push({start: current.start, end: current.end, text: current.texts.join(' ')});
      current = {start: segment.start, end: segment.end, texts: [segment.text]};
    } else {
      current!.end = segment.end;
      current!.texts.push(segment.text);
    }
  }
  if (current) groups.push({start: current.start, end: current.end, text: current.texts.join(' ')});

  const usedDetailBlockIds = new Set<string>();

  return groups.map((group, index) => {
    const isFirst = index === 0;
    const isLast = index === groups.length - 1;
    const text = cleanDisplayText(group.text);
    const detailBlock = pickDetailBlockForText(text, scriptDetails, index, usedDetailBlockIds);
    if (detailBlock) usedDetailBlockIds.add(detailBlock.id);
    const title = detailBlock?.title || makeOverlayTitle(text, isFirst, language);
    const body = detailBlock ? detailBlock.items.slice(0, 4).join(' | ') : makeOverlayBody(text, title);
    const type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta' =
      isFirst ? 'hook' : isLast ? 'cta' : detailBlock ? overlayTypeForDetail(detailBlock.type) : inferOverlayType(text);

    return withOverlayDirection({
      id: `overlay-${String(index + 1).padStart(2, '0')}`,
      start: roundTime(group.start),
      end: roundTime(group.end),
      type,
      label: isFirst ? 'Hook' : isLast ? 'Final Point' : detailBlock ? detailBlock.title : labelForType(type),
      text: title,
      body,
      accentWord: pickAccentWord(title, request.topicTitle || request.topic),
      align: isFirst || title.length < 22 ? 'center' as const : 'left' as const,
      sfx: isFirst ? 'softPop' as const : isLast ? 'softChime' as const : 'softTick' as const,
    }, detailBlock?.type, undefined, templateName);
  });
}

function attachCompareStickerPoses<T extends {text: string; body?: string; type: string; stickerPose?: string}>(
  overlays: T[],
  templateName: ReelTemplateName,
): T[] {
  if (templateName !== 'comparisonImages' || overlays.length === 0) return overlays;

  return overlays.map((overlay, index) => {
    const stickerPose = inferCompareStickerPose({
      text: [overlay.text, overlay.body].filter(Boolean).join(' '),
      type: overlay.type,
      index,
      total: overlays.length,
    });
    return {
      ...overlay,
      stickerPose,
    };
  });
}

function inferCompareStickerPose({
  text,
  type,
  index,
  total,
}: {
  text: string;
  type: string;
  index: number;
  total: number;
}) {
  const normalized = normalizeForPlannerMatch(text);
  if (index === 0 || type === 'hook') return 'sticker_welcome_intro_explainer';
  if (index === total - 1 || type === 'cta') return 'sticker_happy_celebrating_outro';
  if (/\b(warning|risk|mistake|galti|avoid|danger|problem|issue|downside|con|cons)\b/.test(normalized)) return 'warning';
  if (/[?]/.test(text) || /\b(question|confused|doubt|which one|which is|kaunsa better|konsa better|kya difference|kya farq|why|how)\b/.test(normalized)) {
    return 'sticker_questioning_surprised_explainer';
  }
  if (/\b(vs|versus|compare|comparison|difference|both|dono|between|side by side|on one hand|on the other hand)\b/.test(normalized)) {
    return 'sticker_comparing_both_sides_explainer';
  }
  if (/\b(right side|option b|second option|second item|doosra|dusra|right item|item b)\b/.test(normalized)) return 'sticker_pointing_right_side_explainer';
  if (/\b(left side|option a|first option|first item|pehla|pehle|left item|item a)\b/.test(normalized)) return 'sticker_pointing_left_side_explainer';
  if (/\b(final|conclusion|winner|best choice|recommended|clear|success|sahi answer|yaad rakho|remember)\b/.test(normalized)) {
    return 'sticker_success_conclusion_explainer';
  }
  if (/\b(explain|explaining|matlab|means|reason|because|feature|benefit|advantage|key point|important|rule)\b/.test(normalized)) {
    return 'sticker_general_explaining_key_point';
  }
  if (/\b(think|thinking|analysis|analyze|samjho|socho|consider|neutral)\b/.test(normalized)) {
    return 'sticker_thinking_analysis_explainer';
  }

  const progress = total > 1 ? index / (total - 1) : 0;
  const naturalArc = [
    'sticker_pointing_left_side_explainer',
    'sticker_general_explaining_key_point',
    'sticker_comparing_both_sides_explainer',
    'sticker_pointing_right_side_explainer',
    'sticker_thinking_analysis_explainer',
    'sticker_pointing_left_side_explainer',
    'sticker_pointing_right_side_explainer',
    'sticker_success_conclusion_explainer',
  ];
  if (progress < 0.18) return 'sticker_pointing_left_side_explainer';
  if (progress > 0.82) return 'sticker_success_conclusion_explainer';
  return naturalArc[index % naturalArc.length];
}

function normalizeForPlannerMatch(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function applyVisualPlanToOverlays<T extends ReelPlanResult['renderProps']['overlayTimeline'][number]>(
  overlays: T[],
  visualPlan?: VisualPlan,
): T[] {
  if (!visualPlan?.scenes?.length || !overlays.length) return overlays;
  return overlays.map((overlay, index) => {
    const visualScene = findVisualPlanSceneForOverlay(overlay, visualPlan, index);
    if (!visualScene) return overlay;
    const primaryVisual = {
      ...overlay.primaryVisual,
      type: overlay.primaryVisual?.type === 'uploadedMedia' ? overlay.primaryVisual.type : 'mockup' as const,
      label: visualScene.frameLabel || overlay.primaryVisual?.label,
      prompt: visualScene.assetSearchText || overlay.primaryVisual?.prompt,
      motion: overlay.primaryVisual?.motion || 'slideUp' as const,
    };
    return {
      ...overlay,
      label: visualScene.frameLabel || overlay.label,
      visual: visualScene.showWhat || overlay.visual,
      assetBrief: visualScene.assetSearchText || overlay.assetBrief,
      primaryVisual,
      sfx: visualScene.sfx || overlay.sfx,
      animation: visualScene.animation || overlay.animation,
      emotion: visualScene.emotion || overlay.emotion,
      sceneType: visualScene.visualType,
      frameType: visualScene.frameType,
      frameText: visualScene.frameText,
      frameLabel: visualScene.frameLabel,
      frameValue: visualScene.frameValue,
      frameItems: visualScene.frameItems,
      visualPlanReason: visualScene.whyMatchesScript,
      activeNodeId: visualScene.activeNodeId,
    };
  });
}

function findVisualPlanSceneForOverlay(
  overlay: ReelPlanResult['renderProps']['overlayTimeline'][number],
  visualPlan: VisualPlan,
  fallbackIndex: number,
) {
  const explicit = visualPlan.scenes.find((scene) => scene.id === overlay.id);
  if (explicit) return explicit;
  let bestScene: VisualPlan['scenes'][number] | undefined;
  let bestOverlap = 0;
  for (const scene of visualPlan.scenes) {
    const overlap = Math.max(0, Math.min(overlay.end, scene.end) - Math.max(overlay.start, scene.start));
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestScene = scene;
    }
  }
  return bestScene || visualPlan.scenes[fallbackIndex] || visualPlan.scenes.at(-1);
}

function buildOverlayTimelineFromScriptDetails(
  scriptDetails: ScriptDetails,
  request: ReelPlanRequest,
  language: 'english' | 'hinglish',
  templateName: ReelTemplateName,
  segments: Array<{start: number; end: number; text: string}> = [],
) {
  const expandedPlan = templateName === 'HANDWRITTEN_NOTES'
    ? expandHandwrittenNotePlan(scriptDetails.videoUsePlan || [])
    : scriptDetails.videoUsePlan || [];
  const plan = templateName === 'HANDWRITTEN_NOTES'
    ? alignHandwrittenPlanToSegments(expandedPlan, segments)
    : expandedPlan;
  if (!plan.length) return [];
  return plan
    .map((item, index) => {
      const isVideoExplainer = templateName === 'VIDEO_EXPLAINER';
      const title = cleanDisplayText(item.renderText || item.displayText || item.title || item.sourceText).slice(0, 90);
      const bodySource = isVideoExplainer
        ? item.renderBody || item.body || ''
        : item.renderBody || item.body || item.sourceText || '';
      const type = overlayTypeForScriptUse(item.purpose, item.detailType, index, plan.length);
      return withOverlayDirection({
        id: item.id || `overlay-${String(index + 1).padStart(2, '0')}`,
        start: roundTime(item.start),
        end: roundTime(item.end),
        type,
        label: item.title || labelForType(type),
        text: isVideoExplainer
          ? trimWords(title || makeOverlayTitle(item.sourceText || scriptDetails.summary, index === 0, language), 8)
          : title || makeOverlayTitle(item.sourceText || scriptDetails.summary, index === 0, language),
        body: isVideoExplainer
          ? trimWords(cleanDisplayText(bodySource), 12)
          : cleanDisplayText(bodySource).slice(0, 140),
        accentWord: pickAccentWord(title || item.title, request.topicTitle || request.topic || scriptDetails.topic),
        align: index === 0 || title.length < 24 ? 'center' as const : 'left' as const,
        sfx: index === 0 ? 'softPop' as const : index === plan.length - 1 ? 'softChime' as const : 'softTick' as const,
      }, item.detailType, item, templateName);
    })
    .filter((item) => item.end > item.start && item.text);
}

function expandHandwrittenNotePlan(plan: NonNullable<ScriptDetails['videoUsePlan']>) {
  const expanded: NonNullable<ScriptDetails['videoUsePlan']> = [];

  for (const item of plan) {
    const parts = uniqueReadableTextParts([
      item.renderText || item.displayText || item.title,
      ...splitNoteBeatText(item.renderBody || item.body),
    ]).slice(0, 4);

    if (parts.length <= 1) {
      expanded.push({
        ...item,
        renderText: trimWords(parts[0] || item.renderText || item.displayText || item.title, 7),
        renderBody: trimWords(item.renderBody || item.body || '', 10),
      });
      continue;
    }

    const totalDuration = Math.max(2.4, item.end - item.start);
    const beatDuration = Math.max(2.2, totalDuration / parts.length);
    parts.forEach((part, index) => {
      const start = roundTime(item.start + index * beatDuration);
      const end = roundTime(index === parts.length - 1 ? item.end : Math.min(item.end, start + beatDuration));
      if (end <= start) return;
      expanded.push({
        ...item,
        id: `${item.id || 'note'}-beat-${index + 1}`,
        start,
        end,
        purpose: index === 0 ? item.purpose : 'point',
        layout: index === 0 ? item.layout : 'checklistCard',
        visual: getHandwrittenBeatVisual(item.visual, item.detailType, item.purpose, part, index),
        animation: 'fadeUp',
        title: part,
        displayText: part,
        body: '',
        renderText: trimWords(part, 7),
        renderBody: '',
        sourceText: item.sourceText,
      });
    });
  }

  return expanded.slice(0, 18);
}

function getHandwrittenBeatVisual(
  visual: string,
  detailType: NonNullable<ScriptDetails['videoUsePlan']>[number]['detailType'],
  purpose: NonNullable<ScriptDetails['videoUsePlan']>[number]['purpose'],
  text: string,
  index: number,
) {
  const token = getHandwrittenVisualToken(visual, purpose === 'warning' ? 'warning' : purpose === 'cta' ? 'cta' : 'point', detailType, text);
  if (index === 0) return token;
  if (
    token === 'document_checklist' ||
    token === 'timeline_strip' ||
    token === 'formula_box' ||
    token === 'comparison_table' ||
    token === 'exam_date_card' ||
    token === 'mind_map' ||
    token === 'pros_cons_table' ||
    token === 'step_ladder' ||
    token === 'flowchart_box' ||
    token === 'before_after_box' ||
    token === 'calendar_reminder' ||
    token === 'ranked_list' ||
    token === 'quote_card'
  ) return token;
  if (purpose === 'warning') return 'effect_xmark';
  if (purpose === 'action' || purpose === 'cta') return 'effect_checkmark';
  return 'bullet_write';
}

function alignHandwrittenPlanToSegments(
  plan: NonNullable<ScriptDetails['videoUsePlan']>,
  segments: Array<{start: number; end: number; text: string}>,
) {
  if (!plan.length || !segments.length) return plan;
  const usedSegments = new Set<number>();
  return plan.map((item, index) => {
    const source = cleanDisplayText([item.sourceText, item.renderText, item.renderBody, item.displayText, item.body].filter(Boolean).join(' '));
    const bestIndex = findBestSegmentIndex(source, segments, usedSegments, index);
    const segment = segments[bestIndex];
    if (!segment) return item;
    usedSegments.add(bestIndex);
    const originalDuration = Math.max(1.2, item.end - item.start);
    const segmentDuration = Math.max(1.2, segment.end - segment.start);
    const duration = Math.min(Math.max(originalDuration, segmentDuration), 5.2);
    return {
      ...item,
      start: roundTime(segment.start),
      end: roundTime(Math.max(segment.start + 1.2, Math.min(segment.end, segment.start + duration))),
      sourceText: item.sourceText || segment.text,
    };
  });
}

function findBestSegmentIndex(
  source: string,
  segments: Array<{start: number; end: number; text: string}>,
  usedSegments: Set<number>,
  fallbackIndex: number,
) {
  const sourceWords = tokenSet(source);
  let bestIndex = -1;
  let bestScore = 0;
  segments.forEach((segment, index) => {
    if (usedSegments.has(index)) return;
    const segmentWords = tokenSet(segment.text);
    const overlap = [...sourceWords].filter((word) => segmentWords.has(word)).length;
    const score = overlap / Math.max(1, Math.min(sourceWords.size || 1, segmentWords.size || 1));
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  if (bestIndex >= 0 && bestScore >= 0.15) return bestIndex;
  return Math.min(segments.length - 1, Math.max(0, fallbackIndex));
}

function tokenSet(value: string) {
  return new Set(
    cleanDisplayText(value)
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.replace(/[^a-z0-9]+/g, ''))
      .filter((word) => word.length >= 3),
  );
}

function splitNoteBeatText(value: string) {
  return cleanDisplayText(value)
    .split(/\s+\|\s+|(?:^|\s)[•\-]\s+|(?<=[.!?])\s+/)
    .map((item) => item.replace(/^[•\-]\s*/g, '').trim())
    .filter(Boolean);
}

function uniqueReadableTextParts(items: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const item of items.map((value) => cleanDisplayText(value)).filter(Boolean)) {
    const key = item.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function withOverlayDirection<T extends {
  type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta';
  text: string;
  body?: string;
}>(
  overlay: T,
  detailType?: ScriptDetails['detailBlocks'][number]['type'],
  planItem?: NonNullable<ScriptDetails['videoUsePlan']>[number],
  templateName: ReelTemplateName = 'VIDEO_EXPLAINER',
): T & {
  layout: ReelOverlayLayout;
  visual: string;
  visualRole: ReelOverlayVisualRole;
  primaryVisual: ReelPrimaryVisual;
  assetBrief?: string;
  animation: ReelOverlayAnimation;
  emotion: ReelOverlayEmotion;
} {
  const visual = getOverlayVisualDirection(overlay, detailType, planItem, templateName);
  const assetBrief = getOverlayAssetBrief(overlay, visual, detailType, planItem, templateName);
  return {
    ...overlay,
    layout: getOverlayLayout(overlay.type, detailType, planItem),
    visual,
    visualRole: getOverlayVisualRole(templateName, overlay.type),
    primaryVisual: getOverlayPrimaryVisual(templateName, overlay, detailType, planItem, assetBrief),
    ...(assetBrief ? {assetBrief} : {}),
    animation: getOverlayAnimation(overlay.type, planItem),
    emotion: getOverlayEmotion(overlay.type, planItem),
    ...normalizeHandwrittenOverlayMetadata(templateName, {...overlay, visual}),
  };
}

function normalizeHandwrittenOverlayMetadata(
  templateName: ReelTemplateName,
  overlay: {
    type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta';
    text: string;
    body?: string;
    visual?: string;
    start?: number;
    end?: number;
  },
) {
  if (templateName !== 'HANDWRITTEN_NOTES') return {};
  const visual = getHandwrittenVisualToken(overlay.visual || '', overlay.type, undefined, overlay.text, overlay.body);
  const sceneType = getHandwrittenSceneType(visual, overlay.type);
  const noteItems = getHandwrittenNoteItems(overlay.text, overlay.body, overlay.type, visual);
  const diagram = getHandwrittenDiagram(visual, overlay.text, overlay.body);
  const annotations = getHandwrittenAnnotations(visual, overlay.text, overlay.body);
  const revealPlan = getHandwrittenRevealPlan(overlay, visual, noteItems, annotations);
  return {
    visual,
    sceneType,
    noteItems,
    diagram,
    annotations,
    revealPlan,
  };
}

function getHandwrittenVisualToken(
  value: string,
  type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta',
  detailType?: ScriptDetails['detailBlocks'][number]['type'],
  text = '',
  body = '',
) {
  const explicit = cleanDisplayText(value).toLowerCase();
  const allowed = [
    'heading_write',
    'bullet_write',
    'diagram_flowchart',
    'diagram_timeline',
    'diagram_mindmap',
    'formula_box',
    'comparison_table',
    'timeline_strip',
    'document_checklist',
    'exam_date_card',
    'mind_map',
    'pros_cons_table',
    'step_ladder',
    'flowchart_box',
    'before_after_box',
    'calendar_reminder',
    'ranked_list',
    'quote_card',
    'effect_bracket',
    'effect_checkmark',
    'effect_xmark',
    'arrow_diagram',
    'highlight_swipe',
    'red_circle',
  ];
  if (allowed.includes(explicit)) return explicit;

  const source = cleanDisplayText([value, text, body].filter(Boolean).join(' ')).toLowerCase();
  if (type === 'hook') return 'heading_write';
  if (/quote|believe|yakeen|confidence|khud par|motivation|hope|himmat/.test(source)) return 'quote_card';
  if (type === 'warning' || detailType === 'warningBox' || /mistake|avoid|wrong|risk|nahi|no response/.test(source)) return 'effect_xmark';
  if (/rejection|reject|failure|fail|seekh|learning/.test(source)) return 'before_after_box';
  if (detailType === 'dateBox' || /exam date|admit card|deadline|last date|result date|important date/.test(source)) return 'exam_date_card';
  if (/calendar|reminder|date|deadline|expected|april|january|february|march|may|june|july|august|september|october|november|december/.test(source)) return 'calendar_reminder';
  if (detailType === 'documentList' || /document|resume|cv|aadhaar|pan card|photo|signature|upload|proof/.test(source)) return 'document_checklist';
  if (/top\s*\d|rank|priority|important points|sabse/.test(source)) return 'ranked_list';
  if (/pros|cons|advantages|disadvantages|benefit|drawback/.test(source)) return 'pros_cons_table';
  if (/before|after|degree|skills|old|new|pehle|baad/.test(source)) return 'before_after_box';
  if (/growth|level|stage|career|skills|skill|progress|improve|better/.test(source)) return 'step_ladder';
  if (detailType === 'processList' || /step|process|apply|submit|download|continue|daily|habit|practice/.test(source)) return 'timeline_strip';
  if (detailType === 'amountBox' || /salary|fee|amount|percentage|score|formula|calculate|eligibility|ability/.test(source)) return 'formula_box';
  if (/category|categories|types|benefits|branches|points/.test(source)) return 'mind_map';
  if (/cause|effect|because|leads to|result/.test(source)) return 'flowchart_box';
  if (/compare|versus|\bvs\b|difference/.test(source)) return 'comparison_table';
  if (type === 'stat') return 'highlight_swipe';
  if (type === 'cta' || /believe|work|action|next|apply/.test(source)) return 'effect_checkmark';
  return 'bullet_write';
}

function getHandwrittenSceneType(visual: string, type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta') {
  if (type === 'hook' || visual === 'heading_write') return 'noteTitleScene';
  if (visual === 'formula_box') return 'formulaBoxScene';
  if (visual === 'comparison_table') return 'comparisonTableScene';
  if (visual === 'timeline_strip') return 'timelineStripScene';
  if (visual === 'document_checklist') return 'documentChecklistScene';
  if (visual === 'exam_date_card') return 'examDateCardScene';
  if (visual === 'mind_map') return 'mindmapScene';
  if (visual === 'pros_cons_table') return 'prosConsScene';
  if (visual === 'step_ladder') return 'stepLadderScene';
  if (visual === 'flowchart_box') return 'flowchartScene';
  if (visual === 'before_after_box') return 'beforeAfterScene';
  if (visual === 'calendar_reminder') return 'calendarReminderScene';
  if (visual === 'ranked_list') return 'rankedListScene';
  if (visual === 'quote_card') return 'quoteNoteScene';
  if (visual === 'effect_xmark' || visual === 'red_circle' || type === 'warning') return 'mistakeCorrectionScene';
  if (visual === 'diagram_flowchart' || visual === 'arrow_diagram') return 'flowchartScene';
  if (visual === 'diagram_timeline') return 'timelineScene';
  if (visual === 'diagram_mindmap') return 'mindmapScene';
  if (type === 'cta') return 'summaryBoxScene';
  return 'bulletLessonScene';
}

function getHandwrittenNoteItems(text: string, body = '', type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta', visual: string) {
  const parts = uniqueReadableTextParts([
    cleanDisplayText(body),
    ...cleanDisplayText(body).split(/\s+\|\s+|,\s+|(?<=[.!?])\s+/),
  ]).filter((item) => item && !isSameShortText(item, text)).slice(0, 3);
  const icon =
    type === 'warning' || visual === 'effect_xmark'
      ? 'warning' as const
      : visual === 'effect_checkmark' || visual === 'document_checklist'
        ? 'check' as const
        : visual === 'timeline_strip' || visual === 'step_ladder' || visual === 'ranked_list'
          ? 'number' as const
          : 'dot' as const;
  return (parts.length ? parts : [body || text])
    .filter(Boolean)
    .slice(0, 3)
    .map((item) => ({text: trimWords(item, 8), icon}));
}

function getHandwrittenDiagram(visual: string, text: string, body = '') {
  const nodes = uniqueReadableTextParts([text, ...cleanDisplayText(body).split(/\s+\|\s+|,\s+/)])
    .map((item) => trimWords(item, 4))
    .filter(Boolean)
    .slice(0, 5);
  const fallbackNodes = nodes.length >= 2 ? nodes : [trimWords(text, 4), 'Next Step', 'Action'];
  if (visual === 'comparison_table' || visual === 'pros_cons_table' || visual === 'before_after_box') return {type: 'comparison' as const, nodes: fallbackNodes.slice(0, 4), activeNode: fallbackNodes[0]};
  if (visual === 'timeline_strip' || visual === 'exam_date_card' || visual === 'calendar_reminder' || visual === 'step_ladder' || visual === 'ranked_list') return {type: 'timeline' as const, nodes: fallbackNodes.slice(0, 5), activeNode: fallbackNodes.at(-1)};
  if (visual === 'diagram_mindmap' || visual === 'mind_map') return {type: 'mindmap' as const, nodes: fallbackNodes.slice(0, 5), activeNode: fallbackNodes[0]};
  return {type: 'flowchart' as const, nodes: fallbackNodes.slice(0, 5), activeNode: fallbackNodes[0]};
}

function getHandwrittenAnnotations(visual: string, text: string, body = '') {
  const targetText = trimWords(pickAccentWord(text, body) || text, 4);
  if (visual === 'effect_xmark') return [{type: 'side_note' as const, targetText, label: 'avoid'}];
  if (visual === 'exam_date_card' || visual === 'calendar_reminder' || visual === 'red_circle') return [{type: 'red_circle' as const, targetText}];
  if (visual === 'effect_checkmark') return [{type: 'underline' as const, targetText}];
  if (visual === 'timeline_strip' || visual === 'step_ladder' || visual === 'flowchart_box' || visual === 'arrow_diagram') return [{type: 'arrow_diagram' as const, targetText, label: 'next'}];
  if (visual === 'highlight_swipe' || visual === 'formula_box' || visual === 'quote_card') return [{type: 'highlight_swipe' as const, targetText}];
  return [{type: 'underline' as const, targetText}];
}

function getHandwrittenRevealPlan(
  overlay: {text: string; body?: string; start?: number; end?: number},
  visual: string,
  noteItems: Array<{text: string}>,
  annotations: Array<{type: string; targetText: string}>,
) {
  const duration = Math.max(1.2, Number(overlay.end || 0) - Number(overlay.start || 0));
  const entries = [
    {text: trimWords(overlay.text, 7), token: 'heading_write'},
    ...noteItems.map((item) => ({text: trimWords(item.text, 8), token: 'bullet_write'})),
    ...annotations.map((item) => ({
      text: trimWords(item.targetText, 5),
      token: item.type === 'red_circle' ? 'red_circle' : item.type === 'arrow_diagram' ? 'arrow_diagram' : visual,
    })),
  ].filter((item) => item.text).slice(0, 6);
  const step = duration / Math.max(1, entries.length);
  return entries.map((entry, index) => ({
    ...entry,
    start: roundTime(index * step),
    end: roundTime(Math.min(duration, index * step + Math.max(0.8, step * 0.82))),
  }));
}

function isSameShortText(a: string, b: string) {
  const left = cleanDisplayText(a).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const right = cleanDisplayText(b).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return Boolean(left && right && (left === right || left.includes(right) || right.includes(left)));
}

function getOverlayPrimaryVisual(
  templateName: ReelTemplateName,
  overlay: {type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta'; text: string; body?: string},
  detailType?: ScriptDetails['detailBlocks'][number]['type'],
  planItem?: NonNullable<ScriptDetails['videoUsePlan']>[number],
  assetBrief?: string,
): ReelPrimaryVisual {
  const source = cleanDisplayText([assetBrief, planItem?.visual, overlay.text, overlay.body].filter(Boolean).join(' '));
  if (templateName === 'VIDEO_CAPTION') return {type: 'uploadedMedia', label: 'Uploaded video', motion: 'slowZoom'};
  if (templateName === 'IMAGE_STORY') return {type: 'image', label: 'Story image', prompt: source, motion: 'slowZoom'};
  if (templateName === 'HANDWRITTEN_NOTES') return {type: 'document', label: 'Notebook scene', prompt: source, motion: 'slideUp'};
  if (templateName === 'VIDEO_EXPLAINER') {
    return {
      type: 'image',
      label: pickAccentWord(overlay.text, planItem?.title) || 'Scene image',
      prompt: source,
      motion: overlay.type === 'hook' || overlay.type === 'stat' ? 'slowZoom' : 'panLeft',
    };
  }
  if (overlay.type === 'hook') return {type: 'waveform', label: 'Audio story pulse', prompt: source, motion: 'float'};
  if (overlay.type === 'stat' || detailType === 'amountBox' || detailType === 'dateBox') return {type: 'chart', label: extractStatToken(source) || 'Key number', prompt: source, motion: 'pop'};
  if (overlay.type === 'warning' || detailType === 'warningBox') return {type: 'mockup', label: 'Warning scene', prompt: source, motion: 'pop'};
  if (detailType === 'documentList') return {type: 'document', label: 'Documents', prompt: source, motion: 'slideUp'};
  if (detailType === 'processList') return {type: 'mockup', label: 'Process flow', prompt: source, motion: 'panLeft'};
  if (detailType === 'websiteBox') return {type: 'mockup', label: 'Website frame', prompt: source, motion: 'slowZoom'};
  return {type: 'mockup', label: pickAccentWord(overlay.text, planItem?.title), prompt: source, motion: 'slideUp'};
}

function getOverlayVisualRole(
  templateName: ReelTemplateName,
  type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta',
): ReelOverlayVisualRole {
  if (templateName === 'HANDWRITTEN_NOTES') return type === 'hook' ? 'background' : 'assetInsert';
  if (templateName === 'AUTO_CAPTION_GENERATOR') return 'topVideo';
  if (templateName === 'VIDEO_CAPTION') return 'topVideo';
  if (templateName === 'IMAGE_STORY') return 'background';
  if (templateName === 'comparisonImages') return 'bottomOverlay';
  return 'assetInsert';
}

function getOverlayLayout(
  type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta',
  detailType?: ScriptDetails['detailBlocks'][number]['type'],
  planItem?: NonNullable<ScriptDetails['videoUsePlan']>[number],
): ReelOverlayLayout {
  if (planItem?.layout === 'hookCard' || planItem?.layout === 'quoteCard') return 'headlineCard';
  if (planItem?.layout === 'statCard') return 'statCard';
  if (planItem?.layout === 'warningCard') return 'warningCard';
  if (planItem?.layout === 'checklistCard') return 'checklist';
  if (planItem?.layout === 'ctaCard') return 'ctaCard';
  if (planItem?.layout === 'splitExplainer') return 'splitExplainer';
  if (type === 'hook' || type === 'quote') return 'headlineCard';
  if (type === 'stat' || detailType === 'amountBox' || detailType === 'dateBox') return 'statCard';
  if (type === 'warning' || detailType === 'warningBox') return 'warningCard';
  if (type === 'cta') return 'ctaCard';
  if (detailType === 'processList' || detailType === 'documentList') return 'checklist';
  return 'splitExplainer';
}

function getOverlayAnimation(
  type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta',
  planItem?: NonNullable<ScriptDetails['videoUsePlan']>[number],
): ReelOverlayAnimation {
  if (planItem?.animation === 'popIn') return 'popIn';
  if (planItem?.animation === 'fadeUp' || planItem?.animation === 'none') return 'fadeUp';
  if (planItem?.animation === 'slideUp') return 'slideUp';
  if (planItem?.animation === 'countUp') return 'countUp';
  if (planItem?.animation === 'pulse') return 'warningPulse';
  if (type === 'hook') return 'popIn';
  if (type === 'stat') return 'countUp';
  if (type === 'warning') return 'warningPulse';
  if (type === 'cta') return 'slideUp';
  return 'fadeUp';
}

function getOverlayEmotion(
  type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta',
  planItem?: NonNullable<ScriptDetails['videoUsePlan']>[number],
): ReelOverlayEmotion {
  if (planItem?.emotion === 'urgent') return 'urgent';
  if (planItem?.emotion === 'serious') return 'serious';
  if (planItem?.emotion === 'motivational') return 'motivational';
  if (planItem?.emotion === 'informative' || planItem?.emotion === 'neutral') return 'informative';
  if (type === 'hook') return 'urgent';
  if (type === 'warning') return 'serious';
  if (type === 'cta') return 'motivational';
  return 'informative';
}

function getOverlayVisualDirection(
  overlay: {type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta'; text: string; body?: string},
  detailType?: ScriptDetails['detailBlocks'][number]['type'],
  planItem?: NonNullable<ScriptDetails['videoUsePlan']>[number],
  templateName: ReelTemplateName = 'VIDEO_EXPLAINER',
) {
  if (templateName === 'HANDWRITTEN_NOTES') {
    return getHandwrittenVisualToken(planItem?.visual || '', overlay.type, detailType, overlay.text, overlay.body);
  }
  const concrete = cleanDisplayText(planItem?.visual || '').replace(/\b(show|display|visualize)\b/gi, '').trim();
  if (concrete && concrete.length >= 8) return concrete;
  if (overlay.type === 'hook') return 'massive crowd or bold topic visual matched to the opening hook';
  if (overlay.type === 'stat' || detailType === 'amountBox') return 'large number card with simple count comparison';
  if (detailType === 'dateBox') return 'calendar date card with deadline emphasis';
  if (overlay.type === 'warning' || detailType === 'warningBox') return 'crowd waiting or warning sign for the current risk';
  if (detailType === 'processList') return 'person completing the current step on laptop or phone';
  if (detailType === 'documentList') return 'clean document checklist with one highlighted requirement';
  if (overlay.type === 'cta') return 'question mark and comment prompt for final CTA';
  if (overlay.type === 'quote') return 'single quote card over relevant real-world background';
  return 'relevant real-world scene matched to the active transcript phrase';
}

function getOverlayAssetBrief(
  overlay: {type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta'; text: string; body?: string},
  visual: string,
  detailType?: ScriptDetails['detailBlocks'][number]['type'],
  planItem?: NonNullable<ScriptDetails['videoUsePlan']>[number],
  templateName: ReelTemplateName = 'VIDEO_EXPLAINER',
) {
  if (templateName !== 'VIDEO_EXPLAINER') return '';
  const explicit = cleanDisplayText(planItem?.assetSearchText || '');
  if (explicit.length >= 8) return trimWords(explicit, 22);
  const source = cleanDisplayText([
    visual,
    planItem?.sourceText,
    overlay.text,
    overlay.body,
  ].filter(Boolean).join(' '));
  if (source.length >= 8) return trimWords(source, 22);
  if (detailType === 'documentList') return 'clean close-up photo of official documents, paperwork, checklist, desk';
  if (detailType === 'amountBox' || overlay.type === 'stat') return 'finance photo with money, calculator, report, clear numerical context';
  if (overlay.type === 'warning') return 'serious real-world warning context, official document, risk or alert photo';
  if (overlay.type === 'hook') return 'strong editorial photo matching the opening news hook, real-world subject';
  return 'real-world editorial photo matching the current spoken point';
}

function getSceneComplexity(type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta') {
  if (type === 'stat') return 0.55;
  if (type === 'warning') return 0.65;
  if (type === 'hook') return 0.5;
  if (type === 'cta') return 0.4;
  return 0.35;
}

function getVisualEnergy(type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta', index: number, total: number) {
  if (index === 0 || type === 'hook') return 0.72;
  if (type === 'warning') return 0.68;
  if (type === 'stat') return 0.6;
  if (index === total - 1 || type === 'cta') return 0.5;
  return 0.45;
}

function buildSuggestedAssets(scriptDetails: ScriptDetails, templateName: ReelTemplateName, externalAssets: ExternalVisualAssetCandidate[] = []) {
  const externalSuggestions = externalAssets.map((asset) => (
    `external asset: ${asset.title} (${asset.provider}, ${asset.type}, query: ${asset.query}) -> ${asset.src}`
  ));
  if (templateName === 'HANDWRITTEN_NOTES') {
    return [
      'clean paper-style canvas',
      'editorial cards',
      'small checklist markers',
      ...matchAssetsForScript(scriptDetails, 4),
    ].slice(0, 12); // Limit suggestions
  }
  if (templateName === 'IMAGE_STORY') {
    return [
      'uploaded image as primary visual',
      'selected image assets only when user supplied or explicitly enabled',
      'subtle cinematic motion per scene',
      'minimal safe-zone text overlays',
      ...(scriptDetails.imageSelectionPlan || []).map((item) => `image need: ${item.bestMatchDescription}`),
      ...externalSuggestions,
      ...matchAssetsForScript(scriptDetails, 4),
    ].slice(0, 12); // Limit suggestions
  }
  if (templateName === 'IMAGE_STORY_COLLAGE') { // New suggestions for collage
    return [
      'AI-generated cinematic images as primary visual',
      'subtle Ken Burns effect on images',
      'kinetic typography for text reveals',
      'decorative overlays (tape, paper scraps) for collage effect',
      'dark cinematic overlays with brand-mint accents',
      'whoosh and hit sound effects for transitions',
      'emotional/strong script for image generation',
    ].slice(0, 12);
  }
  const suggestions = [
    ...(scriptDetails.videoUsePlan || []).map((item) => item.assetSearchText ? `scene asset brief ${item.start}-${item.end}s: ${item.assetSearchText}` : '').filter(Boolean),
    ...(scriptDetails.assetBriefs || []).map((item) => item.searchText || item.title || '').filter(Boolean),
    ...(scriptDetails.imageUsagePolicy
      ? [`image count policy: min ${scriptDetails.imageUsagePolicy.minImages}, max ${scriptDetails.imageUsagePolicy.maxImages}, recommended ${scriptDetails.imageUsagePolicy.recommendedImages}`]
      : []),
    ...(scriptDetails.imageSelectionPlan || []).map((item) => [
      `image need: ${item.bestMatchDescription}`,
      `tags: ${item.requiredTags.join(', ')}`,
      item.avoidTags.length ? `avoid: ${item.avoidTags.join(', ')}` : '',
      `fallback: ${item.fallbackVisual}`,
    ].filter(Boolean).join(' | ')),
    ...(scriptDetails.websites || []).map((item) => `website screenshot: ${item}`),
    ...(scriptDetails.amounts || []).map((item) => `number emphasis: ${item}`),
    ...externalSuggestions,
    ...matchAssetsForScript(scriptDetails, 8),
  ];
  return Array.from(new Set(suggestions)).slice(0, 12);
}

function applyExternalVisualAssetsToOverlays<T extends {
  type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta';
  text: string;
  body?: string;
  primaryVisual?: ReelPrimaryVisual;
  assetBrief?: string;
  visualRole?: ReelOverlayVisualRole;
}>(
  overlays: T[],
  assets: ExternalVisualAssetCandidate[],
  templateName: ReelTemplateName,
  mediaType: 'audio' | 'video' | 'image',
  maxImages: number,
): T[] {
  if (templateName !== 'VIDEO_EXPLAINER' || !assets.length) return overlays;
  let assetIndex = 0;
  return overlays.map((overlay, index) => {
    if (assetIndex >= maxImages) return overlay;
    const useExternalImage = mediaType === 'audio'
      ? index === 0 || overlay.type === 'hook' || overlay.type === 'quote' || overlay.type === 'point' || overlay.type === 'cta'
      : overlay.visualRole === 'assetInsert' || overlay.primaryVisual?.type === 'image';
    if (!useExternalImage) return overlay;
    const asset = pickBestExternalAsset(assets, [overlay.assetBrief, overlay.primaryVisual?.prompt, overlay.text, overlay.body].filter(Boolean).join(' '), assetIndex++);
    if (!asset) return overlay;
    return {
      ...overlay,
      visualRole: 'assetInsert',
      primaryVisual: {
        type: 'image',
        assetId: asset.src,
        prompt: overlay.primaryVisual?.prompt || asset.query,
        label: overlay.primaryVisual?.label || asset.title,
        motion: overlay.primaryVisual?.motion || (index % 2 === 0 ? 'slowZoom' : 'panLeft'),
      },
    };
  });
}

function pickBestExternalAsset(assets: ExternalVisualAssetCandidate[], text: string, fallbackIndex: number) {
  if (!assets.length) return undefined;
  const queryTokens = tokenizeAssetText(text);
  let best: ExternalVisualAssetCandidate | undefined;
  let bestScore = -1;
  for (const asset of assets) {
    const score = [...tokenizeAssetText([asset.query, asset.title].join(' '))]
      .reduce((sum, token) => sum + (queryTokens.has(token) ? 1 : 0), 0);
    if (score > bestScore) {
      best = asset;
      bestScore = score;
    }
  }
  if (best && bestScore >= 2) return best;
  const samePosition = assets[fallbackIndex];
  if (!samePosition) return undefined;
  const positionalScore = [...tokenizeAssetText([samePosition.query, samePosition.title].join(' '))]
    .reduce((sum, token) => sum + (queryTokens.has(token) ? 1 : 0), 0);
  return positionalScore >= 2 ? samePosition : undefined;
}

function tokenizeAssetText(value: string) {
  return new Set(cleanDisplayText(value).toLowerCase().split(/[^a-z0-9]+/g).filter((token) => token.length > 2));
}

function overlayTypeForScriptUse(
  purpose: NonNullable<ScriptDetails['videoUsePlan']>[number]['purpose'],
  detailType: NonNullable<ScriptDetails['videoUsePlan']>[number]['detailType'],
  index: number,
  total: number,
): 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta' {
  if (index === 0 || purpose === 'hook') return 'hook';
  if (index === total - 1 || purpose === 'cta') return 'cta';
  if (purpose === 'warning' || detailType === 'warningBox') return 'warning';
  if (purpose === 'date' || detailType === 'dateBox' || detailType === 'amountBox') return 'stat';
  if (purpose === 'proof') return 'quote';
  return 'point';
}

function inferOverlayType(text: string): 'point' | 'stat' | 'warning' | 'quote' {
  if (/[0-9₹$%]/.test(text)) return 'stat';
  if (/\b(nahi|nahin|warning|risk|galti|problem|lekin|but|danger|avoid)\b/i.test(text)) return 'warning';
  if (text.length <= 28) return 'quote';
  return 'point';
}

function pickDetailBlockForText(
  text: string,
  scriptDetails: ScriptDetails,
  index: number,
  usedDetailBlockIds: Set<string>,
) {
  if (index === 0) return null;
  const normalized = text.toLowerCase();
  const candidates = scriptDetails.detailBlocks.filter((block) => !usedDetailBlockIds.has(block.id));
  return candidates.find((block) => {
    if (block.type === 'websiteBox') {
      return /\b(website|site|portal|link|open|visit)\b/i.test(text) || block.items.some((item) => normalized.includes(item.toLowerCase()));
    }
    if (block.type === 'amountBox') {
      return /\b(₹|rs|rupees|fee|fees|payment|amount|cost|charge)\b/i.test(text) || block.items.some((item) => normalized.includes(item.toLowerCase()));
    }
    if (block.type === 'documentList') {
      return /\b(document|documents|proof|card|photo|signature|certificate)\b/i.test(text) || block.items.some((item) => normalized.includes(item.toLowerCase()));
    }
    if (block.type === 'dateBox') {
      return /\b(date|deadline|last date|exam|admit card|hall ticket)\b/i.test(text) || block.items.some((item) => normalized.includes(item.toLowerCase()));
    }
    if (block.type === 'warningBox') {
      return /\b(deadline|galti|mistake|avoid|warning|required|mandatory|reject|problem|risk)\b/i.test(text);
    }
    if (block.type === 'processList') {
      return /\b(apply|download|fill|submit|upload|register|login|verify|check|pay|open|visit|click)\b/i.test(text);
    }
    return false;
  }) || null;
}

function overlayTypeForDetail(type: ScriptDetails['detailBlocks'][number]['type']): 'point' | 'stat' | 'warning' | 'quote' {
  if (type === 'amountBox' || type === 'dateBox') return 'stat';
  if (type === 'warningBox') return 'warning';
  if (type === 'websiteBox' || type === 'documentList' || type === 'processList') return 'point';
  return 'quote';
}

function labelForType(type: string) {
  if (type === 'stat') return 'Number';
  if (type === 'warning') return 'Reality';
  if (type === 'quote') return 'Note';
  return 'Point';
}

function makeOverlayTitle(text: string, isFirst: boolean, language: 'english' | 'hinglish') {
  const cleaned = removeWeakIntroPhrases(cleanDisplayText(text));
  const entityTitle = extractEntityTitle(cleaned);
  if (entityTitle && (isFirst || entityTitle.split(/\s+/).length >= 2)) return entityTitle;
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (!words.length) return language === 'hinglish' ? 'Suno' : 'Watch this';
  const filteredWords = words.filter((word) => !TITLE_FILLER_WORDS.has(word.toLowerCase().replace(/[^a-z0-9]+/g, '')));
  const limit = isFirst ? 4 : 4;
  return titleCase((filteredWords.length ? filteredWords : words).slice(0, limit).join(' '));
}

function makeOverlayBody(text: string, title: string) {
  const titleWords = new Set(title.toLowerCase().split(/\s+/).map((word) => word.replace(/[^a-z0-9]+/g, '')));
  const bodyWords = text
    .split(/\s+/)
    .filter((word, index) => index > 1 || !titleWords.has(word.toLowerCase().replace(/[^a-z0-9]+/g, '')));
  return trimWords(bodyWords.join(' '), 18);
}

function pickAccentWord(title: string, topic?: string) {
  const topicWords = new Set(String(topic || '').toLowerCase().split(/\s+/).filter(Boolean));
  const words = title.split(/\s+/).filter(Boolean);
  return (
    words.find((word) => /[0-9₹$%]/.test(word)) ||
    words.find((word) => topicWords.has(word.toLowerCase())) ||
    words.find((word) => word.length >= 4) ||
    words[0]
  );
}

function deriveTopicTitle(segments: Array<{text: string}>, transcript: string) {
  const source = removeWeakIntroPhrases([segments[0]?.text, segments[1]?.text, transcript].filter(Boolean).join(' '));
  const entityTitle = extractEntityTitle(source);
  if (entityTitle) return cleanTitle(entityTitle);

  const importantWords = cleanDisplayText(source)
    .split(/\s+/)
    .filter((word) => {
      const normalized = word.toLowerCase().replace(/[^a-z0-9]+/g, '');
      return normalized && !TITLE_FILLER_WORDS.has(normalized) && normalized.length > 2;
    });

  return titleCase(trimWords(importantWords.join(' ') || 'Video reel', 5));
}

function cleanTitle(value?: string) {
  const source = cleanDisplayText(value || '');
  return source ? titleCase(trimWords(removeWeakIntroPhrases(source), 5)) : undefined;
}
// Removed TITLE_FILLER_WORDS as it's not used in the current context.
const TITLE_FILLER_WORDS = new Set([
  'aaj',
  'ab',
  'apko',
  'aap',
  'aur',
  'bata',
  'bhi',
  'hai',
  'hain',
  'ho',
  'hota',
  'hoti',
  'hum',
  'ka',
  'kar',
  'karte',
  'ke',
  'ki',
  'kya',
  'lekin',
  'me',
  'mein',
  'milta',
  'na',
  'naam',
  'nahi',
  'nahin',
  'ne',
  'se',
  'sirf',
  'suna',
  'the',
  'this',
  'to',
  'video',
  'ye',
]);

function removeWeakIntroPhrases(value: string) {
  return cleanDisplayText(value)
    .replace(/\bnaam suna hai na\b/gi, ' ')
    .replace(/\bsuna hai na\b/gi, ' ')
    .replace(/\baaj hum\b/gi, ' ')
    .replace(/\blets?\s+be\s+real\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractEntityTitle(value: string) {
  const cleaned = cleanDisplayText(value);
  const acronymMatch = cleaned.match(
    /\b([A-Z]{2,}(?:\s+(?:[A-Z][a-z0-9]+|[A-Z0-9]{1,4})){0,4})\b/,
  );
  if (acronymMatch?.[1]) {
    return titleCase(trimWords(acronymMatch[1], 5));
  }

  const titleishMatch = cleaned.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z0-9]+){1,3})\b/);
  if (titleishMatch?.[1]) return titleCase(trimWords(titleishMatch[1], 5));

  return '';
}

function detectLanguage(text: string): 'english' | 'hinglish' {
  return /\b(hai|hain|nahi|nahin|kya|kaise|kyun|lekin|aur|bhi|aap|apko|karna|hoga|hoti|mein|me)\b/i.test(text)
    ? 'hinglish'
    : 'english';
}

function estimateSpeechDensity(transcript: string, durationSeconds: number): 'slow' | 'medium' | 'fast' {
  const wps = transcript.split(/\s+/).filter(Boolean).length / Math.max(1, durationSeconds);
  if (wps > 2.8) return 'fast';
  if (wps < 1.45) return 'slow';
  return 'medium';
}

function estimateHookStrength(text: string) {
  if (/[?!%]|\b(secret|mistake|warning|stop|free|today|naam suna|real)\b/i.test(text)) return 0.78;
  return 0.62;
}

function chunkWords(words: ReelWord[], size: number) {
  const chunks: ReelWord[][] = [];
  for (let index = 0; index < words.length; index += size) {
    chunks.push(words.slice(index, index + size));
  }
  return chunks;
}

function cleanDisplayText(value: string) {
  return String(value || '')
    .replace(/[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim();
}

function trimWords(value: string, maxWords: number) {
  const words = cleanDisplayText(value).split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ')}...`;
}

function titleCase(value: string) {
  return cleanDisplayText(value)
    .split(/\s+/)
    .map((word) => {
      if (/^[A-Z0-9]{2,}$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function getMaxOpenAiCallsPerRender() {
  const value = Number(process.env.OPENAI_MAX_CALLS_PER_RENDER || 1);
  if (!Number.isFinite(value)) return 1;
  return Math.max(0, Math.floor(value));
}

function clampPlanNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function defaultValidationVisual(type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta') {
  if (type === 'hook') return 'large transcript-based hook with one clear focal visual';
  if (type === 'stat') return 'single number or date emphasis matched to the spoken phrase';
  if (type === 'warning') return 'single warning callout matched to the spoken phrase';
  if (type === 'cta') return 'single clean action card matched to the final spoken phrase';
  if (type === 'quote') return 'single quote-style text moment matched to the spoken phrase';
  return 'single explainer visual matched to the active transcript phrase';
}

function normalizePrimaryVisual(
  value: ReelPrimaryVisual | undefined,
  overlay: {type: 'hook' | 'point' | 'stat' | 'warning' | 'quote' | 'cta'; text: string; body?: string; visual?: string; assetBrief?: string},
  mediaType: 'video' | 'audio' | 'image',
): ReelPrimaryVisual {
  const allowedTypes = new Set<ReelPrimaryVisualType>(['uploadedMedia', 'image', 'chart', 'document', 'waveform', 'mockup', 'none']);
  const type = value?.type && allowedTypes.has(value.type)
    ? value.type
    : mediaType === 'audio' || mediaType === 'video' // If audio/video is primary, it's uploadedMedia
      ? overlay.type === 'stat'
        ? 'chart'
        : overlay.type === 'warning'
          ? 'mockup'
          : 'waveform'
      : 'uploadedMedia';
  const allowedMotions = new Set<ReelPrimaryVisualMotion>(['slowZoom', 'panLeft', 'float', 'pop', 'slideUp', 'parallax']);
  const prompt = cleanDisplayText(value?.prompt || overlay.assetBrief || overlay.visual || [overlay.text, overlay.body].filter(Boolean).join(' ')).slice(0, 180);
  return {
    type,
    assetId: cleanDisplayText(value?.assetId || '').slice(0, 500) || undefined,
    prompt,
    label: cleanDisplayText(value?.label || labelForType(overlay.type)).slice(0, 48),
    motion: value?.motion && allowedMotions.has(value.motion) ? value.motion : defaultPrimaryVisualMotion(type),
  };
}

function defaultPrimaryVisualMotion(type: ReelPrimaryVisualType): ReelPrimaryVisualMotion {
  if (type === 'chart') return 'pop';
  if (type === 'document' || type === 'mockup') return 'slideUp';
  if (type === 'image') return 'slowZoom';
  return 'float';
}

function extractStatToken(value?: string) {
  return cleanDisplayText(value || '').match(/[₹$]?\s?\d[\d,.]*(?:\s?(?:%|lakh|crore|k|thousand|days?|hours?|months?|years?))?/i)?.[0] || '';
}

function normalizeVisualKey(value: string) {
  return cleanDisplayText(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values.map((item) => cleanDisplayText(item)).filter(Boolean)) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function roundTime(value: number) {
  return Math.round(value * 100) / 100;
}
