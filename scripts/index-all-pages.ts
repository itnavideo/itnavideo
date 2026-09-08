import fs from 'fs';
import path from 'path';
import { getPublicSitemapUrls } from '../lib/seo/public-url-collector';
import { submitIndexingNotifications, normalizeOwnedUrl } from '../lib/google/indexing';

async function main() {
  console.log('=== ITNAVIDEO INSTANT INDEXING SCRIPT ===\n');

  const credPath = path.resolve(process.cwd(), 'gcp-credentials.json');
  if (!fs.existsSync(credPath)) {
    console.error('Error: gcp-credentials.json not found!');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON = JSON.stringify(credentials);
  process.env.GOOGLE_INDEXING_MAX_URLS_PER_REQUEST = '200';

  console.log(`Using Service Account: ${credentials.client_email}`);

  const siteUrl = 'https://www.itnavideo.com';
  const urls = await getPublicSitemapUrls();
  const allUrls = urls.map((item) => normalizeOwnedUrl(`${siteUrl}${item.path === '/' ? '' : item.path}`));

  console.log(`Found ${allUrls.length} total URLs to index across Itnavideo:`);
  console.log(`- Core & Video Types: ${urls.filter(u => !u.path.startsWith('/blog/')).length}`);
  console.log(`- Blog Posts: ${urls.filter(u => u.path.startsWith('/blog/')).length}\n`);

  console.log('Submitting to Google Instant Indexing API (batches of 10)...');

  let successCount = 0;
  let failCount = 0;
  const batchSize = 10;

  for (let i = 0; i < allUrls.length; i += batchSize) {
    const chunk = allUrls.slice(i, i + batchSize);
    console.log(`Submitting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allUrls.length / batchSize)} (${chunk.length} URLs)...`);

    try {
      const res = await submitIndexingNotifications(chunk, 'URL_UPDATED');
      for (const item of res.results) {
        if (item.ok) {
          successCount++;
          console.log(`  [OK] ${item.url}`);
        } else {
          failCount++;
          console.log(`  [FAILED] ${item.url} -> ${item.message} (status: ${item.status})`);
        }
      }
    } catch (err: any) {
      console.error('Batch error:', err.message);
    }

    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('\n=== INDEXING SUMMARY ===');
  console.log(`Total URLs: ${allUrls.length}`);
  console.log(`Successfully accepted: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
