/**
 * Long Video Planner — 4 Cognitive Layer Architecture
 *
 * Instead of one monolithic AI call, the pipeline is a series of cognitive layers:
 *
 * Layer 1: Semantic Analysis (The Screenwriter)
 *   → Breaks transcript into "beats" with Intent Tags
 *   → (Educational/Definition, Emotional/Atmospheric, Action/Demonstration, Emphasis/Highlight, etc.)
 *
 * Layer 2: Visual Planning (The Storyboard Artist)
 *   → Based on Intent Tags, decides Visual Mode per beat
 *   → (Full-screen cinematic, Split-screen infographic, Text-only minimalist, Speaker-only, Image reveal, etc.)
 *
 * Layer 3: Synchronization & Timing (The Editor)
 *   → Uses audio timestamps to calculate exact entry/exit points for assets
 *   → Ensures no overlaps, covers full duration, handles pacing
 *
 * Layer 4: Motion & Motion Graphics (The VFX Artist)
 *   → Applies easing, camera movement, transition styles
 *   → Based on emotional weight and scene context
 *
 * Each layer can run independently and fallback gracefully.
 */

export type IntentTag =
  | 'intro-hook'
  | 'educational-definition'
  | 'educational-explanation'
  | 'emotional-atmospheric'
  | 'action-demonstration'
  | 'emphasis-highlight'
  | 'comparison'
  | 'list-enumeration'
  | 'storytelling'
  | 'conclusion-summary'
  | 'call-to-action'
  | 'transition-bridge'
  | 'question-rhetorical'
  | 'narration-default';

export type VisualMode =
  | 'full-screen-cinematic'   // B-roll / image fills screen
  | 'speaker-only'           // Video/audio with captions, no overlay
  | 'split-screen'           // Two visuals side by side (comparison)
  | 'text-only-minimalist'   // Big text on dark bg (key phrase)
  | 'title-card'             // Animated title / section header
  | 'image-reveal'           // Screenshot or image with Ken Burns
  | 'bullet-callout'         // Text bullets / key takeaways
  | 'blackout-pause'         // Brief black/dark moment (dramatic)
  | 'transition-wipe';       // Visual transition between sections

export type MotionStyle =
  | 'ease-in-smooth'
  | 'spring-bounce'
  | 'cinematic-slow'
  | 'quick-snap'
  | 'fade-gentle'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'scale-up'
  | 'none';

export type TransitionStyle =
  | 'cut'
  | 'crossfade'
  | 'slide-wipe'
  | 'zoom-through'
  | 'none';

// ─── Beat (Layer 1 output) ───
export type Beat = {
  index: number;
  startSeconds: number;
  endSeconds: number;
  text: string;
  intent: IntentTag;
  emotionalWeight: number; // 0-1 (0=neutral, 1=high emotion/emphasis)
};

// ─── Storyboard Frame (Layer 2 output) ───
export type StoryboardFrame = Beat & {
  visualMode: VisualMode;
  assetHint?: string;        // What asset to use (e.g., "relevant image", "user screenshot 1", "topic title")
  textOverlay?: string;      // Text to show on screen
  bullets?: string[];        // For bullet-callout mode
};

// ─── Timed Scene (Layer 3 output) ───
export type TimedScene = StoryboardFrame & {
  // Exact frame-accurate timing (accounting for transitions)
  entrySeconds: number;      // When this scene starts appearing
  exitSeconds: number;       // When this scene starts fading out
  holdSeconds: number;       // Duration at full visibility
  overlapWithPrev: number;   // Seconds of crossfade overlap with previous
};

// ─── Final Scene (Layer 4 output — ready for Remotion) ───
export type FinalScene = TimedScene & {
  entryMotion: MotionStyle;
  exitMotion: MotionStyle;
  cameraMovement: MotionStyle;
  transitionIn: TransitionStyle;
  transitionOut: TransitionStyle;
  sfx?: 'whoosh' | 'pop' | 'click' | 'chime' | 'none';
  imageSrc?: string;         // Resolved asset URL
};

// ─── Complete Plan ───
export type LongVideoPlan = {
  title: string;
  scenes: FinalScene[];
  durationSeconds: number;
  musicMood: 'corporate' | 'calm' | 'upbeat' | 'cinematic' | 'inspiring' | 'dramatic';
  source: 'gemini-4-layer' | 'deterministic';
  layerResults: {
    beats: number;
    storyboardFrames: number;
    timedScenes: number;
    finalScenes: number;
  };
};

