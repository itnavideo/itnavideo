/**
 * Face Tracker — AI Vision & Keyframe Face Detection for Smart Camera Framing.
 *
 * Uses Gemini 2.5 Flash Vision on sampled video keyframes to detect speaker face center (X/Y).
 * Applies exponential moving average (EMA) low-pass filtering and deadband logic
 * to generate silky-smooth camera re-framing without jitter or awkward crops.
 *
 * Fallback: Returns static center (0.50, 0.38) if Vision fails or no face is present.
 */

import fs from 'node:fs/promises';
import { GoogleGenAI, Type } from '@google/genai';
import { extractKeyframes, cleanupFrames } from './frameExtractor';

export interface FaceKeyframe {
  timeSeconds: number;
  xCenter: number; // 0.0 (left) to 1.0 (right), normalized
  yCenter: number; // 0.0 (top) to 1.0 (bottom), normalized
  confidence: number;
}

export interface FaceTrackingResult {
  ok: boolean;
  keyframes: FaceKeyframe[];
  averageXCenter: number;
  averageYCenter: number;
  isStaticCenter: boolean;
  source: 'gemini-vision' | 'fallback-center';
  error?: string;
}

const DEFAULT_X = 0.50;
const DEFAULT_Y = 0.38;

/**
 * Extract face keyframes from a video file using AI Vision keyframe analysis.
 *
 * @param videoPath - Absolute path to local video file
 * @param durationSeconds - Video segment duration to analyze (default 60s max)
 * @param sampleIntervalSeconds - Sampling interval in seconds (default 2.0s)
 */
