import fs from 'fs';
import path from 'path';

// Master list of all 15 Itnavideo Video Creation Types
const VIDEO_TYPES = [
  {
    id: 'autoCaption',
    name: 'Auto Caption Generator',
    category: '9:16 Shorts',
    primaryKeyword: 'auto caption generator',
    preferredRoute: '/auto-caption-generator',
    candidateFiles: [
      'app/auto-caption-generator/page.tsx',
      'app/(marketing)/auto-caption-generator/page.tsx',
      'app/auto-caption/page.tsx',
      'app/video-types/auto-caption-generator/page.tsx',
    ],
    dashboardRoute: '/dashboard/auto-caption'
  },
  {
    id: 'aiVideoGenerator',
    name: 'AI Video Generator',
    category: '16:9 Cinema',
    primaryKeyword: 'AI video generator',
    preferredRoute: '/ai-video-generator',
    candidateFiles: [
      'app/ai-video-generator/page.tsx',
      'app/(marketing)/ai-video-generator/page.tsx',
      'app/video-types/ai-video-generator/page.tsx',
    ],
    dashboardRoute: '/dashboard/ai-video-generator'
  },
  {
    id: 'aiVideoPolisher',
    name: 'AI YouTube Video Polisher',
    category: '16:9 Cinema',
    primaryKeyword: 'AI YouTube video polisher',
    preferredRoute: '/ai-video-polisher',
    candidateFiles: [
      'app/ai-video-polisher/page.tsx',
      'app/(marketing)/ai-video-polisher/page.tsx',
      'app/video-types/ai-video-polisher/page.tsx',
    ],
    dashboardRoute: '/dashboard/ai-video-polisher'
  },
  {
    id: 'aiShortsPolisher',
    name: 'AI Shorts Polisher',
    category: '9:16 Shorts',
    primaryKeyword: 'AI shorts polisher',
    preferredRoute: '/ai-shorts-polisher',
    candidateFiles: [
      'app/ai-shorts-polisher/page.tsx',
      'app/(marketing)/ai-shorts-polisher/page.tsx',
      'app/video-types/ai-shorts-polisher/page.tsx',
    ],
    dashboardRoute: '/dashboard/ai-shorts-polisher'
  },
  {
    id: 'facelessVideo',
    name: 'Faceless Video Generator',
    category: '16:9 Cinema',
    primaryKeyword: 'faceless video generator',
    preferredRoute: '/faceless-video',
    candidateFiles: [
      'app/faceless-video/page.tsx',
      'app/(marketing)/faceless-video/page.tsx',
      'app/video-types/faceless-video/page.tsx',
    ],
    dashboardRoute: '/dashboard/faceless-video'
  },
  {
    id: 'facelessShorts',
    name: 'Faceless Shorts Generator',
    category: '9:16 Shorts',
    primaryKeyword: 'faceless shorts generator',
    preferredRoute: '/faceless-shorts',
    candidateFiles: [
      'app/faceless-shorts/page.tsx',
      'app/(marketing)/faceless-shorts/page.tsx',
      'app/video-types/faceless-shorts/page.tsx',
    ],
    dashboardRoute: '/dashboard/faceless-shorts'
  },
  {
    id: 'bookSummary',
    name: 'Book Summary Video Generator',
    category: '16:9 Cinema',
    primaryKeyword: 'book summary video generator',
    preferredRoute: '/book-summary',
    candidateFiles: [
      'app/book-summary/page.tsx',
      'app/(marketing)/book-summary/page.tsx',
      'app/video-types/book-summary/page.tsx',
    ],
    dashboardRoute: '/dashboard/book-summary'
  },
  {
    id: 'imageToVideoAi',
    name: 'Image to Video AI',
    category: '16:9 Cinema',
    primaryKeyword: 'image to video AI',
    preferredRoute: '/image-to-video-ai',
    candidateFiles: [
      'app/image-to-video-ai/page.tsx',
      'app/(marketing)/image-to-video-ai/page.tsx',
      'app/tools/image-to-video-ai/page.tsx',
      'app/video-types/image-to-video-ai/page.tsx',
    ],
    dashboardRoute: '/dashboard/image-to-video'
  },
  {
    id: 'youtubeSubtitleGenerator',
    name: 'YouTube Subtitles Generator',
    category: '16:9 Cinema',
    primaryKeyword: 'YouTube subtitles generator',
    preferredRoute: '/youtube-subtitles-generator',
    candidateFiles: [
      'app/youtube-subtitles-generator/page.tsx',
      'app/youtube-subtitles/page.tsx',
      'app/(marketing)/youtube-subtitles/page.tsx',
      'app/video-types/youtube-subtitle-generator/page.tsx',
    ],
    dashboardRoute: '/dashboard/youtube-subtitles'
  },
  {
    id: 'whiteboardVideo',
    name: 'Whiteboard Animation Maker',
    category: '9:16 Shorts',
    primaryKeyword: 'whiteboard animation maker',
    preferredRoute: '/whiteboard-video',
    candidateFiles: [
      'app/whiteboard-video/page.tsx',
      'app/(marketing)/whiteboard-video/page.tsx',
      'app/video-types/whiteboard-video/page.tsx',
    ],
    dashboardRoute: '/dashboard/whiteboard-video'
  },
  {
    id: 'compare',
    name: 'Compare Explainer Generator',
    category: '9:16 Shorts',
    primaryKeyword: 'compare explainer video generator',
    preferredRoute: '/compare-explainer',
    candidateFiles: [
      'app/compare-explainer/page.tsx',
      'app/(marketing)/compare-explainer/page.tsx',
      'app/video-types/compare-explainer/page.tsx',
    ],
    dashboardRoute: '/dashboard/compare-explainer'
  },
  {
    id: 'longVideoClips',
    name: 'Long Video to Clips Generator',
    category: '9:16 Shorts',
    primaryKeyword: 'long video to clips generator',
    preferredRoute: '/long-video-clips',
    candidateFiles: [
      'app/long-video-clips/page.tsx',
      'app/(marketing)/long-video-clips/page.tsx',
      'app/video-types/long-video-clips/page.tsx',
    ],
    dashboardRoute: '/dashboard/long-video-clips'
  },
  {
    id: 'longVideoPromo',
    name: 'Long Video Promo Generator',
    category: '9:16 Shorts',
    primaryKeyword: 'long video promo generator',
    preferredRoute: '/long-video-promo',
    candidateFiles: [
      'app/long-video-promo/page.tsx',
      'app/(marketing)/long-video-promo/page.tsx',
      'app/video-types/long-video-promo/page.tsx',
    ],
    dashboardRoute: '/dashboard/long-video-promo'
  },
  {
    id: 'splitScreenExplainer',
    name: 'Split Screen Explainer Video',
    category: '9:16 Shorts',
    primaryKeyword: 'split screen explainer video generator',
    preferredRoute: '/split-screen-explainer',
    candidateFiles: [
      'app/split-screen-explainer/page.tsx',
      'app/(marketing)/split-screen-explainer/page.tsx',
      'app/video-types/split-screen-explainer/page.tsx',
    ],
    dashboardRoute: '/dashboard/split-screen-explainer'
  },
  {
    id: 'audioClean',
    name: 'AI Audio Cleaner & Enhancer',
    category: 'Audio Utility',
    primaryKeyword: 'AI audio cleaner',
    preferredRoute: '/ai-audio-cleaner',
    candidateFiles: [
      'app/ai-audio-cleaner/page.tsx',
      'app/(marketing)/ai-audio-cleaner/page.tsx',
      'app/tools/ai-audio-cleaner/page.tsx',
      'app/video-types/ai-audio-cleaner/page.tsx',
    ],
    dashboardRoute: '/dashboard/audio-cleaner'
  },
];

