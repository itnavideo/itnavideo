// Apply generated blog image URLs to all blog post data files
// Run AFTER generate-blog-images.mjs completes
// node scripts/apply-blog-images.mjs

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

async function main() {
  // Load the generated URL map
  const urlMapPath = path.join(__dirname, 'blog-image-urls.json');
  const urlMap = JSON.parse(await readFile(urlMapPath, 'utf8'));

  const files = [
    'lib/blogPosts.ts',
    'lib/newExpandedBlogPosts.ts',
    'lib/conversionBlogPosts.ts',
  ];

  let totalPatched = 0;

  for (const relPath of files) {
    const filePath = path.join(ROOT, relPath);
    let content;
    try {
      content = await readFile(filePath, 'utf8');
    } catch {
      console.log(`⚠️  Skipping (not found): ${relPath}`);
      continue;
    }

    let patched = 0;

    for (const [slug, imageUrl] of Object.entries(urlMap)) {
      // Match any existing slug line and inject featuredImage after it
      // Pattern handles both "slug": "value" and slug: 'value' formats
      const slugPatternDouble = new RegExp(
        `("slug":\\s*"${slug.replace(/-/g,'\\-')}",[^}]*?)(featuredImage:[^,}]*,)?`,
        'gs'
      );
      const slugPatternSingle = new RegExp(
        `(slug:\\s*'${slug.replace(/-/g,'\\-')}',[^}]*?)(featuredImage:[^,}]*,)?`,
        'gs'
      );

      // Simpler approach: find the slug, check if featuredImage exists nearby, insert or update
      const doubleQuoteSlug = `"slug": "${slug}"`;
      const singleQuoteSlug = `slug: '${slug}'`;

      let idx = content.indexOf(doubleQuoteSlug);
      if (idx === -1) idx = content.indexOf(singleQuoteSlug);
      if (idx === -1) continue;

      // Find the closing } of this post object
      const blockEnd = content.indexOf('\n  }', idx);
      const block = content.slice(idx, blockEnd);

      if (block.includes('featuredImage')) {
        // Replace existing featuredImage
        const updated = content.slice(0, idx) +
          block.replace(/featuredImage\s*:\s*["'][^"']*["']/, `featuredImage: "${imageUrl}"`) +
          content.slice(blockEnd);
        content = updated;
      } else {
        // Insert featuredImage after the slug line
        const slugLineEnd = content.indexOf('\n', idx) + 1;
        const indent = content.slice(idx).match(/^(\s*)/)?.[1] || '    ';
        const insertion = `${indent}featuredImage: "${imageUrl}",\n`;
        content = content.slice(0, slugLineEnd) + insertion + content.slice(slugLineEnd);
      }
      patched++;
      totalPatched++;
    }

    await writeFile(filePath, content);
    console.log(`✅ ${relPath}: patched ${patched} posts`);
  }

  console.log(`\n🎉 Total featured images applied: ${totalPatched}`);
}

main().catch(console.error);

