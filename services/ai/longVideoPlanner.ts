/**
 * Long Video Scene Planner — Gemini-powered
 *
 * Takes a transcript (from Groq) and produces a structured scene plan
 * that the Remotion composition renders as a complete produced video.
 *
 * Scene types:
 * - title: Full-screen title card (intro, section headers)
 * - narration: Speaker with captions (main content)
 * - typography: Key phrase/keyword emphasis moment
 * - image: B-roll image reveal (from assets or user screenshots)
 * - callout: Text callout / bullet points on screen
 * - transition: Brief visual transition between sections
 *
 * Fallback: If Gemini fails, a deterministic local planner creates a basic plan.
 */

export type LongVideoSceneType = 'title' | 'narration' | 'typography' | 'image' | 'callout' | 'transition';

export type LongVideoScene = {
  type: LongVideoSceneType;
  startSeconds: number;
  endSeconds: number;
  /** Title text for title/callout scenes */
  text?: string;
  /** Typography keyword for typography scenes */
  keyword?: string;
  /** Image URL/path for image scenes */
  imageSrc?: string;
  /** Bullet points for callout scenes */
  bullets?: string[];
  /** Motion style hint */
  motion?: 'fade' | 'slide-left' | 'slide-right' | 'zoom-in' | 'scale-up' | 'none';
  /** SFX cue at scene start */
  sfx?: 'whoosh' | 'pop' | 'click' | 'none';
};

export type LongVideoPlan = {
  title: string;
  scenes: LongVideoScene[];
  durationSeconds: number;
  musicMood: 'corporate' | 'calm' | 'upbeat' | 'cinematic' | 'inspiring';
  source: 'gemini' | 'deterministic';
};

export type LongVideoPlanInput = {
  transcript: string;
  segments: Array<{start: number; end: number; text: string}>;
  durationSeconds: number;
  topicTitle?: string;
  userScreenshots?: string[]; // URLs of user-uploaded screenshots
};

const TAG = '[LONG_VIDEO_PLANNER]';

/**
 * Plan the full video using Gemini.
 * Falls back to deterministic planner if Gemini fails.
 */
export async function planLongVideo(input: LongVideoPlanInput): Promise<LongVideoPlan> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.warn(TAG, 'GEMINI_API_KEY missing — using deterministic planner');
    return deterministicPlan(input);
  }

  try {
    const plan = await geminiPlan(input, geminiKey);
    console.log(TAG, 'Gemini plan:', { scenes: plan.scenes.length, source: plan.source });
    return plan;
  } catch (err) {
    console.error(TAG, 'Gemini failed, using deterministic fallback:', err instanceof Error ? err.message : err);
    return deterministicPlan(input);
  }
}

/**
 * Gemini-powered scene planning.
 */
