import type { SceneMatchingTimeline } from './sceneMatching';
import type { VoiceoverAnalysis } from './voiceAnalysis';
import type { VideoScriptPlan } from './scriptPlanner';
import type { VideoDirectorPlan } from './videoDirector';
import { findLocalSoundEffect } from '../assets/localAssetLibrary';

type SfxCategory = 'transition' | 'impact' | 'atmosphere' | 'build_up' | 'ui_foley' | 'texture';
type SfxPriority = 'primary' | 'secondary' | 'optional';

type SfxAsset = {
  id: string;
  name: string;
  category: SfxCategory;
  tags: string[];
  assetPath: string;
  defaultVolume: number;
  defaultDuration: number;
  priority: SfxPriority;
};

type SfxTimelineEvent = {
  id: string;
  sfxId: string;
  name: string;
  category: SfxCategory;
  sceneId: string;
  start: number;
  end: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  syncToEventId?: string;
  trigger: 'transition' | 'impact' | 'riser' | 'ambient' | 'text_highlight' | 'texture';
  assetPath: string;
  mix: {
    duckVoiceByDb: number;
    stereoPan: number;
    allowOverlap: boolean;
  };
};

export type SoundEffectsPlan = {
  version: '1.0';
  strategy: {
    mood: string;
    density: 'minimal' | 'balanced' | 'high_energy';
    priorityOrder: string[];
  };
  library: SfxAsset[];
  events: SfxTimelineEvent[];
  tracks: {
    transitions: SfxTimelineEvent[];
    impacts: SfxTimelineEvent[];
    risers: SfxTimelineEvent[];
    ambience: SfxTimelineEvent[];
    uiFoley: SfxTimelineEvent[];
    textures: SfxTimelineEvent[];
  };
};

export const SFX_LIBRARY: SfxAsset[] = [
  asset('whoosh_fast', 'Whoosh / Swish', 'transition', ['fast_motion', 'zoom', 'transition'], '/sounds/transitions/whoosh-fast.mp3', 0.72, 0.45, 'primary'),
  asset('swoosh_light', 'Swoosh', 'transition', ['light_motion', 'soft_transition'], '/sounds/transitions/swoosh-light.mp3', 0.52, 0.38, 'primary'),
  asset('glitch', 'Glitch', 'transition', ['digital', 'distortion', 'tech'], '/sounds/transitions/glitch.mp3', 0.64, 0.5, 'secondary'),
  asset('paper_slide', 'Paper Tear/Slide', 'transition', ['organic', 'slide', 'paper'], '/sounds/transitions/paper-slide.mp3', 0.48, 0.55, 'optional'),
  asset('cinematic_hit', 'Cinematic Hit', 'impact', ['reveal', 'emphasis', 'hook'], '/sounds/impacts/cinematic-hit.mp3', 0.82, 0.7, 'primary'),
  asset('bass_drop', 'Bass Drop', 'impact', ['deep', 'emotional', 'drop'], '/sounds/impacts/bass-drop.mp3', 0.76, 0.9, 'primary'),
  asset('thump_boom', 'Thump / Boom', 'impact', ['heavy', 'text_entry', 'beat'], '/sounds/impacts/thump-boom.mp3', 0.7, 0.45, 'primary'),
  asset('braam', 'Braam', 'impact', ['epic', 'cinematic', 'horn'], '/sounds/impacts/braam.mp3', 0.66, 1.2, 'secondary'),
  asset('cinematic_drone', 'Cinematic Drone', 'atmosphere', ['tension', 'cinematic', 'background'], '/sounds/atmosphere/cinematic-drone.mp3', 0.2, 8, 'secondary'),
  asset('room_tone', 'White Noise / Room Tone', 'atmosphere', ['empty', 'room', 'noise'], '/sounds/atmosphere/room-tone.mp3', 0.16, 8, 'optional'),
  asset('nature_ambience', 'Nature Ambience', 'atmosphere', ['forest', 'wind', 'rain', 'nature'], '/sounds/atmosphere/nature-ambience.mp3', 0.18, 8, 'optional'),
  asset('urban_hum', 'Urban Hum', 'atmosphere', ['city', 'office', 'urban'], '/sounds/atmosphere/urban-hum.mp3', 0.18, 8, 'secondary'),
  asset('riser', 'Riser', 'build_up', ['build', 'tension', 'peak'], '/sounds/build-up/riser.mp3', 0.58, 1.8, 'primary'),
  asset('clock_ticking', 'Clock Ticking', 'build_up', ['time', 'fast_pace', 'pressure'], '/sounds/build-up/clock-ticking.mp3', 0.34, 2.5, 'secondary'),
  asset('heartbeat', 'Heartbeat', 'build_up', ['intensity', 'human', 'emotional'], '/sounds/build-up/heartbeat.mp3', 0.42, 2.2, 'secondary'),
  asset('ui_pop_click', 'UI Pop / Click', 'ui_foley', ['button', 'highlight', 'text'], '/sounds/ui-foley/ui-pop-click.mp3', 0.42, 0.18, 'secondary'),
  asset('keyboard_typing', 'Keyboard Typing', 'ui_foley', ['information', 'typing', 'tech'], '/sounds/ui-foley/keyboard-typing.mp3', 0.28, 1.2, 'optional'),
  asset('digital_beep', 'Digital Beep', 'ui_foley', ['scan', 'tech', 'beep'], '/sounds/ui-foley/digital-beep.mp3', 0.36, 0.22, 'secondary'),
  asset('camera_shutter', 'Camera Shutter', 'ui_foley', ['flash', 'freeze_frame', 'photo'], '/sounds/ui-foley/camera-shutter.mp3', 0.5, 0.2, 'optional'),
  asset('vinyl_crackle', 'Vinyl Crackle', 'texture', ['retro', 'old', 'texture'], '/sounds/textures/vinyl-crackle.mp3', 0.16, 8, 'optional'),
  asset('film_static', 'Film Static', 'texture', ['vintage', 'film', 'texture'], '/sounds/textures/film-static.mp3', 0.18, 8, 'secondary'),
  asset('whoosh_to_hit', 'Whoosh-to-Hit', 'texture', ['combined', 'transition', 'impact'], '/sounds/textures/whoosh-to-hit.mp3', 0.78, 0.75, 'primary'),
];

