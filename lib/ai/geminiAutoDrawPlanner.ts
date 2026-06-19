// lib/ai/geminiAutoDrawPlanner.ts
// Gemini-powered Auto Draw scene planner for whiteboard-style reels

import {GoogleGenAI} from '@google/genai';

export type DrawScene = {
  start: number;
  end: number;
  title: string;
  subtitle?: string;
  points?: string[];
  highlight?: string;
  sceneNumber?: number;
  isSummary?: boolean;
};

type AutoDrawPlannerInput = {
  transcript: string;
  captions: Array<{start: number; end: number; text: string}>;
  overlayTimeline: Array<{start: number; end: number; text: string; body?: string; type?: string}>;
  topicTitle: string;
  durationSeconds: number;
};

type AutoDrawPlannerResult = {
  scenes: DrawScene[];
  source: 'gemini' | 'overlayTimeline_local' | 'captions_fallback';
};

const GEMINI_PROMPT = `You are the Auto Draw Scene Planner for Itnavideo.

Convert the transcript and caption timing into whiteboard-style drawing scenes for a 9:16 vertical explainer video.

RULES:
- Use the provided transcript as source of truth. Do not invent facts.
- Do not rewrite or summarize the script aggressively. Keep the speaker's meaning.
- Create 4-8 drawing scenes based on the content.
- Each scene must have: start (seconds), end (seconds), title (2-5 words, UPPERCASE), subtitle (the spoken text for that section).
- Add "points" (bullet array) when content has steps, tips, or lists.
- Add "highlight" when there's a warning, important fact, or key takeaway.
- Use sceneNumber (1, 2, 3...) for numbered content. Skip sceneNumber for intro/outro.
- Keep text short and readable for mobile.
- Hindi/Hinglish audio = Roman Hinglish text (no Devanagari).
- English audio = English text.
- Vary the scene structure: some with bullets, some with highlights, some with just title+subtitle.
- Timing must match the provided caption start/end times. Do not overlap scenes.

OUTPUT: Return ONLY valid JSON (no markdown fences, no explanation):
{"scenes":[{"start":0,"end":4,"title":"TITLE","subtitle":"spoken text","sceneNumber":1,"points":["point1","point2"],"highlight":"key fact"}]}`;

export async function generateAutoDrawScenes(input: AutoDrawPlannerInput): Promise<AutoDrawPlannerResult> {
  // Try Gemini first
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const scenes = await callGemini(input, geminiKey);
      if (scenes.length > 0) {
        console.log('[AUTO_DRAW] SCENES_SOURCE=gemini | count:', scenes.length);
        return {scenes, source: 'gemini'};
      }
    } catch (err) {
      console.error('[AUTO_DRAW] Gemini failed:', err instanceof Error ? err.message : String(err));
    }
  } else {
    console.warn('[AUTO_DRAW] GEMINI_KEY_MISSING_USING_LOCAL_SCENE_BUILDER');
  }

  // Fallback: build from overlayTimeline
  if (input.overlayTimeline.length > 0) {
    const scenes = buildScenesFromOverlayTimeline(input.overlayTimeline, input.topicTitle, input.durationSeconds);
    console.log('[AUTO_DRAW] SCENES_SOURCE=overlayTimeline_local | count:', scenes.length);
    return {scenes, source: 'overlayTimeline_local'};
  }

  // Last fallback: basic caption conversion
  const scenes = buildScenesFromCaptionsFallback(input.captions, input.topicTitle);
  console.log('[AUTO_DRAW] SCENES_SOURCE=captions_fallback | count:', scenes.length);
  return {scenes, source: 'captions_fallback'};
}

async function callGemini(input: AutoDrawPlannerInput, apiKey: string): Promise<DrawScene[]> {
  const ai = new GoogleGenAI({apiKey});

  const userContent = JSON.stringify({
    topicTitle: input.topicTitle,
    durationSeconds: input.durationSeconds,
    transcript: input.transcript.slice(0, 3000),
    captions: input.captions.slice(0, 30).map(c => ({start: c.start, end: c.end, text: c.text})),
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{role: 'user', parts: [{text: `${GEMINI_PROMPT}\n\nINPUT:\n${userContent}`}]}],
    config: {temperature: 0.4, maxOutputTokens: 2000},
  });

  const text = response.text || '';
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error('[AUTO_DRAW] GEMINI_PARSE_FAILED | raw:', cleaned.slice(0, 200));
    return [];
  }

  const scenesRaw = Array.isArray(parsed) ? parsed : (parsed as any)?.scenes;
  if (!Array.isArray(scenesRaw)) return [];

  return validateScenes(scenesRaw, input.durationSeconds);
}

