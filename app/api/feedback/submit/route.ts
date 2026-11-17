import { NextRequest, NextResponse } from 'next/server';
import { submitUserFeedback, type UserFeedbackSubmission } from '@/services/supabase/feedbackStore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rating = body.rating;
    if (!rating || !['excellent', 'good', 'average', 'poor'].includes(rating)) {
      return NextResponse.json(
        { ok: false, error: 'A valid rating (excellent, good, average, poor) is required.' },
        { status: 400 }
      );
    }

    const feedbackType = body.feedbackType === 'general_platform' ? 'general_platform' : 'video_contextual';

    const feedbackData: UserFeedbackSubmission = {
      userId: body.userId || 'anonymous',
      userEmail: body.userEmail,
      feedbackType,
      videoId: body.videoId,
      videoType: body.videoType,
      aspectRatio: body.aspectRatio === '9:16' ? '9:16' : '16:9',
      durationSeconds: body.durationSeconds ? Number(body.durationSeconds) : undefined,
      templateStyle: body.templateStyle,
      generationSettings: body.generationSettings || {},
      rating,
      ratingScore: Number(body.ratingScore) || (rating === 'excellent' ? 4 : rating === 'good' ? 3 : rating === 'average' ? 2 : 1),
      improvementTags: Array.isArray(body.improvementTags) ? body.improvementTags : [],
      comment: body.comment ? String(body.comment).trim() : undefined,
    };

    const result = await submitUserFeedback(feedbackData);

    return NextResponse.json({
      ok: true,
      id: result.id,
      message: 'Thank you for your feedback! Your input helps us make Itnavideo better.',
    });
  } catch (error: any) {
    console.error('Error in /api/feedback/submit:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal server error submitting feedback.' },
      { status: 500 }
    );
  }
}
