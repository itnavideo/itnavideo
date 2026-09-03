/**
 * Auto B-Roll Stock Video Matcher
 *
 * Safely fetches HD stock video clips using Pexels API when available,
 * or gracefully returns null so Remotion uses clean dynamic motion themes.
 */

export interface BrollMatchResult {
  sceneIndex: number;
  query: string;
  videoUrl: string;
}

export async function matchBrollForQuery(query: string, sceneIndex: number): Promise<string | null> {
  const cleanQuery = (query || 'creator desk').trim();
  const apiKey = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(cleanQuery)}&per_page=3&orientation=landscape`, {
        headers: { Authorization: apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        const videoFiles = data.videos?.[0]?.video_files;
        if (videoFiles && videoFiles.length > 0) {
          const hdFile = videoFiles.find((f: any) => f.quality === 'hd') || videoFiles[0];
          if (hdFile?.link) return hdFile.link;
        }
      }
    } catch (err) {
      console.warn('[BROLL_MATCHER] Pexels fetch failed, falling back to dynamic gradient theme:', err);
    }
  }

  // Safely return null if no authenticated Pexels API key or fetch error
  return null;
}

export async function planBrollForScenes(
  scenes: { sceneNumber: number; brollSearchQuery?: string }[]
): Promise<Record<number, string>> {
  const brollMap: Record<number, string> = {};

  if (!scenes || scenes.length === 0) return brollMap;

  await Promise.all(
    scenes.map(async (scene, idx) => {
      const query = scene.brollSearchQuery || 'youtube creator studio';
      const videoUrl = await matchBrollForQuery(query, idx);
      if (videoUrl) {
        brollMap[scene.sceneNumber] = videoUrl;
      }
    })
  );

  return brollMap;
}
