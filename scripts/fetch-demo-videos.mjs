import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dhouh9idx";
const API_KEY = process.env.CLOUDINARY_API_KEY || "972395946869552";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "wSwqFlvlj0DhvMA5yEXyjlt8uMo";
const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

const folders = [
  'imageToVideoAi',
  'youtubeSubtitles',
  'autoCaption',
  'facelessVideo',
  'compareExplainer',
  'typographyVideo',
  'whiteboardVideo',
  'longVideoPromo',
  'longVideoClips',
  'audioCleaner'
];

async function fetchVideosFromFolder(folderName) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
  
  // Try video first
  let query = { expression: `folder="itnavideo-assets/video-types/${folderName}" AND resource_type="video"`, max_results: 1 };
  let res = await fetch(url, { method: 'POST', headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify(query) });
  let data = await res.json();

  if (data.resources && data.resources.length > 0) {
    const video = data.resources[0];
    return { folder: folderName, videoUrl: video.secure_url, posterUrl: video.secure_url.replace(/\.[^/.]+$/, ".jpg"), publicId: video.public_id };
  }

  // Try image fallback
  query = { expression: `folder="itnavideo-assets/video-types/${folderName}" AND resource_type="image"`, max_results: 1 };
  res = await fetch(url, { method: 'POST', headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify(query) });
  data = await res.json();

  if (data.resources && data.resources.length > 0) {
    const img = data.resources[0];
    return { folder: folderName, videoUrl: img.secure_url, posterUrl: img.secure_url, publicId: img.public_id, isImageOnly: true };
  }

  return null;
}

async function main() {
  console.log('Fetching videos from Cloudinary...');
  const results = {};

  for (const folder of folders) {
    const videoData = await fetchVideosFromFolder(folder);
    if (videoData) {
      results[folder] = videoData;
      console.log(`✅ Found video for ${folder}`);
    } else {
      console.log(`⚠️ No video found in ${folder}`);
    }
  }

  const outputPath = path.resolve(__dirname, '../lib/cloudinary/demo-videos.json');
  // Ensure dir exists
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n🎉 Saved fetched video links to ${outputPath}`);
}

main();
