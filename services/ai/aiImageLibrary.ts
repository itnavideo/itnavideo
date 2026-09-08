import libraryData from '@/lib/cloudinary/ai-video-library.json';

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

const typedCatalog = libraryData as AiLibraryImage[];

/**
 * Return all images currently cataloged in the ChatGPT Cloudinary library
 */
export function getAllLibraryImages(): AiLibraryImage[] {
  return typedCatalog;
}

/**
 * Filter library images by target aspect ratio
 */
export function getLibraryImagesByAspectRatio(aspectRatio: '16:9' | '9:16'): AiLibraryImage[] {
  const matched = typedCatalog.filter(
    (img) => (img.aspectRatio || '16:9') === aspectRatio
  );
  return matched.length > 0 ? matched : typedCatalog;
}

/**
 * Return unique categories in the library
 */
export function getLibraryCategories(): string[] {
  return Array.from(new Set(typedCatalog.map((img) => img.category).filter(Boolean)));
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

  let pool = typedCatalog;

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
