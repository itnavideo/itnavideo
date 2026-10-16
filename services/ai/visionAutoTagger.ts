/**
 * Vision AI Analysis & Auto-Tagging Service
 * 
 * Analyzes user-uploaded photos and video clips using Google Gemini Cloud Vision
 * to extract rich contextual tags, subject descriptions, and scene relevance scores.
 * 
 * Strict Host Environment Rule: Zero local models (no local CLIP/Whisper).
 * 100% cloud-based via Gemini 2.0/2.5 Flash Vision.
 */

export interface TaggedMediaAsset {
  key: string;
  url: string;
  fileName: string;
  title: string;
  tags: string[];
  description: string;
  mediaType: 'image' | 'video';
}

const TAG_CACHE = new Map<string, TaggedMediaAsset>();

/**
 * Extracts descriptive keywords from a filename as a fast, deterministic baseline.
 */
function extractFilenameTags(fileName: string): string[] {
  const clean = (fileName || '')
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_.]+/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .toLowerCase();

  return clean
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['img', 'image', 'video', 'file', 'photo', 'clip', 'asset'].includes(w));
}

/**
 * Tags an array of user-uploaded media files using Gemini Vision cloud API.
 */
export async function autoTagUploadedMediaAssets(
  assets: Array<{ key: string; url: string; fileName?: string }>
): Promise<TaggedMediaAsset[]> {
  if (!assets || assets.length === 0) return [];

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const modelName = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();

  const results: TaggedMediaAsset[] = [];
  const assetsNeedingVision: Array<{
    asset: { key: string; url: string; fileName?: string };
    index: number;
    mimeType: string;
    base64Data?: string;
  }> = [];

  // 1. Check in-memory cache first & detect media type
  assets.forEach((asset, idx) => {
    const isVideo = /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(asset.url) ||
      /\.(mp4|webm|mov|m4v)$/i.test(asset.fileName || '');
    const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';

    const cacheKey = `${asset.url}_${asset.fileName || ''}`;
    if (TAG_CACHE.has(cacheKey)) {
      results[idx] = TAG_CACHE.get(cacheKey)!;
      return;
    }

    const baselineTags = extractFilenameTags(asset.fileName || asset.key);
    results[idx] = {
      key: asset.key,
      url: asset.url,
      fileName: asset.fileName || asset.key,
      title: (asset.fileName || 'Uploaded Media').replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
      tags: baselineTags,
      description: baselineTags.join(', '),
      mediaType,
    };

    // Images can be analyzed directly with Gemini Vision
    if (!isVideo && apiKey) {
      assetsNeedingVision.push({
        asset,
        index: idx,
        mimeType: asset.url.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg',
      });
    }
  });

  if (assetsNeedingVision.length === 0 || !apiKey) {
    return results;
  }

  // 2. Fetch images and convert to base64 for Gemini Vision (in batches of up to 4)
  const BATCH_SIZE = 4;
  for (let b = 0; b < assetsNeedingVision.length; b += BATCH_SIZE) {
    const batch = assetsNeedingVision.slice(b, b + BATCH_SIZE);

    try {
      // Fetch binary data in parallel with timeout
      await Promise.all(
        batch.map(async (item) => {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7000);
            const res = await fetch(item.asset.url, { signal: controller.signal });
            clearTimeout(timeout);
            if (res.ok) {
              const buffer = await res.arrayBuffer();
              item.base64Data = Buffer.from(buffer).toString('base64');
            }
          } catch {
            // Silently fall back to baseline filename tags
          }
        })
      );

      const itemsWithData = batch.filter((item) => Boolean(item.base64Data));
      if (itemsWithData.length === 0) continue;

      const contentsParts: any[] = [
        {
          text: `You are an expert AI computer vision analyzer for video editing, b-roll matching, and script alignment.
Analyze each provided image and output descriptive tags, title, and visual description for scene matching.

For each image, provide:
1. "title": A concise 3-5 word title (e.g. "Modern Electric Sports Car")
2. "tags": 10-15 specific, high-intent keywords describing subjects, concepts, actions, environment (e.g. ["car", "automotive", "sports car", "electric vehicle", "speed", "highway", "luxury", "transportation"])
3. "description": A 1-sentence description of the visual scene.
4. "category": e.g. "finance", "real_estate", "technology", "automotive", "lifestyle", "business", "nature"

Return ONLY a valid JSON array matching the number of images:
[
  {
    "title": "Title",
    "tags": ["tag1", "tag2", "tag3"],
    "description": "Short description",
    "category": "technology"
  }
]`,
        },
      ];

      itemsWithData.forEach((item, i) => {
        contentsParts.push({ text: `\nImage #${i + 1} (fileName: ${item.asset.fileName || item.asset.key}):` });
        contentsParts.push({
          inlineData: {
            mimeType: item.mimeType,
            data: item.base64Data!,
          },
        });
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: contentsParts }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          if (Array.isArray(parsed)) {
            parsed.forEach((itemRes, i) => {
              const target = itemsWithData[i];
              if (target && itemRes) {
                const combinedTags = Array.from(
                  new Set([
                    ...(Array.isArray(itemRes.tags) ? itemRes.tags.map((t: string) => t.toLowerCase().trim()) : []),
                    ...results[target.index].tags,
                  ])
                ).filter(Boolean);

                const updated: TaggedMediaAsset = {
                  ...results[target.index],
                  title: itemRes.title || results[target.index].title,
                  tags: combinedTags,
                  description: itemRes.description || results[target.index].description,
                };

                results[target.index] = updated;
                const cacheKey = `${target.asset.url}_${target.asset.fileName || ''}`;
                TAG_CACHE.set(cacheKey, updated);
              }
            });
          }
        }
      }
    } catch (batchErr) {
      console.warn('[VisionAutoTagger] Gemini Vision batch analysis error, using baseline tags:', batchErr);
    }
  }

  return results;
}
