import {readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const visualsDir = path.join(root, 'public', 'visuals');
const labelsPath = path.join(visualsDir, 'asset-labels.json');
const outPath = path.join(visualsDir, 'asset-index.json');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm']);
const RANDOM_NAME_PATTERNS = [
  /^file[_-]/i,
  /^image[_-]?\d*/i,
  /^img[_-]?\d*/i,
  /^download/i,
  /^screenshot/i,
  /^[a-f0-9]{12,}$/i,
  /^\d+$/,
];

const CATEGORY_KEYWORDS = [
  ['finance', ['bank', 'rbi', 'loan', 'money', 'rupee', 'salary', 'payment', 'upi', 'card', 'investment']],
  ['career', ['job', 'career', 'office', 'interview', 'employee', 'students', 'campus']],
  ['education', ['notes', 'study', 'student', 'school', 'college', 'admit', 'exam']],
  ['creator', ['creator', 'reel', 'video', 'camera', 'recording', 'podcast', 'shorts']],
  ['medical', ['doctor', 'hospital', 'health', 'clinic']],
  ['technology', ['ai', 'engineer', 'dashboard', 'software', 'app', 'ui']],
];

async function main() {
  const manualLabels = await readJson(labelsPath, {});
  const files = await walk(visualsDir);
  const assets = files
    .map((file) => toAsset(file, manualLabels))
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id));

  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    root: '/visuals',
    rules: {
      needsLabel: 'true means filename is too random/generic for reliable AI asset picking.',
      safeToUse: 'false means planner should avoid this asset until metadata is manually labeled.',
    },
    counts: {
      total: assets.length,
      images: assets.filter((asset) => asset.type === 'image').length,
      videos: assets.filter((asset) => asset.type === 'video').length,
      needsLabel: assets.filter((asset) => asset.needsLabel).length,
    },
    assets,
  };

  await writeFile(outPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.log(`Indexed ${assets.length} visual assets -> ${path.relative(root, outPath)}`);
  if (index.counts.needsLabel) {
    console.log(`${index.counts.needsLabel} assets need manual labels in public/visuals/asset-labels.json`);
  }
}

async function walk(dir) {
  const entries = await readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'asset-index.json' || entry.name === 'asset-labels.json') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function toAsset(file, manualLabels) {
  const extension = path.extname(file).toLowerCase();
  const isImage = IMAGE_EXTENSIONS.has(extension);
  const isVideo = VIDEO_EXTENSIONS.has(extension);
  if (!isImage && !isVideo) return null;

  const relative = path.relative(visualsDir, file).replaceAll(path.sep, '/');
  const publicPath = `/visuals/${relative}`;
  const baseName = path.basename(file, extension);
  const manual = manualLabels[relative] || manualLabels[publicPath] || {};
  const tokens = tokenize([relative, manual.title, ...(manual.tags || [])].filter(Boolean).join(' '));
  const randomName = isRandomName(baseName);
  const category = manual.category || detectCategory(tokens);
  const tags = unique([...(manual.tags || []), ...tokens.filter((token) => token.length > 2)]).slice(0, 18);
  const semanticSlug = manual.semanticSlug || slugify(manual.title || baseName);
  const needsLabel = Boolean(manual.needsLabel ?? (randomName || tags.length < 2));

  return {
    id: manual.id || semanticSlug,
    file: relative,
    src: publicPath,
    type: isImage ? 'image' : 'video',
    category,
    title: manual.title || titleFromSlug(semanticSlug),
    semanticSlug,
    tags,
    emotion: manual.emotion || inferEmotion(tags),
    useFor: manual.useFor || inferUseFor(category, tags),
    avoidFor: manual.avoidFor || (needsLabel ? ['automatic AI selection until labeled'] : []),
    orientation: manual.orientation || inferOrientation(relative),
    qualityScore: Number(manual.qualityScore ?? (needsLabel ? 45 : 82)),
    usageCount: Number(manual.usageCount ?? 0),
    needsLabel,
    safeToUse: Boolean(manual.safeToUse ?? !needsLabel),
  };
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .split(/[^a-z0-9]+/g)
    .filter(Boolean)
    .filter((token) => !['visuals', 'public', 'thumb', 'preview', 'demo'].includes(token));
}

function isRandomName(baseName) {
  const normalized = baseName.trim();
  return RANDOM_NAME_PATTERNS.some((pattern) => pattern.test(normalized));
}

function detectCategory(tokens) {
  const joined = ` ${tokens.join(' ')} `;
  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => joined.includes(` ${keyword} `))) return category;
  }
  return 'general';
}

function inferEmotion(tags) {
  if (tags.some((tag) => ['warning', 'alert', 'risk', 'deadline'].includes(tag))) return 'urgent';
  if (tags.some((tag) => ['success', 'growth', 'career', 'salary'].includes(tag))) return 'aspirational';
  if (tags.some((tag) => ['notes', 'study', 'guide', 'explainer'].includes(tag))) return 'educational';
  return 'neutral';
}

function inferUseFor(category, tags) {
  const useFor = [`${category} explainer scenes`];
  if (tags.includes('notes')) useFor.push('notes template preview');
  if (tags.includes('creator') || tags.includes('recording')) useFor.push('creator workflow scenes');
  if (tags.includes('rbi') || tags.includes('bank')) useFor.push('finance and banking reels');
  return unique(useFor);
}

function inferOrientation(relative) {
  if (/full-screen|reel|notes|facecam|explainer/i.test(relative)) return 'portrait';
  return 'unknown';
}

function slugify(value) {
  return String(value || 'visual-asset')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'visual-asset';
}

function titleFromSlug(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function unique(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

await main();