async function geminiPlan(input: LongVideoPlanInput, apiKey: string): Promise<LongVideoPlan> {
  const {GoogleGenAI} = await import('@google/genai');
  const ai = new GoogleGenAI({apiKey});

  const screenshotInfo = input.userScreenshots?.length
    ? `\nUser has uploaded ${input.userScreenshots.length} screenshots to show at relevant moments.`
    : '';

  const prompt = `You are a professional video editor AI. Given a video transcript, create a scene-by-scene plan for a produced long-form video.

TOPIC: ${input.topicTitle || 'General topic'}
DURATION: ${input.durationSeconds.toFixed(1)} seconds
TRANSCRIPT SEGMENTS: ${input.segments.length}${screenshotInfo}

RULES:
- Start with a "title" scene (2-4 seconds) showing the topic title.
- Break the content into logical sections (every 30-60 seconds).
- Between sections, add brief "transition" scenes (0.5-1s).
- For important statements, add "typography" scenes (2-4s) with the key phrase.
- For explanations that benefit from visuals, add "image" scenes (3-5s).
- If user uploaded screenshots, place them at contextually relevant moments as "image" scenes.
- Add "callout" scenes for lists or key takeaways (3-5s each).
- "narration" scenes fill the remaining time (speaker with captions).
- Every scene must have startSeconds and endSeconds that don't overlap.
- Scenes must cover the full duration with no gaps.
- musicMood should match the content type.

AVAILABLE MOTIONS: fade, slide-left, slide-right, zoom-in, scale-up, none
AVAILABLE SFX: whoosh, pop, click, none

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "Video title",
  "musicMood": "corporate|calm|upbeat|cinematic|inspiring",
  "scenes": [
    {"type": "title", "startSeconds": 0, "endSeconds": 3, "text": "Title text", "motion": "scale-up", "sfx": "whoosh"},
    {"type": "narration", "startSeconds": 3, "endSeconds": 30, "motion": "none", "sfx": "none"},
    {"type": "typography", "startSeconds": 30, "endSeconds": 34, "keyword": "Key phrase", "motion": "zoom-in", "sfx": "pop"},
    ...
  ]
}

TRANSCRIPT (first 3000 chars):
${input.transcript.slice(0, 3000)}

SEGMENTS (timing reference):
${JSON.stringify(input.segments.slice(0, 40).map(s => ({s: s.start.toFixed(1), e: s.end.toFixed(1), t: s.text.slice(0, 60)})))}

Return ONLY valid JSON. No explanation. No markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{role: 'user', parts: [{text: prompt}]}],
    config: {temperature: 0.4, maxOutputTokens: 4000},
  });

  const text = response.text?.trim() || '';
  const jsonStr = text.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(jsonStr);

  if (!parsed.scenes || !Array.isArray(parsed.scenes) || parsed.scenes.length < 3) {
    throw new Error('Gemini returned invalid plan');
  }

  // Validate and clean scenes
  const scenes: LongVideoScene[] = parsed.scenes
    .filter((s: any) => s.type && Number.isFinite(s.startSeconds) && Number.isFinite(s.endSeconds))
    .map((s: any) => ({
      type: s.type as LongVideoSceneType,
      startSeconds: Number(s.startSeconds),
      endSeconds: Number(s.endSeconds),
      text: s.text || undefined,
      keyword: s.keyword || undefined,
      imageSrc: undefined, // Will be resolved later from assets
      bullets: Array.isArray(s.bullets) ? s.bullets : undefined,
      motion: s.motion || 'none',
      sfx: s.sfx || 'none',
    }));

  // Assign user screenshots to image scenes
  if (input.userScreenshots?.length) {
    const imageScenes = scenes.filter(s => s.type === 'image');
    input.userScreenshots.forEach((url, i) => {
      if (imageScenes[i]) imageScenes[i].imageSrc = url;
    });
  }

  return {
    title: parsed.title || input.topicTitle || 'Video',
    scenes,
    durationSeconds: input.durationSeconds,
    musicMood: parsed.musicMood || 'corporate',
    source: 'gemini',
  };
}

/**
 * Deterministic fallback planner (no AI, purely from transcript timing).
 */
function deterministicPlan(input: LongVideoPlanInput): LongVideoPlan {
  const {durationSeconds, segments, topicTitle, userScreenshots} = input;
  const scenes: LongVideoScene[] = [];
  const title = topicTitle || 'Video';

  // Title card
  scenes.push({
    type: 'title',
    startSeconds: 0,
    endSeconds: Math.min(3.5, durationSeconds * 0.02),
    text: title,
    motion: 'scale-up',
    sfx: 'whoosh',
  });

  const contentStart = scenes[0].endSeconds;
  const contentEnd = durationSeconds - 1;
  const sectionDuration = 45; // ~45s per section

  let cursor = contentStart;
  let sectionIndex = 0;
  let screenshotIndex = 0;

  while (cursor < contentEnd) {
    const sectionEnd = Math.min(cursor + sectionDuration, contentEnd);

    // Find segments in this section for typography keyword
    const sectionSegments = segments.filter(s => s.start >= cursor && s.start < sectionEnd);
    const longestSegment = sectionSegments.sort((a, b) => b.text.length - a.text.length)[0];

    // Narration (main content)
    const narrationEnd = Math.min(cursor + sectionDuration * 0.7, sectionEnd);
    scenes.push({
      type: 'narration',
      startSeconds: Number(cursor.toFixed(2)),
      endSeconds: Number(narrationEnd.toFixed(2)),
      motion: 'none',
      sfx: 'none',
    });

    // Typography moment
    if (longestSegment && narrationEnd < sectionEnd - 4) {
      const typoStart = narrationEnd;
      const typoEnd = Math.min(typoStart + 3, sectionEnd);
      const words = longestSegment.text.split(/\s+/).slice(0, 4).join(' ');
      scenes.push({
        type: 'typography',
        startSeconds: Number(typoStart.toFixed(2)),
        endSeconds: Number(typoEnd.toFixed(2)),
        keyword: words,
        motion: 'zoom-in',
        sfx: 'pop',
      });
      cursor = typoEnd;
    } else {
      cursor = narrationEnd;
    }

    // Image/screenshot if available
    if (userScreenshots && screenshotIndex < userScreenshots.length && cursor < sectionEnd - 4) {
      const imgStart = cursor;
      const imgEnd = Math.min(imgStart + 4, sectionEnd);
      scenes.push({
        type: 'image',
        startSeconds: Number(imgStart.toFixed(2)),
        endSeconds: Number(imgEnd.toFixed(2)),
        imageSrc: userScreenshots[screenshotIndex],
        motion: 'slide-left',
        sfx: 'click',
      });
      screenshotIndex++;
      cursor = imgEnd;
    }

    // Transition between sections
    if (cursor < contentEnd - 2) {
      scenes.push({
        type: 'transition',
        startSeconds: Number(cursor.toFixed(2)),
        endSeconds: Number((cursor + 0.8).toFixed(2)),
        motion: 'fade',
        sfx: 'whoosh',
      });
      cursor += 0.8;
    } else {
      cursor = sectionEnd;
    }

    sectionIndex++;
  }

  return {
    title,
    scenes,
    durationSeconds,
    musicMood: 'corporate',
    source: 'deterministic',
  };
}
