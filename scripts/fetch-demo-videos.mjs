import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dhouh9idx',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  const folders = [
    'Demo Videos/Typography Demo Videos',
    'Demo Videos/Auto Caption Demo Videos',
    'Demo Videos/Compare Explainer Demo videos',
    'Kinetic Typography Videos',
    'Demo Videos'
  ];

  const results = {};

  for (const f of folders) {
    try {
      const res = await cloudinary.search
        .expression(`resource_type:video AND (folder:"${f}" OR asset_folder:"${f}")`)
        .max_results(50)
        .execute();
      console.log(`\n=== Folder: ${f} (${res.resources.length} videos) ===`);
      results[f] = res.resources.map(v => ({
        public_id: v.public_id,
        url: v.secure_url,
        duration: v.duration,
        width: v.width,
        height: v.height,
        format: v.format
      }));
    } catch (e) {
      console.error(`Error for ${f}:`, e.message);
    }
  }

  // Also query all videos across Cloudinary to see if any typography videos are in other folders
  const allVideos = await cloudinary.search
    .expression('resource_type:video')
    .max_results(500)
    .execute();

  const nonSFX = allVideos.resources.filter(v => {
    const folder = v.folder || v.asset_folder || '';
    return folder !== 'SFX' && folder !== 'Background Music';
  });
  console.log(`\n=== Total Non-SFX/Music Videos in Account: ${nonSFX.length} ===`);
  results['all_demo_videos'] = nonSFX.map(v => ({
    folder: v.folder || v.asset_folder,
    public_id: v.public_id,
    url: v.secure_url,
    duration: v.duration,
    width: v.width,
    height: v.height,
    format: v.format
  }));

  fs.writeFileSync('lib/cloudinary/demo-videos.json', JSON.stringify(results, null, 2));
  console.log('Saved to lib/cloudinary/demo-videos.json');
}

main().catch(console.error);
