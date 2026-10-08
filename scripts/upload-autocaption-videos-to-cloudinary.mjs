/**
 * Upload all 48 AutoCaption preview videos to Cloudinary.
 * Preserves high-speed delivery, auto video optimization, and auto screenshot/poster generation (.jpg).
 * Usage: node scripts/upload-autocaption-videos-to-cloudinary.mjs
 */
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('❌ Missing Cloudinary credentials in .env.local');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const VIDEOS_DIR = path.resolve(process.cwd(), 'public/assets/reusable/autocaptionvideos');
const CLOUDINARY_FOLDER = 'itnavideo-assets/autocaptionvideos';

async function uploadVideos() {
  if (!existsSync(VIDEOS_DIR)) {
    console.error(`❌ Directory not found: ${VIDEOS_DIR}`);
    return;
  }

  const files = readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'));
  console.log(`🚀 Found ${files.length} video files to upload to Cloudinary...`);

  const results = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(VIDEOS_DIR, file);
    const publicId = path.parse(file).name;

    console.log(`[${i + 1}/${files.length}] Uploading ${file} to Cloudinary...`);

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        overwrite: false,
        use_filename: true,
        unique_filename: false,
      });

      // Cloudinary delivers video URL and automatic poster screenshot frame URL
      results[file] = {
        videoUrl: res.secure_url,
        posterUrl: res.secure_url.replace(/\.mp4$/i, '.jpg'),
        duration: res.duration,
        bytes: res.bytes,
        format: res.format,
      };

      console.log(`   ✅ Done: ${res.secure_url}`);
    } catch (err) {
      console.error(`   ❌ Failed to upload ${file}:`, err.message || err);
    }
  }

  console.log(`\n🎉 Upload complete! ${Object.keys(results).length}/${files.length} uploaded.`);
}

uploadVideos();
