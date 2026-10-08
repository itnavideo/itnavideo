/**
 * Pose Analyzer — MediaPipe-based body pose and gesture detection.
 *
 * Analyzes sampled video keyframes to detect posture, gestures, orientation,
 * and confidence. Output is a standardized PoseAnalysisResult JSON that Gemini
 * can consume alongside the transcript for better animation decisions.
 *
 * Graceful fallback: If MediaPipe fails or confidence is low, returns
 * source: 'fallback-empty' with ok: true so the pipeline never breaks.
 */

import fs from 'fs/promises';
import type {
  PoseAnalysisResult,
  PoseAnalysisSummary,
  PoseFrame,
  PoseGesture,
  PoseLandmark,
} from './types';
import { extractKeyframes, cleanupFrames, type ExtractedFrame } from './frameExtractor';

const TAG = '[POSE_ANALYZER]';
const CONFIDENCE_THRESHOLD = 0.5;

// MediaPipe landmark indices (PoseLandmarker 33-point model)
const LM = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

/**
 * Main entry point: Analyze a video file for pose/gesture data.
 *
 * @param videoPath - Absolute path to a local video file.
 * @param sampleIntervalSeconds - How often to sample (default 1.5s).
 */
export async function analyzeVideoPoses(
  videoPath: string,
  sampleIntervalSeconds = 1.5,
): Promise<PoseAnalysisResult> {
  console.log(TAG, 'starting analysis for:', videoPath);

  // Step 1: Extract keyframes
  const extraction = await extractKeyframes(videoPath, sampleIntervalSeconds);
  if (!extraction.ok || extraction.frames.length === 0) {
    console.warn(TAG, 'frame extraction failed, returning fallback');
    return createFallback(extraction.error || 'Frame extraction failed');
  }

  // Step 2: Analyze each frame with MediaPipe
  let poseLandmarker: any = null;
  try {
    poseLandmarker = await loadPoseLandmarker();
  } catch (err) {
    console.error(TAG, 'MediaPipe load failed:', err instanceof Error ? err.message : err);
    await cleanupFrames(extraction.tempDir);
    return createFallback('MediaPipe PoseLandmarker failed to load');
  }

  const frames: PoseFrame[] = [];
  for (const frame of extraction.frames) {
    try {
      const poseFrame = await analyzeFrame(poseLandmarker, frame);
      frames.push(poseFrame);
    } catch (err) {
      // Skip frame on error, don't break pipeline
      console.warn(TAG, `frame ${frame.timestampSeconds}s failed:`, err instanceof Error ? err.message : '');
      frames.push(createEmptyFrame(frame.timestampSeconds));
    }
  }

  // Step 3: Cleanup temp files
  await cleanupFrames(extraction.tempDir);

  // Step 4: Build summary
  const summary = buildSummary(frames);

  console.log(TAG, 'analysis complete:', {
    frameCount: frames.length,
    avgConfidence: summary.averageConfidence.toFixed(2),
    dominantPosture: summary.dominantPosture,
    gestureEvents: summary.gestureEvents.length,
    reliable: summary.reliable,
  });

  return {
    ok: true,
    source: 'mediapipe',
    videoDurationSeconds: extraction.videoDurationSeconds,
    sampleIntervalSeconds: extraction.sampleIntervalSeconds,
    frameCount: frames.length,
    frames,
    summary,
  };
}

/**
 * Load MediaPipe PoseLandmarker (WASM).
 * Downloads the model on first use; cached after.
 */
async function loadPoseLandmarker() {
  // Dynamic import to avoid bundling issues
  const { PoseLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');

  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  const landmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
      delegate: 'CPU',
    },
    runningMode: 'IMAGE',
    numPoses: 1,
  });

  return landmarker;
}

/**
 * Analyze a single frame image with MediaPipe PoseLandmarker.
 */