export type LongVideoPlanInput = {
  transcript: string;
  segments: Array<{start: number; end: number; text: string}>;
  durationSeconds: number;
  topicTitle?: string;
  userScreenshots?: string[];
};

const TAG = '[LONG_VIDEO_PLANNER]';

// ─── Main Entry Point ───

export async function planLongVideo(input: LongVideoPlanInput): Promise<LongVideoPlan> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.warn(TAG, 'GEMINI_API_KEY missing — using deterministic planner');
    return deterministicPlan(input);
  }

  try {
    // Layer 1: Semantic Analysis
    console.log(TAG, 'Layer 1: Semantic Analysis...');
    const beats = await layer1SemanticAnalysis(input, geminiKey);

    // Layer 2: Visual Planning
    console.log(TAG, 'Layer 2: Visual Planning...');
    const storyboard = layer2VisualPlanning(beats, input);

    // Layer 3: Synchronization & Timing
    console.log(TAG, 'Layer 3: Timing...');
    const timedScenes = layer3Synchronization(storyboard, input.durationSeconds);

    // Layer 4: Motion & VFX
    console.log(TAG, 'Layer 4: Motion & VFX...');
    const finalScenes = layer4Motion(timedScenes);

    console.log(TAG, 'Plan complete:', { beats: beats.length, final: finalScenes.length });

    return {
      title: input.topicTitle || 'Video',
      scenes: finalScenes,
      durationSeconds: input.durationSeconds,
      musicMood: inferMusicMood(beats),
      source: 'gemini-4-layer',
      layerResults: {
        beats: beats.length,
        storyboardFrames: storyboard.length,
        timedScenes: timedScenes.length,
        finalScenes: finalScenes.length,
      },
    };
  } catch (err) {
    console.error(TAG, 'Pipeline failed, using deterministic:', err instanceof Error ? err.message : err);
    return deterministicPlan(input);
  }
}

// ─── LAYER 1: Semantic Analysis (The Screenwriter) ───

async function layer1SemanticAnalysis(input: LongVideoPlanInput, apiKey: string): Promise<Beat[]> {
  const {GoogleGenAI} = await import('@google/genai');
  const ai = new GoogleGenAI({apiKey});

  const prompt = `You are a professional screenwriter analyzing a video transcript.
Break this transcript into narrative "beats" — each beat is a logical thought/sentence group (5-30 seconds).
For each beat, assign an Intent Tag from this list:
- intro-hook (opening attention grab)
- educational-definition (defining a term/concept)
- educational-explanation (explaining how something works)
- emotional-atmospheric (building mood/feeling)
- action-demonstration (showing how to do something)
- emphasis-highlight (key point that needs visual emphasis)
- comparison (comparing two things)
- list-enumeration (listing items/steps)
- storytelling (narrative/anecdote)
- conclusion-summary (wrapping up)
- call-to-action (asking viewer to do something)
- transition-bridge (connecting two topics)
- question-rhetorical (posing a question)
- narration-default (general narration, no special intent)

Also rate emotionalWeight (0.0 = neutral, 1.0 = very intense/important).

TRANSCRIPT (${input.durationSeconds.toFixed(0)}s):
${input.transcript.slice(0, 4000)}

SEGMENTS (for timing reference):
${JSON.stringify(input.segments.slice(0, 50).map(s => ({s: +s.start.toFixed(1), e: +s.end.toFixed(1), t: s.text.slice(0, 80)})))}

OUTPUT (JSON array only, no markdown):
[{"index":0,"startSeconds":0,"endSeconds":8.5,"text":"opening hook text","intent":"intro-hook","emotionalWeight":0.7},...]`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{role: 'user', parts: [{text: prompt}]}],
    config: {temperature: 0.3, maxOutputTokens: 4000},
  });

  const text = (response.text || '').trim().replace(/^```json?\s*/i, '').replace(/```\s*$/, '');
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed) || parsed.length < 2) {
    throw new Error('Layer 1: Invalid beats array');
  }

  return parsed.map((b: any, i: number) => ({
    index: i,
    startSeconds: Number(b.startSeconds) || 0,
    endSeconds: Number(b.endSeconds) || 0,
    text: String(b.text || ''),
    intent: (b.intent || 'narration-default') as IntentTag,
    emotionalWeight: Math.max(0, Math.min(1, Number(b.emotionalWeight) || 0.3)),
  }));
}

// ─── LAYER 2: Visual Planning (The Storyboard Artist) ───

