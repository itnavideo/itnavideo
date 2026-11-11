import fs from 'fs';
import path from 'path';

function findRejections() {
  const files = [
    'components/dashboard/autocaption/AutoCaptionDualTabStudio.tsx',
    'components/dashboard/autocaption/AutoCaptionUploadStep.tsx',
    'components/dashboard/AutoCaptionStudio.tsx',
    'components/dashboard/AiShortsPolisherStudio.tsx',
    'components/dashboard/FacelessShortsStudio.tsx',
    'components/dashboard/WhiteboardStudio.tsx',
    'components/dashboard/CompareExplainerStudio.tsx',
    'components/dashboard/LongVideoPromoStudio.tsx',
    'components/dashboard/SplitScreenExplainerStudio.tsx',
    'components/dashboard/AudioHealthDiagnostics.tsx',
    'components/dashboard/shared/StudioDropzone.tsx',
    'app/api/reels/jobs/route.ts',
    'app/api/reels/transcribe/route.ts',
    'services/ai/reelPlanner.ts',
  ];

  files.forEach(f => {
    if (!fs.existsSync(f)) return;
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, i) => {
      if (l.includes('exceed') || l.includes('too long') || l.includes('> 90') || l.includes('90s limit') || l.includes('Maximum duration')) {
        console.log(`${f}:${i+1} -> ${l.trim()}`);
      }
    });
  });
}

findRejections();

