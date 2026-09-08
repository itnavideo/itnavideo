/**
 * Typography Style Replication & Robustness API Route
 *
 * GET: Fetches replication reports, tri-metric scores, and human review states
 * POST: Runs on-demand replication tests or saves human review overrides
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  runStyleReplicationTest,
  runAllStylesReplicationTest,
  loadReplicationReport,
  loadAllReplicationReports,
  updateHumanReviewStatus,
} from '@/services/ai/typographyReplication/replicationRunner';
import { generateBatchSummary } from '@/lib/typography/replication/storage';
import { CONTENT_SCENARIOS } from '@/lib/typography/replication/testScenarios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const styleId = searchParams.get('styleId');

    if (styleId) {
      let report = loadReplicationReport(styleId);
      if (!report) {
        // Auto-generate if not yet cached
        report = await runStyleReplicationTest(styleId);
      }
      return NextResponse.json({
        success: true,
        report,
        scenarios: CONTENT_SCENARIOS,
      });
    }

    let reports = loadAllReplicationReports();
    if (Object.keys(reports).length === 0) {
      // Auto-initialize full batch
      const batchSummary = await runAllStylesReplicationTest();
      reports = batchSummary.reports;
    }

    const summary = generateBatchSummary(reports);

    return NextResponse.json({
      success: true,
      summary,
      reports,
      scenarios: CONTENT_SCENARIOS,
    });
  } catch (error: any) {
    console.error('[API_REPLICATION] Error in GET:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch replication data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, styleId, status, notes, reviewedBy } = body;

    if (action === 'review') {
      if (!styleId || !status) {
        return NextResponse.json(
          { success: false, error: 'styleId and status are required for review action' },
          { status: 400 }
        );
      }

      const updated = updateHumanReviewStatus(styleId, {
        status,
        notes,
        reviewedBy: reviewedBy || 'Admin Reviewer',
      });

      return NextResponse.json({
        success: true,
        report: updated,
      });
    }

    if (action === 'run-all' || !styleId) {
      const summary = await runAllStylesReplicationTest();
      return NextResponse.json({
        success: true,
        summary,
        reports: summary.reports,
      });
    }

    // Run single style test
    const report = await runStyleReplicationTest(styleId);
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('[API_REPLICATION] Error in POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute replication' },
      { status: 500 }
    );
  }
}