export function generateSoundEffectsPlan(
  analysis: VoiceoverAnalysis,
  scriptPlan: VideoScriptPlan,
  directorTimeline: SceneMatchingTimeline,
  directorPlan?: VideoDirectorPlan,
): SoundEffectsPlan {
  const strategy = getSfxStrategy(analysis, directorTimeline);
  const events: SfxTimelineEvent[] = [];

  directorTimeline.tracks.transitions.forEach((event, index) => {
    const sfx = pickTransitionSfx(event, analysis);
    events.push(createSfxEvent({
      id: `sfx_transition_${index + 1}`,
      sfx,
      sceneId: event.sceneId,
      start: Math.max(0, event.start - 0.04),
      trigger: 'transition',
      syncToEventId: event.id,
      volumeBoost: event.intensity === 'high' ? 0.08 : 0,
    }));
  });

  directorTimeline.tracks.cuts.forEach((event, index) => {
    const sfx = event.intensity === 'high' ? getSfx('cinematic_hit') : getSfx('thump_boom');
    events.push(createSfxEvent({
      id: `sfx_impact_${index + 1}`,
      sfx,
      sceneId: event.sceneId,
      start: event.start,
      trigger: 'impact',
      syncToEventId: event.id,
      volumeBoost: event.intensity === 'high' ? 0.06 : -0.06,
    }));
  });

  scriptPlan.scenes.forEach((scene, index) => {
    if (scene.role === 'emotional_buildup' || scene.role === 'hook') {
      const sfx = scene.role === 'emotional_buildup' ? pickBuildUpSfx(analysis) : getSfx('riser');
      const start = Math.max(scene.start, scene.end - sfx.defaultDuration);
      events.push(createSfxEvent({
        id: `sfx_riser_${index + 1}`,
        sfx,
        sceneId: scene.id,
        start,
        trigger: 'riser',
        volumeBoost: scene.role === 'hook' ? -0.08 : 0,
      }));
    }

    if (index === 0 || scene.role === 'main_point') {
      const ambient = pickAmbientSfx(analysis, scene.scriptText);
      events.push(createSfxEvent({
        id: `sfx_ambient_${index + 1}`,
        sfx: ambient,
        sceneId: scene.id,
        start: scene.start,
        end: scene.end,
        trigger: 'ambient',
        volumeBoost: 0,
        allowOverlap: true,
      }));
    }
  });

  directorTimeline.tracks.text
    .filter((event) => event.intensity === 'high')
    .slice(0, strategy.density === 'minimal' ? 4 : 12)
    .forEach((event, index) => {
      events.push(createSfxEvent({
        id: `sfx_text_${index + 1}`,
        sfx: getSfx('ui_pop_click'),
        sceneId: event.sceneId,
        start: event.start,
        trigger: 'text_highlight',
        syncToEventId: event.id,
        volumeBoost: -0.08,
      }));
    });

  if (analysis.emotion.primary === 'cinematic' || analysis.emotion.primary === 'luxury') {
    const texture = analysis.emotion.primary === 'cinematic' ? getSfx('film_static') : getSfx('vinyl_crackle');
    events.push(createSfxEvent({
      id: 'sfx_texture_1',
      sfx: texture,
      sceneId: scriptPlan.scenes[0]?.id || 'scene_1',
      start: 0,
      end: Math.min(scriptPlan.totalDuration, 12),
      trigger: 'texture',
      allowOverlap: true,
    }));
  }

  directorPlan?.semanticSoundDesign.forEach((rule, index) => {
    const keywordTiming = findKeywordTiming(analysis, rule.keyword);
    if (!keywordTiming) return;

    const sfx = pickSemanticSfx(rule.soundCue, rule.action);
    events.push(createSfxEvent({
      id: `sfx_semantic_${index + 1}`,
      sfx,
      sceneId: findSceneIdByTime(scriptPlan, keywordTiming.start),
      start: keywordTiming.start,
      trigger: rule.action === 'muffle' || rule.action === 'music_duck' ? 'ambient' : 'impact',
      volumeBoost: -0.04,
      allowOverlap: true,
    }));
  });

  const sanitizedEvents = sanitizeSfxEvents(events, scriptPlan.totalDuration, strategy.density);

  return {
    version: '1.0',
    strategy,
    library: SFX_LIBRARY,
    events: sanitizedEvents,
    tracks: {
      transitions: sanitizedEvents.filter((event) => event.trigger === 'transition'),
      impacts: sanitizedEvents.filter((event) => event.trigger === 'impact'),
      risers: sanitizedEvents.filter((event) => event.trigger === 'riser'),
      ambience: sanitizedEvents.filter((event) => event.trigger === 'ambient'),
      uiFoley: sanitizedEvents.filter((event) => event.trigger === 'text_highlight'),
      textures: sanitizedEvents.filter((event) => event.trigger === 'texture'),
    },
  };
}

