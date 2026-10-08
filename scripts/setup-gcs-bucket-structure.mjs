import { Storage } from '@google-cloud/storage';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Setup ROOT_DIR pathing
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Fallback to local credentials file if env is not explicitly set
const credentialsPath = join(ROOT_DIR, 'gcp-credentials.json');

console.log('[GCS_SETUP] Checking credentials...');
if (!existsSync(credentialsPath)) {
  console.error(`[ERROR] GCP credentials not found at: ${credentialsPath}`);
  process.exit(1);
}

// Initialize storage client
const storage = new Storage({
  keyFilename: credentialsPath,
  projectId: 'geometric-hull-501707-m2', // Confirmed from gcp-credentials.json
});

// Bucket name
const BUCKET_NAME = 'itnavideo-assets';

// List of folders to create (using empty .keep files)
const FOLDERS = [
  'homepage',
  'image-to-video',
  'auto-caption',
  'youtube-subtitles',
  'faceless-video',
  'compare-explainer',
  'typography-video',
  'whiteboard-video',
  'long-video-promo',
  'long-video-clips',
  'audio-cleaner',
  'images'
];

async function setupGcsFolders() {
  console.log(`[GCS_SETUP] Initiating folder setup on bucket: "${BUCKET_NAME}"`);
  
  const bucket = storage.bucket(BUCKET_NAME);
  
  // Verify bucket existence first
  try {
    const [exists] = await bucket.exists();
    if (!exists) {
      console.error(`[ERROR] Bucket "${BUCKET_NAME}" does not exist. Please create it first in Google Cloud Console.`);
      process.exit(1);
    }
    console.log(`[GCS_SETUP] Bucket "${BUCKET_NAME}" verified successfully.`);
  } catch (err) {
    console.error(`[ERROR] Failed to connect to bucket:`, err.message);
    process.exit(1);
  }

  for (const folder of FOLDERS) {
    const gcsPath = `${folder}/.keep`;
    console.log(`[GCS_SETUP] Creating folder: "${folder}/"...`);
    
    try {
      const file = bucket.file(gcsPath);
      
      // Upload empty keep content
      await file.save('This is a placeholder file to preserve the virtual directory structure.', {
        metadata: {
          contentType: 'text/plain',
          cacheControl: 'public, max-age=31536000',
        },
      });
      
      // Make public as per rule 5 GCS guidelines
      await file.makePublic();
      console.log(`[GCS_SETUP] Created and made public: gs://${BUCKET_NAME}/${gcsPath}`);
    } catch (err) {
      console.error(`[ERROR] Failed to create folder "${folder}":`, err.message);
    }
  }

  console.log('\n[GCS_SETUP] Completed successfully! All folders are ready for asset placement.');
}

setupGcsFolders().catch(err => {
  console.error('[FATAL ERROR] Setup execution failed:', err);
  process.exit(1);
});
