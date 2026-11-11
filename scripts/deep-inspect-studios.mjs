import fs from 'fs';

const studios = [
  { id: 'ai-video-generator', path: 'components/dashboard/AiVideoGeneratorStudio.tsx' },
  { id: 'ai-video-polisher', path: 'components/dashboard/AiVideoPolisherStudio.tsx' },
  { id: 'ai-shorts-polisher', path: 'components/dashboard/AiShortsPolisherStudio.tsx' },
  { id: 'faceless-video', path: 'components/dashboard/FacelessVideoStudio.tsx' },
  { id: 'faceless-shorts', path: 'components/dashboard/FacelessShortsStudio.tsx' },
  { id: 'book-summary', path: 'components/dashboard/BookSummaryStudio.tsx' },
  { id: 'image-to-video', path: 'components/dashboard/ImageToVideoStudio.tsx' },
  { id: 'youtube-subtitles', path: 'components/dashboard/YoutubeSubtitlesStudio.tsx' },
  { id: 'whiteboard-video', path: 'components/dashboard/WhiteboardStudio.tsx' },
  { id: 'compare-explainer', path: 'components/dashboard/CompareExplainerStudio.tsx' },
  { id: 'long-video-clips', path: 'components/dashboard/LongVideoClipsStudio.tsx' },
  { id: 'long-video-promo', path: 'components/dashboard/LongVideoPromoStudio.tsx' },
  { id: 'split-screen-explainer', path: 'components/dashboard/SplitScreenExplainerStudio.tsx' },
  { id: 'audio-cleaner', path: 'components/dashboard/AudioCleanStudio.tsx' },
];

studios.forEach(s => {
  const content = fs.readFileSync(s.path, 'utf8');
  console.log(`\n================== ${s.id} (${s.path}) ==================`);
  
  // Find step definitions
  const stepsMatch = content.match(/_STEPS = \[([\s\S]*?)\];/);
  if (stepsMatch) {
    console.log('STEPS:', stepsMatch[1].replace(/\s+/g, ' ').slice(0, 200));
  }
  
  // Find style/mode presets
  const presetsMatch = content.match(/const [A-Z_]+_STYLES = \[([\s\S]*?)\];/);
  if (presetsMatch) {
    console.log('STYLES:', presetsMatch[1].replace(/\s+/g, ' ').slice(0, 300));
  }

  // Check for input fields
  const inputs = (content.match(/<input[^>]*>/g) || []).length;
  const textareas = (content.match(/<textarea[^>]*>/g) || []).length;
  const selects = (content.match(/<select[^>]*>/g) || []).length;
  const buttons = (content.match(/<button[^>]*>/g) || []).length;
  console.log(`Controls: ${inputs} inputs, ${textareas} textareas, ${selects} selects, ${buttons} buttons`);
});
