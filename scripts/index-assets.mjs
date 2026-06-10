import {mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const assetsDir = path.join(root, 'public', 'assets');
const labelsPath = path.join(assetsDir, 'asset-labels.json');
const outPath = path.join(assetsDir, 'assets.json');
const generatedOutPath = path.join(root, 'lib', 'generated', 'reusable-assets.json');

const EXTENSION_TYPES = new Map([
  ['.png', 'image'],
  ['.jpg', 'image'],
  ['.jpeg', 'image'],
  ['.webp', 'image'],
  ['.gif', 'image'],
  ['.svg', 'image'],
  ['.avif', 'image'],
  ['.mp3', 'audio'],
  ['.wav', 'audio'],
  ['.ogg', 'audio'],
  ['.m4a', 'audio'],
  ['.ttf', 'font'],
  ['.otf', 'font'],
  ['.woff', 'font'],
  ['.woff2', 'font'],
]);

const STOP_WORDS = new Set([
  'assets',
  'asset',
  'public',
  'direct',
  'reusable',
  'images',
  'image',
  'icons',
  'icon',
  'fonts',
  'font',
  'sound',
  'sounds',
  'effects',
  'effect',
  'background',
  'backgrounds',
  'music',
  'regular',
  'static',
  'variablefont',
  'variable',
  'wght',
  'file',
  '00000000',
]);

const RANDOM_NAME_PATTERNS = [
  /^file[_-]/i,
  /^img[_-]?\d*/i,
  /^image[_-]?\d*/i,
  /^download/i,
  /^screenshot/i,
  /^[a-f0-9]{12,}$/i,
  /^\d+$/,
];

const KEYWORD_GROUPS = [
  ['finance', ['bank', 'cash', 'money', 'rupee', 'salary', 'payment', 'upi', 'card', 'register']],
  ['career', ['job', 'career', 'office', 'interview', 'employee', 'work']],
  ['education', ['study', 'student', 'school', 'college', 'exam', 'notes']],
  ['creator', ['reel', 'camera', 'recording', 'shorts', 'video']],
  ['technology', ['ai', 'software', 'app', 'ui', 'keyboard', 'typing', 'digital']],
  ['alert', ['warning', 'alert', 'danger', 'censor', 'suspicious']],
  ['success', ['success', 'unlocked', 'shabash', 'yay', 'great', 'purchase']],
  ['transition', ['whoosh', 'swoosh', 'riser', 'pop', 'ding', 'transition']],
  ['comedy', ['meme', 'laugh', 'funny', 'wow', 'oh', 'bhai']],
];

const ICON_CATEGORY_GROUPS = [
  ['money', ['coin', 'wallet', 'rupee', 'bank', 'cash', 'money', 'payment', 'upi', 'card', 'salary', 'loan', 'income', 'pension', 'transfer', 'transaction']],
  ['education', ['book', 'exam', 'certificate', 'study', 'student', 'school', 'college', 'university', 'graduation', 'course', 'class', 'notes']],
  ['business', ['growth', 'chart', 'target', 'startup', 'business', 'analytics', 'kpi', 'market', 'sales', 'briefcase']],
  ['career', ['office', 'interview', 'job', 'career', 'employee', 'work', 'resume', 'hiring', 'team']],
  ['tech', ['ai', 'robot', 'laptop', 'software', 'app', 'code', 'digital', 'keyboard', 'computer', 'cloud', 'data']],
  ['warning', ['alert', 'warning', 'danger', 'risk', 'error', 'fail', 'caution', 'problem', 'suspicious']],
  ['success', ['trophy', 'medal', 'success', 'award', 'verified', 'badge', 'check', 'winner', 'achievement', 'complete']],
  ['documents', ['checklist', 'file', 'form', 'document', 'admit', 'card', 'paper', 'certificate', 'passport', 'application']],
];

async function main() {
  const assetLabels = await readJson(labelsPath, {});
  const manualLabels = {
    ...assetLabels,
    ...sfxManifestLabels(await readJson(path.join(assetsDir, 'reusable', 'sound-effects', 'sound-effects-manifest.json'), {}), assetLabels),
    ...musicManifestLabels(await readJson(path.join(assetsDir, 'reusable', 'background-music', 'background-music-manifest.json'), {}), assetLabels),
  };
  const files = await walk(assetsDir);
  const assets = [];

  for (const file of files) {
    const asset = await toAsset(file, manualLabels);
    if (asset) assets.push(asset);
  }

  assets.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));

  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    root: '/assets',
    rules: {
      direct: 'Use for one specific page, section, workflow, or campaign.',
      reusable: 'Use for multiple templates, scenes, renders, and AI selection.',
      needsLabel: 'true means filename/folder metadata is weak and should be improved in public/assets/asset-labels.json.',
      awsRecommended: 'true means keep repo metadata only and store binary in S3/CDN for production.',
    },
    counts: countAssets(assets),
    assets,
  };

  await writeFile(outPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  await mkdir(path.dirname(generatedOutPath), {recursive: true});
  await writeFile(generatedOutPath, `${JSON.stringify({
    version: index.version,
    generatedAt: index.generatedAt,
    root: index.root,
    counts: index.counts,
    assets: index.assets.filter((asset) => asset.scope === 'reusable' && asset.type === 'image'),
  }, null, 2)}\n`, 'utf8');
  console.log(`Indexed ${assets.length} assets -> ${path.relative(root, outPath)}`);
  console.log(`Generated production image metadata -> ${path.relative(root, generatedOutPath)}`);
  console.log(`Needs labels: ${index.counts.needsLabel}; AWS recommended: ${index.counts.awsRecommended}`);
}

