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

export type AutoDrawNoteElementType =
  | 'heading'
  | 'bullet'
  | 'label'
  | 'highlight'
  | 'sketch'
  | 'arrow'
  | 'circle'
  | 'underline';

export type AutoDrawNoteElement = {
  id: string;
  type: AutoDrawNoteElementType;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  start: number;
  end: number;
  revealStart: number;
  revealEnd: number;
  pageIndex: number;
  sourceSceneIndex: number;
  sourceCaptionIndex?: number;
  accent?: string;
  variant?: string;
};

export type AutoDrawNotePage = {
  id: string;
  index: number;
  title: string;
  start: number;
  end: number;
  elements: AutoDrawNoteElement[];
};

export type AutoDrawRevealItem = {
  elementId: string;
  pageIndex: number;
  start: number;
  end: number;
  effect: 'mask-wipe' | 'fade-slide' | 'stroke-reveal' | 'highlight-sweep' | 'circle-burst' | 'arrow-draw' | 'pop';
  sourceSceneIndex: number;
  sourceCaptionIndex?: number;
  transcriptText?: string;
};

export type AutoDrawNotesPlan = {
  pages: AutoDrawNotePage[];
  elements: AutoDrawNoteElement[];
  revealTimeline: AutoDrawRevealItem[];
  transcriptSegmentMapping: Array<{
    segmentIndex: number;
    start: number;
    end: number;
    text: string;
    elementIds: string[];
    pageIndex: number;
  }>;
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
  notesPlan: AutoDrawNotesPlan;
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
        const notesPlan = buildPreparedNotesPlan(scenes, input);
        logAutoDrawPreparedPlan(notesPlan, input.captions);
        console.log('[AUTO_DRAW] SCENES_SOURCE=gemini | count:', scenes.length);
        return {scenes, notesPlan, source: 'gemini'};
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
    const notesPlan = buildPreparedNotesPlan(scenes, input);
    logAutoDrawPreparedPlan(notesPlan, input.captions);
    console.log('[AUTO_DRAW] SCENES_SOURCE=overlayTimeline_local | count:', scenes.length);
    return {scenes, notesPlan, source: 'overlayTimeline_local'};
  }

  // Last fallback: basic caption conversion
  const scenes = buildScenesFromCaptionsFallback(input.captions, input.topicTitle);
  const notesPlan = buildPreparedNotesPlan(scenes, input);
  logAutoDrawPreparedPlan(notesPlan, input.captions);
  console.log('[AUTO_DRAW] SCENES_SOURCE=captions_fallback | count:', scenes.length);
  return {scenes, notesPlan, source: 'captions_fallback'};
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

  const scenes: DrawScene[] = [];

  const shouldAddIntro = shouldAddTopicIntro(topicTitle, overlays[0]?.text || '', overlays[0]?.start || 0);
  if (shouldAddIntro) {
    scenes.push({
      start: 0,
      end: Math.min(3, overlays[0]?.start || 3),
      title: cleanAutoDrawText(topicTitle || 'EXPLAINER', 34),
      subtitle: undefined,
      sceneNumber: undefined,
      isSummary: false,
    });
  }

  overlays.slice(0, 9).forEach((overlay, i) => {
    const text = overlay.text || '';
    const body = overlay.body || '';
    const type = overlay.type || 'point';

    let title = '';
    if (type === 'hook') title = text.split(' ').slice(0, 4).join(' ').toUpperCase();
    else if (type === 'cta') title = 'TAKE ACTION';
    else if (type === 'warning') title = 'WARNING';
    else if (type === 'stat') title = text.split(' ').slice(0, 3).join(' ').toUpperCase();
    else title = text.split(' ').slice(0, 4).join(' ').toUpperCase();

    let points: string[] | undefined;
    const bodyParts = body.split(/[,;.]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 60);
    if (bodyParts.length >= 2) points = bodyParts.slice(0, 4);
    else if (text.includes(',')) points = text.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4);

    const highlight = type === 'warning' || type === 'stat'
      ? (body || text).slice(0, 80)
      : undefined;

    scenes.push({
      start: overlay.start,
      end: overlay.end,
      title: cleanAutoDrawText(title || `POINT ${i + 1}`, 34),
      subtitle: cleanAutoDrawText(text, 120),
      sceneNumber: scenes.length + 1,
      points: points?.map((point) => cleanAutoDrawText(point, 58)),
      highlight: highlight ? cleanAutoDrawText(highlight, 80) : undefined,
      isSummary: type === 'cta',
    });
  });

  // Ensure last scene covers full duration
  if (scenes.length > 0) {
    scenes[scenes.length - 1].end = durationSeconds;
  }

  return scenes;
}