function layer2VisualPlanning(beats: Beat[], input: LongVideoPlanInput): StoryboardFrame[] {
  const screenshots = input.userScreenshots || [];
  let screenshotIdx = 0;

  return beats.map((beat): StoryboardFrame => {
    const visualMode = intentToVisualMode(beat.intent, beat.emotionalWeight);

    let assetHint: string | undefined;
    let textOverlay: string | undefined;
    let bullets: string[] | undefined;

    switch (visualMode) {
      case 'title-card':
        textOverlay = beat.text.slice(0, 60);
        break;
      case 'text-only-minimalist':
        textOverlay = extractKeyPhrase(beat.text);
        break;
      case 'image-reveal':
        if (screenshotIdx < screenshots.length) {
          assetHint = `user-screenshot-${screenshotIdx}`;
          screenshotIdx++;
        } else {
          assetHint = 'stock-image-relevant';
        }
        break;
      case 'bullet-callout':
        bullets = extractBullets(beat.text);
        break;
      case 'full-screen-cinematic':
        assetHint = 'cinematic-broll';
        break;
    }

    return { ...beat, visualMode, assetHint, textOverlay, bullets };
  });
}

function intentToVisualMode(intent: IntentTag, weight: number): VisualMode {
  switch (intent) {
    case 'intro-hook': return 'title-card';
    case 'emphasis-highlight': return weight > 0.7 ? 'text-only-minimalist' : 'speaker-only';
    case 'educational-definition': return 'text-only-minimalist';
    case 'educational-explanation': return weight > 0.5 ? 'image-reveal' : 'speaker-only';
    case 'emotional-atmospheric': return 'full-screen-cinematic';
    case 'action-demonstration': return 'image-reveal';
    case 'comparison': return 'split-screen';
    case 'list-enumeration': return 'bullet-callout';
    case 'storytelling': return weight > 0.6 ? 'full-screen-cinematic' : 'speaker-only';
    case 'conclusion-summary': return 'title-card';
    case 'call-to-action': return 'text-only-minimalist';
    case 'transition-bridge': return 'transition-wipe';
    case 'question-rhetorical': return weight > 0.5 ? 'blackout-pause' : 'speaker-only';
    default: return 'speaker-only';
  }
}

// ─── LAYER 3: Synchronization & Timing (The Editor) ───

function layer3Synchronization(frames: StoryboardFrame[], durationSeconds: number): TimedScene[] {
  return frames.map((frame, i): TimedScene => {
    const dur = frame.endSeconds - frame.startSeconds;
    const isTransition = frame.visualMode === 'transition-wipe' || frame.visualMode === 'blackout-pause';
    const overlap = i > 0 && !isTransition ? Math.min(0.3, dur * 0.1) : 0;

    return {
      ...frame,
      entrySeconds: Math.max(0, frame.startSeconds - overlap),
      exitSeconds: frame.endSeconds,
      holdSeconds: dur - overlap * 2,
      overlapWithPrev: overlap,
    };
  });
}

// ─── LAYER 4: Motion & Motion Graphics (The VFX Artist) ───

function layer4Motion(scenes: TimedScene[]): FinalScene[] {
  return scenes.map((scene, i): FinalScene => {
    const weight = scene.emotionalWeight;
    const isFirst = i === 0;
    const isLast = i === scenes.length - 1;

    // Entry motion based on emotional weight
    const entryMotion: MotionStyle = weight > 0.7
      ? 'spring-bounce'
      : weight > 0.4
        ? 'ease-in-smooth'
        : 'fade-gentle';

    // Camera movement for cinematic/image scenes
    const cameraMovement: MotionStyle =
      scene.visualMode === 'full-screen-cinematic' ? 'cinematic-slow'
      : scene.visualMode === 'image-reveal' ? 'zoom-in'
      : 'none';

    // Transitions
    const transitionIn: TransitionStyle = isFirst ? 'none'
      : scene.visualMode === 'transition-wipe' ? 'slide-wipe'
      : weight > 0.6 ? 'zoom-through'
      : 'crossfade';

    const transitionOut: TransitionStyle = isLast ? 'none' : 'crossfade';

    // Exit motion
    const exitMotion: MotionStyle = isLast ? 'fade-gentle' : 'none';

    // SFX based on visual mode + weight
    const sfx = decideSfx(scene.visualMode, weight);

    return {
      ...scene,
      entryMotion,
      exitMotion,
      cameraMovement,
      transitionIn,
      transitionOut,
      sfx,
    };
  });
}

function decideSfx(mode: VisualMode, weight: number): FinalScene['sfx'] {
  if (mode === 'transition-wipe') return 'whoosh';
  if (mode === 'text-only-minimalist' && weight > 0.6) return 'pop';
  if (mode === 'title-card') return 'chime';
  if (mode === 'image-reveal') return 'click';
  return 'none';
}