function sfxManifestLabels(manifest, existingLabels = {}) {
  if (!Array.isArray(manifest?.items)) return {};
  return Object.fromEntries(manifest.items
    .filter((item) => item?.file)
    .map((item) => [item.file, {
      title: item.title,
      tags: item.tags || [],
      category: item.category,
      detailedDescription: `${item.title} reusable ${item.category} sound effect. ${item.use_case || ''}`.trim(),
      style: item.style,
      useCase: item.use_case,
      qualityScore: 82,
      needsLabel: false,
      safeToUse: true,
      embeddingRef: existingLabels[item.file]?.embeddingRef || null,
    }]));
}

function musicManifestLabels(manifest, existingLabels = {}) {
  if (!Array.isArray(manifest?.items)) return {};
  return Object.fromEntries(manifest.items
    .filter((item) => item?.file)
    .map((item) => [item.file, {
      title: item.title,
      tags: item.tags || [],
      category: item.category || 'music',
      detailedDescription: `${item.title} reusable ${item.category || 'background'} music bed. ${item.use_case || ''}`.trim(),
      style: item.style,
      useCase: item.use_case,
      qualityScore: 84,
      needsLabel: false,
      safeToUse: true,
      embeddingRef: existingLabels[item.file]?.embeddingRef || null,
    }]));
}

