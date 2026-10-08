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

const FONT_DEFS = [
  { name: 'Cinzel', query: 'family=Cinzel:wght@700;900' },
  { name: 'Inter', query: 'family=Inter:wght@700;900' },
  { name: 'Montserrat', query: 'family=Montserrat:wght@700;900' },
  { name: 'Playfair Display', query: 'family=Playfair+Display:wght@700;900' },
  { name: 'Plus Jakarta Sans', query: 'family=Plus+Jakarta+Sans:wght@700;800' },
  { name: 'Bodoni Moda', query: 'family=Bodoni+Moda:wght@700;900' },
  { name: 'Syne', query: 'family=Syne:wght@700;800' },
  { name: 'Bebas Neue', query: 'family=Bebas+Neue' },
  { name: 'Outfit', query: 'family=Outfit:wght@700;900' },
  { name: 'Poppins', query: 'family=Poppins:wght@700;900' },
  { name: 'Oswald', query: 'family=Oswald:wght@700' },
];

const tmpDir = path.join(process.cwd(), 'scratch', 'fonts');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

async function run() {
  console.log('Downloading fonts from Google Fonts and uploading to Cloudinary...');
  const uploadedFonts = {};

  for (const font of FONT_DEFS) {
    try {
      const url = `https://fonts.googleapis.com/css2?${font.query}&display=swap`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const css = await res.text();

      const latinBlocks = css.split('@font-face').filter(b => b.includes('latin') || !b.includes('/* '));
      const targetBlock = latinBlocks.find(b => b.includes('/* latin */')) || latinBlocks[0] || css;

      const urlMatch = targetBlock.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
      if (!urlMatch) {
        console.warn(`Could not find woff2 URL for ${font.name}`);
        continue;
      }

      const woff2Url = urlMatch[1];
      console.log(`Downloading ${font.name} from ${woff2Url}...`);

      const fontFileRes = await fetch(woff2Url);
      const fontBuffer = Buffer.from(await fontFileRes.arrayBuffer());

      const slug = font.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const localFilePath = path.join(tmpDir, `${slug}.woff2`);
      fs.writeFileSync(localFilePath, fontBuffer);

      console.log(`Uploading ${font.name} to Cloudinary...`);
      const uploadRes = await cloudinary.uploader.upload(localFilePath, {
        folder: 'fonts',
        public_id: `${slug}-bold`,
        resource_type: 'raw',
        overwrite: true,
      });

      console.log(`Uploaded ${font.name}: ${uploadRes.secure_url}`);
      uploadedFonts[font.name] = {
        name: font.name,
        slug,
        secure_url: uploadRes.secure_url,
      };
    } catch (err) {
      console.error(`Error processing ${font.name}:`, err.message);
    }
  }

  const outputPath = path.join(process.cwd(), 'lib', 'cloudinary', 'fonts.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedFonts, null, 2));
  console.log(`All fonts saved to ${outputPath}!`);
}

run();
