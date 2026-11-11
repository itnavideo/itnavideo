import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('/api/reels/jobs') || content.includes('startRender') || content.includes('renderStatus')) {
        results.push(full);
      }
    }
  }
  return results;
}

const found = [...walk('components'), ...walk('app')];
console.log(JSON.stringify(found, null, 2));
