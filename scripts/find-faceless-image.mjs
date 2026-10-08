import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

function list(dir, depth = 0) {
  if (depth > 3 || !existsSync(dir)) return;
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      console.log('DIR:', full);
      list(full, depth + 1);
    } else {
      if (f.name.toLowerCase().includes('faceless') || f.name.toLowerCase().includes('facless') || f.name.toLowerCase().includes('homepage')) {
        console.log('FILE:', full);
      }
    }
  }
}

list(path.resolve(process.cwd(), 'public'));