// ─── Helpers ───

function extractKeyPhrase(text: string): string {
  const words = text.split(/\s+/).filter(w => w.length > 3);
  return words.slice(0, 5).join(' ') || text.slice(0, 40);
}

function extractBullets(text: string): string[] {
  // Try to split on natural list markers
  const lines = text.split(/[.!?]\s+/).filter(l => l.trim().length > 5);
  return lines.slice(0, 4).map(l => l.trim().slice(0, 60));
}

function inferMusicMood(beats: Beat[]): LongVideoPlan['musicMood'] {
  const intents = beats.map(b => b.intent);
  if (intents.some(i => i === 'emotional-atmospheric' || i === 'storytelling')) return 'cinematic';
  if (intents.filter(i => i === 'emphasis-highlight').length > 3) return 'dramatic';
  if (intents.some(i => i === 'action-demonstration')) return 'upbeat';
  if (intents.filter(i => i.startsWith('educational')).length > beats.length / 2) return 'calm';
  return 'corporate';
}

// ─── Deterministic Fallback (no Gemini) ───

function deterministicPlan(input: LongVideoPlanInput): LongVideoPlan {
  const {durationSeconds, segments, topicTitle, userScreenshots} = input;
  const scenes: FinalScene[] = [];
  let screenshotIdx = 0;

  // Title
  scenes.push(createFallbackScene(0, Math.min(3.5, durationSeconds * 0.02), 'title-card', topicTitle || 'Video', 0.8));

  // Break into ~30s chunks
  const chunkDuration = 30;
  let cursor = scenes[0].exitSeconds;

  while (cursor < durationSeconds - 2) {
    const chunkEnd = Math.min(cursor + chunkDuration, durationSeconds - 1);
    const chunkSegments = segments.filter(s => s.start >= cursor && s.end <= chunkEnd);

    // Narration (speaker-only with captions)
    const narEnd = Math.min(cursor + chunkDuration * 0.65, chunkEnd);
    scenes.push(createFallbackScene(cursor, narEnd, 'speaker-only', '', 0.3));

    // Typography emphasis
    if (narEnd < chunkEnd - 3) {
      const keyword = chunkSegments[0]?.text.split(/\s+/).slice(0, 4).join(' ') || 'Key Point';
      scenes.push(createFallbackScene(narEnd, Math.min(narEnd + 3, chunkEnd), 'text-only-minimalist', keyword, 0.6));
      cursor = narEnd + 3;
    } else {
      cursor = narEnd;
    }

    // Screenshot if available
    if (userScreenshots && screenshotIdx < userScreenshots.length && cursor < chunkEnd - 4) {
      const scene = createFallbackScene(cursor, Math.min(cursor + 4, chunkEnd), 'image-reveal', '', 0.4);
      scene.imageSrc = userScreenshots[screenshotIdx];
      scenes.push(scene);
      screenshotIdx++;
      cursor += 4;
    }

    // Transition
    if (cursor < durationSeconds - 2) {
      scenes.push(createFallbackScene(cursor, cursor + 0.6, 'transition-wipe', '', 0.1));
      cursor += 0.6;
    } else {
      cursor = chunkEnd;
    }
  }

  return {
    title: topicTitle || 'Video',
    scenes,
    durationSeconds,
    musicMood: 'corporate',
    source: 'deterministic',
    layerResults: { beats: 0, storyboardFrames: 0, timedScenes: 0, finalScenes: scenes.length },
  };
}

function createFallbackScene(start: number, end: number, mode: VisualMode, text: string, weight: number): FinalScene {
  return {
    index: 0,
    startSeconds: Number(start.toFixed(2)),
    endSeconds: Number(end.toFixed(2)),
    text,
    intent: 'narration-default',
    emotionalWeight: weight,
    visualMode: mode,
    entrySeconds: Number(start.toFixed(2)),
    exitSeconds: Number(end.toFixed(2)),
    holdSeconds: Number((end - start).toFixed(2)),
    overlapWithPrev: 0,
    entryMotion: 'fade-gentle',
    exitMotion: 'none',
    cameraMovement: mode === 'image-reveal' ? 'zoom-in' : 'none',
    transitionIn: 'crossfade',
    transitionOut: 'crossfade',
    sfx: mode === 'title-card' ? 'chime' : mode === 'transition-wipe' ? 'whoosh' : 'none',
    textOverlay: text || undefined,
  };
}
