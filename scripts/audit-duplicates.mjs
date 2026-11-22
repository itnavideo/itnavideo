import fs from 'fs';
import path from 'path';

console.log('======================================================================');
console.log('           ITNAVIDEO — REMOTION LIBRARY DUPLICATE AUDITOR');
console.log('======================================================================\n');

// 1. Audit remotion/library/registry.ts
const registryPath = path.resolve('remotion/library/registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');

const idMatches = [...registryContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const nameMatches = [...registryContent.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

console.log(`1. AUDITING REGISTRY (remotion/library/registry.ts):`);
console.log(`   Total 'id' entries: ${idMatches.length}`);
console.log(`   Total 'name' entries: ${nameMatches.length}`);

function findDuplicates(arr) {
  const counts = {};
  const dups = [];
  for (const item of arr) {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] === 2) {
      dups.push(item);
    }
  }
  return { dups, counts };
}

const idDups = findDuplicates(idMatches);
if (idDups.dups.length > 0) {
  console.log(`   ❌ DUPLICATE IDs FOUND IN REGISTRY (${idDups.dups.length}):`);
  idDups.dups.forEach(d => console.log(`      - "${d}" (${idDups.counts[d]} times)`));
} else {
  console.log(`   ✔ ZERO duplicate IDs found in registry.ts! (All ${idMatches.length} unique)`);
}

const nameDups = findDuplicates(nameMatches);
if (nameDups.dups.length > 0) {
  console.log(`   ❌ DUPLICATE NAMES FOUND IN REGISTRY (${nameDups.dups.length}):`);
  nameDups.dups.forEach(d => console.log(`      - "${d}" (${nameDups.counts[d]} times)`));
} else {
  console.log(`   ✔ ZERO duplicate names found in registry.ts! (All ${nameMatches.length} unique)`);
}

// 2. Audit remotion/library/index.ts for duplicate exports
console.log('\n2. AUDITING EXPORTS (remotion/library/index.ts):');
const indexPath = path.resolve('remotion/library/index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf8');
const exportStarMatches = [...indexContent.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)].map(m => m[1]);

console.log(`   Total export * statements: ${exportStarMatches.length}`);
const exportDups = findDuplicates(exportStarMatches);
if (exportDups.dups.length > 0) {
  console.log(`   ❌ DUPLICATE export * MODULES (${exportDups.dups.length}):`);
  exportDups.dups.forEach(d => console.log(`      - "${d}" (${exportDups.counts[d]} times)`));
} else {
  console.log(`   ✔ ZERO duplicate export * modules in index.ts!`);
}

// 3. Scan all TSX files across all subdirectories of remotion/library
console.log('\n3. SCANNING ALL COMPONENT FILES ACROSS remotion/library SUBDIRECTORIES:');
const libraryDir = path.resolve('remotion/library');
const allSubdirs = fs.readdirSync(libraryDir).filter(f => fs.statSync(path.join(libraryDir, f)).isDirectory());

const allFiles = [];
for (const dir of allSubdirs) {
  const dirPath = path.join(libraryDir, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.tsx'));
  for (const f of files) {
    allFiles.push({ filename: f, componentName: f.replace('.tsx', ''), dir });
  }
}

console.log(`   Total TSX component files scanned: ${allFiles.length}`);
const fileDups = findDuplicates(allFiles.map(f => f.componentName));
if (fileDups.dups.length > 0) {
  console.log(`   ❌ DUPLICATE COMPONENT FILENAMES FOUND ACROSS DIRECTORIES (${fileDups.dups.length}):`);
  fileDups.dups.forEach(d => {
    const locations = allFiles.filter(f => f.componentName === d).map(f => `${f.dir}/${f.filename}`);
    console.log(`      - "${d}": found in [${locations.join(', ')}]`);
  });
} else {
  console.log(`   ✔ ZERO duplicate component filenames across all ${allSubdirs.length} subdirectories!`);
}

// 4. Audit remotion/library/assets/index.ts
console.log('\n4. AUDITING DECK ASSETS (remotion/library/assets/index.ts):');
const assetsPath = path.resolve('remotion/library/assets/index.ts');
const assetsContent = fs.readFileSync(assetsPath, 'utf8');
const assetIdMatches = [...assetsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log(`   Total asset entries: ${assetIdMatches.length}`);
const assetDups = findDuplicates(assetIdMatches);
if (assetDups.dups.length > 0) {
  console.log(`   ❌ DUPLICATE ASSET IDs FOUND (${assetDups.dups.length}):`);
  assetDups.dups.forEach(d => console.log(`      - "${d}" (${assetDups.counts[d]} times)`));
} else {
  console.log(`   ✔ ZERO duplicate asset IDs found in assets/index.ts!`);
}

// 5. Audit remotion/library/scenes/index.ts
console.log('\n5. AUDITING SCENE BLUEPRINTS (remotion/library/scenes/index.ts):');
const scenesPath = path.resolve('remotion/library/scenes/index.ts');
const scenesContent = fs.readFileSync(scenesPath, 'utf8');
const sceneMatches = [...scenesContent.matchAll(/export\s+\{\s*([A-Za-z0-9]+)\s*\}\s+from/g)].map(m => m[1]);
console.log(`   Total scene exports: ${sceneMatches.length}`);
const sceneDups = findDuplicates(sceneMatches);
if (sceneDups.dups.length > 0) {
  console.log(`   ❌ DUPLICATE SCENE NAMES FOUND (${sceneDups.dups.length}):`);
  sceneDups.dups.forEach(d => console.log(`      - "${d}" (${sceneDups.counts[d]} times)`));
} else {
  console.log(`   ✔ ZERO duplicate scene names found in scenes/index.ts! (All ${sceneMatches.length} unique)`);
}

console.log('\n======================================================================');
const totalErrors = idDups.dups.length + nameDups.dups.length + exportDups.dups.length + fileDups.dups.length + assetDups.dups.length + sceneDups.dups.length;
if (totalErrors === 0) {
  console.log('  ✔ CLEAN AUDIT: 100% UNIQUE ENTRIES! ZERO DUPLICATES ACROSS ENTIRE ECOSYSTEM!');
} else {
  console.log(`  ❌ FOUND ${totalErrors} DUPLICATE ENTRIES THAT MUST BE RESOLVED!`);
}
console.log('======================================================================');

