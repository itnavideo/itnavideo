import fs from 'fs';

const content = fs.readFileSync('components/dashboard/ImageToVideoStudio.tsx', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('STUDIO_STEPS.map')) {
    console.log(`L${i+1}: ${lines.slice(Math.max(0, i-5), i+20).join('\n')}`);
    break;
  }
}
