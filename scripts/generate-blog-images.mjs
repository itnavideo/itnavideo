// Blog Feature Image Generator & Cloudinary Uploader
// Run: node scripts/generate-blog-images.mjs
// Generates AI images for all blog posts and uploads to Cloudinary

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ── Cloudinary config ──────────────────────────────────────────
const CLOUD_NAME   = 'dhouh9idx';
const API_KEY      = '972395946869552';
const API_SECRET   = 'wSwqFlvlj0DhvMA5yEXyjlt8uMo';
const FOLDER       = 'itnavideo12345/blog-features';

// ── Unsplash source (free, high-res, no key required) ──────────
// We'll build descriptive search URLs per post topic
// Image style: professional, diverse person + topic context, 1200x630 (16:9 blog hero)

const BLOG_POSTS = [
  // Real Estate & Property
  { slug: 'best-ai-video-generator-luxury-real-estate',       query: 'luxury+real+estate+broker+London+modern',          character: 'professional woman broker' },
  { slug: 'dubai-real-estate-video-marketing-ai-blueprint',   query: 'Dubai+luxury+property+businessman+skyline',        character: 'businessman Dubai' },
  { slug: 'commercial-real-estate-listing-stats-typography',  query: 'commercial+building+architect+Europe+professional', character: 'architect man' },
  // Marketing & Agencies
  { slug: 'why-agencies-switch-from-video-editors-to-itnavideo', query: 'marketing+agency+team+USA+office+creative',      character: 'creative team USA' },
  { slug: 'how-australian-marketing-agencies-scale-50-client-reels', query: 'creative+agency+australia+woman+laptop',    character: 'woman agency Australia' },
  { slug: 'whiteboard-video-ai-agency-reseller-guide',        query: 'business+coach+whiteboard+presentation+europe',   character: 'coach Europe' },
  // YouTube & Content Creation
  { slug: 'faceless-youtube-channel-automation-profit-guide', query: 'content+creator+podcast+USA+home+studio',         character: 'content creator home studio' },
  { slug: 'image-to-video-ai-cost-roi-breakdown',             query: 'video+producer+editing+laptop+studio+USA',        character: 'video producer USA' },
  { slug: 'turn-audio-podcast-into-viral-video-reels-profit', query: 'podcaster+microphone+New+York+creator',           character: 'podcaster New York' },
  // Typography & Design
  { slug: 'kinetic-typography-reel-maker-commercial-guide',   query: 'graphic+designer+typography+london+creative',     character: 'designer London' },
  { slug: 'why-german-and-japanese-brands-choose-itnavideo-motion-precision', query: 'engineer+precision+design+Germany+europe', character: 'engineer Germany' },
  // Captions & Subtitles
  { slug: 'best-ai-caption-generator-2026',                   query: 'creator+phone+social+media+reels+USA+woman',      character: 'woman creator USA' },
  { slug: 'how-to-add-captions-to-instagram-reels',           query: 'instagram+influencer+woman+phone+europe',         character: 'influencer Europe' },
  { slug: 'how-to-add-captions-to-youtube-shorts',            query: 'youtube+creator+laptop+studio+USA+man',           character: 'creator USA' },
  { slug: 'itnavideo-vs-capcut',                              query: 'video+editor+comparison+laptop+desk+UK',          character: 'video editor UK' },
  { slug: 'itnavideo-vs-veed',                                query: 'creative+professional+austria+laptop',            character: 'professional Austria' },
  { slug: 'itnavideo-vs-capcut-auto-captions-which-is-better-for-subtitles', query: 'content+creator+captions+review+London', character: 'reviewer London' },
  { slug: 'compare-explainer-videos-ecommerce-conversion-rate', query: 'ecommerce+entrepreneur+europe+laptop+business',  character: 'entrepreneur Europe' },
  { slug: 'how-to-create-reels-from-audio',                   query: 'audio+creator+headphones+studio+USA',             character: 'audio creator USA' },
  { slug: 'how-to-turn-long-videos-into-short-promos',        query: 'video+editor+woman+london+creative+agency',       character: 'editor London' },
  { slug: 'best-ai-reel-generators',                          query: 'social+media+manager+USA+europe+phone',           character: 'social media manager' },
  { slug: 'voice-to-video-ai-tools',                          query: 'voiceover+artist+microphone+studio+USA',          character: 'voiceover artist USA' },
  { slug: 'best-ai-video-generator-for-youtube-shorts',       query: 'youtube+shorts+creator+london+UK+studio',         character: 'creator UK' },
  { slug: 'how-to-make-explainer-videos-for-reels',           query: 'educator+teacher+europe+online+class+laptop',     character: 'educator Europe' },
  { slug: 'convert-any-text-to-realistic-video-with-ai',      query: 'writer+content+usa+desk+creative',                character: 'writer USA' },
  { slug: 'capcut-pro-vs-itnavideo-pro-agency-comparison',    query: 'agency+comparison+tools+UK+professional',         character: 'professional UK' },
  { slug: 'the-true-roi-of-ai-video-credits-vs-hourly-contractors', query: 'business+analytics+ROI+europe+office',      character: 'analyst Europe' },
  { slug: 'from-free-tier-to-itnavideo-pro-what-you-unlock',  query: 'freelancer+upgrade+laptop+home+usa',              character: 'freelancer USA' },
  { slug: 'how-to-add-captions-to-tiktok-videos-with-an-ai-caption-generator', query: 'tiktok+creator+USA+europe+phone+studio', character: 'tiktok creator' },
  { slug: 'how-to-add-captions-to-instagram-reels-without-a-computer-or-desktop-editor', query: 'mobile+creator+phone+europe+woman', character: 'mobile creator' },
  { slug: 'best-caption-styles-for-reels-2026',               query: 'designer+reels+style+typography+USA+woman',       character: 'designer USA' },
  { slug: 'why-captions-increase-video-retention-on-instagram-and-youtube', query: 'analytics+growth+hacker+europe+laptop', character: 'growth hacker' },
  { slug: 'how-to-add-hinglish-captions-to-reels-for-indian-creators', query: 'indian+diaspora+UK+london+creator+phone', character: 'Indian creator UK' },
  { slug: 'burned-in-captions-vs-soft-subtitles-which-is-better-for-reels', query: 'content+comparison+studio+usa+man', character: 'studio man USA' },
  { slug: 'caption-font-size-guide-for-reels',                query: 'graphic+design+typography+mobile+europe',         character: 'designer Europe' },
  { slug: 'how-to-use-auto-captions-for-educational-videos',  query: 'teacher+online+education+europe+laptop',          character: 'teacher Europe' },
  { slug: 'caption-placement-guide-for-instagram-reels',      query: 'instagram+creator+woman+studio+usa+vertical',     character: 'instagram creator USA' },
  { slug: 'ai-subtitle-generator-comparison-2026',            query: 'tech+reviewer+comparison+london+desk',            character: 'tech reviewer London' },
  { slug: 'how-to-caption-podcast-clips-for-instagram-reels', query: 'podcaster+clips+europe+woman+headphones',         character: 'podcaster Europe' },
  { slug: 'subtitle-color-guide-for-reels',                   query: 'designer+color+palette+studio+USA',               character: 'designer USA' },
  { slug: 'how-finance-creators-can-use-auto-captions',       query: 'finance+creator+charts+USA+professional',         character: 'finance creator USA' },
  { slug: 'word-level-captions-vs-sentence-captions',         query: 'editor+reviewing+captions+europe+laptop',         character: 'editor Europe' },
  { slug: 'how-to-make-video-captions-accessible',            query: 'accessibility+advocate+usa+europe+laptop',        character: 'accessibility USA' },
];