function createSfxEvent(options: {
  id: string;
  sfx: SfxAsset;
  sceneId: string;
  start: number;
  end?: number;
  trigger: SfxTimelineEvent['trigger'];
  syncToEventId?: string;
  volumeBoost?: number;
  allowOverlap?: boolean;
}): SfxTimelineEvent {
  const end = options.end ?? options.start + options.sfx.defaultDuration;

  return {
    id: options.id,
    sfxId: options.sfx.id,
    name: options.sfx.name,
    category: options.sfx.category,
    sceneId: options.sceneId,
    start: round(options.start),
    end: round(end),
    volume: clamp(round(options.sfx.defaultVolume + (options.volumeBoost || 0)), 0.05, 1),
    fadeIn: options.sfx.category === 'atmosphere' || options.sfx.category === 'texture' ? 0.45 : 0.02,
    fadeOut: options.sfx.category === 'atmosphere' || options.sfx.category === 'texture' ? 0.8 : 0.08,
    syncToEventId: options.syncToEventId,
    trigger: options.trigger,
    assetPath: options.sfx.assetPath,
    mix: {
      duckVoiceByDb: options.sfx.category === 'impact' ? -2 : 0,
      stereoPan: 0,
      allowOverlap: options.allowOverlap ?? options.sfx.category !== 'impact',
    },
  };
}

