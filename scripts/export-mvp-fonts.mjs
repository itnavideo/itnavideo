import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { downloadGoogleDriveFile, isGoogleDriveConfigured, listGoogleDriveChildren } from '../services/assets/googleDriveClient.mjs';

loadEnvFile('.env');
loadEnvFile('.env.local');

const FOLDER_MIME = 'application/vnd.google-apps.folder';
const FONT_EXTENSIONS = new Set(['.ttf', '.otf']);
const outputDir = path.resolve('public/visuals/fonts');
const manifestPath = path.join(outputDir, 'manifest.json');

const presets = [
  {
    key: 'geometric_bold',
    output: 'geometric_bold.ttf',
    role: 'Heading / big text',
    preferredFamilies: ['Montserrat', 'Poppins', 'Manrope', 'Nunito Sans', 'Urbanist', 'Raleway'],
    preferredWeights: ['Black', 'ExtraBold', 'Bold', 'SemiBold'],
  },
  {
    key: 'condensed_impact',
    output: 'condensed_impact.ttf',
    role: 'Hook / retention text',
    preferredFamilies: ['Anton', 'Bebas Neue', 'Oswald', 'Roboto Condensed', 'Barlow Condensed'],
    preferredWeights: ['Regular', 'Bold', 'Black'],
  },
  {
    key: 'editorial_serif',
    output: 'editorial_serif.ttf',
    role: 'Premium heading / story text',
    preferredFamilies: ['Playfair Display', 'Merriweather', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Cinzel', 'PT Serif'],
    preferredWeights: ['Black', 'Bold', 'SemiBold', 'Regular'],
  },
  {
    key: 'clean_ui',
    output: 'clean_ui.ttf',
    role: 'Normal text / captions',
    preferredFamilies: ['Inter', 'Roboto', 'DM Sans', 'Open Sans', 'Source Sans 3', 'Noto Sans'],
    preferredWeights: ['Bold', 'SemiBold', 'Medium', 'Regular'],
  },
  {
    key: 'mono_tech',
    output: 'mono_tech.ttf',
    role: 'Tech callouts / counters',
    preferredFamilies: ['JetBrains Mono', 'Roboto Mono', 'Space Mono', 'IBM Plex Mono', 'Source Code Pro', 'Fira Code', 'Inconsolata', 'Share Tech Mono', 'Orbitron', 'Rajdhani', 'Chakra Petch', 'Exo 2'],
    preferredWeights: ['Bold', 'SemiBold', 'Medium', 'Regular'],
  },
  {
    key: 'rounded_caption',
    output: 'rounded_caption.ttf',
    role: 'Friendly subtitle / soft callout',
    preferredFamilies: ['Nunito', 'Quicksand', 'Rubik', 'Fredoka', 'Baloo 2', 'Barlow', 'DM Sans'],
    preferredWeights: ['ExtraBold', 'Bold', 'SemiBold', 'Regular'],
  },
];

if (!isGoogleDriveConfigured()) {
  throw new Error('Google Drive is not configured. Check GOOGLE_DRIVE_* env keys.');
}

const rootFolderId = process.env.GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID;
if (!rootFolderId) throw new Error('GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID is missing.');

fs.mkdirSync(outputDir, { recursive: true });

const fonts = await getIndexedFonts(rootFolderId);
if (!fonts.length) throw new Error('No .ttf/.otf files found in Drive fonts folders.');

const usedFileIds = new Set();
const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'drive-font-export',
  presets: {},
};

