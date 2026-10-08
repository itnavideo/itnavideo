import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Storage } from '@google-cloud/storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const BUCKET_NAME = 'itnavideo-media-assets';
const TEMP_DIR = join(ROOT_DIR, 'tmp-migration');

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: join(ROOT_DIR, 'gcp-credentials.json'),
  projectId: 'geometric-hull-501707-m2',
});

// Scan folders for Cloudinary URLs
const SCAN_FOLDERS = ['components', 'lib', 'app', 'constants', 'remotion'];
const EXCLUDE_PATTERNS = [/node_modules/, /\.next/, /\.git/, /tmp-migration/];

function getAllFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  const list = readdirSync(dir);
  for (const item of list) {
    const fullPath = join(dir, item);
    if (EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) continue;
    
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      const ext = extname(fullPath).toLowerCase();
      if (['.ts', '.tsx', '.json', '.js', '.jsx', '.css', '.html'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function parseCloudinaryUrl(url) {
  // Regex to extract type and key path, stripping optional transforms and versions
  // Match: https://res.cloudinary.com/dhouh9idx/image/upload/[transforms]/[version]/relativePath
  const regex = /https:\/\/res\.cloudinary\.com\/dhouh9idx\/(image|video)\/upload\/(?:[^\/]+\/)?(?:v\d+\/)?([^\s"'\)]+)/;
  const match = url.match(regex);
  if (!match) return null;
  return {
    type: match[1],
    relativePath: match[2],
  };
}

async function downloadFile(url, destPath) {
  const dir = dirname(destPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }
  const fileStream = createWriteStream(destPath);
  await pipeline(response.body, fileStream);
}

async function uploadToGcs(localPath, gcsPath) {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(gcsPath);

  let contentType = 'application/octet-stream';
  const ext = extname(localPath).toLowerCase();
  if (ext === '.mp4') contentType = 'video/mp4';
  else if (ext === '.webm') contentType = 'video/webm';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.svg') contentType = 'image/svg+xml';
  else if (ext === '.mp3') contentType = 'audio/mpeg';
  else if (ext === '.wav') contentType = 'audio/wav';

  await bucket.upload(localPath, {
    destination: gcsPath,
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000',
    },
  });

  // Make the file public
  await file.makePublic();
  console.log(`[GCS_UPLOAD] Publicly uploaded: ${gcsPath}`);
}

async function startMigration() {
  console.log('[MIGRATION] Starting Cloudinary to Google Cloud Storage migration...');
  
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
  }

  // 1. Gather all files in scope
  const allFiles = [];
  for (const folder of SCAN_FOLDERS) {
    getAllFiles(join(ROOT_DIR, folder), allFiles);
  }
  console.log(`[MIGRATION] Scanned ${allFiles.length} files.`);

  // 2. Extract unique Cloudinary URLs
  const cloudinaryUrls = new Set();
  const urlRegex = /https:\/\/res\.cloudinary\.com\/dhouh9idx\/[a-zA-Z0-9_\-\.\/%+@!]+/g;

  for (const file of allFiles) {
    const content = readFileSync(file, 'utf8');
    const matches = content.match(urlRegex);
    if (matches) {
      for (const match of matches) {
        // Clean URL from trailing quote or parenthesis if captured
        const cleanUrl = match.replace(/['"\)\s,;]+$/, '');
        cloudinaryUrls.add(cleanUrl);
      }
    }
  }

  console.log(`[MIGRATION] Found ${cloudinaryUrls.size} unique Cloudinary URLs.`);
  
  const migrationMap = {}; // cloudUrl -> gcsUrl

  // 3. Process each unique URL
  for (const rawUrl of cloudinaryUrls) {
    try {
      const parsed = parseCloudinaryUrl(rawUrl);
      if (!parsed) {
        console.warn(`[MIGRATION] Skipping unparsable URL: ${rawUrl}`);
        continue;
      }

      const { type, relativePath } = parsed;
      const gcsPath = relativePath.replace(/%20/g, '-'); // Sanitize space encoding for GCS
      const gcsUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${gcsPath}`;
      
      console.log(`\n[MIGRATION] Processing: ${rawUrl}`);
      console.log(`  âž” Target GCS: ${gcsUrl}`);

      const localDest = join(TEMP_DIR, gcsPath);

      // Download raw asset
      console.log(`  âž” Downloading raw asset...`);
      await downloadFile(rawUrl, localDest);

      // Upload raw asset to GCS
      console.log(`  âž” Uploading to GCS...`);
      await uploadToGcs(localDest, gcsPath);

      migrationMap[rawUrl] = gcsUrl;

      // Handle Poster Generation/Extraction for Videos
      if (type === 'video' && (rawUrl.endsWith('.mp4') || rawUrl.endsWith('.webm') || rawUrl.includes('/video/upload/'))) {
        const posterRelPath = relativePath.replace(/\.(mp4|webm)$/i, '.jpg');
        const posterGcsPath = posterRelPath.replace(/%20/g, '-');
        const posterGcsUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${posterGcsPath}`;

        // Build the Cloudinary auto-generated poster URL:
        // Swap /video/upload/[optional_transforms]/v[ver]/file.mp4 âž” /video/upload/f_auto,q_auto,w_600,so_1/v[ver]/file.jpg
        const cloudinaryPosterUrl = rawUrl
          .replace(/\/video\/upload\/(?:[^\/]+\/)?(?:v\d+\/)?/g, '/video/upload/f_auto,q_auto,w_600,so_1/')
          .replace(/\.(mp4|webm)$/i, '.jpg');

        const localPosterDest = join(TEMP_DIR, posterGcsPath);
        
        try {
          console.log(`  âž” Video detected. Downloading pre-generated poster from Cloudinary: ${cloudinaryPosterUrl}`);
          await downloadFile(cloudinaryPosterUrl, localPosterDest);
          console.log(`  âž” Uploading poster to GCS: ${posterGcsUrl}`);
          await uploadToGcs(localPosterDest, posterGcsPath);

          // Map any potential pre-existing poster references if they exist
          const potentialOriginalPoster = rawUrl.replace(/\.(mp4|webm)$/i, '.jpg');
          migrationMap[potentialOriginalPoster] = posterGcsUrl;
          migrationMap[cloudinaryPosterUrl] = posterGcsUrl;
        } catch (posterErr) {
          console.warn(`  âž” [WARNING] Could not fetch auto-poster for ${rawUrl}: ${posterErr.message}`);
        }
      }

    } catch (err) {
      console.error(`  âž” [ERROR] Failed to migrate ${rawUrl}:`, err.message);
    }
  }

  // 4. Update URLs across the entire codebase
  console.log('\n[MIGRATION] Rewriting code references to GCS URLs...');
  let updatedFilesCount = 0;

  for (const file of allFiles) {
    let content = readFileSync(file, 'utf8');
    let hasChanged = false;

    for (const [cloudinaryUrl, gcsUrl] of Object.entries(migrationMap)) {
      if (content.includes(cloudinaryUrl)) {
        content = content.replaceAll(cloudinaryUrl, gcsUrl);
        hasChanged = true;
      }
    }

    // Also do a generic replacement for any lingering Cloudinary patterns with transforms
    // to safeguard against missing mapped URLs.
    if (content.includes('https://res.cloudinary.com/dhouh9idx/')) {
      const matchRegex = /https:\/\/res\.cloudinary\.com\/dhouh9idx\/(?:image|video)\/upload\/(?:[^\/]+\/)?(?:v\d+\/)?([^\s"'\)]+)/g;
      content = content.replace(matchRegex, (match, relPath) => {
        const cleanRelPath = relPath.replace(/['"\)\s,;]+$/, '').replace(/%20/g, '-');
        console.log(`[GENERIC_REWRITE] Rewrote lingering: ${match} âž” GCS`);
        hasChanged = true;
        return `https://storage.googleapis.com/${BUCKET_NAME}/${cleanRelPath}`;
      });
    }

    if (hasChanged) {
      writeFileSync(file, content, 'utf8');
      console.log(`[MIGRATION] Updated file: ${file.replace(ROOT_DIR, '')}`);
      updatedFilesCount++;
    }
  }

  console.log(`\n[MIGRATION] Successfully updated ${updatedFilesCount} files.`);
  console.log('[MIGRATION] Completed successfully!\n');
}

startMigration().catch(err => {
  console.error('[MIGRATION] Fatal migration error:', err);
});
