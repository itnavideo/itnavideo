/**
 * Vision Analysis Pipeline — Public API
 *
 * Usage:
 *   import { analyzeVideoPoses } from '@/services/vision';
 *   const result = await analyzeVideoPoses('/path/to/video.mp4');
 *   // result.frames → per-timestamp pose data
 *   // result.summary → high-level summary for Gemini
 *
 * The pipeline gracefully falls back to empty data if MediaPipe fails,
 * so downstream templates always receive a valid PoseAnalysisResult.
 */

export { analyzeVideoPoses } from './poseAnalyzer';
export type {
  PoseAnalysisResult,
  PoseAnalysisSummary,
  PoseFrame,
  PoseGesture,
  PoseLandmark,
} from './types';