export async function extractFaceKeyframes(
  videoPath: string,
  durationSeconds = 60,
  sampleIntervalSeconds = 2.0
): Promise<FaceTrackingResult> {
  const tag = '[FACE_TRACKER]';
  console.log(tag, 'analyzing video keyframes for face tracking:', videoPath);

  const maxFrames = Math.min(30, Math.ceil(durationSeconds / sampleIntervalSeconds));

  // Step 1: Extract sampled keyframe images
  const extraction = await extractKeyframes(videoPath, sampleIntervalSeconds, maxFrames);
  if (!extraction.ok || extraction.frames.length === 0) {
    console.warn(tag, 'frame extraction failed, returning fallback center');
    return createFallback('Frame extraction failed');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn(tag, 'GEMINI_API_KEY missing, returning fallback center');
    await cleanupFrames(extraction.tempDir);
    return createFallback('GEMINI_API_KEY missing');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Build multimodal image parts for Gemini 2.5 Flash Vision
    const inlineParts: any[] = [];
    const sampleFrames = extraction.frames.slice(0, 20); // Cap at 20 frames per Vision call

    for (const frame of sampleFrames) {
      const buffer = await fs.readFile(frame.imagePath);
      inlineParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: buffer.toString('base64'),
        },
      });
    }

    const timestampsList = sampleFrames.map((f) => `${f.timestampSeconds.toFixed(1)}s`).join(', ');
    const prompt = `Analyze these ${sampleFrames.length} sequential video keyframe images taken at timestamps: ${timestampsList}.
For each image in order, detect the primary talking-head speaker's face horizontal/vertical center position.
Return normalized coordinates between 0.00 and 1.00:
- xCenter: horizontal center of speaker's face (0.00 = left edge, 0.50 = exact center, 1.00 = right edge)
- yCenter: vertical center of speaker's face/eyes (0.00 = top edge, 0.38 = upper rule of thirds, 1.00 = bottom edge)
- confidence: face detection confidence 0.00 to 1.00 (use 0.0 if no human face visible)

Return a JSON array with exactly ${sampleFrames.length} objects corresponding to each timestamp in order.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [...inlineParts, prompt],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timeSeconds: { type: Type.NUMBER },
              xCenter: { type: Type.NUMBER },
              yCenter: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
            },
            required: ['timeSeconds', 'xCenter', 'yCenter', 'confidence'],
          },
        },
      },
    });

    await cleanupFrames(extraction.tempDir);

    let rawKeyframes: FaceKeyframe[] = [];
    try {
      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        rawKeyframes = parsed.map((item: any, idx: number) => {
          const frameTime = sampleFrames[idx]?.timestampSeconds ?? item.timeSeconds ?? idx * sampleIntervalSeconds;
          let x = Number(item.xCenter) || DEFAULT_X;
          let y = Number(item.yCenter) || DEFAULT_Y;
          const conf = Number(item.confidence) || 0;

          // If confidence is low or invalid, default to center
          if (conf < 0.3 || !Number.isFinite(x) || !Number.isFinite(y)) {
            x = DEFAULT_X;
            y = DEFAULT_Y;
          }

          // Strict 16:9 safety bounds (never crop edges or top of head)
          x = Math.max(0.35, Math.min(0.65, x));
          y = Math.max(0.28, Math.min(0.48, y));

          return {
            timeSeconds: Number(frameTime.toFixed(2)),
            xCenter: Number(x.toFixed(3)),
            yCenter: Number(y.toFixed(3)),
            confidence: Number(conf.toFixed(2)),
          };
        });
      }
    } catch (parseErr) {
      console.warn(tag, 'failed to parse Vision JSON response:', parseErr);
    }

    if (rawKeyframes.length === 0) {
      return createFallback('Failed to parse face detection keyframes');
    }

    // Step 2: Apply Exponential Moving Average (EMA) Low-Pass Filter & Deadband
    const smoothedKeyframes = smoothFaceKeyframes(rawKeyframes);

    const avgX = smoothedKeyframes.reduce((s, k) => sum(s, k.xCenter), 0) / smoothedKeyframes.length;
    const avgY = smoothedKeyframes.reduce((s, k) => sum(s, k.yCenter), 0) / smoothedKeyframes.length;
    const maxDevX = Math.max(...smoothedKeyframes.map((k) => Math.abs(k.xCenter - DEFAULT_X)));
    const isStatic = maxDevX < 0.05;

    console.log(tag, 'face tracking completed successfully:', {
      keyframesCount: smoothedKeyframes.length,
      avgXCenter: avgX.toFixed(3),
      avgYCenter: avgY.toFixed(3),
      isStaticCenter: isStatic,
    });

    return {
      ok: true,
      keyframes: smoothedKeyframes,
      averageXCenter: Number(avgX.toFixed(3)),
      averageYCenter: Number(avgY.toFixed(3)),
      isStaticCenter: isStatic,
      source: 'gemini-vision',
    };
  } catch (err) {
    console.warn(tag, 'Gemini Vision face tracking error, using fallback:', err instanceof Error ? err.message : err);
    await cleanupFrames(extraction.tempDir);
    return createFallback(err instanceof Error ? err.message : 'Vision tracking failed');
  }
}

function sum(a: number, b: number) {
  return a + b;
}

/**
 * Exponential Moving Average (EMA) + Deadband Filter
 * Ensures human-like smooth camera motion with zero jitter or sudden shifts.
 */
function smoothFaceKeyframes(keyframes: FaceKeyframe[]): FaceKeyframe[] {
  if (keyframes.length === 0) return [];

  const smoothed: FaceKeyframe[] = [];
  let prevX = keyframes[0].xCenter;
  let prevY = keyframes[0].yCenter;

  const ALPHA = 0.25; // Gentle EMA factor for smooth camera panning
  const DEADBAND_X = 0.06; // Ignore small movements within 6% of center

  for (const kf of keyframes) {
    let targetX = kf.xCenter;
    let targetY = kf.yCenter;

    // Apply deadband: if speaker is near center (0.44 - 0.56), stay perfectly centered
    if (Math.abs(targetX - DEFAULT_X) < DEADBAND_X) {
      targetX = DEFAULT_X;
    }

    const smoothX = prevX + ALPHA * (targetX - prevX);
    const smoothY = prevY + ALPHA * (targetY - prevY);

    prevX = smoothX;
    prevY = smoothY;

    smoothed.push({
      timeSeconds: kf.timeSeconds,
      xCenter: Number(smoothX.toFixed(3)),
      yCenter: Number(smoothY.toFixed(3)),
      confidence: kf.confidence,
    });
  }

  return smoothed;
}

function createFallback(error: string): FaceTrackingResult {
  return {
    ok: false,
    keyframes: [{ timeSeconds: 0, xCenter: DEFAULT_X, yCenter: DEFAULT_Y, confidence: 0 }],
    averageXCenter: DEFAULT_X,
    averageYCenter: DEFAULT_Y,
    isStaticCenter: true,
    source: 'fallback-center',
    error,
  };
}