function buildScenesFromCaptionsFallback(
  captions: Array<{start: number; end: number; text: string}>,
  topicTitle: string,
): DrawScene[] {
  if (!captions.length) {
    return [{start: 0, end: 10, title: topicTitle || 'EXPLAINER', sceneNumber: undefined, subtitle: 'Upload audio to generate scenes'}];
  }

  const totalDuration = captions[captions.length - 1]?.end || 30;
  const scenes: DrawScene[] = [];

  const shouldAddIntro = shouldAddTopicIntro(topicTitle, captions[0]?.text || '', captions[0]?.start || 0);
  if (shouldAddIntro) {
    scenes.push({
      start: 0,
      end: Math.min(3, captions[0]?.start || 3),
      title: cleanAutoDrawText(topicTitle || 'EXPLAINER', 34),
      subtitle: undefined,
      sceneNumber: undefined,
      isSummary: false,
    });
  }

  // Group captions into ~5-7s scenes
  let group: typeof captions = [];
  let groupStart = captions[0]?.start || 0;

  for (const cap of captions) {
    if (group.length > 0 && (cap.start - groupStart > 6 || group.length >= 4)) {
      scenes.push({
        start: groupStart,
        end: group[group.length - 1].end,
        title: cleanAutoDrawText(group[0].text.split(' ').slice(0, 4).join(' ').toUpperCase(), 34),
        subtitle: cleanAutoDrawText(group.map(c => c.text).join(' '), 120),
        sceneNumber: scenes.length,
        points: group.length > 1 ? group.slice(0, 4).map(c => cleanAutoDrawText(c.text, 50)) : undefined,
      });
      group = [];
      groupStart = cap.start;
    }
    group.push(cap);
  }

  // Last group — always extends to totalDuration
  if (group.length) {
    scenes.push({
      start: groupStart,
      end: totalDuration,
      title: cleanAutoDrawText(group[0].text.split(' ').slice(0, 4).join(' ').toUpperCase(), 34),
      subtitle: cleanAutoDrawText(group.map(c => c.text).join(' '), 120),
      sceneNumber: scenes.length,
      points: group.length > 1 ? group.slice(0, 4).map(c => cleanAutoDrawText(c.text, 50)) : undefined,
      isSummary: true,
    });
  }

  return scenes.slice(0, 12);
}

function validateScenes(raw: unknown[], durationSeconds: number): DrawScene[] {
  const scenes = raw
    .map((item: any, i): DrawScene | null => {
      const start = Number(item?.start ?? 0);
      const end = Number(item?.end ?? start + 4);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
      const title = cleanAutoDrawText(String(item?.title || `POINT ${i + 1}`), 34);
      if (!title) return null;
      return {
        start: Math.max(0, start),
        end: Math.min(durationSeconds + 1, end),
        title,
        subtitle: item?.subtitle ? cleanAutoDrawText(String(item.subtitle), 120) : undefined,
        sceneNumber: item?.sceneNumber != null ? Number(item.sceneNumber) : (i > 0 ? i : undefined),
        points: Array.isArray(item?.points) ? item.points.map((p: any) => cleanAutoDrawText(String(p), 58)).slice(0, 3) : undefined,
        highlight: item?.highlight ? cleanAutoDrawText(String(item.highlight), 82) : undefined,
        isSummary: item?.isSummary === true,
      } satisfies DrawScene;
    })
    .filter((scene): scene is DrawScene => scene !== null);

  // Always extend the last scene to cover full duration (prevents freeze)
  if (scenes.length > 0) {
    scenes[scenes.length - 1].end = durationSeconds;
  }

  return scenes;
}

