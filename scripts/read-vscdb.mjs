// scripts/read-vscdb.mjs
import fs from 'node:fs';
import path from 'node:path';

const dbPath = 'C:\\Users\\user\\AppData\\Roaming\\Antigravity IDE\\User\\globalStorage\\state.vscdb';

try {
  const buf = fs.readFileSync(dbPath);
  const str = buf.toString('utf8');
  console.log('Database size:', buf.length);
  
  // Look for occurrences of artifactReview or settings
  const regex = /artifactReview[a-zA-Z0-9_.-]*/g;
  const matches = new Set(str.match(regex) || []);
  console.log('Matches for artifactReview:', Array.from(matches));

  const modeMatches = new Set(str.match(/autoExecution[a-zA-Z0-9_.-]*/g) || []);
  console.log('Matches for autoExecution:', Array.from(modeMatches));
} catch (e) {
  console.error('Error reading db:', e.message);
}
