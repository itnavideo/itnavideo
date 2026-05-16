import fs from 'fs';
import path from 'path';
import type { VisualAsset, VisualAssetType } from './visualAssets';
import { searchCloudinaryVisualAssets } from './cloudinaryAssetLibrary';
import { searchGoogleDriveVisualAssets } from './googleDriveAssetLibrary';

type LocalAssetKind = 'video' | 'image' | 'graphic' | 'sound' | 'music';

type LocalLibraryAsset = {
  id: string;
  kind: LocalAssetKind;
  title: string;
  url: string;
  tags: string[];
  score: number;
};

const PUBLIC_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public');
const LIBRARY_DIR = path.join(PUBLIC_DIR, 'asset-library');
const VISUAL_DIRS = ['videos', 'backgrounds', 'images', 'motion', 'overlays'];
const SOUND_DIRS = ['sfx', 'sounds'];
const MUSIC_DIRS = ['music'];
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm', '.m4v']);
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg']);
const GRAPHIC_EXTENSIONS = new Set(['.svg']);

export async function searchLocalVisualAssets(options: {
  query: string;
  category: string;
  types?: VisualAssetType[];
  limit?: number;
}): Promise<VisualAsset[]> {
  const wanted = new Set(options.types || ['video', 'image', 'graphic']);
  const localAssets = scanLocalAssets(VISUAL_DIRS)
    .filter((asset) => wanted.has(asset.kind as VisualAssetType))
    .map((asset) => ({
      ...asset,
      score: scoreAsset(asset, `${options.query} ${options.category}`),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const localResults = localAssets.slice(0, options.limit || 4).map((asset) => ({
    id: asset.id,
    type: asset.kind as VisualAssetType,
    title: asset.title,
    previewUrl: asset.url,
    thumbnailUrl: asset.kind === 'image' || asset.kind === 'graphic' ? asset.url : undefined,
    source: 'local' as const,
    query: options.query,
    category: options.category,
  }));

  const [driveResults, cloudinaryResults] = await Promise.all([
    searchGoogleDriveVisualAssets(options),
    searchCloudinaryVisualAssets(options),
  ]);
  return [...driveResults, ...cloudinaryResults, ...localResults].slice(0, options.limit || 4);
}

export function findLocalSoundEffect(category: string, tags: string[], fallbackPath: string) {
  if (publicFileExists(fallbackPath)) return fallbackPath;

  const query = `${category} ${tags.join(' ')}`;
  return scanLocalAssets(SOUND_DIRS)
    .filter((asset) => asset.kind === 'sound')
    .map((asset) => ({
      ...asset,
      score: scoreAsset(asset, query),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))[0]?.url || fallbackPath;
}

export function pickLocalMusicTrack(mood: string) {
  return scanLocalAssets(MUSIC_DIRS)
    .filter((asset) => asset.kind === 'music')
    .map((asset) => ({
      ...asset,
      score: scoreAsset(asset, mood),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))[0]?.url;
}

function scanLocalAssets(relativeDirs: string[]): LocalLibraryAsset[] {
  if (!fs.existsSync(LIBRARY_DIR)) return [];

  return relativeDirs.flatMap((relativeDir) => {
    const absoluteDir = path.join(LIBRARY_DIR, relativeDir);
    if (!fs.existsSync(absoluteDir)) return [];
    return walkFiles(absoluteDir).map((filePath) => toLocalAsset(filePath)).filter(Boolean) as LocalLibraryAsset[];
  });
}

function walkFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(filePath);
    return entry.isFile() ? [filePath] : [];
  });
}

function toLocalAsset(filePath: string): LocalLibraryAsset | null {
  const ext = path.extname(filePath).toLowerCase();
  const kind = getAssetKind(ext, filePath);
  if (!kind) return null;

  const relativePublicPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const title = path.basename(filePath, ext).replace(/[-_]+/g, ' ').trim();
  const folderTags = path.dirname(relativePublicPath).split(/[\\/]/g);

  return {
    id: relativePublicPath,
    kind,
    title,
    url: `/${relativePublicPath}`,
    tags: tokenize(`${title} ${folderTags.join(' ')}`),
    score: 0,
  };
}

function getAssetKind(ext: string, filePath: string): LocalAssetKind | null {
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  if (GRAPHIC_EXTENSIONS.has(ext)) return 'graphic';
  if (IMAGE_EXTENSIONS.has(ext)) return path.dirname(filePath).toLowerCase().includes('overlay') ? 'graphic' : 'image';
  if (AUDIO_EXTENSIONS.has(ext)) return path.dirname(filePath).toLowerCase().includes('music') ? 'music' : 'sound';
  return null;
}

function scoreAsset(asset: LocalLibraryAsset, query: string) {
  const queryTokens = tokenize(query);
  const tagSet = new Set(asset.tags);
  const matches = queryTokens.filter((token) => tagSet.has(token)).length;
  const broadMatch = queryTokens.some((token) => asset.title.toLowerCase().includes(token)) ? 1 : 0;
  return matches * 3 + broadMatch;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function publicFileExists(urlPath: string) {
  if (!urlPath.startsWith('/')) return false;
  return fs.existsSync(path.join(PUBLIC_DIR, urlPath.replace(/^\/+/, '')));
}
