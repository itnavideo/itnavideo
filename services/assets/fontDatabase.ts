import { listGoogleDriveAssets } from './googleDriveAssetLibrary';
import type { AvailableFontDatabaseItem } from '../ai/timelineGenerator';

const FONT_DATABASE_TTL_MS = 10 * 60 * 1000;
const FONT_LIMIT = 500;
const WEIGHT_TOKENS = new Set([
  'thin',
  'extralight',
  'extra light',
  'light',
  'regular',
  'medium',
  'semibold',
  'semi bold',
  'bold',
  'extrabold',
  'extra bold',
  'black',
  'italic',
  'variable',
]);

let cachedFonts: { expiresAt: number; fonts: AvailableFontDatabaseItem[] } | null = null;

export async function getAvailableFontsDatabase(): Promise<AvailableFontDatabaseItem[]> {
  if (cachedFonts && cachedFonts.expiresAt > Date.now()) {
    return cachedFonts.fonts;
  }

  try {
    const fontAssets = await listGoogleDriveAssets({ kind: 'font', limit: FONT_LIMIT });
    const fontsByName = new Map<string, AvailableFontDatabaseItem>();

    for (const asset of fontAssets) {
      const category = String(asset.category || 'Drive Font');
      const fontName = inferFontName(String(asset.title || ''), category);
      if (!fontName) continue;

      const normalizedName = normalizeKey(fontName);
      const existing = fontsByName.get(normalizedName);
      const candidate = {
        font_id: asset.driveFileId ? `drive:${asset.driveFileId}` : asset.id,
        font_name: fontName,
        category: category.includes('google') ? 'Google' : category.includes('other') ? 'Custom' : 'Drive',
        vibe: inferFontVibe(`${fontName} ${category}`),
      };

      if (!existing || scoreFontId(candidate.font_id) > scoreFontId(existing.font_id)) {
        fontsByName.set(normalizedName, candidate);
      }
    }

    const fonts = Array.from(fontsByName.values()).sort((a, b) => a.font_name.localeCompare(b.font_name));
    cachedFonts = { fonts, expiresAt: Date.now() + FONT_DATABASE_TTL_MS };
    return fonts;
  } catch (error) {
    console.warn('Drive font database scan failed; continuing without injected font inventory:', error);
    cachedFonts = { fonts: [], expiresAt: Date.now() + 60_000 };
    return cachedFonts.fonts;
  }
}

export function mergeAvailableFontsDatabases(
  explicitFonts: AvailableFontDatabaseItem[],
  scannedFonts: AvailableFontDatabaseItem[],
): AvailableFontDatabaseItem[] {
  const fontsById = new Map<string, AvailableFontDatabaseItem>();

  for (const font of [...explicitFonts, ...scannedFonts]) {
    if (!font.font_id || !font.font_name) continue;
    fontsById.set(font.font_id, font);
  }

  return Array.from(fontsById.values());
}

function inferFontName(title: string, category: string) {
  const categoryParts = category.split(/[\\/]/).map(cleanName).filter(Boolean);
  const folderFamily = [...categoryParts].reverse().find((part) => part && !isGenericFontFolder(part));

  if (folderFamily && !isWeightOnly(folderFamily)) {
    return folderFamily;
  }

  const titleParts = cleanName(title)
    .split(/\s+/)
    .filter((part) => !WEIGHT_TOKENS.has(part.toLowerCase()));

  return titleParts.join(' ').trim() || cleanName(title);
}

function inferFontVibe(value: string) {
  const text = value.toLowerCase();
  if (hasAny(text, ['anton', 'bebas', 'impact', 'black', 'extrabold', 'extra bold', 'heavy', 'display'])) return 'Ultra-Bold / Retention';
  if (hasAny(text, ['inter', 'roboto', 'geist', 'montserrat', 'poppins', 'sans', 'corporate', 'tech'])) return 'Clean / Corporate';
  if (hasAny(text, ['playfair', 'merriweather', 'lora', 'serif', 'cinzel', 'editorial'])) return 'Elegant / Storytelling';
  if (hasAny(text, ['comic', 'fredoka', 'baloo', 'bangers', 'luckiest', 'rounded', 'kids', 'game'])) return 'Playful / Gaming';
  return 'Modern / General';
}

function cleanName(value: string) {
  return value
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGenericFontFolder(value: string) {
  return ['font', 'fonts', 'google fonts', 'googlefonts', 'otherfonts', 'other fonts', 'custom fonts', 'drive'].includes(value.toLowerCase());
}

function isWeightOnly(value: string) {
  return WEIGHT_TOKENS.has(value.toLowerCase());
}

function scoreFontId(value: string) {
  return value.startsWith('drive:') ? 2 : 1;
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function hasAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}
