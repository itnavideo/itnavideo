import catalogData from './assets.json';

export type CloudinaryAsset = {
  public_id: string;
  filename: string;
  format: string;
  resource_type: string;
  secure_url: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
};

export type CloudinaryCatalog = Record<string, CloudinaryAsset[]>;

const catalog = catalogData as CloudinaryCatalog;

/**
 * Get all assets for a specific Cloudinary folder
 */
export function getAssetsByFolder(folder: string): CloudinaryAsset[] {
  return catalog[folder] || [];
}

/**
 * Get a specific SFX by name or fuzzy keyword match
 */
export function getSfxUrl(keyword: string): string | null {
  const sfxList = catalog['SFX'] || [];
  const cleanKey = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Exact match
  const exact = sfxList.find(s => s.filename.toLowerCase().includes(cleanKey));
  if (exact) return exact.secure_url;

  // Fallback to first available SFX
  return sfxList.length > 0 ? sfxList[0].secure_url : null;
}

/**
 * Get Background Music URL by mood / style
 */
export function getBackgroundMusicUrl(mood?: string): string | null {
  const musicList = catalog['Background Music'] || [];
  if (musicList.length === 0) return null;

  if (mood) {
    const cleanMood = mood.toLowerCase();
    const match = musicList.find(m => m.filename.toLowerCase().includes(cleanMood));
    if (match) return match.secure_url;
  }

  return musicList[0].secure_url;
}

/**
 * Get Background Image URL
 */
export function getBackgroundImageUrl(style?: string): string | null {
  const bgList = catalog['background images'] || [];
  if (bgList.length === 0) return null;

  if (style) {
    const cleanStyle = style.toLowerCase();
    const match = bgList.find(b => b.filename.toLowerCase().includes(cleanStyle));
    if (match) return match.secure_url;
  }

  return bgList[0].secure_url;
}

/**
 * Get Website / Visual image URL by name
 */
export function getWebsiteImageUrl(name: string): string | null {
  const siteImages = catalog['Website use images'] || [];
  const cleanName = name.toLowerCase();
  const match = siteImages.find(img => img.filename.toLowerCase().includes(cleanName));
  return match ? match.secure_url : null;
}

export { catalog };
