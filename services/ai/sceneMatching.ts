import type { VoiceoverAnalysis } from './voiceAnalysis';
import type { VideoScriptPlan } from './scriptPlanner';
import type { SubtitlePlan } from './subtitleGenerator';
import type { VideoDirectorPlan } from './videoDirector';
import { generateGeminiJson, hasGeminiApiKey } from './gemini';
import { MULTILINGUAL_VIDEO_RULE } from './multilingualRules';

type TimelineEventType = 'zoom' | 'transition' | 'beat_cut' | 'text' | 'motion';

type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  sceneId: string;
  start: number;
  end: number;
  trigger: 'scene_start' | 'sentence_start' | 'keyword' | 'pause' | 'beat' | 'cta' | 'emotion_shift';
  intensity: 'low' | 'medium' | 'high';
  params: Record<string, unknown>;
};

export type SceneMatchingTimeline = {
  version: '1.0';
  duration: number;
  fps: 30;
  aspectRatio: '9:16';
  strategy: {
    pacing: 'slow' | 'medium' | 'fast';
    emotion: string;
    cutDensity: 'low' | 'medium' | 'high';
    motionDensity: 'low' | 'medium' | 'high';
  };
  events: TimelineEvent[];
  tracks: {
    camera: TimelineEvent[];
    transitions: TimelineEvent[];
    cuts: TimelineEvent[];
    text: TimelineEvent[];
    motion: TimelineEvent[];
  };
};

export async function generateSceneMatchingTimeline(
  analysis: VoiceoverAnalysis,
  scriptPlan: VideoScriptPlan,
  subtitlePlan: SubtitlePlan,
  directorPlan?: VideoDirectorPlan,
): Promise<SceneMatchingTimeline> {
  const fallback = createFallbackTimeline(analysis, scriptPlan, subtitlePlan, directorPlan);
  const aiTimeline = await requestAISceneMatching(analysis, scriptPlan, subtitlePlan, fallback, directorPlan);

  return aiTimeline ? normalizeAITimeline(aiTimeline, fallback) : fallback;
}

