import type { VideoDirectorPlan } from './videoDirector';
import type { VoiceoverAnalysis } from './voiceAnalysis';
import type { VideoScriptPlan, TimelineScene } from './scriptPlanner';
import type { SubtitlePlan } from './subtitleGenerator';
import type { SceneMatchingTimeline } from './sceneMatching';
import type { SoundEffectsPlan } from './soundEffects';
import { pickLocalMusicTrack } from '../assets/localAssetLibrary';
import { buildProfessionalTemplatePayload } from '../rendering/proVideoTemplates';
import { VIDEO_CANVAS, pickSafeFrameForScene, type VisualSafeFrameRatio } from './videoFormat/safeZones';
import { buildTextCardDesign } from './designSystem/colors';

type BlendMode = 'normal' | 'screen' | 'overlay' | 'multiply' | 'soft_light' | 'add';

type MasterScene = {
  id: string;
  role: string;
  start: number;
  end: number;
  startMs: number;
  endMs: number;
  duration: number;
  source: {
    type: 'user_video' | 'user_image' | 'asset_video' | 'asset_image' | 'asset_graphic' | 'placeholder';
    url: string | null;
    assetId?: string;
    driveFileId?: string;
    mimeType?: string;
    query?: string;
  };
  startOffset: number;
  endOffset: number;
  crop: {
    aspectRatio: '9:16';
    safeFrame: VisualSafeFrameRatio;
    fit: 'contain';
    focus: 'center' | 'face' | 'object' | 'text';
  };
  shotType: string;
  colorGrade: VideoDirectorPlan['colorGrade'];
  motion: Array<{
    type: string;
    start: number;
    end: number;
    params: Record<string, unknown>;
  }>;
  textCard?: {
    eyebrow: string;
    headline: string;
    body: string;
    backgroundColor: string;
    accentColor: string;
    headlineColor: string;
    bodyColor: string;
    strokeColor: string;
    panelColor: string;
    contrastMode: 'light_on_dark' | 'dark_on_light';
  };
};

type MasterCaption = {
  id: string;
  start: number;
  end: number;
  startMs: number;
  endMs: number;
  text: string;
  words: Array<{
    text: string;
    start: number;
    end: number;
    startMs: number;
    endMs: number;
    highlight: boolean;
  }>;
  style: SubtitlePlan['style'];
  animation: string;
  position: string;
};

type MasterMusic = {
  id: string;
  source: string;
  start: number;
  end: number;
  startMs: number;
  endMs: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  mood: string;
  duckVoiceByDb: number;
};

type MasterEffect = {
  id: string;
  type: 'visual_overlay' | 'camera_motion' | 'sfx' | 'texture' | 'text_motion';
  start: number;
  end: number;
  startMs: number;
  endMs: number;
  opacity: number;
  blendingMode: BlendMode;
  params: Record<string, unknown>;
};

type MasterTransition = {
  id: string;
  fromSceneId: string | null;
  toSceneId: string;
  start: number;
  end: number;
  startMs: number;
  endMs: number;
  style: string;
  soundEffectId?: string;
  easing: string;
};

export type AvailableFontDatabaseItem = {
  font_id: string;
  font_name: string;
  category?: string;
  vibe?: string;
};

export type TypographyFontSelection = {
  selected_font_id: string;
  selected_font_name: string;
  font_match_confidence: 'High' | 'Medium';
  reasoning: string;
};

export type MasterTimeline = {
  version: '1.0';
  metadata: {
    duration: number;
    durationMs: number;
    fps: 30;
    aspectRatio: '9:16';
    safeFrameRatios: VisualSafeFrameRatio[];
    editingStyle: string;
    voiceLanguage: string;
    template: {
      template_id: string;
      category: string;
      background_color: string;
      font_id?: string;
      font_family: string;
      animation_style: string;
      text_content: string;
      text_align: string;
      accent_color: string;
      overlay_opacity: number;
    };
    typography: TypographyFontSelection | null;
  };
  scenes: MasterScene[];
  captions: MasterCaption[];
  music: MasterMusic[];
  effects: MasterEffect[];
  transitions: MasterTransition[];
};