function buildPreparedNotesPlan(scenes: DrawScene[], input: AutoDrawPlannerInput): AutoDrawNotesPlan {
  const cleanScenes = scenes.length > 0
    ? scenes
    : buildScenesFromCaptionsFallback(input.captions, input.topicTitle);
  const contentScenes = cleanScenes.filter((scene) => scene.end > scene.start);
  const pageCount = Math.max(2, Math.min(3, input.durationSeconds > 38 || contentScenes.length > 6 ? 3 : 2));
  const pages: AutoDrawNotePage[] = Array.from({length: pageCount}, (_, index) => ({
    id: `notes-page-${index + 1}`,
    index,
    title: index === 0 ? (input.topicTitle || cleanScenes[0]?.title || 'Explainer') : `Page ${index + 1}`,
    start: index === 0 ? 0 : input.durationSeconds,
    end: input.durationSeconds,
    elements: [],
  }));
  const elements: AutoDrawNoteElement[] = [];
  const revealTimeline: AutoDrawRevealItem[] = [];
  const segmentBuckets = new Map<number, string[]>();

  const scenesPerPage = Math.ceil(contentScenes.length / pageCount) || 1;
  const accents = ['#2563EB', '#F59E0B', '#0F766E', '#DC2626', '#7C3AED'];

  contentScenes.forEach((scene, sceneIndex) => {
    const pageIndex = Math.min(pageCount - 1, Math.floor(sceneIndex / scenesPerPage));
    const page = pages[pageIndex];
    page.start = Math.min(page.start, scene.start);
    page.end = Math.max(page.end, scene.end);

    const localIndex = sceneIndex - pageIndex * scenesPerPage;
    const blockY = 142 + localIndex * 472;
    const accent = accents[sceneIndex % accents.length];
    const captionIndex = findNearestCaptionIndex(input.captions, scene);
    const matchedCaption = typeof captionIndex === 'number' ? input.captions[captionIndex] : undefined;
    const transcriptText = matchedCaption?.text || scene.subtitle || scene.title;

    const headingId = `p${pageIndex + 1}-s${sceneIndex + 1}-heading`;
    addElement({
      id: headingId,
      type: 'heading',
      text: cleanAutoDrawText(scene.title, 34),
      x: 78,
      y: blockY,
      width: 780,
      height: 118,
      start: scene.start,
      end: scene.end,
      revealStart: scene.start,
      revealEnd: Math.min(scene.end, scene.start + 0.75),
      pageIndex,
      sourceSceneIndex: sceneIndex,
      sourceCaptionIndex: captionIndex,
      accent,
    }, 'mask-wipe', transcriptText);

    const underlineId = `p${pageIndex + 1}-s${sceneIndex + 1}-underline`;
    addElement({
      id: underlineId,
      type: 'underline',
      x: 78,
      y: blockY + 110,
      width: 520,
      height: 22,
      start: scene.start,
      end: scene.end,
      revealStart: scene.start + 0.18,
      revealEnd: Math.min(scene.end, scene.start + 0.95),
      pageIndex,
      sourceSceneIndex: sceneIndex,
      sourceCaptionIndex: captionIndex,
      accent,
    }, 'stroke-reveal', transcriptText);

    const sketchId = `p${pageIndex + 1}-s${sceneIndex + 1}-sketch`;
    addElement({
      id: sketchId,
      type: 'sketch',
      x: 760,
      y: blockY + 4,
      width: 172,
      height: 142,
      start: scene.start,
      end: scene.end,
      revealStart: scene.start + 0.35,
      revealEnd: Math.min(scene.end, scene.start + 1.1),
      pageIndex,
      sourceSceneIndex: sceneIndex,
      sourceCaptionIndex: captionIndex,
      accent,
      variant: scene.isSummary ? 'check' : scene.highlight ? 'alert' : String(sceneIndex % 3),
    }, 'stroke-reveal', transcriptText);

    const arrowId = `p${pageIndex + 1}-s${sceneIndex + 1}-arrow`;
    addElement({
      id: arrowId,
      type: 'arrow',
      x: 760,
      y: blockY + 160,
      width: 160,
      height: 90,
      start: scene.start,
      end: scene.end,
      revealStart: scene.start + 1.15,
      revealEnd: Math.min(scene.end, scene.start + 1.8),
      pageIndex,
      sourceSceneIndex: sceneIndex,
      sourceCaptionIndex: captionIndex,
      accent,
    }, 'arrow-draw', transcriptText);

    const pointTexts = (scene.points && scene.points.length > 0)
      ? scene.points.slice(0, 3)
      : scene.subtitle
        ? splitIntoReadableBullets(scene.subtitle).slice(0, 2)
        : [];

    pointTexts.forEach((point, pointIndex) => {
      const revealStart = scene.start + 0.85 + pointIndex * Math.max(0.45, (scene.end - scene.start - 1.4) / Math.max(2, pointTexts.length + 1));
      const bulletId = `p${pageIndex + 1}-s${sceneIndex + 1}-bullet-${pointIndex + 1}`;
      addElement({
        id: bulletId,
        type: 'bullet',
        text: cleanAutoDrawText(point, 58),
        x: 112,
        y: blockY + 158 + pointIndex * 112,
        width: 610,
        height: 104,
        start: scene.start,
        end: scene.end,
        revealStart,
        revealEnd: Math.min(scene.end, revealStart + 0.6),
        pageIndex,
        sourceSceneIndex: sceneIndex,
        sourceCaptionIndex: captionIndex,
        accent,
      }, 'fade-slide', transcriptText);
    });

    if (scene.highlight) {
      const highlightStart = Math.max(scene.start + 1.2, scene.end - 1.8);
      const highlightId = `p${pageIndex + 1}-s${sceneIndex + 1}-highlight`;
      addElement({
        id: highlightId,
        type: 'highlight',
        text: cleanAutoDrawText(scene.highlight, 82),
        x: 112,
        y: blockY + 158 + Math.max(1, pointTexts.length) * 112,
        width: 760,
        height: 86,
        start: scene.start,
        end: scene.end,
        revealStart: highlightStart,
        revealEnd: Math.min(scene.end, highlightStart + 0.7),
        pageIndex,
        sourceSceneIndex: sceneIndex,
        sourceCaptionIndex: captionIndex,
        accent,
      }, 'highlight-sweep', transcriptText);
    }

    if (scene.highlight || scene.isSummary) {
      const circleStart = Math.max(scene.start + 1.4, scene.end - 1.2);
      const circleId = `p${pageIndex + 1}-s${sceneIndex + 1}-circle`;
      addElement({
        id: circleId,
        type: 'circle',
        x: 94,
        y: blockY + 122,
        width: 165,
        height: 122,
        start: scene.start,
        end: scene.end,
        revealStart: circleStart,
        revealEnd: Math.min(scene.end, circleStart + 0.75),
        pageIndex,
        sourceSceneIndex: sceneIndex,
        sourceCaptionIndex: captionIndex,
        accent,
      }, 'circle-burst', transcriptText);
    }
  });

  pages.forEach((page, index) => {
    if (page.start === input.durationSeconds) page.start = index === 0 ? 0 : pages[index - 1]?.end || 0;
    if (page.end <= page.start) page.end = Math.min(input.durationSeconds, page.start + input.durationSeconds / pageCount);
    if (index === pages.length - 1) page.end = input.durationSeconds;
  });

  const transcriptSegmentMapping = input.captions.map((caption, segmentIndex) => ({
    segmentIndex,
    start: caption.start,
    end: caption.end,
    text: caption.text,
    elementIds: segmentBuckets.get(segmentIndex) || [],
    pageIndex: elements.find((element) => element.sourceCaptionIndex === segmentIndex)?.pageIndex ?? 0,
  }));

  return {pages, elements, revealTimeline, transcriptSegmentMapping};

  function addElement(element: AutoDrawNoteElement, effect: AutoDrawRevealItem['effect'], transcriptText: string) {
    elements.push(element);
    pages[element.pageIndex]?.elements.push(element);
    revealTimeline.push({
      elementId: element.id,
      pageIndex: element.pageIndex,
      start: element.revealStart,
      end: element.revealEnd,
      effect,
      sourceSceneIndex: element.sourceSceneIndex,
      sourceCaptionIndex: element.sourceCaptionIndex,
      transcriptText,
    });
    if (typeof element.sourceCaptionIndex === 'number' && element.sourceCaptionIndex >= 0) {
      const existing = segmentBuckets.get(element.sourceCaptionIndex) || [];
      existing.push(element.id);
      segmentBuckets.set(element.sourceCaptionIndex, existing);
    }
  }
}