async function requestAISceneMatching(
  analysis: VoiceoverAnalysis,
  scriptPlan: VideoScriptPlan,
  subtitlePlan: SubtitlePlan,
  fallback: SceneMatchingTimeline,
  directorPlan?: VideoDirectorPlan,
) {
  const requestPayload = {
    task: 'Refine this renderer timeline. Preserve schema. Improve event placement based on scenes, pauses, keywords, subtitles, and emotion.',
    multilingualRule: MULTILINGUAL_VIDEO_RULE,
    requiredEventTypes: ['zoom', 'transition', 'beat_cut', 'text', 'motion'],
    directorPlan,
    voice: {
      emotion: analysis.emotion,
      language: analysis.language,
      speed: analysis.speakingSpeed,
      pauses: analysis.pauses.items.slice(0, 12),
      keywords: analysis.keywords,
    },
    scenes: scriptPlan.scenes.map((scene) => ({
      id: scene.id,
      role: scene.role,
      start: scene.start,
      end: scene.end,
      scriptText: scene.scriptText,
      pacing: scene.pacing,
      transition: scene.transition,
      animationNotes: scene.animationNotes,
    })),
    subtitles: subtitlePlan.cues.map((cue) => ({
      id: cue.id,
      sceneId: cue.sceneId,
      start: cue.start,
      end: cue.end,
      text: cue.text,
      highlightedWords: cue.words.filter((word) => word.highlight).map((word) => word.text),
      animation: cue.animation,
    })),
    fallbackTimeline: fallback,
  };

  if (hasGeminiApiKey()) {
    const geminiTimeline = await generateGeminiJson(
      `You are a short-form video director. ${MULTILINGUAL_VIDEO_RULE} Decide exact timeline events for zooms, transitions, beat cuts, text entrances, and motion. Keep all event times inside the video duration.`,
      requestPayload,
      { temperature: 0.25 },
    );

    if (geminiTimeline) return geminiTimeline;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
      temperature: 0.25,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            `You are a short-form video director. ${MULTILINGUAL_VIDEO_RULE} Return only valid JSON. Decide exact timeline events for zooms, transitions, beat cuts, text entrances, and motion. Keep all event times inside the video duration.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            ...requestPayload,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    console.warn(`OpenAI scene matching failed: ${response.status}`);
    return null;
  }

  const completion = await response.json();
  return safeJsonParse(completion?.choices?.[0]?.message?.content || '{}');
}

function createFallbackTimeline(
  analysis: VoiceoverAnalysis,
  scriptPlan: VideoScriptPlan,
  subtitlePlan: SubtitlePlan,
  directorPlan?: VideoDirectorPlan,
): SceneMatchingTimeline {
  const strategy = getStrategy(analysis, directorPlan);
  const events: TimelineEvent[] = [];

  scriptPlan.scenes.forEach((scene, index) => {
    events.push({
      id: `transition_${index + 1}`,
      type: 'transition',
      sceneId: scene.id,
      start: scene.start,
      end: round(Math.min(scene.start + 0.35, scene.end)),
      trigger: index === 0 ? 'scene_start' : 'emotion_shift',
      intensity: scene.role === 'hook' ? 'high' : 'medium',
      params: {
        style: index === 0 ? 'cold_open' : scene.transition,
        fromSceneId: scriptPlan.scenes[index - 1]?.id || null,
        toSceneId: scene.id,
      },
    });

    events.push({
      id: `zoom_${index + 1}`,
      type: 'zoom',
      sceneId: scene.id,
      start: scene.start,
      end: round(Math.min(scene.start + getZoomDuration(scene.duration, directorPlan), scene.end)),
      trigger: scene.role === 'hook' ? 'scene_start' : 'sentence_start',
      intensity: scene.role === 'hook' || analysis.emotion.primary === 'energetic' ? 'high' : 'medium',
      params: {
        fromScale: 1,
        toScale: scene.role === 'hook' ? 1.12 : 1.06,
        easing: 'easeOutCubic',
        target: 'primary_visual',
      },
    });

    scene.animationNotes.forEach((note, noteIndex) => {
      const start = round(scene.start + Math.min(scene.duration * 0.35 + noteIndex * 0.4, Math.max(scene.duration - 0.5, 0)));
      events.push({
        id: `motion_${index + 1}_${noteIndex + 1}`,
        type: 'motion',
        sceneId: scene.id,
        start,
        end: round(Math.min(start + 0.8, scene.end)),
        trigger: 'sentence_start',
        intensity: strategy.motionDensity === 'high' ? 'high' : 'medium',
        params: {
          target: 'overlay_or_broll',
          animation: note,
          easing: 'easeOutBack',
        },
      });
    });
  });

  subtitlePlan.cues.forEach((cue, index) => {
    const sceneId = cue.sceneId || findSceneId(scriptPlan, cue.start, cue.end);

    events.push({
      id: `text_${index + 1}`,
      type: 'text',
      sceneId,
      start: cue.start,
      end: cue.end,
      trigger: cue.words.some((word) => word.highlight) ? 'keyword' : 'sentence_start',
      intensity: cue.words.some((word) => word.highlight) ? 'high' : 'medium',
      params: {
        subtitleCueId: cue.id,
        entrance: cue.animation,
        highlightWords: cue.words.filter((word) => word.highlight).map((word) => word.text),
        karaoke: subtitlePlan.mode === 'karaoke',
      },
    });

    if (shouldAddBeatCut(index, cue.start, strategy.cutDensity)) {
      events.push({
        id: `beat_cut_${index + 1}`,
        type: 'beat_cut',
        sceneId,
        start: cue.start,
        end: round(cue.start + 0.08),
        trigger: cue.words.some((word) => word.highlight) ? 'keyword' : 'beat',
        intensity: strategy.cutDensity === 'high' ? 'high' : 'medium',
        params: {
          cutTo: 'next_broll_or_angle',
          syncTo: 'caption_start',
          addSfx: strategy.cutDensity !== 'low',
        },
      });
    }
  });

  analysis.pauses.items.slice(0, 8).forEach((pause, index) => {
    const sceneId = findSceneId(scriptPlan, pause.start, pause.end);

    events.push({
      id: `pause_motion_${index + 1}`,
      type: 'motion',
      sceneId,
      start: pause.start,
      end: pause.end,
      trigger: 'pause',
      intensity: pause.duration > 0.9 ? 'high' : 'medium',
      params: {
        target: 'primary_visual',
        animation: pause.duration > 0.9 ? 'hold_and_slow_push' : 'micro_push',
        reason: `Pause after "${pause.afterWord}"`,
      },
    });
  });

  return organizeTimeline({
    version: '1.0',
    duration: scriptPlan.totalDuration,
    fps: 30,
    aspectRatio: '9:16',
    strategy,
    events: sanitizeEvents(events, scriptPlan.totalDuration),
    tracks: {
      camera: [],
      transitions: [],
      cuts: [],
      text: [],
      motion: [],
    },
  });
}

function normalizeAITimeline(aiTimeline: Record<string, unknown>, fallback: SceneMatchingTimeline): SceneMatchingTimeline {
  const rawEvents = Array.isArray(aiTimeline.events) ? aiTimeline.events : [];

  if (!rawEvents.length) {
    return fallback;
  }

  const events = rawEvents
    .map((event, index) => normalizeEvent(event as Record<string, unknown>, index, fallback))
    .filter(Boolean) as TimelineEvent[];

  return organizeTimeline({
    ...fallback,
    events: sanitizeEvents(events, fallback.duration),
  });
}

function normalizeEvent(event: Record<string, unknown>, index: number, fallback: SceneMatchingTimeline): TimelineEvent | null {
  const type = normalizeEventType(event.type);

  if (!type) {
    return null;
  }

  const start = normalizeTime(event.start, 0);
  const end = normalizeTime(event.end, start + defaultEventDuration(type));
  const sceneId = asString(event.sceneId) || findSceneIdByTime(fallback, start);

  return {
    id: asString(event.id) || `${type}_${index + 1}`,
    type,
    sceneId,
    start,
    end,
    trigger: normalizeTrigger(event.trigger),
    intensity: normalizeIntensity(event.intensity),
    params: typeof event.params === 'object' && event.params !== null ? event.params as Record<string, unknown> : {},
  };
}

function organizeTimeline(timeline: SceneMatchingTimeline): SceneMatchingTimeline {
  const events = [...timeline.events].sort((a, b) => a.start - b.start || a.end - b.end);

  return {
    ...timeline,
    events,
    tracks: {
      camera: events.filter((event) => event.type === 'zoom'),
      transitions: events.filter((event) => event.type === 'transition'),
      cuts: events.filter((event) => event.type === 'beat_cut'),
      text: events.filter((event) => event.type === 'text'),
      motion: events.filter((event) => event.type === 'motion'),
    },
  };
}

function sanitizeEvents(events: TimelineEvent[], duration: number) {
  return events
    .map((event) => ({
      ...event,
      start: clamp(round(event.start), 0, duration),
      end: clamp(round(Math.max(event.end, event.start + 0.05)), 0, duration),
    }))
    .filter((event) => event.end > event.start);
}

function getStrategy(analysis: VoiceoverAnalysis, directorPlan?: VideoDirectorPlan): SceneMatchingTimeline['strategy'] {
  if (directorPlan) {
    return {
      pacing: directorPlan.visualPacing.voiceEnergy === 'high' ? 'fast' : directorPlan.visualPacing.voiceEnergy === 'low' ? 'slow' : 'medium',
      emotion: analysis.emotion.primary,
      cutDensity: directorPlan.selectedStyle === 'fast_cuts' || directorPlan.selectedStyle === 'meme_style' || directorPlan.selectedStyle === 'reels_pacing' ? 'high' : 'medium',
      motionDensity: directorPlan.selectedStyle === 'slow_cinematic' || directorPlan.selectedStyle === 'luxury_edit' ? 'low' : 'high',
    };
  }

  const isFast = analysis.speakingSpeed.label === 'fast' || analysis.speakingSpeed.label === 'very_fast';
  const isHighEnergy = analysis.emotion.primary === 'energetic' || analysis.emotion.primary === 'motivation';

  return {
    pacing: isFast || isHighEnergy ? 'fast' : analysis.speakingSpeed.label === 'slow' ? 'slow' : 'medium',
    emotion: analysis.emotion.primary,
    cutDensity: isFast || isHighEnergy ? 'high' : analysis.emotion.primary === 'cinematic' ? 'medium' : 'low',
    motionDensity: isHighEnergy ? 'high' : analysis.emotion.primary === 'sad' || analysis.emotion.primary === 'luxury' ? 'low' : 'medium',
  };
}

function getZoomDuration(sceneDuration: number, directorPlan?: VideoDirectorPlan) {
  if (!directorPlan) {
    return Math.max(1.2, sceneDuration * 0.55);
  }

  return Math.min(sceneDuration, directorPlan.selectedStyle === 'slow_cinematic' || directorPlan.selectedStyle === 'luxury_edit' ? 3.5 : 1.2);
}

function shouldAddBeatCut(index: number, start: number, cutDensity: SceneMatchingTimeline['strategy']['cutDensity']) {
  if (start < 0.1) return true;
  if (cutDensity === 'high') return index % 1 === 0;
  if (cutDensity === 'medium') return index % 2 === 0;
  return index % 3 === 0;
}

function findSceneId(scriptPlan: VideoScriptPlan, start: number, end: number) {
  return scriptPlan.scenes.find((scene) => start < scene.end && end > scene.start)?.id || scriptPlan.scenes[0]?.id || 'scene_1';
}

function findSceneIdByTime(timeline: SceneMatchingTimeline, start: number) {
  const transitionEvent = timeline.events.find((event) => event.type === 'transition' && start >= event.start);
  return transitionEvent?.sceneId || 'scene_1';
}

function normalizeEventType(value: unknown): TimelineEventType | null {
  const type = asString(value) as TimelineEventType;
  return ['zoom', 'transition', 'beat_cut', 'text', 'motion'].includes(type) ? type : null;
}

function normalizeTrigger(value: unknown): TimelineEvent['trigger'] {
  const trigger = asString(value) as TimelineEvent['trigger'];
  return ['scene_start', 'sentence_start', 'keyword', 'pause', 'beat', 'cta', 'emotion_shift'].includes(trigger) ? trigger : 'beat';
}

function normalizeIntensity(value: unknown): TimelineEvent['intensity'] {
  const intensity = asString(value) as TimelineEvent['intensity'];
  return ['low', 'medium', 'high'].includes(intensity) ? intensity : 'medium';
}

function defaultEventDuration(type: TimelineEventType) {
  if (type === 'beat_cut') return 0.08;
  if (type === 'transition') return 0.35;
  if (type === 'text') return 1.2;
  return 0.8;
}

function normalizeTime(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? round(value) : fallback;
}

function safeJsonParse(value: string): Record<string, unknown> | null {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

