import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const data = JSON.parse(await readFile(path.resolve(__dirname, '../lib/cloudinary/typography-transcripts.json'), 'utf8'));
  const entries = Object.entries(data);
  console.log(`Total Transcripts: ${entries.length}\n`);
  entries.forEach(([id, item], i) => {
    console.log(`${i + 1}. [${id}] (Duration: ${item.duration}s, Words: ${item.words.length})`);
    console.log(`   Text: "${item.text}"`);
    console.log(`   Poster: ${item.posterUrl}\n`);
  });
}

run();
