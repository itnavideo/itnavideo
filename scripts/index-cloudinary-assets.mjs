import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dhouh9idx',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function indexAllCloudinary() {
  const folders = [
    // 1. Core Assets
    'Assets/images',
    'Assets/background images',
    'Assets/Background Music',
    'Assets/fonts',
    'Assets/SFX',

    // 2. Templates
    'Templates/Compare Explainer/Dashboard Previews',
    'Templates/Compare Explainer/Instagram Screenshots',

    // 3. Website
    'Website/images',
    'Website/rendering-process',
    'Website/testimonials',

    // 4. Demo Videos & Dashboard Videos
    'Demo Videos/Auto Caption Demo Videos',
    'Demo Videos/Compare Explainer Demo videos',
    'Demo Videos/Typography Demo Videos',
    'Demo Videos/Whiteboard Demo Video',
    'Dashboard videos/Auto Caption Generator',
  ];

  const catalog = {};
  let totalCount = 0;

  for (const folder of folders) {
    catalog[folder] = [];

    try {
      let nextCursor = null;
      do {
        let query = cloudinary.search
          .expression(`asset_folder:"${folder}" OR folder:"${folder}"`)
          .max_results(100);
          
        if (nextCursor) {
          query = query.next_cursor(nextCursor);
        }

        const res = await query.execute();
        
        for (const r of res.resources) {
          catalog[folder].push({
            public_id: r.public_id,
            filename: r.filename,
            format: r.format,
            resource_type: r.resource_type,
            secure_url: r.secure_url,
            bytes: r.bytes,
            width: r.width,
            height: r.height,
            duration: r.duration
          });
          totalCount++;
        }
        nextCursor = res.next_cursor;
      } while (nextCursor);
    } catch (e) {
      console.log('Search error for folder ' + folder + ':', e.message);
    }
    console.log('  Folder "' + folder + '": ' + catalog[folder].length + ' assets');
  }

  // Aliases for seamless backward-compatibility
  catalog['images'] = catalog['Assets/images'] || [];
  catalog['16:9 Images Library'] = catalog['Assets/images'] || [];
  catalog['Reels Images'] = catalog['Assets/images'] || [];

  catalog['background images'] = catalog['Assets/background images'] || [];
  catalog['Background Music'] = catalog['Assets/Background Music'] || [];
  catalog['SFX'] = catalog['Assets/SFX'] || [];
  catalog['fonts'] = catalog['Assets/fonts'] || [];

  catalog['Website use images'] = catalog['Website/images'] || [];
  catalog['testimonals'] = catalog['Website/testimonials'] || [];
  catalog['testimonials'] = catalog['Website/testimonials'] || [];
  catalog['Rendering process'] = catalog['Website/rendering-process'] || [];

  catalog['Compare explainer Dashboard preview images'] = catalog['Templates/Compare Explainer/Dashboard Previews'] || [];
  catalog['compare explainer insta screenshots'] = catalog['Templates/Compare Explainer/Instagram Screenshots'] || [];

  // Account wide catalog
  try {
    const rootRes = await cloudinary.search
      .expression('resource_type:image OR resource_type:video')
      .max_results(500)
      .execute();

    catalog['all_resources'] = rootRes.resources.map(r => ({
      public_id: r.public_id,
      filename: r.filename,
      folder: r.folder || r.asset_folder || '',
      format: r.format,
      resource_type: r.resource_type,
      secure_url: r.secure_url,
      bytes: r.bytes,
      width: r.width,
      height: r.height,
      duration: r.duration
    }));
    console.log('\nTotal assets in account: ' + catalog['all_resources'].length);
  } catch (e) {
    console.log('Account wide search error:', e.message);
  }

  fs.mkdirSync('lib/cloudinary', { recursive: true });
  fs.writeFileSync('lib/cloudinary/assets.json', JSON.stringify(catalog, null, 2));
  console.log('\nSaved full Cloudinary catalog to lib/cloudinary/assets.json');
}

indexAllCloudinary().catch(console.error);