function splitIntoReadableBullets(text: string): string[] {
  const pieces = text
    .split(/[,;.]/)
    .map((piece) => piece.trim())
    .filter((piece) => piece.length >= 4);

  if (pieces.length >= 2) return pieces.map((piece) => cleanAutoDrawText(piece, 58));
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 6) {
    chunks.push(cleanAutoDrawText(words.slice(i, i + 6).join(' '), 58));
  }
  return chunks.filter(Boolean);
}

function shouldAddTopicIntro(topicTitle: string, firstText: string, firstStart: number): boolean {
  const topic = normalizeComparableText(topicTitle);
  if (!topic) return false;
  if (firstStart <= 0.4) return false;
  const first = normalizeComparableText(firstText);
  return !first.includes(topic) && !topic.includes(first);
}

function cleanAutoDrawText(text: string, maxLength: number): string {
  const cleaned = text
    .replace(/\bisamen\b/gi, 'is mein')
    .replace(/\bunamen\b/gi, 'un mein')
    .replace(/\bnikalatee\b/gi, 'nikalti')
    .replace(/\bhota+\b/gi, 'hota')
    .replace(/\bkaam hota hai\b/gi, 'kaam hota hai')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength).trimEnd() : cleaned;
}

function normalizeComparableText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function findNearestCaptionIndex(captions: Array<{start: number; end: number; text: string}>, scene: DrawScene): number | undefined {
  if (!captions.length) return undefined;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  captions.forEach((caption, index) => {
    const overlap = Math.max(0, Math.min(scene.end, caption.end) - Math.max(scene.start, caption.start));
    const distance = overlap > 0 ? -overlap : Math.abs(caption.start - scene.start);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function logAutoDrawPreparedPlan(notesPlan: AutoDrawNotesPlan, captions: Array<{start: number; end: number; text: string}>) {
  console.log('[AUTO_DRAW] PREPARED_NOTES_PLAN', {
    totalPagesGenerated: notesPlan.pages.length,
    totalElementsGenerated: notesPlan.elements.length,
    hiddenElementsCount: notesPlan.elements.filter((element) => element.revealStart > 0).length,
    revealTimelineCount: notesPlan.revealTimeline.length,
    transcriptSegmentMapping: notesPlan.transcriptSegmentMapping.map((mapping) => ({
      segmentIndex: mapping.segmentIndex,
      time: `${mapping.start.toFixed(2)}-${mapping.end.toFixed(2)}`,
      elementCount: mapping.elementIds.length,
      sample: mapping.text.slice(0, 48),
    })),
    captionSegments: captions.length,
  });
}
