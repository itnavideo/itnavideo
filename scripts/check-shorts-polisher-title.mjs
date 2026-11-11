import fs from 'fs';

const content = fs.readFileSync('components/dashboard/subpages/AiShortsPolisherPageClient.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('videoTitle') || l.includes('plannedTitle')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

