import fs from 'fs';
import path from 'path';

function findMdFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === '.gemini' || file === '.agents') {
      continue;
    }
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findMdFiles(fullPath, fileList);
      } else if (file.endsWith('.md')) {
        fileList.push({
          path: fullPath.replace(/\\/g, '/'),
          size: stat.size,
          lines: fs.readFileSync(fullPath, 'utf8').split('\n').length
        });
      }
    } catch (e) {}
  }
  return fileList;
}

const mdFiles = findMdFiles('.');
console.log(JSON.stringify(mdFiles, null, 2));
console.log(`\nTotal .md files found: ${mdFiles.length}`);
