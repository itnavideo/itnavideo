import fs from 'fs';
import path from 'path';

console.log('======================================================================');
console.log('       ITNAVIDEO — High-Speed Core Project Static Error Audit');
console.log('======================================================================\n');

const TARGET_DIRS = ['app', 'components', 'remotion', 'services', 'lib', 'constants'];
let errorsFound = [];
let warningsFound = [];

// 1. Build an in-memory index of all existing project files for instant O(1) checks
const knownFiles = new Set();
function indexDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item === '.next' || item === '.git' || item === '.user_uploaded') continue;
    const full = path.join(dir, item).replace(/\\/g, '/');
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      indexDirectory(full);
    } else {
      knownFiles.add(full);
      // Also add without extension for easy resolution
      const parsed = path.parse(full);
      knownFiles.add(path.join(parsed.dir, parsed.name).replace(/\\/g, '/'));
    }
  }
}

console.log('1. Indexing project files into memory...');
TARGET_DIRS.forEach(d => indexDirectory(d));
console.log(`   Indexed ${knownFiles.size} file paths.`);

// 2. Scan core files
const codeFiles = [];
function collectFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item).replace(/\\/g, '/');
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      collectFiles(full);
    } else if (/\.(ts|tsx|js|mjs)$/.test(item)) {
      codeFiles.push(full);
    }
  }
}
TARGET_DIRS.forEach(d => collectFiles(d));
console.log(`2. Scanning ${codeFiles.length} core application code files...`);

// 3. Fast O(1) import verification
codeFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check broken relative/alias imports
  const importRegex = /(?:import\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const imp = match[1] || match[2];
    if (imp.startsWith('@/') || imp.startsWith('.')) {
      let resolved;
      if (imp.startsWith('@/')) {
        resolved = imp.slice(2);
      } else {
        const fileDir = path.dirname(file);
        resolved = path.join(fileDir, imp).replace(/\\/g, '/');
      }

      // Check if file exists in our in-memory set
      const exists = knownFiles.has(resolved) ||
                     knownFiles.has(resolved + '.ts') ||
                     knownFiles.has(resolved + '.tsx') ||
                     knownFiles.has(resolved + '.js') ||
                     knownFiles.has(resolved + '.json') ||
                     knownFiles.has(resolved + '/index.ts') ||
                     knownFiles.has(resolved + '/index.tsx');

      if (!exists) {
        errorsFound.push(`[BROKEN IMPORT] ${file}: cannot resolve '${imp}'`);
      }
    }
  }

  // Check Rule 0.5: Client secret leaks
  if (content.includes("'use client'") || content.includes('"use client"')) {
    if (content.includes('SUPABASE_SERVICE_ROLE_KEY') || content.includes('AWS_SECRET_ACCESS_KEY') || content.includes('GROQ_API_KEY')) {
      errorsFound.push(`[SECURITY LEAK - Rule 0.5] Client file ${file} references secret keys.`);
    }
  }
});

// 4. Output Report
console.log('\n======================================================================');
console.log('                         DIAGNOSTIC REPORT');
console.log('======================================================================');
console.log(`Core Code Files Scanned : ${codeFiles.length}`);
console.log(`Errors Detected         : ${errorsFound.length}`);
console.log(`Warnings Detected       : ${warningsFound.length}`);
console.log('======================================================================\n');

if (errorsFound.length > 0) {
  console.log('❌ DEFECTS FOUND:');
  errorsFound.slice(0, 20).forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  if (errorsFound.length > 20) console.log(`  ... and ${errorsFound.length - 20} more.`);
} else {
  console.log('✔ ZERO BROKEN IMPORTS OR CLIENT-SIDE SECURITY LEAKS FOUND!');
}
