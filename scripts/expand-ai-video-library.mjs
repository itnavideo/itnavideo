import fs from 'fs';
import path from 'path';

const assetsPath = path.resolve('lib/cloudinary/assets.json');
const libraryPath = path.resolve('lib/cloudinary/ai-video-library.json');
const localAssetsPath = path.resolve('public/assets/assets.json');

const assetsData = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
const currentLibrary = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const localAssetsData = JSON.parse(fs.readFileSync(localAssetsPath, 'utf8'));

const existingPublicIds = new Set(currentLibrary.map(item => item.public_id || item.filename));
const existingUrls = new Set(currentLibrary.map(item => item.url));

function inferCategoryAndTags(filename, folder = '') {
  const clean = filename.toLowerCase().replace(/[-_]/g, ' ');
  const words = clean.split(/\s+/).filter(w => w.length > 2 && !/^\d+$/.test(w));
  
  let category = 'general';
  if (/doctor|hospital|medical|nurse|health|clinic/.test(clean)) category = 'healthcare';
  else if (/student|campus|school|college|study|exam|graduat|book|library/.test(clean)) category = 'education';
  else if (/engineer|code|software|ai|developer|laptop|tech|cyber|robot|database|sql|oracle|cloud|server/.test(clean)) category = 'technology';
  else if (/zomato|zepto|swiggy|delivery|rider|food|motorbike/.test(clean)) category = 'gig_economy';
  else if (/finance|money|dollar|cash|wealth|invest|bank|budget|debt|coins|wallet|salary|payment|revenue|crypto/.test(clean)) category = 'finance';
  else if (/shopping|store|menswear|shirt|retail|buy|fashion/.test(clean)) category = 'lifestyle';
  else if (/mortgage|loan|broker|real estate|home loan|house|property/.test(clean)) category = 'real_estate';
  else if (/creator|recording|reel|camera|studio|youtube|shorts|video/.test(clean)) category = 'creator_economy';
  else if (/anxiety|stress|phone|night|sleepless|burnout|mindset|focus|brain/.test(clean)) category = 'mindset';
  else if (/office|work|job|career|business|meeting|interview|startup|leader/.test(clean)) category = 'business';
  else if (folder.includes('book-summary')) category = 'education';
  else if (folder.includes('database-svgs')) category = 'technology';
  
  const tags = Array.from(new Set([
    category,
    ...words,
    'cinematic',
    'high-retention visual'
  ])).slice(0, 16);

  const title = words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return { category, tags, title };
}

let addedCount = 0;
const newEntries = [];

// 1. Ingest from ALL Cloudinary folders (Compare explainer, Website images, etc.)
for (const folderName in assetsData) {
  if (!Array.isArray(assetsData[folderName])) continue;
  
  for (const item of assetsData[folderName]) {
    if (!item || !item.secure_url) continue;
    if (item.format !== 'png' && item.format !== 'jpg' && item.format !== 'webp' && item.format !== 'svg') continue;
    
    const publicId = item.public_id || item.filename;
    if (!publicId || existingPublicIds.has(publicId) || existingUrls.has(item.secure_url)) continue;
    
    // Skip internal admin screenshots
    if (/Dashboard-Itnavideo|render-process|avatar|logo|testimonal/i.test(publicId)) continue;
    
    const { category, tags, title } = inferCategoryAndTags(item.filename || publicId, folderName);
    const isVertical = (item.height || 1080) > (item.width || 1920) * 1.15;
    const aspectRatio = isVertical ? '9:16' : '16:9';

    const entry = {
      id: `ai_asset_cloud_${String(currentLibrary.length + addedCount + 1).padStart(4, '0')}`,
      public_id: publicId,
      url: item.secure_url,
      title: title || 'Cinematic Creator Visual',
      category,
      tags,
      visualDescription: `Cinematic ${aspectRatio} visual depicting ${title.toLowerCase()} for high-retention narrative storytelling.`,
      mood: isVertical ? 'dynamic, snappy, vertical short' : 'cinematic, editorial documentary',
      aspectRatio,
      dominantColor: isVertical ? '#0F172A' : '#1E293B'
    };

    existingPublicIds.add(publicId);
    existingUrls.add(item.secure_url);
    newEntries.push(entry);
    addedCount++;
  }
}

// 2. Ingest from local S3/assets (Database SVGs, Book Summary, Reusable Concept Visuals)
const S3_BASE = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/';
for (const localAsset of localAssetsData.assets) {
  if (localAsset.type !== 'image' || !localAsset.file) continue;
  
  const s3Url = S3_BASE + localAsset.file;
  const publicId = localAsset.id || localAsset.file;
  
  if (existingPublicIds.has(publicId) || existingUrls.has(s3Url) || existingUrls.has(localAsset.src)) continue;
  
  // Skip direct page-specific or avatar images
  if (localAsset.scope === 'direct' || localAsset.file.startsWith('auth/')) continue;
  
  const { category, tags, title } = inferCategoryAndTags(path.basename(localAsset.file), localAsset.file);
  const w = localAsset.dimensions?.width || 1920;
  const h = localAsset.dimensions?.height || 1080;
  const isVertical = h > w * 1.15;
  const aspectRatio = isVertical ? '9:16' : '16:9';

  const entry = {
    id: `ai_asset_s3_${String(currentLibrary.length + addedCount + 1).padStart(4, '0')}`,
    public_id: publicId,
    url: s3Url,
    title: localAsset.title || title || 'Motion Graphic Concept',
    category,
    tags: Array.from(new Set([...tags, ...(localAsset.tags || [])])).slice(0, 16),
    visualDescription: localAsset.detailedDescription || `Vector and visual graphic for ${title.toLowerCase()}.`,
    mood: isVertical ? 'dynamic, snappy, vertical short' : 'cinematic, editorial documentary',
    aspectRatio,
    dominantColor: '#0F172A'
  };

  existingPublicIds.add(publicId);
  existingUrls.add(s3Url);
  newEntries.push(entry);
  addedCount++;
}

const finalLibrary = [...currentLibrary, ...newEntries];
fs.writeFileSync(libraryPath, JSON.stringify(finalLibrary, null, 2), 'utf8');

console.log(`\n🎉 MASTER EXPANSION COMPLETE!`);
console.log(`Initial entries: ${currentLibrary.length}`);
console.log(`Newly added entries: ${addedCount}`);
console.log(`TOTAL CURATED ASSETS: ${finalLibrary.length}`);

const ratioSummary = {};
for (const e of finalLibrary) {
  ratioSummary[e.aspectRatio] = (ratioSummary[e.aspectRatio] || 0) + 1;
}
console.log('\nAspect ratio distribution:', ratioSummary);

const catSummary = {};
for (const e of finalLibrary) {
  catSummary[e.category] = (catSummary[e.category] || 0) + 1;
}
console.log('\nCategory breakdown:', catSummary);
