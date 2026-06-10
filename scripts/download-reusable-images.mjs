import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {loadEnvLocal} from './load-env-local.mjs';

const root = process.cwd();
loadEnvLocal(root);

const outRoot = path.join(root, 'public', 'assets', 'reusable', 'images');
const labelsPath = path.join(root, 'public', 'assets', 'asset-labels.json');
const limitPerCategory = readNumber('REUSABLE_IMAGE_LIMIT_PER_CATEGORY', 10);
const perSourceLimit = readNumber('REUSABLE_IMAGE_PER_SOURCE_LIMIT', 4);
const timeoutMs = readNumber('REUSABLE_IMAGE_DOWNLOAD_TIMEOUT_MS', 16000);
const dryRun = process.argv.includes('--dry-run');
const uploadS3 = process.argv.includes('--upload-s3') || process.env.REUSABLE_IMAGE_UPLOAD_S3 === 'true';
const syncExistingS3 = process.argv.includes('--sync-existing-s3');
const s3Config = getS3Config();
const s3 = uploadS3 && s3Config ? new S3Client({
  region: s3Config.region,
  credentials: s3Config.accessKeyId && s3Config.secretAccessKey
    ? {accessKeyId: s3Config.accessKeyId, secretAccessKey: s3Config.secretAccessKey}
    : undefined,
}) : null;

const categories = [
  {slug: 'finance-banking', query: 'India bank branch customer service banking documents office', queries: ['bank branch customer service India', 'banking office customer documents', 'bank advisor finance paperwork'], tags: ['india', 'finance', 'banking', 'documents']},
  {slug: 'finance-stock-market', query: 'India stock market trading charts investor finance laptop', queries: ['stock market trading laptop charts', 'investor looking at stock market chart', 'financial market chart office laptop'], tags: ['india', 'finance', 'stock market', 'trading']},
  {slug: 'finance-money-cash', query: 'Indian rupee cash money finance counting savings', tags: ['india', 'finance', 'rupee', 'cash']},
  {slug: 'finance-loans-credit', query: 'India loan credit card bank advisor paperwork customer', tags: ['india', 'finance', 'loan', 'credit']},
  {slug: 'finance-insurance', query: 'India insurance advisor family paperwork financial planning', tags: ['india', 'finance', 'insurance', 'family']},
  {slug: 'finance-tax-budget', query: 'India tax budget calculator documents finance desk', queries: ['tax documents calculator desk', 'budget planning calculator finance documents', 'income tax paperwork calculator'], tags: ['india', 'finance', 'tax', 'budget']},
  {slug: 'finance-mobile-payment-upi', query: 'India UPI mobile payment QR code shop customer phone', queries: ['QR code payment shop India', 'mobile payment shop customer phone', 'cashless payment India store'], tags: ['india', 'finance', 'upi', 'mobile payment']},

  {slug: 'jobs-government', query: 'India government job application documents office candidate', tags: ['india', 'jobs', 'government', 'career']},
  {slug: 'jobs-private-office', query: 'Indian office job interview resume professional laptop', tags: ['india', 'jobs', 'office', 'interview']},
  {slug: 'jobs-interview', query: 'Indian job interview professional candidate office meeting', tags: ['india', 'jobs', 'interview', 'career']},
  {slug: 'jobs-career-growth', query: 'Indian professional career growth office laptop success', tags: ['india', 'career', 'professional', 'growth']},

  {slug: 'education-exam-prep', query: 'Indian student exam preparation notebook study desk', tags: ['india', 'education', 'exam', 'study']},
  {slug: 'education-college-students', query: 'Indian college students campus laptop backpack studying', tags: ['india', 'education', 'college', 'students']},
  {slug: 'education-classroom', query: 'Indian classroom teacher students learning school', tags: ['india', 'education', 'classroom', 'teacher']},
  {slug: 'education-online-learning', query: 'Indian student online learning laptop headphones home', tags: ['india', 'education', 'online learning', 'laptop']},

  {slug: 'india-streets-city', query: 'India city street people traffic shops realistic', tags: ['india', 'street', 'city', 'people']},
  {slug: 'india-market-shops', query: 'Indian street market vendors shops customers realistic', tags: ['india', 'market', 'shops', 'vendors']},
  {slug: 'india-small-business-shop', query: 'Indian small business owner shop customer payment', tags: ['india', 'small business', 'shop', 'customer']},
  {slug: 'india-local-office', query: 'Indian office business meeting laptop professional team', tags: ['india', 'office', 'business', 'meeting']},

  {slug: 'documents-forms', query: 'India official documents forms paperwork desk checklist', tags: ['india', 'documents', 'forms', 'paperwork']},
  {slug: 'documents-certificates', query: 'India certificate document paperwork official desk', tags: ['india', 'documents', 'certificate', 'official']},
  {slug: 'documents-application', query: 'India application form documents pen desk paperwork', tags: ['india', 'documents', 'application', 'form']},

  {slug: 'creator-video-recording', query: 'Indian content creator recording video camera studio', tags: ['india', 'creator', 'recording', 'video']},
  {slug: 'creator-phone-reels', query: 'Indian creator recording reel smartphone tripod ring light', tags: ['india', 'creator', 'reels', 'phone']},
  {slug: 'creator-podcast-studio', query: 'Indian podcaster microphone studio content creator', tags: ['india', 'creator', 'podcast', 'studio']},

  {slug: 'news-announcement', query: 'India news update announcement document laptop office', tags: ['india', 'news', 'announcement', 'update']},
  {slug: 'news-government-office', query: 'India government office building public notice documents', tags: ['india', 'news', 'government', 'notice']},
  {slug: 'startup-ai-tech', query: 'India artificial intelligence startup laptop dashboard technology', tags: ['india', 'ai', 'startup', 'technology']},
];