function buildScenesFromOverlayTimeline(
  overlays: AutoDrawPlannerInput['overlayTimeline'],
  topicTitle: string,
  durationSeconds: number,
): DrawScene[] {
  if (!overlays.length) return [];

  return overlays.slice(0, 10).map((overlay, i) => {
    const text = overlay.text || '';
    const body = overlay.body || '';
    const type = overlay.type || 'point';

    // Smart title extraction
    let title = '';
    if (type === 'hook') title = text.split(' ').slice(0, 4).join(' ').toUpperCase();
    else if (type === 'cta') title = 'TAKE ACTION';
    else if (type === 'warning') title = 'WARNING';
    else if (type === 'stat') title = text.split(' ').slice(0, 3).join(' ').toUpperCase();
    else title = text.split(' ').slice(0, 4).join(' ').toUpperCase();

    // Build bullet points from body or comma-separated text
    let points: string[] | undefined;
    const bodyParts = body.split(/[,;.]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 60);
    if (bodyParts.length >= 2) points = bodyParts.slice(0, 4);
    else if (text.includes(',')) points = text.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);

    // Highlight for warnings/stats
    const highlight = type === 'warning' || type === 'stat'
      ? (body || text).slice(0, 80)
      : undefined;

    return {
      start: overlay.start,
      end: overlay.end,
      title: title || `POINT ${i + 1}`,
      subtitle: text.slice(0, 120),
      sceneNumber: i === 0 ? undefined : i,
      points,
      highlight,
      isSummary: type === 'cta',
    };
  });
}

function buildScenesFromCaptionsFallback(
  captions: Array<{start: number; end: number; text: string}>,
  topicTitle: string,
): DrawScene[] {
  if (!captions.length) {
    return [{start: 0, end: 10, title: topicTitle || 'EXPLAINER', sceneNumber: 1, subtitle: 'Upload audio to generate scenes'}];
  }

  // Group captions into ~5s scenes
  const scenes: DrawScene[] = [];
  let group: typeof captions = [];
  let groupStart = captions[0]?.start || 0;

  for (const cap of captions) {
    if (group.length > 0 && (cap.start - groupStart > 5 || group.length >= 3)) {
      scenes.push({
        start: groupStart,
        end: group[group.length - 1].end,
        title: group[0].text.split(' ').slice(0, 4).join(' ').toUpperCase(),
        subtitle: group.map(c => c.text).join(' ').slice(0, 120),
        sceneNumber: scenes.length + 1,
        points: group.length > 1 ? group.map(c => c.text.slice(0, 50)) : undefined,
      });
      group = [];
      groupStart = cap.start;
    }
    group.push(cap);
  }
  if (group.length) {
    scenes.push({
      start: groupStart,
      end: group[group.length - 1].end,
      title: group[0].text.split(' ').slice(0, 4).join(' ').toUpperCase(),
      subtitle: group.map(c => c.text).join(' ').slice(0, 120),
      sceneNumber: scenes.length + 1,
    });
  }

  return scenes.slice(0, 10);
}

function validateScenes(raw: unknown[], durationSeconds: number): DrawScene[] {
  return raw
    .map((item: any, i) => {
      const start = Number(item?.start ?? 0);
      const end = Number(item?.end ?? start + 4);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
      if (start > durationSeconds || end > durationSeconds + 1) return null;
      const title = String(item?.title || `POINT ${i + 1}`).slice(0, 50);
      if (!title) return null;
      return {
        start: Math.max(0, start),
        end: Math.min(durationSeconds, end),
        title,
        subtitle: item?.subtitle ? String(item.subtitle).slice(0, 150) : undefined,
        sceneNumber: item?.sceneNumber != null ? Number(item.sceneNumber) : (i > 0 ? i : undefined),
        points: Array.isArray(item?.points) ? item.points.map((p: any) => String(p).slice(0, 60)).slice(0, 5) : undefined,
        highlight: item?.highlight ? String(item.highlight).slice(0, 100) : undefined,
        isSummary: item?.isSummary === true,
      } satisfies DrawScene;
    })
    .filter((scene): scene is DrawScene => scene !== null);
}
