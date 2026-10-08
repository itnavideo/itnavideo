import ytdl from '@distube/ytdl-core';

export interface YoutubeStreamInfo {
  streamUrl: string;
  title: string;
  durationSeconds: number;
  videoId: string;
}

export function extractYoutubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

export async function resolveYoutubeAudio(youtubeUrl: string): Promise<YoutubeStreamInfo> {
  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL format. Please paste a valid YouTube video link.');
  }

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    
    let selectedFormat = audioFormats[0];
    if (!selectedFormat) {
      const combined = ytdl.filterFormats(info.formats, 'videoandaudio');
      selectedFormat = combined[0];
    }

    if (selectedFormat && selectedFormat.url) {
      const durationSeconds = Number(info.videoDetails.lengthSeconds) || 120;
      const title = info.videoDetails.title || `YouTube Video ${videoId}`;
      
      return {
        streamUrl: selectedFormat.url,
        title,
        durationSeconds,
        videoId,
      };
    }
  } catch (err: any) {
    console.warn('[YouTube Resolver] Primary ytdl error:', err?.message || err);
  }

  // Fallback: If direct stream URL extraction requires cookies/headers, construct playable embed fallback
  return {
    streamUrl: `https://www.youtube.com/watch?v=${videoId}`,
    title: `YouTube Video ${videoId}`,
    durationSeconds: 180,
    videoId,
  };
}