export function generateMasterTimeline(input: {
  directorPlan: VideoDirectorPlan;
  voiceoverAnalysis: VoiceoverAnalysis;
  scriptPlan: VideoScriptPlan;
  subtitlePlan: SubtitlePlan;
  directorTimeline: SceneMatchingTimeline;
  soundEffectsPlan: SoundEffectsPlan;
  availableFontsDatabase?: AvailableFontDatabaseItem[];
}): MasterTimeline {
  const scenes = input.scriptPlan.scenes.map((scene, index) => buildMasterScene(scene, index, input));
  const typography = selectTypographyFont(input);

  const captions = input.subtitlePlan.cues.map((cue) => ({
    id: cue.id,
    start: round(cue.start),
    end: round(cue.end),
    startMs: toMs(cue.start),
    endMs: toMs(cue.end),
    text: cue.text,
    words: cue.words.map((word) => ({
      text: word.text,
      start: round(word.start),
      end: round(word.end),
      startMs: toMs(word.start),
      endMs: toMs(word.end),
      highlight: word.highlight,
    })),
    style: input.subtitlePlan.style,
    animation: cue.animation,
    position: cue.position.y,
  }));
  const music = buildMusicTrack(input);
  const effects = buildEffects(input);
  const transitions = input.directorTimeline.tracks.transitions.map((event) => {
    const syncedSfx = input.soundEffectsPlan.events.find((sfx) => sfx.syncToEventId === event.id);

    return {
      id: event.id,
      fromSceneId: typeof event.params.fromSceneId === 'string' ? event.params.fromSceneId : null,
      toSceneId: event.sceneId,
      start: round(event.start),
      end: round(event.end),
      startMs: toMs(event.start),
      endMs: toMs(event.end),
      style: String(event.params.style || 'cut'),
      soundEffectId: syncedSfx?.id,
      easing: 'easeInOutCubic',
    };
  });

  return {
    version: '1.0',
    metadata: {
      duration: round(input.scriptPlan.totalDuration),
      durationMs: toMs(input.scriptPlan.totalDuration),
      fps: VIDEO_CANVAS.fps,
      aspectRatio: VIDEO_CANVAS.aspectRatio,
      safeFrameRatios: ['4:5', '1:1'],
      editingStyle: input.directorPlan.selectedStyle,
      voiceLanguage: input.voiceoverAnalysis.language.code,
      template: {
        ...buildProfessionalTemplatePayload({
          mood: input.voiceoverAnalysis.emotion.primary,
          editingStyle: input.directorPlan.selectedStyle,
          textContent: input.scriptPlan.scenes[0]?.scriptText || '',
          fontFamily: typography?.selected_font_name,
        }),
        ...(typography ? { font_id: typography.selected_font_id } : {}),
      },
      typography,
    },
    scenes,
    captions,
    music,
    effects,
    transitions,
  };
}

