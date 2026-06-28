/**
 * Sync local markdown docs to Google Docs via Drive API.
 *
 * Usage: node scripts/sync-docs-to-gdrive.mjs
 *
 * Requirements:
 *   1. Create a Google Cloud Service Account
 *   2. Enable Google Drive API + Google Docs API
 *   3. Download the service account JSON key
 *   4. Set GOOGLE_SERVICE_ACCOUNT_KEY=path/to/key.json in .env.local
 *      OR set GOOGLE_SERVICE_ACCOUNT_JSON=<inline JSON string>
 *   5. Share the target Google Drive folder with the service account email
 *
 * First run creates the folder + docs. Subsequent runs update existing docs.
 */
import {readFile, writeFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {google} from 'googleapis';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(rootDir, 'docs', 'startup');
const mapFile = path.join(rootDir, 'docs', 'google-docs-map.json');

// Load env
await loadEnv(path.join(rootDir, '.env.local'));

const FOLDER_NAME = 'Itnavideo Startup Docs';

async function main() {
  const auth = await getAuth();
  const drive = google.drive({version: 'v3', auth});
  const docs = google.docs({version: 'v1', auth});

  // Load mapping
  const map = JSON.parse(await readFile(mapFile, 'utf8'));

  // Get or create folder
  let folderId = map.folderId;
  if (!folderId) {
    folderId = await getOrCreateFolder(drive, FOLDER_NAME);
    map.folderId = folderId;
    console.log(`📁 Folder: ${FOLDER_NAME} (${folderId})`);
  } else {
    console.log(`📁 Using existing folder: ${folderId}`);
  }

  // Read all markdown files
  const files = (await readdir(docsDir))
    .filter(f => f.endsWith('.md'))
    .sort();

  console.log(`📄 Found ${files.length} docs to sync\n`);

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const content = await readFile(filePath, 'utf8');
    const title = extractTitle(content, file);

    // Check if doc already exists in map
    const existing = map.docs.find(d => d.file === file);

    if (existing && existing.docId) {
      // Update existing doc
      try {
        await updateGoogleDoc(docs, existing.docId, content);
        existing.lastSynced = new Date().toISOString();
        existing.title = title;
        console.log(`  ✅ Updated: ${title}`);
      } catch (err) {
        if (err.code === 404) {
          // Doc was deleted, recreate
          const docId = await createGoogleDoc(drive, docs, folderId, title, content);
          existing.docId = docId;
          existing.lastSynced = new Date().toISOString();
          existing.title = title;
          console.log(`  🔄 Recreated: ${title} (${docId})`);
        } else {
          console.error(`  ❌ Failed to update ${title}:`, err.message);
        }
      }
    } else {
      // Create new doc
      const docId = await createGoogleDoc(drive, docs, folderId, title, content);
      map.docs.push({
        file,
        title,
        docId,
        lastSynced: new Date().toISOString(),
      });
      console.log(`  ✨ Created: ${title} (${docId})`);
    }
  }

  // Save updated map
  map.lastSynced = new Date().toISOString();
  await writeFile(mapFile, JSON.stringify(map, null, 2) + '\n', 'utf8');
  console.log(`\n✅ Sync complete. Map saved to docs/google-docs-map.json`);
  console.log(`📂 View folder: https://drive.google.com/drive/folders/${folderId}`);
}

async function getAuth() {
  let keyData;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    keyData = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const keyPath = path.resolve(rootDir, process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    keyData = JSON.parse(await readFile(keyPath, 'utf8'));
  } else {
    console.error('\n❌ No Google Service Account credentials found.');
    console.error('Set one of these in .env.local:');
    console.error('  GOOGLE_SERVICE_ACCOUNT_KEY=path/to/service-account-key.json');
    console.error('  GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}');
    console.error('\nSetup guide:');
    console.error('  1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts');
    console.error('  2. Create a service account (e.g., "itnavideo-docs")');
    console.error('  3. Enable Google Drive API + Google Docs API');
    console.error('  4. Create a JSON key for the service account');
    console.error('  5. Save the key file and set GOOGLE_SERVICE_ACCOUNT_KEY=path/to/key.json');
    console.error('  6. Share the Google Drive folder with the service account email');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    credentials: keyData,
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/documents',
    ],
  });

  return auth;
}

async function getOrCreateFolder(drive, name) {
  // Check if folder already exists
  const existing = await drive.files.list({
    q: `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (existing.data.files?.length) {
    return existing.data.files[0].id;
  }

  // Create folder
  const folder = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return folder.data.id;
}

async function createGoogleDoc(drive, docs, folderId, title, markdownContent) {
  // Create empty doc in the folder
  const file = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: 'application/vnd.google-apps.document',
      parents: [folderId],
    },
    fields: 'id',
  });

  const docId = file.data.id;

  // Insert content
  const requests = markdownToDocRequests(markdownContent);
  if (requests.length) {
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {requests},
    });
  }

  return docId;
}

async function updateGoogleDoc(docs, docId, markdownContent) {
  // Get current doc to find content length
  const doc = await docs.documents.get({documentId: docId});
  const endIndex = doc.data.body?.content?.slice(-1)?.[0]?.endIndex || 1;

  const requests = [];

  // Delete all existing content (keep minimum index 1)
  if (endIndex > 2) {
    requests.push({
      deleteContentRange: {
        range: {startIndex: 1, endIndex: endIndex - 1},
      },
    });
  }

  // Insert new content
  requests.push(...markdownToDocRequests(markdownContent));

  if (requests.length) {
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {requests},
    });
  }
}

function markdownToDocRequests(markdown) {
  // Simple markdown → Google Docs API requests converter
  // Converts headings, bullet points, and plain text
  const lines = markdown.split('\n');
  const requests = [];
  let insertIndex = 1;

  for (const line of lines) {
    let text = line;
    let style = null;

    if (line.startsWith('# ')) {
      text = line.slice(2);
      style = 'HEADING_1';
    } else if (line.startsWith('## ')) {
      text = line.slice(3);
      style = 'HEADING_2';
    } else if (line.startsWith('### ')) {
      text = line.slice(4);
      style = 'HEADING_3';
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      text = line.slice(2);
      style = 'BULLET';
    } else if (/^\d+\.\s/.test(line)) {
      text = line.replace(/^\d+\.\s/, '');
      style = 'NUMBERED';
    }

    // Skip empty table separator lines
    if (/^\|[-:\s|]+\|$/.test(line)) continue;

    // Convert table rows to simple text
    if (line.startsWith('|') && line.endsWith('|')) {
      text = line.slice(1, -1).split('|').map(c => c.trim()).join(' | ');
    }

    // Skip code fence markers
    if (line.startsWith('```')) continue;

    const insertText = text + '\n';
    requests.push({
      insertText: {
        location: {index: insertIndex},
        text: insertText,
      },
    });

    if (style && style !== 'BULLET' && style !== 'NUMBERED') {
      requests.push({
        updateParagraphStyle: {
          range: {startIndex: insertIndex, endIndex: insertIndex + insertText.length},
          paragraphStyle: {namedStyleType: style},
          fields: 'namedStyleType',
        },
      });
    }

    insertIndex += insertText.length;
  }

  return requests;
}

function extractTitle(content, filename) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/[—–]/g, '-').trim();
  return filename.replace(/^\d+-/, '').replace(/\.md$/, '').replace(/-/g, ' ');
}

async function loadEnv(envPath) {
  try {
    const content = await readFile(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx < 1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}

main().catch((err) => {
  console.error('Sync failed:', err.message || err);
  process.exit(1);
});