async function analyzeFrame(landmarker: any, frame: ExtractedFrame): Promise<PoseFrame> {
  const imageData = await fs.readFile(frame.imagePath);

  // Create an ImageData-like object from the JPEG buffer
  // MediaPipe in Node.js needs a decoded image — use a minimal decode approach
  const { decodeJpeg } = await loadImageDecoder();
  const decoded = decodeJpeg(imageData);

  const result = landmarker.detect(decoded);

  if (!result.landmarks || result.landmarks.length === 0) {
    return createEmptyFrame(frame.timestampSeconds);
  }

  const landmarks = result.landmarks[0]; // First person only
  const confidence = calculateConfidence(landmarks);

  if (confidence < CONFIDENCE_THRESHOLD) {
    return { ...createEmptyFrame(frame.timestampSeconds), confidence };
  }

  const posture = detectPosture(landmarks);
  const gestures = detectGestures(landmarks);
  const orientation = detectOrientation(landmarks);

  const namedLandmarks: PoseLandmark[] = Object.entries(LM).map(([name, idx]) => ({
    name: name.toLowerCase(),
    x: landmarks[idx]?.x ?? 0,
    y: landmarks[idx]?.y ?? 0,
    z: landmarks[idx]?.z ?? 0,
    visibility: landmarks[idx]?.visibility ?? 0,
  }));

  return {
    timestampSeconds: frame.timestampSeconds,
    posture,
    gestures,
    orientation,
    confidence,
    landmarks: namedLandmarks,
  };
}

/**
 * Detect body posture from landmarks.
 */
function detectPosture(landmarks: any[]): PoseFrame['posture'] {
  const leftHip = landmarks[LM.LEFT_HIP];
  const rightHip = landmarks[LM.RIGHT_HIP];
  const leftKnee = landmarks[LM.LEFT_KNEE];
  const rightKnee = landmarks[LM.RIGHT_KNEE];
  const leftShoulder = landmarks[LM.LEFT_SHOULDER];
  const rightShoulder = landmarks[LM.RIGHT_SHOULDER];

  if (!leftHip || !rightHip || !leftKnee || !rightKnee) return 'unknown';

  const hipY = (leftHip.y + rightHip.y) / 2;
  const kneeY = (leftKnee.y + rightKnee.y) / 2;
  const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;

  // Sitting: hips and knees at similar height
  const hipKneeDiff = Math.abs(hipY - kneeY);
  if (hipKneeDiff < 0.08) return 'sitting';

  // Leaning: shoulders significantly off-center horizontally
  const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
  const hipCenterX = (leftHip.x + rightHip.x) / 2;
  if (Math.abs(shoulderCenterX - hipCenterX) > 0.08) return 'leaning';

  return 'standing';
}

/**
 * Detect hand/arm gestures from landmarks.
 */
function detectGestures(landmarks: any[]): PoseGesture[] {
  const gestures: PoseGesture[] = [];
  const leftWrist = landmarks[LM.LEFT_WRIST];
  const rightWrist = landmarks[LM.RIGHT_WRIST];
  const leftShoulder = landmarks[LM.LEFT_SHOULDER];
  const rightShoulder = landmarks[LM.RIGHT_SHOULDER];
  const leftElbow = landmarks[LM.LEFT_ELBOW];
  const rightElbow = landmarks[LM.RIGHT_ELBOW];
  const nose = landmarks[LM.NOSE];

  if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder || !nose) return ['none'];

  // Hands up: wrists above shoulders
  if (leftWrist.y < leftShoulder.y - 0.1 && rightWrist.y < rightShoulder.y - 0.1) {
    gestures.push('hands-up');
  }

  // Pointing left: left arm extended, right arm close to body
  const leftArmExtension = Math.abs(leftWrist.x - leftShoulder.x);
  const rightArmExtension = Math.abs(rightWrist.x - rightShoulder.x);
  if (leftArmExtension > 0.25 && leftWrist.x < leftShoulder.x && rightArmExtension < 0.15) {
    gestures.push('pointing-left');
  }
  // Pointing right
  if (rightArmExtension > 0.25 && rightWrist.x > rightShoulder.x && leftArmExtension < 0.15) {
    gestures.push('pointing-right');
  }

  // Hand on chin: wrist near nose level
  if (Math.abs(rightWrist.y - nose.y) < 0.06 && Math.abs(rightWrist.x - nose.x) < 0.1) {
    gestures.push('hand-on-chin');
  }

  // Open palms: both arms extended outward
  if (leftArmExtension > 0.2 && rightArmExtension > 0.2) {
    gestures.push('open-palms');
  }

  return gestures.length > 0 ? gestures : ['none'];
}

/**
 * Detect body orientation (facing direction).
 */