// ── Upload to Cloudinary via REST API ──────────────────────────
async function uploadToCloudinary(imageUrl, publicId) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${FOLDER}&public_id=${publicId}&timestamp=${timestamp}`;
  
  // HMAC-SHA1 signature
  const { createHmac } = await import('crypto');
  const signature = createHmac('sha1', API_SECRET)
    .update(paramsToSign)
    .digest('hex');

  const formData = new URLSearchParams({
    file: imageUrl,
    upload_preset: '',
    public_id: publicId,
    folder: FOLDER,
    timestamp: String(timestamp),
    api_key: API_KEY,
    signature,
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cloudinary upload failed for ${publicId}: ${err}`);
  }

  const data = await response.json();
  return data.secure_url;
}

// ── Build Unsplash Source URL (free, no API key needed) ─────────
function buildImageUrl(query, width = 1200, height = 630) {
  // Unsplash Source — free, random high-quality image by search query
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(query)}`;
}

// ── Main pipeline ───────────────────────────────────────────────
async function main() {
  console.log(`\n🎨 Blog Feature Image Generator`);
  console.log(`📦 Uploading to Cloudinary folder: ${FOLDER}`);
  console.log(`📝 Total posts to process: ${BLOG_POSTS.length}\n`);

  const results = {}; // slug -> cloudinary URL
  const failed  = [];

  for (let i = 0; i < BLOG_POSTS.length; i++) {
    const { slug, query } = BLOG_POSTS[i];
    const publicId = slug;
    const imageUrl = buildImageUrl(query);

    process.stdout.write(`[${i + 1}/${BLOG_POSTS.length}] ${slug} ... `);

    try {
      const cloudUrl = await uploadToCloudinary(imageUrl, publicId);
      results[slug] = cloudUrl;
      console.log(`✅ ${cloudUrl}`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed.push(slug);
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 800));
  }

  // Save results JSON
  const outputPath = path.join(__dirname, 'blog-image-urls.json');
  await writeFile(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✅ Done! ${Object.keys(results).length} images uploaded.`);
  if (failed.length) console.log(`❌ Failed: ${failed.join(', ')}`);
  console.log(`📄 URLs saved to: scripts/blog-image-urls.json`);
  console.log(`\n▶️  Next step: run 'node scripts/apply-blog-images.mjs' to update blogPosts.ts`);
}

main().catch(console.error);

