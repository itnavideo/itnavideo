import { createSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';
import { PLATFORM_MODE_CONFIG, getTodayDateIST, getNextResetTimestampIST } from '@/lib/config/platformMode';

// In-memory fallback for local dev environments where Supabase is not configured
const localDevDownloadsMemory = new Map<string, Set<string>>(); // key: `${userId}_${dateIST}`, value: Set<videoId>

export interface UserDailyDownloadStats {
  userId: string;
  dateIST: string;
  used: number;
  limit: number;
  remaining: number;
  downloadedVideoIds: string[];
  resetsAt: string;
  resetsInFormatted: string;
}

export interface ClaimDownloadRequest {
  userId: string;
  videoId: string;
  videoType: string;
  outputUrl?: string;
  fileName?: string;
}

export interface ClaimDownloadResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  alreadyClaimed: boolean;
  resetsAt: string;
  resetsInFormatted: string;
  error?: string;
}

/**
 * Returns the user's daily download usage in Asia/Kolkata (IST) timezone.
 */
export async function getUserDailyDownloads(userId: string): Promise<UserDailyDownloadStats> {
  const cleanUserId = String(userId || '').trim();
  const dateIST = getTodayDateIST();
  const limit = PLATFORM_MODE_CONFIG.DAILY_FREE_DOWNLOAD_LIMIT;
  const resetInfo = getNextResetTimestampIST();

  if (!cleanUserId || cleanUserId === 'anonymous') {
    return {
      userId: cleanUserId,
      dateIST,
      used: 0,
      limit,
      remaining: limit,
      downloadedVideoIds: [],
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  }

  // Fallback if Supabase not configured in dev
  if (!isSupabaseServerConfigured()) {
    const memoryKey = `${cleanUserId}_${dateIST}`;
    const downloadedSet = localDevDownloadsMemory.get(memoryKey) || new Set<string>();
    const used = downloadedSet.size;
    return {
      userId: cleanUserId,
      dateIST,
      used,
      limit,
      remaining: Math.max(0, limit - used),
      downloadedVideoIds: Array.from(downloadedSet),
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('video_downloads')
      .select('video_id')
      .eq('user_id', cleanUserId)
      .eq('download_date_ist', dateIST)
      .eq('status', 'completed');

    if (error) {
      console.warn('[downloadStore] Error reading user daily downloads:', error.message);
      // Fallback to local memory on transient database error
      const memoryKey = `${cleanUserId}_${dateIST}`;
      const downloadedSet = localDevDownloadsMemory.get(memoryKey) || new Set<string>();
      const used = downloadedSet.size;
      return {
        userId: cleanUserId,
        dateIST,
        used,
        limit,
        remaining: Math.max(0, limit - used),
        downloadedVideoIds: Array.from(downloadedSet),
        resetsAt: resetInfo.resetIso,
        resetsInFormatted: resetInfo.formattedTime,
      };
    }

    const uniqueVideoIds = Array.from(new Set((data || []).map((row) => String(row.video_id))));
    const used = uniqueVideoIds.length;

    return {
      userId: cleanUserId,
      dateIST,
      used,
      limit,
      remaining: Math.max(0, limit - used),
      downloadedVideoIds: uniqueVideoIds,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  } catch (err: any) {
    console.error('[downloadStore] Unexpected error querying downloads:', err.message);
    return {
      userId: cleanUserId,
      dateIST,
      used: 0,
      limit,
      remaining: limit,
      downloadedVideoIds: [],
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  }
}

/**
 * Atomically attempts to claim a download for a specific video on today's IST calendar date.
 * If the user has already downloaded this exact video today, it allows it without consuming an extra quota unit.
 */
export async function claimVideoDownload(req: ClaimDownloadRequest): Promise<ClaimDownloadResult> {
  const cleanUserId = String(req.userId || '').trim();
  const cleanVideoId = String(req.videoId || '').trim();
  const dateIST = getTodayDateIST();
  const limit = PLATFORM_MODE_CONFIG.DAILY_FREE_DOWNLOAD_LIMIT;
  const resetInfo = getNextResetTimestampIST();

  if (!cleanUserId || cleanUserId === 'anonymous') {
    return {
      allowed: false,
      used: 0,
      limit,
      remaining: 0,
      alreadyClaimed: false,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
      error: 'Please sign in or create an account to download your video.',
    };
  }

  if (!cleanVideoId) {
    return {
      allowed: false,
      used: 0,
      limit,
      remaining: 0,
      alreadyClaimed: false,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
      error: 'Missing videoId for download claim.',
    };
  }

  // 1. Check current daily usage
  const currentStats = await getUserDailyDownloads(cleanUserId);

  // 2. Idempotency check: if already downloaded today, permit re-download with no quota penalty
  if (currentStats.downloadedVideoIds.includes(cleanVideoId)) {
    return {
      allowed: true,
      used: currentStats.used,
      limit,
      remaining: currentStats.remaining,
      alreadyClaimed: true,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  }

  // 3. Quota check
  if (currentStats.used >= limit) {
    return {
      allowed: false,
      used: currentStats.used,
      limit,
      remaining: 0,
      alreadyClaimed: false,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
      error: `You have used your 2 free downloads for today. Your allowance resets in ${resetInfo.formattedTime} (12:00 AM IST).`,
    };
  }

  // 4. Record new download
  if (!isSupabaseServerConfigured()) {
    const memoryKey = `${cleanUserId}_${dateIST}`;
    const downloadedSet = localDevDownloadsMemory.get(memoryKey) || new Set<string>();
    downloadedSet.add(cleanVideoId);
    localDevDownloadsMemory.set(memoryKey, downloadedSet);

    const newUsed = downloadedSet.size;
    return {
      allowed: true,
      used: newUsed,
      limit,
      remaining: Math.max(0, limit - newUsed),
      alreadyClaimed: false,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('video_downloads').insert({
      user_id: cleanUserId,
      video_id: cleanVideoId,
      video_type: req.videoType || 'generic',
      download_date_ist: dateIST,
      output_url: req.outputUrl || null,
      file_name: req.fileName || null,
      status: 'completed',
    });

    if (error) {
      // Check for compound key conflict (if parallel request just succeeded)
      if (error.code === '23505' || error.message.includes('unique constraint')) {
        return {
          allowed: true,
          used: currentStats.used + 1,
          limit,
          remaining: Math.max(0, limit - (currentStats.used + 1)),
          alreadyClaimed: true,
          resetsAt: resetInfo.resetIso,
          resetsInFormatted: resetInfo.formattedTime,
        };
      }
      console.warn('[downloadStore] Error writing download record to Supabase:', error.message);
    }

    const newUsed = currentStats.used + 1;
    return {
      allowed: true,
      used: newUsed,
      limit,
      remaining: Math.max(0, limit - newUsed),
      alreadyClaimed: false,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  } catch (err: any) {
    console.error('[downloadStore] Unexpected error inserting download:', err.message);
    // Allow download even if logging failed, so user is not blocked
    return {
      allowed: true,
      used: currentStats.used + 1,
      limit,
      remaining: Math.max(0, limit - (currentStats.used + 1)),
      alreadyClaimed: false,
      resetsAt: resetInfo.resetIso,
      resetsInFormatted: resetInfo.formattedTime,
    };
  }
}
