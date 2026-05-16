import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { downloadGoogleDriveFile, isGoogleDriveConfigured, listGoogleDriveChildren } from '../assets/googleDriveClient.mjs';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CACHE_DIR = path.join(PUBLIC_DIR, 'cache');
const FONT_CACHE_DIR = path.join(CACHE_DIR, 'drive-fonts');
const FONT_MANIFEST_PATH = path.join(FONT_CACHE_DIR, 'manifest.json');
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const FONT_EXTENSIONS = new Set(['.ttf', '.otf']);

let inMemoryManifest = null;
let indexedFonts = null;

export async function ensureDriveFontsForTimeline(timeline) {
  if (!isGoogleDriveConfigured()) return;

  const templates = [timeline?.metadata?.template, ...(timeline?.scenes || []).map((scene) => scene.proTemplate)].filter(Boolean);
  const requestedFamilies = templates
    .flatMap((template) => [
      template.font_family,
      template.fontFamily,
      template.category === 'motivational' ? 'Montserrat' : '',
      template.category === 'educational' ? 'Inter' : '',
      template.category === 'storytelling' ? 'PT Serif' : '',
      'Roboto',
    ])
    .filter(Boolean);

  if (!requestedFamilies.length) return;

  try {
    fs.mkdirSync(FONT_CACHE_DIR, { recursive: true });
    const fonts = await getIndexedFonts();
    const manifest = readManifest();

    for (const family of requestedFamilies) {
      const font = pickFontForFamily(fonts, family);
      if (!font) continue;
      const cachePath = path.join(FONT_CACHE_DIR, sanitizeFileName(font.name));

      if (!fs.existsSync(cachePath) || fs.statSync(cachePath).size === 0) {
        await downloadFont(font.id, cachePath);
      }

      manifest.families[normalizeName(family)] = cachePath;
      manifest.files[normalizeName(font.name)] = cachePath;
    }

    writeManifest(manifest);
  } catch (error) {
    console.warn('Google Drive font cache unavailable; using local/system fonts:', error);
  }
}

export function getCachedDriveFontPath(template) {
  const manifest = readManifest();
  const candidates = [
    template?.fontFamily,
    template?.font_family,
    ...(template?.fontFiles || []),
    template?.category === 'motivational' ? 'Montserrat' : '',
    template?.category === 'educational' ? 'Inter' : '',
    template?.category === 'storytelling' ? 'PT Serif' : '',
    'Roboto',
  ].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = normalizeName(candidate);
    const filePath = manifest.families[normalized] || manifest.files[normalized];
    if (filePath && fs.existsSync(filePath)) return filePath;
  }

  return null;
}

async function getIndexedFonts() {
  if (indexedFonts) return indexedFonts;

  const rootFolderId = process.env.GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID;
  const fontsFolderName = process.env.GOOGLE_DRIVE_FONTS_FOLDER_NAME || 'fonts';
  const rootItems = await listGoogleDriveChildren(rootFolderId);
  const fontFolders = rootItems.filter((item) => item.mimeType === FOLDER_MIME && isFontFolderName(item.name, fontsFolderName));
  if (!fontFolders.length) {
    indexedFonts = [];
    return indexedFonts;
  }

  const results = [];

  for (const fontsFolder of fontFolders) {
    const families = await listGoogleDriveChildren(fontsFolder.id);
    results.push(...collectDirectFontFiles(families));

    for (const family of families.filter((item) => item.mimeType === FOLDER_MIME)) {
      const files = await collectFontFiles(family.id, family.name);
      results.push(...files);
    }
  }

  indexedFonts = results;
  return indexedFonts;
}

function collectDirectFontFiles(items) {
  return items
    .filter((item) => FONT_EXTENSIONS.has(path.extname(item.name).toLowerCase()))
    .map((item) => ({
      id: item.id,
      name: item.name,
      familyName: inferFamilyNameFromFile(item.name),
      score: scoreFontFile(item.name),
    }));
}

async function collectFontFiles(folderId, familyName) {
  const items = await listGoogleDriveChildren(folderId);
  const directFonts = items
    .filter((item) => FONT_EXTENSIONS.has(path.extname(item.name).toLowerCase()))
    .map((item) => ({
      id: item.id,
      name: item.name,
      familyName,
      score: scoreFontFile(item.name),
    }));

  const nestedFolders = items.filter((item) => item.mimeType === FOLDER_MIME);
  const nestedFonts = [];
  for (const folder of nestedFolders) {
    nestedFonts.push(...await collectFontFiles(folder.id, familyName));
  }

  return [...directFonts, ...nestedFonts];
}

function inferFamilyNameFromFile(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, ' ')
    .replace(/\b(thin|extra light|extralight|light|regular|medium|semi bold|semibold|bold|extra bold|extrabold|black|italic|variable)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim() || fileName;
}

function pickFontForFamily(fonts, family) {
  const normalizedFamily = normalizeName(family);
  return fonts
    .filter((font) => normalizeName(font.familyName) === normalizedFamily || normalizeName(font.name).includes(normalizedFamily))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))[0];
}

function scoreFontFile(fileName) {
  const name = fileName.toLowerCase();
  let score = 1;
  if (name.includes('black')) score += 8;
  if (name.includes('extrabold')) score += 7;
  if (name.includes('bold')) score += 6;
  if (name.includes('semibold')) score += 5;
  if (name.includes('variable')) score += 4;
  if (name.includes('regular')) score += 2;
  if (name.includes('italic')) score -= 4;
  return score;
}

async function downloadFont(fileId, cachePath) {
  const response = await downloadGoogleDriveFile(fileId);
  const tempPath = `${cachePath}.${process.pid}.${Date.now()}.tmp`;

  try {
    const writer = fs.createWriteStream(tempPath);
    await finished(Readable.fromWeb(response.body).pipe(writer));
    fs.renameSync(tempPath, cachePath);
  } catch (error) {
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch {}
    throw error;
  }
}

function readManifest() {
  if (inMemoryManifest) return inMemoryManifest;

  try {
    if (fs.existsSync(FONT_MANIFEST_PATH)) {
      inMemoryManifest = JSON.parse(fs.readFileSync(FONT_MANIFEST_PATH, 'utf8'));
      inMemoryManifest.families ||= {};
      inMemoryManifest.files ||= {};
      return inMemoryManifest;
    }
  } catch {}

  inMemoryManifest = { families: {}, files: {} };
  return inMemoryManifest;
}

function writeManifest(manifest) {
  fs.mkdirSync(FONT_CACHE_DIR, { recursive: true });
  fs.writeFileSync(FONT_MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  inMemoryManifest = manifest;
}

function normalizeName(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function isFontFolderName(value, configuredName) {
  const normalized = normalizeName(value);
  const configured = normalizeName(configuredName);
  return normalized === configured ||
    normalized.includes('font') ||
    normalized === 'googlefonts' ||
    normalized === 'otherfonts';
}

function sanitizeFileName(value) {
  return String(value || 'font.ttf').replace(/[^a-zA-Z0-9._-]+/g, '_');
}
