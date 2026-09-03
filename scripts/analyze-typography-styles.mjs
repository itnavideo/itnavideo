#!/usr/bin/env node
/**
 * CLI Runner: Advanced Typography Style Reverse-Engineering Analyzer
 *
 * Analyzes reference demo videos in the Typography section, extracts temporal motion
 * and design system properties using FFmpeg + Gemini Vision, computes property confidence,
 * runs differentiation tests, and saves machine-readable Style Blueprints to lib/typography/blueprints/.
 *
 * Usage:
 *   node scripts/analyze-typography-styles.mjs
 *   node scripts/analyze-typography-styles.mjs --style=dynamic-punch
 *   node scripts/analyze-typography-styles.mjs --force
 */

import { loadEnvLocal } from './load-env-local.mjs';
import path from 'node:path';
import fs from 'node:fs';

loadEnvLocal();

// Execute TypeScript service via tsx/ts-node or child process runner
async function run() {
  console.log('================================================================');
  console.log('   ADVANCED TYPOGRAPHY STYLE REVERSE-ENGINEERING ANALYZER       ');
  console.log('================================================================\n');

  const args = process.argv.slice(2);
  const targetStyle = args.find((a) => a.startsWith('--style='))?.split('=')[1];
  const force = args.includes('--force');

  // Dynamic import of the analyzer service
  // Since we are in an ES module and the project uses Next.js tsconfig paths,
  // we can run the analysis via tsx or inline runner
  const { execSync } = await import('node:child_process');

  const tsRunnerScript = path.join(process.cwd(), 'scripts', 'run-typography-analyzer.ts');

  // Create temporary TS runner file
  const tsContent = `
import {
  analyzeAllTypographyDemos,
  analyzeTypographyVideo,
  DEMO_TYPOGRAPHY_VIDEOS
} from '../services/ai/typographyAnalyzer';

async function main() {
  const targetStyle = '${targetStyle || ''}';
  const force = ${force};

  if (targetStyle) {
    const demo = DEMO_TYPOGRAPHY_VIDEOS.find(d => d.styleId === targetStyle);
    if (!demo) {
      console.error('Style not found in registry: ' + targetStyle);
      process.exit(1);
    }
    console.log('Analyzing single style: ' + demo.name + ' (' + demo.styleId + ')...');
    const blueprint = await analyzeTypographyVideo(demo.sourceVideoUrl, demo);
    console.log('\\n[SUCCESS] Style Blueprint Generated for ' + demo.name + ':');
    console.log('  Font Category: ' + blueprint.typography.fontCategory.value);
    console.log('  Font Family: ' + blueprint.typography.fontFamilyEstimate.value);
    console.log('  Entrance Motion: ' + blueprint.animation.entrance.type.value);
    console.log('  Easing: ' + blueprint.animation.entrance.easing.value);
    console.log('  Accent Color: ' + blueprint.color.accentColor.value);
    console.log('  Tracked Events: ' + blueprint.trackedEvents.length);
    console.log('  Overall Confidence: ' + (blueprint.metadata.overallConfidence * 100).toFixed(0) + '%');
    console.log('  Validation Status: ' + blueprint.validation.status);
  } else {
    console.log('Starting Batch Analysis of all ' + DEMO_TYPOGRAPHY_VIDEOS.length + ' Typography Demo Videos...\\n');
    const { blueprints, summary } = await analyzeAllTypographyDemos((p) => {
      console.log('  [' + p.index + '/' + p.total + '] ' + p.stage + ' (' + p.styleId + ')');
    });

    console.log('\\n================================================================');
    console.log('   BATCH ANALYSIS & DIFFERENTIATION SUMMARY                      ');
    console.log('================================================================');
    console.log('  Total Blueprints Generated: ' + blueprints.length);
    console.log('  Valid Styles: ' + summary.validCount);
    console.log('  Flagged for Review: ' + summary.flaggedCount);
    console.log('  Overall Health Score: ' + summary.overallHealthScore + '%\\n');

    console.log('Distinctiveness Matrix:');
    Object.entries(summary.distinctivenessMatrix).forEach(([id, score]) => {
      console.log('  - ' + id.padEnd(22) + ': ' + score + '% distinct');
    });
  }
}

main().catch(err => {
  console.error('Analysis failed:', err);
  process.exit(1);
});
`;

  await fs.promises.writeFile(tsRunnerScript, tsContent, 'utf-8');

  try {
    execSync(`npx tsx ${tsRunnerScript}`, {
      stdio: 'inherit',
      env: { ...process.env },
    });
  } finally {
    try {
      await fs.promises.unlink(tsRunnerScript);
    } catch {
      // Ignore unlink
    }
  }
}

run().catch((err) => {
  console.error('[CLI ERROR]', err);
  process.exit(1);
});
