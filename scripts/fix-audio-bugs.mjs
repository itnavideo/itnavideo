import fs from 'fs';
import path from 'path';

function updateFile(filePath, updater) {
  const fullPath = path.resolve(filePath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const isCRLF = raw.includes('\r\n');
  const normalized = raw.replace(/\r\n/g, '\n');
  const updated = updater(normalized);
  if (updated === normalized) {
    console.log(`[NO CHANGE] ${filePath}`);
    return;
  }
  const finalContent = isCRLF ? updated.replace(/\n/g, '\r\n') : updated;
  fs.writeFileSync(fullPath, finalContent, 'utf8');
  console.log(`[UPDATED] ${filePath}`);
}

// 1. services/ai/reelPlanner.ts: Allow video in BOOK_SUMMARY allowedMedia
updateFile('services/ai/reelPlanner.ts', (content) => {
  return content.replace(
    /BOOK_SUMMARY: \{\s*templateName: 'BOOK_SUMMARY',\s*compositionId: 'BOOK-SUMMARY',\s*videoCategory: 'long-form',\s*allowedMedia: \['audio', 'image'\],/,
    `BOOK_SUMMARY: {\n    templateName: 'BOOK_SUMMARY',\n    compositionId: 'BOOK-SUMMARY',\n    videoCategory: 'long-form',\n    allowedMedia: ['audio', 'video', 'image'],`
  );
});

// 2. app/api/reels/jobs/route.ts: Fix YOUTUBE_SUBTITLE_GENERATOR blocking audio
updateFile('app/api/reels/jobs/route.ts', (content) => {
  return content.replace(
    /if \(\(templateName === 'VIDEO_CAPTION' \|\| templateName === 'YOUTUBE_SUBTITLE_GENERATOR'\) && mediaType !== 'video'\) \{/,
    `if (templateName === 'VIDEO_CAPTION' && mediaType !== 'video') {`
  );
});

// 3. services/ai/audioCleanService.ts: Use -filter_complex_script to avoid Windows command line length overflow
updateFile('services/ai/audioCleanService.ts', (content) => {
  let updated = content.replace(
    /if \(filterParts\.length > 0\) \{\s*ffmpegArgs\.push\('-filter_complex', filterParts\.join\('; '\)\);\s*ffmpegArgs\.push\('-map', `\[\$\{audioOutLabel\}\]`\);\s*\} else \{/,
    `if (filterParts.length > 0) {\n      const filterScriptPath = path.join(workDir, 'filter_complex_script.txt');\n      await writeFile(filterScriptPath, filterParts.join(';\\n'), 'utf8');\n      ffmpegArgs.push('-filter_complex_script', filterScriptPath);\n      ffmpegArgs.push('-map', \`[\${audioOutLabel}]\`);\n    } else {`
  );
  // Also boost m4a bitrate to 320k
  updated = updated.replace(
    /ffmpegArgs\.push\('-c:a', 'aac', '-b:a', '256k', outputAudioPath\);/,
    `ffmpegArgs.push('-c:a', 'aac', '-b:a', '320k', outputAudioPath);`
  );
  return updated;
});

console.log('Audio Fixes Applied Successfully!');

