import { listGoogleDriveAssets } from './googleDriveAssetLibrary';

export type AvailableIconDatabaseItem = {
  icon_id: string;
  icon_name: string;
  category: 'Material Symbols' | 'Color Icons' | 'Animated Icons' | 'Custom Icons' | 'Drive Icons';
  style: string;
  tags: string[];
};

const ICON_DATABASE_TTL_MS = 10 * 60 * 1000;
const ICON_LIMIT = 2000;

let cachedIcons: { expiresAt: number; icons: AvailableIconDatabaseItem[] } | null = null;

export async function getAvailableIconsDatabase(): Promise<AvailableIconDatabaseItem[]> {
  if (cachedIcons && cachedIcons.expiresAt > Date.now()) {
    return cachedIcons.icons;
  }

  try {
    const visualAssets = await listGoogleDriveAssets({ kind: 'visual', limit: ICON_LIMIT });
    const iconsById = new Map<string, AvailableIconDatabaseItem>();

    for (const asset of visualAssets) {
      const haystack = `${asset.title || ''} ${asset.category || ''} ${asset.mimeType || ''}`.toLowerCase();
      if (!isIconAsset(haystack)) continue;

      const icon = {
        icon_id: asset.driveFileId ? `drive:${asset.driveFileId}` : asset.id,
        icon_name: normalizeIconName(String(asset.title || asset.id)),
        category: inferIconCategory(haystack),
        style: inferIconStyle(haystack),
        tags: tokenize(`${asset.title || ''} ${asset.category || ''}`),
      };

      if (icon.icon_name) {
        iconsById.set(icon.icon_id, icon);
      }
    }

    const icons = Array.from(iconsById.values()).sort((a, b) => a.icon_name.localeCompare(b.icon_name));
    cachedIcons = { icons, expiresAt: Date.now() + ICON_DATABASE_TTL_MS };
    return icons;
  } catch (error) {
    console.warn('Drive icon database scan failed; continuing without injected icon inventory:', error);
    cachedIcons = { icons: [], expiresAt: Date.now() + 60_000 };
    return cachedIcons.icons;
  }
}

export function mergeAvailableIconsDatabases(
  explicitIcons: AvailableIconDatabaseItem[],
  scannedIcons: AvailableIconDatabaseItem[],
): AvailableIconDatabaseItem[] {
  const iconsById = new Map<string, AvailableIconDatabaseItem>();

  for (const icon of [...explicitIcons, ...scannedIcons]) {
    if (!icon.icon_id || !icon.icon_name) continue;
    iconsById.set(icon.icon_id, icon);
  }

  return Array.from(iconsById.values());
}

function isIconAsset(value: string) {
  return value.includes('icon') ||
    value.includes('icons') ||
    value.includes('symbol') ||
    value.includes('symbols') ||
    value.includes('material_symbols') ||
    value.includes('material symbols') ||
    value.includes('lottie');
}

function inferIconCategory(value: string): AvailableIconDatabaseItem['category'] {
  if (value.includes('material_symbols') || value.includes('material symbols')) return 'Material Symbols';
  if (value.includes('animated') || value.includes('lottie')) return 'Animated Icons';
  if (value.includes('color')) return 'Color Icons';
  if (value.includes('custom') || value.includes('other')) return 'Custom Icons';
  return 'Drive Icons';
}

function inferIconStyle(value: string) {
  const styles = [
    ['outlined', 'Outlined'],
    ['rounded', 'Rounded'],
    ['sharp', 'Sharp'],
    ['filled', 'Filled'],
    ['two tone', 'Two Tone'],
    ['twotone', 'Two Tone'],
    ['color', 'Color'],
    ['animated', 'Animated'],
    ['lottie', 'Animated'],
  ] as const;

  return styles.find(([token]) => value.includes(token))?.[1] || 'Monochrome';
}

function normalizeIconName(value: string) {
  return value
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/^material symbols?/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1);
}