for (const preset of presets) {
  const font = pickBestFont(fonts, preset, usedFileIds);
  if (!font) {
    const stalePath = path.join(outputDir, preset.output);
    if (fs.existsSync(stalePath)) fs.unlinkSync(stalePath);
    console.warn(`No Drive font matched preset ${preset.key}.`);
    continue;
  }

  usedFileIds.add(font.id);
  const outputPath = path.join(outputDir, preset.output);
  await downloadFont(font.id, outputPath);
  manifest.presets[preset.key] = {
    file: preset.output,
    role: preset.role,
    family: font.familyName,
    sourceName: font.name,
    sourceId: font.id,
    score: font.score,
  };
  console.log(`Saved ${preset.key}: ${font.familyName} / ${font.name} -> ${outputPath}`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Font manifest saved: ${manifestPath}`);

async function getIndexedFonts(rootId) {
  const fontsFolderName = process.env.GOOGLE_DRIVE_FONTS_FOLDER_NAME || 'fonts';
  const rootItems = await listGoogleDriveChildren(rootId);
  const fontFolders = rootItems.filter((item) => item.mimeType === FOLDER_MIME && isFontFolderName(item.name, fontsFolderName));
  const results = [];

  for (const fontsFolder of fontFolders) {
    const items = await listGoogleDriveChildren(fontsFolder.id);
    results.push(...collectDirectFontFiles(items, fontsFolder.name));

    for (const familyFolder of items.filter((item) => item.mimeType === FOLDER_MIME)) {
      results.push(...await collectFontFiles(familyFolder.id, familyFolder.name));
    }
  }

  return results;
}

async function collectFontFiles(folderId, familyName) {
  const items = await listGoogleDriveChildren(folderId);
  const directFonts = collectDirectFontFiles(items, familyName);
  const nestedFonts = [];

  for (const folder of items.filter((item) => item.mimeType === FOLDER_MIME)) {
    nestedFonts.push(...await collectFontFiles(folder.id, familyName));
  }

  return [...directFonts, ...nestedFonts];
}

function collectDirectFontFiles(items, fallbackFamilyName) {
  return items
    .filter((item) => FONT_EXTENSIONS.has(path.extname(item.name).toLowerCase()))
    .map((item) => ({
      id: item.id,
      name: item.name,
      familyName: inferFamilyName(item.name, fallbackFamilyName),
      score: 0,
    }));
}

function pickBestFont(fonts, preset, usedFileIds) {
  return fonts
    .map((font) => ({
      ...font,
      score: scoreFont(font, preset, usedFileIds),
    }))
    .filter((font) => font.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))[0];
}

function scoreFont(font, preset, usedFileIds) {
  const haystack = normalize(`${font.familyName} ${font.name}`);
  let score = usedFileIds.has(font.id) ? -20 : 0;
  let familyMatched = false;

  preset.preferredFamilies.forEach((family, index) => {
    const normalizedFamily = normalize(family);
    if (haystack.includes(normalizedFamily)) {
      familyMatched = true;
      score += 120 - index * 8;
    }
  });

  if (!familyMatched) return 0;

  preset.preferredWeights.forEach((weight, index) => {
    if (haystack.includes(normalize(weight))) score += 50 - index * 5;
  });

  if (haystack.includes('italic')) score -= 45;
  if (haystack.includes('thin') || haystack.includes('light')) score -= 25;
  if (haystack.includes('variable')) score += 8;

  return score;
}

async function downloadFont(fileId, outputPath) {
  const response = await downloadGoogleDriveFile(fileId);
  const tempPath = `${outputPath}.${process.pid}.${Date.now()}.tmp`;

  try {
    const writer = fs.createWriteStream(tempPath);
    await finished(Readable.fromWeb(response.body).pipe(writer));
    fs.renameSync(tempPath, outputPath);
  } catch (error) {
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch {}
    throw error;
  }
}

function inferFamilyName(fileName, fallbackFamilyName) {
  const fallback = cleanName(fallbackFamilyName);
  if (fallback && !isGenericFontFolder(fallback)) return fallback;

  return cleanName(path.basename(fileName, path.extname(fileName)))
    .replace(/\b(thin|extra light|extralight|light|regular|medium|semi bold|semibold|bold|extra bold|extrabold|black|italic|variable)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isFontFolderName(value, configuredName) {
  const normalized = normalize(value);
  const configured = normalize(configuredName);
  return normalized === configured || normalized.includes('font') || normalized === 'googlefonts' || normalized === 'otherfonts';
}

function isGenericFontFolder(value) {
  return ['font', 'fonts', 'google fonts', 'googlefonts', 'otherfonts', 'other fonts', 'custom fonts', 'drive'].includes(value.toLowerCase());
}

function cleanName(value) {
  return String(value || '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function loadEnvFile(fileName) {
  const filePath = path.resolve(fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^['"]|['"]$/g, '');
  }
}
