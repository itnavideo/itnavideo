import fs from 'fs';
import path from 'path';

const studios = [
  { id: 'auto-caption', name: 'Auto Caption Generator', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/AutoCaptionPageClient.tsx', sub: 'components/dashboard/autocaption/AutoCaptionDualTabStudio.tsx' },
  { id: 'ai-video-generator', name: 'AI Video Generator', aspect: '16:9 Cinema', file: 'components/dashboard/subpages/AiVideoGeneratorPageClient.tsx', sub: 'components/dashboard/AiVideoGeneratorStudio.tsx' },
  { id: 'ai-video-polisher', name: 'AI YouTube Video Polisher', aspect: '16:9 Cinema', file: 'components/dashboard/subpages/AiVideoPolisherPageClient.tsx', sub: 'components/dashboard/AiVideoPolisherStudio.tsx' },
  { id: 'ai-shorts-polisher', name: 'AI Shorts Polisher', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/AiShortsPolisherPageClient.tsx', sub: 'components/dashboard/AiShortsPolisherStudio.tsx' },
  { id: 'faceless-video', name: 'Faceless Video', aspect: '16:9 Cinema', file: 'components/dashboard/subpages/FacelessVideoPageClient.tsx', sub: 'components/dashboard/FacelessVideoStudio.tsx' },
  { id: 'faceless-shorts', name: 'Faceless Shorts', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/FacelessShortsPageClient.tsx', sub: 'components/dashboard/FacelessShortsStudio.tsx' },
  { id: 'book-summary', name: 'Book Summary Video', aspect: '16:9 Cinema', file: 'components/dashboard/subpages/BookSummaryPageClient.tsx', sub: 'components/dashboard/BookSummaryStudio.tsx' },
  { id: 'image-to-video', name: 'Image to Video AI', aspect: '16:9 Cinema', file: 'components/dashboard/subpages/ImageToVideoPageClient.tsx', sub: 'components/dashboard/ImageToVideoStudio.tsx' },
  { id: 'youtube-subtitles', name: 'YouTube Subtitles Generator', aspect: '16:9 Cinema', file: 'components/dashboard/subpages/YoutubeSubtitlesPageClient.tsx', sub: 'components/dashboard/YoutubeSubtitlesStudio.tsx' },
  { id: 'whiteboard-video', name: 'Whiteboard Animation', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/WhiteboardVideoPageClient.tsx', sub: 'components/dashboard/WhiteboardStudio.tsx' },
  { id: 'compare-explainer', name: 'Compare Explainer', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/CompareExplainerPageClient.tsx', sub: 'components/dashboard/CompareExplainerStudio.tsx' },
  { id: 'long-video-clips', name: 'Long Video to Clips', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/LongVideoClipsPageClient.tsx', sub: 'components/dashboard/LongVideoClipsStudio.tsx' },
  { id: 'long-video-promo', name: 'Long Video Promo', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/LongVideoPromoPageClient.tsx', sub: 'components/dashboard/LongVideoPromoStudio.tsx' },
  { id: 'split-screen-explainer', name: 'Split Screen Explainer', aspect: '9:16 Shorts', file: 'components/dashboard/subpages/SplitScreenExplainerPageClient.tsx', sub: 'components/dashboard/SplitScreenExplainerStudio.tsx' },
  { id: 'audio-cleaner', name: 'AI Audio Cleaner', aspect: 'Audio Utility', file: 'components/dashboard/subpages/AudioCleanerPageClient.tsx', sub: 'components/dashboard/AudioCleanStudio.tsx' },
];

console.log('Starting Master Audit across ALL 15 Studios...\n');

let allPassed = true;

studios.forEach((s, idx) => {
  const fClient = fs.existsSync(s.file);
  const fSub = fs.existsSync(s.sub);
  
  if (!fClient || !fSub) {
    console.error(`[FAIL] ${s.name}: Missing file(s) - Client: ${fClient}, Sub: ${fSub}`);
    allPassed = false;
    return;
  }

  const clientContent = fs.readFileSync(s.file, 'utf8');
  const subContent = fs.readFileSync(s.sub, 'utf8');

  // Check 1: White background presence
  const hasWhiteBg = clientContent.includes('bg-white') && subContent.includes('bg-white');

  // Check 2: StudioHeader in client
  const hasStudioHeader = clientContent.includes('StudioHeader');

  // Check 3: Sunset orange brand accent
  const hasBrandAccent = clientContent.includes('orange-') || subContent.includes('orange-') || subContent.includes('#FF5722');

  // Check 4: Responsive text classes
  const hasResponsiveText = subContent.includes('sm:text-') || subContent.includes('md:text-') || subContent.includes('text-xs');

  // Check 5: Lucide SVG icons present
  const hasSvgIcons = subContent.includes('lucide-react');

  const passed = hasWhiteBg && hasStudioHeader && hasBrandAccent && hasResponsiveText && hasSvgIcons;
  if (!passed) allPassed = false;

  console.log(`[${idx+1}/15] ${s.name} (${s.aspect})`);
  console.log(`  - White Canvas: ${hasWhiteBg ? 'PASS' : 'FAIL'}`);
  console.log(`  - StudioHeader: ${hasStudioHeader ? 'PASS' : 'FAIL'}`);
  console.log(`  - Brand Accent: ${hasBrandAccent ? 'PASS' : 'FAIL'}`);
  console.log(`  - Responsive Typography: ${hasResponsiveText ? 'PASS' : 'FAIL'}`);
  console.log(`  - Crisp SVGs: ${hasSvgIcons ? 'PASS' : 'FAIL'}`);
  console.log(`  -> Status: ${passed ? 'VERIFIED' : 'FAILED'}\n`);
});

if (allPassed) {
  console.log('ALL 15 ITNAVIDEO STUDIOS AUDITED & FULLY VERIFIED!');
} else {
  console.error('Some studios failed audit verification.');
  process.exit(1);
}
