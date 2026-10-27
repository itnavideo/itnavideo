// Lightweight script to ping Google, Bing, and IndexNow with sitemap and updated URLs
const SITE_URL = 'https://www.itnavideo.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_KEY = 'itnavideo';

// Core newly updated pages and studio URLs to index immediately
const CORE_URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/video-types`,
  `${SITE_URL}/faceless-video`,
  `${SITE_URL}/book-summary`,
  `${SITE_URL}/image-to-video-ai`,
  `${SITE_URL}/auto-caption`,
  `${SITE_URL}/auto-captions`,
  `${SITE_URL}/auto-caption-generator`,
  `${SITE_URL}/auto-caption-reel`,
  `${SITE_URL}/typography-video`,
  `${SITE_URL}/whiteboard-video`,
  `${SITE_URL}/compare-explainer`,
  `${SITE_URL}/long-video-clips`,
  `${SITE_URL}/long-video-promo`,
  `${SITE_URL}/voice-synced-notes`,
  `${SITE_URL}/ai-audio-cleaner`,
  `${SITE_URL}/tools/ai-audio-cleaner`,
  `${SITE_URL}/tools/image-to-video-ai`,
  `${SITE_URL}/video-types/book-summary`,
  `${SITE_URL}/video-types/youtube-subtitle-generator`,
  `${SITE_URL}/video-types/faceless-video`,
  `${SITE_URL}/video-types/typography-video`,
  `${SITE_URL}/video-types/whiteboard-video`,
  `${SITE_URL}/video-types/compare-explainer`,
  `${SITE_URL}/video-types/long-video-clips`,
  `${SITE_URL}/video-types/long-video-promo`,
  `${SITE_URL}/video-types/ai-audio-cleaner`,
  `${SITE_URL}/video-types/voice-synced-notes`,
  `${SITE_URL}/video-types/long-caption-pro`,
  `${SITE_URL}/pricing`,
  `${SITE_URL}/blog`,
];

async function pingSearchEngines() {
  console.log('=== PINGING SEARCH ENGINES & INDEXNOW ===\n');

  // 1. Google Ping
  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    console.log(`[1] Pinging Google (${googlePingUrl})...`);
    const res = await fetch(googlePingUrl);
    console.log(`    Google Ping Response: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(`    Google Ping Warning:`, err.message);
  }

  // 2. Bing Ping
  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    console.log(`\n[2] Pinging Bing (${bingPingUrl})...`);
    const res = await fetch(bingPingUrl);
    console.log(`    Bing Ping Response: ${res.status} ${res.statusText}`);
  } catch (err) {
    console.warn(`    Bing Ping Warning:`, err.message);
  }

  // 3. IndexNow Batch Submission (Bing, Yandex, Seznam, Naver)
  try {
    console.log(`\n[3] Submitting ${CORE_URLS.length} URLs to IndexNow API...`);
    const indexNowBody = {
      host: 'www.itnavideo.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: CORE_URLS,
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowBody),
    });

    console.log(`    IndexNow Response: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log('    [SUCCESS] URLs accepted by IndexNow network!');
    } else {
      const text = await res.text();
      console.log('    Response body:', text);
    }
  } catch (err) {
    console.warn(`    IndexNow Warning:`, err.message);
  }

  console.log('\n=== INDEXING SUBMISSION COMPLETE ===');
}

pingSearchEngines().catch(console.error);
