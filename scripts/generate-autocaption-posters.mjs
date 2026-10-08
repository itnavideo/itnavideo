import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dhouh9idx';
const catalogPath = path.resolve(__dirname, '../lib/cloudinary/autocaption-transcripts.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const videos = Object.values(catalog).filter((entry) => entry.status === 'complete' && entry.publicId);

if (!videos.length) throw new Error('No completed preview transcripts found.');

let failures = 0;
console.log(`Cloudinary preview posters to warm: ${videos.length}`);

for (let index = 0; index < videos.length; index += 1) {
  const video = videos[index];
  const encodedPublicId = video.publicId.split('/').map(encodeURIComponent).join('/');
  const posterUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_0.5,f_auto,q_auto/${encodedPublicId}.jpg`;

  try {
    const response = await fetch(posterUrl, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Cloudinary returned ${response.status}`);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) throw new Error(`Unexpected content type: ${contentType || 'unknown'}`);
    const image = await response.arrayBuffer();
    if (!image.byteLength) throw new Error('Cloudinary returned an empty poster.');

    console.log(`[${index + 1}/${videos.length}] Ready ${video.filename}`);
  } catch (error) {
    failures += 1;
    console.error(`[${index + 1}/${videos.length}] Failed ${video.filename}: ${error.message}`);
  }
}

console.log(`Poster frames ready: ${videos.length - failures}; failed: ${failures}`);
if (failures) process.exitCode = 1;