const labels = await readJson(labelsPath, {});
const summary = [];

if (uploadS3 && !s3Config) {
  throw new Error('S3 upload requested, but AWS_ASSET_BUCKET, AWS_ASSET_REGION, and AWS_ASSET_BASE_URL are not configured.');
}

if (syncExistingS3) {
  const synced = await syncExistingLocalImagesToS3();
  await writeFile(labelsPath, `${JSON.stringify(labels, null, 2)}\n`);
  console.log(`Synced existing local images to S3: ${synced}`);
  process.exit(0);
}

for (const category of categories) {
  const categoryDir = path.join(outRoot, category.slug);
  await mkdir(categoryDir, {recursive: true});
  const existing = await countExistingImages(categoryDir);
  let needed = Math.max(0, limitPerCategory - existing);
  if (!needed) {
    summary.push({category: category.slug, existing, downloaded: 0, skipped: 'already-enough'});
    continue;
  }

  const candidates = [
    ...await fetchPexels(category, Math.min(perSourceLimit, needed)),
    ...await fetchUnsplash(category, Math.min(perSourceLimit, needed)),
    ...await fetchPixabay(category, Math.min(perSourceLimit, needed)),
    ...await fetchWikimedia(category, needed),
  ];

  let downloaded = 0;
  const seen = new Set();
  for (const candidate of candidates) {
    if (downloaded >= needed) break;
    if (!candidate.url || seen.has(candidate.url)) continue;
    seen.add(candidate.url);
    const saved = await downloadCandidate(category, candidate);
    if (saved) downloaded += 1;
  }

  summary.push({category: category.slug, existing, needed, candidates: candidates.length, downloaded});
  await writeFile(labelsPath, `${JSON.stringify(labels, null, 2)}\n`);
  console.log(`Saved progress for ${category.slug}: downloaded ${downloaded}, existing ${existing}.`);
  await sleep(readNumber('REUSABLE_IMAGE_CATEGORY_DELAY_MS', 900));
}

await writeFile(labelsPath, `${JSON.stringify(labels, null, 2)}\n`);
console.table(summary);

async function fetchPexels(category, limit) {
  const key = clean(process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY);
  if (!key || limit <= 0) return [];
  try {
    const results = [];
    const perPage = Math.min(80, Math.max(1, limit));
    for (const query of categoryQueries(category)) {
      for (let page = 1; results.length < limit && page <= Math.ceil(limit / perPage); page += 1) {
        const url = new URL('https://api.pexels.com/v1/search');
        url.searchParams.set('query', query);
        url.searchParams.set('per_page', String(perPage));
        url.searchParams.set('page', String(page));
        url.searchParams.set('orientation', 'portrait');
        const json = await fetchJson(url, {headers: {Authorization: key}});
        results.push(...(json.photos || []));
        if (!json.photos?.length) break;
      }
      if (results.length >= limit) break;
    }
    return results.slice(0, limit).map((photo) => ({
      provider: 'pexels',
      id: String(photo.id || shortHash(photo.url || photo.alt || category.query)),
      url: photo.src?.large2x || photo.src?.portrait || photo.src?.large || photo.src?.original,
      title: photo.alt || titleFromSlug(category.slug),
      author: photo.photographer ? `Pexels / ${photo.photographer}` : 'Pexels',
      license: 'Pexels License',
      sourcePage: photo.url,
    }));
  } catch (error) {
    console.warn(`Pexels skipped for ${category.slug}: ${errorMessage(error)}`);
    return [];
  }
}

