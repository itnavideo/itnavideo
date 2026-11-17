import { createSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';

export interface UserFeedbackSubmission {
  userId: string;
  userEmail?: string;
  feedbackType: 'video_contextual' | 'general_platform';
  videoId?: string;
  videoType?: string;
  aspectRatio?: '16:9' | '9:16';
  durationSeconds?: number;
  templateStyle?: string;
  generationSettings?: Record<string, any>;
  rating: 'excellent' | 'good' | 'average' | 'poor';
  ratingScore: number; // 4: Excellent, 3: Good, 2: Average, 1: Poor
  improvementTags: string[];
  comment?: string;
}

export interface FeedbackRecord extends UserFeedbackSubmission {
  id: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'archived';
  createdAt: string;
}

export interface FeedbackFilterOptions {
  videoType?: string;
  rating?: string;
  status?: string;
  improvementTag?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export interface FeedbackMetricsSummary {
  totalSubmissions: number;
  averageRatingScore: number;
  ratingBreakdown: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  topProblems: Array<{ tag: string; count: number; percentage: number }>;
  videoTypeBreakdown: Array<{ videoType: string; count: number }>;
}

// In-memory fallback storage for dev environments without Supabase
const localDevFeedbackMemory: FeedbackRecord[] = [];

/**
 * Inserts a new user feedback record into Supabase.
 */
export async function submitUserFeedback(data: UserFeedbackSubmission): Promise<{ ok: boolean; id: string; error?: string }> {
  const cleanUserId = String(data.userId || 'anonymous').trim();
  const feedbackRecord: FeedbackRecord = {
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: cleanUserId,
    userEmail: data.userEmail ? String(data.userEmail).trim() : undefined,
    feedbackType: data.feedbackType,
    videoId: data.videoId ? String(data.videoId).trim() : undefined,
    videoType: data.videoType ? String(data.videoType).trim() : undefined,
    aspectRatio: data.aspectRatio,
    durationSeconds: data.durationSeconds ? Number(data.durationSeconds) : undefined,
    templateStyle: data.templateStyle ? String(data.templateStyle).trim() : undefined,
    generationSettings: data.generationSettings || {},
    rating: data.rating,
    ratingScore: data.ratingScore,
    improvementTags: Array.isArray(data.improvementTags) ? data.improvementTags : [],
    comment: data.comment ? String(data.comment).trim() : undefined,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseServerConfigured()) {
    localDevFeedbackMemory.unshift(feedbackRecord);
    return { ok: true, id: feedbackRecord.id };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data: inserted, error } = await supabase
      .from('video_feedback')
      .insert({
        user_id: feedbackRecord.userId,
        user_email: feedbackRecord.userEmail || null,
        feedback_type: feedbackRecord.feedbackType,
        video_id: feedbackRecord.videoId || null,
        video_type: feedbackRecord.videoType || null,
        aspect_ratio: feedbackRecord.aspectRatio || null,
        duration_seconds: feedbackRecord.durationSeconds || null,
        template_style: feedbackRecord.templateStyle || null,
        generation_settings: feedbackRecord.generationSettings,
        rating: feedbackRecord.rating,
        rating_score: feedbackRecord.ratingScore,
        improvement_tags: feedbackRecord.improvementTags,
        comment: feedbackRecord.comment || null,
        status: feedbackRecord.status,
      })
      .select('id')
      .single();

    if (error) {
      console.warn('[feedbackStore] Database insert error, using local memory fallback:', error.message);
      localDevFeedbackMemory.unshift(feedbackRecord);
      return { ok: true, id: feedbackRecord.id };
    }

    return { ok: true, id: inserted?.id || feedbackRecord.id };
  } catch (err: any) {
    console.error('[feedbackStore] Error submitting feedback:', err.message);
    localDevFeedbackMemory.unshift(feedbackRecord);
    return { ok: true, id: feedbackRecord.id };
  }
}

/**
 * Returns filtered feedback records for the Admin Dashboard.
 */
export async function getAdminFeedbackList(
  filters: FeedbackFilterOptions = {}
): Promise<{ feedback: FeedbackRecord[]; total: number }> {
  const limit = Math.max(1, Math.min(100, filters.limit || 50));
  const offset = Math.max(0, filters.offset || 0);

  if (!isSupabaseServerConfigured()) {
    let list = [...localDevFeedbackMemory];
    if (filters.videoType) list = list.filter((f) => f.videoType === filters.videoType);
    if (filters.rating) list = list.filter((f) => f.rating === filters.rating);
    if (filters.status) list = list.filter((f) => f.status === filters.status);
    if (filters.improvementTag) list = list.filter((f) => f.improvementTags.includes(filters.improvementTag!));
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter((f) => (f.comment && f.comment.toLowerCase().includes(q)) || (f.userEmail && f.userEmail.toLowerCase().includes(q)));
    }
    return { feedback: list.slice(offset, offset + limit), total: list.length };
  }

  try {
    const supabase = createSupabaseServerClient();
    let query = supabase.from('video_feedback').select('*', { count: 'exact' });

    if (filters.videoType) query = query.eq('video_type', filters.videoType);
    if (filters.rating) query = query.eq('rating', filters.rating);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.improvementTag) query = query.contains('improvement_tags', [filters.improvementTag]);
    if (filters.searchQuery) {
      query = query.or(`comment.ilike.%${filters.searchQuery}%,user_email.ilike.%${filters.searchQuery}%`);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) {
      console.warn('[feedbackStore] Error fetching feedback list:', error.message);
      return { feedback: localDevFeedbackMemory.slice(offset, offset + limit), total: localDevFeedbackMemory.length };
    }

    const records: FeedbackRecord[] = (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      userEmail: row.user_email,
      feedbackType: row.feedback_type,
      videoId: row.video_id,
      videoType: row.video_type,
      aspectRatio: row.aspect_ratio,
      durationSeconds: row.duration_seconds,
      templateStyle: row.template_style,
      generationSettings: row.generation_settings,
      rating: row.rating,
      ratingScore: row.rating_score,
      improvementTags: row.improvement_tags || [],
      comment: row.comment,
      status: row.status,
      createdAt: row.created_at,
    }));

    return { feedback: records, total: count || records.length };
  } catch (err: any) {
    console.error('[feedbackStore] Error in getAdminFeedbackList:', err.message);
    return { feedback: localDevFeedbackMemory.slice(offset, offset + limit), total: localDevFeedbackMemory.length };
  }
}

