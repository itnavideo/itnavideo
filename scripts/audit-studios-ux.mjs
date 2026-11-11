import fs from 'fs';
import path from 'path';

const studios = [
  { id: 'auto-caption', file: 'components/dashboard/subpages/AutoCaptionPageClient.tsx', alt: 'components/dashboard/autocaption/AutoCaptionDualTabStudio.tsx' },
  { id: 'ai-video-generator', file: 'components/dashboard/subpages/AiVideoGeneratorPageClient.tsx', alt: 'components/dashboard/AiVideoGeneratorStudio.tsx' },
  { id: 'ai-video-polisher', file: 'components/dashboard/subpages/AiVideoPolisherPageClient.tsx', alt: 'components/dashboard/AiVideoPolisherStudio.tsx' },
  { id: 'ai-shorts-polisher', file: 'components/dashboard/subpages/AiShortsPolisherPageClient.tsx', alt: 'components/dashboard/AiShortsPolisherStudio.tsx' },
  { id: 'faceless-video', file: 'components/dashboard/subpages/FacelessVideoPageClient.tsx', alt: 'components/dashboard/FacelessVideoStudio.tsx' },
  { id: 'faceless-shorts', file: 'components/dashboard/subpages/FacelessShortsPageClient.tsx', alt: 'components/dashboard/FacelessShortsStudio.tsx' },
  { id: 'book-summary', file: 'components/dashboard/subpages/BookSummaryPageClient.tsx', alt: 'components/dashboard/BookSummaryStudio.tsx' },
  { id: 'image-to-video', file: 'components/dashboard/subpages/ImageToVideoPageClient.tsx', alt: 'components/dashboard/ImageToVideoStudio.tsx' },
  { id: 'youtube-subtitles', file: 'components/dashboard/subpages/YoutubeSubtitlesPageClient.tsx', alt: 'components/dashboard/YoutubeSubtitlesStudio.tsx' },
  { id: 'whiteboard-video', file: 'components/dashboard/subpages/WhiteboardVideoPageClient.tsx', alt: 'components/dashboard/WhiteboardStudio.tsx' },
  { id: 'compare-explainer', file: 'components/dashboard/subpages/CompareExplainerPageClient.tsx', alt: 'components/dashboard/CompareExplainerStudio.tsx' },
  { id: 'long-video-clips', file: 'components/dashboard/subpages/LongVideoClipsPageClient.tsx', alt: 'components/dashboard/LongVideoClipsStudio.tsx' },
  { id: 'long-video-promo', file: 'components/dashboard/subpages/LongVideoPromoPageClient.tsx', alt: 'components/dashboard/LongVideoPromoStudio.tsx' },
  { id: 'split-screen-explainer', file: 'components/dashboard/subpages/SplitScreenExplainerPageClient.tsx', alt: 'components/dashboard/SplitScreenExplainerStudio.tsx' },
  { id: 'audio-cleaner', file: 'components/dashboard/subpages/AudioCleanerPageClient.tsx', alt: 'components/dashboard/AudioCleanStudio.tsx' },
];

studios.forEach(s => {
  const f1 = fs.existsSync(s.file) ? fs.statSync(s.file).size : 0;
  const f2 = s.alt && fs.existsSync(s.alt) ? fs.statSync(s.alt).size : 0;
  console.log(`[${s.id}] PageClient: ${f1}B, SubStudio: ${f2}B`);
});
