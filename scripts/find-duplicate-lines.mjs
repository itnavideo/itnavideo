import fs from 'fs';

const content = fs.readFileSync('lib/blogPosts.ts', 'utf-8');
const lines = content.split('\n');

const slugPositions = [];
lines.forEach((line, index) => {
  const match = line.match(/slug:\s*['"]([^'"]+)['"]/);
  if (match) {
    slugPositions.push({ slug: match[1], line: index + 1 });
  }
});

const seen = new Map();
slugPositions.forEach((item) => {
  if (seen.has(item.slug)) {
    console.log(`Duplicate slug: ${item.slug} (First: line ${seen.get(item.slug)}, Duplicate: line ${item.line})`);
  } else {
    seen.set(item.slug, item.line);
  }
});
