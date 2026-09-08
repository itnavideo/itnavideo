import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const jsonPath = path.join(root, 'lib', 'cloudinary', 'ai-video-library.json');

async function validateAiImageLibrary() {
  console.log('🔍 Validating Cloudinary AI Video Image Library at:');
  console.log('   ' + jsonPath);

  let rawContent;
  try {
    rawContent = await readFile(jsonPath, 'utf8');
  } catch (err) {
    console.error('❌ Failed to read ai-video-library.json:', err.message);
    process.exit(1);
  }

  let items;
  try {
    items = JSON.parse(rawContent);
  } catch (err) {
    console.error('❌ Syntax error in ai-video-library.json: File is not valid JSON!');
    console.error('   ' + err.message);
    process.exit(1);
  }

  if (!Array.isArray(items)) {
    console.error('❌ Root of ai-video-library.json must be a JSON array of image objects.');
    process.exit(1);
  }

  const errors = [];
  const warnings = [];
  const seenIds = new Set();
  const seenUrls = new Set();
  const categoryCounts = {};
  const ratioCounts = { '16:9': 0, '9:16': 0, other: 0 };
  const allTags = new Set();

  items.forEach((item, index) => {
    const prefix = `[Item #${index + 1}${item.id ? ` - ${item.id}` : ''}]`;

    if (!item.id || typeof item.id !== 'string') {
      errors.push(`${prefix} Missing required string property: 'id'`);
    } else if (seenIds.has(item.id)) {
      errors.push(`${prefix} Duplicate ID '${item.id}' already exists.`);
    } else {
      seenIds.add(item.id);
    }

    if (!item.url || typeof item.url !== 'string') {
      errors.push(`${prefix} Missing required string property: 'url'`);
    } else {
      if (!item.url.startsWith('https://')) {
        warnings.push(`${prefix} URL should use https: ${item.url}`);
      }
      if (seenUrls.has(item.url)) {
        warnings.push(`${prefix} URL is repeated across items: ${item.url}`);
      } else {
        seenUrls.add(item.url);
      }
    }

    if (!item.title || typeof item.title !== 'string') {
      errors.push(`${prefix} Missing required string property: 'title'`);
    }

    if (!item.category || typeof item.category !== 'string') {
      errors.push(`${prefix} Missing required string property: 'category'`);
    } else {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }

    if (!Array.isArray(item.tags) || item.tags.length === 0) {
      errors.push(`${prefix} 'tags' must be a non-empty array of keywords.`);
    } else {
      if (item.tags.length < 3) {
        warnings.push(`${prefix} Has only ${item.tags.length} tag(s). Recommended to provide at least 3-5 tags for better AI matching.`);
      }
      item.tags.forEach((t) => allTags.add(String(t).toLowerCase()));
    }

    const ratio = item.aspectRatio || '16:9';
    if (ratio === '16:9' || ratio === '9:16') {
      ratioCounts[ratio] = (ratioCounts[ratio] || 0) + 1;
    } else {
      ratioCounts.other = (ratioCounts.other || 0) + 1;
      warnings.push(`${prefix} Non-standard aspectRatio '${ratio}'. Recommended '16:9' or '9:16'.`);
    }
  });

  console.log('\n📊 Library Summary:');
  console.log(`   Total Images:      ${items.length}`);
  console.log(`   Unique Tags:       ${allTags.size}`);
  console.log(`   Aspect Ratios:     16:9 (${ratioCounts['16:9']}) | 9:16 (${ratioCounts['9:16']})${ratioCounts.other ? ` | Other (${ratioCounts.other})` : ''}`);
  console.log('\n📁 Categories Breakdown:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`   - ${cat.padEnd(16)}: ${count} image(s)`);
  });

  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach((w) => console.log('   ' + w));
  }

  if (errors.length > 0) {
    console.error(`\n❌ Found ${errors.length} validation error(s):`);
    errors.forEach((e) => console.error('   ' + e));
    process.exit(1);
  }

  console.log('\n✅ All Cloudinary ChatGPT image library entries are valid and ready for AI scene matching!\n');
}

validateAiImageLibrary();
