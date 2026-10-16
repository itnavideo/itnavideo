import { readUnifiedAssets } from './assetPicker';
import { toAbsoluteS3AssetUrl } from '@/constants/itnavideoStockAssets';

export interface AiLibraryImage {
  id: string;
  public_id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
  visualDescription?: string;
  mood?: string;
  aspectRatio?: '16:9' | '9:16' | string;
  dominantColor?: string;
}

let cachedLibraryImages: AiLibraryImage[] | null = null;

function getVerifiedCatalog(): AiLibraryImage[] {
  if (cachedLibraryImages) return cachedLibraryImages;

  try {
    const unified = readUnifiedAssets();
    const mapped = unified
      .filter((asset) => asset.type === 'image' && asset.safeToUse && asset.src)
      .map((asset) => {
        const absoluteUrl = toAbsoluteS3AssetUrl(asset.src);
        return {
          id: asset.id,
          public_id: asset.id,
          url: absoluteUrl,
          title: asset.title || 'Curated Scene Visual',
          category: asset.category || 'all',
          tags: [...(asset.tags || []), ...(asset.keywords || [])],
          visualDescription: asset.detailedDescription || asset.title || '',
          mood: asset.style || 'cinematic',
          aspectRatio: ((asset as any).orientation === 'portrait' ? '9:16' : '16:9') as '16:9' | '9:16',
          dominantColor: '#0E1526',
        };
      });

    if (mapped.length > 0) {
      cachedLibraryImages = mapped;
      return mapped;
    }
  } catch (err) {
    console.warn('[aiImageLibrary] Could not read unified assets, using fallback:', err);
  }

  // Safe fallback if unified index unavailable
  cachedLibraryImages = [
    {
      id: 'default-cinematic-bg',
      public_id: 'default-cinematic-bg',
      url: toAbsoluteS3AssetUrl('assets/reusable/backgrounds/cinematic-studio-bg.png'),
      title: 'Cinematic Studio Background',
      category: 'background',
      tags: ['cinematic', 'studio', 'dark', 'background'],
      aspectRatio: '16:9',
    },
  ];
  return cachedLibraryImages;
}

/**
 * Return all images currently cataloged in the verified S3 asset library
 */
export function getAllLibraryImages(): AiLibraryImage[] {
  return getVerifiedCatalog();
}

/**
 * Filter library images by target aspect ratio
 */
export function getLibraryImagesByAspectRatio(aspectRatio: '16:9' | '9:16'): AiLibraryImage[] {
  const catalog = getVerifiedCatalog();
  const matched = catalog.filter(
    (img) => (img.aspectRatio || '16:9') === aspectRatio
  );
  return matched.length > 0 ? matched : catalog;
}

/**
 * Return unique categories in the library
 */
export function getLibraryCategories(): string[] {
  return Array.from(new Set(getVerifiedCatalog().map((img) => img.category).filter(Boolean)));
}

/**
 * Search the library by keyword query with optional category and aspect ratio filters
 */
export function searchLibraryImages(
  query: string,
  options?: {
    category?: string;
    aspectRatio?: '16:9' | '9:16';
  }
): AiLibraryImage[] {
  const cleanTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  let pool = getVerifiedCatalog();

  if (options?.aspectRatio) {
    const ratioPool = pool.filter((img) => (img.aspectRatio || '16:9') === options.aspectRatio);
    if (ratioPool.length > 0) pool = ratioPool;
  }

  if (options?.category) {
    const catPool = pool.filter((img) => img.category.toLowerCase() === options.category?.toLowerCase());
    if (catPool.length > 0) pool = catPool;
  }

  if (cleanTokens.length === 0) return pool;

  return pool.filter((img) => {
    const haystack = [
      img.title,
      img.category,
      img.visualDescription || '',
      img.mood || '',
      ...img.tags,
    ]
      .join(' ')
      .toLowerCase();

    return cleanTokens.some((token) => haystack.includes(token));
  });
}
