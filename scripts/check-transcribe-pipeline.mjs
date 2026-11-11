import fs from 'fs';

const content = fs.readFileSync('app/api/reels/jobs/route.ts', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('transcribe') || lines[i].includes('audioPrep') || lines[i].includes('extractAudio') || lines[i].includes('prepareAudioForWhisper')) {
    console.log(`L${i+1}: ${lines[i].trim()}`);
  }
}