/**
 * Computes aggregated feedback analytics metrics for the Admin Dashboard.
 */
export async function getAdminFeedbackMetrics(): Promise<FeedbackMetricsSummary> {
  let allRecords: FeedbackRecord[] = [];

  if (!isSupabaseServerConfigured()) {
    allRecords = [...localDevFeedbackMemory];
  } else {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from('video_feedback').select('*').limit(2000);
      if (error || !data) {
        allRecords = [...localDevFeedbackMemory];
      } else {
        allRecords = data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          userEmail: row.user_email,
          feedbackType: row.feedback_type,
          videoId: row.video_id,
          videoType: row.video_type,
          aspectRatio: row.aspect_ratio,
          durationSeconds: row.duration_seconds,
          templateStyle: row.template_style,
          generationSettings: row.generation_settings,
          rating: row.rating,
          ratingScore: row.rating_score,
          improvementTags: row.improvement_tags || [],
          comment: row.comment,
          status: row.status,
          createdAt: row.created_at,
        }));
      }
    } catch {
      allRecords = [...localDevFeedbackMemory];
    }
  }

  const total = allRecords.length;
  if (total === 0) {
    return {
      totalSubmissions: 0,
      averageRatingScore: 0,
      ratingBreakdown: { excellent: 0, good: 0, average: 0, poor: 0 },
      topProblems: [],
      videoTypeBreakdown: [],
    };
  }

  const ratingBreakdown = { excellent: 0, good: 0, average: 0, poor: 0 };
  let scoreSum = 0;
  const tagCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  allRecords.forEach((r) => {
    if (r.rating in ratingBreakdown) {
      ratingBreakdown[r.rating]++;
    }
    scoreSum += r.ratingScore || 2;

    (r.improvementTags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const vType = r.videoType || 'general';
    typeCounts[vType] = (typeCounts[vType] || 0) + 1;
  });

  const averageRatingScore = Number((scoreSum / total).toFixed(2));

  const topProblems = Object.entries(tagCounts)
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const videoTypeBreakdown = Object.entries(typeCounts)
    .map(([videoType, count]) => ({ videoType, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalSubmissions: total,
    averageRatingScore,
    ratingBreakdown,
    topProblems,
    videoTypeBreakdown,
  };
}

/**
 * Updates the administrative status of a feedback item.
 */
export async function updateFeedbackStatus(
  id: string,
  status: 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'archived'
): Promise<boolean> {
  const cleanId = String(id).trim();

  const memIdx = localDevFeedbackMemory.findIndex((f) => f.id === cleanId);
  if (memIdx !== -1) {
    localDevFeedbackMemory[memIdx].status = status;
  }

  if (!isSupabaseServerConfigured()) return true;

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('video_feedback').update({ status }).eq('id', cleanId);
    return !error;
  } catch (err: any) {
    console.error('[feedbackStore] Error updating feedback status:', err.message);
    return false;
  }
}