async function walk(dir) {
  const entries = await readdir(dir, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'assets.json' || entry.name === 'asset-labels.json' || entry.name === '.gitkeep') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile() && EXTENSION_TYPES.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function toAsset(file, manualLabels) {
  const extension = path.extname(file).toLowerCase();
  const type = EXTENSION_TYPES.get(extension);
  if (!type) return null;

  const buffer = await readFile(file);
  const relative = path.relative(assetsDir, file).replaceAll(path.sep, '/');
  const publicPath = `/assets/${relative.split('/').map(encodeURIComponent).join('/')}`;
  const segments = relative.split('/');
  const scope = segments[0] === 'direct' ? 'direct' : 'reusable';
  const kind = detectKind(segments, type);
  const baseName = path.basename(file, extension);
  const manual = manualLabels[relative] || manualLabels[publicPath] || {};
  const storagePublicUrl = typeof manual.storage?.publicUrl === 'string' && manual.storage.publicUrl.trim()
    ? manual.storage.publicUrl.trim()
    : '';
  const dimensions = type === 'image' ? readImageDimensions(buffer, extension) : null;
  const tokens = tokenize([relative, manual.title, manual.category, ...(manual.tags || [])].filter(Boolean).join(' '));
  const category = kind === 'icon' ? normalizeIconCategory(manual.category, tokens) : manual.category || detectCategory(tokens, kind);
  const needsLabel = Boolean(manual.needsLabel ?? shouldNeedLabel(baseName, tokens, scope));
  const qualityScore = Number(manual.qualityScore ?? inferQualityScore({needsLabel, dimensions, type, kind}));
  const tags = unique([
    scope,
    kind,
    type,
    category,
    ...tokens,
    ...inferTags(tokens, kind, dimensions),
    ...(manual.tags || []),
  ]).slice(0, 32);

  return {
    id: manual.id || `${slugify(relative.replace(extension, ''))}-${shortHash(buffer)}`,
    title: manual.title || titleFromSlug(slugify(baseName)),
    suggestedFilename: manual.suggestedFilename || null,
    detailedDescription: manual.detailedDescription || manual.description || '',
    scope,
    kind,
    type,
    category,
    file: relative,
    src: storagePublicUrl || publicPath,
    extension: extension.slice(1),
    sizeBytes: buffer.byteLength,
    sizeKb: Math.round(buffer.byteLength / 1024),
    dimensions,
    orientation: manual.orientation || inferOrientation(dimensions),
    tags,
    keywords: tags,
    style: manual.style || null,
    useCase: manual.useCase || manual.use_case || null,
    useFor: manual.useFor || inferUseFor({scope, kind, category, tags}),
    avoidFor: manual.avoidFor || (needsLabel ? ['automatic AI selection until labeled'] : []),
    emotion: manual.emotion || inferEmotion(tags),
    qualityScore,
    usageCount: Number(manual.usageCount ?? 0),
    embeddingRef: manual.embeddingRef || null,
    needsLabel,
    safeToUse: Boolean(manual.safeToUse ?? !needsLabel),
    storage: {
      provider: manual.storage?.provider || 'local-public',
      publicUrl: storagePublicUrl || publicPath,
      awsKey: manual.storage?.awsKey || null,
      awsRecommended: Boolean(manual.storage?.awsRecommended ?? shouldUseAws({scope, kind, sizeBytes: buffer.byteLength})),
    },
  };
}

function detectKind(segments, type) {
  const folder = segments.slice(0, 3).join('/').toLowerCase();
  if (folder.includes('background-music')) return 'background-music';
  if (folder.includes('sound-effects')) return 'sound-effect';
  if (folder.includes('backgrounds')) return 'background';
  if (folder.includes('icons')) return 'icon';
  if (folder.includes('fonts')) return 'font';
  if (type === 'font') return 'font';
  if (type === 'audio') return 'sound-effect';
  return 'image';
}

function shouldUseAws({scope, kind, sizeBytes}) {
  if (scope === 'direct' && sizeBytes < 512 * 1024) return false;
  if (kind === 'icon' && sizeBytes < 256 * 1024) return false;
  return sizeBytes > 512 * 1024 || ['font', 'sound-effect', 'background-music', 'background'].includes(kind);
}

function shouldNeedLabel(baseName, tokens, scope) {
  if (scope === 'direct') return true;
  if (RANDOM_NAME_PATTERNS.some((pattern) => pattern.test(baseName))) return true;
  return tokens.filter((token) => token.length > 3).length < 2;
}

function detectCategory(tokens, kind) {
  if (kind === 'font') return 'typography';
  if (kind === 'background') return 'background';
  if (kind === 'background-music') return 'music';
  if (kind === 'icon') return detectIconCategory(tokens);
  const joined = ` ${tokens.join(' ')} `;
  for (const [category, words] of KEYWORD_GROUPS) {
    if (words.some((word) => joined.includes(` ${word} `))) return category;
  }
  return 'general';
}

function detectIconCategory(tokens) {
  const joined = ` ${tokens.join(' ')} `;
  for (const [category, words] of ICON_CATEGORY_GROUPS) {
    if (words.some((word) => joined.includes(` ${word} `))) return category;
  }
  return 'general-icon';
}

function normalizeIconCategory(category, tokens) {
  const value = String(category || '').trim().toLowerCase();
  if (value === 'money' || value === 'education' || value === 'business' || value === 'career' || value === 'tech' || value === 'warning' || value === 'success' || value === 'documents') {
    return value;
  }
  if (value === 'finance') return 'money';
  if (value === 'technology') return 'tech';
  if (value === 'alert') return 'warning';
  return detectIconCategory(tokens);
}

function inferTags(tokens, kind, dimensions) {
  const tags = [];
  if (dimensions?.width && dimensions?.height) tags.push(inferOrientation(dimensions));
  if (kind === 'font') {
    if (tokens.some((token) => ['script', 'dancing', 'tangerine', 'niconne', 'story'].includes(token))) tags.push('script');
    if (tokens.some((token) => ['sans', 'inter', 'roboto', 'lato', 'barlow'].includes(token))) tags.push('sans-serif');
    if (tokens.some((token) => ['serif', 'cinzel', 'castoro', 'pt'].includes(token))) tags.push('serif');
    if (tokens.some((token) => ['mono', 'intel'].includes(token))) tags.push('monospace');
    if (tokens.some((token) => ['bold', 'black', 'heavy', 'extrabold'].includes(token))) tags.push('bold');
    if (tokens.some((token) => ['italic'].includes(token))) tags.push('italic');
  }
  return tags;
}

function inferUseFor({scope, kind, category, tags}) {
  if (scope === 'direct') return ['specific page or campaign asset'];
  if (kind === 'icon') return [`${category} supporting callout`, '60-120px icon beside text', 'bullet point icon', 'corner card illustration'];
  if (kind === 'background') return ['template backgrounds', 'scene backdrop'];
  if (kind === 'sound-effect') return ['render sound cues', `${category} audio moments`];
  if (kind === 'background-music') return ['render background music'];
  if (kind === 'font') return ['render typography', 'template text styling'];
  if (tags.includes('portrait')) return ['vertical reel scenes'];
  return ['AI asset selection', `${category} explainer scenes`];
}

function inferEmotion(tags) {
  if (tags.some((tag) => ['warning', 'alert', 'danger', 'censor'].includes(tag))) return 'urgent';
  if (tags.some((tag) => ['success', 'unlocked', 'great', 'shabash'].includes(tag))) return 'positive';
  if (tags.some((tag) => ['meme', 'laugh', 'funny', 'wow'].includes(tag))) return 'playful';
  if (tags.some((tag) => ['whoosh', 'riser', 'transition'].includes(tag))) return 'energetic';
  return 'neutral';
}

function inferQualityScore({needsLabel, dimensions, type, kind}) {
  if (needsLabel) return 45;
  if (type === 'image' && dimensions?.width && dimensions?.height) {
    const megapixels = (dimensions.width * dimensions.height) / 1_000_000;
    return Math.max(55, Math.min(92, Math.round(70 + megapixels * 4)));
  }
  if (kind === 'font') return 72;
  if (type === 'audio') return 68;
  return 70;
}

function readImageDimensions(buffer, extension) {
  if (extension === '.png' && buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return {width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20)};
  }
  if ((extension === '.jpg' || extension === '.jpeg') && buffer.length > 4) {
    return readJpegDimensions(buffer);
  }
  return null;
}

function readJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7)};
    }
    offset += 2 + length;
  }
  return null;
}

function inferOrientation(dimensions) {
  if (!dimensions?.width || !dimensions?.height) return 'unknown';
  if (dimensions.width === dimensions.height) return 'square';
  return dimensions.width > dimensions.height ? 'landscape' : 'portrait';
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function tokenize(value) {
  return unique(
    String(value || '')
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .split(/[^a-z0-9]+/g)
      .filter((token) => token.length > 1)
      .filter((token) => !STOP_WORDS.has(token)),
  );
}

function slugify(value) {
  return String(value || 'asset')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'asset';
}

function titleFromSlug(value) {
  return String(value || 'Asset')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function unique(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

function shortHash(buffer) {
  return createHash('sha1').update(buffer).digest('hex').slice(0, 10);
}

function countAssets(assets) {
  const counts = {
    total: assets.length,
    direct: assets.filter((asset) => asset.scope === 'direct').length,
    reusable: assets.filter((asset) => asset.scope === 'reusable').length,
    images: assets.filter((asset) => asset.type === 'image').length,
    audio: assets.filter((asset) => asset.type === 'audio').length,
    fonts: assets.filter((asset) => asset.type === 'font').length,
    needsLabel: assets.filter((asset) => asset.needsLabel).length,
    safeToUse: assets.filter((asset) => asset.safeToUse).length,
    awsRecommended: assets.filter((asset) => asset.storage.awsRecommended).length,
  };

  counts.byKind = assets.reduce((acc, asset) => {
    acc[asset.kind] = (acc[asset.kind] || 0) + 1;
    return acc;
  }, {});

  return counts;
}

await main();
