import fs from 'fs';

const code = fs.readFileSync('app/api/reels/jobs/route.ts', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes('prepareTranscriptionMedia') || l.includes('transcribeAudioWithGroq') || l.includes('selectRenderWindow') || l.includes('durationSeconds')) {
    if (l.length < 150) {
      console.log(`${i+1}: ${l.trim()}`);
    }
  }
});

