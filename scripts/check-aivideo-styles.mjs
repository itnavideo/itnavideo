import fs from 'fs';

const content = fs.readFileSync('components/dashboard/AiVideoGeneratorStudio.tsx', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('selectedStyle') || lines[i].includes('Cinematic Modern')) {
    console.log(`L${i+1}: ${lines[i].trim()}`);
  }
}
