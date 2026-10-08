/**
 * Scene Detector for Long-form Captioned Video
 *
 * Analyzes the transcript to detect:
 * 1. Topic changes (new subject matter)
 * 2. Pauses (silence gaps > 1.5s)
 * 3. Emotional moments (questions, emphasis, conclusions)
 * 4. Creates visual scene boundaries
 * 5. Assigns layout variations per scene
 *
 * This runs deterministically from Groq word timestamps — no AI API call needed.
 * Output: array of scenes with timing, type, and visual treatment instructions.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type SceneType =
  | 'intro'            // First 3-5 seconds
  | 'topic_shift'     // Detected new topic/subject
  | 'pause_break'     // Silence gap detected
  | 'emotional_peak'  // Question, exclamation, or emphasis
  | 'conclusion'      // Final wrap-up section
  | 'continuation';   // Normal flow (no special event)

export type CameraVariation =
  | 'zoom_in_slow'
  | 'zoom_out_slow'
  | 'pan_left'
  | 'pan_right'
  | 'drift_up'
  | 'drift_down'
  | 'ken_burns_tl'
  | 'ken_burns_br'
  | 'settle_center'
  | 'static_breathe';

export type DetectedScene = {
  id: number;
  startTime: number;
  endTime: number;
  type: SceneType;
  camera: CameraVariation;
  intensity: number;       // 0–1: how visually active this scene should be
  gradientShift: number;   // 0–1: subtle background tint shift for variety
  captionPosition: 'bottom' | 'center' | 'top';
  reason: string;
};

export type SceneDetectorInput = {
  words: Array<{ word: string; start: number; end: number }>;
  captions: Array<{ start: number; end: number; text: string }>;
  durationSeconds: number;
};

// ── Configuration ─────────────────────────────────────────────────────────────

const MIN_SCENE_DURATION = 6;     // Minimum seconds per scene
const MAX_SCENE_DURATION = 18;    // Maximum seconds before forced break
const PAUSE_THRESHOLD = 1.5;      // Seconds of silence to trigger pause_break
const TOPIC_SHIFT_KEYWORDS = /\b(now|next|but|however|also|another|moving on|let's talk|secondly|thirdly|finally|on the other hand|aur ek|doosra|teesra|ab|lekin|phir|agle)\b/i;
const EMOTIONAL_KEYWORDS = /[?!]|\b(important|remember|key point|never forget|listen|shocking|amazing|incredible|unbelievable|yaad rakho|zaruri|dhyan do|sunlo)\b/i;
const CONCLUSION_KEYWORDS = /\b(in conclusion|to summarize|finally|so basically|that's it|that's all|thank you|subscribe|like and share|toh ye tha|bas itna hi|share karo|subscribe karo)\b/i;

// ── Camera Variation Cycle ────────────────────────────────────────────────────
// Ensures no two adjacent scenes have the same camera move

const CAMERA_CYCLE: CameraVariation[] = [
  'zoom_in_slow',
  'pan_right',
  'ken_burns_tl',
  'zoom_out_slow',
  'drift_up',
  'pan_left',
  'ken_burns_br',
  'settle_center',
  'drift_down',
  'static_breathe',
];

const EMOTIONAL_CAMERAS: CameraVariation[] = ['zoom_in_slow', 'settle_center', 'drift_up'];
const PAUSE_CAMERAS: CameraVariation[] = ['zoom_out_slow', 'static_breathe', 'settle_center'];

// ── Main Detector ─────────────────────────────────────────────────────────────

export function detectScenes(input: SceneDetectorInput): DetectedScene[] {
  const { words, captions, durationSeconds } = input;
  if (!words.length || durationSeconds <= 0) return [];

  const breakpoints = findBreakpoints(words, captions, durationSeconds);
  const scenes = buildScenes(breakpoints, durationSeconds);
  return assignVisuals(scenes);
}

// ── Breakpoint Detection ──────────────────────────────────────────────────────

type Breakpoint = {
  time: number;
  type: SceneType;
  reason: string;
};

function findBreakpoints(
  words: Array<{ word: string; start: number; end: number }>,
  captions: Array<{ start: number; end: number; text: string }>,
  durationSeconds: number,
): Breakpoint[] {
  const breakpoints: Breakpoint[] = [
    { time: 0, type: 'intro', reason: 'video_start' },
  ];

  let lastBreakTime = 0;

  // Scan through words for pauses
  for (let i = 1; i < words.length; i++) {
    const gap = words[i].start - words[i - 1].end;
    const timeSinceLastBreak = words[i].start - lastBreakTime;

    // Pause detection: silence > threshold
    if (gap >= PAUSE_THRESHOLD && timeSinceLastBreak >= MIN_SCENE_DURATION) {
      breakpoints.push({ time: words[i].start, type: 'pause_break', reason: `silence_${gap.toFixed(1)}s` });
      lastBreakTime = words[i].start;
      continue;
    }
  }

  // Scan through captions for topic shifts and emotional moments
  for (const caption of captions) {
    const timeSinceLastBreak = caption.start - lastBreakTime;
    if (timeSinceLastBreak < MIN_SCENE_DURATION) continue;

    const text = caption.text;

    // Conclusion detection (near end)
    if (caption.start > durationSeconds * 0.85 && CONCLUSION_KEYWORDS.test(text)) {
      breakpoints.push({ time: caption.start, type: 'conclusion', reason: 'conclusion_keywords' });
      lastBreakTime = caption.start;
      continue;
    }

    // Topic shift detection
    if (TOPIC_SHIFT_KEYWORDS.test(text) && timeSinceLastBreak >= MIN_SCENE_DURATION) {
      breakpoints.push({ time: caption.start, type: 'topic_shift', reason: 'topic_keyword' });
      lastBreakTime = caption.start;
      continue;
    }

    // Emotional peak detection
    if (EMOTIONAL_KEYWORDS.test(text) && timeSinceLastBreak >= MIN_SCENE_DURATION) {
      breakpoints.push({ time: caption.start, type: 'emotional_peak', reason: 'emotional_keyword' });
      lastBreakTime = caption.start;
      continue;
    }

    // Force break if scene is too long
    if (timeSinceLastBreak >= MAX_SCENE_DURATION) {
      breakpoints.push({ time: caption.start, type: 'continuation', reason: 'max_duration_reached' });
      lastBreakTime = caption.start;
    }
  }

  // Sort by time and deduplicate close breakpoints
  return breakpoints
    .sort((a, b) => a.time - b.time)
    .filter((bp, i, arr) => i === 0 || bp.time - arr[i - 1].time >= MIN_SCENE_DURATION * 0.8);
}

// ── Scene Building ────────────────────────────────────────────────────────────

function buildScenes(breakpoints: Breakpoint[], durationSeconds: number): Omit<DetectedScene, 'camera' | 'intensity' | 'gradientShift' | 'captionPosition'>[] {
  const scenes: Omit<DetectedScene, 'camera' | 'intensity' | 'gradientShift' | 'captionPosition'>[] = [];

  for (let i = 0; i < breakpoints.length; i++) {
    const start = breakpoints[i].time;
    const end = i < breakpoints.length - 1 ? breakpoints[i + 1].time : durationSeconds;

    scenes.push({
      id: i + 1,
      startTime: start,
      endTime: end,
      type: breakpoints[i].type,
      reason: breakpoints[i].reason,
    });
  }

  return scenes;
}

// ── Visual Assignment ─────────────────────────────────────────────────────────

function assignVisuals(
  rawScenes: Omit<DetectedScene, 'camera' | 'intensity' | 'gradientShift' | 'captionPosition'>[],
): DetectedScene[] {
  let cameraIndex = 0;

  return rawScenes.map((scene, i) => {
    // Camera selection based on scene type
    let camera: CameraVariation;
    if (scene.type === 'emotional_peak') {
      camera = EMOTIONAL_CAMERAS[i % EMOTIONAL_CAMERAS.length];
    } else if (scene.type === 'pause_break') {
      camera = PAUSE_CAMERAS[i % PAUSE_CAMERAS.length];
    } else if (scene.type === 'intro') {
      camera = 'zoom_in_slow';
    } else if (scene.type === 'conclusion') {
      camera = 'zoom_out_slow';
    } else {
      camera = CAMERA_CYCLE[cameraIndex % CAMERA_CYCLE.length];
      cameraIndex++;
    }

    // Intensity: emotional peaks and conclusions get more visual activity
    const intensity =
      scene.type === 'emotional_peak' ? 0.8 :
      scene.type === 'intro' ? 0.7 :
      scene.type === 'conclusion' ? 0.6 :
      scene.type === 'topic_shift' ? 0.5 :
      scene.type === 'pause_break' ? 0.3 :
      0.4;

    // Gradient shift: subtle tint variation so scenes don't look identical
    const gradientShift = (i * 0.13) % 1;

    // Caption position: vary occasionally for visual interest
    const captionPosition: 'bottom' | 'center' | 'top' =
      scene.type === 'emotional_peak' ? 'center' :
      scene.type === 'intro' ? 'center' :
      'bottom';

    return { ...scene, camera, intensity, gradientShift, captionPosition };
  });
}

// ── Camera Transform Calculator ───────────────────────────────────────────────

/**
 * Convert a detected scene's camera variation into a CSS transform string.
 * Called per-frame in the renderer.
 */
