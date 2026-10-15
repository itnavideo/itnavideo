import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { loadEnvLocal } from './load-env-local.mjs';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
loadEnvLocal(rootDir);

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!apiKey) {
  console.error('[AUTO_TAG_IMAGES] Missing GEMINI_API_KEY / GOOGLE_AI_API_KEY in environment.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const REALISTIC_DIR = path.join(rootDir, 'public', 'assets', 'reusable', 'images', 'realistic');
const LABELS_FILE = path.join(rootDir, 'public', 'assets', 'asset-labels.json');

interface AssetLabelEntry {
  title: string;
  suggestedFilename?: string;
  detailedDescription?: string;
  tags?: string[];
  category?: string;
  style?: string;
  useCase?: string;
  avoidFor?: string[];
  emotion?: string;
  narrativeRole?: string;
  emotionalValence?: string;
  qualityScore?: number;
  needsLabel?: boolean;
  safeToUse?: boolean;
}

const SUPPORTED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function main() {
  console.log('======================================================================');
  console.log('       ITNAVIDEO — AUTOMATED ZERO-MANUAL IMAGE INGESTION');
  console.log(` Target Unified Folder: reusable/images/realistic/`);
  console.log('======================================================================\n');

  if (!fs.existsSync(REALISTIC_DIR)) {
    fs.mkdirSync(REALISTIC_DIR, { recursive: true });
  }

  // 1. Read existing labels
  let labels: Record<string, AssetLabelEntry> = {};
  if (fs.existsSync(LABELS_FILE)) {
    try {
      labels = JSON.parse(fs.readFileSync(LABELS_FILE, 'utf8'));
    } catch {
      labels = {};
    }
  }

  // 2. Discover all realistic images
  const allFiles = fs.readdirSync(REALISTIC_DIR);
  const imageFiles = allFiles.filter(f => SUPPORTED_EXTS.has(path.extname(f).toLowerCase()));

  console.log(`Found ${imageFiles.length} realistic images in library.`);

  // 3. Find unlabelled or generic images
  const unlabelled = imageFiles.filter(fileName => {
    const relativeKey = `reusable/images/realistic/${fileName}`;
    const entry = labels[relativeKey];
    return !entry || entry.needsLabel || !entry.detailedDescription || (entry.tags || []).length < 5;
  });

  if (unlabelled.length === 0) {
    console.log('✓ All images in reusable/images/realistic/ are already tagged with rich metadata!');
    return;
  }

  console.log(`Processing ${unlabelled.length} images requiring Gemini Vision auto-tagging...\n`);

  const BATCH_SIZE = 3;
  let taggedCount = 0;

  for (let i = 0; i < unlabelled.length; i += BATCH_SIZE) {
    const batch = unlabelled.slice(i, i + BATCH_SIZE);
    console.log(`Analyzing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.join(', ')})...`);

    try {
      const parts: any[] = [
        {
          text: `You are an expert AI computer vision analyst for professional video editing and script matching.
Analyze each provided realistic image for video production storytelling.

For each image, extract:
1. Clean, human-readable Title (e.g. "Stressed Founder Reviewing Declining Revenue")
2. Suggested meaningful snake_case filename (e.g. "founder_stressed_declining_revenue.jpg")
3. Detailed visual description (subject, action, emotion, foreground, background)
4. 15-20 highly relevant keywords/tags (e.g. ["finance", "money", "office", "laptop", "crisis", "startup", "founder", "debt", "burnout"])
5. narrativeRole: strictly one of ["problem_tension", "action_process", "success_payoff", "concept_abstract", "broll_environment"]
6. emotionalValence: strictly one of ["crisis_negative", "neutral_analytical", "triumphant_positive"]

Return ONLY a valid JSON array of objects:
[
  {
    "fileName": "original_filename.jpg",
    "title": "Clean Title",
    "suggestedFilename": "snake_case_name.jpg",
    "detailedDescription": "Full visual analysis...",
    "tags": ["tag1", "tag2", "tag3"],
    "narrativeRole": "problem_tension",
    "emotionalValence": "crisis_negative"
  }
]`
        }
      ];

      for (const fileName of batch) {
        const filePath = path.join(REALISTIC_DIR, fileName);
        const data = fs.readFileSync(filePath);
        const ext = path.extname(fileName).toLowerCase().replace('.', '');
        const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        
        parts.push({ text: `\nImage filename: ${fileName}` });
        parts.push({
          inlineData: {
            mimeType,
            data: data.toString('base64'),
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts }],
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      const results = JSON.parse(cleanJson);

      if (Array.isArray(results)) {
        for (const item of results) {
          const matchedFileName = batch.find(b => b === item.fileName) || batch[results.indexOf(item)];
          if (!matchedFileName) continue;

          const relativeKey = `reusable/images/realistic/${matchedFileName}`;
          labels[relativeKey] = {
            title: item.title || matchedFileName,
            suggestedFilename: item.suggestedFilename || matchedFileName,
            detailedDescription: item.detailedDescription || '',
            tags: Array.isArray(item.tags) ? item.tags : [],
            category: 'realistic',
            style: 'realistic',
            narrativeRole: item.narrativeRole || 'concept_abstract',
            emotionalValence: item.emotionalValence || 'neutral_analytical',
            qualityScore: 90,
            needsLabel: false,
            safeToUse: true,
          };
          taggedCount++;
          console.log(`  ✓ Auto-tagged: ${matchedFileName} -> "${item.title}" [${item.narrativeRole || 'broll'}]`);
        }
      }
    } catch (err: any) {
      console.warn(`  ⚠ Batch failed with Gemini Vision: ${err?.message || err}. Using fallback.`);
      for (const fileName of batch) {
        const relativeKey = `reusable/images/realistic/${fileName}`;
        const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
        labels[relativeKey] = {
          title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          detailedDescription: `Realistic stock visual: ${cleanName}`,
          tags: ['realistic', 'stock', ...cleanName.toLowerCase().split(' ')],
          category: 'realistic',
          style: 'realistic',
          narrativeRole: 'broll_environment',
          emotionalValence: 'neutral_analytical',
          qualityScore: 75,
          needsLabel: false,
          safeToUse: true,
        };
      }
    }
  }

  // 4. Save updated asset-labels.json
  fs.writeFileSync(LABELS_FILE, JSON.stringify(labels, null, 2), 'utf8');
  console.log(`\nUpdated ${LABELS_FILE} with ${taggedCount} auto-tagged images.`);

  // 5. Automatically run asset indexer
  console.log('Re-indexing public/assets/assets.json...');
  try {
    execSync('node scripts/index-assets.mjs', { stdio: 'inherit' });
    console.log('✓ Assets index fully synchronized with zero manual effort!');
  } catch (indexErr) {
    console.warn('Could not run index-assets script automatically:', indexErr);
  }
}

main().catch(err => {
  console.error('Fatal error in auto-tagging script:', err);
  process.exit(1);
});