async function fetchUnsplash(category, limit) {
  const key = clean(process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY);
  if (!key || limit <= 0) return [];
  try {
    const results = [];
    const perPage = Math.min(30, Math.max(1, limit));
    for (const query of categoryQueries(category)) {
      for (let page = 1; results.length < limit && page <= Math.ceil(limit / perPage); page += 1) {
        const url = new URL('https://api.unsplash.com/search/photos');
        url.searchParams.set('query', query);
        url.searchParams.set('per_page', String(perPage));
        url.searchParams.set('page', String(page));
        url.searchParams.set('orientation', 'portrait');
        url.searchParams.set('client_id', key);
        const json = await fetchJson(url);
        results.push(...(json.results || []));
        if (!json.results?.length) break;
      }
      if (results.length >= limit) break;
    }
    return results.slice(0, limit).map((photo) => ({
      provider: 'unsplash',
      id: String(photo.id || shortHash(photo.urls?.regular || category.query)),
      url: photo.urls?.full || photo.urls?.regular,
      title: photo.alt_description || photo.description || titleFromSlug(category.slug),
      author: photo.user?.name ? `Unsplash / ${photo.user.name}` : 'Unsplash',
      license: 'Unsplash License',
      sourcePage: photo.links?.html,
    }));
  } catch (error) {
    console.warn(`Unsplash skipped for ${category.slug}: ${errorMessage(error)}`);
    return [];
  }
}

async function fetchPixabay(category, limit) {
  const key = clean(process.env.PIXABAY_API_KEY || process.env.NEXT_PUBLIC_PIXABAY_API_KEY);
  if (!key || limit <= 0) return [];
  try {
    const results = [];
    const perPage = Math.min(200, Math.max(3, limit));
    for (const query of categoryQueries(category)) {
      for (let page = 1; results.length < limit && page <= Math.ceil(limit / perPage); page += 1) {
        const url = new URL('https://pixabay.com/api/');
        url.searchParams.set('key', key);
        url.searchParams.set('q', query);
        url.searchParams.set('image_type', 'photo');
        url.searchParams.set('orientation', 'vertical');
        url.searchParams.set('per_page', String(perPage));
        url.searchParams.set('page', String(page));
        url.searchParams.set('safesearch', 'true');
        const json = await fetchJson(url);
        results.push(...(json.hits || []));
        if (!json.hits?.length) break;
      }
      if (results.length >= limit) break;
    }
    return results.slice(0, limit).map((photo) => ({
      provider: 'pixabay',
      id: String(photo.id || shortHash(photo.largeImageURL || category.query)),
      url: photo.largeImageURL || photo.webformatURL,
      title: photo.tags || titleFromSlug(category.slug),
      author: photo.user ? `Pixabay / ${photo.user}` : 'Pixabay',
      license: 'Pixabay Content License',
      sourcePage: photo.pageURL,
    }));
  } catch (error) {
    console.warn(`Pixabay skipped for ${category.slug}: ${errorMessage(error)}`);
    return [];
  }
}

