/**
 * Intelligent Asset Selection (Strategy B)
 *
 * Matches directed scenes to the best available assets based on:
 * - Visual type compatibility
 * - Mood/intent matching
 * - Search query relevance
 * - Avoidance of repetition
 *
 * Uses the indexed asset library with extended metadata tags.
 */

import type { DirectedScene, VisualType, SceneIntent } from './sceneDirector';

// ── Types ─────────────────────────────────────────────────────────────────────

export type AssetMetadata = {
  id: string;
  path: string;
  url?: string;
  type: 'image' | 'video' | 'icon' | 'illustration' | 'lottie';
  tags: string[];
  mood?: 'energetic' | 'calm' | 'professional' | 'dramatic' | 'playful' | 'somber' | 'neutral';
  lighting?: 'bright' | 'golden_hour' | 'dark' | 'studio' | 'natural' | 'neon';
  style?: 'minimalist' | 'cinematic' | 'corporate' | 'creative' | 'editorial' | 'abstract';
  category?: string;
  keywords?: string[];
};

export type MatchedAsset = {
  asset: AssetMetadata;
  score: number;
  reason: string;
};

export type SceneAssetMatch = {
  scene: number;
  matches: MatchedAsset[];
  selected: AssetMetadata | null;
};

// ── Visual type → preferred asset attributes ──────────────────────────────────

const VISUAL_TYPE_PREFERENCES: Record<VisualType, { types: AssetMetadata['type'][]; styles: string[]; moods: string[] }> = {
  cinematic_landscape: { types: ['image', 'video'], styles: ['cinematic', 'editorial'], moods: ['dramatic', 'calm'] },
  product_closeup: { types: ['image', 'video'], styles: ['minimalist', 'corporate'], moods: ['professional', 'neutral'] },
  text_overlay: { types: ['image'], styles: ['minimalist', 'abstract'], moods: ['neutral', 'professional'] },
  data_visualization: { types: ['image', 'illustration'], styles: ['corporate', 'minimalist'], moods: ['professional', 'neutral'] },
  person_portrait: { types: ['image', 'video'], styles: ['editorial', 'cinematic'], moods: ['professional', 'calm'] },
  abstract_motion: { types: ['video', 'lottie'], styles: ['abstract', 'creative'], moods: ['energetic', 'playful'] },
  icon_illustration: { types: ['icon', 'illustration', 'image'], styles: ['minimalist', 'creative'], moods: ['neutral', 'professional'] },
  screen_recording: { types: ['video', 'image'], styles: ['corporate', 'minimalist'], moods: ['professional', 'neutral'] },
  b_roll_ambient: { types: ['video', 'image'], styles: ['cinematic', 'editorial', 'creative'], moods: ['calm', 'neutral', 'dramatic'] },
};

// ── Intent → mood mapping ─────────────────────────────────────────────────────

const INTENT_MOOD_MAP: Record<SceneIntent, string[]> = {
  establish_atmosphere: ['dramatic', 'calm', 'cinematic'],
  introduce_topic: ['professional', 'neutral', 'energetic'],
  explain_concept: ['professional', 'neutral', 'calm'],
  show_example: ['neutral', 'professional', 'creative'],
  emphasize_point: ['energetic', 'dramatic', 'professional'],
  compare_contrast: ['neutral', 'professional', 'calm'],
  build_tension: ['dramatic', 'energetic', 'somber'],
  resolve_conclusion: ['calm', 'professional', 'energetic'],
  call_to_action: ['energetic', 'professional', 'playful'],
};

// ── Matcher ───────────────────────────────────────────────────────────────────

export function matchAssetsToScenes(
  scenes: DirectedScene[],
  library: AssetMetadata[],
): SceneAssetMatch[] {
  const usedAssetIds = new Set<string>();

  return scenes.map((scene) => {
    const candidates = scoreAssets(scene, library, usedAssetIds);
    const selected = candidates[0]?.asset || null;
    if (selected) usedAssetIds.add(selected.id);

    return {
      scene: scene.scene,
      matches: candidates.slice(0, 5),
      selected,
    };
  });
}

