/**
 * Typography Style Replication & Multi-Content Robustness Test Runner
 *
 * Orchestrates full batch replication across all 10 demo reference styles
 * and evaluates Layer A (Blueprint Compliance), Layer B (Visual Style Fidelity),
 * and Multi-Content Style Robustness across 8 content scenarios.
 */

import { getAdvancedStyleBlueprint, ADVANCED_STYLE_BLUEPRINTS } from '../../../lib/typography/styleRegistry';
import { runFullStyleReplication } from './fidelityEngine';
import {
  saveReplicationReport,
  loadReplicationReport,
  loadAllReplicationReports,
  generateBatchSummary,
  updateHumanReviewStatus,
} from '../../../lib/typography/replication/storage';
import type { StyleReplicationReport, BatchReplicationSummary, HumanReviewStatus } from '../../../lib/typography/replication/types';
import { TYPOGRAPHY_STYLES } from '../../../components/typography/TypographyStylePicker';

export interface StyleSourceVideoMap {
  [styleId: string]: string;
}

export function getStyleSourceVideoMap(): StyleSourceVideoMap {
  const map: StyleSourceVideoMap = {};
  for (const item of TYPOGRAPHY_STYLES) {
    map[item.id] = item.videoSrc;
  }
  return map;
}

/**
 * Runs replication validation for a single style
 */
export async function runStyleReplicationTest(styleId: string): Promise<StyleReplicationReport> {
  const blueprint = getAdvancedStyleBlueprint(styleId);
  if (!blueprint) {
    throw new Error(`AdvancedStyleBlueprint not found for style: ${styleId}`);
  }

  const videoMap = getStyleSourceVideoMap();
  const referenceVideoUrl = videoMap[styleId] || 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783945650/professional-creator-after.mp4';

  console.log(`[REPLICATION_RUNNER] Running dual-layer replication test for ${styleId}...`);
  const report = runFullStyleReplication(styleId, blueprint, referenceVideoUrl);

  // Preserve existing human review notes/status if previously reviewed
  const existing = loadReplicationReport(styleId);
  if (existing?.humanReview && existing.humanReview.status !== 'unreviewed') {
    report.humanReview = existing.humanReview;
  }

  saveReplicationReport(report);
  console.log(`[REPLICATION_RUNNER] Completed replication test for ${styleId}: Overall: ${report.overallScore}%, Compliance: ${report.blueprintComplianceScore}%, Fidelity: ${report.visualStyleFidelityScore}%, Robustness: ${report.styleRobustnessScore}%`);

  return report;
}

/**
 * Runs replication validation across all 10 demo styles
 */
export async function runAllStylesReplicationTest(): Promise<BatchReplicationSummary> {
  console.log('\n================================================================');
  console.log('   STARTING MULTI-CONTENT STYLE ROBUSTNESS & REPLICATION SUITE  ');
  console.log('================================================================\n');

  const styleIds = [
    'dynamic-punch',
    'depth-3d-text',
    'dubai-gold',
    'neon-kinetic',
    'prism-pro',
    'paper-ii',
    'elevate-script',
    'platinum-penthouse',
    'royal-emerald',
    'silver-chrome',
  ];

  const reports: Record<string, StyleReplicationReport> = {};

  for (let i = 0; i < styleIds.length; i++) {
    const styleId = styleIds[i];
    console.log(`  [${i + 1}/${styleIds.length}] Replicating & Validating Style: ${styleId}`);
    try {
      const report = await runStyleReplicationTest(styleId);
      reports[styleId] = report;
    } catch (error) {
      console.error(`[REPLICATION_RUNNER] Error replicating style ${styleId}:`, error);
    }
  }

  const summary = generateBatchSummary(reports);

  console.log('\n================================================================');
  console.log('   BATCH REPLICATION & MULTI-CONTENT ROBUSTNESS SUMMARY         ');
  console.log('================================================================');
  console.log(`  Total Styles Tested:        ${summary.totalStylesTested}`);
  console.log(`  Average Blueprint Compliance: ${summary.averageComplianceScore}%`);
  console.log(`  Average Visual Fidelity:    ${summary.averageFidelityScore}%`);
  console.log(`  Average Style Robustness:   ${summary.averageRobustnessScore}%`);
  console.log(`  Meeting Threshold (>=80%):  ${summary.stylesMeetingThreshold} / ${summary.totalStylesTested}`);
  console.log('================================================================\n');

  return summary;
}

export {
  loadReplicationReport,
  loadAllReplicationReports,
  updateHumanReviewStatus,
};
