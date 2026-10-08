import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const VIDEO_PATH = path.resolve(process.cwd(), 'public/visuals/YouTube Subtitle Generator/gemini_generated_video_5cf1bb3d.mp4');
const CLOUDINARY_FOLDER = 'itnavideo-assets/youtube-subtitles';

async function upload() {
  console.log(`🚀 Uploading YouTube Subtitle Generator preview video to Cloudinary folder: ${CLOUDINARY_FOLDER}...`);
  try {
    const res = await cloudinary.uploader.upload(VIDEO_PATH, {
      resource_type: 'video',
      folder: CLOUDINARY_FOLDER,
      public_id: 'youtube_subtitle_preview',
      overwrite: true,
      use_filename: true,
      unique_filename: false,
    });

    console.log(`✅ Upload Success!`);
    console.log(`🎬 Video URL: ${res.secure_url}`);
    console.log(`🖼️ Poster Screenshot URL: ${res.secure_url.replace(/\.mp4$/i, '.jpg')}`);
  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
}

upload();
