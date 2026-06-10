import fs from 'fs';
import path from 'path';

const root = process.cwd();
const standaloneDir = path.join(root, '.next', 'standalone');
const staticSource = path.join(root, '.next', 'static');
const staticTarget = path.join(standaloneDir, '.next', 'static');
const publicSource = path.join(root, 'public');
const publicTarget = path.join(standaloneDir, 'public');

if (process.env.VERCEL === '1') {
  pruneVercelTraces();
  console.log('Vercel build detected; skipping standalone file sync.');
  process.exit(0);
}

if (!fs.existsSync(standaloneDir)) {
  console.log('Next standalone output not found; skipping standalone file sync.');
  process.exit(0);
}

const tracePruneResult = pruneStandaloneTraces();
if (tracePruneResult.removedFileCount) {
  console.log(`Pruned ${tracePruneResult.removedFileCount} runtime media/temp files from ${tracePruneResult.prunedTraceCount} standalone trace files.`);
}

copyRequiredDirectory(staticSource, staticTarget, '.next/static');

if (fs.existsSync(publicSource)) {
  copyPublicDirectory(publicSource, publicTarget);
}

console.log('Next standalone files synced.');

function copyRequiredDirectory(source, target, label) {
  if (!fs.existsSync(source)) {
    throw new Error(`Required ${label} source is missing: ${source}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true, force: true });
}

function copyPublicDirectory(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.rmSync(target, { recursive: true, force: true });
  copyDirectoryFiltered(source, target, source);
}

function copyDirectoryFiltered(source, target, rootDir) {
  if (shouldSkipPublicPath(source, rootDir)) return;
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyDirectoryFiltered(path.join(source, entry), path.join(target, entry), rootDir);
    }
    return;
  }
  if (stat.isFile()) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

function shouldSkipPublicPath(filePath, rootDir) {
  const relative = path.relative(rootDir, filePath).replace(/\\/g, '/');
  return relative === 'uploads'
    || relative.startsWith('uploads/')
    || relative === 'renders'
    || relative.startsWith('renders/')
    || relative === 'cache'
    || relative.startsWith('cache/');
}

function pruneStandaloneTraces() {
  const nextDir = path.join(root, '.next');
  const tracePaths = [];
  collectTracePaths(nextDir, tracePaths);

  let prunedTraceCount = 0;
  let removedFileCount = 0;
  for (const tracePath of tracePaths) {
    let trace;
    try {
      trace = JSON.parse(fs.readFileSync(tracePath, 'utf8'));
    } catch {
      continue;
    }
    if (!Array.isArray(trace.files)) continue;

    const before = trace.files.length;
    trace.files = trace.files.filter((file) => !shouldPruneRuntimeMediaTrace(file));
    const removed = before - trace.files.length;
    if (!removed) continue;

    fs.writeFileSync(tracePath, `${JSON.stringify(trace)}\n`, 'utf8');
    prunedTraceCount += 1;
    removedFileCount += removed;
  }

  return { prunedTraceCount, removedFileCount };
}

function shouldPruneRuntimeMediaTrace(file) {
  const normalized = String(file || '').replace(/\\/g, '/');
  return normalized.includes('/public/uploads/')
    || normalized.includes('/public/renders/')
    || normalized.includes('/public/cache/')
    || normalized.includes('/workspace/')
    || normalized.includes('/local-private/')
    || normalized.includes('/AppData/Local/Temp/')
    || /(?:^|\/)C:\/Users\/[^/]+\/AppData\/Local\/Temp\//i.test(normalized)
    || /itnavideo_(?:extracted_voice|source|preprocess)_[^/]+\.(?:wav|mp3|mp4|mov|webm)$/i.test(normalized);
}

function pruneVercelTraces() {
  const nextDir = path.join(root, '.next');
  if (!fs.existsSync(nextDir)) return;

  const tracePaths = [];
  collectTracePaths(nextDir, tracePaths);

  let prunedTraceCount = 0;
  let removedFileCount = 0;
  let patchedTraceCount = 0;
  let addedChunkCount = 0;

  for (const tracePath of tracePaths) {
    const trace = JSON.parse(fs.readFileSync(tracePath, 'utf8'));
    if (!Array.isArray(trace.files)) continue;

    const addedChunks = addTurbopackServerChunksToTrace(tracePath, trace);
    if (addedChunks) {
      patchedTraceCount += 1;
      addedChunkCount += addedChunks;
    }

    const before = trace.files.length;
    trace.files = trace.files.filter((file) => !shouldPruneFromVercelTrace(file));
    const removed = before - trace.files.length;
    if (!removed && !addedChunks) continue;

    fs.writeFileSync(tracePath, `${JSON.stringify(trace)}\n`, 'utf8');
    if (removed) prunedTraceCount += 1;
    removedFileCount += removed;
  }

  console.log(`Pruned ${removedFileCount} files from ${prunedTraceCount} Vercel trace files.`);
  console.log(`Added ${addedChunkCount} Turbopack server chunks to ${patchedTraceCount} Vercel trace files.`);
}

function collectTracePaths(directory, output) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectTracePaths(fullPath, output);
    } else if (entry.isFile() && entry.name.endsWith('.nft.json')) {
      output.push(fullPath);
    }
  }
}

function shouldPruneFromVercelTrace(file) {
  const normalized = String(file).replace(/\\/g, '/');
  return normalized.includes('/public/')
    || normalized.includes('/local-private/')
    || normalized.includes('/deploy-artifacts/')
    || normalized.includes('/workspace/')
    || normalized.includes('/logs/')
    || normalized.includes('/models/')
    || normalized.includes('/local-private/');
}

function addTurbopackServerChunksToTrace(tracePath, trace) {
  const serverFilePath = tracePath.replace(/\.nft\.json$/, '');
  if (!fs.existsSync(serverFilePath)) return 0;

  const source = fs.readFileSync(serverFilePath, 'utf8');
  if (!source.includes('[turbopack]_runtime.js') && !source.includes('server/chunks/')) return 0;

  const traceDir = path.dirname(tracePath);
  const files = new Set(trace.files.map((file) => String(file).replace(/\\/g, '/')));
  let added = 0;

  const addGeneratedFile = (generatedPath) => {
    const absolutePath = path.join(root, '.next', generatedPath);
    if (!fs.existsSync(absolutePath)) return;

    const relativePath = path.relative(traceDir, absolutePath).replace(/\\/g, '/');
    if (files.has(relativePath)) return;

    files.add(relativePath);
    trace.files.push(relativePath);
    added += 1;
  };

  const runtimeMatch = source.match(/require\("(\.{2}\/(?:\.{2}\/)*chunks\/\[turbopack\]_runtime\.js)"\)/);
  if (runtimeMatch) {
    const runtimePath = path.resolve(path.dirname(serverFilePath), runtimeMatch[1]);
    if (fs.existsSync(runtimePath)) {
      const relativePath = path.relative(traceDir, runtimePath).replace(/\\/g, '/');
      if (!files.has(relativePath)) {
        files.add(relativePath);
        trace.files.push(relativePath);
        added += 1;
      }
    }
  }

  for (const match of source.matchAll(/R\.c\("([^"]+)"\)/g)) {
    addGeneratedFile(match[1]);
  }

  return added;
}
