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
    'background images',
    'Background Music',
    'Compare explainer Dashboard preview images',
    'compare explainer insta screenshots',
    'Kinetic Typography Videos',
    'Reels Images',
    'Rendering process',
    'SFX',
    'testimonals',
    'uploads',
    'Website use images'
  ];

  const catalog = {};
  let totalCount = 0;

  for (const folder of folders) {
    catalog[folder] = [];

    try {
      let nextCursor = null;
      do {
        let query = cloudinary.search
          .expression('folder:"' + folder + '" OR asset_folder:"' + folder + '"')
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

  // Also query root / uncategorized
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
