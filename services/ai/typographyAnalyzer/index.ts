/**
 * Master Advanced Typography Style Analyzer Service
 *
 * Orchestrates multi-stage temporal frame sampling, Gemini multimodal reverse-engineering,
 * property-level confidence assignment, differentiation cross-validation, and blueprint persistence.
 */

import fs from 'fs';
import path from 'path';
import type { AdvancedStyleBlueprint } from '@/lib/typography/blueprintSchema';
import { sampleVideoTemporally } from './frameSampling';
import { analyzeVideoWithGeminiVision, type VisionAnalysisOptions } from './visionAnalyzer';
import { validateBlueprint, validateBlueprintBatch, type BatchValidationSummary } from './validationEngine';

const BLUEPRINTS_DIR = path.join(process.cwd(), 'lib', 'typography', 'blueprints');

// Ensure blueprints directory exists
function ensureBlueprintsDir(): void {
  if (!fs.existsSync(BLUEPRINTS_DIR)) {
    fs.mkdirSync(BLUEPRINTS_DIR, { recursive: true });
  }
}

/**
 * Analyzes a single typography reference video and produces an AdvancedStyleBlueprint
 */
export async function analyzeTypographyVideo(
  videoSource: string,
  options: VisionAnalysisOptions
): Promise<AdvancedStyleBlueprint> {
  ensureBlueprintsDir();
  console.log(`[STYLE_ANALYZER] Starting multi-stage temporal analysis for style: ${options.styleId}...`);

  const sampling = await sampleVideoTemporally(videoSource);

  try {
    const blueprint = await analyzeVideoWithGeminiVision(sampling, options);
    const validatedReport = validateBlueprint(blueprint);
    blueprint.validation = validatedReport;

    // Save to disk
    const outPath = path.join(BLUEPRINTS_DIR, `${options.styleId}.json`);
    await fs.promises.writeFile(outPath, JSON.stringify(blueprint, null, 2), 'utf-8');

    console.log(`[STYLE_ANALYZER] Successfully generated & saved blueprint for ${options.styleId} (confidence: ${(blueprint.metadata.overallConfidence * 100).toFixed(0)}%)`);
    return blueprint;
  } finally {
    await sampling.cleanup();
  }
}

/**
 * Loads a saved blueprint from disk if it exists
 */
export function getSavedStyleBlueprint(styleId: string): AdvancedStyleBlueprint | null {
  ensureBlueprintsDir();
  const filePath = path.join(BLUEPRINTS_DIR, `${styleId}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as AdvancedStyleBlueprint;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Returns all saved blueprints
 */
export function getAllSavedStyleBlueprints(): AdvancedStyleBlueprint[] {
  ensureBlueprintsDir();
  const files = fs.readdirSync(BLUEPRINTS_DIR).filter((f) => f.endsWith('.json'));
  const blueprints: AdvancedStyleBlueprint[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(BLUEPRINTS_DIR, file), 'utf-8');
      blueprints.push(JSON.parse(content));
    } catch {
      // Ignore corrupt file
    }
  }

  return blueprints;
}

/**
 * Demo Video Registry containing the 10 reference videos from TypographyStylePicker
 */
export const DEMO_TYPOGRAPHY_VIDEOS: VisionAnalysisOptions[] = [
  {
    styleId: 'dynamic-punch',
    name: 'Dynamic Punch',
    category: 'kinetic',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783945650/professional-creator-after.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1783945650/professional-creator-after.jpg',
  },
  {
    styleId: 'depth-3d-text',
    name: 'Depth 3D Behind',
    category: 'depth',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.jpg',
  },
  {
    styleId: 'dubai-gold',
    name: 'Dubai Gold Luxe',
    category: 'luxury',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-1475_vqqclf.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788193725/Video-1475_vqqclf.jpg',
  },
  {
    styleId: 'neon-kinetic',
    name: 'Cyber Neon Pulse',
    category: 'cyber-tech',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788025909/gemini_generated_video_043dd47c_ejnlad.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788025909/gemini_generated_video_043dd47c_ejnlad.jpg',
  },
  {
    styleId: 'prism-pro',
    name: 'Prism Pro Impact',
    category: 'kinetic',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-76814_cpmpp1.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788193725/Video-76814_cpmpp1.jpg',
  },
  {
    styleId: 'paper-ii',
    name: 'Paper Collage II',
    category: 'paper-collage',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-30713_i60mvm.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788193725/Video-30713_i60mvm.jpg',
  },
  {
    styleId: 'elevate-script',
    name: 'Elevate Script Luxury',
    category: 'editorial',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-80725_aiv5eg.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788193723/Video-80725_aiv5eg.jpg',
  },
  {
    styleId: 'platinum-penthouse',
    name: 'Platinum Penthouse',
    category: 'minimal',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193724/Video-99061_r2lfcy.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788193724/Video-99061_r2lfcy.jpg',
  },
  {
    styleId: 'royal-emerald',
    name: 'Royal Emerald Coaching',
    category: 'luxury',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-14143_j4mkzn.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788193723/Video-14143_j4mkzn.jpg',
  },
  {
    styleId: 'silver-chrome',
    name: 'Silver Chrome Heavy',
    category: 'minimal',
    sourceVideoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-98200_id7qk8.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto,w_480,so_0.5/v1788193723/Video-98200_id7qk8.jpg',
  },
];

/**
 * Runs batch analysis across all 10 demo styles and performs batch validation & differentiation
 */
export async function analyzeAllTypographyDemos(
  onProgress?: (progress: { styleId: string; index: number; total: number; stage: string }) => void
): Promise<{ blueprints: AdvancedStyleBlueprint[]; summary: BatchValidationSummary }> {
  const blueprints: AdvancedStyleBlueprint[] = [];
  const total = DEMO_TYPOGRAPHY_VIDEOS.length;

  for (let i = 0; i < total; i++) {
    const demo = DEMO_TYPOGRAPHY_VIDEOS[i];
    onProgress?.({ styleId: demo.styleId, index: i + 1, total, stage: `Sampling & Reverse-Engineering ${demo.name}` });

    try {
      const bp = await analyzeTypographyVideo(demo.sourceVideoUrl, demo);
      blueprints.push(bp);
    } catch (err) {
      console.error(`[STYLE_ANALYZER] Error analyzing ${demo.styleId}:`, err);
    }
  }

  // Cross-style differentiation validation
  onProgress?.({ styleId: 'all', index: total, total, stage: 'Running Cross-Style Differentiation Matrix' });
  const summary = validateBlueprintBatch(blueprints);

  // Re-save blueprints with distinctiveness metrics
  for (const bp of blueprints) {
    const outPath = path.join(BLUEPRINTS_DIR, `${bp.metadata.styleId}.json`);
    await fs.promises.writeFile(outPath, JSON.stringify(bp, null, 2), 'utf-8');
  }

  return { blueprints, summary };
}

export * from './frameSampling';
export * from './eventTracker';
export * from './visionAnalyzer';
export * from './validationEngine';
