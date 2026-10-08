import fs from 'node:fs';
import path from 'node:path';
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';
import {execSync} from 'node:child_process';

dotenv.config({path: path.resolve(process.cwd(), '.env.local')});

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.error('Missing GEMINI_API_KEY in .env.local');
  process.exit(1);
}

const ai = new GoogleGenAI({apiKey});

const root = process.cwd();
const assetsDir = path.join(root, 'public', 'assets');
const labelsPath = path.join(assetsDir, 'asset-labels.json');
const cachePath = path.join(assetsDir, 'vision-cache.json');

const TARGET_DIRS = [
  path.join(assetsDir, 'reusable', 'images', 'realistic'),
  path.join(assetsDir, 'reusable', 'images', '2d'),
];

const RANDOM_PATTERNS = [
  /^file[_-]/i,
  /^img[_-]?\d*/i,
  /^image[_-]?\d*/i,
  /^download/i,
  /^screenshot/i,
  /^[a-f0-9]{12,}$/i,
  /^\d+$/,
  /^istockphoto/i,
  /^intro-\d+/i,
  /^images\s*\(\d+\)/i,
  /^images$/i,
  /^inline_image/i,
  /^custom[-_]?\d+/i,
  /^untitled/i,
  /^unnamed/i,
  /^blob/i,
  /^temp/i,
];

function isRandomName(filename) {
  const nameWithoutExt = path.parse(filename).name;
  return RANDOM_PATTERNS.some((p) => p.test(nameWithoutExt)) || nameWithoutExt.length < 4;
}

function toSnakeCase(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 55);
}

function titleCase(str) {
  return str
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

const VISION_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

async function analyzeWithGemini(filePath, mimeType) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString('base64');

  const prompt = `You are a professional visual director and metadata specialist for AI video generation and stock asset indexing.
Analyze the EXACT VISUAL CONTENT of this image with extreme accuracy.

CRITICAL INSTRUCTIONS:
1. Base your analysis 100% on what is actually visible in the scene.
2. Generate a descriptive, specific snake_case filename (e.g. "software_engineer_coding_three_monitors.png", "modern_luxury_mansion_sunset_exterior.png", "delivery_courier_delivering_food_porch.png", "couple_reviewing_budget_calculator_laptop.png"). Never use generic numbers or placeholders.
3. Write a 2-3 sentence comprehensive description describing subjects, actions, environment, lighting, mood, color palette, and key visual details.
4. Extract 15 to 25 highly relevant keywords/tags for search and script matching.
5. Identify category: "finance", "career", "tech_ai", "lifestyle", "business", "real_estate", "education", "transport", "delivery_gig", "health", or "general".
6. Identify mood: "cinematic", "optimistic", "dramatic", "focused", "stressful", "luxurious", "neutral", "inspiring".
7. Detail what narrative scenes this visual is best used for ("useCase").

Return ONLY a strict JSON object with this format:
{
  "descriptiveFilename": "meaningful_snake_case_name.png",
  "title": "Clean Human Readable Title",
  "detailedDescription": "Thorough description of visible content...",
  "keywords": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12", "tag13", "tag14", "tag15"],
  "category": "finance | career | tech_ai | lifestyle | business | real_estate | education | transport | delivery_gig | general",
  "mood": "cinematic | optimistic | dramatic | focused | stressful | luxurious | neutral | inspiring",
  "useCase": "Best suited for scenes discussing X, Y, and Z"
}`;

  for (const model of VISION_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {text: prompt},
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const text = (response.text || '').trim();
        const parsed = JSON.parse(text);
        return parsed;
      } catch (err) {
        const isRetryable = err.message?.includes('503') || err.message?.includes('429') || err.message?.includes('demand');
        if (isRetryable && attempt < 3) {
          const delay = attempt * 2000;
          await new Promise((r) => setTimeout(r, delay));
        } else if (model !== VISION_MODELS[VISION_MODELS.length - 1]) {
          break; // Try next model
        } else {
          throw err;
        }
      }
    }
  }
}

