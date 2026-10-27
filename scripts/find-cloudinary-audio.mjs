// scripts/find-cloudinary-audio.mjs
// Use native fetch and Cloudinary REST API (Zero dependencies)
import fs from 'node:fs';

const CLOUD_NAME = 'dhouh9idx';
const API_KEY = '972395946869552';
const API_SECRET = 'wSwqFlvlj0DhvMA5yEXyjlt8uMo';

async function listAudio() {
  try {
    console.log('Querying Cloudinary REST API for video/audio resources...');
    const authHeader = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    
    // Check both video resource_type (audio files are often stored under video resource_type in Cloudinary)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/video?max_results=100`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch from Cloudinary:', res.status, await res.text());
      return;
    }

    const data = await res.json();
    console.log(`Found ${data.resources.length} resources under 'video' type:`);
    const audioFiles = [];
    for (const r of data.resources) {
      console.log(`- Format: ${r.format} | PublicId: ${r.public_id} | Bytes: ${r.bytes} | URL: ${r.secure_url}`);
      if (['wav', 'mp3', 'm4a', 'aac', 'ogg'].includes(r.format?.toLowerCase()) || r.public_id.includes('audio') || r.public_id.includes('speech')) {
        audioFiles.push(r);
      }
    }

    // Also check raw resource_type just in case
    const rawRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/raw?max_results=50`, {
      headers: {
        Authorization: authHeader,
      },
    });
    if (rawRes.ok) {
      const rawData = await rawRes.json();
      console.log(`Found ${rawData.resources.length} resources under 'raw' type:`);
      for (const r of rawData.resources) {
        console.log(`- Format: ${r.format} | PublicId: ${r.public_id} | Bytes: ${r.bytes} | URL: ${r.secure_url}`);
        if (['wav', 'mp3', 'm4a', 'aac', 'ogg'].includes(r.format?.toLowerCase()) || r.public_id.includes('audio') || r.public_id.includes('speech')) {
          audioFiles.push(r);
        }
      }
    }

    console.log('\n=== DETECTED AUDIO FILES ===');
    console.log(JSON.stringify(audioFiles, null, 2));
  } catch (err) {
    console.error('Error listing resources:', err);
  }
}

listAudio();
