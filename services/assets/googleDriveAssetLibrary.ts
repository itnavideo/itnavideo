import path from 'path';
import { isGoogleDriveConfigured, listGoogleDriveChildren } from './googleDriveClient.js';
import type { VisualAsset, VisualAssetType } from './visualAssets';

type DriveFile = {
  id: string;
  name: string;
  mimeType?: string;
  size?: string;
  thumbnailLink?: string;
};

type IndexedDriveAsset = VisualAsset & {
  tags: string[];
  folderPath: string;
};

type DriveAssetKind = VisualAssetType | 'sound' | 'music' | 'font' | null;

const FOLDER_MIME = 'application/vnd.google-apps.folder';
const CACHE_TTL_MS = 5 * 60 * 1000;
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm', '.m4v']);
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg']);
const FONT_EXTENSIONS = new Set(['.ttf', '.otf']);
const GRAPHIC_EXTENSIONS = new Set(['.svg']);
const ANIMATED_GRAPHIC_EXTENSIONS = new Set(['.json', '.lottie']);

let cachedIndex: { expiresAt: number; assets: IndexedDriveAsset[] } | null = null;

export async function searchGoogleDriveVisualAssets(options: {
  query: string;
  category: string;
  types?: VisualAssetType[];
  limit?: number;
}): Promise<VisualAsset[]> {
  const wanted = new Set(options.types || ['video', 'image', 'graphic']);
  const assets = await getIndexedDriveAssets();

  return assets
    .filter((asset) => wanted.has(asset.type))
    .map((asset) => ({
      asset,
      score: scoreAsset(asset, `${options.query} ${options.category}`),
    }))
    .sort((a, b) => b.score - a.score || String(a.asset.title || '').localeCompare(String(b.asset.title || '')))
    .slice(0, options.limit || 4)
    .map(({ asset }) => stripIndexFields(asset));
}

export async function listGoogleDriveAssets(options: {
  kind?: 'visual' | 'audio' | 'font' | 'all';
  query?: string;
  limit?: number;
} = {}) {
  const query = options.query || '';
  const kind = options.kind || 'all';
  const assets = await getIndexedDriveAssets();

  return assets
    .filter((asset) => {
      if (kind === 'all') return true;
      if (kind === 'visual') return ['video', 'image', 'graphic'].includes(asset.type);
      if (kind === 'audio') return asset.category.includes('music') || asset.category.includes('sound') || asset.category.includes('sfx');
      return asset.category.includes('font');
    })
    .map((asset) => ({ asset, score: scoreAsset(asset, query) }))
    .sort((a, b) => b.score - a.score || String(a.asset.title || '').localeCompare(String(b.asset.title || '')))
    .slice(0, options.limit || 80)
    .map(({ asset }) => stripIndexFields(asset));
}

async function getIndexedDriveAssets() {
  if (cachedIndex && cachedIndex.expiresAt > Date.now()) return cachedIndex.assets;
  if (!isGoogleDriveConfigured()) {
    cachedIndex = { assets: [], expiresAt: Date.now() + CACHE_TTL_MS };
    return cachedIndex.assets;
  }

  const rootFolderId = process.env.GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID;
  if (!rootFolderId) return [];

  const assets = await walkDriveFolder(rootFolderId, []);
  cachedIndex = { assets, expiresAt: Date.now() + CACHE_TTL_MS };
  return assets;
}

async function walkDriveFolder(folderId: string, folderPath: string[], depth = 0): Promise<IndexedDriveAsset[]> {
  if (depth > 5) return [];

  const items = await listGoogleDriveChildren(folderId) as DriveFile[];
  const results: IndexedDriveAsset[] = [];

  for (const item of items) {
    if (item.mimeType === FOLDER_MIME) {
      results.push(...await walkDriveFolder(item.id, [...folderPath, item.name], depth + 1));
      continue;
    }

    const asset = toDriveAsset(item, folderPath);
    if (asset) results.push(asset);
  }

  return results;
}

function toDriveAsset(file: DriveFile, folderPath: string[]): IndexedDriveAsset | null {
  const kind = getAssetKind(file.name, file.mimeType || '', folderPath);
  if (!kind) return null;

  const normalizedFolder = folderPath.map(normalizeToken).filter(Boolean).join('/');
  const title = path.basename(file.name, path.extname(file.name)).replace(/[-_]+/g, ' ').trim();
  const category = normalizedFolder || kind;
  const previewUrl = `/api/assets/drive/download?id=${encodeURIComponent(file.id)}`;

  return {
    id: `drive:${file.id}`,
    type: kind === 'font' || kind === 'sound' || kind === 'music' ? 'graphic' : kind,
    title,
    previewUrl,
    thumbnailUrl: file.thumbnailLink || (kind === 'image' || kind === 'graphic' ? previewUrl : undefined),
    source: 'drive',
    query: '',
    category,
    driveFileId: file.id,
    mimeType: file.mimeType,
    sizeBytes: Number(file.size || 0) || undefined,
    folderPath: normalizedFolder,
    tags: tokenize(`${title} ${file.name} ${folderPath.join(' ')} ${kind}`),
  };
}

function stripIndexFields(asset: IndexedDriveAsset): VisualAsset {
  const { tags: _tags, folderPath: _folderPath, ...rest } = asset;
  return rest;
}

function getAssetKind(fileName: string, mimeType: string, folderPath: string[]): DriveAssetKind {
  const ext = path.extname(fileName).toLowerCase();
  const folderText = folderPath.join(' ').toLowerCase();

  if (FONT_EXTENSIONS.has(ext) || folderText.includes('font')) return 'font';
  if (AUDIO_EXTENSIONS.has(ext)) return folderText.includes('music') || folderText.includes('bgm') ? 'music' : 'sound';
  if (VIDEO_EXTENSIONS.has(ext) || mimeType.startsWith('video/')) return 'video';
  if (GRAPHIC_EXTENSIONS.has(ext)) return 'graphic';
  if (ANIMATED_GRAPHIC_EXTENSIONS.has(ext) && hasIconFolderSignal(folderText)) return 'graphic';
  if (IMAGE_EXTENSIONS.has(ext) || mimeType.startsWith('image/')) {
    return folderText.includes('icon') || folderText.includes('symbol') || folderText.includes('overlay') ? 'graphic' : 'image';
  }

  return null;
}

function hasIconFolderSignal(folderText: string) {
  return folderText.includes('icon') ||
    folderText.includes('symbol') ||
    folderText.includes('lottie') ||
    folderText.includes('animation');
}

function scoreAsset(asset: IndexedDriveAsset, query: string) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return 1;

  const tagSet = new Set(asset.tags);
  const matches = queryTokens.filter((token) => tagSet.has(token)).length;
  const broadMatch = queryTokens.some((token) => String(asset.title || '').toLowerCase().includes(token)) ? 1 : 0;
  return matches * 3 + broadMatch;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function normalizeToken(value: string) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
