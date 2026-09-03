/**
 * Replication Reports & Human Review Storage
 *
 * Persists replication benchmarks, multi-content robustness tests,
 * fidelity scorecards, and human review states in `lib/typography/replication/results/`
 */

import fs from 'fs';
import path from 'path';
import type { StyleReplicationReport, BatchReplicationSummary, HumanReviewStatus } from './types';

const RESULTS_DIR = path.join(process.cwd(), 'lib', 'typography', 'replication', 'results');

function ensureDirExists() {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
}

export function saveReplicationReport(report: StyleReplicationReport): void {
  ensureDirExists();
  const filePath = path.join(RESULTS_DIR, `${report.styleId}-replication.json`);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
}

export function loadReplicationReport(styleId: string): StyleReplicationReport | null {
  try {
    const filePath = path.join(RESULTS_DIR, `${styleId}-replication.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as StyleReplicationReport;
    }
  } catch (error) {
    console.error(`[STORAGE] Failed to load replication report for ${styleId}:`, error);
  }
  return null;
}

export function loadAllReplicationReports(): Record<string, StyleReplicationReport> {
  ensureDirExists();
  const reports: Record<string, StyleReplicationReport> = {};

  try {
    const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith('-replication.json'));
    for (const file of files) {
      const styleId = file.replace('-replication.json', '');
      const report = loadReplicationReport(styleId);
      if (report) {
        reports[styleId] = report;
      }
    }
  } catch (error) {
    console.error('[STORAGE] Failed to load all replication reports:', error);
  }

  return reports;
}

export function updateHumanReviewStatus(
  styleId: string,
  review: { status: HumanReviewStatus['status']; notes?: string; reviewedBy?: string }
): StyleReplicationReport | null {
  const report = loadReplicationReport(styleId);
  if (!report) return null;

  report.humanReview = {
    status: review.status,
    notes: review.notes ?? report.humanReview?.notes,
    reviewedBy: review.reviewedBy ?? 'Admin',
    reviewedAt: new Date().toISOString(),
  };

  saveReplicationReport(report);
  return report;
}

export function generateBatchSummary(reports: Record<string, StyleReplicationReport>): BatchReplicationSummary {
  const list = Object.values(reports);
  const total = list.length;

  if (total === 0) {
    return {
      totalStylesTested: 0,
      averageComplianceScore: 0,
      averageFidelityScore: 0,
      averageRobustnessScore: 0,
      stylesMeetingThreshold: 0,
      stylesFlaggedForReview: 0,
      reports: {},
      timestamp: new Date().toISOString(),
    };
  }

  const avgCompliance = Math.round(list.reduce((acc, r) => acc + r.blueprintComplianceScore, 0) / total);
  const avgFidelity = Math.round(list.reduce((acc, r) => acc + r.visualStyleFidelityScore, 0) / total);
  const avgRobustness = Math.round(list.reduce((acc, r) => acc + r.styleRobustnessScore, 0) / total);
  const meetingThreshold = list.filter((r) => r.overallScore >= 80).length;
  const flagged = list.filter((r) => r.humanReview?.status === 'needs-review' || r.overallScore < 70).length;

  return {
    totalStylesTested: total,
    averageComplianceScore: avgCompliance,
    averageFidelityScore: avgFidelity,
    averageRobustnessScore: avgRobustness,
    stylesMeetingThreshold: meetingThreshold,
    stylesFlaggedForReview: flagged,
    reports,
    timestamp: new Date().toISOString(),
  };
}