function scoreAssets(
  scene: DirectedScene,
  library: AssetMetadata[],
  usedIds: Set<string>,
): MatchedAsset[] {
  const prefs = VISUAL_TYPE_PREFERENCES[scene.visualType] || VISUAL_TYPE_PREFERENCES.b_roll_ambient;
  const intentMoods = INTENT_MOOD_MAP[scene.intent] || ['neutral'];
  const queryWords = (scene.assetQuery || '').toLowerCase().split(/\s+/).filter(Boolean);

  const scored: MatchedAsset[] = library.map((asset) => {
    let score = 0;
    const reasons: string[] = [];

    // Type match (strong signal)
    if (prefs.types.includes(asset.type)) { score += 30; reasons.push('type'); }

    // Style match
    if (asset.style && prefs.styles.includes(asset.style)) { score += 20; reasons.push('style'); }

    // Mood match (from scene intent)
    if (asset.mood && intentMoods.includes(asset.mood)) { score += 15; reasons.push('mood'); }

    // Query keyword match
    const assetText = [...(asset.tags || []), ...(asset.keywords || []), asset.category || ''].join(' ').toLowerCase();
    const queryHits = queryWords.filter((q) => assetText.includes(q)).length;
    if (queryHits > 0) { score += queryHits * 12; reasons.push(`query:${queryHits}`); }

    // Penalize reuse
    if (usedIds.has(asset.id)) { score -= 40; reasons.push('reused'); }

    return { asset, score, reason: reasons.join('+') };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ── Asset Library Loader ──────────────────────────────────────────────────────

/**
 * Load and parse the indexed asset library.
 * Currently reads from public/assets/assets.json with extended metadata.
 * In production, this could be replaced with a database query.
 */
export async function loadAssetLibrary(): Promise<AssetMetadata[]> {
  try {
    const s3Bucket = 'itnavideo-transcribe';
    const s3Region = process.env.AWS_REGION || process.env.REMOTION_AWS_REGION || 'ap-south-1';
    const s3BaseUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/itnavideo/images`;

    // Try loading from local assets.json first (has indexed metadata)
    const serveUrl = process.env.REMOTION_LAMBDA_SERVE_URL;
    if (serveUrl) {
      const baseUrl = serveUrl.replace(/\/index\.html$/, '');
      const response = await fetch(`${baseUrl}/public/assets/assets.json`).catch(() => null);
      if (response?.ok) {
        const raw = await response.text();
        if (raw) {
          const index = JSON.parse(raw);
          const assets = Array.isArray(index?.assets) ? index.assets : Array.isArray(index) ? index : [];
          const mapped = assets
            .filter((item: Record<string, unknown>) => item && (typeof item.path === 'string' || typeof item.file === 'string'))
            .map((item: Record<string, unknown>, i: number) => ({
              id: String(item.id || `asset-${i}`),
              path: String(item.file || item.path || item.src || ''),
              url: typeof item.src === 'string' ? item.src : typeof item.publicUrl === 'string' ? item.publicUrl : undefined,
              type: inferAssetType(String(item.file || item.path || item.src || '')),
              tags: Array.isArray(item.tags) ? item.tags.map(String) : extractTagsFromPath(String(item.file || item.path || '')),
              mood: inferMood(item),
              lighting: typeof item.lighting === 'string' ? item.lighting as AssetMetadata['lighting'] : inferLighting(item),
              style: typeof item.style === 'string' ? item.style as AssetMetadata['style'] : inferStyle(item),
              category: typeof item.category === 'string' ? item.category : typeof item.kind === 'string' ? String(item.kind) : undefined,
              keywords: Array.isArray(item.keywords) ? item.keywords.map(String) : undefined,
            }));
          if (mapped.length > 0) return mapped;
        }
      }
    }

    // Fallback: Load from S3 image index (itnavideo/images/)
    // This JSON file lists all images uploaded to S3 directly
    const indexUrl = `${s3BaseUrl}/index.json`;
    const s3Response = await fetch(indexUrl).catch(() => null);
    if (!s3Response?.ok) return [];

    const s3Index = await s3Response.json() as Array<{file: string; category?: string; tags?: string[]; keywords?: string[]}>;
    if (!Array.isArray(s3Index)) return [];

    return s3Index.map((item, i) => ({
      id: `s3-img-${i}-${item.file.replace(/[^a-z0-9]/gi, '-').slice(0, 40)}`,
      path: item.file,
      url: `${s3BaseUrl}/${item.file}`,
      type: inferAssetType(item.file),
      tags: item.tags || extractTagsFromPath(item.file),
      mood: 'neutral' as const,
      lighting: 'natural' as const,
      style: 'corporate' as const,
      category: item.category || inferCategoryFromPath(item.file),
      keywords: item.keywords || undefined,
    }));
  } catch {
    return [];
  }
}

function inferCategoryFromPath(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.includes('bank') || lower.includes('finance') || lower.includes('loan') || lower.includes('credit')) return 'finance';
  if (lower.includes('tech') || lower.includes('laptop') || lower.includes('code')) return 'technology';
  if (lower.includes('career') || lower.includes('office') || lower.includes('job')) return 'career';
  if (lower.includes('education') || lower.includes('study') || lower.includes('exam')) return 'education';
  if (lower.includes('lifestyle') || lower.includes('home') || lower.includes('food')) return 'lifestyle';
  return 'general';
}

function inferAssetType(filePath: string): AssetMetadata['type'] {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (['svg'].includes(ext)) return 'icon';
  if (['json', 'lottie'].includes(ext)) return 'lottie';
  if (['png', 'jpg', 'jpeg', 'webp', 'avif'].includes(ext)) return 'image';
  return 'image';
}

function extractTagsFromPath(filePath: string): string[] {
  return filePath
    .replace(/\.[^.]+$/, '')
    .split(/[/\\]/)
    .pop()
    ?.replace(/[-_]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3) || [];
}

function inferMood(item: Record<string, unknown>): AssetMetadata['mood'] {
  if (typeof item.mood === 'string') return item.mood as AssetMetadata['mood'];
  const tags = (Array.isArray(item.tags) ? item.tags.join(' ') : '').toLowerCase();
  const desc = String(item.detailedDescription || '').toLowerCase();
  const text = `${tags} ${desc}`;
  if (/energetic|vibrant|bold|bright|attention/.test(text)) return 'energetic';
  if (/calm|soft|serene|subtle|muted|minimal/.test(text)) return 'calm';
  if (/professional|corporate|business|trust/.test(text)) return 'professional';
  if (/dramatic|cinematic|moody|dark|deep/.test(text)) return 'dramatic';
  if (/playful|fun|candy|pop|creative/.test(text)) return 'playful';
  if (/somber|sad|grief|loss/.test(text)) return 'somber';
  return 'neutral';
}

function inferLighting(item: Record<string, unknown>): AssetMetadata['lighting'] {
  const text = `${Array.isArray(item.tags) ? item.tags.join(' ') : ''} ${String(item.detailedDescription || '')}`.toLowerCase();
  if (/golden.?hour|sunset|warm.?light/.test(text)) return 'golden_hour';
  if (/neon|glow|cyber|luminous/.test(text)) return 'neon';
  if (/studio|clean.?light|even.?light/.test(text)) return 'studio';
  if (/dark|night|moody|low.?key/.test(text)) return 'dark';
  if (/bright|high.?key|daylight/.test(text)) return 'bright';
  return 'natural';
}

function inferStyle(item: Record<string, unknown>): AssetMetadata['style'] {
  const style = String(item.style || '').toLowerCase();
  if (style.includes('minimal')) return 'minimalist';
  if (style.includes('cinem')) return 'cinematic';
  if (style.includes('corporate') || style.includes('business')) return 'corporate';
  if (style.includes('creative') || style.includes('playful')) return 'creative';
  if (style.includes('editorial')) return 'editorial';
  if (style.includes('abstract')) return 'abstract';
  const text = `${Array.isArray(item.tags) ? item.tags.join(' ') : ''} ${String(item.detailedDescription || '')}`.toLowerCase();
  if (/minimal|clean|simple/.test(text)) return 'minimalist';
  if (/cinematic|film|movie/.test(text)) return 'cinematic';
  if (/corporate|business|office/.test(text)) return 'corporate';
  return 'minimalist';
}
