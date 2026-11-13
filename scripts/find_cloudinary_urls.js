const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat && stat.isDirectory() && !full.includes('node_modules') && !full.includes('.git') && !full.includes('.next')) {
        results = results.concat(walk(full));
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json')) {
        results.push(full);
      }
    });
  } catch {}
  return results;
}

const files = walk('.');
const urls = new Set();
const cloudRegex = /https:\/\/res\.cloudinary\.com\/[^\s"'`)]+/g;

files.forEach(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const matches = content.match(cloudRegex);
    if (matches) {
      matches.forEach(m => urls.add(m));
    }
  } catch {}
});

console.log('Total Cloudinary URLs found:', urls.size);
Array.from(urls).slice(0, 15).forEach(u => console.log('URL:', u));

