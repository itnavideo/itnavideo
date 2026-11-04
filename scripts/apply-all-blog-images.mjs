import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

// Helper to get image URL by key
function getImageUrl(key) {
  try {
    const raw = readFileSync('scripts/blog-uploaded-images.json', 'utf8');
    const catalog = JSON.parse(raw);
    const found = catalog.find(x => x.id === key);
    if (found && found.cleanUrl) return found.cleanUrl;
  } catch (e) {}
  return `https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto/itnavideo12345/${key}.png`;
}

function pickImageKeyForPost(post) {
  const rawText = `${post.slug} ${post.title || ''} ${post.category || ''} ${(post.keywords || []).join(' ')}`.toLowerCase();
  const text = rawText.replace(/[-_]/g, ' ');

  // 1. Real Estate & Property
  if (text.includes('dubai')) return 'blog_dubai_real_estate';
  if (text.includes('luxury real estate') || text.includes('miami') || text.includes('penthouse') || text.includes('knightsbridge')) return 'blog_luxury_real_estate';
  if (text.includes('commercial') || text.includes('architect') || text.includes('listing stats')) return 'blog_commercial_real_estate';
  if (text.includes('real estate') || text.includes('realtor') || text.includes('property')) return 'blog_real_estate_agent_usa';
  
  // 2. Finance & Business ROI
  if (text.includes('finance') || text.includes('stock') || text.includes('crypto')) return 'blog_finance_creator';
  if (text.includes('roi') || text.includes('cost') || text.includes('math') || text.includes('analyst') || text.includes('contractors')) return 'blog_roi_business_analyst';
  if (text.includes('ecommerce') || text.includes('e commerce') || text.includes('shopify') || text.includes('conversion rate')) return 'blog_batch_video_creator';

  // 3. Audio, Podcasts & Voice
  if (text.includes('podcast') || text.includes('podcaster')) return 'blog_podcaster_new_york';
  if (text.includes('voice') || text.includes('voiceover') || text.includes('speech') || text.includes('audio cleaner') || text.includes('audio')) return 'blog_voice_to_video';

  // 4. YouTube, Shorts & Faceless Channels
  if (text.includes('faceless') || text.includes('passive') || text.includes('automation')) return 'blog_faceless_channel_creator';
  if (text.includes('youtube shorts') || text.includes('shorts')) return 'blog_youtube_shorts_creator';
  if (text.includes('youtube') || text.includes('long form') || text.includes('channel')) return 'blog_youtube_creator_usa';

  // 5. Agencies & Freelancers
  if (text.includes('australia') || text.includes('sydney') || text.includes('melbourne')) return 'blog_agency_australia';
  if (text.includes('freelance') || text.includes('freelancer') || text.includes('vienna') || text.includes('austria') || text.includes('hourly')) return 'blog_freelancer_europe';
  if (text.includes('agency') || text.includes('agencies') || text.includes('team') || text.includes('b2b')) return 'blog_marketing_agency_team';

  // 6. Tools Comparison & Video Editing
  if (text.includes('capcut') || text.includes('veed') || text.includes('vs') || text.includes('comparison')) return 'blog_ai_video_tools_comparison';
  if (text.includes('video editor') || text.includes('premiere') || text.includes('remotion') || text.includes('motion precision') || text.includes('german')) return 'blog_video_producer_studio';
  if (text.includes('upgrade') || text.includes('unlock') || text.includes('pro tier') || text.includes('free tier')) return 'blog_ai_tools_upgrade';

  // 7. Education & Tutorials
  if (text.includes('education') || text.includes('teacher') || text.includes('school') || text.includes('whiteboard')) return 'blog_educator_europe';
  if (text.includes('tutorial') || text.includes('step by step') || text.includes('how to make explainer') || text.includes('guide')) return 'blog_tutorial_creator';

  // 8. Social, Captions & Typography
  if (text.includes('tiktok') || text.includes('without a computer') || text.includes('mobile')) return 'blog_mobile_creator_phone';
  if (text.includes('accessibility') || text.includes('accessible')) return 'blog_accessibility_creator';
  if (text.includes('font') || text.includes('color') || text.includes('typography') || text.includes('styles')) return 'blog_subtitle_designer';
  if (text.includes('instagram') || text.includes('reels')) return 'blog_instagram_creator_reels';
  
  // Default captions / video creation fallback
  return 'blog_captions_creator_usa';
}

function patchFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let count = 0;

  // Find all slug declarations: either "slug": "..." or slug: '...'
  const slugRegex = /(["']?slug["']?\s*:\s*["']([^"']+)["'])/g;
  let match;
  const matches = [];

  while ((match = slugRegex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      slug: match[2],
      index: match.index,
    });
  }

  // Work backwards so string offsets don't shift
  for (let i = matches.length - 1; i >= 0; i--) {
    const item = matches[i];
    const blockContext = content.slice(item.index, item.index + 800);
    const key = pickImageKeyForPost({ slug: item.slug, title: blockContext });
    const imgUrl = getImageUrl(key);

    // Look for existing featuredImage in the next 300 characters
    const lookahead = content.slice(item.index, item.index + 400);
    if (/featuredImage\s*:\s*["'][^"']*["']/.test(lookahead)) {
      // Replace existing featuredImage
      const replaced = lookahead.replace(/featuredImage\s*:\s*["'][^"']*["']/, `featuredImage: "${imgUrl}"`);
      content = content.slice(0, item.index) + replaced + content.slice(item.index + 400);
      count++;
    } else {
      // Insert featuredImage right after the slug line
      const lineEnd = content.indexOf('\n', item.index);
      if (lineEnd !== -1) {
        // Detect indent from current line
        const lineStart = content.lastIndexOf('\n', item.index);
        const indentMatch = content.slice(lineStart + 1, item.index).match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : '    ';
        const insertion = `\n${indent}featuredImage: "${imgUrl}",`;
        content = content.slice(0, lineEnd) + insertion + content.slice(lineEnd);
        count++;
      }
    }
  }

  writeFileSync(filePath, content, 'utf8');
  console.log(`Patched ${filePath}: ${count} posts updated with featured images.`);
}

console.log('Applying Cloudinary watermark-free featured images to all blog posts...');
patchFile('lib/blogPosts.ts');
patchFile('lib/newExpandedBlogPosts.ts');
patchFile('lib/conversionBlogPosts.ts');
console.log('All blog posts successfully updated!');
