import fs from 'fs';
import path from 'path';

const files = [
  'components/dashboard/subpages/AutoCaptionPageClient.tsx',
  'components/dashboard/subpages/AiVideoGeneratorPageClient.tsx',
  'components/dashboard/subpages/AiVideoPolisherPageClient.tsx',
  'components/dashboard/subpages/AiShortsPolisherPageClient.tsx',
  'components/dashboard/subpages/FacelessVideoPageClient.tsx',
  'components/dashboard/subpages/FacelessShortsPageClient.tsx',
  'components/dashboard/subpages/BookSummaryPageClient.tsx',
  'components/dashboard/subpages/ImageToVideoPageClient.tsx',
  'components/dashboard/subpages/YoutubeSubtitlesPageClient.tsx',
  'components/dashboard/subpages/WhiteboardVideoPageClient.tsx',
  'components/dashboard/subpages/CompareExplainerPageClient.tsx',
  'components/dashboard/subpages/LongVideoClipsPageClient.tsx',
  'components/dashboard/subpages/LongVideoPromoPageClient.tsx',
  'components/dashboard/subpages/SplitScreenExplainerPageClient.tsx',
  'components/dashboard/subpages/AudioCleanerPageClient.tsx',
  'components/dashboard/AutoCaptionStudio.tsx',
  'components/dashboard/AiVideoGeneratorStudio.tsx',
  'components/dashboard/AiVideoPolisherStudio.tsx',
  'components/dashboard/AiShortsPolisherStudio.tsx',
  'components/dashboard/FacelessVideoStudio.tsx',
  'components/dashboard/FacelessShortsStudio.tsx',
  'components/dashboard/BookSummaryStudio.tsx',
  'components/dashboard/ImageToVideoStudio.tsx',
  'components/dashboard/YoutubeSubtitlesStudio.tsx',
  'components/dashboard/WhiteboardStudio.tsx',
  'components/dashboard/CompareExplainerStudio.tsx',
  'components/dashboard/LongVideoClipsStudio.tsx',
  'components/dashboard/LongVideoPromoStudio.tsx',
  'components/dashboard/SplitScreenExplainerStudio.tsx',
  'components/dashboard/AudioCleanStudio.tsx',
];

console.log('Checking for undefined title references or unhandled title usages...');
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    // Check if line uses standalone `title` without `props.title`, `item.title`, `s.title`, `jobStatus.title`, etc.
    if (/\b(?<![.\w])title(?![.\w:])/.test(l) && !l.includes('const title') && !l.includes('let title') && !l.includes('title:') && !l.includes('title?:') && !l.includes('title =') && !l.includes('type ') && !l.includes('interface ')) {
      // Check if title is declared in file
      if (!content.includes('const [title,') && !content.includes('let title') && !content.includes('const title =') && !content.includes('title: string') && !content.includes('props.title')) {
        console.log(`[POTENTIAL UNDEFINED] ${f}:${idx+1} -> ${l.trim()}`);
      }
    }
  });
});

