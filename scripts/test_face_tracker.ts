import path from 'node:path';
import fs from 'node:fs';
import { extractFaceKeyframes } from '../services/vision/faceTracker';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

async function main() {
  console.log('=== Face Tracker Verification Test ===');
  const videoPath = path.resolve(process.cwd(), 'docs/references/long-form/videoplayback (1).mp4');
  const result = await extractFaceKeyframes(videoPath, 30, 2.0);
  console.log('Result Source:', result.source);
  console.log('Is Static Center:', result.isStaticCenter);
  console.log('Average X Center:', result.averageXCenter);
  console.log('Average Y Center:', result.averageYCenter);
  console.log('Total Keyframes:', result.keyframes.length);
  console.log('Keyframes:', JSON.stringify(result.keyframes, null, 2));
}

main().catch(console.error);
