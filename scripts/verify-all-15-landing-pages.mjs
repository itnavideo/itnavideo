import fs from 'fs';

const VIDEO_TYPES = [
  { id: 'autoCaption', name: 'Auto Caption Generator', page: 'app/auto-caption-generator/page.tsx', view: 'components/captions/AutoCaptionsDetail.tsx', canonical: '/auto-caption-generator' },
  { id: 'aiVideoGenerator', name: 'AI Video Generator', page: 'app/ai-video-generator/page.tsx', view: 'app/video-types/ai-video-generator/AiVideoGeneratorDetail.tsx', canonical: '/ai-video-generator' },
  { id: 'aiVideoPolisher', name: 'AI YouTube Video Polisher', page: 'app/ai-video-polisher/page.tsx', view: 'app/video-types/ai-video-polisher/AiVideoPolisherDetail.tsx', canonical: '/ai-video-polisher' },
  { id: 'aiShortsPolisher', name: 'AI Shorts Polisher', page: 'app/ai-shorts-polisher/page.tsx', view: 'app/video-types/ai-shorts-polisher/AiShortsPolisherDetail.tsx', canonical: '/ai-shorts-polisher' },
  { id: 'facelessVideo', name: 'Faceless Video Generator', page: 'app/faceless-video/page.tsx', view: 'app/video-types/faceless-video/FacelessVideoDetail.tsx', canonical: '/faceless-video' },
  { id: 'facelessShorts', name: 'Faceless Shorts Generator', page: 'app/faceless-shorts/page.tsx', view: 'app/video-types/faceless-shorts/FacelessShortsDetail.tsx', canonical: '/faceless-shorts' },
  { id: 'bookSummary', name: 'Book Summary Video Generator', page: 'app/book-summary/page.tsx', view: 'app/video-types/book-summary/BookSummaryDetail.tsx', canonical: '/book-summary' },
  { id: 'imageToVideo', name: 'Image to Video AI', page: 'app/image-to-video-ai/page.tsx', view: 'components/tools/ImageToVideoAiView.tsx', canonical: '/image-to-video-ai' },
  { id: 'youtubeSubtitles', name: 'YouTube Subtitles Generator', page: 'app/youtube-subtitles-generator/page.tsx', view: 'app/video-types/youtube-subtitle-generator/YouTubeSubtitleDetail.tsx', canonical: '/youtube-subtitles-generator' },
  { id: 'whiteboard', name: 'Whiteboard Animation Maker', page: 'app/whiteboard-video/page.tsx', view: 'app/video-types/whiteboard-video/WhiteboardVideoDetail.tsx', canonical: '/whiteboard-video' },
  { id: 'compare', name: 'Compare Explainer Generator', page: 'app/compare-explainer/page.tsx', view: 'app/video-types/compare-explainer/CompareExplainerDetail.tsx', canonical: '/compare-explainer' },
  { id: 'longVideoClips', name: 'Long Video to Clips Generator', page: 'app/long-video-clips/page.tsx', view: 'app/video-types/long-video-clips/LongVideoClipsDetail.tsx', canonical: '/long-video-clips' },
  { id: 'longVideoPromo', name: 'Long Video Promo Generator', page: 'app/long-video-promo/page.tsx', view: 'app/video-types/long-video-promo/LongVideoPromoDetail.tsx', canonical: '/long-video-promo' },
  { id: 'splitScreen', name: 'Split Screen Explainer Video', page: 'app/split-screen-explainer/page.tsx', view: 'app/video-types/split-screen-explainer/SplitScreenExplainerDetail.tsx', canonical: '/split-screen-explainer' },
  { id: 'audioClean', name: 'AI Audio Cleaner & Enhancer', page: 'app/ai-audio-cleaner/page.tsx', view: 'app/video-types/ai-audio-cleaner/AudioCleanerDetail.tsx', canonical: '/ai-audio-cleaner' },
];

function extractWords(source) {
  if (!source) return 0;
  let text = source.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, ' ');
  text = text.replace(/export\s+type\s+[\s\S]*?;/g, ' ');
  text = text.replace(/export\s+interface\s+[\s\S]*?}/g, ' ');
  text = text.replace(/\/\*[\s\S]*?\*\//g, ' ');
  text = text.replace(/\/\/.*$/gm, ' ');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/className\s*=\s*['"][^'"]*['"]/g, ' ');
  text = text.replace(/[{}[\]();=:,`]/g, ' ');
  const words = text.split(/\s+/).filter(w => w.length > 2 && /^[a-zA-Z0-9'-]+$/.test(w));
  return words.length;
}

const results = VIDEO_TYPES.map(vt => {
  const pageExists = fs.existsSync(vt.page);
  const viewExists = vt.view && fs.existsSync(vt.view);
  const pageCode = pageExists ? fs.readFileSync(vt.page, 'utf8') : '';
  const viewCode = viewExists ? fs.readFileSync(vt.view, 'utf8') : '';
  const totalWords = extractWords(pageCode) + extractWords(viewCode);

  const hasExploreTools = viewCode.includes('ExploreMoreVideoTools');

  return {
    id: vt.id,
    name: vt.name,
    page: vt.page,
    canonical: vt.canonical,
    pageExists,
    viewExists,
    totalWords,
    hasExploreTools,
    status: !pageExists
      ? 'MISSING_PAGE'
      : totalWords >= 1000
      ? 'PASS (1000+ words)'
      : `THIN (${totalWords} words)`
  };
});

console.log(JSON.stringify(results, null, 2));

const allPass = results.every(r => r.pageExists && r.viewExists && r.totalWords >= 1000);
console.log('\n--- VERIFICATION SUMMARY ---');
console.log(`Total Pages Audited : ${results.length}`);
console.log(`All 15 Exist?       : ${results.every(r => r.pageExists && r.viewExists) ? 'YES' : 'NO'}`);
console.log(`All 1000+ Words?    : ${allPass ? 'YES' : 'NO'}`);