function extractVisibleWords(sourceCode) {
  // Strip import statements
  let text = sourceCode.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, ' ');
  // Strip type definitions
  text = text.replace(/export\s+type\s+[\s\S]*?;/g, ' ');
  text = text.replace(/export\s+interface\s+[\s\S]*?}/g, ' ');
  // Strip comments
  text = text.replace(/\/\*[\s\S]*?\*\//g, ' ');
  text = text.replace(/\/\/.*$/gm, ' ');
  // Strip JSX tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Strip common code syntax tokens
  text = text.replace(/[{}\[\]();=:,]/g, ' ');
  text = text.replace(/className\s*=\s*['"][^'"]*['"]/g, ' ');
  // Split into words
  const words = text.split(/\s+/).filter(w => w.length > 2 && /^[a-zA-Z0-9'-]+$/.test(w));
  return words.length;
}

console.log('Auditing all 15 Video Types Landing Pages...\n');

const auditResults = VIDEO_TYPES.map((vt, index) => {
  let matchedFile = null;
  for (const candidate of vt.candidateFiles) {
    if (fs.existsSync(candidate)) {
      matchedFile = candidate;
      break;
    }
  }

  let wordCount = 0;
  let status = 'MISSING';

  if (matchedFile) {
    const content = fs.readFileSync(matchedFile, 'utf8');
    wordCount = extractVisibleWords(content);
    status = wordCount >= 1000 ? 'COMPLETE (1000+ words)' : `THIN (${wordCount} words)`;
  }

  return {
    index: index + 1,
    name: vt.name,
    category: vt.category,
    route: vt.preferredRoute,
    file: matchedFile || 'NONE',
    wordCount,
    status
  };
});

console.log(JSON.stringify(auditResults, null, 2));

const missing = auditResults.filter(r => r.file === 'NONE');
const thin = auditResults.filter(r => r.file !== 'NONE' && r.wordCount < 1000);
const complete = auditResults.filter(r => r.file !== 'NONE' && r.wordCount >= 1000);

console.log('\n--- AUDIT SUMMARY ---');
console.log(`Total Video Types   : ${auditResults.length}`);
console.log(`Landing Page Exists : ${auditResults.length - missing.length}`);
console.log(`Missing Pages       : ${missing.length}`);
console.log(`Thin Pages (<1000w) : ${thin.length}`);
console.log(`Complete (1000+w)   : ${complete.length}`);

