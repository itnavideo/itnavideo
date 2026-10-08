import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const credPath = path.resolve('gcp-credentials.json');
if (!fs.existsSync(credPath)) {
  console.error('Credentials file not found at:', credPath);
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(credPath, 'utf8'));
console.log('=== GOOGLE INSTANT INDEXING RUNNER ===');
console.log('Project ID  :', key.project_id);
console.log('Client Email:', key.client_email);

let cachedToken = null;
let tokenExpiresAt = 0;

async function getIndexingToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiresAt > now + 300) {
    return cachedToken;
  }

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: key.client_email,
    sub: key.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/indexing',
  };

  const toBase64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = `${toBase64Url(header)}.${toBase64Url(payload)}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  const signature = sign.sign(key.private_key, 'base64url');
  const jwt = `${unsignedToken}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error('OAuth token error: ' + JSON.stringify(data));
  }
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600);
  return cachedToken;
}

async function collectAllUrls() {
  console.log('\nFetching live sitemap from https://www.itnavideo.com/sitemap.xml ...');
  const sitemapRes = await fetch('https://www.itnavideo.com/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  const sitemapUrls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());

  const dedicatedUrls = [
    'https://www.itnavideo.com/',
    'https://www.itnavideo.com/pricing',
    'https://www.itnavideo.com/tools/image-to-video-ai',
    'https://www.itnavideo.com/image-to-video-ai',
    'https://www.itnavideo.com/typography-video',
    'https://www.itnavideo.com/video-types/typography-video',
    'https://www.itnavideo.com/auto-caption-reel',
    'https://www.itnavideo.com/video-types',
    'https://www.itnavideo.com/video-types/explainer-video',
    'https://www.itnavideo.com/video-types/social-clips',
    'https://www.itnavideo.com/video-types/whiteboard-video',
    'https://www.itnavideo.com/video-types/dynamic-creator-reel',
    'https://www.itnavideo.com/video-types/auto-draw-explainer',
    'https://www.itnavideo.com/tools/audio-to-video',
    'https://www.itnavideo.com/tools/subtitles-generator',
    'https://www.itnavideo.com/blog',
  ];

  const uniqueUrls = Array.from(new Set([...dedicatedUrls, ...sitemapUrls]));

  // Prioritization sorting:
  // Tier 1: Core product & dedicated pages
  // Tier 2: The 15 newest conversion blog posts
  // Tier 3: All other blog posts
  // Tier 4: SEO landing pages & utility
  const newPostSlugs = [
    'where-to-put-subtitles-on-instagram-reels-safe-zone-guide',
    'image-to-video-ai-online-turn-photos-into-cinematic-videos',
    'how-to-make-long-videos-without-editing',
    'how-to-make-long-videos-like-pov-finance',
    'instagram-reels-caption-position-mistakes-to-avoid',
    'long-video-to-viral-clips-repurposing-framework',
    'best-ai-video-generator-luxury-real-estate',
    'why-agencies-switch-from-video-editors-to-itnavideo',
    'image-to-video-ai-cost-roi-breakdown',
    'dubai-real-estate-video-marketing-ai-blueprint',
    'faceless-youtube-channel-automation-profit-guide',
    'kinetic-typography-reel-maker-commercial-guide',
    'capcut-pro-vs-itnavideo-pro-agency-comparison',
    'turn-audio-podcast-into-viral-video-reels-profit',
    'compare-explainer-videos-ecommerce-conversion-rate',
    'whiteboard-video-ai-agency-reseller-guide',
    'why-german-and-japanese-brands-choose-itnavideo-motion-precision',
    'commercial-real-estate-listing-stats-typography',
    'how-australian-marketing-agencies-scale-50-client-reels',
    'the-true-roi-of-ai-video-credits-vs-hourly-contractors',
    'from-free-tier-to-itnavideo-pro-what-you-unlock',
  ];

  uniqueUrls.sort((a, b) => {
    const getScore = (url) => {
      if (url === 'https://www.itnavideo.com/' || url === 'https://www.itnavideo.com') return 100;
      if (url.includes('/pricing')) return 95;
      if (url.includes('image-to-video-ai') || url.includes('typography-video')) return 90;
      if (newPostSlugs.some(slug => url.includes(slug))) return 85;
      if (url.includes('/tools/') || url.includes('/video-types')) return 80;
      if (url.includes('/blog/')) return 70;
      return 50;
    };
    return getScore(b) - getScore(a);
  });

  return uniqueUrls;
}

async function submitUrl(url, token) {
  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      type: 'URL_UPDATED',
    }),
  });

  const data = await res.json().catch(() => ({}));
  return {
    url,
    ok: res.ok,
    status: res.status,
    data,
  };
}

async function run() {
  const urls = await collectAllUrls();
  console.log(`\nFound ${urls.length} unique URLs to submit to Google Indexing API.\n`);

  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const token = await getIndexingToken();

    try {
      const res = await submitUrl(url, token);
      if (res.ok) {
        successCount++;
        console.log(`[${i + 1}/${urls.length}] [OK ${res.status}] ${url}`);
      } else {
        failCount++;
        const errMsg = res.data?.error?.message || JSON.stringify(res.data);
        console.log(`[${i + 1}/${urls.length}] [FAIL ${res.status}] ${url} -> ${errMsg}`);
        if (res.status === 429) {
          console.warn('⚠️ Google Indexing API Daily Quota limit reached (HTTP 429). Stopping gracefully.');
          results.push(res);
          break;
        }
      }
      results.push(res);
    } catch (err) {
      failCount++;
      console.error(`[${i + 1}/${urls.length}] [ERROR] ${url} -> ${err.message}`);
      results.push({ url, ok: false, error: err.message });
    }

    // Rate control pause: 350ms between requests
    await new Promise((r) => setTimeout(r, 350));
  }

  console.log('\n========================================');
  console.log('INDEXING RUN COMPLETE');
  console.log('========================================');
  console.log(`Total attempted : ${results.length}`);
  console.log(`Accepted by Google: ${successCount}`);
  console.log(`Failed / Rate Limit: ${failCount}`);

  const reportPath = path.resolve('indexing-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        serviceAccount: key.client_email,
        total: results.length,
        accepted: successCount,
        failed: failCount,
        results,
      },
      null,
      2
    ),
    'utf8'
  );
  console.log('Detailed report saved to:', reportPath);
}

run().catch(console.error);
