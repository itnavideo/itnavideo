import fs from 'fs';
import path from 'path';

const targetDirs = ['components', 'app', 'services', 'lib', 'remotion'];
const results = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/90\s*(s|sec|seconds)|duration.*90|90.*duration|exceed.*90|max.*90/i.test(line)) {
          results.push({ file: full, line: idx + 1, text: line.trim() });
        }
      });
    }
  }
}

targetDirs.forEach(scanDir);

console.log(`Found ${results.length} matches across code directories:`);
results.forEach(r => {
  console.log(`${r.file}:${r.line} -> ${r.text}`);
});
