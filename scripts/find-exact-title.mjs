import fs from 'fs';
import path from 'path';

function findExactTitleUsage() {
  const dirs = ['components/dashboard', 'app/dashboard'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir, { recursive: true });
    files.forEach(f => {
      if (typeof f !== 'string') return;
      if (!f.endsWith('.tsx') && !f.endsWith('.ts')) return;
      const fullPath = path.join(dir, f);
      if (!fs.statSync(fullPath).isFile()) return;
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        // Look for {title} or title without definition in scope
        const match = line.match(/\{title\b/);
        if (match) {
          console.log(`${fullPath}:${i+1} -> ${line.trim()}`);
        }
      });
    });
  });
}

findExactTitleUsage();

