import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminFeedbackList,
  getAdminFeedbackMetrics,
  updateFeedbackStatus,
} from '@/services/supabase/feedbackStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoType = searchParams.get('videoType') || undefined;
    const rating = searchParams.get('rating') || undefined;
    const status = searchParams.get('status') || undefined;
    const improvementTag = searchParams.get('improvementTag') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const limit = Number(searchParams.get('limit')) || 50;
    const offset = Number(searchParams.get('offset')) || 0;

    const [listResult, metricsResult] = await Promise.all([
      getAdminFeedbackList({
        videoType,
        rating,
        status,
        improvementTag,
        searchQuery,
        limit,
        offset,
      }),
      getAdminFeedbackMetrics(),
    ]);

    return NextResponse.json({
      ok: true,
      feedback: listResult.feedback,
      total: listResult.total,
      metrics: metricsResult,
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/feedback:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal server error fetching admin feedback.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: 'Missing id or status in request body.' },
        { status: 400 }
      );
    }

    if (!['new', 'reviewed', 'in_progress', 'resolved', 'archived'].includes(status)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid status provided.' },
        { status: 400 }
      );
    }

    const success = await updateFeedbackStatus(id, status);

    return NextResponse.json({
      ok: success,
      id,
      status,
      message: success ? 'Feedback status updated.' : 'Failed to update feedback status.',
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/admin/feedback:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal server error updating feedback.' },
      { status: 500 }
    );
  }
}
