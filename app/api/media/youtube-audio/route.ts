import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { extractYoutubeId } from '@/lib/media/youtubeResolver';
import { trimMediaToMp3AndUpload } from '@/lib/media/facelessAudioTrim';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FACELESS_AUDIO_SECONDS = 300; // 5 minutes max

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const youtubeUrl = String(body.youtubeUrl || '').trim();
    const userId = String(body.userId || 'guest_user').trim();

    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json(
        { ok: false, error: 'Invalid YouTube URL. Please paste a valid youtube.com or youtu.be link.' },
        { status: 400 }
      );
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    let info: ytdl.videoInfo;
    try {
      info = await ytdl.getInfo(canonicalUrl);
    } catch (err: any) {
      console.error('[YOUTUBE_AUDIO] Failed to fetch video info:', err?.message || err);
      return NextResponse.json(
        {
          ok: false,
          error: 'Could not access this YouTube video (it may be private, age-restricted, or temporarily blocked). Please try another link or upload the audio file directly.',
        },
        { status: 422 }
      );
    }

    const originalDurationSeconds = Number(info.videoDetails?.lengthSeconds) || 0;
    const title = String(info.videoDetails?.title || `YouTube Video ${videoId}`).trim();
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const selectedFormat =
      audioFormats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0] ||
      ytdl.filterFormats(info.formats, 'videoandaudio')[0];

    if (!selectedFormat) {
      return NextResponse.json(
        { ok: false, error: 'No playable audio stream found for this YouTube video.' },
        { status: 422 }
      );
    }

    const ytStream = ytdl.downloadFromInfo(info, { format: selectedFormat });
    const safeSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || videoId;

    const { mediaKey, audioUrl } = await trimMediaToMp3AndUpload({
      inputStream: ytStream,
      maxSeconds: MAX_FACELESS_AUDIO_SECONDS,
      userId,
      fileName: `yt-${safeSlug}-5m.mp3`,
    });

    const trimmedDurationSeconds =
      originalDurationSeconds > 0
        ? Math.min(MAX_FACELESS_AUDIO_SECONDS, originalDurationSeconds)
        : MAX_FACELESS_AUDIO_SECONDS;

    return NextResponse.json({
      ok: true,
      videoId,
      title,
      mediaKey,
      audioUrl,
      originalDurationSeconds,
      trimmedDurationSeconds,
      wasTrimmed: originalDurationSeconds > MAX_FACELESS_AUDIO_SECONDS,
    });
  } catch (err: any) {
    console.error('[YOUTUBE_AUDIO] Extraction failed:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to extract audio from YouTube link.' },
      { status: 500 }
    );
  }
}

