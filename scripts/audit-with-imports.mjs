import fs from 'fs';

const VIDEO_TYPES = [
  { id: 'autoCaption', name: 'Auto Caption Generator', page: 'app/auto-caption-generator/page.tsx', view: 'components/captions/AutoCaptionsDetail.tsx' },
  { id: 'aiVideoGenerator', name: 'AI Video Generator', page: 'app/ai-video-generator/page.tsx', view: 'app/video-types/ai-video-generator/AiVideoGeneratorDetail.tsx' },
  { id: 'aiVideoPolisher', name: 'AI YouTube Video Polisher', page: 'app/ai-video-polisher/page.tsx', view: null },
  { id: 'aiShortsPolisher', name: 'AI Shorts Polisher', page: 'app/ai-shorts-polisher/page.tsx', view: null },
  { id: 'facelessVideo', name: 'Faceless Video Generator', page: 'app/faceless-video/page.tsx', view: 'app/video-types/faceless-video/FacelessVideoDetail.tsx' },
  { id: 'facelessShorts', name: 'Faceless Shorts Generator', page: 'app/faceless-shorts/page.tsx', view: 'app/video-types/faceless-shorts/FacelessShortsDetail.tsx' },
  { id: 'bookSummary', name: 'Book Summary Video Generator', page: 'app/book-summary/page.tsx', view: 'app/video-types/book-summary/BookSummaryDetail.tsx' },
  { id: 'imageToVideo', name: 'Image to Video AI', page: 'app/image-to-video-ai/page.tsx', view: 'components/tools/ImageToVideoAiView.tsx' },
  { id: 'youtubeSubtitles', name: 'YouTube Subtitles Generator', page: 'app/youtube-subtitles-generator/page.tsx', view: 'app/video-types/youtube-subtitle-generator/YoutubeSubtitleDetail.tsx' },
  { id: 'whiteboard', name: 'Whiteboard Animation Maker', page: 'app/whiteboard-video/page.tsx', view: 'app/video-types/whiteboard-video/WhiteboardVideoDetail.tsx' },
  { id: 'compare', name: 'Compare Explainer Generator', page: 'app/compare-explainer/page.tsx', view: 'app/video-types/compare-explainer/CompareExplainerDetail.tsx' },
  { id: 'longVideoClips', name: 'Long Video to Clips Generator', page: 'app/long-video-clips/page.tsx', view: 'app/video-types/long-video-clips/LongVideoClipsDetail.tsx' },
  { id: 'longVideoPromo', name: 'Long Video Promo Generator', page: 'app/long-video-promo/page.tsx', view: 'app/video-types/long-video-promo/LongVideoPromoDetail.tsx' },
  { id: 'splitScreen', name: 'Split Screen Explainer Video', page: 'app/split-screen-explainer/page.tsx', view: null },
  { id: 'audioClean', name: 'AI Audio Cleaner & Enhancer', page: 'app/ai-audio-cleaner/page.tsx', view: 'app/video-types/ai-audio-cleaner/AudioCleanerDetail.tsx' },
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

  return {
    id: vt.id,
    name: vt.name,
    pageExists,
    viewExists,
    totalWords,
    status: !pageExists ? 'MISSING_PAGE' : totalWords >= 1000 ? 'PASS (1000+ words)' : `THIN (${totalWords} words)`
  };
});

console.log(JSON.stringify(results, null, 2));