export function selectTypographyFont(input: {
  directorPlan: VideoDirectorPlan;
  voiceoverAnalysis: VoiceoverAnalysis;
  scriptPlan: VideoScriptPlan;
  subtitlePlan?: SubtitlePlan;
  availableFontsDatabase?: AvailableFontDatabaseItem[];
}): TypographyFontSelection | null {
  const fonts = normalizeFontDatabase(input.availableFontsDatabase);

  if (!fonts.length) {
    return null;
  }

  const genre = classifyTypographyGenre(input);
  const scored = fonts
    .map((font, index) => ({
      font,
      index,
      score: scoreFontForGenre(font, genre),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const best = scored[0];

  return {
    selected_font_id: best.font.font_id,
    selected_font_name: best.font.font_name,
    font_match_confidence: best.score >= 10 ? 'High' : 'Medium',
    reasoning: buildTypographyReason(genre, best.font),
  };
}

function buildMasterScene(
  scene: TimelineScene,
  index: number,
  input: Parameters<typeof generateMasterTimeline>[0],
): MasterScene {
  const source = pickSceneSource(scene);
  const motionEvents = input.directorTimeline.events.filter((event) => event.sceneId === scene.id && (event.type === 'zoom' || event.type === 'motion'));

  return {
    id: scene.id,
    role: scene.role,
    start: round(scene.start),
    end: round(scene.end),
    startMs: toMs(scene.start),
    endMs: toMs(scene.end),
    duration: round(scene.duration),
    source,
    startOffset: getStartOffset(index, source.type),
    endOffset: getStartOffset(index, source.type) + round(scene.duration),
    crop: {
      aspectRatio: VIDEO_CANVAS.aspectRatio,
      safeFrame: pickSafeFrameForScene({ sourceType: source.type, role: scene.role }),
      fit: 'contain',
      focus: scene.role === 'emotional_buildup' ? 'face' : scene.role === 'main_point' ? 'object' : 'center',
    },
    shotType: getShotType(scene, input.directorPlan),
    colorGrade: input.directorPlan.colorGrade,
    motion: motionEvents.map((event) => ({
      type: event.type,
      start: round(event.start),
      end: round(event.end),
      params: event.params,
    })),
    textCard: source.type === 'placeholder' ? buildTextCard(scene, index, input.directorPlan.selectedStyle) : undefined,
  };
}

function buildTextCard(scene: TimelineScene, index: number, selectedStyle: string): MasterScene['textCard'] {
  const palette = buildTextCardDesign({ selectedStyle, role: scene.role, index });
  const headline = toHeadline(scene.scriptText || scene.intent || scene.visualDirection);

  return {
    eyebrow: scene.role === 'hook' ? 'Key idea' : scene.role === 'cta' ? 'Next step' : `Point ${index}`,
    headline,
    body: scene.intent || 'A clean visual draft built from your audio.',
    ...palette,
  };
}

function normalizeFontDatabase(value: AvailableFontDatabaseItem[] | undefined): AvailableFontDatabaseItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((font) => ({
      font_id: typeof font?.font_id === 'string' ? font.font_id.trim() : '',
      font_name: typeof font?.font_name === 'string' ? font.font_name.trim() : '',
      category: typeof font?.category === 'string' ? font.category.trim() : '',
      vibe: typeof font?.vibe === 'string' ? font.vibe.trim() : '',
    }))
    .filter((font) => font.font_id && font.font_name);
}

function classifyTypographyGenre(input: {
  directorPlan: VideoDirectorPlan;
  voiceoverAnalysis: VoiceoverAnalysis;
  scriptPlan: VideoScriptPlan;
  subtitlePlan?: SubtitlePlan;
}) {
  const haystack = [
    input.directorPlan.selectedStyle,
    input.voiceoverAnalysis.emotion.primary,
    input.voiceoverAnalysis.topicSummary,
    input.voiceoverAnalysis.keywords.join(' '),
    input.voiceoverAnalysis.transcript,
    input.subtitlePlan?.style,
    ...input.scriptPlan.scenes.flatMap((scene) => [scene.role, scene.intent, scene.captionStyle, scene.visualDirection]),
  ].join(' ').toLowerCase();

  if (hasAny(haystack, ['gaming', 'game', 'kids', 'funny', 'comedy', 'meme', 'playful'])) return 'comedy_gaming_kids';
  if (hasAny(haystack, ['tech', 'software', 'ai', 'startup', 'corporate', 'business', 'tutorial', 'education', 'explainer', 'documentary', 'saas'])) return 'tech_corporate_explainer';
  if (hasAny(haystack, ['vlog', 'cinematic', 'story', 'storytelling', 'emotional', 'film', 'luxury', 'editorial'])) return 'vlog_cinematic_storytelling';
  if (hasAny(haystack, ['retention', 'shorts', 'reels', 'tiktok', 'viral', 'hype', 'energetic', 'motivation', 'hook', 'hormozi', 'mrbeast'])) return 'retention_shorts_hype';

  if (input.directorPlan.selectedStyle === 'slow_cinematic' || input.directorPlan.selectedStyle === 'luxury_edit' || input.directorPlan.selectedStyle === 'youtube_documentary') {
    return 'vlog_cinematic_storytelling';
  }

  return input.directorPlan.selectedStyle === 'fast_cuts' || input.directorPlan.selectedStyle === 'reels_pacing'
    ? 'retention_shorts_hype'
    : 'tech_corporate_explainer';
}

function scoreFontForGenre(font: AvailableFontDatabaseItem, genre: ReturnType<typeof classifyTypographyGenre>) {
  const text = `${font.font_name} ${font.category || ''} ${font.vibe || ''}`.toLowerCase();
  const scoreGroups: Record<ReturnType<typeof classifyTypographyGenre>, Array<[string[], number]>> = {
    retention_shorts_hype: [
      [['ultra', 'heavy', 'black', 'extra bold', 'extrabold', 'bold', 'all-caps', 'uppercase', 'impact', 'condensed', 'display', 'hype'], 8],
      [['anton', 'bebas', 'montserrat', 'poppins', 'geist'], 5],
      [['minimal', 'corporate', 'serif', 'elegant'], -2],
    ],
    tech_corporate_explainer: [
      [['clean', 'sans', 'sans-serif', 'geometric', 'professional', 'corporate', 'minimal', 'modern', 'tech'], 8],
      [['inter', 'roboto', 'geist', 'montserrat', 'poppins'], 5],
      [['playful', 'comic', 'kids', 'decorative'], -3],
    ],
    vlog_cinematic_storytelling: [
      [['elegant', 'modern', 'serif', 'editorial', 'cinematic', 'story', 'luxury', 'clean'], 8],
      [['playfair', 'merriweather', 'lora', 'cinzel', 'pt serif', 'inter'], 5],
      [['gaming', 'kids', 'comic', 'meme'], -3],
    ],
    comedy_gaming_kids: [
      [['playful', 'rounded', 'creative', 'gaming', 'kids', 'comic', 'fun', 'display'], 8],
      [['baloo', 'fredoka', 'comic', 'bangers', 'luckiest', 'nunito', 'poppins'], 5],
      [['corporate', 'serif', 'editorial', 'luxury'], -3],
    ],
  };

  return scoreGroups[genre].reduce((total, [tokens, weight]) => (
    tokens.some((token) => text.includes(token)) ? total + weight : total
  ), 0);
}

function buildTypographyReason(genre: ReturnType<typeof classifyTypographyGenre>, font: AvailableFontDatabaseItem) {
  const genreLabels: Record<ReturnType<typeof classifyTypographyGenre>, string> = {
    retention_shorts_hype: 'Retention/Shorts/Hype',
    tech_corporate_explainer: 'Tech/Corporate/Explainer',
    vlog_cinematic_storytelling: 'Vlogs/Cinematic/Storytelling',
    comedy_gaming_kids: 'Comedy/Gaming/Kids',
  };
  const vibe = font.vibe ? ` with a ${font.vibe} vibe` : '';

  return `${font.font_name} is registered in AVAILABLE_FONTS_DATABASE and best matches the ${genreLabels[genre]} profile${vibe}.`;
}

function hasAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

function buildMusicTrack(input: Parameters<typeof generateMasterTimeline>[0]): MasterMusic[] {
  const duration = input.scriptPlan.totalDuration;

  return [
    {
      id: 'music_bed_1',
      source: pickLocalMusicTrack(input.directorPlan.selectedStyle) || `/music/${input.directorPlan.selectedStyle}.mp3`,
      start: 0,
      end: round(duration),
      startMs: 0,
      endMs: toMs(duration),
      volume: input.directorPlan.selectedStyle === 'slow_cinematic' || input.directorPlan.selectedStyle === 'luxury_edit' ? 0.22 : 0.32,
      fadeIn: 0.8,
      fadeOut: Math.min(1.2, Math.max(0.4, duration * 0.08)),
      mood: input.directorPlan.selectedStyle,
      duckVoiceByDb: -5,
    },
  ];
}

function buildEffects(input: Parameters<typeof generateMasterTimeline>[0]): MasterEffect[] {
  const visualEffects = input.directorTimeline.events
    .filter((event) => event.type === 'zoom' || event.type === 'motion' || event.type === 'text')
    .map((event) => ({
      id: `effect_${event.id}`,
      type: event.type === 'text' ? 'text_motion' as const : 'camera_motion' as const,
      start: round(event.start),
      end: round(event.end),
      startMs: toMs(event.start),
      endMs: toMs(event.end),
      opacity: event.intensity === 'high' ? 1 : 0.82,
      blendingMode: 'normal' as BlendMode,
      params: event.params,
    }));

  const sfxEffects = input.soundEffectsPlan.events.map((event) => ({
    id: event.id,
    type: event.category === 'texture' ? 'texture' as const : 'sfx' as const,
    start: round(event.start),
    end: round(event.end),
    startMs: toMs(event.start),
    endMs: toMs(event.end),
    opacity: event.category === 'texture' ? 0.28 : 1,
    blendingMode: getBlendMode(event.category),
    params: {
      sfxId: event.sfxId,
      name: event.name,
      assetPath: event.assetPath,
      volume: event.volume,
      fadeIn: event.fadeIn,
      fadeOut: event.fadeOut,
      duckVoiceByDb: event.mix.duckVoiceByDb,
    },
  }));

  return [...visualEffects, ...sfxEffects].sort((a, b) => a.start - b.start);
}

function pickSceneSource(scene: TimelineScene): MasterScene['source'] {
  const userAsset = scene.userAssetSuggestions[0];
  if (userAsset) {
    return {
      type: userAsset.type === 'video' ? 'user_video' : 'user_image',
      url: userAsset.url,
      assetId: userAsset.id,
    };
  }

  const visualAsset = scene.visualSearches
    .flatMap((search) => search.visualAssets.map((asset) => ({ asset, query: search.query })))
    .find(({ asset }) => isRenderableSceneVisualAsset(asset) && (asset.previewUrl || asset.thumbnailUrl));

  if (visualAsset) {
    const type = visualAsset.asset.type === 'video'
      ? 'asset_video'
      : visualAsset.asset.type === 'image'
        ? 'asset_image'
        : 'asset_graphic';

    return {
      type,
      url: visualAsset.asset.previewUrl || visualAsset.asset.thumbnailUrl || null,
      assetId: visualAsset.asset.id,
      driveFileId: visualAsset.asset.driveFileId,
      mimeType: visualAsset.asset.mimeType,
      query: visualAsset.query,
    };
  }

  return {
    type: 'placeholder',
    url: null,
    query: scene.visualDirection,
  };
}

function isRenderableSceneVisualAsset(asset: TimelineScene['visualSearches'][number]['visualAssets'][number]) {
  if (asset.type === 'video' || asset.type === 'image') return true;

  const mimeType = String(asset.mimeType || '').toLowerCase();
  const title = String(asset.title || asset.previewUrl || asset.thumbnailUrl || '').toLowerCase();
  if (mimeType.includes('svg') || title.endsWith('.svg') || title.endsWith('.json') || title.endsWith('.lottie')) {
    return false;
  }

  return false;
}

function toHeadline(value: string) {
  const words = value
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 9);

  if (!words.length) return 'Your idea becomes a video';

  const text = words.join(' ');
  return text.length > 68 ? `${text.slice(0, 65).trim()}...` : text;
}

function getShotType(scene: TimelineScene, directorPlan: VideoDirectorPlan) {
  const primaryRule = directorPlan.shotSelection.find((rule) => rule.priority === 'primary');
  if (scene.role === 'hook') return 'establishing';
  if (scene.role === 'emotional_buildup') return 'close_up';
  return primaryRule?.shotType || 'b_roll_overlay';
}

function getStartOffset(index: number, sourceType: MasterScene['source']['type']) {
  if (sourceType === 'user_image' || sourceType === 'asset_image' || sourceType === 'asset_graphic' || sourceType === 'placeholder') {
    return 0;
  }

  return round((index * 1.7) % 8);
}

function getBlendMode(category: string): BlendMode {
  if (category === 'texture') return 'screen';
  if (category === 'atmosphere') return 'overlay';
  return 'normal';
}

function toMs(seconds: number) {
  return Math.round(seconds * 1000);
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