function pickTransitionSfx(event: SceneMatchingTimeline['events'][number], analysis: VoiceoverAnalysis) {
  const style = String(event.params.style || '');

  if (style.includes('glitch')) return getSfx('glitch');
  if (style.includes('paper')) return getSfx('paper_slide');
  if (event.intensity === 'high' || analysis.emotion.primary === 'energetic') return getSfx('whoosh_fast');
  return getSfx('swoosh_light');
}

function pickBuildUpSfx(analysis: VoiceoverAnalysis) {
  if (analysis.emotion.primary === 'sad' || analysis.emotion.primary === 'cinematic') return getSfx('heartbeat');
  if (analysis.speakingSpeed.label === 'fast' || analysis.speakingSpeed.label === 'very_fast') return getSfx('clock_ticking');
  return getSfx('riser');
}

function pickAmbientSfx(analysis: VoiceoverAnalysis, scriptText: string) {
  const text = scriptText.toLowerCase();

  if (text.includes('office') || text.includes('city') || text.includes('work')) return getSfx('urban_hum');
  if (text.includes('rain') || text.includes('forest') || text.includes('wind') || text.includes('nature')) return getSfx('nature_ambience');
  if (analysis.emotion.primary === 'cinematic' || analysis.emotion.primary === 'sad') return getSfx('cinematic_drone');
  return getSfx('room_tone');
}

function pickSemanticSfx(soundCue: string, action: VideoDirectorPlan['semanticSoundDesign'][number]['action']) {
  const cue = soundCue.toLowerCase();
  if (cue.includes('cash')) return getSfx('digital_beep');
  if (cue.includes('muffled') || action === 'muffle') return getSfx('bass_drop');
  if (cue.includes('error')) return getSfx('glitch');
  if (cue.includes('luxury')) return getSfx('cinematic_hit');
  if (cue.includes('office')) return getSfx('urban_hum');
  return getSfx('whoosh_to_hit');
}

function findKeywordTiming(analysis: VoiceoverAnalysis, keyword: string) {
  const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return analysis.words.find((word) => word.word.toLowerCase().replace(/[^a-z0-9]+/g, '').includes(normalizedKeyword));
}

function findSceneIdByTime(scriptPlan: VideoScriptPlan, start: number) {
  return scriptPlan.scenes.find((scene) => start >= scene.start && start <= scene.end)?.id || scriptPlan.scenes[0]?.id || 'scene_1';
}

function getSfxStrategy(
  analysis: VoiceoverAnalysis,
  directorTimeline: SceneMatchingTimeline,
): SoundEffectsPlan['strategy'] {
  const density =
    directorTimeline.strategy.cutDensity === 'high' || analysis.emotion.primary === 'energetic'
      ? 'high_energy'
      : analysis.emotion.primary === 'luxury' || analysis.emotion.primary === 'sad'
        ? 'minimal'
        : 'balanced';

  return {
    mood: analysis.emotion.primary,
    density,
    priorityOrder: ['whoosh', 'hit', 'riser', 'ambient', 'ui_foley', 'texture'],
  };
}

function sanitizeSfxEvents(events: SfxTimelineEvent[], duration: number, density: SoundEffectsPlan['strategy']['density']) {
  const maxEvents = density === 'high_energy' ? 42 : density === 'balanced' ? 28 : 18;

  return events
    .map((event) => ({
      ...event,
      start: clamp(round(event.start), 0, duration),
      end: clamp(round(Math.max(event.end, event.start + 0.05)), 0, duration),
    }))
    .filter((event) => event.end > event.start)
    .sort((a, b) => a.start - b.start)
    .slice(0, maxEvents);
}

function getSfx(id: string) {
  const sfx = SFX_LIBRARY.find((item) => item.id === id);

  if (!sfx) {
    throw new Error(`Unknown SFX id: ${id}`);
  }

  return sfx;
}

function asset(
  id: string,
  name: string,
  category: SfxCategory,
  tags: string[],
  assetPath: string,
  defaultVolume: number,
  defaultDuration: number,
  priority: SfxPriority,
): SfxAsset {
  return {
    id,
    name,
    category,
    tags,
    assetPath: findLocalSoundEffect(category, tags, assetPath),
    defaultVolume,
    defaultDuration,
    priority,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