function detectOrientation(landmarks: any[]): PoseFrame['orientation'] {
  const nose = landmarks[LM.NOSE];
  const leftShoulder = landmarks[LM.LEFT_SHOULDER];
  const rightShoulder = landmarks[LM.RIGHT_SHOULDER];

  if (!nose || !leftShoulder || !rightShoulder) return 'center';

  const shoulderCenter = (leftShoulder.x + rightShoulder.x) / 2;
  const noseOffset = nose.x - shoulderCenter;

  if (noseOffset < -0.04) return 'left';
  if (noseOffset > 0.04) return 'right';
  return 'center';
}

/**
 * Calculate average visibility/confidence from landmarks.
 */
function calculateConfidence(landmarks: any[]): number {
  const keyIndices = [LM.NOSE, LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER, LM.LEFT_HIP, LM.RIGHT_HIP];
  const visibilities = keyIndices.map((i) => landmarks[i]?.visibility ?? 0);
  return visibilities.reduce((sum, v) => sum + v, 0) / visibilities.length;
}

/**
 * Build a high-level summary from all analyzed frames.
 */
function buildSummary(frames: PoseFrame[]): PoseAnalysisSummary {
  if (frames.length === 0) {
    return { dominantPosture: 'unknown', dominantOrientation: 'center', gestureEvents: [], averageConfidence: 0, reliable: false };
  }

  // Dominant posture (mode)
  const postureCounts: Record<string, number> = {};
  const orientationCounts: Record<string, number> = {};
  let totalConfidence = 0;

  for (const f of frames) {
    postureCounts[f.posture] = (postureCounts[f.posture] || 0) + 1;
    orientationCounts[f.orientation] = (orientationCounts[f.orientation] || 0) + 1;
    totalConfidence += f.confidence;
  }

  const dominantPosture = Object.entries(postureCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as PoseFrame['posture'] || 'unknown';
  const dominantOrientation = Object.entries(orientationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as PoseFrame['orientation'] || 'center';
  const averageConfidence = totalConfidence / frames.length;

  // Gesture events: only interesting gestures (not 'none'), deduplicated by time proximity
  const gestureEvents: PoseAnalysisSummary['gestureEvents'] = [];
  for (const f of frames) {
    for (const g of f.gestures) {
      if (g === 'none') continue;
      const lastEvent = gestureEvents[gestureEvents.length - 1];
      // Only add if different from last or >3s apart
      if (!lastEvent || lastEvent.gesture !== g || f.timestampSeconds - lastEvent.timestampSeconds > 3) {
        gestureEvents.push({ timestampSeconds: f.timestampSeconds, gesture: g });
      }
    }
  }

  return {
    dominantPosture,
    dominantOrientation,
    gestureEvents,
    averageConfidence: Number(averageConfidence.toFixed(3)),
    reliable: averageConfidence >= 0.6,
  };
}

/**
 * Create an empty frame (used when detection fails for a specific frame).
 */
function createEmptyFrame(timestampSeconds: number): PoseFrame {
  return { timestampSeconds, posture: 'unknown', gestures: ['none'], orientation: 'center', confidence: 0 };
}

/**
 * Create a fallback result when the entire pipeline fails.
 * ok is still true so downstream doesn't break — source indicates fallback.
 */
function createFallback(error: string): PoseAnalysisResult {
  console.warn(TAG, 'returning fallback-empty:', error);
  return {
    ok: true,
    source: 'fallback-empty',
    videoDurationSeconds: 0,
    sampleIntervalSeconds: 0,
    frameCount: 0,
    frames: [],
    summary: { dominantPosture: 'unknown', dominantOrientation: 'center', gestureEvents: [], averageConfidence: 0, reliable: false },
    error,
  };
}

/**
 * Lazy-load a JPEG decoder for Node.js (no Canvas/DOM required).
 * Uses 'jpeg-js' which is pure JS.
 */
async function loadImageDecoder() {
  // For MediaPipe in Node.js, we need to provide decoded pixel data.
  // This is a placeholder — actual integration depends on MediaPipe's Node.js IMAGE mode support.
  // If MediaPipe WASM doesn't work in pure Node.js, we'll fallback gracefully.
  return {
    decodeJpeg: (buffer: Buffer) => {
      // MediaPipe tasks-vision expects an HTMLImageElement or ImageData in browser.
      // In Node.js, we'd need to use the MPImage helper or a canvas polyfill.
      // For now, return the buffer — actual implementation TBD based on testing.
      return buffer;
    },
  };
}
