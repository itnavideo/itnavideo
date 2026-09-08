/**
 * Standardized output types for the Vision Analysis Pipeline.
 * Used by poseAnalyzer, Gemini integration, and downstream templates.
 */

/** A single detected pose/gesture at a specific timestamp. */
export type PoseFrame = {
  /** Timestamp in seconds from the start of the video. */
  timestampSeconds: number;
  /** Detected body posture. */
  posture: 'standing' | 'sitting' | 'walking' | 'leaning' | 'unknown';
  /** Detected hand/arm gestures. */
  gestures: PoseGesture[];
  /** Body orientation (which direction the person faces). */
  orientation: 'center' | 'left' | 'right' | 'away';
  /** MediaPipe detection confidence (0-1). Frames below threshold are marked low. */
  confidence: number;
  /** Raw landmark positions (optional, for advanced use). */
  landmarks?: PoseLandmark[];
};

export type PoseGesture =
  | 'pointing-left'
  | 'pointing-right'
  | 'hands-up'
  | 'hands-down'
  | 'hand-on-chin'
  | 'waving'
  | 'crossed-arms'
  | 'open-palms'
  | 'none';

export type PoseLandmark = {
  name: string;
  x: number;
  y: number;
  z: number;
  visibility: number;
};

/** Complete analysis result for a video. */
export type PoseAnalysisResult = {
  /** Whether analysis was successful. */
  ok: boolean;
  /** Source of the analysis. */
  source: 'mediapipe' | 'fallback-empty';
  /** Video duration in seconds (from FFmpeg probe). */
  videoDurationSeconds: number;
  /** Sample interval used (e.g., 1.5 = one frame every 1.5 seconds). */
  sampleIntervalSeconds: number;
  /** Number of frames analyzed. */
  frameCount: number;
  /** Per-frame pose data, ordered by timestamp. */
  frames: PoseFrame[];
  /** Aggregated summary for quick consumption by Gemini. */
  summary: PoseAnalysisSummary;
  /** Error message if analysis failed (ok=false). */
  error?: string;
};

/** High-level summary of detected poses across the video — easy for Gemini to consume. */
export type PoseAnalysisSummary = {
  /** Dominant posture throughout the video. */
  dominantPosture: PoseFrame['posture'];
  /** Dominant orientation. */
  dominantOrientation: PoseFrame['orientation'];
  /** Key gesture moments (timestamp + gesture). */
  gestureEvents: Array<{ timestampSeconds: number; gesture: PoseGesture }>;
  /** Average confidence across all frames. */
  averageConfidence: number;
  /** Whether the analysis is reliable (avg confidence > 0.6). */
  reliable: boolean;
};
