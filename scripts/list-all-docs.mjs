import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === '.gemini' || file === '.agents') {
      continue;
    }
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const firstHeading = content.split('\n').find(l => l.startsWith('#')) || 'No heading';
      results.push({
        path: fullPath.replace(/\\/g, '/'),
        size: stat.size,
        lines: content.split('\n').length,
        title: firstHeading.replace(/^#+\s*/, '').trim()
      });
    }
  }
  return results;
}

const docs = walk('.');
fs.writeFileSync('scripts/all-docs-inventory.json', JSON.stringify(docs, null, 2));
console.log(`Inventory written. Total MD files: ${docs.length}`);