export function getSceneCameraTransform(
  frame: number,
  fps: number,
  scene: DetectedScene,
): string {
  const sceneStartFrame = Math.round(scene.startTime * fps);
  const sceneDurationFrames = Math.round((scene.endTime - scene.startTime) * fps);
  const localFrame = frame - sceneStartFrame;
  const progress = Math.min(1, Math.max(0, localFrame / Math.max(1, sceneDurationFrames)));

  // Smooth easing
  const eased = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const scale = scene.intensity * 0.6; // Scale motion intensity

  switch (scene.camera) {
    case 'zoom_in_slow':
      return `scale(${1 + eased * 0.025 * scale}) translate(0px, 0px)`;
    case 'zoom_out_slow':
      return `scale(${1.025 * scale + 1 - eased * 0.025 * scale}) translate(0px, 0px)`;
    case 'pan_right':
      return `scale(${1 + 0.015 * scale}) translate(${(-8 + eased * 16) * scale}px, 0px)`;
    case 'pan_left':
      return `scale(${1 + 0.015 * scale}) translate(${(8 - eased * 16) * scale}px, 0px)`;
    case 'drift_up':
      return `scale(${1 + 0.01 * scale}) translate(0px, ${(4 - eased * 8) * scale}px)`;
    case 'drift_down':
      return `scale(${1 + 0.01 * scale}) translate(0px, ${(-4 + eased * 8) * scale}px)`;
    case 'ken_burns_tl':
      return `scale(${1 + eased * 0.02 * scale}) translate(${(-5 + eased * 10) * scale}px, ${(-3 + eased * 6) * scale}px)`;
    case 'ken_burns_br':
      return `scale(${1 + 0.02 * scale - eased * 0.005 * scale}) translate(${(5 - eased * 10) * scale}px, ${(3 - eased * 6) * scale}px)`;
    case 'settle_center': {
      const breathe = Math.sin(progress * Math.PI) * 0.008 * scale;
      return `scale(${1 + breathe}) translate(0px, ${Math.sin(progress * Math.PI) * 2 * scale}px)`;
    }
    case 'static_breathe': {
      const pulse = Math.sin(progress * Math.PI * 2) * 0.005 * scale;
      return `scale(${1 + pulse})`;
    }
    default:
      return `scale(1)`;
  }
}

/**
 * Get a subtle background tint overlay color for the current scene.
 * Creates visual variety without changing the source video.
 */
export function getSceneGradientOverlay(scene: DetectedScene): string {
  const hueShift = scene.gradientShift * 30; // 0-30 degree hue variation
  const opacity = scene.type === 'emotional_peak' ? 0.06 : scene.type === 'pause_break' ? 0.03 : 0.04;

  // Subtle cool/warm shifts based on scene index
  if (scene.gradientShift < 0.33) {
    return `rgba(15, 23, 42, ${opacity})`; // Cool navy
  } else if (scene.gradientShift < 0.66) {
    return `rgba(30, 20, 40, ${opacity})`; // Warm purple-dark
  }
  return `rgba(10, 30, 30, ${opacity})`; // Teal-dark
}
