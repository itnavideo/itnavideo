import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dhouh9idx";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
if (!API_KEY || !API_SECRET) {
  console.error("❌ CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set in .env.local");
  process.exit(1);
}
const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

// Exact 10 active video types
const desiredFolders = [
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

async function getExistingFolders() {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/itnavideo-assets/video-types`;
  const res = await fetch(url, { headers: { 'Authorization': `Basic ${auth}` }});
  if (!res.ok) return [];
  const data = await res.json();
  return data.folders.map(f => f.name);
}

async function deleteFolder(folderPath) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${folderPath}`;
  const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `Basic ${auth}` }});
  if (res.ok) console.log(`🗑️ Deleted old folder: ${folderPath}`);
  else console.error(`❌ Failed to delete ${folderPath}`, await res.text());
}

async function createFolder(folderPath) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${folderPath}`;
  const res = await fetch(url, { method: 'POST', headers: { 'Authorization': `Basic ${auth}` }});
  if (res.ok) console.log(`✅ Created folder: ${folderPath}`);
  else {
      const err = await res.json();
      if (err.error && err.error.message.includes('exists')) console.log(`✅ Folder already exists: ${folderPath}`);
      else console.error(`❌ Failed to create ${folderPath}`, err);
  }
}

async function main() {
  console.log('Fetching current folders from Cloudinary...');
  const existing = await getExistingFolders();
  console.log('Found existing folders:', existing);

  // Delete ones not in desired list
  for (const folder of existing) {
    if (!desiredFolders.includes(folder)) {
      await deleteFolder(`itnavideo-assets/video-types/${folder}`);
    }
  }

  console.log('\nCreating active video type folders...');
  // Create exact desired folders
  for (const folder of desiredFolders) {
    await createFolder(`itnavideo-assets/video-types/${folder}`);
  }
  
  console.log('\n🎉 Cloudinary folders sync complete! Only the 10 active types remain.');
}

main();
