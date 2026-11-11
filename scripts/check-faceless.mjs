import fs from 'fs';

function checkFaceless(path) {
  const content = fs.readFileSync(path, 'utf8');
  console.log(`\n=== ${path} ===`);
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('<input') || line.includes('<textarea') || line.includes('topicTitle') || line.includes('visualTheme') || line.includes('pacing')) {
      console.log(`L${idx+1}: ${line.trim()}`);
    }
  });
}

checkFaceless('components/dashboard/FacelessVideoStudio.tsx');
checkFaceless('components/dashboard/FacelessShortsStudio.tsx');