async function main() {
  console.log('=== Starting Grounded Visual Asset Labeling & Renaming ===\n');

  let cache = {};
  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    } catch {}
  }

  let labels = {};
  if (fs.existsSync(labelsPath)) {
    try {
      labels = JSON.parse(fs.readFileSync(labelsPath, 'utf8'));
    } catch {}
  }

  const itemsToProcess = [];

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => !f.startsWith('.') && f !== 'assets.json');
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;

      const needsRename = isRandomName(file);
      const relPath = path.relative(assetsDir, fullPath).replaceAll(path.sep, '/');

      if (needsRename || !labels[relPath]?.detailedDescription) {
        itemsToProcess.push({
          fullPath,
          file,
          dir,
          ext,
          relPath,
          needsRename,
        });
      }
    }
  }

  console.log(`Found ${itemsToProcess.length} total images to process sequentially.`);

  let completed = 0;
  let renamedCount = 0;

  for (const item of itemsToProcess) {
    completed++;
    const mimeType = item.ext === '.png' ? 'image/png' : item.ext === '.webp' ? 'image/webp' : 'image/jpeg';
    
    // Check if current file still exists (in case already renamed)
    if (!fs.existsSync(item.fullPath)) {
      continue;
    }

    try {
      let meta = cache[item.file];
      if (!meta) {
        meta = await analyzeWithGemini(item.fullPath, mimeType);
        cache[item.file] = meta;
        fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
      }

      // Determine clean filename
      let targetFilename = item.file;
      let finalFullPath = item.fullPath;

      if (item.needsRename) {
        let baseSuggested = toSnakeCase(meta.descriptiveFilename ? path.parse(meta.descriptiveFilename).name : meta.title || 'cinematic_scene');
        if (baseSuggested.length < 4) {
          baseSuggested = toSnakeCase(meta.title || 'scene_asset');
        }
        targetFilename = `${baseSuggested}${item.ext}`;

        // Ensure unique filename
        let counter = 1;
        let checkPath = path.join(item.dir, targetFilename);
        while (fs.existsSync(checkPath) && checkPath !== item.fullPath) {
          counter++;
          targetFilename = `${baseSuggested}_${counter}${item.ext}`;
          checkPath = path.join(item.dir, targetFilename);
        }

        if (targetFilename !== item.file) {
          fs.renameSync(item.fullPath, checkPath);
          finalFullPath = checkPath;
          renamedCount++;
        }
      }

      const finalRelPath = path.relative(assetsDir, finalFullPath).replaceAll(path.sep, '/');

      labels[finalRelPath] = {
        title: meta.title || titleCase(path.parse(targetFilename).name),
        detailedDescription: meta.detailedDescription || '',
        category: meta.category || 'general',
        mood: meta.mood || 'cinematic',
        style: item.dir.includes('2d') ? '2d_illustration' : 'realistic_cinematic',
        tags: Array.isArray(meta.keywords) ? meta.keywords : [],
        useCase: meta.useCase || '',
        qualityScore: 92,
        needsLabel: false,
        safeToUse: true,
      };

      if (item.relPath !== finalRelPath && labels[item.relPath]) {
        delete labels[item.relPath];
      }

      fs.writeFileSync(labelsPath, JSON.stringify(labels, null, 2), 'utf8');
      console.log(`[${completed}/${itemsToProcess.length}] ✓ Renamed: ${item.file} -> ${targetFilename} (${labels[finalRelPath].category})`);

      // 400ms pause to ensure smooth API pacing
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`[${completed}/${itemsToProcess.length}] ✗ Error on ${item.file}:`, err.message);
    }
  }

  console.log(`\n=== All Images Processed! Renamed: ${renamedCount} ===`);
  fs.writeFileSync(labelsPath, JSON.stringify(labels, null, 2), 'utf8');

  // Reindex assets
  console.log('\n--- Rebuilding assets.json and reusable-assets.json ---');
  execSync('node scripts/index-assets.mjs', {stdio: 'inherit'});

  console.log('\n--- Pipeline Complete! ---');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