async function fetchWikimedia(category, limit) {
  if (limit <= 0) return [];
  try {
    const url = new URL('https://commons.wikimedia.org/w/api.php');
    url.searchParams.set('origin', '*');
    url.searchParams.set('action', 'query');
    url.searchParams.set('generator', 'search');
    url.searchParams.set('gsrsearch', category.query);
    url.searchParams.set('gsrnamespace', '6');
    url.searchParams.set('gsrlimit', String(Math.min(20, Math.max(limit * 2, 8))));
    url.searchParams.set('prop', 'imageinfo');
    url.searchParams.set('iiprop', 'url|mime|size|extmetadata');
    url.searchParams.set('iiurlwidth', '2160');
    url.searchParams.set('format', 'json');
    const json = await fetchJson(url);
    const pages = Object.values(json.query?.pages || {});
    return pages
      .map((page) => {
        const info = page.imageinfo?.[0];
        const meta = info?.extmetadata || {};
        return {
          provider: 'wikimedia',
          id: String(page.pageid || shortHash(info?.url || page.title || category.query)),
          url: info?.thumburl || info?.url,
          title: stripHtml(meta.ObjectName?.value || meta.ImageDescription?.value || page.title || titleFromSlug(category.slug)),
          author: stripHtml(meta.Artist?.value || 'Wikimedia Commons'),
          license: stripHtml(meta.LicenseShortName?.value || meta.UsageTerms?.value || 'Wikimedia Commons'),
          sourcePage: meta.DescriptionUrl?.value || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title || '')}`,
          width: info?.thumbwidth || info?.width,
          height: info?.thumbheight || info?.height,
          mime: info?.thumbmime || info?.mime,
        };
      })
      .filter((item) => item.url && /^image\//i.test(item.mime || 'image/jpeg'))
      .slice(0, limit);
  } catch (error) {
    console.warn(`Wikimedia skipped for ${category.slug}: ${errorMessage(error)}`);
    return [];
  }
}

async function downloadCandidate(category, candidate) {
  const ext = extensionFromUrl(candidate.url);
  const filename = `${slugify(candidate.title || category.slug).slice(0, 54)}-${candidate.provider}-${candidate.id}.${ext}`;
  const outFile = path.join(outRoot, category.slug, filename);
  const relative = path.relative(path.join(root, 'public', 'assets'), outFile).replaceAll(path.sep, '/');
  if (existsSync(outFile)) return false;

  try {
    if (dryRun) {
      console.log(`[dry-run] ${category.slug}: ${candidate.url}`);
      return true;
    }
    const buffer = await fetchBytes(candidate.url);
    const image = sharp(buffer, {failOn: 'none'}).rotate();
    const meta = await image.metadata();
    if (!meta.width || !meta.height || meta.width < 900 || meta.height < 900) {
      console.warn(`Skipped low-res ${category.slug}/${filename}: ${meta.width}x${meta.height}`);
      return false;
    }
    const output = await image.jpeg({quality: 90, mozjpeg: true}).toBuffer();
    const finalFile = outFile.replace(/\.[^.]+$/, '.jpg');
    await writeFile(finalFile, output);
    const finalRelative = relative.replace(/\.[^.]+$/, '.jpg');
    const storage = s3 ? await uploadToS3({file: finalRelative, body: output, contentType: 'image/jpeg'}) : localStorage(finalRelative);
    labels[finalRelative] = {
      title: titleFromSlug(filename.replace(/\.[^.]+$/, '')),
      suggestedFilename: path.basename(finalRelative),
      detailedDescription: `${candidate.title || titleFromSlug(category.slug)}. Reusable ${category.slug} image for Itnavideo explainer scenes.`,
      tags: unique([category.slug, ...category.tags, candidate.provider, 'reusable', 'photo']),
      category: category.slug,
      orientation: meta.height >= meta.width ? 'portrait' : 'landscape',
      style: 'photo',
      useCase: `Reusable scene visual for ${category.slug.replaceAll('-', ' ')} explainer videos.`,
      use_case: `Reusable scene visual for ${category.slug.replaceAll('-', ' ')} explainer videos.`,
      qualityScore: 8,
      needsLabel: false,
      safeToUse: true,
      source: {
        provider: candidate.provider,
        author: candidate.author || candidate.provider,
        license: candidate.license || candidate.provider,
        sourcePage: candidate.sourcePage || '',
        downloadedAt: new Date().toISOString(),
      },
      storage,
    };
    return true;
  } catch (error) {
    console.warn(`Download failed ${category.slug}/${filename}: ${errorMessage(error)}`);
    return false;
  }
}

async function uploadToS3({file, body, contentType}) {
  if (!s3 || !s3Config) return localStorage(file);
  const key = `${s3Config.prefix}/${file}`.replace(/\/+/g, '/').replace(/^\/+/, '');
  await s3.send(new PutObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return {
    provider: 'aws-s3',
    bucket: s3Config.bucket,
    region: s3Config.region,
    awsKey: key,
    publicUrl: `${s3Config.baseUrl.replace(/\/+$/, '')}/${file.split('/').map(encodeURIComponent).join('/')}`,
    awsRecommended: false,
    uploadedAt: new Date().toISOString(),
  };
}

async function syncExistingLocalImagesToS3() {
  if (!s3 || !s3Config) throw new Error('--sync-existing-s3 requires --upload-s3 or REUSABLE_IMAGE_UPLOAD_S3=true.');
  const files = await walkImages(outRoot);
  let synced = 0;
  for (const filePath of files) {
    const relative = path.relative(path.join(root, 'public', 'assets'), filePath).replaceAll(path.sep, '/');
    const current = labels[relative] || {};
    if (current.storage?.provider === 'aws-s3' && current.storage?.publicUrl) continue;
    const body = await readFile(filePath);
    const contentType = contentTypeForFile(filePath);
    labels[relative] = {
      ...current,
      title: current.title || titleFromSlug(path.basename(filePath)),
      suggestedFilename: current.suggestedFilename || path.basename(filePath),
      detailedDescription: current.detailedDescription || `${titleFromSlug(path.basename(filePath))}. Reusable image for Itnavideo explainer scenes.`,
      tags: unique([...(current.tags || []), 'reusable', 'photo']),
      category: current.category || path.basename(path.dirname(filePath)),
      style: current.style || 'photo',
      useCase: current.useCase || `Reusable scene visual for ${path.basename(path.dirname(filePath)).replaceAll('-', ' ')} explainer videos.`,
      use_case: current.use_case || current.useCase || `Reusable scene visual for ${path.basename(path.dirname(filePath)).replaceAll('-', ' ')} explainer videos.`,
      qualityScore: Number(current.qualityScore || 8),
      needsLabel: false,
      safeToUse: true,
      storage: await uploadToS3({file: relative, body, contentType}),
    };
    synced += 1;
  }
  return synced;
}

async function walkImages(dir) {
  const {readdir} = await import('node:fs/promises');
  const entries = await readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkImages(full));
    if (entry.isFile() && /\.(?:png|jpe?g|webp|avif)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

function contentTypeForFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.avif') return 'image/avif';
  return 'image/jpeg';
}

function categoryQueries(category) {
  return unique([category.query, ...(category.queries || [])]);
}

function localStorage(file) {
  return {
    provider: 'local-public',
    publicUrl: `/assets/${file.split('/').map(encodeURIComponent).join('/')}`,
    awsKey: null,
    awsRecommended: true,
  };
}

function getS3Config() {
  const bucket = clean(process.env.AWS_ASSET_BUCKET);
  const region = clean(process.env.AWS_ASSET_REGION || process.env.AWS_REGION);
  const prefix = clean(process.env.AWS_ASSET_PREFIX || 'itnavideo/assets');
  const baseUrl = clean(process.env.AWS_ASSET_BASE_URL);
  if (!bucket || !region || !baseUrl) return null;
  return {
    bucket,
    region,
    prefix,
    baseUrl,
    accessKeyId: clean(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: clean(process.env.AWS_SECRET_ACCESS_KEY),
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetchWithTimeout(url, {
    ...options,
    headers: {
      'User-Agent': 'Itnavideo reusable asset downloader/1.0',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchBytes(url) {
  const response = await fetchWithTimeout(url, {headers: {'User-Agent': 'Itnavideo asset downloader/1.0'}});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {...options, signal: controller.signal});
  } finally {
    clearTimeout(timeout);
  }
}

async function countExistingImages(dir) {
  try {
    const {readdir} = await import('node:fs/promises');
    const entries = await readdir(dir);
    return entries.filter((name) => /\.(?:png|jpe?g|webp|avif)$/i.test(name)).length;
  } catch {
    return 0;
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function readNumber(key, fallback) {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function extensionFromUrl(value) {
  try {
    const ext = path.extname(new URL(value).pathname).replace('.', '').toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext) ? (ext === 'jpeg' ? 'jpg' : ext) : 'jpg';
  } catch {
    return 'jpg';
  }
}

function shortHash(value) {
  return createHash('sha1').update(String(value)).digest('hex').slice(0, 10);
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

function titleFromSlug(value) {
  return String(value || '')
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .slice(0, 96);
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240);
}

function unique(values) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
}

function clean(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error || 'unknown');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
