import type { VisualAsset, VisualAssetType } from './visualAssets';

type CloudinaryResource = {
  asset_id?: string;
  public_id?: string;
  secure_url?: string;
  resource_type?: string;
  display_name?: string;
  filename?: string;
  asset_folder?: string;
  tags?: string[];
};

type IndexedCloudinaryAsset = {
  id: string;
  type: VisualAssetType;
  title: string;
  url: string;
  folder: string;
  tags: string[];
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedAssets: { expiresAt: number; assets: IndexedCloudinaryAsset[] } | null = null;

export async function searchCloudinaryVisualAssets(options: {
  query: string;
  category: string;
  types?: VisualAssetType[];
  limit?: number;
}): Promise<VisualAsset[]> {
  const wanted = new Set(options.types || ['video', 'image', 'graphic']);
  if (!isCloudinaryConfigured()) return [];

  const assets = await getCloudinaryVisualAssets();
  return assets
    .filter((asset) => wanted.has(asset.type))
    .map((asset) => ({
      asset,
      score: scoreAsset(asset, `${options.query} ${options.category}`),
    }))
    .sort((a, b) => b.score - a.score || a.asset.title.localeCompare(b.asset.title))
    .slice(0, options.limit || 4)
    .map(({ asset }) => ({
      id: asset.id,
      type: asset.type,
      title: asset.title,
      previewUrl: asset.url,
      thumbnailUrl: asset.type === 'image' || asset.type === 'graphic' ? asset.url : undefined,
      source: 'cloudinary' as const,
      query: options.query,
      category: options.category,
    }));
}

async function getCloudinaryVisualAssets() {
  if (cachedAssets && cachedAssets.expiresAt > Date.now()) return cachedAssets.assets;

  const folders = [
    process.env.CLOUDINARY_SCREENSHOTS_FOLDER || 'Screenshots',
    process.env.CLOUDINARY_BACKGROUNDS_FOLDER || 'Background Images MP4',
  ].filter(Boolean);

  const assets = (await Promise.all(folders.map((folder) => listCloudinaryFolder(folder)))).flat();
  cachedAssets = { assets, expiresAt: Date.now() + CACHE_TTL_MS };
  return assets;
}

async function listCloudinaryFolder(folder: string): Promise<IndexedCloudinaryAsset[]> {
  const result = await cloudinarySearch(`asset_folder="${folder}"`);
  const resources = Array.isArray(result.resources) ? result.resources as CloudinaryResource[] : [];

  return resources
    .map((resource) => toIndexedAsset(resource, folder))
    .filter(Boolean) as IndexedCloudinaryAsset[];
}

async function cloudinarySearch(expression: string): Promise<{ resources?: unknown[] }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expression,
      max_results: 500,
      sort_by: [{ public_id: 'asc' }],
    }),
  });

  if (!response.ok) {
    console.warn(`Cloudinary asset search failed for "${expression}": ${response.status}`);
    return {};
  }

  return response.json();
}

function toIndexedAsset(resource: CloudinaryResource, folder: string): IndexedCloudinaryAsset | null {
  const url = resource.secure_url;
  const publicId = resource.public_id || resource.asset_id;
  if (!url || !publicId) return null;

  const type = resource.resource_type === 'video' ? 'video' : resource.resource_type === 'image' ? 'image' : null;
  if (!type) return null;

  const title = resource.display_name || resource.filename || publicId.split('/').pop() || publicId;
  return {
    id: publicId,
    type,
    title: title.replace(/[-_]+/g, ' ').trim(),
    url,
    folder,
    tags: tokenize(`${title} ${folder} ${(resource.tags || []).join(' ')}`),
  };
}

function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function scoreAsset(asset: IndexedCloudinaryAsset, query: string) {
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
