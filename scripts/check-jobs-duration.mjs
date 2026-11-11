import fs from 'fs';

const content = fs.readFileSync('app/api/reels/jobs/route.ts', 'utf8');
const lines = content.split('\n');
console.log('Total lines in app/api/reels/jobs/route.ts:', lines.length);

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('durationSeconds') || lines[i].includes('frameRange') || lines[i].includes('maxDuration') || lines[i].includes('2700') || lines[i].includes('90')) {
    console.log(`L${i+1}: ${lines[i].trim()}`);
  }
}

